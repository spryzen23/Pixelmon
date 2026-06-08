import plantsManifest from './plantsManifest.json';

export const PLANTS_BASE_URL = '/assets/plants';

export const PLANT_COLLISION = {
  tree: 1.1,
  pine: 1.1,
  plant: 0.5,
  rock: 0.4,
  desert_large: 1.2,
  desert_rock: 0.85,
  desert_scatter: 0.45,
};

export const PLANT_PROP_DEFS = Object.fromEntries(
  plantsManifest.plants.map((entry) => [
    entry.id,
    {
      nodeName: entry.nodeName,
      file: entry.file,
      category: entry.category,
      biomes: entry.biomes,
      defaultScale: entry.defaultScale,
      collisionRadius: entry.collisionRadius,
      glbUrl: `${PLANTS_BASE_URL}/${entry.file}`,
    },
  ])
);

const CATEGORY_VARIANTS = Object.entries(PLANT_PROP_DEFS).reduce((acc, [key, def]) => {
  if (!acc[def.category]) {
    acc[def.category] = [];
  }

  acc[def.category].push(key);
  return acc;
}, {});

export function getPlantPropDef(propKey) {
  return PLANT_PROP_DEFS[propKey] || null;
}

export function getPlantPropVariants(category, biomeId) {
  const keys = CATEGORY_VARIANTS[category] || [];

  return keys.filter((key) => {
    const def = PLANT_PROP_DEFS[key];

    return def && def.biomes.includes(biomeId);
  });
}

export function pickPlantPropVariant(category, biomeId, roll) {
  const variants = getPlantPropVariants(category, biomeId);

  if (variants.length === 0) {
    return null;
  }

  const index = Math.floor(roll * variants.length) % variants.length;

  return variants[index];
}

export function getPlantManifestEntries() {
  return plantsManifest.plants;
}

export function getUniquePlantGlbFiles() {
  const files = new Set();

  Object.values(PLANT_PROP_DEFS).forEach((def) => {
    files.add(def.file);
  });

  return [...files];
}
