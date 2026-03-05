export const Conditions: import('../sim/dex-conditions').ConditionDataTable = {
	brn: {
		name: 'brn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'flameorb') {
				this.add('-status', target, 'brn', '[from] item: Flame Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'brn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'brn');
			}
		},
		// Damage reduction is handled directly in the sim/battle.js damage function
		onResidualOrder: 10,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 16);
		},
	},
	par: {
		name: 'par',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'par', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'par');
			}
		},
		onModifySpePriority: -101,
		onModifySpe(spe, pokemon) {
			// Paralysis occurs after all other Speed modifiers, so evaluate all modifiers up to this point first
			spe = this.finalModify(spe);
			if (!pokemon.hasAbility('quickfeet')) {
				spe = Math.floor(spe * 50 / 100);
			}
			return spe;
		},
		onBeforeMovePriority: 1,
		onBeforeMove(pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'slp', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', `[from] move: ${sourceEffect.name}`);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-3 turns
			this.effectState.startTime = this.random(2, 5);
			this.effectState.time = this.effectState.startTime;

			if (target.removeVolatile('nightmare')) {
				this.add('-end', target, 'Nightmare', '[silent]');
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time--;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		name: 'frz',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'frz', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'frz');
			}
			if (target.species.name === 'Shaymin-Sky' && target.baseSpecies.baseSpecies === 'Shaymin') {
				target.formeChange('Shaymin', this.effect, true);
			}
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (move.flags['defrost']) return;
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove(move, pokemon) {
			if (move.flags['defrost']) {
				this.add('-curestatus', pokemon, 'frz', `[from] move: ${move}`);
				pokemon.clearStatus();
			}
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.thawsTarget) {
				target.cureStatus();
			}
		},
		onDamagingHit(damage, target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' && move.id !== 'polarflare') {
				target.cureStatus();
			}
		},
	},
	psn: {
		name: 'psn',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'psn', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'psn');
			}
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			this.damage(pokemon.baseMaxhp / 8);
		},
	},
	tox: {
		name: 'tox',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			this.effectState.stage = 0;
			if (sourceEffect && sourceEffect.id === 'toxicorb') {
				this.add('-status', target, 'tox', '[from] item: Toxic Orb');
			} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
				this.add('-status', target, 'tox', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-status', target, 'tox');
			}
		},
		onSwitchIn() {
			this.effectState.stage = 0;
		},
		onResidualOrder: 9,
		onResidual(pokemon) {
			if (this.effectState.stage < 15) {
				this.effectState.stage++;
			}
			this.damage(this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
		},
	},
	confusion: {
		name: 'confusion',
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect?.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[fatigue]');
			} else if (sourceEffect?.effectType === 'Ability') {
				this.add('-start', target, 'confusion', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
			} else {
				this.add('-start', target, 'confusion');
			}
			const min = sourceEffect?.id === 'axekick' ? 3 : 2;
			this.effectState.time = this.random(min, 6);
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(33, 100)) {
				return;
			}
			this.activeTarget = pokemon;
			const damage = this.actions.getConfusionDamage(pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			const activeMove = { id: this.toID('confused'), effectType: 'Move', type: '???' };
			this.damage(damage, pokemon, pokemon, activeMove as ActiveMove);
			return false;
		},
	},
	flinch: {
		name: 'flinch',
		duration: 1,
		onBeforeMovePriority: 8,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'flinch');
			this.runEvent('Flinch', pokemon);
			return false;
		},
	},
	trapped: {
		name: 'trapped',
		noCopy: true,
		onTrapPokemon(pokemon) {
			pokemon.tryTrap();
		},
		onStart(target) {
			this.add('-activate', target, 'trapped');
		},
	},
	trapper: {
		name: 'trapper',
		noCopy: true,
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		duration: 5,
		durationCallback(target, source) {
			if (source?.hasItem('gripclaw')) return 8;
			return this.random(5, 7);
		},
		onStart(pokemon, source) {
			this.add('-activate', pokemon, 'move: ' + this.effectState.sourceEffect, `[of] ${source}`);
			this.effectState.boundDivisor = source.hasItem('bindingband') ? 6 : 8;
		},
		onResidualOrder: 13,
		onResidual(pokemon) {
			const source = this.effectState.source;
			// G-Max Centiferno and G-Max Sandblast continue even after the user leaves the field
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns) && !gmaxEffect) {
				delete pokemon.volatiles['partiallytrapped'];
				this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]', '[silent]');
				return;
			}
			this.damage(pokemon.baseMaxhp / this.effectState.boundDivisor);
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, this.effectState.sourceEffect, '[partiallytrapped]');
		},
		onTrapPokemon(pokemon) {
			const gmaxEffect = ['gmaxcentiferno', 'gmaxsandblast'].includes(this.effectState.sourceEffect.id);
			if (this.effectState.source?.isActive || gmaxEffect) pokemon.tryTrap();
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		name: 'lockedmove',
		duration: 2,
		onResidual(target) {
			if (target.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
			this.effectState.trueDuration--;
		},
		onStart(target, source, effect) {
			this.effectState.trueDuration = this.random(2, 4);
			this.effectState.move = effect.id;
		},
		onRestart() {
			if (this.effectState.trueDuration >= 2) {
				this.effectState.duration = 2;
			}
		},
		onAfterMove(pokemon) {
			if (this.effectState.duration === 1) {
				pokemon.removeVolatile('lockedmove');
			}
		},
		onEnd(target) {
			if (this.effectState.trueDuration > 1) return;
			target.addVolatile('confusion');
		},
		onLockMove(pokemon) {
			if (pokemon.volatiles['dynamax']) return;
			return this.effectState.move;
		},
	},
	twoturnmove: {
		// Skull Bash, SolarBeam, Sky Drop...
		name: 'twoturnmove',
		duration: 2,
		onStart(attacker, defender, effect) {
			// ("attacker" is the Pokemon using the two turn move and the Pokemon this condition is being applied to)
			this.effectState.move = effect.id;
			attacker.addVolatile(effect.id);
			// lastMoveTargetLoc is the location of the originally targeted slot before any redirection
			// note that this is not updated for moves called by other moves
			// i.e. if Dig is called by Metronome, lastMoveTargetLoc will still be the user's location
			let moveTargetLoc: number = attacker.lastMoveTargetLoc!;
			if (effect.sourceEffect && this.dex.moves.get(effect.id).target !== 'self') {
				// this move was called by another move such as Metronome
				// and needs a random target to be determined this turn
				// it will already have one by now if there is any valid target
				// but if there isn't one we need to choose a random slot now
				if (defender.fainted) {
					defender = this.sample(attacker.foes(true));
				}
				moveTargetLoc = attacker.getLocOf(defender);
			}
			attacker.volatiles[effect.id].targetLoc = moveTargetLoc;
			this.attrLastMove('[still]');
			// Run side-effects normally associated with hitting (e.g., Protean, Libero)
			this.runEvent('PrepareHit', attacker, defender, effect);
		},
		onEnd(target) {
			target.removeVolatile(this.effectState.move);
		},
		onLockMove() {
			return this.effectState.move;
		},
		onMoveAborted(pokemon) {
			pokemon.removeVolatile('twoturnmove');
		},
	},
	choicelock: {
		name: 'choicelock',
		noCopy: true,
		onStart(pokemon) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!this.activeMove.id || this.activeMove.hasBounced || this.activeMove.sourceEffect === 'snatch') return false;
			this.effectState.move = this.activeMove.id;
		},
		onBeforeMove(pokemon, target, move) {
			if (!pokemon.getItem().isChoice) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (
				!pokemon.ignoringItem() && !pokemon.volatiles['dynamax'] &&
				move.id !== this.effectState.move && move.id !== 'struggle'
			) {
				// Fails unless the Choice item is being ignored, and no PP is lost
				this.addMove('move', pokemon, move.name);
				this.attrLastMove('[still]');
				this.debug("Disabled by Choice item lock");
				this.add('-fail', pokemon);
				return false;
			}
		},
		onDisableMove(pokemon) {
			if (!pokemon.getItem().isChoice || !pokemon.hasMove(this.effectState.move)) {
				pokemon.removeVolatile('choicelock');
				return;
			}
			if (pokemon.ignoringItem() || pokemon.volatiles['dynamax']) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectState.move) {
					pokemon.disableMove(moveSlot.id, false, this.effectState.sourceEffect);
				}
			}
		},
	},
	mustrecharge: {
		name: 'mustrecharge',
		duration: 2,
		onBeforeMovePriority: 11,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'recharge');
			pokemon.removeVolatile('mustrecharge');
			pokemon.removeVolatile('truant');
			return null;
		},
		onStart(pokemon) {
			this.add('-mustrecharge', pokemon);
		},
		onLockMove: 'recharge',
	},
	futuremove: {
		// this is a slot condition
		name: 'futuremove',
		onStart(target) {
			this.effectState.targetSlot = target.getSlot();
			this.effectState.endingTurn = (this.turn - 1) + 2;
			if (this.effectState.endingTurn >= 254) {
				this.hint(`In Gen 8+, Future attacks will never resolve when used on the 255th turn or later.`);
			}
		},
		onResidualOrder: 3,
		onResidual(target: Pokemon) {
			if (this.getOverflowedTurnCount() < this.effectState.endingTurn) return;
			target.side.removeSlotCondition(this.getAtSlot(this.effectState.targetSlot), 'futuremove');
		},
		onEnd(target) {
			const data = this.effectState;
			// time's up; time to hit! :D
			const move = this.dex.moves.get(data.move);
			if (target.fainted || target === data.source) {
				this.hint(`${move.name} did not hit because the target is ${(target.fainted ? 'fainted' : 'the user')}.`);
				return;
			}

			this.add('-end', target, 'move: ' + move.name);
			target.removeVolatile('Protect');
			target.removeVolatile('Endure');

			if (data.source.hasAbility('infiltrator') && this.gen >= 6) {
				data.moveData.infiltrates = true;
			}
			if (data.source.hasAbility('normalize') && this.gen >= 6) {
				data.moveData.type = 'Normal';
			}
			const hitMove = new this.dex.Move(data.moveData) as ActiveMove;

			this.actions.trySpreadMoveHit([target], data.source, hitMove, true);
			if (data.source.isActive && data.source.hasItem('lifeorb') && this.gen >= 5) {
				this.singleEvent('AfterMoveSecondarySelf', data.source.getItem(), data.source.itemState, data.source, target, data.source.getItem());
			}
			this.activeMove = null;

			this.checkWin();
		},
	},
	healreplacement: {
		// this is a slot condition
		name: 'healreplacement',
		onStart(target, source, sourceEffect) {
			this.effectState.sourceEffect = sourceEffect;
			this.add('-activate', source, 'healreplacement');
		},
		onSwitchIn(target) {
			if (!target.fainted) {
				target.heal(target.maxhp);
				this.add('-heal', target, target.getHealth, '[from] move: ' + this.effectState.sourceEffect, '[zeffect]');
				target.side.removeSlotCondition(target, 'healreplacement');
			}
		},
	},
	stall: {
		// Protect, Detect, Endure counter
		name: 'stall',
		duration: 2,
		counterMax: 729,
		onStart() {
			this.effectState.counter = 3;
		},
		onStallMove(pokemon) {
			// this.effectState.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			const counter = this.effectState.counter || 1;
			this.debug(`Success chance: ${Math.round(100 / counter)}%`);
			const success = this.randomChance(1, counter);
			if (!success) delete pokemon.volatiles['stall'];
			return success;
		},
		onRestart() {
			if (this.effectState.counter < (this.effect as Condition).counterMax!) {
				this.effectState.counter *= 3;
			}
			this.effectState.duration = 2;
		},
	},
	gem: {
		name: 'gem',
		duration: 1,
		affectsFainted: true,
		onBasePowerPriority: 14,
		onBasePower(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify([5325, 4096]);
		},
	},

	// weather is implemented here since it's so important to the game

	raindance: {
		name: 'RainDance',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('damprock')) {
				return 8;
			}
			return 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'RainDance', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'RainDance');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'RainDance', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	primordialsea: {
		name: 'PrimordialSea',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				this.debug('Primordial Sea fire suppress');
				this.add('-fail', attacker, move, '[from] Primordial Sea');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Water') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'PrimordialSea', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'PrimordialSea', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	sunnyday: {
		name: 'SunnyDay',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('heatrock')) {
				return 8;
			}
			return 5;
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (move.id === 'hydrosteam' && !attacker.hasItem('utilityumbrella')) {
				this.debug('Sunny Day Hydro Steam boost');
				return this.chainModify(1.5);
			}
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},
		onFieldStart(battle, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'SunnyDay', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'SunnyDay');
			}
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'SunnyDay', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	desolateland: {
		name: 'DesolateLand',
		effectType: 'Weather',
		duration: 0,
		onTryMovePriority: 1,
		onTryMove(attacker, defender, move) {
			if (move.type === 'Water' && move.category !== 'Status') {
				this.debug('Desolate Land water suppress');
				this.add('-fail', attacker, move, '[from] Desolate Land');
				this.attrLastMove('[still]');
				return null;
			}
		},
		onWeatherModifyDamage(damage, attacker, defender, move) {
			if (defender.hasItem('utilityumbrella')) return;
			if (move.type === 'Fire') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DesolateLand', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onImmunity(type, pokemon) {
			if (pokemon.hasItem('utilityumbrella')) return;
			if (type === 'frz') return false;
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DesolateLand', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	sandstorm: {
		name: 'Sandstorm',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('smoothrock')) {
				return 8;
			}
			return 5;
		},
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifySpDPriority: 10,
		onModifySpD(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.field.isWeather('sandstorm')) {
				return this.modify(spd, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.field.isWeather('sandstorm')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	hail: {
		name: 'Hail',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.field.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather(target) {
			this.damage(target.baseMaxhp / 16);
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	snowscape: {
		name: 'Snowscape',
		effectType: 'Weather',
		duration: 5,
		durationCallback(source, effect) {
			if (source?.hasItem('icyrock')) {
				return 8;
			}
			return 5;
		},
		onModifyDefPriority: 10,
		onModifyDef(def, pokemon) {
			if (pokemon.hasType('Ice') && this.field.isWeather('snowscape')) {
				return this.modify(def, 1.5);
			}
		},
		onFieldStart(field, source, effect) {
			if (effect?.effectType === 'Ability') {
				if (this.gen <= 5) this.effectState.duration = 0;
				this.add('-weather', 'Snowscape', '[from] ability: ' + effect.name, `[of] ${source}`);
			} else {
				this.add('-weather', 'Snowscape');
			}
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'Snowscape', '[upkeep]');
			if (this.field.isWeather('snowscape')) this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},
	deltastream: {
		name: 'DeltaStream',
		effectType: 'Weather',
		duration: 0,
		onEffectivenessPriority: -1,
		onEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'Delta Stream');
				return 0;
			}
		},
		onFieldStart(field, source, effect) {
			this.add('-weather', 'DeltaStream', '[from] ability: ' + effect.name, `[of] ${source}`);
		},
		onFieldResidualOrder: 1,
		onFieldResidual() {
			this.add('-weather', 'DeltaStream', '[upkeep]');
			this.eachEvent('Weather');
		},
		onFieldEnd() {
			this.add('-weather', 'none');
		},
	},

	dynamax: {
		name: 'Dynamax',
		noCopy: true,
		onStart(pokemon) {
			this.effectState.turns = 0;
			pokemon.removeVolatile('minimize');
			pokemon.removeVolatile('substitute');
			if (pokemon.volatiles['torment']) {
				delete pokemon.volatiles['torment'];
				this.add('-end', pokemon, 'Torment', '[silent]');
			}
			if (['cramorantgulping', 'cramorantgorging'].includes(pokemon.species.id) && !pokemon.transformed) {
				pokemon.formeChange('cramorant');
			}
			this.add('-start', pokemon, 'Dynamax', pokemon.gigantamax ? 'Gmax' : '');
			if (pokemon.baseSpecies.name === 'Shedinja') return;

			// Changes based on dynamax level, 2 is max (at LVL 10)
			const ratio = 1.5 + (pokemon.dynamaxLevel * 0.05);

			pokemon.maxhp = Math.floor(pokemon.maxhp * ratio);
			pokemon.hp = Math.floor(pokemon.hp * ratio);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		onTryAddVolatile(status, pokemon) {
			if (status.id === 'flinch') return null;
		},
		onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
			pokemon.removeVolatile('dynamax');
		},
		onSourceModifyDamage(damage, source, target, move) {
			if (move.id === 'behemothbash' || move.id === 'behemothblade' || move.id === 'dynamaxcannon') {
				return this.chainModify(2);
			}
		},
		onDragOutPriority: 2,
		onDragOut(pokemon) {
			this.add('-block', pokemon, 'Dynamax');
			return null;
		},
		onResidualPriority: -100,
		onResidual() {
			this.effectState.turns++;
		},
		onEnd(pokemon) {
			this.add('-end', pokemon, 'Dynamax');
			if (pokemon.baseSpecies.name === 'Shedinja') return;
			pokemon.hp = pokemon.getUndynamaxedHP();
			pokemon.maxhp = pokemon.baseMaxhp;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
	},

	// Commander needs two conditions so they are implemented here
	// Dondozo
	commanded: {
		name: "Commanded",
		noCopy: true,
		onStart(pokemon) {
			this.boost({ atk: 2, spa: 2, spe: 2, def: 2, spd: 2 }, pokemon);
		},
		onDragOutPriority: 2,
		onDragOut() {
			return false;
		},
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) {
			pokemon.trapped = true;
		},
	},
	// Tatsugiri
	commanding: {
		name: "Commanding",
		noCopy: true,
		onDragOutPriority: 2,
		onDragOut() {
			return false;
		},
		// Prevents Shed Shell allowing a swap
		onTrapPokemonPriority: -11,
		onTrapPokemon(pokemon) {
			pokemon.trapped = true;
		},
		// Dodging moves is handled in BattleActions#hitStepInvulnerabilityEvent
		// This is here for moves that manually call this event like Perish Song
		onInvulnerability: false,
		onBeforeTurn(pokemon) {
			this.queue.cancelAction(pokemon);
		},
	},

	// Arceus and Silvally's actual typing is implemented here.
	// Their true typing for all their formes is Normal, and it's only
	// Multitype and RKS System, respectively, that changes their type,
	// but their formes are specified to be their corresponding type
	// in the Pokedex, so that needs to be overridden.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'multitype' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onPlate;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	silvally: {
		name: 'Silvally',
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed || pokemon.ability !== 'rkssystem' && this.gen >= 8) return types;
			let type: string | undefined = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					type = 'Normal';
				}
			}
			return [type];
		},
	},
	rolloutstorage: {
		name: 'rolloutstorage',
		duration: 2,
		onBasePower(relayVar, source, target, move) {
			let bp = Math.max(1, move.basePower);
			bp *= 2 ** source.volatiles['rolloutstorage'].contactHitCount;
			if (source.volatiles['defensecurl']) {
				bp *= 2;
			}
			source.removeVolatile('rolloutstorage');
			return bp;
		},
	},
	// In data/conditions.ts
twinvines: {
    // This is a volatile status. It should be a standalone object.
    name: 'twinvines',
    duration: 1,

    onStart(pokemon, source) {
        // We capture the source here to use it later for the damage calculation.
        this.effectState.source = source;
		this.effectState.didProc = false;
        this.add('-start', pokemon, 'Twin Vines', '[silent]');
    },
    

    onEnd(pokemon) {

		if (this.effectState.didProc) return;
		this.effectState.didProc = true;
		const source = this.effectState.source;
        if (!source || source.fainted || !pokemon.hp || pokemon.fainted) {
            this.debug('Ending Twin Vines effect due to fainted source or target');
            pokemon.removeVolatile('twinvines');
            return;
        }
		const moveData = {
			id: 'boop' as ID,
            name: 'Boop',
            accuracy: 100,
            basePower: 60,
            category: 'Physical',
            type: 'Grass',
            flags: {},
            priority: 0,
            target: 'normal',
		}


        // This is the correct way to get damage from a basePower.
        const damage = this.actions.getDamage(source, pokemon, moveData as any);
        if (typeof damage === 'number' && damage > 0) {
            this.damage(damage, pokemon, source, this.effect);
            this.add('-message', `${pokemon.name} was hit by the Twin Vines end-of-turn attack!`);
        }  
		this.add('-end', pokemon, 'Twin Vines')
    },
},
// data/conditions.ts
darkterrain: {
  name: "Dark Terrain",
  effectType: 'Terrain',
  duration: 5,
  durationCallback(source, effect) {
    if (source?.hasItem?.('terrainextender')) return 8;
    return 5;
  },
  onFieldStart(field, source, effect) {
    if (effect?.effectType === 'Ability') {
      this.add('-fieldstart', 'move: Dark Terrain', '[from] ability: ' + effect.name, '[of] ' + source);
    } else {
      this.add('-fieldstart', 'move: Dark Terrain');
    }
  },
  onFieldEnd() {
    this.add('-fieldend', 'Dark Terrain');
  },

  // Global accuracy modifier (like Gravity). This is the important one.
  onModifyAccuracy(accuracy, target, source, move) {
    if (typeof accuracy !== 'number') return;
    // Only affect grounded users (source is the attacker)
    if (!source || !source.isGrounded() || source.isSemiInvulnerable()) return;
    this.debug('dark terrain accuracy drop (global)');
    // 0.7× in fixed-point: 0.7 * 4096 ≈ 2867
    return this.chainModify([2867, 4096]);
  },

  // Optional: keep this too; some code paths consult source-side hooks
  onSourceModifyAccuracy(accuracy, attacker, defender, move) {
    if (typeof accuracy !== 'number') return;
    if (!attacker.isGrounded() || attacker.isSemiInvulnerable()) return;
    this.debug('dark terrain accuracy drop (source)');
    return this.chainModify([2867, 4096]);
  },
},
burningfield: {
  name: "Burning Field",

  // use the side residual hook (not onResidual)
  onSideResidualOrder: 6,
  onSideResidual(side) {
    for (const mon of side.active) {
      if (!mon || mon.fainted) continue;

	  if (!mon.isGrounded()) continue;

      // 12.5% max HP chip
      this.damage(mon.baseMaxhp / 8, mon, null, this.dex.conditions.get('burningfield'));

      // 15% burn chance (respects immunities like Fire-type, Safeguard, etc.)
      if (!mon.status && mon.runStatusImmunity('brn') && this.randomChance(3, 20)) {
        mon.trySetStatus('brn', null, this.dex.conditions.get('burningfield'));
      }
    }
  },

  onSideStart(side) {
    this.add('-sidestart', side, 'Burning Field');
  },

  onSwitchIn(pokemon) {
    if (pokemon.hasType('Water') && pokemon.side.getSideCondition('burningfield')) {
      pokemon.side.removeSideCondition('burningfield');
      this.add('-sideend', pokemon.side, 'Burning Field', '[from] Water-type switch-in');
    }
  },

  onSideEnd(side) {
    this.add('-sideend', side, 'Burning Field');
  },
},
ultimateberrypriority: {
    name: "Ultimate Berry (Priority)",
    onStart(pokemon) {
      (this.effectState as any).primed = false;
    },

    // End-of-turn: arm it so it applies starting next turn
    onResidualOrder: 15,
    onResidualSubOrder: 1,
    onResidual(pokemon) {
      const st = this.effectState as any;
      if (!st.primed) {
        st.primed = true;
        // optional debug
         this.add('-message', `priority primed for ${pokemon.name}'s next action`);
      }
    },

    // Give +1 priority only if we’re primed (i.e., starting the turn after it was applied)
    onModifyPriority(priority, pokemon, _target, move) {
      if (!move) return;
      const st = this.effectState as any;
      if (!st.primed) return;          // not active this turn
      return priority + 1;              // active next turn
    },

    // Consume after the holder actually attempts a move (hit or miss)
    onAfterMove(pokemon) {
      const st = this.effectState as any;
      if (st.primed) pokemon.removeVolatile('ultimateberrypriority');
    },

    // If their action is aborted (flinch/full-para/etc.), still consume
    onMoveAborted(pokemon) {
      const st = this.effectState as any;
      if (st.primed) pokemon.removeVolatile('ultimateberrypriority');
    },

    // Clean up on switch
    onSwitchOut(pokemon) {
      if (pokemon.volatiles['ultimateberrypriority']) {
        pokemon.removeVolatile('ultimateberrypriority');
      }
    },
  },
// Backup tag used only to help the watcher identify the revived mon
aor_makeovertag: {
  name: 'Aid of Revival Tag',
},

aidofrevivalwatch: {
  name: 'Aid of Revival Watch', // SIDE condition

  onSideStart() {
    (this.effectState as any).revivedTeamSlot = undefined;
    (this.effectState as any).done = false;
  },

  onSideRestart() {
    (this.effectState as any).revivedTeamSlot = undefined;
    (this.effectState as any).done = false;
  },

  // Fire on every switch-in for this side; only act on the revived mon
  onSwitchIn(this: Battle, pokemon: Pokemon) {
    const st = this.effectState as any;
    if (st?.done) return;

    // Three independent ways to recognize the revived mon.
    const bySlot =
      st?.revivedTeamSlot !== undefined &&
      pokemon === pokemon.side.pokemon[st.revivedTeamSlot];

    const tagged = !!pokemon.volatiles?.aor_makeovertag;

    const pendingFlag = !!(pokemon as any).m?.aorPending;

    if (!bySlot && !tagged && !pendingFlag) return;

    // Clear tags so this can only fire once
    if (pokemon.volatiles?.aor_makeovertag) pokemon.removeVolatile('aor_makeovertag');
    if ((pokemon as any).m) (pokemon as any).m.aorPending = false;

    // ---------- Makeover logic ----------
    const all = this.dex.species.all().filter(s =>
      s.exists && !s.prevo && !s.nfe &&
      !(s as any).battleOnly && !(s as any).isNonstandard &&
      !(s as any).isMega && !(s as any).isPrimal && !(s as any).isGigantamax
    );
    const species = this.sample(all);

    const learnsets = (this.dex.data as any).Learnsets as
      Record<string, {learnset?: Record<string, AnyObject>}>;
    const ls = learnsets?.[species.id];
    let moveIds: ID[] = [];

    if (ls?.learnset) {
  const allIds = Object.keys(ls.learnset).filter(id => this.dex.moves.get(id).exists);
  const mObjs = allIds.map(id => this.dex.moves.get(id));
  const isDamaging = (m: Move) =>
    m.category !== 'Status' && (m.basePower > 0 || (m as any).damage || (m as any).ohko);

  const [t1, t2] = species.types;
  const stab1 = mObjs.filter(m => m.type === t1 && isDamaging(m)).map(m => m.id as ID);
  const stab2 = t2 ? mObjs.filter(m => m.type === t2 && isDamaging(m)).map(m => m.id as ID) : [];

  const takeOne = (arr: ID[]) => {
    if (arr.length) {
      const pick = this.sample(arr);
      if (!moveIds.includes(pick)) moveIds.push(pick);
    }
  };
  takeOne(stab1); if (t2) takeOne(stab2);

  const damagingLeft = mObjs
    .filter(m => isDamaging(m) && !moveIds.includes(m.id as ID))
    .map(m => m.id as ID);

  while (moveIds.length < 3 && damagingLeft.length) {
    const pick = damagingLeft.splice(this.random(damagingLeft.length), 1)[0];
    if (!moveIds.includes(pick)) moveIds.push(pick);
  }

  const fillers = allIds.filter(id => !moveIds.includes(id as ID)).map(id => id as ID);
  while (moveIds.length < 3 && fillers.length) {
    moveIds.push(fillers.splice(this.random(fillers.length), 1)[0]);
  }
}

// keep 3 moves if possible
if (moveIds.length < 3) moveIds = ['explosion' as ID, 'loadoutshift' as ID];

// --- Force Adaptive Force as the 4th move ---
const AF = 'adaptiveforce' as ID;
// remove it if it snuck into the first 3
moveIds = moveIds.filter(id => id !== AF);
// ensure exactly 3 in front
if (moveIds.length > 3) moveIds = moveIds.slice(0, 3);
while (moveIds.length < 3) moveIds.push('metronome' as ID); // safety pad if needed
// Force slot 3 = Metronome
moveIds[2] = 'metronome' as ID;

// slot 4:
moveIds.push(AF);


    const abilVals = Object.values((species as any).abilities || {}).filter(Boolean) as string[];
    const abilityId: ID = abilVals.length ? this.toID(this.sample(abilVals)) as ID : '' as ID;

    const curated: ID[] = [
      'airballoon','assaultvest','blunderpolicy','choicescarf','choiceband','choicespecs',
      'covertcloak','expertbelt','focussash','heavydutyboots','kingsrock','leftovers',
      'lifeorb','lightclay','quickclaw','redcard','rockyhelmet','safetygoggles','scopelens',
      'shellbell','sitrusberry','weaknesspolicy','widelens','wiseglasses','muscleband',
      'charcoal','mysticwater','magnet','miracleseed','hardstone','sharpbeak','spelltag',
      'twistedspoon','metalcoat','dragonfang','nevermeltice','softsand','silverpowder',
      'poisonbarb','blackglasses','pixieplate',
	  // --- custom items usable in regular battles ---
  'heavyarmor','typedrugs','typebulb','typedice',
  'bugbrush','darkbrush','dragonbrush','electricbrush','fairybrush','fightingbrush',
  'firebrush','flyingbrush','ghostbrush','grassbrush','groundbrush','icebrush',
  'normalbrush','poisonbrush','psychicbrush','rockbrush','steelbrush','waterbrush',
  'speedbelt','fuzzymushroom','armoredshell','elegantcloth','elegantband',
  'mysterybox','bulletproofvest','steelfangs','weatherbelt','bloodcharm',
  'windchime','luckypetal','stormbracer','prismpearl','rainbowcore',
  'mimicwand','twilightmirror',
    ].map(x => this.toID(x)) as ID[];
    const fixedItems = curated.map(id => this.dex.items.get(id)).filter(it => it?.exists);
    const zCrystals = this.dex.items.all().filter(it => it.exists && ((it as any).zMove || (it as any).zMoveType));
    const items = [...new Map([...fixedItems, ...zCrystals].map(it => [it.id, it])).values()];
    const itemId: ID = items.length ? (this.sample(items) as Item).id as ID : '' as ID;
	const maxIVs: StatsTable = {hp:31, atk:31, def:31, spa:31, spd:31, spe:31};
	const evs: StatsTable = {hp:100, atk:100, def:100, spa:100, spd:100, spe:100}; // pick what you want
	const nature: ID = 'Serious' as ID;
		pokemon.set.ivs = {...maxIVs};
		pokemon.set.evs = {...evs};
		pokemon.set.nature = nature;

    const newForme = this.dex.species.get(species.id);
    pokemon.formeChange(newForme, this.effect, true);
    if (abilityId) pokemon.setAbility(abilityId);
    if (itemId) pokemon.setItem(itemId);

    // overwrite moves
    pokemon.moveSlots.splice(0, pokemon.moveSlots.length);
    (pokemon.baseMoveSlots as any).splice(0, (pokemon.baseMoveSlots as any).length);
    for (const id of moveIds) {
      const mv = this.dex.moves.get(id);
      const slot = { move: mv.name, id: mv.id as ID, pp: mv.pp, maxpp: mv.pp, target: mv.target,
        disabled: false, disabledSource: '', used: false };
      pokemon.moveSlots.push({ ...slot });
      (pokemon.baseMoveSlots as any).push({ ...slot });
    }

    // Full heal on entry (overrides 50% from revive)
    pokemon.hp = pokemon.maxhp;
    pokemon.fainted = false;
    this.add('-heal', pokemon, pokemon.getHealth, '[from] move: Aid of Revival');

    // one-and-done
    st.done = true;
    pokemon.side.removeSideCondition('aidofrevivalwatch');
  },
},

bleeding: {
  name: "Bleeding",
  noCopy: true,
  onResidualOrder: 11,
  onResidualSubOrder: 2,

  onStart(target, source, effect) {
    // Steel & Blood types are immune
    if (target.hasType('Steel') || target.hasType('Blood')) {
      this.add('-immune', target, '[from] Bleeding');
      return false; // cancels the volatile being applied
    }
    this.add('-start', target, 'Bleeding');
  },

  onResidual(pokemon) {
    // If something changed its type to Steel/Blood mid-battle,
    // drop Bleeding instead of doing damage.
    if (pokemon.hasType('Steel') || pokemon.hasType('Blood')) {
      pokemon.removeVolatile('bleeding');
      return;
    }

    // 1/16 max HP chip
    this.damage(pokemon.baseMaxhp / 16, pokemon, null, this.dex.conditions.get('bleeding'));
  },

  onEnd(target) {
    this.add('-end', target, 'Bleeding');
  },
},





// Applied to the USER when Grasping Hands is selected.
graspinghandsready: {
  duration: 1,
  onStart(source) { this.effectState.source = source; },

  // Catch foes that try to switch out this turn (Pursuit timing)
  onFoeBeforeSwitchOut(pokemon) {
    const source = this.effectState.source;
    if (!source || source.fainted || !source.isActive) return;

    // Respect Fighting immunities (e.g., Ghost)
    if (!this.dex.getImmunity('Fighting', pokemon)) return;

    if (!pokemon.volatiles['graspinghandsmark']) {
      pokemon.addVolatile('graspinghandsmark', source);
      this.add('-activate', source, 'move: Grasping Hands');
      this.add('-message', `${pokemon.name} is ensnared by Grasping Hands!`);
    }

    // Mark that the move has already done its pre-switch job; abort later normal use
    if (source.volatiles['graspinghandsready']) {
      (source.volatiles['graspinghandsready'] as any).consumed = true;
    }
  },
},

// The mark that punishes switching (damage is dealt when they leave)
graspinghandsmark: {
  onStart(target, source) { this.effectState.source = source || null; },
  onSwitchOut(pokemon) {
    const src = this.effectState.source || pokemon;
    const dmg = Math.max(1, Math.floor(pokemon.baseMaxhp / 4));
    this.damage(dmg, pokemon, src, {id: 'graspinghands'} as any);
    this.add('-message', `${pokemon.name} took damage from ${src.name}'s Grasping Hands!`);
    pokemon.removeVolatile('graspinghandsmark');
  },
},
insectstingwatcher: {
  // Re-apply the volatile whenever a marked Pokémon returns
  onSwitchIn(pokemon) {
    const mark = (pokemon as any).m?.permaStung;
    if (mark && !pokemon.volatiles['insectsting']) {
      const src = (pokemon as any).m?.permaStungSource || null;
      pokemon.addVolatile('insectsting', src);
      this.add('-message', `${pokemon.name}'s sting persists!`);
    }
  },

  // After a Pokémon on this side successfully uses a move, chip it if stung
  onAfterMove(pokemon, target, move) {
    if (!move) return;
    if (!pokemon?.volatiles?.['insectsting']) return;      // must be actively stung
    if (pokemon.hp <= 0) return;

    // credit damage to original stinger if known
    const src =
      (pokemon as any).m?.permaStungSource ||
      pokemon.volatiles['insectsting']?.source ||
      pokemon;

    const dmg = Math.max(1, Math.floor(pokemon.baseMaxhp / 8));
    this.damage(dmg, pokemon, src, {id: 'insectsting'} as any);
    this.add('-message', `${pokemon.name} was hurt by Insect Sting!`);
  },
},
antiswitchertrap: {
  // punishes opposing switches
  onSwitchOut(pokemon) {
    if (pokemon.hp > 0) {
      const dmg = Math.max(1, Math.floor(pokemon.baseMaxhp / 3));
      const source = this.effectState.source; // the mon that set the side condition
      this.damage(dmg, pokemon, source, {id: 'antiswitcher'} as any);

      // custom message
      if (source) {
        this.add(
          '-message',
          `${pokemon.name} took damage from ${source.name}'s Anti-switcher ability!`
        );
      } else {
        this.add('-message', `${pokemon.name} took damage from Anti-switcher!`);
      }
    }
  },
},
bfp: {
  name: "Berry Forager (Priority)",
  // Applied at end of turn; it's already "armed" for the next action
  onStart(pokemon) {
    (this.effectState as any).ready = true;
  },

  // Give +1 priority on the next *move* this Pokémon attempts
  onModifyPriority(priority, pokemon, _target, move) {
    if (!move) return;                 // don't affect switches, etc.
    const st = this.effectState as any;
    if (!st.ready) return;
    return priority + 1;
  },

  // Consume after they actually try to act (hit or miss)
  onAfterMove(pokemon) {
    const st = this.effectState as any;
    if (st?.ready) pokemon.removeVolatile('bfp');
  },

  // If their action gets aborted (flinch, full-para, etc.), still consume
  onMoveAborted(pokemon) {
    const st = this.effectState as any;
    if (st?.ready) pokemon.removeVolatile('bfp');
  },

  // Clean up on switch
  onSwitchOut(pokemon) {
    if (pokemon.volatiles['bfp']) pokemon.removeVolatile('bfp');
  },
},
torrentialblizzardfield: {
  name: "Torrential Blizzard (Field)",

  

  onBasePower(basePower, user, target, move) {
    if (!this.field.isWeather('snowscape')) return;
    if (['Fire','Fighting','Rock','Steel'].includes(move.type)) {
      return this.chainModify(0.5);
    }
  },

  onResidualOrder: 1,
  onResidualSubOrder: 1,
  onResidual() {
    // End itself if Snowscape ended
    if (!this.field.isWeather('snowscape')) {
      this.field.removePseudoWeather('torrentialblizzardfield');
      return;
    }

    // Hail-style chip damage
    for (const side of this.sides) {
      for (const mon of side.active) {
        if (!mon || mon.fainted) continue;
        if (mon.hasType('Ice')) continue;
        if (mon.hasAbility(['magicguard','overcoat'])) continue;
        if (mon.hasItem('safetygoggles')) continue;
        this.damage(mon.baseMaxhp / 16, mon, null, this.effect);
      }
    }
  },

  onAnySetWeather(_target, _source, weather) {
    if (weather.id !== 'snowscape' &&
        this.field.pseudoWeather['torrentialblizzardfield']) {
      this.field.removePseudoWeather('torrentialblizzardfield');
    }
  },
},
allterrain: {
  name: "All Terrain",
  effectType: 'Terrain',
  duration: 5,
  // ===== durationCallback =====
durationCallback(source, effect) {
  if (source?.hasItem('terrainextender')) return 8;
  return 5;
},

// Sleep prevention (Electric-style) + general status/confusion prevention (Misty-style)
onSetStatus(status, target, source, effect) {
  // Electric Terrain: block sleep from Yawn and pure status sleep moves
  if (status.id === 'slp' && target.isGrounded() && !target.isSemiInvulnerable()) {
    if (effect?.id === 'yawn' || (effect?.effectType === 'Move' && !effect.secondaries)) {
      this.add('-activate', target, 'move: All Terrain');
    }
    return false;
  }
  // Misty Terrain: block status from moves (including Yawn)
  if (!target.isSemiInvulnerable() && target.isGrounded()) {
    if (effect && ((effect as Move).status || effect.id === 'yawn')) {
      this.add('-activate', target, 'move: All Terrain');
      return false;
    }
  }
},

// Electric: block Yawn volatile; Misty: block Confusion volatile from pure moves
onTryAddVolatile(status, target, source, effect) {
  if (!target.isGrounded() || target.isSemiInvulnerable()) return;

  // Electric-yawn block
  if (status.id === 'yawn') {
    this.add('-activate', target, 'move: All Terrain');
    return null;
  }

  // Misty-confusion block (from pure moves without secondaries)
  if (status.id === 'confusion') {
    if (effect?.effectType === 'Move' && !effect.secondaries) {
      this.add('-activate', target, 'move: All Terrain');
      return null;
    }
  }
},

// Psychic: priority moves fail on grounded targets
onTryHitPriority: 4,
onTryHit(target, source, effect) {
  if (effect && (effect.priority <= 0.1 || effect.target === 'self')) return;
  if (target.isSemiInvulnerable() || target.isAlly(source)) return;

  if (!target.isGrounded()) {
    const baseMove = this.dex.moves.get(effect.id);
    if (baseMove.priority > 0) {
      this.hint("Psychic Terrain doesn't affect Pokémon immune to Ground.");
    }
    return;
  }
  this.add('-activate', target, 'move: All Terrain');
  return null;
},

onBasePowerPriority: 6,
onBasePower(basePower, attacker, defender, move) {
  // Electric boost
  if (move.type === 'Electric' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
    this.debug('electric terrain boost');
    this.chainModify([5325, 4096]);
  }
  // Psychic boost
  if (move.type === 'Psychic' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
    this.debug('psychic terrain boost');
    this.chainModify([5325, 4096]);
  }
  // Grassy weaken EQ/Bulldoze/Magnitude vs grounded target
  const weakenedMoves = ['earthquake', 'bulldoze', 'magnitude'];
  if (weakenedMoves.includes(move.id) && defender.isGrounded() && !defender.isSemiInvulnerable()) {
    this.debug('move weakened by grassy terrain');
    this.chainModify(0.5);
  }
  // Grassy boost Grass-type for grounded attacker
  if (move.type === 'Grass' && attacker.isGrounded() && !attacker.isSemiInvulnerable()) {
    this.debug('grassy terrain boost');
    this.chainModify([5325, 4096]);
  }
  // Misty weaken Dragon-type vs grounded defender
  if (move.type === 'Dragon' && defender.isGrounded() && !defender.isSemiInvulnerable()) {
    this.debug('misty terrain weaken');
    this.chainModify(0.5);
  }
},

onFieldStart(field, source, effect) {
  if (effect?.effectType === 'Ability') {
    this.add('-fieldstart', 'move: All Terrain', '[from] ability: ' + effect.name, `[of] ${source}`);
  } else {
    this.add('-fieldstart', 'move: All Terrain');
  }
},

// Grassy passive heal
onResidualOrder: 5,
onResidualSubOrder: 2,
onResidual(pokemon) {
  if (pokemon.isGrounded() && !pokemon.isSemiInvulnerable()) {
    this.heal(pokemon.baseMaxhp / 16, pokemon, pokemon);
  } else {
    this.debug(`Pokemon semi-invuln or not grounded; Grassy Terrain skipped`);
  }
},

// Shared field residual timing (keep single copy)
onFieldResidualOrder: 27,
onFieldResidualSubOrder: 7,

onFieldEnd() {
  this.add('-fieldend', 'move: All Terrain');
},
},

twisteddimensions: {
  // Field effect tied to the ability
  duration: 0, // lasts until ability is gone
  onModifyMove(move, source, target) {
    // If we don't know the target yet, just do nothing here; onTryHit will catch it.
    if (!target) return;

    // Default: ignore immunities
    (move as any).ignoreImmunity = true;

    // Exception: do NOT ignore Ground immunity from Levitate or Air Balloon
    if (move.type === 'Ground') {
      if (target.hasAbility?.('levitate') || target.hasItem?.('airballoon')) {
        delete (move as any).ignoreImmunity; // or set to false
      }
    }
  },

  // Fallback hook (target is definitely known here)
  onTryHit(target, source, move) {
    // Default: ignore immunities
    (move as any).ignoreImmunity = true;

    // Exception: do NOT ignore Ground immunity from Levitate or Air Balloon
    if (move.type === 'Ground') {
      if (target.hasAbility?.('levitate') || target.hasItem?.('airballoon')) {
        delete (move as any).ignoreImmunity; // or set to false
      }
    }
  },

  // modify type effectiveness
  onEffectiveness(typeMod, target, type, move) {
    // typeMod is in steps of 1:
    // -2 = 0.25×, -1 = 0.5×, 0 = neutral, 1 = 2×, 2 = 4×
	    // If runImmunity allowed a type-chart immune hit through, pretend it was resisted.
    // Your existing "flip resistances/weaknesses" will then turn this into super-effective.

    if (typeMod < 0) {
      // resistance → weakness
      return -typeMod; // flip sign
    } else if (typeMod > 0) {
      // weakness → resistance
      return -typeMod; // flip sign
    }
    // neutral → neutral (do nothing)
    return 0;
  },
},




shapeshiftermovecat: {
  noCopy: true,
  duration: 0,
  // Convert damaging moves to Physical/Special based on higher raw Atk vs SpA (ignores boosts)
  onModifyMove(move, pokemon) {
    if (move.category === 'Status') return;
    if ((move as any).damage || (move as any).ohko) return;
    if (move.id === 'struggle') return;

    const atk = pokemon.getStat('atk', false, true);
    const spa = pokemon.getStat('spa', false, true);
    move.category = atk >= spa ? 'Physical' : 'Special';
  },
},
steamfield: {
    name: "Steam Field",
    // This is a SIDE condition: it sits on one team’s side and affects moves used by that side.
    duration: 3,
    onSideStart(side) {
      this.add('-sidestart', side, 'Steam Field');
    },
    onAnyModifyAccuracy(accuracy, target, source, move) {
      // Reduce accuracy of moves USED BY the afflicted side (i.e., the "source" side)
      if (typeof accuracy !== 'number') return;
      if (source && source.side === this.effectState.target) {
        return this.chainModify(0.9);
      }
    },
    onSideEnd(side) {
      this.add('-sideend', side, 'Steam Field');
    },
  },
// Cooldown volatile (lives on the user)
  dracovortexcooldown: {
    // This key lives alongside moves as a condition entry
    // Showdown allows conditions here; alternatively put it in conditions.ts
    name: "Draco Vortex Cooldown",
    duration: 2, // persists through the user's next action attempt, then falls off
    // No extra hooks needed — the presence alone blocks the next attempt via onTry above
  },

sporeguard: {
  name: "Sporeguard",
  duration: 5,

  onSideStart(side, source) {
    (this.effectState as any).side = side as Side; // remember protected side
    this.add('-sidestart', side, 'move: Sporeguard');
  },

  // Block major status aimed at Pokémon on this side
  onSetStatus(status, target, source, effect) {
    const protectedSide: Side | undefined = (this.effectState as any).side;
    if (!protectedSide || !target || target.side !== protectedSide) return;
    this.add('-activate', target, 'move: Sporeguard');
    return false;
  },

  // Reflect reflectable single-target status (Spore, Taunt, etc.)
  onTryHitPriority: 1,
  onTryHit(target, source, move) {
    const protectedSide: Side | undefined = (this.effectState as any).side;
    if (!protectedSide || !target || !source || !move) return;
    if (target === source) return;
    if (target.side !== protectedSide) return;
    if ((move as any).hasBounced || !move.flags?.reflectable) return;
    if (target.isSemiInvulnerable()) return;

    const newMove = this.dex.getActiveMove(move.id);
    (newMove as any).hasBounced = true;
    (newMove as any).pranksterBoosted = false;

    this.add('-activate', target, 'move: Sporeguard');
    this.actions.useMove(newMove, target, { target: source }); // ✅ options object
    (move as any).hasBounced = true; // bounce only once in weird formats
    return null;
  },

  // Reflect reflectable side-targeting moves (hazards: SR/Spikes/TSpikes/Web)
  onTryHitSide(_sideParam, source, move) {
    const protectedSide: Side | undefined = (this.effectState as any).side;
    if (!protectedSide || !source || !move) return;
    if ((move as any).hasBounced || !move.flags?.reflectable) return;

    // Choose any living mon on our protected side to "cast" the reflected move
    const caster = protectedSide.active.find(p => p && !p.fainted);
    if (!caster) return;

    const newMove = this.dex.getActiveMove(move.id);
    (newMove as any).hasBounced = true;
    (newMove as any).pranksterBoosted = false;

    this.add('-activate', caster, 'move: Sporeguard');
    this.actions.useMove(newMove, caster, { target: source }); // ✅ reflect back at the user
    (move as any).hasBounced = true;
    return null;
  },

  onSideEnd(side) {
    this.add('-sideend', side, 'move: Sporeguard');
  },
},


revving: {
  name: "Revving",
  noCopy: true, // prevents baton pass etc. unless you want it to copy
  onStart(pokemon) {
    this.add('-start', pokemon, 'Revving');
  },
  onResidual(pokemon) {
    this.boost({atk: 1}, pokemon, pokemon);
    this.add('-message', `${pokemon.name}'s drill revs higher, increasing its Attack!`);
  },
  onEnd(pokemon) {
    this.add('-end', pokemon, 'Revving');
  },
},


eyecontactban: {
  name: "Eye Contact Ban",
  noCopy: true,
  onStart(pokemon) {
    this.add('-start', pokemon, 'Eye Contact');
  },
  onDisableMove(pokemon) {
    if (!pokemon?.moveSlots?.length) return;
    const attackerTypes = pokemon.getTypes();
    for (const moveSlot of pokemon.moveSlots) {
      const move = this.dex.moves.get(moveSlot.id);
      if (!move || move.category === 'Status') continue;
      for (const foe of pokemon.side.foe.active) {
        if (!foe || foe.fainted) continue;
        const defenderTypes = foe.getTypes();
        if (defenderTypes.some(t => attackerTypes.includes(t))) {
          pokemon.disableMove(moveSlot.id);
          this.add('-message', `${pokemon.name} cannot bring itself to attack ${foe.name} due to Eye Contact!`);
          break;
        }
      }
    }
  },
  onEnd(pokemon) {
    this.add('-end', pokemon, 'Eye Contact');
    // optional: if you want a hard “cure” to clear the persistent mark, do it here
    // (pokemon as any).m && ((pokemon as any).m.eyecontactban = false);
  },
},

eyecontactwatch: {
  name: "Eye Contact Watch",
  // lives for the whole battle; very lightweight
  // (you can add duration if you want, but not necessary)
  onSwitchIn(pokemon) {
    // if this mon was previously marked, restore the volatile
    if ((pokemon as any).m?.eyecontactban && !pokemon.volatiles['eyecontactban']) {
      pokemon.addVolatile('eyecontactban');
    }
  },
},
sting: {

    onStart(pokemon, source) {
      // remember who applied it for KO credit
      this.effectState.source = source || (pokemon as any).m?.permaStungSource || null;
    },
	onAfterMove(pokemon, target, move) {
    if (!move) return;
    if (!pokemon?.volatiles?.['sting']) return;      // must be actively stung
    if (pokemon.hp <= 0) return;

    // credit damage to original stinger if known
    const src =
      (pokemon as any).m?.permaStungSource ||
      pokemon.volatiles['sting']?.source ||
      pokemon;

    const dmg = Math.max(1, Math.floor(pokemon.baseMaxhp / 8));
    this.damage(dmg, pokemon, src, {id: 'sting'} as any);
    this.add('-message', `${pokemon.name} was hurt by Insect Sting!`);
  },
    onEnd(pokemon) {
      // cosmetic; the watcher will re-apply on switch-in
      this.add('-message', `${pokemon.name} is no longer actively stung...`);
    },
  },
  attractionvolatile: {
  // Uncopyable (no Baton Pass)
  noCopy: true,

  // No gender check, no immunity checks, does not fall off when source leaves
  onBeforeMovePriority: 2,
  onBeforeMove(pokemon) {
    // Mirror standard Attract 50% fail chance; tweak if you want different odds
    this.add('-activate', pokemon, 'move: Attract');
    if (this.randomChance(1, 2)) {
      this.add('cant', pokemon, 'Attract');
      return false;
    }
  },
  onEnd(pokemon) {
    // Silent end message, mirrors standard volatile end
    this.add('-end', pokemon, 'Attract', '[silent]');
  },
},
// ========= New non-volatile status: FROSTBITE =========
// ID: 'frb'
frb: {
  name: 'frb',
  effectType: 'Status',
  onStart(target, source, sourceEffect) {
    // Mirror brn’s message variants
    if (sourceEffect && sourceEffect.id === 'flameorb') {
      // If you ever make an "ice orb", swap this line accordingly
      this.add('-status', target, 'frb', '[from] item: Flame Orb');
    } else if (sourceEffect && sourceEffect.effectType === 'Ability') {
      this.add('-status', target, 'frb', '[from] ability: ' + sourceEffect.name, `[of] ${source}`);
    } else {
      this.add('-status', target, 'frb');
    }
  },
  // Residual damage: same tick as brn
  onResidualOrder: 10,
  onResidual(pokemon) {
    this.damage(pokemon.baseMaxhp / 16);
  },

  // Special Attack halving (burn’s physical Atk cut is baked into core dmg;
  // we explicitly halve SpA here for Frostbite)
  onModifySpA(spa, pokemon) {
    // If you want certain abilities to ignore this (e.g. Guts-like for SpA),
    // gate it here by checking pokemon.hasAbility('...') before returning.
    return this.chainModify(0.5);
  },
},


// ========= Volatile for ABYSSAL MAW ticking & trapping =========
abyssalmawtrap: {
  name: 'Abyssal Maw (Trap)',
  noCopy: true,
  duration: 5,

  onStart(target, source) {
    this.effectState.source = source; // remember who applied it
    this.add('-message', `${target.name} is gripped by the Abyssal Maw!`);
  },

  // This is the key: assert trapping whenever the engine checks switch legality
  onTrapPokemon(pokemon) {
    if (!pokemon.isGrounded()) return;
    pokemon.tryTrap(true);
  },

  // Chip each turn while grounded; attribute damage to the applier
  onResidualOrder: 10,
  onResidual(target) {
    if (!target.isGrounded()) return;
    this.damage(
      target.baseMaxhp / 16,
      target,
      this.effectState.source,
      this.dex.conditions.get('abyssalmawtrap')
    );
  },

  onEnd(target) {
    this.add('-message', `${target.name} escaped the Abyssal Maw!`);
  },
},

divinerage: {
    name: 'Divine Rage',
    onStart(pokemon) {
        this.add('-start', pokemon, 'Divine Rage');
    },
    onDamagingHit(_damage, target) {
        this.boost({atk: 1}, target);
    },
    onEnd(pokemon) {
        this.add('-end', pokemon, 'Divine Rage');
    },
},

doublehammer: {
    // This is a volatile status. It should be a standalone object.
    name: 'doublehammer',
    duration: 1,

    onStart(pokemon, source) {
        // We capture the source here to use it later for the damage calculation.
        this.effectState.source = source;
		this.effectState.didProc = false;
        this.add('-start', pokemon, 'doublehammer', '[silent]');
    },
    

    onEnd(pokemon) {

		if (this.effectState.didProc) return;
		this.effectState.didProc = true;
		const source = this.effectState.source;
        if (!source || source.fainted || !pokemon.hp || pokemon.fainted) {
            this.debug('Ending doublehammer effect due to fainted source or target');
            pokemon.removeVolatile('doublehammer');
            return;
        }
		const moveData = {
			id: 'bang' as ID,
            name: 'Bang',
            accuracy: 100,
            basePower: 65,
            category: 'Physical',
            type: 'Steel',
            flags: {},
            priority: 0,
            target: 'normal',
			secondary: {
				chance: 20,
				status: 'par',},
		}


        // This is the correct way to get damage from a basePower.
        const damage = this.actions.getDamage(source, pokemon, moveData as any);
        if (typeof damage === 'number' && damage > 0) {
            this.damage(damage, pokemon, source, this.effect);
            this.add('-message', `${pokemon.name} was hit by the returning Hammer!`);
        }  
		this.add('-end', pokemon, 'doublehammer')
    },
},
serenefocus: {
	name: "Serene Focus",
	noCopy: true,
	onStart(pokemon) {
		this.add('-start', pokemon, 'move: Serene Focus');
	},
	onModifyMove(move, pokemon) {
		// Don't affect Z-Moves or Max Moves, and don't crash on weird cases
		if (!move || move.isZ || move.isMax) return;

		let changed = false;

		// Single secondary
		if (move.secondary && typeof move.secondary.chance === 'number' && move.secondary.chance < 100) {
			move.secondary = {
				...move.secondary,
				chance: 100,
			};
			changed = true;
		}

		// Multiple secondaries
		if (move.secondaries) {
			for (const sec of move.secondaries) {
				if (typeof sec.chance === 'number' && sec.chance < 100) {
					sec.chance = 100;
					changed = true;
				}
			}
		}

		// Only consume Serene Focus once we've actually modified a chance
		if (changed) {
			this.add('-end', pokemon, 'move: Serene Focus', '[silent]');
			pokemon.removeVolatile('serenefocus');
		}
	},
},
echomessengerhalfpower: {
	name: "Echo Messenger (Half Power)",
	onBasePower(basePower) {
		return this.chainModify(0.5);
	}
},


};
