import { FS } from '../../lib';
import { Dex, toID } from '../dex';
import type { PokemonSwitchRequestData } from '../side';

export interface LearnedMoveStats {
	uses: number;
	zeroDamageUses: number;
	immunityUses: number;
	resistedUses: number;
	superEffectiveUses: number;
	koUses: number;
	totalDamageFraction: number;
	abilityImmunities: { [abilityid: string]: number };
}

export interface BattleAIBrainData {
	version: number;
	updatedAt: string;
	battlesProcessed: number;
	moveMatchups: { [speciesid: string]: { [moveid: string]: LearnedMoveStats } };
	revealedAbilities: { [speciesid: string]: { [abilityid: string]: number } };
}

export interface BattleAIReplayTrainingStats {
	battlesProcessed: number;
	moveUses: number;
	newImmunitySamples: number;
	newDamageSamples: number;
}

const BRAIN_PATH = 'config/ai-battle-brain.json';

function emptyMoveStats(): LearnedMoveStats {
	return {
		uses: 0,
		zeroDamageUses: 0,
		immunityUses: 0,
		resistedUses: 0,
		superEffectiveUses: 0,
		koUses: 0,
		totalDamageFraction: 0,
		abilityImmunities: {},
	};
}

function emptyData(): BattleAIBrainData {
	return {
		version: 1,
		updatedAt: new Date(0).toISOString(),
		battlesProcessed: 0,
		moveMatchups: {},
		revealedAbilities: {},
	};
}

type PendingMove = {
	moveid: ID,
	targetIdent: string,
	targetSpeciesid: ID | '',
	usedDamagingMove: boolean,
	beforeHP: number | null,
	dealtDamage: boolean,
};

export class BattleAIBrain {
	static readonly shared = new BattleAIBrain();
	readonly dex = Dex;
	data: BattleAIBrainData;

	constructor() {
		this.data = emptyData();
		this.load();
	}

	load() {
		const raw = FS(BRAIN_PATH).readIfExistsSync();
		if (!raw) return;
		try {
			const parsed = JSON.parse(raw);
			this.data = {
				...emptyData(),
				...parsed,
				moveMatchups: parsed.moveMatchups || {},
				revealedAbilities: parsed.revealedAbilities || {},
			};
		} catch {}
	}

	save() {
		this.data.updatedAt = new Date().toISOString();
		FS(BRAIN_PATH).writeUpdate(() => JSON.stringify(this.data, null, 2), { throttle: 5_000 });
	}

	getMoveStat(speciesid: ID, moveid: ID): LearnedMoveStats | null {
		return this.data.moveMatchups[speciesid]?.[moveid] || null;
	}

	getLikelyAbilities(speciesid: ID): string[] {
		const entries = Object.entries(this.data.revealedAbilities[speciesid] || {});
		entries.sort((a, b) => b[1] - a[1]);
		return entries.map(([ability]) => ability);
	}

	recordRevealedAbility(speciesid: ID, abilityid: ID) {
		if (!speciesid || !abilityid) return;
		if (!this.data.revealedAbilities[speciesid]) this.data.revealedAbilities[speciesid] = {};
		this.data.revealedAbilities[speciesid][abilityid] = (this.data.revealedAbilities[speciesid][abilityid] || 0) + 1;
	}

	recordReplayLog(lines: string[]): BattleAIReplayTrainingStats {
		const stats: BattleAIReplayTrainingStats = {
			battlesProcessed: 0,
			moveUses: 0,
			newImmunitySamples: 0,
			newDamageSamples: 0,
		};
		const identToSpecies = new Map<string, ID>();
		const identToHP = new Map<string, number>();
		let pendingMove: PendingMove | null = null;
		let sawInit = false;

		const ensureMoveStats = (speciesid: ID, moveid: ID) => {
			const speciesStats = this.data.moveMatchups[speciesid] || (this.data.moveMatchups[speciesid] = {});
			return speciesStats[moveid] || (speciesStats[moveid] = emptyMoveStats());
		};
		const finalizePendingMove = () => {
			if (!pendingMove || !pendingMove.usedDamagingMove || !pendingMove.targetSpeciesid) {
				pendingMove = null;
				return;
			}
			if (!pendingMove.dealtDamage) {
				const learned = ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid);
				learned.zeroDamageUses++;
			}
			pendingMove = null;
		};

		for (const rawLine of lines) {
			const line = rawLine.trim();
			if (!line.startsWith('|')) continue;
			const parts = line.split('|');
			switch (parts[1]) {
			case 'init':
				if (parts[2] === 'battle') {
					sawInit = true;
					stats.battlesProcessed++;
					this.data.battlesProcessed++;
				}
				break;
			case 'turn':
			case 'upkeep':
			case 'move':
				if (parts[1] === 'move') {
					finalizePendingMove();
					const moveid = toID(parts[3] || '');
					const targetIdent = parts[4] || '';
					const targetSpeciesid = identToSpecies.get(targetIdent) || '';
					const move = this.dex.moves.get(moveid);
					if (moveid && targetSpeciesid) {
						const learned = ensureMoveStats(targetSpeciesid, moveid);
						learned.uses++;
						stats.moveUses++;
					}
					pendingMove = {
						moveid,
						targetIdent,
						targetSpeciesid,
						usedDamagingMove: !!move.basePower,
						beforeHP: identToHP.get(targetIdent) ?? null,
						dealtDamage: false,
					};
				} else {
					finalizePendingMove();
				}
				break;
			case 'switch':
			case 'drag':
			case 'replace': {
				const ident = parts[2] || '';
				const speciesid = toID((parts[3] || '').split(',')[0]);
				identToSpecies.set(ident, speciesid);
				identToHP.set(ident, this.parseCondition(parts[4] || ''));
				finalizePendingMove();
				break;
			}
			case '-damage': {
				const ident = parts[2] || '';
				const nextHP = this.parseCondition(parts[3] || '');
				const prevHP = identToHP.get(ident);
				identToHP.set(ident, nextHP);
				if (
					pendingMove && ident === pendingMove.targetIdent && pendingMove.targetSpeciesid &&
					prevHP !== undefined && prevHP > nextHP
				) {
					const learned = ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid);
					learned.totalDamageFraction += prevHP - nextHP;
					pendingMove.dealtDamage = true;
					stats.newDamageSamples++;
				}
				break;
			}
			case 'faint':
				if (pendingMove && (parts[2] || '') === pendingMove.targetIdent && pendingMove.targetSpeciesid) {
					ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid).koUses++;
				}
				identToHP.set(parts[2] || '', 0);
				break;
			case '-immune':
				if (pendingMove && (parts[2] || '') === pendingMove.targetIdent && pendingMove.targetSpeciesid) {
					const learned = ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid);
					learned.immunityUses++;
					learned.zeroDamageUses++;
					stats.newImmunitySamples++;
					const from = toID(this.parseFromTag(parts));
					if (from) {
						learned.abilityImmunities[from] = (learned.abilityImmunities[from] || 0) + 1;
						this.recordRevealedAbility(pendingMove.targetSpeciesid, from as ID);
					}
					pendingMove.dealtDamage = true;
				}
				break;
			case '-resisted':
				if (pendingMove && (parts[2] || '') === pendingMove.targetIdent && pendingMove.targetSpeciesid) {
					ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid).resistedUses++;
				}
				break;
			case '-supereffective':
				if (pendingMove && (parts[2] || '') === pendingMove.targetIdent && pendingMove.targetSpeciesid) {
					ensureMoveStats(pendingMove.targetSpeciesid, pendingMove.moveid).superEffectiveUses++;
				}
				break;
			case '-ability': {
				const ident = parts[2] || '';
				const abilityid = toID(parts[3] || '');
				const speciesid = identToSpecies.get(ident);
				if (speciesid && abilityid) this.recordRevealedAbility(speciesid, abilityid);
				break;
			}
			case '-activate': {
				const abilityid = toID(this.parseFromTag(parts));
				const ident = parts[2] || '';
				const speciesid = identToSpecies.get(ident);
				if (speciesid && abilityid) this.recordRevealedAbility(speciesid, abilityid as ID);
				break;
			}
			case 'win':
				finalizePendingMove();
				break;
			}
		}
		finalizePendingMove();
		if (sawInit) this.save();
		return stats;
	}

	parseCondition(condition: string): number {
		if (!condition || condition.endsWith(' fnt')) return 0;
		const hpText = condition.split(' ')[0];
		const [hp, maxhp] = hpText.split('/').map(Number);
		if (!Number.isNaN(hp) && !Number.isNaN(maxhp) && maxhp > 0) return hp / maxhp;
		return 1;
	}

	parseFromTag(parts: string[]): string {
		for (const part of parts) {
			if (!part.startsWith('[from] ')) continue;
			return part.slice('[from] '.length).replace(/^ability: /, '');
		}
		return '';
	}

	extractBattleLogs(html: string): string[] {
		const logs: string[] = [];
		const scriptRegex = /<script[^>]*class=["']?battle-log-data["']?[^>]*>([\s\S]*?)<\/script>/gi;
		let match: RegExpExecArray | null;
		while ((match = scriptRegex.exec(html))) {
			logs.push(this.decodeHTML(match[1]));
		}
		if (logs.length) return logs;
		const inlineLogRegex = /\|init\|battle[\s\S]*?(?=<\/script>|<\/body>|$)/g;
		while ((match = inlineLogRegex.exec(html))) {
			logs.push(this.decodeHTML(match[0]));
		}
		return logs;
	}

	decodeHTML(html: string): string {
		return html
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&amp;/g, '&')
			.replace(/&#39;/g, "'")
			.replace(/&quot;/g, '"');
	}

	getMoveScoreAdjustment(move: Move, target: PokemonSwitchRequestData, knownAbility?: string | null): number {
		const speciesid = toID(target.details.split(',')[0]);
		if (!speciesid) return 0;
		let adjustment = 0;
		const stats = this.getMoveStat(speciesid, move.id);
		const abilityid = toID(knownAbility || target.ability || '');
		if (abilityid && this.moveBlockedByAbility(move, abilityid)) return -25;
		if (stats) {
			if (abilityid && stats.abilityImmunities[abilityid]) return -25;
			if (stats.immunityUses >= 1 && stats.immunityUses / stats.uses >= 0.34) adjustment -= 7;
			if (stats.zeroDamageUses >= 2 && stats.zeroDamageUses / stats.uses >= 0.5) adjustment -= 4;
			if (stats.superEffectiveUses > stats.resistedUses && stats.superEffectiveUses >= 2) adjustment += 1.5;
			if (stats.resistedUses > stats.superEffectiveUses && stats.resistedUses >= 2) adjustment -= 1.5;
			if (stats.uses > 0) adjustment += Math.min(2.5, (stats.totalDamageFraction / stats.uses) * 4);
		}
		if (!abilityid) {
			for (const learnedAbility of this.getLikelyAbilities(speciesid).slice(0, 2)) {
				if (this.moveBlockedByAbility(move, learnedAbility as ID)) {
					adjustment -= 3;
					break;
				}
			}
		}
		return adjustment;
	}

	moveBlockedByAbility(move: Move, abilityid: ID): boolean {
		switch (abilityid) {
		case 'flashfire':
		case 'wellbakedbody':
			return move.type === 'Fire';
		case 'levitate':
		case 'eartheater':
			return move.type === 'Ground';
		case 'lightningrod':
		case 'motordrive':
		case 'voltabsorb':
			return move.type === 'Electric';
		case 'stormdrain':
		case 'waterabsorb':
		case 'dryskin':
			return move.type === 'Water';
		case 'sapsipper':
			return move.type === 'Grass';
		case 'windrider':
			return !!move.flags['wind'];
		case 'soundproof':
			return !!move.flags['sound'];
		case 'bulletproof':
			return !!move.flags['bullet'];
		default:
			return false;
		}
	}
}
