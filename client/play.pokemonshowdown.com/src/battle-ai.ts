/**
 * Battle AI heuristics and training support.
 *
 * This file intentionally keeps the AI logic in one place so it can be
 * consumed by both the browser UI and the standalone training script.
 *
 * @license AGPLv3
 */

type AITeamMember = PokemonSet & {
	abilityOptions?: string[];
	itemRevealed?: boolean;
	movesRevealed?: string[];
};

type AIRole = 'player' | 'opponent';

type AIKnowledgeEntry = {
	species: string;
	abilityOptions: string[];
	item?: string;
	itemRevealed: boolean;
	movesRevealed: string[];
	types: string[];
	speedRange: {min: number, max: number};
};

type AIScoredOption = {
	kind: 'move' | 'switch';
	name: string;
	score: number;
	reasons: string[];
};

type AIOpeningReport = {
	lead: string;
	options: AIScoredOption[];
	switches: AIScoredOption[];
};

type AIMatchupReport = {
	format: string;
	playerTeam: string;
	aiTeam: string;
	generatedAt: string;
	bestPlayerLead: AIOpeningReport | null;
	bestAILead: AIOpeningReport | null;
	teamPreviewNotes: string[];
};

type AITrainingStats = {
	filesProcessed: number;
	battlesProcessed: number;
	moveUses: {[move: string]: number};
	switchUses: {[species: string]: number};
	leadUses: {[species: string]: number};
	itemReveals: {[item: string]: number};
	abilityReveals: {[ability: string]: number};
};

type AITrainingResult = {
	stats: AITrainingStats;
	notes: string[];
};

type AIChallengeSelection = {
	format: string;
	playerTeamKey: string;
	aiTeamKey: string;
};

const battleAIToID = (text: string) => {
	return ('' + (text || '')).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
};

class BattleAI {
	static readonly STORAGE_KEY = 'showdown_ai_challenge';
	static readonly TRAINING_STORAGE_KEY = 'showdown_ai_training_stats';
	static readonly MIN_THINK_MS = 1500;
	static readonly MAX_THINK_MS = 30000;

	static getChallengeSelection(): AIChallengeSelection | null {
		const storage = BattleAI.getStorage();
		if (!storage) return null;
		const raw = storage.getItem(BattleAI.STORAGE_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

	static saveChallengeSelection(selection: AIChallengeSelection) {
		const storage = BattleAI.getStorage();
		if (!storage) return;
		storage.setItem(BattleAI.STORAGE_KEY, JSON.stringify(selection));
	}

	static getTrainingStats(): AITrainingStats {
		const storage = BattleAI.getStorage();
		if (!storage) return BattleAI.emptyTrainingStats();
		const raw = storage.getItem(BattleAI.TRAINING_STORAGE_KEY);
		if (!raw) return BattleAI.emptyTrainingStats();
		try {
			return BattleAI.mergeTrainingStats(BattleAI.emptyTrainingStats(), JSON.parse(raw));
		} catch {
			return BattleAI.emptyTrainingStats();
		}
	}

	static saveTrainingStats(stats: AITrainingStats) {
		const storage = BattleAI.getStorage();
		if (!storage) return;
		storage.setItem(BattleAI.TRAINING_STORAGE_KEY, JSON.stringify(stats));
	}

	static emptyTrainingStats(): AITrainingStats {
		return {
			filesProcessed: 0,
			battlesProcessed: 0,
			moveUses: {},
			switchUses: {},
			leadUses: {},
			itemReveals: {},
			abilityReveals: {},
		};
	}

	static mergeTrainingStats(base: AITrainingStats, update: Partial<AITrainingStats>): AITrainingStats {
		const merged = {...base};
		merged.filesProcessed = Number(update.filesProcessed || 0) + Number(base.filesProcessed || 0);
		merged.battlesProcessed = Number(update.battlesProcessed || 0) + Number(base.battlesProcessed || 0);
		for (const key of ['moveUses', 'switchUses', 'leadUses', 'itemReveals', 'abilityReveals'] as const) {
			const target = {...(base[key] || {})};
			for (const entry in (update[key] || {})) {
				target[entry] = (target[entry] || 0) + Number((update[key] as {[k: string]: number})[entry] || 0);
			}
			(merged as any)[key] = target;
		}
		return merged;
	}

	static analyzeTeamMatchup(format: string, playerTeam: Team | null | undefined, aiTeam: Team | null | undefined): AIMatchupReport {
		const playerSets = BattleAI.unpackTeam(playerTeam);
		const aiSets = BattleAI.unpackTeam(aiTeam);
		const playerKnowledge = playerSets.map(set => BattleAI.describeKnownPokemon(set, 'player'));
		const aiKnowledge = aiSets.map(set => BattleAI.describeKnownPokemon(set, 'opponent'));

		const report: AIMatchupReport = {
			format,
			playerTeam: playerTeam?.name || 'Unknown team',
			aiTeam: aiTeam?.name || 'Unknown team',
			generatedAt: new Date().toISOString(),
			bestPlayerLead: null,
			bestAILead: null,
			teamPreviewNotes: [],
		};
		if (!playerKnowledge.length || !aiKnowledge.length) {
			report.teamPreviewNotes.push('Both teams need at least one Pokémon before the AI can evaluate a challenge.');
			return report;
		}

		report.bestPlayerLead = BattleAI.chooseLead(playerKnowledge, aiKnowledge);
		report.bestAILead = BattleAI.chooseLead(aiKnowledge, playerKnowledge);
		report.teamPreviewNotes = BattleAI.buildPreviewNotes(playerKnowledge, aiKnowledge);
		return report;
	}

	static chooseAction(options: AIScoredOption[], minThinkMs: number = BattleAI.MIN_THINK_MS) {
		const sorted = [...options].sort((a, b) => b.score - a.score);
		const delay = Math.max(BattleAI.MIN_THINK_MS, Math.min(BattleAI.MAX_THINK_MS, minThinkMs));
		return {
			choice: sorted[0] || null,
			considered: sorted,
			thinkTimeMs: delay,
		};
	}

	static chooseLead(team: AIKnowledgeEntry[], foeTeam: AIKnowledgeEntry[]): AIOpeningReport | null {
		let best: AIOpeningReport | null = null;
		for (const candidate of team) {
			const options = BattleAI.scoreMoves(candidate, foeTeam[0], foeTeam);
			const switches = BattleAI.scoreSwitches(team, candidate, foeTeam[0], foeTeam).slice(0, 3);
			const score = (options[0]?.score || 0) + (switches[0]?.score || 0);
			if (!best || score > ((best.options[0]?.score || 0) + (best.switches[0]?.score || 0))) {
				best = {
					lead: candidate.species,
					options: options.slice(0, 3),
					switches,
				};
			}
		}
		return best;
	}

	static buildPreviewNotes(team: AIKnowledgeEntry[], foeTeam: AIKnowledgeEntry[]) {
		const notes: string[] = [];
		const fastThreats = foeTeam
			.filter(entry => entry.speedRange.max >= 300)
			.map(entry => entry.species);
		if (fastThreats.length) {
			notes.push(`Fast opposing threats to respect: ${fastThreats.join(', ')}.`);
		}
		const strongStab = team
			.filter(entry => BattleAI.bestSTABMultiplier(entry, foeTeam) >= 2)
			.map(entry => entry.species);
		if (strongStab.length) {
			notes.push(`The AI has strong super-effective STAB pressure with: ${strongStab.join(', ')}.`);
		}
		const safePivots = team
			.filter(entry => BattleAI.defensiveValue(entry, foeTeam[0]) >= 2)
			.map(entry => entry.species);
		if (safePivots.length) {
			notes.push(`Likely early pivot options: ${safePivots.join(', ')}.`);
		}
		if (!notes.length) {
			notes.push('No obvious preview edge was found, so the AI should lean on information gathering and conservative switching.');
		}
		return notes;
	}

	static describeKnownPokemon(set: AITeamMember, role: AIRole): AIKnowledgeEntry {
		const dex = BattleAI.requireDex();
		const species = dex.species.get(set.species || set.name || '');
		const types = [...(species.types || [])];
		const abilities = Object.values(species.abilities || {}).filter(Boolean) as string[];
		const speedRange = BattleAI.estimateSpeedRange(set, species.baseStats?.spe || 1, role);
		return {
			species: species.name || set.species,
			abilityOptions: abilities,
			item: set.item,
			itemRevealed: !!set.item && role === 'player',
			movesRevealed: [...(set.moves || [])],
			types,
			speedRange,
		};
	}

	static scoreMoves(user: AIKnowledgeEntry, target: AIKnowledgeEntry, foeTeam: AIKnowledgeEntry[]): AIScoredOption[] {
		const dex = BattleAI.requireDex();
		const options: AIScoredOption[] = [];
		const seenMoves = user.movesRevealed.length ? user.movesRevealed : BattleAI.defaultCoverageMoves(user);
		for (const moveName of seenMoves) {
			const move = dex.moves.get(moveName);
			if (!move.exists) continue;
			let score = 0;
			const reasons = [] as string[];
			const effectiveness = BattleAI.typeModifier(move.type, target.types);
			if (effectiveness > 1) {
				score += 3 * effectiveness;
				reasons.push(`${move.type} is super effective into ${target.species}.`);
			} else if (effectiveness < 1) {
				score -= 2;
				reasons.push(`${move.type} is resisted by ${target.species}.`);
			}
			if (user.types.includes(move.type)) {
				score += 1.5;
				reasons.push('Gets STAB.');
			}
			if (move.basePower) {
				score += Math.min(move.basePower / 40, 3);
			}
			if (move.category === 'Status') {
				score += BattleAI.statusMoveValue(move.id, target, foeTeam);
				if (!reasons.length) reasons.push('Status move can improve board position or gather info.');
			}
			const trainingWeight = BattleAI.getTrainingStats().moveUses[move.id] || 0;
			if (trainingWeight) {
				score += Math.min(trainingWeight / 100, 1.5);
				reasons.push('Prior battle logs show this move appears in successful sequences often enough to matter.');
			}
			options.push({kind: 'move', name: move.name, score, reasons});
		}
		return options.sort((a, b) => b.score - a.score);
	}

	static scoreSwitches(team: AIKnowledgeEntry[], active: AIKnowledgeEntry, target: AIKnowledgeEntry, foeTeam: AIKnowledgeEntry[]): AIScoredOption[] {
		return team
			.filter(entry => entry.species !== active.species)
			.map(entry => {
				let score = BattleAI.defensiveValue(entry, target) + BattleAI.bestSTABMultiplier(entry, foeTeam);
				const reasons = [] as string[];
				if (BattleAI.defensiveValue(entry, target) >= 2) {
					reasons.push(`${entry.species} switches into ${target.species} more comfortably than ${active.species}.`);
				}
				if (BattleAI.bestSTABMultiplier(entry, foeTeam) >= 2) {
					reasons.push(`${entry.species} threatens immediate super-effective pressure after the switch.`);
				}
				return {kind: 'switch' as const, name: entry.species, score, reasons};
			})
			.sort((a, b) => b.score - a.score);
	}

	static bestSTABMultiplier(user: AIKnowledgeEntry, foeTeam: AIKnowledgeEntry[]) {
		let best = 0;
		for (const type of user.types) {
			for (const foe of foeTeam) {
				best = Math.max(best, BattleAI.typeModifier(type, foe.types));
			}
		}
		return best;
	}

	static defensiveValue(user: AIKnowledgeEntry, foe: AIKnowledgeEntry) {
		let best = 0;
		for (const type of foe.types) {
			const modifier = BattleAI.typeModifier(type, user.types);
			if (modifier <= 0.5) best += 1;
			if (modifier === 0) best += 2;
		}
		return best;
	}

	static statusMoveValue(moveid: ID, target: AIKnowledgeEntry, foeTeam: AIKnowledgeEntry[]) {
		switch (moveid) {
		case 'stealthrock':
		case 'spikes':
			return foeTeam.length >= 3 ? 2 : 1;
		case 'toxic':
		case 'willowisp':
			return target.speedRange.max >= 250 ? 1.5 : 1;
		case 'recover':
		case 'roost':
		case 'slackoff':
			return 1.5;
		case 'uturn':
		case 'voltswitch':
		case 'flipturn':
			return 2;
		default:
			return 0.75;
		}
	}

	static defaultCoverageMoves(user: AIKnowledgeEntry) {
		return user.types;
	}

	static estimateSpeedRange(set: PokemonSet, baseSpeed: number, role: AIRole) {
		const level = set.level || 100;
		const iv = set.ivs?.spe ?? 31;
		const ev = set.evs?.spe ?? (role === 'player' ? 84 : 0);
		const neutral = Math.floor(((2 * baseSpeed + iv + Math.floor(ev / 4)) * level) / 100) + 5;
		const min = Math.max(1, Math.floor(neutral * 0.9));
		let max = Math.floor((((2 * baseSpeed + 31 + Math.floor(252 / 4)) * level) / 100) + 5);
		max = Math.floor(max * 1.1);
		if (role === 'opponent') max = Math.floor(max * 1.5);
		return {min, max};
	}

	static typeModifier(moveType: string, targetTypes: string[]) {
		const dex = BattleAI.requireDex();
		let modifier = 1;
		for (const typeName of targetTypes) {
			const typeData = dex.types.get(typeName);
			const effect = typeData.damageTaken?.[moveType] || 0;
			if (effect === 1) modifier *= 2;
			if (effect === 2) modifier *= 0.5;
			if (effect === 3) modifier *= 0;
		}
		return modifier;
	}

	static unpackTeam(team: (Team & {team?: string}) | null | undefined): AITeamMember[] {
		if (!team) return [];
		if (team.packedTeam && typeof PSTeambuilder !== 'undefined') {
			return PSTeambuilder.unpackTeam(team.packedTeam) as AITeamMember[];
		}
		if (team.team && typeof Storage !== 'undefined' && Storage.unpackTeam) {
			return Storage.unpackTeam(team.team) as AITeamMember[];
		}
		return [];
	}

	static requireDex() {
		const root = (typeof window !== 'undefined' ? window : globalThis) as {Dex?: typeof Dex};
		if (!root.Dex) throw new Error('Dex is required for BattleAI analysis.');
		return root.Dex;
	}

	static getStorage() {
		const root = (typeof window !== 'undefined' ? window : globalThis) as {localStorage?: Storage};
		return root.localStorage || null;
	}
}

class BattleAITrainingProgram {
	trainFromFiles(fileEntries: Array<{filename: string, contents: string}>): AITrainingResult {
		let aggregate = BattleAI.emptyTrainingStats();
		const notes: string[] = [];
		for (const file of fileEntries) {
			aggregate.filesProcessed++;
			const result = this.trainFromHTML(file.contents);
			aggregate = BattleAI.mergeTrainingStats(aggregate, result.stats);
			if (result.notes.length) notes.push(`${file.filename}: ${result.notes.join(' ')}`);
		}
		return {stats: aggregate, notes};
	}

	trainFromHTML(html: string): AITrainingResult {
		const stats = BattleAI.emptyTrainingStats();
		const notes: string[] = [];
		const battleLogs = this.extractBattleLogs(html);
		if (!battleLogs.length) {
			notes.push('No replay log lines were found in this file.');
			return {stats, notes};
		}
		for (const battleLog of battleLogs) {
			stats.battlesProcessed++;
			const seenLeads = new Set<string>();
			for (const rawLine of battleLog.split('\n')) {
				const line = rawLine.trim();
				if (!line.startsWith('|')) continue;
				const parts = line.split('|');
				switch (parts[1]) {
				case 'move': {
					const move = battleAIToID(parts[3] || '');
					if (move) stats.moveUses[move] = (stats.moveUses[move] || 0) + 1;
					break;
				}
				case 'switch':
				case 'drag': {
					const ident = parts[2] || '';
					const species = (parts[3] || '').split(',')[0].trim();
					const speciesId = battleAIToID(species);
					if (speciesId) stats.switchUses[speciesId] = (stats.switchUses[speciesId] || 0) + 1;
					if (ident && !seenLeads.has(ident)) {
						seenLeads.add(ident);
						stats.leadUses[speciesId] = (stats.leadUses[speciesId] || 0) + 1;
					}
					break;
				}
				case '-item': {
					const item = battleAIToID((parts[3] || '').replace('item: ', ''));
					if (item) stats.itemReveals[item] = (stats.itemReveals[item] || 0) + 1;
					break;
				}
				case '-ability':
				case '-activate': {
					const ability = battleAIToID((parts[3] || '').replace('ability: ', ''));
					if (ability) stats.abilityReveals[ability] = (stats.abilityReveals[ability] || 0) + 1;
					break;
				}
				}
			}
		}
		return {stats, notes};
	}

	extractBattleLogs(html: string) {
		const logs: string[] = [];
		const textareaRegex = /<script[^>]*class=["']?battle-log-data["']?[^>]*>([\s\S]*?)<\/script>/gi;
		let match: RegExpExecArray | null;
		while ((match = textareaRegex.exec(html))) {
			logs.push(this.decodeHTML(match[1]));
		}
		if (logs.length) return logs;

		const inlineLogRegex = /\|init\|battle[\s\S]*?(?=<\/script>|<\/body>|$)/g;
		while ((match = inlineLogRegex.exec(html))) {
			logs.push(this.decodeHTML(match[0]));
		}
		return logs;
	}

	decodeHTML(html: string) {
		return html
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&amp;/g, '&')
			.replace(/&#39;/g, "'")
			.replace(/&quot;/g, '"');
	}
}

const BattleAITools = {
	BattleAI,
	BattleAITrainingProgram,
};

(globalThis as any).BattleAI = BattleAI;
(globalThis as any).BattleAITrainingProgram = BattleAITrainingProgram;
(globalThis as any).BattleAITools = BattleAITools;
