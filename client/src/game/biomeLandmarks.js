import { VOXEL_SIZE } from './world';

export {
  VOXEL_SIZE,
  getTerrainSurfaceY,
  SKY_BIOME_ID,
  DISTORTION_BIOME_ID,
  CAVE_ZONES,
  CAVE_BIOME_ID,
} from './world';

export const VOLCANO_CENTER_X = 0;
export const VOLCANO_CENTER_Z = -42;
export const VOLCANO_RIM_Y = VOXEL_SIZE * 24;
export const VOLCANO_LAVA_Y = VOXEL_SIZE * 17;
export const MOONLIT_BIOME_ID = 3;
export const ICY_BIOME_ID = 5;
export const SKY_ISLAND_RADIUS_TILES = 42;
export const SKY_ISLAND_EDGE_FADE_TILES = 9;
export const SKY_ISLAND_BASE_Y = VOXEL_SIZE * 7;
export const CAVE_ENTRANCE_POSITION = [0, VOXEL_SIZE, -9];
export const CAVE_ENTRANCE_RADIUS = 2.1;
export const CAVE_INTERIOR_SPAWN = [0, 0, 8];
export const ICY_MOUNTAIN_CENTER_X = 0;
export const ICY_MOUNTAIN_CENTER_Z = -54;
export const ICY_MOUNTAIN_BASE_RADIUS_TILES = 96;
export const ICY_MOUNTAIN_PATH_WIDTH_TILES = 4.2;
export const KYUREM_GUARDIAN_RADIUS = 1.35;
export const ICE_ROOM_INTERIOR_EXIT_RADIUS = 1.4;

export const ICE_ROOM_DEFINITIONS = [
  {
    id: 'black',
    assetUrl: '/assets/Frostpine Pass/legendary/black_kyurem.glb',
    chamberCenter: [42, 0, -35],
    entranceCenter: [38.25, 0, -36.75],
    guardianPosition: [42, 0, -35],
    modelRotation: [0, Math.PI, 0],
    modelScale: 0.42,
  },
  {
    id: 'white',
    assetUrl: '/assets/Frostpine Pass/legendary/white_kyurem.glb',
    chamberCenter: [-27, 0, -31.5],
    entranceCenter: [-23.25, 0, -34.5],
    guardianPosition: [-27, 0, -31.5],
    modelRotation: [0, 0, 0],
    modelScale: 0.42,
  },
];

export function getVolcanoPrimalPosition() {
  return [VOLCANO_CENTER_X, VOLCANO_LAVA_Y, VOLCANO_CENTER_Z];
}

export function getIceRoomById(roomId) {
  return ICE_ROOM_DEFINITIONS.find((room) => room.id === roomId) || null;
}

export function getIceRoomLandmarks() {
  return ICE_ROOM_DEFINITIONS.map((room) => ({
    id: room.id,
    entranceCenter: room.entranceCenter,
    chamberCenter: room.chamberCenter,
  }));
}

export function getIceRoomInteriorExitPosition(roomId) {
  const room = getIceRoomById(roomId);
  return room?.entranceCenter || [0, 0, 0];
}

export function getIceRoomSpawnPosition(roomId) {
  const room = getIceRoomById(roomId);
  return room?.chamberCenter || [0, 0, 0];
}

export function getIceRoomExitSpawnPosition(roomId) {
  return getIceRoomInteriorExitPosition(roomId);
}
