import { createBattleEngineSession, submitBattleEngineChoice } from './battleEngineService.js';
import { Dex } from './battleEngineCatalog.js';

const ENEMY_SETS = {
  rattata: { species: 'Rattata', level: 50, moves: ['Tackle', 'Quick Attack', 'Bite', 'Tail Whip'] },
  pidgey: { species: 'Pidgey', level: 50, moves: ['Tackle', 'Gust', 'Quick Attack', 'Sand Attack'] },
  zubat: { species: 'Zubat', level: 50, moves: ['Bite', 'Wing Attack', 'Confuse Ray', 'Supersonic'] },
  geodude: { species: 'Geodude', level: 50, moves: ['Tackle', 'Rock Throw', 'Mud Slap', 'Defense Curl'] },
  ekans: { species: 'Ekans', level: 50, moves: ['Bite', 'Poison Sting', 'Wrap', 'Glare'] },
  sandshrew: { species: 'Sandshrew', level: 50, moves: ['Scratch', 'Sand Tomb', 'Poison Sting', 'Defense Curl'] },
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

const TRAINER_PARTICIPANTS = [
  {
    side: 'p2',
    user: { id: 'npc-red', name: 'Pokemon Trainer Red', type: 'npc' },
    control: 'ai',
    team: [
      {
        id: 'red-pikachu',
        species: 'Pikachu',
        displayName: 'Pikachu',
        level: 50,
        currentHp: 180,
        maxHp: 180,
        stats: { hp: 180, atk: 120, def: 95, spa: 115, spd: 110, spe: 185 },
        moves: ['Volt Tackle', 'Iron Tail', 'Quick Attack', 'Thunderbolt'],
        ability: 'Static',
        item: 'Light Ball',
        status: 'none',
      },
      {
        id: 'red-snorlax',
        species: 'Snorlax',
        displayName: 'Snorlax',
        level: 50,
        currentHp: 350,
        maxHp: 350,
        stats: { hp: 350, atk: 195, def: 125, spa: 125, spd: 195, spe: 70 },
        moves: ['Body Slam', 'Crunch', 'Blizzard', 'Shadow Ball'],
        ability: 'Thick Fat',
        item: 'Leftovers',
        status: 'none',
      },
      {
        id: 'red-charizard',
        species: 'Charizard',
        displayName: 'Charizard',
        level: 50,
        currentHp: 235,
        maxHp: 235,
        stats: { hp: 235, atk: 160, def: 150, spa: 195, spd: 160, spe: 185 },
        moves: ['Flare Blitz', 'Blast Burn', 'Air Slash', 'Dragon Pulse'],
        ability: 'Blaze',
        item: '',
        status: 'none',
      },
    ],
  },
  {
    side: 'p2',
    user: { id: 'npc-cynthia', name: 'Champion Cynthia', type: 'npc' },
    control: 'ai',
    team: [
      {
        id: 'cynthia-spiritomb',
        species: 'Spiritomb',
        displayName: 'Spiritomb',
        level: 50,
        currentHp: 155,
        maxHp: 155,
        stats: { hp: 155, atk: 135, def: 155, spa: 135, spd: 155, spe: 65 },
        moves: ['Dark Pulse', 'Shadow Ball', 'Psychic', 'Embargo'],
        ability: 'Pressure',
        item: '',
        status: 'none',
      },
      {
        id: 'cynthia-lucario',
        species: 'Lucario',
        displayName: 'Lucario',
        level: 50,
        currentHp: 180,
        maxHp: 180,
        stats: { hp: 180, atk: 165, def: 115, spa: 170, spd: 115, spe: 140 },
        moves: ['Aura Sphere', 'Dragon Pulse', 'Psychic', 'Earthquake'],
        ability: 'Steadfast',
        item: '',
        status: 'none',
      },
      {
        id: 'cynthia-garchomp',
        species: 'Garchomp',
        displayName: 'Garchomp',
        level: 50,
        currentHp: 240,
        maxHp: 240,
        stats: { hp: 240, atk: 200, def: 155, spa: 135, spd: 140, spe: 165 },
        moves: ['Dragon Rush', 'Earthquake', 'Brick Break', 'Giga Impact'],
        ability: 'Sand Veil',
        item: 'Sitrus Berry',
        status: 'none',
      },
    ],
  },
  {
    side: 'p2',
    user: { id: 'npc-blue', name: 'Rival Blue', type: 'npc' },
    control: 'ai',
    team: [
      {
        id: 'blue-pidgeot',
        species: 'Pidgeot',
        displayName: 'Pidgeot',
        level: 50,
        currentHp: 195,
        maxHp: 195,
        stats: { hp: 195, atk: 125, def: 115, spa: 110, spd: 110, spe: 150 },
        moves: ['Return', 'Air Slash', 'Mirror Move', 'Whirlwind'],
        ability: 'Keen Eye',
        item: '',
        status: 'none',
      },
      {
        id: 'blue-alakazam',
        species: 'Alakazam',
        displayName: 'Alakazam',
        level: 50,
        currentHp: 150,
        maxHp: 150,
        stats: { hp: 150, atk: 80, def: 75, spa: 185, spd: 135, spe: 165 },
        moves: ['Psychic', 'Recover', 'Reflect', 'Shadow Ball'],
        ability: 'Synchronize',
        item: '',
        status: 'none',
      },
      {
        id: 'blue-blastoise',
        species: 'Blastoise',
        displayName: 'Blastoise',
        level: 50,
        currentHp: 205,
        maxHp: 205,
        stats: { hp: 205, atk: 135, def: 155, spa: 135, spd: 160, spe: 125 },
        moves: ['Hydro Pump', 'Ice Beam', 'Bite', 'Flash Cannon'],
        ability: 'Torrent',
        item: '',
        status: 'none',
      },
    ],
  },
  {
    side: 'p2',
    user: { id: 'npc-ash', name: 'Ash Ketchum', type: 'npc' },
    control: 'ai',
    team: [
      {
        id: 'ash-pikachu',
        species: 'Pikachu',
        displayName: 'Pikachu',
        level: 50,
        currentHp: 175,
        maxHp: 175,
        stats: { hp: 175, atk: 115, def: 90, spa: 110, spd: 105, spe: 180 },
        moves: ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Electroweb'],
        ability: 'Static',
        item: 'Pikashunium Z',
        status: 'none',
      },
      {
        id: 'ash-greninja',
        species: 'Greninja',
        displayName: 'Greninja',
        level: 50,
        currentHp: 220,
        maxHp: 220,
        stats: { hp: 220, atk: 165, def: 125, spa: 180, spd: 130, spe: 210 },
        moves: ['Water Shuriken', 'Double Team', 'Cut', 'Aerial Ace'],
        ability: 'Battle Bond',
        item: '',
        status: 'none',
      },
      {
        id: 'ash-lucario',
        species: 'Lucario',
        displayName: 'Lucario',
        level: 50,
        currentHp: 190,
        maxHp: 190,
        stats: { hp: 190, atk: 180, def: 120, spa: 160, spd: 110, spe: 155 },
        moves: ['Aura Sphere', 'Bullet Punch', 'Double Team', 'Steel Beam'],
        ability: 'Inner Focus',
        item: '',
        status: 'none',
      },
    ],
  },
];

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
    gender: pokemon.gender || (Math.random() > 0.5 ? 'M' : 'F'),
  };
}

function buildEnemyPokemon(setKey, index = 0) {
  const template = ENEMY_SETS[setKey] || ENEMY_SETS.rattata;
  const levelScale = template.level >= 70 ? 2.2 : template.level >= 50 ? 1.6 : 1;
  const maxHp = Math.round(95 * levelScale);
  const offense = Math.round(85 * levelScale);
  const defense = Math.round(75 * levelScale);
  const speed = Math.round(80 * levelScale);

  return {
    id: `p2-${index}-${setKey}`,
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
    gender: Math.random() > 0.5 ? 'M' : 'F',
  };
}

/**
 * Returns the minimum number of Pokémon each team must supply so that every
 * active slot in the given format can be filled on turn 1.
 */
function getMinActiveSlots(formatId) {
  if (formatId === 'gen7doublescustomgame') return 2;
  if (formatId === 'gen6triplescustomgame') return 3;
  return 1;
}

function getEnemyTeam(difficulty, formatId, battleFormat) {
  const pool = DIFFICULTY_POOLS[difficulty] || DIFFICULTY_POOLS.boss;

  let teamSize = 3;
  if (battleFormat === 'singles6v6') {
    teamSize = 6;
  } else if (formatId === 'gen7doublescustomgame' || battleFormat === 'doubles') {
    teamSize = 6;
  } else if (formatId === 'gen6triplescustomgame' || battleFormat === 'triples') {
    teamSize = 6;
  }

  if (difficulty === 'boss') teamSize = 1;

  const team = [];
  for (let i = 0; i < teamSize; i++) {
    const enemyName = pool[Math.floor(Math.random() * pool.length)];
    team.push(buildEnemyPokemon(enemyName, i));
  }
  return team;
}

function getTrainerParticipant(formatId, battleFormat) {
  const trainer = TRAINER_PARTICIPANTS[Math.floor(Math.random() * TRAINER_PARTICIPANTS.length)];
  let teamSize = 3;
  if (battleFormat === 'singles6v6') teamSize = 6;
  if (formatId === 'gen7doublescustomgame' || battleFormat === 'doubles') teamSize = 6;
  if (formatId === 'gen6triplescustomgame' || battleFormat === 'triples') teamSize = 6;

  let team = trainer.team.map((pokemon) => ({ ...pokemon, stats: { ...pokemon.stats } }));

  // Pad the team if it doesn't have enough Pokémon for the format
  if (team.length < teamSize) {
    const pool = DIFFICULTY_POOLS['gym'];
    const extraNeeded = teamSize - team.length;
    for (let i = 0; i < extraNeeded; i++) {
      const enemyName = pool[Math.floor(Math.random() * pool.length)];
      team.push(buildEnemyPokemon(enemyName, team.length));
    }
  }

  return {
    ...trainer,
    user: { ...trainer.user },
    team: team.slice(0, teamSize),
  };
}

function getEnemyParticipant(difficulty, formatId, battleFormat) {
  if (difficulty === 'trainer3v3') return getTrainerParticipant(formatId, battleFormat);
  return {
    side: 'p2',
    user: { id: 'arena-ai', name: 'AI', type: 'npc' },
    control: 'ai',
    team: getEnemyTeam(difficulty, formatId, battleFormat),
  };
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

export function startNewBattle({ team, difficulty, weather, formatId, battleFormat }) {
  const resolvedFormatId = formatId || 'gen7customgame';
  const difficultyKey = difficulty || 'wild';

  // Map player's team to battle-ready objects
  let playerTeam = (team || []).map(mapClientPokemonToBattleReady);

  const result = createBattleEngineSession({
    formatId: resolvedFormatId,
    weather: weather || 'clear',
    participants: [
      {
        side: 'p1',
        user: { id: 'arena-player', name: 'Player' },
        control: 'human',
        team: playerTeam,
      },
      getEnemyParticipant(difficultyKey, resolvedFormatId, battleFormat),
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
