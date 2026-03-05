const CUSTOM_WILDCARD_MOVES: readonly string[] = [
  'punchingbag',
  'insectpunch',
  'randomhazards',
  'superpunch',
  'retaliationscreen',
  'vampiricbite',
  'wingofthefae',
  'ironshackles',
  'mirage',
  'darkterrain',
  'grassattack',
  'lazylazer',
  'starfall',
  'callofthewilds',
  'gasoline',
  'solarburst',
  'instashock',
  'foresightblast',
  'terracharge',
  'venomlash',
  'galebeak',
  'dracopunch',
  'glimmerrush',
  'moonstrike',
  'backstab',
  'callforaid',
  'whimsycannon',
  'frozenearth',
  'shortcircuit',
  'mindshards',
  'staticjolt',
  'dragonsfury',
  'pixieflurry',
  'shadowbarrage',
  'phantomrattle',
  'feathervolley',
  'toxicneedles',
  'emberbarrage',
  'tidalslap',
  'shrapnelstorm',
  'pinatabond',
  'freezeray',
  'poisongasbomb',
  'nullzone',
  'shatteringscream',
  'benchbolt',
  'aidofrevival',
  'firejab',
  'rainbowpunching',
  'protectivepillow',
  'insectsting',
  'graspinghands',
  'plagueswarm',
  'stonejaw',
  'hotwater',
  'stoneflutter',
  'coldboulder',
  'freezeblast',
  'icyhot',
  'skyquake',
  'adaptiveforce',
  'soulrend',
  'volcaniccrush',
  'ashenbreath',
  'stonearmor',
  'auroraray',
  'moonblossom',
  'mysticpulse',
  'earthrend',
  'drillram',
  'spikebarrage',
  'cyclonewing',
  'skyreprieve',
  'mindstream',
  'tidalprism',
  'lotusfist',
  'naturesresolve',
  'midnightslash',
  'dreadgale',
  'feathercloak',
  'toxicmaw',
  'dracospike',
  'venomstorm',
  'scaleguard',
  'hauntspire',
  'creepingroot',
  'lifesap',
  'ironrend',
  'shadowrend',
  'metallicroar',
  'armorlock',
  'wraithflame',
  'spectralblaze',
  'pincercrush',
  'martiallunge',
  'crashingpalm',
  'steamburst',
  'frozenbarrier',
  'dracovortex',
  'tornado',
  'clarityveil',
  'aquabarrier',
  'vinebreaker',
  'sporeguard',
  'revvingdrill',
  'phantomdive',
  'phantomguard',
  'soulspark',
  'cauterize',
  'swarmguard',
  'ultimateslam',
  'inversepower',
  'dnalaser',
  'loadoutshift',
  'evaporate',
  'temptingoffer',
  'searingstab',
  'overwhelm',
  'sandyvortex',
  'solarvortex',
  'beautycoil',
  'venomfangs',
  'strikingstorm',
  'spiritbeam',
  'rootguard',
  'nuclearfangs',
  'haunt',
  'eyecontact',
  'dualswap',
  'toxicslash',
  'chromaticclaw',
  'disorientingbite',
  'serratedfangs',
  'serratedspikes',
  'nuclearexplosion',
  'explosivespores',
  'blindinglight',
  'frozenwings',
  'venomquake',
  'radiantspear',
  'barkbite',
  'emberoath',
  'sylvanlament',
  'smackemtwice',
  'divinerage',
  'fellswoop',
  'talktothehand',
  'nailscratch',
  'enchantingspin',
  'blownkiss',
  'voidclaw',
  'pyrokenesis',
  'ragnarokcry',
  'dodgeball',
  'runecleave',
  'lunartide',
  'drako',
  'storedscales',
  'gammaray',
  'benchhex',
  'rainbowpummeling',
  'doubleteamanime',
  'darkmoon',
  'poop',
  'benchsnipe',
];

import { Dex, toID } from '../../../sim/dex';
import { Utils } from '../../../lib';
import { PRNG, type PRNGSeed } from '../../../sim/prng';
import { type RuleTable } from '../../../sim/dex-formats';
import { Tags } from './../../tags';
import { Teams } from '../../../sim/teams';

export interface TeamData {
	typeCount: { [k: string]: number };
	typeComboCount: { [k: string]: number };
	baseFormes: { [k: string]: number };
	megaCount?: number;
	zCount?: number;
	wantsTeraCount?: number;
	has: { [k: string]: number };
	forceResult: boolean;
	weaknesses: { [k: string]: number };
	resistances: { [k: string]: number };
	weather?: string;
	eeveeLimCount?: number;
	gigantamax?: boolean;
}
export interface BattleFactorySpecies {
	sets: BattleFactorySet[];
	weight: number;
}
interface BattleFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string[];
	nature: string[];
	moves: string[][];
	teraType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs?: Partial<StatsTable>;
	ivs?: Partial<StatsTable>;
	shiny?: boolean;
}
interface BSSFactorySet {
	species: string;
	weight: number;
	item: string[];
	ability: string;
	nature: string;
	moves: string[][];
	teraType: string[];
	gender?: string;
	wantsTera?: boolean;
	evs: number[];
	ivs?: number[];
}
export class MoveCounter extends Utils.Multiset<string> {
	damagingMoves: Set<Move>;

	constructor() {
		super();
		this.damagingMoves = new Set();
	}
}

type MoveEnforcementChecker = (
	movePool: string[], moves: Set<string>, abilities: string[], types: string[],
	counter: MoveCounter, species: Species, teamDetails: RandomTeamsTypes.TeamDetails,
	isLead: boolean, isDoubles: boolean, teraType: string, role: RandomTeamsTypes.Role,
) => boolean;

// Moves that restore HP:
const RECOVERY_MOVES = [
	'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'shoreup', 'slackoff', 'softboiled', 'strengthsap', 'synthesis',
];
// Moves that drop stats:
const CONTRARY_MOVES = [
	'armorcannon', 'closecombat', 'leafstorm', 'makeitrain', 'overheat', 'spinout', 'superpower', 'vcreate',
];
// Moves that boost Attack:
const PHYSICAL_SETUP = [
	'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'meditate', 'poweruppunch', 'swordsdance', 'tidyup', 'victorydance',
];
// Moves which boost Special Attack:
const SPECIAL_SETUP = [
	'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow', 'takeheart', 'torchsong',
];
// Moves that boost Attack AND Special Attack:
const MIXED_SETUP = [
	'clangoroussoul', 'growth', 'happyhour', 'holdhands', 'noretreat', 'shellsmash', 'workup',
];
// Some moves that only boost Speed:
const SPEED_SETUP = [
	'agility', 'autotomize', 'flamecharge', 'rockpolish', 'snowscape', 'trailblaze',
];
// Conglomerate for ease of access
const SETUP = [
	'acidarmor', 'agility', 'autotomize', 'bellydrum', 'bulkup', 'calmmind', 'clangoroussoul', 'coil', 'cosmicpower', 'curse', 'dragondance',
	'flamecharge', 'growth', 'honeclaws', 'howl', 'irondefense', 'meditate', 'nastyplot', 'noretreat', 'poweruppunch', 'quiverdance',
	'rockpolish', 'shellsmash', 'shiftgear', 'swordsdance', 'tailglow', 'takeheart', 'tidyup', 'trailblaze', 'workup', 'victorydance',
];
const SPEED_CONTROL = [
	'electroweb', 'glare', 'icywind', 'lowsweep', 'nuzzle', 'quash', 'tailwind', 'thunderwave', 'trickroom',
];
// Moves that shouldn't be the only STAB moves:
const NO_STAB = [
	'accelerock', 'aquajet', 'bounce', 'breakingswipe', 'bulletpunch', 'chatter', 'chloroblast', 'clearsmog', 'covet',
	'dragontail', 'doomdesire', 'electroweb', 'eruption', 'explosion', 'fakeout', 'feint', 'flamecharge', 'flipturn', 'futuresight',
	'grassyglide', 'iceshard', 'icywind', 'incinerate', 'infestation', 'machpunch', 'meteorbeam', 'mortalspin', 'nuzzle', 'pluck', 'pursuit',
	'quickattack', 'rapidspin', 'reversal', 'selfdestruct', 'shadowsneak', 'skydrop', 'snarl', 'strugglebug', 'suckerpunch', 'trailblaze',
	'uturn', 'vacuumwave', 'voltswitch', 'watershuriken', 'waterspout',
];
// Hazard-setting moves
const HAZARDS = [
	'spikes', 'stealthrock', 'stickyweb', 'toxicspikes',
];
// Protect and its variants
const PROTECT_MOVES = [
	'banefulbunker', 'burningbulwark', 'protect', 'silktrap', 'spikyshield',
];
// Moves that switch the user out
const PIVOT_MOVES = [
	'chillyreception', 'flipturn', 'partingshot', 'shedtail', 'teleport', 'uturn', 'voltswitch',
];

// Moves that should be paired together when possible
const MOVE_PAIRS = [
	['lightscreen', 'reflect'],
	['sleeptalk', 'rest'],
	['protect', 'wish'],
	['leechseed', 'protect'],
	['leechseed', 'substitute'],
];

/** Pokemon who always want priority STAB, and are fine with it as its only STAB move of that type */
const PRIORITY_POKEMON = [
	'breloom', 'brutebonnet', 'cacturne', 'honchkrow', 'mimikyu', 'ragingbolt', 'scizor',
];

/** Pokemon who should never be in the lead slot */
const NO_LEAD_POKEMON = [
	'Zacian', 'Zamazenta',
];
const DOUBLES_NO_LEAD_POKEMON = [
	'Basculegion', 'Houndstone', 'Iron Bundle', 'Roaring Moon', 'Zacian', 'Zamazenta',
];

const DEFENSIVE_TERA_BLAST_USERS = [
	'alcremie', 'bellossom', 'comfey', 'fezandipiti', 'florges', 'raikou',
];

function sereneGraceBenefits(move: Move) {
	return move.secondary?.chance && move.secondary.chance > 20 && move.secondary.chance < 100;
}

export class RandomTeams {
	readonly dex: ModdedDex;
	gen: number;
	factoryTier: string;
	format: Format;
	prng: PRNG;
	noStab: string[];
	readonly maxTeamSize: number;
	readonly adjustLevel: number | null;
	readonly maxMoveCount: number;
	readonly forceMonotype: string | undefined;
	readonly forceTeraType: string | undefined;

	/**
	 * Checkers for move enforcement based on types or other factors
	 *
	 * returns true to try to force the move type, false otherwise.
	 */
	moveEnforcementCheckers: { [k: string]: MoveEnforcementChecker };

	/** Used by .getPools() */
	private poolsCacheKey: [string | undefined, number | undefined, RuleTable | undefined, boolean] | undefined;
	private cachedPool: number[] | undefined;
	private cachedSpeciesPool: Species[] | undefined;
	protected cachedStatusMoves: ID[];

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.gen = this.dex.gen;
		this.noStab = NO_STAB;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.adjustLevel = ruleTable.adjustLevel;
		this.maxMoveCount = ruleTable.maxMoveCount;
		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;
		const forceTeraType = ruleTable.valueRules.get('forceteratype');
		this.forceTeraType = forceTeraType && this.dex.types.get(forceTeraType).exists ?
			this.dex.types.get(forceTeraType).name : undefined;

		this.factoryTier = '';
		this.format = format;
		this.prng = PRNG.get(prng);

		this.moveEnforcementCheckers = {
			Bug: (movePool, moves, abilities, types, counter) => (
				movePool.includes('megahorn') || movePool.includes('xscissor') ||
				(!counter.get('Bug') && (types.includes('Electric') || types.includes('Psychic')))
			),
			Dark: (
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			) => {
				if (
					counter.get('Dark') < 2 && PRIORITY_POKEMON.includes(species.id) && role === 'Wallbreaker'
				) return true;
				return !counter.get('Dark');
			},
			Dragon: (movePool, moves, abilities, types, counter) => !counter.get('Dragon'),
			Electric: (movePool, moves, abilities, types, counter) => !counter.get('Electric'),
			Fairy: (movePool, moves, abilities, types, counter) => !counter.get('Fairy'),
			Fighting: (movePool, moves, abilities, types, counter) => !counter.get('Fighting'),
			Fire: (movePool, moves, abilities, types, counter, species) => !counter.get('Fire'),
			Flying: (movePool, moves, abilities, types, counter) => !counter.get('Flying'),
			Ghost: (movePool, moves, abilities, types, counter) => !counter.get('Ghost'),
			Grass: (movePool, moves, abilities, types, counter, species) => (
				!counter.get('Grass') && (
					movePool.includes('leafstorm') || species.baseStats.atk >= 100 ||
					types.includes('Electric') || abilities.includes('Seed Sower')
				)
			),
			Ground: (movePool, moves, abilities, types, counter) => !counter.get('Ground'),
			Ice: (movePool, moves, abilities, types, counter) => (
				movePool.includes('freezedry') || movePool.includes('blizzard') || !counter.get('Ice')
			),
			Normal: (movePool, moves, types, counter) => (movePool.includes('boomburst') || movePool.includes('hypervoice')),
			Poison: (movePool, moves, abilities, types, counter) => {
				if (types.includes('Ground')) return false;
				return !counter.get('Poison');
			},
			Psychic: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => {
				if ((isDoubles || species.id === 'bruxish') && movePool.includes('psychicfangs')) return true;
				if (species.id === 'hoopaunbound' && movePool.includes('psychic')) return true;
				if (['Dark', 'Steel', 'Water'].some(m => types.includes(m))) return false;
				return !counter.get('Psychic');
			},
			Rock: (movePool, moves, abilities, types, counter, species) => !counter.get('Rock') && species.baseStats.atk >= 80,
			Steel: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => (
				!counter.get('Steel') &&
				(isDoubles || species.baseStats.atk >= 90 || movePool.includes('gigatonhammer') || movePool.includes('makeitrain'))
			),
			Water: (movePool, moves, abilities, types, counter) => (!counter.get('Water') && !types.includes('Ground')),
		};
		this.poolsCacheKey = undefined;
		this.cachedPool = undefined;
		this.cachedSpeciesPool = undefined;
		this.cachedStatusMoves = this.dex.moves.all().filter(move => move.category === 'Status').map(move => move.id);
	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	getTeam(options: PlayerOptions | null = null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		) ? this.format.team + 'Team' : '';
		// @ts-expect-error property access
		return this[generatorName || 'randomTeam'](options);
	}

	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}

	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}

	sampleIfArray<T>(item: T | T[]): T {
		if (Array.isArray(item)) {
			return this.sample(item);
		}
		return item;
	}

	random(m?: number, n?: number) {
		return this.prng.random(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 */
	fastPop(list: any[], index: number) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		const length = list.length;
		if (index < 0 || index >= list.length) {
			// sanity check
			throw new Error(`Index ${index} out of bounds for given array`);
		}

		const element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 */
	sampleNoReplace(list: any[]) {
		const length = list.length;
		if (length === 0) return null;
		const index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * Removes n random elements from an unsorted array and returns them.
	 * If n is less than the array's length, randomly removes and returns all the elements
	 * in the array (so the returned array could have length < n).
	 */
	multipleSamplesNoReplace<T>(list: T[], n: number): T[] {
		const samples = [];
		while (samples.length < n && list.length) {
			samples.push(this.sampleNoReplace(list));
		}

		return samples;
	}

	/**
	 * Check if user has directly tried to ban/unban/restrict things in a custom battle.
	 * Doesn't count bans nested inside other formats/rules.
	 */
	private hasDirectCustomBanlistChanges() {
		if (this.format.ruleTable?.has('+pokemontag:cap')) return false;
		if (this.format.banlist.length || this.format.restricted.length || this.format.unbanlist.length) return true;
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			for (const banlistOperator of ['-', '+', '*']) {
				if (rule.startsWith(banlistOperator)) return true;
			}
		}
		return false;
	}

	/**
	 * Inform user when custom bans are unsupported in a team generator.
	 */
	protected enforceNoDirectCustomBanlistChanges() {
		if (this.hasDirectCustomBanlistChanges()) {
			throw new Error(`Custom bans are not currently supported in ${this.format.name}.`);
		}
	}

	/**
	 * Inform user when complex bans are unsupported in a team generator.
	 */
	protected enforceNoDirectComplexBans() {
		if (!this.format.customRules) return false;
		for (const rule of this.format.customRules) {
			if (rule.includes('+') && !rule.startsWith('+')) {
				throw new Error(`Complex bans are not currently supported in ${this.format.name}.`);
			}
		}
	}

	/**
	 * Validate set element pool size is sufficient to support size requirements after simple bans.
	 */
	private enforceCustomPoolSizeNoComplexBans(
		effectTypeName: string,
		basicEffectPool: BasicEffect[],
		requiredCount: number,
		requiredCountExplanation: string
	) {
		if (basicEffectPool.length >= requiredCount) return;
		throw new Error(`Legal ${effectTypeName} count is insufficient to support ${requiredCountExplanation} (${basicEffectPool.length} / ${requiredCount}).`);
	}

	queryMoves(
		moves: Set<string> | null,
		species: Species,
		teraType: string,
		abilities: string[],
	): MoveCounter {
		// This is primarily a helper function for random setbuilder functions.
		const counter = new MoveCounter();
		const types = species.types;
		if (!moves?.size) return counter;

		const categories = { Physical: 0, Special: 0, Status: 0 };

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const moveid of moves) {
			const move = this.dex.moves.get(moveid);

			const moveType = this.getMoveType(move, species, abilities, teraType);
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter.add('damage');
				counter.damagingMoves.add(move);
			} else {
				// Are Physical/Special/Status moves:
				categories[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) {
				counter.add('technician');
			}
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter.add('skilllink');
			if (move.recoil || move.hasCrashDamage) counter.add('recoil');
			if (move.drain) counter.add('drain');
			// Moves which have a base power:
			if (move.basePower || move.basePowerCallback) {
				if (!this.noStab.includes(moveid) || PRIORITY_POKEMON.includes(species.id) && move.priority > 0) {
					counter.add(moveType);
					if (types.includes(moveType)) counter.add('stab');
					if (teraType === moveType) counter.add('stabtera');
					counter.damagingMoves.add(move);
				}
				if (move.flags['bite']) counter.add('strongjaw');
				if (move.flags['punch']) counter.add('ironfist');
				if (move.flags['sound']) counter.add('sound');
				if (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) {
					counter.add('priority');
				}
			}
			// Moves with secondary effects:
			if (move.secondary || move.hasSheerForce) {
				counter.add('sheerforce');
				if (sereneGraceBenefits(move)) {
					counter.add('serenegrace');
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter.add('inaccurate');

			// Moves that change stats:
			if (RECOVERY_MOVES.includes(moveid)) counter.add('recovery');
			if (CONTRARY_MOVES.includes(moveid)) counter.add('contrary');
			if (PHYSICAL_SETUP.includes(moveid)) counter.add('physicalsetup');
			if (SPECIAL_SETUP.includes(moveid)) counter.add('specialsetup');
			if (MIXED_SETUP.includes(moveid)) counter.add('mixedsetup');
			if (SPEED_SETUP.includes(moveid)) counter.add('speedsetup');
			if (SPEED_CONTROL.includes(moveid)) counter.add('speedcontrol');
			if (SETUP.includes(moveid)) counter.add('setup');
			if (HAZARDS.includes(moveid)) counter.add('hazards');
		}

		counter.set('Physical', Math.floor(categories['Physical']));
		counter.set('Special', Math.floor(categories['Special']));
		counter.set('Status', categories['Status']);
		return counter;
	}

	cullMovePool(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		movePool: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): void {
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		// If we have two unfilled moves and only one unpaired move, cull the unpaired move.
		if (moves.size === this.maxMoveCount - 2) {
			const unpairedMoves = [...movePool];
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
					this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
				}
			}
			if (unpairedMoves.length === 1) {
				this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
			}
		}

		// These moves are paired, and shouldn't appear if there is not room for them both.
		if (moves.size === this.maxMoveCount - 1) {
			for (const pair of MOVE_PAIRS) {
				if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
					this.fastPop(movePool, movePool.indexOf(pair[0]));
					this.fastPop(movePool, movePool.indexOf(pair[1]));
				}
			}
		}

		// Develop additional move lists
		const statusMoves = this.cachedStatusMoves;

		// Team-based move culls
		if (teamDetails.screens) {
			if (movePool.includes('auroraveil')) this.fastPop(movePool, movePool.indexOf('auroraveil'));
			if (movePool.length >= this.maxMoveCount + 2) {
				if (movePool.includes('reflect')) this.fastPop(movePool, movePool.indexOf('reflect'));
				if (movePool.includes('lightscreen')) this.fastPop(movePool, movePool.indexOf('lightscreen'));
			}
		}
		if (teamDetails.stickyWeb) {
			if (movePool.includes('stickyweb')) this.fastPop(movePool, movePool.indexOf('stickyweb'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.stealthRock) {
			if (movePool.includes('stealthrock')) this.fastPop(movePool, movePool.indexOf('stealthrock'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.defog || teamDetails.rapidSpin) {
			if (movePool.includes('defog')) this.fastPop(movePool, movePool.indexOf('defog'));
			if (movePool.includes('rapidspin')) this.fastPop(movePool, movePool.indexOf('rapidspin'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.toxicSpikes) {
			if (movePool.includes('toxicspikes')) this.fastPop(movePool, movePool.indexOf('toxicspikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.spikes && teamDetails.spikes >= 2) {
			if (movePool.includes('spikes')) this.fastPop(movePool, movePool.indexOf('spikes'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}
		if (teamDetails.statusCure) {
			if (movePool.includes('healbell')) this.fastPop(movePool, movePool.indexOf('healbell'));
			if (moves.size + movePool.length <= this.maxMoveCount) return;
		}

		if (isDoubles) {
			const doublesIncompatiblePairs = [
				// In order of decreasing generalizability
				[SPEED_CONTROL, SPEED_CONTROL],
				[HAZARDS, HAZARDS],
				['rockslide', 'stoneedge'],
				[SETUP, ['fakeout', 'helpinghand']],
				[PROTECT_MOVES, 'wideguard'],
				[['fierydance', 'fireblast'], 'heatwave'],
				['dazzlinggleam', ['fleurcannon', 'moonblast']],
				['poisongas', ['toxicspikes', 'willowisp']],
				[RECOVERY_MOVES, ['healpulse', 'lifedew']],
				['healpulse', 'lifedew'],
				['haze', 'icywind'],
				[['hydropump', 'muddywater'], ['muddywater', 'scald']],
				['disable', 'encore'],
				['freezedry', 'icebeam'],
				['energyball', 'leafstorm'],
				['earthpower', 'sandsearstorm'],
				['coaching', ['helpinghand', 'howl']],
			];

			for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

			if (role !== 'Offensive Protect') this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ['flipturn', 'uturn']);
		}

		// General incompatibilities
		const incompatiblePairs = [
			// These moves don't mesh well with other aspects of the set
			[statusMoves, ['healingwish', 'switcheroo', 'trick']],
			[SETUP, PIVOT_MOVES],
			[SETUP, HAZARDS],
			[SETUP, ['defog', 'nuzzle', 'toxic', 'yawn', 'haze']],
			[PHYSICAL_SETUP, PHYSICAL_SETUP],
			[SPECIAL_SETUP, 'thunderwave'],
			['substitute', PIVOT_MOVES],
			[SPEED_SETUP, ['aquajet', 'rest', 'trickroom']],
			['curse', ['irondefense', 'rapidspin']],
			['dragondance', 'dracometeor'],
			['yawn', 'roar'],
			['trick', 'uturn'],

			// These attacks are redundant with each other
			[['psychic', 'psychicnoise'], ['psyshock', 'psychicnoise']],
			['surf', 'hydropump'],
			['liquidation', 'wavecrash'],
			['aquajet', 'flipturn'],
			['gigadrain', 'leafstorm'],
			['powerwhip', 'hornleech'],
			['airslash', 'hurricane'],
			['knockoff', 'foulplay'],
			['throatchop', ['crunch', 'lashout']],
			['doubleedge', ['bodyslam', 'headbutt']],
			[['fireblast', 'magmastorm'], ['fierydance', 'flamethrower', 'lavaplume']],
			['thunderpunch', 'wildcharge'],
			['thunderbolt', 'discharge'],
			['gunkshot', ['direclaw', 'poisonjab', 'sludgebomb']],
			['aurasphere', 'focusblast'],
			['closecombat', 'drainpunch'],
			[['dragonpulse', 'spacialrend'], 'dracometeor'],
			['heavyslam', 'flashcannon'],
			['alluringvoice', 'dazzlinggleam'],

			// These status moves are redundant with each other
			['taunt', 'disable'],
			[['thunderwave', 'toxic'], ['thunderwave', 'willowisp']],
			[['thunderwave', 'toxic', 'willowisp'], 'toxicspikes'],

			// This space reserved for assorted hardcodes that otherwise make little sense out of context
			// Landorus and Thundurus
			['nastyplot', ['rockslide', 'knockoff']],
			// Persian
			['switcheroo', 'fakeout'],
			// Amoonguss, though this can work well as a general rule later
			['toxic', 'clearsmog'],
			// Chansey and Blissey
			['healbell', 'stealthrock'],
			// Araquanid and Magnezone
			['mirrorcoat', ['hydropump', 'bodypress']],
		];

		for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);

		if (!types.includes('Ice')) this.incompatibleMoves(moves, movePool, 'icebeam', 'icywind');

		if (!isDoubles) this.incompatibleMoves(moves, movePool, 'taunt', 'encore');

		if (!types.includes('Dark') && teraType !== 'Dark') this.incompatibleMoves(moves, movePool, 'knockoff', 'suckerpunch');

		if (!abilities.includes('Prankster')) this.incompatibleMoves(moves, movePool, 'thunderwave', 'yawn');

		// This space reserved for assorted hardcodes that otherwise make little sense out of context:
		// To force Close Combat on Barraskewda without locking it to Tera Fighting
		if (species.id === 'barraskewda') {
			this.incompatibleMoves(moves, movePool, ['psychicfangs', 'throatchop'], ['poisonjab', 'throatchop']);
		}
		// To force Toxic on Quagsire
		if (species.id === 'quagsire') this.incompatibleMoves(moves, movePool, 'spikes', 'icebeam');
		// Taunt/Knock should be Cyclizar's flex moveslot
		if (species.id === 'cyclizar') this.incompatibleMoves(moves, movePool, 'taunt', 'knockoff');
		// To force Stealth Rock on Camerupt
		if (species.id === 'camerupt') this.incompatibleMoves(moves, movePool, 'roar', 'willowisp');
		// nothing else rolls these lol
		if (species.id === 'coalossal') this.incompatibleMoves(moves, movePool, 'flamethrower', 'overheat');
	}

	// Checks for and removes incompatible moves, starting with the first move in movesA.
	incompatibleMoves(
		moves: Set<string>,
		movePool: string[],
		movesA: string | string[],
		movesB: string | string[],
	): void {
		const moveArrayA = (Array.isArray(movesA)) ? movesA : [movesA];
		const moveArrayB = (Array.isArray(movesB)) ? movesB : [movesB];
		if (moves.size + movePool.length <= this.maxMoveCount) return;
		for (const moveid1 of moves) {
			if (moveArrayB.includes(moveid1)) {
				for (const moveid2 of moveArrayA) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
			if (moveArrayA.includes(moveid1)) {
				for (const moveid2 of moveArrayB) {
					if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
						this.fastPop(movePool, movePool.indexOf(moveid2));
						if (moves.size + movePool.length <= this.maxMoveCount) return;
					}
				}
			}
		}
	}

	// Adds a move to the moveset, returns the MoveCounter
	addMove(
		move: string,
		moves: Set<string>,
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role,
	): MoveCounter {
		moves.add(move);
		this.fastPop(movePool, movePool.indexOf(move));
		const counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);
		return counter;
	}

	// Returns the type of a given move for STAB/coverage enforcement purposes
	getMoveType(move: Move, species: Species, abilities: string[], teraType: string): string {
		if (move.id === 'terablast') return teraType;
		if (['judgment', 'revelationdance'].includes(move.id)) return species.types[0];

		if (move.name === "Raging Bull" && species.name.startsWith("Tauros-Paldea")) {
			if (species.name.endsWith("Combat")) return "Fighting";
			if (species.name.endsWith("Blaze")) return "Fire";
			if (species.name.endsWith("Aqua")) return "Water";
		}

		if (move.name === "Ivy Cudgel" && species.name.startsWith("Ogerpon")) {
			if (species.name.endsWith("Wellspring")) return "Water";
			if (species.name.endsWith("Hearthflame")) return "Fire";
			if (species.name.endsWith("Cornerstone")) return "Rock";
		}

		const moveType = move.type;
		if (moveType === 'Normal') {
			if (abilities.includes('Aerilate')) return 'Flying';
			if (abilities.includes('Galvanize')) return 'Electric';
			if (abilities.includes('Pixilate')) return 'Fairy';
			if (abilities.includes('Refrigerate')) return 'Ice';
		}
		return moveType;
	}
	private pickWildcardCustomMove(
  species: Species,
  moves: Set<string>,
  opts?: {
    types?: readonly string[];
    ability?: string;
    teraType?: string;
  }
): ID | null {
  const atk = species.baseStats.atk;
  const spa = species.baseStats.spa;
  const preferPhysical = atk > spa;

  // Allow callers to override types/ability/teraType, otherwise fall back safely.
  const types = (opts?.types?.length ? opts.types : species.types) as readonly string[];
  const ability = opts?.ability || species.abilities?.[0] || '';
  const teraType = opts?.teraType || '';

  const alreadyHasStatus = [...moves].some(m => {
    const mv = this.dex.moves.get(m);
    return mv?.category === 'Status';
  });

  // More reliable than getMovePool: uses the learnset object keys.
  const normallyGetsStatus = (() => {
    const learnset = this.dex.species.getMovePool(species.id);
    if (!learnset) return true; // if unknown, assume yes (safer for variety)
    for (const moveid in learnset) {
      const mv = this.dex.moves.get(moveid);
      if (mv?.category === 'Status') return true;
    }
    return false;
  })();

  const candidates: Move[] = [];
  for (const raw of CUSTOM_WILDCARD_MOVES) {
    const id = toID(raw) as ID; // raw can be "Punching Bag" etc
    if (moves.has(id)) continue;
    const move = this.dex.moves.get(id);
    if (!move?.exists) continue;
    candidates.push(move);
  }
  if (!candidates.length) return null;

  // Helper to evaluate "effective" move type (tera/ability effects if your codebase supports it)
  const effectiveType = (m: Move) => {
    // If your RandomTeams has getMoveType available, use it; otherwise fall back to m.type.
    // @ts-ignore - in PS random-teams this exists in the class
    return this.getMoveType ? this.getMoveType(m, species, [ability], teraType) : m.type;
  };

  // 1) Prefer STAB + best attacking stat
  const stabAttackers = candidates.filter(m =>
    m.category !== 'Status' &&
    types.includes(effectiveType(m)) &&
    (preferPhysical ? m.category === 'Physical' : m.category === 'Special')
  );
  if (stabAttackers.length) return this.sample(stabAttackers).id;

  // 2) Status move fallback (if the mon typically has them)
  if (!alreadyHasStatus && normallyGetsStatus) {
    const statusMoves = candidates.filter(m => m.category === 'Status');
    if (statusMoves.length) return this.sample(statusMoves).id;
  }

  // 3) Any damaging wildcard (still prefer best attacking side first)
  const preferredSide = candidates.filter(m =>
    m.category !== 'Status' &&
    (preferPhysical ? m.category === 'Physical' : m.category === 'Special')
  );
  if (preferredSide.length) return this.sample(preferredSide).id;

  const attackers = candidates.filter(m => m.category !== 'Status');
  if (attackers.length) return this.sample(attackers).id;

  return null;
}



	// Generate random moveset for a given species, role, tera type.
	randomMoveset(
		types: string[],
		abilities: string[],
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		movePool: string[],
		teraType: string,
		role: RandomTeamsTypes.Role,
	): Set<string> {
		const moves = new Set<string>();
		let counter = this.queryMoves(moves, species, teraType, abilities);
		this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);

		// If there are only four moves, add all moves and return early
		if (movePool.length <= this.maxMoveCount) {
			for (const moveid of movePool) {
				moves.add(moveid);
			}
			return moves;
		}

		const runEnforcementChecker = (checkerName: string) => {
			if (!this.moveEnforcementCheckers[checkerName]) return false;
			return this.moveEnforcementCheckers[checkerName](
				movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role
			);
		};

		if (role === 'Tera Blast user') {
			counter = this.addMove('terablast', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}
		// Add required move (e.g. Relic Song for Meloetta-P)
		if (species.requiredMove) {
			const move = this.dex.moves.get(species.requiredMove).id;
			counter = this.addMove(move, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Add other moves you really want to have, e.g. STAB, recovery, setup.

		// Enforce Facade if Guts is a possible ability
		if (movePool.includes('facade') && abilities.includes('Guts')) {
			counter = this.addMove('facade', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Night Shade, Revelation Dance, Revival Blessing, and Sticky Web
		for (const moveid of ['nightshade', 'revelationdance', 'revivalblessing', 'stickyweb']) {
			if (movePool.includes(moveid)) {
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Trick Room on Doubles Wallbreaker
		if (movePool.includes('trickroom') && role === 'Doubles Wallbreaker') {
			counter = this.addMove('trickroom', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce hazard removal on Bulky Support if the team doesn't already have it
		if (role === 'Bulky Support' && !teamDetails.defog && !teamDetails.rapidSpin) {
			if (movePool.includes('rapidspin')) {
				counter = this.addMove('rapidspin', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			if (movePool.includes('defog')) {
				counter = this.addMove('defog', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Aurora Veil if the team doesn't already have screens
		if (!teamDetails.screens && movePool.includes('auroraveil')) {
			counter = this.addMove('auroraveil', moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
		}

		// Enforce Knock Off on pure Normal- and Fighting-types in singles
		if (!isDoubles && types.length === 1 && (types.includes('Normal') || types.includes('Fighting'))) {
			if (movePool.includes('knockoff')) {
				counter = this.addMove('knockoff', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Spore on Smeargle
		if (species.id === 'smeargle') {
			if (movePool.includes('spore')) {
				counter = this.addMove('spore', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce moves in doubles
		if (isDoubles) {
			const doublesEnforcedMoves = ['mortalspin', 'spore'];
			for (const moveid of doublesEnforcedMoves) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
			// Enforce Fake Out on slow Pokemon
			if (movePool.includes('fakeout') && species.baseStats.spe <= 50) {
				counter = this.addMove('fakeout', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Tailwind on Prankster and Gale Wings users
			if (movePool.includes('tailwind') && (abilities.includes('Prankster') || abilities.includes('Gale Wings'))) {
				counter = this.addMove('tailwind', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
			// Enforce Thunder Wave on Prankster users as well
			if (movePool.includes('thunderwave') && abilities.includes('Prankster')) {
				counter = this.addMove('thunderwave', moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB priority
		if (
			['Bulky Attacker', 'Bulky Setup', 'Wallbreaker', 'Doubles Wallbreaker'].includes(role) ||
			PRIORITY_POKEMON.includes(species.id)
		) {
			const priorityMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (
					types.includes(moveType) && (move.priority > 0 || (moveid === 'grassyglide' && abilities.includes('Grassy Surge'))) &&
					(move.basePower || move.basePowerCallback)
				) {
					priorityMoves.push(moveid);
				}
			}
			if (priorityMoves.length) {
				const moveid = this.sample(priorityMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce STAB
		for (const type of types) {
			// Check if a STAB move of that type should be required
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
					stabMoves.push(moveid);
				}
			}
			while (runEnforcementChecker(type)) {
				if (!stabMoves.length) break;
				const moveid = this.sampleNoReplace(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Tera STAB
		if (!counter.get('stabtera') && !['Bulky Support', 'Doubles Support'].includes(role)) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// If no STAB move was added, add a STAB move
		if (!counter.get('stab')) {
			const stabMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				const moveType = this.getMoveType(move, species, abilities, teraType);
				if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
					stabMoves.push(moveid);
				}
			}
			if (stabMoves.length) {
				const moveid = this.sample(stabMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce recovery
		if (['Bulky Support', 'Bulky Attacker', 'Bulky Setup'].includes(role)) {
			const recoveryMoves = movePool.filter(moveid => RECOVERY_MOVES.includes(moveid));
			if (recoveryMoves.length) {
				const moveid = this.sample(recoveryMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce pivoting moves on AV Pivot
		if (role === 'AV Pivot') {
			const pivotMoves = movePool.filter(moveid => ['uturn', 'voltswitch'].includes(moveid));
			if (pivotMoves.length) {
				const moveid = this.sample(pivotMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce setup
		if (role.includes('Setup') || role === 'Tera Blast user') {
			// First, try to add a non-Speed setup move
			const nonSpeedSetupMoves = movePool.filter(moveid => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
			if (nonSpeedSetupMoves.length) {
				const moveid = this.sample(nonSpeedSetupMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			} else {
				// No non-Speed setup moves, so add any (Speed) setup move
				const setupMoves = movePool.filter(moveid => SETUP.includes(moveid));
				if (setupMoves.length) {
					const moveid = this.sample(setupMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Enforce redirecting moves and Fake Out on Doubles Support
		if (role === 'Doubles Support') {
			for (const moveid of ['fakeout', 'followme', 'ragepowder']) {
				if (movePool.includes(moveid)) {
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
			const speedControl = movePool.filter(moveid => SPEED_CONTROL.includes(moveid));
			if (speedControl.length) {
				const moveid = this.sample(speedControl);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce Protect
		if (role.includes('Protect')) {
			const protectMoves = movePool.filter(moveid => PROTECT_MOVES.includes(moveid));
			if (protectMoves.length) {
				const moveid = this.sample(protectMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce a move not on the noSTAB list
		if (!counter.damagingMoves.size) {
			// Choose an attacking move
			const attackingMoves = [];
			for (const moveid of movePool) {
				const move = this.dex.moves.get(moveid);
				if (!this.noStab.includes(moveid) && (move.category !== 'Status')) attackingMoves.push(moveid);
			}
			if (attackingMoves.length) {
				const moveid = this.sample(attackingMoves);
				counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
					movePool, teraType, role);
			}
		}

		// Enforce coverage move
		if (!['AV Pivot', 'Fast Support', 'Bulky Support', 'Bulky Protect', 'Doubles Support'].includes(role)) {
			if (counter.damagingMoves.size === 1) {
				// Find the type of the current attacking move
				const currentAttackType = counter.damagingMoves.values().next().value!.type;
				// Choose an attacking move that is of different type to the current single attack
				const coverageMoves = [];
				for (const moveid of movePool) {
					const move = this.dex.moves.get(moveid);
					const moveType = this.getMoveType(move, species, abilities, teraType);
					if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
						if (currentAttackType !== moveType) coverageMoves.push(moveid);
					}
				}
				if (coverageMoves.length) {
					const moveid = this.sample(coverageMoves);
					counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}

		// Add (moves.size < this.maxMoveCount) as a condition if moves is getting larger than 4 moves.
		// If you want moves to be favored but not required, add something like && this.randomChance(1, 2) to your condition.

		// Choose remaining moves randomly from movepool and add them to moves list:
		while (moves.size < this.maxMoveCount && movePool.length) {
			if (moves.size + movePool.length <= this.maxMoveCount) {
				for (const moveid of movePool) {
					moves.add(moveid);
				}
				break;
			}
			const moveid = this.sample(movePool);
			counter = this.addMove(moveid, moves, types, abilities, teamDetails, species, isLead, isDoubles,
				movePool, teraType, role);
			for (const pair of MOVE_PAIRS) {
				if (moveid === pair[0] && movePool.includes(pair[1])) {
					counter = this.addMove(pair[1], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
				if (moveid === pair[1] && movePool.includes(pair[0])) {
					counter = this.addMove(pair[0], moves, types, abilities, teamDetails, species, isLead, isDoubles,
						movePool, teraType, role);
				}
			}
		}
		// ----- CHAOS WILDCARD MOVE (FORCE SLOT 4) -----
if (moves.size === this.maxMoveCount) {
  // Remove one random existing move to make room (usually slot 4)
  const arr = [...moves];
  const removed = this.sample(arr);
  moves.delete(removed);
}

const wildcard = this.pickWildcardCustomMove(species, moves);
if (wildcard) {
  moves.add(wildcard);
}
// --------------------------------------------

return moves;

	}

	shouldCullAbility(
		ability: string,
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): boolean {
		switch (ability) {
		// Abilities which are primarily useful for certain moves or with team support
		case 'Chlorophyll': case 'Solar Power':
			return !teamDetails.sun;
		case 'Defiant':
			return (species.id === 'thundurus' && !!counter.get('Status'));
		case 'Hydration': case 'Swift Swim':
			return !teamDetails.rain;
		case 'Iron Fist': case 'Skill Link':
			return !counter.get(toID(ability));
		case 'Overgrow':
			return !counter.get('Grass');
		case 'Prankster':
			return !counter.get('Status');
		case 'Sand Force': case 'Sand Rush':
			return !teamDetails.sand;
		case 'Slush Rush':
			return !teamDetails.snow;
		case 'Swarm':
			return !counter.get('Bug');
		case 'Torrent':
			return (!counter.get('Water') && !moves.has('flipturn'));
		}

		return false;
	}

	getAbility(
		types: string[],
		moves: Set<string>,
		abilities: string[],
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		// ffa abilities that differ from doubles
		if (this.format.gameType === 'freeforall') {
			if (species.id === 'bellossom') return 'Chlorophyll';
			if (species.id === 'sinistcha') return 'Heatproof';
			if (abilities.length === 1 && abilities[0] === 'Telepathy') {
				return species.id === 'oranguru' ? 'Inner Focus' : 'Pressure';
			}
			if (species.id === 'duraludon') return 'Light Metal';
			if (species.id === 'clefairy') return 'Magic Guard';
			if (species.id === 'blissey') return 'Natural Cure';
			if (species.id === 'barraskewda') return 'Swift Swim';
		}

		if (abilities.length <= 1) return abilities[0];

		// Hard-code abilities here
		if (species.id === 'drifblim') return moves.has('defog') ? 'Aftermath' : 'Unburden';
		if (abilities.includes('Flash Fire') && this.dex.getEffectiveness('Fire', teraType) >= 1) return 'Flash Fire';
		if (species.id === 'hitmonchan' && counter.get('ironfist')) return 'Iron Fist';
		if ((species.id === 'thundurus' || species.id === 'tornadus') && !counter.get('Physical')) return 'Prankster';
		if (species.id === 'swampert' && (counter.get('Water') || moves.has('flipturn'))) return 'Torrent';
		if (species.id === 'toucannon' && counter.get('skilllink')) return 'Skill Link';
		if (abilities.includes('Slush Rush') && moves.has('snowscape')) return 'Slush Rush';
		if (species.id === 'golduck' && teamDetails.rain) return 'Swift Swim';

		const abilityAllowed: string[] = [];
		// Obtain a list of abilities that are allowed (not culled)
		for (const ability of abilities) {
			if (!this.shouldCullAbility(
				ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role
			)) {
				abilityAllowed.push(ability);
			}
		}

		// Pick a random allowed ability
		if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);

		// If all abilities are rejected, prioritize weather abilities over non-weather abilities
		if (!abilityAllowed.length) {
			const weatherAbilities = abilities.filter(
				a => ['Chlorophyll', 'Hydration', 'Sand Force', 'Sand Rush', 'Slush Rush', 'Solar Power', 'Swift Swim'].includes(a)
			);
			if (weatherAbilities.length) return this.sample(weatherAbilities);
		}

		// Pick a random ability
		return this.sample(abilities);
	}

	getPriorityItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		isDoubles: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	) {
		if (!isDoubles) {
			if (role === 'Fast Bulky Setup' && (ability === 'Quark Drive' || ability === 'Protosynthesis')) {
				return 'Booster Energy';
			}
			if (species.id === 'lokix') {
				return (role === 'Fast Attacker') ? 'Silver Powder' : 'Life Orb';
			}
		}
		if (species.requiredItems) {
			// Z-Crystals aren't available in Gen 9, so require Plates
			if (species.baseSpecies === 'Arceus') {
				return species.requiredItems[0];
			}
			return this.sample(species.requiredItems);
		}
		if (role === 'AV Pivot') return 'Assault Vest';
		if (species.id === 'pikachu') return 'Light Ball';
		if (species.id === 'regieleki') return 'Magnet';
		if (types.includes('Normal') && moves.has('doubleedge') && moves.has('fakeout')) return 'Silk Scarf';
		if (
			species.id === 'froslass' || moves.has('populationbomb') ||
			(ability === 'Hustle' && counter.get('setup') && !isDoubles && this.randomChance(1, 2))
		) return 'Wide Lens';
		if (species.id === 'smeargle' && !isDoubles) return 'Focus Sash';
		if (moves.has('clangoroussoul') || (species.id === 'toxtricity' && moves.has('shiftgear'))) return 'Throat Spray';
		if (
			(species.baseSpecies === 'Magearna' && role === 'Tera Blast user') ||
			species.id === 'necrozmaduskmane' || (species.id === 'calyrexice' && isDoubles)
		) return 'Weakness Policy';
		if (['dragonenergy', 'lastrespects', 'waterspout'].some(m => moves.has(m))) return 'Choice Scarf';
		if (
			!isDoubles && (ability === 'Imposter' || (species.id === 'magnezone' && role === 'Fast Attacker'))
		) return 'Choice Scarf';
		if (species.id === 'rampardos' && (role === 'Fast Attacker' || isDoubles)) return 'Choice Scarf';
		if (species.id === 'palkia' && counter.get('Status')) return 'Lustrous Orb';
		if (
			moves.has('courtchange') ||
			!isDoubles && (species.id === 'luvdisc' || (species.id === 'terapagos' && !moves.has('rest')))
		) return 'Heavy-Duty Boots';
		if (
			['Cheek Pouch', 'Cud Chew', 'Harvest', 'Ripen'].some(m => ability === m) ||
			moves.has('bellydrum') || moves.has('filletaway')
		) {
			return 'Sitrus Berry';
		}
		if (['healingwish', 'switcheroo', 'trick'].some(m => moves.has(m))) {
			if (
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				role !== 'Wallbreaker' && role !== 'Doubles Wallbreaker' && !counter.get('priority')
			) {
				return 'Choice Scarf';
			} else {
				return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
			}
		}
		if (counter.get('Status') && (species.name === 'Latias' || species.name === 'Latios')) return 'Soul Dew';
		if (species.id === 'scyther' && !isDoubles) return (isLead && !moves.has('uturn')) ? 'Eviolite' : 'Heavy-Duty Boots';
		if (ability === 'Poison Heal' || ability === 'Quick Feet') return 'Toxic Orb';
		if (species.nfe) return 'Eviolite';
		if ((ability === 'Guts' || moves.has('facade')) && !moves.has('sleeptalk')) {
			return (types.includes('Fire') || ability === 'Toxic Boost') ? 'Toxic Orb' : 'Flame Orb';
		}
		if (ability === 'Magic Guard' || (ability === 'Sheer Force' && counter.get('sheerforce'))) return 'Life Orb';
		if (ability === 'Anger Shell') return this.sample(['Rindo Berry', 'Passho Berry', 'Scope Lens', 'Sitrus Berry']);
		if (moves.has('dragondance') && isDoubles) return 'Clear Amulet';
		if (counter.get('skilllink') && ability !== 'Skill Link' && species.id !== 'breloom') {return this.randomChance(3, 5) ? 'Loaded Dice' : 'Type Dice';
			
		}

		if (ability === 'Unburden') {
			return (moves.has('closecombat') || moves.has('leafstorm')) ? 'White Herb' : 'Sitrus Berry';
		}
		if (moves.has('shellsmash') && ability !== 'Weak Armor') return 'White Herb';
		if (moves.has('meteorbeam') || (moves.has('electroshot') && !teamDetails.rain)) return 'Power Herb';
		if (moves.has('acrobatics') && ability !== 'Protosynthesis') return '';
		if (moves.has('auroraveil') || moves.has('lightscreen') && moves.has('reflect')) return 'Light Clay';
		if (ability === 'Gluttony') return `${this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki'])} Berry`;
		if (species.id === 'giratina' && !isDoubles && moves.has('rest') && !moves.has('sleeptalk')) return 'Leftovers';
		if (
			moves.has('rest') && !moves.has('sleeptalk') &&
			ability !== 'Natural Cure' && ability !== 'Shed Skin'
		) {
			return 'Chesto Berry';
		}
		if (
			species.id !== 'yanmega' &&
			this.dex.getEffectiveness('Rock', species) >= 2 && (!types.includes('Flying') || !isDoubles)
		) return 'Heavy-Duty Boots';
	}

	/** Item generation specific to Random Doubles */
	getDoublesItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const scarfReqs = (
			!counter.get('priority') && ability !== 'Speed Boost' && role !== 'Doubles Wallbreaker' &&
			species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
			this.randomChance(1, 2)
		);
		const offensiveRole = (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Doubles Setup Sweeper', 'Offensive Protect'].some(m => role === m)
		);

		if (species.id === 'ursalunabloodmoon' && moves.has('protect')) return 'Silk Scarf';
		if (
			moves.has('flipturn') && moves.has('protect') && (moves.has('aquajet') || (moves.has('jetpunch')))
		) return 'Mystic Water';
		if (counter.get('speedsetup') && role === 'Doubles Bulky Setup') return 'Weakness Policy';
		if (moves.has('blizzard') && ability !== 'Snow Warning' && !teamDetails.snow) return 'Blunder Policy';

		if (role === 'Choice Item user') {
			if (scarfReqs || moves.has('finalgambit') || species.id === 'jirachi') return 'Choice Scarf';
			return (counter.get('Physical') > counter.get('Special')) ? 'Choice Band' : 'Choice Specs';
		}
		if (counter.get('Physical') >= moves.size &&
			['fakeout', 'feint', 'firstimpression', 'rapidspin', 'suckerpunch'].every(m => !moves.has(m)) &&
			(moves.has('flipturn') || moves.has('uturn') || role === 'Doubles Wallbreaker')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			((counter.get('Special') >= moves.size && (moves.has('voltswitch') || role === 'Doubles Wallbreaker')) || (
				counter.get('Special') >= moves.size - 1 && (moves.has('uturn') || moves.has('flipturn'))
			)) && !moves.has('electroweb')
		) {
			return (scarfReqs) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (
			species.baseStats.spe <= 70 && (moves.has('ragepowder') || moves.has('followme'))
		) return 'Rocky Helmet';
		if (
			ability === 'Intimidate' && this.dex.getEffectiveness('Rock', species) >= 1 &&
			(!types.includes('Flying') || this.dex.getEffectiveness('Rock', species) >= 2)
		) return 'Heavy-Duty Boots';
		if (
			(role === 'Bulky Protect' && counter.get('setup')) ||
			['irondefense', 'coil', 'acidarmor', 'wish'].some(m => moves.has(m)) ||
			(counter.get('recovery') && !moves.has('strengthsap') && !counter.get('speedcontrol') && !offensiveRole) ||
			species.id === 'regigigas'
		) return 'Leftovers';
		if (species.id === 'sylveon') return 'Pixie Plate';
		if (
			(offensiveRole || (role === 'Tera Blast user' && (species.baseStats.spe >= 80 || moves.has('trickroom')))) &&
			!moves.has('fakeout') &&
			(!moves.has('uturn') || types.includes('Bug') || ability === 'Libero') &&
			((!moves.has('icywind') && !moves.has('electroweb')) || species.id === 'ironbundle')
		) {
			return (
				(ability === 'Quark Drive' || ability === 'Protosynthesis') && !isLead && species.id !== 'ironvaliant' &&
				['dracometeor', 'firstimpression', 'uturn', 'voltswitch'].every(m => !moves.has(m))
			) ? 'Booster Energy' : 'Life Orb';
		}
		if (isLead && (species.id === 'glimmora' ||
			(['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Offensive Protect'].includes(role) &&
				species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 230))
		) return 'Focus Sash';
		if (
			['Doubles Fast Attacker', 'Doubles Wallbreaker', 'Offensive Protect'].includes(role) && moves.has('fakeout')
		) {
			return (this.dex.getEffectiveness('Rock', species) >= 1) ? 'Heavy-Duty Boots' : 'Clear Amulet';
		}
		if (!counter.get('Status')) return 'Assault Vest';
		return 'Sitrus Berry';
	}

	getItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		const lifeOrbReqs = ['flamecharge', 'nuzzle', 'rapidspin', 'trailblaze'].every(m => !moves.has(m));

		if (
			species.id !== 'jirachi' && (counter.get('Physical') >= moves.size) &&
			['dragontail', 'fakeout', 'firstimpression', 'flamecharge', 'rapidspin'].every(m => !moves.has(m))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				(species.baseStats.atk >= 100 || ability === 'Huge Power' || ability === 'Pure Power') &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && !counter.get('priority') && !moves.has('aquastep')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Band';
		}
		if (
			(counter.get('Special') >= moves.size) ||
			(counter.get('Special') >= moves.size - 1 && ['flipturn', 'uturn'].some(m => moves.has(m)))
		) {
			const scarfReqs = (
				role !== 'Wallbreaker' &&
				species.baseStats.spa >= 100 &&
				species.baseStats.spe >= 60 && species.baseStats.spe <= 108 &&
				ability !== 'Speed Boost' && ability !== 'Tinted Lens' && !moves.has('uturn') && !counter.get('priority')
			);
			return (scarfReqs && this.randomChance(1, 2)) ? 'Choice Scarf' : 'Choice Specs';
		}
		if (counter.get('speedsetup') && role === 'Bulky Setup') return 'Weakness Policy';
		if (
			!counter.get('Status') &&
			!['Fast Attacker', 'Wallbreaker', 'Tera Blast user'].includes(role)
		) {
			return 'Assault Vest';
		}
		if (species.id === 'golem') return (counter.get('speedsetup')) ? 'Weakness Policy' : 'Custap Berry';
		if (moves.has('substitute')) return 'Leftovers';
		if (
			moves.has('stickyweb') && isLead &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) <= 235
		) return 'Focus Sash';
		if (this.dex.getEffectiveness('Rock', species) >= 1) return 'Heavy-Duty Boots';
		if (
			(moves.has('chillyreception') || (
				role === 'Fast Support' &&
				[...PIVOT_MOVES, 'defog', 'mortalspin', 'rapidspin'].some(m => moves.has(m)) &&
				!types.includes('Flying') && ability !== 'Levitate'
			))
		) return 'Heavy-Duty Boots';

		// Low Priority
		if (
			ability === 'Rough Skin' || (
				ability === 'Regenerator' && (role === 'Bulky Support' || role === 'Bulky Attacker') &&
				(species.baseStats.hp + species.baseStats.def) >= 180 && this.randomChance(1, 2)
			) || (
				ability !== 'Regenerator' && !counter.get('setup') && counter.get('recovery') &&
				this.dex.getEffectiveness('Fighting', species) < 1 &&
				(species.baseStats.hp + species.baseStats.def) > 200 && this.randomChance(1, 2)
			)
		) return 'Rocky Helmet';
		if (moves.has('outrage') && counter.get('setup')) return 'Lum Berry';
		if (moves.has('protect') && ability !== 'Speed Boost') return 'Leftovers';
		if (
			role === 'Fast Support' && isLead && !counter.get('recovery') && !counter.get('recoil') &&
			(counter.get('hazards') || counter.get('setup')) &&
			(species.baseStats.hp + species.baseStats.def + species.baseStats.spd) < 258
		) return 'Focus Sash';
		if (
			!counter.get('setup') && ability !== 'Levitate' && this.dex.getEffectiveness('Ground', species) >= 2
		) return 'Air Balloon';
		if (['Bulky Attacker', 'Bulky Support', 'Bulky Setup'].some(m => role === (m))) return 'Leftovers';
		if (species.id === 'pawmot' && moves.has('nuzzle')) return 'Leppa Berry';
		if (role === 'Fast Support' || role === 'Fast Bulky Setup') {
			return (
				counter.get('Physical') + counter.get('Special') > counter.get('Status') && lifeOrbReqs
			) ? 'Life Orb' : 'Leftovers';
		}
		if (role === 'Tera Blast user' && DEFENSIVE_TERA_BLAST_USERS.includes(species.id)) return 'Leftovers';
		if (
			lifeOrbReqs && ['Fast Attacker', 'Setup Sweeper', 'Tera Blast user', 'Wallbreaker'].some(m => role === (m))
		) return 'Life Orb';
		return 'Leftovers';
	}

		/**
	 * Refined singles item picker:
	 * - Allows more variety
	 * - Removes forced HDB just for Rock weakness (keeps it as a weighted option)
	 * - Can pick weakness-resist berries for one of the mon's weaknesses
	 * - Can pick Focus Sash for frail mons or mons with a 4x weakness
	 * - Integrates custom items with gating/weighting rules
	 */
	getRefinedItem(
		ability: string,
		types: string[],
		moves: Set<string>,
		counter: MoveCounter,
		teamDetails: RandomTeamsTypes.TeamDetails,
		species: Species,
		isLead: boolean,
		teraType: string,
		role: RandomTeamsTypes.Role,
	): string {
		// ---- tiny helpers ----
		const hasMove = (id: string) => moves.has(toID(id));
		const baseStats = species.baseStats;

		const isSupportMon = () => {
			// Prefer your role labels if present
			if (role && /support|bulky support|fast support|doubles support|bulky protect|av pivot/i.test(String(role))) return true;

			// Otherwise infer from move choices
			let statusCount = 0;
			let utilityCount = 0;
			for (const m of moves) {
				const mv = this.dex.moves.get(m);
				if (!mv) continue;
				if (mv.category === 'Status') statusCount++;

				// common “support/utility” moves
				if ([
					'stealthrock', 'spikes', 'toxicspikes', 'stickyweb',
					'defog', 'rapidspin', 'mortalspin',
					'reflect', 'lightscreen', 'auroraveil',
					'wish', 'healingwish', 'healpulse', 'lifedew', 'recover', 'roost', 'softboiled', 'slackoff',
					'teleport', 'uturn', 'voltswitch', 'flipturn', 'partingshot',
					'knockoff', 'taunt', 'encore',
				].includes(mv.id)) utilityCount++;
			}
			return statusCount >= 2 || utilityCount >= 2;
		};

		const isFrail = () => {
			const bulk = baseStats.hp + baseStats.def + baseStats.spd;
			return bulk <= 205 || (baseStats.hp <= 70 && (baseStats.def <= 70 || baseStats.spd <= 70));
		};

		const hasQuadWeakness = () => {
			for (const t of this.dex.types.names()) {
				if (t === 'Stellar') continue;
				const eff = this.dex.getEffectiveness(t, species);
				if (eff >= 2) return true; // typically 4x
			}
			return false;
		};

		const hasTypeMove = (typeName: string) => {
			for (const m of moves) {
				const mv = this.dex.moves.get(m);
				if (mv?.type === typeName) return true;
			}
			return false;
		};

		const hasMultihitMove = () => {
			for (const m of moves) {
				const mv = this.dex.moves.get(m);
				if (mv?.multihit) return true;
			}
			return false;
		};

		// ---- weakness berry selection (vanilla berries only) ----
		const berryByType: Record<string, string> = {
			Fire: 'Occa Berry',
			Water: 'Passho Berry',
			Electric: 'Wacan Berry',
			Grass: 'Rindo Berry',
			Ice: 'Yache Berry',
			Fighting: 'Chople Berry',
			Poison: 'Kebia Berry',
			Ground: 'Shuca Berry',
			Flying: 'Coba Berry',
			Psychic: 'Payapa Berry',
			Bug: 'Tanga Berry',
			Rock: 'Charti Berry',
			Ghost: 'Kasib Berry',
			Dragon: 'Haban Berry',
			Dark: 'Colbur Berry',
			Steel: 'Babiri Berry',
			Fairy: 'Roseli Berry',
		};

		const pickWeaknessBerry = (): string | null => {
			const weakTypes: {type: string; eff: number}[] = [];
			for (const t of this.dex.types.names()) {
				if (t === 'Stellar') continue;
				const eff = this.dex.getEffectiveness(t, species);
				if (eff > 0 && berryByType[t]) weakTypes.push({type: t, eff});
			}
			if (!weakTypes.length) return null;

			weakTypes.sort((a, b) => b.eff - a.eff); // prefer bigger weakness
			const chosen = (this.randomChance(7, 10)) ? weakTypes[0] : this.sample(weakTypes);
			return berryByType[chosen.type] || null;
		};

		const weaknessBerry = pickWeaknessBerry();

		// ---- custom item eligibility ----
		// Force Type Dice on multihit users (as requested)
		if (hasMultihitMove()) return 'Type Dice';

		const heavyArmorEligible = isSupportMon();
		const speedBeltEligible = baseStats.spe >= 100;
		const galeEligible = hasTypeMove('Flying');
		const witherEligible = hasTypeMove('Grass');

		const elegantBoost = hasMove('closecombat') || hasMove('leafstorm') || hasMove('dracometeor');

		const sashEligible =
			(isFrail() || hasQuadWeakness()) &&
			ability !== 'Sturdy' &&
			!hasMove('substitute');

		// ---- weighted pool ----
		const pool: string[] = [];

		// baseline common items (keep some stability)
		pool.push(
			'Leftovers', 'Leftovers',
			'Life Orb',
			'Lum Berry',
			'Sitrus Berry',
			'Expert Belt'
		);

		// Rock weakness: no longer forced Boots
		const rockEff = this.dex.getEffectiveness('Rock', species);
		if (rockEff > 0) {
			// Boots still possible, just not mandatory
			pool.push('Heavy-Duty Boots', 'Heavy-Duty Boots');
			// add other survival options
			pool.push('Sitrus Berry', 'Leftovers');
			if (weaknessBerry) pool.push(weaknessBerry);
		} else {
			pool.push('Heavy-Duty Boots');
		}

		// Weakness berry option
		if (weaknessBerry) {
			pool.push(weaknessBerry, weaknessBerry);
		}

		// Focus Sash option for frail/4x
		if (sashEligible) {
			pool.push('Focus Sash', 'Focus Sash', 'Focus Sash');
		}

		// Your “any mon can randomly get sometimes” custom items
		pool.push(
			'Fuzzy Mushroom',
			'Lucky Petal',
			'Rainbow Core',
			'Mimic Wand',
			'Twilight Mirror',
			'Prism Pearl'
		);

		// Gated custom items
		if (heavyArmorEligible) pool.push('Heavy Armor', 'Heavy Armor');
		if (speedBeltEligible) pool.push('Speed Belt', 'Speed Belt');
		if (galeEligible) pool.push('Gale Pendant', 'Gale Pendant');
		if (witherEligible) pool.push('Witherseed Relic', 'Witherseed Relic');

		// Elegant Band weighting
		if (elegantBoost) {
			pool.push('Elegant Band', 'Elegant Band', 'Elegant Band', 'Elegant Band');
		} else {
			pool.push('Elegant Band'); // still appears sometimes
		}

		// ---- filter to existing items (supports mods; silently drops missing customs) ----
		const filtered: string[] = [];
		for (const it of pool) {
			const item = this.dex.items.get(it);
			if (!item || item.exists === false) continue;
			if (item.isNonstandard) continue; // optional; remove if you want nonstandard
			filtered.push(item.name);
		}

		return filtered.length ? this.sample(filtered) : 'Leftovers';
	}


	getLevel(
	species: Species,
	isDoubles: boolean,
): number {
	if (this.adjustLevel) return this.adjustLevel;
	return 100;
}


	getForme(species: Species): string {
		if (typeof species.battleOnly === 'string') {
			// Only change the forme. The species has custom moves, and may have different typing and requirements.
			return species.battleOnly;
		}
		if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));

		// Consolidate mostly-cosmetic formes, at least for the purposes of Random Battles
		if (['Dudunsparce', 'Magearna', 'Maushold', 'Polteageist', 'Sinistcha', 'Zarude'].includes(species.baseSpecies)) {
			return this.sample([species.name].concat(species.otherFormes!));
		}
		if (species.baseSpecies === 'Basculin') return 'Basculin' + this.sample(['', '-Blue-Striped']);
		if (species.baseSpecies === 'Pikachu') {
			return 'Pikachu' + this.sample(
				['', '-Original', '-Hoenn', '-Sinnoh', '-Unova', '-Kalos', '-Alola', '-Partner', '-World']
			);
		}
		return species.name;
	}
private randomFallbackSet(
  species: Species,
  teamDetails: RandomTeamsTypes.TeamDetails,
  isLead: boolean,
  isDoubles: boolean
): RandomTeamsTypes.RandomSet {
  // Ability: keep your existing logic
  const abilities = Object.values(species.abilities)
    .filter(a => a && this.dex.abilities.get(a).exists && !this.dex.abilities.get(a).isNonstandard);
  const ability = (this.gen <= 2) ? 'No Ability' : (abilities.length ? this.sample(abilities) : 'No Ability');
  const abil = toID(ability);

  const preferPhysical = species.baseStats.atk >= species.baseStats.spa;

  // ----------------------------
  // Global move pools (from anywhere)
  // ----------------------------
  const allMoves = this.dex.moves.all()
    .filter(m =>
      m.exists &&
      !m.isNonstandard &&
      !m.isZ &&
      !m.isMax &&
      !m.realMove
    );

  const damaging = allMoves.filter(m => m.category !== 'Status');
  const status = allMoves.filter(m => m.category === 'Status');

  const dmgPref = damaging.filter(m => m.category === (preferPhysical ? 'Physical' : 'Special'));
  const dmgAny = damaging;

  const setupMoveIds: ID[] = [
    'calmmind','swordsdance','dragondance','quiverdance','nastyplot','bulkup','coil',
    'agility','rockpolish','shellsmash','shiftgear','workup','autotomize'
  ].map(toID);

  const contraryPackage: ID[] = [
    'leafstorm','superpower','overheat','dracometeor','psychoboost','vcreate','fleurcannon'
  ].map(toID);

  const drainingMoveIds: ID[] = [
    'gigadrain','drainpunch','drainingkiss','oblivionwing','paraboliccharge','hornleech','leechlife'
  ].map(toID);

  const facadeId = toID('facade');

  // Helpers
  const pick = <T>(arr: T[]) => (arr.length ? this.sample(arr) : null);

  const isRecoilMove = (m: Move) => !!m.recoil || !!m.hasCrashDamage || !!m.mindBlownRecoil || m.selfdestruct === 'always';

  const moveHasSecondaryOrFlinch = (m: Move) =>
    (m.secondary || (m.secondaries && m.secondaries.length)) || m.volatileStatus === 'flinch';

  const isPunch = (m: Move) => !!m.flags?.punch;
  const isBite = (m: Move) => !!m.flags?.bite;

  // Type chart helpers (casts avoid TS pain in older forks)
  const isSuperEffectiveTypeOnType = (atkType: string, defType: string) => {
    // dummy target with a single type
    const dummy = {types: [defType]} as any;
    return this.dex.getEffectiveness(atkType, dummy) > 0;
  };

  const getWeaknessTypes = () => {
    const types = this.dex.types.all().map(t => t.name).filter(t => t !== '???');
    // types that hit THIS species super effectively
    return types.filter(t => this.dex.getEffectiveness(t, species as any) > 0);
  };

  const weaknesses = getWeaknessTypes();

  // Candidates with biases
  const filteredDamagingPool = (() => {
    let pool = dmgPref.length ? dmgPref : dmgAny;

    // Sheer Force: avoid recoil/crash/selfdestruct-y moves
    if (abil === 'sheerforce') pool = pool.filter(m => !isRecoilMove(m));

    // Iron Fist / Strong Jaw: prefer punch/bite moves (we'll bias selection below)
    return pool;
  })();

  const stabCandidatesForType = (type: string) => {
    let pool = filteredDamagingPool.filter(m => m.type === type);
    // Serene Grace bias: prefer secondaries/flinch when possible
    if (abil === 'serenegrace') {
      const sg = pool.filter(moveHasSecondaryOrFlinch);
      if (sg.length) pool = sg;
    }
    // Triage bias: prefer draining moves if possible
    if (abil === 'triage') {
      const tri = pool.filter(m => drainingMoveIds.includes(m.id));
      if (tri.length) pool = tri;
    }
    // Contrary package: prefer those specific moves if they match type/category
    if (abil === 'contrary') {
      const con = pool.filter(m => contraryPackage.includes(m.id));
      if (con.length) pool = con;
    }
    // Iron Fist / Strong Jaw bias on STAB too
    if (abil === 'ironfist') {
      const p = pool.filter(isPunch);
      if (p.length) pool = p;
    }
    if (abil === 'strongjaw') {
      const b = pool.filter(isBite);
      if (b.length) pool = b;
    }
    return pool;
  };

  const coverageCandidates = () => {
    let pool = filteredDamagingPool;

    // Serene Grace: prefer secondary/flinch coverage if possible
    if (abil === 'serenegrace') {
      const sg = pool.filter(moveHasSecondaryOrFlinch);
      if (sg.length) pool = sg;
    }
    // Triage: prefer draining moves
    if (abil === 'triage') {
      const tri = pool.filter(m => drainingMoveIds.includes(m.id));
      if (tri.length) pool = tri;
    }
    // Contrary: prefer contrary package
    if (abil === 'contrary') {
      const con = pool.filter(m => contraryPackage.includes(m.id));
      if (con.length) pool = con;
    }
    // Iron Fist / Strong Jaw biases
    if (abil === 'ironfist') {
      const p = pool.filter(isPunch);
      if (p.length) pool = p;
    }
    if (abil === 'strongjaw') {
      const b = pool.filter(isBite);
      if (b.length) pool = b;
    }
    return pool;
  };

  const pickCoverageVsWeakness = () => {
    // pick a move whose TYPE is super-effective vs at least one of the species weaknesses
    const cov = coverageCandidates().filter(m => {
      // avoid repeating exact STAB types for the special “anti-weakness” slot
      if (species.types.includes(m.type)) return false;
      return weaknesses.some(w => isSuperEffectiveTypeOnType(m.type, w));
    });

    // If nothing hits a weakness, fall back to any non-STAB coverage
    return pick((cov.length ? cov : coverageCandidates().filter(m => !species.types.includes(m.type))) );
  };

  const pickRandomCoverage = (excludeTypes: string[] = []) => {
    let pool = coverageCandidates().filter(m => !excludeTypes.includes(m.type));
    // try to avoid duplicating STAB types unless we have to
    const nonStab = pool.filter(m => !species.types.includes(m.type));
    if (nonStab.length) pool = nonStab;
    return pick(pool);
  };

  const pickRandomStatusFromAnywhere = (excludeIds: Set<ID>) => {
    let pool = status.filter(m => !excludeIds.has(m.id));

    // Prankster: prefer “actionable” status
    if (abil === 'prankster') {
      const good = ['taunt','encore','thunderwave','willowisp','toxic','spore','substitute','recover','roost','protect','haze']
        .map(toID);
      const preferred = pool.filter(m => good.includes(m.id));
      if (preferred.length) pool = preferred;
    }

    return pick(pool);
  };

  // ----------------------------
  // Slot-based move selection
  // ----------------------------
  const moves: ID[] = [];
  const used = new Set<ID>();

  const types = species.types;
  const type1 = types[0];
  const type2 = types[1];

  // Slot 1: STAB type1
  const stab1 = pick(stabCandidatesForType(type1));
  if (stab1) { moves.push(stab1.id); used.add(stab1.id); }

  // Slot 2:
  if (type2) {
    // Dual type: STAB type2
    const stab2Pool = stabCandidatesForType(type2).filter(m => !used.has(m.id));
    const stab2 = pick(stab2Pool);
    if (stab2) { moves.push(stab2.id); used.add(stab2.id); }
  } else {
    // Single type: coverage that hits one of our weaknesses super effectively
    const cov = pickCoverageVsWeakness();
    if (cov) { moves.push(cov.id); used.add(cov.id); }
  }

  // Determine if species *learns* setup (from its actual learnset/movepool)
  const learns = new Set([...this.dex.species.getMovePool(species.id)]);
  const learnedSetups = setupMoveIds.filter(id => learns.has(id));

  // Slot 3: Status from anywhere, unless it learns setup (75% setup / 25% other status)
  let slot3: ID | null = null;
  if (learnedSetups.length && this.randomChance(3, 4)) {
    // 75%
    slot3 = pick(learnedSetups.filter(id => !used.has(id))) || null;
  }
  if (!slot3) {
    const st = pickRandomStatusFromAnywhere(used);
    slot3 = st ? st.id : null;
  }
  if (slot3) { moves.push(slot3); used.add(slot3); }

  // Slot 4: random coverage (damaging) from anywhere
  const excludeTypes = [...new Set(types)]; // avoid STAB types if possible
  let slot4 = pickRandomCoverage(excludeTypes);
  if (slot4 && used.has(slot4.id)) {
    // try again a couple times
    for (let i = 0; i < 3; i++) {
      const retry = pickRandomCoverage(excludeTypes);
      if (retry && !used.has(retry.id)) { slot4 = retry; break; }
    }
  }
  if (slot4) { moves.push(slot4.id); used.add(slot4.id); }

  // If we somehow ended up short, fill with anything damaging of preferred category
  while (moves.length < this.maxMoveCount) {
    const filler = pick(filteredDamagingPool.filter(m => !used.has(m.id)));
    if (!filler) break;
    moves.push(filler.id); used.add(filler.id);
  }

  // ----------------------------
  // Ability-driven item & move adjustments
  // ----------------------------
  let itemId: ID | null = null;

  // Guts: Flame Orb + Facade (physical only makes sense)
  if (abil === 'guts' && this.dex.items.get('flameorb').exists) {
    itemId = toID('flameorb');
    if (preferPhysical && !moves.includes(facadeId)) {
      // Prefer to put Facade in the last slot if it's currently Status/duplicate-ish
      moves[moves.length - 1] = facadeId;
    }
  }

  // Poison Heal: Toxic Orb
  if (abil === 'poisonheal' && this.dex.items.get('toxicorb').exists) {
    itemId = toID('toxicorb');
  }

  // Sheer Force: Life Orb (already filtered recoil moves above)
  if (abil === 'sheerforce' && this.dex.items.get('lifeorb').exists) {
    itemId = toID('lifeorb');
  }

  // Magic Guard: Life Orb
  if (abil === 'magicguard' && this.dex.items.get('lifeorb').exists) {
    itemId = toID('lifeorb');
  }

  // Unburden: consumable item bias
  if (!itemId && abil === 'unburden') {
    const candidates = ['sitrusberry','whiteherb','focussash','redcard','electricseed','grassyseed','psychicseed','mistyseed']
      .map(toID)
      .filter(id => this.dex.items.get(id).exists);
    itemId = pick(candidates) || null;
  }

  // Weather setters
  if (!itemId && abil === 'drizzle' && this.dex.items.get('damprock').exists) itemId = toID('damprock');
  if (!itemId && abil === 'drought' && this.dex.items.get('heatrock').exists) itemId = toID('heatrock');

  // ----------------------------
  // Stat-based heavy Choice weighting
  // If Choice picked -> NO Status moves allowed.
  // ----------------------------
  const atk = species.baseStats.atk;
  const spa = species.baseStats.spa;
  const spe = species.baseStats.spe;

  const choiceBand = toID('choiceband');
  const choiceSpecs = toID('choicespecs');
  const choiceScarf = toID('choicescarf');

  const canBand = this.dex.items.get(choiceBand).exists;
  const canSpecs = this.dex.items.get(choiceSpecs).exists;
  const canScarf = this.dex.items.get(choiceScarf).exists;

  // If item wasn't forced by ability, roll a weighted item
  if (!itemId) {
    const weighted: Array<{id: ID, weight: number}> = [];

    // baseline good items
    const add = (id: ID, w: number) => { if (this.dex.items.get(id).exists) weighted.push({id, weight: w}); };
    add(toID('leftovers'), 12);
    add(toID('heavydutyboots'), 10);
    add(toID('lifeorb'), 10);
    add(toID('focussash'), 8);
    add(toID('assaultvest'), 6);

    // heavy Choice weighting by stats
    if (atk > 100 && canBand) weighted.push({id: choiceBand, weight: 35});
    if (spa > 100 && canSpecs) weighted.push({id: choiceSpecs, weight: 35});
    if (spe > 100 && canScarf) weighted.push({id: choiceScarf, weight: 35});

    // Weighted pick
    const total = weighted.reduce((s, x) => s + x.weight, 0);
    let r = this.random(total || 1);
    itemId = (weighted.length ? weighted[weighted.length - 1].id : toID('leftovers'));
    for (const x of weighted) {
      r -= x.weight;
      if (r < 0) { itemId = x.id; break; }
    }
  }

  const isChoice = itemId === choiceBand || itemId === choiceSpecs || itemId === choiceScarf;

  if (isChoice) {
    // Replace any Status moves with damaging coverage (preferred category)
    for (let i = 0; i < moves.length; i++) {
      const m = this.dex.moves.get(moves[i]);
      if (m.category === 'Status') {
        const replacement = pickRandomCoverage([...new Set(species.types)]);
        if (replacement) moves[i] = replacement.id;
      }
    }
    // Ensure all moves are damaging; if still not, brute fill
    for (let i = 0; i < moves.length; i++) {
      const m = this.dex.moves.get(moves[i]);
      if (m.category === 'Status') {
        const rep = pick(filteredDamagingPool);
        if (rep) moves[i] = rep.id;
      }
    }
  }

  // ----------------------------
  // Final set fields
  // ----------------------------
  const item = itemId ? this.dex.items.get(itemId).name : '';

  // ---- Nature + EV selection based on base stats (and item/ability overrides) ----

const preferSpecial = spa >= atk + 15;

// Speed nature thresholds (with overrides)
let effectiveSpe = spe;

// Choice Scarf => always treat as fast (force Jolly/Timid)
const isChoiceScarf = itemId === toID('choicescarf');

// Speed-multiplier abilities => treat Speed as higher for nature decision
const speedBoostAbilities = new Set<ID>([
  'swiftswim','chlorophyll','sandrush','slushrush','surgesurfer','quickfeet','unburden',
].map(toID));

if (speedBoostAbilities.has(abil)) effectiveSpe += 30;
if (isChoiceScarf) effectiveSpe += 999; // guarantees Timid/Jolly path

let wantSpeedNature = false;
if (effectiveSpe >= 95) wantSpeedNature = true;
else if (effectiveSpe <= 75) wantSpeedNature = false;
else wantSpeedNature = this.randomChance(1, 2); // 76–94: 50/50

let nature: string;
let evs: StatsTable;

// Default IVs (you can later adjust for special cases like Trick Room, Gyro Ball, etc.)
const ivs: StatsTable = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

if (preferPhysical) {
  nature = wantSpeedNature ? 'Jolly' : 'Adamant';
  // If speed nature: max Atk/Spe; otherwise max Atk/HP (bulkier breaker)
  evs = wantSpeedNature
    ? {hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252}
    : {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0};
} else if (preferSpecial) {
  nature = wantSpeedNature ? 'Timid' : 'Modest';
  evs = wantSpeedNature
    ? {hp: 0, atk: 0, def: 4, spa: 252, spd: 0, spe: 252}
    : {hp: 252, atk: 0, def: 4, spa: 252, spd: 0, spe: 0};
} else {
  // Mixed / unclear: choose based on which attacking stat is higher, then apply speed rule
  const physicalLeaning = atk >= spa;
  if (physicalLeaning) {
    nature = wantSpeedNature ? 'Jolly' : 'Adamant';
    evs = wantSpeedNature
      ? {hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252}
      : {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0};
  } else {
    nature = wantSpeedNature ? 'Timid' : 'Modest';
    evs = wantSpeedNature
      ? {hp: 0, atk: 0, def: 4, spa: 252, spd: 0, spe: 252}
      : {hp: 252, atk: 0, def: 4, spa: 252, spd: 0, spe: 0};
  }
}


  const level = this.getLevel(species, isDoubles); // your getLevel returns 100

  return {
    name: species.baseSpecies,
    species: species.name,
    item,
    ability,
    moves: moves.slice(0, this.maxMoveCount),
    nature,
    evs,
    ivs,
    level,
    shiny: this.randomChance(1, 1024),
    gender: species.baseSpecies === 'Greninja' ? 'M' : (species.gender || (this.random(2) ? 'F' : 'M')),
  };
}


	randomSet(
  s: string | Species,
  teamDetails: RandomTeamsTypes.TeamDetails = {},
  isLead = false,
  isDoubles = false
): RandomTeamsTypes.RandomSet {
  const species = this.dex.species.get(s);
  const formeName = this.getForme(species);
  const forme = this.dex.species.get(formeName);

  const table = this[`random${isDoubles ? 'Doubles' : ''}Sets`];

  // Prefer exact forme entry, then base species entry
  const entry =
    table[forme.id] ||
    table[species.id] ||
    (species.baseSpecies ? table[toID(species.baseSpecies)] : undefined);

  // If not in sets.json, generate a fallback set instead of throwing
  if (!entry || !entry.sets) {
    return this.randomFallbackSet(forme.exists ? forme : species, teamDetails, isLead, isDoubles);
  }

  const sets = entry.sets;
  const possibleSets: RandomTeamsTypes.RandomSetData[] = [];
  // ...rest of your existing randomSet logic...



		const ruleTable = this.dex.formats.getRuleTable(this.format);

		for (const set of sets) {
			// Prevent Fast Bulky Setup on lead Paradox Pokemon, since it generates Booster Energy.
			const abilities = set.abilities!;
			if (
				isLead && (abilities.includes('Protosynthesis') || abilities.includes('Quark Drive')) &&
				set.role === 'Fast Bulky Setup'
			) continue;
			// Prevent Tera Blast user if the team already has one, or if Terastallizion is prevented.
			if ((teamDetails.teraBlast || ruleTable.has('terastalclause')) && set.role === 'Tera Blast user') {
				continue;
			}
			possibleSets.push(set);
		}
		const set = this.sampleIfArray(possibleSets);
		const role = set.role;
		const movePool: string[] = [];
		for (const movename of set.movepool) {
			movePool.push(this.dex.moves.get(movename).id);
		}
		const teraTypes = set.teraTypes!;
		let teraType = this.sampleIfArray(teraTypes);

		let ability = '';
		let item = undefined;

		const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
		const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

		const types = species.types;
		const abilities = set.abilities!;

		// Get moves
		const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
		const counter = this.queryMoves(moves, species, teraType, abilities);

		// Get ability
		ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);

		// Get items
		// First, the priority items
		item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
		if (item === undefined) {
			if (isDoubles) {
				item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			} else {
				// NEW refined singles fallback
				item = this.getRefinedItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
			}
		}

		// Get level
		const level = this.getLevel(species, isDoubles);

		// Prepare optimal HP
		const srImmunity = ability === 'Magic Guard' || item === 'Heavy-Duty Boots';
		let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness('Rock', species);
		// Crash damage move users want an odd HP to survive two misses
		if (['axekick', 'highjumpkick', 'jumpkick', 'supercellslam'].some(m => moves.has(m))) srWeakness = 2;
		while (evs.hp > 1) {
			const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if ((moves.has('substitute') && ['Sitrus Berry'].includes(item)) || species.id === 'minior') {
				// Two Substitutes should activate Sitrus Berry. Two switch-ins to Stealth Rock should activate Shields Down on Minior.
				if (hp % 4 === 0) break;
			} else if (
				(moves.has('bellydrum') || moves.has('filletaway') || moves.has('shedtail')) &&
				(item === 'Sitrus Berry' || ability === 'Gluttony')
			) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else if (moves.has('substitute') && moves.has('endeavor')) {
				// Luvdisc should be able to Substitute down to very low HP
				if (hp % 4 > 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins in singles
				if (isDoubles) break;
				if (srWeakness <= 0 || ability === 'Regenerator' || ['Leftovers', 'Life Orb'].includes(item)) break;
				if (item !== 'Sitrus Berry' && hp % (4 / srWeakness) > 0) break;
				// Minimise number of Stealth Rock switch-ins to activate Sitrus Berry
				if (item === 'Sitrus Berry' && hp % (4 / srWeakness) === 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		const noAttackStatMoves = [...moves].every(m => {
			const move = this.dex.moves.get(m);
			if (move.damageCallback || move.damage) return true;
			if (move.id === 'shellsidearm') return false;
			// Physical Tera Blast
			if (
				move.id === 'terablast' && (species.id === 'porygon2' || ['Contrary', 'Defiant'].includes(ability) ||
					moves.has('shiftgear') || species.baseStats.atk > species.baseStats.spa)
			) return false;
			return move.category !== 'Physical' || move.id === 'bodypress' || move.id === 'foulplay';
		});
		if (noAttackStatMoves && !moves.has('transform') && this.format.mod !== 'partnersincrime') {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (moves.has('gyroball') || moves.has('trickroom')) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		// Enforce Tera Type after all set generation is done to prevent infinite generation
		if (this.forceTeraType) teraType = this.forceTeraType;

		// shuffle moves to add more randomness to camomons
		// shuffle moves to add more randomness to camomons
const shuffledMoves = Array.from(moves);
this.prng.shuffle(shuffledMoves);

// 50% chance to replace the 4th move with a custom wildcard move,
// but cap the ENTIRE TEAM to max 3 custom wildcard moves total.
const td = teamDetails as RandomTeamsTypes.TeamDetails & {customMoveCount?: number};
if (
  shuffledMoves.length >= 4 &&
  (td.customMoveCount || 0) < 3 &&
  this.randomChance(1, 3) // 33%
) {
  const wildcard = this.pickWildcardCustomMove(species, moves, {types, ability, teraType});

  if (wildcard) {
    // Replace slot 4 (index 3). Also avoid duplicates.
    const wid = toID(wildcard);
    if (!shuffledMoves.map(m => toID(m)).includes(wid)) {
      shuffledMoves[3] = wildcard;
      td.customMoveCount = (td.customMoveCount || 0) + 1;
    }
  }
}

return {
  name: species.baseSpecies,
  species: forme.name,
  gender: species.baseSpecies === 'Greninja' ? 'M' : (species.gender || (this.random(2) ? 'F' : 'M')),
  shiny: this.randomChance(1, 1024),
  level,
  moves: shuffledMoves,
  ability,
  evs,
  ivs,
  item,
  teraType,
  role,
};

	}

	getPokemonPool(
		type: string,
		pokemonToExclude: RandomTeamsTypes.RandomSet[] = [],
		isMonotype = false,
		pokemonList: string[]
	): [{ [k: string]: string[] }, string[]] {
		const exclude = pokemonToExclude.map(p => toID(p.species));
		const pokemonPool: { [k: string]: string[] } = {};
		const baseSpeciesPool = [];
		for (const pokemon of pokemonList) {
			let species = this.dex.species.get(pokemon);
			if (exclude.includes(species.id)) continue;
			if (isMonotype) {
				if (!species.types.includes(type)) continue;
				if (typeof species.battleOnly === 'string') {
					species = this.dex.species.get(species.battleOnly);
					if (!species.types.includes(type)) continue;
				}
			}

			if (species.baseSpecies in pokemonPool) {
				pokemonPool[species.baseSpecies].push(pokemon);
			} else {
				pokemonPool[species.baseSpecies] = [pokemon];
			}
		}
		// Include base species 1x if 1-3 formes, 2x if 4-6 formes, 3x if 7+ formes
		for (const baseSpecies of Object.keys(pokemonPool)) {
			// Squawkabilly has 4 formes, but only 2 functionally different formes, so only include it 1x
			const weight = (baseSpecies === 'Squawkabilly') ? 1 : Math.min(Math.ceil(pokemonPool[baseSpecies].length / 3), 3);
			for (let i = 0; i < weight; i++) baseSpeciesPool.push(baseSpecies);
		}
		return [pokemonPool, baseSpeciesPool];
	}

	randomSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./sets.json');
	randomDoublesSets: { [species: string]: RandomTeamsTypes.RandomSpeciesData } = require('./doubles-sets.json');

		randomTeam() {
		this.enforceNoDirectCustomBanlistChanges();

		const seed = this.prng.getSeed();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const pokemon: RandomTeamsTypes.RandomSet[] = [];

		// ============================================================
		// TUNABLE SETTINGS
		// ============================================================
		// Set to false to fully remove "type-cap" and "weakness-cap" filtering.
		// (Recommended while you’re still adding custom types / unfinished learnsets.)
		const USE_TYPE_AND_WEAKNESS_CAPS = false;

		// Extra loosen factor when caps are enabled.
		// If you later flip USE_TYPE_AND_WEAKNESS_CAPS=true, this makes the caps scale
		// up automatically if you have more than the standard 18 types.
		const BASELINE_TYPE_COUNT = 18;
		// ============================================================

		// For Monotype
		const isMonotype = !!this.forceMonotype || ruleTable.has('sametypeclause');
		const isDoubles = this.format.gameType !== 'singles';

		// IMPORTANT: use *all* types your dex knows about (including custom),
		// but still exclude Stellar from random type picking like vanilla does.
		const typeNames = this.dex.types.names().filter(name => name !== "Stellar");

		const type = this.forceMonotype || this.sample(typeNames);

		// PotD stuff
		const usePotD = global.Config && Config.potd && ruleTable.has('potd');
		const potd = usePotD ? this.dex.species.get(Config.potd) : null;

		const baseFormes: { [k: string]: number } = {};

		const typeCount: { [k: string]: number } = {};
		const typeComboCount: { [k: string]: number } = {};
		const typeWeaknesses: { [k: string]: number } = {};
		const typeDoubleWeaknesses: { [k: string]: number } = {};
		const teamDetails: RandomTeamsTypes.TeamDetails & {customMoveCount?: number} = {};
teamDetails.customMoveCount = 0;

		let numMaxLevelPokemon = 0;

		// Debug tracking that will show in the popup error box
		const triedSpecies: string[] = [];
		const skipReasons: { [k: string]: number } = {};
		const addSkip = (reason: string) => {
			skipReasons[reason] = (skipReasons[reason] || 0) + 1;
		};

		const pokemonList = this.dex.species.all()
  .filter(s =>
    s.exists &&
	!s.isNonstandard        // optional (or allow, your getPokemonPool already groups formes)
  )
  .map(s => s.id);

		const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);

		// If your curated sets list ends up empty, fail loudly with useful info.
		if (!baseSpeciesPool.length) {
			throw new Error(
				`Could not build a random team for ${this.format} (seed=${seed})\n` +
				`- Built Pokémon: ${pokemon.length}/${this.maxTeamSize}\n` +
				`- Gametype: ${this.format.gameType}\n` +
				`- Monotype: ${isMonotype}\n` +
				`- Forced Type: ${this.forceMonotype || 'none'}\n` +
				`- Note: baseSpeciesPool is empty (no eligible Pokémon in randomSets/randomDoublesSets).`
			);
		}

		let leadsRemaining = this.format.gameType === 'doubles' ? 2 : 1;

		// Cap scaling if enabled (auto-loosens when you have more than 18 types)
		const typeScale = Math.max(1, Math.ceil(typeNames.length / BASELINE_TYPE_COUNT));
		const limitFactor = Math.round(this.maxTeamSize / 6) || 1;

		// Vanilla-ish limits, scaled if you have more types:
		const maxSameType = (2 * limitFactor) * typeScale;              // default vanilla-ish: 2 per type
		const maxWeakToType = (3 * limitFactor) * typeScale;            // default vanilla-ish: 3 weak to a type
		const maxDoubleWeakToType = (1 * limitFactor) * typeScale;      // default vanilla-ish: 1 double-weak to a type
		const maxWeakToFreezeDry = (4 * limitFactor) * typeScale;       // default vanilla-ish: 4 weak to Freeze-Dry
		const maxTypeComboInMonotype = (3 * limitFactor) * typeScale;   // default vanilla-ish: 3 of same combo in monotype

		while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
			const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
			let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
			if (!species.exists) {
				addSkip('missing-species');
				continue;
			}

			// Track attempts for debug
			triedSpecies.push(species.id);
			if (triedSpecies.length > 12) triedSpecies.shift();

			// Limit to one of each species (Species Clause)
			if (baseFormes[species.baseSpecies]) {
				addSkip('species-clause');
				continue;
			}

			// Treat Ogerpon formes and Terapagos like the Tera Blast user role; reject if team has one already
			if (['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id) && teamDetails.teraBlast) {
				addSkip('tera-blast-user-duplicate');
				continue;
			}

			// Illusion shouldn't be on the last slot
			if (species.baseSpecies === 'Zoroark' && pokemon.length >= (this.maxTeamSize - 1)) {
				addSkip('illusion-last-slot');
				continue;
			}

			const types = species.types;
			const typeCombo = types.slice().sort().join();
			const weakToFreezeDry = (
				this.dex.getEffectiveness('Ice', species) > 0 ||
				(this.dex.getEffectiveness('Ice', species) > -2 && types.includes('Water'))
			);

			if (!isMonotype && !this.forceMonotype && USE_TYPE_AND_WEAKNESS_CAPS) {
				let skip = false;

				// Limit "too many of any type"
				for (const typeName of types) {
					if ((typeCount[typeName] || 0) >= maxSameType) {
						addSkip('type-cap');
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit weaknesses
				for (const typeName of typeNames) {
					const eff = this.dex.getEffectiveness(typeName, species);

					// weak
					if (eff > 0) {
						const curWeak = (typeWeaknesses[typeName] || 0);
						if (curWeak >= maxWeakToType) {
							addSkip('weakness-cap');
							skip = true;
							break;
						}
					}
					// double weak
					if (eff > 1) {
						const curDWeak = (typeDoubleWeaknesses[typeName] || 0);
						if (curDWeak >= maxDoubleWeakToType) {
							addSkip('double-weakness-cap');
							skip = true;
							break;
						}
					}
				}
				if (skip) continue;

				// Count Dry Skin/Fluffy as Fire weaknesses
				if (
					this.dex.getEffectiveness('Fire', species) === 0 &&
					Object.values(species.abilities).filter(a => ['Dry Skin', 'Fluffy'].includes(a)).length
				) {
					const curWeak = (typeWeaknesses['Fire'] || 0);
					if (curWeak >= maxWeakToType) {
						addSkip('weakness-cap');
						continue;
					}
				}

				// Limit weak to Freeze-Dry
				if (weakToFreezeDry) {
					const curWeakFD = (typeWeaknesses['Freeze-Dry'] || 0);
					if (curWeakFD >= maxWeakToFreezeDry) {
						addSkip('freeze-dry-cap');
						continue;
					}
				}

				// Limit one level 100 Pokemon
				if (!this.adjustLevel && (this.getLevel(species, isDoubles) === 100) && numMaxLevelPokemon >= limitFactor) {
					addSkip('level-100-cap');
					continue;
				}
			}

			// Limit type combos in Monotype (optional caps)
			if (!this.forceMonotype && isMonotype && USE_TYPE_AND_WEAKNESS_CAPS) {
				if (((typeComboCount[typeCombo] || 0) >= maxTypeComboInMonotype)) {
					addSkip('typecombo-cap');
					continue;
				}
			}

			// The Pokemon of the Day
			if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;

			let set: RandomTeamsTypes.RandomSet;

			try {
				if (leadsRemaining) {
					if (
						isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) ||
						!isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)
					) {
						if (pokemon.length + leadsRemaining === this.maxTeamSize) {
							addSkip('no-lead-forced-last-slot');
							continue;
						}
						set = this.randomSet(species, teamDetails, false, isDoubles);
						pokemon.push(set);
					} else {
						set = this.randomSet(species, teamDetails, true, isDoubles);
						pokemon.unshift(set);
						leadsRemaining--;
					}
				} else {
					set = this.randomSet(species, teamDetails, false, isDoubles);
					pokemon.push(set);
				}
			} catch (e) {
				// If randomSet blows up (often missing sets / bad movepool / etc), count it and keep trying.
				addSkip('randomset-error');
				continue;
			}

			// Don't bother tracking details for the last Pokemon
			if (pokemon.length === this.maxTeamSize) break;

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[species.baseSpecies] = 1;

			// Increment type counters
			for (const typeName of types) {
				typeCount[typeName] = (typeCount[typeName] || 0) + 1;
			}
			typeComboCount[typeCombo] = (typeComboCount[typeCombo] || 0) + 1;

			// Increment weakness counters (SAFE increments - never NaN)
			for (const typeName of typeNames) {
				const eff = this.dex.getEffectiveness(typeName, species);
				if (eff > 0) typeWeaknesses[typeName] = (typeWeaknesses[typeName] || 0) + 1;
				if (eff > 1) typeDoubleWeaknesses[typeName] = (typeDoubleWeaknesses[typeName] || 0) + 1;
			}
			// Count Dry Skin/Fluffy as Fire weaknesses
			if (['Dry Skin', 'Fluffy'].includes(set.ability) && this.dex.getEffectiveness('Fire', species) === 0) {
				typeWeaknesses['Fire'] = (typeWeaknesses['Fire'] || 0) + 1;
			}
			if (weakToFreezeDry) typeWeaknesses['Freeze-Dry'] = (typeWeaknesses['Freeze-Dry'] || 0) + 1;

			// Increment level 100 counter
			if (set.level === 100) numMaxLevelPokemon++;

			// Track what the team has
			if (set.ability === 'Drizzle' || set.moves.includes('raindance')) teamDetails.rain = 1;
			if (set.ability === 'Drought' || set.ability === 'Orichalcum Pulse' || set.moves.includes('sunnyday')) {
				teamDetails.sun = 1;
			}
			if (set.ability === 'Crystallization') {
				const allTypes = Object.values(this.dex.types)
				.filter(t => t.exists && !t.isNonstandard)
				.map(t => t.name);
				const gemType = this.sample(allTypes);
				set.item = `${gemType} Gem`;
			}


			if (set.ability === 'Sand Stream') teamDetails.sand = 1;
			if (set.ability === 'Snow Warning' || set.moves.includes('snowscape') || set.moves.includes('chillyreception')) {
				teamDetails.snow = 1;
			}
			if (set.moves.includes('healbell')) teamDetails.statusCure = 1;
			if (set.moves.includes('spikes') || set.moves.includes('ceaselessedge')) {
				teamDetails.spikes = (teamDetails.spikes || 0) + 1;
			}
			if (set.moves.includes('toxicspikes') || set.ability === 'Toxic Debris') teamDetails.toxicSpikes = 1;
			if (set.moves.includes('stealthrock') || set.moves.includes('stoneaxe')) teamDetails.stealthRock = 1;
			if (set.moves.includes('stickyweb')) teamDetails.stickyWeb = 1;
			if (set.moves.includes('defog')) teamDetails.defog = 1;
			if (set.moves.includes('rapidspin') || set.moves.includes('mortalspin')) teamDetails.rapidSpin = 1;
			if (set.moves.includes('auroraveil') || (set.moves.includes('reflect') && set.moves.includes('lightscreen'))) {
				teamDetails.screens = 1;
			}
			if (set.role === 'Tera Blast user' || ['ogerpon', 'ogerponhearthflame', 'terapagos'].includes(species.id)) {
				teamDetails.teraBlast = 1;
			}
		}

		if (pokemon.length < this.maxTeamSize && pokemon.length < 12) { // large teams sometimes cannot be built
			const lines = [
				`Could not build a random team for ${this.format} (seed=${seed})`,
				`- Seed: ${seed}`,
				`- Built Pokémon: ${pokemon.length}/${this.maxTeamSize}`,
				`- Gametype: ${this.format.gameType}`,
				`- Monotype: ${isMonotype}`,
				`- Forced Type: ${this.forceMonotype || 'none'}`,
				`- Caps enabled: ${USE_TYPE_AND_WEAKNESS_CAPS}`,
				`- Last tried species: ${triedSpecies.join(', ') || '(none)'}`,
				`- Skip reasons:`,
				...Object.keys(skipReasons)
					.sort((a, b) => (skipReasons[b] || 0) - (skipReasons[a] || 0))
					.map(k => `-- ${k}: ${skipReasons[k]}`),
			];
			throw new Error(lines.join('\n'));
		}

		return pokemon;
	}


	randomCCTeam(): RandomTeamsTypes.RandomSet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const dex = this.dex;
		const team = [];

		const natures = this.dex.natures.all();
		const items = this.dex.items.all();

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined, undefined, true);

		for (let forme of randomN) {
			let species = dex.species.get(forme);
			if (species.isNonstandard) species = dex.species.get(species.baseSpecies);

			// Random legal item
			let item = '';
			let isIllegalItem;
			let isBadItem;
			if (this.gen >= 2) {
				do {
					item = this.sample(items).name;
					isIllegalItem = this.dex.items.get(item).gen > this.gen || this.dex.items.get(item).isNonstandard;
					isBadItem = item.startsWith("TR") || this.dex.items.get(item).isPokeball;
				} while (isIllegalItem || (isBadItem && this.randomChance(19, 20)));
			}

			// Make sure forme is legal
			if (species.battleOnly) {
				if (typeof species.battleOnly === 'string') {
					species = dex.species.get(species.battleOnly);
				} else {
					species = dex.species.get(this.sample(species.battleOnly));
				}
				forme = species.name;
			} else if (species.requiredItems && !species.requiredItems.some(req => toID(req) === item)) {
				if (!species.changesFrom) throw new Error(`${species.name} needs a changesFrom value`);
				species = dex.species.get(species.changesFrom);
				forme = species.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.dex.items.get(item);
			if (itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies) {
				do {
					itemData = this.sample(items);
					item = itemData.name;
				} while (
					itemData.gen > this.gen ||
					itemData.isNonstandard ||
					(itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies)
				);
			}

			// Random legal ability
			const abilities = Object.values(species.abilities).filter(a => this.dex.abilities.get(a).gen <= this.gen);
			const ability: string = this.gen <= 2 ? 'No Ability' : this.sample(abilities);

			// Four random unique moves from the movepool
			let pool = ['struggle'];
			if (forme === 'Smeargle') {
				pool = this.dex.moves.all()
					.filter(move => !(move.isNonstandard || move.isZ || move.isMax || move.realMove))
					.map(m => m.id);
			} else {
				pool = [...this.dex.species.getMovePool(species.id)];
			}

			const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);

			// Random EVs
			const evs: StatsTable = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			const s: StatID[] = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				const x = this.sample(s);
				const y = this.random(Math.min(256 - evs[x], evpool + 1));
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			const ivs = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			const nature = this.sample(natures).name;

			// Level balance--calculate directly from stats rather than using some silly lookup table
			const mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = species.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (species.baseSpecies === 'Wishiwashi') stats = Dex.species.get('wishiwashischool').baseStats;
			// If Terapagos, use Terastal-forme's stats
			if (species.baseSpecies === 'Terapagos') stats = Dex.species.get('terapagosterastal').baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

				while (level < 100) {
					mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
					// Since damage is roughly proportional to level
					mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: RandomTeamsTypes.RandomSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender || (this.random(2) ? 'F' : 'M'),
				item,
				ability,
				moves,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Tera type
				if (species.requiredTeraType) set.teraType = species.requiredTeraType;
				if (this.forceTeraType) {
					set.teraType = this.forceTeraType;
				} else {
					set.teraType = this.sample(this.dex.types.names());
				}
			}
			team.push(set);
		}

		return team;
	}

	private getPools(requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Memoize pool and speciesPool because, at least during tests, they are constructed with the same parameters
		// hundreds of times and are expensive to compute.
		const isNotCustom = !ruleTable;
		let pool: number[] = [];
		let speciesPool: Species[] = [];
		const ck = this.poolsCacheKey;
		if (ck && this.cachedPool && this.cachedSpeciesPool &&
			ck[0] === requiredType && ck[1] === minSourceGen && ck[2] === ruleTable && ck[3] === requireMoves) {
			speciesPool = this.cachedSpeciesPool.slice();
			pool = this.cachedPool.slice();
		} else if (isNotCustom) {
			speciesPool = [...this.dex.species.all()];
			for (const species of speciesPool) {
				if (species.isNonstandard && species.isNonstandard !== 'Unobtainable') continue;
				if (requireMoves) {
					const hasMovesInCurrentGen = this.dex.species.getMovePool(species.id).size;
					if (!hasMovesInCurrentGen) continue;
				}
				if (requiredType && !species.types.includes(requiredType)) continue;
				if (minSourceGen && species.gen < minSourceGen) continue;
				const num = species.num;
				if (num <= 0 || pool.includes(num)) continue;
				pool.push(num);
			}
			this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
			this.cachedPool = pool.slice();
			this.cachedSpeciesPool = speciesPool.slice();
		} else {
			const EXISTENCE_TAG = ['past', 'future', 'lgpe', 'unobtainable', 'cap', 'custom', 'nonexistent'];
			const nonexistentBanReason = ruleTable.check('nonexistent');
			// Assume tierSpecies does not differ from species here (mega formes can be used without their stone, etc)
			for (const species of this.dex.species.all()) {
				if (requiredType && !species.types.includes(requiredType)) continue;

				let banReason = ruleTable.check('pokemon:' + species.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (species.isMega && ruleTable.check('pokemontag:mega')) continue;

					banReason = ruleTable.check('basepokemon:' + toID(species.baseSpecies));
					if (banReason) continue;
					if (banReason !== '' || this.dex.species.get(species.baseSpecies).isNonstandard !== species.isNonstandard) {
						const nonexistentCheck = Tags.nonexistent.genericFilter!(species) && nonexistentBanReason;
						let tagWhitelisted = false;
						let tagBlacklisted = false;
						for (const ruleid of ruleTable.tagRules) {
							if (ruleid.startsWith('*')) continue;
							const tagid = ruleid.slice(12) as ID;
							const tag = Tags[tagid];
							if ((tag.speciesFilter || tag.genericFilter)!(species)) {
								const existenceTag = EXISTENCE_TAG.includes(tagid);
								if (ruleid.startsWith('+')) {
									if (!existenceTag && nonexistentCheck) continue;
									tagWhitelisted = true;
									break;
								}
								tagBlacklisted = true;
								break;
							}
						}
						if (tagBlacklisted) continue;
						if (!tagWhitelisted) {
							if (ruleTable.check('pokemontag:allpokemon')) continue;
						}
					}
				}
				speciesPool.push(species);
				const num = species.num;
				if (pool.includes(num)) continue;
				pool.push(num);
			}
			this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
			this.cachedPool = pool.slice();
			this.cachedSpeciesPool = speciesPool.slice();
		}
		return { pool, speciesPool };
	}

	randomNPokemon(n: number, requiredType?: string, minSourceGen?: number, ruleTable?: RuleTable, requireMoves = false) {
		// Picks `n` random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		if (requiredType && !this.dex.types.get(requiredType).exists) {
			throw new Error(`"${requiredType}" is not a valid type.`);
		}

		const { pool, speciesPool } = this.getPools(requiredType, minSourceGen, ruleTable, requireMoves);
		const isNotCustom = !ruleTable;

		const hasDexNumber: { [k: string]: number } = {};
		for (let i = 0; i < n; i++) {
			const num = this.sampleNoReplace(pool);
			hasDexNumber[num] = i;
		}

		const formes: string[][] = [];
		for (const species of speciesPool) {
			if (!(species.num in hasDexNumber)) continue;
			if (isNotCustom && (species.gen > this.gen ||
				(species.isNonstandard && species.isNonstandard !== 'Unobtainable'))) continue;
			if (requiredType && !species.types.includes(requiredType)) continue;
			if (!formes[hasDexNumber[species.num]]) formes[hasDexNumber[species.num]] = [];
			formes[hasDexNumber[species.num]].push(species.name);
		}

		if (formes.length < n) {
			throw new Error(`Legal Pokemon forme count insufficient to support Max Team Size: (${formes.length} / ${n}).`);
		}

		const nPokemon = [];
		for (let i = 0; i < n; i++) {
			if (!formes[i].length) {
				throw new Error(`Invalid pokemon gen ${this.gen}: ${JSON.stringify(formes)} numbers ${JSON.stringify(hasDexNumber)}`);
			}
			nPokemon.push(this.sample(formes[i]));
		}
		return nPokemon;
	}

	randomHCTeam(): PokemonSet[] {
		const hasCustomBans = this.hasDirectCustomBanlistChanges();
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const hasNonexistentBan = hasCustomBans && ruleTable.check('nonexistent');
		const hasNonexistentWhitelist = hasCustomBans && (hasNonexistentBan === '');

		if (hasCustomBans) {
			this.enforceNoDirectComplexBans();
		}

		// Item Pool
		const doItemsExist = this.gen > 1;
		let itemPool: Item[] = [];
		if (doItemsExist) {
			if (!hasCustomBans) {
				itemPool = [...this.dex.items.all()].filter(item => (item.gen <= this.gen && !item.isNonstandard));
			} else {
				const hasAllItemsBan = ruleTable.check('pokemontag:allitems');
				for (const item of this.dex.items.all()) {
					let banReason = ruleTable.check('item:' + item.id);
					if (banReason) continue;
					if (banReason !== '' && item.id) {
						if (hasAllItemsBan) continue;
						if (item.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(item.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && item.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					itemPool.push(item);
				}
				if (ruleTable.check('item:noitem')) {
					this.enforceCustomPoolSizeNoComplexBans('item', itemPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Ability Pool
		const doAbilitiesExist = (this.gen > 2) && (this.dex.currentMod !== 'gen7letsgo');
		let abilityPool: Ability[] = [];
		if (doAbilitiesExist) {
			if (!hasCustomBans) {
				abilityPool = [...this.dex.abilities.all()].filter(ability => (ability.gen <= this.gen && !ability.isNonstandard));
			} else {
				const hasAllAbilitiesBan = ruleTable.check('pokemontag:allabilities');
				for (const ability of this.dex.abilities.all()) {
					let banReason = ruleTable.check('ability:' + ability.id);
					if (banReason) continue;
					if (banReason !== '') {
						if (hasAllAbilitiesBan) continue;
						if (ability.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(ability.isNonstandard));
							if (banReason) continue;
							if (banReason !== '') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					abilityPool.push(ability);
				}
				if (ruleTable.check('ability:noability')) {
					this.enforceCustomPoolSizeNoComplexBans('ability', abilityPool, this.maxTeamSize, 'Max Team Size');
				}
			}
		}

		// Move Pool
		const setMoveCount = ruleTable.maxMoveCount;
		let movePool: Move[] = [];
		if (!hasCustomBans) {
			movePool = [...this.dex.moves.all()].filter(move =>
				(move.gen <= this.gen && !move.isNonstandard));
		} else {
			const hasAllMovesBan = ruleTable.check('pokemontag:allmoves');
			for (const move of this.dex.moves.all()) {
				let banReason = ruleTable.check('move:' + move.id);
				if (banReason) continue;
				if (banReason !== '') {
					if (hasAllMovesBan) continue;
					if (move.isNonstandard) {
						banReason = ruleTable.check('pokemontag:' + toID(move.isNonstandard));
						if (banReason) continue;
						if (banReason !== '' && move.isNonstandard !== 'Unobtainable') {
							if (hasNonexistentBan) continue;
							if (!hasNonexistentWhitelist) continue;
						}
					}
				}
				movePool.push(move);
			}
			this.enforceCustomPoolSizeNoComplexBans('move', movePool, this.maxTeamSize * setMoveCount, 'Max Team Size * Max Move Count');
		}

		// Nature Pool
		const doNaturesExist = this.gen > 2;
		let naturePool: Nature[] = [];
		if (doNaturesExist) {
			if (!hasCustomBans) {
				naturePool = [...this.dex.natures.all()];
			} else {
				const hasAllNaturesBan = ruleTable.check('pokemontag:allnatures');
				for (const nature of this.dex.natures.all()) {
					let banReason = ruleTable.check('nature:' + nature.id);
					if (banReason) continue;
					if (banReason !== '' && nature.id) {
						if (hasAllNaturesBan) continue;
						if (nature.isNonstandard) {
							banReason = ruleTable.check('pokemontag:' + toID(nature.isNonstandard));
							if (banReason) continue;
							if (banReason !== '' && nature.isNonstandard !== 'Unobtainable') {
								if (hasNonexistentBan) continue;
								if (!hasNonexistentWhitelist) continue;
							}
						}
					}
					naturePool.push(nature);
				}
				// There is no 'nature:nonature' rule so do not constrain pool size
			}
		}

		const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, undefined,
			hasCustomBans ? ruleTable : undefined);

		const team = [];
		for (const forme of randomN) {
			// Choose forme
			const species = this.dex.species.get(forme);

			// Random unique item
			let item = '';
			let itemData;
			let isBadItem;
			if (doItemsExist) {
				// We discard TRs and Balls with 95% probability because of their otherwise overwhelming presence
				do {
					itemData = this.sampleNoReplace(itemPool);
					item = itemData?.name;
					isBadItem = item.startsWith("TR") || itemData.isPokeball;
				} while (isBadItem && this.randomChance(19, 20) && itemPool.length > this.maxTeamSize);
			}

			// Random unique ability
			let ability = 'No Ability';
			let abilityData;
			if (doAbilitiesExist) {
				abilityData = this.sampleNoReplace(abilityPool);
				ability = abilityData?.name;
			}

			// Random unique moves
			const m = [];
			do {
				const move = this.sampleNoReplace(movePool);
				m.push(move.id);
			} while (m.length < setMoveCount);

			// Random EVs
			const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
			if (this.gen === 6) {
				let evpool = 510;
				do {
					const x = this.sample(Dex.stats.ids());
					const y = this.random(Math.min(256 - evs[x], evpool + 1));
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of Dex.stats.ids()) {
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			const ivs: StatsTable = {
				hp: this.random(32),
				atk: this.random(32),
				def: this.random(32),
				spa: this.random(32),
				spd: this.random(32),
				spe: this.random(32),
			};

			// Random nature
			let nature = '';
			if (doNaturesExist && (naturePool.length > 0)) {
				nature = this.sample(naturePool).name;
			}

			// Level balance
			const mbstmin = 1307;
			const stats = species.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;

			let level;
			if (this.adjustLevel) {
				level = this.adjustLevel;
			} else {
				level = Math.floor(100 * mbstmin / mbst);
				while (level < 100) {
					mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
					mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
					mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
					if (mbst >= mbstmin) break;
					level++;
				}
			}

			// Random happiness
			const happiness = this.random(256);

			// Random shininess
			const shiny = this.randomChance(1, 1024);

			const set: PokemonSet = {
				name: species.baseSpecies,
				species: species.name,
				gender: species.gender || (this.random(2) ? 'F' : 'M'),
				item,
				ability,
				moves: m,
				evs,
				ivs,
				nature,
				level,
				happiness,
				shiny,
			};
			if (this.gen === 9) {
				// Random Tera type
				if (this.forceTeraType) {
					set.teraType = this.forceTeraType;
				} else {
					set.teraType = this.sample(this.dex.types.names());
				}
			}
			team.push(set);
		}

		return team;
	}

	randomFactorySets: { [format: string]: { [species: string]: BattleFactorySpecies } } = require('./factory-sets.json');

	randomFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails, tier: string
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomFactorySets[tier][id].sets;

		const itemsLimited = ['choicespecs', 'choiceband', 'choicescarf'];
		const movesLimited: { [k: string]: string } = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};

		// Build a pool of eligible sets, given the team partners
		// Also keep track of moves and items limited to one per team
		const effectivePool: {
			set: BattleFactorySet, moves?: string[], item?: string,
		}[] = [];

		for (const set of setList) {
			let reject = false;

			// limit to 1 dedicated tera user per team
			if (set.wantsTera && teamData.wantsTeraCount) {
				continue;
			}

			// reject disallowed items, specifically a second of any given choice item
			const allowedItems: string[] = [];
			for (const itemString of set.item) {
				const itemId = toID(itemString);
				if (itemsLimited.includes(itemId) && teamData.has[itemId]) continue;
				allowedItems.push(itemString);
			}
			if (!allowedItems.length) continue;
			const item = this.sample(allowedItems);

			const abilityId = toID(this.sample(set.ability));

			if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;

			const moves: string[] = [];
			for (const move of set.moves) {
				const allowedMoves: string[] = [];
				for (const m of move) {
					const moveId = toID(m);
					if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) continue;
					allowedMoves.push(m);
				}
				if (!allowedMoves.length) {
					reject = true;
					break;
				}
				moves.push(this.sample(allowedMoves));
			}
			if (reject) continue;
			effectivePool.push({ set, moves, item });
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const set of setList) {
				effectivePool.push({ set });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moves ? setData.moves[i] : this.sample(moveSlot));
		}

		const item = setData.item || this.sample(setData.set.item);

		return {
			name: species.baseSpecies,
			species: (typeof species.battleOnly === 'string') ? species.battleOnly : species.name,
			teraType: this.sample(setData.set.teraType),
			gender:	setData.set.gender || species.gender || (tier === 'OU' ? 'F' : ''), // F for Cute Charm Enamorus
			item,
			ability: this.sample(setData.set.ability),
			shiny: setData.set.shiny || this.randomChance(1, 1024),
			level: this.adjustLevel || (tier === "LC" ? 5 : 100),
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: this.sample(setData.set.nature) || "Serious",
			moves,
			wantsTera: setData.set.wantsTera,
		};
	}

	randomFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 12;

		if (!this.factoryTier) {
			// this.factoryTier = this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC']);
			this.factoryTier = this.sample(['Uber', 'OU', 'UU', 'RU', 'NU', 'PU']);
		}

		const tierValues: { [k: string]: number } = {
			Uber: 5,
			OU: 4, UUBL: 4,
			UU: 3, RUBL: 3,
			RU: 2, NUBL: 2,
			NU: 1, PUBL: 1,
			PU: 0,
		};

		const pokemon = [];
		const pokemonPool = Object.keys(this.randomFactorySets[this.factoryTier]);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const resistanceAbilities: { [k: string]: string[] } = {
			dryskin: ['Water'], waterabsorb: ['Water'], stormdrain: ['Water'],
			flashfire: ['Fire'], heatproof: ['Fire'], waterbubble: ['Fire'], wellbakedbody: ['Fire'],
			lightningrod: ['Electric'], motordrive: ['Electric'], voltabsorb: ['Electric'],
			sapsipper: ['Grass'],
			thickfat: ['Ice', 'Fire'],
			eartheater: ['Ground'], levitate: ['Ground'],
		};
		const movesLimited: { [k: string]: string } = {
			stealthrock: 'stealthRock',
			stoneaxe: 'stealthRock',
			spikes: 'spikes',
			ceaselessedge: 'spikes',
			toxicspikes: 'toxicSpikes',
			rapidspin: 'hazardClear',
			defog: 'hazardClear',
		};
		const abilitiesLimited: { [k: string]: string } = {
			toxicdebris: 'toxicSpikes',
		};
		const limitFactor = Math.ceil(this.maxTeamSize / 6);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
		const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.randomFactorySets[this.factoryTier][speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (
				this.factoryTier in tierValues && species.tier in tierValues &&
				tierValues[species.tier] > tierValues[this.factoryTier]
			) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			if (!teamData.forceResult && !this.forceMonotype) {
				// Limit 3 of any weakness
				for (const typeName of this.dex.types.names()) {
					// it's weak to the type
					if (this.dex.getEffectiveness(typeName, species) > 0 && this.dex.getImmunity(typeName, types)) {
						if (teamData.weaknesses[typeName] >= 3 * limitFactor) {
							skip = true;
							break;
						}
					}
				}
			}
			if (skip) continue;

			const set = this.randomFactorySet(species, teamData, this.factoryTier);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[toID(set.item)] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (movesLimited[moveId]) {
					teamData.has[movesLimited[moveId]] = 1;
				}
			}

			const ability = this.dex.abilities.get(set.ability);
			if (abilitiesLimited[ability.id]) {
				teamData.has[abilitiesLimited[ability.id]] = 1;
			}

			for (const typeName of this.dex.types.names()) {
				const typeMod = this.dex.getEffectiveness(typeName, types);
				// Track resistances because we will require it for triple weaknesses
				if (
					typeMod < 0 ||
					resistanceAbilities[ability.id]?.includes(typeName) ||
					!this.dex.getImmunity(typeName, types)
				) {
					// We don't care about the number of resistances, so just set to 1
					teamData.resistances[typeName] = 1;
				// Track weaknesses
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				// We reject if our team is triple weak to any type without having a resist
				if (teamData.resistances[type]) continue;
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomFactoryTeam(side, ++depth);
			}
			// Try to force Stealth Rock on non-Uber teams
			if (!teamData.has['stealthRock'] && this.factoryTier !== 'Uber') return this.randomFactoryTeam(side, ++depth);
		}
		return pokemon;
	}

	randomBSSFactorySets: AnyObject = require("./bss-factory-sets.json");

	randomBSSFactorySet(
		species: Species, teamData: RandomTeamsTypes.FactoryTeamDetails
	): RandomTeamsTypes.RandomFactorySet | null {
		const id = toID(species.name);
		const setList = this.randomBSSFactorySets[id].sets;

		const movesMax: { [k: string]: number } = {
			batonpass: 1,
			stealthrock: 1,
			toxicspikes: 1,
			trickroom: 1,
			auroraveil: 1,
		};
		const weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];
		const terrainAbilities: { [k: string]: string } = {
			electricsurge: "electric",
			psychicsurge: "psychic",
			grassysurge: "grassy",
			seedsower: "grassy",
			mistysurge: "misty",
		};
		const terrainItemsRequire: { [k: string]: string } = {
			electricseed: "electric",
			psychicseed: "psychic",
			grassyseed: "grassy",
			mistyseed: "misty",
		};

		const maxWantsTera = 2;

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		const effectivePool: {
			set: BSSFactorySet, moveVariants?: number[], itemVariants?: number, abilityVariants?: number,
		}[] = [];

		for (const curSet of setList) {
			let reject = false;

			// limit to 2 dedicated tera users per team
			if (curSet.wantsTera && teamData.wantsTeraCount && teamData.wantsTeraCount >= maxWantsTera) {
				continue;
			}

			// reject 2+ weather setters
			if (teamData.weather && weatherAbilities.includes(curSet.ability)) {
				continue;
			}

			if (terrainAbilities[curSet.ability]) {
				if (!teamData.terrain) teamData.terrain = [];
				teamData.terrain.push(terrainAbilities[curSet.ability]);
			}

			for (const item of curSet.item) {
				if (terrainItemsRequire[item] && !teamData.terrain?.includes(terrainItemsRequire[item])) {
					reject = true; // reject any sets with a seed item possible and no terrain setter to activate it
					break;
				}
			}

			const curSetMoveVariants = [];
			for (const move of curSet.moves) {
				const variantIndex = this.random(move.length);
				const moveId = toID(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				curSetMoveVariants.push(variantIndex);
			}
			if (reject) continue;
			const set = { set: curSet, moveVariants: curSetMoveVariants };
			effectivePool.push(set);
		}

		if (!effectivePool.length) {
			if (!teamData.forceResult) return null;
			for (const curSet of setList) {
				effectivePool.push({ set: curSet });
			}
		}

		// Sets have individual weight, choose one with weighted random selection

		let setData = this.sample(effectivePool); // Init with unweighted random set as fallback

		const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
		const setRand = this.random(total);

		let cur = 0;
		for (const set of effectivePool) {
			cur += set.set.weight;
			if (cur > setRand) {
				setData = set; // Bingo!
				break;
			}
		}

		const moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.species || species.baseSpecies,
			species: setData.set.species,
			teraType: (this.sampleIfArray(setData.set.teraType)),
			gender:	setData.set.gender || species.gender || (this.randomChance(1, 2) ? "M" : "F"),
			item: this.sampleIfArray(setData.set.item) || "",
			ability: this.sampleIfArray(setData.set.ability),
			shiny: this.randomChance(1, 1024),
			level: 50,
			happiness: 255,
			evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
			ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
			nature: setData.set.nature || "Serious",
			moves,
			wantsTera: setData.set.wantsTera,
		};
	}

	randomBSSFactoryTeam(side: PlayerOptions, depth = 0): RandomTeamsTypes.RandomFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		const forceResult = depth >= 4;

		const pokemon = [];

		const pokemonPool = Object.keys(this.randomBSSFactorySets);

		const teamData: TeamData = {
			typeCount: {},
			typeComboCount: {},
			baseFormes: {},
			has: {},
			wantsTeraCount: 0,
			forceResult,
			weaknesses: {},
			resistances: {},
		};
		const weatherAbilitiesSet: { [k: string]: string } = {
			drizzle: "raindance",
			drought: "sunnyday",
			snowwarning: "hail",
			sandstream: "sandstorm",
		};
		const resistanceAbilities: { [k: string]: string[] } = {
			waterabsorb: ["Water"],
			flashfire: ["Fire"],
			lightningrod: ["Electric"],
			voltabsorb: ["Electric"],
			thickfat: ["Ice", "Fire"],
			levitate: ["Ground"],
		};
		const limitFactor = Math.ceil(this.maxTeamSize / 6);
		/**
		 * Weighted random shuffle
		 * Uses the fact that for two uniform variables x1 and x2, x1^(1/w1) is larger than x2^(1/w2)
		 * with probability equal to w1/(w1+w2), which is what we want. See e.g. here https://arxiv.org/pdf/1012.0256.pdf,
		 * original paper is behind a paywall.
		 */
		const shuffledSpecies = [];
		for (const speciesName of pokemonPool) {
			const sortObject = {
				speciesName,
				score: this.prng.random() ** (1 / this.randomBSSFactorySets[speciesName].weight),
			};
			shuffledSpecies.push(sortObject);
		}
		shuffledSpecies.sort((a, b) => a.score - b.score);

		while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
			// repeated popping from weighted shuffle is equivalent to repeated weighted sampling without replacement
			const species = this.dex.species.get(shuffledSpecies.pop()!.speciesName);
			if (!species.exists) continue;

			if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[species.baseSpecies]) continue;

			// Limit 2 of any type (most of the time)
			const types = species.types;
			let skip = false;
			if (!this.forceMonotype) {
				for (const type of types) {
					if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
			}
			if (skip) continue;

			const set = this.randomBSSFactorySet(species, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === "Drought" || set.ability === "Drizzle") {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;

			const itemData = this.dex.items.get(set.item);
			if (teamData.has[itemData.id]) continue; // Item Clause

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			if (typeCombo in teamData.typeComboCount) {
				teamData.typeComboCount[typeCombo]++;
			} else {
				teamData.typeComboCount[typeCombo] = 1;
			}

			teamData.baseFormes[species.baseSpecies] = 1;

			teamData.has[itemData.id] = 1;

			if (set.wantsTera) {
				if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
				teamData.wantsTeraCount++;
			}

			const abilityState = this.dex.abilities.get(set.ability);
			if (abilityState.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityState.id];
			}

			for (const move of set.moves) {
				const moveId = toID(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
			}

			for (const typeName of this.dex.types.names()) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityState.id]?.includes(typeName) ||	!this.dex.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				const typeMod = this.dex.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomBSSFactoryTeam(side, ++depth);

		// Quality control we cannot afford for monotype
		if (!teamData.forceResult && !this.forceMonotype) {
			for (const type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomBSSFactoryTeam(side, ++depth);
			}
		}

		return pokemon;
	}

	randomDraftFactoryMatchups: AnyObject = require("./draft-factory-matchups.json").matchups;
	rdfMatchupIndex = -1;
	rdfMatchupSide = -1;

	randomDraftFactoryTeam(side: PlayerOptions): RandomTeamsTypes.RandomDraftFactorySet[] {
		this.enforceNoDirectCustomBanlistChanges();

		if (this.rdfMatchupIndex === -1) this.rdfMatchupIndex = this.random(0, this.randomDraftFactoryMatchups.length);
		if (this.rdfMatchupSide === -1) this.rdfMatchupSide = this.random(0, 2);

		const matchup = this.randomDraftFactoryMatchups[this.rdfMatchupIndex];
		const team = Teams.unpack(matchup[this.rdfMatchupSide]);
		if (!team) throw new Error(`Invalid team for draft factory matchup ${this.rdfMatchupIndex}`);
		this.rdfMatchupSide = 1 - this.rdfMatchupSide;
		return team.map(set => {
			let species = this.dex.species.get(set.species);
			if (species.battleOnly) {
				if (typeof species.battleOnly !== 'string') {
					throw new Error(`Invalid species ${species.name} for draft factory matchup ${this.rdfMatchupIndex} team ${this.rdfMatchupSide}`);
				}
				species = this.dex.species.get(species.battleOnly);
			}
			return {
				name: species.baseSpecies,
				species: species.name,
				gender: set.gender,
				moves: set.moves,
				ability: set.ability,
				evs: set.evs,
				ivs: set.ivs,
				item: set.item,
				level: this.adjustLevel || set.level,
				shiny: !!set.shiny,
				nature: set.nature,
				teraType: set.teraType,
				teraCaptain: set.name === 'Tera Captain',
			};
		});
	}
}

export default RandomTeams;
