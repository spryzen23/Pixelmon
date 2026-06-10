const BASE_URL = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';
const EVOL_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const POKEMON3D_API = '/api/pokemon-3d';

export const fetchAllPokemon3DData = async () => {
  try {
    const response = await fetch(POKEMON3D_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch 3D models: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching all 3D Pokémon data:', error);
    throw error;
  }
};

export const getPokemonByNameOrId = async (nameOrId) => {
  try {
    const cleanNameOrId = String(nameOrId).toLowerCase().trim();
    const response = await fetch(`${BASE_URL}/${cleanNameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch stats for ${nameOrId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Error fetching Pokémon data for ${nameOrId}:`, error.message);
    throw error;
  }
};

export const getPokemonStats = async (nameOrId) => {
  try {
    const pokemonData = await getPokemonByNameOrId(nameOrId);
    return {
      name: pokemonData.name,
      id: pokemonData.id,
      weight: pokemonData.weight,
      height: pokemonData.height,
      spriteUrl: pokemonData.sprites.front_default,
      types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
      stats: {
        hp: pokemonData.stats[0].base_stat,
        attack: pokemonData.stats[1].base_stat,
        defense: pokemonData.stats[2].base_stat,
        specialAttack: pokemonData.stats[3].base_stat,
        specialDefense: pokemonData.stats[4].base_stat,
        speed: pokemonData.stats[5].base_stat,
      },
    };
  } catch (error) {
    console.error(`❌ Error parsing Pokémon stats for ${nameOrId}:`, error.message);
    throw error;
  }
};

export const getPokemonTypes = async (nameOrId) => {
  try {
    const pokemonData = await getPokemonByNameOrId(nameOrId);
    return pokemonData.types.map((typeInfo) => ({
      name: typeInfo.type.name,
    }));
  } catch (error) {
    console.error(`❌ Error fetching Pokémon types for ${nameOrId}:`, error.message);
    throw error;
  }
};

export const getPokemonSpecies = async (name) => {
  try {
    const cleanName = String(name).toLowerCase().trim();
    const response = await fetch(`${EVOL_URL}/${cleanName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch species data for ${name}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching Pokémon species data for ${name}:`, error.message);
    throw error;
  }
};

export const getEvolutionChain = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain from ${url}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Error fetching evolution chain from ${url}:`, error.message);
    throw error;
  }
};

const parseEvolutionChain = (chain) => {
  const evolutions = [];
  const traverseChain = (node) => {
    evolutions.push({
      name: node.species.name,
      url: node.species.url,
    });
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(traverseChain);
    }
  };
  traverseChain(chain);
  return evolutions;
};

export const getPokemonEvolutionChain = async (name) => {
  try {
    const species = await getPokemonSpecies(name);
    const evolutionChainData = await getEvolutionChain(species.evolution_chain.url);
    return parseEvolutionChain(evolutionChainData.chain);
  } catch (error) {
    console.error(`❌ Error fetching evolution chain for ${name}:`, error.message);
    throw error;
  }
};
