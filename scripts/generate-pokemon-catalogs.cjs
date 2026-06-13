/**
 * Generates regionalBiomes.json, typeAnimationCatalog.json, spawnCatalog.json
 * from docs/Pokemon-master + public/assets/models/MergedOpt.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POKEMON_JSON =
  fs.existsSync(path.join(ROOT, 'docs/Pokemon-master/src/dataSet/pokemon.json'))
    ? path.join(ROOT, 'docs/Pokemon-master/src/dataSet/pokemon.json')
    : path.join(ROOT, 'public/assets/dataSet/pokemon.json');
const SPECIES_JSON =
  fs.existsSync(path.join(ROOT, 'docs/Pokemon-master/src/dataSet/pokemon-species.json'))
    ? path.join(ROOT, 'docs/Pokemon-master/src/dataSet/pokemon-species.json')
    : path.join(ROOT, 'public/assets/dataSet/pokemon-species.json');
const MERGED_OPT = path.join(ROOT, 'public/assets/models/MergedOpt.json');
const OUT_DIR = path.join(ROOT, 'data/game');
const OUT_DIR_CLIENT = path.join(ROOT, 'src/game/data');

const FORM_BAND_SIZE = 5;

const REGIONS = [
  { id: 'kanto', name: 'Kanto', minDex: 1, maxDex: 151 },
  { id: 'johto', name: 'Johto', minDex: 152, maxDex: 251 },
  { id: 'hoenn', name: 'Hoenn', minDex: 252, maxDex: 386 },
  { id: 'sinnoh', name: 'Sinnoh', minDex: 387, maxDex: 493 },
  { id: 'unova', name: 'Unova', minDex: 494, maxDex: 649 },
  { id: 'kalos', name: 'Kalos', minDex: 650, maxDex: 721 },
  { id: 'alola', name: 'Alola', minDex: 722, maxDex: 809 },
  { id: 'galar', name: 'Galar', minDex: 810, maxDex: 905 },
  { id: 'paldea', name: 'Paldea', minDex: 906, maxDex: 1025 },
];

const TYPE_ANIM_PROFILES = {
  normal: { locomotion: 'quadruped', procedural: { spine: 0.3, tail: 0.2 }, nativeBias: 0.6 },
  fire: { locomotion: 'biped', procedural: { tail: 0.5, spine: 0.3 }, nativeBias: 0.55 },
  water: { locomotion: 'serpent', procedural: { tail: 0.6, spine: 0.4, fin: 0.3 }, nativeBias: 0.5 },
  electric: { locomotion: 'biped', procedural: { tail: 0.4, antenna: 0.5 }, nativeBias: 0.55 },
  grass: { locomotion: 'quadruped', procedural: { vine: 0.6, tail: 0.3 }, nativeBias: 0.5 },
  ice: { locomotion: 'biped', procedural: { tail: 0.3, spine: 0.2 }, nativeBias: 0.55 },
  fighting: { locomotion: 'biped', procedural: { upperArm: 0.5, spine: 0.3 }, nativeBias: 0.65 },
  poison: { locomotion: 'serpent', procedural: { tail: 0.5, vine: 0.3 }, nativeBias: 0.5 },
  ground: { locomotion: 'quadruped', procedural: { tail: 0.4, spine: 0.2 }, nativeBias: 0.6 },
  flying: { locomotion: 'aerial', procedural: { wing: 0.8, tail: 0.3 }, nativeBias: 0.45 },
  psychic: { locomotion: 'float', procedural: { float: 0.7, tail: 0.2 }, nativeBias: 0.4 },
  bug: { locomotion: 'hexapod', procedural: { wing: 0.4, antenna: 0.5, upperLeg: 0.4 }, nativeBias: 0.45 },
  rock: { locomotion: 'quadruped', procedural: { rigid: 0.5, spine: 0.2 }, nativeBias: 0.55 },
  ghost: { locomotion: 'float', procedural: { float: 0.6, tail: 0.4 }, nativeBias: 0.4 },
  dragon: { locomotion: 'serpent', procedural: { wing: 0.4, tail: 0.6, spine: 0.3 }, nativeBias: 0.5 },
  dark: { locomotion: 'quadruped', procedural: { tail: 0.4, spine: 0.3 }, nativeBias: 0.55 },
  steel: { locomotion: 'biped', procedural: { rigid: 0.4, spine: 0.2 }, nativeBias: 0.6 },
  fairy: { locomotion: 'biped', procedural: { wing: 0.3, tail: 0.2 }, nativeBias: 0.5 },
};

function getRegionForDex(dexId) {
  const id = Number(dexId);
  if (id >= 10001) return null;
  return REGIONS.find((r) => id >= r.minDex && id <= r.maxDex) || null;
}

function getFormTier(formName, entryId, isDefault) {
  const fn = String(formName || 'regular').toLowerCase();
  if (fn === 'regular' || (isDefault && !fn.includes('-'))) return 1;
  if (fn === 'shiny') return 2;
  if (/alola|galar|hisui|paldea|regional/.test(fn)) return 3;
  if (/mega/.test(fn)) return 4;
  if (/gmax|gigantamax/.test(fn)) return 5;
  if (entryId >= 10001) return 3;
  return 5;
}

function buildEvolutionStages(speciesList) {
  const chains = {};
  speciesList.forEach((sp) => {
    const chain = sp.EvC || sp.id;
    if (!chains[chain]) chains[chain] = [];
    chains[chain].push(sp.id);
  });
  const stageBySpecies = {};
  Object.values(chains).forEach((ids) => {
    const sorted = [...ids].sort((a, b) => a - b);
    sorted.forEach((id, idx) => {
      stageBySpecies[id] = idx + 1;
    });
  });
  return stageBySpecies;
}

function main() {
  const pokemonRaw = JSON.parse(fs.readFileSync(POKEMON_JSON, 'utf8'));
  const speciesRaw = JSON.parse(fs.readFileSync(SPECIES_JSON, 'utf8'));
  const mergedOpt = JSON.parse(fs.readFileSync(MERGED_OPT, 'utf8'));

  const pokemonEntries = Object.values(pokemonRaw.pokemon);
  const speciesList = speciesRaw['pokemon-species'];
  const speciesById = Object.fromEntries(speciesList.map((s) => [s.id, s]));

  const modelByEntryId = {};
  mergedOpt.pokemon.forEach((entry) => {
    entry.forms.forEach((form) => {
      const key = `${entry.id}:${form.formName}`;
      modelByEntryId[key] = form.model;
    });
  });

  const evolutionStages = buildEvolutionStages(speciesList);

  const regionalBiomes = {
    regions: REGIONS.map((r) => ({
      ...r,
      count: r.maxDex - r.minDex + 1,
    })),
    assignments: {},
    pathToRegion: {
      0: 'kanto',
      1: 'johto',
      2: 'hoenn',
      3: 'sinnoh',
      4: 'unova',
      5: 'kalos',
      6: 'alola',
      7: 'galar',
    },
    formBandSize: FORM_BAND_SIZE,
  };

  const spawnCatalog = [];
  const regionCounts = Object.fromEntries(REGIONS.map((r) => [r.id, 0]));

  pokemonEntries.forEach((entry) => {
    const entryId = entry.id;
    const speciesId = entry.Sp?.id || (entryId >= 10001 ? null : entryId);
    const parentSpecies = speciesId ? speciesById[speciesId] : null;
    const baseSpeciesId = speciesId || entryId;
    const region =
      getRegionForDex(baseSpeciesId)?.id ||
      getRegionForDex(speciesId)?.id ||
      'kanto';

    if (entryId <= 1025) {
      regionalBiomes.assignments[String(entryId)] = region;
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    } else if (speciesId) {
      const parentRegion = regionalBiomes.assignments[String(speciesId)] || region;
      regionalBiomes.assignments[String(entryId)] = parentRegion;
    }

    const eggGroups = parentSpecies?.EgG || speciesById[baseSpeciesId]?.EgG || [];
    const types = (entry.T || []).map((t) => t.n);
    const formName = entry.N?.includes('-')
      ? entry.N.split('-').slice(1).join('-')
      : entry.isD
        ? 'regular'
        : 'alternate';
    const formTier = getFormTier(formName, entryId, entry.isD);
    const evStage = evolutionStages[speciesId || baseSpeciesId] || 1;
    const spawnLevel = (evStage - 1) * FORM_BAND_SIZE + formTier;
    const modelKey = `${speciesId || entryId}:${formTier === 2 ? 'shiny' : formTier === 1 ? 'regular' : formName
      }`;
    const modelUrl =
      modelByEntryId[modelKey] ||
      modelByEntryId[`${speciesId || entryId}:regular`] ||
      null;

    spawnCatalog.push({
      entryId,
      speciesId: speciesId || baseSpeciesId,
      name: entry.N,
      region: regionalBiomes.assignments[String(entryId)] || region,
      types,
      eggGroups,
      evolutionStage: evStage,
      formName: formTier === 1 ? 'regular' : formName,
      formTier,
      spawnLevel,
      isDefault: Boolean(entry.isD),
      modelUrl,
      isLegendary: Boolean(parentSpecies?.iB || speciesById[baseSpeciesId]?.iB),
      hasEggs: eggGroups.length > 0 && !eggGroups.includes('no-eggs'),
    });
  });

  const typeAnimationCatalog = {
    types: Object.entries(TYPE_ANIM_PROFILES).map(([type, profile]) => ({
      type,
      ...profile,
      attackClipHints: ['attack', 'fight', 'strike'],
      fleeClipHints: ['flee', 'run', 'retreat'],
    })),
  };

  const stats = {
    totalEntries: spawnCatalog.length,
    defaultSpecies: spawnCatalog.filter((e) => e.isDefault && e.entryId <= 1025).length,
    regionCounts,
    formTiers: spawnCatalog.reduce((acc, e) => {
      acc[e.formTier] = (acc[e.formTier] || 0) + 1;
      return acc;
    }, {}),
  };

  const writeAll = (dir) => {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'regionalBiomes.json'), JSON.stringify(regionalBiomes, null, 2));
    fs.writeFileSync(
      path.join(dir, 'typeAnimationCatalog.json'),
      JSON.stringify(typeAnimationCatalog, null, 2)
    );
    fs.writeFileSync(
      path.join(dir, 'spawnCatalog.json'),
      JSON.stringify({ formBandSize: FORM_BAND_SIZE, entries: spawnCatalog, stats }, null, 2)
    );
  };
  writeAll(OUT_DIR);
  writeAll(OUT_DIR_CLIENT);
  const publicCopy = path.join(ROOT, 'public/assets/dataSet/typeAnimationCatalog.json');
  fs.writeFileSync(publicCopy, JSON.stringify(typeAnimationCatalog, null, 2));

  console.log('Generated catalogs:', stats);
  REGIONS.forEach((r) => {
    const expected = r.maxDex - r.minDex + 1;
    const actual = regionCounts[r.id] || 0;
    if (actual !== expected) {
      console.warn(`Region ${r.id}: expected ${expected}, got ${actual}`);
    }
  });
}

main();
