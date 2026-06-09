import { createBattleEngineSession, submitBattleEngineChoice } from './battleEngineService.js';
import { Dex } from './battleEngineCatalog.js';

const ENEMY_SETS = {
  rattata: { species: 'Rattata', level: 30, moves: ['Tackle', 'Quick Attack', 'Bite', 'Tail Whip'] },
  pidgey: { species: 'Pidgey', level: 30, moves: ['Tackle', 'Gust', 'Quick Attack', 'Sand Attack'] },
  zubat: { species: 'Zubat', level: 30, moves: ['Bite', 'Wing Attack', 'Confuse Ray', 'Supersonic'] },
  geodude: { species: 'Geodude', level: 30, moves: ['Tackle', 'Rock Throw', 'Mud Slap', 'Defense Curl'] },
  ekans: { species: 'Ekans', level: 30, moves: ['Bite', 'Poison Sting', 'Wrap', 'Glare'] },
  sandshrew: { species: 'Sandshrew', level: 30, moves: ['Scratch', 'Sand Tomb', 'Poison Sting', 'Defense Curl'] },
  charizard: { species: 'Charizard', level: 50, moves: ['Flamethrower', 'Air Slash', 'Dragon Pulse', 'Slash'] },
  gengar: { species: 'Gengar', level: 50, moves: ['Shadow Ball', 'Sludge Bomb', 'Dazzling Gleam', 'Hypnosis'] },
  garchomp: { species: 'Garchomp', level: 50, moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Swords Dance'] },
  dragonite: { species: 'Dragonite', level: 50, moves: ['Outrage', 'Hurricane', 'Fire Punch', 'Roost'] },
  metagross: { species: 'Metagross', level: 50, moves: ['Meteor Mash', 'Zen Headbutt', 'Earthquake', 'Bullet Punch'] },
  gyarados: { species: 'Gyarados', level: 50, moves: ['Waterfall', 'Bounce', 'Crunch', 'Dragon Dance'] },
  mewtwo: { species: 'Mewtwo', level: 70, moves: ['Psystrike', 'Shadow Ball', 'Aura Sphere', 'Recover'] },
  rayquaza: { species: 'Rayquaza', level: 70, moves: ['Dragon Ascent', 'Outrage', 'Extreme Speed', 'Dragon Dance'] },
  arceus: { species: 'Arceus', level: 70, moves: ['Judgment', 'Recover', 'Extreme Speed', 'Earthquake'] },
  kyogre: { species: 'Kyogre', level: 70, moves: ['Origin Pulse', 'Ice Beam', 'Thunder', 'Calm Mind'] },
  groudon: { species: 'Groudon', level: 70, moves: ['Precipice Blades', 'Fire Punch', 'Stone Edge', 'Swords Dance'] },
  giratina: { species: 'Giratina', level: 70, moves: ['Shadow Force', 'Draco Meteor', 'Will-O-Wisp', 'Hex'] },
};

const DIFFICULTY_POOLS = {
  wild: ['rattata', 'pidgey', 'zubat', 'geodude', 'ekans', 'sandshrew'],
  gym: ['charizard', 'gengar', 'garchomp', 'dragonite', 'metagross', 'gyarados'],
  boss: ['mewtwo', 'rayquaza', 'arceus', 'kyogre', 'groudon', 'giratina'],
};

function capitalizeWords(value) {
  if (!value) return '';
  return String(value)
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getKnownSpeciesName(candidate) {
  const species = Dex.species.get(candidate);
  return species.exists ? species.name : null;
}

function normalizeClientSpecies(value) {
  const clientName = String(value || '');
  if (clientName.startsWith('pikachu-') && clientName.endsWith('-cap')) {
    return getKnownSpeciesName(clientName.replace('-cap', '')) || capitalizeWords(clientName.replace('-cap', ''));
  }

  const direct = getKnownSpeciesName(clientName) || getKnownSpeciesName(capitalizeWords(clientName));
  if (direct) return direct;

  const normalized = clientName
    .replace(/-totem/g, '')
    .replace(/-(male|female)$/g, '')
    .replace(/-family-of-(three|four)$/g, '');
  const normalizedDirect = getKnownSpeciesName(normalized) || getKnownSpeciesName(capitalizeWords(normalized));
  if (normalizedDirect) return normalizedDirect;

  const parts = clientName.split('-').filter(Boolean);
  for (let length = parts.length - 1; length >= 1; length -= 1) {
    const trimmed = parts.slice(0, length).join('-');
    const species = getKnownSpeciesName(trimmed) || getKnownSpeciesName(capitalizeWords(trimmed));
    if (species) return species;
  }

  return capitalizeWords(clientName);
}

function mapClientPokemonToBattleReady(pokemon, index) {
  const species = normalizeClientSpecies(pokemon.name || pokemon.species || pokemon.displayName);
  const maxHp = Number(pokemon.maxHp || pokemon.stats?.hp || 100);
  const moves = (pokemon.moves || []).map((move) => move.name || move).filter(Boolean).slice(0, 4);
  return {
    id: pokemon.id || `p1-${index + 1}-${String(pokemon.name || species).toLowerCase()}`,
    species,
    displayName: pokemon.displayName || species,
    level: pokemon.level || 50,
    currentHp: Math.min(Number(pokemon.currentHp || maxHp), maxHp),
    maxHp,
    stats: {
      hp: maxHp,
      atk: Number(pokemon.attack || pokemon.stats?.atk || 100),
      def: Number(pokemon.defense || pokemon.stats?.def || 100),
      spa: Number(pokemon.spAttack || pokemon.stats?.spa || 100),
      spd: Number(pokemon.spDefense || pokemon.stats?.spd || 100),
      spe: Number(pokemon.speed || pokemon.stats?.spe || 100),
    },
    moves: moves.length ? moves : ['Tackle'],
    ability: pokemon.ability || '',
    item: pokemon.item || '',
    status: pokemon.status || 'none',
  };
}

function buildEnemyPokemon(setKey) {
  const template = ENEMY_SETS[setKey] || ENEMY_SETS.rattata;
  const levelScale = template.level >= 70 ? 2.2 : template.level >= 50 ? 1.6 : 1;
  const maxHp = Math.round(95 * levelScale);
  const offense = Math.round(85 * levelScale);
  const defense = Math.round(75 * levelScale);
  const speed = Math.round(80 * levelScale);

  return {
    id: `p2-${setKey}`,
    species: template.species,
    displayName: template.species,
    level: template.level,
    currentHp: maxHp,
    maxHp,
    stats: { hp: maxHp, atk: offense, def: defense, spa: offense, spd: defense, spe: speed },
    moves: template.moves,
    ability: '',
    item: '',
    status: 'none',
  };
}

function getEnemyTeam(difficulty) {
  const pool = DIFFICULTY_POOLS[difficulty] || DIFFICULTY_POOLS.boss;
  const enemyName = pool[Math.floor(Math.random() * pool.length)];
  return [buildEnemyPokemon(enemyName)];
}

function mapWinner(winner) {
  if (winner === 'p1' || winner === 'Player') return 'player';
  if (winner === 'p2' || winner === 'AI') return 'enemy';
  return winner || null;
}

function normalizeEngineError(error) {
  if (error?.message?.includes('Battle engine session not found or expired')) {
    return new Error('Battle session not found or expired');
  }
  return error;
}

export function startNewBattle({ team, difficulty, weather }) {
  const result = createBattleEngineSession({
    formatId: 'gen7customgame',
    weather: weather || 'clear',
    participants: [
      {
        side: 'p1',
        user: { id: 'arena-player', name: 'Player' },
        control: 'human',
        team: (team || []).map(mapClientPokemonToBattleReady),
      },
      {
        side: 'p2',
        user: { id: 'arena-ai', name: 'AI', type: 'npc' },
        control: 'ai',
        team: getEnemyTeam(difficulty),
      },
    ],
  });

  return {
    battleId: result.battleId,
    logs: result.logs,
    request: result.requests?.p1,
    winner: mapWinner(result.winner),
  };
}

export function makeChoice(battleId, p1Choice) {
  try {
    const result = submitBattleEngineChoice(battleId, 'p1', p1Choice);
    return {
      logs: result.logs,
      request: result.requests?.p1,
      winner: mapWinner(result.winner),
    };
  } catch (error) {
    throw normalizeEngineError(error);
  }
}
