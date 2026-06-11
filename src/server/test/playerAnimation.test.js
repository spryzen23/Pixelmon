import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getPlayerActionFallbacks,
  getPlayerModelYOffset,
  resolvePlayerAction,
} from '../../game/playerAnimation.js';
import { getPlayerStyle, normalizePlayerStyle } from '../../game/playerStyles.js';

describe('playerAnimation', () => {
  it('resolvePlayerAction prioritizes jump over crouch and locomotion', () => {
    assert.equal(
      resolvePlayerAction({
        jumping: true,
        crouching: true,
        moving: true,
        hasMoveInput: true,
        sprinting: true,
      }),
      'Jump'
    );
  });

  it('resolvePlayerAction uses crouch when grounded', () => {
    assert.equal(
      resolvePlayerAction({
        jumping: false,
        crouching: true,
        moving: true,
        hasMoveInput: true,
        sprinting: true,
      }),
      'Crouch'
    );
  });

  it('resolvePlayerAction walks on input even when blocked', () => {
    assert.equal(
      resolvePlayerAction({
        jumping: false,
        crouching: false,
        moving: false,
        hasMoveInput: true,
        sprinting: false,
      }),
      'Walk'
    );
  });

  it('resolvePlayerAction runs when sprinting with input', () => {
    assert.equal(
      resolvePlayerAction({
        jumping: false,
        crouching: false,
        moving: true,
        hasMoveInput: true,
        sprinting: true,
      }),
      'Run'
    );
  });

  it('resolvePlayerAction idles with no input', () => {
    assert.equal(
      resolvePlayerAction({
        jumping: false,
        crouching: false,
        moving: false,
        hasMoveInput: false,
        sprinting: false,
      }),
      'Idle'
    );
  });

  it('getPlayerModelYOffset aligns feet below player root', () => {
    assert.ok(getPlayerModelYOffset(0.92) < -0.4);
    assert.ok(getPlayerModelYOffset(0.92, true) < getPlayerModelYOffset(0.92));
  });

  it('getPlayerActionFallbacks returns sensible chains', () => {
    assert.deepEqual(getPlayerActionFallbacks('Run'), ['Run', 'Walk', 'Jog', 'Idle']);
    assert.deepEqual(getPlayerActionFallbacks('Crouch'), ['Crouch', 'Sneak', 'Duck', 'Idle']);
    assert.deepEqual(getPlayerActionFallbacks('Unknown'), ['Idle', 'Stand', 'Walk']);
  });
});

describe('playerStyles', () => {
  it('normalizePlayerStyle falls back to default', () => {
    const style = normalizePlayerStyle(null);
    assert.equal(style.id, 'player-21');
    assert.ok(style.modelUrl.includes('/assets/players/'));
  });

  it('getPlayerStyle resolves known ids', () => {
    const style = getPlayerStyle('player-1');
    assert.equal(style.label, 'Cyber Punk');
    assert.ok(style.modelUrl.includes('player%20(1)'));
  });
});
