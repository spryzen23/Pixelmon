export const WORLD_SIZE = 21;
export const WORLD_HALF = Math.floor(WORLD_SIZE / 2);
export const TERRAIN_RADIUS = 15;
export const VOXEL_SIZE = 0.75;
export const BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_SURFACE_Y = -VOXEL_SIZE;
export const WATER_LEVEL = WATER_SURFACE_Y;
export const ENTITY_FOOT_CLEARANCE = 0.025;
export const PLAYER_HEIGHT = 1;
export const PLAYER_RADIUS = 0.38;
export const COMPANION_HEIGHT = 0.8;
export const WILD_CREATURE_HEIGHT = 0.8;
export const TREE_RADIUS = 0.58;
export const CACTUS_RADIUS = 0.45;
export const BIOMES = {
  DESERT: 'desert',
  PLAINS: 'plains',
  SNOW: 'snow',
};

const ORIGIN_WATER_COORDS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [0, 2],
];

const GRID_EPSILON = 0.000001;

const ORIGIN_WATER_KEYS = new Set(
  ORIGIN_WATER_COORDS.map(([x, z]) =>
    toTileKey(x * VOXEL_SIZE, z * VOXEL_SIZE)
  )
);

export function snapToVoxel(value) {
  const snapped = Math.floor((value + GRID_EPSILON) / VOXEL_SIZE) * VOXEL_SIZE;

  return Number(snapped.toFixed(6));
}

export function getVoxelIndex(value) {
  return Math.floor((value + GRID_EPSILON) / VOXEL_SIZE);
}

export function toTileKey(x, z) {
  return `${snapToVoxel(x)}:${snapToVoxel(z)}`;
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

function seededRandom(x, z = 0) {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;

  return value - Math.floor(value);
}

function isNearInitialSpawn(x, z) {
  return Math.hypot(x + 7, z + 7) < 4;
}

function getLakeNoise(x, z) {
  return (
    Math.sin(x * 0.21) * 0.7 +
    Math.cos(z * 0.18) * 0.65 +
    Math.sin((x + z) * 0.11) * 0.55 +
    Math.cos((x - z) * 0.08) * 0.4
  );
}

export function getBiomeValue(x, z) {
  const { gridX: tileX, gridZ: tileZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(tileX);
  const tileIndexZ = getVoxelIndex(tileZ);
  const biomeNoise =
    Math.sin(tileIndexX * 0.045 + 12.3) * 0.35 +
    Math.cos(tileIndexZ * 0.052 - 3.1) * 0.35 +
    Math.sin((tileIndexX + tileIndexZ) * 0.029) * 0.2 +
    seededRandom(Math.floor(tileIndexX / 8), Math.floor(tileIndexZ / 8)) * 0.1;

  return Math.max(0, Math.min(1, biomeNoise * 0.5 + 0.5));
}

export function getBiomeForTile(x, z) {
  const value = getBiomeValue(x, z);

  if (value < 0.33) {
    return BIOMES.DESERT;
  }

  if (value > 0.66) {
    return BIOMES.SNOW;
  }

  return BIOMES.PLAINS;
}

export function isWaterTile(x, z) {
  const { gridX: tileX, gridZ: tileZ } = worldToGrid(x, z);

  if (ORIGIN_WATER_KEYS.has(toTileKey(tileX, tileZ))) {
    return true;
  }

  if (isNearInitialSpawn(tileX, tileZ)) {
    return false;
  }

  return getLakeNoise(tileX, tileZ) < -1.45 && seededRandom(tileX, tileZ) > 0.22;
}

export function isTreeTile(x, z) {
  const { gridX: tileX, gridZ: tileZ } = worldToGrid(x, z);
  const biome = getBiomeForTile(tileX, tileZ);

  if (
    isNearInitialSpawn(tileX, tileZ) ||
    isWaterTile(tileX, tileZ) ||
    biome === BIOMES.DESERT
  ) {
    return false;
  }

  const treeChance = seededRandom(tileX + 19.2, tileZ - 4.7);
  const spacingNoise = seededRandom(Math.floor(tileX / 2), Math.floor(tileZ / 2));

  return treeChance > (biome === BIOMES.SNOW ? 0.972 : 0.965) && spacingNoise > 0.45;
}

export function isCactusTile(x, z) {
  const { gridX: tileX, gridZ: tileZ } = worldToGrid(x, z);

  if (
    isNearInitialSpawn(tileX, tileZ) ||
    isWaterTile(tileX, tileZ) ||
    getBiomeForTile(tileX, tileZ) !== BIOMES.DESERT
  ) {
    return false;
  }

  return seededRandom(tileX - 8.8, tileZ + 21.4) > 0.975;
}

export function getTerrainSurfaceY(x, z) {
  const { gridX: tileX, gridZ: tileZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(tileX);
  const tileIndexZ = getVoxelIndex(tileZ);

  if (isWaterTile(tileX, tileZ)) {
    return WATER_SURFACE_Y;
  }

  const rollingHill =
    Math.sin(tileIndexX * 0.45) * 0.45 +
    Math.cos(tileIndexZ * 0.35) * 0.35 +
    Math.sin((tileIndexX + tileIndexZ) * 0.22) * 0.25 +
    Math.cos((tileIndexX - tileIndexZ) * 0.13) * 0.18;

  return Math.round(rollingHill) * VOXEL_SIZE;
}

export function getTerrainBlockCenterY(x, z) {
  const surfaceY = getTerrainSurfaceY(x, z);
  const height = isWaterTile(x, z) ? WATER_BLOCK_HEIGHT : BLOCK_HEIGHT;

  return surfaceY - height / 2;
}

export function getEntityY(x, z, entityHeight, previousY = undefined) {
  const surfaceY = getTerrainSurfaceY(x, z);

  if (!Number.isFinite(surfaceY)) {
    return Number.isFinite(previousY) ? previousY : entityHeight / 2;
  }

  return surfaceY + entityHeight / 2 + ENTITY_FOOT_CLEARANCE;
}

const PLAYER_START_X = getTileCoord(-7);
const PLAYER_START_Z = getTileCoord(-7);

export const PLAYER_START = [
  PLAYER_START_X,
  getEntityY(PLAYER_START_X, PLAYER_START_Z, PLAYER_HEIGHT),
  PLAYER_START_Z,
];

export function isInsideWorld() {
  return true;
}

export function isWaterCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = snapToVoxel(x - radius - VOXEL_SIZE);
  const maxX = snapToVoxel(x + radius + VOXEL_SIZE);
  const minZ = snapToVoxel(z - radius - VOXEL_SIZE);
  const maxZ = snapToVoxel(z + radius + VOXEL_SIZE);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    const snappedX = snapToVoxel(tileX);

    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      const snappedZ = snapToVoxel(tileZ);

      if (
        isWaterTile(snappedX, snappedZ) &&
        Math.abs(x - snappedX) < VOXEL_SIZE / 2 + radius &&
        Math.abs(z - snappedZ) < VOXEL_SIZE / 2 + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isTreeCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = snapToVoxel(x - TREE_RADIUS - radius);
  const maxX = snapToVoxel(x + TREE_RADIUS + radius);
  const minZ = snapToVoxel(z - TREE_RADIUS - radius);
  const maxZ = snapToVoxel(z + TREE_RADIUS + radius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    const snappedX = snapToVoxel(tileX);

    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      const snappedZ = snapToVoxel(tileZ);

      if (
        isTreeTile(snappedX, snappedZ) &&
        Math.abs(x - snappedX) < TREE_RADIUS + radius &&
        Math.abs(z - snappedZ) < TREE_RADIUS + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isCactusCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = snapToVoxel(x - CACTUS_RADIUS - radius);
  const maxX = snapToVoxel(x + CACTUS_RADIUS + radius);
  const minZ = snapToVoxel(z - CACTUS_RADIUS - radius);
  const maxZ = snapToVoxel(z + CACTUS_RADIUS + radius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    const snappedX = snapToVoxel(tileX);

    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      const snappedZ = snapToVoxel(tileZ);

      if (
        isCactusTile(snappedX, snappedZ) &&
        Math.abs(x - snappedX) < CACTUS_RADIUS + radius &&
        Math.abs(z - snappedZ) < CACTUS_RADIUS + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isWalkablePosition(x, z, radius = PLAYER_RADIUS) {
  return (
    !isWaterCollision(x, z, radius) &&
    !isTreeCollision(x, z, radius) &&
    !isCactusCollision(x, z, radius)
  );
}

export function clampToWorld(value) {
  return value;
}

export function createTerrainTiles(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const tiles = [];
  const startX = snapToVoxel(centerX - radius);
  const endX = snapToVoxel(centerX + radius);
  const startZ = snapToVoxel(centerZ - radius);
  const endZ = snapToVoxel(centerZ + radius);

  for (
    let x = startX;
    x <= endX + GRID_EPSILON;
    x += VOXEL_SIZE
  ) {
    const tileX = snapToVoxel(x);

    for (
      let z = startZ;
      z <= endZ + GRID_EPSILON;
      z += VOXEL_SIZE
    ) {
      const tileZ = snapToVoxel(z);
      const biome = getBiomeForTile(tileX, tileZ);
      const surfaceY = getTerrainSurfaceY(tileX, tileZ);
      const isWater = isWaterTile(tileX, tileZ);

      if (isWater || surfaceY < WATER_LEVEL) {
        for (
          let topY = WATER_LEVEL;
          topY >= surfaceY - GRID_EPSILON;
          topY -= VOXEL_SIZE
        ) {
          const snappedTopY = snapToVoxel(topY);

          tiles.push({
            key: `${toTileKey(tileX, tileZ)}:water:${snappedTopY}`,
            x: tileX,
            z: tileZ,
            biome,
            height: WATER_BLOCK_HEIGHT,
            type: 'water',
            surfaceY: WATER_LEVEL,
            centerY: snappedTopY - WATER_BLOCK_HEIGHT / 2,
          });
        }

        continue;
      }

      for (
        let topY = surfaceY;
        topY >= WATER_LEVEL - GRID_EPSILON;
        topY -= VOXEL_SIZE
      ) {
        const snappedTopY = snapToVoxel(topY);
        const type = snappedTopY === surfaceY ? 'surface' : 'dirt';

        tiles.push({
          key: `${toTileKey(tileX, tileZ)}:${type}:${snappedTopY}`,
          x: tileX,
          z: tileZ,
          biome,
          height: BLOCK_HEIGHT,
          type,
          surfaceY,
          centerY: snappedTopY - BLOCK_HEIGHT / 2,
        });
      }
    }
  }

  return tiles;
}

export function createTrees(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const trees = [];
  const startX = snapToVoxel(centerX - radius);
  const endX = snapToVoxel(centerX + radius);
  const startZ = snapToVoxel(centerZ - radius);
  const endZ = snapToVoxel(centerZ + radius);

  for (
    let x = startX;
    x <= endX + GRID_EPSILON;
    x += VOXEL_SIZE
  ) {
    const tileX = snapToVoxel(x);

    for (
      let z = startZ;
      z <= endZ + GRID_EPSILON;
      z += VOXEL_SIZE
    ) {
      const tileZ = snapToVoxel(z);

      if (isTreeTile(tileX, tileZ)) {
        trees.push({
          key: toTileKey(tileX, tileZ),
          x: tileX,
          z: tileZ,
          surfaceY: getTerrainSurfaceY(tileX, tileZ),
        });
      }
    }
  }

  return trees;
}

export function createCacti(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const cacti = [];
  const startX = snapToVoxel(centerX - radius);
  const endX = snapToVoxel(centerX + radius);
  const startZ = snapToVoxel(centerZ - radius);
  const endZ = snapToVoxel(centerZ + radius);

  for (
    let x = startX;
    x <= endX + GRID_EPSILON;
    x += VOXEL_SIZE
  ) {
    const tileX = snapToVoxel(x);

    for (
      let z = startZ;
      z <= endZ + GRID_EPSILON;
      z += VOXEL_SIZE
    ) {
      const tileZ = snapToVoxel(z);

      if (isCactusTile(tileX, tileZ)) {
        cacti.push({
          key: toTileKey(tileX, tileZ),
          x: tileX,
          z: tileZ,
          surfaceY: getTerrainSurfaceY(tileX, tileZ),
        });
      }
    }
  }

  return cacti;
}

export function getRandomGrassPosition(
  radius = 0.45,
  entityHeight = 1,
  centerX = PLAYER_START[0],
  centerZ = PLAYER_START[2],
  spawnRadius = 7
) {
  for (let attempts = 0; attempts < 100; attempts += 1) {
    const x = getTileCoord(centerX + Math.random() * spawnRadius * 2 - spawnRadius);
    const z = getTileCoord(centerZ + Math.random() * spawnRadius * 2 - spawnRadius);

    if (isWalkablePosition(x, z, radius)) {
      return [x, getEntityY(x, z, entityHeight), z];
    }
  }

  const fallbackX = getTileCoord(WORLD_HALF - 2);
  const fallbackZ = getTileCoord(WORLD_HALF - 2);

  return [fallbackX, getEntityY(fallbackX, fallbackZ, entityHeight), fallbackZ];
}
