import { describe, it, expect, vi } from "vitest";
import {
  getAlphaSpawnPosition,
  ALPHA_SPAWN_DISTANCES,
  _resetSpawnVectors,
} from "./spawnPlacement";

describe("getAlphaSpawnPosition", () => {
  it("picks first walkable point along camera forward", () => {
    _resetSpawnVectors();
    const player = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { y: 0 },
    };
    const camera = {
      getWorldDirection: (out) => {
        out.set(0, 0, -1);
        return out;
      },
    };

    const isWalkablePosition = vi.fn((x, z, _r, _biome, _zone) => {
      return Math.abs(x) < 0.01 && z <= -15;
    });
    const getEntityY = vi.fn(() => 1.5);
    const getRandomGrassPosition = vi.fn(() => [9, 1.5, 9]);

    const pos = getAlphaSpawnPosition(player, camera, 0, null, {
      isWalkablePosition,
      getEntityY,
      getRandomGrassPosition,
      distances: ALPHA_SPAWN_DISTANCES,
    });

    expect(pos[0]).toBe(0);
    expect(pos[2]).toBeLessThan(0);
    expect(getEntityY).toHaveBeenCalled();
    expect(getRandomGrassPosition).not.toHaveBeenCalled();
  });

  it("falls back to random grass when no forward slot is walkable", () => {
    _resetSpawnVectors();
    const player = {
      position: { x: 2, y: 0, z: 3 },
      rotation: { y: 1.2 },
    };
    const camera = {
      getWorldDirection: (out) => {
        out.set(1, 0, 0);
        return out;
      },
    };

    const getRandomGrassPosition = vi.fn(() => [4, 1, 5]);

    const pos = getAlphaSpawnPosition(player, camera, 1, null, {
      isWalkablePosition: () => false,
      getEntityY: () => 1,
      getRandomGrassPosition,
      distances: [10],
    });

    expect(getRandomGrassPosition).toHaveBeenCalled();
    expect(pos).toEqual([4, 1, 5]);
  });
});
