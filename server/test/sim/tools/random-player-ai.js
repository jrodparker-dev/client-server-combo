'use strict';

const assert = require('assert').strict;
const { RandomPlayerAI } = require('../../../dist/sim/tools/random-player-ai');

function makeStream() {
	const choices = [];
	return {
		choices,
		write(choice) {
			choices.push(choice);
			return Promise.resolve();
		},
	};
}

function makePokemon({ ident, details, condition = '100/100', active = false, stats, moves, types, teraType }) {
	return {
		ident,
		details,
		condition,
		active,
		stats: stats || { atk: 80, def: 80, spa: 80, spd: 80, spe: 80 },
		moves: moves || [],
		baseAbility: 'pressure',
		item: 'leftovers',
		pokeball: 'pokeball',
		types,
		teraType,
	};
}

describe('RandomPlayerAI heuristics', () => {
	it('should choose a lead based on matchup scoring during team preview', () => {
		const stream = makeStream();
		const ai = new RandomPlayerAI(stream, { seed: [1, 2, 3, 4] });
		ai.receiveRequest({
			teamPreview: true,
			side: {
				name: 'AI Opponent',
				id: 'p2',
				pokemon: [
					makePokemon({
						ident: 'p2: Rotom', details: 'Rotom-Wash', moves: ['hydropump', 'thunderbolt'],
						types: ['Electric', 'Water'], stats: { atk: 65, def: 107, spa: 105, spd: 107, spe: 86 },
					}),
					makePokemon({
						ident: 'p2: Garchomp', details: 'Garchomp', moves: ['earthquake', 'dragonclaw'],
						types: ['Dragon', 'Ground'], stats: { atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
					}),
				],
			},
			foe: {
				name: 'Player',
				id: 'p1',
				pokemon: [
					makePokemon({
						ident: 'p1: Gyarados', details: 'Gyarados', moves: ['waterfall'],
						types: ['Water', 'Flying'], stats: { atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
					}),
					makePokemon({
						ident: 'p1: Heatran', details: 'Heatran', moves: ['magmaStorm'],
						types: ['Fire', 'Steel'], stats: { atk: 90, def: 106, spa: 130, spd: 106, spe: 77 },
					}),
				],
			},
		});

		assert.equal(stream.choices[0], 'team 2, 1');
	});

	it('should pick the strongest move into the current opposing active Pokemon', () => {
		const stream = makeStream();
		const ai = new RandomPlayerAI(stream, { seed: [1, 2, 3, 4] });
		ai.receiveRequest({
			side: {
				name: 'AI Opponent',
				id: 'p2',
				pokemon: [
					makePokemon({
						ident: 'p2: Rotom', details: 'Rotom-Wash', active: true,
						moves: ['hydropump', 'thunderbolt'], types: ['Electric', 'Water'],
						stats: { atk: 65, def: 107, spa: 105, spd: 107, spe: 86 },
					}),
				],
			},
			foe: {
				name: 'Player',
				id: 'p1',
				pokemon: [
					makePokemon({
						ident: 'p1: Gyarados', details: 'Gyarados', active: true,
						moves: ['waterfall'], types: ['Water', 'Flying'],
						stats: { atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
					}),
				],
			},
			active: [{
				moves: [
					{ move: 'Hydro Pump', id: 'hydropump', target: 'normal' },
					{ move: 'Thunderbolt', id: 'thunderbolt', target: 'normal' },
				],
				canTerastallize: false,
			}],
		});

		assert.equal(stream.choices[0], 'move 2');
	});

	it('should terastallize when tera blast matchup gains a large boost', () => {
		const stream = makeStream();
		const ai = new RandomPlayerAI(stream, { seed: [1, 2, 3, 4] });
		ai.receiveRequest({
			side: {
				name: 'AI Opponent',
				id: 'p2',
				pokemon: [
					makePokemon({
						ident: 'p2: Volcarona', details: 'Volcarona', active: true,
						moves: ['terablast', 'flamethrower'], types: ['Bug', 'Fire'], teraType: 'Grass',
						stats: { atk: 60, def: 65, spa: 135, spd: 105, spe: 100 },
					}),
				],
			},
			foe: {
				name: 'Player',
				id: 'p1',
				pokemon: [
					makePokemon({
						ident: 'p1: Quagsire', details: 'Quagsire', active: true,
						moves: ['earthquake'], types: ['Water', 'Ground'],
						stats: { atk: 85, def: 85, spa: 65, spd: 65, spe: 35 },
					}),
				],
			},
			active: [{
				moves: [
					{ move: 'Tera Blast', id: 'terablast', target: 'normal' },
					{ move: 'Flamethrower', id: 'flamethrower', target: 'normal' },
				],
				canTerastallize: 'Grass',
			}],
		});

		assert.equal(stream.choices[0], 'move 1 terastallize');
	});

	it('should choose the best replacement after a fainted Pokemon forces a switch', () => {
		const stream = makeStream();
		const ai = new RandomPlayerAI(stream, { seed: [1, 2, 3, 4] });
		ai.receiveRequest({
			forceSwitch: [true],
			side: {
				name: 'AI Opponent',
				id: 'p2',
				pokemon: [
					makePokemon({ ident: 'p2: Fainted', details: 'Tyranitar', condition: '0 fnt', active: true, moves: ['stoneedge'], types: ['Rock', 'Dark'] }),
					makePokemon({
						ident: 'p2: Rotom', details: 'Rotom-Wash', moves: ['hydropump', 'thunderbolt'],
						types: ['Electric', 'Water'], stats: { atk: 65, def: 107, spa: 105, spd: 107, spe: 86 },
					}),
					makePokemon({
						ident: 'p2: Garchomp', details: 'Garchomp', moves: ['earthquake', 'dragonclaw'],
						types: ['Dragon', 'Ground'], stats: { atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
					}),
				],
			},
			foe: {
				name: 'Player',
				id: 'p1',
				pokemon: [
					makePokemon({
						ident: 'p1: Gyarados', details: 'Gyarados', active: true,
						moves: ['waterfall'], types: ['Water', 'Flying'],
						stats: { atk: 125, def: 79, spa: 60, spd: 100, spe: 81 },
					}),
				],
			},
		});

		assert.equal(stream.choices[0], 'switch 2');
	});
});
