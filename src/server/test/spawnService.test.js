import { describe, it } from "node:test";
import assert from "node:assert";
import {
  initSpawnState,
  onCatch,
  isAlphaEligible,
} from "../services/spawnService.js";

const ladder = {
  depletionThreshold: 0.5,
  regions: { kanto: { levels: [1, 3] } },
};
const byLevel = {
  1: [
    { speciesId: 1, spawnLevel: 1, formTier: 1 },
    { speciesId: 4, spawnLevel: 1, formTier: 1 },
    { speciesId: 7, spawnLevel: 1, formTier: 1 },
    { speciesId: 25, spawnLevel: 1, formTier: 1 },
  ],
  3: [{ speciesId: 19, spawnLevel: 3, formTier: 3 }],
};

describe("spawnService", () => {
  it("unlocks at 50%", () => {
    let state = initSpawnState("kanto", byLevel, ladder);
    let r = onCatch(state, byLevel[1][0], ladder);
    state = r.state;
    assert.equal(r.unlocked, false);
    r = onCatch(state, byLevel[1][1], ladder);
    state = r.state;
    assert.equal(r.unlocked, false);
    r = onCatch(state, byLevel[1][2], ladder);
    state = r.state;
    assert.equal(r.unlocked, true);
    assert.equal(state.maxUnlockedSpawnLevel, 3);
    r = onCatch(state, byLevel[1][3], ladder);
    state = r.state;
    assert.equal(r.unlocked, false);
  });

  it("alpha when ladder complete", () => {
    const state = initSpawnState("kanto", byLevel, ladder);
    state.maxUnlockedSpawnLevel = 3;
    assert.equal(isAlphaEligible(state), true);
  });
});
