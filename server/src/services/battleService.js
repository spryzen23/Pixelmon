import { createRequire } from 'module';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';

// Load Showdown from our locally embedded compiled dist (no npm dependency needed)
const _require = createRequire(import.meta.url);
const Sim = _require('../showdown/sim/index.js');


const { Battle } = Sim;

// Cache active battle sessions (1 hour TTL)
const battleCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Predefined set catalog for enemy NPC teams based on selected difficulty
const ENEMY_SETS = {
  // Wild Encounter (Easy)
  rattata: { species: 'Rattata', level: 30, moves: ['Tackle', 'Quick Attack', 'Bite', 'Tail Whip'] },
  pidgey: { species: 'Pidgey', level: 30, moves: ['Tackle', 'Gust', 'Quick Attack', 'Sand Attack'] },
  zubat: { species: 'Zubat', level: 30, moves: ['Bite', 'Wing Attack', 'Confuse Ray', 'Supersonic'] },
  geodude: { species: 'Geodude', level: 30, moves: ['Tackle', 'Rock Throw', 'Mud Slap', 'Defense Curl'] },
  ekans: { species: 'Ekans', level: 30, moves: ['Bite', 'Poison Sting', 'Wrap', 'Glare'] },
  sandshrew: { species: 'Sandshrew', level: 30, moves: ['Scratch', 'Sand Tomb', 'Poison Sting', 'Defense Curl'] },

  // Gym Leader Ace (Medium)
  charizard: { species: 'Charizard', level: 50, moves: ['Flamethrower', 'Air Slash', 'Dragon Pulse', 'Slash'] },
  gengar: { species: 'Gengar', level: 50, moves: ['Shadow Ball', 'Sludge Bomb', 'Dazzling Gleam', 'Hypnosis'] },
  garchomp: { species: 'Garchomp', level: 50, moves: ['Earthquake', 'Dragon Claw', 'Rock Slide', 'Swords Dance'] },
  dragonite: { species: 'Dragonite', level: 50, moves: ['Outrage', 'Hurricane', 'Fire Punch', 'Roost'] },
  metagross: { species: 'Metagross', level: 50, moves: ['Meteor Mash', 'Zen Headbutt', 'Earthquake', 'Bullet Punch'] },
  gyarados: { species: 'Gyarados', level: 50, moves: ['Waterfall', 'Bounce', 'Crunch', 'Dragon Dance'] },

  // Legendary Raid Boss (Hard)
  mewtwo: { species: 'Mewtwo', level: 70, moves: ['Psystrike', 'Shadow Ball', 'Aura Sphere', 'Recover'] },
  rayquaza: { species: 'Rayquaza', level: 70, moves: ['Dragon Ascent', 'Outrage', 'Extreme Speed', 'Dragon Dance'] },
  arceus: { species: 'Arceus', level: 70, moves: ['Judgment', 'Recover', 'Extreme Speed', 'Earthquake'] },
  kyogre: { species: 'Kyogre', level: 70, moves: ['Origin Pulse', 'Ice Beam', 'Thunder', 'Calm Mind'] },
  groudon: { species: 'Groudon', level: 70, moves: ['Precipice Blades', 'Fire Punch', 'Stone Edge', 'Swords Dance'] },
  giratina: { species: 'Giratina', level: 70, moves: ['Shadow Force', 'Draco Meteor', 'Will-O-Wisp', 'Hex'] }
};

function capitalizeWords(str) {
  if (!str) return '';
  return str.split(/[\s-_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Convert frontend Pokemon structure to Showdown JSON Set format
function mapClientPokeToShowdown(poke) {
  let clientName = poke.name || '';
  // Map client cap forms to Showdown cap forms (which don't have "-cap" suffix in Showdown)
  if (clientName.startsWith('pikachu-') && clientName.endsWith('-cap')) {
    clientName = clientName.replace('-cap', '');
  }
  const species = capitalizeWords(clientName);
  const moves = (poke.moves || []).map(m => capitalizeWords(m.name || m));
  return {
    name: poke.displayName || species,
    species: species,
    moves: moves.length > 0 ? moves : ['Tackle'],
    level: poke.level || 50,
    ability: poke.ability || 'Static',
    item: poke.item || '',
    nature: 'Serious',
    evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
  };
}

// Generate the opponent's team set based on difficulty
function getEnemyTeam(difficulty) {
  let enemyName = 'mewtwo';
  if (difficulty === 'wild') {
    const pool = ['rattata', 'pidgey', 'zubat', 'geodude', 'ekans', 'sandshrew'];
    enemyName = pool[Math.floor(Math.random() * pool.length)];
  } else if (difficulty === 'gym') {
    const pool = ['charizard', 'gengar', 'garchomp', 'dragonite', 'metagross', 'gyarados'];
    enemyName = pool[Math.floor(Math.random() * pool.length)];
  } else {
    const pool = ['mewtwo', 'rayquaza', 'arceus', 'kyogre', 'groudon', 'giratina'];
    enemyName = pool[Math.floor(Math.random() * pool.length)];
  }

  const setTemplate = ENEMY_SETS[enemyName] || {
    species: capitalizeWords(enemyName),
    level: 50,
    moves: ['Tackle']
  };

  return [{
    name: setTemplate.species,
    species: setTemplate.species,
    moves: setTemplate.moves,
    level: setTemplate.level,
    ability: 'Pressure',
    item: '',
    nature: 'Serious',
    evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 }
  }];
}

// Starts a new battle, mounts the players, weather, and automatically passes Team Preview
export function startNewBattle({ team, difficulty, weather }) {
  const battleId = uuidv4();
  const battleLogs = [];
  let p1Request = null;
  let _p2Request = null;

  const p1Team = (team || []).map(mapClientPokeToShowdown);
  const p2Team = getEnemyTeam(difficulty);

  const battle = new Battle({
    formatid: 'gen7customgame',
    send: (type, data) => {
      if (type === 'update') {
        battleLogs.push(data);
      } else if (type === 'sideupdate') {
        const [sideId, sideData] = data.split('\n');
        if (sideId === 'p1') {
          if (sideData.startsWith('|request|')) {
            p1Request = JSON.parse(sideData.slice(9));
          }
        } else if (sideId === 'p2') {
          if (sideData.startsWith('|request|')) {
            _p2Request = JSON.parse(sideData.slice(9));
          }
        }
      }
    }
  });

  battle.setPlayer('p1', { name: 'Player', team: p1Team });
  battle.setPlayer('p2', { name: 'AI', team: p2Team });

  // Bypass Team Preview phase immediately by choosing the team slots
  battle.choose('p1', 'team 1');
  battle.choose('p2', 'team 1');

  // Apply Weather conditions (after active Pokemon are switched in)
  if (weather && weather !== 'clear') {
    const weatherMap = {
      sun: 'sunnyday',
      rain: 'raindance',
      sandstorm: 'sandstorm',
      hail: 'hail'
    };
    const showWeather = weatherMap[weather];
    if (showWeather) {
      battle.field.setWeather(showWeather, 'debug');
    }
  }

  // Flush initial logs and request updates
  battle.sendUpdates();

  // Cache state
  battleCache.set(battleId, battle.toJSON());

  return {
    battleId,
    logs: cleanLogs(battleLogs),
    request: p1Request,
    winner: getWinner(battle)
  };
}

// Execute player choices, automatically compute enemy choices, and step the simulator
export function makeChoice(battleId, p1Choice) {
  const serializedState = battleCache.get(battleId);
  if (!serializedState) {
    throw new Error('Battle session not found or expired');
  }

  const battleLogs = [];
  let p1Request = null;
  let _p2Request = null;

  const battle = Battle.fromJSON(serializedState);

  // Bind new listener
  battle.send = (type, data) => {
    if (type === 'update') {
      battleLogs.push(data);
    } else if (type === 'sideupdate') {
      const [sideId, sideData] = data.split('\n');
      if (sideId === 'p1') {
        if (sideData.startsWith('|request|')) {
          p1Request = JSON.parse(sideData.slice(9));
        }
      } else if (sideId === 'p2') {
        if (sideData.startsWith('|request|')) {
          _p2Request = JSON.parse(sideData.slice(9));
        }
      }
    }
  };

  // 1. Process choice for Player (P1)
  if (p1Choice.startsWith('potion') || p1Choice.startsWith('fullrestore')) {
    const activeMon = battle.p1.active[0];
    if (activeMon && activeMon.hp > 0) {
      const oldHp = activeMon.hp;
      if (p1Choice === 'potion') {
        const newHp = Math.min(activeMon.maxhp, oldHp + 50);
        activeMon.sethp(newHp);
        const healedAmount = activeMon.hp - oldHp;
        if (healedAmount > 0) {
          battle.add('-heal', activeMon, activeMon.getHealth, '[from] item: Potion');
        }
      } else if (p1Choice === 'fullrestore') {
        activeMon.sethp(activeMon.maxhp);
        activeMon.cureStatus();
        const healedAmount = activeMon.hp - oldHp;
        if (healedAmount > 0) {
          battle.add('-heal', activeMon, activeMon.getHealth, '[from] item: Full Restore');
        }
      }

      // Add flinch volatile to skip attacking this turn, and choose any valid move
      activeMon.addVolatile('flinch');
      const validMove = getFirstValidMove(battle.p1.activeRequest);
      battle.choose('p1', validMove);
    } else {
      // Fallback
      battle.choose('p1', 'default');
    }
  } else {
    // Normal move or switch
    battle.choose('p1', p1Choice);
  }

  // 2. Automate Opponent AI Choice (P2)
  const p2 = battle.p2;
  const p2Req = p2.activeRequest;

  if (p2Req && !p2Req.wait) {
    if (p2Req.forceSwitch) {
      // Force switch fainted Pokemon
      const switchChoices = [];
      p2Req.side.pokemon.forEach((mon, idx) => {
        if (idx >= p2.active.length && mon.condition && !mon.condition.includes('fnt')) {
          switchChoices.push(`switch ${idx + 1}`);
        }
      });
      if (switchChoices.length > 0) {
        const aiSwitch = switchChoices[Math.floor(Math.random() * switchChoices.length)];
        battle.choose('p2', aiSwitch);
      } else {
        battle.choose('p2', 'pass');
      }
    } else {
      // Standard move choice
      const moveChoices = [];
      const activePoke = p2Req.active?.[0];
      if (activePoke && activePoke.moves) {
        activePoke.moves.forEach((move, idx) => {
          if (!move.disabled) {
            moveChoices.push(`move ${idx + 1}`);
          }
        });
      }
      if (moveChoices.length > 0) {
        const aiMove = moveChoices[Math.floor(Math.random() * moveChoices.length)];
        battle.choose('p2', aiMove);
      } else {
        battle.choose('p2', 'default');
      }
    }
  }

  // Flush turn logs and request updates
  battle.sendUpdates();

  // Update cached state
  battleCache.set(battleId, battle.toJSON());

  return {
    logs: cleanLogs(battleLogs),
    request: p1Request || battle.p1.activeRequest,
    winner: getWinner(battle)
  };
}

function getFirstValidMove(p1Req) {
  const activePoke = p1Req?.active?.[0];
  if (activePoke && activePoke.moves) {
    const idx = activePoke.moves.findIndex(m => !m.disabled);
    if (idx !== -1) return `move ${idx + 1}`;
  }
  return 'default';
}

function getWinner(battle) {
  if (battle.ended) {
    if (battle.winner === 'Player') return 'player';
    if (battle.winner === 'AI') return 'enemy';
    // Fallback detection
    const p1Fainted = battle.p1.pokemon.every(p => p.fainted);
    const p2Fainted = battle.p2.pokemon.every(p => p.fainted);
    if (p1Fainted && !p2Fainted) return 'enemy';
    if (p2Fainted && !p1Fainted) return 'player';
  }
  return null;
}

/**
 * Showdown's `send` callback emits all events for a chunk as a single
 * string where individual pipe-protocol events are separated by commas.
 * e.g. "|move|p1a: Pikachu|Thunderbolt|p2a: Rattata,|-damage|p2a: Rattata|0 fnt,|faint|p2a: Rattata"
 * We need to split on ',' that immediately precede a '|' to get individual events.
 */
function cleanLogs(logsArray) {
  const raw = logsArray.join(',');
  // Split on commas that are followed by a pipe character (event boundary)
  const segments = raw.split(/,(?=\|)/);
  return segments
    .map(s => s.trim())
    .filter(s => s.startsWith('|'));
}

