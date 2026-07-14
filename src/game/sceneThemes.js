/** Scene lighting/fog themes ported from Pixelmon-master App.jsx */

export const BIOME_SCENE_THEMES = {
  cave: {
    background: "#1d2428",
    fog: "#2f3538",
    fogNear: 25,
    fogFar: 150,
    ambient: 0.48,
    sun: 0.85,
  },
  cave_interior: {
    background: "#081018",
    fog: "#101a24",
    fogNear: 4,
    fogFar: 55,
    ambient: 0.18,
    sun: 0.15,
  },
  moonlit: {
    background: "#071126",
    fog: "#0f1834",
    fogNear: 16,
    fogFar: 105,
    ambient: 0.34,
    sun: 0.18,
  },
  crystal_blossom: {
    background: "#071126",
    fog: "#0f1834",
    fogNear: 16,
    fogFar: 105,
    ambient: 0.34,
    sun: 0.18,
  },
  desert: {
    background: "#9ed8f2",
    fog: "#e7d8b3",
    fogNear: 45,
    fogFar: 240,
    ambient: 0.76,
    sun: 1.38,
  },
  distortion: {
    background: "#03020b",
    fog: "#160829",
    fogNear: 10,
    fogFar: 82,
    ambient: 0.26,
    sun: 0.08,
  },
  grass: {
    background: "#87ceeb",
    fog: "#d8eefb",
    fogNear: 60,
    fogFar: 320,
    ambient: 0.72,
    sun: 1.35,
  },
  grassland: {
    background: "#87ceeb",
    fog: "#d8eefb",
    fogNear: 60,
    fogFar: 320,
    ambient: 0.72,
    sun: 1.35,
  },
  plains: {
    background: "#9fd0ef",
    fog: "#c5e4f8",
    fogNear: 60,
    fogFar: 280,
    ambient: 0.72,
    sun: 1.35,
  },
  icy: {
    background: "#d9edf8",
    fog: "#eaf7ff",
    fogNear: 35,
    fogFar: 210,
    ambient: 0.82,
    sun: 1.05,
  },
  snow: {
    background: "#d9edf8",
    fog: "#eaf7ff",
    fogNear: 35,
    fogFar: 210,
    ambient: 0.82,
    sun: 1.05,
  },
  mountain: {
    background: "#b8d4e8",
    fog: "#dceaf5",
    fogNear: 40,
    fogFar: 220,
    ambient: 0.78,
    sun: 1.1,
  },
  mossy: {
    background: "#8bc8d7",
    fog: "#c6e5d9",
    fogNear: 48,
    fogFar: 250,
    ambient: 0.68,
    sun: 1.18,
  },
  coastal: {
    background: "#92c8d8",
    fog: "#d5ddc8",
    fogNear: 48,
    fogFar: 260,
    ambient: 0.68,
    sun: 1.18,
  },
  mire: {
    background: "#4c3433",
    fog: "#6a3d35",
    fogNear: 32,
    fogFar: 190,
    ambient: 0.44,
    sun: 0.92,
  },
  ruins: {
    background: "#92c8d8",
    fog: "#d5ddc8",
    fogNear: 48,
    fogFar: 260,
    ambient: 0.68,
    sun: 1.18,
  },
  sky: {
    background: "#8fc6ff",
    fog: "#dff5ff",
    fogNear: 20,
    fogFar: 120,
    ambient: 0.88,
    sun: 1.28,
  },
  tropical: {
    background: "#8fc6ff",
    fog: "#dff5ff",
    fogNear: 20,
    fogFar: 120,
    ambient: 0.88,
    sun: 1.28,
  },
  volcanic: {
    background: "#4c3433",
    fog: "#6a3d35",
    fogNear: 32,
    fogFar: 190,
    ambient: 0.44,
    sun: 0.92,
  },
  fantasy: {
    background: "#6b4fa8",
    fog: "#9a7fd4",
    fogNear: 30,
    fogFar: 180,
    ambient: 0.65,
    sun: 1.0,
  },
  village: {
    background: "#a8d4a0",
    fog: "#d4ecd0",
    fogNear: 50,
    fogFar: 260,
    ambient: 0.75,
    sun: 1.2,
  },
  ice_room: {
    background: "#07111c",
    fog: "#0b1724",
    fogNear: 3,
    fogFar: 34,
    ambient: 0.2,
    sun: 0.08,
  },
};

const TERRAIN_TO_THEME = {
  grassland: "grassland",
  desert: "desert",
  snow: "snow",
  coastal: "coastal",
  mire: "volcanic",
  mountain: "mountain",
  tropical: "sky",
  highlands: "distortion",
  village: "village",
  fantasy: "fantasy",
};

const FANTASY_BIOME_THEME = {
  volcanic: "volcanic",
  cave: "cave",
  icy: "icy",
  moonlit: "moonlit",
  sky: "sky",
  distortion: "distortion",
  grass: "grass",
  desert: "desert",
};

export function resolveSceneTheme({
  terrainType = "grassland",
  fantasyBiome = null,
  caveZone = "exterior",
  iceRoomId = null,
} = {}) {
  if (iceRoomId) {
    return BIOME_SCENE_THEMES.ice_room;
  }

  if (fantasyBiome === "cave" && caveZone === "interior") {
    return BIOME_SCENE_THEMES.cave_interior;
  }

  if (fantasyBiome && FANTASY_BIOME_THEME[fantasyBiome]) {
    return BIOME_SCENE_THEMES[FANTASY_BIOME_THEME[fantasyBiome]];
  }

  const key = TERRAIN_TO_THEME[terrainType] || terrainType;
  return BIOME_SCENE_THEMES[key] || BIOME_SCENE_THEMES.grassland;
}
