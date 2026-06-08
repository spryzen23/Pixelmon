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

export function getFitToHeightForPokemon(pokemon) {
  if (!pokemon) return 1.1;
  
  const speciesOverrides = {
    1: 0.95,  // Bulbasaur (medium starter size)
    2: 1.15,  // Ivysaur
    3: 1.45,  // Venusaur (large fully evolved size)
    4: 0.90,  // Charmander
    5: 1.15,  // Charmeleon
    6: 1.50,  // Charizard
    7: 0.90,  // Squirtle
    8: 1.15,  // Wartortle
    9: 1.45,  // Blastoise
    10: 0.65, // Caterpie (small bug size, but clearly visible)
    11: 0.85, // Metapod
    12: 1.15, // Butterfree
    13: 0.65, // Weedle
    14: 0.85, // Kakuna
    15: 1.20, // Beedrill
    16: 0.70, // Pidgey
    17: 0.95, // Pidgeotto
    18: 1.35, // Pidgeot
    19: 0.70, // Rattata
    20: 1.05, // Raticate
    21: 0.70, // Spearow
    22: 1.30, // Fearow
    23: 0.75, // Ekans
    24: 1.25, // Arbok
    25: 0.75, // Pikachu
    26: 1.10, // Raichu
  };
  
  if (speciesOverrides[pokemon.speciesId] !== undefined) {
    return speciesOverrides[pokemon.speciesId];
  }
  
  if (pokemon.isLegendary) {
    return 1.65;
  }
  
  const stage = pokemon.evolutionStage || 1;
  if (stage === 1) {
    return 0.90;
  } else if (stage === 2) {
    return 1.15;
  } else {
    return 1.45;
  }
}

export function isPokemonFloating(pokemon) {
  if (!pokemon) return false;
  const floatingTypes = ['flying', 'ghost', 'psychic'];
  return pokemon.types?.some(t => floatingTypes.includes(t.toLowerCase())) || false;
}

export function getRotationForPokemon(pokemon) {
  if (!pokemon || !pokemon.modelUrl || pokemon.modelUrl.includes('assets/companion.glb')) {
    return [0, 0, 0];
  }
  return [0, Math.PI, 0];
}

