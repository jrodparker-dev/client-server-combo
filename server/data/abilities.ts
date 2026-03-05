/*

Ratings and how they work:

-1: Detrimental
	  An ability that severely harms the user.
	ex. Defeatist, Slow Start

 0: Useless
	  An ability with no overall benefit in a singles battle.
	ex. Color Change, Plus

 1: Ineffective
	  An ability that has minimal effect or is only useful in niche situations.
	ex. Light Metal, Suction Cups

 2: Useful
	  An ability that can be generally useful.
	ex. Flame Body, Overcoat

 3: Effective
	  An ability with a strong effect on the user or foe.
	ex. Chlorophyll, Sturdy

 4: Very useful
	  One of the more popular abilities. It requires minimal support to be effective.
	ex. Adaptability, Magic Bounce

 5: Essential
	  The sort of ability that defines metagames.
	ex. Imposter, Shadow Tag

*/

export const Abilities: import('../sim/dex-abilities').AbilityDataTable = {
	noability: {
		isNonstandard: "Past",
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "No Ability",
		rating: 0.1,
		num: 0,
	},
	adaptability: {
		onModifySTAB(stab, source, target, move) {
			if (move.forceSTAB || source.hasType(move.type)) {
				if (stab === 2) {
					return 2.25;
				}
				return 2;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Adaptability",
		rating: 4,
		num: 91,
	},
	aerilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Flying';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Aerilate",
		rating: 4,
		num: 184,
	},
	aftermath: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 4, source, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Aftermath",
		rating: 2,
		num: 106,
	},
	airlock: {
		onSwitchIn(pokemon) {
			// Air Lock does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Air Lock');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		
flags: {},
		name: "Air Lock",
		rating: 1.5,
		num: 76,
	},
	analytic: {
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon) {
			let boosted = true;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (this.queue.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Analytic",
		rating: 2.5,
		num: 148,
	},
	angerpoint: {
		onHit(target, source, move) {
			if (!target.hp) return;
			if (move?.effectType === 'Move' && target.getMoveHitData(move).crit) {
				this.boost({ atk: 12 }, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Anger Point",
		rating: 1,
		num: 83,
	},
	angershell: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedAngerShell = false;
			} else {
				this.effectState.checkedAngerShell = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedAngerShell;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedAngerShell = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ atk: 1, spa: 1, spe: 1, def: -1, spd: -1 }, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Anger Shell",
		rating: 3,
		num: 271,
	},
	anticipation: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					if (move.category === 'Status') continue;
					const moveType = move.id === 'hiddenpower' ? target.hpType : move.type;
					if (
						this.dex.getImmunity(moveType, pokemon) && this.dex.getEffectiveness(moveType, pokemon) > 0 ||
						move.ohko
					) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
		
flags: {},
		name: "Anticipation",
		rating: 0.5,
		num: 107,
	},
	arenatrap: {
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.isAdjacent(this.effectState.target)) return;
			if (pokemon.isGrounded()) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (pokemon.isGrounded(!pokemon.knownType)) { // Negate immunity if the type is unknown
				pokemon.maybeTrapped = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Arena Trap",
		rating: 5,
		num: 71,
	},
	armortail: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const armorTailHolder = this.effectState.target;
			if ((source.isAlly(armorTailHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', armorTailHolder, 'ability: Armor Tail', move, `[of] ${target}`);
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Armor Tail",
		rating: 2.5,
		num: 296,
	},
	aromaveil: {
		onAllyTryAddVolatile(status, target, source, effect) {
			if (['attract', 'disable', 'encore', 'healblock', 'taunt', 'torment'].includes(status.id)) {
				if (effect.effectType === 'Move') {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Aroma Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Aroma Veil",
		rating: 2,
		num: 165,
	},
	asoneglastrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source, source, this.dex.abilities.get('chillingneigh'));
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "As One (Glastrier)",
		rating: 3.5,
		num: 266,
	},
	asonespectrier: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'As One');
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spa: length }, source, source, this.dex.abilities.get('grimneigh'));
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "As One (Spectrier)",
		rating: 3.5,
		num: 267,
	},
	aurabreak: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Aura Break');
		},
		onAnyTryPrimaryHit(target, source, move) {
			if (target === source || move.category === 'Status') return;
			move.hasAuraBreak = true;
		},
		
flags: { breakable: 1 },
		name: "Aura Break",
		rating: 1,
		num: 188,
	},
	baddreams: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (!pokemon.hp) return;
			for (const target of pokemon.foes()) {
				if (target.status === 'slp' || target.hasAbility('comatose')) {
					this.damage(target.baseMaxhp / 8, target, pokemon);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Bad Dreams",
		rating: 1.5,
		num: 123,
	},
	ballfetch: {
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Ball Fetch",
		rating: 0,
		num: 237,
	},
	battery: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (attacker !== this.effectState.target && move.category === 'Special') {
				this.debug('Battery boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Battery",
		rating: 0,
		num: 217,
	},
	battlearmor: {
		onCriticalHit: false,
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Battle Armor",
		rating: 1,
		num: 4,
	},
	battlebond: {
		onSourceAfterFaint(length, target, source, effect) {
			if (source.bondTriggered) return;
			if (effect?.effectType !== 'Move') return;
			if (source.species.id === 'greninjabond' && source.hp && !source.transformed && source.side.foePokemonLeft()) {
				this.boost({ atk: 1, spa: 1, spe: 1 }, source, source, this.effect);
				this.add('-activate', source, 'ability: Battle Bond');
				source.bondTriggered = true;
			}
		},
		onModifyMovePriority: -1,
		onModifyMove(move, attacker) {
			if (move.id === 'watershuriken' && attacker.species.name === 'Greninja-Ash' &&
				!attacker.transformed) {
				move.multihit = 3;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Battle Bond",
		rating: 3.5,
		num: 210,
	},
	beadsofruin: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Beads of Ruin');
		},
		onAnyModifySpD(spd, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Beads of Ruin')) return;
			if (!move.ruinedSpD?.hasAbility('Beads of Ruin')) move.ruinedSpD = abilityHolder;
			if (move.ruinedSpD !== abilityHolder) return;
			this.debug('Beads of Ruin SpD drop');
			return this.chainModify(0.75);
		},
		
flags: {},
		name: "Beads of Ruin",
		rating: 4.5,
		num: 284,
	},
	beastboost: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				const bestStat = source.getBestStat(true, true);
				this.boost({ [bestStat]: length }, source);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Beast Boost",
		rating: 3.5,
		num: 224,
	},
	berserk: {
		onDamage(damage, target, source, effect) {
			if (
				effect.effectType === "Move" &&
				!effect.multihit &&
				!(effect.hasSheerForce && source.hasAbility('sheerforce'))
			) {
				this.effectState.checkedBerserk = false;
			} else {
				this.effectState.checkedBerserk = true;
			}
		},
		onTryEatItem(item) {
			const healingItems = [
				'aguavberry', 'enigmaberry', 'figyberry', 'iapapaberry', 'magoberry', 'sitrusberry', 'wikiberry', 'oranberry', 'berryjuice',
			];
			if (healingItems.includes(item.id)) {
				return this.effectState.checkedBerserk;
			}
			return true;
		},
		onAfterMoveSecondary(target, source, move) {
			this.effectState.checkedBerserk = true;
			if (!source || source === target || !target.hp || !move.totalDamage) return;
			const lastAttackedBy = target.getLastAttackedBy();
			if (!lastAttackedBy) return;
			const damage = move.multihit && !move.smartTarget ? move.totalDamage : lastAttackedBy.damage;
			if (target.hp <= target.maxhp / 2 && target.hp + damage > target.maxhp / 2) {
				this.boost({ spa: 1 }, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Berserk",
		rating: 2,
		num: 201,
	},
	bigpecks: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.def && boost.def < 0) {
				delete boost.def;
				if (!(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
					this.add("-fail", target, "unboost", "Defense", "[from] ability: Big Pecks", `[of] ${target}`);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Big Pecks",
		rating: 0.5,
		num: 145,
	},
	blaze: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Blaze boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Blaze",
		rating: 2,
		num: 66,
	},
	bulletproof: {
		onTryHit(pokemon, target, move) {
			if (move.flags['bullet']) {
				this.add('-immune', pokemon, '[from] ability: Bulletproof');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Bulletproof",
		rating: 3,
		num: 171,
	},
	cheekpouch: {
		onEatItem(item, pokemon) {
			this.heal(pokemon.baseMaxhp / 3);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Cheek Pouch",
		rating: 2,
		num: 167,
	},
	chillingneigh: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Chilling Neigh",
		rating: 3,
		num: 264,
	},
	chlorophyll: {
		onModifySpe(spe, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Chlorophyll",
		rating: 3,
		num: 34,
	},
	clearbody: {
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
				this.add("-fail", target, "unboost", "[from] ability: Clear Body", `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Clear Body",
		rating: 2,
		num: 29,
	},
	cloudnine: {
		onSwitchIn(pokemon) {
			// Cloud Nine does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			this.add('-ability', pokemon, 'Cloud Nine');
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, pokemon);
		},
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.abilityState.ending = false; // Clear the ending flag
			this.eachEvent('WeatherChange', this.effect);
		},
		onEnd(pokemon) {
			pokemon.abilityState.ending = true;
			this.eachEvent('WeatherChange', this.effect);
		},
		suppressWeather: true,
		
flags: {},
		name: "Cloud Nine",
		rating: 1.5,
		num: 13,
	},
	colorchange: {
		onAfterMoveSecondary(target, source, move) {
			if (!target.hp) return;
			const type = move.type;
			if (
				target.isActive && move.effectType === 'Move' && move.category !== 'Status' &&
				type !== '???' && !target.hasType(type)
			) {
				if (!target.setType(type)) return false;
				this.add('-start', target, 'typechange', type, '[from] ability: Color Change');

				if (target.side.active.length === 2 && target.position === 1) {
					// Curse Glitch
					const action = this.queue.willMove(target);
					if (action && action.move.id === 'curse') {
						action.targetLoc = -1;
					}
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Color Change",
		rating: 0,
		num: 16,
	},
	comatose: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Comatose');
		},
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Comatose');
			}
			return false;
		},
		// Permanent sleep "status" implemented in the relevant sleep-checking effects
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Comatose",
		rating: 4,
		num: 213,
	},
	commander: {
		onAnySwitchInPriority: -2,
		onAnySwitchIn() {
			((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			((this.effect as any).onUpdate as (p: Pokemon) => void).call(this, pokemon);
		},
		onUpdate(pokemon) {
			if (this.gameType !== 'doubles') return;
			// don't run between when a Pokemon switches in and the resulting onSwitchIn event
			if (this.queue.peek()?.choice === 'runSwitch') return;

			const ally = pokemon.allies()[0];
			if (pokemon.switchFlag || ally?.switchFlag) return;
			if (!ally || pokemon.baseSpecies.baseSpecies !== 'Tatsugiri' || ally.baseSpecies.baseSpecies !== 'Dondozo') {
				// Handle any edge cases
				if (pokemon.getVolatile('commanding')) pokemon.removeVolatile('commanding');
				return;
			}

			if (!pokemon.getVolatile('commanding')) {
				// If Dondozo already was commanded this fails
				if (ally.getVolatile('commanded')) return;
				// Cancel all actions this turn for pokemon if applicable
				this.queue.cancelAction(pokemon);
				// Add volatiles to both pokemon
				this.add('-activate', pokemon, 'ability: Commander', `[of] ${ally}`);
				pokemon.addVolatile('commanding');
				ally.addVolatile('commanded', pokemon);
				// Continued in conditions.ts in the volatiles
			} else {
				if (!ally.fainted) return;
				pokemon.removeVolatile('commanding');
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Commander",
		rating: 0,
		num: 279,
	},
	competitive: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({ spa: 2 }, target, target, null, false, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Competitive",
		rating: 2.5,
		num: 172,
	},
	compoundeyes: {
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return this.chainModify([5325, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Compound Eyes",
		rating: 3,
		num: 14,
	},
	contrary: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= -1;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Contrary",
		rating: 4.5,
		num: 126,
	},
	corrosion: {
		// Implemented in sim/pokemon.js:Pokemon#setStatus
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Corrosion",
		rating: 2.5,
		num: 212,
	},
	costar: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			const ally = pokemon.allies()[0];
			if (!ally) return;

			let i: BoostID;
			for (i in ally.boosts) {
				pokemon.boosts[i] = ally.boosts[i];
			}
			const volatilesToCopy = ['dragoncheer', 'focusenergy', 'gmaxchistrike', 'laserfocus'];
			// we need to be sure to remove all the overlapping crit volatiles before trying to add any
			for (const volatile of volatilesToCopy) pokemon.removeVolatile(volatile);
			for (const volatile of volatilesToCopy) {
				if (ally.volatiles[volatile]) {
					pokemon.addVolatile(volatile);
					if (volatile === 'gmaxchistrike') pokemon.volatiles[volatile].layers = ally.volatiles[volatile].layers;
					if (volatile === 'dragoncheer') pokemon.volatiles[volatile].hasDragonType = ally.volatiles[volatile].hasDragonType;
				}
			}
			this.add('-copyboost', pokemon, ally, '[from] ability: Costar');
		},
		
flags: {},
		name: "Costar",
		rating: 0,
		num: 294,
	},
	cottondown: {
		onDamagingHit(damage, target, source, move) {
			let activated = false;
			for (const pokemon of this.getAllActive()) {
				if (pokemon === target || pokemon.fainted) continue;
				if (!activated) {
					this.add('-ability', target, 'Cotton Down');
					activated = true;
				}
				this.boost({ spe: -1 }, pokemon, target, null, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Cotton Down",
		rating: 2,
		num: 238,
	},
	cudchew: {
		onEatItem(item, pokemon) {
			if (item.isBerry && pokemon.addVolatile('cudchew')) {
				pokemon.volatiles['cudchew'].berry = item;
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['cudchew'];
		},
		condition: {
			noCopy: true,
			duration: 2,
			onRestart() {
				this.effectState.duration = 2;
			},
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onEnd(pokemon) {
				if (pokemon.hp) {
					const item = this.effectState.berry;
					this.add('-activate', pokemon, 'ability: Cud Chew');
					this.add('-enditem', pokemon, item.name, '[eat]');
					if (this.singleEvent('Eat', item, null, pokemon, null, null)) {
						this.runEvent('EatItem', pokemon, null, null, item);
					}
					if (item.onEat) pokemon.ateBerry = true;
				}
			},
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Cud Chew",
		rating: 2,
		num: 291,
	},
	curiousmedicine: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			for (const ally of pokemon.adjacentAllies()) {
				ally.clearBoosts();
				this.add('-clearboost', ally, '[from] ability: Curious Medicine', `[of] ${pokemon}`);
			}
		},
		
flags: {},
		name: "Curious Medicine",
		rating: 0,
		num: 261,
	},
	cursedbody: {
		onDamagingHit(damage, target, source, move) {
			if (source.volatiles['disable']) return;
			if (!move.isMax && !move.flags['futuremove'] && move.id !== 'struggle') {
				if (this.randomChance(3, 10)) {
					source.addVolatile('disable', this.effectState.target);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Cursed Body",
		rating: 2,
		num: 130,
	},
	cutecharm: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.addVolatile('attract', this.effectState.target);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Cute Charm",
		rating: 0.5,
		num: 56,
	},
	damp: {
		onAnyTryMove(target, source, effect) {
			if (['explosion', 'mindblown', 'mistyexplosion', 'selfdestruct'].includes(effect.id)) {
				this.attrLastMove('[still]');
				this.add('cant', this.effectState.target, 'ability: Damp', effect, `[of] ${target}`);
				return false;
			}
		},
		onAnyDamage(damage, target, source, effect) {
			if (effect && effect.name === 'Aftermath') {
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Damp",
		rating: 0.5,
		num: 6,
	},
	dancer: {
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Dancer",
		// implemented in runMove in scripts.js
		rating: 1.5,
		num: 216,
	},
	darkaura: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Dark Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Dark') return;
			if (!move.auraBooster?.hasAbility('Dark Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		
flags: {},
		name: "Dark Aura",
		rating: 3,
		num: 186,
	},
	dauntlessshield: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.shieldBoost) return;
			pokemon.shieldBoost = true;
			this.boost({ def: 1 }, pokemon);
		},
		
flags: {},
		name: "Dauntless Shield",
		rating: 3.5,
		num: 235,
	},
	dazzling: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Dazzling', move, `[of] ${target}`);
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Dazzling",
		rating: 2.5,
		num: 219,
	},
	defeatist: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, pokemon) {
			if (pokemon.hp <= pokemon.maxhp / 2) {
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Defeatist",
		rating: -1,
		num: 129,
	},
	defiant: {
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.boost({ atk: 2 }, target, target, null, false, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Defiant",
		rating: 3,
		num: 128,
	},
	deltastream: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setWeather('deltastream');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'deltastream' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('deltastream')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		
flags: {},
		name: "Delta Stream",
		rating: 4,
		num: 191,
	},
	desolateland: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setWeather('desolateland');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'desolateland' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('desolateland')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
flags: {},
		name: "Desolate Land",
		rating: 4.5,
		num: 190,
	},
	disguise: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && ['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				this.add('-activate', target, 'ability: Disguise');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, source, move) {
			if (!target) return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}
			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target || move.category === 'Status') return;
			if (!['mimikyu', 'mimikyutotem'].includes(target.species.id)) {
				return;
			}

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (['mimikyu', 'mimikyutotem'].includes(pokemon.species.id) && this.effectState.busted) {
				const speciesid = pokemon.species.id === 'mimikyutotem' ? 'Mimikyu-Busted-Totem' : 'Mimikyu-Busted';
				pokemon.formeChange(speciesid, this.effect, true);
				this.damage(pokemon.baseMaxhp / 8, pokemon, pokemon, this.dex.species.get(speciesid));
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1,
		},
		name: "Disguise",
		rating: 3.5,
		num: 209,
	},
	download: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			let totaldef = 0;
			let totalspd = 0;
			for (const target of pokemon.foes()) {
				totaldef += target.getStat('def', false, true);
				totalspd += target.getStat('spd', false, true);
			}
			if (totaldef && totaldef >= totalspd) {
				this.boost({ spa: 1 });
			} else if (totalspd) {
				this.boost({ atk: 1 });
			}
		},
		
flags: {},
		name: "Download",
		rating: 3.5,
		num: 88,
	},
	dragonsmaw: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Dragon') {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Dragon') {
				this.debug('Dragon\'s Maw boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Dragon's Maw",
		rating: 3.5,
		num: 263,
	},
	drizzle: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (source.species.id === 'kyogre' && source.item === 'blueorb') return;
			this.field.setWeather('raindance');
		},
		
flags: {},
		name: "Drizzle",
		rating: 4,
		num: 2,
	},
	drought: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (source.species.id === 'groudon' && source.item === 'redorb') return;
			this.field.setWeather('sunnyday');
		},
		
flags: {},
		name: "Drought",
		rating: 4,
		num: 70,
	},
	dryskin: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Dry Skin');
				}
				return null;
			}
		},
		onSourceBasePowerPriority: 17,
		onSourceBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(1.25);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 8);
			} else if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Dry Skin",
		rating: 3,
		num: 87,
	},
	earlybird: {
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Early Bird",
		// Implemented in statuses.js
		rating: 1.5,
		num: 48,
	},
	eartheater: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Ground') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Earth Eater');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Earth Eater",
		rating: 3.5,
		num: 297,
	},
	effectspore: {
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
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Effect Spore",
		rating: 2,
		num: 27,
	},
	electricsurge: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setTerrain('electricterrain');
		},
		
flags: {},
		name: "Electric Surge",
		rating: 4,
		num: 226,
	},
	electromorphosis: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			target.addVolatile('charge');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Electromorphosis",
		rating: 3,
		num: 280,
	},
	embodyaspectcornerstone: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.name === 'Ogerpon-Cornerstone-Tera' && pokemon.terastallized &&
				this.effectState.embodied !== pokemon.previouslySwitchedIn) {
				this.effectState.embodied = pokemon.previouslySwitchedIn;
				this.boost({ def: 1 }, pokemon);
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Cornerstone)",
		rating: 3.5,
		num: 304,
	},
	embodyaspecthearthflame: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.name === 'Ogerpon-Hearthflame-Tera' && pokemon.terastallized &&
				this.effectState.embodied !== pokemon.previouslySwitchedIn) {
				this.effectState.embodied = pokemon.previouslySwitchedIn;
				this.boost({ atk: 1 }, pokemon);
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Hearthflame)",
		rating: 3.5,
		num: 303,
	},
	embodyaspectteal: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.name === 'Ogerpon-Teal-Tera' && pokemon.terastallized &&
				this.effectState.embodied !== pokemon.previouslySwitchedIn) {
				this.effectState.embodied = pokemon.previouslySwitchedIn;
				this.boost({ spe: 1 }, pokemon);
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Teal)",
		rating: 3.5,
		num: 301,
	},
	embodyaspectwellspring: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.name === 'Ogerpon-Wellspring-Tera' && pokemon.terastallized &&
				this.effectState.embodied !== pokemon.previouslySwitchedIn) {
				this.effectState.embodied = pokemon.previouslySwitchedIn;
				this.boost({ spd: 1 }, pokemon);
			}
		},
	
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Embody Aspect (Wellspring)",
		rating: 3.5,
		num: 302,
	},
	emergencyexit: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Emergency Exit');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Emergency Exit",
		rating: 1,
		num: 194,
	},
	fairyaura: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Fairy Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			if (target === source || move.category === 'Status' || move.type !== 'Fairy') return;
			if (!move.auraBooster?.hasAbility('Fairy Aura')) move.auraBooster = this.effectState.target;
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([move.hasAuraBreak ? 3072 : 5448, 4096]);
		},
		
flags: {},
		name: "Fairy Aura",
		rating: 3,
		num: 187,
	},
	filter: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Filter neutralize');
				return this.chainModify(0.75);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Filter",
		rating: 3,
		num: 111,
	},
	flamebody: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('brn', target);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Flame Body",
		rating: 2,
		num: 49,
	},
	flareboost: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.status === 'brn' && move.category === 'Special') {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Flare Boost",
		rating: 2,
		num: 138,
	},
	flashfire: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				move.accuracy = true;
				if (!target.addVolatile('flashfire')) {
					this.add('-immune', target, '[from] ability: Flash Fire');
				}
				return null;
			}
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('flashfire');
		},
		condition: {
			noCopy: true, // doesn't get copied by Baton Pass
			onStart(target) {
				this.add('-start', target, 'ability: Flash Fire');
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onModifySpAPriority: 5,
			onModifySpA(atk, attacker, defender, move) {
				if (move.type === 'Fire' && attacker.hasAbility('flashfire')) {
					this.debug('Flash Fire boost');
					return this.chainModify(1.5);
				}
			},
			onEnd(target) {
				this.add('-end', target, 'ability: Flash Fire', '[silent]');
			},
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Flash Fire",
		rating: 3.5,
		num: 18,
	},
	flowergift: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			if (!pokemon.isActive || pokemon.baseSpecies.baseSpecies !== 'Cherrim' || pokemon.transformed) return;
			if (!pokemon.hp) return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				if (pokemon.species.id !== 'cherrimsunshine') {
					pokemon.formeChange('Cherrim-Sunshine', this.effect, false, '0', '[msg]');
				}
			} else {
				if (pokemon.species.id === 'cherrimsunshine') {
					pokemon.formeChange('Cherrim', this.effect, false, '0', '[msg]');
				}
			}
		},
		onAllyModifyAtkPriority: 3,
		onAllyModifyAtk(atk, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onAllyModifySpDPriority: 4,
		onAllyModifySpD(spd, pokemon) {
			if (this.effectState.target.baseSpecies.baseSpecies !== 'Cherrim') return;
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, breakable: 1 },
		name: "Flower Gift",
		rating: 1,
		num: 122,
	},
	flowerveil: {
		onAllyTryBoost(boost, target, source, effect) {
			if ((source && target === source) || !target.hasType('Grass')) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
			}
		},
		onAllySetStatus(status, target, source, effect) {
			if (target.hasType('Grass') && source && target !== source && effect && effect.id !== 'yawn') {
				this.debug('interrupting setStatus with Flower Veil');
				if (effect.name === 'Synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
					const effectHolder = this.effectState.target;
					this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				}
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (target.hasType('Grass') && status.id === 'yawn') {
				this.debug('Flower Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Flower Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Flower Veil",
		rating: 0,
		num: 166,
	},
	fluffy: {
		onSourceModifyDamage(damage, source, target, move) {
			let mod = 1;
			if (move.type === 'Fire') mod *= 2;
			if (move.flags['contact']) mod /= 2;
			return this.chainModify(mod);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Fluffy",
		rating: 3.5,
		num: 218,
	},
	forecast: {
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
  onSwitchInPriority: -2,
  onStart(pokemon) {
    // optional: your debug/type line
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
  },
  onWeatherChange(pokemon) {
  if (pokemon.baseSpecies.baseSpecies !== 'Castform' || pokemon.transformed) return;

  // Remember if this Castform has mega-evolved at least once this battle.
  (pokemon as any).m ??= {};
  if (pokemon.species.isMega) (pokemon as any).m.megaforecast = true;
  const useMega = !!(pokemon as any).m.megaforecast;

  const w = pokemon.effectiveWeather();
  let targetForme: string;

  switch (w) {
    case 'sunnyday': case 'desolateland':
      targetForme = useMega ? 'Castform-Sunny-Mega' : 'Castform-Sunny';
      break;
    case 'raindance': case 'primordialsea':
      targetForme = useMega ? 'Castform-Rainy-Mega' : 'Castform-Rainy';
      break;
    case 'hail': case 'snowscape':
      targetForme = useMega ? 'Castform-Snowy-Mega' : 'Castform-Snowy';
      break;
    case 'sandstorm':
      targetForme = useMega ? 'Castform-Rocky-Mega' : 'Castform-Rocky';
      break;
    default:
      // Weather ended → stay Mega if we've mega-evolved before
      targetForme = useMega ? 'Castform-Mega' : 'Castform';
      break;
  }

  if (pokemon.species.name !== targetForme && pokemon.isActive) {
    pokemon.formeChange(targetForme, this.effect, false, '0', '[msg]');
  }
},

  onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
			
		},
  

  flags: {failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1},
  name: "Forecast",
  rating: 2,
  num: 59,
},

	forewarn: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			let warnMoves: (Move | Pokemon)[][] = [];
			let warnBp = 1;
			for (const target of pokemon.foes()) {
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.moves.get(moveSlot.move);
					let bp = move.basePower;
					if (move.ohko) bp = 150;
					if (move.id === 'counter' || move.id === 'metalburst' || move.id === 'mirrorcoat') bp = 120;
					if (bp === 1) bp = 80;
					if (!bp && move.category !== 'Status') bp = 80;
					if (bp > warnBp) {
						warnMoves = [[move, target]];
						warnBp = bp;
					} else if (bp === warnBp) {
						warnMoves.push([move, target]);
					}
				}
			}
			if (!warnMoves.length) return;
			const [warnMoveName, warnTarget] = this.sample(warnMoves);
			this.add('-activate', pokemon, 'ability: Forewarn', warnMoveName, `[of] ${warnTarget}`);
		},
		
flags: {},
		name: "Forewarn",
		rating: 0.5,
		num: 108,
	},
	friendguard: {
		onAnyModifyDamage(damage, source, target, move) {
			if (target !== this.effectState.target && target.isAlly(this.effectState.target)) {
				this.debug('Friend Guard weaken');
				return this.chainModify(0.75);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Friend Guard",
		rating: 0,
		num: 132,
	},
	frisk: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			for (const target of pokemon.foes()) {
				if (target.item) {
					this.add('-item', target, target.getItem().name, '[from] ability: Frisk', `[of] ${pokemon}`);
				}
			}
		},
		
flags: {},
		name: "Frisk",
		rating: 1.5,
		num: 119,
	},
	fullmetalbody: {
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
				this.add("-fail", target, "unboost", "[from] ability: Full Metal Body", `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Full Metal Body",
		rating: 2,
		num: 230,
	},
	furcoat: {
		onModifyDefPriority: 6,
		onModifyDef(def) {
			return this.chainModify(2);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Fur Coat",
		rating: 4,
		num: 169,
	},
	galewings: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.type === 'Flying' && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Gale Wings",
		rating: 1.5,
		num: 177,
	},
	galvanize: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Electric';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Galvanize",
		rating: 4,
		num: 206,
	},
	gluttony: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.abilityState.gluttony = true;
		},
		onDamage(item, pokemon) {
			pokemon.abilityState.gluttony = true;
		},
		
flags: {},
		name: "Gluttony",
		rating: 1.5,
		num: 82,
	},
	goodasgold: {
		onTryHit(target, source, move) {
			if (move.category === 'Status' && target !== source) {
				this.add('-immune', target, '[from] ability: Good as Gold');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Good as Gold",
		rating: 5,
		num: 283,
	},
	gooey: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.add('-ability', target, 'Gooey');
				this.boost({ spe: -1 }, source, target, null, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Gooey",
		rating: 2,
		num: 183,
	},
	gorillatactics: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.abilityState.choiceLock = "";
		},
		onBeforeMove(pokemon, target, move) {
			if (move.isZOrMaxPowered || move.id === 'struggle') return;
			if (pokemon.abilityState.choiceLock && pokemon.abilityState.choiceLock !== move.id) {
				// Fails unless ability is being ignored (these events will not run), no PP lost.
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Gorilla Tactics");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onModifyMove(move, pokemon) {
			if (pokemon.abilityState.choiceLock || move.isZOrMaxPowered || move.id === 'struggle') return;
			pokemon.abilityState.choiceLock = move.id;
		},
		onModifyAtkPriority: 1,
		onModifyAtk(atk, pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			// PLACEHOLDER
			this.debug('Gorilla Tactics Atk Boost');
			return this.chainModify(1.5);
		},
		onDisableMove(pokemon) {
			if (!pokemon.abilityState.choiceLock) return;
			if (pokemon.volatiles['dynamax']) return;
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== pokemon.abilityState.choiceLock) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
		onEnd(pokemon) {
			pokemon.abilityState.choiceLock = "";
		},
		
flags: {},
		name: "Gorilla Tactics",
		rating: 4.5,
		num: 255,
	},
	grasspelt: {
		onModifyDefPriority: 6,
		onModifyDef(pokemon) {
			if (this.field.isTerrain('grassyterrain')) return this.chainModify(1.5);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Grass Pelt",
		rating: 0.5,
		num: 179,
	},
	grassysurge: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setTerrain('grassyterrain');
		},
		
flags: {},
		name: "Grassy Surge",
		rating: 4,
		num: 229,
	},
	grimneigh: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ spa: length }, source);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Grim Neigh",
		rating: 3,
		num: 265,
	},
	guarddog: {
		onDragOutPriority: 1,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Guard Dog');
			return null;
		},
		onTryBoostPriority: 2,
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.boost({ atk: 1 }, target, target, null, false, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Guard Dog",
		rating: 2,
		num: 275,
	},
	gulpmissile: {
		onDamagingHit(damage, target, source, move) {
			if (!source.hp || !source.isActive || target.isSemiInvulnerable()) return;
			if (['cramorantgulping', 'cramorantgorging'].includes(target.species.id)) {
				this.damage(source.baseMaxhp / 4, source, target);
				if (target.species.id === 'cramorantgulping') {
					this.boost({ def: -1 }, source, target, null, true);
				} else {
					source.trySetStatus('par', target, move);
				}
				target.formeChange('cramorant', move);
			}
		},
		// The Dive part of this mechanic is implemented in Dive's `onTryMove` in moves.ts
		onSourceTryPrimaryHit(target, source, effect) {
			if (effect?.id === 'surf' && source.hasAbility('gulpmissile') && source.species.name === 'Cramorant') {
				const forme = source.hp <= source.maxhp / 2 ? 'cramorantgorging' : 'cramorantgulping';
				source.formeChange(forme, effect);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { cantsuppress: 1, notransform: 1 },
		name: "Gulp Missile",
		rating: 2.5,
		num: 241,
	},
	guts: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Guts",
		rating: 3.5,
		num: 62,
	},
	hadronengine: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (!this.field.setTerrain('electricterrain') && this.field.isTerrain('electricterrain')) {
				this.add('-activate', pokemon, 'ability: Hadron Engine');
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (this.field.isTerrain('electricterrain')) {
				this.debug('Hadron Engine boost');
				return this.chainModify([5461, 4096]);
			}
		},
		
flags: {},
		name: "Hadron Engine",
		rating: 4.5,
		num: 289,
	},
	harvest: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Harvest",
		rating: 2.5,
		num: 139,
	},
	healer: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			for (const allyActive of pokemon.adjacentAllies()) {
				if (allyActive.status && this.randomChance(3, 10)) {
					this.add('-activate', pokemon, 'ability: Healer');
					allyActive.cureStatus();
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Healer",
		rating: 0,
		num: 131,
	},
	heatproof: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof Atk weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				this.debug('Heatproof SpA weaken');
				return this.chainModify(0.5);
			}
		},
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'brn') {
				return damage / 2;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Heatproof",
		rating: 2,
		num: 85,
	},
	heavymetal: {
		onModifyWeightPriority: 1,
		onModifyWeight(weighthg) {
			return weighthg * 2;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Heavy Metal",
		rating: 0,
		num: 134,
	},
	honeygather: {
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Honey Gather",
		rating: 0,
		num: 118,
	},
	hospitality: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			for (const ally of pokemon.adjacentAllies()) {
				this.heal(ally.baseMaxhp / 4, ally, pokemon);
			}
		},
		
flags: {},
		name: "Hospitality",
		rating: 0,
		num: 299,
	},
	hugepower: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(2);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Huge Power",
		rating: 5,
		num: 37,
	},
	hungerswitch: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.species.baseSpecies !== 'Morpeko' || pokemon.terastallized) return;
			const targetForme = pokemon.species.name === 'Morpeko' ? 'Morpeko-Hangry' : 'Morpeko';
			pokemon.formeChange(targetForme);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Hunger Switch",
		rating: 1,
		num: 258,
	},
	hustle: {
		// This should be applied directly to the stat as opposed to chaining with the others
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.modify(atk, 1.5);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Physical' && typeof accuracy === 'number') {
				return this.chainModify([3277, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Hustle",
		rating: 3.5,
		num: 55,
	},
	hydration: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.status && ['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				this.debug('hydration');
				this.add('-activate', pokemon, 'ability: Hydration');
				pokemon.cureStatus();
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Hydration",
		rating: 1.5,
		num: 93,
	},
	hypercutter: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.atk && boost.atk < 0) {
				delete boost.atk;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Attack", "[from] ability: Hyper Cutter", `[of] ${target}`);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Hyper Cutter",
		rating: 1.5,
		num: 52,
	},
	icebody: {
		onWeather(target, source, effect) {
			if (effect.id === 'hail' || effect.id === 'snowscape') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Ice Body",
		rating: 1,
		num: 115,
	},
	iceface: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect?.effectType === 'Move' && effect.category === 'Physical' && target.species.id === 'eiscue') {
				this.add('-activate', target, 'ability: Ice Face');
				this.effectState.busted = true;
				return 0;
			}
		},
		onCriticalHit(target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;
			if (target.volatiles['substitute'] && !(move.flags['bypasssub'] || move.infiltrates)) return;
			if (!target.runImmunity(move)) return;
			return false;
		},
		onEffectiveness(typeMod, target, type, move) {
			if (!target) return;
			if (move.category !== 'Physical' || target.species.id !== 'eiscue') return;

			const hitSub = target.volatiles['substitute'] && !move.flags['bypasssub'] && !(move.infiltrates && this.gen >= 6);
			if (hitSub) return;

			if (!target.runImmunity(move)) return;
			return 0;
		},
		onUpdate(pokemon) {
			if (pokemon.species.id === 'eiscue' && this.effectState.busted) {
				pokemon.formeChange('Eiscue-Noice', this.effect, true);
			}
		},
		onWeatherChange(pokemon, source, sourceEffect) {
			// snow/hail resuming because Cloud Nine/Air Lock ended does not trigger Ice Face
			if ((sourceEffect as Ability)?.suppressWeather) return;
			if (!pokemon.hp) return;
			if (this.field.isWeather(['hail', 'snowscape']) && pokemon.species.id === 'eiscuenoice') {
				this.add('-activate', pokemon, 'ability: Ice Face');
				this.effectState.busted = false;
				pokemon.formeChange('Eiscue', this.effect, true);
			}
		},
		
flags: {
			failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1,
			breakable: 1, notransform: 1,
		},
		name: "Ice Face",
		rating: 3,
		num: 248,
	},
	icescales: {
		onSourceModifyDamage(damage, source, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Ice Scales",
		rating: 4,
		num: 246,
	},
	illuminate: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Illuminate", `[of] ${target}`);
				}
			}
		},
		onModifyMove(move) {
			move.ignoreEvasion = true;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Illuminate",
		rating: 0.5,
		num: 35,
	},
	illusion: {
		onBeforeSwitchIn(pokemon) {
			pokemon.illusion = null;
			// yes, you can Illusion an active pokemon but only if it's to your right
			for (let i = pokemon.side.pokemon.length - 1; i > pokemon.position; i--) {
				const possibleTarget = pokemon.side.pokemon[i];
				if (!possibleTarget.fainted) {
					// If Ogerpon is in the last slot while the Illusion Pokemon is Terastallized
					// Illusion will not disguise as anything
					if (!pokemon.terastallized || !['Ogerpon', 'Terapagos'].includes(possibleTarget.species.baseSpecies)) {
						pokemon.illusion = possibleTarget;
					}
					break;
				}
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (target.illusion) {
				this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, source, move);
			}
		},
		onEnd(pokemon) {
  if (pokemon.illusion) {
    this.debug('illusion cleared');
    pokemon.illusion = null;

    // Update model/name/etc. to the true species
    const details = pokemon.getUpdatedDetails();
    this.add('replace', pokemon, details);

    // Announce Illusion ending
    this.add('-end', pokemon, 'Illusion');
    if (this.ruleTable.has('illusionlevelmod')) {
      this.hint("Illusion Level Mod is active, so this Pok\u00e9mon's true level was hidden.", true);
    }

    // NEW: show the revealed Pokémon's current typing (runtime types)
    const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
  }
},

		onFaint(pokemon) {
			pokemon.illusion = null;
		},
		onStart(pokemon) {
  let cur;
  if (pokemon.illusion) {
    // Show the typing of the disguise instead of the true typing
    cur = pokemon.illusion.getTypes(true).join('/');
  } else {
    cur = pokemon.getTypes(true).join('/');
  }
  this.add('-start', pokemon, 'typechange', cur);
},

flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Illusion",
		rating: 4.5,
		num: 149,
	},
	immunity: {
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Immunity');
			}
			return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Immunity",
		rating: 2,
		num: 17,
	},
	imposter: {
		onSwitchIn(pokemon) {
			// Imposter does not activate when Skill Swapped or when Neutralizing Gas leaves the field
			// Imposter copies across in doubles/triples
			// (also copies across in multibattle and diagonally in free-for-all,
			// but side.foe already takes care of those)
			const target = pokemon.side.foe.active[pokemon.side.foe.active.length - 1 - pokemon.position];
			if (target) {
				pokemon.transformInto(target, this.dex.abilities.get('imposter'));
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Imposter",
		rating: 5,
		num: 150,
	},
	infiltrator: {
		onModifyMove(move) {
			move.infiltrates = true;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Infiltrator",
		rating: 2.5,
		num: 151,
	},
	innardsout: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (!target.hp) {
				this.damage(target.getUndynamaxedHP(damage), source, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Innards Out",
		rating: 4,
		num: 215,
	},
	innerfocus: {
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Inner Focus', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Inner Focus",
		rating: 1,
		num: 39,
	},
	insomnia: {
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Insomnia');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Insomnia');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Insomnia');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Insomnia",
		rating: 1.5,
		num: 15,
	},
	intimidate: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Intimidate', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ atk: -1 }, target, pokemon, null, true);
				}
			}
		},
		
flags: {},
		name: "Intimidate",
		rating: 3.5,
		num: 22,
	},
	intrepidsword: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.swordBoost) return;
			pokemon.swordBoost = true;
			this.boost({ atk: 1 }, pokemon);
		},
		
flags: {},
		name: "Intrepid Sword",
		rating: 4,
		num: 234,
	},
	ironbarbs: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Iron Barbs",
		rating: 2.5,
		num: 160,
	},
	ironfist: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Iron Fist",
		rating: 3,
		num: 89,
	},
	justified: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Dark') {
				this.boost({ atk: 1 });
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Justified",
		rating: 2.5,
		num: 154,
	},
	keeneye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Keen Eye", `[of] ${target}`);
				}
			}
		},
		onModifyMove(move) {
			move.ignoreEvasion = true;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Keen Eye",
		rating: 0.5,
		num: 51,
	},
	klutz: {
		// Klutz isn't technically active immediately in-game, but it activates early enough to beat all items
		// we should keep an eye out in future gens for items that activate on switch-in before Unnerve
		onSwitchInPriority: 1,
		// Item suppression implemented in Pokemon.ignoringItem() within sim/pokemon.js
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.singleEvent('End', pokemon.getItem(), pokemon.itemState, pokemon);
		},
		
flags: {},
		name: "Klutz",
		rating: -1,
		num: 103,
	},
	leafguard: {
		onSetStatus(status, target, source, effect) {
			if (['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				if ((effect as Move)?.status) {
					this.add('-immune', target, '[from] ability: Leaf Guard');
				}
				return false;
			}
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn' && ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) {
				this.add('-immune', target, '[from] ability: Leaf Guard');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Leaf Guard",
		rating: 0.5,
		num: 102,
	},
	levitate: {
		// airborneness implemented in sim/pokemon.js:Pokemon#isGrounded
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Levitate",
		rating: 3.5,
		num: 26,
	},
	libero: {
		onPrepareHit(source, target, move) {
			if (this.effectState.libero === source.previouslySwitchedIn) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.libero = source.previouslySwitchedIn;
				this.add('-start', source, 'typechange', type, '[from] ability: Libero');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Libero",
		rating: 4,
		num: 236,
	},
	lightmetal: {
		onModifyWeight(weighthg) {
			return this.trunc(weighthg / 2);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Light Metal",
		rating: 1,
		num: 135,
	},
	lightningrod: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Lightning Rod');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Electric' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Lightning Rod');
				}
				return this.effectState.target;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Lightning Rod",
		rating: 3,
		num: 31,
	},
	limber: {
		onUpdate(pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Limber');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'par') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Limber');
			}
			return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Limber",
		rating: 2,
		num: 7,
	},
	lingeringaroma: {
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'lingeringaroma') {
				return;
			}
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('lingeringaroma', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Lingering Aroma', this.dex.abilities.get(oldAbility).name, `[of] ${source}`);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Lingering Aroma",
		rating: 2,
		num: 268,
	},
	liquidooze: {
		onSourceTryHeal(damage, target, source, effect) {
			this.debug(`Heal is occurring: ${target} <- ${source} :: ${effect.id}`);
			const canOoze = ['drain', 'leechseed', 'strengthsap'];
			if (canOoze.includes(effect.id)) {
				this.damage(damage);
				return 0;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Liquid Ooze",
		rating: 2.5,
		num: 64,
	},
	liquidvoice: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			if (move.flags['sound'] && !pokemon.volatiles['dynamax']) { // hardcode
				move.type = 'Water';
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Liquid Voice",
		rating: 1.5,
		num: 204,
	},
	longreach: {
		onModifyMove(move) {
			delete move.flags['contact'];
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Long Reach",
		rating: 1,
		num: 203,
	},
	magicbounce: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
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
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Magic Bounce",
		rating: 4,
		num: 156,
	},
	magicguard: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Magic Guard",
		rating: 4,
		num: 98,
	},
	magician: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (!move || source.switchFlag === true || !move.hitTargets || source.item || source.volatiles['gem'] ||
				move.id === 'fling' || move.category === 'Status') return;
			const hitTargets = move.hitTargets;
			this.speedSort(hitTargets);
			for (const pokemon of hitTargets) {
				if (pokemon !== source) {
					const yourItem = pokemon.takeItem(source);
					if (!yourItem) continue;
					if (!source.setItem(yourItem)) {
						pokemon.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
						continue;
					}
					this.add('-item', source, yourItem, '[from] ability: Magician', `[of] ${pokemon}`);
					return;
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Magician",
		rating: 1,
		num: 170,
	},
	magmaarmor: {
		onUpdate(pokemon) {
			if (pokemon.status === 'frz') {
				this.add('-activate', pokemon, 'ability: Magma Armor');
				pokemon.cureStatus();
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'frz') return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Magma Armor",
		rating: 0.5,
		num: 40,
	},
	magnetpull: {
		onFoeTrapPokemon(pokemon) {
			if (pokemon.hasType('Steel') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.knownType || pokemon.hasType('Steel')) {
				pokemon.maybeTrapped = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Magnet Pull",
		rating: 4,
		num: 42,
	},
	marvelscale: {
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Marvel Scale",
		rating: 2.5,
		num: 63,
	},
	megalauncher: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['pulse']) {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Mega Launcher",
		rating: 3,
		num: 178,
	},
	merciless: {
		onModifyCritRatio(critRatio, source, target) {
			if (target && ['psn', 'tox'].includes(target.status)) return 5;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Merciless",
		rating: 1.5,
		num: 196,
	},
	mimicry: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			let types;
			switch (this.field.terrain) {
			case 'electricterrain':
				types = ['Electric'];
				break;
			case 'grassyterrain':
				types = ['Grass'];
				break;
			case 'mistyterrain':
				types = ['Fairy'];
				break;
			case 'psychicterrain':
				types = ['Psychic'];
				break;
			default:
				types = pokemon.baseSpecies.types;
			}
			const oldTypes = pokemon.getTypes();
			if (oldTypes.join() === types.join() || !pokemon.setType(types)) return;
			if (this.field.terrain || pokemon.transformed) {
				this.add('-start', pokemon, 'typechange', types.join('/'), '[from] ability: Mimicry');
				if (!this.field.terrain) this.hint("Transform Mimicry changes you to your original un-transformed types.");
			} else {
				this.add('-activate', pokemon, 'ability: Mimicry');
				this.add('-end', pokemon, 'typechange', '[silent]');
			}
		},
		
flags: {},
		name: "Mimicry",
		rating: 0,
		num: 250,
	},
	mindseye: {
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.accuracy && boost.accuracy < 0) {
				delete boost.accuracy;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "accuracy", "[from] ability: Mind's Eye", `[of] ${target}`);
				}
			}
		},
		onModifyMovePriority: -5,
		onModifyMove(move) {
			move.ignoreEvasion = true;
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Mind's Eye",
		rating: 0,
		num: 300,
	},
	minus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Minus",
		rating: 0,
		num: 58,
	},
	mirrorarmor: {
		onTryBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (!source || target === source || !boost || effect.name === 'Mirror Armor') return;
			let b: BoostID;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					if (source.hp) {
						this.add('-ability', target, 'Mirror Armor');
						this.boost(negativeBoost, source, target, null, true);
					}
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Mirror Armor",
		rating: 2,
		num: 240,
	},
	mistysurge: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setTerrain('mistyterrain');
		},
		
flags: {},
		name: "Misty Surge",
		rating: 3.5,
		num: 228,
	},
	moldbreaker: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Mold Breaker');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		
flags: {},
		name: "Mold Breaker",
		rating: 3,
		num: 104,
	},
	moody: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			let stats: BoostID[] = [];
			const boost: SparseBoostsTable = {};
			let statPlus: BoostID;
			for (statPlus in pokemon.boosts) {
				if (statPlus === 'accuracy' || statPlus === 'evasion') continue;
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat: BoostID | undefined = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = 2;

			stats = [];
			let statMinus: BoostID;
			for (statMinus in pokemon.boosts) {
				if (statMinus === 'accuracy' || statMinus === 'evasion') continue;
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? this.sample(stats) : undefined;
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost, pokemon, pokemon);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Moody",
		rating: 5,
		num: 141,
	},
	motordrive: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.boost({ spe: 1 })) {
					this.add('-immune', target, '[from] ability: Motor Drive');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Motor Drive",
		rating: 3,
		num: 78,
	},
	moxie: {
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.boost({ atk: length }, source);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Moxie",
		rating: 3,
		num: 153,
	},
	multiscale: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Multiscale weaken');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Multiscale",
		rating: 3.5,
		num: 136,
	},
	multitype: {
		// Multitype's type-changing itself is implemented in statuses.js
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Multitype",
		rating: 4,
		num: 121,
	},
	mummy: {
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'mummy') {
				return;
			}
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('mummy', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Mummy', this.dex.abilities.get(oldAbility).name, `[of] ${source}`);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Mummy",
		rating: 2,
		num: 152,
	},
	myceliummight: {
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category === 'Status') {
				return -0.1;
			}
		},
		onModifyMove(move) {
			if (move.category === 'Status') {
				move.ignoreAbility = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Mycelium Might",
		rating: 2,
		num: 298,
	},
	naturalcure: {
		onCheckShow(pokemon) {
			// This is complicated
			// For the most part, in-game, it's obvious whether or not Natural Cure activated,
			// since you can see how many of your opponent's pokemon are statused.
			// The only ambiguous situation happens in Doubles/Triples, where multiple pokemon
			// that could have Natural Cure switch out, but only some of them get cured.
			if (pokemon.side.active.length === 1) return;
			if (pokemon.showCure === true || pokemon.showCure === false) return;

			const cureList = [];
			let noCureCount = 0;
			for (const curPoke of pokemon.side.active) {
				// pokemon not statused
				if (!curPoke?.status) {
					// this.add('-message', "" + curPoke + " skipped: not statused or doesn't exist");
					continue;
				}
				if (curPoke.showCure) {
					// this.add('-message', "" + curPoke + " skipped: Natural Cure already known");
					continue;
				}
				const species = curPoke.species;
				// pokemon can't get Natural Cure
				if (!Object.values(species.abilities).includes('Natural Cure')) {
					// this.add('-message', "" + curPoke + " skipped: no Natural Cure");
					continue;
				}
				// pokemon's ability is known to be Natural Cure
				if (!species.abilities['1'] && !species.abilities['H']) {
					// this.add('-message', "" + curPoke + " skipped: only one ability");
					continue;
				}
				// pokemon isn't switching this turn
				if (curPoke !== pokemon && !this.queue.willSwitch(curPoke)) {
					// this.add('-message', "" + curPoke + " skipped: not switching");
					continue;
				}

				if (curPoke.hasAbility('naturalcure')) {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (and is)");
					cureList.push(curPoke);
				} else {
					// this.add('-message', "" + curPoke + " confirmed: could be Natural Cure (but isn't)");
					noCureCount++;
				}
			}

			if (!cureList.length || !noCureCount) {
				// It's possible to know what pokemon were cured
				for (const pkmn of cureList) {
					pkmn.showCure = true;
				}
			} else {
				// It's not possible to know what pokemon were cured

				// Unlike a -hint, this is real information that battlers need, so we use a -message
				this.add('-message', `(${cureList.length} of ${pokemon.side.name}'s pokemon ${cureList.length === 1 ? "was" : "were"} cured by Natural Cure.)`);

				for (const pkmn of cureList) {
					pkmn.showCure = false;
				}
			}
		},
		onSwitchOut(pokemon) {
			if (!pokemon.status) return;

			// if pokemon.showCure is undefined, it was skipped because its ability
			// is known
			if (pokemon.showCure === undefined) pokemon.showCure = true;

			if (pokemon.showCure) this.add('-curestatus', pokemon, pokemon.status, '[from] ability: Natural Cure');
			pokemon.clearStatus();

			// only reset .showCure if it's false
			// (once you know a Pokemon has Natural Cure, its cures are always known)
			if (!pokemon.showCure) pokemon.showCure = undefined;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Natural Cure",
		rating: 2.5,
		num: 30,
	},
	neuroforce: {
		onModifyDamage(damage, source, target, move) {
			if (move && target.getMoveHitData(move).typeMod > 0) {
				return this.chainModify([5120, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Neuroforce",
		rating: 2.5,
		num: 233,
	},
	neutralizinggas: {
		// Ability suppression implemented in sim/pokemon.ts:Pokemon#ignoringAbility
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Neutralizing Gas');
			pokemon.abilityState.ending = false;
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			for (const target of this.getAllActive()) {
				if (target.hasItem('Ability Shield')) {
					this.add('-block', target, 'item: Ability Shield');
					continue;
				}
				// Can't suppress a Tatsugiri inside of Dondozo already
				if (target.volatiles['commanding']) {
					continue;
				}
				if (target.illusion) {
					this.singleEvent('End', this.dex.abilities.get('Illusion'), target.abilityState, target, pokemon, 'neutralizinggas');
				}
				if (target.volatiles['slowstart']) {
					delete target.volatiles['slowstart'];
					this.add('-end', target, 'Slow Start', '[silent]');
				}
				if (strongWeathers.includes(target.getAbility().id)) {
					this.singleEvent('End', this.dex.abilities.get(target.getAbility().id), target.abilityState, target, pokemon, 'neutralizinggas');
				}
			}
		},
		onEnd(source) {
			if (source.transformed) return;
			for (const pokemon of this.getAllActive()) {
				if (pokemon !== source && pokemon.hasAbility('Neutralizing Gas')) {
					return;
				}
			}
			this.add('-end', source, 'ability: Neutralizing Gas');

			// FIXME this happens before the pokemon switches out, should be the opposite order.
			// Not an easy fix since we cant use a supported event. Would need some kind of special event that
			// gathers events to run after the switch and then runs them when the ability is no longer accessible.
			// (If you're tackling this, do note extreme weathers have the same issue)

			// Mark this pokemon's ability as ending so Pokemon#ignoringAbility skips it
			if (source.abilityState.ending) return;
			source.abilityState.ending = true;
			const sortedActive = this.getAllActive();
			this.speedSort(sortedActive);
			for (const pokemon of sortedActive) {
				if (pokemon !== source) {
					if (pokemon.getAbility().flags['cantsuppress']) continue; // does not interact with e.g Ice Face, Zen Mode
					if (pokemon.hasItem('abilityshield')) continue; // don't restart abilities that weren't suppressed

					// Will be suppressed by Pokemon#ignoringAbility if needed
					this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityState, pokemon);
					if (pokemon.ability === "gluttony") {
						pokemon.abilityState.gluttony = false;
					}
				}
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Neutralizing Gas",
		rating: 3.5,
		num: 256,
	},
	noguard: {
		onAnyInvulnerabilityPriority: 1,
		onAnyInvulnerability(target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) return 0;
		},
		onAnyAccuracy(accuracy, target, source, move) {
			if (move && (source === this.effectState.target || target === this.effectState.target)) {
				return true;
			}
			return accuracy;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "No Guard",
		rating: 4,
		num: 99,
	},
	normalize: {
		onModifyTypePriority: 1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'hiddenpower', 'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'struggle', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (!(move.isZ && move.category !== 'Status') &&
				// TODO: Figure out actual interaction
				(!noModifyType.includes(move.id) || this.activeMove?.isMax) && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Normal';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Normalize",
		rating: 0,
		num: 96,
	},
	oblivious: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
			if (pokemon.volatiles['taunt']) {
				this.add('-activate', pokemon, 'ability: Oblivious');
				pokemon.removeVolatile('taunt');
				// Taunt's volatile already sends the -end message when removed
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'attract') return false;
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'attract' || move.id === 'captivate' || move.id === 'taunt') {
				this.add('-immune', pokemon, '[from] ability: Oblivious');
				return null;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Oblivious', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Oblivious",
		rating: 1.5,
		num: 12,
	},
	opportunist: {
		onFoeAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Opportunist' || effect?.name === 'Mirror Herb') return;
			if (!this.effectState.boosts) this.effectState.boosts = {} as SparseBoostsTable;
			const boostPlus = this.effectState.boosts;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! > 0) {
					boostPlus[i] = (boostPlus[i] || 0) + boost[i]!;
				}
			}
		},
		onAnySwitchInPriority: -3,
		onAnySwitchIn() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMega() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterTerastallization() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onAnyAfterMove() {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (!this.effectState.boosts) return;
			this.boost(this.effectState.boosts, this.effectState.target);
			delete this.effectState.boosts;
		},
		onEnd() {
			delete this.effectState.boosts;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Opportunist",
		rating: 3,
		num: 290,
	},
	orichalcumpulse: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.field.setWeather('sunnyday')) {
				this.add('-activate', pokemon, 'Orichalcum Pulse', '[source]');
			} else if (this.field.isWeather('sunnyday')) {
				this.add('-activate', pokemon, 'ability: Orichalcum Pulse');
			}
		},
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				this.debug('Orichalcum boost');
				return this.chainModify([5461, 4096]);
			}
		},
		
flags: {},
		name: "Orichalcum Pulse",
		rating: 4.5,
		num: 288,
	},
	overcoat: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm' || type === 'hail' || type === 'powder') return false;
		},
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (move.flags['powder'] && target !== source && this.dex.getImmunity('powder', target)) {
				this.add('-immune', target, '[from] ability: Overcoat');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Overcoat",
		rating: 2,
		num: 142,
	},
	overgrow: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Grass' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Overgrow boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Overgrow",
		rating: 2,
		num: 65,
	},
	owntempo: {
		onUpdate(pokemon) {
			if (pokemon.volatiles['confusion']) {
				this.add('-activate', pokemon, 'ability: Own Tempo');
				pokemon.removeVolatile('confusion');
			}
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'confusion') return null;
		},
		onHit(target, source, move) {
			if (move?.volatileStatus === 'confusion') {
				this.add('-immune', target, 'confusion', '[from] ability: Own Tempo');
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Own Tempo', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Own Tempo",
		rating: 1.5,
		num: 20,
	},
	parentalbond: {
		onPrepareHit(source, target, move) {
			if (move.category === 'Status' || move.multihit || move.flags['noparentalbond'] || move.flags['charge'] ||
				move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
			move.multihit = 2;
			move.multihitType = 'parentalbond';
		},
		// Damage modifier implemented in BattleActions#modifyDamage()
		onSourceModifySecondaries(secondaries, target, source, move) {
			if (move.multihitType === 'parentalbond' && move.id === 'secretpower' && move.hit < 2) {
				// hack to prevent accidentally suppressing King's Rock/Razor Fang
				return secondaries.filter(effect => effect.volatileStatus === 'flinch');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Parental Bond",
		rating: 4.5,
		num: 185,
	},
	pastelveil: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			for (const ally of pokemon.alliesAndSelf()) {
				if (['psn', 'tox'].includes(ally.status)) {
					this.add('-activate', pokemon, 'ability: Pastel Veil');
					ally.cureStatus();
				}
			}
		},
		onUpdate(pokemon) {
			if (['psn', 'tox'].includes(pokemon.status)) {
				this.add('-activate', pokemon, 'ability: Pastel Veil');
				pokemon.cureStatus();
			}
		},
		onAnySwitchIn() {
			((this.effect as any).onStart as (p: Pokemon) => void).call(this, this.effectState.target);
		},
		onSetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Pastel Veil');
			}
			return false;
		},
		onAllySetStatus(status, target, source, effect) {
			if (!['psn', 'tox'].includes(status.id)) return;
			if ((effect as Move)?.status) {
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Pastel Veil', `[of] ${effectHolder}`);
			}
			return false;
		},
		
flags: { breakable: 1 },
		name: "Pastel Veil",
		rating: 2,
		num: 257,
	},
	perishbody: {
		onDamagingHit(damage, target, source, move) {
			if (!this.checkMoveMakesContact(move, source, target) || source.volatiles['perishsong']) return;
			this.add('-ability', target, 'Perish Body');
			source.addVolatile('perishsong');
			target.addVolatile('perishsong');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Perish Body",
		rating: 1,
		num: 253,
	},
	pickpocket: {
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]', '[from] ability: Pickpocket', `[of] ${source}`);
				this.add('-item', target, yourItem, '[from] ability: Pickpocket', `[of] ${source}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Pickpocket",
		rating: 1,
		num: 124,
	},
	pickup: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.item) return;
			const pickupTargets = this.getAllActive().filter(target => (
				target.lastItem && target.usedItemThisTurn && pokemon.isAdjacent(target)
			));
			if (!pickupTargets.length) return;
			const randomTarget = this.sample(pickupTargets);
			const item = randomTarget.lastItem;
			randomTarget.lastItem = '';
			this.add('-item', pokemon, this.dex.items.get(item), '[from] ability: Pickup');
			pokemon.setItem(item);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Pickup",
		rating: 0.5,
		num: 53,
	},
	pixilate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Fairy';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Pixilate",
		rating: 4,
		num: 182,
	},
	plus: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			for (const allyActive of pokemon.allies()) {
				if (allyActive.hasAbility(['minus', 'plus'])) {
					return this.chainModify(1.5);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Plus",
		rating: 0,
		num: 57,
	},
	poisonheal: {
		onDamagePriority: 1,
		onDamage(damage, target, source, effect) {
			if (effect.id === 'psn' || effect.id === 'tox') {
				this.heal(target.baseMaxhp / 8);
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Poison Heal",
		rating: 4,
		num: 90,
	},
	poisonpoint: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Poison Point",
		rating: 1.5,
		num: 38,
	},
	poisonpuppeteer: {
		onAnyAfterSetStatus(status, target, source, effect) {
			if (source !== this.effectState.target || target === source || effect.effectType !== 'Move') return;
			if (status.id === 'psn' || status.id === 'tox') {
				target.addVolatile('confusion');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Poison Puppeteer",
		rating: 3,
		num: 310,
	},
	poisontouch: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(3, 10)) {
					target.trySetStatus('psn', source);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Poison Touch",
		rating: 2,
		num: 143,
	},
	powerconstruct: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Zygarde' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.species.id === 'zygardecomplete' || pokemon.hp > pokemon.maxhp / 2) return;
			this.add('-activate', pokemon, 'ability: Power Construct');
			pokemon.formeChange('Zygarde-Complete', this.effect, true);
			pokemon.formeRegression = true;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Power Construct",
		rating: 5,
		num: 211,
	},
	powerofalchemy: {
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			if (this.effectState.target.setAbility(ability)) {
				this.add('-ability', this.effectState.target, ability, '[from] ability: Power of Alchemy', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Power of Alchemy",
		rating: 0,
		num: 223,
	},
	powerspot: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (attacker !== this.effectState.target) {
				this.debug('Power Spot boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Power Spot",
		rating: 0,
		num: 249,
	},
	prankster: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Prankster",
		rating: 4,
		num: 158,
	},
	pressure: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Pressure');
		},
		onDeductPP(target, source) {
			if (target.isAlly(source)) return;
			return 1;
		},
		
flags: {},
		name: "Pressure",
		rating: 2.5,
		num: 46,
	},
	primordialsea: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setWeather('primordialsea');
		},
		onAnySetWeather(target, source, weather) {
			const strongWeathers = ['desolateland', 'primordialsea', 'deltastream'];
			if (this.field.getWeather().id === 'primordialsea' && !strongWeathers.includes(weather.id)) return false;
		},
		onEnd(pokemon) {
			if (this.field.weatherState.source !== pokemon) return;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (target.hasAbility('primordialsea')) {
					this.field.weatherState.source = target;
					return;
				}
			}
			this.field.clearWeather();
		},
		
flags: {},
		name: "Primordial Sea",
		rating: 4.5,
		num: 189,
	},
	prismarmor: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Prism Armor neutralize');
				return this.chainModify(0.75);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Prism Armor",
		rating: 3,
		num: 232,
	},
	propellertail: {
		onModifyMovePriority: 1,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Propeller Tail",
		rating: 0,
		num: 239,
	},
	protean: {
		onPrepareHit(source, target, move) {
			if (this.effectState.protean === source.previouslySwitchedIn) return;
			if (move.hasBounced || move.flags['futuremove'] || move.sourceEffect === 'snatch' || move.callsMove) return;
			const type = move.type;
			if (type && type !== '???' && source.getTypes().join() !== type) {
				if (!source.setType(type)) return;
				this.effectState.protean = source.previouslySwitchedIn;
				this.add('-start', source, 'typechange', type, '[from] ability: Protean');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Protean",
		rating: 4,
		num: 168,
	},
	protosynthesis: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.singleEvent('WeatherChange', this.effect, this.effectState, pokemon);
		},
		onWeatherChange(pokemon) {
			// Protosynthesis is not affected by Utility Umbrella
			if (this.field.isWeather('sunnyday')) {
				pokemon.addVolatile('protosynthesis');
			} else if (!pokemon.volatiles['protosynthesis']?.fromBooster && !this.field.isWeather('sunnyday')) {
				pokemon.removeVolatile('protosynthesis');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['protosynthesis'];
			this.add('-end', pokemon, 'Protosynthesis', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Protosynthesis', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Protosynthesis');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'protosynthesis' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Protosynthesis spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Protosynthesis');
			},
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Protosynthesis",
		rating: 3,
		num: 281,
	},
	psychicsurge: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setTerrain('psychicterrain');
		},
		
flags: {},
		name: "Psychic Surge",
		rating: 4,
		num: 227,
	},
	punkrock: {
		onBasePowerPriority: 7,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.flags['sound']) {
				this.debug('Punk Rock weaken');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Punk Rock",
		rating: 3.5,
		num: 244,
	},
	purepower: {
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Pure Power",
		rating: 5,
		num: 74,
	},
	purifyingsalt: {
		onSetStatus(status, target, source, effect) {
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Purifying Salt');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Purifying Salt');
				return null;
			}
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ghost') {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(spa, attacker, defender, move) {
			if (move.type === 'Ghost') {
				this.debug('Purifying Salt weaken');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Purifying Salt",
		rating: 4,
		num: 272,
	},
	quarkdrive: {
		onSwitchInPriority: -2,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.singleEvent('TerrainChange', this.effect, this.effectState, pokemon);
		},
		onTerrainChange(pokemon) {
			if (this.field.isTerrain('electricterrain')) {
				pokemon.addVolatile('quarkdrive');
			} else if (!pokemon.volatiles['quarkdrive']?.fromBooster) {
				pokemon.removeVolatile('quarkdrive');
			}
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['quarkdrive'];
			this.add('-end', pokemon, 'Quark Drive', '[silent]');
		},
		condition: {
			noCopy: true,
			onStart(pokemon, source, effect) {
				if (effect?.name === 'Booster Energy') {
					this.effectState.fromBooster = true;
					this.add('-activate', pokemon, 'ability: Quark Drive', '[fromitem]');
				} else {
					this.add('-activate', pokemon, 'ability: Quark Drive');
				}
				this.effectState.bestStat = pokemon.getBestStat(false, true);
				this.add('-start', pokemon, 'quarkdrive' + this.effectState.bestStat);
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				if (this.effectState.bestStat !== 'atk' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive atk boost');
				return this.chainModify([5325, 4096]);
			},
			onModifyDefPriority: 6,
			onModifyDef(def, pokemon) {
				if (this.effectState.bestStat !== 'def' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive def boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpAPriority: 5,
			onModifySpA(spa, pokemon) {
				if (this.effectState.bestStat !== 'spa' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spa boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpDPriority: 6,
			onModifySpD(spd, pokemon) {
				if (this.effectState.bestStat !== 'spd' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spd boost');
				return this.chainModify([5325, 4096]);
			},
			onModifySpe(spe, pokemon) {
				if (this.effectState.bestStat !== 'spe' || pokemon.ignoringAbility()) return;
				this.debug('Quark Drive spe boost');
				return this.chainModify(1.5);
			},
			onEnd(pokemon) {
				this.add('-end', pokemon, 'Quark Drive');
			},
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, notransform: 1 },
		name: "Quark Drive",
		rating: 3,
		num: 282,
	},
	queenlymajesty: {
		onFoeTryMove(target, source, move) {
			const targetAllExceptions = ['perishsong', 'flowershield', 'rototiller'];
			if (move.target === 'foeSide' || (move.target === 'all' && !targetAllExceptions.includes(move.id))) {
				return;
			}

			const dazzlingHolder = this.effectState.target;
			if ((source.isAlly(dazzlingHolder) || move.target === 'all') && move.priority > 0.1) {
				this.attrLastMove('[still]');
				this.add('cant', dazzlingHolder, 'ability: Queenly Majesty', move, `[of] ${target}`);
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Queenly Majesty",
		rating: 2.5,
		num: 214,
	},
	quickdraw: {
		onFractionalPriorityPriority: -1,
		onFractionalPriority(priority, pokemon, target, move) {
			if (move.category !== "Status" && this.randomChance(3, 10)) {
				this.add('-activate', pokemon, 'ability: Quick Draw');
				return 0.1;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Quick Draw",
		rating: 2.5,
		num: 259,
	},
	quickfeet: {
		onModifySpe(spe, pokemon) {
			if (pokemon.status) {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Quick Feet",
		rating: 2.5,
		num: 95,
	},
	raindish: {
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.baseMaxhp / 16);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rain Dish",
		rating: 1.5,
		num: 44,
	},
	rattled: {
		onDamagingHit(damage, target, source, move) {
			if (['Dark', 'Bug', 'Ghost'].includes(move.type)) {
				this.boost({ spe: 1 });
			}
		},
		onAfterBoost(boost, target, source, effect) {
			if (effect?.name === 'Intimidate' && boost.atk) {
				this.boost({ spe: 1 });
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rattled",
		rating: 1,
		num: 155,
	},
	receiver: {
		onAllyFaint(target) {
			if (!this.effectState.target.hp) return;
			const ability = target.getAbility();
			if (ability.flags['noreceiver'] || ability.id === 'noability') return;
			if (this.effectState.target.setAbility(ability)) {
				this.add('-ability', this.effectState.target, ability, '[from] ability: Receiver', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Receiver",
		rating: 0,
		num: 222,
	},
	reckless: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.recoil || move.hasCrashDamage) {
				this.debug('Reckless boost');
				return this.chainModify([4915, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Reckless",
		rating: 3,
		num: 120,
	},
	refrigerate: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && (!noModifyType.includes(move.id) || this.activeMove?.isMax) &&
				!(move.isZ && move.category !== 'Status') && !(move.name === 'Tera Blast' && pokemon.terastallized)) {
				move.type = 'Ice';
				move.typeChangerBoosted = this.effect;
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.typeChangerBoosted === this.effect) return this.chainModify([4915, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Refrigerate",
		rating: 4,
		num: 174,
	},
	regenerator: {
		onSwitchOut(pokemon) {
			pokemon.heal(pokemon.baseMaxhp / 3);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Regenerator",
		rating: 4.5,
		num: 144,
	},
	ripen: {
		onTryHeal(damage, target, source, effect) {
			if (!effect) return;
			if (effect.name === 'Berry Juice' || effect.name === 'Leftovers') {
				this.add('-activate', target, 'ability: Ripen');
			}
			if ((effect as Item).isBerry) return this.chainModify(2);
		},
		onChangeBoost(boost, target, source, effect) {
			if (effect && (effect as Item).isBerry) {
				let b: BoostID;
				for (b in boost) {
					boost[b]! *= 2;
				}
			}
		},
		onSourceModifyDamagePriority: -1,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.abilityState.berryWeaken) {
				target.abilityState.berryWeaken = false;
				return this.chainModify(0.5);
			}
		},
		onTryEatItemPriority: -1,
		onTryEatItem(item, pokemon) {
			this.add('-activate', pokemon, 'ability: Ripen');
		},
		onEatItem(item, pokemon) {
			const weakenBerries = [
				'Babiri Berry', 'Charti Berry', 'Chilan Berry', 'Chople Berry', 'Coba Berry', 'Colbur Berry', 'Haban Berry', 'Kasib Berry', 'Kebia Berry', 'Occa Berry', 'Passho Berry', 'Payapa Berry', 'Rindo Berry', 'Roseli Berry', 'Shuca Berry', 'Tanga Berry', 'Wacan Berry', 'Yache Berry',
			];
			// Record if the pokemon ate a berry to resist the attack
			pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Ripen",
		rating: 2,
		num: 247,
	},
	rivalry: {
		onBasePowerPriority: 24,
		onBasePower(basePower, attacker, defender, move) {
			if (attacker.gender && defender.gender) {
				if (attacker.gender === defender.gender) {
					this.debug('Rivalry boost');
					return this.chainModify(1.25);
				} else {
					this.debug('Rivalry weaken');
					return this.chainModify(0.75);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rivalry",
		rating: 0,
		num: 79,
	},
	rkssystem: {
		// RKS System's type-changing itself is implemented in statuses.js
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "RKS System",
		rating: 4,
		num: 225,
	},
	rockhead: {
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rock Head",
		rating: 3,
		num: 69,
	},
	rockypayload: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Rock') {
				this.debug('Rocky Payload boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rocky Payload",
		rating: 3.5,
		num: 276,
	},
	roughskin: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.damage(source.baseMaxhp / 8, source, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Rough Skin",
		rating: 2.5,
		num: 24,
	},
	runaway: {
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Run Away",
		rating: 0,
		num: 50,
	},
	sandforce: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.field.isWeather('sandstorm')) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sand Force",
		rating: 2,
		num: 159,
	},
	sandrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather('sandstorm')) {
				return this.chainModify(2);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sand Rush",
		rating: 3,
		num: 146,
	},
	sandspit: {
		onDamagingHit(damage, target, source, move) {
			this.field.setWeather('sandstorm');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sand Spit",
		rating: 1,
		num: 245,
	},
	sandstream: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setWeather('sandstorm');
		},
		
flags: {},
		name: "Sand Stream",
		rating: 4,
		num: 45,
	},
	sandveil: {
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather('sandstorm')) {
				this.debug('Sand Veil - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Sand Veil",
		rating: 1.5,
		num: 8,
	},
	sapsipper: {
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Grass') {
				if (!this.boost({ atk: 1 })) {
					this.add('-immune', target, '[from] ability: Sap Sipper');
				}
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (source === this.effectState.target || !target.isAlly(source)) return;
			if (move.type === 'Grass') {
				this.boost({ atk: 1 }, this.effectState.target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Sap Sipper",
		rating: 3,
		num: 157,
	},
	schooling: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (
				pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.level < 20 ||
				pokemon.transformed || !pokemon.hp
			) return;
			if (pokemon.hp > pokemon.maxhp / 4) {
				if (pokemon.species.id === 'wishiwashi') {
					pokemon.formeChange('Wishiwashi-School');
				}
			} else {
				if (pokemon.species.id === 'wishiwashischool') {
					pokemon.formeChange('Wishiwashi');
				}
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Schooling",
		rating: 3,
		num: 208,
	},
	scrappy: {
		onModifyMovePriority: -5,
		onModifyMove(move) {
			if (!move.ignoreImmunity) move.ignoreImmunity = {};
			if (move.ignoreImmunity !== true) {
				move.ignoreImmunity['Fighting'] = true;
				move.ignoreImmunity['Normal'] = true;
			}
		},
		onTryBoost(boost, target, source, effect) {
			if (effect.name === 'Intimidate' && boost.atk) {
				delete boost.atk;
				this.add('-fail', target, 'unboost', 'Attack', '[from] ability: Scrappy', `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Scrappy",
		rating: 3,
		num: 113,
	},
	screencleaner: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			let activated = false;
			for (const sideCondition of ['reflect', 'lightscreen', 'auroraveil']) {
				for (const side of [pokemon.side, ...pokemon.side.foeSidesWithConditions()]) {
					if (side.getSideCondition(sideCondition)) {
						if (!activated) {
							this.add('-activate', pokemon, 'ability: Screen Cleaner');
							activated = true;
						}
						side.removeSideCondition(sideCondition);
					}
				}
			}
		},
		
flags: {},
		name: "Screen Cleaner",
		rating: 2,
		num: 251,
	},
	seedsower: {
		onDamagingHit(damage, target, source, move) {
			this.field.setTerrain('grassyterrain');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Seed Sower",
		rating: 2.5,
		num: 269,
	},
	serenegrace: {
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Serene Grace",
		rating: 3.5,
		num: 32,
	},
	shadowshield: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Shadow Shield",
		rating: 3.5,
		num: 231,
	},
	shadowtag: {
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.maybeTrapped = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Shadow Tag",
		rating: 5,
		num: 23,
	},
	sharpness: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['slicing']) {
				this.debug('Sharpness boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sharpness",
		rating: 3.5,
		num: 292,
	},
	shedskin: {
		onResidualOrder: 5,
		onResidualSubOrder: 3,
		onResidual(pokemon) {
			if (pokemon.hp && pokemon.status && this.randomChance(33, 100)) {
				this.debug('shed skin');
				this.add('-activate', pokemon, 'ability: Shed Skin');
				pokemon.cureStatus();
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Shed Skin",
		rating: 3,
		num: 61,
	},
	sheerforce: {
		onModifyMove(move, pokemon) {
			if (move.secondaries) {
				delete move.secondaries;
				// Technically not a secondary effect, but it is negated
				delete move.self;
				if (move.id === 'clangoroussoulblaze') delete move.selfBoost;
				// Actual negation of `AfterMoveSecondary` effects implemented in scripts.js
				move.hasSheerForce = true;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, target, move) {
			if (move.hasSheerForce) return this.chainModify([5325, 4096]);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sheer Force",
		rating: 3.5,
		num: 125,
	},
	shellarmor: {
		onCriticalHit: false,
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Shell Armor",
		rating: 1,
		num: 75,
	},
	shielddust: {
		onModifySecondaries(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Shield Dust",
		rating: 2,
		num: 19,
	},
	shieldsdown: {
		onSwitchInPriority: -1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.forme !== 'Meteor') {
					pokemon.formeChange('Minior-Meteor');
				}
			} else {
				if (pokemon.species.forme === 'Meteor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Minior' || pokemon.transformed || !pokemon.hp) return;
			if (pokemon.hp > pokemon.maxhp / 2) {
				if (pokemon.species.forme !== 'Meteor') {
					pokemon.formeChange('Minior-Meteor');
				}
			} else {
				if (pokemon.species.forme === 'Meteor') {
					pokemon.formeChange(pokemon.set.species);
				}
			}
		},
		onSetStatus(status, target, source, effect) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Shields Down');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (target.species.id !== 'miniormeteor' || target.transformed) return;
			if (status.id !== 'yawn') return;
			this.add('-immune', target, '[from] ability: Shields Down');
			return null;
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Shields Down",
		rating: 3,
		num: 197,
	},
	simple: {
		onChangeBoost(boost, target, source, effect) {
			if (effect && effect.id === 'zpower') return;
			let i: BoostID;
			for (i in boost) {
				boost[i]! *= 2;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Simple",
		rating: 4,
		num: 86,
	},
	skilllink: {
		onModifyMove(move) {
			if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
				move.multihit = move.multihit[1];
			}
			if (move.multiaccuracy) {
				delete move.multiaccuracy;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Skill Link",
		rating: 3,
		num: 92,
	},
	slowstart: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.addVolatile('slowstart');
		},
		onEnd(pokemon) {
			delete pokemon.volatiles['slowstart'];
			this.add('-end', pokemon, 'Slow Start', '[silent]');
		},
		condition: {
			duration: 5,
			onResidualOrder: 28,
			onResidualSubOrder: 2,
			onStart(target) {
				this.add('-start', target, 'ability: Slow Start');
			},
			onResidual(pokemon) {
				if (!pokemon.activeTurns) {
					this.effectState.duration! += 1;
				}
			},
			onModifyAtkPriority: 5,
			onModifyAtk(atk, pokemon) {
				return this.chainModify(0.5);
			},
			onModifySpe(spe, pokemon) {
				return this.chainModify(0.5);
			},
			onEnd(target) {
				this.add('-end', target, 'Slow Start');
			},
		},
		
flags: {},
		name: "Slow Start",
		rating: -1,
		num: 112,
	},
	slushrush: {
		onModifySpe(spe, pokemon) {
			if (this.field.isWeather(['hail', 'snowscape'])) {
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Slush Rush",
		rating: 3,
		num: 202,
	},
	sniper: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).crit) {
				this.debug('Sniper boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Sniper",
		rating: 2,
		num: 97,
	},
	snowcloak: {
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			if (this.field.isWeather(['hail', 'snowscape'])) {
				this.debug('Snow Cloak - decreasing accuracy');
				return this.chainModify([3277, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Snow Cloak",
		rating: 1.5,
		num: 81,
	},
	snowwarning: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.field.setWeather('snowscape');
		},
		
flags: {},
		name: "Snow Warning",
		rating: 4,
		num: 117,
	},
	solarpower: {
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {
			if (['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(1.5);
			}
		},
		onWeather(target, source, effect) {
			if (target.hasItem('utilityumbrella')) return;
			if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
				this.damage(target.baseMaxhp / 8, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Solar Power",
		rating: 2,
		num: 94,
	},
	solidrock: {
		onSourceModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod > 0) {
				this.debug('Solid Rock neutralize');
				return this.chainModify(0.75);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Solid Rock",
		rating: 3,
		num: 116,
	},
	soulheart: {
		onAnyFaintPriority: 1,
		onAnyFaint() {
			this.boost({ spa: 1 }, this.effectState.target);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Soul-Heart",
		rating: 3.5,
		num: 220,
	},
	soundproof: {
		onTryHit(target, source, move) {
			if (target !== source && move.flags['sound']) {
				this.add('-immune', target, '[from] ability: Soundproof');
				return null;
			}
		},
		onAllyTryHitSide(target, source, move) {
			if (move.flags['sound']) {
				this.add('-immune', this.effectState.target, '[from] ability: Soundproof');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Soundproof",
		rating: 2,
		num: 43,
	},
	speedboost: {
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.activeTurns) {
				this.boost({ spe: 1 });
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Speed Boost",
		rating: 4.5,
		num: 3,
	},
	stakeout: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender) {
			if (!defender.activeTurns) {
				this.debug('Stakeout boost');
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Stakeout",
		rating: 4.5,
		num: 198,
	},
	stall: {
		onFractionalPriority: -0.1,
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Stall",
		rating: -1,
		num: 100,
	},
	stalwart: {
		onModifyMovePriority: 1,
		onModifyMove(move) {
			// most of the implementation is in Battle#getTarget
			move.tracksTarget = move.target !== 'scripted';
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Stalwart",
		rating: 0,
		num: 242,
	},
	stamina: {
		onDamagingHit(damage, target, source, effect) {
			this.boost({ def: 1 });
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Stamina",
		rating: 4,
		num: 192,
	},
	stancechange: {
		onModifyMovePriority: 1,
		onModifyMove(move, attacker, defender) {
			if (attacker.species.baseSpecies !== 'Aegislash' || attacker.transformed) return;
			if (move.category === 'Status' && move.id !== 'kingsshield') return;
			const targetForme = (move.id === 'kingsshield' ? 'Aegislash' : 'Aegislash-Blade');
			if (attacker.species.name !== targetForme) attacker.formeChange(targetForme);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Stance Change",
		rating: 4,
		num: 176,
	},
	static: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('par', target);
				}
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Static",
		rating: 2,
		num: 9,
	},
	steadfast: {
		onFlinch(pokemon) {
			this.boost({ spe: 1 });
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Steadfast",
		rating: 1,
		num: 80,
	},
	steamengine: {
		onDamagingHit(damage, target, source, move) {
			if (['Water', 'Fire'].includes(move.type)) {
				this.boost({ spe: 6 });
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Steam Engine",
		rating: 2,
		num: 243,
	},
	steelworker: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steelworker boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Steelworker",
		rating: 3.5,
		num: 200,
	},
	steelyspirit: {
		onAllyBasePowerPriority: 22,
		onAllyBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Steel') {
				this.debug('Steely Spirit boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Steely Spirit",
		rating: 3.5,
		num: 252,
	},
	stench: {
		onModifyMovePriority: -1,
		onModifyMove(move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
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
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Stench",
		rating: 0.5,
		num: 1,
	},
	stickyhold: {
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Sticky Hold",
		rating: 1.5,
		num: 60,
	},
	stormdrain: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onAnyRedirectTarget(target, source, source2, move) {
			if (move.type !== 'Water' || move.flags['pledgecombo']) return;
			const redirectTarget = ['randomNormal', 'adjacentFoe'].includes(move.target) ? 'normal' : move.target;
			if (this.validTarget(this.effectState.target, source, redirectTarget)) {
				if (move.smartTarget) move.smartTarget = false;
				if (this.effectState.target !== target) {
					this.add('-activate', this.effectState.target, 'ability: Storm Drain');
				}
				return this.effectState.target;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Storm Drain",
		rating: 3,
		num: 114,
	},
	strongjaw: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['bite']) {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Strong Jaw",
		rating: 3.5,
		num: 173,
	},
	sturdy: {
		onTryHit(pokemon, target, move) {
			if (move.ohko) {
				this.add('-immune', pokemon, '[from] ability: Sturdy');
				return null;
			}
		},
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (target.hp === target.maxhp && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Sturdy');
				return target.hp - 1;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Sturdy",
		rating: 3,
		num: 5,
	},
	suctioncups: {
		onDragOutPriority: 1,
		onDragOut(pokemon) {
			this.add('-activate', pokemon, 'ability: Suction Cups');
			return null;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Suction Cups",
		rating: 1,
		num: 21,
	},
	superluck: {
		onModifyCritRatio(critRatio) {
			return critRatio + 1;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Super Luck",
		rating: 1.5,
		num: 105,
	},
	supersweetsyrup: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.syrupTriggered) return;
			pokemon.syrupTriggered = true;
			this.add('-ability', pokemon, 'Supersweet Syrup');
			for (const target of pokemon.adjacentFoes()) {
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ evasion: -1 }, target, pokemon, null, true);
				}
			}
		},
		
flags: {},
		name: "Supersweet Syrup",
		rating: 1.5,
		num: 306,
	},
	supremeoverlord: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.side.totalFainted) {
				this.add('-activate', pokemon, 'ability: Supreme Overlord');
				const fallen = Math.min(pokemon.side.totalFainted, 5);
				this.add('-start', pokemon, `fallen${fallen}`, '[silent]');
				this.effectState.fallen = fallen;
			}
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, `fallen${this.effectState.fallen}`, '[silent]');
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (this.effectState.fallen) {
				const powMod = [4096, 4506, 4915, 5325, 5734, 6144];
				this.debug(`Supreme Overlord boost: ${powMod[this.effectState.fallen]}/4096`);
				return this.chainModify([powMod[this.effectState.fallen], 4096]);
			}
		},
		
flags: {},
		name: "Supreme Overlord",
		rating: 4,
		num: 293,
	},
	surgesurfer: {
		onModifySpe(spe) {
			if (this.field.isTerrain('electricterrain')) {
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Surge Surfer",
		rating: 3,
		num: 207,
	},
	swarm: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Bug' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Swarm boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Swarm",
		rating: 2,
		num: 68,
	},
	sweetveil: {
		onAllySetStatus(status, target, source, effect) {
			if (status.id === 'slp') {
				this.debug('Sweet Veil interrupts sleep');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onAllyTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.debug('Sweet Veil blocking yawn');
				const effectHolder = this.effectState.target;
				this.add('-block', target, 'ability: Sweet Veil', `[of] ${effectHolder}`);
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Sweet Veil",
		rating: 2,
		num: 175,
	},
	swiftswim: {
		onModifySpe(spe, pokemon) {
			if (['raindance', 'primordialsea'].includes(pokemon.effectiveWeather())) {
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Swift Swim",
		rating: 3,
		num: 33,
	},
	symbiosis: {
		onAllyAfterUseItem(item, pokemon) {
			if (pokemon.switchFlag) return;
			const source = this.effectState.target;
			const myItem = source.takeItem();
			if (!myItem) return;
			if (
				!this.singleEvent('TakeItem', myItem, source.itemState, pokemon, source, this.effect, myItem) ||
				!pokemon.setItem(myItem)
			) {
				source.item = myItem.id;
				return;
			}
			this.add('-activate', source, 'ability: Symbiosis', myItem, `[of] ${pokemon}`);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Symbiosis",
		rating: 0,
		num: 180,
	},
	synchronize: {
		onAfterSetStatus(status, target, source, effect) {
			if (!source || source === target) return;
			if (effect && effect.id === 'toxicspikes') return;
			if (status.id === 'slp' || status.id === 'frz') return;
			this.add('-activate', target, 'ability: Synchronize');
			// Hack to make status-prevention abilities think Synchronize is a status move
			// and show messages when activating against it.
			source.trySetStatus(status, target, { status: status.id, id: 'synchronize' } as Effect);
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Synchronize",
		rating: 2,
		num: 28,
	},
	swordofruin: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Sword of Ruin');
		},
		onAnyModifyDef(def, target, source, move) {
			const abilityHolder = this.effectState.target;
			if (target.hasAbility('Sword of Ruin')) return;
			if (!move.ruinedDef?.hasAbility('Sword of Ruin')) move.ruinedDef = abilityHolder;
			if (move.ruinedDef !== abilityHolder) return;
			this.debug('Sword of Ruin Def drop');
			return this.chainModify(0.75);
		},
		
flags: {},
		name: "Sword of Ruin",
		rating: 4.5,
		num: 285,
	},
	tabletsofruin: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Tablets of Ruin');
		},
		onAnyModifyAtk(atk, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Tablets of Ruin')) return;
			if (!move.ruinedAtk) move.ruinedAtk = abilityHolder;
			if (move.ruinedAtk !== abilityHolder) return;
			this.debug('Tablets of Ruin Atk drop');
			return this.chainModify(0.75);
		},
		
flags: {},
		name: "Tablets of Ruin",
		rating: 4.5,
		num: 284,
	},
	tangledfeet: {
		onModifyAccuracyPriority: -1,
		onModifyAccuracy(accuracy, target) {
			if (typeof accuracy !== 'number') return;
			if (target?.volatiles['confusion']) {
				this.debug('Tangled Feet - decreasing accuracy');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Tangled Feet",
		rating: 1,
		num: 77,
	},
	tanglinghair: {
		onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target, true)) {
				this.add('-ability', target, 'Tangling Hair');
				this.boost({ spe: -1 }, source, target, null, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Tangling Hair",
		rating: 2,
		num: 221,
	},
	technician: {
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug(`Base Power: ${basePowerAfterMultiplier}`);
			if (basePowerAfterMultiplier <= 60) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Technician",
		rating: 3.5,
		num: 101,
	},
	telepathy: {
		onTryHit(target, source, move) {
			if (target !== source && target.isAlly(source) && move.category !== 'Status') {
				this.add('-activate', target, 'ability: Telepathy');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Telepathy",
		rating: 0,
		num: 140,
	},
	teraformzero: {
		onAfterTerastallization(pokemon) {
			if (pokemon.baseSpecies.name !== 'Terapagos-Stellar') return;
			if (this.field.weather || this.field.terrain) {
				this.add('-ability', pokemon, 'Teraform Zero');
				this.field.clearWeather();
				this.field.clearTerrain();
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1 },
		name: "Teraform Zero",
		rating: 3,
		num: 309,
	},
	terashell: {
		// effectiveness implemented in sim/pokemon.ts:Pokemon#runEffectiveness
		// needs two checks to reset between regular moves and future attacks
		onAnyBeforeMove() {
			delete this.effectState.resisted;
		},
		onAnyAfterMove() {
			delete this.effectState.resisted;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, breakable: 1 },
		name: "Tera Shell",
		rating: 3.5,
		num: 308,
	},
	terashift: {
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Terapagos') return;
			if (pokemon.species.forme !== 'Terastal') {
				this.add('-activate', pokemon, 'ability: Tera Shift');
				pokemon.formeChange('Terapagos-Terastal', this.effect, true);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Tera Shift",
		rating: 3,
		num: 307,
	},
	teravolt: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Teravolt');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		
flags: {},
		name: "Teravolt",
		rating: 3,
		num: 164,
	},
	thermalexchange: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire') {
				this.boost({ atk: 1 });
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Thermal Exchange');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Thermal Exchange');
			}
			return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Thermal Exchange",
		rating: 2.5,
		num: 270,
	},
	thickfat: {
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Thick Fat",
		rating: 3.5,
		num: 47,
	},
	tintedlens: {
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Tinted Lens",
		rating: 4,
		num: 110,
	},
	torrent: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water' && attacker.hp <= attacker.maxhp / 3) {
				this.debug('Torrent boost');
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Torrent",
		rating: 2,
		num: 67,
	},
	toughclaws: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['contact']) {
				return this.chainModify([5325, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Tough Claws",
		rating: 3.5,
		num: 181,
	},
	toxicboost: {
		onBasePowerPriority: 19,
		onBasePower(basePower, attacker, defender, move) {
			if ((attacker.status === 'psn' || attacker.status === 'tox') && move.category === 'Physical') {
				return this.chainModify(1.5);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Toxic Boost",
		rating: 3,
		num: 137,
	},
	toxicchain: {
		onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Toxic Chain's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;

			if (this.randomChance(3, 10)) {
				target.trySetStatus('tox', source);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Toxic Chain",
		rating: 4.5,
		num: 305,
	},
	toxicdebris: {
		onDamagingHit(damage, target, source, move) {
			const side = source.isAlly(target) ? source.side.foe : source.side;
			const toxicSpikes = side.sideConditions['toxicspikes'];
			if (move.category === 'Physical' && (!toxicSpikes || toxicSpikes.layers < 2)) {
				this.add('-activate', target, 'ability: Toxic Debris');
				side.addSideCondition('toxicspikes', target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Toxic Debris",
		rating: 3.5,
		num: 295,
	},
	trace: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.effectState.seek = true;
			// n.b. only affects Hackmons
			// interaction with No Ability is complicated: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/page-76#post-7790209
			if (pokemon.adjacentFoes().some(foeActive => foeActive.ability === 'noability')) {
				this.effectState.seek = false;
			}
			// interaction with Ability Shield is similar to No Ability
			if (pokemon.hasItem('Ability Shield')) {
				this.add('-block', pokemon, 'item: Ability Shield');
				this.effectState.seek = false;
			}
			if (this.effectState.seek) {
				this.singleEvent('Update', this.effect, this.effectState, pokemon);
			}
		},
		onUpdate(pokemon) {
			if (!this.effectState.seek) return;

			const possibleTargets = pokemon.adjacentFoes().filter(
				target => !target.getAbility().flags['notrace'] && target.ability !== 'noability'
			);
			if (!possibleTargets.length) return;

			const target = this.sample(possibleTargets);
			const ability = target.getAbility();
			if (pokemon.setAbility(ability)) {
				this.add('-ability', pokemon, ability, '[from] ability: Trace', `[of] ${target}`);
			}
		},
		
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1 },
		name: "Trace",
		rating: 2.5,
		num: 36,
	},
	transistor: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Electric') {
				this.debug('Transistor boost');
				return this.chainModify([5325, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Transistor",
		rating: 3.5,
		num: 262,
	},
	triage: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.flags['heal']) return priority + 3;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Triage",
		rating: 3.5,
		num: 205,
	},
	truant: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			pokemon.removeVolatile('truant');
			if (pokemon.activeTurns && (pokemon.moveThisTurnResult !== undefined || !this.queue.willMove(pokemon))) {
				pokemon.addVolatile('truant');
			}
		},
		onBeforeMovePriority: 9,
		onBeforeMove(pokemon) {
			if (pokemon.removeVolatile('truant')) {
				this.add('cant', pokemon, 'ability: Truant');
				return false;
			}
			pokemon.addVolatile('truant');
		},
		condition: {},
		
flags: {},
		name: "Truant",
		rating: -1,
		num: 54,
	},
	turboblaze: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			this.add('-ability', pokemon, 'Turboblaze');
		},
		onModifyMove(move) {
			move.ignoreAbility = true;
		},
		
flags: {},
		name: "Turboblaze",
		rating: 3,
		num: 163,
	},
	unaware: {
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Unaware",
		rating: 4,
		num: 109,
	},
	unburden: {
		onAfterUseItem(item, pokemon) {
			if (pokemon !== this.effectState.target) return;
			pokemon.addVolatile('unburden');
		},
		onTakeItem(item, pokemon) {
			pokemon.addVolatile('unburden');
		},
		onEnd(pokemon) {
			pokemon.removeVolatile('unburden');
		},
		condition: {
			onModifySpe(spe, pokemon) {
				if (!pokemon.item && !pokemon.ignoringAbility()) {
					return this.chainModify(2);
				}
			},
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Unburden",
		rating: 3.5,
		num: 84,
	},
	unnerve: {
		onSwitchInPriority: 1,
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.effectState.unnerved) return;
			this.add('-ability', pokemon, 'Unnerve');
			this.effectState.unnerved = true;
		},
		onEnd() {
			this.effectState.unnerved = false;
		},
		onFoeTryEatItem() {
			return !this.effectState.unnerved;
		},
		
flags: {},
		name: "Unnerve",
		rating: 1,
		num: 127,
	},
	unseenfist: {
		onModifyMove(move) {
			if (move.flags['contact']) delete move.flags['protect'];
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Unseen Fist",
		rating: 2,
		num: 260,
	},
	vesselofruin: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Vessel of Ruin');
		},
		onAnyModifySpA(spa, source, target, move) {
			const abilityHolder = this.effectState.target;
			if (source.hasAbility('Vessel of Ruin')) return;
			if (!move.ruinedSpA) move.ruinedSpA = abilityHolder;
			if (move.ruinedSpA !== abilityHolder) return;
			this.debug('Vessel of Ruin SpA drop');
			return this.chainModify(0.75);
		},
		
flags: {},
		name: "Vessel of Ruin",
		rating: 4.5,
		num: 284,
	},
	victorystar: {
		onAnyModifyAccuracyPriority: -1,
		onAnyModifyAccuracy(accuracy, target, source) {
			if (source.isAlly(this.effectState.target) && typeof accuracy === 'number') {
				return this.chainModify([4506, 4096]);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Victory Star",
		rating: 2,
		num: 162,
	},
	vitalspirit: {
		onUpdate(pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Vital Spirit');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'slp') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Vital Spirit');
			}
			return false;
		},
		onTryAddVolatile(status, target) {
			if (status.id === 'yawn') {
				this.add('-immune', target, '[from] ability: Vital Spirit');
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Vital Spirit",
		rating: 1.5,
		num: 72,
	},
	voltabsorb: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Electric') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Volt Absorb');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Volt Absorb",
		rating: 3.5,
		num: 10,
	},
	wanderingspirit: {
		onDamagingHit(damage, target, source, move) {
			if (source.getAbility().flags['failskillswap'] || target.volatiles['dynamax']) return;

			if (this.checkMoveMakesContact(move, source, target)) {
				const targetCanBeSet = this.runEvent('SetAbility', target, source, this.effect, source.ability);
				if (!targetCanBeSet) return targetCanBeSet;
				const sourceAbility = source.setAbility('wanderingspirit', target);
				if (!sourceAbility) return;
				if (target.isAlly(source)) {
					this.add('-activate', target, 'Skill Swap', '', '', `[of] ${source}`);
				} else {
					this.add('-activate', target, 'ability: Wandering Spirit', this.dex.abilities.get(sourceAbility).name, 'Wandering Spirit', `[of] ${source}`);
				}
				target.setAbility(sourceAbility);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Wandering Spirit",
		rating: 2.5,
		num: 254,
	},
	waterabsorb: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Water') {
				if (!this.heal(target.baseMaxhp / 4)) {
					this.add('-immune', target, '[from] ability: Water Absorb');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Water Absorb",
		rating: 3.5,
		num: 11,
	},
	waterbubble: {
		onSourceModifyAtkPriority: 5,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Fire') {
				return this.chainModify(0.5);
			}
		},
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Water') {
				return this.chainModify(2);
			}
		},
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Bubble');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Bubble');
			}
			return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Water Bubble",
		rating: 4.5,
		num: 199,
	},
	watercompaction: {
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Water') {
				this.boost({ def: 2 });
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Water Compaction",
		rating: 1.5,
		num: 195,
	},
	waterveil: {
		onUpdate(pokemon) {
			if (pokemon.status === 'brn') {
				this.add('-activate', pokemon, 'ability: Water Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'brn') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Water Veil');
			}
			return false;
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Water Veil",
		rating: 2,
		num: 41,
	},
	weakarmor: {
		onDamagingHit(damage, target, source, move) {
			if (move.category === 'Physical') {
				this.boost({ def: -1, spe: 2 }, target, target);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Weak Armor",
		rating: 1,
		num: 133,
	},
	wellbakedbody: {
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fire') {
				if (!this.boost({ def: 2 })) {
					this.add('-immune', target, '[from] ability: Well-Baked Body');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Well-Baked Body",
		rating: 3.5,
		num: 273,
	},
	whitesmoke: {
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
				this.add("-fail", target, "unboost", "[from] ability: White Smoke", `[of] ${target}`);
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "White Smoke",
		rating: 2,
		num: 73,
	},
	wimpout: {
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Wimp Out');
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Wimp Out",
		rating: 1,
		num: 193,
	},
	windpower: {
		onDamagingHitOrder: 1,
		onDamagingHit(damage, target, source, move) {
			if (move.flags['wind']) {
				target.addVolatile('charge');
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				pokemon.addVolatile('charge');
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Wind Power",
		rating: 1,
		num: 277,
	},
	windrider: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
			if (pokemon.side.sideConditions['tailwind']) {
				this.boost({ atk: 1 }, pokemon, pokemon);
			}
		},
		onTryHit(target, source, move) {
			if (target !== source && move.flags['wind']) {
				if (!this.boost({ atk: 1 }, target, target)) {
					this.add('-immune', target, '[from] ability: Wind Rider');
				}
				return null;
			}
		},
		onSideConditionStart(side, source, sideCondition) {
			const pokemon = this.effectState.target;
			if (sideCondition.id === 'tailwind') {
				this.boost({ atk: 1 }, pokemon, pokemon);
			}
		},
		
flags: { breakable: 1 },
		name: "Wind Rider",
		rating: 3.5,
		// We do not want Brambleghast to get Infiltrator in Randbats
		num: 274,
	},
	wonderguard: {
		onTryHit(target, source, move) {
			if (target === source || move.category === 'Status' || move.type === '???' || move.id === 'struggle') return;
			if (move.id === 'skydrop' && !source.volatiles['skydrop']) return;
			this.debug('Wonder Guard immunity: ' + move.id);
			if (target.runEffectiveness(move) <= 0 || !target.runImmunity(move)) {
				if (move.smartTarget) {
					move.smartTarget = false;
				} else {
					this.add('-immune', target, '[from] ability: Wonder Guard');
				}
				return null;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, failskillswap: 1, breakable: 1 },
		name: "Wonder Guard",
		rating: 5,
		num: 25,
	},
	wonderskin: {
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Status' && typeof accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Wonder Skin",
		rating: 2,
		num: 147,
	},
	zenmode: {
		onResidualOrder: 29,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Darmanitan' || pokemon.transformed) {
				return;
			}
			if (pokemon.hp <= pokemon.maxhp / 2 && !['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode');
			} else if (pokemon.hp > pokemon.maxhp / 2 && ['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
				pokemon.addVolatile('zenmode'); // in case of base Darmanitan-Zen
				pokemon.removeVolatile('zenmode');
			}
		},
		onEnd(pokemon) {
			if (!pokemon.volatiles['zenmode'] || !pokemon.hp) return;
			pokemon.transformed = false;
			delete pokemon.volatiles['zenmode'];
			if (pokemon.species.baseSpecies === 'Darmanitan' && pokemon.species.battleOnly) {
				pokemon.formeChange(pokemon.species.battleOnly as string, this.effect, false, '0', '[silent]');
			}
		},
		condition: {
			onStart(pokemon) {
				if (!pokemon.species.name.includes('Galar')) {
					if (pokemon.species.id !== 'darmanitanzen') pokemon.formeChange('Darmanitan-Zen');
				} else {
					if (pokemon.species.id !== 'darmanitangalarzen') pokemon.formeChange('Darmanitan-Galar-Zen');
				}
			},
			onEnd(pokemon) {
				if (['Zen', 'Galar-Zen'].includes(pokemon.species.forme)) {
					pokemon.formeChange(pokemon.species.battleOnly as string);
				}
			},
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1 },
		name: "Zen Mode",
		rating: 0,
		num: 161,
	},
	zerotohero: {
		onSwitchOut(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (pokemon.species.forme !== 'Hero') {
				pokemon.formeChange('Palafin-Hero', this.effect, true);
			}
		},
		onSwitchIn(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Palafin') return;
			if (!this.effectState.heroMessageDisplayed && pokemon.species.forme === 'Hero') {
				this.add('-activate', pokemon, 'ability: Zero to Hero');
				this.effectState.heroMessageDisplayed = true;
			}
		},
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { failroleplay: 1, noreceiver: 1, noentrain: 1, notrace: 1, failskillswap: 1, cantsuppress: 1, notransform: 1 },
		name: "Zero to Hero",
		rating: 5,
		num: 278,
	},

	// CAP
	mountaineer: {
		onDamage(damage, target, source, effect) {
			if (effect && effect.id === 'stealthrock') {
				return false;
			}
		},
		onTryHit(target, source, move) {
			if (move.type === 'Rock' && !target.activeTurns) {
				this.add('-immune', target, '[from] ability: Mountaineer');
				return null;
			}
		},
		isNonstandard: "CAP",
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Mountaineer",
		rating: 3,
		num: -1,
	},
	rebound: {
		isNonstandard: "CAP",
		onTryHitPriority: 1,
		onTryHit(target, source, move) {
			if (this.effectState.target.activeTurns) return;

			if (target === source || move.hasBounced || !move.flags['reflectable'] || target.isSemiInvulnerable()) {
				return;
			}
			const newMove = this.dex.getActiveMove(move.id);
			newMove.hasBounced = true;
			newMove.pranksterBoosted = false;
			this.actions.useMove(newMove, target, { target: source });
			return null;
		},
		onAllyTryHitSide(target, source, move) {
			if (this.effectState.target.activeTurns) return;

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
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: { breakable: 1 },
		name: "Rebound",
		rating: 3,
		num: -2,
	},
	persistent: {
		isNonstandard: "CAP",
		// implemented in the corresponding move
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Persistent",
		rating: 3,
		num: -3,
	},
	typesponge: {
  name: "Type Sponge",
  shortDesc:
    "When hit, add the move's type (max 5; reverts on switch). STAB is 2 (2.25 if already 2). When hit by a damaging move: +1 Def if Physical, +1 SpD if Special (max once/turn).",
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types 
	const base = pokemon.species.types.join('/'); // species types 
	this.add('-start', pokemon, 'typechange', cur);
    (this.effectState as any).lastBoostTurn = -1;
  },

  // STAB: keep your 2 -> 2.25 behavior
  onModifySTAB(stab, source, target, move) {
    if (move.forceSTAB || source.hasType(move.type)) {
      if (stab === 2) return 2.25;
      return 2;
    }
  },

  // ===== Damaging hits: add type + gated defensive boost =====
  onDamagingHit(damage, target, source, move) {
    // 1) Type absorb from this hit
    const t = this.dex.types.get(move.type)?.name;
    if (t && t !== '???' && t !== 'Stellar') {
      if (!target.terastallized && !target.hasAbility('multitype') && !target.hasAbility('rkssystem')) {
        const cur = target.getTypes();
        if (!cur.includes(t) && cur.length < 5) {
          if (!(target as any)._typeSpongeOrig) (target as any)._typeSpongeOrig = cur.slice();
          const next = cur.concat(t);
          if (target.setType(next)) {
            this.add('-start', target, 'typechange', next.join('/'), '[from] ability: Type Sponge');
          }
        }
      }
    }

    // 2) Defensive boost: once per turn, only for damaging moves
    if ((this.effectState as any).lastBoostTurn === this.turn) return;
    if (!move || move.category === 'Status') return;

    if (move.category === 'Physical') {
      this.boost({def: 1}, target, target, this.effect);
    } else if (move.category === 'Special') {
      this.boost({spd: 1}, target, target, this.effect);
    }
    (this.effectState as any).lastBoostTurn = this.turn;
  },

  // ===== Status hits: add type ONLY (no defenses) =====
  onHit(target, source, move) {
    if (!move || move.category !== 'Status') return;

    const t = this.dex.types.get(move.type)?.name;
    if (!t || t === '???' || t === 'Stellar') return;

    if (target.terastallized) return;
    if (target.hasAbility('multitype') || target.hasAbility('rkssystem')) return;

    const cur = target.getTypes();
    if (cur.includes(t) || cur.length >= 5) return;

    if (!(target as any)._typeSpongeOrig) {
      (target as any)._typeSpongeOrig = cur.slice();
    }

    const next = cur.concat(t);
    if (target.setType(next)) {
      this.add('-start', target, 'typechange', next.join('/'), '[from] ability: Type Sponge');
    }
  },

  onSwitchOut(pokemon) {
    const orig: string[] | undefined = (pokemon as any)._typeSpongeOrig;
    if (!orig) return;
    if (pokemon.terastallized) return; // respect Tera lock
    pokemon.setType(orig);
    this.add('-end', pokemon, 'typechange', '[from] ability: Type Sponge');
    delete (pokemon as any)._typeSpongeOrig;
  },
},

unpredictable: {
  name: "Unpredictable",
  shortDesc: "On item loss: +2 Atk/SpA. While frenzied, each time it acts the chosen move is replaced by a random usable one.",
  rating: 3,
  onStart(pokemon) { 
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
	const base = pokemon.species.types.join('/'); // species types 
	this.add('-start', pokemon, 'typechange', cur);
		},

  // ————— trigger frenzy on item loss/consumption —————
  onAfterUseItem(item, pokemon) {
    if (pokemon.fainted) return;
    this.add('-message', `Losing its item has launched ${pokemon.name} into a frenzy!`);
    this.boost({atk: 2, spa: 2}, pokemon, pokemon, this.effect);
    (pokemon as any).m ??= {};
    (pokemon as any).m.unpredictableFrenzy = true;
    (pokemon as any).m.unpredictableResolving = false;
  },
  onTakeItem(item, pokemon) {
    if (pokemon.fainted) return;
    this.add('-message', `Losing its item has launched ${pokemon.name} into a frenzy!`);
    this.boost({atk: 2, spa: 2}, pokemon, pokemon, this.effect);
    (pokemon as any).m ??= {};
    (pokemon as any).m.unpredictableFrenzy = true;
    (pokemon as any).m.unpredictableResolving = false;
  },

  // optional: clear on switch out; delete this block if you want it to persist
  onSwitchOut(pokemon) {
    if ((pokemon as any).m) (pokemon as any).m.unpredictableFrenzy = false;
  },

  // ————— enforce random cast at execution time (server-side) —————
  onBeforeMove(pokemon, target, move) {
    const m = (pokemon as any).m;
    if (!m?.unpredictableFrenzy) return;         // not active
    if (m.unpredictableResolving) return;         // prevent recursion

    // Build usable pool (respects Taunt/Disable/Encore/Imprison/Choice/PP)
    const usable = pokemon.getMoves().filter(ms =>
      !ms.disabled && (ms.pp ?? 0) > 0 && this.dex.moves.get(ms.id).id !== 'struggle'
    );
    if (!usable.length) return;                   // let Struggle happen

    const pick = this.sample(usable);
    const picked = this.dex.moves.get(pick.id);
    if (picked.id === move.id) return;            // RNG matched selection → do nothing

    // Announce (optional)
    this.add('-ability', pokemon, 'Unpredictable');
    this.add('-message', `${pokemon.name} is in a frenzy and used ${picked.name}!`);

    // Fire the replacement move now; cancel the original
m.unpredictableResolving = true;

const activeMove = this.dex.getActiveMove(picked);

// ✅ Let the engine pick the legal target; no target arg needed
this.actions.useMove(activeMove, pokemon);

m.unpredictableResolving = false;

return false; // cancels the originally queued move

  },
},
boilingpoint: {
  name: "Boiling Point",
  shortDesc:
    "On switch-in, randomly sets Fire→Boost/Water→Drop or Water→Boost/Fire→Drop. " +
    "When hit by the boost type: +1 all stats; by the other: -1 all (once/turn).",
  rating: 3,

  // Pick orientation on entry (also re-pick each time it re-enters)
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
	const base = pokemon.species.types.join('/'); // species types 
	this.add('-start', pokemon, 'typechange', cur);
    const fireBoost = this.randomChance(1, 2);
    this.effectState.boostType = (fireBoost ? 'Fire' : 'Water');
    this.effectState.dropType  = (fireBoost ? 'Water' : 'Fire');
    this.effectState.lastTurn  = -1 as number;

    // Announce mapping (optional)
    const boost = this.effectState.boostType;
    const drop  = this.effectState.dropType;
    this.add('-ability', pokemon, 'Steamflip');
    this.add('-message', `${pokemon.name}'s Steamflip: ${boost} empowers, ${drop} weakens!`);
  },
  onSwitchIn(pokemon) {
    // Re-randomize each time it comes back in
    const fireBoost = this.randomChance(1, 2);
    this.effectState.boostType = (fireBoost ? 'Fire' : 'Water');
    this.effectState.dropType  = (fireBoost ? 'Water' : 'Fire');
    this.effectState.lastTurn  = -1 as number;

    const boost = this.effectState.boostType;
    const drop  = this.effectState.dropType;
    this.add('-ability', pokemon, 'Steamflip');
    this.add('-message', `${pokemon.name}'s Steamflip: ${boost} empowers, ${drop} weakens!`);
  },

  // Apply effects when struck
  onDamagingHit(damage, target, source, move) {
    if (!damage) return; // only if it actually dealt damage
    if (!move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return; // once per turn

    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

stronger: {
  name: "Stronger",
  shortDesc:
    "When hit super effectively: +1 all. When hit for resisted damage: -1 all. Neutral hits: 15% chance to +1 all (once/turn).",
  rating: 3,

  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
	const base = pokemon.species.types.join('/'); // species types 
	this.add('-start', pokemon, 'typechange', cur);
    (this.effectState as any).lastTurn = -1;
  },

  onDamagingHit(damage, target, source, move) {
    if (!damage) return;                         // only if it actually dealt damage
    if (!move || move.category === 'Status') return;
    if ((this.effectState as any).lastTurn === this.turn) return; // once per turn

    // Compute effectiveness vs the target's current types (handles dual types)
    const types = target.getTypes ? target.getTypes() : (target as any).types;
    let typeMod = 0;
    for (const t of types) {
      // Dex.getEffectiveness returns -1 (resist), 0 (neutral), 1 (super), etc.
      typeMod += this.dex.getEffectiveness(move.type, t);
    }

    if (typeMod > 0) {
      // Super-effective → omni-boost
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} grew stronger from the super-effective hit!`);
      (this.effectState as any).lastTurn = this.turn;
    } else if (typeMod < 0) {
      // Resisted → omni-drop
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} faltered from the resisted hit...`);
      (this.effectState as any).lastTurn = this.turn;
    } else {
      // Neutral → 15% chance to omni-boost
      if (this.randomChance(3, 20)) {
        this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
        this.add('-message', `${target.name} powered up from the blow!`);
        (this.effectState as any).lastTurn = this.turn;
      }
    }
  },
},
ghostlyaura: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);
			if (this.suppressingAbility(pokemon)) return;
			this.add('-ability', pokemon, 'Ghostly Aura');
		},
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
		  if (target === source || move.category === 'Status') return;

		  const isBoosted = (move.type === 'Ghost' || move.type === 'Dark');
		  const isWeakened = (move.type === 'Fighting' || move.type === 'Fairy');
		  if (!isBoosted && !isWeakened) return;

		  // Ensure only one Ghostly Aura applies (no stacking with multiple holders)
		  if (!move.auraBooster?.hasAbility('Ghostly Aura')) {
		    move.auraBooster = this.effectState.target;
		  }
		  if (move.auraBooster !== this.effectState.target) return;

		  // Standard Aura numbers: 5448/4096 ≈ 1.33x, 3072/4096 = 0.75x
		  const mult = isBoosted
		    ? (move.hasAuraBreak ? 3072 : 5448)  // Ghost/Dark: boost, Aura Break flips to weaken
		    : (move.hasAuraBreak ? 5448 : 3072); // Fighting/Fairy: weaken, Aura Break flips to boost

		  return this.chainModify([mult, 4096]);
},
		
flags: {},
		name: "Ghostly Aura",
		rating: 3,
	},
	endurance: {
		onDamagingHit(damage, target, source, effect) {
			this.boost({ spd: 1 });
		},
		onStart(pokemon) { 
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
	},
		flags: {},
		name: "Endurance",
		rating: 4,
		num: 192,
	},

	bipolar: {
  onDamagingHit(damage, target, source, move) {
    if (!move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return; // once per turn

    const pool: BoostID[] = ['atk','def','spa','spd','spe'];

    const upChoices = pool.filter(s => target.boosts[s] < 6);
    const statUp = this.sample(upChoices.length ? upChoices : pool);

    const downChoices = pool.filter(s => s !== statUp && target.boosts[s] > -6);
    const statDown = this.sample(downChoices.length ? downChoices : pool.filter(s => s !== statUp));

    this.boost({[statUp]: 2}, target, target);
    this.boost({[statDown]: -1}, target, target);

    this.effectState.lastTurn = this.turn;
  },
  onStart(pokemon) { 
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);},
  name: "Bipolar",
  shortDesc: "When hit by a damaging move: +2 to a random stat and -1 to a different one (once/turn).",
  rating: 3,
},
wondershield: {
  name: "Wonder Shield",
  shortDesc: "When hit by a move, gains permanent immunity to that move's type. Announces immunities each turn.",
  rating: 3.5,

  // Cosmetic: show current runtime types on entry
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
  },

  // NEW: Per-hit immunity check (fires before each primary hit of multi-hit moves)
  onTryPrimaryHit(target, source, move) {
    const t = move?.type as string | undefined;
    const set = target?.m?.wsImmunities as Set<string> | undefined;
    if (t && set && set.has(t)) {
      this.add('-immune', target, '[from] ability: Wonder Shield');
      return null; // cancel this hit
    }
  },

  // (Optional) keep the broader onTryHit for single-hit moves & other edge timings
  onTryHit(target, source, move) {
    const t = move?.type as string | undefined;
    const set = target?.m?.wsImmunities as Set<string> | undefined;
    if (t && set && set.has(t)) {
      this.add('-immune', target, '[from] ability: Wonder Shield');
      return null;
    }
  },

  // Learn a new immunity as soon as a damaging hit connects
  onDamagingHit(damage, target, source, move) {
    if (!move || move.category === 'Status') return;
    const t = move.type as string | undefined;
    if (!t || t === '???' || t === 'Stellar') return;

    // init storage that persists through switching
    (target as any).m = target.m || {};
    const set = (target.m.wsImmunities ||= new Set<string>());

    if (!set.has(t)) {
      set.add(t);
      this.add('-ability', target, 'Wonder Shield');
      this.add('-message', `${target.name} became immune to ${t}-type moves!`);
      // From this point on, subsequent hits of a multi-hit move will be blocked
      // by onTryPrimaryHit above.
    }
  },

  // Start of each turn: announce current immunities (once per turn)
  onUpdate(pokemon) {
    const set = pokemon?.m?.wsImmunities as Set<string> | undefined;
    if (!set || set.size === 0) return;
    if (pokemon.m.wsLastAnnounceTurn === this.turn) return;
    pokemon.m.wsLastAnnounceTurn = this.turn;
    const list = Array.from(set).join('/');
    this.add('-message', `${pokemon.name} immunities: ${list}`);
  },
},

mirageview: {
  name: "Mirageview",
  shortDesc:
    "On 1st switch-in: first damaging hit is 0.25× and Illusion breaks. On later switch-ins: first damaging hit is 0.75× and Illusion breaks.",
  rating: 4,

  // Arm the correct mode each time this Pokémon enters
  onBeforeSwitchIn(pokemon) {
    // Pick a disguise from later, healthy teammates (respecting your Tera exceptions)
    const pool = pokemon.side.pokemon.filter((p, idx) =>
      idx > pokemon.position &&
      !p.fainted &&
      (!pokemon.terastallized || !['Ogerpon','Terapagos'].includes(p.species.baseSpecies))
    );
    pokemon.illusion = pool.length ? this.sample(pool) : null;

    // Per-battle flag: have we already spent the heavy reduction?
    const usedImmune = (pokemon as any)._mirageImmuneUsed === true;

    // Fresh volatile to track this stint on the field
    pokemon.addVolatile('mirageviewstate');
    const st = pokemon.volatiles['mirageviewstate'] as any;
    if (st) {
      st.armed = true;                           // first damaging hit this stint
      st.mode = usedImmune ? 'reduced' : 'immune'; // 'immune' now means 0.25× (not full negate)
    }
  },

  onStart(pokemon) {
    const cur = pokemon.illusion
      ? pokemon.illusion.getTypes(true).join('/')
      : pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  // Apply the correct damage scaling to the very first damaging hit this stint
  // 'immune' mode => 0.25× (first ever stint in the battle)
  // 'reduced' mode => 0.75× (on later stints)
  onSourceModifyDamage(damage, source, target, move) {
    if (!move || move.category === 'Status') return;
    const st = target.volatiles['mirageviewstate'] as any;
    if (!st || !st.armed) return;

    if (st.mode === 'immune' && target.illusion) {
      // 0.25× = 1024/4096
      return this.chainModify([1024, 4096]);
    }
    if (st.mode === 'reduced' && target.illusion) {
      // 0.75× = 3072/4096
      return this.chainModify([3072, 4096]);
    }
  },

  // When a damaging hit actually connects, consume the effect and break Illusion
  onDamagingHit(_dmg, target, _source, move) {
    if (!move || move.category === 'Status') return;
    const st = target.volatiles['mirageviewstate'] as any;
    if (!st || !st.armed) return;

    // We only intend to modify the *first* connecting hit of this stint, even in multi-hit
    st.armed = false;

    // If this was the first-ever stint’s heavy reduction, mark it spent for the battle
    if (st.mode === 'immune') {
      (target as any)._mirageImmuneUsed = true;
    }

    // Break Illusion on the first connecting damaging hit
    if (target.illusion) {
      const realName = target.species.name;
      target.illusion = null;
      this.add('-end', target, 'Illusion');
      this.add('-formechange', target, realName, '[from] ability: Mirageview');
    }
  },

  // Volatile container defaults
  condition: {
    onStart() {
      if (this.effectState.armed === undefined) this.effectState.armed = true;
      if (this.effectState.mode === undefined) this.effectState.mode = 'immune';
    },
  },
},




resourceful: {
  name: "Resourceful",
  shortDesc: "Whenever this Pokémon loses its item, it equips a random item from a curated list.",
	onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);},
  onAfterUseItem(item, pokemon) {
    if (pokemon.fainted || pokemon.item) return;
    const curatedIds = [
      'airballoon','assaultvest','blunderpolicy','choicescarf','choiceband','choicespecs',
      'covertcloak','expertbelt','focussash','heavydutyboots','kingsrock','leftovers','lifeorb',
      'lightclay','quickclaw','redcard','rockyhelmet','safetygoggles','scopelens','shellbell',
      'sitrusberry','weaknesspolicy','widelens','wiseglasses','muscleband',
      'charcoal','mysticwater','magnet','miracleseed','hardstone','sharpbeak','spelltag',
      'twistedspoon','metalcoat','dragonfang','nevermeltice','softsand','silverpowder',
      'poisonbarb','blackglasses','pixieplate',

      // Brushes (all 18 types)
      'normalbrush','firebrush','waterbrush','electricbrush','grassbrush','icebrush',
      'fightingbrush','poisonbrush','groundbrush','flyingbrush','psychicbrush','bugbrush',
      'rockbrush','ghostbrush','dragonbrush','darkbrush','steelbrush','fairybrush',

      // Custom items
      'heavyarmor','typedice','cookies','bulletproofvest','elegantcloth','armoredshell',
      'fuzzymushroom','adrenalineshot','speedbelt','typedrugs','typebulb',
    ];
    const id = this.sample(curatedIds);
    const newItem = this.dex.items.get(id);
    if (pokemon.setItem(newItem)) {
      this.add('-item', pokemon, newItem, '[from] ability: Resourceful');
    }
  },

  onTakeItem(item, pokemon, source) {
    this.add('-ability', pokemon, 'Resourceful');
    this.effectState.pendingRefill = true;
  },
  onAfterMoveSecondarySelf(pokemon, target, move) {
    if (!this.effectState.pendingRefill) return;
    this.effectState.pendingRefill = false;
    if (pokemon.fainted || pokemon.item) return;
    const curatedIds = [
      'airballoon','assaultvest','blunderpolicy','choicescarf','choiceband','choicespecs',
      'covertcloak','expertbelt','focussash','heavydutyboots','kingsrock','leftovers','lifeorb',
      'lightclay','quickclaw','redcard','rockyhelmet','safetygoggles','scopelens','shellbell',
      'sitrusberry','weaknesspolicy','widelens','wiseglasses','muscleband',
      'charcoal','mysticwater','magnet','miracleseed','hardstone','sharpbeak','spelltag',
      'twistedspoon','metalcoat','dragonfang','nevermeltice','softsand','silverpowder',
      'poisonbarb','blackglasses','pixieplate',
      'normalbrush','firebrush','waterbrush','electricbrush','grassbrush','icebrush',
      'fightingbrush','poisonbrush','groundbrush','flyingbrush','psychicbrush','bugbrush',
      'rockbrush','ghostbrush','dragonbrush','darkbrush','steelbrush','fairybrush',
      'heavyarmor','typedice','cookies','bulletproofvest','elegantcloth','armoredshell',
      'fuzzymushroom','adrenalineshot','speedbelt','typedrugs','typebulb',
    ];
    const id = this.sample(curatedIds);
    const newItem = this.dex.items.get(id);
    if (pokemon.setItem(newItem)) {
      this.add('-item', pokemon, newItem, '[from] ability: Resourceful');
    }
  },

  onUpdate(pokemon) {
    if (pokemon.item) return;
    if (this.effectState.checkedTurn === this.turn) return;
    this.effectState.checkedTurn = this.turn;
    const curatedIds = [
      'airballoon','assaultvest','blunderpolicy','choicescarf','choiceband','choicespecs',
      'covertcloak','expertbelt','focussash','heavydutyboots','kingsrock','leftovers','lifeorb',
      'lightclay','quickclaw','redcard','rockyhelmet','safetygoggles','scopelens','shellbell',
      'sitrusberry','weaknesspolicy','widelens','wiseglasses','muscleband',
      'charcoal','mysticwater','magnet','miracleseed','hardstone','sharpbeak','spelltag',
      'twistedspoon','metalcoat','dragonfang','nevermeltice','softsand','silverpowder',
      'poisonbarb','blackglasses','pixieplate',
      'normalbrush','firebrush','waterbrush','electricbrush','grassbrush','icebrush',
      'fightingbrush','poisonbrush','groundbrush','flyingbrush','psychicbrush','bugbrush',
      'rockbrush','ghostbrush','dragonbrush','darkbrush','steelbrush','fairybrush',
      'heavyarmor','typedice','cookies','bulletproofvest','elegantcloth','armoredshell',
      'fuzzymushroom','adrenalineshot','speedbelt','typedrugs','typebulb',
    ];
    const id = this.sample(curatedIds);
    const newItem = this.dex.items.get(id);
    if (pokemon.setItem(newItem)) {
      this.add('-item', pokemon, newItem, '[from] ability: Resourceful');
    }
  },

  rating: 3,
},
blastfurnace: {
  name: "Blast Furnace",
  shortDesc: "When hit by Fire: +3 random stat. After 5 hits: deal fixed 500 to foes, faint, then set Burning Field on both sides.",

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    (pokemon as any).m ||= {};
    pokemon.m.bfHits = 0;
    pokemon.m.bfExploding = false;
  },

  onDamagingHit(damage, target, source, move) {
    if (!move || move.category === 'Status') return;
    if (move.type !== 'Fire') return;

    // +3 to a random non-capped stat (fallback to any if all capped)
    const pool: BoostID[] = ['atk','def','spa','spd','spe'];
    const upChoices = pool.filter(s => target.boosts[s] < 6);
    const statUp = this.sample(upChoices.length ? upChoices : pool);
    this.boost({[statUp]: 3}, target, target);

    // Count Fire hits
    target.m.bfHits = (target.m.bfHits || 0) + 1;

    // Trigger at 3 Fire hits
    if (target.m.bfHits >= 3 && !target.m.bfExploding) {
      target.m.bfExploding = true;
      this.add('-activate', target, 'ability: Blast Furnace');

      // Fixed 500 direct damage to each opposing active (ignores abilities/screens/typing)
      const foes = target.side.foe.active;
      for (const foe of foes) {
        if (!foe || foe.fainted) continue;
        this.damage(500, foe, target); // direct HP loss, not a calculated move
      }

      // Apply Burning Field to BOTH sides
      const sides = [target.side, target.side.foe];
      for (const side of sides) {
        if (!side.getSideCondition('burningfield')) {
          side.addSideCondition('burningfield');
        }
      }

      // Faint the user after the blast
      if (!target.fainted) {
        this.add('-message', target.name + "'s Blast Furnace detonated!");
        target.faint();
      }

      // Reset for potential future cycles
      target.m.bfHits = 0;
      target.m.bfExploding = false;
    }
  },

  // If you prefer to reset on switch, uncomment:
  // onSwitchOut(pokemon) { if (pokemon?.m) pokemon.m.bfHits = 0; },

  rating: 4,
},
staticcollapse: {
  name: "Static Collapse",
  shortDesc: "On switch-in, randomly sets Electric→Boost/Ground→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Electric' : 'Ground';
    this.effectState.dropType  = pick ? 'Ground'   : 'Electric';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Static Collapse');
    this.add('-message', `${pokemon.name}'s Static Collapse: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Electric' : 'Ground';
    this.effectState.dropType  = pick ? 'Ground'   : 'Electric';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Static Collapse');
    this.add('-message', `${pokemon.name}'s Static Collapse: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

thawbloom: {
  name: "Thaw Bloom",
  shortDesc: "On switch-in, randomly sets Grass→Boost/Ice→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Grass' : 'Ice';
    this.effectState.dropType  = pick ? 'Ice'   : 'Grass';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Thaw Bloom');
    this.add('-message', `${pokemon.name}'s Thaw Bloom: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Grass' : 'Ice';
    this.effectState.dropType  = pick ? 'Ice'   : 'Grass';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Thaw Bloom');
    this.add('-message', `${pokemon.name}'s Thaw Bloom: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},


mythicbalance: {
  name: "Mythic Balance",
  shortDesc: "On switch-in, randomly sets Dragon→Boost/Fairy→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Dragon' : 'Fairy';
    this.effectState.dropType  = pick ? 'Fairy'  : 'Dragon';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Mythic Balance');
    this.add('-message', `${pokemon.name}'s Mythic Balance: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Dragon' : 'Fairy';
    this.effectState.dropType  = pick ? 'Fairy'  : 'Dragon';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Mythic Balance');
    this.add('-message', `${pokemon.name}'s Mythic Balance: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

zenfury: {
  name: "Zen Fury",
  shortDesc: "On switch-in, randomly sets Fighting→Boost/Psychic→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Fighting' : 'Psychic';
    this.effectState.dropType  = pick ? 'Psychic'  : 'Fighting';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Zen Fury');
    this.add('-message', `${pokemon.name}'s Zen Fury: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Fighting' : 'Psychic';
    this.effectState.dropType  = pick ? 'Psychic'  : 'Fighting';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Zen Fury');
    this.add('-message', `${pokemon.name}'s Zen Fury: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

twilightharmony: {
  name: "Twilight Harmony",
  shortDesc: "On switch-in, randomly sets Dark→Boost/Fairy→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Dark' : 'Fairy';
    this.effectState.dropType  = pick ? 'Fairy' : 'Dark';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Twilight Harmony');
    this.add('-message', `${pokemon.name}'s Twilight Harmony: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Dark' : 'Fairy';
    this.effectState.dropType  = pick ? 'Fairy' : 'Dark';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Twilight Harmony');
    this.add('-message', `${pokemon.name}'s Twilight Harmony: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

corrosioncore: {
  name: "Corrosion Core",
  shortDesc: "On switch-in, randomly sets Steel→Boost/Poison→Drop or vice versa. When hit by the boost type: +1 all; by the other: -1 all (once/turn).",
  rating: 3,
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Steel' : 'Poison';
    this.effectState.dropType  = pick ? 'Poison' : 'Steel';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Corrosion Core');
    this.add('-message', `${pokemon.name}'s Corrosion Core: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onSwitchIn(pokemon) {
    const pick = this.randomChance(1, 2);
    this.effectState.boostType = pick ? 'Steel' : 'Poison';
    this.effectState.dropType  = pick ? 'Poison' : 'Steel';
    this.effectState.lastTurn  = -1 as number;
    this.add('-ability', pokemon, 'Corrosion Core');
    this.add('-message', `${pokemon.name}'s Corrosion Core: ${this.effectState.boostType} empowers, ${this.effectState.dropType} weakens!`);
  },
  onDamagingHit(damage, target, source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;
    if (move.type === this.effectState.boostType) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}!`);
      this.effectState.lastTurn = this.turn;
    } else if (move.type === this.effectState.dropType) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}...`);
      this.effectState.lastTurn = this.turn;
    }
  },
},

pinata: {
  name: "Pinata",
  shortDesc:
    "On faint: sets 1 random hazard on the opposing side. If Spikes/Toxic Spikes are chosen, it may add multiple layers (weighted toward 1).",
  rating: 3,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  onFaint(pokemon) {
    const foeSide = pokemon.side.foe;
    /** Choose exactly one hazard */
    const hazards = ['stealthrock', 'spikes', 'toxicspikes', 'stickyweb'] as const;
    const chosen = this.sample(hazards) as ID;

    /** Decide layers with weighting toward 1 */
    let layers = 1;
    if (chosen === 'spikes') {
      // 1 layer ~70%, 2 layers ~20%, 3 layers ~10%
      const r = this.random(100);
      layers = (r < 10) ? 3 : (r < 30) ? 2 : 1;
    } else if (chosen === 'toxicspikes') {
      // 1 layer ~70%, 2 layers ~30%
      const r = this.random(100);
      layers = (r < 30) ? 2 : 1;
    } else {
      // stealthrock / stickyweb are single-layer hazards
      layers = 1;
    }

    for (let i = 0; i < layers; i++) {
      foeSide.addSideCondition(chosen, pokemon);
    }

    // Nice feedback message
    const pretty: Record<string, string> = {
      stealthrock: 'Stealth Rock',
      spikes: 'Spikes',
      toxicspikes: 'Toxic Spikes',
      stickyweb: 'Sticky Web',
    };
    const layerText = (chosen === 'spikes' || chosen === 'toxicspikes') ? ` (${layers} layer${layers > 1 ? 's' : ''})` : '';
    this.add('-message', `${pokemon.name}'s Piñata burst! ${pretty[chosen]} scattered onto the opposing side${layerText}.`);
  },
},

berrymaster: {
  name: "Berry Master",
  shortDesc: "Ripen + Gluttony + Cud Chew + Cheek Pouch.",

  // --- Gluttony flag (used by item/berry checks in PS) ---
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
    pokemon.abilityState.gluttony = true;
  },
  onDamage(item, pokemon) {
    // preserve your gluttony flag refresh
    pokemon.abilityState.gluttony = true;
  },

  // --- Cheek Pouch heal + Cud Chew bookkeeping + Ripen weaken tracking ---
  onEatItem(item, pokemon) {
  if (!item.isBerry) return;

  // Cheek Pouch: heal 1/3 max HP
  this.heal(pokemon.baseMaxhp / 3);

  // Ripen: remember if it was a resist berry
  const weakenBerries = [
    'Babiri Berry','Charti Berry','Chilan Berry','Chople Berry','Coba Berry','Colbur Berry',
    'Haban Berry','Kasib Berry','Kebia Berry','Occa Berry','Passho Berry','Payapa Berry',
    'Rindo Berry','Roseli Berry','Shuca Berry','Tanga Berry','Wacan Berry','Yache Berry',
  ];
  pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name);

  // Cud Chew: if this eat is a REPLAY, don't schedule another; otherwise arm 2-turn timer
  const m = (pokemon as any).m ?? ((pokemon as any).m = {});
  if (!m.bmCudReplay) {
    m.bmCud = { berry: item, dur: 2 };
  }
},

  // --- Ripen: double heals from berries; announce like your version ---
  onTryHeal(damage, target, _source, effect) {
    if (!effect) return;
    if (effect.name === 'Berry Juice' || effect.name === 'Leftovers') {
      this.add('-activate', target, 'ability: Ripen');
    }
    if ((effect as Item).isBerry) return this.chainModify(2);
  },

  // --- Ripen: double stat boosts from berries ---
  onChangeBoost(boost, _target, _source, effect) {
    if (effect && (effect as Item).isBerry) {
      let b: BoostID;
      for (b in boost) boost[b]! *= 2;
    }
  },

  // --- Ripen: if a resist berry weakened this hit, halve again (→ 1/4 total) ---
  onSourceModifyDamagePriority: -1,
  onSourceModifyDamage(damage, source, target, move) {
    if (target.abilityState.berryWeaken) {
      target.abilityState.berryWeaken = false;
      return this.chainModify(0.5);
    }
  },

  // --- Ripen's announce when a berry is about to be eaten (kept from your code) ---
  onTryEatItemPriority: -1,
  onTryEatItem(item, pokemon) {
    this.add('-activate', pokemon, 'ability: Ripen');
  },

  // --- Cud Chew: re-eat the same berry when the 2-turn volatile ends ---
  // (implemented with simple per-mon state to avoid separate Condition object)
  onResidualOrder: 28,
onResidualSubOrder: 2,
onResidual(pokemon) {
  const m = (pokemon as any).m;
  const state = m?.bmCud;
  if (!state) return;

  state.dur--;
  if (state.dur > 0) return;

  // consume the pending replay
  delete m.bmCud;
  if (!pokemon.hp) return;

  const item: Item | undefined = state.berry;
  if (!item) return;

  // Mark this eat as a replay so onEatItem won't re-arm another Cud Chew
  m.bmCudReplay = true;

  this.add('-activate', pokemon, 'ability: Cud Chew');
  this.add('-enditem', pokemon, item.name, '[eat]');

  if (this.singleEvent('Eat', item, null, pokemon, null, null)) {
    this.runEvent('EatItem', pokemon, null, null, item);
  }
  if (item.onEat) pokemon.ateBerry = true;

  // Clear the replay flag so future (new) berries can schedule again
  delete m.bmCudReplay;
},
},

wonderwheel: {
  name: "Wonder Wheel",
  shortDesc: "Each turn picks one of the user's weaknesses. If it has only one weakness, that type does 1/2 damage; otherwise, the chosen type is immune.",
  flags: {breakable: 1},

  // Roll on switch-in and announce
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
    const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);

    const TYPES: string[] = [
      'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground',
      'Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];

    // Pick only true weaknesses and exclude anything already immune this turn
    const weakTo = TYPES.filter(t => {
      // Exclude existing immunities:
      // - Type-chart immunities (e.g., Fighting->Ghost, Normal->Ghost, etc.)
      // - Ground when not grounded (Flying, Levitate, Magnet Rise, Air Balloon, etc.)
      if (!this.dex.getImmunity(t as any, pokemon)) return false;      // already immune
      if (t === 'Ground' && !pokemon.isGrounded()) return false;       // airborne/levitating
      return this.dex.getEffectiveness(t as any, pokemon) > 0;         // keep only weaknesses
    });

    const m = ((pokemon as any).m ??= {});

    if (weakTo.length) {
      const chosen = this.sample(weakTo) as string;
      m.wonderWheelType = chosen;
      m.wonderWheelHalf = (weakTo.length === 1); // exactly one weakness => halve instead of immune

      if (m.wonderWheelHalf) {
        this.add('-message', `${pokemon.name} is shrouded in a wondrous veil and ${chosen}-type moves deal half damage this turn!`);
      } else {
        this.add('-message', `${pokemon.name} is shrouded in a wondrous veil and is immune to ${chosen}-type moves this turn!`);
      }
    } else {
      m.wonderWheelType = undefined;
      m.wonderWheelHalf = false;
      this.add('-message', `${pokemon.name} is shrouded in a wondrous veil!`);
    }
  },

  // Re-roll at the end of every turn
  onResidualOrder: 27,
  onResidual(pokemon) {
    if (!pokemon.hp) return;

    const TYPES: string[] = [
      'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground',
      'Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];

    const weakTo = TYPES.filter(t => {
      if (!this.dex.getImmunity(t as any, pokemon)) return false;      // already immune
      if (t === 'Ground' && !pokemon.isGrounded()) return false;       // airborne/levitating
      return this.dex.getEffectiveness(t as any, pokemon) > 0;         // keep only weaknesses
    });

    const m = ((pokemon as any).m ??= {});

    if (!weakTo.length) {
      m.wonderWheelType = undefined;
      m.wonderWheelHalf = false;
      return;
    }

    const chosen = this.sample(weakTo) as string;
    m.wonderWheelType = chosen;
    m.wonderWheelHalf = (weakTo.length === 1);

    if (m.wonderWheelHalf) {
      this.add('-message', `${pokemon.name}'s Wonder Wheel shifts — ${chosen}-type moves deal half damage this turn!`);
    } else {
      this.add('-message', `${pokemon.name}'s Wonder Wheel shifts — ${chosen}-type moves are negated this turn!`);
    }
  },

  // Immunity when multiple weaknesses (chosen type) and not the half case
  onTryHit(target, _source, move) {
    if (!move || !move.type) return;
    const m = (target as any).m || {};
    const chosen = m.wonderWheelType as string | undefined;
    const half = !!m.wonderWheelHalf;
    if (!chosen || move.type !== chosen) return;
    if (half) return; // half-damage case handled below
    this.add('-immune', target, '[from] ability: Wonder Wheel');
    return null;
  },

  // Half damage when there is exactly one weakness
  onSourceModifyDamage(damage, _source, target, move) {
    const m = (target as any).m || {};
    const chosen = m.wonderWheelType as string | undefined;
    if (!m.wonderWheelHalf || !chosen) return;
    if (!move || move.category === 'Status' || move.type !== chosen) return;
    return this.chainModify(0.5);
  },
},



kpopsinger: {
  name: "Kpop Singer",
  shortDesc: "Each end of turn: user +1 to one random stat; opposing actives -1 to one random stat.",
  rating: 5,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  onBasePowerPriority: 7,
  onBasePower(basePower, attacker, defender, move) {
    if (move.flags['sound']) {
      this.debug('Punk Rock boost');
      return this.chainModify([5325, 4096]);
    }
  },
  onSourceModifyDamage(damage, source, target, move) {
    if (move.flags['sound']) {
      this.debug('Punk Rock weaken');
      return this.chainModify(0.5);
    }
  },

  // End-of-turn pulse
  onResidualOrder: 27,
onResidual(pokemon) {
  if (!pokemon.hp) return;

  // Exclude accuracy/evasion
  const pool: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe'];

  for (const side of this.sides) {
    for (const mon of side.active) {
      if (!mon || !mon.hp) continue;

      if (mon.side === pokemon.side) {
        // Allies: +1 to a random stat
        const stat: BoostID = this.sample(pool);
        const boosts: Partial<BoostsTable> = {};
        boosts[stat] = 1;
        this.boost(boosts, mon, pokemon, this.effect);
        this.add('-message', `${mon.name} was hyped up by Kpop Singer! (+1 ${stat})`);
      } else {
        // Foes: +1 to one stat, -1 to a different stat
        const up: BoostID = this.sample(pool);
        const down: BoostID = this.sample(pool.filter(s => s !== up));

        const boostsUp: Partial<BoostsTable> = {};
        boostsUp[up] = 1;
        this.boost(boostsUp, mon, pokemon, this.effect);
        this.add('-message', `${mon.name} was hyped up by Kpop Singer! (+1 ${up})`);

        const boostsDown: Partial<BoostsTable> = {};
        boostsDown[down] = -1;
        this.boost(boostsDown, mon, pokemon, this.effect);
        this.add('-message', `${mon.name} was thrown off by Kpop Singer! (-1 ${down})`);
      }
    }
  }
},


},

hazyaura: {
  name: "Hazy Aura",
  shortDesc: "On switch-in, clears stat boosts of adjacent foes.",
  rating: 3,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    for (const foe of pokemon.adjacentFoes()) {
      foe.clearBoosts();
      this.add('-clearboost', foe, '[from] ability: Hazy Aura', `[of] ${pokemon}`);
    }
  },
},

farmer: {
	name: "Farmer",
	rating: 5,
	onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
	this.field.setWeather('sunnyday');
	},
	onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (this.field.isWeather(['sunnyday', 'desolateland']) || this.randomChance(1, 2)) {
				if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
					pokemon.setItem(pokemon.lastItem);
					pokemon.lastItem = '';
					this.add('-item', pokemon, pokemon.getItem(), '[from] ability: Harvest');
				}
			}
		},
},
poisonmaster: {
	name: "Poison Master",
	shortDesc: "Contact moves used or received have a 30% chance to poison. Always crit poisoned targets",
	rating: 4,
	onStart(pokemon) { 
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
		},
	onDamagingHit(damage, target, source, move) {
			if (this.checkMoveMakesContact(move, source, target)) {
				if (this.randomChance(3, 10)) {
					source.trySetStatus('psn', target);
				}
			}
		},
	onSourceDamagingHit(damage, target, source, move) {
			// Despite not being a secondary, Shield Dust / Covert Cloak block Poison Touch's effect
			if (target.hasAbility('shielddust') || target.hasItem('covertcloak')) return;
			if (this.checkMoveMakesContact(move, target, source)) {
				if (this.randomChance(3, 10)) {
					target.trySetStatus('psn', source);
				}
			}
		},
	onModifyCritRatio(critRatio, source, target) {
			if (target && ['psn', 'tox'].includes(target.status)) return 5;
		},

},
hypnoticeyes: {
  name: "Hypnotic Eyes",
  shortDesc: "End of each turn: 5→10→20→40→80→100% to sleep the opposing active. Resets on success.",
  onStart(pokemon) {
    // ── your snippet ──
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types (kept for future use)
    this.add('-start', pokemon, 'typechange', cur);
    // ── ability init ──
    this.effectState.steps = 0;
  },
  
  onResidual(pokemon) {
    const foe = pokemon.side.foe.active[0];
    if (!foe || foe.fainted) { this.effectState.steps = 0; return; }
    if (foe.status === 'slp') { this.effectState.steps = 0; return; }

    const ladder = [5, 10, 20, 40, 80, 100];
    const idx = Math.min(this.effectState.steps ?? 0, ladder.length - 1);
    const chance = ladder[idx];

    if (this.randomChance(chance, 100)) {
      if (foe.trySetStatus('slp', pokemon)) this.effectState.steps = 0;
    } else {
      this.effectState.steps = idx + 1;
    }
  },
},

// 2) Rainbow — all 18 types at once
rainbow: {
  name: "Rainbow",
  shortDesc: "This Pokémon is all 18 types at once.",
  onStart(pokemon) {
    const allTypes = [
      'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
      'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];
    pokemon.setType(allTypes);
    this.add('-start', pokemon, 'typechange', allTypes.join('/'), '[from] ability: Rainbow');
  },
},


// 4) Normalize (random type each time it attacks)
normalizeplus: {
  name: "Normalize Plus",
  shortDesc: "Damaging moves change to a random type on use (announced).",
  onStart(pokemon) { 
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
		},
  onModifyType(move, pokemon) {
    if (move.category === 'Status' || !move.type) return;

    const pool = [
      'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
      'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];
    const newType = this.sample(pool);

    move.type = newType;
    this.add('-message', `${pokemon.name}'s Normalize+ changed ${move.name} to ${newType}-type!`);
  },
},


// 5) Guard Stance — each turn, become weak to up to 4 random types (announced)
guardstance: {
  name: "Guard Stance",
  shortDesc:
    "End of each turn: roll 1–4 weaknesses and 4–8 resists; others neutral next turn. Ignores innate immunities.",
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
    this.effectState.ready = false;
  },

  onResidualOrder: 28,
  onResidualSubOrder: 2,
  onResidual(pokemon) {
    if (pokemon.fainted) return;

    // local unique sampler (no helpers)
    const drawMany = (choices: string[], count: number): string[] => {
      const bag = choices.slice();
      const take = Math.min(count, bag.length);
      const out: string[] = [];
      for (let i = 0; i < take; i++) {
        const idx = (this as any).random(bag.length);
        out.push(bag.splice(idx, 1)[0]);
      }
      return out;
    };

    const pool = this.dex.types.names().filter(t => t !== 'Stellar' && t !== '???');

    const weakCount = (this as any).random(2, 5);
    const weakList = drawMany(pool, weakCount);

    const remaining = pool.filter(t => !weakList.includes(t));
    const resistCount = (this as any).random(3, 7);
    const resistList = drawMany(remaining, resistCount);

    this.effectState.weak = new Set(weakList);
    this.effectState.resist = new Set(resistList);
    this.effectState.ready = true;

    this.add('-message',
      `${pokemon.name} shifts its guard! Weak to: ${weakList.join(', ') || '—'}. ` +
      `Resists: ${resistList.join(', ') || '—'}. Others are neutral.`);
  },

  // Make everything neutral after the first roll; apply our sets
  onEffectiveness(typeMod, target, type, move) {
  if (!this.effectState.ready || !move || move.effectType !== 'Move') return;
  // Tell the engine what the matchup *is* this turn so the UI shows messages.
  if (this.effectState.weak?.has(move.type))  return  1;  // super effective (×2)
  if (this.effectState.resist?.has(move.type)) return -1; // resisted (×0.5)
  return 0; // neutral
},

// Remove this entirely if you had it before:
// onSourceModifyDamage(...) { ... }

onNegateImmunity(pokemon, type) {
  if (!this.effectState.ready) return;
  // Ignore innate type immunities (Normal→Ghost, Ground→Flying, etc.)
  if (type) return true;
},
},



// 6) Berry Forager — generates and immediately eats a random Berry each turn
berryforager: {
  name: "Berry Forager",
  shortDesc: "End of each turn: generates a random curated Berry and eats it immediately.",
  onResidual(pokemon) {
    if (pokemon.fainted) return;

    // Curated list (stat boosters, custap, sitrus, lum)
    const curated = [
      'Liechi Berry','Ganlon Berry','Salac Berry','Petaya Berry','Apicot Berry',
      'Lansat Berry','Starf Berry','Micle Berry','Custap Berry',
      'Sitrus Berry','Lum Berry',
    ];

    // If the holder has a major status, force Lum Berry
    const forcedLum = !!pokemon.status;
    const pickName = forcedLum ? 'Lum Berry' : (this as any).sample(curated);
    const item = this.dex.items.get(pickName);
    if (!item?.isBerry) return;

    // Temporarily replace held item
    const original = pokemon.getItem();
    if (original?.id) pokemon.takeItem();
    pokemon.setItem(item);

    const consumed = pokemon.eatItem(true);
    if (consumed) {
      this.add('-message', `${pokemon.name} foraged and ate a ${item.name}!`);

      // If Custap was eaten, prime next action priority
      if (item.id === 'custapberry') {
  			pokemon.addVolatile('bfp' as ID);
  			this.add('-message', `${pokemon.name}'s Custap primed its next action!`);
		}
    } else {
      // If the berry couldn't be used now, discard it to avoid overriding held item
      if (pokemon.item) pokemon.takeItem();
    }

    // Restore original item (if any)
    if (original?.id) pokemon.setItem(original);
  },

  // Fallback not needed since you said ultimateberrypriority exists, but harmless if left:
  onModifyPriority(priority, source, target, move) {
    if (this.effectState?.custapPrimed && move) {
      this.effectState.custapPrimed = false;
      return priority + 1;
    }
  },
  onSwitchOut(pokemon) {
    if (this.effectState) this.effectState.custapPrimed = false;
  },
},


slapback: {
  name: "Slapback",
  shortDesc: "Reflects damage back: 75%/50%/25%/100% in a repeating cycle.",
  onStart(pokemon) { 
    const cur = pokemon.getTypes(true).join('/'); // runtime types 
    const base = pokemon.species.types.join('/'); // species types 
    this.add('-start', pokemon, 'typechange', cur);
    this.effectState.hitCount = 0; // track how many times it's been hit
  },
  onDamagingHit(damage, target, source, move) {
    if (!source || !damage) return;

    // Increment hit counter
    this.effectState.hitCount = (this.effectState.hitCount || 0) + 1;

    // Determine multiplier based on hit number (cycles every 4 hits)
    const cycle = this.effectState.hitCount % 4;
    let mult = 0.75; // default to first case
    if (cycle === 2) mult = 0.50;
    else if (cycle === 3) mult = 0.25;
    else if (cycle === 0) mult = 1.0;

    const ret = Math.max(1, Math.floor(damage * mult));
    this.damage(ret, source, target, this.dex.abilities.get('Slapback'));
  },
},


// 8) Weatherman — summons a random weather on switch-in
weatherman: {
  name: "Weatherman",
  shortDesc: "On switch-in, sets a random weather: Sun, Rain, Sandstorm, or Snow.",
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    if (this.suppressingAbility?.(pokemon)) return;

    this.add('-ability', pokemon, 'Weatherman');

    const choice = this.sample(['sunnyday', 'raindance', 'sandstorm', 'snowscape']);

    // IMPORTANT: check success
    const success = this.field.setWeather(choice);

    if (!success) {
      // Force a visible debug message so you know it attempted
      this.add('-message', `(Weatherman tried to set ${choice}, but it failed.)`);
    }
  },

  // B) Also trigger when the Pokémon GAINS the ability mid-battle (Skill Swap / Wandering Spirit / etc.)
  onUpdate(pokemon) {
    if (!pokemon.isActive || pokemon.fainted) return;
    if (this.suppressingAbility?.(pokemon)) return;

    // prevent spam: only do this once per time the ability is gained
    // @ts-ignore
    if ((pokemon as any).m?.weathermanApplied) return;
    // @ts-ignore
    ((pokemon as any).m ??= {}).weathermanApplied = true;

    this.add('-ability', pokemon, 'Weatherman');

    const choice = this.sample(['sunnyday', 'raindance', 'sandstorm', 'snow']);
    const success = this.field.setWeather(choice);

    if (!success) {
      this.add('-message', `(Weatherman tried to set ${choice}, but it failed.)`);
    }
  },

  // reset the “applied” flag if it loses the ability
  onEnd(pokemon) {
    // @ts-ignore
    if ((pokemon as any).m) (pokemon as any).m.weathermanApplied = false;
  },
},


// 9) Torrential Blizzard — Snow on entry; takes half damage from Ice’s weakness types
torrentialblizzard: {
  name: "Torrential Blizzard",
  shortDesc: "On switch-in: Snowscape. While Snowscape is active: chip damage to non-Ice; Fire/Fighting/Rock/Steel moves deal 0.5×.",
  onStart(pokemon) {
    // Set Snowscape (Gen 9 "snow")
    if (!this.field.isWeather('snowscape')) {
      this.field.setWeather('snowscape', pokemon, this.effect);
    }
    // Add our custom overlay condition
    if (!this.field.pseudoWeather['torrentialblizzardfield']) {
      this.field.addPseudoWeather('torrentialblizzardfield', pokemon, this.effect);
    }
	this.add('-message', `The Blizzard is extremely strong!`);

    // Optional type-change debug you had before
    const cur = pokemon.getTypes(true).join('/');
	const base = pokemon.species.types.join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },
},



// 10) Sandy Hurricane — sets Sandstorm on entry (heavy sand flavor)
sandyhurricane: {
  name: "Sandy Hurricane",
  shortDesc: "On switch-in: Sandstorm.",
  onStart(pokemon) { if (!this.field.isWeather('sandstorm')) this.field.setWeather('sandstorm');
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
   },
},

// 11) Momentum Burst — +1 random stat every time it enters the field
momentumburst: {
  name: "Momentum Burst",
  shortDesc: "On switch-in: +1 to a random stat.",
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
    const stat = this.sample(['atk','def','spa','spd','spe']);
    const boost: Partial<StatsTable> = {}; (boost as any)[stat] = 1;
    this.boost(boost, pokemon);
  },
},

// 12) Anti-switcher — while holder is active, foes take 1/3 max HP when they switch out
antiswitcher: {
  name: "Anti-switcher",
  shortDesc: "Opposing Pokémon take 1/3 max HP when they switch out while this is active.",
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
	this.add('-ability', pokemon, 'Anti-switcher');
    this.add('-message', `${pokemon.name}'s Anti-switcher will punish swaps!`);
    pokemon.side.foe.addSideCondition('antiswitchertrap', pokemon);
  },
  onEnd(pokemon) {
    pokemon.side.foe.removeSideCondition('antiswitchertrap');
  },
},

specialist: {
  name: "Specialist",
  shortDesc: "This Pokémon's physical attacks are treated as special (uses SpA vs. SpD).",
  rating: 3,
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
  },

  // Convert the user's PHYSICAL damaging moves into SPECIAL before calc.
  onModifyMove(move, attacker) {
    // Skip status and template/true-damage moves
    if (!move || move.category === 'Status') return;
    if (move.damage || move.damageCallback) return;

    // Only convert Physical moves
    if (move.category !== 'Physical') return;

    // Edge cases where "Physical→Special" produces nonsense – leave them alone
    const exceptions = new Set<string>([
      'bodypress',  // uses user's Def as attacking stat
      'foulplay',   // uses target's Atk
      'beatup',     // party-based snapshots
    ]);
    if (exceptions.has(move.id)) return;

    // Flip the move to Special. This makes calc use SpA vs. SpD automatically.
    move.category = 'Special';

    // (Optional) keep contact/flags exactly as original
    // If you want to strip contact on conversion, uncomment:
    // if (move.flags?.contact) move.flags.contact = 0;

    // (Optional) debug
    // this.add('-message', `${attacker.name}'s Specialist made ${move.name} Special!`);
  },
},
physicalist: {
  name: "Physicalist",
  shortDesc: "This Pokémon's special attacks are treated as physical (uses Atk vs. Def).",
  rating: 3,
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
  },

  onModifyMove(move, attacker) {
    // Skip status and template/true-damage moves
    if (!move || move.category === 'Status') return;
    if (move.damage || move.damageCallback) return;

    // Only convert Special moves
    if (move.category !== 'Special') return;

    // Edge cases where "Special→Physical" produces nonsense – leave them alone
    const exceptions = new Set<string>([
      'psyshock',   // already uses Def instead of SpD
      'psystrike',  // same
      'secretsword' // same
    ]);
    if (exceptions.has(move.id)) return;

    // Flip the move to Physical. This makes calc use Atk vs. Def automatically.
    move.category = 'Physical';

    // (Optional) debug
    // this.add('-message', `${attacker.name}'s Physicalist made ${move.name} Physical!`);
  },
},
chimneysweep: {
  name: "Chimney Sweep",
  shortDesc: "On switch-in, removes all entry hazards (including custom ones) from both sides.",
  rating: 3,

  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);
    const hazards: string[] = [
      'spikes',
      'toxicspikes',
      'stealthrock',
      'stickyweb',
      'gmaxsteelsurge',
      'poop',
      'burningfield',
	  'gasoline',
    ];

    for (const side of this.sides) {
      for (const hazard of hazards) {
        if (side.removeSideCondition(hazard)) {
          this.add(
            '-sideend',
            side,
            this.dex.conditions.get(hazard).name,
            '[from] ability: Chimney Sweep',
            '[of] ' + pokemon
          );
        }
      }
    }
  },
},
yinyang: { 
  name: "Yin Yang",
  shortDesc:
    "On switch-in, randomly picks 9 types to empower and 9 to weaken. When hit: boost types +1 all; drop types -1 all (once/turn).",
  rating: 3,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur, '[from] ability: Yin Yang');

    // Roll the 9/9 partition
    const ALL: string[] = [
      'Normal','Fire','Water','Electric','Grass','Ice',
      'Fighting','Poison','Ground','Flying','Psychic','Bug',
      'Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];
    const pool = ALL.slice();
    const boost: string[] = [];
    for (let i = 0; i < 9; i++) {
      const idx = this.random(pool.length);
      boost.push(pool.splice(idx, 1)[0]);
    }
    const drop = pool; // remaining 9

    this.effectState.boostSet = new Set<string>(boost);
    this.effectState.dropSet  = new Set<string>(drop);
    this.effectState.lastTurn = -1 as number;

    this.add('-ability', pokemon, 'Yin Yang');
    // Split into multiple lines so both parts always display
    this.add('-message', `${pokemon.name}'s Yin Yang rearranged energies!`);
    this.add('-message', `Boost: ${boost.join('/')}`);
    this.add('-message', `Drop: ${drop.join('/')}`);
  },

  onSwitchIn(pokemon) {
    // Reroll each re-entry (remove this block if you want it to persist)
    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur, '[from] ability: Yin Yang');

    const ALL: string[] = [
      'Normal','Fire','Water','Electric','Grass','Ice',
      'Fighting','Poison','Ground','Flying','Psychic','Bug',
      'Rock','Ghost','Dragon','Dark','Steel','Fairy',
    ];
    const pool = ALL.slice();
    const boost: string[] = [];
    for (let i = 0; i < 9; i++) {
      const idx = this.random(pool.length);
      boost.push(pool.splice(idx, 1)[0]);
    }
    const drop = pool;

    this.effectState.boostSet = new Set<string>(boost);
    this.effectState.dropSet  = new Set<string>(drop);
    this.effectState.lastTurn = -1 as number;

    this.add('-ability', pokemon, 'Yin Yang');
    this.add('-message', `${pokemon.name}'s Yin Yang rearranged energies!`);
    this.add('-message', `Boost: ${boost.join('/')}`);
    this.add('-message', `Drop: ${drop.join('/')}`);
  },

  onDamagingHit(damage, target, _source, move) {
    if (!damage || !move || move.category === 'Status') return;
    if (this.effectState.lastTurn === this.turn) return;

    const boostSet = this.effectState.boostSet as Set<string> | undefined;
    const dropSet  = this.effectState.dropSet  as Set<string> | undefined;

    if (boostSet?.has(move.type)) {
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, target, target, this.effect);
      this.add('-message', `${target.name} is empowered by ${move.type}! (+1 all)`);
      this.effectState.lastTurn = this.turn;
    } else if (dropSet?.has(move.type)) {
      this.boost({atk: -1, def: -1, spa: -1, spd: -1, spe: -1}, target, target, this.effect);
      this.add('-message', `${target.name} is weakened by ${move.type}... (-1 all)`);
      this.effectState.lastTurn = this.turn;
    }
  },
},
bottomfeeder: {
    name: "Bottom Feeder",
    shortDesc: "When hit by a move, heals 5–50% of damage taken (skewed low).",
	onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);},
    // Rough average ≈ 20% (since E[r^2] = 1/3, so 0.05 + 0.45*(1/3) ≈ 0.20)
    onDamagingHit(damage, target, source, move) {
      // Only trigger for real damage from a move and if the target is still alive
      if (!damage || target.hp <= 0) return;

      // Quadratic skew: favors lower values but still allows high rolls
      const r = this.random();            // r in [0, 1)
      const frac = 0.05 + 0.45 * (r * r); // 5%..50%, skewed toward 5%

      // Heal is based on the damage just taken
      const healAmount = this.clampIntRange(
        Math.floor(damage * frac),
        1,
        target.maxhp - target.hp
      );
      if (healAmount > 0) {
        this.heal(healAmount, target, target, this.effect);
        // Optional: uncomment if you want visible roll info each time
        // this.add('-message', `${target.name}'s Bottom Feeder restored ~${Math.round(frac * 1000) / 10}% of the damage!`);
      }
    },
    rating: 3.5,
    num: -1001, // custom id
  },
  fordf150: {
		onStart(source) {
			const pokemon = source;
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);
			this.field.setTerrain('allterrain');
		},
		
flags: {},
		name: "Ford F150",
		rating: 3.5,
		num: 999,
	},
	webslinger: {
		onStart(pokemon) {
			const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Webslinger', 'boost');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					this.boost({ spe: -1 }, target, pokemon, null, true);
				}
			}
		},
		
		flags: {},
		name: "Webslinger",
		rating: 3.5,
		num: -12,
	},
	attraction: {
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    this.add('-ability', pokemon, 'Attraction');
    for (const target of pokemon.adjacentFoes()) {
      if (!target || target.fainted || !target.isActive) continue;
      // Force infatuation-like effect regardless of gender, Sub, Safeguard, etc.
      if (!target.volatiles['attractionvolatile']) {
        this.add('-start', target, 'Attract', '[from] ability: Attraction', `[of] ${pokemon.name}`);
        target.addVolatile('attractionvolatile', pokemon);
      }
    }
  },
  flags: {},
  name: "Attraction",
  rating: 3.5,
},


	twisteddimensions: {
  name: "Twisted Dimensions",
  shortDesc: "While active, reverses type effectiveness; immunities become weaknesses.",
  desc: "While this Pokémon is active, type effectiveness is inverted for all Pokémon. Resistances become weaknesses, weaknesses become resistances, immunities become super-effective.",
  rating: 5,
  onStart(pokemon) {
	const cur = pokemon.getTypes(true).join('/'); // runtime types 
			const base = pokemon.species.types.join('/'); // species types 
			this.add('-start', pokemon, 'typechange', cur);
    this.add('-ability', pokemon, 'Twisted Dimensions');
    this.add('-message', `Twisted Dimensions distorted reality! Type effectiveness is reversed!`);
    this.field.addPseudoWeather('twisteddimensions');
  },
  onEnd(pokemon) {
    if (this.field.getPseudoWeather('twisteddimensions')) {
      this.field.removePseudoWeather('twisteddimensions');
      this.add('-message', `The world returns to normal as Twisted Dimensions fades!`);
    }
  },
},
stampede: {
		onModifyPriority(priority, pokemon, target, move) {
			if ((move?.type === 'Ground' || move?.type === 'Normal') && pokemon.hp === pokemon.maxhp) return priority + 1;
		},
		onStart(pokemon) { 
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);
		},
		flags: {},
		name: "Stampede",
	},
phantomcore: {
  name: "Phantom Core",

  // Show runtime types on switch-in (your original effect)
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  // Reduce INCOMING Fairy damage to the holder by 50%
  // (This runs on the target; correct hook for mitigating incoming damage.)
  onSourceModifyDamage(damage, source, target, move) {
    if (move.type === 'Fairy') {
      this.debug('Phantom Core Fairy resist');
      return this.chainModify(0.5);
    }
  },

  // Heal 75% of DAMAGE DEALT by the holder's Ghost-type moves
  // Runs after the move resolves; `move.totalDamage` is the sum you dealt.
  onAfterMoveSecondarySelf(pokemon, target, move) {
    if (!move || move.category === 'Status') return;
    if (move.type !== 'Ghost') return;

    // PS sets totalDamage only for damaging moves that actually hit
    const total = (move as any).totalDamage;
    if (!total || typeof total !== 'number' || total <= 0) return;

    const healAmount = Math.floor(total * 0.75);
    if (healAmount > 0 && pokemon.hp && !pokemon.fainted) {
      this.heal(healAmount, pokemon, pokemon, move);
      this.add('-ability', pokemon, 'Phantom Core');
    }
  },
},

shapeshifter: {
  name: "Shapeshifter",
  shortDesc: "Random pokemon yo",
  onSwitchIn(pokemon) {
    if (pokemon.fainted) return;

    // Preserve current HP ratio (no healing/cures)
    const hpRatio = Math.max(0, pokemon.hp) / Math.max(1, pokemon.maxhp);

    // Build a valid pool: fully-evolved, not battle-only/mega/primal/gmax, standard,
// and exclude legendaries, sublegendaries, and mythicals
const pool = this.dex.species.all().filter(s =>
  s.exists &&
  !s.nfe &&
  !(s as any).isNonstandard &&
  !(s as any).battleOnly &&
  !(s as any).isMega &&
  !(s as any).isPrimal &&
  !(s as any).isGigantamax /**&&
  !(s as any).isLegendary &&        // exclude legendaries
  !(s as any).isMythical &&         // exclude mythicals
  !(s as any).isSubLegendary &&     // exclude sublegendaries (if field exists)
  !(s.tags && (
    s.tags.includes('Restricted Legendary') ||
    s.tags.includes('Sub-Legendary') ||
    s.tags.includes('Mythical')
  )) **/
);

if (!pool.length) return;


    // Try to avoid a no-op (same species) a few times
    let species = this.sample(pool);
    for (let i = 0; i < 4 && pool.length > 1 && species.name === pokemon.species.name; i++) {
      species = this.sample(pool);
    }
    if (species.name === pokemon.species.name) return;

    // Change species WITHOUT touching moves/item/status/boosts
    // NOTE: formeChange emits the correct -formechange; do NOT add your own log
    pokemon.formeChange(species, this.effect, true);

    // Make Shapeshifter persist across switch-outs/in
    pokemon.baseAbility = 'shapeshifter' as ID;

    // ----- EV / Nature adjustment based on the new species -----
    const stats = species.baseStats;
    const atk = stats.atk;
    const spa = stats.spa;
    const spe = stats.spe;

    // Best/worst offense among Atk/SpA
    const bestAtk: 'atk' | 'spa' = atk >= spa ? 'atk' : 'spa';
    const worstAtk: 'atk' | 'spa' = atk >= spa ? 'spa' : 'atk';

    // Build EVs (must be a full StatsTable)
    const newEVs: StatsTable = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
    newEVs[bestAtk] = 252;
    if (spe > 80) {
      newEVs.spe = 252;
    } else {
      newEVs.hp = 252;
    }

    // Apply EVs
    pokemon.set.evs = newEVs;
	// Failsafe: max out IVs (prevents 0 Atk IVs on special attackers, etc.)
	const newIVs: StatsTable = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
	pokemon.set.ivs = newIVs;

    // Nature: boost best offense, drop worst offense
    // (Use plain string to avoid NatureName typing issues.)
    const natureMap: Record<string, string> = {
      'atk:spa': 'Adamant',
      'atk:spe': 'Brave',   // if you ever want to key off 'spe' specifically
      'spa:atk': 'Modest',
      'spa:spe': 'Quiet',
    };
    const nature: string = natureMap[`${bestAtk}:${worstAtk}`] ?? 'Serious';
    pokemon.set.nature = nature;

    // Recalculate stats from pokemon.set (EVs/IVs/Nature) and keep HP%
    // setSpecies() re-derives stored stats/maxhp/etc without changing moves or volatiles
    pokemon.setSpecies(pokemon.species);
	// Ensure our move-category logic persists regardless of active ability
	if (!pokemon.volatiles['shapeshiftermovecat']) {
		pokemon.addVolatile('shapeshiftermovecat' as ID);}


    // Restore exact HP%
    const targetHP = Math.max(1, Math.min(pokemon.maxhp, Math.floor(pokemon.maxhp * hpRatio)));
    pokemon.sethp(targetHP);
    (pokemon as any).lastDamage = 0;
    (pokemon as any).hurtThisTurn = false;
  },

  // Record the original/base ability once so you can optionally re-add it innately (commented above)
  onStart(pokemon) {
    if ((this.effectState as any).origAbility == null) {
      (this.effectState as any).origAbility = pokemon.baseAbility as ID;
    }
    // Also make sure future switch-ins keep Shapeshifter as base
    pokemon.baseAbility = 'shapeshifter' as ID;
  },
},
magmavein: {
  name: "Magma Vein",
  shortDesc:
    "Halves Water damage; when hit by OR when using a Water move, sets Steam Field on the opposing side (3 turns).",
onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  // Halve Water damage taken
  onSourceModifyDamage(damage, source, target, move) {
    if (move.type === 'Water') {
      return this.chainModify(0.5);
    }
  },

  // If HIT by a Water move, steam the attacker's side
  onDamagingHit(damage, target, source, move) {
    if (!source?.side || move.type !== 'Water') return;
    const foeSide = source.side;
    foeSide.addSideCondition('steamfield', target);
    const sc = foeSide.sideConditions['steamfield'];
    if (sc) sc.duration = 4; // refresh to 3
    this.add('-message', `${target.name}'s Magma Vein filled the foe’s side with steam!`);
  },

  // After THIS mon uses a Water move (hit/miss/status), steam the opposing side,
  // unless Steam Burst just cleared it this move.
  onAfterMoveSecondarySelf(pokemon, target, move) {
    if (!move || move.type !== 'Water') return;

    // Skip re-apply if Steam Burst cleared it this move
    if ((pokemon as any).skipMagmaVeinSteamApply) {
      (pokemon as any).skipMagmaVeinSteamApply = false; // consume the flag
      return;
    }

    const foeSide = pokemon.side.foe;
    if (!foeSide) return;
    foeSide.addSideCondition('steamfield', pokemon);
    const sc = foeSide.sideConditions['steamfield'];
    if (sc) sc.duration = 4;
    this.add('-message', `${pokemon.name}'s Magma Vein shrouded the opposing side in steam!`);
  },

  rating: 4,
},

  // Team A Abilities
  snowveil: {
  name: "Snowveil",
  shortDesc: "Immune to Rock and heals 25% on Rock hit. Fire/Steel damage is halved; being hit by Fire/Steel summons Snow (once per switch-in).",
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  // Full immunity to Rock + heal (like your original intent, but explicit)
  onTryHit(target, source, move) {
    if (move.type === 'Rock') {
      this.add('-immune', target, '[from] ability: Snowveil');
      this.heal(Math.floor(target.baseMaxhp / 4), target);
      return null;
    }
  },
  // Halve damage from Fire & Steel
  onSourceModifyDamage(damage, attacker, defender, move) {
    if (move.type === 'Fire' || move.type === 'Steel') {
      return this.chainModify(0.5);
    }
  },
  // Getting hit by Fire/Steel starts Snow once per switch-in
  onDamagingHit(dmg, target, source, move) {
    if (!target.hp) return;
    if ((move.type === 'Fire' || move.type === 'Steel') && !target.volatiles['snowveil_trig']) {
      target.addVolatile('snowveil_trig');
      if (!this.field.isWeather('snow')) {
        this.field.setWeather('snow');
        this.add('-weather', 'Snow');
      }
    }
  },
  condition: {
    // marker volatile to avoid multiple weather sets per switch-in
    // cleared automatically on switch/KO
  },
  rating: 4,
},


  coredriller: {
    name: "Core Driller",
    shortDesc: "Contact: Attacker loses item. Takes 50% dmg from Ground.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onDamagingHit(damage, target, source, move) {
      if (move.flags['contact'] && source?.isActive) {
        if (source.hp && source.item) {
          source.takeItem();
          this.add('-enditem', source, source.getItem().name, '[from] ability: Core Driller', '[of] ' + target);
        }
      }
    },
    onSourceModifyDamage(damage, source, target, move) {
      if (move.type === 'Ground') {
        this.debug('Core Driller reduce Ground dmg');
        return this.chainModify(0.5);
      }
    },
  },

  tempestsurge: {
    name: "Tempest Surge",
    shortDesc: "Flying moves 1.3x power; removes hazards on user’s side after use.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onBasePowerPriority: 19,
    onBasePower(basePower, attacker, defender, move) {
      if (move.type === 'Flying') {
        return this.chainModify([5325, 4096]); // ~1.3x
      }
    },
    onAfterMoveSecondarySelf(source, target, move) {
      if (move.type === 'Flying') {
        for (const hazard of ['spikes', 'toxicspikes', 'stealthrock', 'stickyweb']) {
          if (source.side.removeSideCondition(hazard)) {
            this.add('-sideend', source.side, this.dex.conditions.get(hazard).name, '[from] ability: Tempest Surge');
          }
        }
      }
    },
  },

 luminousflow: {
  name: "Luminous Flow",
  shortDesc: "Heals the user and all allies (active and benched) by 1/16 max HP at the end of each turn.",
  // Keep your end-of-turn timing
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onResidualOrder: 29,
  onResidualSubOrder: 3,
  onResidual(pokemon) {
    const side = pokemon.side;
    for (const ally of side.pokemon) {
      if (!ally || ally.fainted) continue;

      // Only heal if missing HP
      if (ally.hp >= ally.maxhp) continue;

      const maxhp = ally.baseMaxhp || ally.maxhp;
      const amount = Math.max(1, Math.floor(maxhp / 16));

      if (ally.isActive) {
        // Normal path for actives (respects Heal Block etc.)
        this.heal(amount, ally, pokemon, this.effect);
      } else {
        // Safe path for benched mons (ensures it actually applies)
        const newHp = Math.min(ally.hp + amount, ally.maxhp);
        if (newHp !== ally.hp) {
          ally.sethp(newHp);
          this.add('-heal', ally, ally.getHealth, '[from] ability: Luminous Flow');
        }
      }
    }
  },
},




  battlebloom: {
    name: "Battle Bloom",
    shortDesc: "First time user clicks a Grass move: +1 Atk.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onPrepareHit(source, target, move) {
      if (move.type === 'Grass' && !source.volatiles['battlebloomused']) {
        source.addVolatile('battlebloomused');
        this.boost({atk: 1}, source);
      }
    },
    condition: {
      noCopy: true,
    },
  },

  // Team B Abilities
  shadowglide: {
    name: "Shadow Glide",
    shortDesc: "Dark moves +1 priority if user has >75% HP.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onModifyPriority(priority, attacker, defender, move) {
      if (move?.type === 'Dark' && attacker.hp > attacker.maxhp * 0.75) {
        return priority + 1;
      }
    },
  },

  corrosionscales: {
    name: "Corrosion Scales",
    shortDesc: "Immune to status; Poison moves hit Steel.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onSetStatus(status, target, source, effect) {
      if (status.id) {
        this.add('-immune', target, '[from] ability: Corrosion Scales');
        return false;
      }
    },
    onModifyMove(move) {
      if (move.type === 'Poison') move.ignoreImmunity = true;
    },
  },

  gravebloom: {
    name: "Grave Bloom",
    shortDesc: "On switch-in: +1 SpA and SpD for each fainted ally.",
    onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

      let fainted = 0;
      for (const ally of pokemon.side.pokemon) {
        if (ally.fainted) fainted++;
      }
      if (fainted > 0) this.boost({spa: fainted, spd: fainted}, pokemon);
    },
  },

  ruthlessedge: {
    name: "Ruthless Edge",
    shortDesc: "Dark moves deal 1.3x damage vs foes under 50% HP.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onBasePower(basePower, attacker, defender, move) {
      if (move.type === 'Dark' && defender.hp < defender.maxhp / 2) {
        return this.chainModify([5325, 4096]);
      }
    },
  },

  burningspirit: {
  name: "Burning Spirit",
  shortDesc: "Ghost moves hit again at 25% power as Fire; Fire moves hit again at 25% power as Ghost.",
onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  // Runs once after the user’s move resolves (only if it actually connected/hit something)
  onAfterMoveSecondarySelf(source, target, move) {
    // ignore Status and our own echo
    if (!move || move.category === 'Status' || move.id === 'burningspiritecho') return;

    // only Fire↔Ghost
    let echoType: 'Fire' | 'Ghost' | null = null;
    if (move.type === 'Ghost') echoType = 'Fire';
    else if (move.type === 'Fire') echoType = 'Ghost';
    if (!echoType) return;

    // base power @ 25% (>=1)
    const origBP = typeof move.basePower === 'number' ? move.basePower : 0;
    const echoBP = Math.max(1, Math.floor(origBP * 0.25));

    // Build the echo as a normal damaging move (same category)
    const echoMove = this.dex.getActiveMove({
      id: 'burningspiritecho',
      name: 'Burning Spirit Echo',
      accuracy: true,
      basePower: echoBP,
      category: move.category,
      priority: 0,
      type: echoType,
      flags: {protect: 1, mirror: 1}, // standard interactors; no weird loops
    } as any);

    // Determine who to hit:
    // - In singles, `target` is the primary foe. Use it if valid.
    // - If it's missing (can happen with some spread/edge cases), fall back to any live foe.
    const targets: Pokemon[] = [];
    if (target && !target.fainted) {
      targets.push(target);
    } else {
      for (const foe of source.side.foe.active) if (foe && !foe.fainted) targets.push(foe);
    }
    if (!targets.length) return;

    // Fire the echo on each chosen target
    for (const t of targets) {
      // Try a normal hit with full type effectiveness
      this.actions.tryMoveHit(t, source, echoMove);
    }

    // Optional flavor line (comment out if you don’t want extra text)
    // this.add('-message', `${source.name}'s Burning Spirit echoes as ${echoType}!`);
  },
},



  hiveguard: {
    name: "Hiveguard",
    shortDesc: "At <50% HP, Bug/Fighting moves gain +1 priority.",
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
    onModifyPriority(priority, source, target, move) {
      if (source.hp < source.maxhp / 2 && ['Bug', 'Fighting'].includes(move.type)) {
        return priority + 1;
      }
    },
  },

  coldheart: {
  name: "Cold Heart",
  shortDesc: "When dealing or taking damage: ignores stat changes, Abilities, and Items.",
  rating: 5,
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},

  // Attacking with this Pokémon
  onModifyMove(move, attacker, defender) {
    move.ignoreDefensive = true;   // ignore target's Def/SpD boosts
    move.ignoreEvasion = true;
    move.ignoreAbility = true;     // Mold Breaker effect vs target
  },

  // Being attacked (opponent's move targeting this Pokémon)
  onSourceModifyMove(move, attacker, defender) {
    if (defender === this.effectState.target) {
      move.ignoreOffensive = true; // ignore attacker's Atk/SpA boosts
      move.ignoreAbility = true;   // suppress attacker's Ability for this move
    }
  },

  // --- Item suppression for the hit (there is no move.ignoreItem) ---

  // When this Pokémon hits someone, suppress the target's item for this action
  onTryHit(target, source, move) {
    if (source === this.effectState.target && move.category !== 'Status') {
      target.addVolatile('coldheart_itemnull');
    }
  },
  // When someone hits this Pokémon, suppress the attacker's item for this action
  onSourceTryHit(target, source, move) {
    if (target === this.effectState.target && move.category !== 'Status') {
      source.addVolatile('coldheart_itemnull');
    }
  },

  // Local 1-tick volatile that applies Embargo only for this action
  condition: {
    // This volatile is applied to the Pokémon whose item should be ignored
    noCopy: true,
    duration: 1, // lasts through the current action
    onStart(pokemon) {
      // Embargo suppresses held-item effects (berries, Focus Sash, Choice, etc.)
      pokemon.addVolatile('embargo');
    },
    onEnd(pokemon) {
      // Ensure we clean up immediately after the action
      pokemon.removeVolatile('embargo');
    },
  },
},
	/** STATSTEALER
	 * Upon entry, scale each of the user's non-HP stats by (foeBase/selfBase),
	 * so the effective stat behaves as if you had the foe's base stats.
	 */
	statstealer: {
  name: "Statstealer",
  shortDesc: "On switch-in, forme-changes; copies foe's base stats (HP unchanged).",
  rating: 5,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types 
    const base = pokemon.species.types.join('/'); // species types 
    this.add('-start', pokemon, 'typechange', cur);

    // Prevent recursive onStart → formeChange → onStart loops
    if ((pokemon.m as any).statstealerApplied) return;

    const foe = pokemon.side.foe.active[0];
    if (!foe || foe.fainted) return;

    const foeSpecies = foe.species;
    const selfSpecies = pokemon.species;
    if (!foeSpecies?.baseStats || !selfSpecies?.baseStats) return;

    // Mark as applied *before* formeChange so re-entrant onStart immediately returns
    (pokemon.m as any).statstealerApplied = true;

    // Choose base template to transform into
    let newSpecies: any;
    if (selfSpecies.id === 'klumph') {
      const stolenTemplate = this.dex.species.get('klumphstolen');
      newSpecies = stolenTemplate?.exists ? this.dex.deepClone(stolenTemplate) : this.dex.deepClone(selfSpecies);
    } else {
      newSpecies = this.dex.deepClone(selfSpecies);
    }

    // Replace only non-HP base stats with foe's; keep HP
    newSpecies.baseStats = {
      hp: selfSpecies.baseStats.hp,
      atk: foeSpecies.baseStats.atk,
      def: foeSpecies.baseStats.def,
      spa: foeSpecies.baseStats.spa,
      spd: foeSpecies.baseStats.spd,
      spe: foeSpecies.baseStats.spe,
    };

    // IMPORTANT: make the new template "compatible" with Statstealer
    // so formeChange doesn't try to correct the ability back to a native one.
    newSpecies.abilities = {0: 'Statstealer'};

    const ok = pokemon.formeChange(newSpecies, this.effect, true);
if (ok) {
  // Force Statstealer again (your fork's setAbility expects boolean/undefined as 3rd arg)
  pokemon.setAbility('statstealer', pokemon, true);

  this.add('-ability', pokemon, 'Statstealer');
  this.add('-message', `${pokemon.name} mirrored ${foe.name}'s core stats!`);
}

  },

  onSwitchOut(pokemon) {
    if ((pokemon.m as any).statstealerApplied) {
      delete (pokemon.m as any).statstealerApplied;
    }
  },
},


	/** BLOODHOUND
	 * On entry: force-switch the opposing active if possible.
	 * Bonus damage vs targets with your existing 'bleeding' volatile/status.
	 
	bloodhound: {
	name: "Bloodhound",
	shortDesc: "On switch-in (once per battle), phazes foe. 1.3× damage vs targets with [bleeding].",
	rating: 4,

	onStart(pokemon) {
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);

		// If we've already used Bloodhound this battle, do nothing
		if ((pokemon.m as any).bloodhoundUsed) return;

		const foe = pokemon.side.foe.active[0];
		if (!foe) return;

		// can they be forced out?
		const anchored = foe.hasAbility?.('suctioncups') || foe.volatiles['ingrain'];
		if (!anchored && this.canSwitch(foe.side)) {
			this.add('-ability', pokemon, 'Bloodhound');
			this.add('-message', `${pokemon.name} flushed out ${foe.name}!`);

			// Red Card–style phaze: flag the switch and let Actions process it
			foe.forceSwitchFlag = true;

			// Mark as used so it won't trigger again this battle
			(pokemon.m as any).bloodhoundUsed = true;
		}
	},

	onBasePower(basePower, attacker, defender) {
		if (!defender) return;
		if (defender.volatiles['bleeding'] || defender.status === 'bleeding') {
			return this.chainModify(1.3);
		}
	},
},
*/
bloodhound: {
  name: "Bloodhound",
  shortDesc:
    "When hit by a move, forces the attacker to switch (like Red Card). Once per battle: if at full HP, survives a KO hit at 1 HP. Marks the attacker; if it switches in while this is active, it takes level/3 damage.",
  rating: 4,

  // Runs when the Pokemon is actually switching in / becoming active
  onSwitchIn(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    // keep a reliable reference to the holder for onAnySwitchIn
    this.effectState.holder = pokemon;

    // Reset once-per-field-instance phaze limiter on entry (belt + suspenders)
    pokemon.removeVolatile('bloodhoundphazeused');
  },

  // Keep onStart too if you want, but don't rely on it for entry callouts
  onStart(pokemon) {
    // ensure holder is tracked even in odd cases (ability gained while active)
    this.effectState.holder = pokemon;
  },

  // If the marked target switches in while the Bloodhound holder is on the field, ping it
  onAnySwitchIn(pokemon) {
    const holder: Pokemon | undefined = this.effectState.holder;
    if (!holder || !holder.isActive || holder.fainted) return;

    // @ts-ignore - persistent scratch space
    const m = ((holder as any).m ??= {});
    const marked = m.bloodhoundMarkedTarget as Pokemon | undefined;
    if (!marked) return;

    if (pokemon === marked) {
      this.add('-message', `The bloodhound finds its target`);
      const dmg = Math.floor(pokemon.level / 3);
      if (dmg > 0) this.damage(dmg, pokemon, holder);
    }
  },

  // Focus Sash-style: once per battle, if at full HP, survive a KO hit at 1 HP
  onDamage(damage, target, source, effect) {
    if (!source || source === target) return;
    if (!effect || effect.effectType !== 'Move') return;
    if (typeof damage !== 'number' || damage <= 0) return;

    // @ts-ignore - persistent scratch space
    const m = ((target as any).m ??= {});
    if (m.bloodhoundSashUsed) return;

    if (target.hp === target.maxhp && damage >= target.hp) {
      m.bloodhoundSashUsed = true;
      this.add('-ability', target, 'Bloodhound');
      this.add('-message', `${target.name} endured the hit!`);
      return target.hp - 1;
    }
  },

  // After taking a damaging hit, mark the attacker and force it to switch (if possible)
  // LIMITED: once per time Bloodhound is on the field
  onDamagingHit(damage, target, source, move) {
    if (!source || source === target) return;
    if (!move || move.category === 'Status') return;

    if (target.fainted || target.hp <= 0) return;

    // Once per field instance
    if (target.volatiles['bloodhoundphazeused']) return;

    const anchored = source.hasAbility?.('suctioncups') || source.volatiles['ingrain'];
    if (anchored) return;
    if (!this.canSwitch(source.side)) return;

    this.add('-ability', target, 'Bloodhound');

    // @ts-ignore - persistent scratch space
    const m = ((target as any).m ??= {});
    m.bloodhoundMarkedTarget = source;

    target.addVolatile('bloodhoundphazeused');
    source.forceSwitchFlag = true;
  },

  onBasePower(basePower, attacker, defender) {
    if (!defender) return;
    if (defender.volatiles['bleeding'] || defender.status === 'bleeding') {
      return this.chainModify(1.3);
    }
  },
},


	/** RADIOACTIVE
	 * Each time this Pokémon uses a damaging move, roll base power uniformly 50–150.
	 */
	radioactive: {
		name: "Radioactive",
		shortDesc: "When using a damaging move, its base power is rolled 50–150.",
		rating: 3.5,
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
		onDamagingHit(damage, target, source, move) {
			const sourceAbility = source.getAbility();
			if (sourceAbility.flags['cantsuppress'] || sourceAbility.id === 'radioactive') {
				return;
			}
			if (this.checkMoveMakesContact(move, source, target, !source.isAlly(target))) {
				const oldAbility = source.setAbility('radioactive', target);
				if (oldAbility) {
					this.add('-activate', target, 'ability: Radioactive', this.dex.abilities.get(oldAbility).name, `[of] ${source}`);
				}
			}
		},
		onModifyMove(move) {
			if (!move || move.category === 'Status') return;
			// Integer in [50, 150]
			const rolled = this.random(50, 151);
			move.basePower = rolled;
			// Optional flavor log
			this.add('-message', `Radioactive power set ${move.name} to ${rolled} BP!`);
		},
	},

	/** POROUS WALL
	 * First time this Pokémon is hit by a given type, halve that damage. Track per-type once.
	 * Persist across switches for this mon using pokemon.m.
	 */
	porouswall: {
		name: "Porous Wall",
		shortDesc: "Halves damage the first time it's hit by any given type.",
		rating: 3.5,
		onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

			if (!pokemon.m.porousSeenTypes) pokemon.m.porousSeenTypes = Object.create(null) as Record<string, 1>;
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (!move?.type) return;
			const seen = (target.m.porousSeenTypes ?? (target.m.porousSeenTypes = Object.create(null)));
			const key = this.toID(move.type); // e.g., 'fire', 'water'
			if (!seen[key]) {
				seen[key] = 1;
				this.add('-ability', target, 'Porous Wall');
				this.add('-message', `${target.name} buffered the ${move.type}-type hit!`);
				return this.chainModify(0.5);
			}
		},
	},

	/** WINTER'S BITE
	 * Boosts Ice moves (1.5×).
	 * End of each turn: non-Ice foes take 1/16; Water or Ice-weak foes take 1/8.
	 */
	wintersbite: {
		name: "Winter's Bite",
		shortDesc: "Ice moves 1.5×. EOT chip: non-Ice foes 1/16; Water or Ice-weak 1/8.",
		rating: 4,
		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Ice') return this.chainModify(1.5);
		},
		onResidual(pokemon) {
			if (!pokemon.isActive || pokemon.fainted) return;
			for (const foe of pokemon.side.foe.active) {
				if (!foe || foe.fainted) continue;
				if (foe.hasType('Ice')) continue;
				const iceVsFoe = this.dex.getEffectiveness('Ice', foe);
				const frac = (foe.hasType('Water') || iceVsFoe > 0) ? 1 / 8 : 1 / 16;
				this.damage(this.clampIntRange(Math.floor(foe.baseMaxhp * frac), 1), foe, pokemon, this.effect);
				this.add('-message', `${foe.name} is chilled by Winter's Bite!`);
			}
		},
	},

	/** CHAMELEON
	 * End of turn: change to up to two types:
	 *  - one that resists the foe's primary type
	 *  - one that hits the foe's primary type super-effectively
	 * If only one bucket available, go mono-type from that.
	 */
	chameleon: {
  name: "Chameleon",
  shortDesc:
    "End of turn: becomes dual-typed. Primary resists foe’s primary type; secondary is super-effective vs foe’s full typing.",
  onResidualOrder: 27,
  onResidualSubOrder: 1,
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},

  onResidual(pokemon) {
    // Don’t overwrite Tera
    if (pokemon.terastallized) return;

    // Active foe (Singles-first; graceful fallback)
    const foes = pokemon.side.foe.active.filter(p => p && !p.fainted);
    if (!foes.length) return;
    const foe = foes[0];

    const foeTypes: string[] = foe.getTypes(true);
    const foePrimary: string | undefined = foeTypes[0];
    if (!foePrimary) return;

    // All legal types in your dex, filter out weird sentinels
    const allTypes: string[] = this.dex.types.all()
      .map(t => t.name)
      .filter(t => t !== 'Stellar' && t !== '???' && t !== 'Bird');

    // ---------- PRIMARY options: resist or be immune to foe's PRIMARY type ----------
    const primaryOptions: string[] = [];
    for (const t of allTypes) {
      // eff < 0 => resist; immunity => getImmunity(foePrimary, t) === false
      const eff = this.dex.getEffectiveness(foePrimary, t);
      const hasEffect = this.dex.getImmunity(foePrimary, t as any); // older typings accept string
      const isImmune = !hasEffect;
      if (eff < 0 || isImmune) primaryOptions.push(t);
    }
    // Fallback to neutrals if somehow empty
    if (!primaryOptions.length) {
      for (const t of allTypes) {
        const eff = this.dex.getEffectiveness(foePrimary, t);
        if (eff <= 0) primaryOptions.push(t);
      }
      if (!primaryOptions.length) primaryOptions.push('Normal');
    }

    // ---------- SECONDARY options: super-effective vs foe's FULL typing ----------
    const secondaryOptions: string[] = [];
    const isImmuneToFoe = (atkType: string): boolean => {
      // immune if ANY target type confers immunity to this attack type
      for (const ft of foeTypes) {
        if (!this.dex.getImmunity(atkType, ft as any)) return true;
      }
      return false;
    };

    for (const atkType of allTypes) {
      if (isImmuneToFoe(atkType)) continue; // completely immune -> skip
      let total = 0;
      for (const ft of foeTypes) total += this.dex.getEffectiveness(atkType, ft);
      if (total > 0) secondaryOptions.push(atkType);
    }
    // Fallback: allow neutrals vs full typing
    if (!secondaryOptions.length) {
      for (const atkType of allTypes) {
        if (isImmuneToFoe(atkType)) continue;
        let total = 0;
        for (const ft of foeTypes) total += this.dex.getEffectiveness(atkType, ft);
        if (total === 0) secondaryOptions.push(atkType);
      }
      if (!secondaryOptions.length) secondaryOptions.push('Normal');
    }

    // ---------- Choose randomly (keep it non-deterministic) ----------
    const primary = this.sample(primaryOptions);
    let secondary = this.sample(secondaryOptions);
    if (secondary === primary) {
      const alt = secondaryOptions.find(t => t !== primary);
      if (alt) secondary = alt; // prefer two distinct types if possible
    }

    // ---------- Announce & apply ----------
    const prev = pokemon.getTypes(true).join('/');
    this.add('-message',
      `Chameleon options — Primary (resists ${foePrimary}): ${primaryOptions.join(', ')}`);
    this.add('-message',
      `Chameleon options — Secondary (SE vs ${foeTypes.join('/')}: ${secondaryOptions.join(', ')})`);
    this.add('-message', `Chosen types: ${primary} / ${secondary}`);

    pokemon.setType([primary, secondary]);
    this.add('-start', pokemon, 'typechange', `${primary}/${secondary}`);
    this.add('-message', `${pokemon.name} adapted into ${primary}/${secondary}! (was ${prev})`);
  },
},




	/** DEADLY WEB
	 * When hit by any move: trap the attacker and apply your existing 'sting' volatile.
	 */
	deadlyweb: {
  name: "Deadly Web",
  shortDesc: "When hit, traps the attacker and inflicts [sting].",
  rating: 3.5,
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onDamagingHit(_damage, target, source, move) {
    if (!source || !move) return;

    this.add('-ability', target, 'Deadly Web', '[of] ' + target);

    // Hard trap (guaranteed)
    source.addVolatile('trapped', target, this.effect);
    // Optional legacy helper in your fork:
    // source.tryTrap(true);

    source.addVolatile('sting');
    this.add('-message', `${source.name} is ensnared in deadly threads!`);
  },
},




	/** CLOUD BODY
	 * Immune to weather damage and to a curated set of "weather-interacting" moves.
	 */
	cloudbody: {
  name: "Cloud Body",
  shortDesc: "Immune to weather damage and weather-affected moves. While weather is active, immune to moves matching that weather’s type.",
  rating: 3.5,
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},

  // Weather chip immunity
  onDamage(damage, target, _source, effect) {
    if (effect?.effectType === 'Weather') return false;
  },

  // Internal weather immunities for status-type weather effects
  onImmunity(type) {
    if (type === 'sandstorm' || type === 'hail' || type === 'snow') return false;
  },

  // Immunity to specific “weather-affected” moves (Blizzard, Thunder, etc.)
  onTryHit(target, source, move) {
    const weatherMoves = new Set([
      'blizzard', 'thunder', 'hurricane', 'weatherball', 'solarbeam', 'solarblade',
      'hydrosteam', 'sandsearstorm', 'springtidestorm', 'bleakwindstorm', 'wildboltstorm',
    ]);
    if (weatherMoves.has(this.toID(move.name))) {
      this.add('-immune', target, '[from] ability: Cloud Body');
      return null;
    }

    // ---------- NEW: weather-type immunity logic ----------
    const weather = this.field.weather;
    if (!weather) return; // no active weather, skip

    // Map weather → move type to block
    const weatherTypeMap: Record<string, string> = {
      rain: 'Water',
      raindance: 'Water',
      primordialsea: 'Water',
      sunnyday: 'Fire',
      desolateland: 'Fire',
      sandstorm: 'Rock',
      snow: 'Ice',
      hail: 'Ice',
    };

    const immuneType = weatherTypeMap[weather];
    if (immuneType && move.type === immuneType) {
      this.add('-immune', target, '[from] ability: Cloud Body');
      return null;
    }
  },
},


	/** CRYSTALLIZATION
	 * Secondary type = held Gem's type. At end of turn, if still holding the Gem, consume it and +1 all stats.
	 */
	crystallization: {
  name: "Crystallization",
  shortDesc: "Gains a 2nd type from held Gem; EOT consumes unused Gem for +1 all stats.",
  rating: 4,

  onSwitchIn(pokemon) {
    // Reapply stored typing as early as possible so entry hazards use the updated type.
    const storedSecondary = pokemon.m.crystallizationType as string | undefined;
    if (storedSecondary) {
      const primary = pokemon.getTypes()[0] || pokemon.species.types[0];
      const newTypes: string[] = [];
      if (primary) newTypes.push(primary);
      if (storedSecondary !== primary) newTypes.push(storedSecondary);

      if (newTypes.length && pokemon.setType(newTypes)) {
        this.add('-ability', pokemon, 'Crystallization');
        this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] ability: Crystallization');
      }
      return;
    }

    // Otherwise, try to derive and store from currently held Gem on first entry.
    const item = pokemon.getItem();
    if (!item?.isGem) return;

    let secondary: string | null = null;
    if (item.id && item.id.endsWith('gem')) {
      const typeId = item.id.slice(0, -3) as ID;
      const t = this.dex.types.get(typeId);
      if (t?.exists) secondary = t.name;
    }
    if (!secondary) return;

    const primary = pokemon.getTypes()[0] || pokemon.species.types[0];
    const newTypes: string[] = [];
    if (primary) newTypes.push(primary);
    if (secondary !== primary) newTypes.push(secondary);

    if (newTypes.length && pokemon.setType(newTypes)) {
      pokemon.m.crystallizationType = secondary;

      this.add('-ability', pokemon, 'Crystallization');
      this.add('-start', pokemon, 'typechange', newTypes.join('/'), '[from] item: ' + item.name);
    }
  },

  onResidualOrder: 28,
  onResidualSubOrder: 2,
  onResidual(pokemon) {
    // Don't trigger the omniboost on the same turn you switched in
    if (pokemon.activeTurns === 0) return;

    const item = pokemon.getItem();
    if (!item?.isGem) return;

    // Lock the typing BEFORE consuming the Gem
    if (!pokemon.m.crystallizationType) {
      let secondary: string | null = null;
      if (item.id && item.id.endsWith('gem')) {
        const typeId = item.id.slice(0, -3) as ID;
        const t = this.dex.types.get(typeId);
        if (t?.exists) secondary = t.name;
      }
      if (secondary) pokemon.m.crystallizationType = secondary;
    }

    if (pokemon.useItem()) {
      this.add('-ability', pokemon, 'Crystallization');
      this.add('-message', `${pokemon.name}'s ${item.name} shattered into power!`);
      this.boost({atk: 1, def: 1, spa: 1, spd: 1, spe: 1}, pokemon, pokemon, this.effect);
    }
  },
},


	/** GLITTER SCALES
	 * On switch-in: foes -1 Acc. Reflect 10% of direct move damage taken back at the source.
	 */

	glitterscales: {
	name: "Glitter Scales",
	shortDesc: "On switch-in: foes -1 Acc. Reflects 10% of direct damage back to the attacker.",
	rating: 3.5,

	onStart(pokemon) {
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
		const base = pokemon.species.types.join('/'); // species types 
		this.add('-start', pokemon, 'typechange', cur);

		let activated = false;
		for (const target of pokemon.adjacentFoes()) {
			if (!activated) {
				this.add('-ability', pokemon, 'Glitter Scales', 'boost');
				activated = true;
			}
			if (target.volatiles['substitute']) {
				this.add('-immune', target);
			} else {
				this.boost({accuracy: -1}, target, pokemon, null, true);
			}
		}
	},

	// Reflect 10% of all move damage dealt to the bearer
	onDamagingHitOrder: 2,
onDamagingHit(damage, target, source, move) {
	if (!source || !move || typeof damage !== 'number' || damage <= 0) return;

	// No self-damage reflection
	if (source.side === target.side) return;

	// If you want contact-only reflection, uncomment this:
	// if (!this.checkMoveMakesContact(move, source, target)) return;

	// Reflect 10% of the damage dealt
	const reflect = Math.max(1, Math.floor(damage * 0.10));

	// Use this.effect so TS is happy and it’s correctly tagged as the ability
	this.damage(reflect, source, target, this.effect);
	this.add('-message', `${target.name}'s Glitter Scales reflected damage!`);
},


},


cerebralblaze: {
  name: "Cerebral Blaze",
  shortDesc: "At <50% HP: +1 Spe & +1 SpA (once on drop). Fire moves deal 1.25× while <50%.",
  // Track whether we've already given the stat boosts
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

this.effectState.boosted = false; },
  onUpdate(pokemon) {
    if (pokemon.hp > 0 && pokemon.hp * 2 <= pokemon.baseMaxhp && !this.effectState.boosted) {
      this.effectState.boosted = true;
      this.boost({spa: 1, spe: 1}, pokemon, pokemon);
      this.add('-message', `${pokemon.name}'s Cerebral Blaze ignites!`);
    }
  },
  onBasePower(basePower, attacker, defender, move) {
    if (move?.type === 'Fire' && attacker.hp * 2 <= attacker.baseMaxhp) {
      return this.chainModify([5, 4]); // 1.25x
    }
  },
},

torrentialhowl: {
  name: "Torrential Howl",
  shortDesc: "When this Pokémon uses a Dark-type move, 30% chance to summon Rain.",
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onAfterMove(source, target, move) {
    if (!move || move.type !== 'Dark') return;
    if (this.randomChance(6, 10)) {
      if (!this.field.isWeather('raindance')) {
        this.field.setWeather('raindance');
        this.add('-message', `Rain began to fall from Torrential Howl!`);
      }
    }
  },
},

fatefulstrike: {
  name: "Fateful Strike",
  shortDesc: "When this Pokémon deals super-effective damage: 30% to inflict brn/par/frz/frostbite.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    this.effectState.lastStatus = null as null | string;
  },

  // Fires only when the holder hits and actually deals damage
  onSourceDamagingHit(damage, target, source, move) {
    if (!move || move.category === 'Status') return;
    if (!damage || damage <= 0) return; // no proc on miss/immune/no-damage

    // Use the engine helper that includes move.onEffectiveness overrides
    let typeMod = 0;
    if (typeof (this as any).getEffectiveness === 'function') {
      typeMod = (this as any).getEffectiveness(move, target);
    } else {
      // very old forks fallback (won’t see onEffectiveness overrides)
      for (const ft of target.getTypes(true)) {
        typeMod += this.dex.getEffectiveness(move.type, ft);
      }
    }

    if (typeMod <= 0) return;                 // not SE in practice
    if (!this.randomChance(3, 10)) return;    // 30% chance

    const pool = ['brn', 'par', 'frz', 'frb'] as const;
    let status = this.sample(pool as unknown as string[]);
    const last = this.effectState.lastStatus as string | null;
    if (last && pool.length > 1 && status === last) {
      status = this.sample((pool as unknown as string[]).filter(s => s !== last));
    }

    if (target.trySetStatus(status as any, source, move)) {
      this.effectState.lastStatus = status;
      const pretty = status === 'frb' ? 'Frostbite' : this.dex.conditions.get(status).name;
      this.add('-message', `Fateful Strike inflicted ${pretty}!`);
    }
  },
},



toxictides: {
  name: "Toxic Tides",
  shortDesc: "While this Pokémon is out: grounded non-Poison lose 1/16 HP; Poison heal 1/16 each turn.",
  onResidualOrder: 27,
  onResidualSubOrder: 1,
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onResidual(pokemon) {
    // Apply once per turn, sourced from the holder
    for (const mon of this.getAllActive().filter(x => x && !x.fainted)) {
      if (!mon.isGrounded()) continue;
      const isPoison = mon.hasType('Poison');
      if (isPoison) {
        this.heal(mon.baseMaxhp / 16, mon, pokemon);
      } else {
        this.damage(mon.baseMaxhp / 16, mon, pokemon);
      }
    }
    this.add('-message', 'Toxic tides surge across the field!');
  },
},

runesteelhide: {
  name: "Runesteel Hide",
  shortDesc: "When hit by a physical move, 20% chance to drop the attacker’s Atk and Spe by 1.",
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onDamagingHit(_damage, target, source, move) {
    if (!move || move.category !== 'Physical') return;
    if (this.randomChance(1, 5)) {
      this.add('-message', 'Stats dropped by Rune Configuration!');
      this.boost({atk: -1, spe: -1}, source, target);
    }
  },
},

resonantcall: {
  name: "Resonant Call",
  shortDesc: "Immune to sound moves; holder’s sound moves gain +1 priority and 1.2× power.",
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  // Immunity (like Soundproof)
  onTryHit(target, source, move) {
    if (move && move.flags && move.flags.sound) {
      this.add('-immune', target, '[from] ability: Resonant Call');
      return null;
    }
  },
  onAllyTryHitSide(target, source, move) {
    if (move && move.flags && move.flags.sound) {
      this.add('-immune', target, '[from] ability: Resonant Call');
      return null;
    }
  },
  // Holder’s buffs
  onModifyPriority(priority, pokemon, target, move) {
    if (move && move.flags && move.flags.sound) return priority + 1;
  },
  onBasePower(bp, attacker, defender, move) {
    if (move && move.flags && move.flags.sound) return this.chainModify([6, 5]); // 1.2x
  },
},


valorsgrip: {
  name: "Valor's Grip",
  shortDesc: "Once/battle: survive a fatal hit at 1 HP. Next turn: Fire/Ground moves 1.3×.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    this.effectState.used = false;
    this.effectState.boostTurn = 0;
  },

  // Trigger only on direct damaging moves that would KO
  onDamage(damage, target, source, effect) {
    if (this.effectState.used) return;

    const move = effect as any; // older typings: Effect | Move | Condition
    if (!move || move.effectType !== 'Move') return;         // ignore status/indirect damage
    if (move.category === 'Status') return;                   // explicit guard
    if (damage < target.hp) return;                           // not lethal

    // Prevent faint, set to 1 HP and prime next turn buff
    this.effectState.used = true;
    this.effectState.boostTurn = this.turn + 1;               // next turn only
    this.add('-ability', target, "Valor's Grip");
    this.add('-message', `${target.name} endured the blow with Valor's Grip!`);

    return target.hp - 1;                                     // leave at 1 HP
  },

  onBasePower(basePower, attacker, defender, move) {
    if (
      this.effectState.boostTurn === this.turn &&
      move && (move.type === 'Fire' || move.type === 'Ground')
    ) {
      return this.chainModify([13, 10]); // 1.3x
    }
  },
},

/*
echomessenger: {
  name: "Echo Messenger",
  shortDesc: "The first move this Pokémon uses always goes first (+5 priority).",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

 this.effectState.used = false; },
  onModifyPriority(priority, pokemon, target, move) {
    if (!move) return;
    if (!this.effectState.used) return priority + 5;
  },
  onAfterMove(pokemon, target, move) {
    if (move && !this.effectState.used) this.effectState.used = true;
  },
},
*/
/*
echomessenger: {
  name: "Echo Messenger",
  shortDesc:
    "On each switch-in, its first move gets priority. First use in battle: +3 priority. After that, first move after each switch-in: +1 priority and 0.5× power.",
  rating: 5,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    // Announce so the opponent knows the first move will have priority
    this.add('-ability', pokemon, 'Echo Messenger');
    this.add('-message', `${pokemon.name} is poised to act with priority!`);

    // Per-Pokémon persistent scratch
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    // First move while currently on the field is "boosted"
    m.echoMessengerEntryPending = true;
  },

  onModifyPriority(priority, pokemon, target, move) {
    if (!move) return;

    // @ts-ignore
    const m = (pokemon as any).m;
    if (!m?.echoMessengerEntryPending) return;

    // First-ever use in the battle: +3
    if (!m.echoMessengerUsedBattle) return priority + 3;

    // After it's been used once already: +1 on first move after each switch-in
    return priority + 1;
  },

  onBasePower(basePower, attacker, defender, move) {
    if (!move || move.category === 'Status') return;

    // @ts-ignore
    const m = (attacker as any).m;
    if (!m?.echoMessengerEntryPending) return;

    // After the first-ever use in the battle, the first move after each switch-in is halved
    if (m.echoMessengerUsedBattle) {
      return this.chainModify(0.5);
    }
  },

  onAfterMove(pokemon, target, move) {
    if (!move) return;

    // @ts-ignore
    const m = (pokemon as any).m;
    if (!m?.echoMessengerEntryPending) return;

    // This was the first move on the field; consume the entry boost
    m.echoMessengerEntryPending = false;

    // Mark that the "battle-first" boost has been used (persists through switches)
    if (!m.echoMessengerUsedBattle) m.echoMessengerUsedBattle = true;
  },
},
*/

echomessenger: {
	//Hopefully this one works with the button
  name: "Echo Messenger",
  shortDesc:
    "First move used in battle: +3 priority (automatic). After that, first move after each switch-in can be toggled: +1 priority and 0.5× power.",
  rating: 5,

  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    this.add('-ability', pokemon, 'Echo Messenger');
    this.add('-message', `${pokemon.name} is poised to act with priority!`);

    // Reset per-entry state so the "echo" button can appear on this entry
    // (Your battle.ts sets echoMessengerEntryMoveUsed = true after the first move this entry.)
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    m.echoMessengerEntryMoveUsed = false;

    // IMPORTANT: do NOT reset the battle-first flag here
    // m.echoMessengerBattleFirstMoveUsed should persist all battle
  },
},

brisingcharm: {
  name: "Brising Charm",
  shortDesc: "End of turn: if this Pokémon used a Grass or Fairy move this turn, heal 1/8 max HP.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

 this.effectState.flag = false; },
  onAfterMove(source, target, move) {
    if (source !== this.effectState.target && this.effectState.target) return;
    if (!move) return;
    if (move.type === 'Grass' || move.type === 'Fairy') this.effectState.flag = true;
  },
  onResidualOrder: 27,
  onResidualSubOrder: 1,
  onResidual(pokemon) {
    if (this.effectState.flag) {
      this.heal(pokemon.baseMaxhp / 8, pokemon, pokemon);
      this.add('-message', `${pokemon.name} is soothed by the Brising Charm!`);
      this.effectState.flag = false;
    }
  },
},

abyssalmaw: { 
  name: "Abyssal Maw",
  shortDesc: "On entry: trap opposing grounded Pokémon; they take 1/16 each turn for 5 turns.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    for (const foe of pokemon.side.foe.active) {
      if (!foe || foe.fainted || !foe.isGrounded()) continue;
      foe.addVolatile('abyssalmawtrap', pokemon);
    }
    this.add('-message', `The Abyssal Maw opens beneath the foe!`);
  },
  onSwitchIn(pokemon) {
    // Refresh/apply to current foes on future entries, too
    for (const foe of pokemon.side.foe.active) {
      if (!foe || foe.fainted || !foe.isGrounded()) continue;
      // refresh duration if already present
      if (foe.volatiles['abyssalmawtrap']) foe.removeVolatile('abyssalmawtrap');
      foe.addVolatile('abyssalmawtrap', pokemon);
    }
  },
},


helsgrasp: {
  name: "Hel's Grasp",
  shortDesc: "Moxie clone (Attack +1 after knocking out a target).",
  onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
  onSourceAfterFaint(length, target, source, effect) {
    if (effect && effect.effectType === 'Move') {
      this.boost({atk: 1}, source);
    }
  },
},

nioaura: {
  name: "Nio Aura",
  shortDesc: "Intimidate clone but lowers Special Attack instead.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    this.add('-ability', pokemon, 'Nio Aura');
    for (const foe of pokemon.side.foe.active) {
      if (!foe || foe.fainted) continue;
      if (!this.runEvent('Intimidate', foe, pokemon)) continue;
      this.boost({spa: -1}, foe, pokemon, null, true);
    }
  },
},

aesirswill: {
  name: "Aesir's Will",
  shortDesc: "On switch-in: Light-type moves get +1 priority for 1 turn. Light moves 1.1× power.",
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    // mark the current turn as the priority turn
    this.effectState.priorityTurn = this.turn;
    this.add('-message', `${pokemon.name}'s Aesir's Will quickens the Light!`);
  },
  onModifyPriority(priority, pokemon, target, move) {
    if (!move) return;
    if (move.type === 'Light' && this.turn === this.effectState.priorityTurn) {
      return priority + 1;
    }
  },
  onBasePower(bp, attacker, defender, move) {
    if (move?.type === 'Light') return this.chainModify([11, 10]); // 1.1x
  },
},

negative: {
  name: "Negative",
  shortDesc: "On switch-in, lowers one of the user's stats at random by 1 stage.",
  rating: -1,
  onStart(pokemon) {
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

    // Pick one of the five main stats at random
    const stats: BoostID[] = ['atk', 'def', 'spa', 'spd', 'spe'];
    const chosen = this.sample(stats);

    // Apply the debuff
    const boost: Partial<Record<BoostID, number>> = {};
    boost[chosen] = -1;

    this.add('-ability', pokemon, 'Negative');
    this.add('-message', `${pokemon.name}'s ${chosen.toUpperCase()} dropped due to its Negative ability!`);
    this.boost(boost, pokemon, pokemon, this.effect);
  },
},

sporeshield: {
		
onDamagingHit(damage, target, source, move) {
    if (!damage || damage <= 0) return;
    if (!source || !move) return;
    if (source.side === target.side) return;

    // Physical-only filter
    if (move.category !== 'Physical') return;

    // Choose exactly one effect by weighted chance
    const roll = this.random(100); // 0–99

    if (roll < 30) {
        // Heal 20% of the damage received
        const heal = Math.floor(damage * 0.20);
        if (heal > 0) {
            this.heal(heal, target, target);
            this.add('-message', `${target.name} absorbed some of the impact!`);
        }
        return;
    }

    if (roll < 60) {
        // Attack drop
        this.boost({atk: -1}, source, target);
        this.add('-message', `${source.name}'s Attack fell from the impact!`);
        return;
    }

    if (roll < 90) {
        // Paralyze
        if (!source.status && source.runStatusImmunity('par')) {
            source.setStatus('par', target);
            this.add('-message', `${source.name} was paralyzed by backlash!`);
        }
        return;
    }

    // Sleep (10%)
    if (!source.status && source.runStatusImmunity('slp')) {
        source.setStatus('slp', target);
        this.add('-message', `${source.name} was lulled into sleep by the hit!`);
    }
},


		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Spore Shield",
		rating: 2
	},

solarcore: {
	name: "Solar Core",
	shortDesc: "In sun: Fire & Rock moves 1.2x power; heals 1/16 max HP each turn.",
	rating: 3.5,
	onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},

	// 50% boost to Fire and Rock moves in sun / Desolate Land
	onBasePower(basePower, attacker, defender, move) {
		if ((move.type === 'Fire' || move.type === 'Rock') &&
			['sunnyday', 'desolateland'].includes(this.field.effectiveWeather())) {
			this.debug('Solar Core boost');
			return this.chainModify(1.2);
		}
	},

	// Heal 1/8 max HP at the end of each turn while sun is active
	onWeather(target, source, effect) {
		if (!target.isActive) return;
		if (effect.id === 'sunnyday' || effect.id === 'desolateland') {
			this.heal(target.baseMaxhp / 16, target, target);
		}
	},
},

scalesofruin: {
  onStart(pokemon) {
    const cur = pokemon.getTypes(true).join('/'); // runtime types
    const base = pokemon.species.types.join('/'); // species types
    this.add('-start', pokemon, 'typechange', cur);

    if (this.suppressingAbility(pokemon)) return;
    this.add('-ability', pokemon, 'Scales of Ruin');
  },

  onAnyAccuracy(accuracy, source, target, move) {
    const abilityHolder = this.effectState.target;

    // Ruin abilities only care during actual move use
    if (!move || !source) return;

    // Only modify numeric accuracies (true / null / undefined should pass through)
    if (typeof accuracy !== 'number') return;

    // Vessel-of-Ruin style: check MOVE USER (source)
    // Use the ID for reliability
    if (target.hasAbility?.('scalesofruin')) return;

    // Non-stacking guard: only ONE Scales holder applies per move accuracy check
    // Same pattern as Vessel's ruinedSpA
    // @ts-ignore
    if (!move.ruinedAcc) move.ruinedAcc = abilityHolder;
    // @ts-ignore
    if (move.ruinedAcc !== abilityHolder) return;

    this.debug('Scales of Ruin accuracy drop');
    return this.chainModify(0.85); // testing value
  },

  flags: {},
  name: "Scales of Ruin",
  rating: 4.5,
  // num: 284, // optional
},


randochaos: {
  name: "Randochaos",
  shortDesc: "On every switch-in: fully random species, typing, stats (BST 550), EVs, nature, moves (signature STABs → Metronome + Adaptive Force), and ability. Keeps held item.",
  rating: 5,

  onSwitchIn(pokemon) {
    if (pokemon.fainted) return;

    const battle = this;

    // Preserve HP ratio for the transformation
    const hpRatio = Math.max(0, pokemon.hp) / Math.max(1, pokemon.maxhp || 1);

    // ------------------------------------------------------------
    // 1) Random species pool
    // ------------------------------------------------------------
    const speciesPool = this.dex.species.all().filter(s =>
      s.exists &&
      !s.nfe &&
      !(s as any).battleOnly &&
      !(s as any).isNonstandard &&
      !(s as any).isMega &&
      !(s as any).isPrimal &&
      !(s as any).isGigantamax
    );
    if (!speciesPool.length) return;

    let species = this.sample(speciesPool);
    for (let i = 0; i < 4 && speciesPool.length > 1 && species.name === pokemon.species.name; i++) {
      species = this.sample(speciesPool);
    }

    pokemon.formeChange(species, this.effect, true);

    // ------------------------------------------------------------
    // 2) Random typing
    // ------------------------------------------------------------
    const allTypes = this.dex.types.names().filter(t => t !== '???' && t !== 'Stellar' && t !== 'stellar');
    const primary = this.sample(allTypes);
    let secondary: string | undefined = undefined;
    if (this.randomChance(1, 2)) {
      const pool = allTypes.filter(t => t !== primary);
      if (pool.length) secondary = this.sample(pool);
    }
    const newTypes = secondary ? [primary, secondary] : [primary];
    pokemon.setType(newTypes as string[]);
    this.add('-start', pokemon, 'typechange', newTypes.join('/'));

    // ------------------------------------------------------------
    // 3) BST Normalization → 550
    // (Same logic as before — unchanged)
    // ------------------------------------------------------------
    type StatName = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
    const statKeys: StatName[] = ['hp','atk','def','spa','spd','spe'];

    const baseStats = { ...species.baseStats };
    const curBST = statKeys.reduce((n,k) => n + baseStats[k], 0);
    const targetBST = 550;
    let delta = targetBST - curBST;

    const newBaseStats = { ...baseStats };
    if (delta !== 0) {
      if (delta > 0) {
        const per = Math.floor(delta / 6);
        const rem = delta - per * 6;
        for (const s of statKeys) newBaseStats[s] += per;
        for (let i = 0; i < rem; i++) {
          const s = this.sample(statKeys);
          newBaseStats[s]++;
        }
      } else {
        delta = -delta;
        const mutable = [...statKeys];
        while (delta > 0 && mutable.length) {
          const s = this.sample(mutable);
          if (newBaseStats[s] > 1) {
            newBaseStats[s]--;
            delta--;
          } else {
            mutable.splice(mutable.indexOf(s), 1);
          }
        }
      }
    }

    // ------------------------------------------------------------
    // 4) Determine offensive focus → EVs + Nature
    // ------------------------------------------------------------
    const atkBase = newBaseStats.atk;
    const spaBase = newBaseStats.spa;
    const speBase = newBaseStats.spe;

    const bestOff: 'atk' | 'spa' = atkBase >= spaBase ? 'atk' : 'spa';
    const worstOff: 'atk' | 'spa' = bestOff === 'atk' ? 'spa' : 'atk';

    const newEVs: StatsTable = {hp:0, atk:0, def:0, spa:0, spd:0, spe:0};
    let natureName: string;

    if (speBase >= 50) {
      newEVs[bestOff] = 252;
      newEVs.spe = 252;
      newEVs.hp = 4;
      natureName = (bestOff === 'atk') ? 'Jolly' : 'Timid';
    } else {
      newEVs[bestOff] = 252;
      newEVs.hp = 252;
      newEVs.def = 4;
      natureName = (bestOff === 'atk') ? 'Adamant' : 'Modest';
    }

    pokemon.set.evs = newEVs;
    pokemon.set.ivs = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
    pokemon.set.nature = natureName;

    // ------------------------------------------------------------
    // 5) Recalculate actual stats (same as before)
    // ------------------------------------------------------------
    const level = pokemon.level;
    const natureObj = this.dex.natures.get(natureName);
    const getNatureMod = (s:'atk'|'def'|'spa'|'spd'|'spe'):number=>{
      if (!natureObj) return 1;
      if (natureObj.plus === s) return 1.1;
      if (natureObj.minus === s) return 0.9;
      return 1;
    };

    const newStoredStats: StatsTable = {hp:0, atk:0, def:0, spa:0, spd:0, spe:0};
    for (const s of statKeys) {
      const B = newBaseStats[s];
      const IV = pokemon.set.ivs[s];
      const EV = pokemon.set.evs[s];
      if (s === 'hp') {
        newStoredStats.hp = Math.floor(((2*B+IV+Math.floor(EV/4))*level)/100)+level+10;
      } else {
        let val = Math.floor(((2*B+IV+Math.floor(EV/4))*level)/100)+5;
        val = Math.floor(val * getNatureMod(s) + 0.5);
        newStoredStats[s] = val;
      }
    }

    (pokemon as any).storedStats = {...newStoredStats};
    pokemon.maxhp = newStoredStats.hp;
    pokemon.baseMaxhp = newStoredStats.hp;

    // Restore HP %
    pokemon.sethp(Math.max(1, Math.floor(pokemon.maxhp * hpRatio)));
    // ------------------------------------------------------------
    // 6) SIGNATURE MOVE LOGIC → Slots 1–2 (DUAL TYPES MUST BE UNIQUE)
    // ------------------------------------------------------------

    const allMoves = this.dex.moves.all().filter(m => m.exists && !m.isZ && !m.isMax);

    const isDamaging = (m: any) => m.category !== 'Status' && (m.basePower > 0 || m.damage || m.ohko);
    const preferredCategory = (bestOff === 'atk') ? 'Physical' : 'Special';

    const learnsets = (this.dex.data as any).Learnsets;
    const signatureMoves: string[] = [];

    const moveLearners: Record<string, number> = {};
    for (const sp of this.dex.species.all()) {
      if (!sp.exists || !learnsets[sp.id]?.learnset) continue;
      for (const mv of Object.keys(learnsets[sp.id].learnset)) {
        moveLearners[mv] = (moveLearners[mv] || 0) + 1;
      }
    }
    for (const mv in moveLearners) if (moveLearners[mv] === 1) signatureMoves.push(mv);

    const stabPoolsByTier = (type: string) => {
      const sig = allMoves.filter(m =>
        signatureMoves.includes(m.id) &&
        isDamaging(m) &&
        m.type === type &&
        m.category === preferredCategory
      );
      const strong = allMoves.filter(m =>
        isDamaging(m) &&
        m.type === type &&
        m.category === preferredCategory &&
        (m.basePower || 0) >= 70
      );
      const anyStab = allMoves.filter(m =>
        isDamaging(m) &&
        m.type === type &&
        m.category === preferredCategory
      );
      return {sig, strong, anyStab};
    };

    const genericPreferred = allMoves.filter(m => isDamaging(m) && m.category === preferredCategory);

    const chosenMoves: string[] = [];

    const pickFrom = (pool: any[]) => {
      if (!pool.length) return null;
      // avoid duplicates
      const candidates = pool.filter(m => !chosenMoves.includes(m.id));
      if (!candidates.length) return null;
      return this.sample(candidates).id as string;
    };

    const pickBestStabOfType = (type: string) => {
      const {sig, strong, anyStab} = stabPoolsByTier(type);
      return (
        pickFrom(sig) ||
        pickFrom(strong) ||
        pickFrom(anyStab) ||
        null
      );
    };

    if (newTypes.length >= 2) {
      // Force one STAB move from each type
      const tA = newTypes[0];
      const tB = newTypes[1];

      const mA = pickBestStabOfType(tA) || pickFrom(genericPreferred) || 'tackle';
      chosenMoves.push(mA);

      const mB = pickBestStabOfType(tB) || pickFrom(genericPreferred) || 'tackle';
      chosenMoves.push(mB);

      // If we still somehow duplicated by ID, patch it
      if (chosenMoves[0] === chosenMoves[1]) {
        chosenMoves[1] = pickBestStabOfType(tB) || pickFrom(genericPreferred) || 'tackle';
      }
    } else {
      // Mono-type: still force STAB twice (your original behavior is fine here)
      const t = newTypes[0];
      chosenMoves.push(pickBestStabOfType(t) || pickFrom(genericPreferred) || 'tackle');
      chosenMoves.push(pickBestStabOfType(t) || pickFrom(genericPreferred) || 'tackle');
      if (chosenMoves[0] === chosenMoves[1]) {
        chosenMoves[1] = pickFrom(genericPreferred) || 'tackle';
      }
    }

    // Slot 3–4 fixed
    chosenMoves[2] = 'metronome';
    chosenMoves[3] = 'adaptiveforce';


    // Apply moves
    pokemon.moveSlots.splice(0,pokemon.moveSlots.length);
    (pokemon.baseMoveSlots as any).splice(0,(pokemon.baseMoveSlots as any).length);
    for (const id of chosenMoves) {
      const mv = this.dex.moves.get(id);
      const slot = {
        move: mv.name, id: mv.id as ID,
        pp: mv.pp, maxpp: mv.pp, target: mv.target,
        disabled: false, disabledSource: '', used:false
      };
      pokemon.moveSlots.push({...slot});
      (pokemon.baseMoveSlots as any).push({...slot});
    }

    // ------------------------------------------------------------
    // 7) Random ability — but keep Randochaos as BASE ability so it re-triggers
    // ------------------------------------------------------------
    const abilPool = this.dex.abilities.all().filter(a=>a.exists && !(a as any).isNonstandard);
    if (abilPool.length){
      const randAbil = this.sample(abilPool);
      if (randAbil){
        pokemon.setAbility(randAbil.id as ID, pokemon, true as any);
        this.add('-ability', pokemon, randAbil.name, '[from] ability: Randochaos');
      }
    }

    // **Critical:** ensure that next switch-in STILL activates Randochaos
    pokemon.baseAbility = 'randochaos' as ID;

    this.add('-message', `${pokemon.name} plunges into pure Randochaos!`);
  },
},
shortcircuit: {
	name: "Short Circuit",
	shortDesc: "When this Pokémon uses a move, it may instead use a random usable move.",
	rating: 3.5,
onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
	// Core random-move hijack
	onBeforeMove(pokemon, target, move) {
		// Recursion guard so our own useMove call doesn't loop back here
		const m = pokemon.m as any;
		if (m.shortCircuitResolving) return;

		// Build usable-move pool, like in the volatile:
		// respects Disable, Taunt, Encore, Imprison, Choice, PP, etc.
		const usable = pokemon.getMoves().filter(ms =>
			!ms.disabled && (ms.pp ?? 0) > 0 && this.dex.moves.get(ms.id).id !== 'struggle'
		);

		// No usable moves? Let Struggle or whatever normally happens go through
		if (!usable.length) return;

		// Randomly pick a move from the usable pool
		const pick = this.sample(usable);
		const picked = this.dex.moves.get(pick.id);

		// If RNG chose the same move, just let it proceed as-is
		if (picked.id === move.id) return;

		this.add('-ability', pokemon, 'Short Circuit');
		this.add('-message', `${pokemon.name} short-circuited and used ${picked.name} instead!`);

		// Fire the chosen move manually, then cancel the original
		m.shortCircuitResolving = true;
		const activeMove = this.dex.getActiveMove(picked);
		this.actions.useMove(activeMove, pokemon);
		m.shortCircuitResolving = false;

		// Cancel the originally queued move
		return false;
	},
},
random: {
	name: "Random",
	shortDesc: "On switch-in, becomes a random ability.",
	rating: 4,

	onStart(pokemon) {
		// Build a pool of real abilities
		const pool: Ability[] = [];
		for (const ability of this.dex.abilities.all()) {
			if (!ability.exists) continue;
			if (ability.id === 'random') continue;
			if (ability.id === 'nonexistent') continue;
			if (ability.id === 'noability') continue; // safety
			// If you want to exclude custom abilities in your mod, uncomment:
			// if (ability.isNonstandard) continue;

			pool.push(ability);
		}

		if (!pool.length) return;

		const chosen = this.sample(pool);

		// Change the Pokemon's ability permanently for this battle
		pokemon.setAbility(chosen.id, pokemon);


		// Show a message (setAbility does not always show a clean custom message)
		this.add('-ability', pokemon, chosen.name, '[from] ability: Random');
	},
	onUpdate(pokemon) {
		// Build a pool of real abilities
		const pool: Ability[] = [];
		for (const ability of this.dex.abilities.all()) {
			if (!ability.exists) continue;
			if (ability.id === 'random') continue;
			if (ability.id === 'nonexistent') continue;
			if (ability.id === 'noability') continue; // safety
			// If you want to exclude custom abilities in your mod, uncomment:
			// if (ability.isNonstandard) continue;

			pool.push(ability);
		}

		if (!pool.length) return;

		const chosen = this.sample(pool);

		// Change the Pokemon's ability permanently for this battle
		pokemon.setAbility(chosen.id, pokemon);


		// Show a message (setAbility does not always show a clean custom message)
		this.add('-ability', pokemon, chosen.name, '[from] ability: Random');
	},
},
noxiousspores: {
		onDamagingHit(damage, target, source, move) {
  if (!move || source === target) return;
  if (!this.checkMoveMakesContact(move, source, target)) return;

  if (this.randomChance(1, 3)) {
    source.setStatus('slp', target);
  } else if (this.randomChance(1, 2)) {
    source.setStatus('par', target);
  } else {
    source.setStatus('psn', target);
  }
},

		onStart(pokemon) { 
const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
},
flags: {},
		name: "Noxious Spores",
	},
priolottery: {
	name: "Priolottery",
	shortDesc: "This Pokémon's moves use a random priority: -2, 0, or +2.",
	rating: 3,

	onStart(pokemon) {
		this.effectState.lastTurn = 0;
		this.effectState.lastPrio = 0;
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);
	},

	// Roll once per turn for this Pokémon (so the message + ordering match)
	onModifyPriority(priority, pokemon, target, move) {
		if (this.effectState.lastTurn !== this.turn) {
			const r = this.random(3); // 0,1,2
			const p = (r === 0 ? -2 : r === 1 ? 0 : 2);
			this.effectState.lastTurn = this.turn;
			this.effectState.lastPrio = p;
		}
		return this.effectState.lastPrio as number;
	},

	// Print right before the move is used
	onBeforeMove(pokemon, target, move) {
		// ensure we have the same roll as ordering
		if (this.effectState.lastTurn !== this.turn) {
			const r = this.random(3);
			const p = (r === 0 ? -2 : r === 1 ? 0 : 2);
			this.effectState.lastTurn = this.turn;
			this.effectState.lastPrio = p;
		}

		const p = this.effectState.lastPrio as number;
		const sign = p > 0 ? '+' : '';
		this.add('-message', `${pokemon.name} rolled ${sign}${p} priority!`);
	},
},

slowbeginning: {
	name: "Slow Beginning",
	shortDesc: "Moves start at -2 priority; +1 priority each turn (max +2).",
	rating: 3.5,

	onStart(pokemon) {
		this.effectState.turns = 0;
		this.effectState.lastAnnounced = -999;
		const cur = pokemon.getTypes(true).join('/'); // runtime types 
const base = pokemon.species.types.join('/'); // species types 
this.add('-start', pokemon, 'typechange', cur);

		const p = -2;
		this.effectState.lastAnnounced = p;
		this.add('-message', `${pokemon.name}'s priority level is now ${p}.`);
	},

	onResidual(pokemon) {
		if (!pokemon.isActive || pokemon.fainted) return;

		// increase the turn counter then compute new priority
		this.effectState.turns++;
		const turns = this.effectState.turns as number;
		const p = Math.min(-2 + turns, 2);

		// only announce when it actually changes
		if (p !== this.effectState.lastAnnounced) {
			this.effectState.lastAnnounced = p;
			this.add('-message', `${pokemon.name}'s priority level increased to ${p}.`);
		}
	},

	onModifyPriority(priority, pokemon, target, move) {
		const turns = (this.effectState.turns || 0) as number;
		return Math.min(-2 + turns, 2);
	},
},


typethief: {
	name: "Type Thief",
	shortDesc: "On switch-in, steal a random foe's type; mono-type foes become a random new type.",
	rating: 4,

	onStart(pokemon) {
		const foes = pokemon.side.foe.active.filter(foe =>
			foe && !foe.fainted && pokemon.isAdjacent(foe)
		) as Pokemon[];
		if (!foes.length) return;

		const target = this.sample(foes);

		// runtime types (respect Soak/terastallize/your custom type changes)
		const targetTypesRaw = target.getTypes(true).filter(t => t !== '???');
		if (!targetTypesRaw.length) return;

		// pick one of target's types to steal
		const stolenType = this.sample(targetTypesRaw);

		// --- Update target types ---
		let newTargetTypes = targetTypesRaw.filter(t => t !== stolenType);

		if (!newTargetTypes.length) {
			// target was mono-type; reroll into a random DIFFERENT type (always)
			const allTypes = this.dex.types.names().filter(t =>
				t !== 'Stellar' && t !== '???' && t !== stolenType
			);
			if (!allTypes.length) return; // extremely unlikely
			const reroll = this.sample(allTypes);
			newTargetTypes = [reroll];
		}

		target.setType(newTargetTypes);

		// IMPORTANT: attribute the change to the thief, not the victim
		this.add(
			'-start',
			target,
			'typechange',
			newTargetTypes.join('/'),
			'[from] ability: Type Thief',
			'[of] ' + pokemon
		);

		// --- Update thief types (allow 3+ types if your fork supports it) ---
		const myTypes = pokemon.getTypes(true).filter(t => t !== '???');
		let newMyTypes = myTypes;

		if (!myTypes.includes(stolenType)) {
			newMyTypes = [...myTypes, stolenType];
			pokemon.setType(newMyTypes);
			this.add(
				'-start',
				pokemon,
				'typechange',
				newMyTypes.join('/'),
				'[from] ability: Type Thief'
			);
		}

		this.add('-message', `${pokemon.name} stole the ${stolenType} type from ${target.name}!`);
	},
},

// ============================================================================
// Bomb Diffusal — THREE VARIANTS (pick ONE; comment out the others)
// Only differences between versions:
//  - diffusal type acquisition
//  - move generator
// Everything else is identical to your latest skeleton/balance.
// ============================================================================

/* -------------------------------------------------------------------------- */
/*  VERSION 1: Random diffusal type from all 18 types + GUARANTEE matching move */
/* -------------------------------------------------------------------------- */
  bombdiffusal: {
    name: "Bomb Diffusal",
    shortDesc:
      "V1: On entry chooses random diffusal type (18 types) AND guarantees the bomb holder has a move of that type. Hit it with that type to diffuse (it faints and heals the attacker). Other types are resisted. Can't switch. Moves are disabled permanently after use. If it used Struggle (armed) and then faints to self-move damage, it KOs the foe; otherwise it deals 25% max HP. Damp blocks. Sturdy survives armed blast at 1 HP.",
    rating: 5,
    flags: {},

    onStart(pokemon) {
      // --- Typechange callout (your style) ---
      const cur = pokemon.getTypes(true).join('/');
      this.add('-start', pokemon, 'typechange', cur);

      const STANDARD_TYPES = [
        'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
        'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
      ] as const;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      // -----------------------------
      // Persisted state (ONLY roll/pick once per battle)
      // -----------------------------
      if (!m.bombDiffusalType) {
        // V1: pure random among all 18
        m.bombDiffusalType = this.sample(STANDARD_TYPES);
      }

      const diffType: string = m.bombDiffusalType;

      // Determine preferred attacking category based on the bomb holder's *current* stats
      const atkStat =
        ((pokemon as any).storedStats?.atk ?? pokemon.getStat?.('atk', false, true) ?? pokemon.species.baseStats.atk);
      const spaStat =
        ((pokemon as any).storedStats?.spa ?? pokemon.getStat?.('spa', false, true) ?? pokemon.species.baseStats.spa);

      const preferredCategory = atkStat >= spaStat ? 'Physical' : 'Special';

      // Persist chosen moves and used moves across forced switches
      if (!Array.isArray(m.bombChosenMoves) || m.bombChosenMoves.length !== 4) {
        const isAttacking = (mv: any) =>
          mv && mv.exists &&
          !mv.isZ && !mv.isMax &&
          mv.id !== 'struggle' &&
          mv.category !== 'Status' &&
          ((mv.basePower && mv.basePower > 0) || mv.damage || mv.ohko);

        const matchesPreferred = (mv: any) => mv.category === preferredCategory;

        const allMoves = this.dex.moves.all().filter(isAttacking);

        const usedTypes = new Set<string>();
        const usedMoves = new Set<string>();

        const pickMove = (filterFn: (mv: any) => boolean) => {
          const pool = allMoves.filter(mv =>
            filterFn(mv) &&
            !usedMoves.has(mv.id) &&
            !usedTypes.has(mv.type)
          );
          if (!pool.length) return null;
          return this.sample(pool);
        };

        const chosen: ID[] = [];

        // 1) GUARANTEE one diffType move if possible
        let diffMove = pickMove(mv => mv.type === diffType && matchesPreferred(mv));
        if (!diffMove) diffMove = pickMove(mv => mv.type === diffType);
        if (diffMove) {
          chosen.push(diffMove.id as ID);
          usedMoves.add(diffMove.id);
          usedTypes.add(diffMove.type);
        }

        // 2) Fill remaining: prefer preferredCategory first, then anything
        while (chosen.length < 4) {
          let mv = pickMove(m => matchesPreferred(m));
          if (!mv) mv = pickMove(() => true);
          if (!mv) break;

          chosen.push(mv.id as ID);
          usedMoves.add(mv.id);
          usedTypes.add(mv.type);
        }

        while (chosen.length < 4) chosen.push('tackle' as ID);

        // shuffle to hide which slot is diffusal type
        for (let i = chosen.length - 1; i > 0; i--) {
          const j = this.random(i + 1);
          [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
        }

        m.bombChosenMoves = chosen.slice();
        m.bombUsedMoves = {};
      } else if (!m.bombUsedMoves) {
        m.bombUsedMoves = {};
      }

      // IMPORTANT: "Armed" should persist if it already happened
      m.bombArmed = !!m.bombArmed;

      // Per-life flags (reset each time it becomes active)
      m.bombDiffused = false;
      m.bombLastAttacker = null;
      m.bombLastTarget = null;

      // Announce (NO diffusal type leak)
      this.add('-ability', pokemon, 'Bomb Diffusal');
      this.add('-message', `This Pokémon has a bomb! Hit it with the right type to diffuse it!`);

      // Cannot switch out (player choice)
      pokemon.addVolatile('bombdiffusal_trap');

      // Re-apply the SAME move set every time it becomes active & re-disable used
      const chosenMoves: ID[] = (m.bombChosenMoves as ID[]).slice();

      pokemon.moveSlots = [];
      (pokemon as any).baseMoveSlots = [];

      for (const id of chosenMoves) {
        const mv = this.dex.moves.get(id);
        const wasUsed = !!m.bombUsedMoves[mv.id];

        const slot = {
          move: mv.name,
          id: mv.id as ID,
          pp: wasUsed ? 0 : mv.pp,
          maxpp: wasUsed ? 0 : mv.pp,
          target: mv.target,
          disabled: wasUsed,
          disabledSource: wasUsed ? 'ability: Bomb Diffusal' : '',
          used: wasUsed,
        };

        pokemon.moveSlots.push({ ...slot });
        (pokemon as any).baseMoveSlots.push({ ...slot });
      }

      (pokemon as any).resetMoves?.();
    },

    // While Bomb Diffusal is active, do not allow Choice lock to restrict move choice.
    onBeforeMove(pokemon, target, move) {
      if (pokemon !== this.effectState.target) return;
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];
    },

    // Hard trap (player choice)
    onTrapPokemon(pokemon) {
      pokemon.trapped = true;
    },

    // Effectiveness-based damage reduction for non-diffusal types
    onSourceModifyDamage(damage, source, target, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      // Diffusal type handled by onTryHit
      if (move.type === diffType) return;

      // respect immunities
      if (!this.dex.getImmunity(move, target)) return;

      // damage reduction segment. If ability is too strong, remove this. If it is too weak, decrease these numbers to reduce damage taken.
	// currently it slightly reduces damage to make the bomb holder a bit bulkier, but not unkillable. Making it harder to kill
	// will incentivize diffusing the bomb instead
      const typeMod = this.dex.getEffectiveness(move, target);
      if (typeMod >= 2) return this.chainModify(0.25); // 4x -> 0.25x
      if (typeMod === 1) return this.chainModify(0.5);  // 2x -> 0.5x
      return this.chainModify(0.75);                    // neutral/resisted -> 0.75x
    },

    // Diffuse if hit by the diffusal type (damaging OR status)
    onTryHit(target, source, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;
      if (!source || source === target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      if (move.type === diffType) {
        m.bombDiffused = true;
        m.bombLastAttacker = source;

        this.add('-ability', target, 'Bomb Diffusal');
        this.add('-message', `${source.name} diffused the bomb!`);

        this.heal(source.maxhp, source, target);
        this.add('-anim', target, 'Memento', target);

        target.faint(source, move);
        return null;
      }
    },

    onAfterMove(pokemon, target, move) {
      if (!move) return;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      m.bombLastTarget = target || null;

      if (move.id === 'struggle') {
        m.bombArmed = true;
        this.add('-ability', pokemon, 'Bomb Diffusal');
        this.add('-message', `${pokemon.name}'s bomb is armed!`);
      }

      if (!m.bombUsedMoves) m.bombUsedMoves = {};
      m.bombUsedMoves[move.id] = true;

      for (const slot of pokemon.moveSlots) {
        if (slot.id === move.id) {
          slot.pp = 0;
          slot.maxpp = 0;
          slot.disabled = true;
          slot.disabledSource = 'ability: Bomb Diffusal';
          slot.used = true;
        }
      }
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];

      const baseSlots = (pokemon as any).baseMoveSlots;
      if (Array.isArray(baseSlots)) {
        for (const slot of baseSlots) {
          if (slot.id === move.id) {
            slot.pp = 0;
            slot.maxpp = 0;
            slot.disabled = true;
            slot.disabledSource = 'ability: Bomb Diffusal';
            slot.used = true;
          }
        }
      }

      pokemon.disableMove?.(move.id);
    },

    onFaint(pokemon) {
      // @ts-ignore
      const m = ((pokemon as any).m ??= {});
      if (m.bombDiffused) return;

      const victim =
        (m.bombLastTarget && !m.bombLastTarget.fainted) ? m.bombLastTarget :
        (m.bombLastAttacker && !m.bombLastAttacker.fainted) ? m.bombLastAttacker :
        pokemon.side.foe?.active?.find((p: any) => p && !p.fainted) || null;

      if (!victim) return;

      // Damp blocks ALL explosion effects
      if (victim.hasAbility?.('damp')) {
        this.add('-ability', victim, 'Damp');
        this.add('-message', `${victim.name} prevents the explosion!`);
        return;
      }

      this.add('-anim', pokemon, 'Explosion', victim);
      this.add('-message', `${pokemon.name}'s bomb explodes!`);

      // Armed => would KO, but Sturdy always leaves at 1 HP (even if not full)
      if (m.bombArmed) {
        if (victim.hasAbility?.('sturdy')) {
          this.add('-ability', victim, 'Sturdy');
          this.add('-message', `${victim.name} endured the blast!`);
          if (victim.hp > 1) this.damage(victim.hp - 1, victim, pokemon, this.effect);
          return;
        }
        victim.faint(pokemon, this.effect);
        return;
      }

      // Not armed => 25% max HP
      const dmg = Math.floor(victim.maxhp / 4);
      if (dmg > 0) this.damage(dmg, victim, pokemon, this.effect);
    },
  },




/* -------------------------------------------------------------------------- */
/*  VERSION 2: Diffusal type from FOE ALIVE STAB pool; NO guaranteed matching move */
/* -------------------------------------------------------------------------- */
/*
  bombdiffusal: {
    name: "Bomb Diffusal",
    shortDesc:
      "V2: On entry chooses diffusal type from opponent's alive STAB types (fallback random). Bomb holder is NOT guaranteed a matching move, making it a puzzle. Hit it with that type to diffuse (it faints and heals the attacker). Other types are resisted. Can't switch. Moves are disabled permanently after use. If it used Struggle (armed) and then faints to self-move damage, it KOs the foe; otherwise it deals 25% max HP. Damp blocks. Sturdy survives armed blast at 1 HP.",
    rating: 5,
    flags: {},

    onStart(pokemon) {
      const cur = pokemon.getTypes(true).join('/');
      this.add('-start', pokemon, 'typechange', cur);

      const STANDARD_TYPES = [
        'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
        'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
      ] as const;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      // -----------------------------
      // Persisted state (ONLY roll/pick once per battle)
      // -----------------------------
      if (!m.bombDiffusalType) {
        const foeTeam = pokemon.side.foe?.pokemon || [];
        const stabPool = new Set<string>();

        for (const foe of foeTeam) {
          if (!foe || foe.fainted) continue;
          const types = foe.getTypes?.(true) || foe.getTypes?.() || foe.types || [];
          for (const t of types) {
            if (t && t !== '???' && t !== 'Stellar') stabPool.add(t);
          }
        }

        const pool = [...stabPool].filter(t => (STANDARD_TYPES as readonly string[]).includes(t));
        m.bombDiffusalType = pool.length ? this.sample(pool) : this.sample(STANDARD_TYPES);
      }

      const diffType: string = m.bombDiffusalType;

      const atkStat =
        ((pokemon as any).storedStats?.atk ?? pokemon.getStat?.('atk', false, true) ?? pokemon.species.baseStats.atk);
      const spaStat =
        ((pokemon as any).storedStats?.spa ?? pokemon.getStat?.('spa', false, true) ?? pokemon.species.baseStats.spa);

      const preferredCategory = atkStat >= spaStat ? 'Physical' : 'Special';

      if (!Array.isArray(m.bombChosenMoves) || m.bombChosenMoves.length !== 4) {
        const isAttacking = (mv: any) =>
          mv && mv.exists &&
          !mv.isZ && !mv.isMax &&
          mv.id !== 'struggle' &&
          mv.category !== 'Status' &&
          ((mv.basePower && mv.basePower > 0) || mv.damage || mv.ohko);

        const matchesPreferred = (mv: any) => mv.category === preferredCategory;

        const allMoves = this.dex.moves.all().filter(isAttacking);

        const usedTypes = new Set<string>();
        const usedMoves = new Set<string>();

        const pickMove = (filterFn: (mv: any) => boolean) => {
          const pool = allMoves.filter(mv =>
            filterFn(mv) &&
            !usedMoves.has(mv.id) &&
            !usedTypes.has(mv.type)
          );
          if (!pool.length) return null;
          return this.sample(pool);
        };

        const chosen: ID[] = [];

        // V2: NO guaranteed diffType move.
        // Just fill 4 unique-type attacking moves, preferring preferredCategory first.
        while (chosen.length < 4) {
          let mv = pickMove(m => matchesPreferred(m));
          if (!mv) mv = pickMove(() => true);
          if (!mv) break;

          chosen.push(mv.id as ID);
          usedMoves.add(mv.id);
          usedTypes.add(mv.type);
        }

        while (chosen.length < 4) chosen.push('tackle' as ID);

        // shuffle (still hides any accidental diffType presence)
        for (let i = chosen.length - 1; i > 0; i--) {
          const j = this.random(i + 1);
          [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
        }

        m.bombChosenMoves = chosen.slice();
        m.bombUsedMoves = {};
      } else if (!m.bombUsedMoves) {
        m.bombUsedMoves = {};
      }

      m.bombArmed = !!m.bombArmed;

      m.bombDiffused = false;
      m.bombLastAttacker = null;
      m.bombLastTarget = null;

      this.add('-ability', pokemon, 'Bomb Diffusal');
      this.add('-message', `This Pokémon has a bomb! Hit it with the right type to diffuse it!`);

      pokemon.addVolatile('bombdiffusal_trap');

      const chosenMoves: ID[] = (m.bombChosenMoves as ID[]).slice();

      pokemon.moveSlots = [];
      (pokemon as any).baseMoveSlots = [];

      for (const id of chosenMoves) {
        const mv = this.dex.moves.get(id);
        const wasUsed = !!m.bombUsedMoves[mv.id];

        const slot = {
          move: mv.name,
          id: mv.id as ID,
          pp: wasUsed ? 0 : mv.pp,
          maxpp: wasUsed ? 0 : mv.pp,
          target: mv.target,
          disabled: wasUsed,
          disabledSource: wasUsed ? 'ability: Bomb Diffusal' : '',
          used: wasUsed,
        };

        pokemon.moveSlots.push({ ...slot });
        (pokemon as any).baseMoveSlots.push({ ...slot });
      }

      (pokemon as any).resetMoves?.();
    },

    onBeforeMove(pokemon, target, move) {
      if (pokemon !== this.effectState.target) return;
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];
    },

    onTrapPokemon(pokemon) {
      pokemon.trapped = true;
    },

    onSourceModifyDamage(damage, source, target, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      if (move.type === diffType) return;
      if (!this.dex.getImmunity(move, target)) return;

      const typeMod = this.dex.getEffectiveness(move, target);
      if (typeMod >= 2) return this.chainModify(0.25);
      if (typeMod === 1) return this.chainModify(0.5);
      return this.chainModify(0.75);
    },

    onTryHit(target, source, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;
      if (!source || source === target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      if (move.type === diffType) {
        m.bombDiffused = true;
        m.bombLastAttacker = source;

        this.add('-ability', target, 'Bomb Diffusal');
        this.add('-message', `${source.name} diffused the bomb!`);

        this.heal(source.maxhp, source, target);
        this.add('-anim', target, 'Memento', target);

        target.faint(source, move);
        return null;
      }
    },

    onAfterMove(pokemon, target, move) {
      if (!move) return;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      m.bombLastTarget = target || null;

      if (move.id === 'struggle') {
        m.bombArmed = true;
        this.add('-ability', pokemon, 'Bomb Diffusal');
        this.add('-message', `${pokemon.name}'s bomb is armed!`);
      }

      if (!m.bombUsedMoves) m.bombUsedMoves = {};
      m.bombUsedMoves[move.id] = true;

      for (const slot of pokemon.moveSlots) {
        if (slot.id === move.id) {
          slot.pp = 0;
          slot.maxpp = 0;
          slot.disabled = true;
          slot.disabledSource = 'ability: Bomb Diffusal';
          slot.used = true;
        }
      }
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];

      const baseSlots = (pokemon as any).baseMoveSlots;
      if (Array.isArray(baseSlots)) {
        for (const slot of baseSlots) {
          if (slot.id === move.id) {
            slot.pp = 0;
            slot.maxpp = 0;
            slot.disabled = true;
            slot.disabledSource = 'ability: Bomb Diffusal';
            slot.used = true;
          }
        }
      }

      pokemon.disableMove?.(move.id);
    },

    onFaint(pokemon) {
      // @ts-ignore
      const m = ((pokemon as any).m ??= {});
      if (m.bombDiffused) return;

      const victim =
        (m.bombLastTarget && !m.bombLastTarget.fainted) ? m.bombLastTarget :
        (m.bombLastAttacker && !m.bombLastAttacker.fainted) ? m.bombLastAttacker :
        pokemon.side.foe?.active?.find((p: any) => p && !p.fainted) || null;

      if (!victim) return;

      if (victim.hasAbility?.('damp')) {
        this.add('-ability', victim, 'Damp');
        this.add('-message', `${victim.name} prevents the explosion!`);
        return;
      }

      this.add('-anim', pokemon, 'Explosion', victim);
      this.add('-message', `${pokemon.name}'s bomb explodes!`);

      if (m.bombArmed) {
        if (victim.hasAbility?.('sturdy')) {
          this.add('-ability', victim, 'Sturdy');
          this.add('-message', `${victim.name} endured the blast!`);
          if (victim.hp > 1) this.damage(victim.hp - 1, victim, pokemon, this.effect);
          return;
        }
        victim.faint(pokemon, this.effect);
        return;
      }

      const dmg = Math.floor(victim.maxhp / 4);
      if (dmg > 0) this.damage(dmg, victim, pokemon, this.effect);
    },
  },
*/


/* -------------------------------------------------------------------------- */
/*  VERSION 3: Diffusal type from FOE ALIVE STAB pool; bomb-move TYPES from same pool */
/*          If <4 types for moves, expand move-type pool to ALL 18 types        */
/* -------------------------------------------------------------------------- */
/*
  bombdiffusal: {
    name: "Bomb Diffusal",
    shortDesc:
      "V3: On entry chooses diffusal type from opponent's alive STAB types (fallback random). Then generates the bomb holder's move TYPES using the same alive-STAB pool; if <4 types exist, expands the move-type pool to all 18 types. Hit it with the diffusal type to diffuse (it faints and heals the attacker). Other types are resisted. Can't switch. Moves are disabled permanently after use. If it used Struggle (armed) and then faints to self-move damage, it KOs the foe; otherwise it deals 25% max HP. Damp blocks. Sturdy survives armed blast at 1 HP.",
    rating: 5,
    flags: {},

    onStart(pokemon) {
      const cur = pokemon.getTypes(true).join('/');
      this.add('-start', pokemon, 'typechange', cur);

      const STANDARD_TYPES = [
        'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
        'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
      ] as const;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      // -----------------------------
      // Helper: alive foe STAB pool
      // -----------------------------
      const getAliveFoeStabPool = (): string[] => {
        const foeTeam = pokemon.side.foe?.pokemon || [];
        const stabSet = new Set<string>();

        for (const foe of foeTeam) {
          if (!foe || foe.fainted) continue;
          const types = foe.getTypes?.(true) || foe.getTypes?.() || foe.types || [];
          for (const t of types) {
            if (t && t !== '???' && t !== 'Stellar') stabSet.add(t);
          }
        }

        return [...stabSet].filter(t => (STANDARD_TYPES as readonly string[]).includes(t));
      };

      const foeStabPool = getAliveFoeStabPool();

      // -----------------------------
      // Persisted state (ONLY roll/pick once per battle)
      // -----------------------------
      if (!m.bombDiffusalType) {
        // V3 diffusal type: from foe alive STAB pool, else random all 18
        m.bombDiffusalType = foeStabPool.length ? this.sample(foeStabPool) : this.sample(STANDARD_TYPES);
      }

      const diffType: string = m.bombDiffusalType;

      const atkStat =
        ((pokemon as any).storedStats?.atk ?? pokemon.getStat?.('atk', false, true) ?? pokemon.species.baseStats.atk);
      const spaStat =
        ((pokemon as any).storedStats?.spa ?? pokemon.getStat?.('spa', false, true) ?? pokemon.species.baseStats.spa);

      const preferredCategory = atkStat >= spaStat ? 'Physical' : 'Special';

      if (!Array.isArray(m.bombChosenMoves) || m.bombChosenMoves.length !== 4) {
        const isAttacking = (mv: any) =>
          mv && mv.exists &&
          !mv.isZ && !mv.isMax &&
          mv.id !== 'struggle' &&
          mv.category !== 'Status' &&
          ((mv.basePower && mv.basePower > 0) || mv.damage || mv.ohko);

        const matchesPreferred = (mv: any) => mv.category === preferredCategory;

        const allMoves = this.dex.moves.all().filter(isAttacking);

        // Move-type pool rule:
        // - Start from foe alive STAB pool
        // - If fewer than 4 types, expand to ALL 18 for move typing
        const moveTypePool: string[] =
          foeStabPool.length >= 4 ? foeStabPool.slice() : Array.from(STANDARD_TYPES);

        // Pick up to 4 unique types from moveTypePool
        const chosenTypes = new Set<string>();
        while (chosenTypes.size < 4 && moveTypePool.length) {
          // sample without replacement-ish: sample then delete
          const t = this.sample(moveTypePool);
          chosenTypes.add(t);
          const idx = moveTypePool.indexOf(t);
          if (idx >= 0) moveTypePool.splice(idx, 1);
        }

        const usedMoves = new Set<string>();
        const usedTypes = new Set<string>();

        const pickMoveForType = (type: string) => {
          // Prefer preferredCategory for that type
          let pool = allMoves.filter(mv =>
            mv.type === type &&
            matchesPreferred(mv) &&
            !usedMoves.has(mv.id) &&
            !usedTypes.has(mv.type)
          );
          if (!pool.length) {
            pool = allMoves.filter(mv =>
              mv.type === type &&
              !usedMoves.has(mv.id) &&
              !usedTypes.has(mv.type)
            );
          }
          if (!pool.length) return null;
          return this.sample(pool);
        };

        const pickAnyMoveUniqueType = () => {
          let pool = allMoves.filter(mv =>
            matchesPreferred(mv) &&
            !usedMoves.has(mv.id) &&
            !usedTypes.has(mv.type)
          );
          if (!pool.length) {
            pool = allMoves.filter(mv =>
              !usedMoves.has(mv.id) &&
              !usedTypes.has(mv.type)
            );
          }
          if (!pool.length) return null;
          return this.sample(pool);
        };

        const chosen: ID[] = [];

        // First, try to realize the 4 chosen types
        for (const t of chosenTypes) {
          const mv = pickMoveForType(t);
          if (!mv) continue;
          chosen.push(mv.id as ID);
          usedMoves.add(mv.id);
          usedTypes.add(mv.type);
          if (chosen.length >= 4) break;
        }

        // If we couldn’t fill 4 (e.g., no valid attacking moves found for a type),
        // fill remaining with any unique-type attacking moves.
        while (chosen.length < 4) {
          const mv = pickAnyMoveUniqueType();
          if (!mv) break;
          chosen.push(mv.id as ID);
          usedMoves.add(mv.id);
          usedTypes.add(mv.type);
        }

        while (chosen.length < 4) chosen.push('tackle' as ID);

        // shuffle
        for (let i = chosen.length - 1; i > 0; i--) {
          const j = this.random(i + 1);
          [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
        }

        m.bombChosenMoves = chosen.slice();
        m.bombUsedMoves = {};
      } else if (!m.bombUsedMoves) {
        m.bombUsedMoves = {};
      }

      m.bombArmed = !!m.bombArmed;

      m.bombDiffused = false;
      m.bombLastAttacker = null;
      m.bombLastTarget = null;

      this.add('-ability', pokemon, 'Bomb Diffusal');
      this.add('-message', `This Pokémon has a bomb! Hit it with the right type to diffuse it!`);

      pokemon.addVolatile('bombdiffusal_trap');

      const chosenMoves: ID[] = (m.bombChosenMoves as ID[]).slice();

      pokemon.moveSlots = [];
      (pokemon as any).baseMoveSlots = [];

      for (const id of chosenMoves) {
        const mv = this.dex.moves.get(id);
        const wasUsed = !!m.bombUsedMoves[mv.id];

        const slot = {
          move: mv.name,
          id: mv.id as ID,
          pp: wasUsed ? 0 : mv.pp,
          maxpp: wasUsed ? 0 : mv.pp,
          target: mv.target,
          disabled: wasUsed,
          disabledSource: wasUsed ? 'ability: Bomb Diffusal' : '',
          used: wasUsed,
        };

        pokemon.moveSlots.push({ ...slot });
        (pokemon as any).baseMoveSlots.push({ ...slot });
      }

      (pokemon as any).resetMoves?.();
    },

    onBeforeMove(pokemon, target, move) {
      if (pokemon !== this.effectState.target) return;
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];
    },

    onTrapPokemon(pokemon) {
      pokemon.trapped = true;
    },

    onSourceModifyDamage(damage, source, target, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      if (move.type === diffType) return;
      if (!this.dex.getImmunity(move, target)) return;

      const typeMod = this.dex.getEffectiveness(move, target);
      if (typeMod >= 2) return this.chainModify(0.25);
      if (typeMod === 1) return this.chainModify(0.5);
      return this.chainModify(0.75);
    },

    onTryHit(target, source, move) {
      if (!move || !target) return;
      if (target !== this.effectState.target) return;
      if (!source || source === target) return;

      // @ts-ignore
      const m = ((target as any).m ??= {});
      const diffType: string | undefined = m.bombDiffusalType;
      if (!diffType) return;

      if (move.type === diffType) {
        m.bombDiffused = true;
        m.bombLastAttacker = source;

        this.add('-ability', target, 'Bomb Diffusal');
        this.add('-message', `${source.name} diffused the bomb!`);

        this.heal(source.maxhp, source, target);
        this.add('-anim', target, 'Memento', target);

        target.faint(source, move);
        return null;
      }
    },

    onAfterMove(pokemon, target, move) {
      if (!move) return;

      // @ts-ignore
      const m = ((pokemon as any).m ??= {});

      m.bombLastTarget = target || null;

      if (move.id === 'struggle') {
        m.bombArmed = true;
        this.add('-ability', pokemon, 'Bomb Diffusal');
        this.add('-message', `${pokemon.name}'s bomb is armed!`);
      }

      if (!m.bombUsedMoves) m.bombUsedMoves = {};
      m.bombUsedMoves[move.id] = true;

      for (const slot of pokemon.moveSlots) {
        if (slot.id === move.id) {
          slot.pp = 0;
          slot.maxpp = 0;
          slot.disabled = true;
          slot.disabledSource = 'ability: Bomb Diffusal';
          slot.used = true;
        }
      }
      if (pokemon.volatiles['choicelock']) delete pokemon.volatiles['choicelock'];

      const baseSlots = (pokemon as any).baseMoveSlots;
      if (Array.isArray(baseSlots)) {
        for (const slot of baseSlots) {
          if (slot.id === move.id) {
            slot.pp = 0;
            slot.maxpp = 0;
            slot.disabled = true;
            slot.disabledSource = 'ability: Bomb Diffusal';
            slot.used = true;
          }
        }
      }

      pokemon.disableMove?.(move.id);
    },

    onFaint(pokemon) {
      // @ts-ignore
      const m = ((pokemon as any).m ??= {});
      if (m.bombDiffused) return;

      const victim =
        (m.bombLastTarget && !m.bombLastTarget.fainted) ? m.bombLastTarget :
        (m.bombLastAttacker && !m.bombLastAttacker.fainted) ? m.bombLastAttacker :
        pokemon.side.foe?.active?.find((p: any) => p && !p.fainted) || null;

      if (!victim) return;

      if (victim.hasAbility?.('damp')) {
        this.add('-ability', victim, 'Damp');
        this.add('-message', `${victim.name} prevents the explosion!`);
        return;
      }

      this.add('-anim', pokemon, 'Explosion', victim);
      this.add('-message', `${pokemon.name}'s bomb explodes!`);

      if (m.bombArmed) {
        if (victim.hasAbility?.('sturdy')) {
          this.add('-ability', victim, 'Sturdy');
          this.add('-message', `${victim.name} endured the blast!`);
          if (victim.hp > 1) this.damage(victim.hp - 1, victim, pokemon, this.effect);
          return;
        }
        victim.faint(pokemon, this.effect);
        return;
      }

      const dmg = Math.floor(victim.maxhp / 4);
      if (dmg > 0) this.damage(dmg, victim, pokemon, this.effect);
    },
  },
*/
  singleminded: {
  name: "Single Minded",
  shortDesc:
    "Power rises with consecutive uses of the same move (+0/+20/+50/+90 BP). On fatal damage: lives at 1 HP, fully heals, and becomes Duodra.",
  rating: 5,

  onStart(pokemon) {
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    m.singleMindedLastMove = '';
    m.singleMindedStreak = 0;
    m.singleMindedCurStreak = 0;
    m.mondraPhase = m.mondraPhase ?? 1; // 1=Mondra, 2=Duodra, 3=Polydra
    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  onSwitchOut(pokemon) {
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    m.singleMindedLastMove = '';
    m.singleMindedStreak = 0;
    m.singleMindedCurStreak = 0;
  },

  onBeforeMove(pokemon, target, move) {
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});

    if (!move || move.category === 'Status' || move.id === 'struggle') {
      m.singleMindedLastMove = '';
      m.singleMindedStreak = 0;
      m.singleMindedCurStreak = 0;
      return;
    }

    if (m.singleMindedLastMove === move.id) {
      m.singleMindedStreak = (m.singleMindedStreak || 0) + 1;
    } else {
      m.singleMindedLastMove = move.id;
      m.singleMindedStreak = 1;
    }
    m.singleMindedCurStreak = m.singleMindedStreak;
  },

  onBasePower(basePower, pokemon, target, move) {
    if (!move || move.category === 'Status') return;

    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    const n: number = m.singleMindedCurStreak || 1;

    let bonus = 0;
    if (n === 2) bonus = 20;
    else if (n === 3) bonus = 50;
    else if (n >= 4) bonus = 90;

    if (bonus) return basePower + bonus;
  },

  onDamage(damage, target, source, effect) {
    // Phase 1 -> Phase 2 transition
    if (damage < target.hp) return;

    // @ts-ignore
    const m = ((target as any).m ??= {});
    if (m.mondraPhase >= 2) return; // already past Mondra
    m.mondraPhase = 2;

    this.add('-activate', target, 'ability: Single Minded');
    this.add('-message', `${target.name} refuses to fall!`);
    target.hp = 1;

    // Change into Duodra and fully heal
    target.formeChange('Duodra', this.effect, true);

    // === Curated phase-2 moves (Duodra) ===
    {
      const moveList = ['Dragon Breath', 'Evaporate', 'Mystic Pulse', 'Ancient Power'];
      const slots = moveList.map(name => {
        const mv = this.dex.moves.get(name);
        return {
          move: mv.name,
          id: mv.id,
          pp: mv.pp,
          maxpp: mv.pp,
          target: mv.target,
          disabled: false,
          used: false,
        };
      });

      // @ts-ignore
      target.moveSlots = slots;
      // @ts-ignore
      target.baseMoveSlots = slots.map(s => ({...s}));

      // IMPORTANT: do NOT assign `target.moves` in your fork (read-only getter)
    }

    // Fully heal (use sethp if your fork has it)
    if ((target as any).sethp) (target as any).sethp(target.maxhp);
    else target.hp = target.maxhp;

    target.clearVolatile();
    this.add('-message', `${target.name} transformed into Duodra!`);

    // Prevent the KO
    return 0;
  },
},

  twoheads: {
  name: "Two Heads",
  shortDesc:
    "Singles: attacks hit twice at 0.5× power. Doubles: attacks target all foes at 0.65× power. On fatal damage: lives at 1 HP, fully heals, becomes Polydra. 10%: burn on contact, heal 50% damage, frostbite from special.",
  rating: 5,

  onStart(pokemon) {
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    m.mondraPhase = m.mondraPhase ?? 2;
    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  onModifyMove(move, source, target) {
    if (!move || move.category === 'Status') return;

    // Doubles+ (two opposing slots exist)
    const isMulti = source.battle?.gameType && source.battle.gameType !== 'singles';

    if (isMulti) {
      // Hit both opposing slots at 0.65x
      move.target = 'allAdjacentFoes';
      // @ts-ignore
      move.twoHeadsMod = 0.65;
    } else {
      // Singles: hit twice at half power
      move.multihit = 2;
      // @ts-ignore
      move.twoHeadsMod = 0.5;
    }
  },

  onBasePower(basePower, source, target, move) {
    // @ts-ignore
    const mod = move?.twoHeadsMod;
    if (!mod) return;
    return this.chainModify(mod);
  },

  onDamagingHit(damage, target, source, move) {
    if (!source || source.fainted) return;

    // 10% burn attacker if contact move
    if (move?.flags?.contact && this.randomChance(1, 10)) {
      source.trySetStatus('brn', target, this.effect);
    }

    // 10% heal 50% of damage taken
    if (damage && this.randomChance(1, 10)) {
      target.heal(damage / 2);
    }

    // 10% frostbite attacker if hit was special
    if (move?.category === 'Special' && this.randomChance(1, 10)) {
      source.trySetStatus('frb', target, this.effect);
    }
  },

  onDamage(damage, target, source, effect) {
    // Phase 2 -> Phase 3 transition
    if (damage < target.hp) return;

    // @ts-ignore
    const m = ((target as any).m ??= {});
    if (m.mondraPhase >= 3) return;
    m.mondraPhase = 3;

    this.add('-activate', target, 'ability: Two Heads');
    this.add('-message', `${target.name} refuses to fall again!`);
    target.hp = 1;

    target.formeChange('Polydra', this.effect, true);

    // === Curated phase-3 moves (Polydra) ===
    {
      const moveList = ['Tri Attack', 'Striking Storm', 'Searing Stab', 'Revelation Dance'];
      const slots = moveList.map(name => {
        const mv = this.dex.moves.get(name);
        return {
          move: mv.name,
          id: mv.id,
          pp: mv.pp,
          maxpp: mv.pp,
          target: mv.target,
          disabled: false,
          used: false,
        };
      });

      // @ts-ignore
      target.moveSlots = slots;
      // @ts-ignore
      target.baseMoveSlots = slots.map(s => ({...s}));

      // IMPORTANT: do NOT assign `target.moves` in your fork (read-only getter)
    }

    if ((target as any).sethp) (target as any).sethp(target.maxhp);
    else target.hp = target.maxhp;

    target.clearVolatile();
    this.add('-message', `${target.name} transformed into Polydra!`);

    return 0;
  },
},

  divide: {
  name: "Divide",
  shortDesc:
    "On hit: lower target's Atk (if Physical) or SpA (if Special) by 1. When hit: randomly lose 1 type (max 1/turn; multihit counts once) until 1 type remains. Immune to non-volatile status.",
  rating: 5,

  onStart(pokemon) {
    // @ts-ignore
    const m = ((pokemon as any).m ??= {});
    m.divideLastTypeRemoveTurn = -1;

    // NEW: ignore the first type-loss check once (prevents transformation/entry hit from shattering a type)
    // If some other effect wants to skip again later, it can set this flag back to true.
    m.divideIgnoreNextTypeLoss = true;

    const cur = pokemon.getTypes(true).join('/');
    this.add('-start', pokemon, 'typechange', cur);
  },

  // Status immunity (like Purifying Salt but no Ghost reduction)
  onSetStatus(status, target, source, effect) {
    if (!status) return;
    // block all non-volatile status
    this.add('-immune', target, '[from] ability: Divide');
    return false;
  },

  // Offensive debuff: run for each affected target (works well in doubles too)
  onAfterMoveSecondarySelf(source, target, move) {
    if (!target || target.fainted) return;
    if (!move || move.category === 'Status') return;
    if (!move.damage && move.damage !== 0 && !move.basePower) return; // skip weird non-damaging moves

    if (move.category === 'Physical') {
      this.boost({atk: -1}, target, source, this.effect);
    } else if (move.category === 'Special') {
      this.boost({spa: -1}, target, source, this.effect);
    }
  },

  // Defensive type shedding: once per turn, once even for multihit
  onDamagingHit(damage, target, source, move) {
    // @ts-ignore
    const m = ((target as any).m ??= {});

    // NEW: one-time skip of type loss (consumed immediately)
    if (m.divideIgnoreNextTypeLoss) {
      m.divideIgnoreNextTypeLoss = false;
      return;
    }

    if (m.divideLastTypeRemoveTurn === this.turn) return;
    m.divideLastTypeRemoveTurn = this.turn;

    const types: string[] = (target as any).getTypes ? (target as any).getTypes(true) : (target as any).types;
    if (!types || types.length <= 1) return;

    const removed = this.sample(types);
    const newTypes = types.filter(t => t !== removed);
    if (!newTypes.length) return;

    if ((target as any).setType) {
      (target as any).setType(newTypes);
    } else {
      // fallback if your fork stores types directly
      (target as any).types = newTypes;
    }

    // Nice feedback
    this.add('-message', `${target.name}'s ${removed} type shattered!`);
    this.add('-start', target, 'typechange', newTypes.join('/'), '[from] ability: Divide');
  },
},








};

