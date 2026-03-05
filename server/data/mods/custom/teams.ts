// server/mods/<yourmod>/random-teams.ts (or random-teams.ts in your format folder)
// A “Chaos Random Battles” skeleton: no sets.json, no curated movepools.
// All Pokémon available (filtered for existence), moves are generated here.
// Item is forced to Mystery Box (with a commented-out future item picker).

import {Dex, toID} from '../../../sim/dex';
import {PRNG, type PRNGSeed} from '../../../sim/prng';

export class RandomTeams {
  readonly dex: ModdedDex;
  readonly format: Format;
  readonly gen: number;
  readonly maxTeamSize: number;
  readonly maxMoveCount: number;
  readonly adjustLevel: number | null;
  prng: PRNG;

  // Guardrails you can tune later
  static readonly FORCE_ITEM = 'Mystery Box';

  constructor(format: Format | string, prng: PRNG | PRNGSeed | null) {
    format = Dex.formats.get(format);
    this.dex = Dex.forFormat(format);
    this.format = format;
    this.gen = this.dex.gen;
    this.prng = PRNG.get(prng);

    const ruleTable = this.dex.formats.getRuleTable(format);
    this.maxTeamSize = ruleTable.maxTeamSize;
    this.maxMoveCount = ruleTable.maxMoveCount;
    this.adjustLevel = ruleTable.adjustLevel;
  }

  setSeed(prng?: PRNG | PRNGSeed) {
    this.prng = PRNG.get(prng);
  }

  random(m?: number, n?: number) {
    return this.prng.random(m, n);
  }
  randomChance(numerator: number, denominator: number) {
    return this.prng.randomChance(numerator, denominator);
  }
  sample<T>(items: readonly T[]): T {
    return this.prng.sample(items);
  }
  shuffle<T>(items: T[]): T[] {
    this.prng.shuffle(items);
    return items;
  }

  getTeam(options: PlayerOptions | null = null): PokemonSet[] {
    // Format.team should point to "randomChaosTeam" OR you can just call randomTeam directly.
    const generatorName = (
      typeof this.format.team === 'string' && this.format.team.startsWith('random')
    ) ? this.format.team + 'Team' : '';
    // @ts-expect-error dynamic dispatch
    return this[generatorName || 'randomTeam'](options);
  }

  /** Main entry for your chaos mode */
  randomChaosTeam(): PokemonSet[] {
    return this.randomTeam();
  }

  randomTeam(_options: PlayerOptions | null = null): PokemonSet[] {
    const team: PokemonSet[] = [];
    const seenBaseSpecies = new Set<string>();

    // “All Pokémon available”: pull from the Dex, filter to things you actually want.
    // You can loosen/tighten these filters later.
    const pool = this.dex.species.all().filter(s =>
      s.exists &&
      s.num > 0 &&
      !s.isNonstandard && // change this if you want to include nonstandard/custom
      !s.battleOnly &&  // we’ll handle battleOnly via getUsableForme()
      !s.nfe === false    // no-op placeholder; keep or remove
    );

    if (!pool.length) throw new Error(`Chaos Random: species pool is empty for mod=${this.dex.currentMod}`);

    // Simple “no repeats by base species” guardrail
    // (You can remove this if you want *true* chaos.)
    let safety = 0;
    while (team.length < this.maxTeamSize && safety++ < 5000) {
      const species = this.sample(pool);
      const base = species.baseSpecies;
      if (seenBaseSpecies.has(base)) continue;

      const set = this.randomSet(species);
      team.push(set);
      seenBaseSpecies.add(base);
    }

    if (team.length < this.maxTeamSize) {
      throw new Error(`Chaos Random: could not fill team (built ${team.length}/${this.maxTeamSize})`);
    }

    return team;
  }

  /** Convert a species into the forme you actually want to use in-battle */
  private getUsableForme(species: Species): Species {
    // If it has a battleOnly forme (like some transformations), choose the battleOnly species.
    if (typeof species.battleOnly === 'string') {
      return this.dex.species.get(species.battleOnly);
    }
    // Cosmetic formes etc: keep base for simplicity in chaos mode.
    return species;
  }

  /** Get a “learnable” move pool for the species in this gen/mod. */
  private getLearnableMovePool(species: Species): string[] {
    // This returns IDs (already lowercase).
    // If you want to include absolutely everything regardless of legality, replace with dex.moves.all().
    const set = this.dex.species.getMovePool(species.id);
    return [...set].filter(id => {
      const m = this.dex.moves.get(id);
      if (!m.exists) return false;
      if (m.isNonstandard) return false;
      if (m.gen > this.gen) return false;
      // Avoid weird unusables
      if (m.realMove) return false;
      if (m.isZ || m.isMax) return false;
      if (id === 'struggle') return false;
      return true;
    });
  }

  private pickRandomStatusMove(movePool: string[]): string | null {
    const status = movePool.filter(id => this.dex.moves.get(id).category === 'Status');
    return status.length ? this.sample(status) : null;
  }

  private pickRandomStabMove(movePool: string[], type: string): string | null {
    const stab = movePool.filter(id => {
      const m = this.dex.moves.get(id);
      if (m.category === 'Status') return false;
      if (!m.basePower && !m.basePowerCallback) return false;
      return m.type === type;
    });
    return stab.length ? this.sample(stab) : null;
  }

  private pickRandomDamagingOfCategory(movePool: string[], category: 'Physical' | 'Special'): string | null {
    const dmg = movePool.filter(id => {
      const m = this.dex.moves.get(id);
      if (m.category !== category) return false;
      if (!m.basePower && !m.basePowerCallback) return false;
      return true;
    });
    return dmg.length ? this.sample(dmg) : null;
  }

  private getLevel(species: Species): number {
    if (this.adjustLevel) return this.adjustLevel;

    // Keep it super simple for chaos mode; tweak later.
    // If you want, reuse the tierScale you had in the other file.
    if (species.tier === 'Uber') return 76;
    if (species.tier === 'OU') return 80;
    return 82;
  }
  private getNature(species: Species): string {

  // Decide based on higher attacking stat
  if (species.baseStats.atk > species.baseStats.spa) {
    return this.sample(['Adamant', 'Jolly']);
  } else if (species.baseStats.spa > species.baseStats.atk) {
    return this.sample(['Modest', 'Timid']);
  }

  // If equal, go fully neutral-chaos
  return this.sample([
    'Hardy', 'Docile', 'Serious', 'Bashful', 'Quirky',
  ]);
}


  /** ITEM: forced Mystery Box. Leave a commented future “light” item picker. */
  private getItem(_species: Species, _moves: string[]): string {
    return RandomTeams.FORCE_ITEM;

    /*
    // Future light item picker (commented out for now):
    // Keep it intentionally minimal so chaos stays chaos.
    const possible = ['Leftovers', 'Life Orb', 'Heavy-Duty Boots', 'Focus Sash'];
    return this.sample(possible);
    */
  }

  /** Build moveset: 1 random status + 1 STAB per type + fill w/ best attacking stat category */
  private randomMoveset(species: Species): string[] {
    species = this.getUsableForme(species);
    const movePool = this.getLearnableMovePool(species);

    // If a species somehow has no legal moves in pool, fall back to “all moves” (chaos backup).
    const fallbackPool = this.dex.moves.all()
      .filter(m => m.exists && !m.isNonstandard && m.gen <= this.gen && !m.realMove && !m.isZ && !m.isMax && m.id !== 'struggle')
      .map(m => m.id);

    const pool = movePool.length ? movePool : fallbackPool;

    const moves = new Set<string>();

    // 1) One random Status move
    const status = this.pickRandomStatusMove(pool);
    if (status) moves.add(status);

    // 2) One random STAB move for each type
    for (const t of species.types) {
      if (moves.size >= this.maxMoveCount) break;
      const stab = this.pickRandomStabMove(pool, t);
      if (stab) moves.add(stab);
    }

    // 3) Fill remaining with damaging moves matching highest attacking stat
    const prefer: 'Physical' | 'Special' = (species.baseStats.atk >= species.baseStats.spa) ? 'Physical' : 'Special';

    while (moves.size < this.maxMoveCount) {
      const pick = this.pickRandomDamagingOfCategory(pool, prefer)
        ?? this.pickRandomDamagingOfCategory(pool, prefer === 'Physical' ? 'Special' : 'Physical')
        ?? this.sample(pool);

      if (!pick) break;
      moves.add(pick);

      // Safety: if pool is tiny and we keep colliding
      if (moves.size >= pool.length) break;
    }

    // Guardrail: ensure at least 1 damaging move exists
    const hasDamaging = [...moves].some(id => this.dex.moves.get(id).category !== 'Status');
    if (!hasDamaging) {
      const anyDamaging = pool.filter(id => this.dex.moves.get(id).category !== 'Status');
      if (anyDamaging.length) {
        // Replace a random move (or add if somehow under cap)
        const replacement = this.sample(anyDamaging);
        if (moves.size >= this.maxMoveCount) {
          const arr = [...moves];
          moves.delete(this.sample(arr));
        }
        moves.add(replacement);
      }
    }

    const out = [...moves];
    this.shuffle(out);
    return out.slice(0, this.maxMoveCount);
  }

  randomSet(s: string | Species): PokemonSet {
    let species = (typeof s === 'string') ? this.dex.species.get(s) : s;
    species = this.getUsableForme(species);

    const moves = this.randomMoveset(species);
    const item = this.getItem(species, moves);

    // You said “mostly random”, so ability is random among real abilities.
    // This ignores “best ability” logic on purpose.
    const abilityChoices = Object.values(species.abilities).filter(a => {
      const ab = this.dex.abilities.get(a);
      return ab.exists && !ab.isNonstandard && ab.gen <= this.gen;
    });
    const ability = abilityChoices.length ? this.sample(abilityChoices) : 'No Ability';

    // Simple, neutral EV/IV baseline (you can add chaos EV logic later)
    const evs = {hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85};
    const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};

    const level = this.getLevel(species);
	const nature = this.getNature(species);


    // Tera: random from all types (excluding Stellar like PS usually does)
    const teraType = this.sample(this.dex.types.names().filter(t => t !== 'Stellar'));

    return {
      name: species.baseSpecies,
      species: species.name,
      gender: species.gender || (this.random(2) ? 'F' : 'M'),
      shiny: this.randomChance(1, 1024),
      level,
      moves,
	  nature,
      ability,
      evs,
      ivs,
      item,
      teraType,
    };
  }
}

export default RandomTeams;
