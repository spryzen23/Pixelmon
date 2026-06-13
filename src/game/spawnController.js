/** Client-side spawn ladder (mirrors server spawnService). */

export function initBiomeSpawnState(regionId, byLevel, ladderConfig) {
  const regionLadder = ladderConfig.regions?.[regionId];
  const levels =
    regionLadder?.levels ||
    Object.keys(byLevel)
      .map(Number)
      .sort((a, b) => a - b);

  const levelPools = {};
  for (const level of levels) {
    const pool = byLevel[String(level)] || [];
    const uniqueSpecies = new Set(pool.map((p) => p.speciesId));
    levelPools[String(level)] = {
      initial: uniqueSpecies.size || pool.length,
      remaining: uniqueSpecies.size || pool.length,
      caughtSpeciesIds: [],
    };
  }

  return {
    regionId,
    levels,
    maxUnlockedSpawnLevel: levels[0] ?? 1,
    levelPools,
    alphaCaught: false,
    activeEggGroups: ladderConfig.eggGroupRotation?.waves?.[0] || ['field'],
  };
}

export function buildByLevelFromEntries(entries, regionId) {
  const byLevel = {};
  for (const e of entries) {
    if (e.region !== regionId) continue;
    const lvl = String(e.spawnLevel);
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(e);
  }
  return byLevel;
}

export function getSpawnCandidates(state, byLevel, options = {}) {
  const { eggGroups, maxFormTier = 99, maxLevel } = options;
  const cap = maxLevel ?? state.maxUnlockedSpawnLevel;
  const allowedLevels = state.levels.filter((l) => l <= cap);
  const candidates = [];

  for (const level of allowedLevels) {
    const pool = byLevel[String(level)] || [];
    for (const p of pool) {
      if (p.formTier > maxFormTier) continue;
      if (p.isLegendary) continue;
      if (eggGroups?.length) {
        const match = p.eggGroups?.some((g) => eggGroups.includes(g));
        if (!match) continue;
      }
      candidates.push(p);
    }
  }
  return candidates;
}

export function pickRandomSpawn(candidates) {
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function onCatch(state, entry, ladderConfig) {
  const level = String(entry.spawnLevel);
  const pool = state.levelPools[level];
  if (!pool) return { state, unlocked: false };

  if (!pool.caughtSpeciesIds.includes(entry.speciesId)) {
    pool.caughtSpeciesIds.push(entry.speciesId);
    pool.remaining = Math.max(0, pool.remaining - 1);
  }

  const threshold = ladderConfig.depletionThreshold ?? 0.5;
  let unlocked = false;
  if (pool.initial > 0 && pool.remaining < pool.initial * threshold) {
    const idx = state.levels.indexOf(entry.spawnLevel);
    if (idx >= 0 && idx < state.levels.length - 1) {
      const next = state.levels[idx + 1];
      if (next > state.maxUnlockedSpawnLevel) {
        state.maxUnlockedSpawnLevel = next;
        unlocked = true;
      }
    }
  }

  return { state: { ...state, levelPools: { ...state.levelPools } }, unlocked };
}

export function isAlphaEligible(state) {
  if (state.alphaCaught) return false;
  const lastLevel = state.levels[state.levels.length - 1];
  return state.maxUnlockedSpawnLevel >= lastLevel;
}

export function getPoolProgress(state, level) {
  const pool = state.levelPools[String(level)];
  if (!pool || !pool.initial) return 1;
  return 1 - pool.remaining / pool.initial;
}
