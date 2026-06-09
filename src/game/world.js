import {
  FANTASY_BIOME_ID,
  pickFantasyPropVariant,
} from './fantasyAssets';
import {
  FANTASY_VILLAGE_PLACEMENTS,
  isInsideVillageBounds as isInsideFantasyVillageBounds,
  resolveFantasyPlacement,
} from './fantasyVillageLayout';
import { pickPlantPropVariant } from './plantAssets';
import { resolvePlantPlacement } from './plantPlacement';
import {
  VILLAGE_BIOME_ID,
  VILLAGE_SCENE_ANCHOR,
  getVillageScenePosition,
  pickVillagePropVariant,
} from './villageAssets';
import {
  VILLAGE_CENTER_X,
  VILLAGE_CENTER_Z,
  VILLAGE_HALF_SIZE,
  isInsideVillageBounds,
  resolveVillagePlacement,
} from './villageLayout';
import {
  getRegionForPath,
  getRegionalBiomeForDex,
  getPokemonForRegion,
  REGIONAL_BIOMES,
} from './pokemonData';

export {
  getAllPlayableBiomes,
  getBiomeDisplayInfo,
  getRegionMeta,
  formatEggGroups,
  formatSpawnProgressLine,
} from './biomeDisplay';
export { getRegionForPath, getRegionalBiomeForDex, getPokemonForRegion, REGIONAL_BIOMES };

export const VOXEL_SIZE = 0.75;
export const CHUNK_SIZE = 32;
export const CHUNK_WORLD_SIZE = CHUNK_SIZE * VOXEL_SIZE;
export const BIOME_CHUNK_MIN = -18;
export const BIOME_CHUNK_MAX = 17;
export const BIOME_CHUNKS_PER_AXIS = BIOME_CHUNK_MAX - BIOME_CHUNK_MIN + 1;
export const BIOME_CHUNK_RADIUS = 1;
export const BIOME_BOUNDARY =
  (CHUNK_SIZE * BIOME_CHUNKS_PER_AXIS * VOXEL_SIZE) / 2 - VOXEL_SIZE * 2;
export const SKY_BIOME_ID = 6;
export const DISTORTION_BIOME_ID = 7;
export const SKY_RENDER_DISTANCE = 1;
export const DISTORTION_RENDER_DISTANCE = 1;
export const BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_SURFACE_Y = -VOXEL_SIZE;
export const WATER_LEVEL = WATER_SURFACE_Y;
export const STONE_LINE_Y = 18;
export const SNOW_LINE_Y = 40;
export const ENTITY_FOOT_CLEARANCE = 0.025;
export const PLAYER_HEIGHT = 1;
export const PLAYER_RADIUS = 0.38;
export const COMPANION_HEIGHT = 0.8;
export const WILD_CREATURE_HEIGHT = 0.8;
export const TREE_RADIUS = 0.58;
export const CACTUS_RADIUS = 0.45;
export const MAP_SIZE = CHUNK_SIZE * BIOME_CHUNKS_PER_AXIS;
export const MAP_HALF_BLOCKS = MAP_SIZE / 2;
export const MAP_HALF_WORLD_SIZE = MAP_HALF_BLOCKS * VOXEL_SIZE;
export const TERRAIN_RADIUS = MAP_HALF_WORLD_SIZE;
export const WORLD_SIZE = MAP_SIZE;
export const WORLD_HALF = Math.floor(WORLD_SIZE / 2);
export const PATH_COUNT = 8;
export const PATH_GRID_SIZE = MAP_SIZE;
export const PATH_HALF_BLOCKS = MAP_HALF_BLOCKS;
export const PATH_WORLD_SIZE = MAP_SIZE * VOXEL_SIZE;
export const PATH_HALF_WORLD_SIZE = PATH_WORLD_SIZE / 2;
export const RENDER_DISTANCE = 2;
/** Radius 0 = spawn chunk only (fast first paint). */
export const SPAWN_RENDER_DISTANCE = 0;

export const CAVE_ZONES = {
  EXTERIOR: 'exterior',
  INTERIOR: 'interior',
};

export const CAVE_BIOME_ID = 4;
export const MOUNT_CORONET_X = 0;
export const MOUNT_CORONET_Z = -16;
export const MOUNT_CORONET_PEAK_HEIGHT = 80;
export const MOUNT_CORONET_SLOPE = 1.2;

export const BIOMES = {
  DESERT: 'desert',
  PLAINS: 'plains',
  SNOW: 'snow',
  FANTASY: 'fantasy',
  VILLAGE: 'village',
};

export const WORLD_PATHS = [
  { id: 0, name: 'Fieldlands Trail', biome: BIOMES.PLAINS, seed: 3.1 },
  { id: 1, name: 'Sandglass Flats', biome: BIOMES.DESERT, seed: 18.6 },
  { id: 2, name: 'Frostpine Pass', biome: BIOMES.SNOW, seed: 42.2 },
  { id: 3, name: 'Coastal Run', biome: BIOMES.PLAINS, seed: 75.4 },
  { id: 4, name: 'Crimson Mire', biome: BIOMES.PLAINS, seed: 103.9 },
  { id: 5, name: 'Coronet Approach', biome: BIOMES.SNOW, seed: 160.3 },
  { id: 6, name: 'Fantasy World', biome: BIOMES.FANTASY, seed: 201.7 },
  { id: 7, name: 'Village World', biome: BIOMES.VILLAGE, seed: 240.5 },
];

export const CREATURE_ASSET_MANIFEST = {
  0: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
  },
  1: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
      { file: 'ordinary/creature_02.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  2: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  3: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  4: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  5: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  6: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  7: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
};

export const BLOCK_TYPES = ['desert', 'dirt', 'grass', 'snow', 'stone', 'water'];
const GRID_EPSILON = 0.000001;
const SPAWN_PAD_RADIUS = 9;
const SPAWN_APPROACH_RADIUS = 17;

export const MapCache = {
  biomes: {},
  props: {},
};

export const WORLD_MAPS = MapCache.biomes;

let activeBiome = 0;

export function setActivePathId(pathId) {
  activeBiome = Number(pathId) || 0;
}

export function getActivePathId() {
  return activeBiome;
}

export function clearBiomeCache(currentBiome = activeBiome) {
  Object.keys(MapCache.biomes).forEach((key) => {
    if (key.startsWith(`${currentBiome}:`) || key === String(currentBiome)) {
      delete MapCache.biomes[key];
    }
  });
  delete MapCache.props[currentBiome];
}

export function clearAllBiomeCaches() {
  MapCache.biomes = {};
  MapCache.props = {};
}

export function snapToVoxel(value) {
  const snapped = Math.floor((value + GRID_EPSILON) / VOXEL_SIZE) * VOXEL_SIZE;

  return Number(snapped.toFixed(6));
}

export function getVoxelIndex(value) {
  return Math.floor((value + GRID_EPSILON) / VOXEL_SIZE);
}

export function getTileCoord(value) {
  return snapToVoxel(value);
}

export function worldToGrid(x, z) {
  return {
    gridX: snapToVoxel(x),
    gridZ: snapToVoxel(z),
  };
}

export function toTileKey(x, z) {
  return `${snapToVoxel(x)}:${snapToVoxel(z)}`;
}

function seededRandom(x, z = 0, seed = 0) {
  const value = Math.sin(x * 127.1 + z * 311.7 + seed * 41.9) * 43758.5453123;

  return value - Math.floor(value);
}

function getBiomeDefinition(currentBiome = activeBiome) {
  return WORLD_PATHS.find((path) => path.id === currentBiome) || WORLD_PATHS[0];
}

function getCreatureAssetManifest(currentBiome = activeBiome) {
  return CREATURE_ASSET_MANIFEST[currentBiome] || CREATURE_ASSET_MANIFEST[0];
}

function getCreatureAssetUrl(currentBiome, file) {
  const biome = getBiomeDefinition(currentBiome);

  return encodeURI(`/assets/${biome.name}/${file}`);
}

export function getOrdinaryCreatureAsset(
  currentBiome = activeBiome,
  spawnIndex = 0
) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const ordinary = manifest.ordinary.length > 0
    ? manifest.ordinary
    : [{ file: 'ordinary.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] }];
  const asset = ordinary[spawnIndex % ordinary.length];

  return {
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  };
}

export function getAlphaCreatureAsset(currentBiome = activeBiome) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const asset = manifest.alpha || {
    file: 'alpha.glb',
    scale: 0.95,
    rotation: [0, Math.PI / 2, 0],
  };

  return {
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  };
}

function createEmptyCounts() {
  return BLOCK_TYPES.reduce((counts, type) => {
    counts[type] = 0;
    return counts;
  }, {});
}

export function getChunkKey(cx, cz) {
  return `${cx},${cz}`;
}

export function getChunkCoord(value) {
  const tileIndex = getVoxelIndex(snapToVoxel(value));

  return (
    Math.floor((tileIndex + MAP_HALF_BLOCKS) / CHUNK_SIZE) + BIOME_CHUNK_MIN
  );
}

export function getChunkCoordsForPosition(x, z) {
  return {
    cx: getChunkCoord(x),
    cz: getChunkCoord(z),
  };
}

function isChunkInsideBiome(cx, cz) {
  return (
    cx >= BIOME_CHUNK_MIN &&
    cx <= BIOME_CHUNK_MAX &&
    cz >= BIOME_CHUNK_MIN &&
    cz <= BIOME_CHUNK_MAX
  );
}

export function getBiomeBoundary(currentBiome = activeBiome) {
  if (currentBiome === SKY_BIOME_ID) {
    return CHUNK_WORLD_SIZE * 1.35;
  }

  if (currentBiome === DISTORTION_BIOME_ID) {
    return CHUNK_WORLD_SIZE * 1.55;
  }

  return BIOME_BOUNDARY;
}

export function getBiomeRenderDistance(currentBiome = activeBiome) {
  if (currentBiome === SKY_BIOME_ID) {
    return SKY_RENDER_DISTANCE;
  }

  if (currentBiome === DISTORTION_BIOME_ID) {
    return DISTORTION_RENDER_DISTANCE;
  }

  return RENDER_DISTANCE;
}

export function getSurroundingChunks(centerCx = 0, centerCz = 0, radius = RENDER_DISTANCE) {
  const chunks = [];

  for (let cz = centerCz - radius; cz <= centerCz + radius; cz += 1) {
    for (let cx = centerCx - radius; cx <= centerCx + radius; cx += 1) {
      if (!isChunkInsideBiome(cx, cz)) {
        continue;
      }

      chunks.push({
        cx,
        cz,
        key: getChunkKey(cx, cz),
      });
    }
  }

  return chunks;
}

function getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome) {
  const biome = getBiomeDefinition(currentBiome);
  const rollingHill =
    Math.sin(tileIndexX * 0.22 + biome.seed) * 0.95 +
    Math.cos(tileIndexZ * 0.2 - biome.seed * 0.5) * 0.8 +
    Math.sin((tileIndexX + tileIndexZ) * 0.11 + biome.seed) * 0.55;
  const biomeLift = currentBiome === 2 || currentBiome === 5 ? 2.4 : 1.4;
  const desertFlatten = currentBiome === 1 ? -0.6 : 0;
  const centerLift =
    Math.max(0, 1 - Math.hypot(tileIndexX, tileIndexZ) / MAP_HALF_BLOCKS) *
    biomeLift;
  const mountainLift =
    currentBiome === 5
      ? Math.max(0, 32 - Math.hypot(tileIndexX, tileIndexZ + 12) * 1.5)
      : 0;
  const edgeDrop =
    Math.max(
      0,
      (Math.max(Math.abs(tileIndexX), Math.abs(tileIndexZ)) -
        MAP_HALF_BLOCKS * 0.88) /
      (MAP_HALF_BLOCKS * 0.12)
    ) * 5;

  const rawHeight = Math.round(
    rollingHill + centerLift + desertFlatten + mountainLift - edgeDrop
  ) * VOXEL_SIZE;
  const spawnBaseY = currentBiome === 2 || currentBiome === 5 ? VOXEL_SIZE : 0;
  const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);

  if (spawnDistance <= SPAWN_PAD_RADIUS) {
    return spawnBaseY;
  }

  if (spawnDistance <= SPAWN_APPROACH_RADIUS) {
    const blend =
      (spawnDistance - SPAWN_PAD_RADIUS) /
      (SPAWN_APPROACH_RADIUS - SPAWN_PAD_RADIUS);
    const blendedY = spawnBaseY + (rawHeight - spawnBaseY) * blend;

    return Math.round(blendedY / VOXEL_SIZE) * VOXEL_SIZE;
  }

  return rawHeight;
}

function getSurfaceBlockType(currentBiome, surfaceY) {
  if (currentBiome === FANTASY_BIOME_ID || currentBiome === VILLAGE_BIOME_ID) {
    if (surfaceY >= STONE_LINE_Y) {
      return 'stone';
    }

    return 'grass';
  }

  if (surfaceY >= SNOW_LINE_Y || currentBiome === 2 || currentBiome === 5) {
    return 'snow';
  }

  if (surfaceY >= STONE_LINE_Y) {
    return 'stone';
  }

  if (currentBiome === 1) {
    return 'desert';
  }

  return 'grass';
}

export function generateBiomeChunk(currentBiome, cx, cz) {
  try {
    return createBiomeChunk(currentBiome, cx, cz);
  } catch (error) {
    if (currentBiome === 3) {
      return createCoastalFallbackChunk(cx, cz);
    }

    throw error;
  }
}

function createCoastalFallbackChunk(cx, cz) {
  const blocks = [];
  const counts = createEmptyCounts();
  const heightLookup = new Map();
  const startX = (cx - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const shoreline = Math.sin(tileIndexX * 0.12) * 5 + Math.cos(tileIndexZ * 0.08) * 3;
      const isWater = tileIndexZ + shoreline < -10;
      const surfaceY = isWater ? WATER_LEVEL : 0;
      const type = isWater ? 'water' : 'desert';

      heightLookup.set(toTileKey(x, z), {
        biome: BIOMES.PLAINS,
        isWater,
        surfaceY,
      });
      blocks.push({
        x,
        y: surfaceY - VOXEL_SIZE / 2,
        z,
        type,
      });
      counts[type] += 1;
    }
  }

  return {
    blocks,
    counts,
    cx,
    cz,
    heightLookup,
    key: getChunkKey(cx, cz),
  };
}

function createBiomeChunk(currentBiome, cx, cz) {
  const blocks = [];
  const counts = createEmptyCounts();
  const heightLookup = new Map();
  const startX = (cx - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const rawSurfaceY = getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome);
      const waterNoise =
        Math.sin((tileIndexX + currentBiome * 7) * 0.19) +
        Math.cos((tileIndexZ - currentBiome * 5) * 0.17);
      const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);
      const coastalWater =
        currentBiome === 3 &&
        spawnDistance > SPAWN_APPROACH_RADIUS &&
        (tileIndexZ < -18 || waterNoise < -1.18);
      const isWater =
        spawnDistance > SPAWN_APPROACH_RADIUS &&
        (rawSurfaceY <= WATER_LEVEL ||
          coastalWater ||
          (currentBiome === 4 && waterNoise < -1.45) ||
          seededRandom(tileIndexX, tileIndexZ, currentBiome) < 0.004);
      const surfaceY = isWater ? WATER_LEVEL : rawSurfaceY;

      heightLookup.set(toTileKey(x, z), {
        biome: getBiomeDefinition(currentBiome).biome,
        isWater,
        surfaceY,
      });

      if (isWater) {
        const waterBottomY = Math.min(rawSurfaceY, WATER_LEVEL);

        for (
          let topY = WATER_LEVEL;
          topY >= waterBottomY - GRID_EPSILON;
          topY -= VOXEL_SIZE
        ) {
          const snappedTopY = snapToVoxel(topY);

          blocks.push({
            x,
            y: snappedTopY - WATER_BLOCK_HEIGHT / 2,
            z,
            type: 'water',
          });
          counts.water += 1;
        }

        continue;
      }

      for (
        let topY = surfaceY;
        topY >= WATER_LEVEL - GRID_EPSILON;
        topY -= VOXEL_SIZE
      ) {
        const snappedTopY = snapToVoxel(topY);
        const isSurface = snappedTopY === surfaceY;
        const type = isSurface
          ? currentBiome === 3
            ? 'desert'
            : getSurfaceBlockType(currentBiome, surfaceY)
          : snappedTopY >= STONE_LINE_Y
            ? 'stone'
            : 'dirt';

        blocks.push({
          x,
          y: snappedTopY - BLOCK_HEIGHT / 2,
          z,
          type,
        });
        counts[type] += 1;
      }
    }
  }

  return {
    blocks,
    counts,
    cx,
    cz,
    heightLookup,
    key: getChunkKey(cx, cz),
  };
}

function getBiomeCacheKey(currentBiome, caveZone = CAVE_ZONES.EXTERIOR) {
  return `${currentBiome}:${caveZone}`;
}

export function generateBiomeMap(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const cacheKey = getBiomeCacheKey(currentBiome, caveZone);
  const boundary = getBiomeBoundary(currentBiome);

  if (MapCache.biomes[cacheKey]) {
    return MapCache.biomes[cacheKey];
  }

  MapCache.biomes[cacheKey] = {
    ...getBiomeDefinition(currentBiome),
    cacheKey,
    caveZone,
    bounds: {
      minX: -boundary,
      maxX: boundary,
      minZ: -boundary,
      maxZ: boundary,
    },
    chunkMap: {},
    chunks: [],
    counts: createEmptyCounts(),
    heightLookup: new Map(),
  };

  return MapCache.biomes[cacheKey];
}

export function ensureBiomeChunk(
  currentBiome = activeBiome,
  cx = 0,
  cz = 0,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  if (!isChunkInsideBiome(cx, cz)) {
    return null;
  }

  const biomeMap = generateBiomeMap(currentBiome, caveZone);
  const key = getChunkKey(cx, cz);

  if (biomeMap.chunkMap[key]) {
    return biomeMap.chunkMap[key];
  }

  const chunk = generateBiomeChunk(currentBiome, cx, cz);

  biomeMap.chunkMap[key] = chunk;
  biomeMap.chunks = Object.values(biomeMap.chunkMap);
  Object.keys(biomeMap.counts).forEach((type) => {
    biomeMap.counts[type] += chunk.counts[type];
  });
  chunk.heightLookup.forEach((tile, tileKey) => {
    biomeMap.heightLookup.set(tileKey, tile);
  });

  return chunk;
}

export function getBiomeChunksAround(
  currentBiome = activeBiome,
  centerCx = 0,
  centerCz = 0,
  radius = getBiomeRenderDistance(currentBiome),
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return getSurroundingChunks(centerCx, centerCz, radius)
    .map((chunkCoord) =>
      ensureBiomeChunk(currentBiome, chunkCoord.cx, chunkCoord.cz, caveZone)
    )
    .filter(Boolean);
}

export function getBiomeCacheSummary(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const cacheKey = getBiomeCacheKey(currentBiome, caveZone);
  const biomeMap = MapCache.biomes[cacheKey];
  const biome = getBiomeDefinition(currentBiome);
  const counts = biomeMap?.counts || createEmptyCounts();
  const chunkCount = biomeMap?.chunks?.length || 0;
  const blockCount = Object.values(counts).reduce(
    (total, count) => total + count,
    0
  );

  return {
    biomeId: currentBiome,
    biomeName: biome.name,
    biomeType: biome.biome,
    cacheKey,
    caveZone,
    blockCount,
    chunkCount,
    counts: { ...counts },
    isCached: chunkCount > 0,
  };
}

export function preloadSpawnChunk(
  currentBiome = activeBiome,
  centerCx = 0,
  centerCz = 0,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  generateBiomeMap(currentBiome, caveZone);
  getBiomeChunksAround(
    currentBiome,
    centerCx,
    centerCz,
    SPAWN_RENDER_DISTANCE,
    caveZone
  );
  return getBiomeMap(currentBiome, caveZone);
}

/** Preload full render radius synchronously (sandbox switch, tests). */
export function preloadBiome(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  generateBiomeMap(currentBiome, caveZone);
  getBiomeChunksAround(
    currentBiome,
    0,
    0,
    getBiomeRenderDistance(currentBiome),
    caveZone
  );

  return generateBiomeMap(currentBiome, caveZone);
}

/**
 * Expand chunk rings in idle time so spawn area is ready immediately
 * while outer terrain fills in without blocking the main thread.
 */
export function scheduleBiomeRingPreload(
  currentBiome = activeBiome,
  centerCx = 0,
  centerCz = 0,
  caveZone = CAVE_ZONES.EXTERIOR,
  onRing = () => { }
) {
  const maxRadius = getBiomeRenderDistance(currentBiome);
  let radius = SPAWN_RENDER_DISTANCE + 1;
  let cancelled = false;

  const schedule =
    typeof requestIdleCallback !== 'undefined'
      ? (fn) => requestIdleCallback(fn, { timeout: 48 })
      : (fn) => setTimeout(fn, 0);

  const step = () => {
    if (cancelled || radius > maxRadius) {
      return;
    }
    getBiomeChunksAround(currentBiome, centerCx, centerCz, radius, caveZone);
    onRing(radius, maxRadius);
    radius += 1;
    schedule(step);
  };

  schedule(step);

  return () => {
    cancelled = true;
  };
}

export function countChunksInRadius(radius = RENDER_DISTANCE) {
  return getSurroundingChunks(0, 0, radius).length;
}

export function getBiomeMap(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
}

const PLAINS_TREE_BIOMES = new Set([0, 3, 4]);
const SNOW_PINE_BIOMES = new Set([2, 5]);
const PLANT_TREE_DENSITY = 0.07;
const PLANT_UNDERSTORY_DENSITY = 0.1;
const PLANT_PINE_DENSITY = 0.065;
const PLANT_MAX_SCATTERED = 100;
const CACTUS_DENSITY = 0.055;
const DESERT_ROCK_LARGE_DENSITY = 0.012;
const DESERT_ROCK_DENSITY = 0.035;
const DESERT_SCATTER_DENSITY = 0.055;
const FANTASY_TREE_DENSITY = 0.04;
const FANTASY_PLANT_DENSITY = 0.12;
const FANTASY_ROCK_DENSITY = 0.02;
const FANTASY_MAX_SCATTERED = 100;
const VILLAGE_TREE_DENSITY = 0.03;
const VILLAGE_PLANT_DENSITY = 0.08;
const VILLAGE_FENCE_DENSITY = 0.015;
const VILLAGE_MAX_SCATTERED = 60;

function getSurfaceBlockTypeForProp(currentBiome, surfaceY) {
  if (currentBiome === FANTASY_BIOME_ID || currentBiome === VILLAGE_BIOME_ID) {
    if (surfaceY >= STONE_LINE_Y) {
      return 'stone';
    }

    return 'grass';
  }

  if (surfaceY >= SNOW_LINE_Y || currentBiome === 2 || currentBiome === 5) {
    return 'snow';
  }

  if (surfaceY >= STONE_LINE_Y) {
    return 'stone';
  }

  if (currentBiome === 1) {
    return 'desert';
  }

  return 'grass';
}

function markPropFootprint(occupiedTiles, x, z, footprintRadius) {
  const span = Math.ceil(footprintRadius / VOXEL_SIZE);
  const centerX = snapToVoxel(x);
  const centerZ = snapToVoxel(z);

  for (let offsetX = -span; offsetX <= span; offsetX += 1) {
    for (let offsetZ = -span; offsetZ <= span; offsetZ += 1) {
      const tileX = centerX + offsetX * VOXEL_SIZE;
      const tileZ = centerZ + offsetZ * VOXEL_SIZE;

      if ((tileX - x) ** 2 + (tileZ - z) ** 2 <= footprintRadius ** 2) {
        occupiedTiles.add(toTileKey(tileX, tileZ));
      }
    }
  }
}

function markVillageCollisionRect(occupiedTiles, centerX, centerZ, halfSize) {
  for (let x = centerX - halfSize; x <= centerX + halfSize + GRID_EPSILON; x += VOXEL_SIZE) {
    for (let z = centerZ - halfSize; z <= centerZ + halfSize + GRID_EPSILON; z += VOXEL_SIZE) {
      occupiedTiles.add(toTileKey(snapToVoxel(x), snapToVoxel(z)));
    }
  }
}

function buildPropOccupiedTiles(
  cacti,
  fantasyProps = [],
  plantProps = [],
  villageProps = []
) {
  const occupiedTiles = new Set();

  cacti.forEach((cactus) => {
    markPropFootprint(occupiedTiles, cactus.x, cactus.z, CACTUS_RADIUS);
  });
  fantasyProps.forEach((prop) => {
    if (prop.collisionRadius > 0) {
      markPropFootprint(occupiedTiles, prop.x, prop.z, prop.collisionRadius);
    }
  });
  plantProps.forEach((prop) => {
    if (prop.collisionRadius > 0) {
      markPropFootprint(occupiedTiles, prop.x, prop.z, prop.collisionRadius);
    }
  });
  villageProps.forEach((prop) => {
    if (prop.collisionRadius > 0) {
      markPropFootprint(occupiedTiles, prop.x, prop.z, prop.collisionRadius);
    }
  });

  return occupiedTiles;
}

function generateFantasyBiomeProps(currentBiome) {
  const biomeMap = generateBiomeMap(currentBiome);
  const fantasyProps = [];

  FANTASY_VILLAGE_PLACEMENTS.forEach((spec) => {
    const tile = biomeMap.heightLookup.get(toTileKey(spec.x, spec.z));

    if (!tile || tile.isWater) {
      return;
    }

    const placement = resolveFantasyPlacement(spec, tile.surfaceY);

    if (placement) {
      fantasyProps.push(placement);
    }
  });

  let scatteredCount = 0;

  biomeMap.heightLookup.forEach((tile, key) => {
    if (tile.isWater || tile.surfaceY <= WATER_LEVEL || scatteredCount >= FANTASY_MAX_SCATTERED) {
      return;
    }

    const [x, z] = key.split(':').map(Number);
    const tileIndexX = getVoxelIndex(x);
    const tileIndexZ = getVoxelIndex(z);
    const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);

    if (spawnDistance <= SPAWN_PAD_RADIUS || isInsideFantasyVillageBounds(x, z)) {
      return;
    }

    const surfaceType = getSurfaceBlockTypeForProp(currentBiome, tile.surfaceY);
    const roll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 91);
    const variantRoll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 173);
    let propKey = null;

    if (surfaceType === 'grass' && roll < FANTASY_TREE_DENSITY) {
      propKey = pickFantasyPropVariant('tree', variantRoll);
    } else if (surfaceType === 'grass' && roll < FANTASY_TREE_DENSITY + FANTASY_PLANT_DENSITY) {
      propKey = pickFantasyPropVariant('plant', variantRoll);
    } else if (surfaceType === 'stone' && roll < FANTASY_ROCK_DENSITY) {
      propKey = pickFantasyPropVariant('rock', variantRoll);
    }

    if (!propKey) {
      return;
    }

    const placement = resolveFantasyPlacement(
      { propKey, x, z, rotationY: variantRoll * Math.PI * 2 },
      tile.surfaceY
    );

    if (placement) {
      fantasyProps.push(placement);
      scatteredCount += 1;
    }
  });

  const occupiedTiles = buildPropOccupiedTiles([], fantasyProps, []);

  return {
    trees: [],
    pineTrees: [],
    cacti: [],
    fantasyProps,
    plantProps: [],
    villageScene: null,
    villageProps: [],
    occupiedTiles,
  };
}

function generateVillageBiomeProps(currentBiome) {
  const biomeMap = generateBiomeMap(currentBiome);
  const villageProps = [];
  const anchorTile = biomeMap.heightLookup.get(
    toTileKey(VILLAGE_SCENE_ANCHOR.x, VILLAGE_SCENE_ANCHOR.z)
  );
  const anchorSurfaceY = anchorTile?.surfaceY ?? 0;
  const scenePos = getVillageScenePosition(anchorSurfaceY);

  const villageScene = {
    key: 'village-scene',
    x: scenePos.x,
    z: scenePos.z,
    surfaceY: scenePos.y,
    scale: scenePos.scale,
    rotationY: 0,
  };

  let scatteredCount = 0;

  biomeMap.heightLookup.forEach((tile, key) => {
    if (tile.isWater || tile.surfaceY <= WATER_LEVEL || scatteredCount >= VILLAGE_MAX_SCATTERED) {
      return;
    }

    const [x, z] = key.split(':').map(Number);
    const tileIndexX = getVoxelIndex(x);
    const tileIndexZ = getVoxelIndex(z);
    const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);

    if (spawnDistance <= SPAWN_PAD_RADIUS || isInsideVillageBounds(x, z)) {
      return;
    }

    const surfaceType = getSurfaceBlockTypeForProp(currentBiome, tile.surfaceY);
    const roll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 91);
    const variantRoll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 173);
    let propKey = null;

    if (surfaceType === 'grass' && roll < VILLAGE_TREE_DENSITY) {
      propKey = pickVillagePropVariant('tree', variantRoll);
    } else if (
      surfaceType === 'grass' &&
      roll < VILLAGE_TREE_DENSITY + VILLAGE_PLANT_DENSITY
    ) {
      propKey = pickVillagePropVariant('plant', variantRoll);
    } else if (
      surfaceType === 'grass' &&
      roll < VILLAGE_TREE_DENSITY + VILLAGE_PLANT_DENSITY + VILLAGE_FENCE_DENSITY
    ) {
      propKey = pickVillagePropVariant('fence', variantRoll);
    } else if (surfaceType === 'stone' && roll < VILLAGE_FENCE_DENSITY) {
      propKey = pickVillagePropVariant('rock', variantRoll);
    }

    if (!propKey) {
      return;
    }

    const placement = resolveVillagePlacement(
      { propKey, x, z, rotationY: variantRoll * Math.PI * 2 },
      tile.surfaceY
    );

    if (placement) {
      villageProps.push(placement);
      scatteredCount += 1;
    }
  });

  const occupiedTiles = buildPropOccupiedTiles([], [], [], villageProps);
  markVillageCollisionRect(
    occupiedTiles,
    VILLAGE_CENTER_X,
    VILLAGE_CENTER_Z,
    VILLAGE_HALF_SIZE
  );

  return {
    trees: [],
    pineTrees: [],
    cacti: [],
    fantasyProps: [],
    plantProps: [],
    villageScene,
    villageProps,
    occupiedTiles,
  };
}

function generateBiomeProps(currentBiome = activeBiome) {
  if (currentBiome === FANTASY_BIOME_ID) {
    return generateFantasyBiomeProps(currentBiome);
  }

  if (currentBiome === VILLAGE_BIOME_ID) {
    return generateVillageBiomeProps(currentBiome);
  }

  getBiomeChunksAround(
    currentBiome,
    0,
    0,
    getBiomeRenderDistance(currentBiome)
  );
  const biomeMap = generateBiomeMap(currentBiome);
  const cacti = [];
  const plantProps = [];
  let scatteredCount = 0;

  biomeMap.heightLookup.forEach((tile, key) => {
    if (tile.isWater || tile.surfaceY <= WATER_LEVEL) {
      return;
    }

    if (scatteredCount >= PLANT_MAX_SCATTERED) {
      return;
    }

    const [x, z] = key.split(':').map(Number);
    const tileIndexX = getVoxelIndex(x);
    const tileIndexZ = getVoxelIndex(z);
    const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);

    if (spawnDistance <= SPAWN_PAD_RADIUS) {
      return;
    }

    const surfaceType = getSurfaceBlockTypeForProp(currentBiome, tile.surfaceY);
    const roll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 91);
    const variantRoll = seededRandom(tileIndexX, tileIndexZ, currentBiome + 173);

    let propKey = null;

    if (currentBiome === 1 && surfaceType === 'desert') {
      if (roll < CACTUS_DENSITY) {
        cacti.push({
          key: `cactus-${key}`,
          x,
          z,
          surfaceY: tile.surfaceY,
        });
        return;
      }

      const desertRockRoll = roll - CACTUS_DENSITY;

      if (desertRockRoll < DESERT_ROCK_LARGE_DENSITY) {
        propKey = pickPlantPropVariant('desert_large', currentBiome, variantRoll);
      } else if (desertRockRoll < DESERT_ROCK_LARGE_DENSITY + DESERT_ROCK_DENSITY) {
        propKey = pickPlantPropVariant('desert_rock', currentBiome, variantRoll);
      } else if (
        desertRockRoll <
        DESERT_ROCK_LARGE_DENSITY + DESERT_ROCK_DENSITY + DESERT_SCATTER_DENSITY
      ) {
        propKey = pickPlantPropVariant('desert_scatter', currentBiome, variantRoll);
      }

      if (propKey) {
        const placement = resolvePlantPlacement(
          { propKey, x, z, rotationY: variantRoll * Math.PI * 2 },
          tile.surfaceY
        );

        if (placement) {
          plantProps.push(placement);
          scatteredCount += 1;
        }
      }

      return;
    }

    if (
      PLAINS_TREE_BIOMES.has(currentBiome) &&
      surfaceType === 'grass' &&
      roll < PLANT_TREE_DENSITY
    ) {
      propKey = pickPlantPropVariant('tree', currentBiome, variantRoll);
    } else if (
      PLAINS_TREE_BIOMES.has(currentBiome) &&
      surfaceType === 'grass' &&
      roll < PLANT_TREE_DENSITY + PLANT_UNDERSTORY_DENSITY
    ) {
      propKey = pickPlantPropVariant('plant', currentBiome, variantRoll);
    } else if (
      SNOW_PINE_BIOMES.has(currentBiome) &&
      surfaceType === 'snow' &&
      roll < PLANT_PINE_DENSITY
    ) {
      propKey = pickPlantPropVariant('pine', currentBiome, variantRoll);
    }

    if (!propKey) {
      return;
    }

    const placement = resolvePlantPlacement(
      { propKey, x, z, rotationY: variantRoll * Math.PI * 2 },
      tile.surfaceY
    );

    if (placement) {
      plantProps.push(placement);
      scatteredCount += 1;
    }
  });

  const occupiedTiles = buildPropOccupiedTiles(cacti, [], plantProps);

  return {
    trees: [],
    pineTrees: [],
    cacti,
    fantasyProps: [],
    plantProps,
    villageScene: null,
    villageProps: [],
    occupiedTiles,
  };
}

export function getBiomeProps(currentBiome = activeBiome) {
  if (!MapCache.props[currentBiome]) {
    MapCache.props[currentBiome] = generateBiomeProps(currentBiome);
  }

  return MapCache.props[currentBiome];
}

function collidesWithBiomeProp(x, z, radius, currentBiome) {
  const { occupiedTiles } = getBiomeProps(currentBiome);

  if (!occupiedTiles || occupiedTiles.size === 0) {
    return false;
  }

  const sampleRadius = radius + Math.max(TREE_RADIUS, CACTUS_RADIUS);
  const minX = snapToVoxel(x - sampleRadius);
  const maxX = snapToVoxel(x + sampleRadius);
  const minZ = snapToVoxel(z - sampleRadius);
  const maxZ = snapToVoxel(z + sampleRadius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      if ((tileX - x) ** 2 + (tileZ - z) ** 2 > sampleRadius ** 2) {
        continue;
      }

      if (occupiedTiles.has(toTileKey(tileX, tileZ))) {
        return true;
      }
    }
  }

  return false;
}

export function getRawTerrainSurfaceY(x, z) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);

  return getBiomeSurfaceY(tileIndexX, tileIndexZ, activeBiome);
}

export function getTerrainSurfaceY(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const { cx, cz } = getChunkCoordsForPosition(gridX, gridZ);

  ensureBiomeChunk(currentBiome, cx, cz, caveZone);

  const biomeMap = generateBiomeMap(currentBiome, caveZone);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  if (tile) {
    return tile.surfaceY;
  }

  return getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome);
}

export function isWaterTile(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const { cx, cz } = getChunkCoordsForPosition(gridX, gridZ);

  ensureBiomeChunk(currentBiome, cx, cz, caveZone);

  const biomeMap = generateBiomeMap(currentBiome, caveZone);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.isWater : true;
}

export function getTerrainBlockCenterY(x, z, currentBiome = activeBiome) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome);
  const height = isWaterTile(x, z, currentBiome)
    ? WATER_BLOCK_HEIGHT
    : BLOCK_HEIGHT;

  return surfaceY - height / 2;
}

export function getEntityY(
  x,
  z,
  entityHeight,
  previousY = undefined,
  currentBiome = activeBiome
) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome);

  if (!Number.isFinite(surfaceY)) {
    return Number.isFinite(previousY) ? previousY : entityHeight / 2;
  }

  return surfaceY + entityHeight / 2 + ENTITY_FOOT_CLEARANCE;
}

export function isInsideWorld(x = 0, z = 0, radius = 0, currentBiome = activeBiome) {
  const boundary = getBiomeBoundary(currentBiome);

  return (
    x >= -boundary + radius &&
    x <= boundary - radius &&
    z >= -boundary + radius &&
    z <= boundary - radius
  );
}

export function isWaterCollision(x, z, radius = PLAYER_RADIUS, currentBiome = activeBiome) {
  const minX = snapToVoxel(x - radius);
  const maxX = snapToVoxel(x + radius);
  const minZ = snapToVoxel(z - radius);
  const maxZ = snapToVoxel(z + radius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      if (isWaterTile(tileX, tileZ, currentBiome)) {
        return true;
      }
    }
  }

  return false;
}

export function isWalkablePosition(
  x,
  z,
  radius = PLAYER_RADIUS,
  currentBiome = activeBiome,
  _caveZone = CAVE_ZONES.EXTERIOR
) {
  return (
    isInsideWorld(x, z, radius, currentBiome) &&
    !isWaterCollision(x, z, radius, currentBiome) &&
    !collidesWithBiomeProp(x, z, radius, currentBiome)
  );
}

function isSafeSpawnTile(x, z, currentBiome = activeBiome) {
  const centerY = getTerrainSurfaceY(x, z, currentBiome);

  if (
    !Number.isFinite(centerY) ||
    centerY <= WATER_LEVEL ||
    isWaterTile(x, z, currentBiome) ||
    !isInsideWorld(x, z, PLAYER_RADIUS)
  ) {
    return false;
  }

  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
      const sampleX = x + offsetX * VOXEL_SIZE;
      const sampleZ = z + offsetZ * VOXEL_SIZE;
      const sampleY = getTerrainSurfaceY(sampleX, sampleZ, currentBiome);

      if (
        !Number.isFinite(sampleY) ||
        isWaterTile(sampleX, sampleZ, currentBiome) ||
        Math.abs(sampleY - centerY) > VOXEL_SIZE
      ) {
        return false;
      }
    }
  }

  return true;
}

export function clampToWorld(value, radius = 0) {
  return Math.max(
    -BIOME_BOUNDARY + radius,
    Math.min(BIOME_BOUNDARY - radius, value)
  );
}

export function getSafeSpawnPosition({
  centerX = 0,
  centerZ = 0,
  entityHeight = PLAYER_HEIGHT,
  lift = 2,
  currentBiome = activeBiome,
} = {}) {
  const biomeMap = generateBiomeMap(currentBiome);
  const candidates = [];

  biomeMap.heightLookup.forEach((tile, key) => {
    if (tile.isWater || tile.surfaceY <= WATER_LEVEL) {
      return;
    }

    const [x, z] = key.split(':').map(Number);

    if (!isSafeSpawnTile(x, z, currentBiome)) {
      return;
    }

    candidates.push({
      distance: Math.hypot(x - centerX, z - centerZ),
      surfaceY: tile.surfaceY,
      x,
      z,
    });
  });

  if (candidates.length === 0) {
    return [0, 10, 0];
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const safe = candidates[0];
  const safeLift = Math.max(
    lift,
    entityHeight / 2 + ENTITY_FOOT_CLEARANCE
  );

  return [
    safe.x,
    safe.surfaceY + safeLift,
    safe.z,
  ];
}

export function getPathSpawnPoint(
  currentBiome = activeBiome,
  entityHeight = PLAYER_HEIGHT
) {
  return getSafeSpawnPosition({
    centerX: 0,
    centerZ: 0,
    currentBiome,
    entityHeight,
    lift: entityHeight / 2 + ENTITY_FOOT_CLEARANCE,
  });
}

export const PLAYER_START = [0, 10, 0];

export function getRandomGrassPosition(
  radius = 0.45,
  entityHeight = 1,
  centerX = PLAYER_START[0],
  centerZ = PLAYER_START[2],
  spawnRadius = 7,
  currentBiome = activeBiome
) {
  for (let attempts = 0; attempts < 120; attempts += 1) {
    const x = getTileCoord(centerX + Math.random() * spawnRadius * 2 - spawnRadius);
    const z = getTileCoord(centerZ + Math.random() * spawnRadius * 2 - spawnRadius);

    if (isWalkablePosition(x, z, radius, currentBiome)) {
      return [x, getEntityY(x, z, entityHeight, undefined, currentBiome), z];
    }
  }

  return getSafeSpawnPosition({
    centerX,
    centerZ,
    entityHeight,
    currentBiome,
  });
}
