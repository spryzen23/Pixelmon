export const VILLAGE_GLB_URL =
  "/assets/idea_glbs/small_time_town__village_asset_pack.glb";

export const VILLAGE_BIOME_ID = 7;

/** glTF-space center of the authored village (from inspect-village-glb). */
export const VILLAGE_GLB_CENTER = [-5.23, 0, 0];

export const VILLAGE_SCENE_ANCHOR = { x: 0, z: -22 };

/** 77 glTF units → ~26 world units */
export const VILLAGE_SCENE_SCALE = 0.34;

export const VILLAGE_COLLISION = {
  small: 0.35,
  plant: 0.5,
  tree: 1.1,
  rock: 0.7,
  fence: 0.4,
  prop: 0.6,
  house: 2.4,
  building: 2.8,
  ground: 0.2,
};

/** Logical prop key → GLB archetype node name and spawn metadata. */
export const VILLAGE_PROP_DEFS = {
  barn: {
    nodeName: "Barn",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.building,
  },
  chapel: {
    nodeName: "Chapel",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.building,
  },
  house_red: {
    nodeName: "House_Red",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.house,
  },
  house_blue: {
    nodeName: "House_Blue",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.house,
  },
  house_purple: {
    nodeName: "House_Purple",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.house,
  },
  house_2story_purple: {
    nodeName: "House_2Story_Purple",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.building,
  },
  market_stall_red: {
    nodeName: "Market Stall Red",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.house,
  },
  market_stall_blue: {
    nodeName: "Market Stall Blue",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.house,
  },
  windmill: {
    nodeName: "Windmill",
    category: "building",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.building,
  },
  well: {
    nodeName: "Well",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.prop,
  },
  fountain: {
    nodeName: "Fountain",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.prop,
  },
  tree_pine: {
    nodeName: "Tree_Pine",
    category: "tree",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.tree,
  },
  tree_tall: {
    nodeName: "Tree_Tall",
    category: "tree",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.tree,
  },
  tree_square: {
    nodeName: "Tree_Square",
    category: "tree",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.tree,
  },
  daisy: {
    nodeName: "Daisy",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.plant,
  },
  shroom: {
    nodeName: "Shroom",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  farm_cabbage: {
    nodeName: "Farm_Cabbage",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  farm_carrot: {
    nodeName: "Farm_Carrot",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  farm_wheat: {
    nodeName: "Farm_Wheat",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  potted_bush: {
    nodeName: "Potted_Bush",
    category: "plant",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.plant,
  },
  fence: {
    nodeName: "Fence",
    category: "fence",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.fence,
  },
  stone_path: {
    nodeName: "StonePath",
    category: "ground",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.ground,
  },
  boulder: {
    nodeName: "Boulder",
    category: "rock",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.rock,
  },
  bench: {
    nodeName: "Bench",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.prop,
  },
  barrel: {
    nodeName: "Barrell",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  crate: {
    nodeName: "Crate",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
  hay_bale: {
    nodeName: "Hay_Bale",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.prop,
  },
  streetlight: {
    nodeName: "Streetlight",
    category: "prop",
    defaultScale: 0.34,
    collisionRadius: VILLAGE_COLLISION.small,
  },
};

const CATEGORY_VARIANTS = Object.entries(VILLAGE_PROP_DEFS).reduce(
  (acc, [key, def]) => {
    if (!acc[def.category]) {
      acc[def.category] = [];
    }

    acc[def.category].push(key);
    return acc;
  },
  {}
);

export function getVillagePropDef(propKey) {
  return VILLAGE_PROP_DEFS[propKey] || null;
}

export function getVillagePropVariants(category) {
  return CATEGORY_VARIANTS[category] || [];
}

export function pickVillagePropVariant(category, roll) {
  const variants = getVillagePropVariants(category);

  if (variants.length === 0) {
    return null;
  }

  const index = Math.floor(roll * variants.length) % variants.length;

  return variants[index];
}

export function isVillageNodeAllowed(nodeName) {
  if (!nodeName) {
    return false;
  }

  if (
    nodeName.includes("_Material") ||
    nodeName.startsWith("Object_") ||
    nodeName.startsWith("Sketchfab") ||
    nodeName === "RootNode" ||
    nodeName === "World"
  ) {
    return false;
  }

  if (/^(Cube|Cylinder|Plane|Sphere|Tile)\b/.test(nodeName)) {
    return false;
  }

  if (/\.fbx$/i.test(nodeName)) {
    return false;
  }

  return true;
}

export function getVillageArchetypeNodeNames() {
  return Object.values(VILLAGE_PROP_DEFS).map((def) => def.nodeName);
}

export function getVillageScenePosition(surfaceY) {
  const [centerX, , centerZ] = VILLAGE_GLB_CENTER;
  const scale = VILLAGE_SCENE_SCALE;

  return {
    x: VILLAGE_SCENE_ANCHOR.x - centerX * scale,
    y: surfaceY,
    z: VILLAGE_SCENE_ANCHOR.z - centerZ * scale,
    scale,
  };
}
