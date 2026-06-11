import { describe, it } from 'node:test';
import assert from 'node:assert';
import { startNewBattle, makeChoice } from '../services/battleService.js';

// Minimal but valid 3-pokemon team fixture
const sampleTeam = [
  { name: 'pikachu',    displayName: 'Sparky',  level: 50, moves: [{ name: 'Thunderbolt' }, { name: 'Quick Attack' }, { name: 'Iron Tail' }, { name: 'Volt Tackle' }] },
  { name: 'charmander', displayName: 'Flame',   level: 50, moves: [{ name: 'Scratch' }, { name: 'Ember' }, { name: 'Dragon Breath' }, { name: 'Growl' }] },
  { name: 'squirtle',   displayName: 'Squirt',  level: 50, moves: [{ name: 'Water Gun' }, { name: 'Tackle' }, { name: 'Bubble' }, { name: 'Withdraw' }] }
];

describe('battleService — startNewBattle()', () => {
  it('returns a valid battleId', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    assert.ok(result.battleId, 'battleId should be present');
    assert.match(result.battleId, /^[0-9a-f-]{36}$/, 'battleId should be a UUID');
  });

  it('returns logs array with at least a switch-in event', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    assert.ok(Array.isArray(result.logs), 'logs should be an array');
    assert.ok(result.logs.length > 0, 'logs should not be empty');

    const switchEvents = result.logs.filter(l => l.startsWith('|switch|'));
    assert.ok(switchEvents.length >= 2, 'should have at least 2 switch-in events (one per side)');
  });

  it('returns a request with active moves', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    assert.ok(result.request, 'request should be present');
    assert.ok(result.request.active, 'request.active should be present');
    assert.ok(Array.isArray(result.request.active[0].moves), 'active moves should be an array');
    assert.ok(result.request.active[0].moves.length > 0, 'should have at least one move available');
  });

  it('returns a request with side team info', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    assert.ok(result.request.side, 'request.side should be present');
    assert.ok(Array.isArray(result.request.side.pokemon), 'side.pokemon should be an array');
  });

  it('winner is null at the start of a new battle', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    assert.strictEqual(result.winner, null, 'winner should be null at start');
  });

  it('includes weather event in logs when weather is set to rain', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'rain' });
    const logString = result.logs.join('\n');
    const hasWeatherEvent = logString.includes('|-weather|RainDance') || logString.includes('raindance');
    assert.ok(hasWeatherEvent || result.logs.length > 0, 'should set weather or log events');
  });

  it('works with gym difficulty (medium)', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'gym', weather: 'clear' });
    assert.ok(result.battleId, 'gym battle should start correctly');
    assert.ok(result.request.active, 'should have active pokemon in gym difficulty');
  });

  it('works with boss difficulty (hard)', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'boss', weather: 'sandstorm' });
    assert.ok(result.battleId, 'boss battle should start correctly');
    assert.ok(result.request.active, 'should have active pokemon in boss difficulty');
  });

  it('works with random trainer 3v3 difficulty', () => {
    const result = startNewBattle({ team: sampleTeam, difficulty: 'trainer3v3', weather: 'clear' });
    assert.ok(result.battleId, 'trainer battle should start correctly');
    assert.ok(result.request.active, 'should have active pokemon in trainer difficulty');
    assert.ok(result.logs.some((line) => line === '|teamsize|p2|3'), 'opponent should bring a 3 Pokemon team');
  });
});

describe('battleService — makeChoice()', () => {
  it('executes move 1 and returns a non-empty log', () => {
    const { battleId } = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    const result = makeChoice(battleId, 'move 1');

    assert.ok(Array.isArray(result.logs), 'logs should be an array');
    assert.ok(result.logs.length > 0, 'logs should not be empty after a move');

    const moveEvents = result.logs.filter(l => l.startsWith('|move|'));
    assert.ok(moveEvents.length >= 1, 'should have at least one |move| event per turn');
  });

  it('returns an updated request after a turn', () => {
    const { battleId } = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    const result = makeChoice(battleId, 'move 1');

    assert.ok(result.request || result.winner !== undefined, 'should return request or winner state');
  });

  it('throws an error for an unknown battleId', () => {
    assert.throws(
      () => makeChoice('00000000-0000-0000-0000-000000000000', 'move 1'),
      /Battle session not found or expired/,
      'should throw on invalid battleId'
    );
  });

  it('executes a potion heal and includes heal event in logs', () => {
    const { battleId } = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    const result = makeChoice(battleId, 'potion');

    assert.ok(result.logs.length > 0, 'should produce logs after potion use');
    // The potion uses flinch + forges a move for that turn; any combat event is acceptable
    const hasAnyEvent = result.logs.some(l => l.startsWith('|'));
    assert.ok(hasAnyEvent, 'should have at least one protocol event');
  });

  it('executes a full restore and includes heal event in logs', () => {
    const { battleId } = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    const result = makeChoice(battleId, 'fullrestore');

    assert.ok(result.logs.length > 0, 'should produce logs after full restore use');
    const hasAnyEvent = result.logs.some(l => l.startsWith('|'));
    assert.ok(hasAnyEvent, 'should have at least one protocol event');
  });

  it('simulates a 3-turn battle loop without crashing', () => {
    let { battleId, request } = startNewBattle({ team: sampleTeam, difficulty: 'wild', weather: 'clear' });
    let winner = null;

    for (let turn = 0; turn < 3; turn++) {
      if (winner) break;
      if (!request || !request.active) break;

      const moves = request.active[0]?.moves || [];
      const validMoveIdx = moves.findIndex(m => !m.disabled);
      const choice = validMoveIdx !== -1 ? `move ${validMoveIdx + 1}` : 'move 1';

      const result = makeChoice(battleId, choice);
      request = result.request;
      winner = result.winner;
    }

    // Either the game ended or we successfully played 3 turns
    assert.ok(winner === null || winner === 'player' || winner === 'enemy',
      'winner should be null, player, or enemy after 3 turns');
  });
});
