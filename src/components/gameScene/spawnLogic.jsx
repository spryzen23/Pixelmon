import {
  WILD_CREATURE_HEIGHT,
  getOrdinaryCreatureAsset,
  getPathSpawnPoint,
  getRandomGrassPosition,
} from "../../game/world";
import { buildCreatureSpawn } from "../../game/buildCreatureSpawn";
import {
  getPathEggGroups,
  getRegionForPath,
  getTypeAnimProfile,
  pickSpawnEntries,
} from "../../game/pokemonData";

function enrichEntry(entry) {
  if (!entry) return entry;
  return {
    ...entry,
    animProfile: getTypeAnimProfile(entry.types?.[0]),
  };
}

export function createWildCreatures(pathId = 0, unlockedLevel = 1) {
  const regionId = getRegionForPath(pathId);
  const eggGroups = getPathEggGroups(pathId);
  const count = 3 + Math.floor(Math.random() * 3);
  const spawn = getPathSpawnPoint(pathId, WILD_CREATURE_HEIGHT);
  const entries = pickSpawnEntries({
    regionId,
    pathId,
    unlockedLevel,
    eggGroups,
    count,
  }).map(enrichEntry);

  return entries.map((entry, index) => {
    const fallback = getOrdinaryCreatureAsset(pathId, index);
    return buildCreatureSpawn({
      id: `wild-${entry.entryId}-${index}`,
      entry,
      position: getRandomGrassPosition(
        0.45,
        WILD_CREATURE_HEIGHT,
        spawn[0],
        spawn[2] + 6,
        7,
        pathId
      ),
      isAlpha: false,
      fallbackAsset: fallback,
    });
  });
}

export { enrichEntry };
