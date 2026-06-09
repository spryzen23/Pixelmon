import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getBiomeMap, getBallsConfig } from '../lib/dataStore.js';

describe('API data layer (health/biomes/balls)', () => {
  it('biome map has playable regions', async () => {
    const map = await getBiomeMap();
    assert.ok(Array.isArray(map.regions));
    assert.ok(map.regions.length > 0);
    assert.ok(map.regions.some((r) => r.playable));
  });

  it('balls config exposes standard/great/ultra', async () => {
    const config = await getBallsConfig();
    assert.ok(Array.isArray(config.balls));
    const ids = config.balls.map((b) => b.id);
    assert.ok(ids.includes('standard'));
    assert.ok(ids.includes('great'));
    assert.ok(ids.includes('ultra'));
  });
});
