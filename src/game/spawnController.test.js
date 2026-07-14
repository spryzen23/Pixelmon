import { describe, it, expect } from "vitest";
import {
  initBiomeSpawnState,
  onCatch,
  isAlphaEligible,
  getSpawnCandidates,
} from "./spawnController.js";

const ladder = {
  depletionThreshold: 0.5,
  regions: { kanto: { levels: [1, 6] } },
};

const byLevel = {
  1: [
    {
      speciesId: 1,
      spawnLevel: 1,
      formTier: 1,
      eggGroups: ["monster"],
      isLegendary: false,
    },
    {
      speciesId: 4,
      spawnLevel: 1,
      formTier: 1,
      eggGroups: ["monster"],
      isLegendary: false,
    },
    {
      speciesId: 7,
      spawnLevel: 1,
      formTier: 1,
      eggGroups: ["monster"],
      isLegendary: false,
    },
    {
      speciesId: 25,
      spawnLevel: 1,
      formTier: 1,
      eggGroups: ["monster"],
      isLegendary: false,
    },
  ],
  6: [
    {
      speciesId: 2,
      spawnLevel: 6,
      formTier: 1,
      eggGroups: ["monster"],
      isLegendary: false,
    },
  ],
};

describe("spawnController", () => {
  it("initializes level pools", () => {
    const state = initBiomeSpawnState("kanto", byLevel, ladder);
    expect(state.maxUnlockedSpawnLevel).toBe(1);
    expect(state.levelPools["1"].initial).toBe(4);
    expect(state.levelPools["1"].remaining).toBe(4);
  });

  it("unlocks next level at 50% depletion", () => {
    let state = initBiomeSpawnState("kanto", byLevel, ladder);
    const e1 = byLevel[1][0];
    let r = onCatch(state, e1, ladder);
    state = r.state;
    expect(r.unlocked).toBe(false);
    r = onCatch(state, byLevel[1][1], ladder);
    state = r.state;
    expect(r.unlocked).toBe(false);
    r = onCatch(state, byLevel[1][2], ladder);
    state = r.state;
    expect(r.unlocked).toBe(true);
    expect(state.maxUnlockedSpawnLevel).toBe(6);
  });

  it("alpha eligible at max level", () => {
    const state = initBiomeSpawnState("kanto", byLevel, ladder);
    state.maxUnlockedSpawnLevel = 6;
    expect(isAlphaEligible(state)).toBe(true);
  });

  it("filters by egg group", () => {
    const state = initBiomeSpawnState("kanto", byLevel, ladder);
    const c = getSpawnCandidates(state, byLevel, { eggGroups: ["water1"] });
    expect(c.length).toBe(0);
  });
});
