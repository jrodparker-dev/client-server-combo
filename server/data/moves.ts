// List of flags and their descriptions can be found in sim/dex-moves.ts

export const Moves: import('../sim/dex-moves').MoveDataTable = {
	"10000000voltthunderbolt": {
		num: 719,
		accuracy: true,
		basePower: 195,
		category: "Special",
		isNonstandard: "Past",
		name: "10,000,000 Volt Thunderbolt",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "pikashuniumz",
		critRatio: 3,
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	absorb: {
		num: 71,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		name: "Absorb",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	accelerock: {
		num: 709,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Accelerock",
		pp: 20,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cool",
	},
	acid: {
		num: 51,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Acid",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Poison",
		contestType: "Clever",
	},
	acidarmor: {
		num: 151,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Acid Armor",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 2,
		},
		secondary: null,
		target: "self",
		type: "Poison",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	aciddownpour: {
		num: 628,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Acid Downpour",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "poisoniumz",
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	acidspray: {
		num: 491,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Acid Spray",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	acrobatics: {
		num: 512,
		accuracy: 100,
		basePower: 55,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.item) {
				this.debug("BP doubled for no item");
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Acrobatics",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	acupressure: {
		num: 367,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Acupressure",
		pp: 30,
		priority: 0,
		flags: { metronome: 1 },
		onHit(target) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in target.boosts) {
				if (target.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			} else {
				return false;
			}
		},
		secondary: null,
		target: "adjacentAllyOrSelf",
		type: "Normal",
		zMove: { effect: 'crit2' },
		contestType: "Tough",
	},
	aerialace: {
		num: 332,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		name: "Aerial Ace",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	aeroblast: {
		num: 177,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		name: "Aeroblast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		critRatio: 2,
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	afteryou: {
		num: 495,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "After You",
		pp: 15,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1 },
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			if (action) {
				this.queue.prioritizeAction(action);
				this.add('-activate', target, 'move: After You');
			} else {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Cute",
	},
	agility: {
		num: 97,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Agility",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
	},
	aircutter: {
		num: 314,
		accuracy: 95,
		basePower: 60,
		category: "Special",
		name: "Air Cutter",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1, wind: 1 },
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
		type: "Flying",
		contestType: "Cool",
	},
	airslash: {
		num: 403,
		accuracy: 95,
		basePower: 75,
		category: "Special",
		name: "Air Slash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	alloutpummeling: {
		num: 624,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "All-Out Pummeling",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "fightiniumz",
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	alluringvoice: {
		num: 914,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Alluring Voice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target?.statsRaisedThisTurn) {
					target.addVolatile('confusion', source, move);
				}
			},
		},
		target: "normal",
		type: "Fairy",
	},
	allyswitch: {
		num: 502,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ally Switch",
		pp: 15,
		priority: 2,
		flags: { metronome: 1 },
		onPrepareHit(pokemon) {
			return pokemon.addVolatile('allyswitch');
		},
		onHit(pokemon) {
			let success = true;
			// Fail in formats where you don't control allies
			if (this.format.gameType !== 'doubles' && this.format.gameType !== 'triples') success = false;

			// Fail in triples if the Pokemon is in the middle
			if (pokemon.side.active.length === 3 && pokemon.position === 1) success = false;

			const newPosition = (pokemon.position === 0 ? pokemon.side.active.length - 1 : 0);
			if (!pokemon.side.active[newPosition]) success = false;
			if (pokemon.side.active[newPosition].fainted) success = false;
			if (!success) {
				this.add('-fail', pokemon, 'move: Ally Switch');
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			this.swapPosition(pokemon, newPosition, '[from] move: Ally Switch');
		},
		condition: {
			duration: 2,
			counterMax: 729,
			onStart() {
				this.effectState.counter = 3;
			},
			onRestart(pokemon) {
				// this.effectState.counter should never be undefined here.
				// However, just in case, use 1 if it is undefined.
				const counter = this.effectState.counter || 1;
				this.debug(`Ally Switch success chance: ${Math.round(100 / counter)}%`);
				const success = this.randomChance(1, counter);
				if (!success) {
					delete pokemon.volatiles['allyswitch'];
					return false;
				}
				if (this.effectState.counter < (this.effect as Condition).counterMax!) {
					this.effectState.counter *= 3;
				}
				this.effectState.duration = 2;
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	amnesia: {
		num: 133,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Amnesia",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spd: 2,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	anchorshot: {
		num: 677,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Past",
		name: "Anchor Shot",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	ancientpower: {
		num: 246,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Ancient Power",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	appleacid: {
		num: 787,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Apple Acid",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Grass",
	},
	aquacutter: {
		num: 895,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Aqua Cutter",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	aquajet: {
		num: 453,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Aqua Jet",
		pp: 20,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	aquaring: {
		num: 392,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aqua Ring",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'aquaring',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
		},
		secondary: null,
		target: "self",
		type: "Water",
		zMove: { boost: { def: 1 } },
		contestType: "Beautiful",
	},
	aquastep: {
		num: 872,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Aqua Step",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, dance: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	aquatail: {
		num: 401,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Aqua Tail",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	armorcannon: {
		num: 890,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Armor Cannon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	armthrust: {
		num: 292,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		name: "Arm Thrust",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	aromatherapy: {
		num: 312,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Aromatherapy",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, distance: 1, metronome: 1 },
		onHit(target, source, move) {
			this.add('-activate', source, 'move: Aromatherapy');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('sapsipper')) {
						this.add('-immune', ally, '[from] ability: Sap Sipper');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
					if (ally.volatiles['substitute'] && !move.infiltrates) continue;
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "allyTeam",
		type: "Grass",
		zMove: { effect: 'heal' },
		contestType: "Clever",
	},
	aromaticmist: {
		num: 597,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aromatic Mist",
		pp: 20,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		boosts: {
			spd: 1,
		},
		secondary: null,
		target: "adjacentAlly",
		type: "Fairy",
		zMove: { boost: { spd: 2 } },
		contestType: "Beautiful",
	},
	assist: {
		num: 274,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Assist",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(target) {
			const moves = [];
			for (const pokemon of target.side.pokemon) {
				if (pokemon === target) continue;
				for (const moveSlot of pokemon.moveSlots) {
					const moveid = moveSlot.id;
					const move = this.dex.moves.get(moveid);
					if (move.flags['noassist'] || move.isZ || move.isMax) {
						continue;
					}
					moves.push(moveid);
				}
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) {
				return false;
			}
			this.actions.useMove(randomMove, target);
		},
		callsMove: true,
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	assurance: {
		num: 372,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.hurtThisTurn) {
				this.debug('BP doubled on damaged target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Assurance",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	astonish: {
		num: 310,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Astonish",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
	},
	astralbarrage: {
		num: 825,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Astral Barrage",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ghost",
	},
	attackorder: {
		num: 454,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Attack Order",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	attract: {
		num: 213,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Attract",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'attract',
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				if (!(pokemon.gender === 'M' && source.gender === 'F') && !(pokemon.gender === 'F' && source.gender === 'M')) {
					this.debug('incompatible gender');
					return false;
				}
				if (!this.runEvent('Attract', pokemon, source)) {
					this.debug('Attract event failed');
					return false;
				}

				if (effect.name === 'Cute Charm') {
					this.add('-start', pokemon, 'Attract', '[from] ability: Cute Charm', `[of] ${source}`);
				} else if (effect.name === 'Destiny Knot') {
					this.add('-start', pokemon, 'Attract', '[from] item: Destiny Knot', `[of] ${source}`);
				} else {
					this.add('-start', pokemon, 'Attract');
				}
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles['attract']) {
					this.debug(`Removing Attract volatile on ${pokemon}`);
					pokemon.removeVolatile('attract');
				}
			},
			onBeforeMovePriority: 2,
			onBeforeMove(pokemon, target, move) {
				this.add('-activate', pokemon, 'move: Attract', '[of] ' + this.effectState.source);
				if (this.randomChance(1, 2)) {
					this.add('cant', pokemon, 'Attract');
					return false;
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Attract', '[silent]');
			},
		},
		onTryImmunity(target, source) {
			return (target.gender === 'M' && source.gender === 'F') || (target.gender === 'F' && source.gender === 'M');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	aurasphere: {
		num: 396,
		accuracy: true,
		basePower: 80,
		category: "Special",
		name: "Aura Sphere",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, bullet: 1, pulse: 1 },
		secondary: null,
		target: "any",
		type: "Fighting",
		contestType: "Beautiful",
	},
	aurawheel: {
	num: 783,
	accuracy: 100,
	basePower: 110,
	category: "Physical",
	name: "Aura Wheel",
	pp: 10,
	priority: 0,
	flags: {protect: 1, mirror: 1},
	secondary: {
		chance: 100,
		self: {
			boosts: {spe: 1},
		},
	},

	// Morpeko forms keep their native behavior; everyone else alternates types on use
	onModifyType(move, pokemon) {
		// Morpeko logic unchanged
		if (pokemon.species.baseSpecies === 'Morpeko') {
			if (pokemon.species.name === 'Morpeko-Hangry') {
				move.type = 'Dark';
			} else {
				move.type = 'Electric';
			}
			return;
		}

		// Non-Morpeko: alternate Electric <-> Dark each time Aura Wheel is used
		// Track state on the user with a volatile
		const v = pokemon.volatiles['aurawheel'] as any;
		const useDark = v?.darkNext === true;

		move.type = useDark ? 'Dark' : 'Electric';

		// Flip for next time
		if (!pokemon.volatiles['aurawheel']) pokemon.addVolatile('aurawheel');
		(pokemon.volatiles['aurawheel'] as any).darkNext = !useDark;
	},

	// Define the volatile used for non-Morpeko users
	condition: {
		noCopy: true,
		onStart(pokemon) {
			// default: next Aura Wheel will be Dark AFTER the first Electric use
			(this.effectState as any).darkNext = false;
		},
	},

	target: "normal",
	type: "Electric", // base (will be overridden by onModifyType)
},

	aurorabeam: {
		num: 62,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Aurora Beam",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	auroraveil: {
		num: 694,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Aurora Veil",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'auroraveil',
		onTry() {
			return this.field.isWeather(['hail', 'snowscape']);
		},
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target)) {
					if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
						(target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
						return;
					}
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Aurora Veil weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Aurora Veil');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 10,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Aurora Veil');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Ice",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	autotomize: {
		num: 475,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Autotomize",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onTryHit(pokemon) {
			const hasContrary = pokemon.hasAbility('contrary');
			if ((!hasContrary && pokemon.boosts.spe === 6) || (hasContrary && pokemon.boosts.spe === -6)) {
				return false;
			}
		},
		boosts: {
			spe: 2,
		},
		onHit(pokemon) {
			if (pokemon.weighthg > 1) {
				pokemon.weighthg = Math.max(1, pokemon.weighthg - 1000);
				this.add('-start', pokemon, 'Autotomize');
			}
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	avalanche: {
		num: 419,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some(
				p => p.source === target && p.damage > 0 && p.thisTurn
			);
			if (damagedByTarget) {
				this.debug(`BP doubled for getting hit by ${target}`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Avalanche",
		pp: 10,
		priority: -4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	axekick: {
		num: 853,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		name: "Axe Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fighting",
	},
	babydolleyes: {
		num: 608,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Baby-Doll Eyes",
		pp: 30,
		priority: 1,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {
			atk: -1,
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	baddybad: {
		num: 737,
		accuracy: 95,
		basePower: 80,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Baddy Bad",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			sideCondition: 'reflect',
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	banefulbunker: {
		num: 661,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Baneful Bunker",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'banefulbunker',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('psn', target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	barbbarrage: {
		num: 839,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Barb Barrage",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(2);
			}
		},
		secondary: {
			chance: 50,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
	},
	barrage: {
		num: 140,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		isNonstandard: "Past",
		name: "Barrage",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	barrier: {
		num: 112,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Barrier",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 2,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
	},
	batonpass: {
		num: 226,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Baton Pass",
		pp: 40,
		priority: 0,
		flags: { metronome: 1 },
		onHit(target) {
			if (!this.canSwitch(target.side) || target.volatiles['commanded']) {
				this.attrLastMove('[still]');
				this.add('-fail', target);
				return this.NOT_FAIL;
			}
		},
		self: {
			onHit(source) {
				source.skipBeforeSwitchOutEventFlag = true;
			},
		},
		selfSwitch: 'copyvolatile',
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	beakblast: {
		num: 690,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Beak Blast",
		pp: 15,
		priority: -3,
		flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1, bullet: 1 },
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('beakblast');
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Beak Blast');
			},
			onHit(target, source, move) {
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
			},
		},
		// FIXME: onMoveAborted(pokemon) {pokemon.removeVolatile('beakblast')},
		onAfterMove(pokemon) {
			pokemon.removeVolatile('beakblast');
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Tough",
	},
	beatup: {
		num: 251,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target, move) {
			const setSpecies = this.dex.species.get(move.allies!.shift()!.set.species);
			const bp = 5 + Math.floor(setSpecies.baseStats.atk / 10);
			this.debug(`BP for ${setSpecies.name} hit: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Beat Up",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			move.allies = pokemon.side.pokemon.filter(ally => ally === pokemon || !ally.fainted && !ally.status);
			move.multihit = move.allies.length;
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	behemothbash: {
		num: 782,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Behemoth Bash",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, failcopycat: 1, failmimic: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	behemothblade: {
		num: 781,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Behemoth Blade",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, failcopycat: 1, failmimic: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	belch: {
		num: 562,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		name: "Belch",
		pp: 10,
		priority: 0,
		flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onDisableMove(pokemon) {
			if (!pokemon.ateBerry) pokemon.disableMove('belch');
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	bellydrum: {
		num: 187,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Belly Drum",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			if (target.hp <= target.maxhp / 2 || target.boosts.atk >= 6 || target.maxhp === 1) { // Shedinja clause
				return false;
			}
			this.directDamage(target.maxhp / 2);
			this.boost({ atk: 12 }, target);
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Cute",
	},
	bestow: {
		num: 516,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Bestow",
		pp: 15,
		priority: 0,
		flags: { mirror: 1, bypasssub: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onHit(target, source, move) {
			if (target.item) {
				return false;
			}
			const myItem = source.takeItem();
			if (!myItem) return false;
			if (!this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem) || !target.setItem(myItem)) {
				source.item = myItem.id;
				return false;
			}
			this.add('-item', target, myItem.name, '[from] move: Bestow', `[of] ${source}`);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 2 } },
		contestType: "Cute",
	},
	bide: {
		num: 117,
		accuracy: true,
		basePower: 0,
		category: "Physical",
		isNonstandard: "Past",
		name: "Bide",
		pp: 10,
		priority: 1,
		flags: { contact: 1, protect: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		volatileStatus: 'bide',
		ignoreImmunity: true,
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['bide']) return true;
		},
		condition: {
			duration: 3,
			onLockMove: 'bide',
			onStart(pokemon) {
				this.effectState.totalDamage = 0;
				this.add('-start', pokemon, 'move: Bide');
			},
			onDamagePriority: -101,
			onDamage(damage, target, source, move) {
				if (!move || move.effectType !== 'Move' || !source) return;
				this.effectState.totalDamage += damage;
				this.effectState.lastDamageSource = source;
			},
			onBeforeMove(pokemon, target, move) {
				if (this.effectState.duration === 1) {
					this.add('-end', pokemon, 'move: Bide');
					target = this.effectState.lastDamageSource;
					if (!target || !this.effectState.totalDamage) {
						this.attrLastMove('[still]');
						this.add('-fail', pokemon);
						return false;
					}
					if (!target.isActive) {
						const possibleTarget = this.getRandomTarget(pokemon, this.dex.moves.get('pound'));
						if (!possibleTarget) {
							this.add('-miss', pokemon);
							return false;
						}
						target = possibleTarget;
					}
					const moveData: Partial<ActiveMove> = {
						id: 'bide' as ID,
						name: "Bide",
						accuracy: true,
						damage: this.effectState.totalDamage * 2,
						category: "Physical",
						priority: 1,
						flags: { contact: 1, protect: 1 },
						effectType: 'Move',
						type: 'Normal',
					};
					this.actions.tryMoveHit(target, pokemon, moveData as ActiveMove);
					pokemon.removeVolatile('bide');
					return false;
				}
				this.add('-activate', pokemon, 'move: Bide');
			},
			onMoveAborted(pokemon) {
				pokemon.removeVolatile('bide');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Bide', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Tough",
	},
	bind: {
		num: 20,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		name: "Bind",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	bite: {
		num: 44,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Bite",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	bitterblade: {
		num: 891,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Bitter Blade",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1, slicing: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	bittermalice: {
		num: 841,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Bitter Malice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Ghost",
	},
	blackholeeclipse: {
		num: 654,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Black Hole Eclipse",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "darkiniumz",
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	blastburn: {
		num: 307,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Blast Burn",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	blazekick: {
		num: 299,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		name: "Blaze Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	blazingtorque: {
		num: 896,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Blazing Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
	},
	bleakwindstorm: {
		num: 846,
		accuracy: 80,
		basePower: 100,
		category: "Special",
		name: "Bleakwind Storm",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		secondary: {
			chance: 30,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Flying",
	},
	blizzard: {
		num: 59,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		name: "Blizzard",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move) {
			if (this.field.isWeather(['hail', 'snowscape'])) move.accuracy = true;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	block: {
		num: 335,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Block",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			return target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	bloodmoon: {
		num: 901,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Blood Moon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	bloomdoom: {
		num: 644,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Bloom Doom",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "grassiumz",
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	blueflare: {
		num: 551,
		accuracy: 85,
		basePower: 130,
		category: "Special",
		name: "Blue Flare",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	bodypress: {
		num: 776,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Body Press",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		overrideOffensiveStat: 'def',
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	bodyslam: {
		num: 34,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Body Slam",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	boltbeak: {
		num: 754,
		accuracy: 100,
		basePower: 85,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Bolt Beak damage boost');
				return move.basePower * 2;
			}
			this.debug('Bolt Beak NOT boosted');
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Bolt Beak",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	boltstrike: {
		num: 550,
		accuracy: 85,
		basePower: 130,
		category: "Physical",
		name: "Bolt Strike",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Beautiful",
	},
	boneclub: {
		num: 125,
		accuracy: 85,
		basePower: 65,
		category: "Physical",
		isNonstandard: "Past",
		name: "Bone Club",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	bonemerang: {
		num: 155,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		isNonstandard: "Past",
		name: "Bonemerang",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Ground",
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	bonerush: {
		num: 198,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Bone Rush",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Ground",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	boomburst: {
		num: 586,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Boomburst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Tough",
	},
	bounce: {
		num: 340,
		accuracy: 85,
		basePower: 85,
		category: "Physical",
		name: "Bounce",
		pp: 5,
		priority: 0,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1,
			metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
				if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceBasePower(basePower, target, source, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	bouncybubble: {
		num: 733,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Bouncy Bubble",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Clever",
	},
	branchpoke: {
		num: 785,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Branch Poke",
		pp: 40,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	bravebird: {
		num: 413,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Brave Bird",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	breakingswipe: {
		num: 784,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Breaking Swipe",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Dragon",
	},
	breakneckblitz: {
		num: 622,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Breakneck Blitz",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "normaliumz",
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	brickbreak: {
		num: 280,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Brick Break",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	brine: {
		num: 362,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Brine",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) {
			if (target.hp * 2 <= target.maxhp) {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	brutalswing: {
		num: 693,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Brutal Swing",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Dark",
		contestType: "Tough",
	},
	bubble: {
		num: 145,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		isNonstandard: "Past",
		name: "Bubble",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cute",
	},
	bubblebeam: {
		num: 61,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Bubble Beam",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	bugbite: {
		num: 450,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Bug Bite",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target, source) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Bug Bite', `[of] ${source}`);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) source.ateBerry = true;
			}
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	bugbuzz: {
		num: 405,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Bug Buzz",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
	},
	bulkup: {
		num: 339,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Bulk Up",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
			def: 1,
		},
		secondary: null,
		target: "self",
		type: "Fighting",
		zMove: { boost: { atk: 1 } },
		contestType: "Cool",
	},
	bulldoze: {
		num: 523,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Bulldoze",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
	},
	bulletpunch: {
		num: 418,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Bullet Punch",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	bulletseed: {
		num: 331,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Bullet Seed",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	burningbulwark: {
		num: 908,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Burning Bulwark",
		pp: 10,
		priority: 4,
		flags: { metronome: 1, noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'burningbulwark',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					source.trySetStatus('brn', target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Fire",
	},
	burningjealousy: {
		num: 807,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Burning Jealousy",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (target?.statsRaisedThisTurn) {
					target.trySetStatus('brn', source, move);
				}
			},
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Tough",
	},
	burnup: {
		num: 682,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		isNonstandard: "Unobtainable",
		name: "Burn Up",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Fire')) return;
			this.add('-fail', pokemon, 'move: Burn Up');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Fire" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Burn Up');
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	buzzybuzz: {
		num: 734,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Buzzy Buzz",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	calmmind: {
		num: 347,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Calm Mind",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spa: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	camouflage: {
		num: 293,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Camouflage",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			let newType = 'Normal';
			if (this.field.isTerrain('electricterrain')) {
				newType = 'Electric';
			} else if (this.field.isTerrain('grassyterrain')) {
				newType = 'Grass';
			} else if (this.field.isTerrain('mistyterrain')) {
				newType = 'Fairy';
			} else if (this.field.isTerrain('psychicterrain')) {
				newType = 'Psychic';
			}

			if (target.getTypes().join() === newType || !target.setType(newType)) return false;
			this.add('-start', target, 'typechange', newType);
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { evasion: 1 } },
		contestType: "Clever",
	},
	captivate: {
		num: 445,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Captivate",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onTryImmunity(pokemon, source) {
			return (pokemon.gender === 'M' && source.gender === 'F') || (pokemon.gender === 'F' && source.gender === 'M');
		},
		boosts: {
			spa: -2,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		zMove: { boost: { spd: 2 } },
		contestType: "Cute",
	},
	catastropika: {
		num: 658,
		accuracy: true,
		basePower: 210,
		category: "Physical",
		isNonstandard: "Past",
		name: "Catastropika",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "pikaniumz",
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	ceaselessedge: {
		num: 845,
		accuracy: 90,
		basePower: 65,
		category: "Physical",
		name: "Ceaseless Edge",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('spikes');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Dark",
	},
	celebrate: {
		num: 606,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Celebrate",
		pp: 40,
		priority: 0,
		flags: { nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, source) {
			this.add('-activate', target, 'move: Celebrate');
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Cute",
	},
	charge: {
		num: 268,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Charge",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'charge',
		condition: {
			onStart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onRestart(pokemon, source, effect) {
				if (effect && ['Electromorphosis', 'Wind Power'].includes(effect.name)) {
					this.add('-start', pokemon, 'Charge', this.activeMove!.name, '[from] ability: ' + effect.name);
				} else {
					this.add('-start', pokemon, 'Charge');
				}
			},
			onBasePowerPriority: 9,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('charge boost');
					return this.chainModify(2);
				}
			},
			onMoveAborted(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onAfterMove(pokemon, target, move) {
				if (move.type === 'Electric' && move.id !== 'charge') {
					pokemon.removeVolatile('charge');
				}
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Charge', '[silent]');
			},
		},
		boosts: {
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Electric",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	chargebeam: {
		num: 451,
		accuracy: 90,
		basePower: 50,
		category: "Special",
		name: "Charge Beam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 70,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Electric",
		contestType: "Beautiful",
	},
	charm: {
		num: 204,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Charm",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {
			atk: -2,
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	chatter: {
		num: 448,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		isNonstandard: "Past",
		name: "Chatter",
		pp: 20,
		priority: 0,
		flags: {
			protect: 1, mirror: 1, sound: 1, distance: 1, bypasssub: 1,
			nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1,
		},
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	chillingwater: {
		num: 886,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Chilling Water",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	chillyreception: {
		num: 881,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Chilly Reception",
		pp: 10,
		priority: 0,
		flags: {},
		priorityChargeCallback(source) {
			source.addVolatile('chillyreception');
		},
		weather: 'snowscape',
		selfSwitch: true,
		secondary: null,
		condition: {
			duration: 1,
			onBeforeMovePriority: 100,
			onBeforeMove(source, target, move) {
				if (move.id !== 'chillyreception') return;
				this.add('-prepare', source, 'Chilly Reception', '[premajor]');
			},
		},
		target: "all",
		type: "Ice",
	},
	chipaway: {
		num: 498,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		isNonstandard: "Past",
		name: "Chip Away",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		ignoreDefensive: true,
		ignoreEvasion: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	chloroblast: {
		num: 835,
		accuracy: 95,
		basePower: 150,
		category: "Special",
		name: "Chloroblast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		// Recoil implemented in battle-actions.ts
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	circlethrow: {
		num: 509,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		name: "Circle Throw",
		pp: 10,
		priority: -6,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	clamp: {
		num: 128,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		isNonstandard: "Past",
		name: "Clamp",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	clangingscales: {
		num: 691,
		accuracy: 100,
		basePower: 110,
		category: "Special",
		name: "Clanging Scales",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		selfBoost: {
			boosts: {
				def: -1,
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Tough",
	},
	clangoroussoul: {
		num: 775,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Clangorous Soul",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, dance: 1 },
		onTry(source) {
			if (source.hp <= (source.maxhp * 33 / 100) || source.maxhp === 1) return false;
		},
		onTryHit(pokemon, target, move) {
			if (!this.boost(move.boosts!)) return null;
			delete move.boosts;
		},
		onHit(pokemon) {
			this.directDamage(pokemon.maxhp * 33 / 100);
		},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Dragon",
	},
	clangoroussoulblaze: {
		num: 728,
		accuracy: true,
		basePower: 185,
		category: "Special",
		isNonstandard: "Past",
		name: "Clangorous Soulblaze",
		pp: 1,
		priority: 0,
		flags: { sound: 1, bypasssub: 1 },
		selfBoost: {
			boosts: {
				atk: 1,
				def: 1,
				spa: 1,
				spd: 1,
				spe: 1,
			},
		},
		isZ: "kommoniumz",
		secondary: {
			// Sheer Force negates the selfBoost even though it is not secondary
		},
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Cool",
	},
	clearsmog: {
		num: 499,
		accuracy: true,
		basePower: 50,
		category: "Special",
		name: "Clear Smog",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			target.clearBoosts();
			this.add('-clearboost', target);
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	closecombat: {
		num: 370,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Close Combat",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	coaching: {
		num: 811,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Coaching",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		secondary: null,
		boosts: {
			atk: 1,
			def: 1,
		},
		target: "adjacentAlly",
		type: "Fighting",
	},
	coil: {
		num: 489,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Coil",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
			def: 1,
			accuracy: 1,
		},
		secondary: null,
		target: "self",
		type: "Poison",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	collisioncourse: {
		num: 878,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Collision Course",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			if (target.runEffectiveness(move) > 0) {
				// Placeholder
				this.debug(`collision course super effective buff`);
				return this.chainModify([5461, 4096]);
			}
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	combattorque: {
		num: 899,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Combat Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
	},
	cometpunch: {
		num: 4,
		accuracy: 85,
		basePower: 18,
		category: "Physical",
		isNonstandard: "Past",
		name: "Comet Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		maxMove: { basePower: 100 },
		contestType: "Tough",
	},
	comeuppance: {
		num: 894,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const lastDamagedBy = pokemon.getLastDamagedBy(true);
			if (lastDamagedBy !== undefined) {
				return (lastDamagedBy.damage * 1.5) || 1;
			}
			return 0;
		},
		category: "Physical",
		name: "Comeuppance",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1 },
		onTry(source) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (!lastDamagedBy?.thisTurn) return false;
		},
		onModifyTarget(targetRelayVar, source, target, move) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy) {
				targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
			}
		},
		secondary: null,
		target: "scripted",
		type: "Dark",
		contestType: "Cool",
	},
	confide: {
		num: 590,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Confide",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {
			spa: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	confuseray: {
		num: 109,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Confuse Ray",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
		type: "Ghost",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	confusion: {
		num: 93,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Confusion",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	constrict: {
		num: 132,
		accuracy: 100,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Constrict",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	continentalcrush: {
		num: 632,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Continental Crush",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "rockiumz",
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cool",
	},
	conversion: {
		num: 160,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Conversion",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(target) {
			const type = this.dex.moves.get(target.moveSlots[0].id).type;
			if (target.hasType(type) || !target.setType(type)) return false;
			this.add('-start', target, 'typechange', type);
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Beautiful",
	},
	conversion2: {
		num: 176,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Conversion 2",
		pp: 30,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			if (!target.lastMoveUsed) {
				return false;
			}
			const possibleTypes = [];
			const attackType = target.lastMoveUsed.type;
			for (const typeName of this.dex.types.names()) {
				if (source.hasType(typeName)) continue;
				const typeCheck = this.dex.types.get(typeName).damageTaken[attackType];
				if (typeCheck === 2 || typeCheck === 3) {
					possibleTypes.push(typeName);
				}
			}
			if (!possibleTypes.length) {
				return false;
			}
			const randomType = this.sample(possibleTypes);

			if (!source.setType(randomType)) return false;
			this.add('-start', source, 'typechange', randomType);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
	},
	copycat: {
		num: 383,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Copycat",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			let move: Move | ActiveMove | null = this.lastMove;
			if (!move) return;

			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
			if (move.flags['failcopycat'] || move.isZ || move.isMax) {
				return false;
			}
			this.actions.useMove(move.id, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cute",
	},
	coreenforcer: {
		num: 687,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		isNonstandard: "Past",
		name: "Core Enforcer",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		onAfterSubDamage(damage, target) {
			if (target.getAbility().flags['cantsuppress']) return;
			if (target.newlySwitched || this.queue.willMove(target)) return;
			target.addVolatile('gastroacid');
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Dragon",
		zMove: { basePower: 140 },
		contestType: "Tough",
	},
	corkscrewcrash: {
		num: 638,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Corkscrew Crash",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "steeliumz",
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	corrosivegas: {
		num: 810,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Unobtainable",
		name: "Corrosive Gas",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const item = target.takeItem(source);
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Corrosive Gas', `[of] ${source}`);
			} else {
				this.add('-fail', target, 'move: Corrosive Gas');
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Poison",
	},
	cosmicpower: {
		num: 322,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Cosmic Power",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { spd: 1 } },
		contestType: "Beautiful",
	},
	cottonguard: {
		num: 538,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Cotton Guard",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 3,
		},
		secondary: null,
		target: "self",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	cottonspore: {
		num: 178,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Cotton Spore",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		boosts: {
			spe: -2,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	counter: {
		num: 68,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			if (!pokemon.volatiles['counter']) return 0;
			return pokemon.volatiles['counter'].damage || 1;
		},
		category: "Physical",
		name: "Counter",
		pp: 20,
		priority: -5,
		flags: { contact: 1, protect: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('counter');
		},
		onTry(source) {
			if (!source.volatiles['counter']) return false;
			if (source.volatiles['counter'].slot === null) return false;
		},
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2, move) {
				if (move.id !== 'counter') return;
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit(damage, target, source, move) {
				if (!source.isAlly(target) && this.getCategory(move) === 'Physical') {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
		secondary: null,
		target: "scripted",
		type: "Fighting",
		maxMove: { basePower: 75 },
		contestType: "Tough",
	},
	courtchange: {
		num: 756,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Court Change",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		onHitField(target, source) {
			const sideConditions = [
				'mist', 'lightscreen', 'reflect', 'spikes', 'safeguard', 'tailwind', 'toxicspikes', 'poop', 'stealthrock', 'waterpledge', 'firepledge', 'grasspledge', 'stickyweb', 'auroraveil', 'luckychant', 'gmaxsteelsurge', 'gmaxcannonade', 'gmaxvinelash', 'gmaxwildfire', 'gmaxvolcalith',
			];
			let success = false;
			if (this.gameType === "freeforall") {
				// the list of all sides in clockwise order
				const sides = [this.sides[0], this.sides[3]!, this.sides[1], this.sides[2]!];
				const temp: { [k: number]: typeof source.side.sideConditions } = { 0: {}, 1: {}, 2: {}, 3: {} };
				for (const side of sides) {
					for (const id in side.sideConditions) {
						if (!sideConditions.includes(id)) continue;
						temp[side.n][id] = side.sideConditions[id];
						delete side.sideConditions[id];
						success = true;
					}
				}
				for (let i = 0; i < 4; i++) {
					const sourceSideConditions = temp[sides[i].n];
					const targetSide = sides[(i + 1) % 4]; // the next side in rotation
					for (const id in sourceSideConditions) {
						targetSide.sideConditions[id] = sourceSideConditions[id];
						targetSide.sideConditions[id].target = targetSide;
					}
				}
			} else {
				const sourceSideConditions = source.side.sideConditions;
				const targetSideConditions = source.side.foe.sideConditions;
				const sourceTemp: typeof sourceSideConditions = {};
				const targetTemp: typeof targetSideConditions = {};
				for (const id in sourceSideConditions) {
					if (!sideConditions.includes(id)) continue;
					sourceTemp[id] = sourceSideConditions[id];
					delete sourceSideConditions[id];
					success = true;
				}
				for (const id in targetSideConditions) {
					if (!sideConditions.includes(id)) continue;
					targetTemp[id] = targetSideConditions[id];
					delete targetSideConditions[id];
					success = true;
				}
				for (const id in sourceTemp) {
					targetSideConditions[id] = sourceTemp[id];
					targetSideConditions[id].target = source.side.foe;
				}
				for (const id in targetTemp) {
					sourceSideConditions[id] = targetTemp[id];
					sourceSideConditions[id].target = source.side;
				}
			}
			if (!success) return false;
			this.add('-swapsideconditions');
			this.add('-activate', source, 'move: Court Change');
		},
		secondary: null,
		target: "all",
		type: "Normal",
	},
	covet: {
		num: 343,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Covet",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (
				!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)
			) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	crabhammer: {
		num: 152,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Crabhammer",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	craftyshield: {
		num: 578,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Crafty Shield",
		pp: 10,
		priority: 3,
		flags: {},
		sideCondition: 'craftyshield',
		onTry() {
			return !!this.queue.willAct();
		},
		condition: {
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Crafty Shield');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (['self', 'all'].includes(move.target) || move.category !== 'Status') return;
				this.add('-activate', target, 'move: Crafty Shield');
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
		type: "Fairy",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	crosschop: {
		num: 238,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		name: "Cross Chop",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	crosspoison: {
		num: 440,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Cross Poison",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 10,
			status: 'psn',
		},
		critRatio: 2,
		target: "normal",
		type: "Poison",
		contestType: "Cool",
	},
	crunch: {
		num: 242,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Crunch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	crushclaw: {
		num: 306,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		name: "Crush Claw",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	crushgrip: {
		num: 462,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((120 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Crush Grip",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 190 },
		maxMove: { basePower: 140 },
		contestType: "Tough",
	},
	curse: {
		num: 174,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Curse",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		volatileStatus: 'curse',
		onModifyMove(move, source, target) {
			if (!source.hasType('Ghost')) {
				move.target = move.nonGhostTarget!;
			} else if (source.isAlly(target)) {
				move.target = 'randomNormal';
			}
		},
		onTryHit(target, source, move) {
			if (!source.hasType('Ghost')) {
				delete move.volatileStatus;
				delete move.onHit;
				move.self = { boosts: { spe: -1, atk: 1, def: 1 } };
			} else if (move.volatileStatus && target.volatiles['curse']) {
				return false;
			}
		},
		onHit(target, source) {
			this.directDamage(source.maxhp / 2, source, source);
		},
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'Curse', `[of] ${source}`);
			},
			onResidualOrder: 12,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
		secondary: null,
		target: "normal",
		nonGhostTarget: "self",
		type: "Ghost",
		zMove: { effect: 'curse' },
		contestType: "Tough",
	},
	cut: {
		num: 15,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Cut",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	darkestlariat: {
		num: 663,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Darkest Lariat",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	darkpulse: {
		num: 399,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dark Pulse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Dark",
		contestType: "Cool",
	},
	darkvoid: {
		num: 464,
		accuracy: 50,
		basePower: 0,
		category: "Status",
		name: "Dark Void",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, nosketch: 1 },
		status: 'slp',
		onTry(source, target, move) {
			if (source.species.name === 'Darkrai' || move.hasBounced) {
				return;
			}
			this.add('-fail', source, 'move: Dark Void');
			this.hint("Only a Pokemon whose form is Darkrai can use this move.");
			return null;
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Dark",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	dazzlinggleam: {
		num: 605,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Dazzling Gleam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Beautiful",
	},
	decorate: {
		num: 777,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Decorate",
		pp: 15,
		priority: 0,
		flags: { allyanim: 1 },
		secondary: null,
		boosts: {
			atk: 2,
			spa: 2,
		},
		target: "normal",
		type: "Fairy",
	},
	defendorder: {
		num: 455,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defend Order",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
			spd: 1,
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	defensecurl: {
		num: 111,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defense Curl",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
		},
		volatileStatus: 'defensecurl',
		condition: {
			noCopy: true,
			onRestart: () => null,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cute",
	},
	defog: {
		num: 432,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Defog",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			let success = false;
			if (!target.volatiles['substitute'] || move.infiltrates) success = !!this.boost({ evasion: -1 });
			const removeAll = ['spikes', 'toxicspikes', 'poop', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
			for (const targetCondition of removeTarget) {
				if (target.side.removeSideCondition(targetCondition)) {
					if (!removeAll.includes(targetCondition)) continue;
					this.add('-sideend', target.side, this.dex.conditions.get(targetCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			for (const sideCondition of removeAll) {
				if (source.side.removeSideCondition(sideCondition)) {
					this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: Defog', `[of] ${source}`);
					success = true;
				}
			}
			this.field.clearTerrain();
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cool",
	},
	destinybond: {
		num: 194,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Destiny Bond",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'destinybond',
		onPrepareHit(pokemon) {
			return !pokemon.removeVolatile('destinybond');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Destiny Bond');
			},
			onFaint(target, source, effect) {
				if (!source || !effect || target.isAlly(source)) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove']) {
					if (source.volatiles['dynamax']) {
						this.add('-hint', "Dynamaxed Pokémon are immune to Destiny Bond.");
						return;
					}
					this.add('-activate', target, 'move: Destiny Bond');
					source.faint();
				}
			},
			onBeforeMovePriority: -1,
			onBeforeMove(pokemon, target, move) {
				if (move.id === 'destinybond') return;
				this.debug('removing Destiny Bond before attack');
				pokemon.removeVolatile('destinybond');
			},
			onMoveAborted(pokemon, target, move) {
				pokemon.removeVolatile('destinybond');
			},
		},
		secondary: null,
		target: "self",
		type: "Ghost",
		zMove: { effect: 'redirect' },
		contestType: "Clever",
	},
	detect: {
		num: 197,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Detect",
		pp: 5,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		secondary: null,
		target: "self",
		type: "Fighting",
		zMove: { boost: { evasion: 1 } },
		contestType: "Cool",
	},
	devastatingdrake: {
		num: 652,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Devastating Drake",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "dragoniumz",
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	diamondstorm: {
		num: 591,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Diamond Storm",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			chance: 50,
			boosts: {
				def: 2,
			},
		},
		secondary: {
			// Sheer Force negates the self even though it is not secondary
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Beautiful",
	},
	dig: {
		num: 91,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Dig",
		pp: 10,
		priority: 0,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1,
			nonsky: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onInvulnerability(target, source, move) {
				if (['earthquake', 'magnitude'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'earthquake' || move.id === 'magnitude') {
					return this.chainModify(2);
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	disable: {
		num: 50,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Disable",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'disable',
		onTryHit(target) {
			if (!target.lastMove || target.lastMove.isZ || target.lastMove.isMax || target.lastMove.id === 'struggle') {
				return false;
			}
		},
		condition: {
			duration: 5,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon, source, effect) {
				// The target hasn't taken its turn, or Cursed Body activated and the move was not used through Dancer or Instruct
				if (
					this.queue.willMove(pokemon) ||
					(pokemon === this.activePokemon && this.activeMove && !this.activeMove.isExternal)
				) {
					this.effectState.duration!--;
				}
				if (!pokemon.lastMove) {
					this.debug(`Pokemon hasn't moved yet`);
					return false;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === pokemon.lastMove.id) {
						if (!moveSlot.pp) {
							this.debug('Move out of PP');
							return false;
						}
					}
				}
				if (effect.effectType === 'Ability') {
					this.add('-start', pokemon, 'Disable', pokemon.lastMove.name, '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-start', pokemon, 'Disable', pokemon.lastMove.name);
				}
				this.effectState.move = pokemon.lastMove.id;
			},
			onResidualOrder: 17,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Disable');
			},
			onBeforeMovePriority: 7,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && move.id === this.effectState.move) {
					this.add('cant', attacker, 'Disable', move);
					return false;
				}
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id === this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	disarmingvoice: {
		num: 574,
		accuracy: true,
		basePower: 40,
		category: "Special",
		name: "Disarming Voice",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fairy",
		contestType: "Cute",
	},
	discharge: {
		num: 435,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Discharge",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacent",
		type: "Electric",
		contestType: "Beautiful",
	},
	direclaw: {
		num: 827,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Dire Claw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('psn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('slp', source);
				}
			},
		},
		target: "normal",
		type: "Poison",
	},
	dive: {
		num: 291,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Dive",
		pp: 10,
		priority: 0,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1,
			nonsky: 1, allyanim: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			if (attacker.hasAbility('gulpmissile') && attacker.species.name === 'Cramorant' && !attacker.transformed) {
				const forme = attacker.hp <= attacker.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				attacker.formeChange(forme, move);
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onImmunity(type, pokemon) {
				if (type === 'sandstorm' || type === 'hail') return false;
			},
			onInvulnerability(target, source, move) {
				if (['surf', 'whirlpool'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'surf' || move.id === 'whirlpool') {
					return this.chainModify(2);
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	dizzypunch: {
		num: 146,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		isNonstandard: "Past",
		name: "Dizzy Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	doodle: {
		num: 867,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Doodle",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(target, source, move) {
			let success: boolean | null = false;
			if (!target.getAbility().flags['failroleplay']) {
				for (const pokemon of source.alliesAndSelf()) {
					if (pokemon.ability === target.ability || pokemon.getAbility().flags['cantsuppress']) continue;
					const oldAbility = pokemon.setAbility(target.ability, null, move);
					if (oldAbility) {
						success = true;
					} else if (!success && oldAbility === null) {
						success = null;
					}
				}
			}
			if (!success) {
				if (success === false) {
					this.add('-fail', source);
				}
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Normal",
	},
	doomdesire: {
		num: 353,
		accuracy: 100,
		basePower: 140,
		category: "Special",
		name: "Doom Desire",
		pp: 5,
		priority: 0,
		flags: { metronome: 1, futuremove: 1 },
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'doomdesire',
				source,
				moveData: {
					id: 'doomdesire',
					name: "Doom Desire",
					accuracy: 100,
					basePower: 140,
					category: "Special",
					priority: 0,
					flags: { metronome: 1, futuremove: 1 },
					effectType: 'Move',
					type: 'Steel',
				},
			});
			this.add('-start', source, 'Doom Desire');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	doubleedge: {
		num: 38,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Double-Edge",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	doublehit: {
		num: 458,
		accuracy: 90,
		basePower: 35,
		category: "Physical",
		name: "Double Hit",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 140 },
		maxMove: { basePower: 120 },
		contestType: "Cool",
	},
	doubleironbash: {
		num: 742,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Double Iron Bash",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		multihit: 2,
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
		zMove: { basePower: 180 },
		maxMove: { basePower: 140 },
		contestType: "Clever",
	},
	doublekick: {
		num: 24,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Double Kick",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Fighting",
		maxMove: { basePower: 80 },
		contestType: "Cool",
	},
	doubleshock: {
		num: 892,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Double Shock",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryMove(pokemon, target, move) {
			if (pokemon.hasType('Electric')) return;
			this.add('-fail', pokemon, 'move: Double Shock');
			this.attrLastMove('[still]');
			return null;
		},
		self: {
			onHit(pokemon) {
				pokemon.setType(pokemon.getTypes(true).map(type => type === "Electric" ? "???" : type));
				this.add('-start', pokemon, 'typechange', pokemon.getTypes().join('/'), '[from] move: Double Shock');
			},
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	doubleslap: {
		num: 3,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		isNonstandard: "Past",
		name: "Double Slap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	doubleteam: {
		num: 104,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Double Team",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			evasion: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
	},
	dracometeor: {
		num: 434,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Draco Meteor",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	dragonascent: {
		num: 620,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Dragon Ascent",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1 },
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		target: "any",
		type: "Flying",
		contestType: "Beautiful",
	},
	dragonbreath: {
		num: 225,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Dragon Breath",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	dragoncheer: {
		num: 913,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Cheer",
		pp: 15,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'dragoncheer',
		condition: {
			onStart(target, source, effect) {
				if (target.volatiles['focusenergy']) return false;
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Dragon Cheer', '[silent]');
				} else {
					this.add('-start', target, 'move: Dragon Cheer');
				}
				// Store at the start because the boost doesn't change if a Pokemon
				// Terastallizes into Dragon while having this volatile
				// Found by DarkFE:
				// https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/post-9894139
				this.effectState.hasDragonType = target.hasType("Dragon");
			},
			onModifyCritRatio(critRatio, source) {
				return critRatio + (this.effectState.hasDragonType ? 2 : 1);
			},
		},
		secondary: null,
		target: "adjacentAlly",
		type: "Dragon",
	},
	dragonclaw: {
		num: 337,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Dragon Claw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	dragondance: {
		num: 349,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Dragon Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			atk: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Dragon",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
	},
	dragondarts: {
		num: 751,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Dragon Darts",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		multihit: 2,
		smartTarget: true,
		secondary: null,
		target: "normal",
		type: "Dragon",
		maxMove: { basePower: 130 },
	},
	dragonenergy: {
		num: 820,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Dragon Energy",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Dragon",
	},
	dragonhammer: {
		num: 692,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Dragon Hammer",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	dragonpulse: {
		num: 406,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		name: "Dragon Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: null,
		target: "any",
		type: "Dragon",
		contestType: "Beautiful",
	},
	dragonrage: {
		num: 82,
		accuracy: 100,
		basePower: 0,
		damage: 40,
		category: "Special",
		isNonstandard: "Past",
		name: "Dragon Rage",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Cool",
	},
	dragonrush: {
		num: 407,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		name: "Dragon Rush",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	dragontail: {
		num: 525,
		accuracy: 90,
		basePower: 60,
		category: "Physical",
		name: "Dragon Tail",
		pp: 10,
		priority: -6,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		target: "normal",
		type: "Dragon",
		contestType: "Tough",
	},
	drainingkiss: {
		num: 577,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Draining Kiss",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [3, 4],
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	drainpunch: {
		num: 409,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Drain Punch",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	dreameater: {
		num: 138,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Dream Eater",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		onTryImmunity(target) {
			return target.status === 'slp' || target.hasAbility('comatose');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	drillpeck: {
		num: 65,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Drill Peck",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	drillrun: {
		num: 529,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		name: "Drill Run",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	drumbeating: {
		num: 778,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Drum Beating",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Grass",
	},
	dualchop: {
		num: 530,
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		isNonstandard: "Past",
		name: "Dual Chop",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Dragon",
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	dualwingbeat: {
		num: 814,
		accuracy: 90,
		basePower: 40,
		category: "Physical",
		name: "Dual Wingbeat",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Flying",
		maxMove: { basePower: 130 },
	},
	dynamaxcannon: {
		num: 744,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Dynamax Cannon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, failencore: 1, nosleeptalk: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, noparentalbond: 1 },
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	dynamicpunch: {
		num: 223,
		accuracy: 50,
		basePower: 100,
		category: "Physical",
		name: "Dynamic Punch",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	earthpower: {
		num: 414,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Earth Power",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Beautiful",
	},
	earthquake: {
		num: 89,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Earthquake",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Ground",
		contestType: "Tough",
	},
	echoedvoice: {
		num: 497,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			if (this.field.pseudoWeather.echoedvoice) {
				bp = move.basePower * this.field.pseudoWeather.echoedvoice.multiplier;
			}
			this.debug(`BP: ${move.basePower}`);
			return bp;
		},
		category: "Special",
		name: "Echoed Voice",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onTryMove() {
			this.field.addPseudoWeather('echoedvoice');
		},
		condition: {
			duration: 2,
			onFieldStart() {
				this.effectState.multiplier = 1;
			},
			onFieldRestart() {
				if (this.effectState.duration !== 2) {
					this.effectState.duration = 2;
					if (this.effectState.multiplier < 5) {
						this.effectState.multiplier++;
					}
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	eerieimpulse: {
		num: 598,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Eerie Impulse",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			spa: -2,
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	eeriespell: {
		num: 826,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Eerie Spell",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target) {
				if (!target.hp) return;
				let move: Move | ActiveMove | null = target.lastMove;
				if (!move || move.isZ) return;
				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

				const ppDeducted = target.deductPP(move.id, 3);
				if (!ppDeducted) return;
				this.add('-activate', target, 'move: Eerie Spell', move.name, ppDeducted);
			},
		},
		target: "normal",
		type: "Psychic",
	},
	eggbomb: {
		num: 121,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Past",
		name: "Egg Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	electricterrain: {
		num: 604,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Electric Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'electricterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
					if (effect.id === 'yawn' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Electric Terrain');
					}
					return false;
				}
			},
			onTryAddVolatile(status, target) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'yawn') {
					this.add('-activate', target, 'move: Electric Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('electric terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Electric Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Electric Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Electric Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Electric",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	electrify: {
		num: 582,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Electrify",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'electrify',
		onTryHit(target) {
			if (!this.queue.willMove(target) && target.activeTurns) return false;
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Electrify');
			},
			onModifyTypePriority: -2,
			onModifyType(move) {
				if (move.id !== 'struggle') {
					this.debug('Electrify making move type electric');
					move.type = 'Electric';
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	electroball: {
		num: 486,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let ratio = Math.floor(pokemon.getStat('spe') / target.getStat('spe'));
			if (!isFinite(ratio)) ratio = 0;
			const bp = [40, 60, 80, 120, 150][Math.min(ratio, 4)];
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Electro Ball",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	electrodrift: {
		num: 879,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Electro Drift",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onBasePower(basePower, source, target, move) {
			if (target.runEffectiveness(move) > 0) {
				// Placeholder
				this.debug(`electro drift super effective buff`);
				return this.chainModify([5461, 4096]);
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	electroshot: {
		num: 905,
		accuracy: 100,
		basePower: 130,
		category: "Special",
		name: "Electro Shot",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Electric",
	},
	electroweb: {
		num: 527,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		name: "Electroweb",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Electric",
		contestType: "Beautiful",
	},
	embargo: {
		num: 373,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Embargo",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'embargo',
		condition: {
			duration: 5,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Embargo');
				this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onResidualOrder: 21,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Embargo');
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	ember: {
		num: 52,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Ember",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cute",
	},
	encore: {
		num: 227,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Encore",
		pp: 5,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1, failencore: 1 },
		volatileStatus: 'encore',
		condition: {
			duration: 3,
			noCopy: true, // doesn't get copied by Z-Baton Pass
			onStart(target) {
				let move: Move | ActiveMove | null = target.lastMove;
				if (!move || target.volatiles['dynamax']) return false;

				if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);
				const moveSlot = target.getMoveData(move.id);
				if (move.isZ || move.flags['failencore'] || !moveSlot || moveSlot.pp <= 0) {
					// it failed
					return false;
				}
				this.effectState.move = move.id;
				this.add('-start', target, 'Encore');
				if (!this.queue.willMove(target)) {
					this.effectState.duration!++;
				}
			},
			onOverrideAction(pokemon, target, move) {
				if (move.id !== this.effectState.move) return this.effectState.move;
			},
			onResidualOrder: 16,
			onResidual(target) {
				const moveSlot = target.getMoveData(this.effectState.move);
				if (!moveSlot || moveSlot.pp <= 0) {
					// early termination if you run out of PP
					target.removeVolatile('encore');
				}
			},
			onEnd(target) {
				this.add('-end', target, 'Encore');
			},
			onDisableMove(pokemon) {
				if (!this.effectState.move || !pokemon.hasMove(this.effectState.move)) {
					return;
				}
				for (const moveSlot of pokemon.moveSlots) {
					if (moveSlot.id !== this.effectState.move) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Cute",
	},
	endeavor: {
		num: 283,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon, target) {
			return target.getUndynamaxedHP() - pokemon.hp;
		},
		category: "Physical",
		name: "Endeavor",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		onTryImmunity(target, pokemon) {
			return pokemon.hp < target.hp;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	endure: {
		num: 203,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Endure",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'endure',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Endure');
			},
			onDamagePriority: -10,
			onDamage(damage, target, source, effect) {
				if (effect?.effectType === 'Move' && damage >= target.hp) {
					this.add('-activate', target, 'move: Endure');
					return target.hp - 1;
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	energyball: {
		num: 412,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Energy Ball",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	entrainment: {
		num: 494,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Entrainment",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			if (target === source || target.volatiles['dynamax']) return false;
			if (
				target.ability === source.ability ||
				target.getAbility().flags['cantsuppress'] || target.ability === 'truant' ||
				source.getAbility().flags['noentrain']
			) {
				return false;
			}
		},
		onHit(target, source) {
			const oldAbility = target.setAbility(source.ability, source);
			if (!oldAbility) return oldAbility as false | null;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	eruption: {
		num: 284,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Eruption",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	esperwing: {
		num: 840,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Esper Wing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Psychic",
	},
	eternabeam: {
		num: 795,
		accuracy: 90,
		basePower: 160,
		category: "Special",
		isNonstandard: "Past",
		name: "Eternabeam",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	expandingforce: {
		num: 797,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Expanding Force",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source) {
			if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				this.debug('terrain buff');
				return this.chainModify(1.5);
			}
		},
		onModifyMove(move, source, target) {
			if (this.field.isTerrain('psychicterrain') && source.isGrounded()) {
				move.target = 'allAdjacentFoes';
			}
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	explosion: {
		num: 153,
		accuracy: 100,
		basePower: 250,
		category: "Physical",
		name: "Explosion",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	extrasensory: {
		num: 326,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Extrasensory",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	extremeevoboost: {
		num: 702,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Extreme Evoboost",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "eeviumz",
		boosts: {
			atk: 2,
			def: 2,
			spa: 2,
			spd: 2,
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Beautiful",
	},
	extremespeed: {
		num: 245,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Extreme Speed",
		pp: 5,
		priority: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	facade: {
		num: 263,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Facade",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (pokemon.status && pokemon.status !== 'slp') {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	fairylock: {
		num: 587,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fairy Lock",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, bypasssub: 1, metronome: 1 },
		pseudoWeather: 'fairylock',
		condition: {
			duration: 2,
			onFieldStart(target) {
				this.add('-fieldactivate', 'move: Fairy Lock');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		secondary: null,
		target: "all",
		type: "Fairy",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	fairywind: {
		num: 584,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Fairy Wind",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	fakeout: {
		num: 252,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Fake Out",
		pp: 10,
		priority: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Fake Out only works on your first turn out.");
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	faketears: {
		num: 313,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Fake Tears",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {
			spd: -2,
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	falsesurrender: {
		num: 793,
		accuracy: true,
		basePower: 80,
		category: "Physical",
		name: "False Surrender",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	falseswipe: {
		num: 206,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "False Swipe",
		pp: 40,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onDamagePriority: -20,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) return target.hp - 1;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	featherdance: {
		num: 297,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Feather Dance",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, dance: 1, allyanim: 1, metronome: 1 },
		boosts: {
			atk: -2,
		},
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: { boost: { def: 1 } },
		contestType: "Beautiful",
	},
	feint: {
		num: 364,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Feint",
		pp: 10,
		priority: 2,
		flags: { mirror: 1, noassist: 1, failcopycat: 1 },
		breaksProtect: true,
		// Breaking protection implemented in scripts.js
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	feintattack: {
		num: 185,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Feint Attack",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	fellstinger: {
		num: 565,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Fell Stinger",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({ atk: 3 }, pokemon, pokemon, move);
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	ficklebeam: {
		num: 907,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Fickle Beam",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (this.randomChance(3, 10)) {
				this.attrLastMove('[anim] Fickle Beam All Out');
				this.add('-activate', pokemon, 'move: Fickle Beam');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	fierydance: {
		num: 552,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Fiery Dance",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		secondary: {
			chance: 50,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	fierywrath: {
		num: 822,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Fiery Wrath",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Dark",
	},
	filletaway: {
		num: 868,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Fillet Away",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		onTry(source) {
			if (source.hp <= source.maxhp / 2 || source.maxhp === 1) return false;
		},
		onTryHit(pokemon, target, move) {
			if (!this.boost(move.boosts!)) return null;
			delete move.boosts;
		},
		onHit(pokemon) {
			this.directDamage(pokemon.maxhp / 2);
		},
		boosts: {
			atk: 2,
			spa: 2,
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	finalgambit: {
		num: 515,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const damage = pokemon.hp;
			pokemon.faint();
			return damage;
		},
		selfdestruct: "ifHit",
		category: "Special",
		name: "Final Gambit",
		pp: 5,
		priority: 0,
		flags: { protect: 1, metronome: 1, noparentalbond: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		zMove: { basePower: 180 },
		contestType: "Tough",
	},
	fireblast: {
		num: 126,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Fire Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	firefang: {
		num: 424,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		name: "Fire Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondaries: [
			{
				chance: 10,
				status: 'brn',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	firelash: {
		num: 680,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Fire Lash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Cute",
	},
	firepledge: {
		num: 519,
		accuracy: 100,
		basePower: 80,
		basePowerCallback(target, source, move) {
			if (['grasspledge', 'waterpledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Fire Pledge",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, pledgecombo: 1 },
		onPrepareHit(target, source, move) {
			for (const action of this.queue.list as MoveAction[]) {
				if (
					!action.move || !action.pokemon?.isActive ||
					action.pokemon.fainted || action.maxMove || action.zmove
				) {
					continue;
				}
				if (action.pokemon.isAlly(source) && ['grasspledge', 'waterpledge'].includes(action.move.id)) {
					this.queue.prioritizeAction(action, move);
					this.add('-waiting', source, action.pokemon);
					return null;
				}
			}
		},
		onModifyMove(move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Water';
				move.forceSTAB = true;
				move.self = { sideCondition: 'waterpledge' };
			}
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Fire';
				move.forceSTAB = true;
				move.sideCondition = 'firepledge';
			}
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Fire Pledge');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(pokemon) {
				if (!pokemon.hasType('Fire')) this.damage(pokemon.baseMaxhp / 8, pokemon);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 8,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Fire Pledge');
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	firepunch: {
		num: 7,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Fire Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	firespin: {
		num: 83,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		name: "Fire Spin",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	firstimpression: {
		num: 660,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "First Impression",
		pp: 10,
		priority: 2,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("First Impression only works on your first turn out.");
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	fishiousrend: {
		num: 755,
		accuracy: 100,
		basePower: 85,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Fishious Rend damage boost');
				return move.basePower * 2;
			}
			this.debug('Fishious Rend NOT boosted');
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Fishious Rend",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
	},
	fissure: {
		num: 90,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		name: "Fissure",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		ohko: true,
		secondary: null,
		target: "normal",
		type: "Ground",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	flail: {
		num: 175,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Flail",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cute",
	},
	flameburst: {
		num: 481,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		isNonstandard: "Past",
		name: "Flame Burst",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			for (const ally of target.adjacentAllies()) {
				this.damage(ally.baseMaxhp / 16, ally, source, this.dex.conditions.get('Flame Burst'));
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	flamecharge: {
		num: 488,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Flame Charge",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	flamewheel: {
		num: 172,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Flame Wheel",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	flamethrower: {
		num: 53,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Flamethrower",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	flareblitz: {
		num: 394,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Flare Blitz",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	flash: {
		num: 148,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Flash",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			accuracy: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { evasion: 1 } },
		contestType: "Beautiful",
	},
	flashcannon: {
		num: 430,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Flash Cannon",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	flatter: {
		num: 260,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Flatter",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'confusion',
		boosts: {
			spa: 1,
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	fleurcannon: {
		num: 705,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Fleur Cannon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	fling: {
		num: 374,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		name: "Fling",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1, noparentalbond: 1 },
		onPrepareHit(target, source, move) {
			if (source.ignoringItem(true)) return false;
			const item = source.getItem();
			if (!this.singleEvent('TakeItem', item, source.itemState, source, source, move, item)) return false;
			if (!item.fling) return false;
			move.basePower = item.fling.basePower;
			this.debug(`BP: ${move.basePower}`);
			if (item.isBerry) {
				move.onHit = function (foe) {
					if (this.singleEvent('Eat', item, null, foe, null, null)) {
						this.runEvent('EatItem', foe, null, null, item);
						if (item.id === 'leppaberry') foe.staleness = 'external';
					}
					if (item.onEat) foe.ateBerry = true;
				};
			} else if (item.fling.effect) {
				move.onHit = item.fling.effect;
			} else {
				if (!move.secondaries) move.secondaries = [];
				if (item.fling.status) {
					move.secondaries.push({ status: item.fling.status });
				} else if (item.fling.volatileStatus) {
					move.secondaries.push({ volatileStatus: item.fling.volatileStatus });
				}
			}
			source.addVolatile('fling');
		},
		condition: {
			onUpdate(pokemon) {
				const item = pokemon.getItem();
				pokemon.setItem('');
				pokemon.lastItem = item.id;
				pokemon.usedItemThisTurn = true;
				this.add('-enditem', pokemon, item.name, '[from] move: Fling');
				this.runEvent('AfterUseItem', pokemon, null, null, item);
				pokemon.removeVolatile('fling');
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cute",
	},
	flipturn: {
		num: 812,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Flip Turn",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	floatyfall: {
		num: 731,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		isNonstandard: "LGPE",
		name: "Floaty Fall",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	floralhealing: {
		num: 666,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Floral Healing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, heal: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			let success = false;
			if (this.field.isTerrain('grassyterrain')) {
				success = !!this.heal(this.modify(target.baseMaxhp, 0.667));
			} else {
				success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
			}
			if (success && !target.isAlly(source)) {
				target.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', target, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	flowershield: {
		num: 579,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Flower Shield",
		pp: 10,
		priority: 0,
		flags: { distance: 1, metronome: 1 },
		onHitField(t, source, move) {
			const targets: Pokemon[] = [];
			for (const pokemon of this.getAllActive()) {
				if (
					pokemon.hasType('Grass') &&
					(!pokemon.volatiles['maxguard'] ||
						this.runEvent('TryHit', pokemon, source, move))
				) {
					// This move affects every Grass-type Pokemon in play.
					targets.push(pokemon);
				}
			}
			let success = false;
			for (const target of targets) {
				success = this.boost({ def: 1 }, target, source, move) || success;
			}
			return success;
		},
		secondary: null,
		target: "all",
		type: "Fairy",
		zMove: { boost: { def: 1 } },
		contestType: "Beautiful",
	},
	flowertrick: {
		num: 870,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		name: "Flower Trick",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	fly: {
		num: 19,
		accuracy: 95,
		basePower: 90,
		category: "Physical",
		name: "Fly",
		pp: 15,
		priority: 0,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1,
			metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability(target, source, move) {
				if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
					return;
				}
				return false;
			},
			onSourceModifyDamage(damage, source, target, move) {
				if (move.id === 'gust' || move.id === 'twister') {
					return this.chainModify(2);
				}
			},
		},
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Clever",
	},
	flyingpress: {
		num: 560,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Flying Press",
		pp: 10,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, distance: 1, nonsky: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Flying', type);
		},
		priority: 0,
		secondary: null,
		target: "any",
		type: "Fighting",
		zMove: { basePower: 170 },
		contestType: "Tough",
	},
	focusblast: {
		num: 411,
		accuracy: 70,
		basePower: 120,
		category: "Special",
		name: "Focus Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	focusenergy: {
		num: 116,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Focus Energy",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'focusenergy',
		condition: {
			onStart(target, source, effect) {
				if (target.volatiles['dragoncheer']) return false;
				if (effect?.id === 'zpower') {
					this.add('-start', target, 'move: Focus Energy', '[zeffect]');
				} else if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', target, 'move: Focus Energy', '[silent]');
				} else {
					this.add('-start', target, 'move: Focus Energy');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + 2;
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cool",
	},
	focuspunch: {
		num: 264,
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		name: "Focus Punch",
		pp: 20,
		priority: -3,
		flags: {
			contact: 1, protect: 1, punch: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1,
		},
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('focuspunch');
		},
		beforeMoveCallback(pokemon) {
			if (pokemon.volatiles['focuspunch']?.lostFocus) {
				this.add('cant', pokemon, 'Focus Punch', 'Focus Punch');
				return true;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Focus Punch');
			},
			onHit(pokemon, source, move) {
				if (move.category !== 'Status') {
					this.effectState.lostFocus = true;
				}
			},
			onTryAddVolatile(status, pokemon) {
				if (status.id === 'flinch') return null;
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	followme: {
		num: 266,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Follow Me",
		pp: 20,
		priority: 2,
		flags: { noassist: 1, failcopycat: 1 },
		volatileStatus: 'followme',
		onTry(source) {
			return this.activePerHalf > 1;
		},
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				if (effect?.id === 'zpower') {
					this.add('-singleturn', target, 'move: Follow Me', '[zeffect]');
				} else {
					this.add('-singleturn', target, 'move: Follow Me');
				}
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				if (!this.effectState.target.isSkyDropped() && this.validTarget(this.effectState.target, source, move.target)) {
					if (move.smartTarget) move.smartTarget = false;
					this.debug("Follow Me redirected target of move");
					return this.effectState.target;
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	forcepalm: {
		num: 395,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Force Palm",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	foresight: {
		num: 193,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Foresight",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'foresight',
		onTryHit(target) {
			if (target.volatiles['miracleeye']) return false;
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Foresight');
			},
			onNegateImmunity(pokemon, type) {
				if (pokemon.hasType('Ghost') && ['Normal', 'Fighting'].includes(type)) return false;
			},
			onModifyBoost(boosts) {
				if (boosts.evasion && boosts.evasion > 0) {
					boosts.evasion = 0;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'crit2' },
		contestType: "Clever",
	},
	forestscurse: {
		num: 571,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Forest's Curse",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.hasType('Grass')) return false;
			if (!target.addType('Grass')) return false;
			this.add('-start', target, 'typeadd', 'Grass', '[from] move: Forest\'s Curse');
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Clever",
	},
	foulplay: {
		num: 492,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Foul Play",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		overrideOffensivePokemon: 'target',
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	freezedry: {
		num: 573,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Freeze-Dry",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	freezeshock: {
		num: 553,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		name: "Freeze Shock",
		pp: 5,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	freezingglare: {
		num: 821,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Freezing Glare",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Psychic",
	},
	freezyfrost: {
		num: 739,
		accuracy: 90,
		basePower: 100,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Freezy Frost",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
	frenzyplant: {
		num: 338,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Frenzy Plant",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	frostbreath: {
		num: 524,
		accuracy: 90,
		basePower: 60,
		category: "Special",
		name: "Frost Breath",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	frustration: {
		num: 218,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			return Math.floor(((255 - pokemon.happiness) * 10) / 25) || 1;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Frustration",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cute",
	},
	furyattack: {
		num: 31,
		accuracy: 85,
		basePower: 15,
		category: "Physical",
		name: "Fury Attack",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	furycutter: {
		num: 210,
		accuracy: 95,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			if (!pokemon.volatiles['furycutter'] || move.hit === 1) {
				pokemon.addVolatile('furycutter');
			}
			const bp = this.clampIntRange(move.basePower * pokemon.volatiles['furycutter'].multiplier, 1, 160);
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Fury Cutter",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		condition: {
			duration: 2,
			onStart() {
				this.effectState.multiplier = 1;
			},
			onRestart() {
				if (this.effectState.multiplier < 4) {
					this.effectState.multiplier <<= 1;
				}
				this.effectState.duration = 2;
			},
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	furyswipes: {
		num: 154,
		accuracy: 80,
		basePower: 18,
		category: "Physical",
		name: "Fury Swipes",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		maxMove: { basePower: 100 },
		contestType: "Tough",
	},
	fusionbolt: {
		num: 559,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Fusion Bolt",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionflare') {
				this.debug('double power');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	fusionflare: {
		num: 558,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Fusion Flare",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (this.lastSuccessfulMoveThisTurn === 'fusionbolt') {
				this.debug('double power');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	futuresight: {
		num: 248,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Future Sight",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, metronome: 1, futuremove: 1 },
		ignoreImmunity: true,
		onTry(source, target) {
			if (!target.side.addSlotCondition(target, 'futuremove')) return false;
			Object.assign(target.side.slotConditions[target.position]['futuremove'], {
				move: 'futuresight',
				source,
				moveData: {
					id: 'futuresight',
					name: "Future Sight",
					accuracy: 100,
					basePower: 120,
					category: "Special",
					priority: 0,
					flags: { allyanim: 1, metronome: 1, futuremove: 1 },
					ignoreImmunity: false,
					effectType: 'Move',
					type: 'Psychic',
				},
			});
			this.add('-start', source, 'move: Future Sight');
			return this.NOT_FAIL;
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	gastroacid: {
		num: 380,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Gastro Acid",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'gastroacid',
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress']) {
				return false;
			}
			if (target.hasItem('Ability Shield')) {
				this.add('-block', target, 'item: Ability Shield');
				return null;
			}
		},
		condition: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.ts
			onStart(pokemon) {
				if (pokemon.hasItem('Ability Shield')) return false;
				this.add('-endability', pokemon);
				this.singleEvent('End', pokemon.getAbility(), pokemon.abilityState, pokemon, pokemon, 'gastroacid');
			},
			onCopy(pokemon) {
				if (pokemon.getAbility().flags['cantsuppress']) pokemon.removeVolatile('gastroacid');
			},
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
	},
	geargrind: {
		num: 544,
		accuracy: 85,
		basePower: 50,
		category: "Physical",
		isNonstandard: "Past",
		name: "Gear Grind",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Clever",
	},
	gearup: {
		num: 674,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Gear Up",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, bypasssub: 1, metronome: 1 },
		onHitSide(side, source, move) {
			const targets = side.allies().filter(target => (
				target.hasAbility(['plus', 'minus']) &&
				(!target.volatiles['maxguard'] || this.runEvent('TryHit', target, source, move))
			));
			if (!targets.length) return false;
			let didSomething = false;
			for (const target of targets) {
				didSomething = this.boost({ atk: 1, spa: 1 }, target, source, move, false, true) || didSomething;
			}
			return didSomething;
		},
		secondary: null,
		target: "allySide",
		type: "Steel",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	genesissupernova: {
		num: 703,
		accuracy: true,
		basePower: 185,
		category: "Special",
		isNonstandard: "Past",
		name: "Genesis Supernova",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "mewniumz",
		secondary: {
			chance: 100,
			self: {
				onHit() {
					this.field.setTerrain('psychicterrain');
				},
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	geomancy: {
		num: 601,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Geomancy",
		pp: 10,
		priority: 0,
		flags: { charge: 1, nonsky: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		boosts: {
			spa: 2,
			spd: 2,
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Fairy",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Beautiful",
	},
	gigadrain: {
		num: 202,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Giga Drain",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	gigaimpact: {
		num: 416,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Giga Impact",
		pp: 5,
		priority: 0,
		flags: { contact: 1, recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	gigatonhammer: {
		num: 893,
		accuracy: 100,
		basePower: 160,
		category: "Physical",
		name: "Gigaton Hammer",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, cantusetwice: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	gigavolthavoc: {
		num: 646,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Gigavolt Havoc",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "electriumz",
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	glaciallance: {
		num: 824,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Glacial Lance",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ice",
	},
	glaciate: {
		num: 549,
		accuracy: 95,
		basePower: 65,
		category: "Special",
		name: "Glaciate",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	glaiverush: {
		num: 862,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Glaive Rush",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'glaiverush',
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Glaive Rush', '[silent]');
			},
			onAccuracy() {
				return true;
			},
			onSourceModifyDamage() {
				return this.chainModify(2);
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Glaive Rush drawback before attack');
				pokemon.removeVolatile('glaiverush');
			},
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
	},
	glare: {
		num: 137,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Glare",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'par',
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Tough",
	},
	glitzyglow: {
		num: 736,
		accuracy: 95,
		basePower: 80,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Glitzy Glow",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			sideCondition: 'lightscreen',
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	gmaxbefuddle: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Befuddle",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Butterfree",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					const result = this.random(3);
					if (result === 0) {
						pokemon.trySetStatus('slp', source);
					} else if (result === 1) {
						pokemon.trySetStatus('par', source);
					} else {
						pokemon.trySetStatus('psn', source);
					}
				}
			},
		},
		target: "adjacentFoe",
		type: "Bug",
		contestType: "Cool",
	},
	gmaxcannonade: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Cannonade",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Blastoise",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxcannonade');
				}
			},
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'G-Max Cannonade');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				if (!target.hasType('Water')) this.damage(target.baseMaxhp / 6, target);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'G-Max Cannonade');
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	gmaxcentiferno: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Centiferno",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Centiskorch",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Centiferno'));
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Fire",
		contestType: "Cool",
	},
	gmaxchistrike: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Chi Strike",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Machamp",
		self: {
			onHit(source) {
				for (const pokemon of source.alliesAndSelf()) {
					pokemon.addVolatile('gmaxchistrike');
				}
			},
		},
		condition: {
			noCopy: true,
			onStart(target, source, effect) {
				this.effectState.layers = 1;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', target, 'move: G-Max Chi Strike');
				}
			},
			onRestart(target, source, effect) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				if (!['costar', 'imposter', 'psychup', 'transform'].includes(effect?.id)) {
					this.add('-start', target, 'move: G-Max Chi Strike');
				}
			},
			onModifyCritRatio(critRatio) {
				return critRatio + this.effectState.layers;
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Fighting",
		contestType: "Cool",
	},
	gmaxcuddle: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Cuddle",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Eevee",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('attract');
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Normal",
		contestType: "Cool",
	},
	gmaxdepletion: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Depletion",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Duraludon",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					let move: Move | ActiveMove | null = pokemon.lastMove;
					if (!move || move.isZ) continue;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

					const ppDeducted = pokemon.deductPP(move.id, 2);
					if (ppDeducted) {
						this.add("-activate", pokemon, 'move: G-Max Depletion', move.name, ppDeducted);
						// Don't return here because returning early doesn't trigger
						// activation text for the second Pokemon in doubles
					}
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Dragon",
		contestType: "Cool",
	},
	gmaxdrumsolo: {
		num: 1000,
		accuracy: true,
		basePower: 160,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Drum Solo",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Rillaboom",
		ignoreAbility: true,
		secondary: null,
		target: "adjacentFoe",
		type: "Grass",
		contestType: "Cool",
	},
	gmaxfinale: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Finale",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Alcremie",
		self: {
			onHit(target, source, move) {
				for (const pokemon of source.alliesAndSelf()) {
					this.heal(pokemon.maxhp / 6, pokemon, source, move);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Fairy",
		contestType: "Cool",
	},
	gmaxfireball: {
		num: 1000,
		accuracy: true,
		basePower: 160,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Fireball",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Cinderace",
		ignoreAbility: true,
		secondary: null,
		target: "adjacentFoe",
		type: "Fire",
		contestType: "Cool",
	},
	gmaxfoamburst: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Foam Burst",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Kingler",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					this.boost({ spe: -2 }, pokemon);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	gmaxgoldrush: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Gold Rush",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Meowth",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('confusion');
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Normal",
		contestType: "Cool",
	},
	gmaxgravitas: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Gravitas",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Orbeetle",
		self: {
			pseudoWeather: 'gravity',
		},
		target: "adjacentFoe",
		type: "Psychic",
		contestType: "Cool",
	},
	gmaxhydrosnipe: {
		num: 1000,
		accuracy: true,
		basePower: 160,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Hydrosnipe",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Inteleon",
		ignoreAbility: true,
		secondary: null,
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	gmaxmalodor: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Malodor",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Garbodor",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.trySetStatus('psn', source);
				}
			},
		},
		target: "adjacentFoe",
		type: "Poison",
		contestType: "Cool",
	},
	gmaxmeltdown: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Meltdown",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Melmetal",
		self: {
			onHit(source, target, effect) {
				for (const pokemon of source.foes()) {
					if (!pokemon.volatiles['dynamax']) pokemon.addVolatile('torment', source, effect);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Steel",
		contestType: "Cool",
	},
	gmaxoneblow: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max One Blow",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Urshifu",
		secondary: null,
		target: "adjacentFoe",
		type: "Dark",
		contestType: "Cool",
	},
	gmaxrapidflow: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Rapid Flow",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Urshifu-Rapid-Strike",
		secondary: null,
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	gmaxreplenish: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Replenish",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Snorlax",
		self: {
			onHit(source) {
				if (this.randomChance(1, 2)) return;
				for (const pokemon of source.alliesAndSelf()) {
					if (pokemon.item) continue;

					if (pokemon.lastItem && this.dex.items.get(pokemon.lastItem).isBerry) {
						const item = pokemon.lastItem;
						pokemon.lastItem = '';
						this.add('-item', pokemon, this.dex.items.get(item), '[from] move: G-Max Replenish');
						pokemon.setItem(item);
					}
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Normal",
		contestType: "Cool",
	},
	gmaxresonance: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Resonance",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Lapras",
		self: {
			sideCondition: 'auroraveil',
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Ice",
		contestType: "Cool",
	},
	gmaxsandblast: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Sandblast",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Sandaconda",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('partiallytrapped', source, this.dex.getActiveMove('G-Max Sandblast'));
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Ground",
		contestType: "Cool",
	},
	gmaxsmite: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Smite",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Hatterene",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('confusion', source);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Fairy",
		contestType: "Cool",
	},
	gmaxsnooze: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Snooze",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Grimmsnarl",
		onHit(target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.randomChance(1, 2)) return;
			target.addVolatile('yawn');
		},
		onAfterSubDamage(damage, target) {
			if (target.status || !target.runStatusImmunity('slp')) return;
			if (this.randomChance(1, 2)) return;
			target.addVolatile('yawn');
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Dark",
		contestType: "Cool",
	},
	gmaxsteelsurge: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Steelsurge",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Copperajah",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxsteelsurge');
				}
			},
		},
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: G-Max Steelsurge');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				// Ice Face and Disguise correctly get typed damage from Stealth Rock
				// because Stealth Rock bypasses Substitute.
				// They don't get typed damage from Steelsurge because Steelsurge doesn't,
				// so we're going to test the damage of a Steel-type Stealth Rock instead.
				const steelHazard = this.dex.getActiveMove('Stealth Rock');
				steelHazard.type = 'Steel';
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(steelHazard), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Steel",
		contestType: "Cool",
	},
	gmaxstonesurge: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Stonesurge",
		pp: 5,
		priority: 0,
		flags: {},
		isMax: "Drednaw",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock');
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	gmaxstunshock: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Stun Shock",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Toxtricity",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					const result = this.random(2);
					if (result === 0) {
						pokemon.trySetStatus('par', source);
					} else {
						pokemon.trySetStatus('psn', source);
					}
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Electric",
		contestType: "Cool",
	},
	gmaxsweetness: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Sweetness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Appletun",
		self: {
			onHit(source) {
				for (const ally of source.side.pokemon) {
					ally.cureStatus();
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Grass",
		contestType: "Cool",
	},
	gmaxtartness: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Tartness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Flapple",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					this.boost({ evasion: -1 }, pokemon);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Grass",
		contestType: "Cool",
	},
	gmaxterror: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Terror",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Gengar",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.addVolatile('trapped', source, null, 'trapper');
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Ghost",
		contestType: "Cool",
	},
	gmaxvinelash: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Vine Lash",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Venusaur",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxvinelash');
				}
			},
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'G-Max Vine Lash');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				if (!target.hasType('Grass')) this.damage(target.baseMaxhp / 6, target);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'G-Max Vine Lash');
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Grass",
		contestType: "Cool",
	},
	gmaxvolcalith: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Volcalith",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Coalossal",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxvolcalith');
				}
			},
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'G-Max Volcalith');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				if (!target.hasType('Rock')) this.damage(target.baseMaxhp / 6, target);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'G-Max Volcalith');
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Rock",
		contestType: "Cool",
	},
	gmaxvoltcrash: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Volt Crash",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Pikachu",
		self: {
			onHit(source) {
				for (const pokemon of source.foes()) {
					pokemon.trySetStatus('par', source);
				}
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Electric",
		contestType: "Cool",
	},
	gmaxwildfire: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Wildfire",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Charizard",
		self: {
			onHit(source) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('gmaxwildfire');
				}
			},
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'G-Max Wildfire');
			},
			onResidualOrder: 5,
			onResidualSubOrder: 1,
			onResidual(target) {
				if (!target.hasType('Fire')) this.damage(target.baseMaxhp / 6, target);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 11,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'G-Max Wildfire');
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Fire",
		contestType: "Cool",
	},
	gmaxwindrage: {
		num: 1000,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Gigantamax",
		name: "G-Max Wind Rage",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: "Corviknight",
		self: {
			onHit(source) {
				let success = false;
				const removeAll = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				const removeTarget = ['reflect', 'lightscreen', 'auroraveil', 'safeguard', 'mist', ...removeAll];
				for (const targetCondition of removeTarget) {
					if (source.side.foe.removeSideCondition(targetCondition)) {
						if (!removeAll.includes(targetCondition)) continue;
						this.add('-sideend', source.side.foe, this.dex.conditions.get(targetCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				for (const sideCondition of removeAll) {
					if (source.side.removeSideCondition(sideCondition)) {
						this.add('-sideend', source.side, this.dex.conditions.get(sideCondition).name, '[from] move: G-Max Wind Rage', `[of] ${source}`);
						success = true;
					}
				}
				this.field.clearTerrain();
				return success;
			},
		},
		secondary: null,
		target: "adjacentFoe",
		type: "Flying",
		contestType: "Cool",
	},
	grassknot: {
		num: 447,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) {
				bp = 120;
			} else if (targetWeight >= 1000) {
				bp = 100;
			} else if (targetWeight >= 500) {
				bp = 80;
			} else if (targetWeight >= 250) {
				bp = 60;
			} else if (targetWeight >= 100) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Grass Knot",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, source, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', source, 'move: Grass Knot', '[from] Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cute",
	},
	grasspledge: {
		num: 520,
		accuracy: 100,
		basePower: 80,
		basePowerCallback(target, source, move) {
			if (['waterpledge', 'firepledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Grass Pledge",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, pledgecombo: 1 },
		onPrepareHit(target, source, move) {
			for (const action of this.queue.list as MoveAction[]) {
				if (
					!action.move || !action.pokemon?.isActive ||
					action.pokemon.fainted || action.maxMove || action.zmove
				) {
					continue;
				}
				if (action.pokemon.isAlly(source) && ['waterpledge', 'firepledge'].includes(action.move.id)) {
					this.queue.prioritizeAction(action, move);
					this.add('-waiting', source, action.pokemon);
					return null;
				}
			}
		},
		onModifyMove(move) {
			if (move.sourceEffect === 'waterpledge') {
				move.type = 'Grass';
				move.forceSTAB = true;
				move.sideCondition = 'grasspledge';
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Fire';
				move.forceSTAB = true;
				move.sideCondition = 'firepledge';
			}
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Grass Pledge');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 9,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Grass Pledge');
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.25);
			},
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	grasswhistle: {
		num: 320,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Grass Whistle",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	grassyglide: {
		num: 803,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		name: "Grassy Glide",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyPriority(priority, source, target, move) {
			if (this.field.isTerrain('grassyterrain') && source.isGrounded()) {
				return priority + 1;
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	grassyterrain: {
		num: 580,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Grassy Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'grassyterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
				if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('move weakened by grassy terrain');
					return this.chainModify(0.5);
				}
				if (move.type === 'Grass' && attacker.isGrounded()) {
					this.debug('grassy terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Grassy Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Grassy Terrain');
				}
			},
			onResidualOrder: 5,
			onResidualSubOrder: 2,
			onResidual(pokemon) {
				if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
					this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
				} else {
					this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Grassy Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Grass",
		zMove: { boost: { def: 1 } },
		contestType: "Beautiful",
	},
	gravapple: {
		num: 788,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Grav Apple",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onBasePower(basePower) {
			if (this.field.getPseudoWeather('gravity')) {
				return this.chainModify(1.5);
			}
		},
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Grass",
	},
	gravity: {
		num: 356,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Gravity",
		pp: 5,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'gravity',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Gravity');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Gravity', '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Gravity');
				}
				for (const pokemon of this.getAllActive()) {
					let applies = false;
					if (pokemon.removeVolatile('bounce') || pokemon.removeVolatile('fly')) {
						applies = true;
						this.queue.cancelMove(pokemon);
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['skydrop']) {
						applies = true;
						this.queue.cancelMove(pokemon);

						if (pokemon.volatiles['skydrop'].source) {
							this.add('-end', pokemon.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
						}
						pokemon.removeVolatile('skydrop');
						pokemon.removeVolatile('twoturnmove');
					}
					if (pokemon.volatiles['magnetrise']) {
						applies = true;
						delete pokemon.volatiles['magnetrise'];
					}
					if (pokemon.volatiles['telekinesis']) {
						applies = true;
						delete pokemon.volatiles['telekinesis'];
					}
					if (applies) this.add('-activate', pokemon, 'move: Gravity');
				}
			},
			onModifyAccuracy(accuracy) {
				if (typeof accuracy !== 'number') return;
				return this.chainModify([6840, 4096]);
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['gravity']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['gravity'] && !move.isZ) {
					this.add('cant', pokemon, 'move: Gravity', move);
					return false;
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 2,
			onFieldEnd() {
				this.add('-fieldend', 'move: Gravity');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	growl: {
		num: 45,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Growl",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {
			atk: -1,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	growth: {
		num: 74,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Growth",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) move.boosts = { atk: 2, spa: 2 };
		},
		boosts: {
			atk: 1,
			spa: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Beautiful",
	},
	grudge: {
		num: 288,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Grudge",
		pp: 5,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		volatileStatus: 'grudge',
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint(target, source, effect) {
				if (!source || source.fainted || !effect) return;
				if (effect.effectType === 'Move' && !effect.flags['futuremove'] && source.lastMove) {
					let move: Move = source.lastMove;
					if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

					for (const moveSlot of source.moveSlots) {
						if (moveSlot.id === move.id) {
							moveSlot.pp = 0;
							this.add('-activate', source, 'move: Grudge', move.name);
						}
					}
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
		secondary: null,
		target: "self",
		type: "Ghost",
		zMove: { effect: 'redirect' },
		contestType: "Tough",
	},
	guardianofalola: {
		num: 698,
		accuracy: true,
		basePower: 0,
		damageCallback(pokemon, target) {
			const hp75 = Math.floor(target.getUndynamaxedHP() * 3 / 4);
			if (
				target.volatiles['protect'] || target.volatiles['banefulbunker'] || target.volatiles['kingsshield'] ||
				target.volatiles['spikyshield'] || target.side.getSideCondition('matblock')
			) {
				this.add('-zbroken', target);
				return this.clampIntRange(Math.ceil(hp75 / 4 - 0.5), 1);
			}
			return this.clampIntRange(hp75, 1);
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Guardian of Alola",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "tapuniumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
	},
	guardsplit: {
		num: 470,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Guard Split",
		pp: 10,
		priority: 0,
		flags: { protect: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const newdef = Math.floor((target.storedStats.def + source.storedStats.def) / 2);
			target.storedStats.def = newdef;
			source.storedStats.def = newdef;
			const newspd = Math.floor((target.storedStats.spd + source.storedStats.spd) / 2);
			target.storedStats.spd = newspd;
			source.storedStats.spd = newspd;
			this.add('-activate', source, 'move: Guard Split', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	guardswap: {
		num: 385,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Guard Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};

			const defSpd: BoostID[] = ['def', 'spd'];
			for (const stat of defSpd) {
				targetBoosts[stat] = target.boosts[stat];
				sourceBoosts[stat] = source.boosts[stat];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'def, spd', '[from] move: Guard Swap');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	guillotine: {
		num: 12,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		name: "Guillotine",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		ohko: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	gunkshot: {
		num: 441,
		accuracy: 80,
		basePower: 120,
		category: "Physical",
		name: "Gunk Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	gust: {
		num: 16,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Gust",
		pp: 35,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Clever",
	},
	gyroball: {
		num: 360,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let power = Math.floor(25 * target.getStat('spe') / pokemon.getStat('spe')) + 1;
			if (!isFinite(power)) power = 1;
			if (power > 150) power = 150;
			this.debug(`BP: ${power}`);
			return power;
		},
		category: "Physical",
		name: "Gyro Ball",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	hail: {
		num: 258,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Hail",
		pp: 10,
		priority: 0,
		flags: { metronome: 1 },
		weather: 'hail',
		secondary: null,
		target: "all",
		type: "Ice",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	hammerarm: {
		num: 359,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Hammer Arm",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		self: {
			boosts: {
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	happyhour: {
		num: 603,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Happy Hour",
		pp: 30,
		priority: 0,
		flags: { metronome: 1 },
		onTryHit(target, source) {
			this.add('-activate', target, 'move: Happy Hour');
		},
		secondary: null,
		target: "allySide",
		type: "Normal",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Cute",
	},
	harden: {
		num: 106,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Harden",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	hardpress: {
		num: 912,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((100 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Hard Press",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	haze: {
		num: 114,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Haze",
		pp: 30,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHitField() {
			this.add('-clearallboost');
			for (const pokemon of this.getAllActive()) {
				pokemon.clearBoosts();
			}
		},
		secondary: null,
		target: "all",
		type: "Ice",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
	},
	headbutt: {
		num: 29,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Headbutt",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	headcharge: {
		num: 543,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		isNonstandard: "Past",
		name: "Head Charge",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	headlongrush: {
		num: 838,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Headlong Rush",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		self: {
			boosts: {
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Ground",
	},
	headsmash: {
		num: 457,
		accuracy: 80,
		basePower: 150,
		category: "Physical",
		name: "Head Smash",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 2],
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	healbell: {
		num: 215,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Heal Bell",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source) {
			this.add('-activate', source, 'move: Heal Bell');
			let success = false;
			const allies = [...target.side.pokemon, ...target.side.allySide?.pokemon || []];
			for (const ally of allies) {
				if (ally !== source && !this.suppressingAbility(ally)) {
					if (ally.hasAbility('soundproof')) {
						this.add('-immune', ally, '[from] ability: Soundproof');
						continue;
					}
					if (ally.hasAbility('goodasgold')) {
						this.add('-immune', ally, '[from] ability: Good as Gold');
						continue;
					}
				}
				if (ally.cureStatus()) success = true;
			}
			return success;
		},
		target: "allyTeam",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
	},
	healblock: {
		num: 377,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Heal Block",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'healblock',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (effect?.name === "Psychic Noise") {
					return 2;
				}
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Heal Block');
					return 7;
				}
				return 5;
			},
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Heal Block');
				source.moveThisTurnResult = true;
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['heal']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (move.flags['heal'] && !move.isZ && !move.isMax) {
					this.add('cant', pokemon, 'move: Heal Block', move);
					return false;
				}
			},
			onResidualOrder: 20,
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Heal Block');
			},
			onTryHeal(damage, target, source, effect) {
				if (effect && (effect.id === 'zpower' || (effect as Move).isZ)) return damage;
				if (source && target !== source && target.hp !== target.maxhp && effect.name === "Pollen Puff") {
					this.attrLastMove('[still]');
					// FIXME: Wrong error message, correct one not supported yet
					this.add('cant', source, 'move: Heal Block', effect);
					return null;
				}
				return false;
			},
			onRestart(target, source, effect) {
				if (effect?.name === 'Psychic Noise') return;

				this.add('-fail', target, 'move: Heal Block'); // Succeeds to supress downstream messages
				if (!source.moveThisTurnResult) {
					source.moveThisTurnResult = false;
				}
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Psychic",
		zMove: { boost: { spa: 2 } },
		contestType: "Clever",
	},
	healingwish: {
		num: 361,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Healing Wish",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		selfdestruct: "ifHit",
		slotCondition: 'healingwish',
		condition: {
			onSwitchIn(target) {
				this.singleEvent('Swap', this.effect, this.effectState, target);
			},
			onSwap(target) {
				if (!target.fainted && (target.hp < target.maxhp || target.status)) {
					target.heal(target.maxhp);
					target.clearStatus();
					this.add('-heal', target, target.getHealth, '[from] move: Healing Wish');
					target.side.removeSlotCondition(target, 'healingwish');
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	healorder: {
		num: 456,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Heal Order",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	healpulse: {
		num: 505,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Heal Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, distance: 1, heal: 1, allyanim: 1, metronome: 1, pulse: 1 },
		onHit(target, source) {
			let success = false;
			if (source.hasAbility('megalauncher')) {
				success = !!this.heal(this.modify(target.baseMaxhp, 0.75));
			} else {
				success = !!this.heal(Math.ceil(target.baseMaxhp * 0.5));
			}
			if (success && !target.isAlly(source)) {
				target.staleness = 'external';
			}
			if (!success) {
				this.add('-fail', target, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "any",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	heartstamp: {
		num: 531,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Heart Stamp",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Cute",
	},
	heartswap: {
		num: 391,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Heart Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};

			let i: BoostID;
			for (i in target.boosts) {
				targetBoosts[i] = target.boosts[i];
				sourceBoosts[i] = source.boosts[i];
			}

			target.setBoost(sourceBoosts);
			source.setBoost(targetBoosts);

			this.add('-swapboost', source, target, '[from] move: Heart Swap');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { effect: 'crit2' },
		contestType: "Clever",
	},
	heatcrash: {
		num: 535,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) {
				bp = 120;
			} else if (pokemonWeight >= targetWeight * 4) {
				bp = 100;
			} else if (pokemonWeight >= targetWeight * 3) {
				bp = 80;
			} else if (pokemonWeight >= targetWeight * 2) {
				bp = 60;
			} else {
				bp = 40;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Heat Crash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	heatwave: {
		num: 257,
		accuracy: 90,
		basePower: 95,
		category: "Special",
		name: "Heat Wave",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	heavyslam: {
		num: 484,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			const pokemonWeight = pokemon.getWeight();
			let bp;
			if (pokemonWeight >= targetWeight * 5) {
				bp = 120;
			} else if (pokemonWeight >= targetWeight * 4) {
				bp = 100;
			} else if (pokemonWeight >= targetWeight * 3) {
				bp = 80;
			} else if (pokemonWeight >= targetWeight * 2) {
				bp = 60;
			} else {
				bp = 40;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Heavy Slam",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	helpinghand: {
		num: 270,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Helping Hand",
		pp: 20,
		priority: 5,
		flags: { bypasssub: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'helpinghand',
		onTryHit(target) {
			if (!target.newlySwitched && !this.queue.willMove(target)) return false;
		},
		condition: {
			duration: 1,
			onStart(target, source) {
				this.effectState.multiplier = 1.5;
				this.add('-singleturn', target, 'Helping Hand', `[of] ${source}`);
			},
			onRestart(target, source) {
				this.effectState.multiplier *= 1.5;
				this.add('-singleturn', target, 'Helping Hand', `[of] ${source}`);
			},
			onBasePowerPriority: 10,
			onBasePower(basePower) {
				this.debug('Boosting from Helping Hand: ' + this.effectState.multiplier);
				return this.chainModify(this.effectState.multiplier);
			},
		},
		secondary: null,
		target: "adjacentAlly",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	hex: {
		num: 506,
		accuracy: 100,
		basePower: 65,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Hex",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		zMove: { basePower: 160 },
		contestType: "Clever",
	},
	hiddenpower: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "Past",
		name: "Hidden Power",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			move.type = pokemon.hpType || 'Dark';
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	hiddenpowerbug: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Bug",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	hiddenpowerdark: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Dark",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	hiddenpowerdragon: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Dragon",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Clever",
	},
	hiddenpowerelectric: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Electric",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	hiddenpowerfighting: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Fighting",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},
	hiddenpowerfire: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Fire",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	hiddenpowerflying: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Flying",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Clever",
	},
	hiddenpowerghost: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Ghost",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	hiddenpowergrass: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Grass",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	hiddenpowerground: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Ground",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Clever",
	},
	hiddenpowerice: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Ice",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Clever",
	},
	hiddenpowerpoison: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Poison",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	hiddenpowerpsychic: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Psychic",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	hiddenpowerrock: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Rock",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Clever",
	},
	hiddenpowersteel: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Steel",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Clever",
	},
	hiddenpowerwater: {
		num: 237,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		realMove: "Hidden Power",
		isNonstandard: "Past",
		name: "Hidden Power Water",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Clever",
	},
	highhorsepower: {
		num: 667,
		accuracy: 95,
		basePower: 95,
		category: "Physical",
		name: "High Horsepower",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	highjumpkick: {
		num: 136,
		accuracy: 90,
		basePower: 130,
		category: "Physical",
		name: "High Jump Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('High Jump Kick'));
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	holdback: {
		num: 610,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Hold Back",
		pp: 40,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onDamagePriority: -20,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp) return target.hp - 1;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	holdhands: {
		num: 607,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Unobtainable",
		name: "Hold Hands",
		pp: 40,
		priority: 0,
		flags: { bypasssub: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		secondary: null,
		target: "adjacentAlly",
		type: "Normal",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Cute",
	},
	honeclaws: {
		num: 468,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Hone Claws",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
			accuracy: 1,
		},
		secondary: null,
		target: "self",
		type: "Dark",
		zMove: { boost: { atk: 1 } },
		contestType: "Cute",
	},
	hornattack: {
		num: 30,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Horn Attack",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	horndrill: {
		num: 32,
		accuracy: 30,
		basePower: 0,
		category: "Physical",
		name: "Horn Drill",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		ohko: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	hornleech: {
		num: 532,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Horn Leech",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	howl: {
		num: 336,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Howl",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, sound: 1, metronome: 1 },
		boosts: {
			atk: 1,
		},
		secondary: null,
		target: "allies",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Cool",
	},
	hurricane: {
		num: 542,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		name: "Hurricane",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Flying",
		contestType: "Tough",
	},
	hydrocannon: {
		num: 308,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Hydro Cannon",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	hydropump: {
		num: 56,
		accuracy: 80,
		basePower: 110,
		category: "Special",
		name: "Hydro Pump",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	hydrosteam: {
		num: 876,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Hydro Steam",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		// Damage boost in Sun applied in conditions.ts
		thawsTarget: true,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	hydrovortex: {
		num: 642,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Hydro Vortex",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "wateriumz",
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	hyperbeam: {
		num: 63,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Hyper Beam",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	hyperdrill: {
		num: 887,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Hyper Drill",
		pp: 5,
		priority: 0,
		flags: { contact: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	hyperfang: {
		num: 158,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Past",
		name: "Hyper Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	hyperspacefury: {
		num: 621,
		accuracy: true,
		basePower: 100,
		category: "Physical",
		name: "Hyperspace Fury",
		pp: 5,
		priority: 0,
		flags: { mirror: 1, bypasssub: 1, nosketch: 1 },
		breaksProtect: true,
		onTry(source) {
			if (source.species.name === 'Hoopa-Unbound') {
				return;
			}
			this.hint("Only a Pokemon whose form is Hoopa Unbound can use this move.");
			if (source.species.name === 'Hoopa') {
				this.attrLastMove('[still]');
				this.add('-fail', source, 'move: Hyperspace Fury', '[forme]');
				return null;
			}
			this.attrLastMove('[still]');
			this.add('-fail', source, 'move: Hyperspace Fury');
			return null;
		},
		self: {
			boosts: {
				def: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	hyperspacehole: {
		num: 593,
		accuracy: true,
		basePower: 80,
		category: "Special",
		name: "Hyperspace Hole",
		pp: 5,
		priority: 0,
		flags: { mirror: 1, bypasssub: 1 },
		breaksProtect: true,
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	hypervoice: {
		num: 304,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Hyper Voice",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	hypnosis: {
		num: 95,
		accuracy: 60,
		basePower: 0,
		category: "Status",
		name: "Hypnosis",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	iceball: {
		num: 301,
		accuracy: 90,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const iceballData = pokemon.volatiles['iceball'];
			if (iceballData?.hitCount) {
				bp *= 2 ** iceballData.contactHitCount;
			}
			if (iceballData && pokemon.status !== 'slp') {
				iceballData.hitCount++;
				iceballData.contactHitCount++;
				if (iceballData.hitCount < 5) {
					iceballData.duration = 2;
				}
			}
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Ice Ball",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, bullet: 1, noparentalbond: 1 },
		onModifyMove(move, pokemon, target) {
			if (pokemon.volatiles['iceball'] || pokemon.status === 'slp' || !target) return;
			pokemon.addVolatile('iceball');
			if (move.sourceEffect) pokemon.lastMoveTargetLoc = pokemon.getLocOf(target);
		},
		onAfterMove(source, target, move) {
			const iceballData = source.volatiles["iceball"];
			if (
				iceballData &&
				iceballData.hitCount === 5 &&
				iceballData.contactHitCount < 5
				// this conditions can only be met in gen7 and gen8dlc1
				// see `disguise` and `iceface` abilities in the resp mod folders
			) {
				source.addVolatile("rolloutstorage");
				source.volatiles["rolloutstorage"].contactHitCount =
				iceballData.contactHitCount;
			}
		},

		condition: {
			duration: 1,
			onLockMove: 'iceball',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['iceball'];
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	icebeam: {
		num: 58,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Ice Beam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	iceburn: {
		num: 554,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		name: "Ice Burn",
		pp: 5,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	icefang: {
		num: 423,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		name: "Ice Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondaries: [
			{
				chance: 10,
				status: 'frz',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	icehammer: {
		num: 665,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		name: "Ice Hammer",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		self: {
			boosts: {
				spe: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Tough",
	},
	icepunch: {
		num: 8,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Ice Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	iceshard: {
		num: 420,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Ice Shard",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	icespinner: {
		num: 861,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Ice Spinner",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, source) {
			if (source.hp) {
				this.field.clearTerrain();
			}
		},
		onAfterSubDamage(damage, target, source) {
			if (source.hp) {
				this.field.clearTerrain();
			}
		},
		secondary: null,
		target: "normal",
		type: "Ice",
	},
	iciclecrash: {
		num: 556,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		name: "Icicle Crash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ice",
		contestType: "Beautiful",
	},
	iciclespear: {
		num: 333,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Icicle Spear",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Ice",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
	},
	icywind: {
		num: 196,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		name: "Icy Wind",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	imprison: {
		num: 286,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Imprison",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, bypasssub: 1, metronome: 1, mustpressure: 1 },
		volatileStatus: 'imprison',
		condition: {
			noCopy: true,
			onStart(target) {
				this.add('-start', target, 'move: Imprison');
			},
			onFoeDisableMove(pokemon) {
				for (const moveSlot of this.effectState.source.moveSlots) {
					if (moveSlot.id === 'struggle') continue;
					pokemon.disableMove(moveSlot.id, true);
				}
				pokemon.maybeDisabled = true;
			},
			onFoeBeforeMovePriority: 4,
			onFoeBeforeMove(attacker, defender, move) {
				if (move.id !== 'struggle' && this.effectState.source.hasMove(move.id) && !move.isZ && !move.isMax) {
					this.add('cant', attacker, 'move: Imprison', move);
					return false;
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { spd: 2 } },
		contestType: "Clever",
	},
	incinerate: {
		num: 510,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Incinerate",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onHit(pokemon, source) {
			const item = pokemon.getItem();
			if ((item.isBerry || item.isGem) && pokemon.takeItem(source)) {
				this.add('-enditem', pokemon, item.name, '[from] move: Incinerate');
			}
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Tough",
	},
	infernalparade: {
		num: 844,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) return move.basePower * 2;
			return move.basePower;
		},
		category: "Special",
		name: "Infernal Parade",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Ghost",
	},
	inferno: {
		num: 517,
		accuracy: 50,
		basePower: 100,
		category: "Special",
		name: "Inferno",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	infernooverdrive: {
		num: 640,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Inferno Overdrive",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "firiumz",
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Cool",
	},
	infestation: {
		num: 611,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		name: "Infestation",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	ingrain: {
		num: 275,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Ingrain",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'ingrain',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual(pokemon) {
				this.heal(pokemon.baseMaxhp / 16);
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut(pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
		secondary: null,
		target: "self",
		type: "Grass",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	instruct: {
		num: 689,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Instruct",
		pp: 15,
		priority: 0,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, failinstruct: 1 },
		onHit(target, source) {
			if (!target.lastMove || target.volatiles['dynamax']) return false;
			const lastMove = target.lastMove;
			const moveSlot = target.getMoveData(lastMove.id);
			if (
				lastMove.flags['failinstruct'] || lastMove.isZ || lastMove.isMax ||
				lastMove.flags['charge'] || lastMove.flags['recharge'] ||
				target.volatiles['beakblast'] || target.volatiles['focuspunch'] || target.volatiles['shelltrap'] ||
				(moveSlot && moveSlot.pp <= 0)
			) {
				return false;
			}
			this.add('-singleturn', target, 'move: Instruct', `[of] ${source}`);
			this.queue.prioritizeAction(this.queue.resolveAction({
				choice: 'move',
				pokemon: target,
				moveid: target.lastMove.id,
				targetLoc: target.lastMoveTargetLoc!,
			})[0] as MoveAction);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	iondeluge: {
		num: 569,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Ion Deluge",
		pp: 25,
		priority: 1,
		flags: { metronome: 1 },
		pseudoWeather: 'iondeluge',
		condition: {
			duration: 1,
			onFieldStart(target, source, sourceEffect) {
				this.add('-fieldactivate', 'move: Ion Deluge');
				this.hint(`Normal-type moves become Electric-type after using ${sourceEffect}.`);
			},
			onModifyTypePriority: -2,
			onModifyType(move) {
				if (move.type === 'Normal') {
					move.type = 'Electric';
					this.debug(move.name + "'s type changed to Electric");
				}
			},
		},
		secondary: null,
		target: "all",
		type: "Electric",
		zMove: { boost: { spa: 1 } },
		contestType: "Beautiful",
	},
	irondefense: {
		num: 334,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Iron Defense",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 2,
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	ironhead: {
		num: 442,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Iron Head",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Steel",
		contestType: "Tough",
	},
	irontail: {
		num: 231,
		accuracy: 75,
		basePower: 100,
		category: "Physical",
		name: "Iron Tail",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	ivycudgel: {
		num: 904,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Ivy Cudgel",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		onPrepareHit(target, source, move) {
			if (move.type !== "Grass") {
				this.attrLastMove('[anim] Ivy Cudgel ' + move.type);
			}
		},
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Ogerpon-Wellspring': case 'Ogerpon-Wellspring-Tera':
				move.type = 'Water';
				break;
			case 'Ogerpon-Hearthflame': case 'Ogerpon-Hearthflame-Tera':
				move.type = 'Fire';
				break;
			case 'Ogerpon-Cornerstone': case 'Ogerpon-Cornerstone-Tera':
				move.type = 'Rock';
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	jawlock: {
		num: 746,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Jaw Lock",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		onHit(target, source, move) {
			source.addVolatile('trapped', target, move, 'trapper');
			target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	jetpunch: {
		num: 857,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Jet Punch",
		pp: 15,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	judgment: {
		num: 449,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Judgment",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (item.id && item.onPlate && !item.zMove) {
				move.type = item.onPlate;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	jumpkick: {
		num: 26,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Past",
		name: "Jump Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, gravity: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('Jump Kick'));
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	junglehealing: {
		num: 816,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Jungle Healing",
		pp: 10,
		priority: 0,
		flags: { heal: 1, bypasssub: 1, allyanim: 1 },
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "allies",
		type: "Grass",
	},
	karatechop: {
		num: 2,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		isNonstandard: "Past",
		name: "Karate Chop",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	kinesis: {
		num: 134,
		accuracy: 80,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Kinesis",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			accuracy: -1,
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { evasion: 1 } },
		contestType: "Clever",
	},
	kingsshield: {
		num: 588,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "King's Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1, failinstruct: 1 },
		stallingMove: true,
		volatileStatus: 'kingsshield',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ atk: -1 }, source, target, this.dex.getActiveMove("King's Shield"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost({ atk: -1 }, source, target, this.dex.getActiveMove("King's Shield"));
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cool",
	},
	knockoff: {
		num: 282,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Knock Off",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source, target, move) {
			const item = target.getItem();
			if (!this.singleEvent('TakeItem', item, target.itemState, target, target, move, item)) return;
			if (item.id) {
				return this.chainModify(1.5);
			}
		},
		onAfterHit(target, source) {
			if (source.hp) {
				const item = target.takeItem();
				if (item) {
					this.add('-enditem', target, item.name, '[from] move: Knock Off', `[of] ${source}`);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	kowtowcleave: {
		num: 869,
		accuracy: true,
		basePower: 85,
		category: "Physical",
		name: "Kowtow Cleave",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	landswrath: {
		num: 616,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		isNonstandard: "Past",
		name: "Land's Wrath",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ground",
		zMove: { basePower: 185 },
		contestType: "Beautiful",
	},
	laserfocus: {
		num: 673,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Laser Focus",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'laserfocus',
		condition: {
			duration: 2,
			onStart(pokemon, source, effect) {
				if (effect && (['costar', 'imposter', 'psychup', 'transform'].includes(effect.id))) {
					this.add('-start', pokemon, 'move: Laser Focus', '[silent]');
				} else {
					this.add('-start', pokemon, 'move: Laser Focus');
				}
			},
			onRestart(pokemon) {
				this.effectState.duration = 2;
				this.add('-start', pokemon, 'move: Laser Focus');
			},
			onModifyCritRatio(critRatio) {
				return 5;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'move: Laser Focus', '[silent]');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Cool",
	},
	lashout: {
		num: 808,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Lash Out",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, source) {
			if (source.statsLoweredThisTurn) {
				this.debug('lashout buff');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	lastresort: {
		num: 387,
		accuracy: 100,
		basePower: 140,
		category: "Physical",
		name: "Last Resort",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source) {
			if (source.moveSlots.length < 2) return false; // Last Resort fails unless the user knows at least 2 moves
			let hasLastResort = false; // User must actually have Last Resort for it to succeed
			for (const moveSlot of source.moveSlots) {
				if (moveSlot.id === 'lastresort') {
					hasLastResort = true;
					continue;
				}
				if (!moveSlot.used) return false;
			}
			return hasLastResort;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	lastrespects: {
		num: 854,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			return 50 + 50 * pokemon.side.totalFainted;
		},
		category: "Physical",
		name: "Last Respects",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	lavaplume: {
		num: 436,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Lava Plume",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Tough",
	},
	leafage: {
		num: 670,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Leafage",
		pp: 40,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	leafblade: {
		num: 348,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Leaf Blade",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	leafstorm: {
		num: 437,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Leaf Storm",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	leaftornado: {
		num: 536,
		accuracy: 90,
		basePower: 65,
		category: "Special",
		isNonstandard: "Past",
		name: "Leaf Tornado",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	leechlife: {
		num: 141,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Leech Life",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Clever",
	},
	leechseed: {
		num: 73,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Leech Seed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'leechseed',
		condition: {
			onStart(target) {
				this.add('-start', target, 'move: Leech Seed');
			},
			onResidualOrder: 8,
			onResidual(pokemon) {
				const target = this.getAtSlot(pokemon.volatiles['leechseed'].sourceSlot);
				if (!target || target.fainted || target.hp <= 0) {
					this.debug('Nothing to leech into');
					return;
				}
				const damage = this.damage(pokemon.baseMaxhp / 8, pokemon, target);
				if (damage) {
					this.heal(damage, target, pokemon);
				}
			},
		},
		onTryImmunity(target) {
			return !target.hasType('Grass');
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	leer: {
		num: 43,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Leer",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			def: -1,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Cool",
	},
	letssnuggleforever: {
		num: 726,
		accuracy: true,
		basePower: 190,
		category: "Physical",
		isNonstandard: "Past",
		name: "Let's Snuggle Forever",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "mimikiumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Cool",
	},
	lick: {
		num: 122,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Lick",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cute",
	},
	lifedew: {
		num: 791,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Life Dew",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, bypasssub: 1 },
		heal: [1, 4],
		secondary: null,
		target: "allies",
		type: "Water",
	},
	lightofruin: {
		num: 617,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		isNonstandard: "Past",
		name: "Light of Ruin",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		recoil: [1, 2],
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	lightscreen: {
		num: 113,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Light Screen",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'lightscreen',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Special') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Light Screen weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Light Screen');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 2,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Light Screen');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Psychic",
		zMove: { boost: { spd: 1 } },
		contestType: "Beautiful",
	},
	lightthatburnsthesky: {
		num: 723,
		accuracy: true,
		basePower: 200,
		category: "Special",
		isNonstandard: "Past",
		name: "Light That Burns the Sky",
		pp: 1,
		priority: 0,
		flags: {},
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		ignoreAbility: true,
		isZ: "ultranecroziumz",
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	liquidation: {
		num: 710,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Liquidation",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	lockon: {
		num: 199,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Lock-On",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source) {
			if (source.volatiles['lockon']) return false;
		},
		onHit(target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Lock-On', `[of] ${target}`);
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onSourceInvulnerabilityPriority: 1,
			onSourceInvulnerability(target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return 0;
			},
			onSourceAccuracy(accuracy, target, source, move) {
				if (move && source === this.effectState.target && target === this.effectState.source) return true;
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	lovelykiss: {
		num: 142,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Lovely Kiss",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	lowkick: {
		num: 67,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			const targetWeight = target.getWeight();
			let bp;
			if (targetWeight >= 2000) {
				bp = 120;
			} else if (targetWeight >= 1000) {
				bp = 100;
			} else if (targetWeight >= 500) {
				bp = 80;
			} else if (targetWeight >= 250) {
				bp = 60;
			} else if (targetWeight >= 100) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Low Kick",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, pokemon, move) {
			if (target.volatiles['dynamax']) {
				this.add('-fail', pokemon, 'Dynamax');
				this.attrLastMove('[still]');
				return null;
			}
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		zMove: { basePower: 160 },
		contestType: "Tough",
	},
	lowsweep: {
		num: 490,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Low Sweep",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Clever",
	},
	luckychant: {
		num: 381,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Lucky Chant",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'luckychant',
		condition: {
			duration: 5,
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			},
			onCriticalHit: false,
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 6,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
			},
		},
		secondary: null,
		target: "allySide",
		type: "Normal",
		zMove: { boost: { evasion: 1 } },
		contestType: "Cute",
	},
	luminacrash: {
		num: 855,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Lumina Crash",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Psychic",
	},
	lunarblessing: {
		num: 849,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Lunar Blessing",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			const success = !!this.heal(this.modify(pokemon.maxhp, 0.25));
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "allies",
		type: "Psychic",
	},
	lunardance: {
		num: 461,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Lunar Dance",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, dance: 1, heal: 1, metronome: 1 },
		onTryHit(source) {
			if (!this.canSwitch(source.side)) {
				this.attrLastMove('[still]');
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
		},
		selfdestruct: "ifHit",
		slotCondition: 'lunardance',
		condition: {
			onSwitchIn(target) {
				this.singleEvent('Swap', this.effect, this.effectState, target);
			},
			onSwap(target) {
				if (
					!target.fainted && (
						target.hp < target.maxhp ||
						target.status ||
						target.moveSlots.some(moveSlot => moveSlot.pp < moveSlot.maxpp)
					)
				) {
					target.heal(target.maxhp);
					target.clearStatus();
					for (const moveSlot of target.moveSlots) {
						moveSlot.pp = moveSlot.maxpp;
					}
					this.add('-heal', target, target.getHealth, '[from] move: Lunar Dance');
					target.side.removeSlotCondition(target, 'lunardance');
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		contestType: "Beautiful",
	},
	lunge: {
		num: 679,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Lunge",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	lusterpurge: {
		num: 295,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Luster Purge",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	machpunch: {
		num: 183,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Mach Punch",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	magicalleaf: {
		num: 345,
		accuracy: true,
		basePower: 60,
		category: "Special",
		name: "Magical Leaf",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	magicaltorque: {
		num: 900,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Magical Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	magiccoat: {
		num: 277,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Magic Coat",
		pp: 15,
		priority: 4,
		flags: { metronome: 1 },
		volatileStatus: 'magiccoat',
		condition: {
			duration: 1,
			onStart(target, source, effect) {
				this.add('-singleturn', target, 'move: Magic Coat');
				if (effect?.effectType === 'Move') {
					this.effectState.pranksterBoosted = effect.pranksterBoosted;
				}
			},
			onTryHitPriority: 2,
			onTryHit(target, source, move) {
				if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
					return;
				}
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = this.effectState.pranksterBoosted;
				this.actions.useMove(newMove, target, { target: source });
				return null;
			},
			onAllyTryHitSide(target, source, move) {
				if (target.isAlly(source) || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
					return;
				}
				const newMove = this.dex.getActiveMove(move.id);
				newMove.hasBounced = true;
				newMove.pranksterBoosted = false;
				this.actions.useMove(newMove, this.effectState.target, { target: source });
				move.hasBounced = true; // only bounce once in free-for-all battles
				return null;
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { spd: 2 } },
		contestType: "Beautiful",
	},
	magicpowder: {
		num: 750,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Magic Powder",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1, powder: 1 },
		onHit(target) {
			if (target.getTypes().join() === 'Psychic' || !target.setType('Psychic')) return false;
			this.add('-start', target, 'typechange', 'Psychic');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
	},
	magicroom: {
		num: 478,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magic Room",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'magicroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Magic Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Magic Room', `[of] ${source}`);
				}
				for (const mon of this.getAllActive()) {
					this.singleEvent('End', mon.getItem(), mon.itemState, mon);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('magicroom');
			},
			// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 6,
			onFieldEnd() {
				this.add('-fieldend', 'move: Magic Room', '[of] ' + this.effectState.source);
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	magmastorm: {
		num: 463,
		accuracy: 75,
		basePower: 100,
		category: "Special",
		name: "Magma Storm",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Tough",
	},
	magnetbomb: {
		num: 443,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Magnet Bomb",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	magneticflux: {
		num: 602,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magnetic Flux",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHitSide(side, source, move) {
			const targets = side.allies().filter(ally => (
				ally.hasAbility(['plus', 'minus']) &&
				(!ally.volatiles['maxguard'] || this.runEvent('TryHit', ally, source, move))
			));
			if (!targets.length) return false;

			let didSomething = false;
			for (const target of targets) {
				didSomething = this.boost({ def: 1, spd: 1 }, target, source, move, false, true) || didSomething;
			}
			return didSomething;
		},
		secondary: null,
		target: "allySide",
		type: "Electric",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	magnetrise: {
		num: 393,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Magnet Rise",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, gravity: 1, metronome: 1 },
		volatileStatus: 'magnetrise',
		onTry(source, target, move) {
			if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;

			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		condition: {
			duration: 5,
			onStart(target) {
				this.add('-start', target, 'Magnet Rise');
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onResidualOrder: 18,
			onEnd(target) {
				this.add('-end', target, 'Magnet Rise');
			},
		},
		secondary: null,
		target: "self",
		type: "Electric",
		zMove: { boost: { evasion: 1 } },
		contestType: "Clever",
	},
	magnitude: {
		num: 222,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		isNonstandard: "Past",
		name: "Magnitude",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			const i = this.random(100);
			if (i < 5) {
				move.magnitude = 4;
				move.basePower = 10;
			} else if (i < 15) {
				move.magnitude = 5;
				move.basePower = 30;
			} else if (i < 35) {
				move.magnitude = 6;
				move.basePower = 50;
			} else if (i < 65) {
				move.magnitude = 7;
				move.basePower = 70;
			} else if (i < 85) {
				move.magnitude = 8;
				move.basePower = 90;
			} else if (i < 95) {
				move.magnitude = 9;
				move.basePower = 110;
			} else {
				move.magnitude = 10;
				move.basePower = 150;
			}
		},
		onUseMoveMessage(pokemon, target, move) {
			this.add('-activate', pokemon, 'move: Magnitude', move.magnitude);
		},
		secondary: null,
		target: "allAdjacent",
		type: "Ground",
		zMove: { basePower: 140 },
		maxMove: { basePower: 140 },
		contestType: "Tough",
	},
	makeitrain: {
		num: 874,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Make It Rain",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			boosts: {
				spa: -1,
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Steel",
		contestType: "Beautiful",
	},
	maliciousmoonsault: {
		num: 696,
		accuracy: true,
		basePower: 180,
		category: "Physical",
		isNonstandard: "Past",
		name: "Malicious Moonsault",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "inciniumz",
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	malignantchain: {
		num: 919,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Malignant Chain",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			status: 'tox',
		},
		target: "normal",
		type: "Poison",
	},
	matblock: {
		num: 561,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Mat Block",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, nonsky: 1, noassist: 1, failcopycat: 1 },
		stallingMove: true,
		sideCondition: 'matblock',
		onTry(source) {
			if (source.activeMoveActions > 1) {
				this.hint("Mat Block only works on your first turn out.");
				return false;
			}
			return !!this.queue.willAct();
		},
		condition: {
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Mat Block');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move && (move.target === 'self' || move.category === 'Status')) return;
				this.add('-activate', target, 'move: Mat Block', move.name);
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
		type: "Fighting",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	matchagotcha: {
		num: 902,
		accuracy: 90,
		basePower: 80,
		category: "Special",
		name: "Matcha Gotcha",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		thawsTarget: true,
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Grass",
	},
	maxairstream: {
		num: 766,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Airstream",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) {
					this.boost({ spe: 1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Flying",
		contestType: "Cool",
	},
	maxdarkness: {
		num: 772,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Darkness",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) {
					this.boost({ spd: -1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Dark",
		contestType: "Cool",
	},
	maxflare: {
		num: 757,
		accuracy: true,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Flare",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sunnyday');
			},
		},
		target: "adjacentFoe",
		type: "Fire",
		contestType: "Cool",
	},
	maxflutterby: {
		num: 758,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Flutterby",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) {
					this.boost({ spa: -1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Bug",
		contestType: "Cool",
	},
	maxgeyser: {
		num: 765,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Geyser",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('raindance');
			},
		},
		target: "adjacentFoe",
		type: "Water",
		contestType: "Cool",
	},
	maxguard: {
		num: 743,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Max Guard",
		pp: 10,
		priority: 4,
		flags: {},
		isMax: true,
		stallingMove: true,
		volatileStatus: 'maxguard',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Max Guard');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				const bypassesMaxGuard = [
					'acupressure', 'afteryou', 'allyswitch', 'aromatherapy', 'aromaticmist', 'coaching', 'confide', 'copycat', 'curse', 'decorate', 'doomdesire', 'feint', 'futuresight', 'gmaxoneblow', 'gmaxrapidflow', 'healbell', 'holdhands', 'howl', 'junglehealing', 'lifedew', 'meanlook', 'perishsong', 'playnice', 'powertrick', 'roar', 'roleplay', 'tearfullook',
				];
				if (bypassesMaxGuard.includes(move.id)) return;
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Max Guard');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cool",
	},
	maxhailstorm: {
		num: 763,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Hailstorm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('hail');
			},
		},
		target: "adjacentFoe",
		type: "Ice",
		contestType: "Cool",
	},
	maxknuckle: {
		num: 761,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Knuckle",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) {
					this.boost({ atk: 1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Fighting",
		contestType: "Cool",
	},
	maxlightning: {
		num: 759,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Lightning",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('electricterrain');
			},
		},
		target: "adjacentFoe",
		type: "Electric",
		contestType: "Cool",
	},
	maxmindstorm: {
		num: 769,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Mindstorm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('psychicterrain');
			},
		},
		target: "adjacentFoe",
		type: "Psychic",
		contestType: "Cool",
	},
	maxooze: {
		num: 764,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Ooze",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) {
					this.boost({ spa: 1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Poison",
		contestType: "Cool",
	},
	maxovergrowth: {
		num: 773,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Overgrowth",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('grassyterrain');
			},
		},
		target: "adjacentFoe",
		type: "Grass",
		contestType: "Cool",
	},
	maxphantasm: {
		num: 762,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Phantasm",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) {
					this.boost({ def: -1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Ghost",
		contestType: "Cool",
	},
	maxquake: {
		num: 771,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Quake",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) {
					this.boost({ spd: 1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Ground",
		contestType: "Cool",
	},
	maxrockfall: {
		num: 770,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Rockfall",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setWeather('sandstorm');
			},
		},
		target: "adjacentFoe",
		type: "Rock",
		contestType: "Cool",
	},
	maxstarfall: {
		num: 767,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Starfall",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				this.field.setTerrain('mistyterrain');
			},
		},
		target: "adjacentFoe",
		type: "Fairy",
		contestType: "Cool",
	},
	maxsteelspike: {
		num: 774,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Steelspike",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.alliesAndSelf()) {
					this.boost({ def: 1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Steel",
		contestType: "Cool",
	},
	maxstrike: {
		num: 760,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Strike",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) {
					this.boost({ spe: -1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Normal",
		contestType: "Cool",
	},
	maxwyrmwind: {
		num: 768,
		accuracy: true,
		basePower: 10,
		category: "Physical",
		isNonstandard: "Past",
		name: "Max Wyrmwind",
		pp: 10,
		priority: 0,
		flags: {},
		isMax: true,
		self: {
			onHit(source) {
				if (!source.volatiles['dynamax']) return;
				for (const pokemon of source.foes()) {
					this.boost({ atk: -1 }, pokemon);
				}
			},
		},
		target: "adjacentFoe",
		type: "Dragon",
		contestType: "Cool",
	},
	meanlook: {
		num: 212,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mean Look",
		pp: 5,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			return target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Beautiful",
	},
	meditate: {
		num: 96,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Meditate",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { atk: 1 } },
		contestType: "Beautiful",
	},
	mefirst: {
		num: 382,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Me First",
		pp: 20,
		priority: 0,
		flags: {
			protect: 1, bypasssub: 1,
			failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1,
		},
		onTryHit(target, pokemon) {
			const action = this.queue.willMove(target);
			if (!action) return false;
			const move = this.dex.getActiveMove(action.move.id);
			if (action.zmove || move.isZ || move.isMax) return false;
			if (target.volatiles['mustrecharge']) return false;
			if (move.category === 'Status' || move.flags['failmefirst']) return false;

			pokemon.addVolatile('mefirst');
			this.actions.useMove(move, pokemon, { target });
			return null;
		},
		condition: {
			duration: 1,
			onBasePowerPriority: 12,
			onBasePower(basePower) {
				return this.chainModify(1.5);
			},
		},
		callsMove: true,
		secondary: null,
		target: "adjacentFoe",
		type: "Normal",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	megadrain: {
		num: 72,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Mega Drain",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { basePower: 120 },
		contestType: "Clever",
	},
	megahorn: {
		num: 224,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		name: "Megahorn",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	megakick: {
		num: 25,
		accuracy: 75,
		basePower: 120,
		category: "Physical",
		name: "Mega Kick",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	megapunch: {
		num: 5,
		accuracy: 85,
		basePower: 80,
		category: "Physical",
		name: "Mega Punch",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	memento: {
		num: 262,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Memento",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		boosts: {
			atk: -2,
			spa: -2,
		},
		selfdestruct: "ifHit",
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { effect: 'healreplacement' },
		contestType: "Tough",
	},
	menacingmoonrazemaelstrom: {
		num: 725,
		accuracy: true,
		basePower: 200,
		category: "Special",
		isNonstandard: "Past",
		name: "Menacing Moonraze Maelstrom",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "lunaliumz",
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	metalburst: {
		num: 368,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			const lastDamagedBy = pokemon.getLastDamagedBy(true);
			if (lastDamagedBy !== undefined) {
				return (lastDamagedBy.damage * 1.5) || 1;
			}
			return 0;
		},
		category: "Physical",
		name: "Metal Burst",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, failmefirst: 1 },
		onTry(source) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (!lastDamagedBy?.thisTurn) return false;
		},
		onModifyTarget(targetRelayVar, source, target, move) {
			const lastDamagedBy = source.getLastDamagedBy(true);
			if (lastDamagedBy) {
				targetRelayVar.target = this.getAtSlot(lastDamagedBy.slot);
			}
		},
		secondary: null,
		target: "scripted",
		type: "Steel",
		contestType: "Cool",
	},
	metalclaw: {
		num: 232,
		accuracy: 95,
		basePower: 50,
		category: "Physical",
		name: "Metal Claw",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	metalsound: {
		num: 319,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Metal Sound",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		boosts: {
			spd: -2,
		},
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	meteorassault: {
		num: 794,
		accuracy: 100,
		basePower: 150,
		category: "Physical",
		isNonstandard: "Past",
		name: "Meteor Assault",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, failinstruct: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	meteorbeam: {
		num: 800,
		accuracy: 90,
		basePower: 120,
		category: "Special",
		name: "Meteor Beam",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ spa: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	meteormash: {
		num: 309,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Meteor Mash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 20,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	metronome: {
		num: 118,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Metronome",
		pp: 10,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(pokemon) {
			const moves = this.dex.moves.all().filter(move => (
				(!move.isNonstandard || move.isNonstandard === 'Unobtainable') &&
				move.flags['metronome']
			));
			let randomMove = '';
			if (moves.length) {
				moves.sort((a, b) => a.num - b.num);
				randomMove = this.sample(moves).id;
			}
			if (!randomMove) return false;
			this.actions.useMove(randomMove, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
		type: "Normal",
		contestType: "Cute",
	},
	mightycleave: {
		num: 910,
		accuracy: 100,
		basePower: 95,
		category: "Physical",
		name: "Mighty Cleave",
		pp: 5,
		priority: 0,
		flags: { contact: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	milkdrink: {
		num: 208,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Milk Drink",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	mimic: {
		num: 102,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mimic",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, bypasssub: 1, allyanim: 1,
			failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1,
		},
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || move.flags['failmimic'] || source.moves.includes(move.id)) {
				return false;
			}
			if (move.isZ || move.isMax) return false;
			const mimicIndex = source.moves.indexOf('mimic');
			if (mimicIndex < 0) return false;

			source.moveSlots[mimicIndex] = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
				virtual: true,
			};
			this.add('-start', source, 'Mimic', move.name);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cute",
	},
	mindblown: {
		num: 720,
		accuracy: 100,
		basePower: 150,
		category: "Special",
		isNonstandard: "Past",
		name: "Mind Blown",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Mind Blown'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Fire",
		contestType: "Cool",
	},
	mindreader: {
		num: 170,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Mind Reader",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source) {
			if (source.volatiles['lockon']) return false;
		},
		onHit(target, source) {
			source.addVolatile('lockon', target);
			this.add('-activate', source, 'move: Mind Reader', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	minimize: {
		num: 107,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Minimize",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'minimize',
		condition: {
			noCopy: true,
			onRestart: () => null,
			onSourceModifyDamage(damage, source, target, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'supercellslam',
				];
				if (boostedMoves.includes(move.id)) {
					return this.chainModify(2);
				}
			},
			onAccuracy(accuracy, target, source, move) {
				const boostedMoves = [
					'stomp', 'steamroller', 'bodyslam', 'flyingpress', 'dragonrush', 'heatcrash', 'heavyslam', 'maliciousmoonsault', 'supercellslam',
				];
				if (boostedMoves.includes(move.id)) {
					return true;
				}
				return accuracy;
			},
		},
		boosts: {
			evasion: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	miracleeye: {
		num: 357,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Miracle Eye",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'miracleeye',
		onTryHit(target) {
			if (target.volatiles['foresight']) return false;
		},
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Miracle Eye');
			},
			onNegateImmunity(pokemon, type) {
				if (pokemon.hasType('Dark') && type === 'Psychic') return false;
			},
			onModifyBoost(boosts) {
				if (boosts.evasion && boosts.evasion > 0) {
					boosts.evasion = 0;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	mirrorcoat: {
		num: 243,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			if (!pokemon.volatiles['mirrorcoat']) return 0;
			return pokemon.volatiles['mirrorcoat'].damage || 1;
		},
		category: "Special",
		name: "Mirror Coat",
		pp: 20,
		priority: -5,
		flags: { protect: 1, failmefirst: 1, noassist: 1 },
		beforeTurnCallback(pokemon) {
			pokemon.addVolatile('mirrorcoat');
		},
		onTry(source) {
			if (!source.volatiles['mirrorcoat']) return false;
			if (source.volatiles['mirrorcoat'].slot === null) return false;
		},
		condition: {
			duration: 1,
			noCopy: true,
			onStart(target, source, move) {
				this.effectState.slot = null;
				this.effectState.damage = 0;
			},
			onRedirectTargetPriority: -1,
			onRedirectTarget(target, source, source2, move) {
				if (move.id !== 'mirrorcoat') return;
				if (source !== this.effectState.target || !this.effectState.slot) return;
				return this.getAtSlot(this.effectState.slot);
			},
			onDamagingHit(damage, target, source, move) {
				if (!source.isAlly(target) && this.getCategory(move) === 'Special') {
					this.effectState.slot = source.getSlot();
					this.effectState.damage = 2 * damage;
				}
			},
		},
		secondary: null,
		target: "scripted",
		type: "Psychic",
		contestType: "Beautiful",
	},
	mirrormove: {
		num: 119,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Mirror Move",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, pokemon) {
			const move = target.lastMove;
			if (!move?.flags['mirror'] || move.isZ || move.isMax) {
				return false;
			}
			this.actions.useMove(move.id, pokemon, { target });
			return null;
		},
		callsMove: true,
		secondary: null,
		target: "normal",
		type: "Flying",
		zMove: { boost: { atk: 2 } },
		contestType: "Clever",
	},
	mirrorshot: {
		num: 429,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		isNonstandard: "Past",
		name: "Mirror Shot",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Beautiful",
	},
	mist: {
		num: 54,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Mist",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'mist',
		condition: {
			duration: 5,
			onTryBoost(boost, target, source, effect) {
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (source && target !== source) {
					let showMsg = false;
					let i: BoostID;
					for (i in boost) {
						if (boost[i]! < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !(effect as ActiveMove).secondaries) {
						this.add('-activate', target, 'move: Mist');
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Mist');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 4,
			onSideEnd(side) {
				this.add('-sideend', side, 'Mist');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Ice",
		zMove: { effect: 'heal' },
		contestType: "Beautiful",
	},
	mistball: {
		num: 296,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Mist Ball",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 50,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	mistyexplosion: {
		num: 802,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Misty Explosion",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfdestruct: "always",
		onBasePower(basePower, source) {
			if (this.field.isTerrain('mistyterrain') && source.isGrounded()) {
				this.debug('misty terrain boost');
				return this.chainModify(1.5);
			}
		},
		secondary: null,
		target: "allAdjacent",
		type: "Fairy",
	},
	mistyterrain: {
		num: 581,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Misty Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'mistyterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (effect && ((effect as Move).status || effect.id === 'yawn')) {
					this.add('-activate', target, 'move: Misty Terrain');
				}
				return false;
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!target.isGrounded() || target.isSemiInvulnerable()) return;
				if (status.id === 'confusion') {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Misty Terrain');
					return null;
				}
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
					this.debug('misty terrain weaken');
					return this.chainModify(0.5);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Misty Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Misty Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'Misty Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Fairy",
		zMove: { boost: { spd: 1 } },
		contestType: "Beautiful",
	},
	moonblast: {
		num: 585,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Moonblast",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Beautiful",
	},
	moongeistbeam: {
		num: 714,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Moongeist Beam",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	moonlight: {
		num: 236,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Moonlight",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
		type: "Fairy",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	morningsun: {
		num: 234,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Morning Sun",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	mortalspin: {
		num: 866,
		accuracy: 100,
		basePower: 30,
		category: "Physical",
		name: "Mortal Spin",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'poop', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Mortal Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Mortal Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		secondary: {
			chance: 100,
			status: 'psn',
		},
		target: "allAdjacentFoes",
		type: "Poison",
	},
	mountaingale: {
		num: 836,
		accuracy: 85,
		basePower: 100,
		category: "Physical",
		name: "Mountain Gale",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Ice",
	},
	mudbomb: {
		num: 426,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		isNonstandard: "Past",
		name: "Mud Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	mudshot: {
		num: 341,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		name: "Mud Shot",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	mudslap: {
		num: 189,
		accuracy: 100,
		basePower: 20,
		category: "Special",
		name: "Mud-Slap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Ground",
		contestType: "Cute",
	},
	mudsport: {
		num: 300,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Mud Sport",
		pp: 15,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'mudsport',
		condition: {
			duration: 5,
			onFieldStart(field, source) {
				this.add('-fieldstart', 'move: Mud Sport', `[of] ${source}`);
			},
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Electric') {
					this.debug('mud sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 4,
			onFieldEnd() {
				this.add('-fieldend', 'move: Mud Sport');
			},
		},
		secondary: null,
		target: "all",
		type: "Ground",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	muddywater: {
		num: 330,
		accuracy: 85,
		basePower: 90,
		category: "Special",
		name: "Muddy Water",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 30,
			boosts: {
				accuracy: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Tough",
	},
	multiattack: {
		num: 718,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		isNonstandard: "Past",
		name: "Multi-Attack",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Memory', pokemon, null, move, 'Normal');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 185 },
		maxMove: { basePower: 95 },
		contestType: "Tough",
	},
	mysticalfire: {
		num: 595,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Mystical Fire",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	mysticalpower: {
		num: 832,
		accuracy: 90,
		basePower: 70,
		category: "Special",
		name: "Mystical Power",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Psychic",
	},
	nastyplot: {
		num: 417,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Nasty Plot",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spa: 2,
		},
		secondary: null,
		target: "self",
		type: "Dark",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	naturalgift: {
		num: 363,
		accuracy: 100,
		basePower: 0,
		category: "Physical",
		isNonstandard: "Past",
		name: "Natural Gift",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			const item = pokemon.getItem();
			if (!item.naturalGift) return;
			move.type = item.naturalGift.type;
		},
		onPrepareHit(target, pokemon, move) {
			if (pokemon.ignoringItem()) return false;
			const item = pokemon.getItem();
			if (!item.naturalGift) return false;
			move.basePower = item.naturalGift.basePower;
			this.debug(`BP: ${move.basePower}`);
			pokemon.setItem('');
			pokemon.lastItem = item.id;
			pokemon.usedItemThisTurn = true;
			this.runEvent('AfterUseItem', pokemon, null, null, item);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Clever",
	},
	naturepower: {
		num: 267,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Nature Power",
		pp: 20,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onTryHit(target, pokemon) {
			let move = 'triattack';
			if (this.field.isTerrain('electricterrain')) {
				move = 'thunderbolt';
			} else if (this.field.isTerrain('grassyterrain')) {
				move = 'energyball';
			} else if (this.field.isTerrain('mistyterrain')) {
				move = 'moonblast';
			} else if (this.field.isTerrain('psychicterrain')) {
				move = 'psychic';
			}
			this.actions.useMove(move, pokemon, { target });
			return null;
		},
		callsMove: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	naturesmadness: {
		num: 717,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) {
			return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Nature's Madness",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Tough",
	},
	needlearm: {
		num: 302,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Needle Arm",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	neverendingnightmare: {
		num: 636,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Never-Ending Nightmare",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "ghostiumz",
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	nightdaze: {
		num: 539,
		accuracy: 95,
		basePower: 85,
		category: "Special",
		name: "Night Daze",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 40,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	nightmare: {
		num: 171,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Nightmare",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'nightmare',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				if (pokemon.status !== 'slp' && !pokemon.hasAbility('comatose')) {
					return false;
				}
				this.add('-start', pokemon, 'Nightmare');
			},
			onResidualOrder: 11,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / 4);
			},
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	nightshade: {
		num: 101,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Special",
		name: "Night Shade",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	nightslash: {
		num: 400,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Night Slash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Cool",
	},
	nobleroar: {
		num: 568,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Noble Roar",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		boosts: {
			atk: -1,
			spa: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	noretreat: {
		num: 748,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "No Retreat",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'noretreat',
		onTry(source, target, move) {
			if (source.volatiles['noretreat']) return false;
			if (source.volatiles['trapped']) {
				delete move.volatileStatus;
			}
		},
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'move: No Retreat');
			},
			onTrapPokemon(pokemon) {
				pokemon.tryTrap();
			},
		},
		boosts: {
			atk: 1,
			def: 1,
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Fighting",
	},
	noxioustorque: {
		num: 898,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Noxious Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
	},
	nuzzle: {
		num: 609,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		name: "Nuzzle",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cute",
	},
	oblivionwing: {
		num: 613,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		isNonstandard: "Past",
		name: "Oblivion Wing",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, heal: 1, metronome: 1 },
		drain: [3, 4],
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	obstruct: {
		num: 792,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Obstruct",
		pp: 10,
		priority: 4,
		flags: { failinstruct: 1 },
		stallingMove: true,
		volatileStatus: 'obstruct',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost({ def: -2 }, source, target, this.dex.getActiveMove("Obstruct"));
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Dark",
	},
	oceanicoperetta: {
		num: 697,
		accuracy: true,
		basePower: 195,
		category: "Special",
		isNonstandard: "Past",
		name: "Oceanic Operetta",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "primariumz",
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	octazooka: {
		num: 190,
		accuracy: 85,
		basePower: 65,
		category: "Special",
		isNonstandard: "Past",
		name: "Octazooka",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 50,
			boosts: {
				accuracy: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	octolock: {
		num: 753,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Octolock",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryImmunity(target) {
			return this.dex.getImmunity('trapped', target);
		},
		volatileStatus: 'octolock',
		condition: {
			onStart(pokemon, source) {
				this.add('-start', pokemon, 'move: Octolock', `[of] ${source}`);
			},
			onResidualOrder: 14,
			onResidual(pokemon) {
				const source = this.effectState.source;
				if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns)) {
					delete pokemon.volatiles['octolock'];
					this.add('-end', pokemon, 'Octolock', '[partiallytrapped]', '[silent]');
					return;
				}
				this.boost({ def: -1, spd: -1 }, pokemon, source, this.dex.getActiveMove('octolock'));
			},
			onTrapPokemon(pokemon) {
				if (this.effectState.source?.isActive) pokemon.tryTrap();
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
	},
	odorsleuth: {
		num: 316,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Odor Sleuth",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'foresight',
		onTryHit(target) {
			if (target.volatiles['miracleeye']) return false;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
	},
	ominouswind: {
		num: 466,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "Past",
		name: "Ominous Wind",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Beautiful",
	},
	orderup: {
		num: 856,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Order Up",
		pp: 10,
		priority: 0,
		flags: { protect: 1 },
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!pokemon.volatiles['commanded']) return;
			const tatsugiri = pokemon.volatiles['commanded'].source;
			if (tatsugiri.baseSpecies.baseSpecies !== 'Tatsugiri') return; // Should never happen
			switch (tatsugiri.baseSpecies.forme) {
			case 'Droopy':
				this.boost({ def: 1 }, pokemon, pokemon);
				break;
			case 'Stretchy':
				this.boost({ spe: 1 }, pokemon, pokemon);
				break;
			default:
				this.boost({ atk: 1 }, pokemon, pokemon);
				break;
			}
		},
		secondary: null,
		hasSheerForce: true,
		target: "normal",
		type: "Dragon",
	},
	originpulse: {
		num: 618,
		accuracy: 85,
		basePower: 110,
		category: "Special",
		name: "Origin Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, pulse: 1 },
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	outrage: {
		num: 200,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Outrage",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1 },
		self: {
			volatileStatus: 'lockedmove',
		},
		secondary: null,
		target: "randomNormal",
		type: "Dragon",
		contestType: "Cool",
	},
	overdrive: {
		num: 786,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Overdrive",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Electric",
	},
	overheat: {
		num: 315,
		accuracy: 90,
		basePower: 130,
		category: "Special",
		name: "Overheat",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	painsplit: {
		num: 220,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Pain Split",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target, pokemon) {
			const targetHP = target.getUndynamaxedHP();
			const averagehp = Math.floor((targetHP + pokemon.hp) / 2) || 1;
			const targetChange = targetHP - averagehp;
			target.sethp(target.hp - targetChange);
			this.add('-sethp', target, target.getHealth, '[from] move: Pain Split', '[silent]');
			pokemon.sethp(averagehp);
			this.add('-sethp', pokemon, pokemon.getHealth, '[from] move: Pain Split');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	paraboliccharge: {
		num: 570,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Parabolic Charge",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, heal: 1, metronome: 1 },
		drain: [1, 2],
		secondary: null,
		target: "allAdjacent",
		type: "Electric",
		contestType: "Clever",
	},
	partingshot: {
		num: 575,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Parting Shot",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onHit(target, source, move) {
			const success = this.boost({ atk: -1, spa: -1 }, target, source);
			if (!success && !target.hasAbility('mirrorarmor')) {
				delete move.selfSwitch;
			}
		},
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { effect: 'healreplacement' },
		contestType: "Cool",
	},
	payback: {
		num: 371,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon, target, move) {
			if (target.newlySwitched || this.queue.willMove(target)) {
				this.debug('Payback NOT boosted');
				return move.basePower;
			}
			this.debug('Payback damage boost');
			return move.basePower * 2;
		},
		category: "Physical",
		name: "Payback",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	payday: {
		num: 6,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Pay Day",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	peck: {
		num: 64,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		name: "Peck",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	perishsong: {
		num: 195,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Perish Song",
		pp: 5,
		priority: 0,
		flags: { sound: 1, distance: 1, bypasssub: 1, metronome: 1 },
		onHitField(target, source, move) {
			let result = false;
			let message = false;
			for (const pokemon of this.getAllActive()) {
				if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
					this.add('-miss', source, pokemon);
					result = true;
				} else if (this.runEvent('TryHit', pokemon, source, move) === null) {
					result = true;
				} else if (!pokemon.volatiles['perishsong']) {
					pokemon.addVolatile('perishsong');
					this.add('-start', pokemon, 'perish3', '[silent]');
					result = true;
					message = true;
				}
			}
			if (!result) return false;
			if (message) this.add('-fieldactivate', 'move: Perish Song');
		},
		condition: {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidualOrder: 24,
			onResidual(pokemon) {
				const duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, `perish${duration}`);
			},
		},
		secondary: null,
		target: "all",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	petalblizzard: {
		num: 572,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Petal Blizzard",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Grass",
		contestType: "Beautiful",
	},
	petaldance: {
		num: 80,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Petal Dance",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, dance: 1, metronome: 1, failinstruct: 1 },
		self: {
			volatileStatus: 'lockedmove',
		},
		secondary: null,
		target: "randomNormal",
		type: "Grass",
		contestType: "Beautiful",
	},
	phantomforce: {
		num: 566,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Phantom Force",
		pp: 10,
		priority: 0,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	photongeyser: {
		num: 722,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		name: "Photon Geyser",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	pikapapow: {
		num: 732,
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon) {
			const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		isNonstandard: "LGPE",
		name: "Pika Papow",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cute",
	},
	pinmissile: {
		num: 42,
		accuracy: 95,
		basePower: 25,
		category: "Physical",
		name: "Pin Missile",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Bug",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	plasmafists: {
		num: 721,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		isNonstandard: "Past",
		name: "Plasma Fists",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		pseudoWeather: 'iondeluge',
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	playnice: {
		num: 589,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Play Nice",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		boosts: {
			atk: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	playrough: {
		num: 583,
		accuracy: 90,
		basePower: 90,
		category: "Physical",
		name: "Play Rough",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Fairy",
		contestType: "Cute",
	},
	pluck: {
		num: 365,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Pluck",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		onHit(target, source) {
			const item = target.getItem();
			if (source.hp && item.isBerry && target.takeItem(source)) {
				this.add('-enditem', target, item.name, '[from] stealeat', '[move] Pluck', `[of] ${source}`);
				if (this.singleEvent('Eat', item, null, source, null, null)) {
					this.runEvent('EatItem', source, null, null, item);
					if (item.id === 'leppaberry') target.staleness = 'external';
				}
				if (item.onEat) source.ateBerry = true;
			}
		},
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cute",
	},
	poisonfang: {
		num: 305,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Poison Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondary: {
			chance: 50,
			status: 'tox',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	poisongas: {
		num: 139,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Poison Gas",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'psn',
		secondary: null,
		target: "allAdjacentFoes",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	poisonjab: {
		num: 398,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Poison Jab",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	poisonpowder: {
		num: 77,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		name: "Poison Powder",
		pp: 35,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'psn',
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	poisonsting: {
		num: 40,
		accuracy: 100,
		basePower: 15,
		category: "Physical",
		name: "Poison Sting",
		pp: 35,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	poisontail: {
		num: 342,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Poison Tail",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Clever",
	},
	pollenpuff: {
		num: 676,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Pollen Puff",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, metronome: 1, bullet: 1 },
		onTryHit(target, source, move) {
			if (source.isAlly(target)) {
				move.basePower = 0;
				move.infiltrates = true;
			}
		},
		onTryMove(source, target, move) {
			if (source.isAlly(target) && source.volatiles['healblock']) {
				this.attrLastMove('[still]');
				this.add('cant', source, 'move: Heal Block', move);
				return false;
			}
		},
		onHit(target, source, move) {
			if (source.isAlly(target)) {
				if (!this.heal(Math.floor(target.baseMaxhp * 0.5))) {
					return this.NOT_FAIL;
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	poltergeist: {
		num: 809,
		accuracy: 90,
		basePower: 110,
		category: "Physical",
		name: "Poltergeist",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			return !!target.item;
		},
		onTryHit(target, source, move) {
			this.add('-activate', target, 'move: Poltergeist', this.dex.items.get(target.item).name);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	populationbomb: {
		num: 860,
		accuracy: 90,
		basePower: 20,
		category: "Physical",
		name: "Population Bomb",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, slicing: 1 },
		multihit: 10,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	pounce: {
		num: 884,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Pounce",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	pound: {
		num: 1,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Pound",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	powder: {
		num: 600,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Powder",
		pp: 20,
		priority: 1,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1, powder: 1 },
		volatileStatus: 'powder',
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Powder');
			},
			onTryMovePriority: -1,
			onTryMove(pokemon, target, move) {
				if (move.type === 'Fire') {
					this.add('-activate', pokemon, 'move: Powder');
					this.damage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1));
					this.attrLastMove('[still]');
					return false;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		zMove: { boost: { spd: 2 } },
		contestType: "Clever",
	},
	powdersnow: {
		num: 181,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Powder Snow",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'frz',
		},
		target: "allAdjacentFoes",
		type: "Ice",
		contestType: "Beautiful",
	},
	powergem: {
		num: 408,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Power Gem",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
	},
	powershift: {
		num: 829,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Unobtainable",
		name: "Power Shift",
		pp: 10,
		priority: 0,
		flags: { snatch: 1 },
		volatileStatus: 'powershift',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onCopy(pokemon) {
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Power Shift');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('Power Shift');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	powersplit: {
		num: 471,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Power Split",
		pp: 10,
		priority: 0,
		flags: { protect: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const newatk = Math.floor((target.storedStats.atk + source.storedStats.atk) / 2);
			target.storedStats.atk = newatk;
			source.storedStats.atk = newatk;
			const newspa = Math.floor((target.storedStats.spa + source.storedStats.spa) / 2);
			target.storedStats.spa = newspa;
			source.storedStats.spa = newspa;
			this.add('-activate', source, 'move: Power Split', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	powerswap: {
		num: 384,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Power Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetBoosts: SparseBoostsTable = {};
			const sourceBoosts: SparseBoostsTable = {};

			const atkSpa: BoostID[] = ['atk', 'spa'];
			for (const stat of atkSpa) {
				targetBoosts[stat] = target.boosts[stat];
				sourceBoosts[stat] = source.boosts[stat];
			}

			source.setBoost(targetBoosts);
			target.setBoost(sourceBoosts);

			this.add('-swapboost', source, target, 'atk, spa', '[from] move: Power Swap');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	powertrick: {
		num: 379,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Power Trick",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		volatileStatus: 'powertrick',
		condition: {
			onStart(pokemon) {
				this.add('-start', pokemon, 'Power Trick');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onCopy(pokemon) {
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Power Trick');
				const newatk = pokemon.storedStats.def;
				const newdef = pokemon.storedStats.atk;
				pokemon.storedStats.atk = newatk;
				pokemon.storedStats.def = newdef;
			},
			onRestart(pokemon) {
				pokemon.removeVolatile('Power Trick');
			},
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
	},
	powertrip: {
		num: 681,
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Power Trip",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Clever",
	},
	poweruppunch: {
		num: 612,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		isNonstandard: "Past",
		name: "Power-Up Punch",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	powerwhip: {
		num: 438,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		name: "Power Whip",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	precipiceblades: {
		num: 619,
		accuracy: 85,
		basePower: 120,
		category: "Physical",
		name: "Precipice Blades",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1 },
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Cool",
	},
	present: {
		num: 217,
		accuracy: 90,
		basePower: 0,
		category: "Physical",
		name: "Present",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			const rand = this.random(10);
			if (rand < 2) {
				move.heal = [1, 4];
				move.infiltrates = true;
			} else if (rand < 6) {
				move.basePower = 40;
			} else if (rand < 9) {
				move.basePower = 80;
			} else {
				move.basePower = 120;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	prismaticlaser: {
		num: 711,
		accuracy: 100,
		basePower: 160,
		category: "Special",
		name: "Prismatic Laser",
		pp: 10,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	protect: {
		num: 182,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Protect",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'protect',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	psybeam: {
		num: 60,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Psybeam",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
	},
	psyblade: {
		num: 875,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Psyblade",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		onBasePower(basePower, source) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('psyblade electric terrain boost');
				return this.chainModify(1.5);
			}
		},
		target: "normal",
		type: "Psychic",
	},
	psychup: {
		num: 244,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Psych Up",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			let i: BoostID;
			for (i in target.boosts) {
				source.boosts[i] = target.boosts[i];
			}

			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			// we need to remove all crit stage volatiles first; otherwise copying e.g. dragoncheer onto a mon with focusenergy
			// will crash the server (since addVolatile fails due to overlap, leaving the source mon with no hasDragonType to set)
			for (const volatile of volatilesToCopy) source.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) {
				if (target.volatiles[volatile]) {
					source.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') source.volatiles[volatile].layers = target.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') source.volatiles[volatile].hasDragonType = target.volatiles[volatile].hasDragonType;
				}
			}
			this.add('-copyboost', source, target, '[from] move: Psych Up');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Clever",
	},
	psychic: {
		num: 94,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Psychic",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	psychicfangs: {
		num: 706,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		name: "Psychic Fangs",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	psychicnoise: {
		num: 917,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Psychic Noise",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'healblock',
		},
		target: "normal",
		type: "Psychic",
	},
	psychicterrain: {
		num: 678,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Psychic Terrain",
		pp: 10,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		terrain: 'psychicterrain',
		condition: {
			effectType: 'Terrain',
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasItem('terrainextender')) {
					return 8;
				}
				return 5;
			},
			onTryHitPriority: 4,
			onTryHit(target, source, effect) {
				if (effect && (effect.priority <= 0.1 || effect.target === 'self')) {
					return;
				}
				if (target.isSemiInvulnerable() || target.isAlly(source)) return;
				if (!target.isGrounded()) {
					const baseMove = this.dex.moves.get(effect.id);
					if (baseMove.priority > 0) {
						this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
					}
					return;
				}
				this.add('-activate', target, 'move: Psychic Terrain');
				return null;
			},
			onBasePowerPriority: 6,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
					this.debug('psychic terrain boost');
					return this.chainModify([5325, 4096]);
				}
			},
			onFieldStart(field, source, effect) {
				if (effect?.effectType === 'Ability') {
					this.add('-fieldstart', 'move: Psychic Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
				} else {
					this.add('-fieldstart', 'move: Psychic Terrain');
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 7,
			onFieldEnd() {
				this.add('-fieldend', 'move: Psychic Terrain');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	psychoboost: {
		num: 354,
		accuracy: 90,
		basePower: 140,
		category: "Special",
		name: "Psycho Boost",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spa: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	psychocut: {
		num: 427,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Psycho Cut",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	psychoshift: {
		num: 375,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Psycho Shift",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryHit(target, source, move) {
			if (!source.status) return false;
			move.status = source.status;
		},
		self: {
			onHit(pokemon) {
				pokemon.cureStatus();
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spa: 2 } },
		contestType: "Clever",
	},
	psyshieldbash: {
		num: 828,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		name: "Psyshield Bash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Psychic",
	},
	psyshock: {
		num: 473,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Psyshock",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Beautiful",
	},
	psystrike: {
		num: 540,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Psystrike",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	psywave: {
		num: 149,
		accuracy: 100,
		basePower: 0,
		damageCallback(pokemon) {
			return (this.random(50, 151) * pokemon.level) / 100;
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Psywave",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	pulverizingpancake: {
		num: 701,
		accuracy: true,
		basePower: 210,
		category: "Physical",
		isNonstandard: "Past",
		name: "Pulverizing Pancake",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "snorliumz",
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	punishment: {
		num: 386,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target) {
			let power = 60 + 20 * target.positiveBoosts();
			if (power > 200) power = 200;
			this.debug(`BP: ${power}`);
			return power;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Punishment",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	purify: {
		num: 685,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Purify",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, heal: 1, metronome: 1 },
		onHit(target, source) {
			if (!target.cureStatus()) {
				this.add('-fail', source);
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			this.heal(Math.ceil(source.maxhp * 0.5), source);
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Beautiful",
	},
	pursuit: {
		num: 228,
		accuracy: 100,
		basePower: 40,
		basePowerCallback(pokemon, target, move) {
			// You can't get here unless the pursuit succeeds
			if (target.beingCalledBack || target.switchFlag) {
				this.debug('Pursuit damage boost');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Pursuit",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		beforeTurnCallback(pokemon) {
			for (const side of this.sides) {
				if (side.hasAlly(pokemon)) continue;
				side.addSideCondition('pursuit', pokemon);
				const data = side.getSideConditionData('pursuit');
				if (!data.sources) {
					data.sources = [];
				}
				data.sources.push(pokemon);
			}
		},
		onModifyMove(move, source, target) {
			if (target?.beingCalledBack || target?.switchFlag) move.accuracy = true;
		},
		onTryHit(target, pokemon) {
			target.side.removeSideCondition('pursuit');
		},
		condition: {
			duration: 1,
			onBeforeSwitchOut(pokemon) {
				this.debug('Pursuit start');
				let alreadyAdded = false;
				pokemon.removeVolatile('destinybond');
				for (const source of this.effectState.sources) {
					if (!source.isAdjacent(pokemon) || !this.queue.cancelMove(source) || !source.hp) continue;
					if (!alreadyAdded) {
						this.add('-activate', pokemon, 'move: Pursuit');
						alreadyAdded = true;
					}
					// Run through each action in queue to check if the Pursuit user is supposed to Mega Evolve this turn.
					// If it is, then Mega Evolve before moving.
					if (source.canMegaEvo || source.canUltraBurst || source.canTerastallize) {
						for (const [actionIndex, action] of this.queue.entries()) {
							if (action.pokemon === source) {
								if (action.choice === 'megaEvo') {
									this.actions.runMegaEvo(source);
								} else if (action.choice === 'terastallize') {
									// Also a "forme" change that happens before moves, though only possible in NatDex
									this.actions.terastallize(source);
								} else {
									continue;
								}
								this.queue.list.splice(actionIndex, 1);
								break;
							}
						}
					}
					this.actions.runMove('pursuit', source, source.getLocOf(pokemon));
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	pyroball: {
		num: 780,
		accuracy: 90,
		basePower: 120,
		category: "Physical",
		name: "Pyro Ball",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, bullet: 1 },
		secondary: {
			chance: 10,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
	},
	quash: {
		num: 511,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Quash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onHit(target) {
			if (this.activePerHalf === 1) return false; // fails in singles
			const action = this.queue.willMove(target);
			if (!action) return false;

			action.order = 201;
			this.add('-activate', target, 'move: Quash');
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	quickattack: {
		num: 98,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Quick Attack",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	quickguard: {
		num: 501,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Quick Guard",
		pp: 15,
		priority: 3,
		flags: { snatch: 1 },
		sideCondition: 'quickguard',
		onTry() {
			return !!this.queue.willAct();
		},
		onHitSide(side, source) {
			source.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit(target, source, move) {
				// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
				// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings; Quick Claw/Custap Berry do not count)
				if (move.priority <= 0.1) return;
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Quick Guard');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
		type: "Fighting",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	quiverdance: {
		num: 483,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Quiver Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			spa: 1,
			spd: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	rage: {
		num: 99,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		isNonstandard: "Past",
		name: "Rage",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'rage',
		},
		condition: {
			onStart(pokemon) {
				this.add('-singlemove', pokemon, 'Rage');
			},
			onHit(target, source, move) {
				if (target !== source && move.category !== 'Status') {
					this.boost({ atk: 1 });
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove(pokemon) {
				this.debug('removing Rage before attack');
				pokemon.removeVolatile('rage');
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	ragefist: {
		num: 889,
		accuracy: 100,
		basePower: 50,
		basePowerCallback(pokemon) {
			return Math.min(350, 50 + 50 * pokemon.timesAttacked);
		},
		category: "Physical",
		name: "Rage Fist",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
	},
	ragepowder: {
		num: 476,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Rage Powder",
		pp: 20,
		priority: 2,
		flags: { noassist: 1, failcopycat: 1, powder: 1 },
		volatileStatus: 'ragepowder',
		onTry(source) {
			return this.activePerHalf > 1;
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Rage Powder');
			},
			onFoeRedirectTargetPriority: 1,
			onFoeRedirectTarget(target, source, source2, move) {
				const ragePowderUser = this.effectState.target;
				if (ragePowderUser.isSkyDropped()) return;

				if (source.runStatusImmunity('powder') && this.validTarget(ragePowderUser, source, move.target)) {
					if (move.smartTarget) move.smartTarget = false;
					this.debug("Rage Powder redirected target of move");
					return ragePowderUser;
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	ragingbull: {
		num: 873,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Raging Bull",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		onTryHit(pokemon) {
			// will shatter screens through sub, before you hit
			pokemon.side.removeSideCondition('reflect');
			pokemon.side.removeSideCondition('lightscreen');
			pokemon.side.removeSideCondition('auroraveil');
		},
		onModifyType(move, pokemon) {
			switch (pokemon.species.name) {
			case 'Tauros-Paldea-Combat':
				move.type = 'Fighting';
				break;
			case 'Tauros-Paldea-Blaze':
				move.type = 'Fire';
				break;
			case 'Tauros-Paldea-Aqua':
				move.type = 'Water';
				break;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	ragingfury: {
		num: 833,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Raging Fury",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			volatileStatus: 'lockedmove',
		},
		secondary: null,
		target: "randomNormal",
		type: "Fire",
	},
	raindance: {
		num: 240,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Rain Dance",
		pp: 5,
		priority: 0,
		flags: { metronome: 1 },
		weather: 'RainDance',
		secondary: null,
		target: "all",
		type: "Water",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	rapidspin: {
		num: 229,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Rapid Spin",
		pp: 40,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onAfterHit(target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes','poop', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		onAfterSubDamage(damage, target, pokemon, move) {
			if (!move.hasSheerForce) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', `[of] ${pokemon}`);
				}
				const sideConditions = ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
				for (const condition of sideConditions) {
					if (pokemon.hp && pokemon.side.removeSideCondition(condition)) {
						this.add('-sideend', pokemon.side, this.dex.conditions.get(condition).name, '[from] move: Rapid Spin', `[of] ${pokemon}`);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		},
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	razorleaf: {
		num: 75,
		accuracy: 95,
		basePower: 55,
		category: "Physical",
		name: "Razor Leaf",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
		type: "Grass",
		contestType: "Cool",
	},
	razorshell: {
		num: 534,
		accuracy: 95,
		basePower: 75,
		category: "Physical",
		name: "Razor Shell",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	razorwind: {
		num: 13,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		isNonstandard: "Past",
		name: "Razor Wind",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		critRatio: 2,
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	recover: {
		num: 105,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Recover",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	recycle: {
		num: 278,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Recycle",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon, source, move) {
			if (pokemon.item || !pokemon.lastItem) return false;
			const item = pokemon.lastItem;
			pokemon.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] move: Recycle');
			pokemon.setItem(item, source, move);
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	reflect: {
		num: 115,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Reflect",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'reflect',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onAnyModifyDamage(damage, source, target, move) {
				if (target !== source && this.effectState.target.hasAlly(target) && this.getCategory(move) === 'Physical') {
					if (!target.getMoveHitData(move).crit && !move.infiltrates) {
						this.debug('Reflect weaken');
						if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
						return this.chainModify(0.5);
					}
				}
			},
			onSideStart(side) {
				this.add('-sidestart', side, 'Reflect');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 1,
			onSideEnd(side) {
				this.add('-sideend', side, 'Reflect');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Psychic",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	reflecttype: {
		num: 513,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Reflect Type",
		pp: 15,
		priority: 0,
		flags: { protect: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			if (source.species && (source.species.num === 493 || source.species.num === 773)) return false;
			if (source.terastallized) return false;
			const oldApparentType = source.apparentType;
			let newBaseTypes = target.getTypes(true).filter(type => type !== '???');
			if (!newBaseTypes.length) {
				if (target.addedType) {
					newBaseTypes = ['Normal'];
				} else {
					return false;
				}
			}
			this.add('-start', source, 'typechange', '[from] move: Reflect Type', `[of] ${target}`);
			source.setType(newBaseTypes);
			source.addedType = target.addedType;
			source.knownType = target.isAlly(source) && target.knownType;
			if (!source.knownType) source.apparentType = oldApparentType;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	refresh: {
		num: 287,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Refresh",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon) {
			if (['', 'slp', 'frz'].includes(pokemon.status)) return false;
			pokemon.cureStatus();
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Cute",
	},
	relicsong: {
		num: 547,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		name: "Relic Song",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: {
			chance: 10,
			status: 'slp',
		},
		onHit(target, pokemon, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Meloetta' && !pokemon.transformed) {
				move.willChangeForme = true;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				const meloettaForme = pokemon.species.id === 'meloettapirouette' ? '' : '-Pirouette';
				pokemon.formeChange('Meloetta' + meloettaForme, this.effect, false, '0', '[msg]');
			}
		},
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Beautiful",
	},
	rest: {
		num: 156,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Rest",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTry(source) {
			if (source.status === 'slp' || source.hasAbility('comatose')) return false;

			if (source.hp === source.maxhp) {
				this.add('-fail', source, 'heal');
				return null;
			}
			// insomnia and vital spirit checks are separate so that the message is accurate in multi-ability mods
			if (source.hasAbility('insomnia')) {
				this.add('-fail', source, '[from] ability: Insomnia', `[of] ${source}`);
				return null;
			}
			if (source.hasAbility('vitalspirit')) {
				this.add('-fail', source, '[from] ability: Vital Spirit', `[of] ${source}`);
				return null;
			}
		},
		onHit(target, source, move) {
			const result = target.setStatus('slp', source, move);
			if (!result) return result;
			target.statusState.time = 3;
			target.statusState.startTime = 3;
			this.heal(target.maxhp); // Aesthetic only as the healing happens after you fall asleep in-game
		},
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	retaliate: {
		num: 514,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Retaliate",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon) {
			if (pokemon.side.faintedLastTurn) {
				this.debug('Boosted for a faint last turn');
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	return: {
		num: 216,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			return Math.floor((pokemon.happiness * 10) / 25) || 1;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Return",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cute",
	},
	revelationdance: {
		num: 686,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Revelation Dance",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		onModifyType(move, pokemon) {
			const types = pokemon.getTypes();
			let type = types[0];
			if (type === 'Bird') type = '???';
			if (type === '???' && types[1]) type = types[1];
			move.type = type;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	revenge: {
		num: 279,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some(
				p => p.source === target && p.damage > 0 && p.thisTurn
			);
			if (damagedByTarget) {
				this.debug(`BP doubled for getting hit by ${target}`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Revenge",
		pp: 10,
		priority: -4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	reversal: {
		num: 179,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			const ratio = Math.max(Math.floor(pokemon.hp * 48 / pokemon.maxhp), 1);
			let bp;
			if (ratio < 2) {
				bp = 200;
			} else if (ratio < 5) {
				bp = 150;
			} else if (ratio < 10) {
				bp = 100;
			} else if (ratio < 17) {
				bp = 80;
			} else if (ratio < 33) {
				bp = 40;
			} else {
				bp = 20;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Reversal",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		zMove: { basePower: 160 },
		contestType: "Cool",
	},
	revivalblessing: {
		num: 863,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Revival Blessing",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: { heal: 1, nosketch: 1 },
		onTryHit(source) {
			if (!source.side.pokemon.filter(ally => ally.fainted).length) {
				return false;
			}
		},
		slotCondition: 'revivalblessing',
		// No this not a real switchout move
		// This is needed to trigger a switch protocol to choose a fainted party member
		// Feel free to refactor
		selfSwitch: true,
		condition: {
			duration: 1,
			// reviving implemented in side.ts, kind of
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	risingvoltage: {
		num: 804,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(source, target, move) {
			if (this.field.isTerrain('electricterrain') && target.isGrounded()) {
				if (!source.isAlly(target)) this.hint(`${move.name}'s BP doubled on grounded target.`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Rising Voltage",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		maxMove: { basePower: 140 },
	},
	roar: {
		num: 46,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roar",
		pp: 20,
		priority: -6,
		flags: { reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1 },
		forceSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	roaroftime: {
		num: 459,
		accuracy: 90,
		basePower: 150,
		category: "Special",
		name: "Roar of Time",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	rockblast: {
		num: 350,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Rock Blast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Rock",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Tough",
	},
	rockclimb: {
		num: 431,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		isNonstandard: "Past",
		name: "Rock Climb",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	rockpolish: {
		num: 397,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Rock Polish",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Rock",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	rockslide: {
		num: 157,
		accuracy: 90,
		basePower: 75,
		category: "Physical",
		name: "Rock Slide",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Rock",
		contestType: "Tough",
	},
	rocksmash: {
		num: 249,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Rock Smash",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	rockthrow: {
		num: 88,
		accuracy: 90,
		basePower: 50,
		category: "Physical",
		name: "Rock Throw",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	rocktomb: {
		num: 317,
		accuracy: 95,
		basePower: 60,
		category: "Physical",
		name: "Rock Tomb",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spe: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Clever",
	},
	rockwrecker: {
		num: 439,
		accuracy: 90,
		basePower: 150,
		category: "Physical",
		name: "Rock Wrecker",
		pp: 5,
		priority: 0,
		flags: { recharge: 1, protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		self: {
			volatileStatus: 'mustrecharge',
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	roleplay: {
		num: 272,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Role Play",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			if (target.ability === source.ability) return false;
			if (target.getAbility().flags['failroleplay'] || source.getAbility().flags['cantsuppress']) return false;
		},
		onHit(target, source) {
			const oldAbility = source.setAbility(target.ability, target);
			if (!oldAbility) return oldAbility as false | null;
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Cute",
	},
	rollingkick: {
		num: 27,
		accuracy: 85,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Rolling Kick",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	rollout: {
		num: 205,
		accuracy: 90,
		basePower: 30,
		basePowerCallback(pokemon, target, move) {
			let bp = move.basePower;
			const rolloutData = pokemon.volatiles['rollout'];
			if (rolloutData?.hitCount) {
				bp *= 2 ** rolloutData.contactHitCount;
			}
			if (rolloutData && pokemon.status !== 'slp') {
				rolloutData.hitCount++;
				rolloutData.contactHitCount++;
				if (rolloutData.hitCount < 5) {
					rolloutData.duration = 2;
				}
			}
			if (pokemon.volatiles['defensecurl']) {
				bp *= 2;
			}
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		name: "Rollout",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1, noparentalbond: 1 },
		onModifyMove(move, pokemon, target) {
			if (pokemon.volatiles['rollout'] || pokemon.status === 'slp' || !target) return;
			pokemon.addVolatile('rollout');
			if (move.sourceEffect) pokemon.lastMoveTargetLoc = pokemon.getLocOf(target);
		},
		onAfterMove(source, target, move) {
			const rolloutData = source.volatiles["rollout"];
			if (
				rolloutData &&
				rolloutData.hitCount === 5 &&
				rolloutData.contactHitCount < 5
				// this conditions can only be met in gen7 and gen8dlc1
				// see `disguise` and `iceface` abilities in the resp mod folders
			) {
				source.addVolatile("rolloutstorage");
				source.volatiles["rolloutstorage"].contactHitCount =
					rolloutData.contactHitCount;
			}
		},
		condition: {
			duration: 1,
			onLockMove: 'rollout',
			onStart() {
				this.effectState.hitCount = 0;
				this.effectState.contactHitCount = 0;
			},
			onResidual(target) {
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['rollout'];
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cute",
	},
	roost: {
		num: 355,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Roost",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		self: {
			volatileStatus: 'roost',
		},
		condition: {
			duration: 1,
			onResidualOrder: 25,
			onStart(target) {
				if (target.terastallized) {
					if (target.hasType('Flying')) {
						this.add('-hint', "If a Terastallized Pokemon uses Roost, it remains Flying-type.");
					}
					return false;
				}
				this.add('-singleturn', target, 'move: Roost');
			},
			onTypePriority: -1,
			onType(types, pokemon) {
				this.effectState.typeWas = types;
				return types.filter(type => type !== 'Flying');
			},
		},
		secondary: null,
		target: "self",
		type: "Flying",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	rototiller: {
		num: 563,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Rototiller",
		pp: 10,
		priority: 0,
		flags: { distance: 1, nonsky: 1, metronome: 1 },
		onHitField(target, source) {
			const targets: Pokemon[] = [];
			let anyAirborne = false;
			for (const pokemon of this.getAllActive()) {
				if (!pokemon.runImmunity('Ground')) {
					this.add('-immune', pokemon);
					anyAirborne = true;
					continue;
				}
				if (pokemon.hasType('Grass')) {
					// This move affects every grounded Grass-type Pokemon in play.
					targets.push(pokemon);
				}
			}
			if (!targets.length && !anyAirborne) return false; // Fails when there are no grounded Grass types or airborne Pokemon
			for (const pokemon of targets) {
				this.boost({ atk: 1, spa: 1 }, pokemon, source);
			}
		},
		secondary: null,
		target: "all",
		type: "Ground",
		zMove: { boost: { atk: 1 } },
		contestType: "Tough",
	},
	round: {
		num: 496,
		accuracy: 100,
		basePower: 60,
		basePowerCallback(target, source, move) {
			if (move.sourceEffect === 'round') {
				this.debug('BP doubled');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Round",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		onTry(source, target, move) {
			for (const action of this.queue.list as MoveAction[]) {
				if (!action.pokemon || !action.move || action.maxMove || action.zmove) continue;
				if (action.move.id === 'round') {
					this.queue.prioritizeAction(action, move);
					return;
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	ruination: {
		num: 877,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) {
			return this.clampIntRange(Math.floor(target.getUndynamaxedHP() / 2), 1);
		},
		category: "Special",
		name: "Ruination",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	sacredfire: {
		num: 221,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Sacred Fire",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		secondary: {
			chance: 50,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	sacredsword: {
		num: 533,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Sacred Sword",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		ignoreEvasion: true,
		ignoreDefensive: true,
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	safeguard: {
		num: 219,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Safeguard",
		pp: 25,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		sideCondition: 'safeguard',
		condition: {
			duration: 5,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Safeguard');
					return 7;
				}
				return 5;
			},
			onSetStatus(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.id === 'yawn') return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if (target !== source) {
					this.debug('interrupting setStatus');
					if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Safeguard');
					}
					return null;
				}
			},
			onTryAddVolatile(status, target, source, effect) {
				if (!effect || !source) return;
				if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;
				if ((status.id === 'confusion' || status.id === 'yawn') && target !== source) {
					if (effect.effectType === 'Move' && !effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'Safeguard', '[persistent]');
				} else {
					this.add('-sidestart', side, 'Safeguard');
				}
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 3,
			onSideEnd(side) {
				this.add('-sideend', side, 'Safeguard');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	saltcure: {
		num: 864,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Salt Cure",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		condition: {
			noCopy: true,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Salt Cure');
			},
			onResidualOrder: 13,
			onResidual(pokemon) {
				this.damage(pokemon.baseMaxhp / (pokemon.hasType(['Water', 'Steel']) ? 4 : 8));
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Salt Cure');
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'saltcure',
		},
		target: "normal",
		type: "Rock",
	},
	sandattack: {
		num: 28,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Sand Attack",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			accuracy: -1,
		},
		secondary: null,
		target: "normal",
		type: "Ground",
		zMove: { boost: { evasion: 1 } },
		contestType: "Cute",
	},
	sandsearstorm: {
		num: 848,
		accuracy: 80,
		basePower: 100,
		category: "Special",
		name: "Sandsear Storm",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'brn',
		},
		target: "allAdjacentFoes",
		type: "Ground",
	},
	sandstorm: {
		num: 201,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sandstorm",
		pp: 10,
		priority: 0,
		flags: { metronome: 1, wind: 1 },
		weather: 'Sandstorm',
		secondary: null,
		target: "all",
		type: "Rock",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
	},
	sandtomb: {
		num: 328,
		accuracy: 85,
		basePower: 35,
		category: "Physical",
		name: "Sand Tomb",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Clever",
	},
	sappyseed: {
		num: 738,
		accuracy: 90,
		basePower: 100,
		category: "Physical",
		isNonstandard: "LGPE",
		name: "Sappy Seed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		onHit(target, source) {
			if (target.hasType('Grass')) return null;
			target.addVolatile('leechseed', source);
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Clever",
	},
	savagespinout: {
		num: 634,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Savage Spin-Out",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "buginiumz",
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	scald: {
		num: 503,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Scald",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	scaleshot: {
		num: 799,
		accuracy: 90,
		basePower: 25,
		category: "Physical",
		name: "Scale Shot",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		selfBoost: {
			boosts: {
				def: -1,
				spe: 1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Dragon",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
	},
	scaryface: {
		num: 184,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Scary Face",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {
			spe: -2,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
	},
	scorchingsands: {
		num: 815,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Scorching Sands",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, metronome: 1 },
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Ground",
	},
	scratch: {
		num: 10,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Scratch",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	screech: {
		num: 103,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Screech",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		boosts: {
			def: -2,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
	},
	searingshot: {
		num: 545,
		accuracy: 100,
		basePower: 100,
		category: "Special",
		isNonstandard: "Past",
		name: "Searing Shot",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "allAdjacent",
		type: "Fire",
		contestType: "Cool",
	},
	searingsunrazesmash: {
		num: 724,
		accuracy: true,
		basePower: 200,
		category: "Physical",
		isNonstandard: "Past",
		name: "Searing Sunraze Smash",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "solganiumz",
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	secretpower: {
		num: 290,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		isNonstandard: "Past",
		name: "Secret Power",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon) {
			if (this.field.isTerrain('')) return;
			move.secondaries = [];
			if (this.field.isTerrain('electricterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'par',
				});
			} else if (this.field.isTerrain('grassyterrain')) {
				move.secondaries.push({
					chance: 30,
					status: 'slp',
				});
			} else if (this.field.isTerrain('mistyterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spa: -1,
					},
				});
			} else if (this.field.isTerrain('psychicterrain')) {
				move.secondaries.push({
					chance: 30,
					boosts: {
						spe: -1,
					},
				});
			}
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Normal",
		contestType: "Clever",
	},
	secretsword: {
		num: 548,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		overrideDefensiveStat: 'def',
		name: "Secret Sword",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Beautiful",
	},
	seedbomb: {
		num: 402,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Seed Bomb",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	seedflare: {
		num: 465,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		name: "Seed Flare",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 40,
			boosts: {
				spd: -2,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},
	seismictoss: {
		num: 69,
		accuracy: 100,
		basePower: 0,
		damage: 'level',
		category: "Physical",
		name: "Seismic Toss",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		maxMove: { basePower: 75 },
		contestType: "Tough",
	},
	selfdestruct: {
		num: 120,
		accuracy: 100,
		basePower: 200,
		category: "Physical",
		name: "Self-Destruct",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, noparentalbond: 1 },
		selfdestruct: "always",
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		contestType: "Beautiful",
	},
	shadowball: {
		num: 247,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Shadow Ball",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 20,
			boosts: {
				spd: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	shadowbone: {
		num: 708,
		accuracy: 100,
		basePower: 85,
		category: "Physical",
		isNonstandard: "Past",
		name: "Shadow Bone",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	shadowclaw: {
		num: 421,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Shadow Claw",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	shadowforce: {
		num: 467,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Shadow Force",
		pp: 5,
		priority: 0,
		flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
		breaksProtect: true,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		condition: {
			duration: 2,
			onInvulnerability: false,
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	shadowpunch: {
		num: 325,
		accuracy: true,
		basePower: 60,
		category: "Physical",
		name: "Shadow Punch",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	shadowsneak: {
		num: 425,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Shadow Sneak",
		pp: 30,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	sharpen: {
		num: 159,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Sharpen",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Cute",
	},
	shatteredpsyche: {
		num: 648,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Shattered Psyche",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "psychiumz",
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	shedtail: {
		num: 880,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shed Tail",
		pp: 10,
		priority: 0,
		flags: {},
		volatileStatus: 'substitute',
		onTryHit(source) {
			if (!this.canSwitch(source.side) || source.volatiles['commanded']) {
				this.add('-fail', source);
				return this.NOT_FAIL;
			}
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Shed Tail');
				return this.NOT_FAIL;
			}
			if (source.hp <= Math.ceil(source.maxhp / 2)) {
				this.add('-fail', source, 'move: Shed Tail', '[weak]');
				return this.NOT_FAIL;
			}
		},
		onHit(target) {
			this.directDamage(Math.ceil(target.maxhp / 2));
		},
		self: {
			onHit(source) {
				source.skipBeforeSwitchOutEventFlag = true;
			},
		},
		selfSwitch: 'shedtail',
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
	},
	sheercold: {
		num: 329,
		accuracy: 30,
		basePower: 0,
		category: "Special",
		name: "Sheer Cold",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		ohko: 'Ice',
		target: "normal",
		type: "Ice",
		zMove: { basePower: 180 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
	},
	shellsidearm: {
		num: 801,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Shell Side Arm",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onPrepareHit(target, source, move) {
			if (!source.isAlly(target)) {
				this.attrLastMove('[anim] Shell Side Arm ' + move.category);
			}
		},
		onModifyMove(move, pokemon, target) {
			if (!target) return;
			const atk = pokemon.getStat('atk', false, true);
			const spa = pokemon.getStat('spa', false, true);
			const def = target.getStat('def', false, true);
			const spd = target.getStat('spd', false, true);
			const physical = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * atk) / def) / 50);
			const special = Math.floor(Math.floor(Math.floor(Math.floor(2 * pokemon.level / 5 + 2) * 90 * spa) / spd) / 50);
			if (physical > special || (physical === special && this.randomChance(1, 2))) {
				move.category = 'Physical';
				move.flags.contact = 1;
			}
		},
		onHit(target, source, move) {
			// Shell Side Arm normally reveals its category via animation on cart, but doesn't play either custom animation against allies
			if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm");
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!source.isAlly(target)) this.hint(move.category + " Shell Side Arm");
		},
		secondary: {
			chance: 20,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
	},
	shellsmash: {
		num: 504,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shell Smash",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: -1,
			spd: -1,
			atk: 2,
			spa: 2,
			spe: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	shelltrap: {
		num: 704,
		accuracy: 100,
		basePower: 150,
		category: "Special",
		isNonstandard: "Past",
		name: "Shell Trap",
		pp: 5,
		priority: -3,
		flags: { protect: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failinstruct: 1 },
		priorityChargeCallback(pokemon) {
			pokemon.addVolatile('shelltrap');
		},
		onTryMove(pokemon) {
			if (!pokemon.volatiles['shelltrap']?.gotHit) {
				this.attrLastMove('[still]');
				this.add('cant', pokemon, 'Shell Trap', 'Shell Trap');
				return null;
			}
		},
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Shell Trap');
			},
			onHit(pokemon, source, move) {
				if (!pokemon.isAlly(source) && move.category === 'Physical') {
					this.effectState.gotHit = true;
					const action = this.queue.willMove(pokemon);
					if (action) {
						this.queue.prioritizeAction(action);
					}
				}
			},
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Tough",
	},
	shelter: {
		num: 842,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shelter",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 2,
		},
		secondary: null,
		target: "self",
		type: "Steel",
	},
	shiftgear: {
		num: 508,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shift Gear",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spe: 2,
			atk: 1,
		},
		secondary: null,
		target: "self",
		type: "Steel",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	shockwave: {
		num: 351,
		accuracy: true,
		basePower: 60,
		category: "Special",
		name: "Shock Wave",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	shoreup: {
		num: 659,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Shore Up",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			if (this.field.isWeather('sandstorm')) {
				factor = 0.667;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
		type: "Ground",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	signalbeam: {
		num: 324,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		isNonstandard: "Past",
		name: "Signal Beam",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
	},
	silktrap: {
		num: 852,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Silk Trap",
		pp: 10,
		priority: 4,
		flags: {},
		stallingMove: true,
		volatileStatus: 'silktrap',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect'] || move.category === 'Status') {
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.boost({ spe: -1 }, source, target, this.dex.getActiveMove("Silk Trap"));
				}
			},
		},
		target: "self",
		type: "Bug",
	},
	silverwind: {
		num: 318,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		isNonstandard: "Past",
		name: "Silver Wind",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			self: {
				boosts: {
					atk: 1,
					def: 1,
					spa: 1,
					spd: 1,
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Bug",
		contestType: "Beautiful",
	},
	simplebeam: {
		num: 493,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Simple Beam",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress'] || target.ability === 'simple' || target.ability === 'truant') {
				return false;
			}
		},
		onHit(target, source) {
			const oldAbility = target.setAbility('simple');
			if (!oldAbility) return oldAbility as false | null;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	sing: {
		num: 47,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		name: "Sing",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Cute",
	},
	sinisterarrowraid: {
		num: 695,
		accuracy: true,
		basePower: 180,
		category: "Physical",
		isNonstandard: "Past",
		name: "Sinister Arrow Raid",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "decidiumz",
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	sizzlyslide: {
		num: 735,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "LGPE",
		name: "Sizzly Slide",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, defrost: 1 },
		secondary: {
			chance: 100,
			status: 'brn',
		},
		target: "normal",
		type: "Fire",
		contestType: "Clever",
	},
	sketch: {
		num: 166,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sketch",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {
			bypasssub: 1, allyanim: 1, failencore: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		onHit(target, source) {
			const move = target.lastMove;
			if (source.transformed || !move || source.moves.includes(move.id)) return false;
			if (move.flags['nosketch'] || move.isZ || move.isMax) return false;
			const sketchIndex = source.moves.indexOf('sketch');
			if (sketchIndex < 0) return false;
			const sketchedMove = {
				move: move.name,
				id: move.id,
				pp: move.pp,
				maxpp: move.pp,
				target: move.target,
				disabled: false,
				used: false,
			};
			source.moveSlots[sketchIndex] = sketchedMove;
			source.baseMoveSlots[sketchIndex] = sketchedMove;
			this.add('-activate', source, 'move: Sketch', move.name);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Clever",
	},
	skillswap: {
		num: 285,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Skill Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onTryHit(target, source) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['failskillswap'] || targetAbility.flags['failskillswap'] || target.volatiles['dynamax']) {
				return false;
			}
			const sourceCanBeSet = this.runEvent('SetAbility', source, source, this.effect, targetAbility);
			if (!sourceCanBeSet) return sourceCanBeSet;
			const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, sourceAbility);
			if (!targetCanBeSet) return targetCanBeSet;
		},
		onHit(target, source, move) {
			const targetAbility = target.getAbility();
			const sourceAbility = source.getAbility();
			if (target.isAlly(source)) {
				this.add('-activate', source, 'move: Skill Swap', '', '', `[of] ${target}`);
			} else {
				this.add('-activate', source, 'move: Skill Swap', targetAbility, sourceAbility, `[of] ${target}`);
			}
			this.singleEvent('End', sourceAbility, source.abilityState, source);
			this.singleEvent('End', targetAbility, target.abilityState, target);
			source.ability = targetAbility.id;
			target.ability = sourceAbility.id;
			source.abilityState = this.initEffectState({ id: this.toID(source.ability), target: source });
			target.abilityState = this.initEffectState({ id: this.toID(target.ability), target });
			source.volatileStaleness = undefined;
			if (!target.isAlly(source)) target.volatileStaleness = 'external';
			this.singleEvent('Start', targetAbility, source.abilityState, source);
			this.singleEvent('Start', sourceAbility, target.abilityState, target);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	skittersmack: {
		num: 806,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		name: "Skitter Smack",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Bug",
	},
	skullbash: {
		num: 130,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		isNonstandard: "Past",
		name: "Skull Bash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			this.boost({ def: 1 }, attacker, attacker, move);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	skyattack: {
		num: 143,
		accuracy: 90,
		basePower: 140,
		category: "Physical",
		name: "Sky Attack",
		pp: 5,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, distance: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		critRatio: 2,
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	skydrop: {
		num: 507,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Sky Drop",
		pp: 10,
		priority: 0,
		flags: {
			contact: 1, charge: 1, protect: 1, mirror: 1, gravity: 1, distance: 1,
			metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1,
		},
		onModifyMove(move, source) {
			if (!source.volatiles['skydrop']) {
				move.accuracy = true;
				delete move.flags['contact'];
			}
		},
		onMoveFail(target, source) {
			if (source.volatiles['twoturnmove'] && source.volatiles['twoturnmove'].duration === 1) {
				source.removeVolatile('skydrop');
				source.removeVolatile('twoturnmove');
				if (target === this.effectState.target) {
					this.add('-end', target, 'Sky Drop', '[interrupt]');
				}
			}
		},
		onTry(source, target) {
			return !target.fainted;
		},
		onTryHit(target, source, move) {
			if (source.removeVolatile(move.id)) {
				if (target !== source.volatiles['twoturnmove'].source) return false;

				if (target.hasType('Flying')) {
					this.add('-immune', target);
					return null;
				}
			} else {
				if (target.volatiles['substitute'] || target.isAlly(source)) {
					return false;
				}
				if (target.getWeight() >= 2000) {
					this.add('-fail', target, 'move: Sky Drop', '[heavy]');
					return null;
				}

				this.add('-prepare', source, move.name, target);
				source.addVolatile('twoturnmove', target);
				return null;
			}
		},
		onHit(target, source) {
			if (target.hp) this.add('-end', target, 'Sky Drop');
		},
		condition: {
			duration: 2,
			onAnyDragOut(pokemon) {
				if (pokemon === this.effectState.target || pokemon === this.effectState.source) return false;
			},
			onFoeTrapPokemonPriority: -15,
			onFoeTrapPokemon(defender) {
				if (defender !== this.effectState.source) return;
				defender.trapped = true;
			},
			onFoeBeforeMovePriority: 12,
			onFoeBeforeMove(attacker, defender, move) {
				if (attacker === this.effectState.source) {
					attacker.activeMoveActions--;
					this.debug('Sky drop nullifying.');
					return null;
				}
			},
			onRedirectTargetPriority: 99,
			onRedirectTarget(target, source, source2) {
				if (source !== this.effectState.target) return;
				if (this.effectState.source.fainted) return;
				return this.effectState.source;
			},
			onAnyInvulnerability(target, source, move) {
				if (target !== this.effectState.target && target !== this.effectState.source) {
					return;
				}
				if (source === this.effectState.target && target === this.effectState.source) {
					return;
				}
				if (['gust', 'twister', 'skyuppercut', 'thunder', 'hurricane', 'smackdown', 'thousandarrows'].includes(move.id)) {
					return;
				}
				return false;
			},
			onAnyBasePower(basePower, target, source, move) {
				if (target !== this.effectState.target && target !== this.effectState.source) {
					return;
				}
				if (source === this.effectState.target && target === this.effectState.source) {
					return;
				}
				if (move.id === 'gust' || move.id === 'twister') {
					this.debug('BP doubled on midair target');
					return this.chainModify(2);
				}
			},
			onFaint(target) {
				if (target.volatiles['skydrop'] && target.volatiles['twoturnmove'].source) {
					this.add('-end', target.volatiles['twoturnmove'].source, 'Sky Drop', '[interrupt]');
				}
			},
		},
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Tough",
	},
	skyuppercut: {
		num: 327,
		accuracy: 90,
		basePower: 85,
		category: "Physical",
		isNonstandard: "Past",
		name: "Sky Uppercut",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	slackoff: {
		num: 303,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Slack Off",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	slam: {
		num: 21,
		accuracy: 75,
		basePower: 80,
		category: "Physical",
		name: "Slam",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	slash: {
		num: 163,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Slash",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	sleeppowder: {
		num: 79,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		name: "Sleep Powder",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	sleeptalk: {
		num: 214,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sleep Talk",
		pp: 10,
		priority: 0,
		flags: { failencore: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		sleepUsable: true,
		onTry(source) {
			return source.status === 'slp' || source.hasAbility('comatose');
		},
		onHit(pokemon) {
			const moves = [];
			for (const moveSlot of pokemon.moveSlots) {
				const moveid = moveSlot.id;
				if (!moveid) continue;
				const move = this.dex.moves.get(moveid);
				if (move.flags['nosleeptalk'] || move.flags['charge'] || (move.isZ && move.basePower !== 1) || move.isMax) {
					continue;
				}
				moves.push(moveid);
			}
			let randomMove = '';
			if (moves.length) randomMove = this.sample(moves);
			if (!randomMove) {
				return false;
			}
			this.actions.useMove(randomMove, pokemon);
		},
		callsMove: true,
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'crit2' },
		contestType: "Cute",
	},
	sludge: {
		num: 124,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Sludge",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	sludgebomb: {
		num: 188,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Sludge Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 30,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	sludgewave: {
		num: 482,
		accuracy: 100,
		basePower: 95,
		category: "Special",
		name: "Sludge Wave",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'psn',
		},
		target: "allAdjacent",
		type: "Poison",
		contestType: "Tough",
	},
	smackdown: {
		num: 479,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Smack Down",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'smackdown',
		condition: {
			noCopy: true,
			onStart(pokemon) {
				let applies = false;
				if (pokemon.hasType('Flying') || pokemon.hasAbility('levitate')) applies = true;
				if (pokemon.hasItem('ironball') || pokemon.volatiles['ingrain'] ||
					this.field.getPseudoWeather('gravity')) applies = false;
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					applies = true;
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
				}
				if (pokemon.volatiles['magnetrise']) {
					applies = true;
					delete pokemon.volatiles['magnetrise'];
				}
				if (pokemon.volatiles['telekinesis']) {
					applies = true;
					delete pokemon.volatiles['telekinesis'];
				}
				if (!applies) return false;
				this.add('-start', pokemon, 'Smack Down');
			},
			onRestart(pokemon) {
				if (pokemon.removeVolatile('fly') || pokemon.removeVolatile('bounce')) {
					this.queue.cancelMove(pokemon);
					pokemon.removeVolatile('twoturnmove');
					this.add('-start', pokemon, 'Smack Down');
				}
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
		},
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	smartstrike: {
		num: 684,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		name: "Smart Strike",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	smellingsalts: {
		num: 265,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'par') {
				this.debug('BP doubled on paralyzed target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Smelling Salts",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			if (target.status === 'par') target.cureStatus();
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	smog: {
		num: 123,
		accuracy: 70,
		basePower: 30,
		category: "Special",
		name: "Smog",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 40,
			status: 'psn',
		},
		target: "normal",
		type: "Poison",
		contestType: "Tough",
	},
	smokescreen: {
		num: 108,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Smokescreen",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			accuracy: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { evasion: 1 } },
		contestType: "Clever",
	},
	snaptrap: {
		num: 779,
		accuracy: 100,
		basePower: 35,
		category: "Physical",
		isNonstandard: "Past",
		name: "Snap Trap",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	snarl: {
		num: 555,
		accuracy: 95,
		basePower: 55,
		category: "Special",
		name: "Snarl",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Dark",
		contestType: "Tough",
	},
	snatch: {
		num: 289,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Snatch",
		pp: 10,
		priority: 4,
		flags: { bypasssub: 1, mustpressure: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'snatch',
		condition: {
			duration: 1,
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'Snatch');
			},
			onAnyPrepareHitPriority: -1,
			onAnyPrepareHit(source, target, move) {
				const snatchUser = this.effectState.source;
				if (snatchUser.isSkyDropped()) return;
				if (!move || move.isZ || move.isMax || !move.flags['snatch'] || move.sourceEffect === 'snatch') {
					return;
				}
				snatchUser.removeVolatile('snatch');
				this.add('-activate', snatchUser, 'move: Snatch', `[of] ${source}`);
				this.actions.useMove(move.id, snatchUser);
				return null;
			},
		},
		secondary: null,
		target: "self",
		type: "Dark",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	snipeshot: {
		num: 745,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Snipe Shot",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		tracksTarget: true,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	snore: {
		num: 173,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Snore",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1 },
		sleepUsable: true,
		onTry(source) {
			return source.status === 'slp' || source.hasAbility('comatose');
		},
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	snowscape: {
		num: 883,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Snowscape",
		pp: 10,
		priority: 0,
		flags: {},
		weather: 'snowscape',
		secondary: null,
		target: "all",
		type: "Ice",
	},
	soak: {
		num: 487,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Soak",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.getTypes().join() === 'Water' || !target.setType('Water')) {
				// Soak should animate even when it fails.
				// Returning false would suppress the animation.
				this.add('-fail', target);
				return null;
			}
			this.add('-start', target, 'typechange', 'Water');
		},
		secondary: null,
		target: "normal",
		type: "Water",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	softboiled: {
		num: 135,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Soft-Boiled",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		heal: [1, 2],
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	solarbeam: {
		num: 76,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Solar Beam",
		pp: 10,
		priority: 0,
		flags: { charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	solarblade: {
		num: 669,
		accuracy: 100,
		basePower: 125,
		category: "Physical",
		name: "Solar Blade",
		pp: 10,
		priority: 0,
		flags: { contact: 1, charge: 1, protect: 1, mirror: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1, slicing: 1 },
		onTryMove(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name);
			if (['sunnyday', 'desolateland'].includes(attacker.effectiveWeather())) {
				this.attrLastMove('[still]');
				this.addMove('-anim', attacker, move.name, defender);
				return;
			}
			if (!this.runEvent('ChargeMove', attacker, defender, move)) {
				return;
			}
			attacker.addVolatile('twoturnmove', defender);
			return null;
		},
		onBasePower(basePower, pokemon, target) {
			const weakWeathers = ['raindance', 'primordialsea', 'sandstorm', 'hail', 'snowscape'];
			if (weakWeathers.includes(pokemon.effectiveWeather())) {
				this.debug('weakened by weather');
				return this.chainModify(0.5);
			}
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	sonicboom: {
		num: 49,
		accuracy: 90,
		basePower: 0,
		damage: 20,
		category: "Special",
		isNonstandard: "Past",
		name: "Sonic Boom",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	soulstealing7starstrike: {
		num: 699,
		accuracy: true,
		basePower: 195,
		category: "Physical",
		isNonstandard: "Past",
		name: "Soul-Stealing 7-Star Strike",
		pp: 1,
		priority: 0,
		flags: { contact: 1 },
		isZ: "marshadiumz",
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	spacialrend: {
		num: 460,
		accuracy: 95,
		basePower: 100,
		category: "Special",
		name: "Spacial Rend",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Dragon",
		contestType: "Beautiful",
	},
	spark: {
		num: 209,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Spark",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	sparklingaria: {
		num: 664,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Sparkling Aria",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			volatileStatus: 'sparklingaria',
		},
		onAfterMove(source, target, move) {
			if (source.fainted || !move.hitTargets || move.hasSheerForce) {
				// make sure the volatiles are cleared
				for (const pokemon of this.getAllActive()) delete pokemon.volatiles['sparklingaria'];
				return;
			}
			const numberTargets = move.hitTargets.length;
			for (const pokemon of move.hitTargets) {
				// bypasses Shield Dust when hitting multiple targets
				if (pokemon !== source && pokemon.isActive && (pokemon.removeVolatile('sparklingaria') || numberTargets > 1) &&
					pokemon.status === 'brn') {
					pokemon.cureStatus();
				}
			}
		},
		target: "allAdjacent",
		type: "Water",
		contestType: "Tough",
	},
	sparklyswirl: {
		num: 740,
		accuracy: 85,
		basePower: 120,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Sparkly Swirl",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		self: {
			onHit(pokemon, source, move) {
				this.add('-activate', source, 'move: Aromatherapy');
				for (const ally of source.side.pokemon) {
					if (ally !== source && (ally.volatiles['substitute'] && !move.infiltrates)) {
						continue;
					}
					ally.cureStatus();
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Clever",
	},
	spectralthief: {
		num: 712,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		isNonstandard: "Past",
		name: "Spectral Thief",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, bypasssub: 1 },
		stealsBoosts: true,
		// Boost stealing implemented in scripts.js
		secondary: null,
		target: "normal",
		type: "Ghost",
		contestType: "Cool",
	},
	speedswap: {
		num: 683,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Speed Swap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1 },
		onHit(target, source) {
			const targetSpe = target.storedStats.spe;
			target.storedStats.spe = source.storedStats.spe;
			source.storedStats.spe = targetSpe;
			this.add('-activate', source, 'move: Speed Swap', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	spicyextract: {
		num: 858,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spicy Extract",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1 },
		boosts: {
			atk: 2,
			def: -2,
		},
		secondary: null,
		target: "normal",
		type: "Grass",
	},
	spiderweb: {
		num: 169,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Spider Web",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			return target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "normal",
		type: "Bug",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	spikecannon: {
		num: 131,
		accuracy: 100,
		basePower: 20,
		category: "Physical",
		isNonstandard: "Past",
		name: "Spike Cannon",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		maxMove: { basePower: 120 },
		contestType: "Cool",
	},
	spikes: {
		num: 191,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'spikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				const damageAmounts = [0, 3, 4, 6]; // 1/8, 1/6, 1/4
				this.damage(damageAmounts[this.effectState.layers] * pokemon.maxhp / 24);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Ground",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	spikyshield: {
		num: 596,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Spiky Shield",
		pp: 10,
		priority: 4,
		flags: { noassist: 1, failcopycat: 1 },
		stallingMove: true,
		volatileStatus: 'spikyshield',
		onPrepareHit(pokemon) {
			return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
		},
		onHit(pokemon) {
			pokemon.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onStart(target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit(target, source, move) {
				if (!move.flags['protect']) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-activate', target, 'move: Protect');
				}
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (this.checkMoveMakesContact(move, source, target)) {
					this.damage(source.baseMaxhp / 8, source, target);
				}
				return this.NOT_FAIL;
			},
			onHit(target, source, move) {
				if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
					this.damage(source.baseMaxhp / 8, source, target);
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Grass",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	spinout: {
		num: 859,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Spin Out",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				spe: -2,
			},
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	spiritbreak: {
		num: 789,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Spirit Break",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "normal",
		type: "Fairy",
	},
	spiritshackle: {
		num: 662,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Spirit Shackle",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			onHit(target, source, move) {
				if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Tough",
	},
	spitup: {
		num: 255,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon) {
			if (!pokemon.volatiles['stockpile']?.layers) return false;
			return pokemon.volatiles['stockpile'].layers * 100;
		},
		category: "Special",
		name: "Spit Up",
		pp: 10,
		priority: 0,
		flags: { protect: 1, metronome: 1 },
		onTry(source) {
			return !!source.volatiles['stockpile'];
		},
		onAfterMove(pokemon) {
			pokemon.removeVolatile('stockpile');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	spite: {
		num: 180,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Spite",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		onHit(target) {
			let move: Move | ActiveMove | null = target.lastMove;
			if (!move || move.isZ) return false;
			if (move.isMax && move.baseMove) move = this.dex.moves.get(move.baseMove);

			const ppDeducted = target.deductPP(move.id, 4);
			if (!ppDeducted) return false;
			this.add("-activate", target, 'move: Spite', move.name, ppDeducted);
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		zMove: { effect: 'heal' },
		contestType: "Tough",
	},
	splash: {
		num: 150,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Splash",
		pp: 40,
		priority: 0,
		flags: { gravity: 1, metronome: 1 },
		onTry(source, target, move) {
			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		onTryHit(target, source) {
			this.add('-nothing');
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 3 } },
		contestType: "Cute",
	},
	splinteredstormshards: {
		num: 727,
		accuracy: true,
		basePower: 190,
		category: "Physical",
		isNonstandard: "Past",
		name: "Splintered Stormshards",
		pp: 1,
		priority: 0,
		flags: {},
		onHit() {
			this.field.clearTerrain();
		},
		onAfterSubDamage() {
			this.field.clearTerrain();
		},
		isZ: "lycaniumz",
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Cool",
	},
	splishysplash: {
		num: 730,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		isNonstandard: "LGPE",
		name: "Splishy Splash",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Cool",
	},
	spore: {
		num: 147,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Spore",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'slp',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	spotlight: {
		num: 671,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Spotlight",
		pp: 15,
		priority: 3,
		flags: { protect: 1, reflectable: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		volatileStatus: 'spotlight',
		onTryHit(target) {
			if (this.activePerHalf === 1) return false;
		},
		condition: {
			duration: 1,
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(pokemon) {
				this.add('-singleturn', pokemon, 'move: Spotlight');
			},
			onFoeRedirectTargetPriority: 2,
			onFoeRedirectTarget(target, source, source2, move) {
				if (this.validTarget(this.effectState.target, source, move.target)) {
					this.debug("Spotlight redirected target of move");
					return this.effectState.target;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	springtidestorm: {
		num: 831,
		accuracy: 80,
		basePower: 100,
		category: "Special",
		name: "Springtide Storm",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, wind: 1 },
		secondary: {
			chance: 30,
			boosts: {
				atk: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Fairy",
	},
	stealthrock: {
		num: 446,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stealth Rock",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'stealthrock',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn(pokemon) {
				if (pokemon.hasItem('heavydutyboots')) return;
				const typeMod = this.clampIntRange(pokemon.runEffectiveness(this.dex.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * (2 ** typeMod) / 8);
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Rock",
		zMove: { boost: { def: 1 } },
		contestType: "Cool",
	},
	steameruption: {
		num: 592,
		accuracy: 95,
		basePower: 110,
		category: "Special",
		name: "Steam Eruption",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1 },
		thawsTarget: true,
		secondary: {
			chance: 30,
			status: 'brn',
		},
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	steamroller: {
		num: 537,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		isNonstandard: "Past",
		name: "Steamroller",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Bug",
		contestType: "Tough",
	},
	steelbeam: {
		num: 796,
		accuracy: 95,
		basePower: 140,
		category: "Special",
		name: "Steel Beam",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		mindBlownRecoil: true,
		onAfterMove(pokemon, target, move) {
			if (move.mindBlownRecoil && !move.multihit) {
				const hpBeforeRecoil = pokemon.hp;
				this.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get('Steel Beam'), true);
				if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
					this.runEvent('EmergencyExit', pokemon, pokemon);
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	steelroller: {
		num: 798,
		accuracy: 100,
		basePower: 130,
		category: "Physical",
		name: "Steel Roller",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry() {
			return !this.field.isTerrain('');
		},
		onHit() {
			this.field.clearTerrain();
		},
		onAfterSubDamage() {
			this.field.clearTerrain();
		},
		secondary: null,
		target: "normal",
		type: "Steel",
	},
	steelwing: {
		num: 211,
		accuracy: 90,
		basePower: 70,
		category: "Physical",
		name: "Steel Wing",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			self: {
				boosts: {
					def: 1,
				},
			},
		},
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	stickyweb: {
		num: 564,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sticky Web",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, metronome: 1 },
		sideCondition: 'stickyweb',
		condition: {
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({ spe: -1 }, pokemon, pokemon.side.foe.active[0], this.dex.getActiveMove('stickyweb'));
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Bug",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
	},
	stockpile: {
		num: 254,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stockpile",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onTry(source) {
			if (source.volatiles['stockpile'] && source.volatiles['stockpile'].layers >= 3) return false;
		},
		volatileStatus: 'stockpile',
		condition: {
			noCopy: true,
			onStart(target) {
				this.effectState.layers = 1;
				this.effectState.def = 0;
				this.effectState.spd = 0;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const [curDef, curSpD] = [target.boosts.def, target.boosts.spd];
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onRestart(target) {
				if (this.effectState.layers >= 3) return false;
				this.effectState.layers++;
				this.add('-start', target, 'stockpile' + this.effectState.layers);
				const curDef = target.boosts.def;
				const curSpD = target.boosts.spd;
				this.boost({ def: 1, spd: 1 }, target, target);
				if (curDef !== target.boosts.def) this.effectState.def--;
				if (curSpD !== target.boosts.spd) this.effectState.spd--;
			},
			onEnd(target) {
				if (this.effectState.def || this.effectState.spd) {
					const boosts: SparseBoostsTable = {};
					if (this.effectState.def) boosts.def = this.effectState.def;
					if (this.effectState.spd) boosts.spd = this.effectState.spd;
					this.boost(boosts, target, target);
				}
				this.add('-end', target, 'Stockpile');
				if (this.effectState.def !== this.effectState.layers * -1 || this.effectState.spd !== this.effectState.layers * -1) {
					this.hint("In Gen 7, Stockpile keeps track of how many times it successfully altered each stat individually.");
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Tough",
	},
	stokedsparksurfer: {
		num: 700,
		accuracy: true,
		basePower: 175,
		category: "Special",
		isNonstandard: "Past",
		name: "Stoked Sparksurfer",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "aloraichiumz",
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	stomp: {
		num: 23,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Stomp",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	stompingtantrum: {
		num: 707,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) {
				this.debug('doubling Stomping Tantrum BP due to previous move failure');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Stomping Tantrum",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Tough",
	},
	stoneaxe: {
		num: 830,
		accuracy: 90,
		basePower: 65,
		category: "Physical",
		name: "Stone Axe",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		onAfterHit(target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock');
				}
			}
		},
		onAfterSubDamage(damage, target, source, move) {
			if (!move.hasSheerForce && source.hp) {
				for (const side of source.side.foeSidesWithConditions()) {
					side.addSideCondition('stealthrock');
				}
			}
		},
		secondary: {}, // Sheer Force-boosted
		target: "normal",
		type: "Rock",
	},
	stoneedge: {
		num: 444,
		accuracy: 80,
		basePower: 100,
		category: "Physical",
		name: "Stone Edge",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondary: null,
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},
	storedpower: {
		num: 500,
		accuracy: 100,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower + 20 * pokemon.positiveBoosts();
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Stored Power",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Clever",
	},
	stormthrow: {
		num: 480,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		isNonstandard: "Past",
		name: "Storm Throw",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	strangesteam: {
		num: 790,
		accuracy: 95,
		basePower: 90,
		category: "Special",
		name: "Strange Steam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "normal",
		type: "Fairy",
	},
	strength: {
		num: 70,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Strength",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	strengthsap: {
		num: 668,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Strength Sap",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, heal: 1, metronome: 1 },
		onHit(target, source) {
			if (target.boosts.atk === -6) return false;
			const atk = target.getStat('atk', false, true);
			const success = this.boost({ atk: -1 }, target, source, null, false, true);
			return !!(this.heal(atk, source, target) || success);
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	stringshot: {
		num: 81,
		accuracy: 95,
		basePower: 0,
		category: "Status",
		name: "String Shot",
		pp: 40,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			spe: -2,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Bug",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	struggle: {
		num: 165,
		accuracy: true,
		basePower: 50,
		category: "Physical",
		name: "Struggle",
		pp: 1,
		noPPBoosts: true,
		priority: 0,
		flags: {
			contact: 1, protect: 1,
			failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		onModifyMove(move, pokemon, target) {
			move.type = '???';
			this.add('-activate', pokemon, 'move: Struggle');
		},
		struggleRecoil: true,
		secondary: null,
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
	},
	strugglebug: {
		num: 522,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Struggle Bug",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				spa: -1,
			},
		},
		target: "allAdjacentFoes",
		type: "Bug",
		contestType: "Cute",
	},
	stuffcheeks: {
		num: 747,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Stuff Cheeks",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onDisableMove(pokemon) {
			if (!pokemon.getItem().isBerry) pokemon.disableMove('stuffcheeks');
		},
		onTry(source) {
			return source.getItem().isBerry;
		},
		onHit(pokemon) {
			if (!this.boost({ def: 2 })) return null;
			pokemon.eatItem(true);
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	stunspore: {
		num: 78,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		name: "Stun Spore",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1, powder: 1 },
		status: 'par',
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	submission: {
		num: 66,
		accuracy: 80,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Past",
		name: "Submission",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	substitute: {
		num: 164,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Substitute",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, nonsky: 1, metronome: 1 },
		volatileStatus: 'substitute',
		onTryHit(source) {
			if (source.volatiles['substitute']) {
				this.add('-fail', source, 'move: Substitute');
				return this.NOT_FAIL;
			}
			if (source.hp <= source.maxhp / 4 || source.maxhp === 1) { // Shedinja clause
				this.add('-fail', source, 'move: Substitute', '[weak]');
				return this.NOT_FAIL;
			}
		},
		onHit(target) {
			this.directDamage(target.maxhp / 4);
		},
		condition: {
			onStart(target, source, effect) {
				if (effect?.id === 'shedtail') {
					this.add('-start', target, 'Substitute', '[from] move: Shed Tail');
				} else {
					this.add('-start', target, 'Substitute');
				}
				this.effectState.hp = Math.floor(target.maxhp / 4);
				if (target.volatiles['partiallytrapped']) {
					this.add('-end', target, target.volatiles['partiallytrapped'].sourceEffect, '[partiallytrapped]', '[silent]');
					delete target.volatiles['partiallytrapped'];
				}
			},
			onTryPrimaryHitPriority: -1,
			onTryPrimaryHit(target, source, move) {
				if (target === source || move.flags['bypasssub'] || move.infiltrates) {
					return;
				}
				let damage = this.actions.getDamage(source, target, move);
				if (!damage && damage !== 0) {
					this.add('-fail', source);
					this.attrLastMove('[still]');
					return null;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp as number;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					if (move.ohko) this.add('-ohko');
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'move: Substitute', '[damage]');
				}
				if (move.recoil || move.id === 'chloroblast') {
					this.damage(this.actions.calcRecoilDamage(damage, move, source), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.singleEvent('AfterSubDamage', move, null, target, source, move, damage);
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return this.HIT_SUBSTITUTE;
			},
			onEnd(target) {
				this.add('-end', target, 'Substitute');
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	subzeroslammer: {
		num: 650,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Subzero Slammer",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "iciumz",
		secondary: null,
		target: "normal",
		type: "Ice",
		contestType: "Cool",
	},
	suckerpunch: {
		num: 389,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Sucker Punch",
		pp: 5,
		priority: 1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	sunnyday: {
		num: 241,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Sunny Day",
		pp: 5,
		priority: 0,
		flags: { metronome: 1 },
		weather: 'sunnyday',
		secondary: null,
		target: "all",
		type: "Fire",
		zMove: { boost: { spe: 1 } },
		contestType: "Beautiful",
	},
	sunsteelstrike: {
		num: 713,
		accuracy: 100,
		basePower: 100,
		category: "Physical",
		name: "Sunsteel Strike",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		ignoreAbility: true,
		secondary: null,
		target: "normal",
		type: "Steel",
		contestType: "Cool",
	},
	supercellslam: {
		num: 916,
		accuracy: 95,
		basePower: 100,
		category: "Physical",
		name: "Supercell Slam",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		hasCrashDamage: true,
		onMoveFail(target, source, move) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.conditions.get('Supercell Slam'));
		},
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	superfang: {
		num: 162,
		accuracy: 90,
		basePower: 0,
		damageCallback(pokemon, target) {
			return this.clampIntRange(target.getUndynamaxedHP() / 2, 1);
		},
		category: "Physical",
		name: "Super Fang",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	superpower: {
		num: 276,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Superpower",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		self: {
			boosts: {
				atk: -1,
				def: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	supersonic: {
		num: 48,
		accuracy: 55,
		basePower: 0,
		category: "Status",
		name: "Supersonic",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	supersonicskystrike: {
		num: 626,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Supersonic Skystrike",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "flyiniumz",
		secondary: null,
		target: "normal",
		type: "Flying",
		contestType: "Cool",
	},
	surf: {
		num: 57,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Surf",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacent",
		type: "Water",
		contestType: "Beautiful",
	},
	surgingstrikes: {
		num: 818,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		name: "Surging Strikes",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		multihit: 3,
		secondary: null,
		target: "normal",
		type: "Water",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
	},
	swagger: {
		num: 207,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Swagger",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'confusion',
		boosts: {
			atk: 2,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Cute",
	},
	swallow: {
		num: 256,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Swallow",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onTry(source, target, move) {
			if (move.sourceEffect === 'snatch') return;
			return !!source.volatiles['stockpile'];
		},
		onHit(pokemon) {
			const layers = pokemon.volatiles['stockpile']?.layers || 1;
			const healAmount = [0.25, 0.5, 1];
			const success = !!this.heal(this.modify(pokemon.maxhp, healAmount[layers - 1]));
			if (!success) this.add('-fail', pokemon, 'heal');
			pokemon.removeVolatile('stockpile');
			return success || this.NOT_FAIL;
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Tough",
	},
	sweetkiss: {
		num: 186,
		accuracy: 75,
		basePower: 0,
		category: "Status",
		name: "Sweet Kiss",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "normal",
		type: "Fairy",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	sweetscent: {
		num: 230,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Sweet Scent",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			evasion: -2,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Cute",
	},
	swift: {
		num: 129,
		accuracy: true,
		basePower: 60,
		category: "Special",
		name: "Swift",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		contestType: "Cool",
	},
	switcheroo: {
		num: 415,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Switcheroo",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onTryImmunity(target) {
			return !target.hasAbility('stickyhold');
		},
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Switcheroo');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Switcheroo');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Switcheroo');
			}
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	swordsdance: {
		num: 14,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Swords Dance",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			atk: 2,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	synchronoise: {
		num: 485,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		isNonstandard: "Past",
		name: "Synchronoise",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTryImmunity(target, source) {
			return target.hasType(source.getTypes());
		},
		secondary: null,
		target: "allAdjacent",
		type: "Psychic",
		contestType: "Clever",
	},
	synthesis: {
		num: 235,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Synthesis",
		pp: 5,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		onHit(pokemon) {
			let factor = 0.5;
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				factor = 0.667;
				break;
			case 'raindance':
			case 'primordialsea':
			case 'sandstorm':
			case 'hail':
			case 'snowscape':
				factor = 0.25;
				break;
			}
			const success = !!this.heal(this.modify(pokemon.maxhp, factor));
			if (!success) {
				this.add('-fail', pokemon, 'heal');
				return this.NOT_FAIL;
			}
			return success;
		},
		secondary: null,
		target: "self",
		type: "Grass",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Clever",
	},
	syrupbomb: {
		num: 903,
		accuracy: 85,
		basePower: 60,
		category: "Special",
		name: "Syrup Bomb",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		condition: {
			noCopy: true,
			duration: 4,
			onStart(pokemon) {
				this.add('-start', pokemon, 'Syrup Bomb');
			},
			onUpdate(pokemon) {
				if (this.effectState.source && !this.effectState.source.isActive) {
					pokemon.removeVolatile('syrupbomb');
				}
			},
			onResidualOrder: 14,
			onResidual(pokemon) {
				this.boost({ spe: -1 }, pokemon, this.effectState.source);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Syrup Bomb', '[silent]');
			},
		},
		secondary: {
			chance: 100,
			volatileStatus: 'syrupbomb',
		},
		target: "normal",
		type: "Grass",
	},
	tachyoncutter: {
		num: 911,
		accuracy: true,
		basePower: 50,
		category: "Special",
		name: "Tachyon Cutter",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Steel",
		zMove: { basePower: 180 },
		maxMove: { basePower: 140 },
		contestType: "Clever",
	},
	tackle: {
		num: 33,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		name: "Tackle",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	tailglow: {
		num: 294,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Tail Glow",
		pp: 20,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			spa: 3,
		},
		secondary: null,
		target: "self",
		type: "Bug",
		zMove: { effect: 'clearnegativeboost' },
		contestType: "Beautiful",
	},
	tailslap: {
		num: 541,
		accuracy: 85,
		basePower: 25,
		category: "Physical",
		name: "Tail Slap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 140 },
		maxMove: { basePower: 130 },
		contestType: "Cute",
	},
	tailwhip: {
		num: 39,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Tail Whip",
		pp: 30,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			def: -1,
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Cute",
	},
	tailwind: {
		num: 366,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Tailwind",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1, wind: 1 },
		sideCondition: 'tailwind',
		condition: {
			duration: 4,
			durationCallback(target, source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Tailwind');
					return 6;
				}
				return 4;
			},
			onSideStart(side, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-sidestart', side, 'move: Tailwind', '[persistent]');
				} else {
					this.add('-sidestart', side, 'move: Tailwind');
				}
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(2);
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 5,
			onSideEnd(side) {
				this.add('-sideend', side, 'move: Tailwind');
			},
		},
		secondary: null,
		target: "allySide",
		type: "Flying",
		zMove: { effect: 'crit2' },
		contestType: "Cool",
	},
	takedown: {
		num: 36,
		accuracy: 85,
		basePower: 90,
		category: "Physical",
		name: "Take Down",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	takeheart: {
		num: 850,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Take Heart",
		pp: 15,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		onHit(pokemon) {
			const success = !!this.boost({ spa: 1, spd: 1 });
			return pokemon.cureStatus() || success;
		},
		secondary: null,
		target: "self",
		type: "Psychic",
	},
	tarshot: {
		num: 749,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Tar Shot",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'tarshot',
		condition: {
			onStart(pokemon) {
				if (pokemon.terastallized) return false;
				this.add('-start', pokemon, 'Tar Shot');
			},
			onEffectivenessPriority: -2,
			onEffectiveness(typeMod, target, type, move) {
				if (move.type !== 'Fire') return;
				if (!target) return;
				if (type !== target.getTypes()[0]) return;
				return typeMod + 1;
			},
		},
		boosts: {
			spe: -1,
		},
		secondary: null,
		target: "normal",
		type: "Rock",
	},
	taunt: {
		num: 269,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Taunt",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'taunt',
		condition: {
			duration: 3,
			onStart(target) {
				if (target.activeTurns && !this.queue.willMove(target)) {
					this.effectState.duration!++;
				}
				this.add('-start', target, 'move: Taunt');
			},
			onResidualOrder: 15,
			onEnd(target) {
				this.add('-end', target, 'move: Taunt');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					const move = this.dex.moves.get(moveSlot.id);
					if (move.category === 'Status' && move.id !== 'mefirst') {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 5,
			onBeforeMove(attacker, defender, move) {
				if (!move.isZ && !move.isMax && move.category === 'Status' && move.id !== 'mefirst') {
					this.add('cant', attacker, 'move: Taunt', move);
					return false;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
	},
	tearfullook: {
		num: 715,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Tearful Look",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, mirror: 1, metronome: 1 },
		boosts: {
			atk: -1,
			spa: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	teatime: {
		num: 752,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Teatime",
		pp: 10,
		priority: 0,
		flags: { bypasssub: 1, metronome: 1 },
		onHitField(target, source, move) {
			const targets: Pokemon[] = [];
			for (const pokemon of this.getAllActive()) {
				if (this.runEvent('Invulnerability', pokemon, source, move) === false) {
					this.add('-miss', source, pokemon);
				} else if (this.runEvent('TryHit', pokemon, source, move) && pokemon.getItem().isBerry) {
					targets.push(pokemon);
				}
			}
			this.add('-fieldactivate', 'move: Teatime');
			if (!targets.length) {
				this.add('-fail', source, 'move: Teatime');
				this.attrLastMove('[still]');
				return this.NOT_FAIL;
			}
			for (const pokemon of targets) {
				pokemon.eatItem(true);
			}
		},
		secondary: null,
		target: "all",
		type: "Normal",
	},
	technoblast: {
		num: 546,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		isNonstandard: "Past",
		name: "Techno Blast",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.ignoringItem()) return;
			move.type = this.runEvent('Drive', pokemon, null, move, 'Normal');
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cool",
	},
	tectonicrage: {
		num: 630,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Tectonic Rage",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "groundiumz",
		secondary: null,
		target: "normal",
		type: "Ground",
		contestType: "Cool",
	},
	teeterdance: {
		num: 298,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Teeter Dance",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, dance: 1, metronome: 1 },
		volatileStatus: 'confusion',
		secondary: null,
		target: "allAdjacent",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
	telekinesis: {
		num: 477,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Telekinesis",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, gravity: 1, allyanim: 1, metronome: 1 },
		volatileStatus: 'telekinesis',
		onTry(source, target, move) {
			// Additional Gravity check for Z-move variant
			if (this.field.getPseudoWeather('Gravity')) {
				this.attrLastMove('[still]');
				this.add('cant', source, 'move: Gravity', move);
				return null;
			}
		},
		condition: {
			duration: 3,
			onStart(target) {
				if (['Diglett', 'Dugtrio', 'Palossand', 'Sandygast'].includes(target.baseSpecies.baseSpecies) ||
					target.baseSpecies.name === 'Gengar-Mega') {
					this.add('-immune', target);
					return null;
				}
				if (target.volatiles['smackdown'] || target.volatiles['ingrain']) return false;
				this.add('-start', target, 'Telekinesis');
			},
			onAccuracyPriority: -1,
			onAccuracy(accuracy, target, source, move) {
				if (move && !move.ohko) return true;
			},
			onImmunity(type) {
				if (type === 'Ground') return false;
			},
			onUpdate(pokemon) {
				if (pokemon.baseSpecies.name === 'Gengar-Mega') {
					delete pokemon.volatiles['telekinesis'];
					this.add('-end', pokemon, 'Telekinesis', '[silent]');
				}
			},
			onResidualOrder: 19,
			onEnd(target) {
				this.add('-end', target, 'Telekinesis');
			},
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spa: 1 } },
		contestType: "Clever",
	},
	teleport: {
		num: 100,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Teleport",
		pp: 20,
		priority: -6,
		flags: { metronome: 1 },
		onTry(source) {
			return !!this.canSwitch(source.side);
		},
		selfSwitch: true,
		secondary: null,
		target: "self",
		type: "Psychic",
		zMove: { effect: 'heal' },
		contestType: "Cool",
	},
	temperflare: {
		num: 915,
		accuracy: 100,
		basePower: 75,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.moveLastTurnResult === false) {
				this.debug('doubling Temper Flare BP due to previous move failure');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Temper Flare",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fire",
	},
	terablast: {
		num: 851,
		accuracy: 100,
		basePower: 80,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.terastallized === 'Stellar') {
				return 100;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Tera Blast",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, mustpressure: 1 },
		onPrepareHit(target, source, move) {
			if (source.terastallized) {
				this.attrLastMove('[anim] Tera Blast ' + source.teraType);
			}
		},
		onModifyType(move, pokemon, target) {
			if (pokemon.terastallized) {
				move.type = pokemon.teraType;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
				move.category = 'Physical';
			}
			if (pokemon.terastallized === 'Stellar') {
				move.self = { boosts: { atk: -1, spa: -1 } };
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	terastarstorm: {
		num: 906,
		accuracy: 100,
		basePower: 120,
		category: "Special",
		name: "Tera Starstorm",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, noassist: 1, failcopycat: 1, failmimic: 1, nosketch: 1 },
		onModifyType(move, pokemon) {
			if (pokemon.species.name === 'Terapagos-Stellar') {
				move.type = 'Stellar';
				if (pokemon.terastallized && pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
					move.category = 'Physical';
				}
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.species.name === 'Terapagos-Stellar') {
				move.target = 'allAdjacentFoes';
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
	},
	terrainpulse: {
		num: 805,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Terrain Pulse",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, pulse: 1 },
		onModifyType(move, pokemon) {
			if (!pokemon.isGrounded()) return;
			switch (this.field.terrain) {
			case 'electricterrain':
				move.type = 'Electric';
				break;
			case 'grassyterrain':
				move.type = 'Grass';
				break;
			case 'mistyterrain':
				move.type = 'Fairy';
				break;
			case 'psychicterrain':
				move.type = 'Psychic';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			if (this.field.terrain && pokemon.isGrounded()) {
				move.basePower *= 2;
				this.debug('BP doubled in Terrain');
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
	},
	thief: {
		num: 168,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Thief",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, failmefirst: 1, noassist: 1, failcopycat: 1 },
		onAfterHit(target, source, move) {
			if (source.item || source.volatiles['gem']) {
				return;
			}
			const yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem) ||
				!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-enditem', target, yourItem, '[silent]', '[from] move: Thief', `[of] ${source}`);
			this.add('-item', source, yourItem, '[from] move: Thief', `[of] ${target}`);
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		contestType: "Tough",
	},
	thousandarrows: {
		num: 614,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		isNonstandard: "Past",
		name: "Thousand Arrows",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1 },
		onEffectiveness(typeMod, target, type, move) {
			if (move.type !== 'Ground') return;
			if (!target) return; // avoid crashing when called from a chat plugin
			// ignore effectiveness if the target is Flying type and immune to Ground
			if (!target.runImmunity('Ground')) {
				if (target.hasType('Flying')) return 0;
			}
		},
		volatileStatus: 'smackdown',
		ignoreImmunity: { 'Ground': true },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ground",
		zMove: { basePower: 180 },
		contestType: "Beautiful",
	},
	thousandwaves: {
		num: 615,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		isNonstandard: "Past",
		name: "Thousand Waves",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1 },
		onHit(target, source, move) {
			if (source.isActive) target.addVolatile('trapped', source, move, 'trapper');
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Ground",
		contestType: "Tough",
	},
	thrash: {
		num: 37,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Thrash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, failinstruct: 1 },
		self: {
			volatileStatus: 'lockedmove',
		},
		secondary: null,
		target: "randomNormal",
		type: "Normal",
		contestType: "Tough",
	},
	throatchop: {
		num: 675,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Throat Chop",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		condition: {
			duration: 2,
			onStart(target) {
				this.add('-start', target, 'Throat Chop', '[silent]');
			},
			onDisableMove(pokemon) {
				for (const moveSlot of pokemon.moveSlots) {
					if (this.dex.moves.get(moveSlot.id).flags['sound']) {
						pokemon.disableMove(moveSlot.id);
					}
				}
			},
			onBeforeMovePriority: 6,
			onBeforeMove(pokemon, target, move) {
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onModifyMove(move, pokemon, target) {
				if (!move.isZ && !move.isMax && move.flags['sound']) {
					this.add('cant', pokemon, 'move: Throat Chop');
					return false;
				}
			},
			onResidualOrder: 22,
			onEnd(target) {
				this.add('-end', target, 'Throat Chop', '[silent]');
			},
		},
		secondary: {
			chance: 100,
			onHit(target) {
				target.addVolatile('throatchop');
			},
		},
		target: "normal",
		type: "Dark",
		contestType: "Clever",
	},
	thunder: {
		num: 87,
		accuracy: 70,
		basePower: 110,
		category: "Special",
		name: "Thunder",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onModifyMove(move, pokemon, target) {
			switch (target?.effectiveWeather()) {
			case 'raindance':
			case 'primordialsea':
				move.accuracy = true;
				break;
			case 'sunnyday':
			case 'desolateland':
				move.accuracy = 50;
				break;
			}
		},
		secondary: {
			chance: 30,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	thunderbolt: {
		num: 85,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Thunderbolt",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	thundercage: {
		num: 819,
		accuracy: 90,
		basePower: 80,
		category: "Special",
		name: "Thunder Cage",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Electric",
	},
	thunderclap: {
		num: 909,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Thunderclap",
		pp: 5,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || (move.category === 'Status' && move.id !== 'mefirst') || target.volatiles['mustrecharge']) {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Clever",
	},
	thunderfang: {
		num: 422,
		accuracy: 95,
		basePower: 65,
		category: "Physical",
		name: "Thunder Fang",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, bite: 1 },
		secondaries: [
			{
				chance: 10,
				status: 'par',
			}, {
				chance: 10,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	thunderouskick: {
		num: 823,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Thunderous Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Fighting",
	},
	thunderpunch: {
		num: 9,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Thunder Punch",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	thundershock: {
		num: 84,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Thunder Shock",
		pp: 30,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	thunderwave: {
		num: 86,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Thunder Wave",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'par',
		ignoreImmunity: false,
		secondary: null,
		target: "normal",
		type: "Electric",
		zMove: { boost: { spd: 1 } },
		contestType: "Cool",
	},
	tickle: {
		num: 321,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Tickle",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		boosts: {
			atk: -1,
			def: -1,
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	tidyup: {
		num: 882,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Tidy Up",
		pp: 10,
		priority: 0,
		flags: {},
		onHit(pokemon) {
			let success = false;
			for (const active of this.getAllActive()) {
				if (active.removeVolatile('substitute')) success = true;
			}
			const removeAll = ['spikes', 'toxicspikes', 'poop', 'stealthrock', 'stickyweb', 'gmaxsteelsurge'];
			const sides = [pokemon.side, ...pokemon.side.foeSidesWithConditions()];
			for (const side of sides) {
				for (const sideCondition of removeAll) {
					if (side.removeSideCondition(sideCondition)) {
						this.add('-sideend', side, this.dex.conditions.get(sideCondition).name);
						success = true;
					}
				}
			}
			if (success) this.add('-activate', pokemon, 'move: Tidy Up');
			return !!this.boost({ atk: 1, spe: 1 }, pokemon, pokemon, null, false, true) || success;
		},
		secondary: null,
		target: "self",
		type: "Normal",
	},
	topsyturvy: {
		num: 576,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Topsy-Turvy",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			let success = false;
			let i: BoostID;
			for (i in target.boosts) {
				if (target.boosts[i] === 0) continue;
				target.boosts[i] = -target.boosts[i];
				success = true;
			}
			if (!success) return false;
			this.add('-invertboost', target, '[from] move: Topsy-Turvy');
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { atk: 1 } },
		contestType: "Clever",
	},
	torchsong: {
		num: 871,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Torch Song",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	torment: {
		num: 259,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Torment",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, bypasssub: 1, metronome: 1 },
		volatileStatus: 'torment',
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (pokemon.volatiles['dynamax']) {
					delete pokemon.volatiles['torment'];
					return false;
				}
				if (effect?.id === 'gmaxmeltdown') this.effectState.duration = 3;
				this.add('-start', pokemon, 'Torment');
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Torment');
			},
			onDisableMove(pokemon) {
				if (pokemon.lastMove && pokemon.lastMove.id !== 'struggle') pokemon.disableMove(pokemon.lastMove.id);
			},
		},
		secondary: null,
		target: "normal",
		type: "Dark",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	toxic: {
		num: 92,
		accuracy: 90,
		basePower: 0,
		category: "Status",
		name: "Toxic",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		// No Guard-like effect for Poison-type users implemented in Scripts#tryMoveHit
		status: 'tox',
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	toxicspikes: {
		num: 390,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Toxic Spikes",
		pp: 20,
		priority: 0,
		flags: { reflectable: 1, nonsky: 1, metronome: 1, mustpressure: 1 },
		sideCondition: 'toxicspikes',
		condition: {
			// this is a side condition
			onSideStart(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers = 1;
			},
			onSideRestart(side) {
				if (this.effectState.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectState.layers++;
			},
			onSwitchIn(pokemon) {
				if (!pokemon.isGrounded()) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', `[of] ${pokemon}`);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (pokemon.hasType('Steel') || pokemon.hasItem('heavydutyboots')) {
					// do nothing
				} else if (this.effectState.layers >= 2) {
					pokemon.trySetStatus('tox', pokemon.side.foe.active[0]);
				} else {
					pokemon.trySetStatus('psn', pokemon.side.foe.active[0]);
				}
			},
		},
		secondary: null,
		target: "foeSide",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	toxicthread: {
		num: 672,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Toxic Thread",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'psn',
		boosts: {
			spe: -1,
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		zMove: { boost: { spe: 1 } },
		contestType: "Tough",
	},
	trailblaze: {
		num: 885,
		accuracy: 100,
		basePower: 50,
		category: "Physical",
		name: "Trailblaze",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spe: 1,
				},
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	transform: {
		num: 144,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Transform",
		pp: 10,
		priority: 0,
		flags: { allyanim: 1, failencore: 1, noassist: 1, failcopycat: 1, failmimic: 1, failinstruct: 1 },
		onHit(target, pokemon) {
			if (!pokemon.transformInto(target)) {
				return false;
			}
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { effect: 'heal' },
		contestType: "Clever",
	},
	triattack: {
		num: 161,
		accuracy: 100,
		basePower: 80,
		category: "Special",
		name: "Tri Attack",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			onHit(target, source) {
				const result = this.random(3);
				if (result === 0) {
					target.trySetStatus('brn', source);
				} else if (result === 1) {
					target.trySetStatus('par', source);
				} else {
					target.trySetStatus('frz', source);
				}
			},
		},
		target: "normal",
		type: "Normal",
		contestType: "Beautiful",
	},
	trick: {
		num: 271,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Trick",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, allyanim: 1, noassist: 1, failcopycat: 1 },
		onTryImmunity(target) {
			return !target.hasAbility('stickyhold');
		},
		onHit(target, source, move) {
			const yourItem = target.takeItem(source);
			const myItem = source.takeItem();
			if (target.item || source.item || (!yourItem && !myItem)) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			if (
				(myItem && !this.singleEvent('TakeItem', myItem, source.itemState, target, source, move, myItem)) ||
				(yourItem && !this.singleEvent('TakeItem', yourItem, target.itemState, source, target, move, yourItem))
			) {
				if (yourItem) target.item = yourItem.id;
				if (myItem) source.item = myItem.id;
				return false;
			}
			this.add('-activate', source, 'move: Trick', `[of] ${target}`);
			if (myItem) {
				target.setItem(myItem);
				this.add('-item', target, myItem, '[from] move: Trick');
			} else {
				this.add('-enditem', target, yourItem, '[silent]', '[from] move: Trick');
			}
			if (yourItem) {
				source.setItem(yourItem);
				this.add('-item', source, yourItem, '[from] move: Trick');
			} else {
				this.add('-enditem', source, myItem, '[silent]', '[from] move: Trick');
			}
		},
		secondary: null,
		target: "normal",
		type: "Psychic",
		zMove: { boost: { spe: 2 } },
		contestType: "Clever",
	},
	trickortreat: {
		num: 567,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Trick-or-Treat",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onHit(target) {
			if (target.hasType('Ghost')) return false;
			if (!target.addType('Ghost')) return false;
			this.add('-start', target, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');

			if (target.side.active.length === 2 && target.position === 1) {
				// Curse Glitch
				const action = this.queue.willMove(target);
				if (action && action.move.id === 'curse') {
					action.targetLoc = -1;
				}
			}
		},
		secondary: null,
		target: "normal",
		type: "Ghost",
		zMove: { boost: { atk: 1, def: 1, spa: 1, spd: 1, spe: 1 } },
		contestType: "Cute",
	},
	trickroom: {
		num: 433,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Trick Room",
		pp: 5,
		priority: -7,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'trickroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Trick Room');
					return 7;
				}
				return 5;
			},
			onFieldStart(target, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Trick Room', `[of] ${source}`);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('trickroom');
			},
			// Speed modification is changed in Pokemon.getActionSpeed() in sim/pokemon.js
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 1,
			onFieldEnd() {
				this.add('-fieldend', 'move: Trick Room');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: { boost: { accuracy: 1 } },
		contestType: "Clever",
	},
	triplearrows: {
		num: 843,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Triple Arrows",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		critRatio: 2,
		secondaries: [
			{
				chance: 50,
				boosts: {
					def: -1,
				},
			}, {
				chance: 30,
				volatileStatus: 'flinch',
			},
		],
		target: "normal",
		type: "Fighting",
	},
	tripleaxel: {
		num: 813,
		accuracy: 90,
		basePower: 20,
		basePowerCallback(pokemon, target, move) {
			return 20 * move.hit;
		},
		category: "Physical",
		name: "Triple Axel",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Ice",
		zMove: { basePower: 120 },
		maxMove: { basePower: 140 },
	},
	tripledive: {
		num: 865,
		accuracy: 95,
		basePower: 30,
		category: "Physical",
		name: "Triple Dive",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		secondary: null,
		target: "normal",
		type: "Water",
	},
	triplekick: {
		num: 167,
		accuracy: 90,
		basePower: 10,
		basePowerCallback(pokemon, target, move) {
			return 10 * move.hit;
		},
		category: "Physical",
		name: "Triple Kick",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		multihit: 3,
		multiaccuracy: true,
		secondary: null,
		target: "normal",
		type: "Fighting",
		zMove: { basePower: 120 },
		maxMove: { basePower: 80 },
		contestType: "Cool",
	},
	tropkick: {
		num: 688,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "Trop Kick",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Grass",
		contestType: "Cute",
	},
	trumpcard: {
		num: 376,
		accuracy: true,
		basePower: 0,
		basePowerCallback(source, target, move) {
			const callerMoveId = move.sourceEffect || move.id;
			const moveSlot = callerMoveId === 'instruct' ? source.getMoveData(move.id) : source.getMoveData(callerMoveId);
			let bp;
			if (!moveSlot) {
				bp = 40;
			} else {
				switch (moveSlot.pp) {
				case 0:
					bp = 200;
					break;
				case 1:
					bp = 80;
					break;
				case 2:
					bp = 60;
					break;
				case 3:
					bp = 50;
					break;
				default:
					bp = 40;
					break;
				}
			}

			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Trump Card",
		pp: 5,
		noPPBoosts: true,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Cool",
	},
	twinbeam: {
		num: 888,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Twin Beam",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		multihit: 2,
		secondary: null,
		target: "normal",
		type: "Psychic",
		contestType: "Cool",
	},
	twineedle: {
		num: 41,
		accuracy: 100,
		basePower: 25,
		category: "Physical",
		isNonstandard: "Past",
		name: "Twineedle",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: 2,
		secondary: {
			chance: 20,
			status: 'psn',
		},
		target: "normal",
		type: "Bug",
		maxMove: { basePower: 100 },
		contestType: "Cool",
	},
	twinkletackle: {
		num: 656,
		accuracy: true,
		basePower: 1,
		category: "Physical",
		isNonstandard: "Past",
		name: "Twinkle Tackle",
		pp: 1,
		priority: 0,
		flags: {},
		isZ: "fairiumz",
		secondary: null,
		target: "normal",
		type: "Fairy",
		contestType: "Cool",
	},
	twister: {
		num: 239,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Twister",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "allAdjacentFoes",
		type: "Dragon",
		contestType: "Cool",
	},
	uturn: {
		num: 369,
		accuracy: 100,
		basePower: 70,
		category: "Physical",
		name: "U-turn",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cute",
	},
	upperhand: {
		num: 918,
		accuracy: 100,
		basePower: 65,
		category: "Physical",
		name: "Upper Hand",
		pp: 15,
		priority: 3,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onTry(source, target) {
			const action = this.queue.willMove(target);
			const move = action?.choice === 'move' ? action.move : null;
			if (!move || move.priority <= 0.1 || move.category === 'Status') {
				return false;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Fighting",
	},
	uproar: {
		num: 253,
		accuracy: 100,
		basePower: 90,
		category: "Special",
		name: "Uproar",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1, nosleeptalk: 1, failinstruct: 1 },
		self: {
			volatileStatus: 'uproar',
		},
		onTryHit(target) {
			const activeTeam = target.side.activeTeam();
			const foeActiveTeam = target.side.foe.activeTeam();
			for (const [i, allyActive] of activeTeam.entries()) {
				if (allyActive && allyActive.status === 'slp') allyActive.cureStatus();
				const foeActive = foeActiveTeam[i];
				if (foeActive && foeActive.status === 'slp') foeActive.cureStatus();
			}
		},
		condition: {
			duration: 3,
			onStart(target) {
				this.add('-start', target, 'Uproar');
			},
			onResidual(target) {
				if (target.volatiles['throatchop']) {
					target.removeVolatile('uproar');
					return;
				}
				if (target.lastMove && target.lastMove.id === 'struggle') {
					// don't lock
					delete target.volatiles['uproar'];
				}
				this.add('-start', target, 'Uproar', '[upkeep]');
			},
			onResidualOrder: 28,
			onResidualSubOrder: 1,
			onEnd(target) {
				this.add('-end', target, 'Uproar');
			},
			onLockMove: 'uproar',
			onAnySetStatus(status, pokemon) {
				if (status.id === 'slp') {
					if (pokemon === this.effectState.target) {
						this.add('-fail', pokemon, 'slp', '[from] Uproar', '[msg]');
					} else {
						this.add('-fail', pokemon, 'slp', '[from] Uproar');
					}
					return null;
				}
			},
		},
		secondary: null,
		target: "randomNormal",
		type: "Normal",
		contestType: "Cute",
	},
	vacuumwave: {
		num: 410,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Vacuum Wave",
		pp: 30,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	vcreate: {
		num: 557,
		accuracy: 95,
		basePower: 180,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "V-create",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		self: {
			boosts: {
				spe: -1,
				def: -1,
				spd: -1,
			},
		},
		secondary: null,
		target: "normal",
		type: "Fire",
		zMove: { basePower: 220 },
		contestType: "Cool",
	},
	veeveevolley: {
		num: 741,
		accuracy: true,
		basePower: 0,
		basePowerCallback(pokemon) {
			const bp = Math.floor((pokemon.happiness * 10) / 25) || 1;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Physical",
		isNonstandard: "LGPE",
		name: "Veevee Volley",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Cute",
	},
	venomdrench: {
		num: 599,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Venom Drench",
		pp: 20,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		onHit(target, source, move) {
			if (target.status === 'psn' || target.status === 'tox') {
				return !!this.boost({ atk: -1, spa: -1, spe: -1 }, target, source, move);
			}
			return false;
		},
		secondary: null,
		target: "allAdjacentFoes",
		type: "Poison",
		zMove: { boost: { def: 1 } },
		contestType: "Clever",
	},
	venoshock: {
		num: 474,
		accuracy: 100,
		basePower: 65,
		category: "Special",
		name: "Venoshock",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onBasePower(basePower, pokemon, target) {
			if (target.status === 'psn' || target.status === 'tox') {
				return this.chainModify(2);
			}
		},
		secondary: null,
		target: "normal",
		type: "Poison",
		contestType: "Beautiful",
	},
	victorydance: {
		num: 837,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Victory Dance",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, dance: 1, metronome: 1 },
		boosts: {
			atk: 1,
			def: 1,
			spe: 1,
		},
		secondary: null,
		target: "self",
		type: "Fighting",
	},
	vinewhip: {
		num: 22,
		accuracy: 100,
		basePower: 45,
		category: "Physical",
		name: "Vine Whip",
		pp: 25,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Cool",
	},
	visegrip: {
		num: 11,
		accuracy: 100,
		basePower: 55,
		category: "Physical",
		name: "Vise Grip",
		pp: 30,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	vitalthrow: {
		num: 233,
		accuracy: true,
		basePower: 70,
		category: "Physical",
		isNonstandard: "Past",
		name: "Vital Throw",
		pp: 10,
		priority: -1,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Cool",
	},
	voltswitch: {
		num: 521,
		accuracy: 100,
		basePower: 70,
		category: "Special",
		name: "Volt Switch",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		selfSwitch: true,
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	volttackle: {
		num: 344,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Volt Tackle",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: {
			chance: 10,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	wakeupslap: {
		num: 358,
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			if (target.status === 'slp' || target.hasAbility('comatose')) {
				this.debug('BP doubled on sleeping target');
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		isNonstandard: "Past",
		name: "Wake-Up Slap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		onHit(target) {
			if (target.status === 'slp') target.cureStatus();
		},
		secondary: null,
		target: "normal",
		type: "Fighting",
		contestType: "Tough",
	},
	waterfall: {
		num: 127,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Waterfall",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Water",
		contestType: "Tough",
	},
	watergun: {
		num: 55,
		accuracy: 100,
		basePower: 40,
		category: "Special",
		name: "Water Gun",
		pp: 25,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cute",
	},
	waterpledge: {
		num: 518,
		accuracy: 100,
		basePower: 80,
		basePowerCallback(target, source, move) {
			if (['firepledge', 'grasspledge'].includes(move.sourceEffect)) {
				this.add('-combine');
				return 150;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Water Pledge",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, nonsky: 1, metronome: 1, pledgecombo: 1 },
		onPrepareHit(target, source, move) {
			for (const action of this.queue) {
				if (action.choice !== 'move') continue;
				const otherMove = action.move;
				const otherMoveUser = action.pokemon;
				if (
					!otherMove || !action.pokemon || !otherMoveUser.isActive ||
					otherMoveUser.fainted || action.maxMove || action.zmove
				) {
					continue;
				}
				if (otherMoveUser.isAlly(source) && ['firepledge', 'grasspledge'].includes(otherMove.id)) {
					this.queue.prioritizeAction(action, move);
					this.add('-waiting', source, otherMoveUser);
					return null;
				}
			}
		},
		onModifyMove(move) {
			if (move.sourceEffect === 'grasspledge') {
				move.type = 'Grass';
				move.forceSTAB = true;
				move.sideCondition = 'grasspledge';
			}
			if (move.sourceEffect === 'firepledge') {
				move.type = 'Water';
				move.forceSTAB = true;
				move.self = { sideCondition: 'waterpledge' };
			}
		},
		condition: {
			duration: 4,
			onSideStart(targetSide) {
				this.add('-sidestart', targetSide, 'Water Pledge');
			},
			onSideResidualOrder: 26,
			onSideResidualSubOrder: 7,
			onSideEnd(targetSide) {
				this.add('-sideend', targetSide, 'Water Pledge');
			},
			onModifyMove(move, pokemon) {
				if (move.secondaries && move.id !== 'secretpower') {
					this.debug('doubling secondary chance');
					for (const secondary of move.secondaries) {
						if (pokemon.hasAbility('serenegrace') && secondary.volatileStatus === 'flinch') continue;
						if (secondary.chance) secondary.chance *= 2;
					}
					if (move.self?.chance) move.self.chance *= 2;
				}
			},
		},
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	waterpulse: {
		num: 352,
		accuracy: 100,
		basePower: 60,
		category: "Special",
		name: "Water Pulse",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, distance: 1, metronome: 1, pulse: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'confusion',
		},
		target: "any",
		type: "Water",
		contestType: "Beautiful",
	},
	watershuriken: {
		num: 594,
		accuracy: 100,
		basePower: 15,
		basePowerCallback(pokemon, target, move) {
			if (pokemon.species.name === 'Greninja-Ash' && pokemon.hasAbility('battlebond') &&
				!pokemon.transformed) {
				return move.basePower + 5;
			}
			return move.basePower;
		},
		category: "Special",
		name: "Water Shuriken",
		pp: 20,
		priority: 1,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		multihit: [2, 5],
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Cool",
	},
	watersport: {
		num: 346,
		accuracy: true,
		basePower: 0,
		category: "Status",
		isNonstandard: "Past",
		name: "Water Sport",
		pp: 15,
		priority: 0,
		flags: { nonsky: 1, metronome: 1 },
		pseudoWeather: 'watersport',
		condition: {
			duration: 5,
			onFieldStart(field, source) {
				this.add('-fieldstart', 'move: Water Sport', `[of] ${source}`);
			},
			onBasePowerPriority: 1,
			onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Fire') {
					this.debug('water sport weaken');
					return this.chainModify([1352, 4096]);
				}
			},
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 3,
			onFieldEnd() {
				this.add('-fieldend', 'move: Water Sport');
			},
		},
		secondary: null,
		target: "all",
		type: "Water",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	waterspout: {
		num: 323,
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		category: "Special",
		name: "Water Spout",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Water",
		contestType: "Beautiful",
	},
	wavecrash: {
		num: 834,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Wave Crash",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Water",
	},
	weatherball: {
		num: 311,
		accuracy: 100,
		basePower: 50,
		category: "Special",
		name: "Weather Ball",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		onModifyType(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.type = 'Fire';
				break;
			case 'raindance':
			case 'primordialsea':
				move.type = 'Water';
				break;
			case 'sandstorm':
				move.type = 'Rock';
				break;
			case 'hail':
			case 'snowscape':
				move.type = 'Ice';
				break;
			}
		},
		onModifyMove(move, pokemon) {
			switch (pokemon.effectiveWeather()) {
			case 'sunnyday':
			case 'desolateland':
				move.basePower *= 2;
				break;
			case 'raindance':
			case 'primordialsea':
				move.basePower *= 2;
				break;
			case 'sandstorm':
				move.basePower *= 2;
				break;
			case 'hail':
			case 'snowscape':
				move.basePower *= 2;
				break;
			}
			this.debug(`BP: ${move.basePower}`);
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 160 },
		maxMove: { basePower: 130 },
		contestType: "Beautiful",
	},
	whirlpool: {
		num: 250,
		accuracy: 85,
		basePower: 35,
		category: "Special",
		name: "Whirlpool",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Water",
		contestType: "Beautiful",
	},
	whirlwind: {
		num: 18,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Whirlwind",
		pp: 20,
		priority: -6,
		flags: { reflectable: 1, mirror: 1, bypasssub: 1, allyanim: 1, metronome: 1, noassist: 1, failcopycat: 1, wind: 1 },
		forceSwitch: true,
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	wickedblow: {
		num: 817,
		accuracy: 100,
		basePower: 75,
		category: "Physical",
		name: "Wicked Blow",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, punch: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Dark",
	},
	wickedtorque: {
		num: 897,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: "Unobtainable",
		name: "Wicked Torque",
		pp: 10,
		priority: 0,
		flags: {
			protect: 1, failencore: 1, failmefirst: 1, nosleeptalk: 1, noassist: 1,
			failcopycat: 1, failmimic: 1, failinstruct: 1, nosketch: 1,
		},
		secondary: {
			chance: 10,
			status: 'slp',
		},
		target: "normal",
		type: "Dark",
	},
	wideguard: {
		num: 469,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Wide Guard",
		pp: 10,
		priority: 3,
		flags: { snatch: 1 },
		sideCondition: 'wideguard',
		onTry() {
			return !!this.queue.willAct();
		},
		onHitSide(side, source) {
			source.addVolatile('stall');
		},
		condition: {
			duration: 1,
			onSideStart(target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
			onTryHit(target, source, move) {
				// Wide Guard blocks all spread moves
				if (move?.target !== 'allAdjacent' && move.target !== 'allAdjacentFoes') {
					return;
				}
				if (move.isZ || move.isMax) {
					if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
					target.getMoveHitData(move).zBrokeProtect = true;
					return;
				}
				this.add('-activate', target, 'move: Wide Guard');
				const lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return this.NOT_FAIL;
			},
		},
		secondary: null,
		target: "allySide",
		type: "Rock",
		zMove: { boost: { def: 1 } },
		contestType: "Tough",
	},
	wildboltstorm: {
		num: 847,
		accuracy: 80,
		basePower: 100,
		category: "Special",
		name: "Wildbolt Storm",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, wind: 1 },
		onModifyMove(move, pokemon, target) {
			if (target && ['raindance', 'primordialsea'].includes(target.effectiveWeather())) {
				move.accuracy = true;
			}
		},
		secondary: {
			chance: 20,
			status: 'par',
		},
		target: "allAdjacentFoes",
		type: "Electric",
	},
	wildcharge: {
		num: 528,
		accuracy: 100,
		basePower: 90,
		category: "Physical",
		name: "Wild Charge",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [1, 4],
		secondary: null,
		target: "normal",
		type: "Electric",
		contestType: "Tough",
	},
	willowisp: {
		num: 261,
		accuracy: 85,
		basePower: 0,
		category: "Status",
		name: "Will-O-Wisp",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		status: 'brn',
		secondary: null,
		target: "normal",
		type: "Fire",
		zMove: { boost: { atk: 1 } },
		contestType: "Beautiful",
	},
	wingattack: {
		num: 17,
		accuracy: 100,
		basePower: 60,
		category: "Physical",
		name: "Wing Attack",
		pp: 35,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, distance: 1, metronome: 1 },
		secondary: null,
		target: "any",
		type: "Flying",
		contestType: "Cool",
	},
	wish: {
		num: 273,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Wish",
		pp: 10,
		priority: 0,
		flags: { snatch: 1, heal: 1, metronome: 1 },
		slotCondition: 'Wish',
		condition: {
			onStart(pokemon, source) {
				this.effectState.hp = source.maxhp / 2;
				this.effectState.startingTurn = this.getOverflowedTurnCount();
				if (this.effectState.startingTurn === 255) {
					this.hint(`In Gen 8+, Wish will never resolve when used on the ${this.turn}th turn.`);
				}
			},
			onResidualOrder: 4,
			onResidual(target: Pokemon) {
				if (this.getOverflowedTurnCount() <= this.effectState.startingTurn) return;
				target.side.removeSlotCondition(this.getAtSlot(this.effectState.sourceSlot), 'wish');
			},
			onEnd(target) {
				if (target && !target.fainted) {
					const damage = this.heal(this.effectState.hp, target, target);
					if (damage) {
						this.add('-heal', target, target.getHealth, '[from] move: Wish', '[wisher] ' + this.effectState.source.name);
					}
				}
			},
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { spd: 1 } },
		contestType: "Cute",
	},
	withdraw: {
		num: 110,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Withdraw",
		pp: 40,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			def: 1,
		},
		secondary: null,
		target: "self",
		type: "Water",
		zMove: { boost: { def: 1 } },
		contestType: "Cute",
	},
	wonderroom: {
		num: 472,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Wonder Room",
		pp: 10,
		priority: 0,
		flags: { mirror: 1, metronome: 1 },
		pseudoWeather: 'wonderroom',
		condition: {
			duration: 5,
			durationCallback(source, effect) {
				if (source?.hasAbility('persistent')) {
					this.add('-activate', source, 'ability: Persistent', '[move] Wonder Room');
					return 7;
				}
				return 5;
			},
			onModifyMove(move, source, target) {
				// This code is for moves that use defensive stats as the attacking stat; see below for most of the implementation
				if (!move.overrideOffensiveStat) return;
				const statAndBoosts = move.overrideOffensiveStat;
				if (!['def', 'spd'].includes(statAndBoosts)) return;
				move.overrideOffensiveStat = statAndBoosts === 'def' ? 'spd' : 'def';
				this.hint(`${move.name} uses ${statAndBoosts === 'def' ? '' : 'Sp. '}Def boosts when Wonder Room is active.`);
			},
			onFieldStart(field, source) {
				if (source?.hasAbility('persistent')) {
					this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`, '[persistent]');
				} else {
					this.add('-fieldstart', 'move: Wonder Room', `[of] ${source}`);
				}
			},
			onFieldRestart(target, source) {
				this.field.removePseudoWeather('wonderroom');
			},
			// Swapping defenses partially implemented in sim/pokemon.js:Pokemon#calculateStat and Pokemon#getStat
			onFieldResidualOrder: 27,
			onFieldResidualSubOrder: 5,
			onFieldEnd() {
				this.add('-fieldend', 'move: Wonder Room');
			},
		},
		secondary: null,
		target: "all",
		type: "Psychic",
		zMove: { boost: { spd: 1 } },
		contestType: "Clever",
	},
	woodhammer: {
		num: 452,
		accuracy: 100,
		basePower: 120,
		category: "Physical",
		name: "Wood Hammer",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		recoil: [33, 100],
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Tough",
	},
	workup: {
		num: 526,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Work Up",
		pp: 30,
		priority: 0,
		flags: { snatch: 1, metronome: 1 },
		boosts: {
			atk: 1,
			spa: 1,
		},
		secondary: null,
		target: "self",
		type: "Normal",
		zMove: { boost: { atk: 1 } },
		contestType: "Tough",
	},
	worryseed: {
		num: 388,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Worry Seed",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryImmunity(target) {
			// Truant and Insomnia have special treatment; they fail before
			// checking accuracy and will double Stomping Tantrum's BP
			if (target.ability === 'truant' || target.ability === 'insomnia') {
				return false;
			}
		},
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress']) {
				return false;
			}
		},
		onHit(target, source) {
			const oldAbility = target.setAbility('insomnia');
			if (!oldAbility) return oldAbility as false | null;
			if (target.status === 'slp') target.cureStatus();
		},
		secondary: null,
		target: "normal",
		type: "Grass",
		zMove: { boost: { spe: 1 } },
		contestType: "Clever",
	},
	wrap: {
		num: 35,
		accuracy: 90,
		basePower: 15,
		category: "Physical",
		name: "Wrap",
		pp: 20,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'partiallytrapped',
		secondary: null,
		target: "normal",
		type: "Normal",
		contestType: "Tough",
	},
	wringout: {
		num: 378,
		accuracy: 100,
		basePower: 0,
		basePowerCallback(pokemon, target, move) {
			const hp = target.hp;
			const maxHP = target.maxhp;
			const bp = Math.floor(Math.floor((120 * (100 * Math.floor(hp * 4096 / maxHP)) + 2048 - 1) / 4096) / 100) || 1;
			this.debug(`BP for ${hp}/${maxHP} HP: ${bp}`);
			return bp;
		},
		category: "Special",
		isNonstandard: "Past",
		name: "Wring Out",
		pp: 5,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { basePower: 190 },
		maxMove: { basePower: 140 },
		contestType: "Tough",
	},
	xscissor: {
		num: 404,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "X-Scissor",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		secondary: null,
		target: "normal",
		type: "Bug",
		contestType: "Cool",
	},
	yawn: {
		num: 281,
		accuracy: true,
		basePower: 0,
		category: "Status",
		name: "Yawn",
		pp: 10,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
		volatileStatus: 'yawn',
		onTryHit(target) {
			if (target.status || !target.runStatusImmunity('slp')) {
				return false;
			}
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			duration: 2,
			onStart(target, source) {
				this.add('-start', target, 'move: Yawn', `[of] ${source}`);
			},
			onResidualOrder: 23,
			onEnd(target) {
				this.add('-end', target, 'move: Yawn', '[silent]');
				target.trySetStatus('slp', this.effectState.source);
			},
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spe: 1 } },
		contestType: "Cute",
	},
	zapcannon: {
		num: 192,
		accuracy: 50,
		basePower: 120,
		category: "Special",
		name: "Zap Cannon",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bullet: 1 },
		secondary: {
			chance: 100,
			status: 'par',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	zenheadbutt: {
		num: 428,
		accuracy: 90,
		basePower: 80,
		category: "Physical",
		name: "Zen Headbutt",
		pp: 15,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 20,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Psychic",
		contestType: "Clever",
	},
	zingzap: {
		num: 716,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		name: "Zing Zap",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: {
			chance: 30,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},
	zippyzap: {
		num: 729,
		accuracy: 100,
		basePower: 80,
		category: "Physical",
		isNonstandard: "LGPE",
		name: "Zippy Zap",
		pp: 10,
		priority: 2,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 100,
			self: {
				boosts: {
					evasion: 1,
				},
			},
		},
		target: "normal",
		type: "Electric",
		contestType: "Cool",
	},

	// CAP moves

	paleowave: {
		num: -1,
		accuracy: 100,
		basePower: 85,
		category: "Special",
		isNonstandard: "CAP",
		name: "Paleo Wave",
		pp: 15,
		priority: 0,
		flags: { protect: 1, mirror: 1 },
		secondary: {
			chance: 20,
			boosts: {
				atk: -1,
			},
		},
		target: "normal",
		type: "Rock",
		contestType: "Beautiful",
	},
	shadowstrike: {
		num: -2,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		isNonstandard: "CAP",
		name: "Shadow Strike",
		pp: 10,
		priority: 0,
		flags: { contact: 1, protect: 1, mirror: 1 },
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		target: "normal",
		type: "Ghost",
		contestType: "Clever",
	},
	polarflare: {
		num: -3,
		accuracy: 100,
		basePower: 75,
		category: "Special",
		isNonstandard: "CAP",
		name: "Polar Flare",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, defrost: 1, nosketch: 1 },
		secondary: {
			chance: 10,
			status: 'frz',
		},
		onHit(target, pokemon, move) {
			if (pokemon.baseSpecies.baseSpecies === 'Ramnarok' && !pokemon.transformed) {
				move.willChangeForme = true;
			}
		},
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.willChangeForme) {
				const forme = pokemon.species.id === 'ramnarokradiant' ? '' : '-Radiant';
				pokemon.formeChange('Ramnarok' + forme, this.effect, false, '0', '[msg]');
			}
		},
		target: "allAdjacentFoes",
		type: "Fire",
		contestType: "Beautiful",
	},
	randomhazards: {
  	accuracy: true,
  	basePower: 0,
  	category: "Status",
  	name: "Random Hazards",
	shortDesc: "Sets a random amount of hazards on both sides",
  	pp: 1,
	noPPBoosts: true,
  	priority: 0,
  	target: "all",        // like Trick Room; we handle both sides ourselves
  	type: "Normal",
	flags: { reflectable: 1 }, // optional; omit if you don't want Magic Bounce shenanigans
  onHitField(source) {
    const hazards = ['spikes','toxicspikes','stealthrock','stickyweb'];
    for (const side of [source.side, source.side.foe]) {
      for (const h of hazards) {
        let max = 1;
        if (h === 'spikes') max = 3;
        if (h === 'toxicspikes') max = 2;
        const layers = this.random(max + 1); // 0..max
        for (let i = 0; i < layers; i++) {
          side.addSideCondition(h, source);
        }
      }
    }
  },
},
retaliationscreen: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Retaliation Screen",
  shortDesc: "For 5 turns (8 with Light Clay), reflects 25% of damage taken by allies to the attacker.",
  pp: 10,
  priority: 0,
  flags: { snatch: 1 },
  sideCondition: 'retaliationscreen',
  target: "allySide",
  type: "Psychic",

  // Put all effect logic inside `condition`
  condition: {
    name: 'Retaliation Screen',
    duration: 5,
    durationCallback(target, source) {
      // Gen 8+ screens: Light Clay -> 8 turns
      if (source?.hasItem('lightclay')) return 8;
      return 5;
    },

    onSideStart(side, source) {
      this.add('-sidestart', side, 'Retaliation Screen', '[of] ' + source);
      // store config/state we need later
      this.effectState.portion = 0.25;   // 25% reflected
      this.effectState.side = side;      // remember which side is protected
    },

    // fire after any damaging hit; we filter to hits against our protected side
    onAnyDamagingHit(damage, target, source, move) {
      if (!damage || !move || !source || source.fainted) return;

      const protectedSide = (this.effectState as any).side;
      if (!protectedSide) return;

      const targetOnProtectedSide = !!target?.side && target.side === protectedSide;
      const sourceIsOpponent = !!source?.side && source.side !== protectedSide;
      if (!targetOnProtectedSide || !sourceIsOpponent) return;

      // (optional) only reflect contact hits:
      // if (!move.flags?.contact) return;

      const portion = (this.effectState as any).portion ?? 0.25;
      const reflected = Math.max(1, this.clampIntRange(Math.floor(damage * portion), 1));

      // deal damage to the attacker; tag the effect for logs
      this.damage(reflected, source, target, this.effect);
      this.add('-message', `${source.name} was hurt by Retaliation Screen!`);
    },

    onSideEnd(side) {
      this.add('-sideend', side, 'Retaliation Screen');
    },
  },
},
punchingbag: {
	accuracy: 90,
	pp: 5,
	name: "Punching Bag",
	shortDesc: "Hits 5-10 times. High Crit Ratio",
	priority: 0,
	basePower: 15,
	category: "Physical",
	flags: { protect: 1, mirror: 1, metronome: 1, contact: 1, punch: 1 },
	multihit: [5, 10],
	critRatio: 2,
	secondary: null,
	target: "normal",
	type: "Fighting",
},
superpunch: {
	accuracy: true,
	basePower: 50,
	pp: 5,
	name:"Super Punch",
	shortDesc: "Always super effective",
	priority: 0,
	category: "Physical",
	flags: {protect: 1, mirror: 1, metronome: 1, contact: 1, punch: 1},
	ignoreImmunity: true,
	onEffectiveness(typeMod, target, type) {
		return 1;
	},
	secondary: null,
	target: "normal",
	type: "Normal",
},
insectpunch: {
	accuracy: 100,
	basePower: 80,
	pp: 8,
	name: "Insect Punch",
	shortDesc: "Combines Bug and Fighting effectiveness",
	priority: 0,
	category: "Physical",
	flags: {metronome: 1, protect: 1, contact: 1, punch: 1},
	onEffectiveness(typeMod, target, type, move) {
		return typeMod + this.dex.getEffectiveness('Fighting', type);
	},
	secondary: null,
	target: "normal",
	type: "Bug"
},
vampiricbite: {
	accuracy: 100,
	basePower: 65,
	pp: 15,
	name: "Vampiric Bite",
	shortDesc: "Biting move that heals on KO, 10% flinch chance",
	category: "Physical",
	priority: 0,
	flags: {contact: 1, protect: 1, mirror: 1, bite: 1, metronome: 1},
	onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.heal(pokemon.baseMaxhp / 4, pokemon, pokemon, move);
			this.add('-message', `${pokemon.name} restored some HP from its finishing blow!`);
		},
	secondary: {
			chance: 10,
			volatileStatus: 'flinch'
	},
	target: "normal",
	type: "Dark"
},
wingsofthefae: {
	accuracy: 100,
	basePower: 40,
	pp: 10,
	name: "Wings of the Fae",
	shortDesc: "Multi-hit move. 30% chance to confuse each hit",
	priority: 0,
	multihit: 2,
	category: "Special",
	flags: {protect: 1, metronome: 1},
	secondary: {
		chance: 30,
		volatileStatus: 'confusion'
	},
	target: "normal",
	type: "Fairy",
	},
ironshackles: {
  accuracy: 100,
  basePower: 0,
  category: "Status",
  name: "Iron Shackles",
  pp: 10,
  priority: 0,
  flags: { protect: 1, mirror: 1, metronome: 1},
  volatileStatus: 'ironshackles',
  condition: {
  name: 'Iron Shackles',
  duration: 5,

  onStart(target, source, effect) {
    this.add('-start', target, 'Iron Shackles');
    // --- RANDOM TYPE CHANGE ---
    // Save original typing so we can restore on end
    this.effectState.originalTypes = target.getTypes();

    // Choose a random single type (exclude special/odd types)
    const pool = this.dex.types.names().filter(t =>
      t !== '???' && t !== 'Stellar' // omit if you don't use Stellar
    );
    const newType = this.sample(pool);

    // Skip if Tera or unchangeable (Multitype/RKS System). setType() returns false if it can't change.
    if (!target.terastallized && target.setType(newType)) {
      // Show the standard "type change" message
      this.add('-start', target, 'typechange', newType, '[from] move: Iron Shackles');
      this.effectState.newType = newType; // remember what we applied
    }
  },

  // Trap logic (unchanged)
  onTrapPokemon(pokemon) {
    pokemon.tryTrap();
  },
  onMaybeTrapPokemon(pokemon) {
    pokemon.maybeTrapped = true;
  },
  // Optional: block phazing
  // onDragOut(pokemon) {
  //   this.add('-activate', pokemon, 'move: Iron Shackles');
  //   return false;
  // },

  // If you want reuses to refresh duration AND reroll the type:
  onRestart(target, source, effect) {
    // Re-roll a new type each time it’s applied again
    const pool = this.dex.types.names().filter(t => t !== '???' && t !== 'Stellar');
    const newType = this.sample(pool);
    if (!target.terastallized && target.setType(newType)) {
      this.add('-start', target, 'typechange', newType, '[from] move: Iron Shackles');
      this.effectState.newType = newType;
    }
    // duration refresh is automatic for volatiles
  },

  onEnd(target) {
    this.add('-end', target, 'Iron Shackles');

    // Restore original typing (if we actually changed it)
    const orig = this.effectState.originalTypes as string[] | undefined;
    if (orig && !target.fainted && !target.terastallized) {
      // If they Tera’d after we applied this, we leave it alone (like Soak behavior).
      target.setType(orig);
      this.add('-end', target, 'typechange', '[from] Iron Shackles');
    }
  },
},

  target: "normal",
  type: "Steel",
  shortDesc: "Traps the target for 5 turns. Persists even if the user switches.",
},

benchsnipe: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Bench Snipe",
  shortDesc: "Does nothing to the active. Each benched foe has a 10% chance to faint.",
  pp: 5,
  priority: 0,
  type: "Dark",              // any type; its a status move
  target: "all",             // use a field handler so Protect doesnt block it
  flags: { metronome: 1                 // keep it simple; add mirror/reflectable if you want
    // mirror: 1,           // uncomment if you want Magic Coat/Magic Bounce to reflect it
  },

  // Runs regardless of Protect/Detect on the fielded mons
  onHitField(source, move) {
    // In standard Singles/Doubles theres one opposing side:
    const foeSide = source.side.foe;

    for (const mon of foeSide.pokemon) {
      if (!mon || mon.fainted) continue;

      // Skip currently active foes (benched only)
      // Works for Singles and Doubles (foeSide.active can have 1 or 2 mons)
      if (foeSide.active.includes(mon)) continue;

      // 10% chance per benched Pokmon to OHKO
      if (this.randomChance(1, 10)) {
        // Faint the benched Pokmon; client will mark it fainted in the team panel
        this.add('-message', `${mon.name} was sniped from the bench!`);
        mon.faint(source, move as unknown as Effect); // or: this.faint(mon, source, move);
      }
    }
  },
},
solarburst: {
  name: "Solar Burst",
  shortDesc: "Usually moves first.",
  type: "Fire",
  category: "Special",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {protect: 1, mirror: 1},
  target: "normal",
},

instashock: {
  name: "Insta-Shock",
  shortDesc: "Usually moves first.",
  type: "Electric",
  category: "Special",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {protect: 1, mirror: 1},
  target: "normal",
},

foresightblast: {
  name: "Foresight Blast",
  shortDesc: "Usually moves first.",
  type: "Psychic",
  category: "Special",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {protect: 1, mirror: 1},
  target: "normal",
},

terracharge: {
  name: "Terra Charge",
  shortDesc: "Usually moves first.",
  type: "Ground",
  category: "Physical",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {contact: 1, protect: 1, mirror: 1},
  target: "normal",
},

venomlash: {
  name: "Venom Lash",
  shortDesc: "Usually moves first.",
  type: "Poison",
  category: "Physical",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {contact: 1, protect: 1, mirror: 1},
  target: "normal",
},

galebeak: {
  name: "Gale Beak",
  shortDesc: "Usually moves first.",
  type: "Flying",
  category: "Physical",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {contact: 1, protect: 1, mirror: 1},
  target: "normal",
},

dracopunch: {
  name: "Draco Punch",
  shortDesc: "Usually moves first.",
  type: "Dragon",
  category: "Physical",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {contact: 1, protect: 1, mirror: 1, punch: 1},
  target: "normal",
},

glimmerrush: {
  name: "Glimmer Rush",
  shortDesc: "Usually moves first.",
  type: "Fairy",
  category: "Special",
  basePower: 40,
  accuracy: 100,
  pp: 30,
  priority: 1,
  flags: {protect: 1, mirror: 1},
  target: "normal",
},
grassattack: {
	name: "Grass Attack",
    type: "Grass",
    category: "Physical",
    basePower: 40,
    accuracy: 100,
    pp: 10,
    priority: 1,
    flags: {contact: 1, protect: 1, mirror: 1},
    target: "normal",
    
    // This is the correct way to apply a volatile status.
    // It's a method that fires after the move hits.
    onHit(target, source) {
        target.addVolatile('twinvines', source);
    },
    
    // Use shortDesc for a description of the move.
    shortDesc: "A priority move that applies a negative priority end-of-turn attack.",
},
mirage: {
  name: "Mirage",
  shortDesc: "Self: Disguises as a random healthy ally; copies its typing & gains Wonder Guard for 3 turns.",
  type: "Rock",
  category: "Status",
  accuracy: true,
  basePower: 0,
  pp: 5,
  priority: 0,
  target: "self",
  flags: {snatch: 1, mirror: 1},
  volatileStatus: 'mirage',   // <- engine will attach this AFTER a successful hit

  // Keep the move body empty; all work happens in the volatile below.
  // (Optional) prevent re-use while active
  onTryHit(pokemon) {
    if (pokemon.volatiles['mirage']) return false;
  },

  condition: {
    duration: 3,

    // Run once, right when the volatile is applied
    onStart(pokemon) {
      // pick a random healthy teammate
      const pool = pokemon.side.pokemon.filter(p => !p.fainted && p !== pokemon);
      if (!pool.length) {
        // if somehow no ally, immediately end the effect
        pokemon.removeVolatile('mirage');
        return;
      }
      const disguise = this.sample(pool);

      // stash originals on this.effectState (the correct place to keep state)
      (this.effectState as any).originalAbility = pokemon.getAbility().id;
      (this.effectState as any).originalTypes = pokemon.getTypes();
      (this.effectState as any).disguiseId = disguise.species.id;

      // visual Illusion (client reads pokemon.illusion)
      if (!pokemon.illusion) (pokemon as any).illusion = disguise;

      // adopt the disguise's current effective types
      const newTypes = disguise.getTypes(true);
      if (pokemon.setType(newTypes, true)) {
        this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] move: Mirage');
      }

      // temporary Wonder Guard
      pokemon.setAbility('wonderguard');

      this.add('-message', `${pokemon.name} cast a Mirage, taking on ${disguise.name}'s form!`);
    },

    onEnd(pokemon) {
      const v = this.effectState as any;

      // revert ability
      if (v.originalAbility) pokemon.setAbility(v.originalAbility);

      // revert types
      if (v.originalTypes && pokemon.setType(v.originalTypes, true)) {
        this.add('-end', pokemon, 'Mirage');
        this.add('-start', pokemon, 'typechange', v.originalTypes.join('/'), '[silent]');
      }

      // clear the illusion visual
      if (pokemon.illusion) {
        pokemon.removeVolatile('illusion'); // pops the disguise on client
      }
    },
  },
},

darkterrain: {
  name: "Dark Terrain",
  shortDesc: "For 5 turns (8 with Terrain Extender), grounded Pokémon's moves are 0.7× accurate.",
  type: "Dark",
  category: "Status",
  basePower: 0,
  accuracy: true,
  pp: 10,
  priority: 0,
  flags: {nonsky: 1, mirror: 1, protect: 1, metronome: 1},
  terrain: 'darkterrain',
  // Prevent re-use while the same terrain is already up (optional)
  onTryHit(target, source, move) {
    if (source.side.battle.field.isTerrain('darkterrain')) return false;
  },
  target: "all",
},
lazylazer: {
		num: 493,
		accuracy: 100,
		basePower: 0,
		category: "Status",
		name: "Lazy Lazer",
		shortDesc: "Sets target's ability to Truant",
		pp: 15,
		priority: 0,
		flags: { protect: 1, reflectable: 1, mirror: 1, allyanim: 1, metronome: 1 },
		onTryHit(target) {
			if (target.getAbility().flags['cantsuppress'] || target.ability === 'truant') {
				return false;
			}
		},
		onHit(target, source) {
			const oldAbility = target.setAbility('truant');
			if (!oldAbility) return oldAbility as false | null;
		},
		secondary: null,
		target: "normal",
		type: "Normal",
		zMove: { boost: { spa: 1 } },
		contestType: "Cute",
	},
// in moves.ts
gasoline: {
  name: "Gasoline",
  basePower: 0,
  shortDesc: "Sets Gasoline on the foe's side. Stacks up to 3 layers.",
  category: "Status",
  type: "Fire",
  pp: 20,
  priority: 0,
  accuracy: true,
  target: 'foeSide',
  flags: { reflectable: 1, nonsky: 1 },

  onTryHitSide(rawTarget, source) {
    // Be defensive: Short Circuit / other effects might route us a Pokemon.
    const side: Side | undefined =
      (rawTarget && (rawTarget as any).getSideCondition) ? (rawTarget as unknown as Side) :
      (rawTarget && (rawTarget as any).side && (rawTarget as any).side.getSideCondition) ? (rawTarget as any).side :
      (source ? source.side.foe : undefined);

    if (!side) return; // nothing we can do

    if (side.getSideCondition('burningfield')) {
      // 50/50 coin flip
      if (this.randomChance(1, 2)) {
        // SUCCESS PATH: spread Burning Field to the user's side instead
        if (!source.side.getSideCondition('burningfield')) {
          source.side.addSideCondition('burningfield', source);
        }
        // Cancel normal Gasoline application this turn
        return false;
      } else {
        this.add('-fail', source, 'move: Gasoline');
        return false;
      }
    }
  },

  sideCondition: 'gasoline',

  condition: {
    onSideStart(side, source) {
      this.effectState.layers = 1;
      this.add('-sidestart', side, 'Gasoline', '[from] move: Gasoline', '[of] ' + source);
    },
    onSideRestart(side, source) {
      if ((this.effectState.layers ?? 0) < 3) {
        this.effectState.layers++;
        this.add('-sidestart', side, 'Gasoline', '[up to]', this.effectState.layers, '[from] move: Gasoline', '[of] ' + source);
      } else {
        this.add('-fail', source, 'move: Gasoline');
        return false;
      }
    },

    // Auto-ignite when a Fire damaging move hits a mon on this side
    onDamagingHit(damage, target, source, move) {
      if (!damage) return;
      if (!move || move.category === 'Status') return;
      if (move.type !== 'Fire') return;

      const layers = this.effectState.layers || 0;
      if (!layers) return;

      // 2) DEBUG: prove we got here and what we’ll do
  this.add('-message', `Gasoline DETONATES (${layers} layer${layers > 1 ? 's' : ''}) on ${target.side.name}!`);

  // 3) Tell the client to clear the sprites, then actually remove the side condition.
  //    (removeSideCondition will normally send -sideend, but we send it explicitly
  //     as well to be unambiguous in logs and ordering.)
  this.add('-sideend', target.side, 'Gasoline');          // <-- explicit client cue
  target.side.removeSideCondition('gasoline' as ID);      // <-- removes server state

      const igniteBlast = this.dex.getActiveMove({
        id: 'igniteblast',
        name: 'Ignite Blast',
        type: 'Fire',
        category: 'Special',
        basePower: 40 * layers,
      } as any);

      const extra = this.actions.getDamage(source, target, igniteBlast);
      if (typeof extra === 'number' && extra > 0) {
        this.damage(extra, target, source, igniteBlast);
      }

      if (!target.side.getSideCondition('burningfield')) {
        target.side.addSideCondition('burningfield', source);
      }
      this.add('-message', `The gasoline ignites! The field is burning!`);
    },
  },
},

callforaid: {
  name: "Call for Aid",
  shortDesc:
    "Replaces the user with a random fully-evolved Pokémon. First use 100% HP, second 75%, third 50% (fails after that). New mon gets 3 learnset moves (guaranteed STABs) + this move.",
  type: "Normal",
  basePower: 0,
  category: "Status",
  accuracy: true,
  pp: 5,
  priority: 0,
  target: "self",
  flags: {protect: 1},

  // Block after 3 successful uses by this same Pokémon object
  onTry(source) {
    (source as any).m ??= {};
    const uses = (source as any).m.callforaidUses ?? 0;
    if (uses >= 3) {
      this.add('-fail', source, 'move: Call for Aid');
      return null;
    }
  },

  onHit(pokemon) {
    // per-mon memory
    (pokemon as any).m ??= {};
    const uses = (pokemon as any).m.callforaidUses ?? 0;

    // ---------- 1) Pick a random fully-evolved, usable species ----------
    const pool = this.dex.species.all().filter(s =>
      s.exists &&
      !s.nfe &&                                  // fully-evolved only
      !(s as any).isNonstandard &&
      !(s as any).battleOnly &&
      !(s as any).isMega &&
      !(s as any).isPrimal &&
      !(s as any).isGigantamax
    );
    const species = this.sample(pool);

    // ---------- 2) Build moves: 2 STABs, then 'adaptiveforce', then 'callforaid' ----------
let moveIds: string[] = [];

// small helper to add without duplicating
const addUnique = (arr: string[], id: string) => { if (!arr.includes(id)) arr.push(id); };

const learnsets = (this.dex.data as any).Learnsets as
  Record<string, {learnset?: Record<string, any>}>;
const ls = learnsets?.[species.id];

if (ls?.learnset) {
  // all legal move ids in learnset
  const all: string[] = Object.keys(ls.learnset).filter(id => this.dex.moves.get(id).exists);

  // helper: is the move damaging?
  const isDamaging = (mv: any) =>
    mv.category !== 'Status' && (mv.basePower > 0 || (mv as any).damage || (mv as any).ohko);

  // materialize once to avoid repeated lookups
  const mvObjs = all.map(id => this.dex.moves.get(id));

  const [t1, t2] = species.types as [string, string?];

  // STAB pools (damaging only)
  let stab1Pool = mvObjs.filter(m => m.type === t1 && isDamaging(m)).map(m => m.id);
  let stab2Pool = t2 ? mvObjs.filter(m => m.type === t2 && isDamaging(m)).map(m => m.id) : [];

  // combined STAB pool (unique)
  let stabPool = Array.from(new Set([...stab1Pool, ...stab2Pool]));

  // remove-from-array helper
  const removeFrom = (arr: string[], id: string) => {
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
  };

  // take up to 2 STAB damaging moves
  while (moveIds.length < 2 && stabPool.length) {
    const idx = this.random(stabPool.length);
    const pick = stabPool.splice(idx, 1)[0];
    addUnique(moveIds, pick);
    removeFrom(all, pick);
  }

  // if we couldn't find 2 STABs, backfill from other damaging moves
  if (moveIds.length < 2) {
    let damagingPool = all.filter(id => isDamaging(this.dex.moves.get(id)));
    while (moveIds.length < 2 && damagingPool.length) {
      const idx = this.random(damagingPool.length);
      const pick = damagingPool.splice(idx, 1)[0];
      if (!moveIds.includes(pick)) {
        addUnique(moveIds, pick);
        removeFrom(all, pick);
      }
    }
  }
}

// final safety fallback if learnset was missing/empty
if (moveIds.length < 2) {
  moveIds = ['tackle', 'quickattack']; // any two basic damaging moves
}

// slot 3: always Adaptive Force (your custom move)
addUnique(moveIds, 'adaptiveforce');

// slot 4: always Call for Aid
addUnique(moveIds, 'callforaid');

// ensure exactly 4 moves, with the order: [2 STABs] -> adaptiveforce -> callforaid
// (if somehow more, trim before the last two inserts above; otherwise this keeps 4)
if (moveIds.length > 4) moveIds = [moveIds[0], moveIds[1], 'adaptiveforce', 'callforaid'];


    // ---------- 3) Transform the user into the helper species ----------
    pokemon.formeChange(species, this.effect, true);
	{
  const delta: SparseBoostsTable = {};
  const statsToHalve: BoostID[] = ['atk','def','spa','spd','spe','evasion']; // no accuracy

  for (const stat of statsToHalve) {
    const cur = pokemon.boosts[stat] || 0;
    if (!cur) continue;
    const next = cur > 0 ? Math.floor(cur / 2) : Math.ceil(cur / 2);
    const d = next - cur;
    if (d) delta[stat] = d;
  }
  if (Object.keys(delta).length) {
    this.boost(delta, pokemon, pokemon, this.effect);
    this.add('-message', `${pokemon.name}'s boosts (except accuracy) were halved by Call for Aid!`);
  }
}

    // Optional: random ability from the species
    const abilVals = Object.values((species as any).abilities || {}).filter(Boolean) as string[];
    if (abilVals.length) {
      const abilName = this.sample(abilVals);
      pokemon.setAbility(this.toID(abilName), pokemon, true as any);
    }

    // Reset item/status/boosts
    // --- Give the helper a curated random item ---

// Fixed, curated picks (IDs must be lowercase)
const curatedIds = [
  // your list
  'airballoon',
  'assaultvest',
  'blunderpolicy',
  'choicescarf',
  'choiceband',
  'choicespecs',
  'covertcloak',
  'expertbelt',
  'focussash',
  'heavydutyboots',
  'kingsrock',
  'leftovers',
  'lifeorb',
  'lightclay',
  'quickclaw',
  'redcard',
  'rockyhelmet',
  'safetygoggles',
  'scopelens',
  'shellbell',
  'sitrusberry',
  'weaknesspolicy',
  'widelens',
  'wiseglasses',
  'muscleband',

  // Common type-boosting items (20% boosters)
  'charcoal',       // Fire
  'mysticwater',    // Water
  'magnet',         // Electric
  'miracleseed',    // Grass
  'hardstone',      // Rock
  'sharpbeak',      // Flying
  'spelltag',       // Ghost
  'twistedspoon',   // Psychic
  'metalcoat',      // Steel
  'dragonfang',     // Dragon
  'nevermeltice',   // Ice
  'softsand',       // Ground
  'silverpowder',   // Bug
  'poisonbarb',     // Poison
  'blackglasses',   // Dark

  // There isn’t a non-Plate Fairy booster; include Pixie Plate if you’re okay with it.
  // (It boosts Fairy and changes Arceus’s form; if that worries you, comment it out.)
  'pixieplate',
];

// Resolve the fixed IDs to item objects
const fixedItems = curatedIds
  .map(id => this.dex.items.get(id))
  .filter(it => it && it.exists);

// Add **all Z-Crystals** (any type)
const zCrystals = this.dex.items.all().filter(it =>
  it.exists && (it as any).zMove || (it as any).zMoveType
);

// Merge, de-dup, and filter out nonstandard junk if present
const itemPoolMap = new Map<string, any>();
for (const it of [...fixedItems, ...zCrystals]) {
  if (!it || it.isNonstandard) continue;   // skip CAP/unreleased if your fork marks them
  itemPoolMap.set(it.id, it);
}
const itemPool = [...itemPoolMap.values()];

// Finally, give the item
if (itemPool.length) {
  const randItem = this.sample(itemPool);
  if (randItem) {
    pokemon.setItem(randItem.id);
    this.add('-item', pokemon, randItem.name, '[from] move: Call for Aid');
  }
}

    pokemon.cureStatus();

    // ---------- 4) HP logic: 100% / 75% / 50% ----------
    const newMax = pokemon.maxhp; // after formeChange
    const frac = uses === 0 ? 1 : uses === 1 ? 3 / 4 : 1 / 2;
    const targetHP = Math.max(1, Math.min(newMax, Math.floor(newMax * frac)));

    // Normalize with heal/damage for clean logs, then set exact
    const delta = targetHP - pokemon.hp;
    if (delta > 0) this.heal(delta, pokemon, null, this.effect);
    else if (delta < 0) this.damage(-delta, pokemon, null, this.effect);
    pokemon.sethp(targetHP);
    pokemon.baseMaxhp = newMax;
    (pokemon as any).lastDamage = 0;
    (pokemon as any).hurtThisTurn = false;

    // ---------- 5) Overwrite moves (mutate arrays; don't reassign) ----------
    pokemon.moveSlots.splice(0, pokemon.moveSlots.length);
    (pokemon.baseMoveSlots as any).splice(0, (pokemon.baseMoveSlots as any).length);

    for (const id of moveIds) {
      const mv = this.dex.moves.get(id);
      const slot = {
        move: mv.name,
        id: mv.id as ID,
        pp: mv.pp,
        maxpp: mv.pp,
        target: mv.target,
        disabled: false,
        disabledSource: '',
        used: false,            // many forks require this field
      };
      pokemon.moveSlots.push({ ...slot });
      (pokemon.baseMoveSlots as any).push({ ...slot });
    }
    // DO NOT assign pokemon.moves (getter on many forks)

    // ---------- 6) Announce + bump counter ----------
    const percent = Math.round((targetHP / newMax) * 100);
    this.add('-message', `${pokemon.name} called for aid! A fully evolved ally answers at ${percent}% HP!`);
    (pokemon as any).m.callforaidUses = uses + 1;
  },
},
dnalaser: {
  name: "DNA Laser",
  shortDesc:
    "FE non-legend pool. Target becomes a random species, cures status, heals to full. Halves boosts. Sets 252 HP/Spe + 252 best offense + beneficial nature. Replaces moves: 2 STABs + Adaptive Force + Call for Aid. Applies 'shapeshiftermovecat' volatile. Blocked by Protect/Sub.",
  type: "Normal",
  basePower: 0,
  category: "Status",
  accuracy: true,
  pp: 2,
  noPPBoosts: true,
  priority: -7,
  target: "normal",
  flags: {protect: 1}, // Protect blocks; we also hard-block Substitute below

  // Explicitly blocked by Substitute
  onTryHit(target, source, move) {
    if (target.volatiles['substitute']) {
      this.add('-fail', source, 'move: DNA Laser', '[still]');
      return null;
    }
  },

  onHit(target, source) {
    // ---------- 1) Build valid species pool (Fully-Evolved, Non-legendary) ----------
    const pool = this.dex.species.all().filter(s =>
      s.exists &&
      !s.nfe &&
      !(s as any).isNonstandard &&
      !(s as any).battleOnly &&
      !(s as any).isMega &&
      !(s as any).isPrimal &&
      !(s as any).isGigantamax &&
      !(s as any).isLegendary &&
      !(s as any).isMythical &&
      !(s as any).isUltraBeast
    );
    if (!pool.length) return false;

    // Avoid no-op (same species) if possible
    let species = this.sample(pool);
    for (let i = 0; i < 4 && pool.length > 1 && species.name === target.species.name; i++) {
      species = this.sample(pool);
    }
    if (species.name === target.species.name) {
      // If it insists on matching itself, still proceed (randomness is part of design),
      // but you can 'return false' instead if you prefer to fail instead of no-op.
    }

    // ---------- 2) Prepare new movepool: 2 STABs + Adaptive Force + Call for Aid ----------
    let moveIds: string[] = [];

    const addUnique = (arr: string[], id: string) => { if (!arr.includes(id)) arr.push(id); };
    const learnsets = (this.dex.data as any).Learnsets as
      Record<string, {learnset?: Record<string, any>}>;
    const ls = learnsets?.[species.id];

    if (ls?.learnset) {
      const allIds = Object.keys(ls.learnset).filter(id => this.dex.moves.get(id).exists);
      const mObjs = allIds.map(id => this.dex.moves.get(id));
      const isDamaging = (m: any) =>
        m.category !== 'Status' && (m.basePower > 0 || (m as any).damage || (m as any).ohko);

      const [t1, t2] = species.types as [string, string?];
      let stab1Pool = mObjs.filter(m => m.type === t1 && isDamaging(m)).map(m => m.id);
      let stab2Pool = t2 ? mObjs.filter(m => m.type === t2 && isDamaging(m)).map(m => m.id) : [];

      // Unique combined STAB pool
      let stabPool = Array.from(new Set([...stab1Pool, ...stab2Pool]));

      // Take up to 2 STAB damaging moves at random
      while (moveIds.length < 2 && stabPool.length) {
        const idx = this.random(stabPool.length);
        const pick = stabPool.splice(idx, 1)[0];
        addUnique(moveIds, pick);
      }

      // If we didn't find 2 STABs, backfill with other damaging moves
      if (moveIds.length < 2) {
        let damagingPool = mObjs.filter(m => isDamaging(m)).map(m => m.id);
        // Remove any already chosen
        damagingPool = damagingPool.filter(id => !moveIds.includes(id));
        while (moveIds.length < 2 && damagingPool.length) {
          const idx = this.random(damagingPool.length);
          const pick = damagingPool.splice(idx, 1)[0];
          addUnique(moveIds, pick);
        }
      }
    }

    // Safety fallback if learnset was missing/empty
    if (moveIds.length < 2) moveIds = ['superpunch', 'suckerpunch'];

    // Slot 3: Adaptive Force; Slot 4: Call for Aid
    addUnique(moveIds, 'adaptiveforce');
    addUnique(moveIds, 'callforaid');

    // Keep exactly 4 moves with order: [2 picks] + adaptiveforce + callforaid
    if (moveIds.length > 4) moveIds = [moveIds[0], moveIds[1], 'adaptiveforce', 'callforaid'];
    while (moveIds.length < 4) moveIds.push('tackle'); // extreme safety (shouldn't occur)

    // ---------- 3) Apply the species change ----------
    target.formeChange(species, this.effect, true);

    // ---------- 4) Halve current boosts (toward 0) ----------
    {
      const delta: SparseBoostsTable = {};
      for (const s in target.boosts) {
        const stat = s as BoostID;
        const cur = target.boosts[stat] || 0;
        if (!cur) continue;
        const next = cur > 0 ? Math.floor(cur / 2) : Math.ceil(cur / 2);
        const d = next - cur;
        if (d) delta[stat] = d;
      }
      if (Object.keys(delta).length) {
        this.boost(delta, target, source, this.effect);
        this.add('-message', `${target.name}'s boosts were halved!`);
      }
    }

    // ---------- 5) Cure status & heal to full ----------
    target.cureStatus();
    // We will fully recalc stats below, then heal to 100% of the *new* max HP.

    // ---------- 6) Triple-252 EVs (HP/Spe/best offense), max IVs, beneficial nature ----------
    const bst = species.baseStats;
    const bestOff: 'atk' | 'spa' = (bst.atk >= bst.spa) ? 'atk' : 'spa';
    const worstOff: 'atk' | 'spa' = (bestOff === 'atk') ? 'spa' : 'atk';

    const newEVs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
    newEVs.hp = 252;
    newEVs.spe = 252;
    newEVs[bestOff] = 252;

    const maxIVs: StatsTable = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
    target.set.evs = {...newEVs};
    target.set.ivs = {...maxIVs};

    // Nature: boost best offensive stat, drop the other
    // (Keep it simple and explicit.)
    let nature = 'Serious';
    if (bestOff === 'atk') nature = 'Adamant'; // +Atk, -SpA
    else nature = 'Modest';                    // +SpA, -Atk
    target.set.nature = nature;

    // Recalculate derived stats from set (keeps current species)
    target.setSpecies(target.species);

    // ---------- 7) Full heal (to new max), clean damage markers ----------
    if (target.hp < target.maxhp) {
      const delta = target.maxhp - target.hp;
      if (delta > 0) this.heal(delta, target, null, this.effect);
    }
    target.sethp(target.maxhp);
    target.baseMaxhp = target.maxhp;
    (target as any).lastDamage = 0;
    (target as any).hurtThisTurn = false;

    // ---------- 8) Overwrite moves ----------
    target.moveSlots.splice(0, target.moveSlots.length);
    (target.baseMoveSlots as any).splice(0, (target.baseMoveSlots as any).length);

    for (const id of moveIds) {
      const mv = this.dex.moves.get(id);
      const slot = {
        move: mv.name,
        id: mv.id as ID,
        pp: mv.pp,
        maxpp: mv.pp,
        target: mv.target,
        disabled: false,
        disabledSource: '',
        used: false,
      };
      target.moveSlots.push({ ...slot });
      (target.baseMoveSlots as any).push({ ...slot });
    }

    // ---------- 9) Apply move-category volatile (Photon Geyser–style) ----------
    if (!target.volatiles['shapeshiftermovecat']) {
      target.addVolatile('shapeshiftermovecat' as ID);
    }

    // Flavor line
    this.add('-message', `${target.name} was rewritten by the DNA Laser!`);

    return true;
  },
},



moonstrike: {
	name: "Moon Strike",
	priority: 0,
	basePower: 90,
	accuracy: 100,
	target: 'normal',
	type: "Fairy",
	pp: 15,
	category: "Physical",
	flags: {protect: 1, metronome: 1},
	secondary: {
			chance: 15,
			boosts: {
				atk: -1,
			},
		},

},

whimsycannon: {
	accuracy: 100,
	basePower: 80,
	pp: 8,
	name: "Whimsy Cannon",
	shortDesc: "Combines Fairy and Steel effectiveness",
	priority: 0,
	category: "Special",
	flags: {metronome: 1, protect: 1, pulse: 1},
	onEffectiveness(typeMod, target, type, move) {
		return typeMod + this.dex.getEffectiveness('Steel', type);
	},
	secondary: null,
	target: "normal",
	type: "Fairy"
},
callofthewilds: {
  name: "Call of the Wilds",
  shortDesc:
    "Grass-type attack. Uses only the super-effective matchups of Grass, Ground, Bug, and Rock (resists/immu. ignored). Hits all adjacent foes.",
  type: "Grass",
  basePower: 60,
  accuracy: 100,
  category: "Physical",
  pp: 15,
  priority: 0,
  target: "allAdjacentFoes",
  flags: {protect: 1, mirror: 1, metronome: 1},

  onEffectiveness(typeMod, target, defType) {
    const pos = (atkType: string) => {
      const e = this.dex.getEffectiveness(atkType, defType);
      return e > 0 ? e : 0;  // -1, 0, -Infinity → 0
    };

    const base = Math.max(typeMod, 0); // don’t let Grass resists subtract
    const extra =
      pos('Ground') +
      pos('Bug') +
      pos('Rock');

    const total = base + extra;

    // ✅ Normal stacking version (can go 2×, 4×, 8×, etc.)
    //return total;

    // 🔒 Capped version (maxes at 4× effectiveness no matter what)
     return Math.min(total, 2);
  },

},

starfall: {
	name: "Starfall",
	type: 'Fairy',
	basePower: 120,
	accuracy: 85,
	category: 'Special',
	priority: 0,
	target: 'allAdjacentFoes',
	flags: { metronome:1, protect: 1},
	pp: 10,

},
backstab: {
	accuracy: 100,
	basePower: 115,
	category: "Physical",
	name: "Backstab",
	shortDesc: "Disappear turn 1, attack and heal turn 2. Breaks Protect",
	pp: 8,
	priority: 0,
	flags: { contact: 1, charge: 1, mirror: 1, metronome: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
	breaksProtect: true,
	onTryMove(attacker, defender, move) {
		if (attacker.removeVolatile(move.id)) {
			// Strike turn: show Phantom Force hit animation
			this.add('-anim', attacker, 'Phantom Force', defender);
			return;
		}
		// Charge turn: show Phantom Force vanish/prepare animation
		this.add('-prepare', attacker, 'Phantom Force', defender);
		if (!this.runEvent('ChargeMove', attacker, defender, move)) {
			return;
		}
		attacker.addVolatile('twoturnmove', defender);
		return null;
	},
	condition: {
		duration: 2,
		onInvulnerability: false,
	},
	onEffectiveness(typeMod, target, type, move) {
		return typeMod + this.dex.getEffectiveness('Ghost', type);
	},
	secondary: null,
	drain: [1, 2],
	target: "normal",
	type: "Dark",
	contestType: "Cool",
},



darkmoon: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "darkmoon",
  shortDesc: "For 5 turns (8 with Light Clay), blocks Special damage to user's side; Dark-type Special shatters it.",
  pp: 10,
  priority: 0,
  flags: { snatch: 1, reflectable: 1 },
  sideCondition: 'darkmoon',
  target: "allySide",
  type: "Dark",

  condition: {
    // Visible name in logs
    name: 'Darkmoon',

    duration: 4,
    durationCallback(_target, source) {
      const turns = source?.hasItem('lightclay') ? 7 : 4;
      return turns;
    },

    onSideStart(side, source) {
      this.effectState.side = side; // remember which side is protected
	  this.add('-message', 'Darkmoon protects your side from special attacks')
      this.add('-sidestart', side, 'Darkmoon', '[of] ' + (source?.name || ''));
    },

    // Protect-style cancel
    onTryHitPriority: 4,
    onTryHit(target, source, move) {
      if (!move) return;

      // Only Special, damaging moves
      if (move.category !== 'Special' || !(move.basePower || move.damage || move.ohko)) {
        return;
      }

      // Dark-type Special: shatter, do NOT block
      if (move.type === 'Dark') {
        this.add('-sideend', target.side, 'Darkmoon');
        target.side.removeSideCondition('darkmoon'); // <-- correct ID
        return;
      }

      // Block Special hit
      this.add('-activate', target, 'move: Darkmoon'); // <-- valid activate payload
      return null; // cancel like Protect
    },

    // Safety net logger
    onAnyDamage(damage, target, _source, effect) {
      const mySide = this.effectState.side;
      if (!damage || !target?.side || target.side !== mySide) return;
      const isMove = !!effect && (effect as any).effectType === 'Move';
      const mv = isMove ? (effect as ActiveMove) : null;
    },

    onSideEnd(side) {
      this.add('-sideend', side, 'Darkmoon');
    },
  },
},
shortcircuit: {
  name: "Short Circuit",
  type: "Electric",
  category: "Status",
  accuracy: 100,
  basePower: 0,
  pp: 15,
  priority: 1,
  target: "normal",
  shortDesc: "Inflicts a volatile: target’s chosen move is replaced by a random usable one until it switches out.",
  flags: {protect: 1, reflectable: 1, mirror: 1},

  // Don’t reapply if already active
  onTryHit(target, source, move) {
    if (target.volatiles['shortcircuit']) {
      this.add('-fail', target, 'move: Short Circuit');
      return null;
    }
  },

  // Apply our custom volatile
  volatileStatus: 'shortcircuit',

  condition: {
    name: 'Short Circuit',
    // No duration: clears naturally on switch/forced switch
    onStart(target, source, effect) {
      // UI line like other volatiles
      this.add('-start', target, 'Short Circuit', '[from] move: Short Circuit', '[of] ' + source);
      // internal recursion guard
      (this.effectState as any).resolving = false;
    },
    onEnd(target) {
      this.add('-end', target, 'Short Circuit');
    },

    // Core: force a random usable move at execution time (same logic as your ability)
    onBeforeMove(pokemon, _target, move) {
      const st = (this.effectState as any);
      if (st.resolving) return; // prevent recursion

      // Build “usable” pool (respects Taunt/Disable/Encore/Imprison/Choice/PP)
      const usable = pokemon.getMoves().filter(ms =>
        !ms.disabled && (ms.pp ?? 0) > 0 && this.dex.moves.get(ms.id).id !== 'struggle'
      );
      if (!usable.length) return; // let Struggle happen

      const pick = this.sample(usable);
      const picked = this.dex.moves.get(pick.id);
      if (picked.id === move.id) return; // RNG matched selection → keep original

      this.add('-message', `${pokemon.name} short-circuited and used ${picked.name} instead!`);

      st.resolving = true;
      const activeMove = this.dex.getActiveMove(picked);
      // Let the engine choose a legal target
      this.actions.useMove(activeMove, pokemon);
      st.resolving = false;

      return false; // cancel the originally queued move
    },
  },
},

mindshards: {
  name: "Mind Shards",
  shortDesc: "Hits 2-5 times. Lowers target's Spdef",
  type: "Psychic",
  category: "Special",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},
  onAfterMoveSecondary(target, source, move) {
    if (!target || target.fainted) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // 2 hits → drop Spdef by 2
      this.boost({spd: -2}, target, source, move);
    } else if (hits >= 3) {
      // 3–5 hits → drop Spdef by 1
      this.boost({spd: -1}, target, source, move);
    }
    // If for some reason hits === 0 (miss/immune), do nothing
  },
},

staticjolt: {
  name: "Static Jolt",
  shortDesc: "Hits 2–5 times. If it hits 2 times: guaranteed paralyze; if 3–4 times: 30% chance to paralyze.",
  type: "Electric",
  category: "Special",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},

  // Resolve status only after all hits are finished
  onAfterMoveSecondarySelf(source, target, move) {
    if (!target?.hp) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // Guaranteed para on exactly 2 hits
      target.trySetStatus('par', source, move);
    } else if (hits === 3 || hits === 4) {
      // 30% chance on 3-4 hits
      if (this.randomChance(3, 10)) {
        target.trySetStatus('par', source, move);
      }
    }
  },
},



dragonsfury: {
  name: "Dragon's Fury",
  shortDesc: "Hits 2-5 times. Each hit has a 10% chance to +1 Attack.",
  type: "Dragon",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, contact: 1, metronome: 1},
  secondary: {
    chance: 10,
    self: {boosts: {atk: 1}},
  },
},

pixieflurry: {
  name: "Pixie Flurry",
  shortDesc: "Hits 2-5 times. Heals 25% of damage dealt (per hit).",
  type: "Fairy",
  category: "Special",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},
  drain: [1, 4], // 25% lifesteal
},

shadowbarrage: {
  name: "Shadow Barrage",
  shortDesc: "Hits 2–5 times. Lowers accuracy by 1 (or 2 if it only hits twice).",
  type: "Dark",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, contact: 1, metronome: 1},

  onAfterMoveSecondary(target, source, move) {
    if (!target || target.fainted) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // 2 hits → drop accuracy by 2
      this.boost({accuracy: -2}, target, source, move);
    } else if (hits >= 3) {
      // 3–5 hits → drop accuracy by 1
      this.boost({accuracy: -1}, target, source, move);
    }
    // If for some reason hits === 0 (miss/immune), do nothing
  },
},


phantomrattle: {
  name: "Phantom Rattle",
  shortDesc: "Hits 2-5 times. Each hit has a 10% chance to flinch.",
  type: "Ghost",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, contact: 1, metronome: 1},
  secondary: {
    chance: 10,
    volatileStatus: 'flinch',
  },
},

feathervolley: {
  name: "Feather Volley",
  shortDesc: "Hits 2-5 times. Lowers the target's Speed by 1. 2 if only hit twice",
  type: "Flying",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},
  // Apply the Speed drop once after the multi-hit resolves
  onAfterMoveSecondary(target, source, move) {
    if (!target || target.fainted) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // 2 hits → drop speed by 2
      this.boost({spe: -2}, target, source, move);
    } else if (hits >= 3) {
      // 3–5 hits → drop speed by 1
      this.boost({spe: -1}, target, source, move);
    }
    // If for some reason hits === 0 (miss/immune), do nothing
  },
},

toxicneedles: {
  name: "Toxic Needles",
  shortDesc: "Hits 2-5 times. Each hit has a 10% chance to badly poison.",
  type: "Poison",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},
  secondary: {
    chance: 10,
    status: 'tox',
  },
},

emberbarrage: {
  name: "Ember Barrage",
  shortDesc: "Hits 2–5 times. If it hits 2 times: guaranteed burn; if 3–4 times: 30% burn chance.",
  type: "Fire",
  category: "Special",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},

  // Post-resolution logic (no secondaries, so unaffected by Serene Grace, etc.)
  onAfterMoveSecondarySelf(source, target, move) {
    if (!target?.hp) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // Guaranteed burn
      target.trySetStatus('brn', source, move);
    } else if (hits === 3 || hits === 4) {
      // 30% chance to burn
      if (this.randomChance(3, 10)) {
        target.trySetStatus('brn', source, move);
      }
    }
  },
},


tidalslap: {
  name: "Tidal Slap",
  shortDesc: "Hits 2-5 times. Lowers attack once after all hits. -2 if it hit only hit twice",
  type: "Water",
  category: "Special",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, contact: 1, metronome: 1},
  onAfterMoveSecondary(target, source, move) {
    if (!target || target.fainted) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // 2 hits → drop attack by 2
      this.boost({atk: -2}, target, source, move);
    } else if (hits >= 3) {
      // 3–5 hits → drop Attack by 1
      this.boost({atk: -1}, target, source, move);
    }
    // If for some reason hits === 0 (miss/immune), do nothing
  },
},

shrapnelstorm: {
  name: "Shrapnel Storm",
  shortDesc: "Hits 2-5 times. Lowers Defense once after all hits. -2 if it hit only hit twice",
  type: "Steel",
  category: "Physical",
  basePower: 25,
  accuracy: 100,
  pp: 15,
  priority: 0,
  target: "normal",
  multihit: [2, 5],
  flags: {protect: 1, mirror: 1, metronome: 1},
  onAfterMoveSecondary(target, source, move) {
    if (!target || target.fainted) return;
    const hits = move.hit || 0;

    if (hits === 2) {
      // 2 hits → drop defense by 2
      this.boost({def: -2}, target, source, move);
    } else if (hits >= 3) {
      // 3–5 hits → drop defense by 1
      this.boost({def: -1}, target, source, move);
    }
    // If for some reason hits === 0 (miss/immune), do nothing
  },
},

pinatabond: {
  // Destiny-Bond-style “arm this for the rest of the turn”
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Pinata Bond",
  shortDesc: "Destiny Bond but if you die you set hazards on the foe's side",
  pp: 5,
  priority: 0,
  flags: {bypasssub: 1, noassist: 1, failcopycat: 1},
  volatileStatus: 'pinatabond',
  target: "self",
  type: "Ghost",

  onPrepareHit(pokemon) {
    // If already active, fail (same as Destiny Bond)
    return !pokemon.removeVolatile('pinatabond');
  },

  condition: {
    noCopy: true, // Baton Pass doesn't copy it
    onStart(pokemon) {
      this.add('-singlemove', pokemon, 'Pinata Bond');
    },

    // If the *user* (target here) faints to a foe's move this turn, fire the hazards
    onFaint(target, source, effect) {
      if (!source || !effect || target.isAlly(source)) return;
      if (effect.effectType === 'Move' && !effect.flags?.futuremove) {
        // Drop a random assortment of hazards on the *foe's* side (the attacker’s side)
        const foeSide = source.side;
        const hazards: ID[] = [
  			'spikes' as ID,
  			'toxicspikes' as ID,
  			'stealthrock' as ID,
  			'stickyweb' as ID,]

        for (const h of hazards) {
          let max = 1;
          if (h === 'spikes') max = 3;
          if (h === 'toxicspikes') max = 2;

          // random layer count 0..max
          const layers = this.random(max + 1);
          for (let i = 0; i < layers; i++) {
            foeSide.addSideCondition(h, target);
          }
        }
        this.add('-activate', target, 'move: Pinata Bond');
        this.add('-message', `${target.name}'s Pinata Bond scattered hazards everywhere!`);
      }
    },

    // Clear if the user tries to act (same as Destiny Bond)
    onBeforeMovePriority: -1,
    onBeforeMove(pokemon, _target, move) {
      if (move.id === 'pinatabond') return;
      this.debug('removing Pinata Bond before attack');
      pokemon.removeVolatile('pinatabond');
    },
    onMoveAborted(pokemon) {
      pokemon.removeVolatile('pinatabond');
    },
  },

  secondary: null,
  // Optional Z-Move effect to match Destiny Bond’s redirect flavor (remove if not desired)
  // zMove: {effect: 'redirect'},
  // contestType: "Clever",
},

freezeray: {
	name: "Freeze Ray",
	type: "Ice",
	basePower: 40,
	accuracy: 50,
	shortDesc: "Guaranteed Freeze",
	pp: 10,
	target: "normal",
	flags: { protect: 1},
	category: "Special",
	priority: 0,
	secondary: {
		chance: 100,
		status: 'frz'
	},
},
poisongasbomb: {
  accuracy: 100,
  basePower: 0,
  category: "Status",
  name: "Poison Gas Bomb",
  shortDesc: "Badly poisons all adjacent foes. Also poisons the user's side (user + ally).",
  pp: 10,
  priority: 0,
  flags: {protect: 1, reflectable: 1, mirror: 1, metronome: 1},
  target: "allAdjacentFoes",
  type: "Poison",

  onHit(target, source, move) {
    // 1) Foes: badly poison
    if (target && target.side !== source.side) {
      target.trySetStatus('tox', source);
    }

    // 2) Allies (user + partner): regular poison — do this once per use
    const mv = move as any;
    if (!mv._didAllySide) {
      mv._didAllySide = true;
      for (const ally of source.side.active) {
        if (!ally || !ally.hp) continue;
        ally.trySetStatus('psn', source); // respects immunities/safeguard etc.
      }
    }
  },

  secondary: null,
},
nullzone: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Null Zone",
  shortDesc: "4 turns: suppresses abilities for all active Pokémon on both sides.",
  pp: 5,
  priority: 0,
  target: "all",
  type: "Poison",               // pick any type you prefer
  flags: {snatch: 1, mirror: 1},

  // Global field effect
  pseudoWeather: 'nullzone',

  condition: {
    name: 'Null Zone',
    duration: 4,

    onFieldStart(field, source) {
      this.add('-fieldstart', 'move: Null Zone', source ? '[of] ' + source : '');
      // Apply suppression to all current actives
      for (const side of this.sides) {
        for (const mon of side.active) {
          if (!mon || !mon.hp) continue;
          if (!mon.volatiles['gastroacid']) mon.addVolatile('gastroacid');
        }
      }
    },

    onFieldRestart() {
      this.add('-fieldactivate', 'move: Null Zone');
      // Re-assert suppression in case anything cleared it
      for (const side of this.sides) {
        for (const mon of side.active) {
          if (!mon || !mon.hp) continue;
          if (!mon.volatiles['gastroacid']) mon.addVolatile('gastroacid');
        }
      }
    },

    // Any new switch-in while the field is up gets suppressed immediately
    onSwitchIn(pokemon) {
      if (!pokemon || !pokemon.hp) return;
      if (!pokemon.volatiles['gastroacid']) pokemon.addVolatile('gastroacid');
    },

    // Safety net: re-apply at residual in case a volatile was cleared mid-turn
    onResidualOrder: 30,
    onResidual() {
      for (const side of this.sides) {
        for (const mon of side.active) {
          if (!mon || !mon.hp) continue;
          if (!mon.volatiles['gastroacid']) mon.addVolatile('gastroacid');
        }
      }
    },

    onFieldEnd() {
      // Remove suppression and announce end
      for (const side of this.sides) {
        for (const mon of side.active) {
          if (!mon || !mon.hp) continue;
          if (mon.volatiles['gastroacid']) mon.removeVolatile('gastroacid');
        }
      }
      this.add('-fieldend', 'move: Null Zone');
    },
  },
},
poop: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Poop",
  shortDesc:
    "Sets Poop on user's side (hazard). Blocks contact moves against that side. Fades if a Water/Ground ally switches in.",
  pp: 10,
  priority: 0,
  target: "allySide",
  type: "Ground",                 // pick any type you want
  flags: {snatch: 1},             // Snatchable like screens/webs
  sideCondition: 'poop',

  condition: {
    duration: 8,
    name: 'Poop',

    onSideStart(side, source) {
      // Remember which side we protect
      (this.effectState as any).protectedSide = side;
      this.add('-sidestart', side, 'move: Poop', '[of] ' + (source?.name || ''));
    },

    // Block contact hits aimed at this side
    onTryHit(target, source, move) {
      const protectedSide: Side | undefined = (this.effectState as any).protectedSide;
      if (!protectedSide || !move || !move.flags?.contact) return;
      if (!target?.side || target.side !== protectedSide) return; // only protect our side
      if (!source || source.side === protectedSide) return;       // ignore self/allies
	  // Special case: Water contact moves wash it away instead of blocking
  if (move.flags?.contact && move.type === 'Water') {
    this.add('-message', "The poop is washed away!");
    protectedSide.removeSideCondition('poop');
    return; // let the Water move continue as normal
  }

      this.add('-activate', target, 'move: Poop', '[block]');
	  this.add('-message', `${source.name}'s ${move.name} was blocked by the Poop!`);     // show activation
      return null;                                                // cancel the hit
    },

    // If an ally that is Water or Ground switches in, Poop goes away
    onSwitchIn(pokemon) {
      const protectedSide: Side | undefined = (this.effectState as any).protectedSide;
      if (!protectedSide || pokemon.side !== protectedSide) return;
      if (pokemon.hasType('Water') || pokemon.hasType('Ground')) {
        this.add('-sideend', protectedSide, 'move: Poop', '[from] switch-in', '[of] ' + pokemon.name);
        protectedSide.removeSideCondition('poop');
      }
    },
	// NEW: If any mon on this side is hit by a Water move, Poop is washed away
    onDamagingHit(damage, target, source, move) {
      const protectedSide: Side | undefined = (this.effectState as any).protectedSide;
      if (!protectedSide || target.side !== protectedSide) return;
      if (move.type === 'Water') {
        this.add('-message', "The poop is washed away!");
        protectedSide.removeSideCondition('poop');
      }
    },

    onSideEnd(side) {
      this.add('-sideend', side, 'move: Poop');
    },
  },
},
shatteringscream: {
  name: "Shattering Scream",
  shortDesc: "Sound. Hits all foes. Rolls 20% each for confuse/paralyze/phaze/flinch, but applies at most one.",
  type: "Psychic",
  basePower: 90,
  accuracy: 100,
  pp: 10,
  priority: 0,
  category: "Special",
  target: "allAdjacentFoes",
  flags: {protect: 1, mirror: 1, sound: 1, bypasssub: 1, metronome: 1},

  // Independent 20% rolls, then pick ONE success (if any)
  onHit(target, source, move) {
    if (!target?.hp || target.side === source.side) return;

    const successes: Array<'confuse'|'par'|'phaze'|'flinch'> = [];
    if (this.randomChance(1, 5)) successes.push('confuse'); // 20%
    if (this.randomChance(1, 5)) successes.push('par');     // 20%
    if (this.randomChance(1, 5)) successes.push('phaze');   // 20%
    if (this.randomChance(1, 5)) successes.push('flinch');  // 20%

    if (!successes.length) return;

    // If multiple succeeded, choose one uniformly
    const pick = this.sample(successes);
    switch (pick) {
      case 'confuse':
        target.addVolatile('confusion', source, move);
        break;
      case 'par':
        target.trySetStatus('par', source, move);
        break;
      case 'phaze':
        target.forceSwitchFlag = true;
        break;
      case 'flinch':
        target.addVolatile('flinch', source, move);
        break;
    }
  },
},

aidofrevival: {
  name: "Aid of Revival",
  shortDesc:
    "Pick a fainted ally; that ally revives and, on switch-in, is randomized (species/moves/ability/item) and fully healed.",
  type: "Normal",
  category: "Status",
  basePower: 0,
  accuracy: true,
  pp: 1,
  noPPBoosts: true,
  priority: 0,
  target: "self",
  flags: { snatch: 1, mirror: 1 },
  slotCondition: 'aidofrevivalslot',
  selfSwitch: true,
  condition: { duration: 1 },

  onTry(source) {
    if (!source.side.pokemon.some(p => p?.fainted)) {
      this.add('-fail', source, 'move: Aid of Revival');
      return null;
    }
  },

  onHit(_side, source, move) {
    source.side.addSlotCondition(source, 'aidofrevivalslot', source, move);
    if (!source.side.getSideCondition('aidofrevivalwatch')) {
      source.side.addSideCondition('aidofrevivalwatch', source, move);
    }
    source.switchFlag = true;
  },
},




benchbolt: {
  name: "Bench Bolt",
  shortDesc: "Paralyzes a random benched foe.",
  type: "Electric",
  category: "Status",
  basePower: 0,
  accuracy: 100,
  pp: 10,
  priority: 0,
  target: "foeSide",
  flags: {reflectable: 1, mirror: 1}, // can be bounced like other side moves

  onHitSide(side, source) {
    // pick from non-fainted, not-active foes on that side
    const candidates = side.pokemon.filter(p => p && !p.fainted && !p.isActive);
    if (!candidates.length) {
      this.add('-fail', source, 'move: Bench Bolt');
      return null;
    }
    const pick = this.sample(candidates);

    // If already statused or can’t be paralyzed, fail gracefully
    if (pick.status || pick.hasType('Electric')) {
      this.add('-fail', source, 'move: Bench Bolt');
      return null;
    }

    // Apply paralysis; this shows a log line even for benched mons
    pick.setStatus('par', source, this.effect);
    this.add('-message', `${pick.name} (on the bench) was paralyzed by Bench Bolt!`);
  },
},

benchhex: {
  name: "Bench Hex",
  shortDesc: "100%: Randomly gives SLP/PAR/BRN/PSN/FRZ to benched foes (all different), then the user faints.",
  type: "Dark",                 // choose any type you want
  category: "Status",
  basePower: 0,
  accuracy: 100,
  pp: 1,
  noPPBoosts: true,
  priority: 0,
  target: "foeSide",
  flags: {reflectable: 1, mirror: 1, metronome: 1},

  onHitSide(side, source) {
  // Collect benched, non-fainted foes
  const bench = side.pokemon.filter(p => p && !p.fainted && !p.isActive);
  if (!bench.length) {
    this.add('-fail', source, 'move: Bench Hex');
    return null;
  }

  // Status pool: one of each
  const pool: ID[] = ['slp', 'par', 'brn', 'psn', 'frz'].map(x => x as ID);

  // Shuffle benches and statuses for randomness
  this.prng.shuffle(bench);
  this.prng.shuffle(pool);

  // Try to give each benched mon one distinct status that sticks
  for (const mon of bench) {
    let appliedIndex = -1;
    for (let i = 0; i < pool.length; i++) {
      const st = pool[i];
      if (mon.trySetStatus(st, source, this.effect)) {
        appliedIndex = i;
        break;
      }
    }
    if (appliedIndex >= 0) {
      // Remove that status so the next mon gets a different one
      pool.splice(appliedIndex, 1);
      if (!pool.length) break; // used up all statuses
    }
  }

  // User faints after delivering the ailments
  if (source?.hp) source.faint();
},
},
frozenearth: {
  name: "Frozen Earth",
  type: "Ice",
  category: "Physical",
  shortDesc: "Combines Ice and Ground effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1, contact: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    // Always add Ground's effectiveness to the base Ice effectiveness
    // Ignore any immunities like Flying / Levitate
    const extra = this.dex.getEffectiveness('Ground', type);
    return typeMod + extra;
  },

  secondary: null,
},
firejab: {
  name: "Fire Jab",
  shortDesc: "Usually moves first",
  type: "Fire",
  category: "Physical",
  basePower: 40,
  accuracy: 100,
  pp: 15,
  priority: 1,
  target: "normal",
  flags: {protect: 1, mirror: 1, contact: 1, punch: 1},
  secondary: null
},
// data/moves.ts
// Main button the user clicks
rainbowpummeling: {
  name: "Rainbow Pummeling",
  shortDesc: "Hits 18×. Each hit is a different type (random order). Continues past immunities.",
  basePower: 12,
  multiaccuracy: true,
  accuracy: 80,
  pp: 5,
  priority: 0,
  category: "Physical", // or "Special"
  flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1},
  multihit: 18,
  type: "Fairy", // placeholder

  onTryMove(attacker) {
    attacker.addVolatile('rainbowpummeling');
  },

  condition: {
    duration: 1,
    onStart(pokemon) {
      const types: string[] = [
        'Normal','Fire','Water','Grass','Electric','Ice',
        'Fighting','Poison','Ground','Flying','Psychic','Bug',
        'Rock','Ghost','Dragon','Dark','Steel','Fairy',
      ];
      // Fisher–Yates shuffle (random order each use)
      for (let i = types.length - 1; i > 0; i--) {
        const j = this.random(i + 1);
        [types[i], types[j]] = [types[j], types[i]];
      }
      this.effectState.types = types;
      this.effectState.index = 0;
    },
  },

  // Runs for each sub-hit BEFORE damage/effectiveness
  onTryHit(target, source, move) {
    const vol = source.volatiles['rainbowpummeling'];
    if (!vol) return;

    const list: string[] = vol.types || [];
    const idx = vol.index ?? 0;
    const t = list[idx] || 'Normal';
    move.type = t;

    // 1) Bypass engine's early stop on immunities so multihit keeps going
    // (we'll still make the damage 0 below so it behaves like an immune hit)
    move.ignoreImmunity = true;

    // Record whether this specific sub-hit WOULD be immune under normal rules
    // (covers standard type immunities; abilities like Volt Absorb are still handled normally)
    let wouldBeImmune = false;
    if ((t === 'Normal' && target.hasType('Ghost')) ||
        (t === 'Ghost'  && target.hasType('Normal')) ||
        (t === 'Psychic' && target.hasType('Dark')) ||
        (t === 'Dragon' && target.hasType('Fairy')) ||
        (t === 'Electric' && target.hasType('Ground')) ||
        (t === 'Ground' && (target.hasType('Flying') ||
                            target.hasAbility('levitate') ||
                            target.volatiles['magnetrise'] ||
                            target.volatiles['telekinesis']))) {
      wouldBeImmune = true;
    }

    // Stash the per-hit immunity outcome so we can zero damage in onBasePower
    (vol as any).immune = wouldBeImmune;

    // Optional: show per-hit type (and immunity notice)
    if (wouldBeImmune) {
      this.add('-message', `${move.name} (${t} hit — immune)`);
    } else {
      this.add('-message', `${move.name} (${t} hit)`);
    }
  },

  // 2) If the target WOULD be immune, force this sub-hit's damage to 0
  onBasePower(basePower, source, target, move) {
    const vol = source.volatiles['rainbowpummeling'];
    if (!vol) return;
    if ((vol as any).immune) {
      return this.chainModify(0); // 0 damage, but the sequence continues
    }
  },

  // Advance to the next type after each sub-hit
  onAfterHit(target, source, move) {
    if (move.id !== 'rainbowpummeling') return;
    const vol = source.volatiles['rainbowpummeling'];
    if (vol) {
      vol.index++;
      // clear the per-hit immune flag
      (vol as any).immune = false;
    }
  },

  secondary: null,
  target: "normal",
},

doubleteamanime: {
  name: "Double Team Anime",
  shortDesc:
    "For 5 turns: user's damaging moves strike twice (2nd hit 0.5×). " +
    "Incoming moves vs user are 0.7× accurate.",
  category: "Status",
  accuracy: true,
  basePower: 0,
  pp: 15,
  priority: 0,
  flags: {snatch: 1},
  target: "self",
  type: "Normal",

  // prevent stacking (recasting while active fails)
  onTryHit(pokemon) {
    if (pokemon.volatiles['doubleteamanime']) {
      this.add('-fail', pokemon, 'move: Double Team Anime');
      return null;
    }
  },
  onHit(pokemon) {
    pokemon.addVolatile('doubleteamanime');
    this.add('-start', pokemon, 'move: Double Team Anime');
  },

  // ---- the volatile ----
  condition: {
    duration: 5,                 // fixed 5 turns
    onResidualOrder: 21,         // same timing as screens

    onStart(pokemon) {
      this.effectState.holder = pokemon;
      this.effectState.offHitIndex = 0;  // per-move sub-hit index
    },

    // OFFENSE: add a second hit (if not already multihit) and halve its power
    onModifyMove(move, pokemon) {
      if (pokemon !== this.effectState.holder) return;
      if (move.category === 'Status') return;

      // Only force 2 hits if it's not already multihit
      if (!move.multihit) move.multihit = 2;

      (move as any).__dt_dup = true;     // tag our duplicate
      this.effectState.offHitIndex = 0;  // reset per move
    },
    onBasePower(basePower, source, target, move) {
      if (source !== this.effectState.holder) return;
      if ((move as any).__dt_dup) {
        const idx = this.effectState.offHitIndex || 0;
        if (idx >= 1) return this.chainModify(0.5); // second hit = 50%
      }
    },
    onAfterHit(target, source, move) {
      if (source === this.effectState.holder && (move as any).__dt_dup) {
        this.effectState.offHitIndex = (this.effectState.offHitIndex || 0) + 1;
      }
    },

    // DEFENSE: incoming moves are 30% less accurate vs the holder
    onModifyAccuracy(accuracy, target, source, move) {
      if (target !== this.effectState.holder) return;
      if (typeof accuracy !== 'number') return; // don't touch always-hit moves
      return this.chainModify([7, 10]);         // 0.7× accuracy
    },

    onEnd(pokemon) {
      this.add('-end', pokemon, 'move: Double Team Anime');
    },
  },
},
protectivepillow: {
  num: 30001, // pick any free ID
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Protective Pillow",
  shortDesc: "Protect. If foe hits with a contact move they are put to sleep",
  pp: 10,
  priority: 4,
  flags: { noassist: 1, failcopycat: 1 }, // match Baneful Bunker behavior
  stallingMove: true,
  volatileStatus: 'protectivepillow',
  onPrepareHit(pokemon) {
    return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  },
  onHit(pokemon) {
    pokemon.addVolatile('stall');
  },
  condition: {
    duration: 1,
    onStart(target) {
      this.add('-singleturn', target, 'move: Protect');
    },
    onTryHitPriority: 3,
    onTryHit(target, source, move) {
      // Block moves affected by Protect
      if (!move.flags['protect']) {
        if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
        if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
        return;
      }
      if (move.smartTarget) {
        move.smartTarget = false;
      } else {
        this.add('-activate', target, 'move: Protect');
      }

      // Reset Outrage-style lock if applicable
      const lockedmove = source.getVolatile('lockedmove');
      if (lockedmove) {
        if (source.volatiles['lockedmove'].duration === 2) {
          delete source.volatiles['lockedmove'];
        }
      }

      // Contact into the protect -> put the attacker to sleep
      if (this.checkMoveMakesContact(move, source, target)) {
        source.trySetStatus('slp', target);
      }
      return this.NOT_FAIL;
    },
    onHit(target, source, move) {
      // Z/Max-powered moves that make contact and get blocked also trigger sleep
      if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
        source.trySetStatus('slp', target);
      }
    },
  },
  secondary: null,
  target: "self",
  type: "Normal",
  zMove: { boost: { def: 1 } }, // optional, mirrors Baneful Bunker
  contestType: "Cute",
},


rainbowpunching: {
  name: "Rainbow Punching",
  shortDesc: "Hits 5×. Each hit is a different random type (from all 18). Continues past immunities.",
  basePower: 25,
  accuracy: 100,
  pp: 10,
  priority: 0,
  category: "Physical",
  flags: {contact: 1, protect: 1, mirror: 1, punch: 1, metronome: 1},
  multihit: 5,
  type: "Fairy", // placeholder; per-hit type is set dynamically

  onTryMove(attacker) {
    attacker.addVolatile('rainbowpunching');
  },

  condition: {
    duration: 1,
    onStart(pokemon) {
      const types: string[] = [
        'Normal','Fire','Water','Grass','Electric','Ice',
        'Fighting','Poison','Ground','Flying','Psychic','Bug',
        'Rock','Ghost','Dragon','Dark','Steel','Fairy', 'Gamma', 'Blood', 'Light'
      ];
      // Shuffle full set, then take the first 5 for distinct picks
      for (let i = types.length - 1; i > 0; i--) {
        const j = this.random(i + 1);
        [types[i], types[j]] = [types[j], types[i]];
      }
      this.effectState.types = types.slice(0, 5);
      this.effectState.index = 0;
    },
  },

  // Runs for each sub-hit BEFORE damage/effectiveness
  onTryHit(target, source, move) {
    const vol = source.volatiles['rainbowpunching'];
    if (!vol) return;

    const list: string[] = vol.types || [];
    const idx = vol.index ?? 0;
    const t = list[idx] || 'Normal';

	// Reset per-hit caches (prevents previous hit effectiveness bleeding into this hit)
delete (move as any).typeMod;
delete (move as any).effectiveness;
delete (move as any).hitData;

    move.type = t;

    // Keep multihit going even if a sub-type is immune
    move.ignoreImmunity = true;

    // Would-be immunity check (type chart + common airborne/ability cases)
    let wouldBeImmune = false;
    if ((t === 'Normal' && target.hasType('Ghost')) ||
        (t === 'Ghost'  && target.hasType('Normal')) ||
        (t === 'Psychic' && target.hasType('Dark')) ||
        (t === 'Dragon' && target.hasType('Fairy')) ||
        (t === 'Electric' && target.hasType('Ground')) ||
        (t === 'Ground' && (target.hasType('Flying') ||
                            target.hasAbility('levitate') ||
                            target.volatiles['magnetrise'] ||
                            target.volatiles['telekinesis']))) {
      wouldBeImmune = true;
    }
    (vol as any).immune = wouldBeImmune;

    // === Per-hit announcement ===
    this.add('-message', `(${t} hit)`);
  },

  // Force 0 damage on hits that would be immune, but keep the sequence alive
  onBasePower(basePower, source, target, move) {
    const vol = source.volatiles['rainbowpunching'];
    if (!vol) return;
    if ((vol as any).immune) {
      return this.chainModify(0);
    }
  },

  // Advance to next type after each sub-hit (handles sub and direct hits)
  
  onAfterHit(_target, source, move) {
    if (move.id !== 'rainbowpunching') return;
    const vol = source?.volatiles?.['rainbowpunching'];
    if (vol) {
      vol.index++;
      (vol as any).immune = false;
    }
  },

  secondary: null,
  target: "normal",
},
hotwater: {
  name: "Hot Water",
  type: "Water",
  category: "Special",
  shortDesc: "Combines Fire and Water effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    const extra = this.dex.getEffectiveness('Fire', type);
    return typeMod + extra;
  },

  secondary: null,
},

stoneflutter: {
  name: "Stone Flutter",
  type: "Rock",
  category: "Special",
  shortDesc: "Combines Fairy and Rock effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    const extra = this.dex.getEffectiveness('Fairy', type);
    return typeMod + extra;
  },
  onModifyMove(move, pokemon) {
			if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) move.category = 'Physical';
		},

  secondary: null,
},

coldboulder: {
  name: "Cold boulder",
  type: "Ice",
  category: "Physical",
  shortDesc: "Combines Ice and Rock effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    const extra = this.dex.getEffectiveness('Rock', type);
    return typeMod + extra;
  },

  secondary: null,
},

freezeblast: {
  name: "Freeze Blast",
  type: "Water",
  category: "Special",
  shortDesc: "Combines Water and Ice effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1,},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    const extra = this.dex.getEffectiveness('Ice', type);
    return typeMod + extra;
  },

  secondary: null,
},

icyhot: {
  name: "Icy Hot",
  type: "Ice",
  category: "Special",
  shortDesc: "Combines Ice and Fire effectiveness",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    const extra = this.dex.getEffectiveness('Fire', type);
    return typeMod + extra;
  },

  secondary: null,
},

skyquake: {
  name: "Sky Quake",
  type: "Flying",
  category: "Physical",
  shortDesc: "Combines Flying and Ground effectiveness. Still hits flying pokemon",
  basePower: 80,
  accuracy: 100,
  pp: 8,
  priority: 0,
  flags: {metronome: 1, protect: 1, contact: 1},
  target: "normal",

  onEffectiveness(typeMod, target, type) {
    // Always add Ground's effectiveness to the base Ice effectiveness
    // Ignore any immunities like Flying / Levitate
    const extra = this.dex.getEffectiveness('Ground', type);
    return typeMod + extra;
  },

  secondary: null,
},

stonejaw: {
		accuracy: 99,
		basePower: 80,
		category: "Physical",
		name: "Stone Jaw",
		shortDesc: "Biting move, 10% chance to flinch",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, bite: 1, contact: 1},
		secondary: {
			chance: 10,
			volatileStatus: 'flinch',
		},
		target: "normal",
		type: "Rock",
		contestType: "Tough",
	},

plagueswarm: {
		accuracy: 100,
		basePower: 150,
		basePowerCallback(pokemon, target, move) {
			const bp = move.basePower * pokemon.hp / pokemon.maxhp;
			this.debug(`BP: ${bp}`);
			return bp;
		},
		onPrepareHit(target, source, move) {
    // Single target
    // this.add('-anim', source, 'Signal Beam', target);

    // If it hits multiple foes, you can loop targets:
    for (const foe of target.side.active.filter(Boolean)) {
       this.add('-anim', source, 'Signal Beam', foe);
     }
  },
		category: "Special",
		name: "Plague Swarm",
		shortDesc: "Power decreases as user's HP is lowered",
		pp: 5,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "allAdjacentFoes",
		type: "Bug",
		contestType: "Beautiful",
	},
insectsting: {
  name: "Insect Sting",
  shortDesc: "50 BP, Bug, Physical. On hit: target is stung; each time it uses a move, it loses 1/8 max HP (permanent).",
  type: "Bug",
  category: "Physical",
  basePower: 50,
  accuracy: 85,
  target: 'normal',
  pp: 5,
  priority: 0,
  flags: {contact: 1, protect: 1, mirror: 1},
  secondary: null,

  onHit(target, source) {
    // permanent mark (persists across switches/faint+revive)
    (target as any).m ??= {};
    (target as any).m.permaStung = true;
    (target as any).m.permaStungSource = source || null;

    // add/refresh the active volatile now
    target.addVolatile('insectsting', source);
    this.add('-message', `${target.name} was stung!`);

    // ensure the side watcher is installed for the target's side
    const id = 'insectstingwatcher' as ID;
    if (!target.side.sideConditions[id]) {
      target.side.addSideCondition(id, source);
    }
  },



  // Volatile handles reapplication bookkeeping and messaging only
  volatileStatus: 'insectsting',
  condition: {
    onStart(pokemon, source) {
      // remember who applied it for KO credit
      this.effectState.source = source || (pokemon as any).m?.permaStungSource || null;
    },
    onEnd(pokemon) {
      // cosmetic; the watcher will re-apply on switch-in
      this.add('-message', `${pokemon.name} is no longer actively stung...`);
    },
  },
},
graspinghands: {
  name: "Grasping Hands",
  shortDesc: "Marks the target; when it switches out it loses 1/3 max HP. Catches a switch like Pursuit. Ghosts are immune.",
  type: "Fighting",
  category: "Status",
  accuracy: 100,
  pp: 3,
  noPPBoosts: true,
  priority: 1,
  basePower: 0,
  target: "normal",
  flags: {protect: 1, mirror: 1},

  beforeTurnCallback(pokemon) {
    pokemon.addVolatile('graspinghandsready');
  },

  // If the pre-switch catch already fired this turn, abort the normal resolution
  onTry(source, target, move) {
    const ready = source.volatiles['graspinghandsready'];
    if (ready && (ready as any).consumed) {
      // Optional cosmetic: keep animation from replaying
      this.attrLastMove('[still]');
      this.add('-message', `${source.name}'s Grasping Hands already ensnared its target!`);
      return null;
    }
  },

  onTryHit(target, source, move) {
    // Respect Fighting immunities (e.g., Ghost)
    if (!this.dex.getImmunity('Fighting', target)) {
      this.add('-immune', target, '[from] type');
      return null;
    }
  },

  onHit(target, source) {
    if (!target.addVolatile('graspinghandsmark', source)) return;
    this.add('-message', `${target.name} is ensnared by Grasping Hands!`);
  },

  onAfterMove(source) {
    if (source.volatiles['graspinghandsready']) source.removeVolatile('graspinghandsready');
  },
},
adaptiveforce: {
  name: "Adaptive Force",
  shortDesc: "STAB move. Chooses user's type that hits target harder. Uses higher offensive stat.",
  desc: "On use, this move changes its type to whichever of the user's types is most effective against the target. If both are equal, the first type is chosen. Damage uses the higher of the user's Attack or Special Attack.",
  basePower: 80,
  accuracy: 100,
  pp: 10,
  priority: 0,
  ignoreImmunity: true,
  category: "Special", // overridden
  flags: {protect: 1, mirror: 1},
  onModifyMove(move, pokemon, target) {
    if (!target) return; // just in case

    const types = pokemon.getTypes();
    if (!types.length) return;

    // default to the first type
    let bestType = types[0];
    let bestMod = this.dex.getEffectiveness(types[0], target);

    // check second type if present
    if (types[1]) {
      const mod2 = this.dex.getEffectiveness(types[1], target);
      if (mod2 > bestMod) {
        bestType = types[1];
        bestMod = mod2;
      }
    }

    move.type = bestType;

    // Photon Geyser logic: whichever offensive stat is higher
    if (pokemon.getStat('atk', false, true) > pokemon.getStat('spa', false, true)) {
      move.category = 'Physical';
    } else {
      move.category = 'Special';
    }
  },
  secondary: null,
  target: "normal",
  type: "Normal", // placeholder only
},
soulrend: {
	name: "Soul Rend",
	shortDesc: "Ignores abilities, double power if target is statused",
	basePower: 110,
	category: 'Special',
	target: 'normal',
	flags: {},
	ignoreAbility: true,
	pp: 5,
	noPPBoosts: true,
	accuracy: 100,
	type: 'Ghost',
	priority: 0,
	basePowerCallback(pokemon, target, move) {
			if (target.status || target.hasAbility('comatose')) {
				this.debug('BP doubled from status condition');
				return move.basePower * 2;
			}
			return move.basePower;
		},
},


  // ===== Team A – Pyrelith
  volcaniccrush: {
    name: "Volcanic Crush",
    shortDesc: "100 BP Rock; 30% chance to trap target for 2 turns.",
    accuracy: 95,
    basePower: 100,
    pp: 10,
    category: "Physical",
    priority: 0,
    flags: {contact: 1, punch: 1},
    secondary: {
      chance: 30,
      onHit(target) {
        target.addVolatile('partiallytrapped');
      },
    },
    target: "normal",
    type: "Rock",
  },
  ashenbreath: {
    name: "Ashen Breath",
    shortDesc: "80 BP Fire; 20% burn; lowers target’s accuracy by 1.",
    accuracy: 100,
    basePower: 80,
    pp: 15,
	priority: 0,
    category: "Special",
    flags: {protect: 1, mirror: 1},
    secondaries: [
      {chance: 20, status: 'brn'},
      {chance: 100, boosts: {accuracy: -1}},
    ],
    target: "normal",
    type: "Fire",
  },
  stonearmor: {
    name: "Stone Armor",
    shortDesc: "Raises user's Def by 2 and SpD by 1.",
    accuracy: true,
    basePower: 0,
	priority: 0,
    pp: 20,
    category: "Status",
    flags: {snatch: 1},
    boosts: {def: 2, spd: 1},
    target: "self",
    type: "Rock",
  },

  // ===== Team A – Glaciarch
  auroraray: {
  name: "Aurora Ray",
  shortDesc: "100 BP Ice; 10% freeze (30% in Snow); always hits in Snow.",
  accuracy: 90,
  basePower: 100,
  priority: 0,
  pp: 10,
  category: "Special",
  flags: {protect: 1, mirror: 1},
  onModifyMove(move) {
    // Support both 'snow' (Gen 9) and 'hail' just in case
    const snowy = this.field.isWeather('snow') || this.field.isWeather('hail');
    if (snowy) {
      move.accuracy = true;
      // raise any freeze secondary on this move to 30%
      if (move.secondaries) {
        for (const sec of move.secondaries) {
          if (sec.status === 'frz') sec.chance = 30;
        }
      }
    }
  },
  secondary: {chance: 10, status: 'frz'},
  target: "normal",
  type: "Ice",
},
  moonblossom: {
    name: "Moonblossom",
    shortDesc: "75 BP Fairy; heals user for 50% of damage dealt.",
    accuracy: 100,
    basePower: 75,
	priority: 0,
    pp: 15,
    category: "Special",
    flags: {protect: 1, mirror: 1, heal: 1},
    drain: [1, 2],
    target: "normal",
    type: "Fairy",
  },
  mysticpulse: {
    name: "Mystic Pulse",
    shortDesc: "80 BP Psychic; 20% confuse.",
    accuracy: 100,
    basePower: 80,
	priority: 0,
    pp: 15,
    category: "Special",
    flags: {protect: 1, mirror: 1, pulse: 1},
    secondary: {chance: 20, volatileStatus: 'confusion'},
    target: "normal",
    type: "Psychic",
  },

  // ===== Team A – Terrabite
  earthrend: {
    name: "Earthrend",
    shortDesc: "100 BP Ground; ignores Levitate/airborne.",
    accuracy: 95,
    basePower: 100,
    pp: 10,
	priority: 0,
    category: "Physical",
    flags: {protect: 1, contact: 1},
    onModifyMove(move, source, target) {
      move.ignoreImmunity = {Ground: true};
    },
    target: "normal",
    type: "Ground",
  },
  drillram: {
    name: "Drill Ram",
    shortDesc: "85 BP Steel; 30% chance to lower Defense by 1.",
    accuracy: 100,
    basePower: 85,
    pp: 15,
	priority: 0,
    category: "Physical",
    flags: {contact: 1, protect: 1},
    secondary: {chance: 30, boosts: {def: -1}},
    target: "normal",
    type: "Steel",
  },
  spikebarrage: {
    name: "Spike Barrage",
    shortDesc: "40 BP; hits 2–5 times; each hit 10% flinch.",
    accuracy: 100,
    basePower: 40,
    pp: 15,
	priority: 0,
    category: "Physical",
    multihit: [2, 5],
    flags: {protect: 1, contact: 1},
    secondaries: [{chance: 10, volatileStatus: 'flinch'}],
    target: "normal",
    type: "Ground",
  },

  // ===== Team A – Zephyren
  cyclonewing: {
    name: "Cyclone Wing",
    shortDesc: "90 BP Flying (wind); clears hazards/screens on hit.",
    accuracy: 100,
    basePower: 90,
    pp: 10,
	priority: 0,
    category: "Physical",
    flags: {protect: 1, contact: 1, wind: 1},
    onAfterHit(target, source) {
      const side = target.side;
      for (const cond of ['spikes','toxicspikes','stealthrock','stickyweb','reflect','lightscreen','auroraveil']) {
        if (side.removeSideCondition(cond)) {
          this.add('-sideend', side, this.dex.conditions.get(cond).name, '[from] move: Cyclone Wing');
        }
      }
    },
    target: "normal",
    type: "Flying",
  },
  
  skyreprieve: {
    name: "Sky Reprieve",
    shortDesc: "Heals ally 50% and cures status.",
    accuracy: true,
    basePower: 0,
    pp: 5,
	priority: 0,
    category: "Status",
    flags: {allyanim: 1, snatch: 1, heal: 1},
    onHit(target, source) {
      if (!target?.hp) return false;
      this.heal(target.baseMaxhp / 2, target);
      target.cureStatus();
    },
    target: "adjacentAllyOrSelf",
    type: "Flying",
  },

  // ===== Team A – Aqualume
  mindstream: {
  name: "Mindstream",
  shortDesc: "85 BP Psychic; heals lowest-HP ally for 50% of damage dealt.",
  accuracy: 100,
  basePower: 85,
  priority: 0,
  pp: 10,
  category: "Special",
  type: "Psychic",
  target: "normal",
  flags: {protect: 1, mirror: 1, pulse: 1},

  // Run once after the user's move finishes; totalDamage is aggregated here
  onAfterMoveSecondarySelf(source, target, move) {
    if (!move || move.category === 'Status') return;

    // Total damage can be number or number[] (multi-hit/spread)
    let total = 0;
    if (typeof move.totalDamage === 'number') {
      total = move.totalDamage;
    } else if (Array.isArray(move.totalDamage)) {
      for (const d of move.totalDamage) total += (typeof d === 'number' ? d : 0);
    }
    if (!total) return;

    const healAmount = Math.floor(total * 0.5);
    if (!healAmount) return;

    // Consider *all* living teammates (active + bench), including the user
    const team = source.side.pokemon.filter(p => p && !p.fainted && p.hp > 0);
    if (!team.length) return;

    // Pick the ally with the lowest % HP (tie-breaker: lower absolute HP)
    let healTarget = team[0];
    for (const p of team) {
      const pr = p.hp / p.maxhp;
      const hr = healTarget.hp / healTarget.maxhp;
      if (pr < hr || (pr === hr && p.hp < healTarget.hp)) healTarget = p;
    }

    // Heal actives normally; heal bench safely (sethp + log)
    if (healTarget.isActive) {
      this.heal(healAmount, healTarget, source, this.dex.getActiveMove('mindstream'));
    } else {
      const newHp = Math.min(healTarget.hp + healAmount, healTarget.maxhp);
      if (newHp !== healTarget.hp) {
        healTarget.sethp(newHp);
        this.add('-heal', healTarget, healTarget.getHealth, '[from] move: Mindstream', `[of] ${source}`);
      }
    }
  },
},

  tidalprism: {
    name: "Tidal Prism",
    shortDesc: "95 BP Water; 20% chance to lower SpA.",
    accuracy: 100,
    basePower: 95,
	priority: 0,
    pp: 10,
    category: "Special",
    flags: {protect: 1, mirror: 1},
    secondary: {chance: 20, boosts: {spa: -1}},
    target: "normal",
    type: "Water",
  },
  // ===== Team A – Floracern
  
  lotusfist: {
    name: "Lotus Fist",
    shortDesc: "80 BP Fighting; heals user 50% of damage dealt.",
    accuracy: 100,
    basePower: 80,
    pp: 15,
	priority: 0,
    category: "Physical",
    flags: {contact: 1, protect: 1, punch: 1, heal: 1},
    drain: [1, 2],
    target: "normal",
    type: "Fighting",
  },
  
  naturesresolve: {
    name: "Nature’s Resolve",
    shortDesc: "Raises user’s Atk and Def by 1.",
    accuracy: true,
    basePower: 0,
	priority: 0,
    pp: 20,
    category: "Status",
    flags: {snatch: 1},
    boosts: {atk: 1, def: 1},
    target: "self",
    type: "Grass",
  },

  // ===== Team B – Umbraquill
  midnightslash: {
    name: "Midnight Slash",
    shortDesc: "85 BP Dark; high crit.",
    accuracy: 100,
    basePower: 85,
    pp: 15,
	priority: 0,
    category: "Physical",
    flags: {contact: 1, protect: 1, slicing: 1},
    critRatio: 2,
    target: "normal",
    type: "Dark",
  },
  dreadgale: {
    name: "Dread Gale",
    shortDesc: "100 BP Flying (wind); 30% flinch.",
    accuracy: 85,
    basePower: 100,
    pp: 10,
	priority: 0,
    category: "Special",
    flags: {protect: 1, mirror: 1, wind: 1},
    secondary: {chance: 30, volatileStatus: 'flinch'},
    target: "normal",
    type: "Flying",
  },
  feathercloak: {
    name: "Feather Cloak",
    shortDesc: "Raises user’s Evasion and Spe by 1.",
    accuracy: true,
    basePower: 0,
	priority: 0,
    pp: 15,
    category: "Status",
    flags: {snatch: 1},
    boosts: {evasion: 1, spe: 1},
    target: "self",
    type: "Flying",
  },
  toxicmaw: {
    name: "Toxic Maw",
    shortDesc: "90 BP Poison; 50% badly poisons.",
    accuracy: 100,
    basePower: 90,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {contact: 1, protect: 1, bite: 1},
    secondary: {chance: 50, status: 'tox'},
    target: "normal",
    type: "Poison",
  },
  dracospike: {
    name: "Dracospike",
    shortDesc: "100 BP Dragon; -1 Spe.",
    accuracy: 90,
    basePower: 100,
	priority: 0,
	pp: 10,
    category: "Special",
    flags: {protect: 1, mirror: 1},
    secondary: {chance: 100, boosts: {spe: -1}},
    target: "normal",
    type: "Dragon",
  },
  venomstorm: {
    name: "Venom Storm",
    shortDesc: "65 BP Poison; hits 2–3 times; each hit 10% flinch.",
    accuracy: 100,
    basePower: 65,
	priority: 0,
	pp: 10,
    category: "Special",
    multihit: [2, 3],
    flags: {protect: 1},
    secondaries: [{chance: 10, volatileStatus: 'flinch'}],
    target: "normal",
    type: "Poison",
  },
  scaleguard: {
    name: "Scale Guard",
    shortDesc: "+1 Def, +1 SpD; cure status.",
    accuracy: true,
    basePower: 0,
	priority: 0,
	pp: 10,
    category: "Status",
    flags: {snatch: 1},
    boosts: {def: 1, spd: 1},
    onHit(pokemon) {
      pokemon.cureStatus();
    },
    target: "self",
    type: "Dragon",
  },

  // ===== Team B – Oblivara
  hauntspire: {
    name: "Hauntspire",
    shortDesc: "85 BP Ghost; -1 SpD.",
    accuracy: 100,
	priority: 0,
	pp: 10,
    basePower: 85,
    category: "Special",
    flags: {protect: 1, mirror: 1},
    secondary: {chance: 100, boosts: {spd: -1}},
    target: "normal",
    type: "Ghost",
  },
  creepingroot: {
    name: "Creeping Root",
    shortDesc: "90 BP Grass; traps 2–3 turns.",
    accuracy: 100,
    basePower: 90,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {contact: 1, protect: 1},
    onHit(target) {
      target.addVolatile('partiallytrapped');
    },
    target: "normal",
    type: "Grass",
  },
  
  lifesap: {
  name: "Life Sap",
  shortDesc: "Drains 50% of target's current HP and heals the user.",
  accuracy: 100,
  basePower: 0,
  priority: 0,
  pp: 10,
  category: "Status",
  flags: {protect: 1, reflectable: 1},
  onHit(target, source) {
    if (!target?.hp) return false;
    // 50% of current HP, rounded down
    const amount = Math.floor(target.hp / 2);
    if (amount <= 0) return false;
    this.damage(amount, target, source);
    this.heal(amount, source);
  },
  target: "normal",
  type: "Grass",
},

  // ===== Team B – Ferraclaw
  ironrend: {
    name: "Iron Rend",
    shortDesc: "100 BP Steel; breaks Protect and Sub.",
    accuracy: 100,
    basePower: 100,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {sound: 1, contact: 1},
    breaksProtect: true,
    // Sub interaction handled via item/flag synergy; allow damage through sub with 'authentic' feel
    target: "normal",
    type: "Steel",
  },
  shadowrend: {
    name: "Shadow Rend",
    shortDesc: "95 BP Dark; 20% flinch.",
    accuracy: 95,
	priority: 0,
	pp: 10,
    basePower: 95,
    category: "Physical",
    flags: {contact: 1, protect: 1},
    secondary: {chance: 20, volatileStatus: 'flinch'},
    target: "normal",
    type: "Dark",
  },
  metallicroar: {
    name: "Metallic Roar",
    shortDesc: "80 BP Steel (Special); -1 Atk to target.",
    accuracy: 100,
    basePower: 80,
	priority: 0,
	pp: 10,
    category: "Special",
    flags: {protect: 1, sound: 1, mirror: 1},
    secondary: {chance: 100, boosts: {atk: -1}},
    target: "normal",
    type: "Steel",
  },
  armorlock: {
  name: "Armor Lock",
  shortDesc: "User +2 Def; Taunts the target.",
  accuracy: true,
  basePower: 0,
  priority: 0,
  pp: 10,
  category: "Status",
  flags: {reflectable: 1, protect: 1},
  self: {
    boosts: {def: 2}, // boosts the user
  },
  onHit(target) {
    target.addVolatile('taunt'); // taunts the foe
  },
  target: "normal",
  type: "Steel",
},


  // ===== Team B – Embergeist
  wraithflame: {
  name: "Wraithflame",
  shortDesc: "95 BP Ghost (Special); 20% chance to -1 SpD.",
  accuracy: 100,
  basePower: 95,
  priority: 0,
  pp: 10,
  category: "Special",
  flags: {protect: 1, mirror: 1},
  secondary: {chance: 20, boosts: {spd: -1}},
  target: "normal",
  type: "Ghost",

  // Play Fire Blast's client animation
  onPrepareHit(target, source, move) {
    this.add('-anim', source, 'Fire Blast', target);
  },
},
  spectralblaze: {
    name: "Spectral Blaze",
    shortDesc: "90 BP Fire; 30% burn.",
    accuracy: 100,
    basePower: 90,
	priority: 0,
	pp: 10,
    category: "Special",
    flags: {protect: 1, mirror: 1},
    secondary: {chance: 30, status: 'brn'},
	onPrepareHit(target, source, move) {
    this.add('-anim', source, 'Shadow Ball', target);
  },
    target: "normal",
    type: "Fire",
  },

  // ===== Team B – Thornox
  pincercrush: {
    name: "Pincer Crush",
    shortDesc: "90 BP Bug; 30% -1 Def.",
    accuracy: 100,
    basePower: 90,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {contact: 1, protect: 1, bite: 1},
    secondary: {chance: 30, boosts: {def: -1}},
    target: "normal",
    type: "Bug",
  },
  martiallunge: {
    name: "Martial Lunge",
    shortDesc: "80 BP Fighting; if it KOs, user +1 Atk.",
    accuracy: 100,
    basePower: 80,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {contact: 1, protect: 1},
    onAfterMoveSecondarySelf(pokemon, target, move) {
			if (!target || target.fainted || target.hp <= 0) this.boost({ atk: 1 }, pokemon, pokemon, move);
		},
    target: "normal",
    type: "Fighting",
  },
  
  crashingpalm: {
    name: "Crashing Palm",
    shortDesc: "100 BP Fighting; 30% paralyze.",
    accuracy: 90,
    basePower: 100,
	priority: 0,
	pp: 10,
    category: "Physical",
    flags: {contact: 1, protect: 1, punch: 1},
    secondary: {chance: 30, status: 'par'},
    target: "normal",
    type: "Fighting",
  },

 loadoutshift: {
  name: "Loadout Shift",
  shortDesc:
    "Protect-style block this turn, then swap pages: [TM ≥70 (best cat), Metronome-eligible, Signature (best cat), Loadout Shift]. Using it again swaps back; each alt entry re-rolls all three.",
  type: "Normal",
  basePower: 0,
  category: "Status",
  accuracy: true,
  pp: 10,
  priority: 4,
  target: "self",
  flags: { noassist: 1, failcopycat: 1 },
  stallingMove: true,
  volatileStatus: 'protect',

  onPrepareHit(pokemon) {
    return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  },

  onHit(pokemon) {
    pokemon.addVolatile('stall');

    (pokemon as any).m ??= {};
    const data = (pokemon as any).m;

    // Cache original moves once
    if (!data.ls_orig) {
      data.ls_orig = (pokemon.moveSlots || []).map(s => s.id as ID);
      if (!data.ls_orig.includes('loadoutshift' as ID)) {
        if (data.ls_orig.length >= 4) data.ls_orig[3] = 'loadoutshift' as ID;
        else data.ls_orig.push('loadoutshift' as ID);
      }
      data.ls_onAlt = false;
      data.ls_swaps = 0;
    }

    const overwriteMoves = (ids: ID[]) => {
      pokemon.moveSlots.splice(0, pokemon.moveSlots.length);
      (pokemon.baseMoveSlots as any).splice(0, (pokemon.baseMoveSlots as any).length);
      for (const id of ids) {
        const mv = this.dex.moves.get(id);
        const slot = {
          move: mv.name, id: mv.id as ID, pp: mv.pp, maxpp: mv.pp, target: mv.target,
          disabled: false, disabledSource: '', used: false,
        };
        pokemon.moveSlots.push({ ...slot });
        (pokemon.baseMoveSlots as any).push({ ...slot });
      }
    };

    // ---------- Global pools (cached once per battle) ----------
    const getGlobalTMIds = (battle: Battle): Set<ID> => {
      (battle as any).m ??= {};
      const cache = (battle as any).m;
      if (cache.globalTMIds) return cache.globalTMIds as Set<ID>;

      const tmSet = new Set<ID>();
      const learnsets = (this.dex.data as any).Learnsets as
        Record<string, {learnset?: Record<string, any>}>;
      for (const sid in learnsets) {
        const ls = learnsets[sid]?.learnset; if (!ls) continue;
        for (const mid in ls) {
          const entry: any = ls[mid];
          const srcs: string[] = Array.isArray(entry)
            ? entry
            : Array.isArray(entry?.learned) ? entry.learned
            : Object.keys(entry || {});
          if (srcs.some(s => /M\b/.test(s) || /HM\b/.test(s) || /TR\b/.test(s))) {
            tmSet.add(this.toID(mid) as ID);
          }
        }
      }
      cache.globalTMIds = tmSet;
      return tmSet;
    };

    // Signature = learned by ≤2 species by non-TM methods (heuristic)
    const getGlobalSignatureIds = (battle: Battle): Set<ID> => {
      (battle as any).m ??= {};
      const cache = (battle as any).m;
      if (cache.signatureIds) return cache.signatureIds as Set<ID>;

      const learnsets = (this.dex.data as any).Learnsets as
        Record<string, {learnset?: Record<string, any>}>;
      const counts = new Map<ID, number>();
      const isTMTag = (s: string) => /M\b/.test(s) || /HM\b/.test(s) || /TR\b/.test(s);

      for (const sid in learnsets) {
        const ls = learnsets[sid]?.learnset; if (!ls) continue;
        for (const mid in ls) {
          const id = this.toID(mid) as ID;
          const entry: any = ls[mid];
          const srcs: string[] = Array.isArray(entry)
            ? entry
            : Array.isArray(entry?.learned) ? entry.learned
            : Object.keys(entry || {});
          if (!srcs.some(isTMTag)) {
            counts.set(id, (counts.get(id) || 0) + 1);
          }
        }
      }

      const sig = new Set<ID>();
      for (const [id, n] of counts) if (n <= 2) sig.add(id);
      cache.signatureIds = sig;
      return sig;
    };

    const pickOne = (arr: ID[]) => (arr.length ? arr[this.random(arr.length)] : undefined);

    // ---------- Slot builders ----------
    // Slot 1: TM/TR/HM, ≥70 BP, matches higher offensive CATEGORY (runtime), skip charge/recharge, no dupes
    const buildSlot1_TM = (): ID | undefined => {
      const atk = pokemon.getStat('atk', false, true);
      const spa = pokemon.getStat('spa', false, true);
      const bestCat: 'Physical' | 'Special' = atk >= spa ? 'Physical' : 'Special';

      const tmIds = getGlobalTMIds(this);
      const origSet = new Set<ID>(data.ls_orig as ID[]);
      const bans = new Set<ID>(['struggle' as ID, 'loadoutshift' as ID]);

      const cands: ID[] = [];
      for (const id of tmIds) {
        if (origSet.has(id) || bans.has(id)) continue;
        const mv = this.dex.moves.get(id);
        if (!mv?.exists) continue;
        if (mv.category !== bestCat) continue;
        if (typeof mv.basePower !== 'number' || mv.basePower < 70) continue;
        if (mv.isZ || (mv as any).isMax) continue;
        if ((mv as any).ohko) continue;
        if (mv.flags?.charge || mv.flags?.recharge) continue;
        cands.push(id);
      }
      return pickOne(cands);
    };

    // Slot 2: Metronome-eligible (noMetronome=false), exclude Z/Max/Metronome/Struggle, avoid dupes
    const buildSlot2_MetEligible = (): ID | undefined => {
      const origSet = new Set<ID>(data.ls_orig as ID[]);
      const bans = new Set<ID>(['metronome' as ID, 'struggle' as ID, 'loadoutshift' as ID]);

      const cands: ID[] = [];
      for (const mv of this.dex.moves.all()) {
        if (!mv?.exists) continue;
        const id = mv.id as ID;
        if (origSet.has(id) || bans.has(id)) continue;
        if ((mv as any).noMetronome) continue;
        if (mv.isZ || (mv as any).isMax) continue;
        cands.push(id);
      }
      return pickOne(cands);
    };

    // Slot 3: Signature move whose CATEGORY matches higher attacking BASE stat (Atk vs SpA).
    // No typing requirement; exclude Z/Max; avoid dupes.
    const buildSlot3_SignatureBestBaseCat = (): ID | undefined => {
      const {atk: bAtk, spa: bSpa} = pokemon.species.baseStats;
      const bestCat: 'Physical' | 'Special' = bAtk >= bSpa ? 'Physical' : 'Special';

      const sigIds = getGlobalSignatureIds(this);
      const origSet = new Set<ID>(data.ls_orig as ID[]);
      const bans = new Set<ID>(['struggle' as ID, 'loadoutshift' as ID]);

      const cands: ID[] = [];
      for (const id of sigIds) {
        if (origSet.has(id) || bans.has(id)) continue;
        const mv = this.dex.moves.get(id);
        if (!mv?.exists) continue;
        if (mv.isZ || (mv as any).isMax) continue;
        if (mv.category !== bestCat) continue; // category match to base Atk/SpA
        cands.push(id);
      }
      return pickOne(cands);
    };

    // ---------- Assemble alt page ----------
    if (!data.ls_onAlt) {
      const picks: ID[] = [];

      const p1 = buildSlot1_TM();
      if (p1) picks.push(p1);

      const seen = new Set<ID>([...(data.ls_orig as ID[]), ...picks]);

      let p2 = buildSlot2_MetEligible();
      for (let i = 0; i < 30 && p2 && seen.has(p2); i++) p2 = buildSlot2_MetEligible();
      if (p2) { picks.push(p2); seen.add(p2); }

      let p3 = buildSlot3_SignatureBestBaseCat();
      for (let i = 0; i < 30 && p3 && seen.has(p3); i++) p3 = buildSlot3_SignatureBestBaseCat();
      if (p3) { picks.push(p3); seen.add(p3); }

      while (picks.length < 3) picks.push('tackle' as ID); // extreme safety
      picks.push('loadoutshift' as ID);

      overwriteMoves(picks.slice(0, 4));
      data.ls_onAlt = true;
      data.ls_swaps++;
      this.add('-message', `${pokemon.name} shifted its loadout (Alt Page ${data.ls_swaps})!`);
    } else {
      overwriteMoves(data.ls_orig as ID[]);
      data.ls_onAlt = false;
      this.add('-message', `${pokemon.name} reverted to its original loadout!`);
    }
  },
},
serratedfangs: {
  name: "Serrated Fangs",
  shortDesc: "Biting move. Inflicts Bleeding (1/16 max HP/turn) until the foe switches.",
  desc: "A biting attack. On hit, the target becomes Bleeding. Bleeding causes the target to lose 1/16 of its maximum HP at the end of each turn and ends when the target leaves the field. Does not stack.",
  accuracy: 90,
  basePower: 75,
  pp: 15,
  priority: 0,
  category: "Physical",
  type: "Blood",
  target: "normal",
  flags: {contact: 1, bite: 1, protect: 1, metronome: 1, mirror: 1}, // Strong Jaw boosts via `bite`
  onHit(target) {
    // Apply our custom volatile; no stacking
    if (!target.volatiles['bleeding']) {
      target.addVolatile('bleeding');
    }
  },
  secondary: null,
  // Optional message flair (shown on successful application is handled by the volatile)
},
steamburst: {
  name: "Steam Burst",
  shortDesc: "60 BP Water. 2× power if target's side has Steam Field; then clears it.",
  accuracy: 100,
  basePower: 60,
  pp: 10,
  priority: 0,
  category: "Special",
  flags: {protect: 1, mirror: 1},

  onBasePower(basePower, user, target, move) {
    const side = target?.side;
    if (side?.sideConditions['steamfield']) {
      return this.chainModify(2);
    }
  },

  onAfterHit(target, source) {
    const side = target?.side;
    if (!side) return;
    if (side.sideConditions['steamfield']) {
      side.removeSideCondition('steamfield'); // will also emit -sideend
      this.add('-message', `Steam Field dissipated!`);

      // Tell Magma Vein not to re-apply this move
      (source as any).skipMagmaVeinSteamApply = true;
    }
  },

  target: "normal",
  type: "Water",
},

frozenbarrier: {
  num: 30002, // pick any free ID
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Frozen Barrier",
  shortDesc: "Protect. If foe hits with a contact move they are frozen",
  pp: 10,
  priority: 4,
  flags: { noassist: 1, failcopycat: 1 }, // match Baneful Bunker behavior
  stallingMove: true,
  volatileStatus: 'frozenbarrier',
  onPrepareHit(pokemon) {
    return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
  },
  onHit(pokemon) {
    pokemon.addVolatile('stall');
  },
  condition: {
    duration: 1,
    onStart(target) {
      this.add('-singleturn', target, 'move: Protect');
    },
    onTryHitPriority: 3,
    onTryHit(target, source, move) {
      // Block moves affected by Protect
      if (!move.flags['protect']) {
        if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
        if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
        return;
      }
      if (move.smartTarget) {
        move.smartTarget = false;
      } else {
        this.add('-activate', target, 'move: Protect');
      }

      // Reset Outrage-style lock if applicable
      const lockedmove = source.getVolatile('lockedmove');
      if (lockedmove) {
        if (source.volatiles['lockedmove'].duration === 2) {
          delete source.volatiles['lockedmove'];
        }
      }

      // Contact into the protect -> put the attacker to freeze
      if (this.checkMoveMakesContact(move, source, target)) {
        source.trySetStatus('frz', target);
      }
      return this.NOT_FAIL;
    },
    onHit(target, source, move) {
      // Z/Max-powered moves that make contact and get blocked also trigger freeze
      if (move.isZOrMaxPowered && this.checkMoveMakesContact(move, source, target)) {
        source.trySetStatus('frz', target);
      }
    },
  },
  secondary: null,
  target: "self",
  type: "Ice",
  zMove: { boost: { def: 1 } }, // optional, mirrors Baneful Bunker
  contestType: "Cute",
},

dracovortex: {
    name: "Draco Vortex",
    shortDesc: "100 BP Dragon; forces target to switch. Cannot be used two turns in a row.",
    accuracy: 90,
    basePower: 100,
    pp: 5,
    priority: 0,
    category: "Special",
    type: "Dragon",
    target: "normal",
    flags: {protect: 1, mirror: 1, cantusetwice: 1},
    forceSwitch: true,
  },
tornado: {
    name: "Tornado",
    shortDesc: "80 BP Flying, 50% chance to confuse the target.",
    accuracy: 90,
    basePower: 80,
    pp: 15,
    priority: 0,
    category: "Special",
    type: "Flying",
    target: "normal",
    flags: {protect: 1, mirror: 1, wind: 1}, // wind flag lets abilities like Wind Rider interact
    secondary: {
      chance: 50,
      volatileStatus: 'confusion',
    },
  },
  clarityveil: {
    name: "Clarity Veil",
    accuracy: true,
    basePower: 0,
	shortDesc: 'Sets aurora veil like screen on users side for 5 turns',
    pp: 10,
    priority: 0,
    category: "Status",
    type: "Psychic",
    target: "allySide",
    flags: {snatch: 1},
    sideCondition: 'clarityveil',

    condition: {
      name: "Clarity Veil",
      duration: 5,
      onAnyModifyDamage(damage, source, target, move) {
        if (target !== source && this.effectState.target.hasAlly?.(target)) {
          if ((target.side.getSideCondition('reflect') && this.getCategory(move) === 'Physical') ||
              (target.side.getSideCondition('lightscreen') && this.getCategory(move) === 'Special')) {
            return;
          }
          if (!target.getMoveHitData(move).crit && !move.infiltrates) {
            if (this.activePerHalf > 1) return this.chainModify([2732, 4096]);
            return this.chainModify(0.5);
          }
        }
      },
      onSideStart(side) {
        // 🔸 Emit the Aurora Veil tag so the client shows the same overlay
        this.add('-sidestart', side, 'move: Aurora Veil');
        // Optional: also print a clarifying line for your custom move
        this.add('-message', `${side.name} is protected by Clarity Veil!`);
      },
      onSideEnd(side) {
        // 🔸 End with Aurora Veil tag for matching fade-out
        this.add('-sideend', side, 'move: Aurora Veil');
        this.add('-message', `Clarity Veil faded!`);
      },
    },
  },
aquabarrier: {
    name: "Aqua Barrier",
    shortDesc: "Raises the user's Sp. Def by 3 stages.",
    accuracy: true,
    basePower: 0,
    pp: 10,
    priority: 0,
    category: "Status",
    type: "Water",
    target: "self",
    flags: {snatch: 1},
    boosts: {spd: 3},
  },
vinebreaker: {
  name: "Vinebreaker",
  shortDesc: "90 BP Grass. Ignores Reflect/Light Screen/Aurora Veil (does not remove them).",
  accuracy: 100,
  basePower: 90,
  pp: 15,
  priority: 0,
  category: "Physical",
  type: "Grass",
  target: "normal",
  flags: {contact: 1, protect: 1, mirror: 1},

  // Make this move act like Infiltrator so screens don't reduce damage
  onModifyMove(move) {
    (move as any).infiltrates = true;
  },

  onTryHit(target, source, move) {
    this.add('-message', `${source.name}'s Vinebreaker sliced through protective screens!`);
  },
},

  sporeguard: {
    name: "Sporeguard",
    shortDesc: "For 5 turns, prevents status and bounces back status moves used on the user’s side.",
    accuracy: true,
    basePower: 0,
    pp: 10,
    priority: 0,
    category: "Status",
    type: "Grass",
    target: "allySide",
    flags: {snatch: 1},
    sideCondition: 'sporeguard',
  },
dualswap: {
    name: "Dual Swap",
    shortDesc: "Swaps the target's Atk↔Def and SpA↔SpD until it switches out.",
    accuracy: true,
    basePower: 0,
    pp: 10,
    priority: 0,
    category: "Status",
    type: "Psychic",
    target: "normal",
    flags: {protect: 1, mirror: 1},
    
    onTryHit(target) {
        // Fail if stats are already swapped to prevent issues
        if (target.volatiles['dualswap']) {
            return false;
        }
    },
    
    onHit(target) {
        target.addVolatile('dualswap');
    },

    condition: {
        // Crucial Change 1: Store original stats for proper reversal
        onStart(pokemon) {
            this.add('-start', pokemon, 'move: Dual Swap');
            
            // Store the original stats (optional, but good practice for clarity)
            // The volatile can track what was swapped.
            pokemon.volatiles['dualswap'].originalStats = {
                atk: pokemon.storedStats.atk,
                def: pokemon.storedStats.def,
                spa: pokemon.storedStats.spa,
                spd: pokemon.storedStats.spd,
            };

            // Perform the swap on storedStats
            const s = pokemon.storedStats;
            [s.atk, s.def] = [s.def, s.atk];
            [s.spa, s.spd] = [s.spd, s.spa];
            
            // Announce the stat change
            this.add('-message', `${pokemon.name}'s offensive and defensive capabilities were swapped!`);
        },
        
        // Crucial Change 2: Reverse the swap using the same logic
        onEnd(pokemon) {
            // Reverse the swap on storedStats
            const s = pokemon.storedStats;
            [s.atk, s.def] = [s.def, s.atk];
            [s.spa, s.spd] = [s.spd, s.spa];

            this.add('-end', pokemon, 'Dual Swap');
        },
        
        // Crucial Change 3: The volatile must be removed on switch out
        onSwitchOut(pokemon) {
            pokemon.removeVolatile('dualswap');
        },
    },
},
revvingdrill: {
  num: -1000001, // custom ID
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Revving Drill",
  shortDesc: "Sets Revving on the user. Each turn raises Atk by 1. Clears on switch.",
  pp: 20,
  priority: 0,
  flags: {snatch: 1},
  condition: 'revving',
  self: {
    volatileStatus: 'revving',
  },
  onHit(pokemon) {
    this.add('-message', `${pokemon.name} started revving its drill!`);
  },
  secondary: null,
  target: "self",
  type: "Steel",
},
phantomdive: {
	accuracy: true,
	basePower: 120,
	category: "Physical",
	name: "Phantom Dive",
	shortDesc: "Disappear turn 1, attack turn 2. Breaks Protect",
	pp: 8,
	priority: 0,
	flags: { contact: 1, charge: 1, mirror: 1, nosleeptalk: 1, noassist: 1, failinstruct: 1 },
	breaksProtect: true,
	onTryMove(attacker, defender, move) {
		if (attacker.removeVolatile(move.id)) {
			// Strike turn: show Dive hit animation
			this.add('-anim', attacker, 'Dive', defender);
			return;
		}
		// Charge turn: show Dve vanish/prepare animation
		this.add('-prepare', attacker, 'Dive', defender);
		if (!this.runEvent('ChargeMove', attacker, defender, move)) {
			return;
		}
		attacker.addVolatile('twoturnmove', defender);
		return null;
	},
	condition: {
		duration: 2,
		onInvulnerability: false,
	},
	
	secondary: null,
	target: "normal",
	type: "Dark",
	contestType: "Cool",
},
phantomguard: {
  accuracy: true,
  basePower: 0,
  category: "Status",
  name: "Phantom Guard",
  shortDesc: "5 turns. Stacks to 3 layers (25%/50%/60%) and refreshes on reuse.",
  pp: 10,
  priority: 2, // optional
  target: "allySide",
  type: "Ghost",
  flags: { snatch: 1 },
  sideCondition: 'phantomguard',

  condition: {
    name: 'Phantom Guard',
    duration: 5,

    onSideStart(side, source) {
      this.effectState.layers = 1;   // start at 1 layer
      this.effectState.side = side;  // remember protected side
      this.add('-sidestart', side, 'move: Phantom Guard', '[of] ' + (source?.name || ''), '[layers] 1');
    },

    // Reuse while active: +1 layer (max 3) and refresh duration
    onSideRestart(side, source) {
      const cur = this.effectState.layers || 1;
      const next = this.clampIntRange(cur + 1, 1, 3);
      this.effectState.layers = next;
      this.effectState.duration = 5; // refresh timer

      const pct = next === 1 ? 25 : next === 2 ? 50 : 60;
      this.add('-sidestart', side, 'move: Phantom Guard', '[of] ' + (source?.name || ''), '[refresh]', `[layers] ${next}`);
      this.add('-message', `Phantom Guard strengthens to ${next}/3 layers (${pct}% damage reduction) and is refreshed to 5 turns.`);
    },

    // Apply reduction to damaging attacks that hit this side
    onAnyModifyDamage(damage, source, target, move) {
      if (!target || !move || move.category === 'Status') return;
      if (target.side !== this.effectState.side) return;

      // (Optional) mirror screen exclusions
      if ((move as any).ohko || (move as any).damage) return;
      if (move.id === 'futuresight' || move.id === 'doomdesire') return;

      const layers: number = this.effectState.layers || 1;
      // 1 layer: 0.75, 2 layers: 0.5, 3 layers: 0.4
      const mult = layers === 1 ? [3, 4] : layers === 2 ? [1, 2] : [2, 5];
      return this.chainModify(mult);
    },

    // Per-turn status message
    onResidualOrder: 6, // runs each turn; adjust order as desired
    onResidual(side) {
      const layers: number = this.effectState.layers || 1;
      const pct = layers === 1 ? 25 : layers === 2 ? 50 : 60;
      const turnsLeft = this.effectState.duration; // turns remaining on this effect
      this.add('-message', `Phantom Guard active (${layers}/3 layers): ${pct}% damage reduction. ${turnsLeft} turn${turnsLeft === 1 ? '' : 's'} remaining.`);
    },

    onSideEnd(side) {
      this.add('-sideend', side, 'move: Phantom Guard');
    },
  },
},

soulspark: {
  name: "Soul Spark",
  shortDesc: "Always crits if the target is burned.",
  accuracy: 100,
  basePower: 60,
  category: "Special",
  pp: 15,
  priority: 0,
  flags: { protect: 1, mirror: 1 },
  onModifyMove(move, pokemon, target) {
    // Guarantee a crit against burned targets
    if (target && target.status === 'brn') move.willCrit = true;
  },
  secondary: null,
  target: "normal",
  type: "Ghost",
},

cauterize: {
  name: "Cauterize",
  shortDesc: "Heals the user by 25% of its max HP and burns the target.",
  accuracy: true,
  basePower: 0,
  category: "Status",
  pp: 10,
  priority: 0,
  flags: { protect: 1, reflectable: 1, mirror: 1 },


  onHit(target, source, move) {
    // Try to burn first; if it fails, the move fails (no heal).
    if (!target.trySetStatus('brn', source, move)) return false;

    // Heal user for 1/4 max HP
    const amount = Math.floor(source.baseMaxhp / 4);
    if (amount > 0) this.heal(amount, source);
  },

  target: "normal",
  type: "Fire",
},
swarmguard: {
    num: -1001, // custom ID
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Swarm Guard",
	shortDesc: 'Blocks stat drops. Lowers foes speed if attempted',
    pp: 15,
    priority: 0,
    flags: { snatch: 1 },
    sideCondition: 'swarmguard',
    condition: {
        duration: 5,
        onTryBoost(boost, target, source, effect) {
            // This hook runs for *every* Pokémon on the side with Swarm Guard.
            // Check 1: Infiltrator check (allows Infiltrator to bypass the side condition)
            if (effect.effectType === 'Move' && effect.infiltrates && !target.isAlly(source)) return;

            // Check 2: Block the stat drops, whether they are self-inflicted (Close Combat) or foe-inflicted (Icy Wind)
            let blocked = false;
            let i: BoostID;
            for (i in boost) {
                if (boost[i]! < 0) {
                    delete boost[i];
                    blocked = true;
                }
            }

            if (blocked) {
                this.add('-activate', target, 'move: Swarm Guard');

                // Check 3: Re-apply the speed drop "spice" only if the drop came from a foe
                if (source && target !== source) {
                    // Check to make sure the target has not already maxed out the stat drop
                    if (source.boosts.spe > -6) {
                        this.boost({spe: -1}, source, target, this.effect);
                        this.add('-message', `${source.name} was slowed by the swarming defense!`);
                    }
                }
            }
        },
        onSideStart(side) {
            this.add('-sidestart', side, 'move: Swarm Guard');
        },
        onSideResidualOrder: 26,
        onSideResidualSubOrder: 4,
        onSideEnd(side) {
            this.add('-sideend', side, 'move: Swarm Guard');
        },
    },
    secondary: null,
    target: "allySide",
    type: "Bug",
    contestType: "Beautiful",
},
searingstab: {
		accuracy: true,
		basePower: 50,
		shortDesc: 'Guaranteed crit.',
		category: "Physical",
		name: "Searing Stab",
		pp: 10,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1, slicing: 1 },
		willCrit: true,
		secondary: null,
		target: "normal",
		type: "Fire",
	},
overwhelm: {
		accuracy: 100,
		basePower: 80,
		shortDesc: 'Also super effective against fighting types.',
		category: "Physical",
		name: "Overwhelm",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 , contact: 1},
		onEffectiveness(typeMod, target, type) {
			if (type === 'Fighting') return 1;
		},
		target: "normal",
		type: "Dark",
		contestType: "Beautiful",
	},
evaporate: {
		accuracy: 100,
		basePower: 80,
		shortDesc: 'Also super effective against water types.',
		category: "Special",
		name: "Overwhelm",
		pp: 20,
		priority: 0,
		flags: { protect: 1, mirror: 1, metronome: 1 },
		onEffectiveness(typeMod, target, type) {
			if (type === 'Water') return 1;
		},
		target: "normal",
		type: "Fire",
		contestType: "Beautiful",
	},
	sandyvortex: {
    name: "Sandy Vortex",
    shortDesc: "120 BP Rock. Can't miss in Sandstorm.",
    accuracy: 70,
    basePower: 120,
    pp: 10,
    priority: 0,
    category: "Special",
    type: "Rock",
    target: "normal",
    flags: {protect: 1, mirror: 1},
    onModifyMove(move, source, target) {
      if (this.field.isWeather(['sandstorm'])) move.accuracy = true;
    },
  },

  solarvortex: {
    name: "Solar Vortex",
    shortDesc: "120 BP Fire. Can't miss in Harsh Sunlight.",
    accuracy: 70,
    basePower: 120,
    pp: 10,
    priority: 0,
    category: "Special",
    type: "Fire",
    target: "normal",
    flags: {protect: 1, mirror: 1},
    onModifyMove(move, source, target) {
      if (this.field.isWeather(['sunnyday', 'desolateland'])) move.accuracy = true;
    },
  },

  // ——————————— Team/utility ———————————

  beautycoil: {
    name: "Beauty Coil",
    shortDesc: "Raises SpA, Spe, Accuracy, Evasion by 1; lowers Def, SpD by 2.",
    accuracy: true,
    basePower: 0,
    pp: 2,
    priority: 0,
    category: "Status",
    type: "Fairy",
    target: "self",
    flags: {snatch: 1},
    boosts: {spa: 1, spe: 1, accuracy: 1, evasion: 1, def: -2, spd: -2},
  },

  rootguard: {
    name: "Root Guard",
    shortDesc: "Raises user's Def and SpD by 1.",
    accuracy: true,
    basePower: 0,
    pp: 20,
    priority: 0,
    category: "Status",
    type: "Ground",
    target: "self",
    flags: {snatch: 1},
    boosts: {def: 1, spd: 1},
  },

  // ——————————— Fangs ———————————

  venomfangs: {
    name: "Venom Fangs",
    shortDesc: "85 BP Poison. 20% poison; 10% badly poison.",
    accuracy: 90,
    basePower: 85,
    pp: 16,
    priority: 0,
    category: "Physical",
    type: "Poison",
    target: "normal",
    flags: {contact: 1, protect: 1, mirror: 1, bite: 1},
    // If both proc, PS will apply the last one that lands; that's fine here.
    secondaries: [
      {chance: 20, status: 'psn'},
      {chance: 10, status: 'tox'},
    ],
  },


  // ——————————— Multihit (Rainbow Punching–style) ———————————

  strikingstorm: {
    name: "Striking Storm",
    shortDesc: "Hits 3×: Flying → Dragon → Electric. Continues past immunities.",
    accuracy: 100,
    basePower: 35,
    pp: 16,
    priority: 0,
    category: "Physical",
    flags: {contact: 1, protect: 1, mirror: 1},
    multihit: 3,
    type: "Flying", // placeholder; per-hit type is set dynamically below

    onTryMove(attacker) {
      attacker.addVolatile('strikingstorm');
    },
    condition: {
      duration: 1,
      onStart(pokemon) {
        this.effectState.types = ['Flying','Dragon','Electric'];
        this.effectState.index = 0;
      },
    },
    onTryHit(target, source, move) {
      const vol = source.volatiles['strikingstorm'];
      if (!vol) return;
      const idx = vol.index ?? 0;
      const t = (vol.types as string[])[idx] || 'Flying';
      move.type = t;

      // Keep going even if a given hit would be immune
      move.ignoreImmunity = true;

      // Track would-be immunity for power nulling
      let wouldBeImmune = false;
      if ((t === 'Normal' && target.hasType('Ghost')) ||
          (t === 'Ghost' && target.hasType('Normal')) ||
          (t === 'Psychic' && target.hasType('Dark')) ||
          (t === 'Dragon' && target.hasType('Fairy')) ||
          (t === 'Electric' && target.hasType('Ground')) ||
          (t === 'Ground' && (target.hasType('Flying') ||
                              target.hasAbility('levitate') ||
                              target.volatiles['magnetrise'] ||
                              target.volatiles['telekinesis']))) {
        wouldBeImmune = true;
      }
      (vol as any).immune = wouldBeImmune;

      this.add('-message', `(${t} hit)`);
    },
    onBasePower(basePower, source, target, move) {
      const vol = source.volatiles['strikingstorm'];
      if (!vol) return;
      if ((vol as any).immune) return this.chainModify(0);
    },
    onAfterSubDamage(_d, _t, source, move) {
      if (move.id !== 'strikingstorm') return;
      const vol = source.volatiles['strikingstorm'];
      if (vol) { vol.index++; (vol as any).immune = false; }
    },
    onAfterHit(_t, source, move) {
      if (move.id !== 'strikingstorm') return;
      const vol = source.volatiles['strikingstorm'];
      if (vol) { vol.index++; (vol as any).immune = false; }
    },
    target: "normal",
    secondary: null,
  },

  // ——————————— Ghost tech ———————————

  spiritbeam: {
    name: "Spirit Beam",
    shortDesc: "120 BP Ghost. Ignores Normal immunity; can't miss if user shares a type with target.",
    accuracy: 70,
    basePower: 120,
    pp: 8,
    priority: 0,
    category: "Special",
    type: "Ghost",
    target: "normal",
    flags: {protect: 1, mirror: 1},
    onModifyMove(move, source, target) {
      move.ignoreImmunity = {Ghost: true};
      // If the user shares ANY type with the target, this move can't miss
      const userTypes = source.getTypes();
      const tgtTypes = target?.getTypes?.() ?? [];
      if (tgtTypes.some(t => userTypes.includes(t))) move.accuracy = true;
    },
  },

haunt: {
  name: "Haunt",
  shortDesc: "Neg. prio. Target's next damaging move automatically misses.",
  accuracy: true,
  basePower: 0,
  pp: 4,
  noPPBoosts: true,
  priority: -6,
  category: "Status",
  type: "Ghost",
  target: "normal",
  flags: {protect: 1, reflectable: 1},

  // Don’t stack the effect
  onTryHit(target) {
    if (target.volatiles['haunt']) return false;
  },

  onHit(target, source) {
    target.addVolatile('haunt', source);
    // IMPORTANT: pass a Pokemon token (not just name) after "[of]"
    this.add('-activate', target, 'move: Haunt', `[of] ${source}`);
  },

  // Inline volatile (Lock-On style)
  condition: {
    noCopy: true,
    duration: 2, // same timing as Lock-On (next action window)

    onStart(holder) {
      this.add('-start', holder, 'move: Haunt');
    },

    // Force the holder’s next damaging move to miss, then consume
    onSourceAccuracy(accuracy, target, source, move) {
      if (!move || move.category === 'Status') return;
      source.removeVolatile('haunt');
      return 0; // numeric 0% accuracy (Lock-On uses true to auto-hit)
    },

    // Fallback for always-hit paths that bypass numeric accuracy
    onBeforeMovePriority: 99,
    onBeforeMove(pokemon, target, move) {
      if (!pokemon.volatiles['haunt']) return;
      if (!move || move.category === 'Status') return;

      pokemon.removeVolatile('haunt');

      // Show a miss message safely (target may be undefined/spread)
      if (target && !target.fainted) {
        this.add('-miss', pokemon, target);
      } else {
        this.add('-miss', pokemon);
      }
      return false;
    },

    onEnd(holder) {
      this.add('-end', holder, 'move: Haunt');
    },
  },
},



eyecontact: {
  name: "Eye Contact",
  shortDesc: "Target cannot attack foes that share a typing with it (persists on switch).",
  accuracy: true,
  basePower: 0,
  pp: 5,
  priority: 0,
  category: "Status",
  type: "Ghost",
  target: "normal",
  flags: {reflectable: 1, protect: 1},
  onHit(target) {
    // per-mon marker that survives switching (lives on the Pokemon object)
    (target as any).m ??= {};
    (target as any).m.eyecontactban = true;

    // apply the actual disabling logic as a volatile (clears on switch)
    target.addVolatile('eyecontactban');

    // ensure the afflicted side has a watcher to reapply when they switch in
    if (!target.side.getSideCondition('eyecontactwatch')) {
      target.side.addSideCondition('eyecontactwatch');
    }
  },
},

chaosburst: {
  name: "Chaos Burst",
  shortDesc: "Each use: EITHER a damaging hit + 1 minor effect chance OR a status with 1 guaranteed major effect.",
  accuracy: 100,         // overwritten each use
  basePower: 0,          // overwritten each use
  pp: 5,                 // fixed (8 with PP Ups)
  priority: 0,
  category: "Special",   // overwritten each use
  type: "Fairy",         // template; overwritten each use
  flags: {},

  onPrepareHit(target, source, move) {
    // ---------- helpers ----------
    const sample = <T>(arr: readonly T[]): T => arr[this.random(arr.length)];
    const chance = (a: number, b: number) => this.randomChance(a, b);
    const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
    const linmap = (x: number, x0: number, x1: number, y0: number, y1: number) =>
      y0 + (y1 - y0) * ((x - x0) / (x1 - x0));

    // per-mon memory on pokemon.m (SAFE)
    const memRoot = (source as any).m || ((source as any).m = {});
    const history = (memRoot.cbHistory ||= {minor: [] as string[], major: [] as string[]});
    const remember = (k: 'minor'|'major', id: string) => {
      history[k].push(id);
      while (history[k].length > 6) history[k].shift();
    };
    const recently = (k: 'minor'|'major') => new Set(history[k]);

    const TYPES = [
      'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying',
      'Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ] as const;
    const HAZARDS = ['stealthrock','spikes','toxicspikes','stickyweb'] as const;
    const SCREENS = ['reflect','lightscreen','auroraveil','safeguard','mist'] as const;
    const ROOMS   = ['trickroom','magicroom','wonderroom'] as const;
    const TERRAIN_STD = ['electricterrain','psychicterrain','grassyterrain','mistyterrain'] as const;
    const WEATHER_STD = ['raindance','sunnyday','sandstorm','snowscape'] as const;

    // ---------- choose BASE MODE ----------
    const baseMode: 'damage'|'status' = chance(3,5) ? 'damage' : 'status';
    const chaos: any = { baseMode };

    // random visible type (for the move itself)
    chaos.type = sample(TYPES);

    // ==================== DAMAGE MODE ====================
    if (baseMode === 'damage') {
      const bp = this.random(60, 151);                                     // 60–150
      const acc = Math.round(clamp(linmap(bp, 60, 150, 100, 70), 70, 100));// 70–100 inverse
      chaos.category = sample(['Physical','Special'] as const);
      chaos.basePower = bp;
      chaos.accuracy = acc;

      // small flavor flags
      const FLAG_POOL = ['contact','sound','punch','slicing','bite','wind','pulse'] as const;
      chaos.flags = {} as AnyObject;
      for (const f of FLAG_POOL) if (chance(1, 3)) chaos.flags[f] = 1;

      // ---- exactly ONE minor effect (CHANCE to occur) ----
      type Minor = { id: string; summary: string; prepare: () => void };
      const used = recently('minor');
      const minors: Minor[] = [];

      // Non-volatile statuses
      for (const st of ['brn','par','psn','slp','frz'] as const) {
        minors.push({
          id: `nv-${st}`,
          summary: `secondary ${st}`,
          prepare: () => { chaos.secondary = { kind: st, chance: this.random(15, 51) }; },
        });
      }
      // Volatiles
      minors.push({
        id: 'vol-confusion',
        summary: 'secondary confusion',
        prepare: () => { chaos.secondary = { kind: 'confusion', chance: this.random(15, 51) }; },
      });
      minors.push({
        id: 'vol-flinch',
        summary: 'secondary flinch',
        prepare: () => { chaos.secondary = { kind: 'flinch', chance: this.random(20, 51) }; },
      });
      // Small stat swings (±1)
      minors.push({
        id: 'statdown',
        summary: 'secondary stat drop',
        prepare: () => {
          const stat = sample(['atk','def','spa','spd','spe','accuracy','evasion'] as const);
          chaos.secondaryStat = { target: 'foe', stat, amount: -1, chance: this.random(20, 51) };
        },
      });
      minors.push({
        id: 'statup',
        summary: 'secondary self boost',
        prepare: () => {
          const stat = sample(['atk','def','spa','spd','spe'] as const);
          chaos.secondaryStat = { target: 'self', stat, amount: 1, chance: this.random(20, 51) };
        },
      });

      const pool = minors.filter(m => !used.has(m.id));
      const pick = (pool.length ? sample(pool) : sample(minors));
      pick.prepare();
      chaos.minorId = pick.id;
      chaos.minorSummary = pick.summary;
      remember('minor', pick.id);

      // Apply to live move
      move.category = chaos.category;
      move.basePower = chaos.basePower;
      move.type = chaos.type;
      move.accuracy = chaos.accuracy;
      move.flags = chaos.flags;

      // attach secondary status/volatile
      if (chaos.secondary) {
        const k = chaos.secondary.kind as 'brn'|'par'|'psn'|'slp'|'frz'|'confusion'|'flinch';
        const ch = chaos.secondary.chance as number;
        const sec: AnyObject = {
          chance: ch,
          onHit: (t: Pokemon, s: Pokemon, m: ActiveMove) => {
            let ok = false;
            switch (k) {
              case 'brn': ok = !!t.trySetStatus('brn', s, m); break;
              case 'par': ok = !!t.trySetStatus('par', s, m); break;
              case 'psn': ok = !!t.trySetStatus('psn', s, m); break;
              case 'slp': ok = !!t.trySetStatus('slp', s, m); break;
              case 'frz': ok = !!t.trySetStatus('frz', s, m); break;
              case 'confusion': ok = !!t.addVolatile('confusion'); break;
              case 'flinch': ok = !!t.addVolatile('flinch'); break;
            }
            this.add('-message', `Chaos Burst secondary ${ok ? 'APPLIED' : 'did not apply'}: ${k}`);
          },
        };
        move.secondary = sec;
        (move as AnyObject).secondaries = [sec];
      } else {
        move.secondary = undefined;
        (move as AnyObject).secondaries = undefined;
      }

      // attach secondary stat swing
      if (chaos.secondaryStat) {
        const e = chaos.secondaryStat;
        const secStat: AnyObject = {
          chance: e.chance,
          onHit: (t: Pokemon, s: Pokemon, m: ActiveMove) => {
            const who = e.target === 'foe' ? t : s;
            const boost: AnyObject = {}; boost[e.stat] = e.amount;
            this.boost(boost, who, s, m);
            this.add('-message', `Chaos Burst secondary stat ${e.amount>0?'+':''}${e.amount} ${e.stat} on ${who.name}`);
          },
        };
        const secondaries = (move as AnyObject).secondaries || [];
        secondaries.push(secStat);
        (move as AnyObject).secondaries = secondaries;
      }

      (move as any)._chaos = chaos;

      const flagsList = Object.keys(chaos.flags || {}).join(', ') || 'none';
      this.add('-message',
        `Chaos Burst (Damage) rolled ${chaos.type} ${chaos.category}, BP ${chaos.basePower}, ACC ${chaos.accuracy}%, flags [${flagsList}], minor: ${chaos.minorSummary}`
      );

    } else {
      // ==================== STATUS MODE ====================
      chaos.category = 'Status';
      chaos.basePower = 0;

      type Major = {
        id: string;
        summary: string;
        targetKind: 'foe'|'self'|'allySide'|'foeSide'|'field'|'none';
        apply: () => void;
      };
      const used = recently('major');
      const majors: Major[] = [];

      // Tailwind (ally side)
      majors.push({
        id: 'tailwind',
        summary: 'Tailwind (ally side)',
        targetKind: 'allySide',
        apply: () => { source.side.addSideCondition('tailwind' as ID, source); this.add('-sidestart', source.side, 'move: Tailwind'); },
      });

      // Screens / safeguard / mist (ally side)
      for (const sc of SCREENS) majors.push({
        id: `screen-${sc}`,
        summary: `${sc} (ally side)`,
        targetKind: 'allySide',
        apply: () => { source.side.addSideCondition(sc as ID, source); },
      });

      // Hazards (foe side)
      for (const hz of HAZARDS) majors.push({
        id: `hazard-${hz}`,
        summary: `${hz} (foe side)`,
        targetKind: 'foeSide',
        apply: () => { source.side.foe.addSideCondition(hz as ID, source); this.add('-message', `Chaos Burst set ${this.dex.conditions.get(hz as ID).name} on the foe side`); },
      });

      // Rooms (field)
      for (const rm of ROOMS) majors.push({
        id: `room-${rm}`,
        summary: `${rm} (field)`,
        targetKind: 'field',
        apply: () => { this.field.addPseudoWeather(rm as ID, source); },
      });

      // Gravity (field)
      majors.push({
        id: 'field-gravity',
        summary: 'Gravity (field)',
        targetKind: 'field',
        apply: () => { this.field.addPseudoWeather('gravity' as ID, source); },
      });

      // Standard terrain (field)
      for (const tr of TERRAIN_STD) majors.push({
        id: `terrain-${tr}`,
        summary: `${tr} (field)`,
        targetKind: 'field',
        apply: () => { this.field.setTerrain(tr as ID); this.add('-fieldstart', this.dex.conditions.get(tr as ID)); },
      });

      // Weather (field)
      for (const w of WEATHER_STD) majors.push({
        id: `weather-${w}`,
        summary: `${w} (field)`,
        targetKind: 'field',
        apply: () => { this.field.setWeather(w as ID); this.add('-weather', this.dex.conditions.get(w as ID).name); },
      });

      // Leech Seed (foe)
      majors.push({
        id: 'leechseed',
        summary: 'Leech Seed (foe)',
        targetKind: 'foe',
        apply: () => {
          const t = target || source.side.foe.active.find(x => x && !x.fainted);
          if (t) { const ok = t.addVolatile('leechseed' as ID, source); this.add('-message', `Chaos Burst ${ok ? 'seeded' : 'failed to seed'} ${t.name}`); }
        },
      });

      // Curse
      majors.push({
        id: 'curse',
        summary: 'Curse (ghost → foe / non-ghost self buffs)',
        targetKind: 'foe',
        apply: () => {
          if (source.hasType('Ghost')) {
            const hp = Math.floor(source.maxhp / 2);
            if (hp > 0) this.damage(hp, source, source, move);
            const t = target || source.side.foe.active.find(x => x && !x.fainted);
            if (t) { const ok = t.addVolatile('curse' as ID, source); this.add('-message', `Chaos Burst ${ok ? 'cursed' : 'failed to curse'} ${t.name}`); }
          } else {
            this.boost({atk: 1, def: 1, spe: -1}, source, source, move);
            this.add('-message', `Chaos Burst invoked non-Ghost Curse: +1 Atk, +1 Def, -1 Spe for ${source.name}`);
          }
        },
      });

      // Transform (self → foe)
      majors.push({
        id: 'transform',
        summary: 'Transform (self → foe)',
        targetKind: 'foe',
        apply: () => {
          if (!target) { this.add('-message', `Chaos Burst could not transform ${source.name} (no target)`); return; }
          if (source.transformed || target.transformed) { this.add('-message', `Chaos Burst could not transform ${source.name} (already transformed)`); return; }
          let ok = false;
          if (typeof (source as any).transformInto === 'function') ok = (source as any).transformInto(target, move);
          else if (typeof (source as any).transform === 'function') ok = (source as any).transform(target, move);
          this.add('-message', `Chaos Burst ${ok ? 'transformed' : 'failed to transform'} ${source.name} into ${target.name}`);
        },
      });

      // Random ability (self)
      majors.push({
        id: 'ability-self',
        summary: 'Random ability (self)',
        targetKind: 'self',
        apply: () => {
          const all = this.dex.abilities.all().filter(a => a.exists && a.id !== 'noability');
          const pick = this.sample(all)?.id as ID;
          const ok = source.setAbility(pick);
          this.add('-message', `Chaos Burst ${ok ? 'changed' : 'failed to change'} ${source.name}'s ability to ${this.dex.abilities.get(pick).name}`);
        },
      });

      // Random ability (foe)
      majors.push({
        id: 'ability-foe',
        summary: 'Random ability (foe)',
        targetKind: 'foe',
        apply: () => {
          const all = this.dex.abilities.all().filter(a => a.exists && a.id !== 'noability');
          const pick = this.sample(all)?.id as ID;
          const t = target || source.side.foe.active.find(x => x && !x.fainted);
          if (t) {
            const ok = t.setAbility(pick);
            this.add('-message', `Chaos Burst ${ok ? 'changed' : 'failed to change'} ${t.name}'s ability to ${this.dex.abilities.get(pick).name}`);
          }
        },
      });

      // Random type change (user/foe/both)
      majors.push({
        id: 'type-change',
        summary: 'Random type change (user/foe/both)',
        targetKind: 'none',
        apply: () => {
          const who = sample(['user','foe','both'] as const);
          const rollTypes = () => {
            const t1 = sample(TYPES);
            if (chance(3,10)) { let t2 = t1; while (t2 === t1) t2 = sample(TYPES); return [t1,t2]; }
            return [t1];
          };
          const applyTypes = (p: Pokemon, types: string[]) => {
            p.setType(types as any);
            this.add('-message', `Chaos Burst changed ${p.name}'s type to ${types.join('/')}`);
          };
          if (who === 'user' || who === 'both') applyTypes(source, rollTypes());
          const t = target || source.side.foe.active.find(x => x && !x.fainted);
          if (t && (who === 'foe' || who === 'both')) applyTypes(t, rollTypes());
        },
      });

      // Self-heal 50–100% + cure
      majors.push({
        id: 'heal',
        summary: 'Self-heal 50–100% + cure',
        targetKind: 'self',
        apply: () => {
          const frac = this.random(50, 101) / 100;
          const healed = this.heal(Math.floor(source.baseMaxhp * frac), source, source);
          if (healed) source.cureStatus();
          this.add('-message', `Chaos Burst healed ${source.name} to ${source.getHealth}. Status cured.`);
        },
      });

      // Substitute (self)
      majors.push({
        id: 'substitute',
        summary: 'Substitute (self)',
        targetKind: 'self',
        apply: () => {
          if (source.hp > Math.floor(source.baseMaxhp / 4) && !source.volatiles['substitute']) {
            this.damage(Math.floor(source.baseMaxhp / 4), source, source, move);
            const ok = source.addVolatile('substitute', source);
            this.add('-message', `Chaos Burst ${ok ? 'created' : 'failed to create'} a Substitute for ${source.name}`);
          } else {
            this.add('-message', `Chaos Burst could not create a Substitute for ${source.name}`);
          }
        },
      });

      // Pick one major avoiding repeats
      const filtered = majors.filter(m => !used.has(m.id));
      const pick = filtered.length ? sample(filtered) : sample(majors);
      chaos.majorId = pick.id;
      chaos.majorSummary = pick.summary;
      chaos.majorTargetKind = pick.targetKind;
      chaos.majorApply = pick.apply;
      remember('major', pick.id);

      // Accuracy: foe/foeSide = 90%, else true
      const needsAcc = (pick.targetKind === 'foe' || pick.targetKind === 'foeSide');
      chaos.accuracy = needsAcc ? 90 : true;

      // Apply to live move
      move.category = 'Status';
      move.basePower = 0;
      move.type = chaos.type;
      move.accuracy = chaos.accuracy;
      move.flags = {};

      (move as any)._chaos = chaos;

      const accStr = chaos.accuracy === true ? '—' : `${chaos.accuracy}%`;
      this.add('-message',
        `Chaos Burst (Status) rolled ${chaos.type} Status, ACC ${accStr}, major: ${chaos.majorSummary}`
      );
    }
  },

  onHit(target, source, move) {
    const chaos = (move as any)._chaos || {};
    if (!chaos) return;
    if (chaos.baseMode !== 'status') return;
    if (typeof chaos.majorApply === 'function') chaos.majorApply();
  },

  target: "normal",
},

frostbite: {
	accuracy: 100,
	basePower: 0,
	category: "Status",
	name: "Frost Bite",
	pp: 15,
	priority: 0,
	flags: { protect: 1, reflectable: 1, mirror: 1, metronome: 1 },
	status: 'frb', // your custom Frostbite status
	secondary: null,
	target: "normal",
	type: "Ice",
	zMove: { boost: { spa: 1 } },
	contestType: "Beautiful",
	shortDesc: "Inflicts Frostbite on the target.",
},
fellswoop: {
        name: "Fell Swoop",
        shortDesc: "110 BP, 70% acc. If it misses, user loses 25% max HP.",
        type: "Dark",
        category: "Physical",
        accuracy: 70,
        basePower: 110,
        pp: 5,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1},
        onMoveFail(_target, source, move) {
            if (!source || source.fainted) return;
            this.damage(Math.floor(source.baseMaxhp / 4), source, source, move);
        },
        target: "normal",
    },
nailscratch: {
        name: "Nail Scratch",
        shortDesc: "30% to inflict (Bleeding OR Freeze OR Flinch) at random.",
        type: "Ice",
        category: "Physical",
        accuracy: 100,
        basePower: 85,
        pp: 16,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1, slicing: 1},
        onAfterHit(target, source) {
            if (!target || target.fainted) return;
            if (!this.randomChance(3, 10)) return;
            const roll = this.random(3);
            if (roll === 0 && !target.volatiles['bleeding']) {
                target.addVolatile('bleeding', source);
                this.add('-message', `${target.name} started bleeding!`);
            } else if (roll === 1) {
                target.trySetStatus('frz', source);
            } else {
                target.addVolatile('flinch', source);
            }
        },
        target: "normal",
    },
enchantingspin: {
        name: "Enchanting Spin",
        shortDesc: "Hits 3–5 times. Clears hazards on user's side.",
        type: "Fairy",
        category: "Physical",
        accuracy: 100,
        basePower: 20,
        pp: 16,
        priority: 0,
        multihit: [3, 5],
        flags: {protect: 1, mirror: 1, contact: 1},
        onAfterMoveSecondarySelf(pokemon) {
            const side = pokemon.side;
            for (const cond of [
                'spikes', 'toxicspikes', 'stealthrock', 'stickyweb',
                'serratedspikes', 'gmaxsteelsurge', 'gasoline', 'twinvines',
            ] as ID[]) {
                if (side.removeSideCondition(cond)) {
                    this.add('-sideend', side, this.dex.conditions.get(cond).name,
                        '[from] move: Enchanting Spin', '[of] ' + pokemon.name);
                }
            }
        },
        target: "normal",
    },


    blownkiss: {
        name: "Blown Kiss",
        shortDesc: "Inflicts paralysis and confusion (100% if it hits).",
        type: "Fairy",
        category: "Status",
        accuracy: 80,
        basePower: 0,
        pp: 5,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        onHit(target, source) {
            target.trySetStatus('par', source);
            if (!target.volatiles['confusion']) target.addVolatile('confusion', source);
        },
        target: "normal",
    },

voidclaw: {
	name: "Voidclaw",
	shortDesc: "If user has no item, Dragon hits Fairy neutrally.",
	type: "Dragon",
	category: "Physical",
	accuracy: 100,
	basePower: 85,
	pp: 8,
	priority: 0,
	flags: {protect: 1, mirror: 1, contact: 1, slicing: 1},
	target: "normal",

	// If the *user* has no item, ignore Dragon immunities (so Fairy is no longer immune)
	onModifyMove(move, pokemon, target) {
		// If the user still has an item, do nothing
		if (pokemon.item) return;

		// Only bother if there's a target and it has Fairy typing
		if (!target || !target.hasType('Fairy')) return;

		// Ensure we don't clobber any existing ignoreImmunity settings
		if (!move.ignoreImmunity) {
			move.ignoreImmunity = {};
		} else if (move.ignoreImmunity === true) {
			// already ignoring all immunities; nothing to do
			return;
		}

		(move.ignoreImmunity as AnyObject)['Dragon'] = true;
		this.debug('Voidclaw: user has no item, ignoring Dragon immunities vs Fairy');
	},
},



runecleave: {
        name: "Runecleave",
        shortDesc: "30% Frostbite. If target already has Frostbite, 1.3× power.",
        type: "Ice",
        category: "Physical",
        accuracy: 90,
        basePower: 90,
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1, slicing: 1},
        onBasePower(basePower, _attacker, defender) {
            if (defender?.status === 'frb') {
                return this.chainModify([13, 10]);
            }
        },
        secondary: {chance: 30, status: 'frb'},
        target: "normal",
    },


    lunartide: {
        name: "Lunar Tide",
        shortDesc: "Power doubles in Rain or at Night.",
        type: "Water",
        category: "Special",
        accuracy: 100,
        basePower: 70,
        pp: 5,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        onBasePower(basePower, attacker, defender, move) {
            const rainy = this.field.isWeather('raindance') || this.field.isWeather('primordialsea');
            const night = !!this.field.getPseudoWeather('night');
            if (rainy || night) return this.chainModify(2);
        },
        target: "normal",
    },
storedscales: {
        name: "Stored Scales",
        shortDesc: "20 BP + 20 for each positive stat stage.",
        type: "Dragon",
        category: "Physical",
        accuracy: 100,
        basePower: 20,
        pp: 12,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1},
        basePowerCallback(pokemon) {
            let plus = 0;
            for (const stat of ['atk','def','spa','spd','spe','accuracy','evasion'] as const) {
                plus += Math.max(0, pokemon.boosts[stat] || 0);
            }
            return 20 + 20 * plus;
        },
        target: "normal",
    },
inversepower: {
        accuracy: 100,
        basePower: 20,
        category: "Special",
        name: "Inverse Power",
        shortDesc: "Power increases with the target's stat boosts.",
        pp: 10,
        priority: 0,
        flags: {protect: 1, mirror: 1, metronome: 1},
        type: "Psychic",
        target: "normal",
        basePowerCallback(pokemon, target) {
            let boostTotal = 0;
            const boosts = target.boosts;
            for (const stat in boosts) {
                const boost = (boosts as any)[stat] as number;
                if (boost > 0) boostTotal += boost;
            }
            return 20 + 20 * boostTotal;
        },
    },
sylvanlament: {
        name: "Sylvan Lament",
        shortDesc: "If super effective, applies Leech Seed.",
        type: "Grass",
        category: "Special",
        accuracy: 100,
        basePower: 75,
        pp: 12,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        onAfterHit(target, pokemon, move) {
            if (!target || target.fainted) return;
            let eff = 0;
            for (const t of target.getTypes()) {
                eff += this.dex.getEffectiveness(move.type, t);
            }
            if (eff > 0 && !target.volatiles['leechseed']) {
                target.addVolatile('leechseed', pokemon);
            }
        },
        target: "normal",
    },
blindinglight: {
        name: "Blinding Light",
        shortDesc: "-1 foe accuracy.",
        type: "Light",
        category: "Special",
        accuracy: 100,
        basePower: 85,
        pp: 8,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        secondary: {
            chance: 100,
            boosts: {accuracy: -1},
        },
        target: "normal",
    },
serratedspikes: {
        name: "Serrated Spikes",
        shortDesc: "Sets a hazard that inflicts Bleeding on switch-in.",
        type: "Blood",
        category: "Status",
        accuracy: true,
        basePower: 0,
        pp: 8,
        priority: 0,
        flags: {reflectable: 1, mirror: 1},
        target: "foeSide",
        sideCondition: 'serratedspikes',
        condition: {
            onStart(side) {
                this.add('-sidestart', side, 'Serrated Spikes');
            },
            onSwitchIn(pokemon) {
                if (!pokemon.isGrounded() || pokemon.hasItem('heavydutyboots')) return;
                if (!pokemon.volatiles['bleeding']) {
                    pokemon.addVolatile('bleeding');
                    this.add('-message', `${pokemon.name} started bleeding due to Serrated Spikes!`);
                }
            },
            onEnd(side) {
                this.add('-sideend', side, 'Serrated Spikes');
            },
        },
    },
	
frozenwings: {
        name: "Frozen Wings",
        shortDesc: "Combines Flying effectiveness. 10% freeze, 10% confuse.",
        type: "Ice",
        category: "Special",
        accuracy: 90,
        basePower: 95,
        pp: 10,
        priority: 0,
        flags: {protect: 1, mirror: 1, wind: 1},
        onEffectiveness(typeMod, target, type) {
            if (!target) return;
            return typeMod + this.dex.getEffectiveness('Flying', type);
        },
        secondaries: [
            {chance: 10, status: 'frz'},
            {chance: 10, volatileStatus: 'confusion'},
        ],
        target: "normal",
    },


    venomquake: {
        name: "Venomquake",
        shortDesc: "Hits all adjacent Pokémon.",
        type: "Poison",
        category: "Physical",
        accuracy: 100,
        basePower: 100,
        pp: 18,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        target: "allAdjacent",
    },


    radiantspear: {
        name: "Radiant Spear",
        shortDesc: "Always super effective vs Dark (ignores their second type).",
        type: "Light",
        category: "Physical",
        accuracy: 100,
        basePower: 80,
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1},
        onEffectiveness(typeMod, target, type) {
            if (!target) return;
            if (type === 'Dark') return 1;
            return typeMod;
        },
        target: "normal",
    },


    barkbite: {
        name: "Bark Bite",
        shortDesc: "30% chance to -1 Spe.",
        type: "Normal",
        category: "Physical",
        accuracy: 100,
        basePower: 80,
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1, bite: 1},
        secondary: {chance: 30, boosts: {spe: -1}},
        target: "normal",
    },


    emberoath: {
        name: "Ember Oath",
        shortDesc: "If this move KOs, user gets +1 Def/SpD.",
        type: "Fire",
        category: "Physical",
        accuracy: 100,
        basePower: 90,
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, contact: 1},
        onAfterMoveSecondarySelf(pokemon, target) {
            if (target && target.fainted) {
                this.boost({def: 1, spd: 1}, pokemon);
            }
        },
        target: "normal",
    },

	smackemtwice: {
	name: "Smack Em Twice",
    type: "Steel",
    category: "Physical",
    basePower: 65,
    accuracy: 100,
    pp: 10,
    priority: 0,
    flags: {contact: 1, protect: 1, mirror: 1},
    target: "normal",
	secondary: {
			chance: 20,
			status: 'par',
		},
    
    // This is the correct way to apply a volatile status.
    // It's a method that fires after the move hits.
    onHit(target, source) {
        target.addVolatile('doublehammer', source);
    },
    
    // Use shortDesc for a description of the move.
    shortDesc: "A priority move that applies a negative priority end-of-turn attack.",
},


    divinerage: {
    name: "Divine Rage",
    shortDesc: "Volatile: +1 Atk every time you're hit.",
    type: "Light",
    category: "Status",
    accuracy: true,
    basePower: 0,
    pp: 5,
    priority: 0,
    flags: {snatch: 1},
    volatileStatus: 'divinerage',
    target: "self",
},
/*	
bloodoath: {
        name: "Blood Oath",
        shortDesc: "−4 prio. Sacrifice 50% max HP. Soul-link target (persists across switch).",
        type: "Blood",
        category: "Status",
        accuracy: true,
        basePower: 0,
        pp: 2,
        priority: -4,
        flags: {mirror: 1, protect: 0},
        onTryHit(target, pokemon) {
            this.damage(Math.floor(pokemon.baseMaxhp / 2), pokemon, pokemon);
            if (pokemon.fainted) return null;
            target.side.addSlotCondition(target, 'bloodoath');
            this.add('-message', `${pokemon.name} bound ${target.name} by a blood oath!`);
        },
        slotCondition: {
            onStart(target, source) {
                this.add('-start', target, 'Blood Oath', '[of] ' + source);
                this.effectState.binderSid = source.side.n;
                this.effectState.binderPos = source.position;
            },
            onDamage(damage, target, source, effect) {
                if (!damage || !source || !effect || effect.id === 'recoil') return;
                const sid = this.effectState.binderSid;
                const pos = this.effectState.binderPos;
                const binder = this.getAtSlot(`${sid}a${pos}` as any);
                if (binder && !binder.fainted && damage > 0) {
                    const spill = Math.floor(damage / 3);
                    if (spill > 0) this.damage(spill, binder, target);
                }
            },
            onEnd(target) {
                this.add('-end', target, 'Blood Oath');
            },
        },
        target: "normal",
    },

*/


    talktothehand: {
        accuracy: true,
        basePower: 0,
        category: "Status",
        name: "Talk to the Hand",
        shortDesc: "Protect. The move that hits into it is disabled for 3 turns.",
        pp: 16,
        priority: 4,
        type: "Fairy",
        target: "self",
        flags: {metronome: 1, noassist: 1, failcopycat: 1},
        stallingMove: true,
        volatileStatus: 'talktothehand',
        onPrepareHit(pokemon) {
            return !!this.queue.willAct() && this.runEvent('StallMove', pokemon);
        },
        onHit(pokemon) {
            pokemon.addVolatile('stall');
        },
        condition: {
            duration: 1,
            onStart(target) {
                this.add('-singleturn', target, 'move: Protect');
            },
            onTryHitPriority: 3,
            onTryHit(target, source, move) {
                if (!move) return;


                if (!move.flags['protect']) {
                    if (['gmaxoneblow', 'gmaxrapidflow'].includes(move.id)) return;
                    if (move.isZ || move.isMax) target.getMoveHitData(move).zBrokeProtect = true;
                    return;
                }


                if (move.smartTarget) {
                    move.smartTarget = false;
                } else {
                    this.add('-activate', target, 'move: Protect');
                }


                const locked = source.getVolatile('lockedmove');
                if (locked && locked.duration === 2) {
                    delete source.volatiles['lockedmove'];
                }


                if (move.id !== 'struggle') {
                    if (!source.volatiles['disable']) {
                        source.addVolatile('disable', target);
                    }
                    const vol = source.volatiles['disable'];
                    if (vol) {
                        vol.move = move.id;
                        vol.duration = 3;
                    }
                    this.add('-message', `${source.name}'s ${move.name} was disabled by Talk to the Hand!`);
                }
                return this.NOT_FAIL;
            },
            onHit(target, source, move) {
                if (!move || !move.isZOrMaxPowered || move.category === 'Status' || move.id === 'struggle') return;
                if (!source.volatiles['disable']) {
                    source.addVolatile('disable', target);
                }
                const vol = source.volatiles['disable'];
                if (vol) {
                    vol.move = move.id;
                    vol.duration = 3;
                }
                this.add('-message', `${source.name}'s ${move.name} was disabled by Talk to the Hand!`);
            },
        },
        secondary: null,
    },

    
    pyrokinesis: {
	name: "Pyrokinesis",
	shortDesc: "5 turns: reflects Fire moves & halves Water damage to this side. (8 with Light Clay).",
	type: "Fire",
	category: "Status",
	accuracy: true,
	basePower: 0,
	target: "allySide",
	pp: 15,
	priority: 0,
	flags: {snatch: 1},
	sideCondition: 'pyrokinesis',
	condition: {
		name: 'Pyrokinesis',
		duration: 5,
		durationCallback(_target, source) {
			if (source && source.hasItem('lightclay')) return 8;
			return 5;
		},
		onSideStart(side) {
			this.add('-sidestart', side, 'move: Pyrokinesis');
		},
		onSideEnd(side) {
			this.add('-sideend', side, 'move: Pyrokinesis');
		},
		onTryHit(target, source, move) {
			// Only care about damaging Fire moves
			if (!move || move.category === 'Status') return;
			if (move.type !== 'Fire') return;
			if (!source || source === target) return;

			// If it's already a bounced instance, don't reflect again
			if ((move as any).hasBounced) return;

			// Only reflect if THIS side has Pyrokinesis active
			if (!target.side.getSideCondition('pyrokinesis')) return;

			// Create a new ActiveMove that's marked as bounced
			const newMove = this.dex.getActiveMove(move.id);
			(newMove as any).hasBounced = true;

			this.add('-activate', target, 'move: Pyrokinesis');

			// Reflect: new source = target, new target = original source
			this.actions.useMove(newMove, target, {target: source});

			// Cancel the original hit
			return null;
		},
		onAnyModifyDamage(damage, source, target, move) {
			if (!move || move.category === 'Status' || move.type !== 'Water') return;
			if (!target || !target.side.getSideCondition('pyrokinesis')) return;
			this.debug('Pyrokinesis water damage halved');
			return this.chainModify(0x800); // 0.5x
		},
	},
},



    ragnarokcry: {
        name: "Ragnarok Cry",
        shortDesc: "Clears all field effects. If a terrain was removed, -1 SpD to target. Sound.",
        type: "Flying",
        category: "Special",
        accuracy: 100,
        basePower: 90,
        pp: 15,
        priority: 0,
        flags: {protect: 1, mirror: 1, sound: 1},
        onTryMove(attacker, defender, move) {
            let removedTerrain = false;
            if (this.field.terrain) {
                this.field.clearTerrain();
                removedTerrain = true;
            }
            for (const weather of [
                'raindance', 'primordialsea', 'sunnyday', 'desolateland',
                'sandstorm', 'hail', 'snow',
            ] as ID[]) {
                if (this.field.isWeather(weather)) {
                    this.field.clearWeather();
                    break;
                }
            }
            for (const pw of ['trickroom', 'magicroom', 'wonderroom', 'burningfield', 'steamfield'] as ID[]) {
                if (this.field.getPseudoWeather(pw)) {
                    this.field.removePseudoWeather(pw);
                }
            }
            if (removedTerrain) {
                this.boost({spd: -1}, defender, attacker, move);
            }
        },
        target: "normal",
    },


   dodgeball: {
	name: "Dodgeball",
	shortDesc: "50% OHKO. If it fails, user faints & foe learns Dodgeball.",
	type: "Fighting",
	category: "Status",
	accuracy: true, // we handle the 50% ourselves
	basePower: 0,
	pp: 5,
	priority: 0,
	flags: {protect: 1, mirror: 1, contact: 1, metronome: 1},
	target: "normal",

	// Decide which outcome happens
	onTryMove(source, target, move) {
		// 50%: succeed, mark it and let the move go through
		if (this.randomChance(1, 2)) {
			(move as any).dodgeballSuccess = true;
			return; // proceed to hit
		}

		// ---- FAIL CASE ----
		this.add('-message', `${target.name} caught the dodgeball!`);

		// User faints
		source.faint();

		// Target learns Dodgeball, overwriting a random move slot
		if (target && !target.fainted && !target.hasMove('dodgeball')) {
			const slots: number[] = [];
			for (let i = 0; i < target.moveSlots.length; i++) {
				const slot = target.moveSlots[i];
				if (slot && slot.id) slots.push(i);
			}
			if (slots.length) {
				const slotIndex = this.sample(slots);

				const moveData = this.dex.moves.get('dodgeball');

				// Build a new MoveSlot object for Dodgeball
				const newSlot: any = {
					move: moveData.name,
					id: moveData.id,
					pp: moveData.pp,
					maxpp: moveData.pp,
					target: moveData.target,
					disabled: false,
					disabledSource: '',
					used: false,
				};

				// Overwrite active moveslot
				(target.moveSlots as any)[slotIndex] = newSlot;

				// Also update baseMoveSlots if your fork has them (for Transform, etc.)
				if ((target as any).baseMoveSlots) {
					(target as any).baseMoveSlots[slotIndex] = {...newSlot};
				}

				// And the raw moves[] ID list, if present
				if ((target as any).moves) {
					(target as any).moves[slotIndex] = moveData.id;
				}

				this.add('-message', `${target.name} learned Dodgeball!`);
			}
		}

		// Cancel the attack (no damage, no normal miss message)
		return null;
	},

	// If we chose the success outcome, make it a true OHKO on hit
	onHit(target, source, move) {
		if (!(move as any).dodgeballSuccess) return;
		if (!target || target.fainted) return;

		this.add('-message', `${source.name}'s Dodgeball scored a one-hit KO!`);
		this.damage(target.hp, target, source, move);
	},
},


    drako: {
	name: "DraKO",
	shortDesc: "50 BP. If user has +1 in all stats (Atk/Def/SpA/SpD/Spe), becomes guaranteed OHKO. Resets boosts after use.",
	type: "Dragon",
	category: "Physical",
	accuracy: true, // can't miss normally
	basePower: 50,
	pp: 5,
	priority: 0,
	flags: {protect: 1, mirror: 1, contact: 1},

	onHit(target, source, move) {
		const b = source.boosts;
		const stats: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe'];
		let ok = true;
		for (const stat of stats) {
			if ((b[stat] || 0) < 1) {
				ok = false;
				break;
			}
		}
		if (!ok || !target || target.fainted) return; // just do normal 50 BP damage

		// Fully boosted: make it a true OHKO (subject to Sturdy / Sash etc.)
		this.add('-message', `${source.name}'s DraKO unleashed a one-hit KO!`);
		this.damage(target.hp, target, source, move); // correct order: (dmg, target, source)
	},

	onAfterMove(pokemon) {
		pokemon.clearBoosts();
		this.add('-clearboost', pokemon);
	},

	target: "normal",
},

    
    gammaray: {
	name: "Gamma Ray",
	shortDesc: "70 BP, 85% acc. Confuses. 30%: grants target the Radioactive ability.",
	type: "Gamma",
	category: "Special",
	accuracy: 85,
	basePower: 70,
	pp: 10,
	priority: 0,
	flags: {protect: 1, mirror: 1},
	secondary: {chance: 100, volatileStatus: 'confusion'},
	onAfterHit(target, source, move) {
		if (!target || target.fainted) return;
		if (!this.randomChance(3, 10)) return;

		// If your Radioactive ability exists, overwrite the target's ability.
		if (this.dex.abilities.get('radioactive').exists) {
			target.setAbility('radioactive');
			this.add('-ability', target, 'Radioactive', '[from] move: Gamma Ray');
		} else {
			// Fallback: Radioactive as a volatile instead of a real ability.
			target.addVolatile('radioactive');
			this.add('-message', `${target.name} became Radioactive!`);
		}
	},
	target: "normal",
},


    nuclearfangs: {
	name: "Nuclear Fangs",
	shortDesc: "Badly poisons the target. 30% chance to give Radioactive ability.",
	type: "Gamma",
	category: "Physical",
	accuracy: 90,
	basePower: 50,
	pp: 8,
	priority: 0,
	flags: {protect: 1, mirror: 1, contact: 1, bite: 1},
	secondary: {chance: 100, status: 'tox'},
	onAfterHit(target, source, move) {
		if (!target || target.fainted) return;
		if (!this.randomChance(3, 10)) return;

		if (this.dex.abilities.get('radioactive').exists) {
			target.setAbility('radioactive');
			this.add('-ability', target, 'Radioactive', '[from] move: Nuclear Fangs');
		} else {
			target.addVolatile('radioactive');
			this.add('-message', `${target.name} became Radioactive!`);
		}
	},
	target: "normal",
},


    temptingoffer: {
        name: "Tempting Offer",
        shortDesc: "Gives the target Regenerator for 1 turn.",
        type: "Dark",
        category: "Status",
        accuracy: true,
        basePower: 0,
        pp: 10,
        priority: 0,
        flags: {protect: 1, mirror: 1},
        onHit(target) {
            if (target.ability === 'regenerator') return;
            const orig = target.ability;
            target.setAbility('regenerator');
            target.addVolatile('temptingoffer');
            target.volatiles['temptingoffer'].origAbility = orig;
            this.add('-message', `${target.name} was tempted with Regenerator!`);
        },
        condition: {
            duration: 2,
            onEnd(pokemon) {
                const orig = this.effectState.origAbility as ID | undefined;
                if (orig) {
                    pokemon.setAbility(orig);
                    this.add('-message', `${pokemon.name}'s borrowed power faded.`);
                }
            },
        },
        target: "normal",
    },
/*
ultimateslam: {
	name: "Ultimate Slam",
	shortDesc: "Random type each use. If it KOs, excess damage hits one benched foe.",
	type: "Normal",
	category: "Physical",
	accuracy: 65,
	basePower: 150,
	pp: 5,
	priority: 0,
	flags: {protect: 1, mirror: 1},
	target: "normal",

	// Random type each time it's used
	onModifyType(move, pokemon) {
		const pool = [
			'Normal','Fire','Water','Electric','Grass','Ice',
			'Fighting','Poison','Ground','Flying','Psychic','Bug',
			'Rock','Ghost','Dragon','Dark','Steel','Fairy',
			'Light','Blood','Gamma',
		] as ID[];
		const chosen = this.sample(pool);
		move.type = chosen;
		this.add('-message', `${pokemon.name}'s Ultimate Slam became ${chosen}-type!`);
	},

	// Before the hit: record target HP and predicted damage
	onTryHit(target, source, move) {
		if (!target || !source) return;

		const predicted = this.actions.getDamage(source, target, move);
		(move as any).ultimatePreHP = target.hp;
		(move as any).ultimatePredictedDamage = (typeof predicted === 'number' ? predicted : 0);
	},

	// After the hit: if the target fainted, spill excess damage to 1 random benched foe
	onAfterHit(target, source, move) {
		if (!target || !source) return;
		if (!target.fainted) return;

		const preHP = (move as any).ultimatePreHP || 0;
		const predicted = (move as any).ultimatePredictedDamage || 0;

		// Excess damage = what we would have done beyond the target's HP
		let excess = predicted - preHP;
		if (excess <= 0) return;

		// Find benched, non-fainted mons on the same side as the target
		const bench = target.side.pokemon.filter(
			p => p && !p.fainted && !p.isActive && p !== target
		);
		if (!bench.length) return;

		// Pick one random benched mon
		const victim = this.sample(bench);
		if (!victim) return;

		// Clamp excess so we don't go below 0 HP and apply it directly
		const spill = Math.min(excess, victim.hp);
		if (spill <= 0) return;

		const newHP = victim.hp - spill;
		victim.hp = newHP;

		this.add(
			'-message',
			`Ultimate Slam's shockwave hit benched ${victim.name} for ${spill} excess damage!`
		);

		if (victim.hp <= 0 && !victim.fainted) {
			victim.faint(source, move as unknown as Effect);
		}
	},
},*/
ultimateslam: {
  name: "Ultimate Slam",
  shortDesc: "If this move KOs, excess damage hits the next party member.",
  accuracy: 65,
  basePower: 150,
  category: "Physical",
  priority: 0,
  pp: 5,
  type: "Normal",
  target: "normal",
  flags: {contact: 1, protect: 1, mirror: 1},
  // Random type each time it's used
	onModifyType(move, pokemon) {
		const pool = [
			'Normal','Fire','Water','Electric','Grass','Ice',
			'Fighting','Poison','Ground','Flying','Psychic','Bug',
			'Rock','Ghost','Dragon','Dark','Steel','Fairy',
			'Light','Blood','Gamma',
		] as ID[];
		const chosen = this.sample(pool);
		move.type = chosen;
		this.add('-message', `${pokemon.name}'s Ultimate Slam became ${chosen}-type!`);
	},

  /**
   * Capture the pre-clamp damage this move is about to deal.
   * This runs inside Battle#damage before damage is clamped to target.hp.
   */
  onDamage(damage, target, source, effect) {
    if (!effect || effect.id !== 'ultimateslam' || typeof damage !== 'number') {
      return damage;
    }

    // Effect here is the move. Extend its type locally with our custom field.
    type UltimateSlamMove = ActiveMove & { ultimateSlamRawDamage?: number };
    const moveWithRaw = effect as UltimateSlamMove;

    moveWithRaw.ultimateSlamRawDamage = damage;
    return damage; // don’t modify the actual damage
  },

  /**
   * After landing the hit, see if we KO'd and had overkill damage.
   * If so, spill the excess to the next Pokémon in the target's party.
   */
    onAfterHit(target, source, move) {
  type UltimateSlamMove = ActiveMove & { ultimateSlamRawDamage?: number };
  const moveWithRaw = move as UltimateSlamMove;

  const rawDamage = moveWithRaw.ultimateSlamRawDamage;
  delete moveWithRaw.ultimateSlamRawDamage;

  if (typeof rawDamage !== 'number') return;

  const applied = target.lastDamage || 0;
  if (applied <= 0) return;

  // Only spill if this actually KO'd the target
  if (!target.fainted && target.hp > 0) return;

  const overkill = rawDamage - applied;
  if (overkill <= 0) return;

  const side = target.side;
  let nextPokemon: Pokemon | null = null;
  const startIndex = target.position;

  for (let i = startIndex + 1; i < side.pokemon.length; i++) {
    const mon = side.pokemon[i];
    if (!mon || mon.fainted || mon.isActive) continue;
    nextPokemon = mon;
    break;
  }

  if (!nextPokemon) return;

  const mon = nextPokemon;

  // Clamp overkill to something sensible (can't do more than their total HP)
  let dmg = overkill;
  const maxhp = mon.maxhp || mon.baseMaxhp || 0;
  if (maxhp && dmg > maxhp) dmg = maxhp;
  if (dmg <= 0) return;

  this.add(
    '-message',
    `${source.name}'s Ultimate Slam overflows and hits benched ${mon.name} for ${dmg} damage!`
  );

  // Bench-snipe style: directly modify HP instead of using this.damage()
  let newHP = mon.hp - dmg;
  if (newHP <= 0) {
    newHP = 0;
    mon.hp = 0;
    mon.faint(source, move as unknown as Effect);
  } else {
    mon.hp = newHP;
  }
},


  // Optional safety cleanup if something weird happens
  onAfterMove(source, target, move) {
    type UltimateSlamMove = ActiveMove & { ultimateSlamRawDamage?: number };
    const moveWithRaw = move as UltimateSlamMove;
    if (moveWithRaw.ultimateSlamRawDamage !== undefined) {
      delete moveWithRaw.ultimateSlamRawDamage;
    }
  },
},

nuclearexplosion: {
	name: "Nuclear Explosion",
	shortDesc: "150 BP to all actives; benched mons lose random ≤50% max HP; user faints.",
	type: "Gamma",
	category: "Status",      // all real damage is handled manually
	basePower: 0,
	accuracy: true,
	pp: 5,
	priority: 0,
	target: "all",           // lets us use onHitField
	flags: {protect: 1, mirror: 1},
	// no selfdestruct: we faint the user manually

	onHitField(_target, source, move) {
		// Build a 'real' damaging move object for the 150 BP nuke
		const nukeMove = this.dex.getActiveMove(move.id);
		nukeMove.basePower = 150;
		nukeMove.category = 'Special';
		nukeMove.type = 'Gamma';

		const sides = [source.side, source.side.foe];

		// 1) 150 BP hit to all *active* Pokémon (both sides)
		for (const side of sides) {
			for (const mon of side.active) {
				if (!mon || mon.fainted) continue;

				const dmg = this.actions.getDamage(source, mon, nukeMove);
				if (typeof dmg === 'number' && dmg > 0) {
					this.damage(dmg, mon, source, nukeMove);
				}
			}
		}

		// 2) Fallout: random 1–50% max HP to all *benched* mons (both sides)
		for (const side of sides) {
			for (const mon of side.pokemon) {
				if (!mon || mon.fainted || mon.isActive) continue;

				const maxhp = mon.maxhp || mon.baseMaxhp;
				if (!maxhp) continue;

				// Random 1–50% of max HP
				const fraction = this.random(1, 51) / 100; // 0.01–0.50
				const dmg = Math.floor(maxhp * fraction);
				if (dmg <= 0) continue;

				// Bench-snipe style: directly modify HP instead of using this.damage()
				this.add(
					'-message',
					`Nuclear fallout hit benched ${mon.name} for ${dmg} damage!`
				);

				let newHP = mon.hp - dmg;
				if (newHP <= 0) {
					newHP = 0;
					mon.hp = 0;
					// Faint exactly like Bench Snipe does, just with prior damage
					mon.faint(source, nukeMove as unknown as Effect);
				} else {
					mon.hp = newHP;
				}
			}
		}

		// 3) User always faints at the end
		if (source?.hp) {
			source.faint(source, nukeMove as unknown as Effect);
		}
	},
},
chromaticclaw: {
	num: -7003, // custom ID
	name: "Chromatic Claw",
	shortDesc: "High crit. Becomes the user's 2nd type or held Gem's type.",
	type: "Normal", // overwritten by onModifyType
	category: "Physical",
	basePower: 90,
	accuracy: 100,
	pp: 10,
	priority: 0,
	critRatio: 2, // high crit
	flags: {
		contact: 1,
		slicing: 1,
		protect: 1,
		mirror: 1,
	},

	onModifyType(move, pokemon) {
		// Only override if it's still the base type
		if (move.type !== 'Normal') return;

		let newType: string | undefined;

		// 1) Try to use held Gem type, if any
		const item = pokemon.getItem();
		if (item && (item as any).isGem) {
			// item.id is an ID; treat it as string for text ops
			let id = item.id as string; // e.g. "firegem"
			if (id.endsWith('gem')) id = id.slice(0, -3); // "firegem" -> "fire"

			const t = this.dex.types.get(id);
			if (t && t.exists) {
				newType = t.name; // e.g. "Fire"
			}
		}

		// 2) Otherwise, fall back to user's secondary type
		if (!newType) {
			const types = pokemon.getTypes(); // runtime types
			if (types.length > 1) {
				newType = types[1];
			} else if (types.length > 0) {
				// fallback: mono-type uses its only type
				newType = types[0];
			}
		}

		if (newType) {
			move.type = newType as any;
			this.debug(`Chromatic Claw type set to ${newType}`);
		}
	},

	target: "normal",
},


    explosivespores: {
        name: "Explosive Spores",
        shortDesc: "Consumes all stat boosts. BP = 40×#boosts; heal 1/16 max per boost. Combines Ground effectiveness.",
        type: "Grass",
        category: "Special",
        accuracy: true,
        basePower: 0,
        pp: 5,
        priority: 0,
        flags: {protect: 1, mirror: 1, bullet: 1},
        onEffectiveness(typeMod, target, type) {
            if (!target) return;
            return typeMod + this.dex.getEffectiveness('Ground', type);
        },
        onModifyMove(move, pokemon) {
            const boosts = pokemon.boosts;
            let count = 0;
            for (const stat of ['atk','def','spa','spd','spe','accuracy','evasion'] as const) {
                if ((boosts[stat] || 0) !== 0) count += Math.abs(boosts[stat]!);
            }
            move.basePower = Math.max(0, 40 * count);
        },
        onAfterHit(_target, pokemon) {
            const boosts = pokemon.boosts;
            let count = 0;
            for (const stat of ['atk','def','spa','spd','spe','accuracy','evasion'] as const) {
                if ((boosts[stat] || 0) !== 0) count += Math.abs(boosts[stat]!);
            }
            if (count > 0) {
                this.heal(Math.floor(pokemon.baseMaxhp / 16) * count, pokemon);
            }
            pokemon.clearBoosts();
            this.add('-clearboost', pokemon);
        },
        target: "normal",
    },
capcrush: {
		accuracy: 100,
		basePower: 70,
		basePowerCallback(pokemon, target, move) {
			const damagedByTarget = pokemon.attackedBy.some(
				p => p.source === target && p.damage > 0 && p.thisTurn
			);
			if (damagedByTarget) {
				this.debug(`BP doubled for getting hit by ${target}`);
				return move.basePower * 2;
			}
			return move.basePower;
		},
		category: "Physical",
		name: "Cap Crush",
		pp: 10,
		priority: -4,
		flags: { contact: 1, protect: 1, mirror: 1, metronome: 1 },
		secondary: null,
		target: "normal",
		type: "Grass",
		contestType: "Beautiful",
	},

	toxicslash: {
	name: "Toxic Slash",
	shortDesc: "High critical-hit ratio.",
	type: "Poison",
	category: "Physical",
	basePower: 70,
	accuracy: 100,
	pp: 15,
	priority: 0,
	flags: {
		contact: 1,
		slicing: 1,
		protect: 1,
		mirror: 1,
		metronome: 1,
	},
	critRatio: 2, // high crit
	target: "normal",
},

disorientingbite: {
	name: "Disorienting Bite",
	shortDesc: "Dark/Psychic coverage. 25% chance to confuse.",
	type: "Dark",              
	category: "Physical",
	basePower: 80,
	accuracy: 100,
	pp: 10,
	priority: 0,
	flags: {
		bite: 1,
		contact: 1,
		protect: 1,
		mirror: 1,
		metronome: 1,
	},

	secondary: {
		chance: 25,
		volatileStatus: 'confusion',
	},
	onEffectiveness(typeMod, target, type, move) {
			return typeMod + this.dex.getEffectiveness('Psychic', type);
		},

	target: "normal",
},
serenefocus: {
	name: "Serene Focus",
	type: "Psychic", // change if you want another type
	category: "Status",
	basePower: 0,
	accuracy: true,
	pp: 15,
	priority: 0,
	flags: {
	},
	shortDesc: "Next move's chance-based secondary effects always trigger.",
	desc: "The user enters a serene state. The next move it uses that has a chance-based secondary effect will have all such effects activated with 100% probability. The effect is consumed after that move.",
	target: "self",
	self: {
		volatileStatus: 'serenefocus',
	},
},


};
