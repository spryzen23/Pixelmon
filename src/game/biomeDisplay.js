import {
  getPathEggGroups,
  getRegionForPath,
  REGIONAL_BIOMES,
} from "./pokemonData";

const PATH_TERRAIN = [
  {
    id: 0,
    name: "Fieldlands Trail",
    biome: "grassland",
    fantasyBiome: "grass",
  },
  { id: 1, name: "Sandglass Flats", biome: "desert", fantasyBiome: "desert" },
  { id: 2, name: "Frostpine Pass", biome: "snow", fantasyBiome: "icy" },
  { id: 3, name: "Coastal Run", biome: "coastal", fantasyBiome: "cave" },
  { id: 4, name: "Crimson Mire", biome: "mire", fantasyBiome: "volcanic" },
  { id: 5, name: "Coronet Approach", biome: "mountain", fantasyBiome: "icy" },
  { id: 6, name: "Fantasy World", biome: "tropical", fantasyBiome: "sky" },
  { id: 7, name: "Village World", biome: "village", fantasyBiome: "moonlit" },
];

function findRegionMeta(regionId) {
  return (
    REGIONAL_BIOMES.regions.find((region) => region.id === regionId) || {
      id: regionId,
      name: regionId,
      minDex: 0,
      maxDex: 0,
      count: 0,
    }
  );
}

export function getRegionMeta(regionId) {
  const region = findRegionMeta(regionId);
  const hasPath = Object.values(REGIONAL_BIOMES.pathToRegion || {}).includes(
    regionId
  );

  return {
    ...region,
    hasPath,
    footnote: hasPath
      ? null
      : `${region.name} (${region.minDex}–${region.maxDex}) — coming soon`,
  };
}

export function getBiomeDisplayInfo(pathId = 0) {
  const id = Number(pathId) || 0;
  const path = PATH_TERRAIN.find((entry) => entry.id === id) || PATH_TERRAIN[0];
  const regionId = getRegionForPath(id);
  const region = findRegionMeta(regionId);
  const eggGroups = getPathEggGroups(id);

  return {
    pathId: path.id,
    terrainName: path.name,
    terrainType: path.biome,
    fantasyBiome: path.fantasyBiome,
    regionId: region.id,
    regionName: region.name,
    dexRange: {
      min: region.minDex,
      max: region.maxDex,
      count: region.count,
    },
    eggGroups,
    label: `${path.name} · ${region.name}`,
    shortLabel: region.name,
  };
}

export function getAllPlayableBiomes() {
  return PATH_TERRAIN.map((path) => getBiomeDisplayInfo(path.id));
}

export function formatEggGroups(eggGroups = []) {
  return eggGroups.map((group) => group.replace(/-/g, " ")).join("/");
}

export function formatSpawnProgressLine({
  level = 1,
  maxLevel = 1,
  active = 0,
  peak = 0,
  eggGroups = [],
  regionName = "",
}) {
  const groups = formatEggGroups(eggGroups);
  const remaining = `${active}/${peak} remaining`;
  return `Level ${level}/${maxLevel} · ${groups} · ${remaining} · ${regionName}`;
}
