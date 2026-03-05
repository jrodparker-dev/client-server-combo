/**
 * Random Camo Teams (copy-paste teams.ts)
 *
 * Goals:
 * - All fully evolved Pokémon eligible (no sets.json required)
 * - Moves are pulled from ANYWHERE (global movepool), with Camomons-style constraints:
 *   - First 3 moves are attacking moves of DIFFERENT TYPES
 *   - 4th move is 75% Status (different type), 25% attacking (different type)
 *   - Best-effort: all 4 moves are different move types
 *
 * Notes:
 * - This file assumes your format sets `team: "randomCamo"` so getTeam() calls randomCamoTeam().
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const levels: Record<string, number> = require('./levels.json');

import {Dex, toID} from '../../../sim/dex';
import {PRNG, type PRNGSeed} from '../../../sim/prng';
import type {RuleTable} from '../../../sim/dex-formats';
import type {PokemonSet} from '../../../sim/teams';

type StatsTable = {hp: number; atk: number; def: number; spa: number; spd: number; spe: number};

export class RandomTeams {
	readonly dex: ModdedDex;
	readonly format: Format;
	readonly gen: number;
	prng: PRNG;

	readonly maxTeamSize: number;
	readonly maxMoveCount: number;
	readonly adjustLevel: number | null;
	readonly forceMonotype: string | undefined;
	readonly forceTeraType: string | undefined;

	constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
		format = Dex.formats.get(format);
		this.dex = Dex.forFormat(format);
		this.format = format;
		this.gen = this.dex.gen;

		const ruleTable = Dex.formats.getRuleTable(format);
		this.maxTeamSize = ruleTable.maxTeamSize;
		this.maxMoveCount = ruleTable.maxMoveCount;
		this.adjustLevel = ruleTable.adjustLevel;

		const forceMonotype = ruleTable.valueRules.get('forcemonotype');
		this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ?
			this.dex.types.get(forceMonotype).name : undefined;

		const forceTeraType = ruleTable.valueRules.get('forceteratype');
		this.forceTeraType = forceTeraType && this.dex.types.get(forceTeraType).exists ?
			this.dex.types.get(forceTeraType).name : undefined;

		this.prng = PRNG.get(prng);
		this.initBattleItemPool();

	}

	setSeed(prng?: PRNG | PRNGSeed) {
		this.prng = PRNG.get(prng);
	}

	// ------------------------------------------------------------
	// RNG helpers
	// ------------------------------------------------------------
	randomChance(numerator: number, denominator: number) {
		return this.prng.randomChance(numerator, denominator);
	}
	random(m?: number, n?: number) {
		return this.prng.random(m, n);
	}
	sample<T>(items: readonly T[]): T {
		return this.prng.sample(items);
	}
	fastPop<T>(list: T[], index: number): T {
		const length = list.length;
		if (index < 0 || index >= length) throw new Error(`Index ${index} out of bounds`);
		const element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}
	sampleNoReplace<T>(list: T[]): T | null {
		if (!list.length) return null;
		const index = this.random(list.length);
		return this.fastPop(list, index);
	}

	// ------------------------------------------------------------
	// Public entrypoint
	// ------------------------------------------------------------
	getTeam(options: PlayerOptions | null = null): PokemonSet[] {
		const generatorName = (
			typeof this.format.team === 'string' && this.format.team.startsWith('random')
		) ? this.format.team + 'Team' : '';
		// @ts-expect-error dynamic access
		return this[generatorName || 'randomCamoTeam'](options);
	}

	// ---- your camo logic continues below ----
	// - isEligibleSpecies / buildSpeciesPool
	// - move picking
	// - ability/item/nature/level
	// - randomCamoTeam()
		// ------------------------------------------------------------
	// Camo: battle item pool (diverse held items)
	// ------------------------------------------------------------
	private battleItemPool: ID[] = [];

	// Add this line near the end of your constructor (after this.prng is set):
	// this.initBattleItemPool();

	private initBattleItemPool() {
		const items = this.dex.items.all().filter(i => {
			if (!i.exists || i.isNonstandard) return false;
			if (i.isPokeball) return false;
			if (i.id.includes('mail')) return false;
			// Skip “out of battle” utility
			if (['abilitypatch', 'abilitycapsule'].includes(i.id)) return false;
			return true;
		});
		this.battleItemPool = items.map(i => i.id);
	}

	// ------------------------------------------------------------
	// Leveling: levels.json first, then tiers fallback
	// ------------------------------------------------------------
	private getLevel(species: Species): number {
		if (this.adjustLevel) return this.adjustLevel;

		const id = species.id;
		if (levels[id]) return levels[id];

		// Forme/base fallback
		if (species.baseSpecies) {
			const baseId = toID(species.baseSpecies);
			if (levels[baseId]) return levels[baseId];
		}

		const tierScale: Partial<Record<Species['tier'], number>> = {
			Uber: 76,
			OU: 80,
			UUBL: 81,
			UU: 82,
			RUBL: 83,
			RU: 84,
			NUBL: 85,
			NU: 86,
			PUBL: 87,
			PU: 88,
			"(PU)": 88,
			NFE: 88,
		};
		return tierScale[species.tier] || 80;
	}

	// ------------------------------------------------------------
	// Ability picker (real ability from species)
	// ------------------------------------------------------------
	private getAbility(species: Species): string {
		const abilities = Object.values(species.abilities)
			.filter(a => a && this.dex.abilities.get(a).exists && !this.dex.abilities.get(a).isNonstandard) as string[];
		if (this.gen <= 2) return 'No Ability';
		return abilities.length ? this.sample(abilities) : 'No Ability';
	}

	// ------------------------------------------------------------
	// EV/Nature picker (same breakpoint logic you approved)
	// ------------------------------------------------------------
	private pickNatureAndEvs(species: Species, ability: string, itemId: ID) {
		const atk = species.baseStats.atk;
		const spa = species.baseStats.spa;
		const spe = species.baseStats.spe;

		const preferPhysical = atk >= spa + 15;
		const preferSpecial = spa >= atk + 15;

		let effectiveSpe = spe;

		const abil = toID(ability);
		const isChoiceScarf = itemId === toID('choicescarf');

		const speedBoostAbilities = new Set<ID>([
			'swiftswim', 'chlorophyll', 'sandrush', 'slushrush', 'surgesurfer', 'quickfeet', 'unburden',
		].map(toID));

		if (speedBoostAbilities.has(abil)) effectiveSpe += 30;
		if (isChoiceScarf) effectiveSpe += 999;

		let wantSpeedNature = false;
		if (effectiveSpe >= 95) wantSpeedNature = true;
		else if (effectiveSpe <= 75) wantSpeedNature = false;
		else wantSpeedNature = this.randomChance(1, 2);

		let nature: string;
		let evs: StatsTable;

		const ivs: StatsTable = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

		if (preferPhysical) {
			nature = wantSpeedNature ? 'Jolly' : 'Adamant';
			evs = wantSpeedNature
				? {hp: 0, atk: 252, def: 4, spa: 0, spd: 0, spe: 252}
				: {hp: 252, atk: 252, def: 4, spa: 0, spd: 0, spe: 0};
		} else if (preferSpecial) {
			nature = wantSpeedNature ? 'Timid' : 'Modest';
			evs = wantSpeedNature
				? {hp: 0, atk: 0, def: 4, spa: 252, spd: 0, spe: 252}
				: {hp: 252, atk: 0, def: 4, spa: 252, spd: 0, spe: 0};
		} else {
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

		return {nature, evs, ivs};
	}

	// ------------------------------------------------------------
	// Camomons move rules:
	// - Slots 1-3: attacking, all different TYPES
	// - Slot 4: 75% status (new type), 25% attack (new type)
	// - Damaging moves match best attacking stat
	// ------------------------------------------------------------
	private getCamoMoves(species: Species, ability: string): string[] {
		const preferPhysical = species.baseStats.atk >= species.baseStats.spa;
		const abil = toID(ability);

		const allMoves = this.dex.moves.all().filter(m =>
			m.exists && !m.isNonstandard && !m.isZ && !m.isMax && !m.realMove
		);

		const isRecoilMove = (m: Move) => !!m.recoil || !!(m as any).hasCrashDamage || (m as any).selfdestruct === 'always';
		const hasSecondaryOrFlinch = (m: Move) =>
			!!m.secondary || (!!m.secondaries && m.secondaries.length) || (m.volatileStatus === 'flinch');
		const isPunch = (m: Move) => !!m.flags?.punch;
		const isBite = (m: Move) => !!m.flags?.bite;

		const drainingMoveIds = new Set<ID>([
			'gigadrain','drainpunch','drainingkiss','oblivionwing','paraboliccharge','hornleech','leechlife',
		].map(toID));

		const contraryPackage = new Set<ID>([
			'leafstorm','superpower','overheat','dracometeor','psychoboost','vcreate','fleurcannon',
		].map(toID));

		// Damaging pool matches best attack stat
		let damaging = allMoves.filter(m => m.category !== 'Status');
		damaging = damaging.filter(m => m.category === (preferPhysical ? 'Physical' : 'Special'));

		// Ability biases
		if (abil === toID('sheerforce')) damaging = damaging.filter(m => !isRecoilMove(m));
		if (abil === toID('serenegrace')) {
			const sg = damaging.filter(hasSecondaryOrFlinch);
			if (sg.length) damaging = sg;
		}
		if (abil === toID('triage')) {
			const tri = damaging.filter(m => drainingMoveIds.has(m.id));
			if (tri.length) damaging = tri;
		}
		if (abil === toID('contrary')) {
			const con = damaging.filter(m => contraryPackage.has(m.id));
			if (con.length) damaging = con;
		}
		if (abil === toID('ironfist')) {
			const p = damaging.filter(isPunch);
			if (p.length) damaging = p;
		}
		if (abil === toID('strongjaw')) {
			const b = damaging.filter(isBite);
			if (b.length) damaging = b;
		}

		const status = allMoves.filter(m => m.category === 'Status');

		const picked: ID[] = [];
		const usedTypes = new Set<string>();

		const pickDamagingDifferentType = (): ID | null => {
			const pool = damaging.filter(m => !usedTypes.has(m.type));
			const chosen = pool.length ? this.sample(pool) : null;
			if (!chosen) return null;
			usedTypes.add(chosen.type);
			return chosen.id;
		};

		const pickStatusDifferentType = (): ID | null => {
			const pool = status.filter(m => !usedTypes.has(m.type));
			const chosen = pool.length ? this.sample(pool) : null;
			if (!chosen) return null;
			usedTypes.add(chosen.type);
			return chosen.id;
		};

		// Slots 1–3: damaging, unique types
		for (let i = 0; i < 3; i++) {
			const mv = pickDamagingDifferentType();
			if (mv) picked.push(mv);
		}
		while (picked.length < 3) {
			picked.push(damaging.length ? this.sample(damaging).id : toID('tackle'));
		}

		// Slot 4: 75% status (unique type), else damaging (unique type)
		let slot4: ID | null = null;
		if (this.randomChance(3, 4)) {
			slot4 = pickStatusDifferentType();
			if (!slot4) slot4 = status.length ? this.sample(status).id : null;
		} else {
			slot4 = pickDamagingDifferentType();
			if (!slot4) slot4 = damaging.length ? this.sample(damaging).id : null;
		}
		if (!slot4) slot4 = toID('protect');
		picked.push(slot4);

		// Best-effort enforce different move TYPES
		return this.enforceAllMoveTypesDifferent(picked, preferPhysical).slice(0, 4);
	}

	private enforceAllMoveTypesDifferent(moves: ID[], preferPhysical: boolean): string[] {
		const allMoves = this.dex.moves.all().filter(m =>
			m.exists && !m.isNonstandard && !m.isZ && !m.isMax && !m.realMove
		);

		const desiredDamaging = allMoves
			.filter(m => m.category !== 'Status')
			.filter(m => m.category === (preferPhysical ? 'Physical' : 'Special'));

		const usedTypes = new Set<string>();
		const out: ID[] = [];

		for (const id of moves) {
			const m = this.dex.moves.get(id);
			if (m.exists && !usedTypes.has(m.type)) {
				usedTypes.add(m.type);
				out.push(id);
				continue;
			}

			const wantStatus = m.category === 'Status';
			let pool = wantStatus
				? allMoves.filter(x => x.category === 'Status' && !usedTypes.has(x.type))
				: desiredDamaging.filter(x => !usedTypes.has(x.type));

			if (!pool.length) pool = allMoves.filter(x => !usedTypes.has(x.type));

			if (pool.length) {
				const repl = this.sample(pool);
				usedTypes.add(repl.type);
				out.push(repl.id);
			} else {
				out.push(id);
			}
		}

		return out.map(x => x as unknown as string);
	}

		private getMoveType(id: string): string {
		return this.dex.moves.get(id).type;
	}

	/**
	 * Re-roll a mon's moves (and item if you want) to avoid duplicating
	 * move types in slots 1 & 2 across the team.
	 *
	 * Returns a finalized PokemonSet and mutates `usedLeadTypes` by adding the chosen slot1/2 types.
	 */
	private buildCamoSetAvoidingLeadTypes(species: Species, usedLeadTypes: Set<string>): PokemonSet {
		// number of attempts to find a set with minimal collisions
		const ATTEMPTS = 12;

		let best: PokemonSet | null = null;
		let bestCollisions = 999;

		for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
			const set = this.buildCamoSet(species);

			const t1 = this.getMoveType(set.moves[0]);
			const t2 = this.getMoveType(set.moves[1]);

			let collisions = 0;
			if (usedLeadTypes.has(t1)) collisions++;
			if (usedLeadTypes.has(t2)) collisions++;

			// Also try to avoid t1/t2 being the same as each other (should already be true, but safety)
			if (t1 === t2) collisions += 2;

			if (collisions < bestCollisions) {
				best = set;
				bestCollisions = collisions;
				if (collisions === 0) break; // perfect
			}
		}

		// Fallback safety
		if (!best) best = this.buildCamoSet(species);

		// Commit slot 1 & 2 types to the team tracking set
		const finalT1 = this.getMoveType(best.moves[0]);
		const finalT2 = this.getMoveType(best.moves[1]);
		usedLeadTypes.add(finalT1);
		usedLeadTypes.add(finalT2);

		return best;
	}


	// ------------------------------------------------------------
	// Item picker (ability packages + type synergy + choice weighting + diversity)
	// ------------------------------------------------------------
		private getCamoItemId(species: Species, ability: string, moves: string[]): ID {
		const abil = toID(ability);
		const atk = species.baseStats.atk;
		const spa = species.baseStats.spa;
		const spe = species.baseStats.spe;

		const moveObjs = moves.map(m => this.dex.moves.get(m));
		const moveTypes = new Set<string>(moveObjs.map(m => m.type));
		const hasStatus = moveObjs.some(m => m.category === 'Status');
		const hasMultiHit = moveObjs.some(m => !!m.multihit);

		// ----------------------------
		// Ability-forced items
		// ----------------------------
		if (abil === toID('guts') && this.dex.items.get('flameorb').exists) return toID('flameorb');
		if (abil === toID('poisonheal') && this.dex.items.get('toxicorb').exists) return toID('toxicorb');
		if (abil === toID('magicguard') && this.dex.items.get('lifeorb').exists) return toID('lifeorb');
		if (abil === toID('sheerforce') && this.dex.items.get('lifeorb').exists) return toID('lifeorb');

		if (abil === toID('unburden')) {
			const consumables: ID[] = [
				'sitrusberry', 'whiteherb', 'focussash', 'redcard',
				'electricseed', 'grassyseed', 'psychicseed', 'mistyseed',
			].map(toID).filter(id => this.dex.items.get(id).exists);
			if (consumables.length) return this.sample(consumables);
		}

		// ----------------------------
		// Curated "good in battle" pool
		// (No mail, no fossils, no evo stones, no key items, no fluff)
		// ----------------------------
		const goodGeneric: ID[] = [
			'leftovers','heavydutyboots','lifeorb','focussash','assaultvest','expertbelt','rockyhelmet',
			'airballoon','weaknesspolicy','loadeddice','eviolite','lightclay','mentalherb',
			'clearamulet','covertcloak','safetygoggles','heavy-dutyboots', // (some forks alias)
			'redcard','rockyhelmet','brightpowder','wiseglasses','muscleband',
		].map(toID).filter(id => this.dex.items.get(id).exists);

		const goodBerries: ID[] = [
			'sitrusberry','lumberry','figyberry','iapapaberry','wikiberry','magoberry','aguavberry',
			'wacanberry','yacheberry','shucaberry','chopleberry','cobaberry','colburberry','babiriberry',
		].map(toID).filter(id => this.dex.items.get(id).exists);

		const choiceItems: ID[] = [
			'choiceband','choicespecs','choicescarf',
		].map(toID).filter(id => this.dex.items.get(id).exists);

		// Type boosters: only include ones that are widely present and actually used
		const typeBoost: Partial<Record<string, string[]>> = {
			Water: ['mysticwater','waveincense','seaincense'],
			Fire: ['charcoal'],
			Electric: ['magnet'],
			Grass: ['miracleseed','roseincense'],
			Ice: ['nevermeltice'],
			Fighting: ['blackbelt'],
			Poison: ['poisonbarb'],
			Ground: ['softsand'],
			Flying: ['sharpbeak'],
			Psychic: ['twistedspoon','oddincense'],
			Bug: ['silverpowder'],
			Rock: ['hardstone','rockincense'],
			Ghost: ['spelltag'],
			Dragon: ['dragonsfang'],
			Dark: ['blackglasses'],
			Steel: ['metalcoat'],
			Fairy: ['pixieplate'],
		};

		const typeSynergy: ID[] = [];
		for (const t of moveTypes) {
			const ids = typeBoost[t];
			if (!ids) continue;
			for (const raw of ids) {
				const id = toID(raw);
				if (this.dex.items.get(id).exists) typeSynergy.push(id);
			}
		}

		// ----------------------------
		// Weighted logic
		// ----------------------------
		const weighted: Array<{id: ID; w: number}> = [];
		const add = (id: ID, w: number) => {
			if (!this.dex.items.get(id).exists) return;
			weighted.push({id, w});
		};

		// Always-good baseline
		add(toID('leftovers'), 12);
		add(toID('heavydutyboots'), 12);
		add(toID('lifeorb'), 10);
		add(toID('focussash'), 8);
		add(toID('covertcloak'), 6);
		add(toID('clearamulet'), 5);
		add(toID('safetygoggles'), 4);
		add(toID('expertbelt'), 4);
		add(toID('airballoon'), 4);
		add(toID('rockyhelmet'), 4);
		add(toID('weaknesspolicy'), 3);
		add(toID('redcard'), 3);

		// Assault Vest only if we *don't* have status (or if Choice logic will delete it anyway)
		if (!hasStatus) add(toID('assaultvest'), 6);

		// Loaded Dice only if we have multihit
		if (hasMultiHit) add(toID('loadeddice'), 6);

		// Type boosters if we actually have that type in the moves
		for (const id of typeSynergy) add(id, 5);

		// Berries for variety
		for (const id of goodBerries) add(id, 1);

		// Stat-based Choice weighting
		if (atk > 100) add(toID('choiceband'), 28);
		if (spa > 100) add(toID('choicespecs'), 28);
		if (spe > 100) add(toID('choicescarf'), 28);

		// Slightly lower Choice weight if we currently have a Status move (since it will be removed)
		if (hasStatus) {
			// nothing fancy: just make non-choice items more likely by adding extra baseline weight
			add(toID('leftovers'), 6);
			add(toID('heavydutyboots'), 6);
		}

		// If for some reason our weighted list is tiny, fall back to curated pool
		if (!weighted.length) {
			const fallback = [...goodGeneric, ...goodBerries, ...choiceItems, ...typeSynergy];
			return fallback.length ? this.sample(fallback) : toID('leftovers');
		}

		// Weighted roll
		const total = weighted.reduce((s, x) => s + x.w, 0) || 1;
		let r = this.random(total);
		for (const x of weighted) {
			r -= x.w;
			if (r < 0) return x.id;
		}
		return weighted[weighted.length - 1].id;
	}


	private ensureNoStatusMoves(moves: string[], species: Species, ability: string): string[] {
		const preferPhysical = species.baseStats.atk >= species.baseStats.spa;
		const abil = toID(ability);

		const allMoves = this.dex.moves.all().filter(m =>
			m.exists && !m.isNonstandard && !m.isZ && !m.isMax && !m.realMove
		);

		let damaging = allMoves.filter(m => m.category !== 'Status')
			.filter(m => m.category === (preferPhysical ? 'Physical' : 'Special'));

		const isRecoilMove = (m: Move) => !!m.recoil || !!(m as any).hasCrashDamage || (m as any).selfdestruct === 'always';
		if (abil === toID('sheerforce')) damaging = damaging.filter(m => !isRecoilMove(m));

		const usedTypes = new Set<string>();
		const out: string[] = [];

		for (const id of moves) {
			const m = this.dex.moves.get(id);
			if (m.category !== 'Status' && !usedTypes.has(m.type)) {
				usedTypes.add(m.type);
				out.push(id);
				continue;
			}
			const pool = damaging.filter(x => !usedTypes.has(x.type));
			const repl = pool.length ? this.sample(pool) : (damaging.length ? this.sample(damaging) : this.dex.moves.get('tackle'));
			usedTypes.add(repl.type);
			out.push(repl.id);
		}

		return out.slice(0, 4);
	}

		// ------------------------------------------------------------
	// Core policy: Fully evolved pool
	// ------------------------------------------------------------
	private isEligibleSpecies(species: Species, ruleTable: RuleTable, pickedBaseSpecies: Set<string>) {
		if (!species.exists) return false;
		if (species.num <= 0) return false;

		// Keep it sane by default (you can loosen later)
		if (species.isNonstandard) return false;

		// ✅ Fully evolved only
		if (species.nfe) return false;

		// Monotype support (if enabled via rules)
		if (this.forceMonotype && !species.types.includes(this.forceMonotype)) return false;

		// Respect bans (if any)
		if (ruleTable.check('pokemon:' + species.id)) return false;
		if (ruleTable.check('basepokemon:' + toID(species.baseSpecies))) return false;

		// Species clause by base species
		if (pickedBaseSpecies.has(species.baseSpecies)) return false;

		return true;
	}

	private buildSpeciesPool(ruleTable: RuleTable) {
		const pickedBaseSpecies = new Set<string>();
		const pool = this.dex.species.all().filter(s => this.isEligibleSpecies(s, ruleTable, pickedBaseSpecies));

		// Group by base species so we can sample unique base species
		const byBase: {[base: string]: Species[]} = {};
		for (const s of pool) {
			if (!byBase[s.baseSpecies]) byBase[s.baseSpecies] = [];
			byBase[s.baseSpecies].push(s);
		}

		const baseSpeciesList = Object.keys(byBase);
		return {byBase, baseSpeciesList};
	}

	// ------------------------------------------------------------
	// The actual team generator for `team: "randomCamo"`
	// ------------------------------------------------------------
	randomCamoTeam(_options: PlayerOptions | null = null): PokemonSet[] {
		const ruleTable = this.dex.formats.getRuleTable(this.format);
		const team: PokemonSet[] = [];
		const usedLeadTypes = new Set<string>();


		const {byBase, baseSpeciesList} = this.buildSpeciesPool(ruleTable);
		if (!baseSpeciesList.length) throw new Error(`Random Camo: no eligible fully-evolved species in dex.`);

		const pickedBase = new Set<string>();
		const bases = baseSpeciesList.slice(); // mutable no-replace list

		while (bases.length && team.length < this.maxTeamSize) {
			const base = this.sampleNoReplace(bases);
			if (!base) break;

			if (pickedBase.has(base)) continue;
			pickedBase.add(base);

			// Pick a random forme/species entry under this base (still must be eligible)
			const candidates = (byBase[base] || []).filter(s => this.isEligibleSpecies(s, ruleTable, new Set()));
			if (!candidates.length) continue;

			const species = this.sample(candidates);

			team.push(this.buildCamoSetAvoidingLeadTypes(species, usedLeadTypes));

		}

		if (team.length < this.maxTeamSize) {
			throw new Error(`Random Camo: could not fill team (${team.length}/${this.maxTeamSize}).`);
		}

		return team;
	}


	// ------------------------------------------------------------
	// Build a full set for Camo mode (call from randomCamoTeam)
	// ------------------------------------------------------------
	private buildCamoSet(species: Species): PokemonSet {
		const level = this.getLevel(species);
		const ability = this.getAbility(species);
		const moves = this.getCamoMoves(species, ability);

		const itemId = this.getCamoItemId(species, ability, moves);
		const isChoice = (itemId === toID('choiceband') || itemId === toID('choicespecs') || itemId === toID('choicescarf'));
		const finalMoves = isChoice ? this.ensureNoStatusMoves(moves, species, ability) : moves;

		const {nature, evs, ivs} = this.pickNatureAndEvs(species, ability, itemId);

		let teraType = this.sample(this.dex.types.names().filter(t => t !== 'Stellar'));
		if (this.forceTeraType) teraType = this.forceTeraType;

		return {
			name: species.baseSpecies,
			species: species.name,
			gender: species.gender || (this.randomChance(1, 2) ? 'F' : 'M'),
			shiny: this.randomChance(1, 1024),
			level,
			moves: finalMoves,
			ability,
			item: itemId ? this.dex.items.get(itemId).name : '',
			nature,
			evs,
			ivs,
			teraType,
		};
	}

}

export default RandomTeams;

