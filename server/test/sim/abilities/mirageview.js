'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Mirageview', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should resend the revealed Pokemon's typing when the disguise breaks`, () => {
		battle = common.gen(9).createBattle([[
			{species: 'Zoroark', ability: 'mirageview', moves: ['splash']},
			{species: 'Pikachu', moves: ['splash']},
		], [
			{species: 'Wynaut', moves: ['tackle']},
		]]);

		battle.makeChoices('move splash', 'move tackle');

		assert(battle.log.some(line => line.includes('|-start|p1a: Zoroark|typechange|Electric')));
		assert(battle.log.some(line => line.includes('|replace|p1a: Zoroark|Zoroark')));
		assert(battle.log.some(line => line.includes('|-ability|p1a: Zoroark|Mirageview')));
		assert(battle.log.some(line => line.includes('|-start|p1a: Zoroark|typechange|Dark')));
	});
});
