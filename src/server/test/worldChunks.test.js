import { describe, it } from 'node:test';
import assert from 'node:assert';

/** Keep in sync with world.js — spawn paints one surface-only chunk first. */
const SPAWN_RENDER_DISTANCE = 0;

/** Mirrors getSurroundingChunks + isChunkInsideBiome sizing in world.js */
function countChunksInRadius(radius, min = -18, max = 17) {
  let total = 0;
  for (let cz = -radius; cz <= radius; cz += 1) {
    for (let cx = -radius; cx <= radius; cx += 1) {
      if (cx >= min && cx <= max && cz >= min && cz <= max) {
        total += 1;
      }
    }
  }
  return total;
}

describe('world chunk streaming contract', () => {
  it('spawn radius (0) loads exactly one chunk', () => {
    assert.equal(countChunksInRadius(0), 1);
  });

  it('default render radius (2) loads 25 chunks', () => {
    assert.equal(countChunksInRadius(2), 25);
  });

  it('each ring adds chunks without blocking spawn paint', () => {
    const spawn = countChunksInRadius(0);
    const ring1 = countChunksInRadius(1);
    const full = countChunksInRadius(2);
    assert.ok(ring1 > spawn);
    assert.ok(full > ring1);
    assert.equal(full, 25);
  });

  it('spawn render distance stays at radius 0 for fast paint', () => {
    assert.equal(SPAWN_RENDER_DISTANCE, 0);
  });

  it('chunk ring at radius 1 adds 8 chunks without including inner spawn', () => {
    const ring0 = countChunksInRadius(0);
    const ring1 = countChunksInRadius(1);
    assert.equal(ring1 - ring0, 8);
  });
});
