import { describe, it, expect } from 'vitest';
import { resolveWildModel } from './assetResolver';

describe('resolveWildModel', () => {
  it('prefers catalog modelUrl', () => {
    const result = resolveWildModel(
      { modelUrl: '/assets/models/pikachu.glb', isAlpha: false },
      0
    );
    expect(result.modelUrl).toBe('/assets/models/pikachu.glb');
  });

  it('falls back to default wild model', () => {
    const result = resolveWildModel({ isAlpha: false }, 99);
    expect(result.modelUrl).toBe('/assets/wild_creature.glb');
  });
});
