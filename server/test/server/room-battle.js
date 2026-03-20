'use strict';

const assert = require('assert').strict;

const { makeUser } = require('../users-utils');

describe('Simulator abstraction layer features', () => {
	async function waitUntil(check, message) {
		for (let i = 0; i < 100; i++) {
			if (check()) return;
			await new Promise(resolve => setTimeout(resolve, 50));
		}
		throw new Error(message || 'Timed out waiting for condition.');
	}

	const packedSinglePlayerTeam = 'Pikachu||lightball||thunderbolt|Timid|,252,,,4,252|||||';
	const packedSingleAITeam = 'Golem||leftovers||earthquake|Adamant|252,252,,,,4|||||';
	const packedPlayerPreviewTeam = [
		'Pikachu||lightball||thunderbolt|Timid|,252,,,4,252|||||',
		'Charizard||charcoal||flamethrower|Timid|,252,,,4,252|||||',
	].join(']');
	const packedAIPreviewTeam = [
		'Golem||leftovers||earthquake|Adamant|252,252,,,,4|||||',
		'Blastoise||leftovers||surf|Modest|252,,,252,4,|||||',
	].join(']');

	function makeRequestPokemon({ident, details, condition = '100/100', active = false, moves, types, stats, teraType}) {
		return {
			ident,
			details,
			condition,
			active,
			stats: stats || {atk: 80, def: 80, spa: 80, spd: 80, spe: 80},
			moves: moves || [],
			baseAbility: 'pressure',
			item: 'leftovers',
			pokeball: 'pokeball',
			types,
			teraType,
		};
	}

	describe('Battle', () => {
		let p1, p2, room;

		afterEach(() => {
			if (p1) {
				p1.disconnectAll();
				p1.destroy();
			}
			if (p2) {
				p2.disconnectAll();
				p2.destroy();
			}
			if (room) room.destroy();
		});

		it('should not get players out of sync in rated battles on rename', () => {
			// Regression test for 47263c8749
			const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
			p1 = makeUser("MissingNo.");
			p2 = makeUser();
			room = Rooms.createBattle({
				format: '',
				players: [{ user: p1, team: packedTeam }, { user: p2, team: packedTeam }],
				allowRenames: false,
			});
			assert(room.battle);
			p1.resetName();
			for (const player of room.battle.players) {
				assert.equal(player, room.battle.playerTable[toID(player.name)]);
			}
		});

		it('should let a server-side AI opponent respond to battle requests', async () => {
			p1 = makeUser("Player One");
			room = Rooms.createBattle({
				format: 'gen9customgame',
				players: [
					{ user: p1, team: packedSinglePlayerTeam },
					{ user: 'AI Opponent', team: packedSingleAITeam, ai: true },
				],
			});
			assert(room?.battle);

			const moveRequest = {
				side: {
					name: 'AI Opponent',
					id: 'p2',
					pokemon: [
						makeRequestPokemon({
							ident: 'p2: Golem', details: 'Golem', active: true, moves: ['earthquake'],
							types: ['Rock', 'Ground'], stats: {atk: 120, def: 130, spa: 55, spd: 65, spe: 45},
						}),
					],
				},
				foe: {
					name: 'Player One',
					id: 'p1',
					pokemon: [
						makeRequestPokemon({
							ident: 'p1: Pikachu', details: 'Pikachu', active: true, moves: ['thunderbolt'],
							types: ['Electric'], stats: {atk: 55, def: 40, spa: 50, spd: 50, spe: 90},
						}),
					],
				},
				active: [{ moves: [{move: 'Earthquake', id: 'earthquake', target: 'normal'}] }],
			};

			room.battle.receive(['sideupdate', 'p2', `|request|${JSON.stringify(moveRequest)}`]);
			await waitUntil(() => room.battle.p2.request.choice.startsWith('move '), 'AI never chose a move.');
			assert.match(room.battle.p2.request.choice, /^move /);
		});


		it('should deliver request payloads to the AI during team preview and turn choices', async () => {
			p1 = makeUser("Player One");
			room = Rooms.createBattle({
				format: 'gen9customgame',
				players: [
					{ user: p1, team: packedPlayerPreviewTeam },
					{ user: 'AI Opponent', team: packedAIPreviewTeam, ai: true },
				],
			});
			assert(room?.battle);

			const seen = [];
			const originalReceiveLine = room.battle.p2.aiPlayer.receiveLine.bind(room.battle.p2.aiPlayer);
			room.battle.p2.aiPlayer.receiveLine = line => {
				seen.push(line);
				return originalReceiveLine(line);
			};

			const teamPreviewRequest = {
				teamPreview: true,
				side: {
					name: 'AI Opponent',
					id: 'p2',
					pokemon: [
						makeRequestPokemon({
							ident: 'p2: Golem', details: 'Golem', moves: ['earthquake'],
							types: ['Rock', 'Ground'], stats: {atk: 120, def: 130, spa: 55, spd: 65, spe: 45},
						}),
						makeRequestPokemon({
							ident: 'p2: Blastoise', details: 'Blastoise', moves: ['surf'],
							types: ['Water'], stats: {atk: 83, def: 100, spa: 85, spd: 105, spe: 78},
						}),
					],
				},
				foe: {
					name: 'Player One',
					id: 'p1',
					pokemon: [
						makeRequestPokemon({
							ident: 'p1: Pikachu', details: 'Pikachu', moves: ['thunderbolt'],
							types: ['Electric'], stats: {atk: 55, def: 40, spa: 50, spd: 50, spe: 90},
						}),
						makeRequestPokemon({
							ident: 'p1: Charizard', details: 'Charizard', moves: ['flamethrower'],
							types: ['Fire', 'Flying'], stats: {atk: 84, def: 78, spa: 109, spd: 85, spe: 100},
						}),
					],
				},
			};

			room.battle.receive(['sideupdate', 'p2', `|request|${JSON.stringify(teamPreviewRequest)}`]);
			await waitUntil(() => room.battle.p2.request.choice.startsWith('team '), 'AI never chose a team preview lead.');
			assert(seen.some(line => line.startsWith('|request|')));
			assert.match(room.battle.p2.request.choice, /^team /);

			const moveRequest = {
				side: {
					name: 'AI Opponent',
					id: 'p2',
					pokemon: [
						makeRequestPokemon({
							ident: 'p2: Golem', details: 'Golem', active: true, moves: ['earthquake'],
							types: ['Rock', 'Ground'], stats: {atk: 120, def: 130, spa: 55, spd: 65, spe: 45},
						}),
					],
				},
				foe: {
					name: 'Player One',
					id: 'p1',
					pokemon: [
						makeRequestPokemon({
							ident: 'p1: Pikachu', details: 'Pikachu', active: true, moves: ['thunderbolt'],
							types: ['Electric'], stats: {atk: 55, def: 40, spa: 50, spd: 50, spe: 90},
						}),
					],
				},
				active: [{ moves: [{move: 'Earthquake', id: 'earthquake', target: 'normal'}] }],
			};

			room.battle.receive(['sideupdate', 'p2', `|request|${JSON.stringify(moveRequest)}`]);
			await waitUntil(() => room.battle.p2.request.choice.startsWith('move '), 'AI never made a move choice after team preview.');
			assert.match(room.battle.p2.request.choice, /^move /);
		});

	});

	describe('BattleStream', () => {
		it('should work (slow)', async () => {
			Config.simulatorprocesses = 1;
			const PM = require('../../dist/server/room-battle').PM;
			assert.equal(PM.processes.length, 0);
			PM.spawn(1, true);
			assert.equal(PM.processes[0].getLoad(), 0);

			const stream = PM.createStream();
			assert.equal(PM.processes[0].getLoad(), 1);
			stream.write(
				'>version a2393dfd2a2da5594148bf99eea514e72b136c2c\n' +
				'>start {"formatid":"gen9customgame","seed":[9619,36790,28450,62465],"rated":"Rated battle"}\n' +
				`>player p1 {"name":"p1","avatar":"ethan","team":"${packedSinglePlayerTeam}","rating":1507,"seed":[59512,58581,51338,7861]}\n` +
				`>player p2 {"name":"p2","avatar":"dawn","team":"${packedSingleAITeam}","rating":1447,"seed":[33758,53485,62378,29757]}\n`
			);
			assert((await stream.read()).includes('|switch|'));
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
			stream.write(
				'>p1 move 1\n' +
				'>p2 move 1\n'
			);
			assert((await stream.read()).includes('|move|'));
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
			stream.destroy();
			assert.equal(PM.processes[0].getLoad(), 0);

			const stream2 = PM.createStream();
			assert.equal(PM.processes[0].getLoad(), 1);
			stream2.write(
				'>version a2393dfd2a2da5594148bf99eea514e72b136c2c\n' +
				'>start {"formatid":"gen9customgame","seed":[9619,36790,28450,62465],"rated":"Rated battle"}\n' +
				`>player p1 {"name":"p1","avatar":"ethan","team":"${packedSinglePlayerTeam}","rating":1507,"seed":[59512,58581,51338,7861]}\n` +
				`>player p2 {"name":"p2","avatar":"dawn","team":"${packedSingleAITeam}","rating":1447,"seed":[33758,53485,62378,29757]}\n` +
				'>p1 move 1\n' +
				'>p2 move 1\n'
			);
			assert(await stream2.read());
			stream2.writeEnd();
			await stream2.readAll();
			assert.equal(PM.processes[0].getLoad(), 0);
			PM.unspawn();
		});
	});
});
