/**
 * Example random player AI.
 *
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import type { ObjectReadWriteStream } from '../../lib/streams';
import { BattlePlayer } from '../battle-stream';
import { Dex, toID } from '../dex';
import { PRNG, type PRNGSeed } from '../prng';
import type { ChoiceRequest, PokemonMoveRequestData, PokemonSwitchRequestData, SideRequestData } from '../side';
import { BattleAIBrain } from './battle-ai-brain';

type AIMoveOption = {
	choice: string,
	move: AnyObject,
	score: number,
	teraScore: number,
};

type AIPokemonSlot = {
	slot: number,
	pokemon: PokemonSwitchRequestData,
	score?: number,
};

export class RandomPlayerAI extends BattlePlayer {
	protected readonly move: number;
	protected readonly mega: number;
	protected readonly prng: PRNG;
	protected readonly dex = Dex;
	protected readonly brain = BattleAIBrain.shared;
	protected currentRequest: ChoiceRequest | null = null;
	protected mySideId: SideID | null = null;
	protected observedAbilities = new Map<string, ID>();
	protected currentBattleMovePressure = new Map<string, { immunities: number, resisted: number }>();
	protected pendingObservedMove: { moveid: ID, userIdent: string, targetIdent: string } | null = null;

	constructor(
		playerStream: ObjectReadWriteStream<string>,
		options: { move?: number, mega?: number, seed?: PRNG | PRNGSeed | null } = {},
		debug = false
	) {
		super(playerStream, debug);
		this.move = options.move || 1.0;
		this.mega = options.mega || 0;
		this.prng = PRNG.get(options.seed);
	}

	override receiveError(error: Error) {
		// If we made an unavailable choice we will receive a followup request to
		// allow us the opportunity to correct our decision.
		if (error.message.startsWith('[Unavailable choice]')) return;
		throw error;
	}

	override receiveLine(line: string) {
		super.receiveLine(line);
		if (!line.startsWith('|')) return;
		const parts = line.split('|');
		switch (parts[1]) {
		case 'move': {
			const userIdent = parts[2] || '';
			if (!this.mySideId || !userIdent.startsWith(this.mySideId)) {
				this.pendingObservedMove = null;
				break;
			}
			this.pendingObservedMove = {
				moveid: toID(parts[3] || ''),
				userIdent,
				targetIdent: parts[4] || '',
			};
			break;
		}
		case '-ability':
		case '-activate': {
			const ident = parts[2] || '';
			const abilityPart = this.parseAbilityFromParts(parts);
			if (ident && abilityPart) this.observedAbilities.set(ident, abilityPart);
			break;
		}
		case '-immune': {
			const targetIdent = parts[2] || '';
			if (this.pendingObservedMove && this.pendingObservedMove.targetIdent === targetIdent) {
				const key = `${targetIdent}:${this.pendingObservedMove.moveid}`;
				const entry = this.currentBattleMovePressure.get(key) || { immunities: 0, resisted: 0 };
				entry.immunities++;
				this.currentBattleMovePressure.set(key, entry);
				const ability = this.parseAbilityFromParts(parts);
				if (ability) this.observedAbilities.set(targetIdent, ability);
			}
			break;
		}
		case '-resisted': {
			const targetIdent = parts[2] || '';
			if (this.pendingObservedMove && this.pendingObservedMove.targetIdent === targetIdent) {
				const key = `${targetIdent}:${this.pendingObservedMove.moveid}`;
				const entry = this.currentBattleMovePressure.get(key) || { immunities: 0, resisted: 0 };
				entry.resisted++;
				this.currentBattleMovePressure.set(key, entry);
			}
			break;
		}
		case 'turn':
		case 'upkeep':
			this.pendingObservedMove = null;
			break;
		}
	}

	protected parseAbilityFromParts(parts: string[]): ID | '' {
		for (let i = 3; i < parts.length; i++) {
			const part = parts[i] || '';
			if (part.startsWith('ability: ')) return toID(part.slice(9));
			if (i === 3 && parts[1] === '-ability') return toID(part);
			if (part.startsWith('[from] ability: ')) return toID(part.slice(16));
		}
		return '';
	}

	override receiveRequest(request: ChoiceRequest) {
		this.currentRequest = request;
		this.mySideId = request.side.id;
		if (request.wait) {
			return;
		}
		if (request.forceSwitch) {
			const pokemon = request.side.pokemon;
			const chosen: number[] = [];
			const choices = request.forceSwitch.map((mustSwitch, i) => {
				if (!mustSwitch) return 'pass';
				const candidates = range(1, pokemon.length).filter(j => (
					pokemon[j - 1] &&
					j > request.forceSwitch.length &&
					!chosen.includes(j) &&
					(!pokemon[j - 1].condition.endsWith(' fnt')) === (!pokemon[i].reviving)
				)).map(slot => ({ slot, pokemon: pokemon[slot - 1] }));
				if (!candidates.length) return 'pass';
				const target = this.chooseSwitch(undefined, candidates, chosen);
				chosen.push(target);
				return `switch ${target}`;
			});
			this.choose(choices.join(', '));
			return;
		}
		if (request.teamPreview) {
			this.choose(this.chooseTeamPreview(request.side.pokemon, request.foe?.pokemon || [], request.maxChosenTeamSize));
			return;
		}
		if (!request.active) return;

		let [canMegaEvo, canUltraBurst, canZMove, canDynamax, canTerastallize] = [true, true, true, true, true];
		const pokemon = request.side.pokemon;
		const chosen: number[] = [];
		const choices = request.active.map((active: PokemonMoveRequestData, i: number) => {
			if (pokemon[i].condition.endsWith(' fnt') || pokemon[i].commanding) return 'pass';

			canMegaEvo = canMegaEvo && !!active.canMegaEvo;
			canUltraBurst = canUltraBurst && !!active.canUltraBurst;
			canZMove = canZMove && !!active.canZMove;
			canDynamax = canDynamax && !!active.canDynamax;
			canTerastallize = canTerastallize && !!active.canTerastallize;

			const useMaxMoves = !!(!active.canDynamax && active.maxMoves);
			const possibleMoves = useMaxMoves ? active.maxMoves!.maxMoves : active.moves;
			let canMove = range(1, possibleMoves.length).filter(j => !possibleMoves[j - 1].disabled).map(j => ({
				slot: j,
				move: possibleMoves[j - 1].move,
				target: possibleMoves[j - 1].target,
				zMove: false,
			}));
			if (canZMove && active.canZMove) {
				canMove.push(...range(1, active.canZMove.length)
					.filter(j => active.canZMove![j - 1])
					.map(j => ({
						slot: j,
						move: active.canZMove![j - 1].move,
						target: active.canZMove![j - 1].target,
						zMove: true,
					})));
			}

			const hasAlly = pokemon.length > 1 && !!pokemon[i ^ 1] && !pokemon[i ^ 1].condition.endsWith(' fnt');
			const filtered = canMove.filter(m => m.target !== 'adjacentAlly' || hasAlly);
			canMove = filtered.length ? filtered : canMove;

			const moveOptions = canMove.map(m => this.buildMoveOption(request, i, pokemon[i], active, m, hasAlly));
			const chosenMove = moveOptions.length ? this.chooseMove(active, moveOptions) : '';
			const bestMove = moveOptions.find(option => option.choice === chosenMove) ||
				moveOptions.sort((a, b) => b.score - a.score)[0] || null;

			const canSwitch = range(1, pokemon.length).filter(j => (
				pokemon[j - 1] &&
				!pokemon[j - 1].active &&
				!chosen.includes(j) &&
				!pokemon[j - 1].condition.endsWith(' fnt')
			));
			const switchChoices = active.trapped ? [] : canSwitch.map(slot => ({ slot, pokemon: pokemon[slot - 1] }));
			const bestSwitch = switchChoices.length ? this.scoreSwitchChoice(pokemon[i], switchChoices)[0] : null;

			if (bestSwitch && this.shouldSwitchOut(request, pokemon[i], bestMove, bestSwitch.pokemon)) {
				chosen.push(bestSwitch.slot);
				return `switch ${bestSwitch.slot}`;
			}

			if (!bestMove) {
				if (bestSwitch) {
					chosen.push(bestSwitch.slot);
					return `switch ${bestSwitch.slot}`;
				}
				throw new Error(`${this.constructor.name} unable to make a move choice for slot ${i + 1}.`);
			}

			let choice = bestMove.choice;
			if (bestMove.choice.endsWith(' zmove')) {
				canZMove = false;
			} else if (canTerastallize && active.canTerastallize && this.shouldTerastallize(request, pokemon[i], bestMove)) {
				canTerastallize = false;
				choice += ' terastallize';
			} else if ((canMegaEvo || canUltraBurst || canDynamax) && this.shouldUseBurstOption(bestMove)) {
				if (canDynamax) {
					canDynamax = false;
					choice += ' dynamax';
				} else if (canMegaEvo) {
					canMegaEvo = false;
					choice += ' mega';
				} else if (canUltraBurst) {
					canUltraBurst = false;
					choice += ' ultra';
				}
			}
			return choice;
		});
		this.choose(choices.join(', '));
	}

	protected chooseTeamPreview(
		team: PokemonSwitchRequestData[],
		foeTeam: PokemonSwitchRequestData[],
		maxChosenTeamSize?: number
	): string {
		const scores = team.map((pokemon, index) => ({
			slot: index + 1,
			score: this.scoreLead(pokemon, foeTeam),
		})).sort((a, b) => b.score - a.score || a.slot - b.slot);
		const chosen = scores.slice(0, maxChosenTeamSize || scores.length).map(entry => entry.slot);
		return `team ${chosen.join(', ')}`;
	}

	protected shouldUseBurstOption(bestMove: AIMoveOption): boolean {
		return bestMove.score >= 9 && this.prng.random() < Math.max(this.mega, 0.35);
	}

	protected shouldTerastallize(
		request: ChoiceRequest,
		pokemon: PokemonSwitchRequestData,
		bestMove: AIMoveOption
	): boolean {
		if (!('active' in request) || !request.active) return false;
		const hpRatio = this.getHPFraction(pokemon.condition);
		if (bestMove.teraScore - bestMove.score >= 2.25) return true;
		if (hpRatio <= 0.35) {
			const foes = this.getActiveFoes(request.foe);
			if (foes.some(foe => (
				this.estimateDefensiveScore(pokemon, foe, request.active[0]?.canTerastallize) >
				this.estimateDefensiveScore(pokemon, foe)
			))) {
				return true;
			}
		}
		return false;
	}

	protected shouldSwitchOut(
		request: ChoiceRequest,
		activePokemon: PokemonSwitchRequestData,
		bestMove: AIMoveOption | null,
		switchPokemon: PokemonSwitchRequestData
	): boolean {
		const foes = this.getActiveFoes(request.foe);
		if (!foes.length) return false;
		const currentPressure = foes.reduce((sum, foe) => sum + this.estimateDefensiveScore(activePokemon, foe), 0);
		const switchPressure = foes.reduce((sum, foe) => sum + this.estimateDefensiveScore(switchPokemon, foe), 0);
		const currentOffense = bestMove?.score || 0;
		const switchOffense = foes.reduce((sum, foe) => sum + this.scoreKnownMoves(switchPokemon, foe).score, 0) / foes.length;
		const hpRatio = this.getHPFraction(activePokemon.condition);
		if (currentPressure <= -4 && switchPressure >= currentPressure + 2) return true;
		if (hpRatio <= 0.35 && switchPressure > currentPressure && switchOffense >= currentOffense - 1) return true;
		return switchOffense >= currentOffense + 3 && switchPressure >= currentPressure;
	}

	protected chooseMove(
		active: PokemonMoveRequestData,
		moves: { choice: string, move: AnyObject, score?: number }[]
	): string {
		return moves.sort((a, b) => (b.score || 0) - (a.score || 0))[0]?.choice || this.prng.sample(moves).choice;
	}

	protected chooseSwitch(
		active: PokemonSwitchRequestData | undefined,
		switches: { slot: number, pokemon: PokemonSwitchRequestData }[],
		chosen: number[] = []
	): number {
		const scored = this.scoreSwitchChoice(active, switches, chosen);
		return scored[0]?.slot || this.prng.sample(switches).slot;
	}

	protected scoreSwitchChoice(
		active: PokemonSwitchRequestData | undefined,
		switches: { slot: number, pokemon: PokemonSwitchRequestData }[],
		chosen: number[] = []
	): AIPokemonSlot[] {
		const foes = this.getActiveFoes(this.currentRequest?.foe);
		return switches
			.filter(entry => !chosen.includes(entry.slot))
			.map(entry => ({
				...entry,
				score: foes.length ? foes.reduce((sum, foe) => sum + this.scoreMatchup(entry.pokemon, foe), 0) / foes.length : 0,
			}))
			.sort((a, b) => (b.score || 0) - (a.score || 0) || a.slot - b.slot);
	}

	protected buildMoveOption(
		request: ChoiceRequest,
		pokemonIndex: number,
		pokemon: PokemonSwitchRequestData,
		active: PokemonMoveRequestData,
		moveData: { slot: number, move: string, target?: string, zMove: boolean },
		hasAlly: boolean
	): AIMoveOption {
		let choice = `move ${moveData.slot}`;
		if ('active' in request && request.active && request.active.length > 1) {
			if ([`normal`, `any`, `adjacentFoe`].includes(moveData.target || '')) {
				choice += ` ${this.chooseTarget(request, pokemonIndex, moveData.target || 'normal')}`;
			}
			if (moveData.target === 'adjacentAlly') choice += ` -${(pokemonIndex ^ 1) + 1}`;
			if (moveData.target === 'adjacentAllyOrSelf') {
				choice += hasAlly ? ` -${(pokemonIndex ^ 1) + 1}` : ` -${pokemonIndex + 1}`;
			}
		}
		if (moveData.zMove) choice += ' zmove';
		const targets = this.getMoveTargets(request, pokemonIndex, moveData.target || 'normal');
		const score = this.scoreMoveChoice(pokemon, active, moveData.move, targets, undefined, moveData.zMove);
		const teraScore = active.canTerastallize ?
			this.scoreMoveChoice(pokemon, active, moveData.move, targets, active.canTerastallize, moveData.zMove) : score;
		return { choice, move: moveData, score, teraScore };
	}

	protected chooseTarget(request: ChoiceRequest, pokemonIndex: number, targetType: string): number {
		const foes = this.getActiveFoes(request.foe);
		if (!foes.length) return 1;
		let bestTarget = 1;
		let bestScore = -Infinity;
		for (let i = 0; i < foes.length; i++) {
			const foe = foes[i];
			const score = this.scoreKnownMoves(request.side.pokemon[pokemonIndex], foe).score;
			if (score > bestScore) {
				bestScore = score;
				bestTarget = i + 1;
			}
		}
		return bestTarget;
	}

	protected getMoveTargets(request: ChoiceRequest, pokemonIndex: number, targetType: string): PokemonSwitchRequestData[] {
		if (targetType === 'self' || targetType === 'adjacentAlly' || targetType === 'adjacentAllyOrSelf') {
			return [request.side.pokemon[pokemonIndex]];
		}
		const foes = this.getActiveFoes(request.foe);
		return foes.length ? foes : [request.side.pokemon[pokemonIndex]];
	}

	protected scoreMoveChoice(
		user: PokemonSwitchRequestData,
		active: PokemonMoveRequestData,
		moveName: string,
		targets: PokemonSwitchRequestData[],
		teraType?: string,
		zMove = false
	): number {
		const move = this.dex.moves.get(moveName);
		if (!move.exists) return -100;
		if (!targets.length) return 0;
		const effectiveTypes = teraType && !user.terastallized ? [teraType] : this.getTypes(user);
		let score = 0;
		for (const target of targets) {
			score += this.scoreSingleTargetMove(move, user, effectiveTypes, target, teraType, zMove);
		}
		score /= targets.length;
		if (active.maybeLocked && move.category === 'Status') score -= 1.5;
		return score;
	}

	protected scoreSingleTargetMove(
		move: AnyObject,
		user: PokemonSwitchRequestData,
		userTypes: string[],
		target: PokemonSwitchRequestData,
		teraType?: string,
		zMove = false
	): number {
		const targetTypes = this.getTypes(target);
		let moveType = move.type;
		if (move.id === 'terablast' && teraType) moveType = teraType;
		const immune = !this.dex.getImmunity(moveType, targetTypes);
		const effectiveness = immune ? -3 : this.dex.getEffectiveness(moveType, targetTypes);
		const stab = userTypes.includes(moveType) ? (teraType && teraType === moveType ? 2.25 : 1.5) : 1;
		const estimatedBasePower = this.estimateMoveBasePower(move, user, target, teraType);
		const basePower = zMove ? Math.max(estimatedBasePower || 1, 140) : estimatedBasePower;
		let score = (basePower / 22) * stab;
		score += effectiveness * 2.75;
		score += this.getImmediateBattleAdjustment(move, target);
		score += this.brain.getMoveScoreAdjustment(move, target, this.getKnownAbility(target));
		score += ((move.accuracy === true ? 100 : move.accuracy || 100) - 100) / 40;
		if (move.priority > 0) score += 0.75 + move.priority * 0.5;
		if (move.flags?.heal) score += 1.2;
		if (move.selfSwitch) score += 1.5;
		if (move.category === 'Status') score += this.scoreStatusMove(move, target);
		if (move.volatileStatus === 'flinch') score += 0.5;
		if (move.status === 'brn' || move.status === 'tox' || move.status === 'par') score += 1.25;
		if (move.id === 'protect' || move.id === 'detect') score -= 1.25;
		return score;
	}

	protected getKnownAbility(target: PokemonSwitchRequestData): string | null {
		return this.observedAbilities.get(target.ident) || target.ability || null;
	}

	protected getImmediateBattleAdjustment(move: AnyObject, target: PokemonSwitchRequestData): number {
		const pressure = this.currentBattleMovePressure.get(`${target.ident}:${move.id}`);
		if (!pressure) return 0;
		let adjustment = 0;
		if (pressure.immunities) adjustment -= 20 * pressure.immunities;
		if (pressure.resisted >= 2) adjustment -= 4;
		return adjustment;
	}

	protected estimateMoveBasePower(
		move: AnyObject,
		user: PokemonSwitchRequestData,
		target: PokemonSwitchRequestData,
		teraType?: string
	): number {
		switch (move.id) {
		case 'eruption':
		case 'waterspout':
			return 150 * this.getHPFraction(user.condition);
		case 'heavyslam':
		case 'heatcrash': {
			const userWeight = this.getWeightKg(user);
			const targetWeight = this.getWeightKg(target);
			if (!userWeight || !targetWeight) return move.basePower || 60;
			const ratio = userWeight / targetWeight;
			if (ratio >= 5) return 120;
			if (ratio >= 4) return 100;
			if (ratio >= 3) return 80;
			if (ratio >= 2) return 60;
			return 40;
		}
		case 'grassknot':
		case 'lowkick': {
			const targetWeight = this.getWeightKg(target);
			if (targetWeight >= 200) return 120;
			if (targetWeight >= 100) return 100;
			if (targetWeight >= 50) return 80;
			if (targetWeight >= 25) return 60;
			if (targetWeight >= 10) return 40;
			return 20;
		}
		case 'terablast':
			return teraType ? 80 : move.basePower || 80;
		default:
			return move.basePower || 0;
		}
	}

	protected getWeightKg(pokemon: PokemonSwitchRequestData): number {
		const species = this.dex.species.get(pokemon.details.split(',')[0]);
		return species.weightkg || 0;
	}

	protected scoreStatusMove(move: AnyObject, target: PokemonSwitchRequestData): number {
		switch (move.id) {
		case 'stealthrock':
		case 'spikes':
		case 'toxicspikes':
			return 3;
		case 'swordsdance':
		case 'nastyplot':
		case 'dragondance':
		case 'quiverdance':
			return 3.5;
		case 'recover':
		case 'roost':
		case 'slackoff':
		case 'softboiled':
		case 'morningsun':
			return 2.5;
		case 'toxic':
		case 'willowisp':
			return this.getHPFraction(target.condition) > 0.45 ? 2.5 : 1;
		case 'thunderwave':
			return 2.25;
		default:
			return 1.25;
		}
	}

	protected scoreLead(pokemon: PokemonSwitchRequestData, foeTeam: PokemonSwitchRequestData[]): number {
		if (!foeTeam.length) return this.scoreKnownMoves(pokemon, pokemon).score;
		const matchupScore = foeTeam.reduce((sum, foe) => sum + this.scoreMatchup(pokemon, foe), 0) / foeTeam.length;
		const offensiveCeiling = foeTeam.reduce(
			(best, foe) => Math.max(best, this.scoreKnownMoves(pokemon, foe).score),
			-Infinity
		);
		return matchupScore + offensiveCeiling * 0.35 + this.getSpeedTier(pokemon) * 0.02;
	}

	protected scoreMatchup(pokemon: PokemonSwitchRequestData, foe: PokemonSwitchRequestData): number {
		const attack = this.scoreKnownMoves(pokemon, foe).score;
		const defense = this.estimateDefensiveScore(pokemon, foe);
		return attack + defense + this.getSpeedAdvantage(pokemon, foe) * 0.5;
	}

	protected scoreKnownMoves(
		pokemon: PokemonSwitchRequestData,
		foe: PokemonSwitchRequestData
	): { score: number, move: string | null } {
		let bestScore = -Infinity;
		let bestMove: string | null = null;
		for (const moveid of pokemon.moves || []) {
			const move = this.dex.moves.get(moveid);
			if (!move.exists) continue;
			const score = this.scoreSingleTargetMove(move, pokemon, this.getTypes(pokemon), foe);
			if (score > bestScore) {
				bestScore = score;
				bestMove = move.name;
			}
		}
		if (!bestMove) {
			const fallback = this.getTypes(pokemon)[0] || 'Normal';
			const effectiveness = this.dex.getEffectiveness(fallback, this.getTypes(foe));
			bestScore = effectiveness * 2 + 2;
		}
		return { score: bestScore, move: bestMove };
	}

	protected estimateDefensiveScore(
		pokemon: PokemonSwitchRequestData,
		foe: PokemonSwitchRequestData,
		teraType?: string
	): number {
		const defenseTypes = teraType && !pokemon.terastallized ? [teraType] : this.getTypes(pokemon);
		const foeTypes = this.getTypes(foe);
		let worstHit = -Infinity;
		for (const type of foeTypes) {
			if (!this.dex.getImmunity(type, defenseTypes)) {
				worstHit = Math.max(worstHit, 3);
				continue;
			}
			worstHit = Math.max(worstHit, this.dex.getEffectiveness(type, defenseTypes));
		}
		if (worstHit === -Infinity) return 0;
		return -worstHit * 2 + (this.getHPFraction(pokemon.condition) - 0.5) * 2;
	}

	protected getSpeedAdvantage(pokemon: PokemonSwitchRequestData, foe: PokemonSwitchRequestData): number {
		return this.getSpeedTier(pokemon) - this.getSpeedTier(foe);
	}

	protected getSpeedTier(pokemon: PokemonSwitchRequestData): number {
		return pokemon.stats?.spe || pokemon.baseStats?.spe || 50;
	}

	protected getTypes(pokemon: PokemonSwitchRequestData): string[] {
		if (pokemon.terastallized) return [pokemon.terastallized];
		if (pokemon.types?.length) return pokemon.types;
		const speciesName = pokemon.details.split(',')[0];
		const species = this.dex.species.get(speciesName);
		return species.types || ['Normal'];
	}

	protected getActiveFoes(foeSide?: SideRequestData): PokemonSwitchRequestData[] {
		if (!foeSide?.pokemon) return [];
		const active = foeSide.pokemon.filter(pokemon => pokemon.active && !pokemon.condition.endsWith(' fnt'));
		if (active.length) return active;
		return foeSide.pokemon.filter(pokemon => !pokemon.condition.endsWith(' fnt')).slice(0, 1);
	}

	protected getHPFraction(condition: string): number {
		if (!condition) return 1;
		if (condition.endsWith(' fnt')) return 0;
		const hpText = condition.split(' ')[0];
		const [hp, maxhp] = hpText.split('/').map(Number);
		if (hp && maxhp) return hp / maxhp;
		return 1;
	}
}

// Creates an array of numbers progressing from start up to and including end
function range(start: number, end?: number, step = 1) {
	if (end === undefined) {
		end = start;
		start = 0;
	}
	const result = [];
	for (; start <= end; start += step) {
		result.push(start);
	}
	return result;
}
