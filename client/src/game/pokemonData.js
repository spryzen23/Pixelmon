import regionalBiomesData from './data/regionalBiomes.json';
import typeAnimationCatalogData from './data/typeAnimationCatalog.json';

export const REGIONAL_BIOMES = regionalBiomesData;
export const TYPE_ANIMATION_CATALOG = typeAnimationCatalogData;

const PATH_TO_REGION = regionalBiomesData.pathToRegion || {};

export function getRegionForPath(pathId) {
  return PATH_TO_REGION[String(pathId)] || PATH_TO_REGION[pathId] || 'kanto';
}

export function getRegionalBiome(dexId) {
  return regionalBiomesData.assignments[String(dexId)] || null;
}

export function getRegionalBiomeForDex(dexId) {
  return getRegionalBiome(dexId);
}

export function getPokemonForRegion() {
  return [];
}

export function getTypeAnimProfile(primaryType) {
  const type = String(primaryType || 'normal').toLowerCase();
  return (
    typeAnimationCatalogData.types.find((entry) => entry.type === type) ||
    typeAnimationCatalogData.types.find((entry) => entry.type === 'normal')
  );
}

export function getPathEggGroups(pathId) {
  const groupsByPath = {
    0: ['field', 'grass'],
    1: ['field', 'mineral'],
    2: ['water1', 'water2', 'bug'],
    3: ['water1', 'flying'],
    4: ['bug', 'plant'],
    5: ['monster', 'dragon'],
    6: ['fairy', 'human-like'],
    7: ['human-like', 'field'],
  };
  return groupsByPath[pathId] || groupsByPath[0];
}

export function preloadRegionModels() {
  return [];
}
