import { AUTO_ASSET_MANIFEST } from './generatedAssetManifest';

export const VOXEL_SIZE = 0.75;
export const CHUNK_SIZE = 32;
export const CHUNK_WORLD_SIZE = CHUNK_SIZE * VOXEL_SIZE;
export const BIOME_CHUNK_MIN = -18;
export const BIOME_CHUNK_MAX = 17;
export const BIOME_CHUNKS_PER_AXIS = BIOME_CHUNK_MAX - BIOME_CHUNK_MIN + 1;
export const BIOME_CHUNK_RADIUS = 1;
export const BIOME_BOUNDARY =
  (CHUNK_SIZE * BIOME_CHUNKS_PER_AXIS * VOXEL_SIZE) / 2 - VOXEL_SIZE * 2;
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
export const SKY_RENDER_DISTANCE = 1;
export const SKY_BIOME_BOUNDARY = CHUNK_WORLD_SIZE * 1.35;
export const DISTORTION_RENDER_DISTANCE = 1;
export const DISTORTION_BIOME_BOUNDARY = CHUNK_WORLD_SIZE * 1.55;
export const MOUNT_CORONET_X = 0;
export const MOUNT_CORONET_Z = -16;
export const MOUNT_CORONET_PEAK_HEIGHT = 80;
export const MOUNT_CORONET_SLOPE = 1.2;
export const VOLCANO_CENTER_X = 0;
export const VOLCANO_CENTER_Z = -42;
export const VOLCANO_RIM_Y = VOXEL_SIZE * 24;
export const VOLCANO_LAVA_Y = VOXEL_SIZE * 17;
export const CAVE_BIOME_ID = 4;
export const MOONLIT_BIOME_ID = 3;
export const CRYSTAL_BLOSSOM_BIOME_ID = MOONLIT_BIOME_ID;
export const RUINS_BIOME_ID = MOONLIT_BIOME_ID;
export const ICY_BIOME_ID = 5;
export const SKY_BIOME_ID = 6;
export const DISTORTION_BIOME_ID = 7;
export const SKY_ISLAND_RADIUS_TILES = 42;
export const SKY_ISLAND_EDGE_FADE_TILES = 9;
export const SKY_ISLAND_BASE_Y = VOXEL_SIZE * 7;
export const CAVE_ZONES = {
  EXTERIOR: 'exterior',
  INTERIOR: 'interior',
};
export const CAVE_ENTRANCE_POSITION = [0, VOXEL_SIZE, -9];
export const CAVE_ENTRANCE_RADIUS = 2.1;
export const CAVE_INTERIOR_SPAWN = [0, 0, 8];
export const ICY_MOUNTAIN_CENTER_X = 0;
export const ICY_MOUNTAIN_CENTER_Z = -54;
export const ICY_MOUNTAIN_BASE_RADIUS_TILES = 96;
export const ICY_MOUNTAIN_PATH_WIDTH_TILES = 4.2;
const ICY_ROOM_HALF_X_TILES = 4;
const ICY_ROOM_HALF_Z_TILES = 4;
export const KYUREM_GUARDIAN_RADIUS = 1.35;
export const ICE_ROOM_DEFINITIONS = [
  {
    id: 'black',
    assetUrl: '/assets/Icy Biome/legendary/black_kyurem.glb',
    chamberCenter: [42, 0, -35],
    entranceCenter: [38.25, 0, -36.75],
    guardianPosition: [42, 0, -35],
    modelRotation: [0, Math.PI, 0],
    modelScale: 0.42,
  },
  {
    id: 'white',
    assetUrl: '/assets/Icy Biome/legendary/white_kyurem.glb',
    chamberCenter: [-27, 0, -31.5],
    entranceCenter: [-23.25, 0, -34.5],
    guardianPosition: [-27, 0, -31.5],
    modelRotation: [0, 0, 0],
    modelScale: 0.42,
  },
];

export const ICE_ROOM_INTERIOR_EXIT_RADIUS = 1.4;

export const BIOMES = {
  CAVE: 'cave',
  CRYSTAL_BLOSSOM: 'crystal_blossom',
  DESERT: 'desert',
  DISTORTION: 'distortion',
  GRASS: 'grass',
  ICY: 'icy',
  MOSSY: 'mossy',
  MOONLIT: 'moonlit',
  RUINS: 'ruins',
  SKY: 'sky',
  VOLCANIC: 'volcanic',
};

export const WORLD_PATHS = [
  {
    id: 0,
    name: 'Grass Biome',
    assetFolder: 'Grass Biome',
    biome: BIOMES.GRASS,
    seed: 3.1,
  },
  {
    id: 1,
    name: 'Desert Biome',
    assetFolder: 'Desert Biome',
    biome: BIOMES.DESERT,
    seed: 18.6,
  },
  {
    id: 2,
    name: 'Volcanic Biome',
    assetFolder: 'Volcanic Biome',
    biome: BIOMES.VOLCANIC,
    seed: 42.2,
  },
  {
    id: 3,
    name: 'Moonlit Biome',
    assetFolder: 'Moonlit Biome',
    biome: BIOMES.MOONLIT,
    seed: 75.4,
  },
  {
    id: 4,
    name: 'Cave Biome',
    assetFolder: 'Cave Biome',
    biome: BIOMES.CAVE,
    seed: 103.9,
  },
  {
    id: 5,
    name: 'Icy Biome',
    assetFolder: 'Icy Biome',
    biome: BIOMES.ICY,
    seed: 160.3,
  },
  {
    id: 6,
    name: 'Sky Biome',
    assetFolder: 'Sky Biome',
    biome: BIOMES.SKY,
    seed: 211.7,
  },
  {
    id: 7,
    name: 'Distortion Realm',
    assetFolder: 'Distortion Realm',
    biome: BIOMES.DISTORTION,
    seed: 302.6,
  },
];

const DEFAULT_CREATURE_ASSET_MANIFEST = {
  0: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
  },
  1: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
      { file: 'ordinary/creature_02.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  2: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  3: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  4: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  5: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  6: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.42, rotation: [0, Math.PI / 2, 0] },
  },
  7: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.42, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha/alpha_01.glb', scale: 0.58, rotation: [0, Math.PI / 2, 0] },
  },
};

const GRID_EPSILON = 0.000001;
const TERRAIN_GENERATION_VERSION = 18;
const BLOCK_TYPES = [
  'basalt',
  'cave',
  'crystal',
  'cloud',
  'desert',
  'distortion',
  'dirt',
  'grass',
  'lava',
  'moss',
  'moon_grass',
  'moon_stone',
  'ruins',
  'snow',
  'stone',
  'void_stone',
  'water',
];
const SPAWN_PAD_RADIUS = 9;
const SPAWN_APPROACH_RADIUS = 17;
const VOLCANO_CENTER_TILE_X = Math.round(VOLCANO_CENTER_X / VOXEL_SIZE);
const VOLCANO_CENTER_TILE_Z = Math.round(VOLCANO_CENTER_Z / VOXEL_SIZE);
export const VOLCANO_BASE_RADIUS_TILES = 112;
export const VOLCANO_CRATER_RADIUS_TILES = 18;
export const VOLCANO_LAVA_RADIUS_TILES = 9;
const VOLCANO_LAVA_FLOW_DIRECTIONS = [
  -Math.PI * 0.52,
  Math.PI * 0.12,
  Math.PI * 0.78,
];
const DISTORTION_ISLANDS = [
  { x: 0, z: 0, radius: 20, y: VOXEL_SIZE * 6 },
  { x: 33, z: -24, radius: 12, y: VOXEL_SIZE * 9 },
  { x: -32, z: -26, radius: 11, y: VOXEL_SIZE * 4 },
  { x: 31, z: 24, radius: 10, y: VOXEL_SIZE * 3 },
  { x: -24, z: 29, radius: 12, y: VOXEL_SIZE * 8 },
  { x: 0, z: -45, radius: 9, y: VOXEL_SIZE * 11 },
];
const DISTORTION_BRIDGE_WIDTH_TILES = 2.35;
const DISTORTION_BRIDGES = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 5],
];

export const MapCache = {
  biomes: {},
  legendary: {},
};

function normalizeAssetList(assets = []) {
  return Array.isArray(assets)
    ? assets.filter((asset) => asset?.file)
    : [];
}

function normalizeBiomeAssetManifest(manifest = {}) {
  const ordinary = normalizeAssetList(manifest.ordinary);
  const alphaVariants = normalizeAssetList(manifest.alphaVariants);
  const legendary = normalizeAssetList(manifest.legendary);
  const alpha = manifest.alpha?.file
    ? manifest.alpha
    : alphaVariants[0] || null;

  return {
    ordinary,
    alpha,
    alphaVariants,
    legendary,
  };
}

function createCreatureAssetManifest() {
  return WORLD_PATHS.reduce((result, biome) => {
    const generated = normalizeBiomeAssetManifest(
      AUTO_ASSET_MANIFEST?.[biome.id]
    );
    const fallback = normalizeBiomeAssetManifest(
      DEFAULT_CREATURE_ASSET_MANIFEST[biome.id]
    );

    result[biome.id] = {
      ordinary: generated.ordinary.length > 0
        ? generated.ordinary
        : fallback.ordinary,
      alpha: generated.alpha || fallback.alpha,
      alphaVariants: generated.alphaVariants.length > 0
        ? generated.alphaVariants
        : fallback.alphaVariants,
      legendary: generated.legendary.length > 0
        ? generated.legendary
        : fallback.legendary,
    };

    return result;
  }, {});
}

export const CREATURE_ASSET_MANIFEST = createCreatureAssetManifest();

export const WORLD_MAPS = MapCache.biomes;

let activeBiome = 0;

export function normalizeCaveZone(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return currentBiome === CAVE_BIOME_ID
    ? caveZone || CAVE_ZONES.EXTERIOR
    : 'surface';
}

function getBiomeCacheKey(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const zone = normalizeCaveZone(currentBiome, caveZone);

  return zone === 'surface' ? String(currentBiome) : `${currentBiome}:${zone}`;
}

export function setActivePathId(pathId) {
  activeBiome = Number(pathId) || 0;
}

export function getActivePathId() {
  return activeBiome;
}

export function clearBiomeCache(currentBiome = activeBiome) {
  delete MapCache.biomes[currentBiome];
  delete MapCache.biomes[`${currentBiome}:${CAVE_ZONES.EXTERIOR}`];
  delete MapCache.biomes[`${currentBiome}:${CAVE_ZONES.INTERIOR}`];
  delete MapCache.legendary[currentBiome];
}

export function clearAllBiomeCaches() {
  MapCache.biomes = {};
  MapCache.legendary = {};
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

export function getCreatureAssetManifest(currentBiome = activeBiome) {
  return CREATURE_ASSET_MANIFEST[currentBiome] || CREATURE_ASSET_MANIFEST[0];
}

function getCreatureAssetUrl(currentBiome, file) {
  const biome = getBiomeDefinition(currentBiome);

  return encodeURI(`/assets/${biome.assetFolder || biome.name}/${file}`);
}

export function getOrdinaryCreatureAsset(
  currentBiome = activeBiome,
  spawnIndex = 0
) {
  const ordinary = getOrdinaryCreatureAssets(currentBiome);
  const asset = ordinary[spawnIndex % ordinary.length];

  return asset;
}

export function getOrdinaryCreatureAssets(currentBiome = activeBiome) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const ordinary = manifest.ordinary.length > 0
    ? manifest.ordinary
    : [{ file: 'ordinary.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] }];

  return ordinary.map((asset) => ({
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  }));
}

export function getRandomOrdinaryCreatureAsset(currentBiome = activeBiome) {
  const ordinary = getOrdinaryCreatureAssets(currentBiome);
  const randomIndex = Math.floor(Math.random() * ordinary.length);

  return ordinary[randomIndex] || getOrdinaryCreatureAsset(currentBiome, 0);
}

export function getAlphaCreatureAsset(currentBiome = activeBiome) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const asset = manifest.alpha || manifest.alphaVariants?.[0] || {
    file: 'alpha/alpha_01.glb',
    scale: 0.95,
    rotation: [0, Math.PI / 2, 0],
  };

  return {
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  };
}

export function getLegendaryAssets(currentBiome = activeBiome) {
  const manifest = getCreatureAssetManifest(currentBiome);

  return (manifest.legendary || []).map((asset) => ({
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  }));
}

export function getCreatureModelUrl(
  currentBiome = activeBiome,
  isAlpha = false,
  spawnIndex = 0
) {
  return isAlpha
    ? getAlphaCreatureAsset(currentBiome).url
    : getOrdinaryCreatureAsset(currentBiome, spawnIndex).url;
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
    Math.floor((tileIndex + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
    BIOME_CHUNK_MIN
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
    return SKY_BIOME_BOUNDARY;
  }

  if (currentBiome === DISTORTION_BIOME_ID) {
    return DISTORTION_BIOME_BOUNDARY;
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

function positiveModulo(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function getCaveExteriorInfo(tileIndexX, tileIndexZ, baseSurfaceY) {
  const entranceTileX = Math.round(CAVE_ENTRANCE_POSITION[0] / VOXEL_SIZE);
  const entranceTileZ = Math.round(CAVE_ENTRANCE_POSITION[2] / VOXEL_SIZE);
  const dx = tileIndexX - entranceTileX;
  const dz = tileIndexZ - entranceTileZ;
  const distance = Math.hypot(dx, dz);
  const doorway =
    Math.abs(dx) <= 2 &&
    dz >= -1 &&
    dz <= 3;
  const path =
    Math.abs(dx) <= 2 &&
    tileIndexZ >= entranceTileZ + 2 &&
    tileIndexZ <= 8;

  if (doorway) {
    return {
      isDoorway: true,
      surfaceType: 'cave',
      surfaceY: VOXEL_SIZE,
    };
  }

  if (distance <= 11) {
    const moundHeight = Math.max(
      0,
      Math.round((1 - distance / 11) * 5) * VOXEL_SIZE
    );

    return {
      isDoorway: false,
      surfaceType: distance < 7 ? 'stone' : 'cave',
      surfaceY: Math.max(baseSurfaceY, VOXEL_SIZE + moundHeight),
    };
  }

  if (path) {
    return {
      isDoorway: false,
      surfaceType: 'dirt',
      surfaceY: Math.max(baseSurfaceY, 0),
    };
  }

  return {
    isDoorway: false,
    surfaceType: 'grass',
    surfaceY: Math.max(baseSurfaceY, 0),
  };
}

function isCaveInteriorFloorTile(tileIndexX, tileIndexZ) {
  const spacing = 24;
  const localX = positiveModulo(tileIndexX + spacing / 2, spacing) - spacing / 2;
  const localZ = positiveModulo(tileIndexZ + spacing / 2, spacing) - spacing / 2;
  const room =
    Math.abs(localX) <= 8 &&
    Math.abs(localZ) <= 8;
  const corridor =
    Math.abs(localX) <= 2 ||
    Math.abs(localZ) <= 2;
  const centralRoom = Math.hypot(tileIndexX, tileIndexZ - 2) <= 15;
  const entranceRoom =
    Math.abs(tileIndexX) <= 6 &&
    tileIndexZ >= 0 &&
    tileIndexZ <= 16;

  return room || corridor || centralRoom || entranceRoom;
}

function isCaveInteriorCrystalTile(tileIndexX, tileIndexZ) {
  if (!isCaveInteriorFloorTile(tileIndexX, tileIndexZ)) {
    return false;
  }

  if (Math.hypot(tileIndexX, tileIndexZ - 8) < 5) {
    return false;
  }

  return seededRandom(tileIndexX, tileIndexZ, 704) > 0.986;
}

function getIcyMountainDistance(tileIndexX, tileIndexZ) {
  const centerTileX = Math.round(ICY_MOUNTAIN_CENTER_X / VOXEL_SIZE);
  const centerTileZ = Math.round(ICY_MOUNTAIN_CENTER_Z / VOXEL_SIZE);

  return Math.hypot(tileIndexX - centerTileX, tileIndexZ - centerTileZ);
}

function getIcyMountainPolar(tileIndexX, tileIndexZ) {
  const centerTileX = Math.round(ICY_MOUNTAIN_CENTER_X / VOXEL_SIZE);
  const centerTileZ = Math.round(ICY_MOUNTAIN_CENTER_Z / VOXEL_SIZE);
  const dx = tileIndexX - centerTileX;
  const dz = tileIndexZ - centerTileZ;

  return {
    angle: Math.atan2(dz, dx),
    distance: Math.hypot(dx, dz),
  };
}

function getIcySpiralPathInfo(tileIndexX, tileIndexZ) {
  const { angle, distance } = getIcyMountainPolar(tileIndexX, tileIndexZ);
  const normalizedAngle = angle < -Math.PI * 0.72
    ? angle + Math.PI * 2
    : angle;
  const targetRadius =
    ICY_MOUNTAIN_BASE_RADIUS_TILES -
    9 -
    (normalizedAngle + Math.PI * 0.72) * 9.1;
  const delta = Math.abs(distance - targetRadius);

  return {
    isPath: delta <= ICY_MOUNTAIN_PATH_WIDTH_TILES,
    progress: Math.max(
      0,
      Math.min(
        1,
        1 - targetRadius / (ICY_MOUNTAIN_BASE_RADIUS_TILES - 9)
      )
    ),
    targetRadius,
  };
}

function isInsideIceRoom(tileIndexX, tileIndexZ, room) {
  const centerX = Math.round(room.chamberCenter[0] / VOXEL_SIZE);
  const centerZ = Math.round(room.chamberCenter[2] / VOXEL_SIZE);

  return (
    Math.abs(tileIndexX - centerX) <= ICY_ROOM_HALF_X_TILES &&
    Math.abs(tileIndexZ - centerZ) <= ICY_ROOM_HALF_Z_TILES
  );
}

function isInsideIceRoomEntrance(tileIndexX, tileIndexZ, room) {
  const centerX = Math.round(room.entranceCenter[0] / VOXEL_SIZE);
  const centerZ = Math.round(room.entranceCenter[2] / VOXEL_SIZE);

  return (
    Math.abs(tileIndexX - centerX) <= 2 &&
    Math.abs(tileIndexZ - centerZ) <= 1
  );
}

function getIceRoomForTile(tileIndexX, tileIndexZ) {
  return ICE_ROOM_DEFINITIONS.find((room) =>
    isInsideIceRoom(tileIndexX, tileIndexZ, room) ||
    isInsideIceRoomEntrance(tileIndexX, tileIndexZ, room)
  );
}

function getIceRoomFloorY(room) {
  const tileIndexX = Math.round(room.chamberCenter[0] / VOXEL_SIZE);
  const tileIndexZ = Math.round(room.chamberCenter[2] / VOXEL_SIZE);
  const pathInfo = getIcySpiralPathInfo(tileIndexX, tileIndexZ);

  return Math.round((VOXEL_SIZE * 3 + pathInfo.progress * VOXEL_SIZE * 21) / VOXEL_SIZE) *
    VOXEL_SIZE;
}

export function getIceRoomLandmarks() {
  return ICE_ROOM_DEFINITIONS.map((room) => {
    const floorY = getIceRoomFloorY(room);

    return {
      ...room,
      chamberCenter: [room.chamberCenter[0], floorY, room.chamberCenter[2]],
      entranceCenter: [room.entranceCenter[0], floorY, room.entranceCenter[2]],
      guardianPosition: [
        room.guardianPosition[0],
        floorY + ENTITY_FOOT_CLEARANCE,
        room.guardianPosition[2],
      ],
    };
  });
}

export function getIceRoomById(roomId) {
  return getIceRoomLandmarks().find((room) => room.id === roomId) || null;
}

export function getIceRoomDirection(room) {
  const dx = room.entranceCenter[0] - room.chamberCenter[0];
  const dz = room.entranceCenter[2] - room.chamberCenter[2];
  const length = Math.hypot(dx, dz) || 1;

  return {
    x: dx / length,
    z: dz / length,
  };
}

export function getIceRoomSpawnPosition(roomId) {
  const room = getIceRoomById(roomId);

  if (!room) {
    return [0, 10, 0];
  }

  const direction = getIceRoomDirection(room);

  return [
    room.chamberCenter[0] - direction.x * VOXEL_SIZE * 2.2,
    room.chamberCenter[1] + PLAYER_HEIGHT / 2 + ENTITY_FOOT_CLEARANCE,
    room.chamberCenter[2] - direction.z * VOXEL_SIZE * 2.2,
  ];
}

export function getIceRoomInteriorExitPosition(roomId) {
  const room = getIceRoomById(roomId);

  if (!room) {
    return [0, PLAYER_HEIGHT / 2 + ENTITY_FOOT_CLEARANCE, 2];
  }

  const direction = getIceRoomDirection(room);

  return [
    room.chamberCenter[0] + direction.x * VOXEL_SIZE * 2.65,
    room.chamberCenter[1],
    room.chamberCenter[2] + direction.z * VOXEL_SIZE * 2.65,
  ];
}

export function getIceRoomExitSpawnPosition(roomId) {
  const room = getIceRoomById(roomId);

  if (!room) {
    return getSafeSpawnPosition({ currentBiome: ICY_BIOME_ID });
  }

  const direction = getIceRoomDirection(room);

  return [
    room.entranceCenter[0] + direction.x * VOXEL_SIZE * 3.4,
    room.entranceCenter[1] + PLAYER_HEIGHT / 2 + ENTITY_FOOT_CLEARANCE,
    room.entranceCenter[2] + direction.z * VOXEL_SIZE * 3.4,
  ];
}

function getIcyMountainSurfaceY(tileIndexX, tileIndexZ, baseSurfaceY) {
  const distance = getIcyMountainDistance(tileIndexX, tileIndexZ);

  if (distance > ICY_MOUNTAIN_BASE_RADIUS_TILES) {
    return baseSurfaceY;
  }

  const pathInfo = getIcySpiralPathInfo(tileIndexX, tileIndexZ);
  const room = getIceRoomForTile(tileIndexX, tileIndexZ);

  if (room && isInsideIceRoom(tileIndexX, tileIndexZ, room)) {
    return getIceRoomFloorY(room);
  }

  if (room && isInsideIceRoomEntrance(tileIndexX, tileIndexZ, room)) {
    return getIceRoomFloorY(room);
  }

  const normalizedDistance = distance / ICY_MOUNTAIN_BASE_RADIUS_TILES;
  const mountainY = VOXEL_SIZE * 2 +
    Math.round(Math.pow(1 - normalizedDistance, 1.55) * 28) * VOXEL_SIZE;

  if (pathInfo.isPath) {
    const pathY = VOXEL_SIZE * 2 +
      Math.round(pathInfo.progress * 24) * VOXEL_SIZE;

    return Math.max(baseSurfaceY, pathY);
  }

  return Math.max(baseSurfaceY, mountainY);
}

function isRuinsPathTile(tileIndexX, tileIndexZ) {
  return (
    Math.abs(tileIndexX) <= 4 ||
    Math.abs(tileIndexZ) <= 4 ||
    Math.abs(tileIndexX - tileIndexZ) <= 3
  );
}

function isRuinsRelicTile(tileIndexX, tileIndexZ) {
  return [
    [18, -18],
    [-22, -12],
    [24, 18],
    [-18, 22],
    [0, 28],
  ].some(([x, z]) => Math.abs(tileIndexX - x) <= 5 && Math.abs(tileIndexZ - z) <= 5);
}

function getRuinsPillarHeight(tileIndexX, tileIndexZ) {
  const pillar =
    positiveModulo(tileIndexX + 6, 16) <= 1 &&
    positiveModulo(tileIndexZ + 4, 18) <= 1 &&
    Math.hypot(tileIndexX, tileIndexZ) > 12;

  if (!pillar) {
    return 0;
  }

  return 2 + Math.floor(seededRandom(tileIndexX, tileIndexZ, 809) * 4);
}

function isRuinsLowWallTile(tileIndexX, tileIndexZ) {
  const nearRelic = isRuinsRelicTile(tileIndexX, tileIndexZ);
  const brokenWall =
    (Math.abs(tileIndexX) === 12 && Math.abs(tileIndexZ) < 34) ||
    (Math.abs(tileIndexZ) === 12 && Math.abs(tileIndexX) < 34);

  return !nearRelic && brokenWall && seededRandom(tileIndexX, tileIndexZ, 821) > 0.28;
}

function isMoonlitPathTile(tileIndexX, tileIndexZ) {
  const windingPath =
    Math.abs(tileIndexZ - Math.sin(tileIndexX * 0.12) * 9) <= 3 ||
    Math.abs(tileIndexX + Math.cos(tileIndexZ * 0.1) * 8) <= 2;

  return windingPath && Math.hypot(tileIndexX, tileIndexZ) > 10;
}

export function isSkyIslandTile(tileIndexX, tileIndexZ) {
  const distance = Math.hypot(tileIndexX, tileIndexZ);
  const edgeNoise =
    Math.sin(tileIndexX * 0.18 + 1.3) * 3.2 +
    Math.cos(tileIndexZ * 0.16 - 2.1) * 3.8 +
    Math.sin((tileIndexX - tileIndexZ) * 0.11) * 2.2;

  return distance <= SKY_ISLAND_RADIUS_TILES + edgeNoise;
}

function isSkyPondTile(tileIndexX, tileIndexZ) {
  const dx = tileIndexX + 8;
  const dz = tileIndexZ - 5;
  const pondShape = (dx * dx) / 38 + (dz * dz) / 22;

  return pondShape < 1;
}

export function getSkyIslandSurfaceY(tileIndexX, tileIndexZ) {
  if (!isSkyIslandTile(tileIndexX, tileIndexZ)) {
    return Number.NaN;
  }

  const distance = Math.hypot(tileIndexX, tileIndexZ);
  const islandNoise =
    Math.sin(tileIndexX * 0.24 + 7.4) * 0.8 +
    Math.cos(tileIndexZ * 0.22 - 3.2) * 0.65;
  const centerLift = Math.max(0, 1 - distance / SKY_ISLAND_RADIUS_TILES) * VOXEL_SIZE * 5;
  const edgeFalloff = Math.max(
    0,
    (distance - (SKY_ISLAND_RADIUS_TILES - SKY_ISLAND_EDGE_FADE_TILES)) /
      SKY_ISLAND_EDGE_FADE_TILES
  );
  const peakLift =
    Math.max(0, 1 - Math.hypot(tileIndexX - 14, tileIndexZ + 9) / 16) * VOXEL_SIZE * 5 +
    Math.max(0, 1 - Math.hypot(tileIndexX + 17, tileIndexZ - 12) / 14) * VOXEL_SIZE * 3;
  const pondCut = isSkyPondTile(tileIndexX, tileIndexZ) ? -VOXEL_SIZE * 1.25 : 0;

  return Math.round(
    (
      SKY_ISLAND_BASE_Y +
      centerLift +
      peakLift +
      islandNoise * VOXEL_SIZE +
      pondCut -
      edgeFalloff * VOXEL_SIZE * 4
    ) /
      VOXEL_SIZE
  ) * VOXEL_SIZE;
}

function getSkyUndersideDepth(tileIndexX, tileIndexZ) {
  const distance = Math.hypot(tileIndexX, tileIndexZ);
  const core = Math.max(0, 1 - distance / SKY_ISLAND_RADIUS_TILES);
  const taper = Math.max(1, Math.round((core * core * 13 + 2) * VOXEL_SIZE / VOXEL_SIZE));
  const ridge =
    Math.sin(tileIndexX * 0.31 + tileIndexZ * 0.13) > 0.62
      ? 1
      : 0;

  return Math.max(1, taper + ridge);
}

export function getSkyUndersideBlocks(tileIndexX, tileIndexZ, surfaceY) {
  if (!Number.isFinite(surfaceY) || !isSkyIslandTile(tileIndexX, tileIndexZ)) {
    return [];
  }

  return Array.from({ length: getSkyUndersideDepth(tileIndexX, tileIndexZ) }, (_, index) => ({
    topY: surfaceY - VOXEL_SIZE * (index + 1),
    type: index < 2 ? 'dirt' : 'stone',
  }));
}

function getDistanceToSegment(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const lengthSquared = dx * dx + dz * dz || 1;
  const t = Math.max(
    0,
    Math.min(1, ((px - ax) * dx + (pz - az) * dz) / lengthSquared)
  );
  const closestX = ax + dx * t;
  const closestZ = az + dz * t;

  return {
    distance: Math.hypot(px - closestX, pz - closestZ),
    t,
  };
}

function getDistortionIslandInfo(tileIndexX, tileIndexZ) {
  let best = null;

  DISTORTION_ISLANDS.forEach((island, index) => {
    const noise =
      Math.sin(tileIndexX * 0.21 + index * 2.3) * 1.9 +
      Math.cos(tileIndexZ * 0.18 - index * 1.7) * 1.6;
    const distance = Math.hypot(tileIndexX - island.x, tileIndexZ - island.z);

    if (distance <= island.radius + noise) {
      const score = distance / island.radius;

      if (!best || score < best.score) {
        best = {
          ...island,
          distance,
          index,
          score,
        };
      }
    }
  });

  return best;
}

function getDistortionBridgeInfo(tileIndexX, tileIndexZ) {
  let best = null;

  DISTORTION_BRIDGES.forEach(([fromIndex, toIndex], bridgeIndex) => {
    const from = DISTORTION_ISLANDS[fromIndex];
    const to = DISTORTION_ISLANDS[toIndex];
    const result = getDistanceToSegment(
      tileIndexX,
      tileIndexZ,
      from.x,
      from.z,
      to.x,
      to.z
    );
    const edgeNoise =
      Math.sin(tileIndexX * 0.47 + bridgeIndex) * 0.35 +
      Math.cos(tileIndexZ * 0.39 - bridgeIndex) * 0.25;
    const width = DISTORTION_BRIDGE_WIDTH_TILES + edgeNoise;

    if (result.distance <= width) {
      if (!best || result.distance < best.distance) {
        best = {
          distance: result.distance,
          from,
          t: result.t,
          to,
        };
      }
    }
  });

  return best;
}

function getDistortionTileInfo(tileIndexX, tileIndexZ) {
  const island = getDistortionIslandInfo(tileIndexX, tileIndexZ);

  if (island) {
    const centerLift = Math.max(0, 1 - island.distance / island.radius) * VOXEL_SIZE * 2.5;
    const ripple =
      Math.sin(tileIndexX * 0.28 + tileIndexZ * 0.11) * VOXEL_SIZE * 0.75 +
      Math.cos(tileIndexZ * 0.25 - island.index) * VOXEL_SIZE * 0.45;

    return {
      isBridge: false,
      isVoid: false,
      surfaceY: Math.round((island.y + centerLift + ripple) / VOXEL_SIZE) * VOXEL_SIZE,
    };
  }

  const bridge = getDistortionBridgeInfo(tileIndexX, tileIndexZ);

  if (bridge) {
    const bridgeY = bridge.from.y + (bridge.to.y - bridge.from.y) * bridge.t;

    return {
      isBridge: true,
      isVoid: false,
      surfaceY: Math.round(bridgeY / VOXEL_SIZE) * VOXEL_SIZE,
    };
  }

  return {
    isBridge: false,
    isVoid: true,
    surfaceY: Number.NaN,
  };
}

function getDistortionUndersideBlocks(tileIndexX, tileIndexZ, surfaceY) {
  if (!Number.isFinite(surfaceY)) {
    return [];
  }

  const island = getDistortionIslandInfo(tileIndexX, tileIndexZ);
  const bridge = getDistortionBridgeInfo(tileIndexX, tileIndexZ);
  const depth = island
    ? 2 + Math.round(Math.max(0, 1 - island.distance / island.radius) * 6)
    : bridge ? 1 : 0;

  return Array.from({ length: depth }, (_, index) => ({
    topY: surfaceY - VOXEL_SIZE * (index + 1),
    type: index < 1 ? 'distortion' : 'void_stone',
  }));
}

function getChunkCoordsForTile(tileIndexX, tileIndexZ) {
  return {
    cx:
      Math.floor((tileIndexX + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
      BIOME_CHUNK_MIN,
    cz:
      Math.floor((tileIndexZ + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
      BIOME_CHUNK_MIN,
  };
}

export function getSurroundingChunks(
  centerX = 0,
  centerZ = 0,
  radius = RENDER_DISTANCE
) {
  const chunks = [];
  const minCx = Math.max(BIOME_CHUNK_MIN, centerX - radius);
  const maxCx = Math.min(BIOME_CHUNK_MAX, centerX + radius);
  const minCz = Math.max(BIOME_CHUNK_MIN, centerZ - radius);
  const maxCz = Math.min(BIOME_CHUNK_MAX, centerZ + radius);

  for (let cz = minCz; cz <= maxCz; cz += 1) {
    for (let cx = minCx; cx <= maxCx; cx += 1) {
      chunks.push({
        cx,
        cz,
        key: getChunkKey(cx, cz),
      });
    }
  }

  return chunks;
}

function getVolcanoDistance(tileIndexX, tileIndexZ) {
  return Math.hypot(
    tileIndexX - VOLCANO_CENTER_TILE_X,
    tileIndexZ - VOLCANO_CENTER_TILE_Z
  );
}

function getAngleDelta(angle, targetAngle) {
  return Math.atan2(
    Math.sin(angle - targetAngle),
    Math.cos(angle - targetAngle)
  );
}

function getVolcanoSurfaceY(tileIndexX, tileIndexZ, baseSurfaceY) {
  const distance = getVolcanoDistance(tileIndexX, tileIndexZ);

  if (distance > VOLCANO_BASE_RADIUS_TILES) {
    return baseSurfaceY;
  }

  const normalizedDistance = distance / VOLCANO_BASE_RADIUS_TILES;
  const coneHeightVoxels = Math.round(
    Math.pow(1 - normalizedDistance, 1.7) *
      (VOLCANO_RIM_Y / VOXEL_SIZE)
  );
  const climbableConeY =
    VOXEL_SIZE + Math.max(0, coneHeightVoxels) * VOXEL_SIZE;

  if (distance <= VOLCANO_LAVA_RADIUS_TILES) {
    return VOLCANO_LAVA_Y;
  }

  if (distance <= VOLCANO_CRATER_RADIUS_TILES) {
    const craterBlend =
      (distance - VOLCANO_LAVA_RADIUS_TILES) /
      (VOLCANO_CRATER_RADIUS_TILES - VOLCANO_LAVA_RADIUS_TILES);
    const craterWallY = VOLCANO_LAVA_Y +
      Math.round(
        craterBlend *
          Math.max(1, (climbableConeY - VOLCANO_LAVA_Y) / VOXEL_SIZE)
      ) * VOXEL_SIZE;

    return Math.max(craterWallY, baseSurfaceY + VOXEL_SIZE);
  }

  return Math.max(climbableConeY, baseSurfaceY);
}

function isVolcanoLavaTile(tileIndexX, tileIndexZ) {
  return getVolcanoDistance(tileIndexX, tileIndexZ) <= VOLCANO_LAVA_RADIUS_TILES;
}

function isVolcanoOverflowLavaTile(tileIndexX, tileIndexZ) {
  const offsetX = tileIndexX - VOLCANO_CENTER_TILE_X;
  const offsetZ = tileIndexZ - VOLCANO_CENTER_TILE_Z;
  const distance = Math.hypot(offsetX, offsetZ);

  if (
    distance <= VOLCANO_LAVA_RADIUS_TILES ||
    distance >= VOLCANO_BASE_RADIUS_TILES * 0.78
  ) {
    return false;
  }

  const angle = Math.atan2(offsetZ, offsetX);

  return VOLCANO_LAVA_FLOW_DIRECTIONS.some((direction, index) => {
    const wobble =
      Math.sin(distance * 0.12 + index * 2.9) * 0.09 +
      Math.sin(distance * 0.035 + index * 6.1) * 0.05;
    const flowWidth =
      0.055 +
      (1 - distance / (VOLCANO_BASE_RADIUS_TILES * 0.78)) * 0.13;
    const brokenEdge =
      seededRandom(tileIndexX, tileIndexZ, 91 + index) > 0.08;

    return (
      Math.abs(getAngleDelta(angle, direction + wobble)) < flowWidth &&
      brokenEdge
    );
  });
}

export function getVolcanoPrimalPosition() {
  return [
    VOLCANO_CENTER_X,
    VOLCANO_LAVA_Y + 0.18,
    VOLCANO_CENTER_Z,
  ];
}

function getBiomeSurfaceY(
  tileIndexX,
  tileIndexZ,
  currentBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const biome = getBiomeDefinition(currentBiome);
  const isIcy = biome.biome === BIOMES.ICY;
  const isVolcanic = biome.biome === BIOMES.VOLCANIC;
  const isCave = biome.biome === BIOMES.CAVE;
  const isRuins = biome.biome === BIOMES.RUINS;
  const isMoonlit =
    biome.biome === BIOMES.MOONLIT ||
    biome.biome === BIOMES.CRYSTAL_BLOSSOM;
  const isSky = biome.biome === BIOMES.SKY;
  const isDistortion = biome.biome === BIOMES.DISTORTION;
  const normalizedCaveZone = normalizeCaveZone(currentBiome, caveZone);

  if (isDistortion) {
    return getDistortionTileInfo(tileIndexX, tileIndexZ).surfaceY;
  }

  if (isCave && normalizedCaveZone === CAVE_ZONES.INTERIOR) {
    return isCaveInteriorFloorTile(tileIndexX, tileIndexZ)
      ? 0
      : VOXEL_SIZE * 5;
  }

  if (isSky) {
    return getSkyIslandSurfaceY(tileIndexX, tileIndexZ);
  }

  const rollingHill =
    Math.sin(tileIndexX * 0.22 + biome.seed) * 0.95 +
    Math.cos(tileIndexZ * 0.2 - biome.seed * 0.5) * 0.8 +
    Math.sin((tileIndexX + tileIndexZ) * 0.11 + biome.seed) * 0.55;
  const biomeLift = isIcy || isVolcanic || isCave ? 2.4 : 1.4;
  const desertFlatten = biome.biome === BIOMES.DESERT ? -0.6 : 0;
  const caveLowering = isCave ? -0.75 : 0;
  const centerLift =
    Math.max(0, 1 - Math.hypot(tileIndexX, tileIndexZ) / MAP_HALF_BLOCKS) *
    biomeLift;
  const mountainLift = 0;
  const edgeDrop =
    Math.max(
      0,
      (Math.max(Math.abs(tileIndexX), Math.abs(tileIndexZ)) -
        MAP_HALF_BLOCKS * 0.88) /
        (MAP_HALF_BLOCKS * 0.12)
    ) * 5;

  let rawHeight = Math.round(
    rollingHill + centerLift + desertFlatten + caveLowering + mountainLift - edgeDrop
  ) * VOXEL_SIZE;

  if (isVolcanic) {
    rawHeight = getVolcanoSurfaceY(tileIndexX, tileIndexZ, rawHeight);
  }

  if (isIcy) {
    rawHeight = getIcyMountainSurfaceY(tileIndexX, tileIndexZ, rawHeight);
  }

  if (isRuins && isRuinsRelicTile(tileIndexX, tileIndexZ)) {
    rawHeight = Math.max(rawHeight, VOXEL_SIZE * 2);
  }

  if (isRuins && isRuinsPathTile(tileIndexX, tileIndexZ)) {
    rawHeight = Math.round(rawHeight / VOXEL_SIZE) * VOXEL_SIZE;
  }

  if (isMoonlit) {
    const groveLift =
      Math.sin(tileIndexX * 0.08 + biome.seed) *
      Math.cos(tileIndexZ * 0.08 - biome.seed) *
      VOXEL_SIZE;

    rawHeight = Math.round((rawHeight + groveLift) / VOXEL_SIZE) * VOXEL_SIZE;

    if (isMoonlitPathTile(tileIndexX, tileIndexZ)) {
      rawHeight = Math.max(0, Math.round(rawHeight / VOXEL_SIZE) * VOXEL_SIZE);
    }
  }

  if (isCave) {
    return getCaveExteriorInfo(tileIndexX, tileIndexZ, rawHeight).surfaceY;
  }

  const spawnBaseY = isIcy || isVolcanic || isCave ? VOXEL_SIZE : 0;
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

function getSurfaceBlockType(
  currentBiome,
  surfaceY,
  tileIndexX = 0,
  tileIndexZ = 0,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const biome = getBiomeDefinition(currentBiome).biome;
  const normalizedCaveZone = normalizeCaveZone(currentBiome, caveZone);

  if (biome === BIOMES.VOLCANIC) {
    return surfaceY >= STONE_LINE_Y ? 'stone' : 'basalt';
  }

  if (biome === BIOMES.CAVE && normalizedCaveZone === CAVE_ZONES.INTERIOR) {
    return surfaceY >= STONE_LINE_Y ? 'stone' : 'cave';
  }

  if (biome === BIOMES.CAVE) {
    return getCaveExteriorInfo(tileIndexX, tileIndexZ, surfaceY).surfaceType;
  }

  if (
    biome === BIOMES.MOONLIT ||
    biome === BIOMES.CRYSTAL_BLOSSOM
  ) {
    if (isMoonlitPathTile(tileIndexX, tileIndexZ)) {
      return 'moon_stone';
    }

    return 'moon_grass';
  }

  if (biome === BIOMES.SKY) {
    return surfaceY >= SKY_ISLAND_BASE_Y + VOXEL_SIZE * 3 ? 'grass' : 'moss';
  }

  if (biome === BIOMES.DISTORTION) {
    return getDistortionTileInfo(tileIndexX, tileIndexZ).isBridge
      ? 'void_stone'
      : 'distortion';
  }

  if (biome === BIOMES.RUINS) {
    if (
      isRuinsPathTile(tileIndexX, tileIndexZ) ||
      isRuinsRelicTile(tileIndexX, tileIndexZ)
    ) {
      return 'ruins';
    }

    return surfaceY >= VOXEL_SIZE * 3 ? 'stone' : 'grass';
  }

  if (biome === BIOMES.MOSSY) {
    return 'moss';
  }

  if (biome === BIOMES.ICY || surfaceY >= SNOW_LINE_Y) {
    return 'snow';
  }

  if (surfaceY >= STONE_LINE_Y) {
    return 'stone';
  }

  if (biome === BIOMES.DESERT) {
    return 'desert';
  }

  return 'grass';
}

function getGeneratedTileInfo(
  tileIndexX,
  tileIndexZ,
  currentBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const rawSurfaceY = getBiomeSurfaceY(
    tileIndexX,
    tileIndexZ,
    currentBiome,
    caveZone
  );
  const waterNoise =
    Math.sin((tileIndexX + currentBiome * 7) * 0.19) +
    Math.cos((tileIndexZ - currentBiome * 5) * 0.17);
  const biomeType = getBiomeDefinition(currentBiome).biome;
  const normalizedCaveZone = normalizeCaveZone(currentBiome, caveZone);
  const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);
  const isVolcanic = biomeType === BIOMES.VOLCANIC;
  const isSky = biomeType === BIOMES.SKY;
  const isDistortion = biomeType === BIOMES.DISTORTION;
  const isSkyVoid = isSky && !isSkyIslandTile(tileIndexX, tileIndexZ);
  const distortionInfo = isDistortion
    ? getDistortionTileInfo(tileIndexX, tileIndexZ)
    : null;
  const isDistortionVoid = Boolean(distortionInfo?.isVoid);
  const isSkyPond = isSky && isSkyPondTile(tileIndexX, tileIndexZ);
  const isCaveInterior =
    biomeType === BIOMES.CAVE && normalizedCaveZone === CAVE_ZONES.INTERIOR;
  const isCaveExterior =
    biomeType === BIOMES.CAVE && normalizedCaveZone === CAVE_ZONES.EXTERIOR;
  const coastalWater =
    biomeType === BIOMES.MOSSY &&
    spawnDistance > SPAWN_APPROACH_RADIUS &&
    (tileIndexZ < -18 || waterNoise < -1.18);
  const mireWater =
    isCaveExterior &&
    spawnDistance > SPAWN_APPROACH_RADIUS * 1.35 &&
    waterNoise < -1.5;
  const lavaPool = isVolcanic && isVolcanoLavaTile(tileIndexX, tileIndexZ);
  const lavaOverflow =
    isVolcanic && isVolcanoOverflowLavaTile(tileIndexX, tileIndexZ);
  const terrainWater =
    rawSurfaceY <= WATER_LEVEL &&
    !isCaveInterior &&
    !isSky &&
    (
      biomeType === BIOMES.DESERT ||
      biomeType === BIOMES.MOSSY ||
      biomeType === BIOMES.CAVE
    );
  const isLava = lavaPool || lavaOverflow;
  const isLiquid =
    (isSkyPond && !isSkyVoid) ||
    (
      spawnDistance > SPAWN_APPROACH_RADIUS &&
      (terrainWater || coastalWater || mireWater || isLava)
    );
  const surfaceY = isLava || isSkyPond
    ? rawSurfaceY
    : isLiquid
      ? WATER_LEVEL
      : rawSurfaceY;

  return {
    biome: biomeType,
    caveZone: normalizedCaveZone,
    isCrystal: isCaveInteriorCrystalTile(tileIndexX, tileIndexZ),
    isVoid: isSkyVoid || isDistortionVoid,
    isWater: isLiquid,
    liquidType: isLava ? 'lava' : 'water',
    rawSurfaceY,
    surfaceType: getSurfaceBlockType(
      currentBiome,
      surfaceY,
      tileIndexX,
      tileIndexZ,
      caveZone
    ),
    surfaceY,
  };
}

function getGeneratedTileInfoAtWorld(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);

  return getGeneratedTileInfo(tileIndexX, tileIndexZ, currentBiome, caveZone);
}

function addGeneratedBlock(blocks, counts, x, topY, z, type, height = BLOCK_HEIGHT) {
  blocks.push({
    x,
    y: snapToVoxel(topY) - height / 2,
    z,
    type,
  });
  counts[type] += 1;
}

function addExposedColumnShell(
  blocks,
  counts,
  x,
  z,
  surfaceY,
  lowestNeighborY,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const biomeType = getBiomeDefinition(currentBiome).biome;
  const normalizedCaveZone = normalizeCaveZone(currentBiome, caveZone);

  for (
    let topY = surfaceY - VOXEL_SIZE;
    topY > lowestNeighborY + GRID_EPSILON && topY >= WATER_LEVEL - GRID_EPSILON;
    topY -= VOXEL_SIZE
  ) {
    const snappedTopY = snapToVoxel(topY);
    const type = biomeType === BIOMES.VOLCANIC
      ? 'basalt'
      : biomeType === BIOMES.CAVE && normalizedCaveZone === CAVE_ZONES.INTERIOR
        ? 'cave'
      : biomeType === BIOMES.ICY
        ? snappedTopY >= VOXEL_SIZE * 5 ? 'stone' : 'snow'
      : biomeType === BIOMES.DISTORTION
        ? 'void_stone'
        : biomeType === BIOMES.MOONLIT ||
          biomeType === BIOMES.CRYSTAL_BLOSSOM
          ? snappedTopY >= VOXEL_SIZE * 2 ? 'moon_stone' : 'dirt'
        : biomeType === BIOMES.SKY
          ? snappedTopY >= SKY_ISLAND_BASE_Y - VOXEL_SIZE ? 'dirt' : 'stone'
      : biomeType === BIOMES.RUINS
        ? snappedTopY >= VOXEL_SIZE * 2 ? 'ruins' : 'dirt'
      : snappedTopY >= STONE_LINE_Y
        ? 'stone'
        : 'dirt';

    addGeneratedBlock(blocks, counts, x, snappedTopY, z, type);
  }
}

export function generateBiomeChunk(
  currentBiome,
  cx,
  cz,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  try {
    return createBiomeChunk(currentBiome, cx, cz, caveZone);
  } catch (error) {
    if (currentBiome === CRYSTAL_BLOSSOM_BIOME_ID) {
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
      const isWater = false;
      const surfaceY = Math.max(0, Math.round(shoreline * 0.1) * VOXEL_SIZE);
        const type = isMoonlitPathTile(tileIndexX, tileIndexZ)
          ? 'moon_stone'
          : 'moon_grass';

      heightLookup.set(toTileKey(x, z), {
        biome: BIOMES.MOONLIT,
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

function createBiomeChunk(currentBiome, cx, cz, caveZone = CAVE_ZONES.EXTERIOR) {
  const blocks = [];
  const counts = createEmptyCounts();
  const heightLookup = new Map();
  const normalizedCaveZone = normalizeCaveZone(currentBiome, caveZone);
  const biomeType = getBiomeDefinition(currentBiome).biome;
  const startX = (cx - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const tileInfos = new Map();

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const tile = getGeneratedTileInfo(
        tileIndexX,
        tileIndexZ,
        currentBiome,
        caveZone
      );

      heightLookup.set(toTileKey(x, z), {
        biome: tile.biome,
        isVoid: tile.isVoid,
        isWater: tile.isWater,
        surfaceY: tile.surfaceY,
      });
      tileInfos.set(`${tileIndexX}:${tileIndexZ}`, {
        ...tile,
        tileIndexX,
        tileIndexZ,
        x,
        z,
      });
    }
  }

  tileInfos.forEach((tile) => {
    if (tile.isVoid) {
      return;
    }

    if (tile.isWater) {
      addGeneratedBlock(
        blocks,
        counts,
        tile.x,
        tile.surfaceY,
        tile.z,
        tile.liquidType,
        WATER_BLOCK_HEIGHT
      );

      if (biomeType === BIOMES.SKY) {
        addGeneratedBlock(
          blocks,
          counts,
          tile.x,
          tile.surfaceY - WATER_BLOCK_HEIGHT,
          tile.z,
          'dirt'
        );
      }

      return;
    }

    addGeneratedBlock(
      blocks,
      counts,
      tile.x,
      tile.surfaceY,
      tile.z,
      tile.surfaceType
    );

    if (biomeType === BIOMES.SKY) {
      getSkyUndersideBlocks(
        tile.tileIndexX,
        tile.tileIndexZ,
        tile.surfaceY
      ).forEach((block) => {
        addGeneratedBlock(
          blocks,
          counts,
          tile.x,
          block.topY,
          tile.z,
          block.type
        );
      });
    }

    if (biomeType === BIOMES.DISTORTION) {
      getDistortionUndersideBlocks(
        tile.tileIndexX,
        tile.tileIndexZ,
        tile.surfaceY
      ).forEach((block) => {
        addGeneratedBlock(
          blocks,
          counts,
          tile.x,
          block.topY,
          tile.z,
          block.type
        );
      });
    }

    if (
      normalizedCaveZone === CAVE_ZONES.INTERIOR &&
      tile.isCrystal
    ) {
      addGeneratedBlock(
        blocks,
        counts,
        tile.x,
        tile.surfaceY + VOXEL_SIZE,
        tile.z,
        'crystal'
      );
      addGeneratedBlock(
        blocks,
        counts,
        tile.x,
        tile.surfaceY + VOXEL_SIZE * 2,
        tile.z,
        'crystal'
      );
    }

    if (biomeType === BIOMES.RUINS) {
      const pillarHeight = getRuinsPillarHeight(
        tile.tileIndexX,
        tile.tileIndexZ
      );

      for (let step = 1; step <= pillarHeight; step += 1) {
        addGeneratedBlock(
          blocks,
          counts,
          tile.x,
          tile.surfaceY + VOXEL_SIZE * step,
          tile.z,
          'ruins'
        );
      }

      if (isRuinsLowWallTile(tile.tileIndexX, tile.tileIndexZ)) {
        addGeneratedBlock(
          blocks,
          counts,
          tile.x,
          tile.surfaceY + VOXEL_SIZE,
          tile.z,
          'ruins'
        );
      }
    }

    const neighborHeights = [
      getGeneratedTileInfo(
        tile.tileIndexX + 1,
        tile.tileIndexZ,
        currentBiome,
        caveZone
      ).surfaceY,
      getGeneratedTileInfo(
        tile.tileIndexX - 1,
        tile.tileIndexZ,
        currentBiome,
        caveZone
      ).surfaceY,
      getGeneratedTileInfo(
        tile.tileIndexX,
        tile.tileIndexZ + 1,
        currentBiome,
        caveZone
      ).surfaceY,
      getGeneratedTileInfo(
        tile.tileIndexX,
        tile.tileIndexZ - 1,
        currentBiome,
        caveZone
      ).surfaceY,
    ].map((height) =>
      Number.isFinite(height) ? height : tile.surfaceY - VOXEL_SIZE * 9
    );
    const lowestNeighborY = Math.min(...neighborHeights);

    if (tile.surfaceY > lowestNeighborY + VOXEL_SIZE * 0.5) {
      addExposedColumnShell(
        blocks,
        counts,
        tile.x,
        tile.z,
        tile.surfaceY,
        lowestNeighborY,
        currentBiome,
        caveZone
      );
    }

    if (
      normalizedCaveZone === CAVE_ZONES.INTERIOR &&
      tile.surfaceY <= VOXEL_SIZE
    ) {
      addGeneratedBlock(
        blocks,
        counts,
        tile.x,
        VOXEL_SIZE * 7,
        tile.z,
        'cave'
      );
    }
  });

  return {
    blocks,
    counts,
    cx,
    cz,
    heightLookup,
    key: getChunkKey(cx, cz),
  };
}

export function generateBiomeMap(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const cacheKey = getBiomeCacheKey(currentBiome, caveZone);

  if (
    MapCache.biomes[cacheKey] &&
    MapCache.biomes[cacheKey].generationVersion === TERRAIN_GENERATION_VERSION
  ) {
    return MapCache.biomes[cacheKey];
  }

  MapCache.biomes[cacheKey] = {
    ...getBiomeDefinition(currentBiome),
    cacheKey,
    caveZone: normalizeCaveZone(currentBiome, caveZone),
    generationVersion: TERRAIN_GENERATION_VERSION,
    bounds: {
      minX: -getBiomeBoundary(currentBiome),
      maxX: getBiomeBoundary(currentBiome),
      minZ: -getBiomeBoundary(currentBiome),
      maxZ: getBiomeBoundary(currentBiome),
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

  const chunk = generateBiomeChunk(currentBiome, cx, cz, caveZone);

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

export function getBiomeMap(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
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
    caveZone: normalizeCaveZone(currentBiome, caveZone),
    blockCount,
    chunkCount,
    counts: { ...counts },
    isCached: chunkCount > 0,
  };
}

export function getRawTerrainSurfaceY(x, z, caveZone = CAVE_ZONES.EXTERIOR) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);

  return getBiomeSurfaceY(tileIndexX, tileIndexZ, activeBiome, caveZone);
}

export function getBiomeValue(x, z) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const value =
    Math.sin(tileIndexX * 0.045 + 12.3) * 0.35 +
    Math.cos(tileIndexZ * 0.052 - 3.1) * 0.35 +
    seededRandom(tileIndexX, tileIndexZ, activeBiome) * 0.3;

  return Math.max(0, Math.min(1, value * 0.5 + 0.5));
}

export function getBiomeForTile() {
  return getBiomeDefinition(activeBiome).biome;
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
  const { cx, cz } = getChunkCoordsForTile(tileIndexX, tileIndexZ);

  ensureBiomeChunk(currentBiome, cx, cz, caveZone);

  const biomeMap = generateBiomeMap(currentBiome, caveZone);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.surfaceY : WATER_LEVEL;
}

export function isWaterTile(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const { cx, cz } = getChunkCoordsForTile(tileIndexX, tileIndexZ);

  ensureBiomeChunk(currentBiome, cx, cz, caveZone);

  const biomeMap = generateBiomeMap(currentBiome, caveZone);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.isWater || tile.isVoid : true;
}

export function getTerrainBlockCenterY(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome, caveZone);
  const height = isWaterTile(x, z, currentBiome, caveZone)
    ? WATER_BLOCK_HEIGHT
    : BLOCK_HEIGHT;

  return surfaceY - height / 2;
}

export function getEntityY(
  x,
  z,
  entityHeight,
  previousY = undefined,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome, caveZone);

  if (!Number.isFinite(surfaceY)) {
    return Number.isFinite(previousY) ? previousY : entityHeight / 2;
  }

  return surfaceY + entityHeight / 2 + ENTITY_FOOT_CLEARANCE;
}

export function isInsideWorld(
  x = 0,
  z = 0,
  radius = 0,
  currentBiome = activeBiome
) {
  const boundary = getBiomeBoundary(currentBiome);

  return (
    x >= -boundary + radius &&
    x <= boundary - radius &&
    z >= -boundary + radius &&
    z <= boundary - radius
  );
}

export function isWaterCollision(
  x,
  z,
  radius = PLAYER_RADIUS,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const minX = snapToVoxel(x - radius);
  const maxX = snapToVoxel(x + radius);
  const minZ = snapToVoxel(z - radius);
  const maxZ = snapToVoxel(z + radius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      if (isWaterTile(tileX, tileZ, currentBiome, caveZone)) {
        return true;
      }
    }
  }

  return false;
}

export function isLegendaryCollision(
  x = 0,
  z = 0,
  radius = PLAYER_RADIUS,
  currentBiome = activeBiome
) {
  if (currentBiome !== ICY_BIOME_ID) {
    return false;
  }

  return getIceRoomLandmarks().some((room) => {
    const [guardianX, , guardianZ] = room.guardianPosition;

    return (
      Math.hypot(x - guardianX, z - guardianZ) <
      KYUREM_GUARDIAN_RADIUS + radius
    );
  });
}

export const isLandmarkCollision = isLegendaryCollision;

export function isWalkablePosition(
  x,
  z,
  radius = PLAYER_RADIUS,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return (
    isInsideWorld(x, z, radius, currentBiome) &&
    !isWaterCollision(x, z, radius, currentBiome, caveZone) &&
    !isLegendaryCollision(x, z, radius, currentBiome)
  );
}

function isSafeSpawnTile(
  x,
  z,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const center = getGeneratedTileInfoAtWorld(x, z, currentBiome, caveZone);
  const centerY = center.surfaceY;

  if (
      !Number.isFinite(centerY) ||
      center.isVoid ||
      centerY <= WATER_LEVEL ||
      center.isWater ||
    isLegendaryCollision(x, z, PLAYER_RADIUS, currentBiome) ||
    !isInsideWorld(x, z, PLAYER_RADIUS, currentBiome)
  ) {
    return false;
  }

  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
      const sampleX = x + offsetX * VOXEL_SIZE;
      const sampleZ = z + offsetZ * VOXEL_SIZE;
      const sample = getGeneratedTileInfoAtWorld(
        sampleX,
        sampleZ,
        currentBiome,
        caveZone
      );
      const sampleY = sample.surfaceY;

      if (
        !Number.isFinite(sampleY) ||
        sample.isWater ||
        Math.abs(sampleY - centerY) > VOXEL_SIZE
      ) {
        return false;
      }
    }
  }

  return true;
}

export function clampToWorld(value, radius = 0, currentBiome = activeBiome) {
  const boundary = getBiomeBoundary(currentBiome);

  return Math.max(
    -boundary + radius,
    Math.min(boundary - radius, value)
  );
}

export function getSafeSpawnPosition({
  centerX = 0,
  centerZ = 0,
  entityHeight = PLAYER_HEIGHT,
  lift = 2,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR,
} = {}) {
  const { cx, cz } = getChunkCoordsForPosition(centerX, centerZ);

  const searchChunks = getBiomeChunksAround(
    currentBiome,
    cx,
    cz,
    Math.min(2, getBiomeRenderDistance(currentBiome)),
    caveZone
  );
  const candidates = [];

  searchChunks
    .flatMap((chunk) => [...chunk.heightLookup.entries()])
    .forEach(([key, tile]) => {
        if (tile.isVoid || tile.isWater || !Number.isFinite(tile.surfaceY) || tile.surfaceY <= WATER_LEVEL) {
        return;
      }

      const [x, z] = key.split(':').map(Number);

      if (!isSafeSpawnTile(x, z, currentBiome, caveZone)) {
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
  entityHeight = PLAYER_HEIGHT,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  if (
    currentBiome === CAVE_BIOME_ID &&
    caveZone === CAVE_ZONES.INTERIOR
  ) {
    return getSafeSpawnPosition({
      centerX: CAVE_INTERIOR_SPAWN[0],
      centerZ: CAVE_INTERIOR_SPAWN[2],
      currentBiome,
      caveZone,
      entityHeight,
      lift: entityHeight / 2 + ENTITY_FOOT_CLEARANCE,
    });
  }

  return getSafeSpawnPosition({
    centerX: 0,
    centerZ:
      currentBiome === CAVE_BIOME_ID ? CAVE_ENTRANCE_POSITION[2] + 8 : 0,
    currentBiome,
    caveZone,
    entityHeight,
    lift: entityHeight / 2 + ENTITY_FOOT_CLEARANCE,
  });
}

export function getBiomeLandmarks() {
  return [];
}

export const PLAYER_START = [0, 10, 0];

export function getRandomGrassPosition(
  radius = 0.45,
  entityHeight = 1,
  centerX = PLAYER_START[0],
  centerZ = PLAYER_START[2],
  spawnRadius = 7,
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  for (let attempts = 0; attempts < 120; attempts += 1) {
    const x = getTileCoord(centerX + Math.random() * spawnRadius * 2 - spawnRadius);
    const z = getTileCoord(centerZ + Math.random() * spawnRadius * 2 - spawnRadius);

    if (isWalkablePosition(x, z, radius, currentBiome, caveZone)) {
      return [
        x,
        getEntityY(x, z, entityHeight, undefined, currentBiome, caveZone),
        z,
      ];
    }
  }

  return getSafeSpawnPosition({
    centerX,
    centerZ,
    entityHeight,
    currentBiome,
    caveZone,
  });
}

export function generateStaticPathData(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
}

export function ensurePathInCache(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
}

export function preloadPath(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
}

export function getPathMap(
  currentBiome = activeBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  return generateBiomeMap(currentBiome, caveZone);
}

