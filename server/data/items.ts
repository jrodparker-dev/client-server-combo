export const Items: import('../sim/dex-items').ItemDataTable = {
	abilityshield: {
		name: "Ability Shield",
		spritenum: 746,
		fling: {
			basePower: 30,
		},
		ignoreKlutz: true,
		// Neutralizing Gas protection implemented in Pokemon.ignoringAbility() within sim/pokemon.ts
		// and in Neutralizing Gas itself within data/abilities.ts
		onSetAbility(ability, target, source, effect) {
			if (effect && effect.effectType === 'Ability' && effect.name !== 'Trace') {
				this.add('-ability', source, effect);
			}
			this.add('-block', target, 'item: Ability Shield');
			return null;
		},
		// Mold Breaker protection implemented in Battle.suppressingAbility() within sim/battle.ts
		num: 1881,
		gen: 9,
	},
	abomasite: {
		name: "Abomasite",
		spritenum: 575,
		megaStone: "Abomasnow-Mega",
		megaEvolves: "Abomasnow",
		itemUser: ["Abomasnow"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 674,
		gen: 6,
		isNonstandard: "Past",
	},
	absolite: {
		name: "Absolite",
		spritenum: 576,
		megaStone: "Absol-Mega",
		megaEvolves: "Absol",
		itemUser: ["Absol"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 677,
		gen: 6,
		isNonstandard: "Past",
	},
	absorbbulb: {
		name: "Absorb Bulb",
		spritenum: 2,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				target.useItem();
			}
		},
		boosts: {
			spa: 1,
		},
		num: 545,
		gen: 5,
	},
	adamantcrystal: {
		name: "Adamant Crystal",
		spritenum: 741,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 483 || pokemon.baseSpecies.num === 483) {
				return false;
			}
			return true;
		},
		forcedForme: "Dialga-Origin",
		itemUser: ["Dialga-Origin"],
		num: 1777,
		gen: 8,
	},
	adamantorb: {
		name: "Adamant Orb",
		spritenum: 4,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 483 && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		itemUser: ["Dialga"],
		num: 135,
		gen: 4,
	},
	adrenalineorb: {
		name: "Adrenaline Orb",
		spritenum: 660,
		fling: {
			basePower: 30,
		},
		onAfterBoost(boost, target, source, effect) {
			// Adrenaline Orb activates if Intimidate is blocked by an ability like Hyper Cutter,
			// which deletes boost.atk,
			// but not if the holder's attack is already at -6 (or +6 if it has Contrary),
			// which sets boost.atk to 0
			if (target.boosts['spe'] === 6 || boost.atk === 0) {
				return;
			}
			if (effect.name === 'Intimidate') {
				target.useItem();
			}
		},
		boosts: {
			spe: 1,
		},
		num: 846,
		gen: 7,
	},
	aerodactylite: {
		name: "Aerodactylite",
		spritenum: 577,
		megaStone: "Aerodactyl-Mega",
		megaEvolves: "Aerodactyl",
		itemUser: ["Aerodactyl"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 672,
		gen: 6,
		isNonstandard: "Past",
	},
	aggronite: {
		name: "Aggronite",
		spritenum: 578,
		megaStone: "Aggron-Mega",
		megaEvolves: "Aggron",
		itemUser: ["Aggron"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 667,
		gen: 6,
		isNonstandard: "Past",
	},
	aguavberry: {
		name: "Aguav Berry",
		spritenum: 5,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spd') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 162,
		gen: 3,
	},
	airballoon: {
		name: "Air Balloon",
		spritenum: 6,
		fling: {
			basePower: 10,
		},
		onStart(target) {
			if (!target.ignoringItem() && !this.field.getPseudoWeather('gravity')) {
				this.add('-item', target, 'Air Balloon');
			}
		},
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onDamagingHit(damage, target, source, move) {
			this.add('-enditem', target, 'Air Balloon');
			target.item = '';
			this.clearEffectState(target.itemState);
			this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
		},
		onAfterSubDamage(damage, target, source, effect) {
			this.debug('effect: ' + effect.id);
			if (effect.effectType === 'Move') {
				this.add('-enditem', target, 'Air Balloon');
				target.item = '';
				this.clearEffectState(target.itemState);
				this.runEvent('AfterUseItem', target, null, null, this.dex.items.get('airballoon'));
			}
		},
		num: 541,
		gen: 5,
	},
	alakazite: {
		name: "Alakazite",
		spritenum: 579,
		megaStone: "Alakazam-Mega",
		megaEvolves: "Alakazam",
		itemUser: ["Alakazam"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 679,
		gen: 6,
		isNonstandard: "Past",
	},
	aloraichiumz: {
		name: "Aloraichium Z",
		spritenum: 655,
		onTakeItem: false,
		zMove: "Stoked Sparksurfer",
		zMoveFrom: "Thunderbolt",
		itemUser: ["Raichu-Alola"],
		num: 803,
		gen: 7,
		isNonstandard: "Past",
	},
	altarianite: {
		name: "Altarianite",
		spritenum: 615,
		megaStone: "Altaria-Mega",
		megaEvolves: "Altaria",
		itemUser: ["Altaria"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 755,
		gen: 6,
		isNonstandard: "Past",
	},
	ampharosite: {
		name: "Ampharosite",
		spritenum: 580,
		megaStone: "Ampharos-Mega",
		megaEvolves: "Ampharos",
		itemUser: ["Ampharos"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 658,
		gen: 6,
		isNonstandard: "Past",
	},
	apicotberry: {
		name: "Apicot Berry",
		spritenum: 10,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Ground",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ spd: 1 });
		},
		num: 205,
		gen: 3,
	},
	armorfossil: {
		name: "Armor Fossil",
		spritenum: 12,
		fling: {
			basePower: 100,
		},
		num: 104,
		gen: 4,
		isNonstandard: "Past",
	},
	aspearberry: {
		name: "Aspear Berry",
		spritenum: 13,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ice",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.cureStatus();
			}
		},
		num: 153,
		gen: 3,
	},
	assaultvest: {
		name: "Assault Vest",
		spritenum: 581,
		fling: {
			basePower: 80,
		},
		onModifySpDPriority: 1,
		onModifySpD(spd) {
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.category === 'Status' && move.id !== 'mefirst') {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
		num: 640,
		gen: 6,
	},
	audinite: {
		name: "Audinite",
		spritenum: 617,
		megaStone: "Audino-Mega",
		megaEvolves: "Audino",
		itemUser: ["Audino"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 757,
		gen: 6,
		isNonstandard: "Past",
	},
	auspiciousarmor: {
		name: "Auspicious Armor",
		spritenum: 753,
		fling: {
			basePower: 30,
		},
		num: 2344,
		gen: 9,
	},
	babiriberry: {
		name: "Babiri Berry",
		spritenum: 17,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Steel",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Steel' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 199,
		gen: 4,
	},
	banettite: {
		name: "Banettite",
		spritenum: 582,
		megaStone: "Banette-Mega",
		megaEvolves: "Banette",
		itemUser: ["Banette"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 668,
		gen: 6,
		isNonstandard: "Past",
	},
	beastball: {
		name: "Beast Ball",
		spritenum: 661,
		num: 851,
		gen: 7,
		isPokeball: true,
	},
	beedrillite: {
		name: "Beedrillite",
		spritenum: 628,
		megaStone: "Beedrill-Mega",
		megaEvolves: "Beedrill",
		itemUser: ["Beedrill"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 770,
		gen: 6,
		isNonstandard: "Past",
	},
	belueberry: {
		name: "Belue Berry",
		spritenum: 21,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Electric",
		},
		onEat: false,
		num: 183,
		gen: 3,
		isNonstandard: "Past",
	},
	berryjuice: {
		name: "Berry Juice",
		spritenum: 22,
		fling: {
			basePower: 30,
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				if (this.runEvent('TryHeal', pokemon, null, this.effect, 20) && pokemon.useItem()) {
					this.heal(20);
				}
			}
		},
		num: 43,
		gen: 2,
		isNonstandard: "Past",
	},
	berrysweet: {
		name: "Berry Sweet",
		spritenum: 706,
		fling: {
			basePower: 10,
		},
		num: 1111,
		gen: 8,
	},
	bignugget: {
		name: "Big Nugget",
		spritenum: 27,
		fling: {
			basePower: 130,
		},
		num: 581,
		gen: 5,
	},
	bigroot: {
		name: "Big Root",
		spritenum: 29,
		fling: {
			basePower: 10,
		},
		onTryHealPriority: 1,
		onTryHeal(damage, target, source, effect) {
			const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
			if (heals.includes(effect.id)) {
				return this.chainModify([5324, 4096]);
			}
		},
		num: 296,
		gen: 4,
	},
	bindingband: {
		name: "Binding Band",
		spritenum: 31,
		fling: {
			basePower: 30,
		},
		// implemented in statuses
		num: 544,
		gen: 5,
	},
	blackbelt: {
		name: "Black Belt",
		spritenum: 32,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 241,
		gen: 2,
	},
	blackglasses: {
		name: "Black Glasses",
		spritenum: 35,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 240,
		gen: 2,
	},
	blacksludge: {
		name: "Black Sludge",
		spritenum: 34,
		fling: {
			basePower: 30,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			if (pokemon.hasType('Poison')) {
				this.heal(pokemon.baseMaxhp / 16);
			} else {
				this.damage(pokemon.baseMaxhp / 8);
			}
		},
		num: 281,
		gen: 4,
	},
	blastoisinite: {
		name: "Blastoisinite",
		spritenum: 583,
		megaStone: "Blastoise-Mega",
		megaEvolves: "Blastoise",
		itemUser: ["Blastoise"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 661,
		gen: 6,
		isNonstandard: "Past",
	},
	blazikenite: {
		name: "Blazikenite",
		spritenum: 584,
		megaStone: "Blaziken-Mega",
		megaEvolves: "Blaziken",
		itemUser: ["Blaziken"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 664,
		gen: 6,
		isNonstandard: "Past",
	},
	blueorb: {
		name: "Blue Orb",
		spritenum: 41,
		onSwitchInPriority: -1,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Kyogre' && !pokemon.transformed) {
				pokemon.formeChange('Kyogre-Primal', this.effect, true);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Kyogre') return false;
			return true;
		},
		itemUser: ["Kyogre"],
		isPrimalOrb: true,
		num: 535,
		gen: 6,
		isNonstandard: "Past",
	},
	blukberry: {
		name: "Bluk Berry",
		spritenum: 44,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Fire",
		},
		onEat: false,
		num: 165,
		gen: 3,
		isNonstandard: "Past",
	},
	blunderpolicy: {
		name: "Blunder Policy",
		spritenum: 716,
		fling: {
			basePower: 80,
		},
		// Item activation located in scripts.js
		num: 1121,
		gen: 8,
	},
	boosterenergy: {
		name: "Booster Energy",
		spritenum: 745,
		fling: {
			basePower: 30,
		},
		onSwitchInPriority: -2,
		onStart(pokemon) {
			this.effectState.started = true;
			((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon);
		},
		onUpdate(pokemon) {
			if (!this.effectState.started || pokemon.transformed) return;

			if (pokemon.hasAbility('protosynthesis') && !this.field.isWeather('sunnyday') && pokemon.useItem()) {
				pokemon.addVolatile('protosynthesis');
			}
			if (pokemon.hasAbility('quarkdrive') && !this.field.isTerrain('electricterrain') && pokemon.useItem()) {
				pokemon.addVolatile('quarkdrive');
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.tags.includes("Paradox")) return false;
			return true;
		},
		num: 1880,
		gen: 9,
	},
	bottlecap: {
		name: "Bottle Cap",
		spritenum: 696,
		fling: {
			basePower: 30,
		},
		num: 795,
		gen: 7,
	},
	brightpowder: {
		name: "Bright Powder",
		spritenum: 51,
		fling: {
			basePower: 10,
		},
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return this.chainModify([3686, 4096]);
		},
		num: 213,
		gen: 2,
	},
	buggem: {
		name: "Bug Gem",
		spritenum: 53,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Bug' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 558,
		gen: 5,
		isNonstandard: "Past",
	},
	bugmemory: {
		name: "Bug Memory",
		spritenum: 673,
		onMemory: 'Bug',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Bug",
		itemUser: ["Silvally-Bug"],
		num: 909,
		gen: 7,
		isNonstandard: "Past",
	},
	buginiumz: {
		name: "Buginium Z",
		spritenum: 642,
		onPlate: 'Bug',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Bug",
		forcedForme: "Arceus-Bug",
		num: 787,
		gen: 7,
		isNonstandard: "Past",
	},
	burndrive: {
		name: "Burn Drive",
		spritenum: 54,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
				return false;
			}
			return true;
		},
		onDrive: 'Fire',
		forcedForme: "Genesect-Burn",
		itemUser: ["Genesect-Burn"],
		num: 118,
		gen: 5,
		isNonstandard: "Past",
	},
	cameruptite: {
		name: "Cameruptite",
		spritenum: 625,
		megaStone: "Camerupt-Mega",
		megaEvolves: "Camerupt",
		itemUser: ["Camerupt"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 767,
		gen: 6,
		isNonstandard: "Past",
	},
	cellbattery: {
		name: "Cell Battery",
		spritenum: 60,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Electric') {
				target.useItem();
			}
		},
		boosts: {
			atk: 1,
		},
		num: 546,
		gen: 5,
	},
	charcoal: {
		name: "Charcoal",
		spritenum: 61,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 249,
		gen: 2,
	},
	charizarditex: {
		name: "Charizardite X",
		spritenum: 585,
		megaStone: "Charizard-Mega-X",
		megaEvolves: "Charizard",
		itemUser: ["Charizard"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 660,
		gen: 6,
		isNonstandard: "Past",
	},
	charizarditey: {
		name: "Charizardite Y",
		spritenum: 586,
		megaStone: "Charizard-Mega-Y",
		megaEvolves: "Charizard",
		itemUser: ["Charizard"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 678,
		gen: 6,
		isNonstandard: "Past",
	},
	chartiberry: {
		name: "Charti Berry",
		spritenum: 62,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Rock",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Rock' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 195,
		gen: 4,
	},
	cheriberry: {
		name: "Cheri Berry",
		spritenum: 63,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.cureStatus();
			}
		},
		num: 149,
		gen: 3,
	},
	cherishball: {
		name: "Cherish Ball",
		spritenum: 64,
		num: 16,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	chestoberry: {
		name: "Chesto Berry",
		spritenum: 65,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.cureStatus();
			}
		},
		num: 150,
		gen: 3,
	},
	chilanberry: {
		name: "Chilan Berry",
		spritenum: 66,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Normal",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (
				move.type === 'Normal' &&
				(!target.volatiles['substitute'] || move.flags['bypasssub'] || (move.infiltrates && this.gen >= 6))
			) {
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 200,
		gen: 4,
	},
	chilldrive: {
		name: "Chill Drive",
		spritenum: 67,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
				return false;
			}
			return true;
		},
		onDrive: 'Ice',
		forcedForme: "Genesect-Chill",
		itemUser: ["Genesect-Chill"],
		num: 119,
		gen: 5,
		isNonstandard: "Past",
	},
	chippedpot: {
		name: "Chipped Pot",
		spritenum: 720,
		fling: {
			basePower: 80,
		},
		num: 1254,
		gen: 8,
	},
	choiceband: {
		name: "Choice Band",
		spritenum: 68,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock');
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 220,
		gen: 3,
	},
	choicescarf: {
		name: "Choice Scarf",
		spritenum: 69,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock');
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 287,
		gen: 4,
	},
	choicespecs: {
		name: "Choice Specs",
		spritenum: 70,
		fling: {
			basePower: 10,
		},
		onStart(pokemon) {
			if (pokemon.volatiles['choicelock']) {
				this.debug('removing choicelock');
			}
			pokemon.removeVolatile('choicelock');
		},
		onModifyMove(move, pokemon) {
			pokemon.addVolatile('choicelock');
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.chainModify(1.5);
		},
		isChoice: true,
		num: 297,
		gen: 4,
	},
	chopleberry: {
		name: "Chople Berry",
		spritenum: 71,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fighting' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 189,
		gen: 4,
	},
	clawfossil: {
		name: "Claw Fossil",
		spritenum: 72,
		fling: {
			basePower: 100,
		},
		num: 100,
		gen: 3,
		isNonstandard: "Past",
	},
	clearamulet: {
		name: "Clear Amulet",
		spritenum: 747,
		fling: {
			basePower: 30,
		},
		onTryBoostPriority: 1,
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add('-fail', target, 'unboost', '[from] item: Clear Amulet', `[of] ${target}`);
			}
		},
		num: 1882,
		gen: 9,
	},
	cloversweet: {
		name: "Clover Sweet",
		spritenum: 707,
		fling: {
			basePower: 10,
		},
		num: 1112,
		gen: 8,
	},
	cobaberry: {
		name: "Coba Berry",
		spritenum: 76,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Flying' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 192,
		gen: 4,
	},
	colburberry: {
		name: "Colbur Berry",
		spritenum: 78,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dark",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dark' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 198,
		gen: 4,
	},
	cornerstonemask: {
		name: "Cornerstone Mask",
		spritenum: 758,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Cornerstone')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Cornerstone",
		itemUser: ["Ogerpon-Cornerstone"],
		num: 2406,
		gen: 9,
	},
	cornnberry: {
		name: "Cornn Berry",
		spritenum: 81,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Bug",
		},
		onEat: false,
		num: 175,
		gen: 3,
		isNonstandard: "Past",
	},
	coverfossil: {
		name: "Cover Fossil",
		spritenum: 85,
		fling: {
			basePower: 100,
		},
		num: 572,
		gen: 5,
		isNonstandard: "Past",
	},
	covertcloak: {
		name: "Covert Cloak",
		spritenum: 750,
		fling: {
			basePower: 30,
		},
		onModifySecondaries(secondaries) {
			this.debug('Covert Cloak prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		num: 1885,
		gen: 9,
	},
	crackedpot: {
		name: "Cracked Pot",
		spritenum: 719,
		fling: {
			basePower: 80,
		},
		num: 1253,
		gen: 8,
	},
	custapberry: {
		name: "Custap Berry",
		spritenum: 86,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Ghost",
		},
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon) {
			if (
				priority <= 0 &&
				(pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
					pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony))
			) {
				if (pokemon.eatItem()) {
					this.add('-activate', pokemon, 'item: Custap Berry', '[consumed]');
					return 0.1;
				}
			}
		},
		onEat() { },
		num: 210,
		gen: 4,
	},
	damprock: {
		name: "Damp Rock",
		spritenum: 88,
		fling: {
			basePower: 60,
		},
		num: 285,
		gen: 4,
	},
	darkgem: {
		name: "Dark Gem",
		spritenum: 89,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dark' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 562,
		gen: 5,
		isNonstandard: "Past",
	},
	darkmemory: {
		name: "Dark Memory",
		spritenum: 683,
		onMemory: 'Dark',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Dark",
		itemUser: ["Silvally-Dark"],
		num: 919,
		gen: 7,
		isNonstandard: "Past",
	},
	darkiniumz: {
		name: "Darkinium Z",
		spritenum: 646,
		onPlate: 'Dark',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Dark",
		forcedForme: "Arceus-Dark",
		num: 791,
		gen: 7,
		isNonstandard: "Past",
	},
	dawnstone: {
		name: "Dawn Stone",
		spritenum: 92,
		fling: {
			basePower: 80,
		},
		num: 109,
		gen: 4,
	},
	decidiumz: {
		name: "Decidium Z",
		spritenum: 650,
		onTakeItem: false,
		zMove: "Sinister Arrow Raid",
		zMoveFrom: "Spirit Shackle",
		itemUser: ["Decidueye"],
		num: 798,
		gen: 7,
		isNonstandard: "Past",
	},
	deepseascale: {
		name: "Deep Sea Scale",
		spritenum: 93,
		fling: {
			basePower: 30,
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl"],
		num: 227,
		gen: 3,
		isNonstandard: "Past",
	},
	deepseatooth: {
		name: "Deep Sea Tooth",
		spritenum: 94,
		fling: {
			basePower: 90,
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.name === 'Clamperl') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Clamperl"],
		num: 226,
		gen: 3,
		isNonstandard: "Past",
	},
	destinyknot: {
		name: "Destiny Knot",
		spritenum: 95,
		fling: {
			basePower: 10,
		},
		onAttractPriority: -100,
		onAttract(target, source) {
			this.debug(`attract intercepted: ${target} from ${source}`);
			if (!source || source === target) return;
			if (!source.volatiles['attract']) source.addVolatile('attract', target);
		},
		num: 280,
		gen: 4,
	},
	diancite: {
		name: "Diancite",
		spritenum: 624,
		megaStone: "Diancie-Mega",
		megaEvolves: "Diancie",
		itemUser: ["Diancie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 764,
		gen: 6,
		isNonstandard: "Past",
	},
	diveball: {
		name: "Dive Ball",
		spritenum: 101,
		num: 7,
		gen: 3,
		isPokeball: true,
	},
	domefossil: {
		name: "Dome Fossil",
		spritenum: 102,
		fling: {
			basePower: 100,
		},
		num: 102,
		gen: 3,
		isNonstandard: "Past",
	},
	dousedrive: {
		name: "Douse Drive",
		spritenum: 103,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
				return false;
			}
			return true;
		},
		onDrive: 'Water',
		forcedForme: "Genesect-Douse",
		itemUser: ["Genesect-Douse"],
		num: 116,
		gen: 5,
		isNonstandard: "Past",
	},
	dracoplate: {
		name: "Draco Plate",
		spritenum: 105,
		onPlate: 'Dragon',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Dragon",
		num: 311,
		gen: 4,
	},
	dragonfang: {
		name: "Dragon Fang",
		spritenum: 106,
		fling: {
			basePower: 70,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 250,
		gen: 2,
	},
	dragongem: {
		name: "Dragon Gem",
		spritenum: 107,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Dragon' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 561,
		gen: 5,
		isNonstandard: "Past",
	},
	dragonmemory: {
		name: "Dragon Memory",
		spritenum: 682,
		onMemory: 'Dragon',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Dragon",
		itemUser: ["Silvally-Dragon"],
		num: 918,
		gen: 7,
		isNonstandard: "Past",
	},
	dragonscale: {
		name: "Dragon Scale",
		spritenum: 108,
		fling: {
			basePower: 30,
		},
		num: 235,
		gen: 2,
	},
	dragoniumz: {
		name: "Dragonium Z",
		spritenum: 645,
		onPlate: 'Dragon',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Dragon",
		forcedForme: "Arceus-Dragon",
		num: 790,
		gen: 7,
		isNonstandard: "Past",
	},
	dreadplate: {
		name: "Dread Plate",
		spritenum: 110,
		onPlate: 'Dark',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Dark",
		num: 312,
		gen: 4,
	},
	dreamball: {
		name: "Dream Ball",
		spritenum: 111,
		num: 576,
		gen: 5,
		isPokeball: true,
	},
	dubiousdisc: {
		name: "Dubious Disc",
		spritenum: 113,
		fling: {
			basePower: 50,
		},
		num: 324,
		gen: 4,
	},
	durinberry: {
		name: "Durin Berry",
		spritenum: 114,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Water",
		},
		onEat: false,
		num: 182,
		gen: 3,
		isNonstandard: "Past",
	},
	duskball: {
		name: "Dusk Ball",
		spritenum: 115,
		num: 13,
		gen: 4,
		isPokeball: true,
	},
	duskstone: {
		name: "Dusk Stone",
		spritenum: 116,
		fling: {
			basePower: 80,
		},
		num: 108,
		gen: 4,
	},
	earthplate: {
		name: "Earth Plate",
		spritenum: 117,
		onPlate: 'Ground',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ground') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Ground",
		num: 305,
		gen: 4,
	},
	eeviumz: {
		name: "Eevium Z",
		spritenum: 657,
		onTakeItem: false,
		zMove: "Extreme Evoboost",
		zMoveFrom: "Last Resort",
		itemUser: ["Eevee"],
		num: 805,
		gen: 7,
		isNonstandard: "Past",
	},
	ejectbutton: {
		name: "Eject Button",
		spritenum: 118,
		fling: {
			basePower: 30,
		},
		onAfterMoveSecondaryPriority: 2,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && target.hp && move && move.category !== 'Status' && !move.flags['futuremove']) {
				if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.beingCalledBack || target.isSkyDropped()) return;
				if (target.volatiles['commanding'] || target.volatiles['commanded']) return;
				for (const pokemon of this.getAllActive()) {
					if (pokemon.switchFlag === true) return;
				}
				target.switchFlag = true;
				if (target.useItem()) {
					source.switchFlag = false;
				} else {
					target.switchFlag = false;
				}
			}
		},
		num: 547,
		gen: 5,
	},
	ejectpack: {
		name: "Eject Pack",
		spritenum: 714,
		fling: {
			basePower: 50,
		},
		onAfterBoost(boost, pokemon) {
			if (this.effectState.eject || this.activeMove?.id === 'partingshot') return;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					this.effectState.eject = true;
					break;
				}
			}
		},
		onAnySwitchInPriority: -4,
		onAnySwitchIn() {
			if (!this.effectState.eject) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMega() {
			if (!this.effectState.eject) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMove() {
			if (!this.effectState.eject) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.eject) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onUseItem(item, pokemon) {
			if (!this.canSwitch(pokemon.side)) return false;
			if (pokemon.volatiles['commanding'] || pokemon.volatiles['commanded']) return false;
			for (const active of this.getAllActive()) {
				if (active.switchFlag === true) return false;
			}
			return true;
		},
		onUse(pokemon) {
			pokemon.switchFlag = true;
		},
		onEnd() {
			delete this.effectState.eject;
		},
		num: 1119,
		gen: 8,
	},
	electirizer: {
		name: "Electirizer",
		spritenum: 119,
		fling: {
			basePower: 80,
		},
		num: 322,
		gen: 4,
	},
	electricgem: {
		name: "Electric Gem",
		spritenum: 120,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
			if (move.type === 'Electric' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 550,
		gen: 5,
		isNonstandard: "Past",
	},
	electricmemory: {
		name: "Electric Memory",
		spritenum: 679,
		onMemory: 'Electric',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Electric",
		itemUser: ["Silvally-Electric"],
		num: 915,
		gen: 7,
		isNonstandard: "Past",
	},
	electricseed: {
		name: "Electric Seed",
		spritenum: 664,
		fling: {
			basePower: 10,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('electricterrain')) {
				pokemon.useItem();
			}
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 881,
		gen: 7,
	},
	electriumz: {
		name: "Electrium Z",
		spritenum: 634,
		onPlate: 'Electric',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Electric",
		forcedForme: "Arceus-Electric",
		num: 779,
		gen: 7,
		isNonstandard: "Past",
	},
	enigmaberry: {
		name: "Enigma Berry",
		spritenum: 124,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Bug",
		},
		onHit(target, source, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				if (target.eatItem()) {
					this.heal(target.baseMaxhp / 4);
				}
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 4)) return false;
		},
		onEat() { },
		num: 208,
		gen: 3,
	},
	eviolite: {
		name: "Eviolite",
		spritenum: 130,
		fling: {
			basePower: 40,
		},
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		onModifySpDPriority: 2,
		onModifySpD(spd, pokemon) {
			if (pokemon.baseSpecies.nfe) {
				return this.chainModify(1.5);
			}
		},
		num: 538,
		gen: 5,
	},
	expertbelt: {
		name: "Expert Belt",
		spritenum: 132,
		fling: {
			basePower: 10,
		},
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 268,
		gen: 4,
	},
	fairiumz: {
		name: "Fairium Z",
		spritenum: 648,
		onPlate: 'Fairy',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Fairy",
		forcedForme: "Arceus-Fairy",
		num: 793,
		gen: 7,
		isNonstandard: "Past",
	},
	fairyfeather: {
		name: "Fairy Feather",
		spritenum: 754,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 2401,
		gen: 9,
	},
	fairygem: {
		name: "Fairy Gem",
		spritenum: 611,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fairy' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 715,
		gen: 6,
		isNonstandard: "Past",
	},
	fairymemory: {
		name: "Fairy Memory",
		spritenum: 684,
		onMemory: 'Fairy',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Fairy",
		itemUser: ["Silvally-Fairy"],
		num: 920,
		gen: 7,
		isNonstandard: "Past",
	},
	fastball: {
		name: "Fast Ball",
		spritenum: 137,
		num: 492,
		gen: 2,
		isPokeball: true,
	},
	fightinggem: {
		name: "Fighting Gem",
		spritenum: 139,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Fighting' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 553,
		gen: 5,
		isNonstandard: "Past",
	},
	fightingmemory: {
		name: "Fighting Memory",
		spritenum: 668,
		onMemory: 'Fighting',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Fighting",
		itemUser: ["Silvally-Fighting"],
		num: 904,
		gen: 7,
		isNonstandard: "Past",
	},
	fightiniumz: {
		name: "Fightinium Z",
		spritenum: 637,
		onPlate: 'Fighting',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Fighting",
		forcedForme: "Arceus-Fighting",
		num: 782,
		gen: 7,
		isNonstandard: "Past",
	},
	figyberry: {
		name: "Figy Berry",
		spritenum: 140,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Bug",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'atk') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 159,
		gen: 3,
	},
	firegem: {
		name: "Fire Gem",
		spritenum: 141,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
			if (move.type === 'Fire' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 548,
		gen: 5,
		isNonstandard: "Past",
	},
	firememory: {
		name: "Fire Memory",
		spritenum: 676,
		onMemory: 'Fire',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Fire",
		itemUser: ["Silvally-Fire"],
		num: 912,
		gen: 7,
		isNonstandard: "Past",
	},
	firestone: {
		name: "Fire Stone",
		spritenum: 142,
		fling: {
			basePower: 30,
		},
		num: 82,
		gen: 1,
	},
	firiumz: {
		name: "Firium Z",
		spritenum: 632,
		onPlate: 'Fire',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Fire",
		forcedForme: "Arceus-Fire",
		num: 777,
		gen: 7,
		isNonstandard: "Past",
	},
	fistplate: {
		name: "Fist Plate",
		spritenum: 143,
		onPlate: 'Fighting',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Fighting",
		num: 303,
		gen: 4,
	},
	flameorb: {
		name: "Flame Orb",
		spritenum: 145,
		fling: {
			basePower: 30,
			status: 'brn',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			pokemon.trySetStatus('brn', pokemon);
		},
		num: 273,
		gen: 4,
	},
	flameplate: {
		name: "Flame Plate",
		spritenum: 146,
		onPlate: 'Fire',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Fire",
		num: 298,
		gen: 4,
	},
	floatstone: {
		name: "Float Stone",
		spritenum: 147,
		fling: {
			basePower: 30,
		},
		onModifyWeight(weighthg) {
			return this.trunc(weighthg / 2);
		},
		num: 539,
		gen: 5,
	},
	flowersweet: {
		name: "Flower Sweet",
		spritenum: 708,
		fling: {
			basePower: 0,
		},
		num: 1113,
		gen: 8,
	},
	flyinggem: {
		name: "Flying Gem",
		spritenum: 149,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Flying' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 556,
		gen: 5,
		isNonstandard: "Past",
	},
	flyingmemory: {
		name: "Flying Memory",
		spritenum: 669,
		onMemory: 'Flying',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Flying",
		itemUser: ["Silvally-Flying"],
		num: 905,
		gen: 7,
		isNonstandard: "Past",
	},
	flyiniumz: {
		name: "Flyinium Z",
		spritenum: 640,
		onPlate: 'Flying',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Flying",
		forcedForme: "Arceus-Flying",
		num: 785,
		gen: 7,
		isNonstandard: "Past",
	},
	focusband: {
		name: "Focus Band",
		spritenum: 150,
		fling: {
			basePower: 10,
		},
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (this.randomChance(1, 10) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add("-activate", target, "item: Focus Band");
				return target.hp - 1;
			}
		},
		num: 230,
		gen: 2,
	},
	focussash: {
		name: "Focus Sash",
		spritenum: 151,
		fling: {
			basePower: 10,
		},
		onDamagePriority: -40,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				if (target.useItem()) {
					return target.hp - 1;
				}
			}
		},
		num: 275,
		gen: 4,
	},
	fossilizedbird: {
		name: "Fossilized Bird",
		spritenum: 700,
		fling: {
			basePower: 100,
		},
		num: 1105,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizeddino: {
		name: "Fossilized Dino",
		spritenum: 703,
		fling: {
			basePower: 100,
		},
		num: 1108,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizeddrake: {
		name: "Fossilized Drake",
		spritenum: 702,
		fling: {
			basePower: 100,
		},
		num: 1107,
		gen: 8,
		isNonstandard: "Past",
	},
	fossilizedfish: {
		name: "Fossilized Fish",
		spritenum: 701,
		fling: {
			basePower: 100,
		},
		num: 1106,
		gen: 8,
		isNonstandard: "Past",
	},
	friendball: {
		name: "Friend Ball",
		spritenum: 153,
		num: 497,
		gen: 2,
		isPokeball: true,
	},
	fullincense: {
		name: "Full Incense",
		spritenum: 155,
		fling: {
			basePower: 10,
		},
		onFractionalPriority: -0.1,
		num: 316,
		gen: 4,
		isNonstandard: "Past",
	},
	galaricacuff: {
		name: "Galarica Cuff",
		spritenum: 739,
		fling: {
			basePower: 30,
		},
		num: 1582,
		gen: 8,
	},
	galaricawreath: {
		name: "Galarica Wreath",
		spritenum: 740,
		fling: {
			basePower: 30,
		},
		num: 1592,
		gen: 8,
	},
	galladite: {
		name: "Galladite",
		spritenum: 616,
		megaStone: "Gallade-Mega",
		megaEvolves: "Gallade",
		itemUser: ["Gallade"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 756,
		gen: 6,
		isNonstandard: "Past",
	},
	ganlonberry: {
		name: "Ganlon Berry",
		spritenum: 158,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Ice",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ def: 1 });
		},
		num: 202,
		gen: 3,
	},
	garchompite: {
		name: "Garchompite",
		spritenum: 589,
		megaStone: "Garchomp-Mega",
		megaEvolves: "Garchomp",
		itemUser: ["Garchomp"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 683,
		gen: 6,
		isNonstandard: "Past",
	},
	gardevoirite: {
		name: "Gardevoirite",
		spritenum: 587,
		megaStone: "Gardevoir-Mega",
		megaEvolves: "Gardevoir",
		itemUser: ["Gardevoir"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 657,
		gen: 6,
		isNonstandard: "Past",
	},
	gengarite: {
		name: "Gengarite",
		spritenum: 588,
		megaStone: "Gengar-Mega",
		megaEvolves: "Gengar",
		itemUser: ["Gengar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 656,
		gen: 6,
		isNonstandard: "Past",
	},
	ghostgem: {
		name: "Ghost Gem",
		spritenum: 161,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ghost' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 560,
		gen: 5,
		isNonstandard: "Past",
	},
	ghostmemory: {
		name: "Ghost Memory",
		spritenum: 674,
		onMemory: 'Ghost',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ghost",
		itemUser: ["Silvally-Ghost"],
		num: 910,
		gen: 7,
		isNonstandard: "Past",
	},
	ghostiumz: {
		name: "Ghostium Z",
		spritenum: 644,
		onPlate: 'Ghost',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Ghost",
		forcedForme: "Arceus-Ghost",
		num: 789,
		gen: 7,
		isNonstandard: "Past",
	},
	glalitite: {
		name: "Glalitite",
		spritenum: 623,
		megaStone: "Glalie-Mega",
		megaEvolves: "Glalie",
		itemUser: ["Glalie"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 763,
		gen: 6,
		isNonstandard: "Past",
	},
	goldbottlecap: {
		name: "Gold Bottle Cap",
		spritenum: 697,
		fling: {
			basePower: 30,
		},
		num: 796,
		gen: 7,
	},
	grassgem: {
		name: "Grass Gem",
		spritenum: 172,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
			if (move.type === 'Grass' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 551,
		gen: 5,
		isNonstandard: "Past",
	},
	grassmemory: {
		name: "Grass Memory",
		spritenum: 678,
		onMemory: 'Grass',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Grass",
		itemUser: ["Silvally-Grass"],
		num: 914,
		gen: 7,
		isNonstandard: "Past",
	},
	grassiumz: {
		name: "Grassium Z",
		spritenum: 635,
		onPlate: 'Grass',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Grass",
		forcedForme: "Arceus-Grass",
		num: 780,
		gen: 7,
		isNonstandard: "Past",
	},
	grassyseed: {
		name: "Grassy Seed",
		spritenum: 667,
		fling: {
			basePower: 10,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('grassyterrain')) {
				pokemon.useItem();
			}
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('grassyterrain')) {
				pokemon.useItem();
			}
		},
		boosts: {
			def: 1,
		},
		num: 884,
		gen: 7,
	},
	greatball: {
		name: "Great Ball",
		spritenum: 174,
		num: 3,
		gen: 1,
		isPokeball: true,
	},
	grepaberry: {
		name: "Grepa Berry",
		spritenum: 178,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Flying",
		},
		onEat: false,
		num: 173,
		gen: 3,
	},
	gripclaw: {
		name: "Grip Claw",
		spritenum: 179,
		fling: {
			basePower: 90,
		},
		// implemented in statuses
		num: 286,
		gen: 4,
	},
	griseouscore: {
		name: "Griseous Core",
		spritenum: 743,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 487 || pokemon.baseSpecies.num === 487) {
				return false;
			}
			return true;
		},
		forcedForme: "Giratina-Origin",
		itemUser: ["Giratina-Origin"],
		num: 1779,
		gen: 8,
	},
	griseousorb: {
		name: "Griseous Orb",
		spritenum: 180,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		itemUser: ["Giratina"],
		num: 112,
		gen: 4,
	},
	groundgem: {
		name: "Ground Gem",
		spritenum: 182,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ground' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 555,
		gen: 5,
		isNonstandard: "Past",
	},
	groundmemory: {
		name: "Ground Memory",
		spritenum: 671,
		onMemory: 'Ground',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ground",
		itemUser: ["Silvally-Ground"],
		num: 907,
		gen: 7,
		isNonstandard: "Past",
	},
	groundiumz: {
		name: "Groundium Z",
		spritenum: 639,
		onPlate: 'Ground',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Ground",
		forcedForme: "Arceus-Ground",
		num: 784,
		gen: 7,
		isNonstandard: "Past",
	},
	gyaradosite: {
		name: "Gyaradosite",
		spritenum: 589,
		megaStone: "Gyarados-Mega",
		megaEvolves: "Gyarados",
		itemUser: ["Gyarados"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 676,
		gen: 6,
		isNonstandard: "Past",
	},
	habanberry: {
		name: "Haban Berry",
		spritenum: 185,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dragon",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Dragon' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 197,
		gen: 4,
	},
	hardstone: {
		name: "Hard Stone",
		spritenum: 187,
		fling: {
			basePower: 100,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 238,
		gen: 2,
	},
	healball: {
		name: "Heal Ball",
		spritenum: 188,
		num: 14,
		gen: 4,
		isPokeball: true,
	},
	hearthflamemask: {
		name: "Hearthflame Mask",
		spritenum: 760,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Hearthflame')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Hearthflame",
		itemUser: ["Ogerpon-Hearthflame"],
		num: 2408,
		gen: 9,
	},
	heatrock: {
		name: "Heat Rock",
		spritenum: 193,
		fling: {
			basePower: 60,
		},
		num: 284,
		gen: 4,
	},
	heavyball: {
		name: "Heavy Ball",
		spritenum: 194,
		num: 495,
		gen: 2,
		isPokeball: true,
	},
	heavydutyboots: {
		name: "Heavy-Duty Boots",
		spritenum: 715,
		fling: {
			basePower: 80,
		},
		num: 1120,
		gen: 8,
		// Hazard Immunity implemented in moves.ts
	},
	helixfossil: {
		name: "Helix Fossil",
		spritenum: 195,
		fling: {
			basePower: 100,
		},
		num: 101,
		gen: 3,
		isNonstandard: "Past",
	},
	heracronite: {
		name: "Heracronite",
		spritenum: 590,
		megaStone: "Heracross-Mega",
		megaEvolves: "Heracross",
		itemUser: ["Heracross"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 680,
		gen: 6,
		isNonstandard: "Past",
	},
	hondewberry: {
		name: "Hondew Berry",
		spritenum: 213,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Ground",
		},
		onEat: false,
		num: 172,
		gen: 3,
	},
	houndoominite: {
		name: "Houndoominite",
		spritenum: 591,
		megaStone: "Houndoom-Mega",
		megaEvolves: "Houndoom",
		itemUser: ["Houndoom"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 666,
		gen: 6,
		isNonstandard: "Past",
	},
	iapapaberry: {
		name: "Iapapa Berry",
		spritenum: 217,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Dark",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'def') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 163,
		gen: 3,
	},
	icegem: {
		name: "Ice Gem",
		spritenum: 218,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Ice' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 552,
		gen: 5,
		isNonstandard: "Past",
	},
	icememory: {
		name: "Ice Memory",
		spritenum: 681,
		onMemory: 'Ice',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Ice",
		itemUser: ["Silvally-Ice"],
		num: 917,
		gen: 7,
		isNonstandard: "Past",
	},
	icestone: {
		name: "Ice Stone",
		spritenum: 693,
		fling: {
			basePower: 30,
		},
		num: 849,
		gen: 7,
	},
	icicleplate: {
		name: "Icicle Plate",
		spritenum: 220,
		onPlate: 'Ice',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Ice",
		num: 302,
		gen: 4,
	},
	iciumz: {
		name: "Icium Z",
		spritenum: 636,
		onPlate: 'Ice',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Ice",
		forcedForme: "Arceus-Ice",
		num: 781,
		gen: 7,
		isNonstandard: "Past",
	},
	icyrock: {
		name: "Icy Rock",
		spritenum: 221,
		fling: {
			basePower: 40,
		},
		num: 282,
		gen: 4,
	},
	inciniumz: {
		name: "Incinium Z",
		spritenum: 651,
		onTakeItem: false,
		zMove: "Malicious Moonsault",
		zMoveFrom: "Darkest Lariat",
		itemUser: ["Incineroar"],
		num: 799,
		gen: 7,
		isNonstandard: "Past",
	},
	insectplate: {
		name: "Insect Plate",
		spritenum: 223,
		onPlate: 'Bug',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Bug",
		num: 308,
		gen: 4,
	},
	ironball: {
		name: "Iron Ball",
		spritenum: 224,
		fling: {
			basePower: 130,
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (target.volatiles['ingrain'] || target.volatiles['smackdown'] || this.field.getPseudoWeather('gravity')) return;
			if (move.type === 'Ground' && target.hasType('Flying')) return 0;
		},
		// airborneness negation implemented in sim/pokemon.js:Pokemon#isGrounded
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 278,
		gen: 4,
	},
	ironplate: {
		name: "Iron Plate",
		spritenum: 225,
		onPlate: 'Steel',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Steel",
		num: 313,
		gen: 4,
	},
	jabocaberry: {
		name: "Jaboca Berry",
		spritenum: 230,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dragon",
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
				}
			}
		},
		onEat() { },
		num: 211,
		gen: 4,
	},
	jawfossil: {
		name: "Jaw Fossil",
		spritenum: 694,
		fling: {
			basePower: 100,
		},
		num: 710,
		gen: 6,
		isNonstandard: "Past",
	},
	kasibberry: {
		name: "Kasib Berry",
		spritenum: 233,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ghost",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ghost' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 196,
		gen: 4,
	},
	kebiaberry: {
		name: "Kebia Berry",
		spritenum: 234,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Poison' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 190,
		gen: 4,
	},
	keeberry: {
		name: "Kee Berry",
		spritenum: 593,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Fairy",
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.category === 'Physical') {
				if (move.id === 'present' && move.heal) return;
				target.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ def: 1 });
		},
		num: 687,
		gen: 6,
	},
	kelpsyberry: {
		name: "Kelpsy Berry",
		spritenum: 235,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Fighting",
		},
		onEat: false,
		num: 170,
		gen: 3,
	},
	kangaskhanite: {
		name: "Kangaskhanite",
		spritenum: 592,
		megaStone: "Kangaskhan-Mega",
		megaEvolves: "Kangaskhan",
		itemUser: ["Kangaskhan"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 675,
		gen: 6,
		isNonstandard: "Past",
	},
	kingsrock: {
		name: "King's Rock",
		spritenum: 236,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch',
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		num: 221,
		gen: 2,
	},
	kommoniumz: {
		name: "Kommonium Z",
		spritenum: 690,
		onTakeItem: false,
		zMove: "Clangorous Soulblaze",
		zMoveFrom: "Clanging Scales",
		itemUser: ["Kommo-o", "Kommo-o-Totem"],
		num: 926,
		gen: 7,
		isNonstandard: "Past",
	},
	laggingtail: {
		name: "Lagging Tail",
		spritenum: 237,
		fling: {
			basePower: 10,
		},
		onFractionalPriority: -0.1,
		num: 279,
		gen: 4,
	},
	lansatberry: {
		name: "Lansat Berry",
		spritenum: 238,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Flying",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.addVolatile('focusenergy');
		},
		num: 206,
		gen: 3,
	},
	latiasite: {
		name: "Latiasite",
		spritenum: 629,
		megaStone: "Latias-Mega",
		megaEvolves: "Latias",
		itemUser: ["Latias"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 684,
		gen: 6,
		isNonstandard: "Past",
	},
	latiosite: {
		name: "Latiosite",
		spritenum: 630,
		megaStone: "Latios-Mega",
		megaEvolves: "Latios",
		itemUser: ["Latios"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 685,
		gen: 6,
		isNonstandard: "Past",
	},
	laxincense: {
		name: "Lax Incense",
		spritenum: 240,
		fling: {
			basePower: 10,
		},
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('lax incense - decreasing accuracy');
			return this.chainModify([3686, 4096]);
		},
		num: 255,
		gen: 3,
		isNonstandard: "Past",
	},
	leafstone: {
		name: "Leaf Stone",
		spritenum: 241,
		fling: {
			basePower: 30,
		},
		num: 85,
		gen: 1,
	},
	leek: {
		name: "Leek",
		fling: {
			basePower: 60,
		},
		spritenum: 475,
		onModifyCritRatio(critRatio, user) {
			if (["farfetchd", "sirfetchd"].includes(this.toID(user.baseSpecies.baseSpecies))) {
				return critRatio + 2;
			}
		},
		itemUser: ["Farfetch\u2019d", "Farfetch\u2019d-Galar", "Sirfetch\u2019d"],
		num: 259,
		gen: 8,
		isNonstandard: "Past",
	},
	leftovers: {
		name: "Leftovers",
		spritenum: 242,
		fling: {
			basePower: 10,
		},
		onResidualOrder: 5,
		onResidualSubOrder: 4,
		onResidual(pokemon) {
			this.heal(pokemon.baseMaxhp / 16);
		},
		num: 234,
		gen: 2,
	},
	leppaberry: {
		name: "Leppa Berry",
		spritenum: 244,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			if (pokemon.moveSlots.some(move => move.pp === 0)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const moveSlot = pokemon.moveSlots.find(move => move.pp === 0) ||
				pokemon.moveSlots.find(move => move.pp < move.maxpp);
			if (!moveSlot) return;
			moveSlot.pp += 10;
			if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Leppa Berry', moveSlot.move, '[consumed]');
		},
		num: 154,
		gen: 3,
	},
	levelball: {
		name: "Level Ball",
		spritenum: 246,
		num: 493,
		gen: 2,
		isPokeball: true,
	},
	liechiberry: {
		name: "Liechi Berry",
		spritenum: 248,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Grass",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ atk: 1 });
		},
		num: 201,
		gen: 3,
	},
	lifeorb: {
		name: "Life Orb",
		spritenum: 249,
		fling: {
			basePower: 30,
		},
		onModifyDamage(damage, source, target, move) {
			return this.chainModify([5324, 4096]);
		},
		onAfterMoveSecondarySelf(source, target, move) {
			if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) {
				this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get('lifeorb'));
			}
		},
		num: 270,
		gen: 4,
	},
	lightball: {
		name: "Light Ball",
		spritenum: 251,
		fling: {
			basePower: 30,
			status: 'par',
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 1,
		onModifySpA(spa, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Pikachu') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Pikachu", "Pikachu-Cosplay", "Pikachu-Rock-Star", "Pikachu-Belle", "Pikachu-Pop-Star", "Pikachu-PhD", "Pikachu-Libre", "Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner", "Pikachu-Starter", "Pikachu-World"],
		num: 236,
		gen: 2,
	},
	lightclay: {
		name: "Light Clay",
		spritenum: 252,
		fling: {
			basePower: 30,
		},
		// implemented in the corresponding thing
		num: 269,
		gen: 4,
	},
	loadeddice: {
		name: "Loaded Dice",
		spritenum: 751,
		fling: {
			basePower: 30,
		},
		// partially implemented in sim/battle-actions.ts:BattleActions#hitStepMoveHitLoop
		onModifyMove(move) {
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		num: 1886,
		gen: 9,
	},
	lopunnite: {
		name: "Lopunnite",
		spritenum: 626,
		megaStone: "Lopunny-Mega",
		megaEvolves: "Lopunny",
		itemUser: ["Lopunny"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 768,
		gen: 6,
		isNonstandard: "Past",
	},
	loveball: {
		name: "Love Ball",
		spritenum: 258,
		num: 496,
		gen: 2,
		isPokeball: true,
	},
	lovesweet: {
		name: "Love Sweet",
		spritenum: 705,
		fling: {
			basePower: 10,
		},
		num: 1110,
		gen: 8,
	},
	lucarionite: {
		name: "Lucarionite",
		spritenum: 594,
		megaStone: "Lucario-Mega",
		megaEvolves: "Lucario",
		itemUser: ["Lucario"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 673,
		gen: 6,
		isNonstandard: "Past",
	},
	luckypunch: {
		name: "Lucky Punch",
		spritenum: 261,
		fling: {
			basePower: 40,
		},
		onModifyCritRatio(critRatio, user) {
			if (user.baseSpecies.name === 'Chansey') {
				return critRatio + 2;
			}
		},
		itemUser: ["Chansey"],
		num: 256,
		gen: 2,
		isNonstandard: "Past",
	},
	lumberry: {
		name: "Lum Berry",
		spritenum: 262,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
		onAfterSetStatusPriority: -1,
		onAfterSetStatus(status, pokemon) {
			pokemon.eatItem();
		},
		onUpdate(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		num: 157,
		gen: 3,
	},
	luminousmoss: {
		name: "Luminous Moss",
		spritenum: 595,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				target.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 648,
		gen: 6,
	},
	lunaliumz: {
		name: "Lunalium Z",
		spritenum: 686,
		onTakeItem: false,
		zMove: "Menacing Moonraze Maelstrom",
		zMoveFrom: "Moongeist Beam",
		itemUser: ["Lunala", "Necrozma-Dawn-Wings"],
		num: 922,
		gen: 7,
		isNonstandard: "Past",
	},
	lureball: {
		name: "Lure Ball",
		spritenum: 264,
		num: 494,
		gen: 2,
		isPokeball: true,
	},
	lustrousglobe: {
		name: "Lustrous Globe",
		spritenum: 742,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === 484 || pokemon.baseSpecies.num === 484) {
				return false;
			}
			return true;
		},
		forcedForme: "Palkia-Origin",
		itemUser: ["Palkia-Origin"],
		num: 1778,
		gen: 8,
	},
	lustrousorb: {
		name: "Lustrous Orb",
		spritenum: 265,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === 484 && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify([4915, 4096]);
			}
		},
		itemUser: ["Palkia"],
		num: 136,
		gen: 4,
	},
	luxuryball: {
		name: "Luxury Ball",
		spritenum: 266,
		num: 11,
		gen: 3,
		isPokeball: true,
	},
	lycaniumz: {
		name: "Lycanium Z",
		spritenum: 689,
		onTakeItem: false,
		zMove: "Splintered Stormshards",
		zMoveFrom: "Stone Edge",
		itemUser: ["Lycanroc", "Lycanroc-Midnight", "Lycanroc-Dusk"],
		num: 925,
		gen: 7,
		isNonstandard: "Past",
	},
	machobrace: {
		name: "Macho Brace",
		spritenum: 269,
		ignoreKlutz: true,
		fling: {
			basePower: 60,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 215,
		gen: 3,
		isNonstandard: "Past",
	},
	magmarizer: {
		name: "Magmarizer",
		spritenum: 272,
		fling: {
			basePower: 80,
		},
		num: 323,
		gen: 4,
	},
	magnet: {
		name: "Magnet",
		spritenum: 273,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 242,
		gen: 2,
	},
	magoberry: {
		name: "Mago Berry",
		spritenum: 274,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ghost",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spe') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 161,
		gen: 3,
	},
	magostberry: {
		name: "Magost Berry",
		spritenum: 275,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Rock",
		},
		onEat: false,
		num: 176,
		gen: 3,
		isNonstandard: "Past",
	},
	mail: {
		name: "Mail",
		spritenum: 403,
		onTakeItem(item, source) {
			if (!this.activeMove) return false;
			if (this.activeMove.id !== 'knockoff' && this.activeMove.id !== 'thief' && this.activeMove.id !== 'covet') return false;
		},
		num: 137,
		gen: 2,
		isNonstandard: "Past",
	},
	maliciousarmor: {
		name: "Malicious Armor",
		spritenum: 744,
		fling: {
			basePower: 30,
		},
		num: 1861,
		gen: 9,
	},
	manectite: {
		name: "Manectite",
		spritenum: 596,
		megaStone: "Manectric-Mega",
		megaEvolves: "Manectric",
		itemUser: ["Manectric"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 682,
		gen: 6,
		isNonstandard: "Past",
	},
	marangaberry: {
		name: "Maranga Berry",
		spritenum: 597,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.category === 'Special') {
				target.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ spd: 1 });
		},
		num: 688,
		gen: 6,
	},
	marshadiumz: {
		name: "Marshadium Z",
		spritenum: 654,
		onTakeItem: false,
		zMove: "Soul-Stealing 7-Star Strike",
		zMoveFrom: "Spectral Thief",
		itemUser: ["Marshadow"],
		num: 802,
		gen: 7,
		isNonstandard: "Past",
	},
	masterball: {
		name: "Master Ball",
		spritenum: 276,
		num: 1,
		gen: 1,
		isPokeball: true,
	},
	masterpieceteacup: {
		name: "Masterpiece Teacup",
		spritenum: 757,
		fling: {
			basePower: 80,
		},
		num: 2404,
		gen: 9,
	},
	mawilite: {
		name: "Mawilite",
		spritenum: 598,
		megaStone: "Mawile-Mega",
		megaEvolves: "Mawile",
		itemUser: ["Mawile"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 681,
		gen: 6,
		isNonstandard: "Past",
	},
	meadowplate: {
		name: "Meadow Plate",
		spritenum: 282,
		onPlate: 'Grass',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Grass",
		num: 301,
		gen: 4,
	},
	medichamite: {
		name: "Medichamite",
		spritenum: 599,
		megaStone: "Medicham-Mega",
		megaEvolves: "Medicham",
		itemUser: ["Medicham"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 665,
		gen: 6,
		isNonstandard: "Past",
	},
	mentalherb: {
		name: "Mental Herb",
		spritenum: 285,
		fling: {
			basePower: 10,
			effect(pokemon) {
				const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
				for (const firstCondition of conditions) {
					if (pokemon.volatiles[firstCondition]) {
						for (const secondCondition of conditions) {
							pokemon.removeVolatile(secondCondition);
							if (firstCondition === 'attract' && secondCondition === 'attract') {
								this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
							}
						}
						return;
					}
				}
			},
		},
		onUpdate(pokemon) {
			const conditions = ['attract', 'taunt', 'encore', 'torment', 'disable', 'healblock'];
			for (const firstCondition of conditions) {
				if (pokemon.volatiles[firstCondition]) {
					if (!pokemon.useItem()) return;
					for (const secondCondition of conditions) {
						pokemon.removeVolatile(secondCondition);
						if (firstCondition === 'attract' && secondCondition === 'attract') {
							this.add('-end', pokemon, 'move: Attract', '[from] item: Mental Herb');
						}
					}
					return;
				}
			}
		},
		num: 219,
		gen: 3,
	},
	metagrossite: {
		name: "Metagrossite",
		spritenum: 618,
		megaStone: "Metagross-Mega",
		megaEvolves: "Metagross",
		itemUser: ["Metagross"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 758,
		gen: 6,
		isNonstandard: "Past",
	},
	metalalloy: {
		name: "Metal Alloy",
		spritenum: 761,
		num: 2482,
		gen: 9,
	},
	metalcoat: {
		name: "Metal Coat",
		spritenum: 286,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Steel') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 233,
		gen: 2,
	},
	metalpowder: {
		name: "Metal Powder",
		fling: {
			basePower: 10,
		},
		spritenum: 287,
		onModifyDefPriority: 2,
		onModifyDef(def, pokemon) {
			if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
				return this.chainModify(2);
			}
		},
		itemUser: ["Ditto"],
		num: 257,
		gen: 2,
		isNonstandard: "Past",
	},
	metronome: {
		name: "Metronome",
		spritenum: 289,
		fling: {
			basePower: 30,
		},
		onStart(pokemon) {
			pokemon.addVolatile('metronome');
		},
		condition: {
			onStart(pokemon) {
				this.effectState.lastMove = '';
				this.effectState.numConsecutive = 0;
			},
			onTryMovePriority: -2,
			onTryMove(pokemon, target, move) {
				if (!pokemon.hasItem('metronome')) {
					pokemon.removeVolatile('metronome');
					return;
				}
				if (move.callsMove) return;
				if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
					this.effectState.numConsecutive++;
				} else if (pokemon.volatiles['twoturnmove']) {
					if (this.effectState.lastMove !== move.id) {
						this.effectState.numConsecutive = 1;
					} else {
						this.effectState.numConsecutive++;
					}
				} else {
					this.effectState.numConsecutive = 0;
				}
				this.effectState.lastMove = move.id;
			},
			onModifyDamage(damage, source, target, move) {
				const dmgMod = [4096, 4915, 5734, 6553, 7372, 8192];
				const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
				this.debug(`Current Metronome boost: ${dmgMod[numConsecutive]}/4096`);
				return this.chainModify([dmgMod[numConsecutive], 4096]);
			},
		},
		num: 277,
		gen: 4,
	},
	mewniumz: {
		name: "Mewnium Z",
		spritenum: 658,
		onTakeItem: false,
		zMove: "Genesis Supernova",
		zMoveFrom: "Psychic",
		itemUser: ["Mew"],
		num: 806,
		gen: 7,
		isNonstandard: "Past",
	},
	mewtwonitex: {
		name: "Mewtwonite X",
		spritenum: 600,
		megaStone: "Mewtwo-Mega-X",
		megaEvolves: "Mewtwo",
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 662,
		gen: 6,
		isNonstandard: "Past",
	},
	mewtwonitey: {
		name: "Mewtwonite Y",
		spritenum: 601,
		megaStone: "Mewtwo-Mega-Y",
		megaEvolves: "Mewtwo",
		itemUser: ["Mewtwo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 663,
		gen: 6,
		isNonstandard: "Past",
	},
	micleberry: {
		name: "Micle Berry",
		spritenum: 290,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Rock",
		},
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.addVolatile('micleberry');
		},
		condition: {
			duration: 2,
			onSourceAccuracy(accuracy, target, source, move) {
				if (!move.ohko) {
					this.add('-enditem', source, 'Micle Berry');
					source.removeVolatile('micleberry');
					if (typeof accuracy === 'number') {
						return this.chainModify([4915, 4096]);
					}
				}
			},
		},
		num: 209,
		gen: 4,
	},
	mimikiumz: {
		name: "Mimikium Z",
		spritenum: 688,
		onTakeItem: false,
		zMove: "Let's Snuggle Forever",
		zMoveFrom: "Play Rough",
		itemUser: ["Mimikyu", "Mimikyu-Busted", "Mimikyu-Totem", "Mimikyu-Busted-Totem"],
		num: 924,
		isNonstandard: "Past",
		gen: 7,
	},
	mindplate: {
		name: "Mind Plate",
		spritenum: 291,
		onPlate: 'Psychic',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Psychic",
		num: 307,
		gen: 4,
	},
	miracleseed: {
		name: "Miracle Seed",
		fling: {
			basePower: 30,
		},
		spritenum: 292,
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 239,
		gen: 2,
	},
	mirrorherb: {
		name: "Mirror Herb",
		spritenum: 748,
		fling: {
			basePower: 30,
		},
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) {
					boostPlus[i] = (boostPlus[i] || 0) + boost[i]!;
					this.effectState.ready = true;
				}
			}
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMega() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterTerastallization() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onAnyAfterMove() {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.ready) return;
			(this.effectState.target as Pokemon).useItem();
		},
		onUse(pokemon) {
			this.boost(this.effectState.boosts, pokemon);
		},
		onEnd() {
			delete this.effectState.boosts;
			delete this.effectState.ready;
		},
		num: 1883,
		gen: 9,
	},
	mistyseed: {
		name: "Misty Seed",
		spritenum: 666,
		fling: {
			basePower: 10,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('mistyterrain')) {
				pokemon.useItem();
			}
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('mistyterrain')) {
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 883,
		gen: 7,
	},
	moonball: {
		name: "Moon Ball",
		spritenum: 294,
		num: 498,
		gen: 2,
		isPokeball: true,
	},
	moonstone: {
		name: "Moon Stone",
		spritenum: 295,
		fling: {
			basePower: 30,
		},
		num: 81,
		gen: 1,
	},
	muscleband: {
		name: "Muscle Band",
		spritenum: 297,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Physical') {
				return this.chainModify([4505, 4096]);
			}
		},
		num: 266,
		gen: 4,
	},
	mysticwater: {
		name: "Mystic Water",
		spritenum: 300,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 243,
		gen: 2,
	},
	nanabberry: {
		name: "Nanab Berry",
		spritenum: 302,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Water",
		},
		onEat: false,
		num: 166,
		gen: 3,
		isNonstandard: "Past",
	},
	nestball: {
		name: "Nest Ball",
		spritenum: 303,
		num: 8,
		gen: 3,
		isPokeball: true,
	},
	netball: {
		name: "Net Ball",
		spritenum: 304,
		num: 6,
		gen: 3,
		isPokeball: true,
	},
	nevermeltice: {
		name: "Never-Melt Ice",
		spritenum: 305,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ice') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 246,
		gen: 2,
	},
	nomelberry: {
		name: "Nomel Berry",
		spritenum: 306,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Dragon",
		},
		onEat: false,
		num: 178,
		gen: 3,
		isNonstandard: "Past",
	},
	normalgem: {
		name: "Normal Gem",
		spritenum: 307,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
			if (move.type === 'Normal' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 564,
		gen: 5,
	},
	normaliumz: {
		name: "Normalium Z",
		spritenum: 631,
		onTakeItem: false,
		zMove: true,
		zMoveType: "Normal",
		num: 776,
		gen: 7,
		isNonstandard: "Past",
	},
	occaberry: {
		name: "Occa Berry",
		spritenum: 311,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fire' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 184,
		gen: 4,
	},
	oddincense: {
		name: "Odd Incense",
		spritenum: 312,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 314,
		gen: 4,
		isNonstandard: "Past",
	},
	oldamber: {
		name: "Old Amber",
		spritenum: 314,
		fling: {
			basePower: 100,
		},
		num: 103,
		gen: 3,
		isNonstandard: "Past",
	},
	oranberry: {
		name: "Oran Berry",
		spritenum: 319,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, 10)) return false;
		},
		onEat(pokemon) {
			this.heal(10);
		},
		num: 155,
		gen: 3,
	},
	ovalstone: {
		name: "Oval Stone",
		spritenum: 321,
		fling: {
			basePower: 80,
		},
		num: 110,
		gen: 4,
	},
	pamtreberry: {
		name: "Pamtre Berry",
		spritenum: 323,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Steel",
		},
		onEat: false,
		num: 180,
		gen: 3,
		isNonstandard: "Past",
	},
	parkball: {
		name: "Park Ball",
		spritenum: 325,
		num: 500,
		gen: 4,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	passhoberry: {
		name: "Passho Berry",
		spritenum: 329,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Water' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 185,
		gen: 4,
	},
	payapaberry: {
		name: "Payapa Berry",
		spritenum: 330,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Psychic' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 193,
		gen: 4,
	},
	pechaberry: {
		name: "Pecha Berry",
		spritenum: 333,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.cureStatus();
			}
		},
		num: 151,
		gen: 3,
	},
	persimberry: {
		name: "Persim Berry",
		spritenum: 334,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.removeVolatile('confusion');
		},
		num: 156,
		gen: 3,
	},
	petayaberry: {
		name: "Petaya Berry",
		spritenum: 335,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Poison",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ spa: 1 });
		},
		num: 204,
		gen: 3,
	},
	pidgeotite: {
		name: "Pidgeotite",
		spritenum: 622,
		megaStone: "Pidgeot-Mega",
		megaEvolves: "Pidgeot",
		itemUser: ["Pidgeot"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 762,
		gen: 6,
		isNonstandard: "Past",
	},
	pikaniumz: {
		name: "Pikanium Z",
		spritenum: 649,
		onTakeItem: false,
		zMove: "Catastropika",
		zMoveFrom: "Volt Tackle",
		itemUser: ["Pikachu"],
		num: 794,
		gen: 7,
		isNonstandard: "Past",
	},
	pikashuniumz: {
		name: "Pikashunium Z",
		spritenum: 659,
		onTakeItem: false,
		zMove: "10,000,000 Volt Thunderbolt",
		zMoveFrom: "Thunderbolt",
		itemUser: ["Pikachu-Original", "Pikachu-Hoenn", "Pikachu-Sinnoh", "Pikachu-Unova", "Pikachu-Kalos", "Pikachu-Alola", "Pikachu-Partner"],
		num: 836,
		isNonstandard: "Past",
		gen: 7,
	},
	pinapberry: {
		name: "Pinap Berry",
		spritenum: 337,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Grass",
		},
		onEat: false,
		num: 168,
		gen: 3,
		isNonstandard: "Past",
	},
	pinsirite: {
		name: "Pinsirite",
		spritenum: 602,
		megaStone: "Pinsir-Mega",
		megaEvolves: "Pinsir",
		itemUser: ["Pinsir"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 671,
		gen: 6,
		isNonstandard: "Past",
	},
	pixieplate: {
		name: "Pixie Plate",
		spritenum: 610,
		onPlate: 'Fairy',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Fairy') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Fairy",
		num: 644,
		gen: 6,
	},
	plumefossil: {
		name: "Plume Fossil",
		spritenum: 339,
		fling: {
			basePower: 100,
		},
		num: 573,
		gen: 5,
		isNonstandard: "Past",
	},
	poisonbarb: {
		name: "Poison Barb",
		spritenum: 343,
		fling: {
			basePower: 70,
			status: 'psn',
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 245,
		gen: 2,
	},
	poisongem: {
		name: "Poison Gem",
		spritenum: 344,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Poison' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 554,
		gen: 5,
		isNonstandard: "Past",
	},
	poisonmemory: {
		name: "Poison Memory",
		spritenum: 670,
		onMemory: 'Poison',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Poison",
		itemUser: ["Silvally-Poison"],
		num: 906,
		gen: 7,
		isNonstandard: "Past",
	},
	poisoniumz: {
		name: "Poisonium Z",
		spritenum: 638,
		onPlate: 'Poison',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Poison",
		forcedForme: "Arceus-Poison",
		num: 783,
		gen: 7,
		isNonstandard: "Past",
	},
	pokeball: {
		name: "Poke Ball",
		spritenum: 345,
		num: 4,
		gen: 1,
		isPokeball: true,
	},
	pomegberry: {
		name: "Pomeg Berry",
		spritenum: 351,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Ice",
		},
		onEat: false,
		num: 169,
		gen: 3,
	},
	poweranklet: {
		name: "Power Anklet",
		spritenum: 354,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 293,
		gen: 4,
	},
	powerband: {
		name: "Power Band",
		spritenum: 355,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 292,
		gen: 4,
	},
	powerbelt: {
		name: "Power Belt",
		spritenum: 356,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 290,
		gen: 4,
	},
	powerbracer: {
		name: "Power Bracer",
		spritenum: 357,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 289,
		gen: 4,
	},
	powerherb: {
		onChargeMove(pokemon, target, move) {
			if (pokemon.useItem()) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			}
		},
		name: "Power Herb",
		spritenum: 358,
		fling: {
			basePower: 10,
		},
		num: 271,
		gen: 4,
	},
	powerlens: {
		name: "Power Lens",
		spritenum: 359,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 291,
		gen: 4,
	},
	powerweight: {
		name: "Power Weight",
		spritenum: 360,
		ignoreKlutz: true,
		fling: {
			basePower: 70,
		},
		onModifySpe(spe) {
			return this.chainModify(0.5);
		},
		num: 294,
		gen: 4,
	},
	premierball: {
		name: "Premier Ball",
		spritenum: 363,
		num: 12,
		gen: 3,
		isPokeball: true,
	},
	primariumz: {
		name: "Primarium Z",
		spritenum: 652,
		onTakeItem: false,
		zMove: "Oceanic Operetta",
		zMoveFrom: "Sparkling Aria",
		itemUser: ["Primarina"],
		num: 800,
		gen: 7,
		isNonstandard: "Past",
	},
	prismscale: {
		name: "Prism Scale",
		spritenum: 365,
		fling: {
			basePower: 30,
		},
		num: 537,
		gen: 5,
	},
	protectivepads: {
		name: "Protective Pads",
		spritenum: 663,
		fling: {
			basePower: 30,
		},
		// protective effect handled in Battle#checkMoveMakesContact
		num: 880,
		gen: 7,
	},
	protector: {
		name: "Protector",
		spritenum: 367,
		fling: {
			basePower: 80,
		},
		num: 321,
		gen: 4,
	},
	psychicgem: {
		name: "Psychic Gem",
		spritenum: 369,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Psychic' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 557,
		gen: 5,
		isNonstandard: "Past",
	},
	psychicmemory: {
		name: "Psychic Memory",
		spritenum: 680,
		onMemory: 'Psychic',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Psychic",
		itemUser: ["Silvally-Psychic"],
		num: 916,
		gen: 7,
		isNonstandard: "Past",
	},
	psychicseed: {
		name: "Psychic Seed",
		spritenum: 665,
		fling: {
			basePower: 10,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.isTerrain('psychicterrain')) {
				pokemon.useItem();
			}
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('psychicterrain')) {
				pokemon.useItem();
			}
		},
		boosts: {
			spd: 1,
		},
		num: 882,
		gen: 7,
	},
	psychiumz: {
		name: "Psychium Z",
		spritenum: 641,
		onPlate: 'Psychic',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Psychic",
		forcedForme: "Arceus-Psychic",
		num: 786,
		gen: 7,
		isNonstandard: "Past",
	},
	punchingglove: {
		name: "Punching Glove",
		spritenum: 749,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Punching Glove boost');
				return this.chainModify([4506, 4096]);
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move) {
			if (move.flags['punch']) delete move.flags['contact'];
		},
		num: 1884,
		gen: 9,
	},
	qualotberry: {
		name: "Qualot Berry",
		spritenum: 371,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Poison",
		},
		onEat: false,
		num: 171,
		gen: 3,
	},
	quickball: {
		name: "Quick Ball",
		spritenum: 372,
		num: 15,
		gen: 4,
		isPokeball: true,
	},
	quickclaw: {
		onFractionalPriorityPriority: -2,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === "Status" && pokemon.hasAbility("myceliummight")) return;
			if (priority <= 0 && this.randomChance(1, 5)) {
				this.add('-activate', pokemon, 'item: Quick Claw');
				return 0.1;
			}
		},
		name: "Quick Claw",
		spritenum: 373,
		fling: {
			basePower: 80,
		},
		num: 217,
		gen: 2,
	},
	quickpowder: {
		name: "Quick Powder",
		spritenum: 374,
		fling: {
			basePower: 10,
		},
		onModifySpe(spe, pokemon) {
			if (pokemon.species.name === 'Ditto' && !pokemon.transformed) {
				return this.chainModify(2);
			}
		},
		itemUser: ["Ditto"],
		num: 274,
		gen: 4,
		isNonstandard: "Past",
	},
	rabutaberry: {
		name: "Rabuta Berry",
		spritenum: 375,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Ghost",
		},
		onEat: false,
		num: 177,
		gen: 3,
		isNonstandard: "Past",
	},
	rarebone: {
		name: "Rare Bone",
		spritenum: 379,
		fling: {
			basePower: 100,
		},
		num: 106,
		gen: 4,
	},
	rawstberry: {
		name: "Rawst Berry",
		spritenum: 381,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.cureStatus();
			}
		},
		num: 152,
		gen: 3,
	},
	razorclaw: {
		name: "Razor Claw",
		spritenum: 382,
		fling: {
			basePower: 80,
		},
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		num: 326,
		gen: 4,
	},
	razorfang: {
		name: "Razor Fang",
		spritenum: 383,
		fling: {
			basePower: 30,
			volatileStatus: 'flinch',
		},
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				if (!move.secondaries) move.secondaries = [];
				for (const secondary of move.secondaries) {
					if (secondary.volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 10,
					volatileStatus: 'flinch',
				});
			}
		},
		num: 327,
		gen: 4,
	},
	razzberry: {
		name: "Razz Berry",
		spritenum: 384,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Steel",
		},
		onEat: false,
		num: 164,
		gen: 3,
		isNonstandard: "Past",
	},
	reapercloth: {
		name: "Reaper Cloth",
		spritenum: 385,
		fling: {
			basePower: 10,
		},
		num: 325,
		gen: 4,
	},
	redcard: {
		name: "Red Card",
		spritenum: 387,
		fling: {
			basePower: 10,
		},
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && source.hp && target.hp && move && move.category !== 'Status') {
				if (!source.isActive || !this.canSwitch(source.side) || source.forceSwitchFlag || target.forceSwitchFlag) {
					return;
				}
				// The item is used up even against a pokemon with Ingrain or that otherwise can't be forced out
				if (target.useItem(source)) {
					if (this.runEvent('DragOut', source, target, move)) {
						source.forceSwitchFlag = true;
					}
				}
			}
		},
		num: 542,
		gen: 5,
	},
	redorb: {
		name: "Red Orb",
		spritenum: 390,
		onSwitchInPriority: -1,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && pokemon.baseSpecies.name === 'Groudon' && !pokemon.transformed) {
				pokemon.formeChange('Groudon-Primal', this.effect, true);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Groudon') return false;
			return true;
		},
		itemUser: ["Groudon"],
		isPrimalOrb: true,
		num: 534,
		gen: 6,
		isNonstandard: "Past",
	},
	repeatball: {
		name: "Repeat Ball",
		spritenum: 401,
		num: 9,
		gen: 3,
		isPokeball: true,
	},
	ribbonsweet: {
		name: "Ribbon Sweet",
		spritenum: 710,
		fling: {
			basePower: 10,
		},
		num: 1115,
		gen: 8,
	},
	rindoberry: {
		name: "Rindo Berry",
		spritenum: 409,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Grass' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 187,
		gen: 4,
	},
	ringtarget: {
		name: "Ring Target",
		spritenum: 410,
		fling: {
			basePower: 10,
		},
		onNegateImmunity: false,
		num: 543,
		gen: 5,
	},
	rockgem: {
		name: "Rock Gem",
		spritenum: 415,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Rock' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 559,
		gen: 5,
		isNonstandard: "Past",
	},
	rockincense: {
		name: "Rock Incense",
		spritenum: 416,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Rock') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 315,
		gen: 4,
		isNonstandard: "Past",
	},
	rockmemory: {
		name: "Rock Memory",
		spritenum: 672,
		onMemory: 'Rock',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Rock",
		itemUser: ["Silvally-Rock"],
		num: 908,
		gen: 7,
		isNonstandard: "Past",
	},
	rockiumz: {
		name: "Rockium Z",
		spritenum: 643,
		onPlate: 'Rock',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Rock",
		forcedForme: "Arceus-Rock",
		num: 788,
		gen: 7,
		isNonstandard: "Past",
	},
	rockyhelmet: {
		name: "Rocky Helmet",
		spritenum: 417,
		fling: {
			basePower: 60,
		},
		onDamagingHitOrder: 2,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				this.damage(source.baseMaxhp / 6, source, target);
			}
		},
		num: 540,
		gen: 5,
	},
	roomservice: {
		name: "Room Service",
		spritenum: 717,
		fling: {
			basePower: 100,
		},
		onSwitchInPriority: -1,
		onStart(pokemon) {
			if (!pokemon.ignoringItem() && this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem();
			}
		},
		onAnyPseudoWeatherChange() {
			const pokemon = this.effectState.target;
			if (this.field.getPseudoWeather('trickroom')) {
				pokemon.useItem(pokemon);
			}
		},
		boosts: {
			spe: -1,
		},
		num: 1122,
		gen: 8,
	},
	rootfossil: {
		name: "Root Fossil",
		spritenum: 418,
		fling: {
			basePower: 100,
		},
		num: 99,
		gen: 3,
		isNonstandard: "Past",
	},
	roseincense: {
		name: "Rose Incense",
		spritenum: 419,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 318,
		gen: 4,
		isNonstandard: "Past",
	},
	roseliberry: {
		name: "Roseli Berry",
		spritenum: 603,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fairy",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Fairy' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 686,
		gen: 6,
	},
	rowapberry: {
		name: "Rowap Berry",
		spritenum: 420,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Dark",
		},
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Special' && source.hp && source.isActive && !source.hasAbility('magicguard')) {
				if (target.eatItem()) {
					this.damage(source.baseMaxhp / (target.hasAbility('ripen') ? 4 : 8), source, target);
				}
			}
		},
		onEat() { },
		num: 212,
		gen: 4,
	},
	rustedshield: {
		name: "Rusted Shield",
		spritenum: 699,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 889) || pokemon.baseSpecies.num === 889) {
				return false;
			}
			return true;
		},
		itemUser: ["Zamazenta-Crowned"],
		num: 1104,
		gen: 8,
	},
	rustedsword: {
		name: "Rusted Sword",
		spritenum: 698,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 888) || pokemon.baseSpecies.num === 888) {
				return false;
			}
			return true;
		},
		itemUser: ["Zacian-Crowned"],
		num: 1103,
		gen: 8,
	},
	sablenite: {
		name: "Sablenite",
		spritenum: 614,
		megaStone: "Sableye-Mega",
		megaEvolves: "Sableye",
		itemUser: ["Sableye"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 754,
		gen: 6,
		isNonstandard: "Past",
	},
	sachet: {
		name: "Sachet",
		spritenum: 691,
		fling: {
			basePower: 80,
		},
		num: 647,
		gen: 6,
		isNonstandard: "Past",
	},
	safariball: {
		name: "Safari Ball",
		spritenum: 425,
		num: 5,
		gen: 1,
		isPokeball: true,
	},
	safetygoggles: {
		name: "Safety Goggles",
		spritenum: 604,
		fling: {
			basePower: 80,
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHit(pokemon, source, move) {
			if (move.flags['powder'] && pokemon !== source && this.dex.getImmunity('powder', pokemon)) {
				this.add('-activate', pokemon, 'item: Safety Goggles', move.name);
				return null;
			}
		},
		num: 650,
		gen: 6,
	},
	sailfossil: {
		name: "Sail Fossil",
		spritenum: 695,
		fling: {
			basePower: 100,
		},
		num: 711,
		gen: 6,
		isNonstandard: "Past",
	},
	salacberry: {
		name: "Salac Berry",
		spritenum: 426,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Fighting",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			this.boost({ spe: 1 });
		},
		num: 203,
		gen: 3,
	},
	salamencite: {
		name: "Salamencite",
		spritenum: 627,
		megaStone: "Salamence-Mega",
		megaEvolves: "Salamence",
		itemUser: ["Salamence"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 769,
		gen: 6,
		isNonstandard: "Past",
	},
	sceptilite: {
		name: "Sceptilite",
		spritenum: 613,
		megaStone: "Sceptile-Mega",
		megaEvolves: "Sceptile",
		itemUser: ["Sceptile"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 753,
		gen: 6,
		isNonstandard: "Past",
	},
	scizorite: {
		name: "Scizorite",
		spritenum: 605,
		megaStone: "Scizor-Mega",
		megaEvolves: "Scizor",
		itemUser: ["Scizor"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 670,
		gen: 6,
		isNonstandard: "Past",
	},
	scopelens: {
		name: "Scope Lens",
		spritenum: 429,
		fling: {
			basePower: 30,
		},
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		num: 232,
		gen: 2,
	},
	seaincense: {
		name: "Sea Incense",
		spritenum: 430,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 254,
		gen: 3,
		isNonstandard: "Past",
	},
	sharpbeak: {
		name: "Sharp Beak",
		spritenum: 436,
		fling: {
			basePower: 50,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 244,
		gen: 2,
	},
	sharpedonite: {
		name: "Sharpedonite",
		spritenum: 619,
		megaStone: "Sharpedo-Mega",
		megaEvolves: "Sharpedo",
		itemUser: ["Sharpedo"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 759,
		gen: 6,
		isNonstandard: "Past",
	},
	shedshell: {
		name: "Shed Shell",
		spritenum: 437,
		fling: {
			basePower: 10,
		},
		onTrapPokemonPriority: -10,
		onTrapPokemon(pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		num: 295,
		gen: 4,
	},
	shellbell: {
		name: "Shell Bell",
		spritenum: 438,
		fling: {
			basePower: 30,
		},
		onAfterMoveSecondarySelfPriority: -1,
		onAfterMoveSecondarySelf(pokemon, target, move) {
			if (move.totalDamage && !pokemon.forceSwitchFlag) {
				this.heal(move.totalDamage / 8, pokemon);
			}
		},
		num: 253,
		gen: 3,
	},
	shinystone: {
		name: "Shiny Stone",
		spritenum: 439,
		fling: {
			basePower: 80,
		},
		num: 107,
		gen: 4,
	},
	shockdrive: {
		name: "Shock Drive",
		spritenum: 442,
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 649) || pokemon.baseSpecies.num === 649) {
				return false;
			}
			return true;
		},
		onDrive: 'Electric',
		forcedForme: "Genesect-Shock",
		itemUser: ["Genesect-Shock"],
		num: 117,
		gen: 5,
		isNonstandard: "Past",
	},
	shucaberry: {
		name: "Shuca Berry",
		spritenum: 443,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ground' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 191,
		gen: 4,
	},
	silkscarf: {
		name: "Silk Scarf",
		spritenum: 444,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 251,
		gen: 3,
	},
	silverpowder: {
		name: "Silver Powder",
		spritenum: 447,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Bug') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 222,
		gen: 2,
	},
	sitrusberry: {
		name: "Sitrus Berry",
		spritenum: 448,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 4)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 4);
		},
		num: 158,
		gen: 3,
	},
	skullfossil: {
		name: "Skull Fossil",
		spritenum: 449,
		fling: {
			basePower: 100,
		},
		num: 105,
		gen: 4,
		isNonstandard: "Past",
	},
	skyplate: {
		name: "Sky Plate",
		spritenum: 450,
		onPlate: 'Flying',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Flying') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Flying",
		num: 306,
		gen: 4,
	},
	slowbronite: {
		name: "Slowbronite",
		spritenum: 620,
		megaStone: "Slowbro-Mega",
		megaEvolves: "Slowbro",
		itemUser: ["Slowbro"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 760,
		gen: 6,
		isNonstandard: "Past",
	},
	smoothrock: {
		name: "Smooth Rock",
		spritenum: 453,
		fling: {
			basePower: 10,
		},
		num: 283,
		gen: 4,
	},
	snorliumz: {
		name: "Snorlium Z",
		spritenum: 656,
		onTakeItem: false,
		zMove: "Pulverizing Pancake",
		zMoveFrom: "Giga Impact",
		itemUser: ["Snorlax"],
		num: 804,
		gen: 7,
		isNonstandard: "Past",
	},
	snowball: {
		name: "Snowball",
		spritenum: 606,
		fling: {
			basePower: 30,
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Ice') {
				target.useItem();
			}
		},
		boosts: {
			atk: 1,
		},
		num: 649,
		gen: 6,
	},
	softsand: {
		name: "Soft Sand",
		spritenum: 456,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ground') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 237,
		gen: 2,
	},
	solganiumz: {
		name: "Solganium Z",
		spritenum: 685,
		onTakeItem: false,
		zMove: "Searing Sunraze Smash",
		zMoveFrom: "Sunsteel Strike",
		itemUser: ["Solgaleo", "Necrozma-Dusk-Mane"],
		num: 921,
		gen: 7,
		isNonstandard: "Past",
	},
	souldew: {
		name: "Soul Dew",
		spritenum: 459,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (
				move && (user.baseSpecies.num === 380 || user.baseSpecies.num === 381) &&
				(move.type === 'Psychic' || move.type === 'Dragon')
			) {
				return this.chainModify([4915, 4096]);
			}
		},
		itemUser: ["Latios", "Latias"],
		num: 225,
		gen: 3,
	},
	spelltag: {
		name: "Spell Tag",
		spritenum: 461,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 247,
		gen: 2,
	},
	spelonberry: {
		name: "Spelon Berry",
		spritenum: 462,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Dark",
		},
		onEat: false,
		num: 179,
		gen: 3,
		isNonstandard: "Past",
	},
	splashplate: {
		name: "Splash Plate",
		spritenum: 463,
		onPlate: 'Water',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Water",
		num: 299,
		gen: 4,
	},
	spookyplate: {
		name: "Spooky Plate",
		spritenum: 464,
		onPlate: 'Ghost',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Ghost",
		num: 310,
		gen: 4,
	},
	sportball: {
		name: "Sport Ball",
		spritenum: 465,
		num: 499,
		gen: 2,
		isPokeball: true,
	},
	starfberry: {
		name: "Starf Berry",
		spritenum: 472,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Psychic",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			const stats: BoostID[] = [];
			let stat: BoostID;
			for (stat in pokemon.boosts) {
				if (stat !== 'accuracy' && stat !== 'evasion' && pokemon.boosts[stat] < 6) {
					stats.push(stat);
				}
			}
			if (stats.length) {
				const randomStat = this.sample(stats);
				const boost: SparseBoostsTable = {};
				boost[randomStat] = 2;
				this.boost(boost);
			}
		},
		num: 207,
		gen: 3,
	},
	starsweet: {
		name: "Star Sweet",
		spritenum: 709,
		fling: {
			basePower: 10,
		},
		num: 1114,
		gen: 8,
	},
	steelixite: {
		name: "Steelixite",
		spritenum: 621,
		megaStone: "Steelix-Mega",
		megaEvolves: "Steelix",
		itemUser: ["Steelix"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 761,
		gen: 6,
		isNonstandard: "Past",
	},
	steelgem: {
		name: "Steel Gem",
		spritenum: 473,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			if (move.type === 'Steel' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 563,
		gen: 5,
		isNonstandard: "Past",
	},
	steelmemory: {
		name: "Steel Memory",
		spritenum: 675,
		onMemory: 'Steel',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Steel",
		itemUser: ["Silvally-Steel"],
		num: 911,
		gen: 7,
		isNonstandard: "Past",
	},
	steeliumz: {
		name: "Steelium Z",
		spritenum: 647,
		onPlate: 'Steel',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Steel",
		forcedForme: "Arceus-Steel",
		num: 792,
		gen: 7,
		isNonstandard: "Past",
	},
	stick: {
		name: "Stick",
		fling: {
			basePower: 60,
		},
		spritenum: 475,
		onModifyCritRatio(critRatio, user) {
			if (this.toID(user.baseSpecies.baseSpecies) === 'farfetchd') {
				return critRatio + 2;
			}
		},
		itemUser: ["Farfetch\u2019d"],
		num: 259,
		gen: 2,
		isNonstandard: "Past",
	},
	stickybarb: {
		name: "Sticky Barb",
		spritenum: 476,
		fling: {
			basePower: 80,
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
		onHit(target, source, move) {
			if (source && source !== target && !source.item && move && this.checkMoveMakesContact(move, source, target)) {
				const barb = target.takeItem();
				if (!barb) return; // Gen 4 Multitype
				source.setItem(barb);
				// no message for Sticky Barb changing hands
			}
		},
		num: 288,
		gen: 4,
	},
	stoneplate: {
		name: "Stone Plate",
		spritenum: 477,
		onPlate: 'Rock',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Rock') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Rock",
		num: 309,
		gen: 4,
	},
	strangeball: {
		name: "Strange Ball",
		spritenum: 308,
		num: 1785,
		gen: 8,
		isPokeball: true,
		isNonstandard: "Unobtainable",
	},
	strawberrysweet: {
		name: "Strawberry Sweet",
		spritenum: 704,
		fling: {
			basePower: 10,
		},
		num: 1109,
		gen: 8,
	},
	sunstone: {
		name: "Sun Stone",
		spritenum: 480,
		fling: {
			basePower: 30,
		},
		num: 80,
		gen: 2,
	},
	swampertite: {
		name: "Swampertite",
		spritenum: 612,
		megaStone: "Swampert-Mega",
		megaEvolves: "Swampert",
		itemUser: ["Swampert"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 752,
		gen: 6,
		isNonstandard: "Past",
	},
	sweetapple: {
		name: "Sweet Apple",
		spritenum: 711,
		fling: {
			basePower: 30,
		},
		num: 1116,
		gen: 8,
	},
	syrupyapple: {
		name: "Syrupy Apple",
		spritenum: 755,
		fling: {
			basePower: 30,
		},
		num: 2402,
		gen: 9,
	},
	tamatoberry: {
		name: "Tamato Berry",
		spritenum: 486,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Psychic",
		},
		onEat: false,
		num: 174,
		gen: 3,
	},
	tangaberry: {
		name: "Tanga Berry",
		spritenum: 487,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Bug",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Bug' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 194,
		gen: 4,
	},
	tapuniumz: {
		name: "Tapunium Z",
		spritenum: 653,
		onTakeItem: false,
		zMove: "Guardian of Alola",
		zMoveFrom: "Nature's Madness",
		itemUser: ["Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini"],
		num: 801,
		gen: 7,
		isNonstandard: "Past",
	},
	tartapple: {
		name: "Tart Apple",
		spritenum: 712,
		fling: {
			basePower: 30,
		},
		num: 1117,
		gen: 8,
	},
	terrainextender: {
		name: "Terrain Extender",
		spritenum: 662,
		fling: {
			basePower: 60,
		},
		num: 879,
		gen: 7,
	},
	thickclub: {
		name: "Thick Club",
		spritenum: 491,
		fling: {
			basePower: 90,
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.baseSpecies.baseSpecies === 'Cubone' || pokemon.baseSpecies.baseSpecies === 'Marowak') {
				return this.chainModify(2);
			}
		},
		itemUser: ["Marowak", "Marowak-Alola", "Marowak-Alola-Totem", "Cubone"],
		num: 258,
		gen: 2,
		isNonstandard: "Past",
	},
	throatspray: {
		name: "Throat Spray",
		spritenum: 713,
		fling: {
			basePower: 30,
		},
		onAfterMoveSecondarySelf(target, source, move) {
			if (move.flags['sound']) {
				target.useItem();
			}
		},
		boosts: {
			spa: 1,
		},
		num: 1118,
		gen: 8,
	},
	thunderstone: {
		name: "Thunder Stone",
		spritenum: 492,
		fling: {
			basePower: 30,
		},
		num: 83,
		gen: 1,
	},
	timerball: {
		name: "Timer Ball",
		spritenum: 494,
		num: 10,
		gen: 3,
		isPokeball: true,
	},
	toxicorb: {
		name: "Toxic Orb",
		spritenum: 515,
		fling: {
			basePower: 30,
			status: 'tox',
		},
		onResidualOrder: 28,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			pokemon.trySetStatus('tox', pokemon);
		},
		num: 272,
		gen: 4,
	},
	toxicplate: {
		name: "Toxic Plate",
		spritenum: 516,
		onPlate: 'Poison',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Poison') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Poison",
		num: 304,
		gen: 4,
	},
	tr00: {
		name: "TR00",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1130,
		gen: 8,
		isNonstandard: "Past",
	},
	tr01: {
		name: "TR01",
		fling: {
			basePower: 85,
		},
		spritenum: 721,
		num: 1131,
		gen: 8,
		isNonstandard: "Past",
	},
	tr02: {
		name: "TR02",
		fling: {
			basePower: 90,
		},
		spritenum: 730,
		num: 1132,
		gen: 8,
		isNonstandard: "Past",
	},
	tr03: {
		name: "TR03",
		fling: {
			basePower: 110,
		},
		spritenum: 731,
		num: 1133,
		gen: 8,
		isNonstandard: "Past",
	},
	tr04: {
		name: "TR04",
		fling: {
			basePower: 90,
		},
		spritenum: 731,
		num: 1134,
		gen: 8,
		isNonstandard: "Past",
	},
	tr05: {
		name: "TR05",
		fling: {
			basePower: 90,
		},
		spritenum: 735,
		num: 1135,
		gen: 8,
		isNonstandard: "Past",
	},
	tr06: {
		name: "TR06",
		fling: {
			basePower: 110,
		},
		spritenum: 735,
		num: 1136,
		gen: 8,
		isNonstandard: "Past",
	},
	tr07: {
		name: "TR07",
		fling: {
			basePower: 10,
		},
		spritenum: 722,
		num: 1137,
		gen: 8,
		isNonstandard: "Past",
	},
	tr08: {
		name: "TR08",
		fling: {
			basePower: 90,
		},
		spritenum: 733,
		num: 1138,
		gen: 8,
		isNonstandard: "Past",
	},
	tr09: {
		name: "TR09",
		fling: {
			basePower: 110,
		},
		spritenum: 733,
		num: 1139,
		gen: 8,
		isNonstandard: "Past",
	},
	tr10: {
		name: "TR10",
		fling: {
			basePower: 100,
		},
		spritenum: 725,
		num: 1140,
		gen: 8,
		isNonstandard: "Past",
	},
	tr11: {
		name: "TR11",
		fling: {
			basePower: 90,
		},
		spritenum: 734,
		num: 1141,
		gen: 8,
		isNonstandard: "Past",
	},
	tr12: {
		name: "TR12",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1142,
		gen: 8,
		isNonstandard: "Past",
	},
	tr13: {
		name: "TR13",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1143,
		gen: 8,
		isNonstandard: "Past",
	},
	tr14: {
		name: "TR14",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1144,
		gen: 8,
		isNonstandard: "Past",
	},
	tr15: {
		name: "TR15",
		fling: {
			basePower: 110,
		},
		spritenum: 730,
		num: 1145,
		gen: 8,
		isNonstandard: "Past",
	},
	tr16: {
		name: "TR16",
		fling: {
			basePower: 80,
		},
		spritenum: 731,
		num: 1146,
		gen: 8,
		isNonstandard: "Past",
	},
	tr17: {
		name: "TR17",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1147,
		gen: 8,
		isNonstandard: "Past",
	},
	tr18: {
		name: "TR18",
		fling: {
			basePower: 80,
		},
		spritenum: 727,
		num: 1148,
		gen: 8,
		isNonstandard: "Past",
	},
	tr19: {
		name: "TR19",
		fling: {
			basePower: 80,
		},
		spritenum: 721,
		num: 1149,
		gen: 8,
		isNonstandard: "Past",
	},
	tr20: {
		name: "TR20",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1150,
		gen: 8,
		isNonstandard: "Past",
	},
	tr21: {
		name: "TR21",
		fling: {
			basePower: 10,
		},
		spritenum: 722,
		num: 1151,
		gen: 8,
		isNonstandard: "Past",
	},
	tr22: {
		name: "TR22",
		fling: {
			basePower: 90,
		},
		spritenum: 724,
		num: 1152,
		gen: 8,
		isNonstandard: "Past",
	},
	tr23: {
		name: "TR23",
		fling: {
			basePower: 10,
		},
		spritenum: 725,
		num: 1153,
		gen: 8,
		isNonstandard: "Past",
	},
	tr24: {
		name: "TR24",
		fling: {
			basePower: 120,
		},
		spritenum: 736,
		num: 1154,
		gen: 8,
		isNonstandard: "Past",
	},
	tr25: {
		name: "TR25",
		fling: {
			basePower: 80,
		},
		spritenum: 734,
		num: 1155,
		gen: 8,
		isNonstandard: "Past",
	},
	tr26: {
		name: "TR26",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1156,
		gen: 8,
		isNonstandard: "Past",
	},
	tr27: {
		name: "TR27",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1157,
		gen: 8,
		isNonstandard: "Past",
	},
	tr28: {
		name: "TR28",
		fling: {
			basePower: 120,
		},
		spritenum: 727,
		num: 1158,
		gen: 8,
		isNonstandard: "Past",
	},
	tr29: {
		name: "TR29",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1159,
		gen: 8,
		isNonstandard: "Past",
	},
	tr30: {
		name: "TR30",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1160,
		gen: 8,
		isNonstandard: "Past",
	},
	tr31: {
		name: "TR31",
		fling: {
			basePower: 100,
		},
		spritenum: 729,
		num: 1161,
		gen: 8,
		isNonstandard: "Past",
	},
	tr32: {
		name: "TR32",
		fling: {
			basePower: 80,
		},
		spritenum: 737,
		num: 1162,
		gen: 8,
		isNonstandard: "Past",
	},
	tr33: {
		name: "TR33",
		fling: {
			basePower: 80,
		},
		spritenum: 728,
		num: 1163,
		gen: 8,
		isNonstandard: "Past",
	},
	tr34: {
		name: "TR34",
		fling: {
			basePower: 120,
		},
		spritenum: 734,
		num: 1164,
		gen: 8,
		isNonstandard: "Past",
	},
	tr35: {
		name: "TR35",
		fling: {
			basePower: 90,
		},
		spritenum: 721,
		num: 1165,
		gen: 8,
		isNonstandard: "Past",
	},
	tr36: {
		name: "TR36",
		fling: {
			basePower: 95,
		},
		spritenum: 730,
		num: 1166,
		gen: 8,
		isNonstandard: "Past",
	},
	tr37: {
		name: "TR37",
		fling: {
			basePower: 10,
		},
		spritenum: 737,
		num: 1167,
		gen: 8,
		isNonstandard: "Past",
	},
	tr38: {
		name: "TR38",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1168,
		gen: 8,
		isNonstandard: "Past",
	},
	tr39: {
		name: "TR39",
		fling: {
			basePower: 120,
		},
		spritenum: 722,
		num: 1169,
		gen: 8,
		isNonstandard: "Past",
	},
	tr40: {
		name: "TR40",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1170,
		gen: 8,
		isNonstandard: "Past",
	},
	tr41: {
		name: "TR41",
		fling: {
			basePower: 85,
		},
		spritenum: 730,
		num: 1171,
		gen: 8,
		isNonstandard: "Past",
	},
	tr42: {
		name: "TR42",
		fling: {
			basePower: 90,
		},
		spritenum: 721,
		num: 1172,
		gen: 8,
		isNonstandard: "Past",
	},
	tr43: {
		name: "TR43",
		fling: {
			basePower: 130,
		},
		spritenum: 730,
		num: 1173,
		gen: 8,
		isNonstandard: "Past",
	},
	tr44: {
		name: "TR44",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1174,
		gen: 8,
		isNonstandard: "Past",
	},
	tr45: {
		name: "TR45",
		fling: {
			basePower: 90,
		},
		spritenum: 731,
		num: 1175,
		gen: 8,
		isNonstandard: "Past",
	},
	tr46: {
		name: "TR46",
		fling: {
			basePower: 10,
		},
		spritenum: 729,
		num: 1176,
		gen: 8,
		isNonstandard: "Past",
	},
	tr47: {
		name: "TR47",
		fling: {
			basePower: 80,
		},
		spritenum: 736,
		num: 1177,
		gen: 8,
		isNonstandard: "Past",
	},
	tr48: {
		name: "TR48",
		fling: {
			basePower: 10,
		},
		spritenum: 722,
		num: 1178,
		gen: 8,
		isNonstandard: "Past",
	},
	tr49: {
		name: "TR49",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1179,
		gen: 8,
		isNonstandard: "Past",
	},
	tr50: {
		name: "TR50",
		fling: {
			basePower: 90,
		},
		spritenum: 732,
		num: 1180,
		gen: 8,
		isNonstandard: "Past",
	},
	tr51: {
		name: "TR51",
		fling: {
			basePower: 10,
		},
		spritenum: 736,
		num: 1181,
		gen: 8,
		isNonstandard: "Past",
	},
	tr52: {
		name: "TR52",
		fling: {
			basePower: 10,
		},
		spritenum: 729,
		num: 1182,
		gen: 8,
		isNonstandard: "Past",
	},
	tr53: {
		name: "TR53",
		fling: {
			basePower: 120,
		},
		spritenum: 722,
		num: 1183,
		gen: 8,
		isNonstandard: "Past",
	},
	tr54: {
		name: "TR54",
		fling: {
			basePower: 10,
		},
		spritenum: 724,
		num: 1184,
		gen: 8,
		isNonstandard: "Past",
	},
	tr55: {
		name: "TR55",
		fling: {
			basePower: 120,
		},
		spritenum: 730,
		num: 1185,
		gen: 8,
		isNonstandard: "Past",
	},
	tr56: {
		name: "TR56",
		fling: {
			basePower: 80,
		},
		spritenum: 722,
		num: 1186,
		gen: 8,
		isNonstandard: "Past",
	},
	tr57: {
		name: "TR57",
		fling: {
			basePower: 80,
		},
		spritenum: 724,
		num: 1187,
		gen: 8,
		isNonstandard: "Past",
	},
	tr58: {
		name: "TR58",
		fling: {
			basePower: 80,
		},
		spritenum: 737,
		num: 1188,
		gen: 8,
		isNonstandard: "Past",
	},
	tr59: {
		name: "TR59",
		fling: {
			basePower: 80,
		},
		spritenum: 732,
		num: 1189,
		gen: 8,
		isNonstandard: "Past",
	},
	tr60: {
		name: "TR60",
		fling: {
			basePower: 80,
		},
		spritenum: 727,
		num: 1190,
		gen: 8,
		isNonstandard: "Past",
	},
	tr61: {
		name: "TR61",
		fling: {
			basePower: 90,
		},
		spritenum: 727,
		num: 1191,
		gen: 8,
		isNonstandard: "Past",
	},
	tr62: {
		name: "TR62",
		fling: {
			basePower: 85,
		},
		spritenum: 736,
		num: 1192,
		gen: 8,
		isNonstandard: "Past",
	},
	tr63: {
		name: "TR63",
		fling: {
			basePower: 80,
		},
		spritenum: 726,
		num: 1193,
		gen: 8,
		isNonstandard: "Past",
	},
	tr64: {
		name: "TR64",
		fling: {
			basePower: 120,
		},
		spritenum: 722,
		num: 1194,
		gen: 8,
		isNonstandard: "Past",
	},
	tr65: {
		name: "TR65",
		fling: {
			basePower: 90,
		},
		spritenum: 732,
		num: 1195,
		gen: 8,
		isNonstandard: "Past",
	},
	tr66: {
		name: "TR66",
		fling: {
			basePower: 120,
		},
		spritenum: 723,
		num: 1196,
		gen: 8,
		isNonstandard: "Past",
	},
	tr67: {
		name: "TR67",
		fling: {
			basePower: 90,
		},
		spritenum: 725,
		num: 1197,
		gen: 8,
		isNonstandard: "Past",
	},
	tr68: {
		name: "TR68",
		fling: {
			basePower: 10,
		},
		spritenum: 737,
		num: 1198,
		gen: 8,
		isNonstandard: "Past",
	},
	tr69: {
		name: "TR69",
		fling: {
			basePower: 80,
		},
		spritenum: 734,
		num: 1199,
		gen: 8,
		isNonstandard: "Past",
	},
	tr70: {
		name: "TR70",
		fling: {
			basePower: 80,
		},
		spritenum: 729,
		num: 1200,
		gen: 8,
		isNonstandard: "Past",
	},
	tr71: {
		name: "TR71",
		fling: {
			basePower: 130,
		},
		spritenum: 732,
		num: 1201,
		gen: 8,
		isNonstandard: "Past",
	},
	tr72: {
		name: "TR72",
		fling: {
			basePower: 120,
		},
		spritenum: 732,
		num: 1202,
		gen: 8,
		isNonstandard: "Past",
	},
	tr73: {
		name: "TR73",
		fling: {
			basePower: 120,
		},
		spritenum: 724,
		num: 1203,
		gen: 8,
		isNonstandard: "Past",
	},
	tr74: {
		name: "TR74",
		fling: {
			basePower: 80,
		},
		spritenum: 729,
		num: 1204,
		gen: 8,
		isNonstandard: "Past",
	},
	tr75: {
		name: "TR75",
		fling: {
			basePower: 100,
		},
		spritenum: 726,
		num: 1205,
		gen: 8,
		isNonstandard: "Past",
	},
	tr76: {
		name: "TR76",
		fling: {
			basePower: 10,
		},
		spritenum: 726,
		num: 1206,
		gen: 8,
		isNonstandard: "Past",
	},
	tr77: {
		name: "TR77",
		fling: {
			basePower: 10,
		},
		spritenum: 732,
		num: 1207,
		gen: 8,
		isNonstandard: "Past",
	},
	tr78: {
		name: "TR78",
		fling: {
			basePower: 95,
		},
		spritenum: 724,
		num: 1208,
		gen: 8,
		isNonstandard: "Past",
	},
	tr79: {
		name: "TR79",
		fling: {
			basePower: 10,
		},
		spritenum: 729,
		num: 1209,
		gen: 8,
		isNonstandard: "Past",
	},
	tr80: {
		name: "TR80",
		fling: {
			basePower: 10,
		},
		spritenum: 733,
		num: 1210,
		gen: 8,
		isNonstandard: "Past",
	},
	tr81: {
		name: "TR81",
		fling: {
			basePower: 95,
		},
		spritenum: 737,
		num: 1211,
		gen: 8,
		isNonstandard: "Past",
	},
	tr82: {
		name: "TR82",
		fling: {
			basePower: 20,
		},
		spritenum: 734,
		num: 1212,
		gen: 8,
		isNonstandard: "Past",
	},
	tr83: {
		name: "TR83",
		fling: {
			basePower: 10,
		},
		spritenum: 734,
		num: 1213,
		gen: 8,
		isNonstandard: "Past",
	},
	tr84: {
		name: "TR84",
		fling: {
			basePower: 80,
		},
		spritenum: 731,
		num: 1214,
		gen: 8,
		isNonstandard: "Past",
	},
	tr85: {
		name: "TR85",
		fling: {
			basePower: 10,
		},
		spritenum: 721,
		num: 1215,
		gen: 8,
		isNonstandard: "Past",
	},
	tr86: {
		name: "TR86",
		fling: {
			basePower: 90,
		},
		spritenum: 733,
		num: 1216,
		gen: 8,
		isNonstandard: "Past",
	},
	tr87: {
		name: "TR87",
		fling: {
			basePower: 80,
		},
		spritenum: 725,
		num: 1217,
		gen: 8,
		isNonstandard: "Past",
	},
	tr88: {
		name: "TR88",
		fling: {
			basePower: 10,
		},
		spritenum: 730,
		num: 1218,
		gen: 8,
		isNonstandard: "Past",
	},
	tr89: {
		name: "TR89",
		fling: {
			basePower: 110,
		},
		spritenum: 723,
		num: 1219,
		gen: 8,
		isNonstandard: "Past",
	},
	tr90: {
		name: "TR90",
		fling: {
			basePower: 90,
		},
		spritenum: 738,
		num: 1220,
		gen: 8,
		isNonstandard: "Past",
	},
	tr91: {
		name: "TR91",
		fling: {
			basePower: 10,
		},
		spritenum: 724,
		num: 1221,
		gen: 8,
		isNonstandard: "Past",
	},
	tr92: {
		name: "TR92",
		fling: {
			basePower: 80,
		},
		spritenum: 738,
		num: 1222,
		gen: 8,
		isNonstandard: "Past",
	},
	tr93: {
		name: "TR93",
		fling: {
			basePower: 85,
		},
		spritenum: 737,
		num: 1223,
		gen: 8,
		isNonstandard: "Past",
	},
	tr94: {
		name: "TR94",
		fling: {
			basePower: 95,
		},
		spritenum: 725,
		num: 1224,
		gen: 8,
		isNonstandard: "Past",
	},
	tr95: {
		name: "TR95",
		fling: {
			basePower: 80,
		},
		spritenum: 737,
		num: 1225,
		gen: 8,
		isNonstandard: "Past",
	},
	tr96: {
		name: "TR96",
		fling: {
			basePower: 90,
		},
		spritenum: 727,
		num: 1226,
		gen: 8,
		isNonstandard: "Past",
	},
	tr97: {
		name: "TR97",
		fling: {
			basePower: 85,
		},
		spritenum: 734,
		num: 1227,
		gen: 8,
		isNonstandard: "Past",
	},
	tr98: {
		name: "TR98",
		fling: {
			basePower: 85,
		},
		spritenum: 731,
		num: 1228,
		gen: 8,
		isNonstandard: "Past",
	},
	tr99: {
		name: "TR99",
		fling: {
			basePower: 80,
		},
		spritenum: 722,
		num: 1229,
		gen: 8,
		isNonstandard: "Past",
	},
	twistedspoon: {
		name: "Twisted Spoon",
		spritenum: 520,
		fling: {
			basePower: 30,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 248,
		gen: 2,
	},
	tyranitarite: {
		name: "Tyranitarite",
		spritenum: 607,
		megaStone: "Tyranitar-Mega",
		megaEvolves: "Tyranitar",
		itemUser: ["Tyranitar"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 669,
		gen: 6,
		isNonstandard: "Past",
	},
	ultraball: {
		name: "Ultra Ball",
		spritenum: 521,
		num: 2,
		gen: 1,
		isPokeball: true,
	},
	ultranecroziumz: {
		name: "Ultranecrozium Z",
		spritenum: 687,
		onTakeItem: false,
		zMove: "Light That Burns the Sky",
		zMoveFrom: "Photon Geyser",
		itemUser: ["Necrozma-Ultra"],
		num: 923,
		gen: 7,
		isNonstandard: "Past",
	},
	unremarkableteacup: {
		name: "Unremarkable Teacup",
		spritenum: 756,
		fling: {
			basePower: 80,
		},
		num: 2403,
		gen: 9,
	},
	upgrade: {
		name: "Up-Grade",
		spritenum: 523,
		fling: {
			basePower: 30,
		},
		num: 252,
		gen: 2,
	},
	utilityumbrella: {
		name: "Utility Umbrella",
		spritenum: 718,
		fling: {
			basePower: 60,
		},
		// Partially implemented in Pokemon.effectiveWeather() in sim/pokemon.ts
		onStart(pokemon) {
			if (!pokemon.ignoringItem()) return;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.inactive) return;
			this.effectState.inactive = false;
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
		},
		onEnd(pokemon) {
			if (['sunnyday', 'raindance', 'desolateland', 'primordialsea'].includes(this.field.effectiveWeather())) {
				this.runEvent('WeatherChange', pokemon, pokemon, this.effect);
			}
			this.effectState.inactive = true;
		},
		num: 1123,
		gen: 8,
	},
	venusaurite: {
		name: "Venusaurite",
		spritenum: 608,
		megaStone: "Venusaur-Mega",
		megaEvolves: "Venusaur",
		itemUser: ["Venusaur"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: 659,
		gen: 6,
		isNonstandard: "Past",
	},
	wacanberry: {
		name: "Wacan Berry",
		spritenum: 526,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Electric' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;
				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 186,
		gen: 4,
	},
	watergem: {
		name: "Water Gem",
		spritenum: 528,
		isGem: true,
		onSourceTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.flags['pledgecombo']) return;
			if (move.type === 'Water' && source.useItem()) {
				source.addVolatile('gem');
			}
		},
		num: 549,
		gen: 5,
		isNonstandard: "Past",
	},
	watermemory: {
		name: "Water Memory",
		spritenum: 677,
		onMemory: 'Water',
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 773) || pokemon.baseSpecies.num === 773) {
				return false;
			}
			return true;
		},
		forcedForme: "Silvally-Water",
		itemUser: ["Silvally-Water"],
		num: 913,
		gen: 7,
		isNonstandard: "Past",
	},
	waterstone: {
		name: "Water Stone",
		spritenum: 529,
		fling: {
			basePower: 30,
		},
		num: 84,
		gen: 1,
	},
	wateriumz: {
		name: "Waterium Z",
		spritenum: 633,
		onPlate: 'Water',
		onTakeItem: false,
		zMove: true,
		zMoveType: "Water",
		forcedForme: "Arceus-Water",
		num: 778,
		gen: 7,
		isNonstandard: "Past",
	},
	watmelberry: {
		name: "Watmel Berry",
		spritenum: 530,
		isBerry: true,
		naturalGift: {
			basePower: 100,
			type: "Fire",
		},
		onEat: false,
		num: 181,
		gen: 3,
		isNonstandard: "Past",
	},
	waveincense: {
		name: "Wave Incense",
		spritenum: 531,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify([4915, 4096]);
			}
		},
		num: 317,
		gen: 4,
		isNonstandard: "Past",
	},
	weaknesspolicy: {
		name: "Weakness Policy",
		spritenum: 609,
		fling: {
			basePower: 80,
		},
		onDamagingHit(damage, target, source, move) {
			if (!move.damage && !move.damageCallback && target.getMoveHitData(move).typeMod > 0) {
				target.useItem();
			}
		},
		boosts: {
			atk: 2,
			spa: 2,
		},
		num: 639,
		gen: 6,
	},
	wellspringmask: {
		name: "Wellspring Mask",
		spritenum: 759,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.name.startsWith('Ogerpon-Wellspring')) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, source) {
			if (source.baseSpecies.baseSpecies === 'Ogerpon') return false;
			return true;
		},
		forcedForme: "Ogerpon-Wellspring",
		itemUser: ["Ogerpon-Wellspring"],
		num: 2407,
		gen: 9,
	},
	wepearberry: {
		name: "Wepear Berry",
		spritenum: 533,
		isBerry: true,
		naturalGift: {
			basePower: 90,
			type: "Electric",
		},
		onEat: false,
		num: 167,
		gen: 3,
		isNonstandard: "Past",
	},
	whippeddream: {
		name: "Whipped Dream",
		spritenum: 692,
		fling: {
			basePower: 80,
		},
		num: 646,
		gen: 6,
		isNonstandard: "Past",
	},
	whiteherb: {
		name: "White Herb",
		spritenum: 535,
		fling: {
			basePower: 10,
			effect(pokemon) {
				let activate = false;
				const boosts: SparseBoostsTable = {};
				let i: BoostID;
				for (i in pokemon.boosts) {
					if (pokemon.boosts[i] < 0) {
						activate = true;
						boosts[i] = 0;
					}
				}
				if (activate) {
					pokemon.setBoost(boosts);
					this.add('-clearnegativeboost', pokemon, '[silent]');
				}
			},
		},
		onStart(pokemon) {
			this.effectState.boosts = {} as SparseBoostsTable;
			let ready = false;
			let i: BoostID;
			for (i in pokemon.boosts) {
				if (pokemon.boosts[i] < 0) {
					ready = true;
					this.effectState.boosts[i] = 0;
				}
			}
			if (ready) (this.effectState.target as Pokemon).useItem();
			delete this.effectState.boosts;
		},
		onAnySwitchInPriority: -2,
		onAnySwitchIn() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onAnyAfterMega() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onAnyAfterMove() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onUse(pokemon) {
			pokemon.setBoost(this.effectState.boosts);
			this.add('-clearnegativeboost', pokemon, '[silent]');
		},
		num: 214,
		gen: 3,
	},
	widelens: {
		name: "Wide Lens",
		spritenum: 537,
		fling: {
			basePower: 10,
		},
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy === 'number') {
				return this.chainModify([4505, 4096]);
			}
		},
		num: 265,
		gen: 4,
	},
	wikiberry: {
		name: "Wiki Berry",
		spritenum: 538,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Rock",
		},
		onUpdate(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 4 || (pokemon.hp <= pokemon.maxhp / 2 &&
				pokemon.hasAbility('gluttony') && pokemon.abilityState.gluttony)) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, pokemon.baseMaxhp / 3)) return false;
		},
		onEat(pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
			if (pokemon.getNature().minus === 'spa') {
				pokemon.addVolatile('confusion');
			}
		},
		num: 160,
		gen: 3,
	},
	wiseglasses: {
		name: "Wise Glasses",
		spritenum: 539,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 16,
		onBasePower(basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify([4505, 4096]);
			}
		},
		num: 267,
		gen: 4,
	},
	yacheberry: {
		name: "Yache Berry",
		spritenum: 567,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ice",
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.type === 'Ice' && target.getMoveHitData(move).typeMod > 0) {
				const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
				if (hitSub) return;

				if (target.eatItem()) {
					this.debug('-50% reduction');
					this.add('-enditem', target, this.effect, '[weaken]');
					return this.chainModify(0.5);
				}
			}
		},
		onEat() { },
		num: 188,
		gen: 4,
	},
	zapplate: {
		name: "Zap Plate",
		spritenum: 572,
		onPlate: 'Electric',
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if ((source && source.baseSpecies.num === 493) || pokemon.baseSpecies.num === 493) {
				return false;
			}
			return true;
		},
		forcedForme: "Arceus-Electric",
		num: 300,
		gen: 4,
	},
	zoomlens: {
		name: "Zoom Lens",
		spritenum: 574,
		fling: {
			basePower: 10,
		},
		onSourceModifyAccuracyPriority: -2,
		onSourceModifyAccuracy(accuracy, target) {
			if (typeof accuracy === 'number' && !this.queue.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return this.chainModify([4915, 4096]);
			}
		},
		num: 276,
		gen: 4,
	},

	// Gen 2 items

	berserkgene: {
		name: "Berserk Gene",
		spritenum: 388,
		onUpdate(pokemon) {
			if (pokemon.useItem()) {
				pokemon.addVolatile('confusion');
			}
		},
		boosts: {
			atk: 2,
		},
		num: 0,
		gen: 2,
		isNonstandard: "Past",
	},
	berry: {
		name: "Berry",
		spritenum: 319,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Poison",
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, 10)) return false;
		},
		onEat(pokemon) {
			this.heal(10);
		},
		num: 155,
		gen: 2,
		isNonstandard: "Past",
	},
	bitterberry: {
		name: "Bitter Berry",
		spritenum: 334,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ground",
		},
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.removeVolatile('confusion');
		},
		num: 156,
		gen: 2,
		isNonstandard: "Past",
	},
	burntberry: {
		name: "Burnt Berry",
		spritenum: 13,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Ice",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'frz') {
				pokemon.cureStatus();
			}
		},
		num: 153,
		gen: 2,
		isNonstandard: "Past",
	},
	goldberry: {
		name: "Gold Berry",
		spritenum: 448,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Psychic",
		},
		onResidualOrder: 10,
		onResidual(pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				pokemon.eatItem();
			}
		},
		onTryEatItem(item, pokemon) {
			if (!this.runEvent('TryHeal', pokemon, null, this.effect, 30)) return false;
		},
		onEat(pokemon) {
			this.heal(30);
		},
		num: 158,
		gen: 2,
		isNonstandard: "Past",
	},
	iceberry: {
		name: "Ice Berry",
		spritenum: 381,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Grass",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'brn') {
				pokemon.cureStatus();
			}
		},
		num: 152,
		gen: 2,
		isNonstandard: "Past",
	},
	mintberry: {
		name: "Mint Berry",
		spritenum: 65,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Water",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'slp') {
				pokemon.cureStatus();
			}
		},
		num: 150,
		gen: 2,
		isNonstandard: "Past",
	},
	miracleberry: {
		name: "Miracle Berry",
		spritenum: 262,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Flying",
		},
		onUpdate(pokemon) {
			if (pokemon.status || pokemon.volatiles['confusion']) {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			pokemon.cureStatus();
			pokemon.removeVolatile('confusion');
		},
		num: 157,
		gen: 2,
		isNonstandard: "Past",
	},
	mysteryberry: {
		name: "Mystery Berry",
		spritenum: 244,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fighting",
		},
		onUpdate(pokemon) {
			if (!pokemon.hp) return;
			const moveSlot = pokemon.lastMove && pokemon.getMoveData(pokemon.lastMove.id);
			if (moveSlot && moveSlot.pp === 0) {
				pokemon.addVolatile('leppaberry');
				pokemon.volatiles['leppaberry'].moveSlot = moveSlot;
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			let moveSlot;
			if (pokemon.volatiles['leppaberry']) {
				moveSlot = pokemon.volatiles['leppaberry'].moveSlot;
				pokemon.removeVolatile('leppaberry');
			} else {
				let pp = 99;
				for (const possibleMoveSlot of pokemon.moveSlots) {
					if (possibleMoveSlot.pp < pp) {
						moveSlot = possibleMoveSlot;
						pp = moveSlot.pp;
					}
				}
			}
			moveSlot.pp += 5;
			if (moveSlot.pp > moveSlot.maxpp) moveSlot.pp = moveSlot.maxpp;
			this.add('-activate', pokemon, 'item: Mystery Berry', moveSlot.move);
		},
		num: 154,
		gen: 2,
		isNonstandard: "Past",
	},
	pinkbow: {
		name: "Pink Bow",
		spritenum: 444,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		num: 251,
		gen: 2,
		isNonstandard: "Past",
	},
	polkadotbow: {
		name: "Polkadot Bow",
		spritenum: 444,
		onBasePower(basePower, user, target, move) {
			if (move.type === 'Normal') {
				return basePower * 1.1;
			}
		},
		num: 251,
		gen: 2,
		isNonstandard: "Past",
	},
	przcureberry: {
		name: "PRZ Cure Berry",
		spritenum: 63,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Fire",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'par') {
				pokemon.cureStatus();
			}
		},
		num: 149,
		gen: 2,
		isNonstandard: "Past",
	},
	psncureberry: {
		name: "PSN Cure Berry",
		spritenum: 333,
		isBerry: true,
		naturalGift: {
			basePower: 80,
			type: "Electric",
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.eatItem();
			}
		},
		onEat(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				pokemon.cureStatus();
			}
		},
		num: 151,
		gen: 2,
		isNonstandard: "Past",
	},

	// CAP items

	crucibellite: {
		name: "Crucibellite",
		spritenum: 577,
		megaStone: "Crucibelle-Mega",
		megaEvolves: "Crucibelle",
		itemUser: ["Crucibelle"],
		onTakeItem(item, source) {
			if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
			return true;
		},
		num: -1,
		gen: 6,
		isNonstandard: "CAP",
	},
	vilevial: {
		name: "Vile Vial",
		spritenum: 752,
		fling: {
			basePower: 60,
		},
		onBasePowerPriority: 15,
		onBasePower(basePower, user, target, move) {
			if (user.baseSpecies.num === -66 && ['Poison', 'Flying'].includes(move.type)) {
				return this.chainModify([4915, 4096]);
			}
		},
		onTakeItem(item, pokemon, source) {
			if (source?.baseSpecies.num === -66 || pokemon.baseSpecies.num === -66) {
				return false;
			}
			return true;
		},
		forcedForme: "Venomicon-Epilogue",
		itemUser: ["Venomicon-Epilogue"],
		num: -2,
		gen: 8,
		isNonstandard: "CAP",
	},
	cookies: {
  name: "Cookies",
  shortDesc:
    "End of each turn: heal ramps (1/16→1/8→1/4→1/2), then stops healing. Also -1 Spe each turn; at Spe ≤ -3, becomes Truant. After 8 turns on the field total, the holder faints.",
  fling: { basePower: 50 },

  onModifyMove(move, pokemon) {
    if (move.id !== 'fling') return;
    move.willCrit = true;
  },

  // Initialize counters on first entry only (do not reset on switch-ins)
  onStart(pokemon) {
    const ist = (pokemon.itemState ??= {} as any);
    if (ist.rampedHealStage == null) ist.rampedHealStage = 0; // 0,1,2,3 = heal stages; 4 = finished healing
    if (ist.activeTurns == null) ist.activeTurns = 0;
  },

  // Do NOT reset the counters on switch-in; we only ensure they exist
  onSwitchIn(pokemon) {
    const ist = (pokemon.itemState ??= {} as any);
    if (ist.rampedHealStage == null) ist.rampedHealStage = 0;
    if (ist.activeTurns == null) ist.activeTurns = 0;
  },

  onEnd(pokemon) {
    if (pokemon.itemState) {
      delete (pokemon.itemState as any).rampedHealStage;
      delete (pokemon.itemState as any).activeTurns;
    }
  },

  onResidualOrder: 5,
  onResidual(pokemon) {
    const ist = (pokemon.itemState ??= {} as any);

    // 1) heal using current stage, then advance it
    // stage 0 = 1/16, 1 = 1/8, 2 = 1/4, 3 = 1/2, 4+ = no more healing
    const stage = ist.rampedHealStage ?? 0;
    const denoms = [16, 8, 4, 2] as const;

    if (stage <= 3) {
      this.heal(pokemon.baseMaxhp / denoms[stage], pokemon, null, this.effect);
      ist.rampedHealStage = stage + 1; // after 1/2 heal, becomes 4 and stops
    }

    // 2) drop Speed by one stage
    this.boost({spe: -1}, pokemon, pokemon, this.effect);

    // 3) if Speed ≤ -3, set ability to Truant (once)
    if (pokemon.boosts.spe <= -3 && pokemon.getAbility().id !== 'truant') {
      if (pokemon.setAbility('truant', pokemon, true)) {
        this.add('-ability', pokemon, 'Truant', '[from] item: Cookies');
      }
    }

    // 4) track active turns on the field and faint at 8 total
    ist.activeTurns = (ist.activeTurns ?? 0) + 1;

    if (ist.activeTurns >= 8 && !pokemon.fainted) {
      this.add('-message', `${pokemon.name} fainted from diabetes`);
      pokemon.faint(undefined, this.effect);
    }
  },
},


	bulletproofvest: {
		name: "Bulletproof Vest",
		spritenum: 581,
		fling: {
			basePower: 80,
		},
		onModifyDefPriority: 1,
		onModifyDef(def) {
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			for (const moveSlot of pokemon.moveSlots) {
				const move = this.dex.moves.get(moveSlot.id);
				if (move.category === 'Status' && move.id !== 'mefirst') {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
		num: 900,
		gen: 6,
	},
	
  typedice: {
    name: "Type Dice",
    shortDesc: "On use of a damaging move: holder becomes a random type. If the move matches that type, its power is doubled.",
    fling: {
			basePower: 60,
		},

    // We want to set the type BEFORE damage calcs, and only for the holder's own moves.
    onBeforeMove(source, target, move) {
      if (!move || move.category === 'Status') return;

      // Build a list of eligible types (exclude weird/engine types if present).
      const allTypes = this.dex.types.names().filter(t =>
        t !== 'Stellar' && t !== '???'
      );

      // --- SINGLE TYPE VERSION (inactive) ---
      // const newType = this.sample(allTypes);
      // if (source.setType(newType)) {
        // Visual message for the type change
        // this.add('-start', source, 'typechange', newType, '[from] item: Type Dice');
      // }

      // Remember if the move matches the freshly-set type so we can boost power later.
      // (Store this only for the duration of this move.)
      // source.itemState.typeDiceMatched = (move.type === newType);

      // --- DUAL TYPE VERSION (active) ---
      
       const t1 = this.sample(allTypes);
       let t2Pool = allTypes.filter(t => t !== t1);
      // // If you want to allow duplicates (e.g., both same type), remove the filter above.
       const t2 = this.sample(t2Pool);
       const newTypes = [t1, t2];
       if (source.setType(newTypes)) {
         this.add('-start', source, 'typechange', newTypes.join('/'), '[from] item: Type Dice');
       }
       source.itemState.typeDiceMatched = (move.type === t1 || move.type === t2);
    },

    // Apply the x2 power if we flagged a match in onBeforeMove.
    onBasePowerPriority: 19,
    onBasePower(basePower, user, target, move) {
		// If the Pokémon is Terastallized, do NOT apply the Type Dice doubling.
      if (user?.terastallized) {
        return;
      }
      // Only boost for the move that triggered the change
      if (user?.itemState?.typeDiceMatched) {
        return this.chainModify(2);
      }
    },

	// This is how loaded dice does it. Added typedice into the sim battle-actions where loaded dice is to hopefully emulate loaded dice exactly
	onModifyMove(move) {
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},



	// Manually set multihit moves with minimums and maximums
	//onModifyMove(move) {
//  if (Array.isArray(move.multihit)) {
  //  const [min, max] = move.multihit;
   // if (min === 2 && max === 5) move.multihit = [4, 5]
	//if (min === 5 && max === 10) move.multihit = [7, 10]
//	if (min === 2 && max === 10) move.multihit = [4, 10]
 // }
//},

    // Clean up the per-move flag after the action resolves.
    onAfterMove(source, target, move) {
      if (!move) return;
      if (source?.itemState?.typeDiceMatched) {
        delete source.itemState.typeDiceMatched;
      }
    },

    // Also clear the flag if something weird happens (like move failing/being interrupted).
    onMoveAborted(pokemon, target, move) {
      if (pokemon?.itemState?.typeDiceMatched) {
        delete pokemon.itemState.typeDiceMatched;
      }
    },

    // Standard item fields
    gen: 9,
    // Make sure it actually exists in battle
    spritenum: 0, // optional; set your own if you have custom sprites
  },
  normalbrush: {
    name: "Normal Brush",
    shortDesc: "Once: First move used becomes Normal-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Normal';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Normal Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove');
        source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(pokemon) {
      if (pokemon.volatiles.brushConsumedThisMove) pokemon.removeVolatile('brushConsumedThisMove');
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
    onMoveAborted(pokemon) {
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
  },

  firebrush: {
    name: "Fire Brush",
    shortDesc: "Once: First move used becomes Fire-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Fire';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Fire Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove');
        source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(pokemon) {
      if (pokemon.volatiles.brushConsumedThisMove) pokemon.removeVolatile('brushConsumedThisMove');
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
    onMoveAborted(pokemon) {
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
  },

  waterbrush: {
    name: "Water Brush",
    shortDesc: "Once: First move used becomes Water-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Water';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Water Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove');
        source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(pokemon) {
      if (pokemon.volatiles.brushConsumedThisMove) pokemon.removeVolatile('brushConsumedThisMove');
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
    onMoveAborted(pokemon) { if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed; },
  },

  electricbrush: {
    name: "Electric Brush",
    shortDesc: "Once: First move used becomes Electric-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Electric';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Electric Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove'); source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(pokemon) {
      if (pokemon.volatiles.brushConsumedThisMove) pokemon.removeVolatile('brushConsumedThisMove');
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
    onMoveAborted(p) { if (p?.itemState?.brushArmed) delete p.itemState.brushArmed; },
  },

  grassbrush: {
    name: "Grass Brush",
    shortDesc: "Once: First move used becomes Grass-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Grass';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Grass Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove'); source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(p) {
      if (p.volatiles.brushConsumedThisMove) p.removeVolatile('brushConsumedThisMove');
      if (p?.itemState?.brushArmed) delete p.itemState.brushArmed;
    },
    onMoveAborted(p) { if (p?.itemState?.brushArmed) delete p.itemState.brushArmed; },
  },

  icebrush: {
    name: "Ice Brush",
    shortDesc: "Once: First move used becomes Ice-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Ice';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Ice Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(t, s, m) {
      if (!s?.itemState?.brushArmed) return;
      if (s.volatiles.brushConsumedThisMove) return;
      const held = s.getItem(); if (!held?.id) return;
      if (s.useItem()) {
        s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed = true;
        delete s.itemState.brushArmed;
        this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s);
      }
    },
    onAfterMove(p) { if (p.volatiles.brushConsumedThisMove) p.removeVolatile('brushConsumedThisMove'); if (p?.itemState?.brushArmed) delete p.itemState.brushArmed; },
    onMoveAborted(p) { if (p?.itemState?.brushArmed) delete p.itemState.brushArmed; },
  },

  fightingbrush: {
    name: "Fighting Brush",
    shortDesc: "Once: First move used becomes Fighting-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Fighting';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Fighting Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(t, s, m) {
      if (!s?.itemState?.brushArmed) return;
      if (s.volatiles.brushConsumedThisMove) return;
      const held = s.getItem(); if (!held?.id) return;
      if (s.useItem()) {
        s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed = true;
        delete s.itemState.brushArmed;
        this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s);
      }
    },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed;},
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed;},
  },

  poisonbrush: {
    name: "Poison Brush",
    shortDesc: "Once: First move used becomes Poison-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Poison';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Poison Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(t,s,m){
      if(!s?.itemState?.brushArmed) return;
      if(s.volatiles.brushConsumedThisMove) return;
      const held=s.getItem(); if(!held?.id) return;
      if(s.useItem()){
        s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true;
        delete s.itemState.brushArmed;
        this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s);
      }
    },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed;},
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed;},
  },

  groundbrush: {
    name: "Ground Brush",
    shortDesc: "Once: First move used becomes Ground-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Ground';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Ground Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(target, source, move) {
      if (!source?.itemState?.brushArmed) return;
      if (source.volatiles.brushConsumedThisMove) return;
      const held = source.getItem(); if (!held?.id) return;
      if (source.useItem()) {
        source.addVolatile('brushConsumedThisMove');
        source.itemState.brushConsumed = true;
        delete source.itemState.brushArmed;
        this.add('-enditem', source, held.name, '[from] item: ' + held.name, '[of] ' + source);
      }
    },
    onAfterMove(pokemon) {
      if (pokemon.volatiles.brushConsumedThisMove) pokemon.removeVolatile('brushConsumedThisMove');
      if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed;
    },
    onMoveAborted(pokemon) { if (pokemon?.itemState?.brushArmed) delete pokemon.itemState.brushArmed; },
  },

  flyingbrush: {
    name: "Flying Brush",
    shortDesc: "Once: First move used becomes Flying-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move, pokemon) {
      if (!move || move.id === 'struggle') return;
      if (pokemon?.itemState?.brushConsumed) return;
      if (pokemon?.itemState?.brushArmed) return;
      pokemon.itemState.brushArmed = true;
      move.type = 'Flying';
      // @ts-expect-error
      move.addedType = undefined;
      this.add('-activate', pokemon, 'item: Flying Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  psychicbrush: {
    name: "Psychic Brush",
    shortDesc: "Once: First move used becomes Psychic-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){
      if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Psychic';
      // @ts-expect-error
      move.addedType=undefined;
      this.add('-activate', pokemon, 'item: Psychic Brush', '[move] ' + move.name);
    },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  bugbrush: {
    name: "Bug Brush",
    shortDesc: "Once: First move used becomes Bug-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Bug';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Bug Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  rockbrush: {
    name: "Rock Brush",
    shortDesc: "Once: First move used becomes Rock-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Rock';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Rock Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  ghostbrush: {
    name: "Ghost Brush",
    shortDesc: "Once: First move used becomes Ghost-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Ghost';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Ghost Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  dragonbrush: {
    name: "Dragon Brush",
    shortDesc: "Once: First move used becomes Dragon-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Dragon';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Dragon Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  darkbrush: {
    name: "Dark Brush",
    shortDesc: "Once: First move used becomes Dark-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Dark';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Dark Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  steelbrush: {
    name: "Steel Brush",
    shortDesc: "Once: First move used becomes Steel-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Steel';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Steel Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },

  fairybrush: {
    name: "Fairy Brush",
    shortDesc: "Once: First move used becomes Fairy-type, then consumed (pre-damage).",
    fling: { basePower: 90 }, gen: 9,
    onModifyMove(move,pokemon){ if(!move||move.id==='struggle')return;
      if(pokemon?.itemState?.brushConsumed)return;
      if(pokemon?.itemState?.brushArmed)return;
      pokemon.itemState.brushArmed=true; move.type='Fairy';
      // @ts-expect-error
      move.addedType=undefined; this.add('-activate', pokemon, 'item: Fairy Brush', '[move] ' + move.name); },
    onSourceTryPrimaryHit(t,s,m){ if(!s?.itemState?.brushArmed)return;
      if(s.volatiles.brushConsumedThisMove)return;
      const held=s.getItem(); if(!held?.id)return;
      if(s.useItem()){ s.addVolatile('brushConsumedThisMove'); s.itemState.brushConsumed=true; delete s.itemState.brushArmed; this.add('-enditem', s, held.name, '[from] item: ' + held.name, '[of] ' + s); } },
    onAfterMove(p){ if(p.volatiles.brushConsumedThisMove)p.removeVolatile('brushConsumedThisMove'); if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
    onMoveAborted(p){ if(p?.itemState?.brushArmed)delete p.itemState.brushArmed; },
  },
fuzzymushroom: {
	name: "Fuzzy Mushroom",
	fling: {
			basePower: 40,
		},
		onModifyMove(move, pokemon) {
    if (move.id !== 'fling') return;
    // Pick the status now and make it a guaranteed secondary on hit
    const chosen = this.sample(['psn', 'par', 'slp']);
    move.secondaries = (move.secondaries || []).filter(s => !('status' in s));
    move.secondaries.push({chance: 100, status: chosen})},

	onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target) && !source.status && source.runStatusImmunity('powder')) {
				const r = this.random(100);
				if (r < 11) {
					source.setStatus('slp', target);
				} else if (r < 21) {
					source.setStatus('par', target);
				} else if (r < 30) {
					source.setStatus('psn', target);
				}
			}
		},
},
elegantcloth: {
  name: "Elegant Cloth",
  fling: {
    basePower: 70,
    volatileStatus: 'flinch',
  },
  onModifyMovePriority: -2,
  onModifyMove(move) {
    if (move.secondaries) {
      this.debug('scaling secondary chance by 2');
      for (const secondary of move.secondaries) {
        if (secondary.chance) {
          secondary.chance = Math.min(80, Math.floor(secondary.chance * 2));
        }
      }
    }
    if (move.self?.chance) {
      move.self.chance = Math.min(80, Math.floor(move.self.chance * 2));
    }
  },
},
elegantband: {
  name: "Elegant Band",
  fling: {
    basePower: 70,
    volatileStatus: 'flinch',
  },

  // Run after Serene Grace so it overwrites its effect
  onModifyMovePriority: -1,
  onModifyMove(move) {
    // Helper: normalize to move.secondaries (PS supports both `secondary` and `secondaries`)
    const pushSecondary = (sec: any) => {
      if (!move.secondaries) move.secondaries = [];
      move.secondaries.push(sec);
    };

    // 1) Target secondaries (effects on the opponent)
    if (move.secondaries?.length) {
      this.debug('setting target secondary chances to 30%');
      for (const secondary of move.secondaries) {
        // If it already has a chance, clamp it; if not, give it one
        if (secondary.chance === undefined || secondary.chance > 30) secondary.chance = 30;
      }
    }

    // Some moves use singular `secondary` instead of `secondaries`
    const singular = (move as any).secondary;
    if (singular) {
      this.debug('normalizing singular secondary and clamping to 30%');
      if (singular.chance === undefined || singular.chance > 30) singular.chance = 30;
      pushSecondary(singular);
      (move as any).secondary = null;
    }

    // 2) Self effects (like Close Combat / V-create stat drops)
    // NOTE: `move.self` does NOT support `chance` in typings or engine logic.
    // To make it probabilistic, convert it into a normal secondary with `self: ...`.
    if (move.self) {
      const self: any = move.self;

      // Only bother if it's actually doing something to the user
      if (self.boosts || self.volatileStatus || self.sideCondition || self.weather || self.terrain || self.status) {
        this.debug('converting self-effect to 30% secondary');
        pushSecondary({
          chance: 30,
          self,
        });

        // Remove deterministic self so it doesn't always happen
        delete (move as any).self;
      }
    }

    // 3) Some moves use selfBoost separately (mainly boosts on hit)
    // `selfBoost` also doesn't have a typed `chance`, and isn't rolled by engine.
    // Convert to a secondary the same way.
    if ((move as any).selfBoost) {
      const selfBoost: any = (move as any).selfBoost;
      this.debug('converting selfBoost to 30% secondary');

      pushSecondary({
        chance: 30,
        self: selfBoost,
      });

      delete (move as any).selfBoost;
    }
  },
},




adrenalineshot: {
  name: "Adrenaline Shot",
  shortDesc: "At 1/4 HP or less: +3 all stats. Faints at end of the next turn.",
  onUpdate(pokemon) {
    if (pokemon?.itemState?.adrenalineUsed || pokemon?.itemState?.adrenalineArmed) return;
    if (pokemon.hp > pokemon.maxhp / 4) return;

    this.add('-activate', pokemon, 'item: Adrenaline Shot');
    this.boost({atk: 3, def: 3, spa: 3, spd: 3, spe: 3, accuracy: -1}, pokemon);

    pokemon.itemState.adrenalineArmed = true;
    pokemon.itemState.adrenalineDueTurn = this.turn + 2;
  },
  onResidualOrder: 999,
  onResidual(pokemon) {
    const due = pokemon?.itemState?.adrenalineDueTurn;
    if (!due) return;

    // Faint only after one full turn has passed since activation
    if (this.turn >= due) {
      // Optional visible message like your example
      this.add('-message', pokemon.name + "'s adrenaline wore off!");
      // Consume then faint
      pokemon.useItem();
      if (!pokemon.fainted) pokemon.faint();

      delete pokemon.itemState.adrenalineDueTurn;
      delete pokemon.itemState.adrenalineArmed;
      pokemon.itemState.adrenalineUsed = true;
    }
	
  },
  // Safety: if it leaves the field, keep the timer; it will resolve on a later turn when active.
  gen: 9,
},

speedbelt: {
  name: "Speed Belt",
  shortDesc: "Boosts move power by 25% if the holder moves before the target.",
  fling: {
	basePower: 50
  },
  onTryMove(pokemon, target, move) {
    if (move.id !== 'fling') return;
    this.boost({spe: 2}, pokemon);
    // (Happens before the item is thrown/removed, so it always triggers on attempt.)
  },
  onBasePower(basePower, attacker, defender, move) {
    if (!defender.moveThisTurn) {
      return this.chainModify([5120, 4096]); // 1.25x
    }
  },
  gen: 9,
},
armoredshell: {
  name: "Armored Shell",
  shortDesc: "Holder cannot be struck by critical hits.",
  fling: {
	basePower: 50,
  },
  onTryMove(pokemon, target, move) {
    if (move.id !== 'fling') return;
    this.boost({def: 2}, pokemon);},
  onCriticalHit: false,
  gen: 9,
},
typedrugs: {
  name: "Type Drugs",
  shortDesc: "Each turn: adds another random type to the holder, stacking infinitely.",
  fling: {
	basePower: 50
  },
  onTryMove(pokemon, target, move) {
    if (move.id !== 'fling') return;

    const allTypes = this.dex.types.names().filter(t => t !== '???' && t !== 'Stellar');
    let cur = pokemon.getTypes();
    let candidates = allTypes.filter(t => !cur.includes(t));

    // Add up to 3 random extra types
    for (let i = 0; i < 3 && candidates.length; i++) {
      const addType = this.sample(candidates);
      cur = cur.concat(addType);
      candidates = candidates.filter(t => t !== addType);
    }

    if (pokemon.setType(cur)) {
      this.add('-start', pokemon, 'typechange', cur.join('/'), '[from] item: Type Orb');
    }},
  onResidual(pokemon) {
    // Build a list of types not already present
    const allTypes = this.dex.types.names().filter(t => t !== '???' && t !== 'Stellar');
    const current = pokemon.getTypes();
    const candidates = allTypes.filter(t => !current.includes(t));
    
    if (!candidates.length) return; // already has all types
    
    const addType = this.sample(candidates);
    // `addType` gets merged into the pokemon's types list
    const newTypes = current.concat(addType);
    if (pokemon.setType(newTypes)) {
      this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] item: Type Drugs');
    }
  },
  gen: 9,
},
typebulb: {
  name: "Type Bulb",
  shortDesc: "Consumed on hit; holder gains the attack's type, then a Type Bulb boost to its highest stat (1.3×, or 1.5× if Speed).",
  fling: { basePower: 90 },
  gen: 9,

  // Fling gimmick: the target gains a random extra type it doesn't already have
  onTryMove(pokemon, target, move) {
    if (move.id !== 'fling') return;
    if (!target) return;

    const allTypes = this.dex.types.names().filter(t => t !== '???' && t !== 'Stellar');
    const cur = target.getTypes();
    const candidates = allTypes.filter(t => !cur.includes(t));
    if (!candidates.length) return;

    const addType = this.sample(candidates);
    const newTypes = cur.concat(addType);
    if (target.setType(newTypes)) {
      this.add('-start', target, 'typechange', newTypes.join('/'), '[from] item: Type Bulb');
    }
  },

  // Core effect: consume on damaging hit, add that move's type, then start the Type Bulb boost
  onDamagingHit(_damage, target, _source, move) {
    if (!move || move.category === 'Status') return;

    // Consume once
    if (!target.useItem()) return;

    // Add the move's type as an additional type (if not already present)
    const t = move.type;
    if (t && t !== '???' && t !== 'Stellar') {
      const cur = target.getTypes();
      if (!cur.includes(t)) {
        const newTypes = cur.concat(t as string);
        if (target.setType(newTypes)) {
          this.add('-start', target, 'typechange', newTypes.join('/'), '[from] item: Type Bulb');
        }
      } else {
        this.add('-activate', target, 'item: Type Bulb');
      }
    } else {
      this.add('-activate', target, 'item: Type Bulb');
    }

    // Apply the Type Bulb boost as a volatile that persists while the Pokémon stays in
    if (!target.volatiles.typebulb) {
      target.addVolatile('typebulb', target, this.effect);
    }
  },

  // Volatile status for the post-consumption boost
  condition: {
    noCopy: true,

    onStart(pokemon) {
      // Announce with item terminology only
      this.add('-activate', pokemon, 'item: Type Bulb');

      // Highest non-HP stat; same tie-break behavior as PS helper
      // (false, true) = non-HP, ties resolved in internal order
      this.effectState.bestStat = pokemon.getBestStat(false, true);

      // Start banner using Type Bulb wording
      // You can keep this as-is or change to a custom string if you prefer
      this.add('-start', pokemon, 'typebulb' + this.effectState.bestStat);
    },

    // Match Proto/Quark multipliers: 1.3× (as [5325,4096]) or 1.5× if Speed
    onModifyAtkPriority: 5,
    onModifyAtk(atk) {
      if (this.effectState.bestStat !== 'atk') return;
      this.debug('Type Bulb atk boost');
      return this.chainModify([5325, 4096]);
    },
    onModifyDefPriority: 6,
    onModifyDef(def) {
      if (this.effectState.bestStat !== 'def') return;
      this.debug('Type Bulb def boost');
      return this.chainModify([5325, 4096]);
    },
    onModifySpAPriority: 5,
    onModifySpA(spa) {
      if (this.effectState.bestStat !== 'spa') return;
      this.debug('Type Bulb spa boost');
      return this.chainModify([5325, 4096]);
    },
    onModifySpDPriority: 6,
    onModifySpD(spd) {
      if (this.effectState.bestStat !== 'spd') return;
      this.debug('Type Bulb spd boost');
      return this.chainModify([5325, 4096]);
    },
    onModifySpe(spe) {
      if (this.effectState.bestStat !== 'spe') return;
      this.debug('Type Bulb spe boost');
      return this.chainModify(1.5);
    },

    onEnd(pokemon) {
      // Clear banner with item wording
      this.add('-end', pokemon, 'Type Bulb');
    },
  },
},



heavyarmor: {
  name: "Heavy Armor",
  shortDesc: "Holder takes and deals half damage.",
  fling: {
	basePower: 400
  },
  // halve outgoing damage
  onBasePower(basePower, attacker, defender, move) {
    return this.chainModify(0.5);
  },
  // halve incoming damage
  onSourceModifyDamage(damage, source, target, move) {
    return this.chainModify(0.5);
  },
  gen: 9,
},

ultimateberry: {
  name: "Ultimate Berry",
  shortDesc:
    "Eats on first of: HP ≤ 1/2; about to take SE hit; status inflicted. Heals 1/6, +1 Atk/SpA or +1 Def/SpD (rand), cures status/confusion, next move +1 prio. SE hit is 0.67×.",
  isBerry: true,

  // Centralized effects so Cud Chew re-eats follow the same rules
  onEat(pokemon) {
    // heal 1/6 max HP
    this.heal(Math.floor(pokemon.baseMaxhp / 6), pokemon);

    // random offense/defense suite: 50/50
    if (this.randomChance(1, 2)) {
      this.boost({atk: 1, spa: 1}, pokemon, pokemon, this.effect); // offense
    } else {
      this.boost({def: 1, spd: 1}, pokemon, pokemon, this.effect); // defense
    }

    // cure status & confusion
    if (pokemon.status) pokemon.cureStatus();
    if (pokemon.volatiles['confusion']) pokemon.removeVolatile('confusion');

    // next move gets +1 priority (your existing volatile)
    pokemon.addVolatile('ultimateberrypriority');

    this.add('-activate', pokemon, 'item: Ultimate Berry');
  },

  // ── Trigger #1: HP threshold (Sitrus-like) ──
  onUpdate(pokemon) {
    if (!pokemon.hp) return;
    if (pokemon.hp <= pokemon.maxhp / 2) {
      pokemon.eatItem(); // onEat handles everything
    }
  },

  // ── Trigger #2: Super-effective damaging hit (mitigate @ ~0.67×) ──
onSourceModifyDamage(damage, source, target, move) {
  if (!target?.hp || !move || move.category === 'Status') return;

  // Prefer the resolved effectiveness for THIS hit
  const hit = target.getMoveHitData(move as ActiveMove);
  const typeMod =
    (hit && typeof hit.typeMod === 'number')
      ? hit.typeMod
      : this.dex.getEffectiveness(move.type, target);

  if (typeMod <= 0) return; // not SE

  // Eat now and reduce this hit
  if (target.eatItem()) {
    this.add('-activate', target, 'item: Ultimate Berry', 'super-effective');
    // ~2/3 damage (choose one style)
    // return this.chainModify(0xAAC);              // ≈ 2732/4096 ≈ 0.667
    return this.chainModify([2732, 4096]);          // explicit fraction
  }
},

  // ── Trigger #3: Status is being inflicted (block & consume) ──
  onSetStatus(_status, target) {
    if (!target?.hp) return;
    if (target.eatItem()) {
      this.add('-activate', target, 'item: Ultimate Berry', 'status');
      return false; // prevent status from landing; onEat will also cure any existing
    }
  },

  // Also block confusion when it's being applied as a volatile
  onTryAddVolatile(status, target) {
    if (!target?.hp) return;
    if (status.id === 'confusion') {
      if (target.eatItem()) {
        this.add('-activate', target, 'item: Ultimate Berry', 'confusion');
        return null; // block; onEat already ran
      }
    }
  },
},


isseisglove: {
  name: "Issei's Glove",
  shortDesc: "On a damaging move: 5% deals 1000 raw dmg, else 15% 3× dmg, else 30% 2× dmg. Consumed on trigger.",

  // Decide the outcome once per move use, but DON'T consume yet.
  onModifyMove(move, pokemon) {
    if (move.category === 'Status' || move.id === 'struggle' || move.isZ || move.isMax) return;
    const mem = (pokemon as any).m ?? ((pokemon as any).m = {});
    if (mem.isseiOutcome) return; // already rolled for this move

    const r = this.random(100);

if (r < 5) {             
    mem.isseiOutcome = 'raw';   // 5%
}
else if (r < 20) {       
    mem.isseiOutcome = 'x3';    // 15%
}
else if (r < 50) {       
    mem.isseiOutcome = 'x2';    // 30%
}
else {                   
    mem.isseiOutcome = null;    // 50%
}
  },

  // Apply 2× / 3× (now we consume + announce the first time we apply)
  onBasePower(basePower, source, target, move) {
    const mem = (source as any).m;
    const outcome = mem?.isseiOutcome;
    if (outcome !== 'x2' && outcome !== 'x3') return;

    // consume+announce once (covers multihit)
    if (!mem.isseiConsumed) {
      if (source.useItem()) {
        if (outcome === 'x3') this.add('-message', 'BOOOOOOST!!!!');
        else this.add('-message', 'BOOST!');
      }
      mem.isseiConsumed = true;
    }
    return this.chainModify(outcome === 'x3' ? 3 : 2);
  },

  // Apply raw 1000 damage (replaces the normal calc)
  onModifyDamage(damage, source, target, move) {
    const mem = (source as any).m;
    if (mem?.isseiOutcome !== 'raw') return;

    if (!mem.isseiConsumed) {
      if (source.useItem()) {
        this.add('-message', 'BOOST! BOOST! BOOST! BOOST! BOOST!');
      }
      mem.isseiConsumed = true;
    }
    return 1000; // flat damage, ignores typing/resists/etc.
  },

  // Cleanup after the action (hit, miss, or aborted)
  onAfterMove(source, target, move) {
    const mem = (source as any).m;
    if (mem) {
      delete mem.isseiOutcome;
      delete mem.isseiConsumed;
    }
  },
  onMoveAborted(source, move) {
    const mem = (source as any).m;
    if (mem) {
      delete mem.isseiOutcome;
      delete mem.isseiConsumed;
    }
  },
},

extramoody: {
  name: "ExtraMoody",
  shortDesc: "End of every turn: +6 to one random stat, -6 to another random stat.",
  fling: {
	basePower: 50
  },
  onAfterMove(source, target, move) {
  // Only care about Fling from the holder of ExtraMoody
  if (!move || move.id !== 'fling') return;

  // Require that Fling actually hit/dealt damage (not missed/immune)
  const didDamage = !!(move.totalDamage || move.hit > 0);
  if (!didDamage) return;

  // Normalize target(s)
  const targets: Pokemon[] = Array.isArray(target)
    ? target.filter(t => !!t && !t.fainted)
    : (target ? [target] : []);
  if (!targets.length) return;

  // Pick a random stat and drop it by 6 on each target
  const stats: BoostID[] = ['atk','def','spa','spd','spe','accuracy','evasion'];
  const chosen = this.sample(stats);

  for (const t of targets) {
    this.boost({[chosen]: -6}, t, source, this.effect);
    this.add('-message', `${t.name}'s ${chosen.toUpperCase()} fell drastically from the flung ExtraMoody!`);
  }
},

  // Trigger once per turn (Residual phase, like Leftovers / Moody)
  onResidualOrder: 28, // same timing block as Moody
  onResidual(pokemon) {
    if (!pokemon.hp) return;

    // All stats we can modify
    const stats: BoostID[] = ['atk','def','spa','spd','spe'];

    // Choose random stat to raise
    const upStat = this.sample(stats);

    // Choose different stat to lower
    let downStat: BoostID;
    do {
      downStat = this.sample(stats);
    } while (downStat === upStat);

    // Apply boosts
    this.boost({[upStat]: 6}, pokemon, pokemon, null, true);
    this.boost({[downStat]: -3}, pokemon, pokemon, null, true);

    // Log what happened
    this.add('-message', `${pokemon.name}'s ExtraMoody sharply shifted its stats! [+6 ${upStat.toUpperCase()}, -6 ${downStat.toUpperCase()}]`);
  },
},
steelfangs: {
		name: "Steel Fangs",
		shortDesc: "Biting moves deal 1.5× damage (Strong Jaw as an item).",
		gen: 9,
		// Keep this list in sync with Showdown's biting flag set
		onBasePower(basePower, user, target, move) {
			// PS uses a 'bite' flag on biting moves
			if (move.flags?.bite) {
				this.debug('Steel Fangs boost');
				return this.chainModify(1.5);
			}
		},
	},

	weatherbelt: {
		name: "Weather Belt",
		shortDesc: "Boosts Speed by 1.5× while any weather is active.",
		gen: 9,
		onModifySpe(spe, pokemon) {
			// If any weather that counts as active is set, boost Speed
			// (this.field.isWeather('anything') is true for active weather)
			if (this.field.weather && this.field.weather !== 'none') {
				this.debug('Weather Belt Speed boost');
				return this.chainModify(1.5);
			}
		},
	},

	bloodcharm: {
  name: "Blood Charm",
  shortDesc: "If a foe is statused when you act, heal 1/8 max HP after using a damaging move.",
  gen: 9,

  // Pre-check: arm only if any opposing active Pokémon is already major-statused
  onBeforeMove(user, _target, move) {
    if (!move || move.category === 'Status') { this.effectState.bcArm = false; return; }
    const foes = user.side.foe.active.filter(Boolean);
    const major = new Set(['brn','par','slp','frz','psn','tox']);
    this.effectState.bcArm = foes.some(f => f && major.has((f.status as string | undefined) ?? ''));
  },

  // Heal after the user's damaging move resolves (Shell Bell timing)
  onAfterMoveSecondarySelfPriority: -1,
  onAfterMoveSecondarySelf(pokemon, _target, move) {
    if (!move || move.category === 'Status') { this.effectState.bcArm = false; return; }
    if (this.effectState.bcArm) {
      this.heal(pokemon.baseMaxhp / 8, pokemon);
      this.add('-activate', pokemon, 'item: Blood Charm');
    }
    this.effectState.bcArm = false; // reset for next move
  },
},



	scalefragment: {
		name: "Scale Fragment",
		shortDesc: "If at full HP, 35% less damage from attacks (Semi-Multiscale as an item).",
		gen: 9,
		onSourceModifyDamage(damage, source, target, move) {
			if (target?.hp === target?.maxhp && move.category !== 'Status') {
				this.debug('Scale Fragment weaken');
				return this.chainModify(0.65);
			}
		},
	},

	windchime: {
  name: "Wind Chime",
  shortDesc: "Immune to sound-based moves (Soundproof as an item).",
  gen: 9,

  onTryHit(target, source, move) {
    if (move?.flags?.sound) {
      this.add('-immune', target, '[from] item: Wind Chime');
      this.add('-message', `Wind Chime protects ${target.name} from sound moves!`);
      return null;
    }
  },

  // Also blocks Perish Song’s residual effect
  onAnyTryHit(target, source, move) {
    if (move?.flags?.sound && target === this.effectState.target) {
      this.add('-immune', target, '[from] item: Wind Chime');
      this.add('-message', `Wind Chime protects ${target.name} from sound moves!`);
      return null;
    }
  },
},


	luckypetal: {
		name: "Lucky Petal",
		shortDesc: "At <50% HP, the holder’s moves always crit.",
		gen: 9,
		onModifyMove(move, pokemon) {
			if (!move || move.category === 'Status') return;
			if (pokemon.hp * 2 < pokemon.maxhp) {
				move.willCrit = true;
				this.add('-activate', pokemon, 'item: Lucky Petal');
			}
		},
	},

	stormbracer: {
		name: "Storm Bracer",
		shortDesc: "In rain, Electric & Flying moves deal 1.5× damage.",
		gen: 9,
		onBasePower(basePower, user, target, move) {
			if (!move || move.category === 'Status') return;
			if ((move.type === 'Electric' || move.type === 'Flying') &&
				this.field.isWeather(['raindance', 'primordialsea'])) {
				this.debug('Storm Bracer boost');
				return this.chainModify(1.5);
			}
		},
	},

	prismpearl: {
  name: "Prism Pearl",
  shortDesc: "First damaging move each stay becomes 2-hit at 0.65× per hit. Resets on switch.",
  gen: 9,

  onStart(pokemon) {
    this.effectState.armed = true;       // re-armed on entry
    this.effectState.boosting = false;   // per-move flag
  },
  onAfterSwitchInSelf(pokemon) {
    this.effectState.armed = true;       // re-arm after every switch-in
    this.effectState.boosting = false;
  },

  onModifyMove(move, pokemon) {
    if (!move || move.category === 'Status') return;
    if (this.effectState.armed && !move.multihit) {
      move.multihit = 2;
      this.effectState.boosting = true;  // mark that THIS move should be 0.65× per hit
      this.add('-activate', pokemon, 'item: Prism Pearl');
    }
  },

  onBasePower(basePower, user, target, move) {
    // While boosting flag is set, each hit is 0.65×
    if (this.effectState.boosting) {
      return this.chainModify(0.65);
    }
  },

  onAfterMove(pokemon, target, move) {
    if (!move || move.category === 'Status') return;
    // consume after first damaging move of the stay
    if (this.effectState.armed) this.effectState.armed = false;
    // and stop boosting so the next turns aren’t affected
    if (this.effectState.boosting) this.effectState.boosting = false;
  },
},


	trickball: {
  name: "Trick Ball",
  shortDesc: "Once per battle, when hit by a damaging move, swap items with the attacker.",
  gen: 9,

  onDamagingHit(damage, target, source, move) {
    if (!source || !move || move.category === 'Status') return;

    const mem = (target.m ??= {} as any);
    if (mem.trickBallUsed) return; // already triggered this battle

    const tItem = target.getItem();
    const sItem = source.getItem();

    // Nothing to swap
    if (!tItem && !sItem) return;

    // Try to remove items (will fail automatically for untakeables)
    const tookT = tItem ? target.takeItem() : null;
    const tookS = sItem ? source.takeItem() : null;

    // If neither side could give up its item, bail
    if (!tookT && !tookS) return;

    // Attempt the actual swap; track success so we can roll back
    let okTarget = true;
    let okSource = true;
    if (tookS) okTarget = target.setItem(tookS);
    if (tookT) okSource = source.setItem(tookT);

    if (okTarget || okSource) {
      mem.trickBallUsed = true; // consume once-per-battle trigger only on successful activation

      this.add('-activate', target, 'item: Trick Ball');
      if (target.getItem()) {
        this.add('-item', target, target.getItem(), '[from] item: Trick Ball', '[of] ' + target);
      }
      if (source.getItem()) {
        this.add('-item', source, source.getItem(), '[from] item: Trick Ball', '[of] ' + target);
      }
    } else {
      // Roll back on failure
      if (tookT) target.setItem(tookT);
      if (tookS) source.setItem(tookS);
    }
  },
},


	rainbowcore: {
		name: "Rainbow Core",
		shortDesc: "First move of each type used by the holder gets 1.5× power.",
		gen: 9,
		onStart(pokemon) {
			pokemon.itemState.typesUsed = new Set<string>();
		},
		onModifyMove(move, pokemon) {
			if (!pokemon.itemState?.typesUsed) pokemon.itemState.typesUsed = new Set<string>();
		},
		onBasePower(basePower, user, target, move) {
			if (!move || move.category === 'Status') return;
			const used: Set<string> = (user.itemState.typesUsed ?? new Set());
			if (!used.has(move.type)) {
				(user.itemState.typesUsed as Set<string>).add(move.type);
				this.add('-activate', user, 'item: Rainbow Core', '[moveType]', move.type);
				return this.chainModify(1.4);
			}
		},
	},

	sandstone: {
		name: "Sandstone",
		shortDesc: "In sandstorm: heal 1/8 max HP each turn; incoming move accuracy vs holder is 0.8×.",
		gen: 9,
		onResidual(pokemon) {
			if (this.field.isWeather('sandstorm')) {
				this.heal(pokemon.baseMaxhp / 8, pokemon, pokemon);
				this.add('-activate', pokemon, 'item: Sandstone');
			}
		},
		// Sand Veil-like accuracy reduction against the holder
		onModifyAccuracy(accuracy, target, source, move) {
			if (!this.field.isWeather('sandstorm')) return;
			if (typeof accuracy === 'number') {
				this.debug('Sandstone evasion (accuracy down)');
				return this.chainModify(0.8);
			}
		},
	},

	mimicwand: {
  name: "Mimic Wand",
  shortDesc: "When hit by a damaging move, if the holder survives, immediately use it back at 45% power.",
  gen: 9,

  onDamagingHit(damage, target, source, move) {
    if (!source || !move || move.category === 'Status') return;
    if (move.isZ || move.isMax) return;

    // Do not trigger if the holder fainted from the hit
    if (target.fainted || target.hp <= 0) return;

    // Prevent recursion if this is already a Mimic Wand echo
    if ((move as any).mimicWandEcho) return;

    // Build a safe copy of the move and mark it as a Mimic Wand echo
    const moveCopy = this.dex.getActiveMove(move.id);
    (moveCopy as any).mimicWandEcho = true;

    // Scale numeric base power directly; otherwise flag to scale in BasePower hook
    if (typeof moveCopy.basePower === 'number' && moveCopy.basePower > 0) {
      moveCopy.basePower = Math.max(1, Math.floor(moveCopy.basePower * 0.45));
    } else {
      // Covers variable-BP / fixed-damage / OHKO style moves where BP isn't a number
      (moveCopy as any).mimicWandScale45 = true;
    }

    // Avoid interacting with other reflectors/counters
    (moveCopy as any).noCounter = true;

    this.add('-activate', target, 'item: Mimic Wand', '[of] ' + target);

    // Use the copied move: user = the holder (target), target option = original attacker (source)
    this.actions.useMove(moveCopy, target, {target: source});
  },

  onBasePower(basePower, user, target, move) {
    // Apply 0.45 scaling for echoed moves that couldn't be pre-scaled numerically
    if ((move as any)?.mimicWandScale45) {
      return this.chainModify(0.45);
    }
  },
},


	twilightmirror: {
  name: "Twilight Mirror",
  shortDesc: "When the holder is statused by a foe, the foe gets the same status.",
  gen: 9,

  onSetStatus(status, target, source, effect) {
    // Only reflect if a foe inflicted it, and it’s a major status
    if (!source || source === target) return;
    if (source.side === target.side) return;
    if (!status?.id) return;
    if (!['brn','par','slp','frz','psn','tox'].includes(status.id)) return;

    // Prevent ping-pong/recursion
    if ((this.effectState as any).reflecting) return;
    (this.effectState as any).reflecting = true;

    this.add('-activate', target, 'item: Twilight Mirror');

    // Mirror exactly (keep toxic vs regular poison)
    const mirrored = status.id === 'tox' ? 'tox' : status.id;
    source.trySetStatus(mirrored, target);

    (this.effectState as any).reflecting = false;
  },
},
orthwormite: {
  name: "Orthwormite",
  spritenum: 0,              // or your sprite index if you have one
  megaStone: "Orthworm-Mega",// target form id (must match pokedex entry)
  megaEvolves: "Orthworm",   // base species id
  itemUser: ["Orthworm"],    // for teambuilder UI
  onTakeItem: false,         // can’t be removed (like real mega stones)
  gen: 9,
},
relicanthite: {
	name: "Relicanthite",
	spritenum: 0,
	megaStone: "Relicanth-Mega",
	megaEvolves: "Relicanth",
	itemUser: ["Relicanth"],
	onTakeItem: false,
	gen: 9,
},
castformite: {
	name: "Castformite",
	spritenum: 0,
	megaStone: "Castform-Mega",
	megaEvolves: "Castform",
	itemUser: ["Castform"],
	onTakeItem: false,
	gen: 9,
},
oinkite: {
	name: "Oinkite",
	spritenum: 0,
	megaStone: "Oinkologne-Mega",
	megaEvolves: "Oinkologne",
	itemUser: ["Oinkologne"],
	onTakeItem: false,
	gen: 9
},
  // Team A
  embercoreshard: {
    name: "Embercore Shard",
    shortDesc: "Fire moves 1.5x power if holder is at <50% HP.",
    onBasePower(basePower, user, target, move) {
      if (move.type === 'Fire' && user.hp <= user.maxhp / 2) {
        return this.chainModify(1.5);
      }
    },
  },

  crystaltiara: {
    name: "Crystal Tiara",
    shortDesc: "Fairy moves 1.2x power; prevents the holder's stats from being lowered by opposing Pokémon.",
    gen: 9,

    // Power boost remains straightforward
    onBasePower(basePower, user, target, move) {
        if (move.type === 'Fairy') return this.chainModify(1.2);
    },

    // --- Core functionality: PREVENT stat drops ---
    onTryBoost(boost, target, source, effect) {
        // Only block drops caused by an opponent's move or ability.
        // Drops from self (e.g., Close Combat, abilities like Contrary, or self-inflicted confusion) are allowed.
        if (target.side === source?.side) {
            return;
        }

        // Iterate through the stat boosts that are about to be applied
        let B: BoostID;
        let showMessage = false;
        const negatedBoosts: SparseBoostsTable = {};

        for (B in boost) {
            // Check if the boost is a stat drop (negative value)
            if (boost[B]! < 0) {
                // If it's a drop, negate it by setting it to 0
                negatedBoosts[B] = 0;
                showMessage = true;
            } else {
                // Keep positive boosts (e.g., the opponent used Coil, and this would boost their stats)
                negatedBoosts[B] = boost[B]!;
            }
        }
        
        // If we negated any drops, apply the new, modified boosts and display the message
        if (showMessage) {
            // We use target.setBoost and return true to inform the game that the boost attempt was handled.
            // setBoost(negatedBoosts) will apply all the non-negated boosts
            target.setBoost(negatedBoosts);
            this.add('-block', target, 'item: Crystal Tiara', '[of] ' + target);
            return null; // Return null to prevent the original boost from applying (already applied the modified one)
        }
    },
    
    // The previous complex White Herb-style code is no longer needed
},

//ChatGPT code if the Gemini code doesn't work
/*
crystaltiara: {
    name: "Crystal Tiara",
    shortDesc: "Fairy moves 1.2× power; immediately clears any negative stat drops on the holder.",
    gen: 9,

    // Fairy damage boost
    onBasePower(basePower, user, target, move) {
      if (move.type === 'Fairy') return this.chainModify(1.2);
    },

    // White Herb–style periodic sweep, but non-consumable
    // (Runs at the start and then every tick; keeps holder from having negative stages.)
    onStart(pokemon) {
      if (!pokemon?.hp) return;
      let changed = false;
      const boosts: SparseBoostsTable = {};
      let s: BoostID;
      for (s in pokemon.boosts) {
        if (pokemon.boosts[s] < 0) {
          boosts[s] = 0;
          changed = true;
        }
      }
      if (changed) {
        pokemon.setBoost(boosts);
        this.add('-clearnegativeboost', pokemon, '[silent]');
        this.add('-block', pokemon, 'item: Crystal Tiara', '[from] Crystal Tiara prevents stat drop');
      }
    },

    // Keep rechecking like Sitrus/White Herb do
    onUpdate(pokemon) {
      if (!pokemon?.hp) return;
      let changed = false;
      const boosts: SparseBoostsTable = {};
      let s: BoostID;
      for (s in pokemon.boosts) {
        if (pokemon.boosts[s] < 0) {
          boosts[s] = 0;
          changed = true;
        }
      }
      if (changed) {
        pokemon.setBoost(boosts);
        this.add('-clearnegativeboost', pokemon, '[silent]');
        this.add('-block', pokemon, 'item: Crystal Tiara', '[from] Crystal Tiara prevents stat drop');
      }
    },
  },
   */


  ironrootcore: {
  name: "Ironroot Core",
  shortDesc: "When holder first falls to ≤50% HP, it consumes itself: +1 Atk/Def.",
  gen: 9,

  // Sitrus-style threshold check
  onUpdate(pokemon) {
    if (!pokemon.hp) return;

    // First time at or below 50%: consume and boost.
    if (pokemon.hp <= Math.floor(pokemon.maxhp / 2)) {
      if (pokemon.useItem()) {
        this.add('-activate', pokemon, 'item: Ironroot Core');
        this.boost({atk: 1, def: 1}, pokemon);
      }
    }
  },
},


  galependant: {
    name: "Gale Pendant",
    shortDesc: "First Flying move used each battle has 2x power.",
    onStart(pokemon) {
      pokemon.addVolatile('galependant');
    },
    condition: {
      onBasePower(basePower, attacker, defender, move) {
        if (move.type === 'Flying') {
          this.debug('Gale Pendant boost');
          attacker.removeVolatile('galependant');
          return this.chainModify(2);
        }
      },
    },
  },

  mindwaveorb: {
  name: "Mindwave Orb",
  shortDesc: "Psychic moves 1.3x power; after using a non-Status Psychic move, user -1 Def.",
  onBasePower(basePower, user, target, move) {
    if (move?.type === 'Psychic' && move.category !== 'Status') {
      return this.chainModify(1.3);
    }
  },
  onAfterMove(source, target, move) {
    if (!move) return;
    if (move.type === 'Psychic' && move.category !== 'Status') {
      this.boost({def: -1}, source);
    }
  },
},

  petalbrandgauntlet: {
  name: "Petalbrand Gauntlet",
  shortDesc: "Grass & Fighting moves deal 1/8 chip to foes after damage. If user targets itself, it heals 1/8 HP.",
  onAfterMove(source, target, move) {
    // Only run if the move has a target and is a Grass/Fighting damaging move
    if (!move || move.category === 'Status') return;
    if (!target || !target.hp) return;
    if (!['Grass', 'Fighting'].includes(move.type)) return;

    // If user targeted itself, heal instead of dealing damage
    if (target === source) {
      const healAmount = Math.floor(source.baseMaxhp / 8);
      this.heal(healAmount, source, source, move);
      this.add('-message', `${source.name} absorbed energy from the Petalbrand Gauntlet!`);
    } else {
      const dmg = Math.floor(target.baseMaxhp / 8);
      this.damage(dmg, target, source, move);
      this.add('-message', `${target.name} was hurt by Petalbrand Gauntlet!`);
    }
  },
},

  // Team B
  blackwingtalisman: {
    name: "Blackwing Talisman",
    shortDesc: "Dark & Flying moves 1.2x power.",
    onBasePower(basePower, user, target, move) {
      if (['Dark', 'Flying'].includes(move.type)) {
        return this.chainModify(1.2);
      }
    },
  },

  acidfangbrooch: {
    name: "Acidfang Brooch",
    shortDesc: "First Poison move each battle has 2x power.",
    onStart(pokemon) {
      pokemon.addVolatile('acidfangbrooch');
    },
    condition: {
      onBasePower(basePower, attacker, defender, move) {
        if (move.type === 'Poison') {
          attacker.removeVolatile('acidfangbrooch');
          return this.chainModify(2);
        }
      },
    },
  },

  witherseedrelic: {
    name: "Witherseed Relic",
    shortDesc: "Grass moves heal the user by 25% of damage dealt.",
    onModifyMove(move) {
      if (move.type === 'Grass' && move.drain) {
        move.drain[0] += 1; // increase drain from e.g. 1/2 to 3/4
      } else if (move.type === 'Grass') {
        move.drain = [1, 4]; // add 25% drain
      }
    },
  },

  obsidianclaw: {
  name: "Obsidian Claw",
  shortDesc: "Steel-type moves ignore Protect and Substitute.",
  onModifyMove(move) {
    if (move.type === 'Steel') {
      move.breaksProtect = true;  // hit through Protect/Detect/Spiky Shield (still blocked by Max Guard)
      move.infiltrates = true;    // bypass Substitute and screens
    }
  },
},

  cursedlantern: {
  name: "Cursed Lantern",
  shortDesc: "When holder hits with a Fire move: target gains Ghost type for 3 turns.",
  onSourceHit(target, source, move) {
    if (!target || !target.hp) return;
    if (!move || move.category === 'Status') return;
    if (move.type !== 'Fire') return;

    // only apply once and skip if Ghost already present
    if (target.hasType('Ghost') || target.volatiles['cursedlantern']) return;

    // snapshot BEFORE changing types
    const prevTypes = target.getTypes();

    // add Ghost (like Trick-or-Treat)
    const added = target.addType('Ghost');
    if (!added) return;

    // show banner immediately
    this.add('-start', target, 'typeadd', 'Ghost', '[from] item: Cursed Lantern');

    // attach volatile and store snapshot (cast silences TS)
    target.addVolatile('cursedlantern');
    (target.volatiles['cursedlantern'] as any).prevTypes = prevTypes;

    this.add('-message', `${target.name} is haunted by Cursed Lantern!`);
  },

  condition: {
    // activation turn counts
    duration: 3,

    onEnd(pokemon) {
      const prev: string[] | undefined =
        (this.effectState as any)?.prevTypes;

      if (prev && prev.length) {
        pokemon.setType(prev);
        // refresh banner to exact previous typing
        this.add('-start', pokemon, 'typechange', prev.join('/'), '[silent]');
      } else {
        const base = pokemon.baseSpecies.types;
        pokemon.setType(base);
        this.add('-start', pokemon, 'typechange', base.join('/'), '[silent]');
      }

      this.add('-message', `${pokemon.name} is no longer haunted.`);
    },
  },
},



  carapacegauntlet: {
    name: "Carapace Gauntlet",
    shortDesc: "Contact moves vs holder inflict Bleed",
    onDamagingHit(damage, target, source, move) {
      if (move.flags['contact'] && source.hp) {
        source.addVolatile('bleeding');
        this.add('-message', `${source.name} was afflicted with bleeding!`);
      }
    },
  },


// === Item ===
mysterybox: {
  name: "Mystery Box",
  shortDesc:
    "Each turn emulates a random item (Band/Specs/Scarf, Life Orb, Leftovers, Expert Belt, Muscle Band, Wise Glasses, Rocky Helmet, Assault Vest, Sitrus, Lum, Focus Sash, Custap, Weakness Policy).",

  // Pick first emulation on switch-in
  onStart(pokemon) {
    mbPickNew(this, pokemon);
  },

  // One consolidated residual hook:
  //  - apply Leftovers heal for the *current* emulation
  //  - rotate to a new emulation for next turn
  onResidualOrder: 28,
  onResidualSubOrder: 1,
  onResidual(pokemon) {
    if (!pokemon.hp) return;
    const slot = mbGetSlot(this, pokemon);
    slot.battleUsed ||= {};
    slot.state ||= {};
    const id = slot.id;

    // Leftovers heal (current emulation) before we rotate
    if (id === 'leftovers' && pokemon.hp < pokemon.maxhp) {
      this.heal(
        this.clampIntRange(Math.floor(pokemon.baseMaxhp / 16), 1),
        pokemon,
        pokemon,
        this.dex.items.get('leftovers')
      );
    }

    // Rotate emulation for next turn
    mbPickNew(this, pokemon);
  },

  // Custap Berry (once per battle): +0.1 priority WHEN ORDER IS CALCULATED
  // Do NOT "prime" in residual; that timing is unreliable for action order.
  onFractionalPriority(_priority, pokemon, _target, move) {
    if (!move) return;

    const slot = mbGetSlot(this, pokemon);
    slot.battleUsed ||= {};
    slot.state ||= {};

    // Only if we're currently emulating Custap
    if (slot.id !== 'custapberry') return;

    // Once per battle per Pokemon
    if (slot.battleUsed['custapberry']) return;

    // HP gate
    if (pokemon.hp > Math.floor(pokemon.maxhp / 4)) return;

    // Optional: keep berry-blocking behavior (Unnerve/Embargo/etc) if your helper supports it.
    // IMPORTANT: mbTryEatBerry must be emulation-aware (i.e. not require the actual held item to be a berry),
    // otherwise it will always fail for Mystery Box.
    if (typeof mbTryEatBerry === 'function' && !mbTryEatBerry(this, pokemon)) return;

    slot.battleUsed['custapberry'] = true;
    this.add('-activate', pokemon, 'item: Mystery Box', '[emulating] Custap Berry');
    return 0.1;
  },

  // Choice multipliers (no lock)
  onModifyAtk(atk, source) {
    const id = mbGetSlot(this, source).id;
    if (id === 'choiceband') return this.chainModify(1.5);
  },
  onModifySpA(spa, source) {
    const id = mbGetSlot(this, source).id;
    if (id === 'choicespecs') return this.chainModify(1.5);
  },
  onModifySpe(spe, source) {
    const id = mbGetSlot(this, source).id;
    if (id === 'choicescarf') return this.chainModify(1.5);
  },

  // Prevent choosing Status moves when emulating Assault Vest (UI + server)
  onDisableMove(pokemon) {
    const id = mbGetSlot(this, pokemon).id;
    if (id !== 'assaultvest') return;
    for (const slot of pokemon.moveSlots) {
      const mv = this.dex.moves.get(slot.id);
      if (mv.category === 'Status') {
        pokemon.disableMove(mv.id as ID, true, this.effect);
      }
    }
  },

  // Assault Vest: block Status moves
  onTryMove(source, _target, move) {
    const id = mbGetSlot(this, source).id;
    if (id === 'assaultvest' && move?.category === 'Status') {
      this.add('-fail', source, 'item: Mystery Box', '[emulating] Assault Vest');
      return false;
    }
  },

  // Life Orb / Expert Belt / Bands / Glasses
  onBasePower(basePower, source, target, move) {
    const id = mbGetSlot(this, source).id;
    if (!id || move?.category === 'Status') return;

    if (id === 'lifeorb') return this.chainModify(1.3);
    if (id === 'expertbelt' && this.dex.getEffectiveness(move.type, target) > 0) {
      return this.chainModify(1.2);
    }
    if (id === 'muscleband' && move.category === 'Physical') return this.chainModify(1.1);
    if (id === 'wiseglasses' && move.category === 'Special') return this.chainModify(1.1);
  },

  // Life Orb recoil
  onAfterMove(source, _target, move) {
    if (!move || move.category === 'Status') return;
    const id = mbGetSlot(this, source).id;
    if (id === 'lifeorb' && (move.totalDamage || move.hit > 0)) {
      this.damage(
        this.clampIntRange(Math.floor(source.baseMaxhp / 10), 1),
        source,
        source,
        this.dex.items.get('lifeorb')
      );
    }
  },

  // Single combined onDamagingHit:
  //  - Weakness Policy (+2 Atk/SpA once on SE hit)
  //  - Rocky Helmet (1/6 on contact)
  onDamagingHit(_damage, target, source, move) {
    const slot = mbGetSlot(this, target);
    slot.battleUsed ||= {};
    const id = slot.id;
    if (!move) return;

    // Weakness Policy
    if (id === 'weaknesspolicy' && !slot.battleUsed['weaknesspolicy']) {
      if (move.category !== 'Status' && this.dex.getEffectiveness(move.type, target) > 0) {
        this.add('-activate', target, 'item: Mystery Box', '[emulating] Weakness Policy');
        this.boost({atk: 2, spa: 2}, target, target, this.dex.items.get('weaknesspolicy'));
        slot.battleUsed['weaknesspolicy'] = true;
      }
    }

    // Rocky Helmet
    if (id === 'rockyhelmet' && move.flags?.contact && source && !source.fainted) {
      this.damage(
        this.clampIntRange(Math.floor(source.baseMaxhp / 6), 1),
        source,
        target,
        this.dex.items.get('rockyhelmet')
      );
    }
  },

  // Focus Sash (once per battle)
  onDamage(damage, target, _source, effect) {
    const slot = mbGetSlot(this, target);
    slot.battleUsed ||= {};
    if (slot.id !== 'focussash') return;
    if (slot.battleUsed['focussash']) return;
    if (!effect || effect.effectType !== 'Move') return;
    if (target.hp < target.maxhp) return;
    if (damage < target.hp) return;
    this.add('-activate', target, 'item: Mystery Box', '[emulating] Focus Sash');
    slot.battleUsed['focussash'] = true;
    return target.hp - 1;
  },
// Sitrus Berry (≤ 1/2 HP, once per battle)
// Lum Berry (major status OR existing confusion, once per battle)
// NOTE: Must be a single onUpdate hook.
onUpdate(pokemon) {
  const slot = mbGetSlot(this, pokemon);
  slot.battleUsed ||= {};

  // -------------------------
  // Sitrus Berry trigger
  // -------------------------
  if (slot.id === 'sitrusberry' && !slot.battleUsed['sitrusberry']) {
    if (pokemon.hp && pokemon.hp <= Math.floor(pokemon.maxhp / 2)) {
      if (typeof mbTryEatBerry !== 'function' || mbTryEatBerry(this, pokemon)) {
        this.heal(
          this.clampIntRange(Math.floor(pokemon.baseMaxhp / 4), 1),
          pokemon,
          pokemon,
          this.dex.items.get('sitrusberry')
        );
        this.add('-activate', pokemon, 'item: Mystery Box', '[emulating] Sitrus Berry');
        slot.battleUsed['sitrusberry'] = true;
      }
    }
  }

  // -------------------------
  // Lum Berry trigger
  // (cures existing major status or clears existing confusion)
  // -------------------------
  if (slot.id === 'lumberry' && !slot.battleUsed['lumberry']) {
    const hasStatus = !!pokemon.status;
    const hasConfusion = !!pokemon.volatiles?.confusion;

    if (hasStatus || hasConfusion) {
      if (typeof mbTryEatBerry !== 'function' || mbTryEatBerry(this, pokemon)) {
        this.add('-activate', pokemon, 'item: Mystery Box', '[emulating] Lum Berry');
        if (hasStatus) pokemon.cureStatus();
        if (hasConfusion) pokemon.removeVolatile('confusion');
        slot.battleUsed['lumberry'] = true;
      }
    }
  }
},

// Lum Berry: block confusion application (once per battle)
onTryAddVolatile(sta, target) {
  if (sta.id !== 'confusion') return;
  const slot = mbGetSlot(this, target);
  slot.battleUsed ||= {};
  if (slot.id !== 'lumberry') return;
  if (slot.battleUsed['lumberry']) return;

  if (typeof mbTryEatBerry === 'function' && !mbTryEatBerry(this, target)) return;

  this.add('-activate', target, 'item: Mystery Box', '[emulating] Lum Berry');
  slot.battleUsed['lumberry'] = true;
  return null; // block confusion
},

},


torkoalite: {
	name: "Torkoalite",
	spritenum: 0,
	megaStone: "Torkoal-Mega",
	megaEvolves: "Torkoal",
	itemUser: ["Torkoal"],
	onTakeItem: false,
	gen: 9
},
brutebonnetite: {
	name: "Brutebonnetite",
	spritenum: 0,
	megaStone: "Brute Bonnet-Mega",
	megaEvolves: "Brute Bonnet",
	itemUser: ["Brute Bonnet"],
	onTakeItem: false,
	gen: 9
},

electricrod: {
	name: "Electric Rod",
	shortDesc: "Absorbs the first Electric-type move that hits the holder, then is consumed.",
	onTryHit(target, source, move) {
		if (!target || target.fainted) return;
		if (!move || move.type !== 'Electric') return;

		// Don't block self-targeting moves, if any exist
		if (move.target === 'self') return;

		this.add('-immune', target, '[from] item: Lightning Rod');
		target.useItem();
		return null;
	},
},
unstablespecs: {
	name: "Unstable Specs",
	shortDesc: "SpA is 1.75x, but successful damaging moves deal recoil equal to 50% of damage dealt.",
	onModifySpA(spa) {
		return this.chainModify([7168, 4096]); // 1.75x
	},
	onAfterMoveSecondarySelf(source, target, move) {
		// Mirror Life Orb guards (but we do NOT care if target fainted)
		if (!source || !move || move.category === 'Status' || source.forceSwitchFlag) return;
		if (source === target) return;

		// Damage just dealt by the move
		const dealt = ((move as any).totalDamage ?? this.lastDamage) as number;
		if (!dealt || dealt <= 0) return;

		const recoil = Math.max(1, Math.floor(dealt / 2));
		this.damage(recoil, source, source, this.dex.items.get('unstablespecs'));
	},
},

unstableband: {
	name: "Unstable Band",
	shortDesc: "Atk is 1.75x, but successful damaging moves deal recoil equal to 50% of damage dealt.",
	onModifyAtk(atk) {
		return this.chainModify([7168, 4096]); // 1.75x
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!source || !move || move.category === 'Status' || source.forceSwitchFlag) return;
		if (source === target) return;

		const dealt = ((move as any).totalDamage ?? this.lastDamage) as number;
		if (!dealt || dealt <= 0) return;

		const recoil = Math.max(1, Math.floor(dealt / 2));
		this.damage(recoil, source, source, this.dex.items.get('unstableband'));
	},
},

unstablescarf: {
	name: "Unstable Scarf",
	shortDesc: "Spe is 1.75x, but successful damaging moves deal recoil equal to 50% of damage dealt.",
	onModifySpe(spe) {
		return this.chainModify([7168, 4096]); // 1.75x
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!source || !move || move.category === 'Status' || source.forceSwitchFlag) return;
		if (source === target) return;

		const dealt = ((move as any).totalDamage ?? this.lastDamage) as number;
		if (!dealt || dealt <= 0) return;

		const recoil = Math.max(1, Math.floor(dealt / 2));
		this.damage(recoil, source, source, this.dex.items.get('unstablescarf'));
	},
},


explosiveorb: {
	name: "Explosive Orb",
	shortDesc: "2x power, but after an attacking move hits, the user loses 50% of its max HP.",
	fling: {basePower: 30},

	onModifyDamage(damage, source, target, move) {
		// 2.0x
		return this.chainModify(2);
	},

	onAfterMoveSecondarySelf(source, target, move) {
		// Mirror Life Orb timing/guards exactly
		if (source && source !== target && move && move.category !== 'Status' && !source.forceSwitchFlag) {
			this.damage(source.baseMaxhp / 2, source, source, this.dex.items.get('explosiveorb'));
		}
	},
},

grassypill: {
	name: "Grassy Pill",
	shortDesc: "On switch-in, consumes to set Grassy Terrain.",
	onStart(pokemon) {
		if (!pokemon.isActive) return;
		if (this.field.setTerrain('grassyterrain', pokemon, this.effect)) {
			pokemon.eatItem();
		}
	},
},

mistypill: {
	name: "Misty Pill",
	shortDesc: "On switch-in, consumes to set Misty Terrain.",
	onStart(pokemon) {
		if (!pokemon.isActive) return;
		if (this.field.setTerrain('mistyterrain', pokemon, this.effect)) {
			pokemon.eatItem();
		}
	},
},

electricpill: {
	name: "Electric Pill",
	shortDesc: "On switch-in, consumes to set Electric Terrain.",
	onStart(pokemon) {
		if (!pokemon.isActive) return;
		if (this.field.setTerrain('electricterrain', pokemon, this.effect)) {
			pokemon.eatItem();
		}
	},
},

psychicpill: {
	name: "Psychic Pill",
	shortDesc: "On switch-in, consumes to set Psychic Terrain.",
	onStart(pokemon) {
		if (!pokemon.isActive) return;
		if (this.field.setTerrain('psychicterrain', pokemon, this.effect)) {
			pokemon.eatItem();
		}
	},
},

darkpill: {
	name: "Dark Pill",
	shortDesc: "On switch-in, consumes to set Dark Terrain.",
	onStart(pokemon) {
		if (!pokemon.isActive) return;
		// Assumes you already implemented 'darkterrain' as a real terrain id in your mod
		if (this.field.setTerrain('darkterrain', pokemon, this.effect)) {
			pokemon.eatItem();
		}
	},
},

choicesash: {
	name: "Choice Sash",
	shortDesc: "Survive one KO hit once; while held, you're choice-locked.",

	// Match Choice items: never add choicelock on switch-in (activeMove can be null)
	onStart(pokemon) {
		if (pokemon.volatiles['choicelock']) this.debug('removing choicelock');
		pokemon.removeVolatile('choicelock');
	},
	onModifyMove(move, pokemon) {
		pokemon.addVolatile('choicelock');
	},
	isChoice: true,

	// Survive one damaging move that would KO, at any HP
	onDamage(damage, target, source, effect) {
		if (!damage) return;
		if (damage < target.hp) return;

		// Only from damaging MOVES (not hazards/poison/weather/etc.)
		if (!effect || (effect as any).effectType !== 'Move') return;
		const move = effect as any;
		if (move.category === 'Status') return;

		// If already at 1 HP, can't save you
		if (target.hp <= 1) return;

		this.add('-activate', target, 'item: Choice Sash');
		// prevent KO: set damage to leave you at 1
		target.useItem(); // <-- correct for non-berries in your fork
		return target.hp - 1;
	},
},


}
const MYSTERY_BOX_POOL: string[] = [
  'choiceband', 'choicespecs', 'choicescarf',
  'lifeorb', 'leftovers', 'expertbelt', 'muscleband', 'wiseglasses',
  'rockyhelmet', 'assaultvest',
  'sitrusberry', 'lumberry', 'focussash', 'custapberry', 'weaknesspolicy',
];

function mbGetSlot(battle: Battle, pokemon: Pokemon) {
  (pokemon as any).m ??= {};
  (pokemon as any).m.mysterybox ??= { id: '', state: {}, battleUsed: {} as Record<string, boolean> };
  return (pokemon as any).m.mysterybox as { id: string; state: any; battleUsed: Record<string, boolean> };
}

function mbPickNew(battle: Battle, pokemon: Pokemon) {
  const slot = mbGetSlot(battle, pokemon);
  slot.id = battle.sample(MYSTERY_BOX_POOL);
  slot.state = {}; // reset per-turn state
  const nice = battle.dex.items.get(slot.id).name || slot.id;
  battle.add('-message', `${pokemon.name}'s Mystery Box emulates ${nice}!`);
}

function mbTryEatBerry(battle: Battle, pokemon: Pokemon) {
  // Respect Unnerve etc., same gate vanilla berries use
  return battle.runEvent('TryEatItem', pokemon) !== false;
}