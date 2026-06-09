import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { api } from '../api';
import {
  ArrowLeft,
  Swords,
  Flame,
  Droplet,
  CloudSun,
  Compass,
  Wind,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import '../styles/minigames.css';

// Type effectiveness chart
const TYPE_CHART = {
  normal: { doubleDamageFrom: ['fighting'], halfDamageFrom: [], noDamageFrom: ['ghost'] },
  fire: { doubleDamageFrom: ['water', 'ground', 'rock'], halfDamageFrom: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], noDamageFrom: [] },
  water: { doubleDamageFrom: ['electric', 'grass'], halfDamageFrom: ['fire', 'water', 'ice', 'steel'], noDamageFrom: [] },
  grass: { doubleDamageFrom: ['fire', 'ice', 'poison', 'flying', 'bug'], halfDamageFrom: ['water', 'grass', 'electric', 'ground'], noDamageFrom: [] },
  electric: { doubleDamageFrom: ['ground'], halfDamageFrom: ['electric', 'flying', 'steel'], noDamageFrom: [] },
  ice: { doubleDamageFrom: ['fire', 'fighting', 'rock', 'steel'], halfDamageFrom: ['ice'], noDamageFrom: [] },
  fighting: { doubleDamageFrom: ['flying', 'psychic', 'fairy'], halfDamageFrom: ['bug', 'rock', 'dark'], noDamageFrom: [] },
  poison: { doubleDamageFrom: ['ground', 'psychic'], halfDamageFrom: ['grass', 'fighting', 'poison', 'bug', 'fairy'], noDamageFrom: [] },
  ground: { doubleDamageFrom: ['water', 'grass', 'ice'], halfDamageFrom: ['poison', 'rock'], noDamageFrom: ['electric'] },
  flying: { doubleDamageFrom: ['electric', 'ice', 'rock'], halfDamageFrom: ['fighting', 'grass', 'bug'], noDamageFrom: ['ground'] },
  psychic: { doubleDamageFrom: ['bug', 'ghost', 'dark'], halfDamageFrom: ['fighting', 'psychic'], noDamageFrom: [] },
  bug: { doubleDamageFrom: ['fire', 'flying', 'rock'], halfDamageFrom: ['grass', 'fighting', 'ground'], noDamageFrom: [] },
  rock: { doubleDamageFrom: ['water', 'grass', 'fighting', 'ground', 'steel'], halfDamageFrom: ['normal', 'fire', 'poison', 'flying'], noDamageFrom: [] },
  ghost: { doubleDamageFrom: ['ghost', 'dark'], halfDamageFrom: ['poison', 'bug'], noDamageFrom: ['normal', 'fighting'] },
  dragon: { doubleDamageFrom: ['ice', 'dragon', 'fairy'], halfDamageFrom: ['fire', 'water', 'grass', 'electric'], noDamageFrom: [] },
  dark: { doubleDamageFrom: ['fighting', 'bug', 'fairy'], halfDamageFrom: ['ghost', 'dark'], noDamageFrom: ['psychic'] },
  steel: { doubleDamageFrom: ['fire', 'fighting', 'ground'], halfDamageFrom: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], noDamageFrom: ['poison'] },
  fairy: { doubleDamageFrom: ['poison', 'steel'], halfDamageFrom: ['fighting', 'bug', 'dark'], noDamageFrom: ['dragon'] }
};

const WEATHER_OPTIONS = [
  { id: 'clear', name: 'Clear Sky', icon: CloudSun, color: 'text-zinc-400', desc: 'Standard battle conditions.' },
  { id: 'sun', name: 'Harsh Sunlight', icon: Flame, color: 'text-orange-500', desc: 'Fire moves x1.5. Water moves x0.5.' },
  { id: 'rain', name: 'Heavy Rain', icon: Droplet, color: 'text-blue-400', desc: 'Water moves x1.5. Fire moves x0.5.' },
  { id: 'sandstorm', name: 'Sandstorm', icon: Compass, color: 'text-amber-500', desc: 'Rock-type Sp. Def boosted by 1.5x.' },
  { id: 'hail', name: 'Snow/Hail', icon: Wind, color: 'text-cyan-300', desc: 'Ice moves x1.5.' }
];

const DIFFICULTIES = [
  { id: 'wild', name: 'Wild Encounter', rating: 'Easy', coins: 30 },
  { id: 'gym', name: 'Gym Leader Ace', rating: 'Medium', coins: 75 },
  { id: 'boss', name: 'Legendary Raid Boss', rating: 'Hard', coins: 150 }
];

// Official Pokémon type color palette
const TYPE_COLORS = {
  normal: '#9fa19f',
  fire: '#e62829',
  water: '#2980ef',
  grass: '#3fa129',
  electric: '#fac000',
  ice: '#3dcef3',
  fighting: '#ff8000',
  poison: '#9141cb',
  ground: '#915121',
  flying: '#81b9ef',
  psychic: '#ef4179',
  bug: '#91a119',
  rock: '#afa981',
  ghost: '#704170',
  dragon: '#5060e1',
  dark: '#624d4e',
  steel: '#60a1b8',
  fairy: '#ef70ef'
};

// Helper sound simulator using Web Audio API
function playAudioTone(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else if (type === 'spark') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.21);
    } else if (type === 'slash') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    }
  } catch (e) {
    console.warn("Audio Context failed", e);
  }
}

// Format Showdown protocol events to human-readable messages
function formatShowdownLog(line) {
  if (!line || !line.startsWith('|')) return null;
  const parts = line.split('|');
  const type = parts[1];

  switch (type) {
    case 'move': {
      const actor = cleanName(parts[2]);
      const moveName = parts[3];
      return `⚔️ <strong>${actor}</strong> used <strong>${moveName}</strong>!`;
    }
    case '-damage': {
      const target = cleanName(parts[2]);
      const hpStatus = parts[3];
      if (hpStatus === '0 fnt' || hpStatus.startsWith('0')) {
        return null; // Handled by faint event
      }
      return `💥 <strong>${target}</strong> took damage!`;
    }
    case '-heal': {
      const target = cleanName(parts[2]);
      const item = parts[4] ? parts[4].replace('[from] item: ', '') : '';
      return `🧪 <strong>${target}</strong> was healed ${item ? `by ${item}` : ''}!`;
    }
    case '-status': {
      const target = cleanName(parts[2]);
      const statusMap = { brn: 'burned', psn: 'poisoned', par: 'paralyzed', slp: 'put to sleep', frz: 'frozen' };
      const status = statusMap[parts[3]] || parts[3];
      return `🤢 <strong>${target}</strong> was <strong>${status}</strong>!`;
    }
    case '-curestatus': {
      const target = cleanName(parts[2]);
      return `✨ <strong>${target}</strong> recovered from status conditions!`;
    }
    case 'faint': {
      const target = cleanName(parts[2]);
      return `💀 <strong>${target}</strong> fainted!`;
    }
    case '-weather': {
      const weatherMap = { sunnyday: 'Harsh Sunlight', raindance: 'Heavy Rain', sandstorm: 'Sandstorm', hail: 'Snow/Hail', none: 'Clear Skies' };
      const w = weatherMap[parts[2]] || parts[2];
      if (parts[3] === '[upkeep]') {
        return `⛅ The weather remains: <strong>${w}</strong>.`;
      }
      return `⛅ The weather changed to: <strong>${w}</strong>!`;
    }
    case '-crit': {
      return `💥 Critical hit!`;
    }
    case '-supereffective': {
      return `✨ It's super effective!`;
    }
    case '-resisted': {
      return `🛡️ It's not very effective...`;
    }
    case '-immune': {
      const target = cleanName(parts[2]);
      return `🚫 <strong>${target}</strong> is immune!`;
    }
    case 'cant': {
      const target = cleanName(parts[2]);
      const reason = parts[3];
      if (reason === 'flinch') {
        return `🛡️ <strong>${target}</strong> flinched and skipped its turn!`;
      }
      return `🚫 <strong>${target}</strong> can't move due to ${reason}!`;
    }
    case 'win': {
      const winner = parts[2];
      return `🏆 <strong>${winner}</strong> won the battle!`;
    }
    default:
      return null;
  }
}

function cleanName(ident) {
  if (!ident) return '';
  const colonIdx = ident.indexOf(':');
  if (colonIdx !== -1) {
    return ident.slice(colonIdx + 1).trim();
  }
  return ident;
}

function parseCondition(condStr) {
  if (!condStr || condStr.includes('fnt') || condStr.startsWith('0')) {
    return { currentHp: 0, maxHp: 100, status: 'fnt' };
  }
  const [hpPart, statusPart] = condStr.split(' ');
  const [current, max] = hpPart.split('/').map(Number);
  return {
    currentHp: current || 0,
    maxHp: max || 100,
    status: statusPart || 'none'
  };
}

function normalizePokemonKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function speciesFromDetails(details) {
  return String(details || '').split(',')[0].trim();
}

function findTeamIndexForRequestPokemon(requestPokemon, team, fallbackIndex = 0) {
  const requestKeys = [cleanName(requestPokemon?.ident), speciesFromDetails(requestPokemon?.details)]
    .map(normalizePokemonKey)
    .filter(Boolean);

  const teamIndex = team.findIndex((pokemon) => {
    const teamKeys = [pokemon.displayName, pokemon.name, pokemon.species, pokemon.id]
      .map(normalizePokemonKey)
      .filter(Boolean);
    return teamKeys.some((key) => requestKeys.includes(key));
  });
  return teamIndex >= 0 ? teamIndex : fallbackIndex;
}

function findRequestPokemonForTeamIndex(request, team, teamIndex) {
  const requestPokemon = request?.side?.pokemon || [];
  return requestPokemon.find((pokemon, requestIndex) => (
    findTeamIndexForRequestPokemon(pokemon, team, requestIndex) === teamIndex
  ));
}

function findTeamIndexForBattleIdent(ident, team, request, fallbackIndex = 0) {
  const identKey = normalizePokemonKey(cleanName(ident));
  const directIndex = team.findIndex((pokemon) => (
    [pokemon.displayName, pokemon.name, pokemon.species, pokemon.id].map(normalizePokemonKey).includes(identKey)
  ));
  if (directIndex >= 0) return directIndex;

  const requestPokemon = (request?.side?.pokemon || []).find((pokemon) => (
    normalizePokemonKey(cleanName(pokemon.ident)) === identKey
  ));
  return requestPokemon ? findTeamIndexForRequestPokemon(requestPokemon, team, fallbackIndex) : fallbackIndex;
}

function getActiveTeamIndexFromRequest(request, team, fallbackIndex = 0) {
  const requestPokemon = request?.side?.pokemon || [];
  const requestIndex = requestPokemon.findIndex((pokemon) => pokemon.active);
  if (requestIndex === -1) return fallbackIndex;
  return findTeamIndexForRequestPokemon(requestPokemon[requestIndex], team, requestIndex);
}

function getRequestSlotForTeamIndex(request, team, teamIndex) {
  const requestPokemon = request?.side?.pokemon || [];
  const requestIndex = requestPokemon.findIndex((pokemon, index) => (
    findTeamIndexForRequestPokemon(pokemon, team, index) === teamIndex
  ));
  return requestIndex >= 0 ? requestIndex : teamIndex;
}

function syncTeamFromRequest(team, request) {
  const nextTeam = [...team];
  request?.side?.pokemon?.forEach((requestPokemon, requestIndex) => {
    const teamIndex = findTeamIndexForRequestPokemon(requestPokemon, nextTeam, requestIndex);
    if (nextTeam[teamIndex]) {
      nextTeam[teamIndex] = { ...nextTeam[teamIndex], ...parseCondition(requestPokemon.condition) };
    }
  });
  return nextTeam;
}

export function BattleArenaScreen() {
  const { goTo, addCoins } = useGame();

  // Game states
  const [stage, setStage] = useState('draft'); // 'draft' | 'battle' | 'summary'
  const [draftPool, setDraftPool] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [difficulty, setDifficulty] = useState('wild');
  const [weather, setWeather] = useState('clear');
  const [loading, setLoading] = useState(false);

  // Showdown Battle States
  const [battleId, setBattleId] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [enemy, setEnemy] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [battleLogs, setBattleLogs] = useState([]);
  const [isActing, setIsActing] = useState(false);
  const [winner, setWinner] = useState(null);

  // Animations
  const [playerAnim, setPlayerAnim] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');

  // Mid-battle Inventory Items
  const [items, setItems] = useState({ potions: 3, fullRestores: 1 });
  const [showItems, setShowItems] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);

  // Damage Calculator Drawer State
  const [showCalc, setShowCalc] = useState(false);
  const [calcInputs, setCalcInputs] = useState({
    level: 50,
    power: 80,
    atk: 120,
    def: 100,
    stab: 1.5,
    type: 1.0,
    weather: 1.0,
    burn: 1.0,
    crit: 1.0
  });

  const logsEndRef = useRef(null);

  // 1. Initial Load: Fetch Draft Pool
  useEffect(() => {
    async function loadDraftPool() {
      setLoading(true);
      try {
        const data = await api.getStarters();
        const entries = (data.starters || []).filter((entry) => entry.formTier === 1);
        const shuffled = [...entries].sort(() => 0.5 - Math.random());
        setDraftPool(shuffled.slice(0, 15));
      } catch (err) {
        console.error("Failed to load draft pool", err);
      } finally {
        setLoading(false);
      }
    }
    loadDraftPool();
  }, []);

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [battleLogs]);

  const getRequestMoves = useCallback(() => {
    if (!activeRequest || !activeRequest.active || !activeRequest.active[0]) return [];
    return activeRequest.active[0].moves || [];
  }, [activeRequest]);

  // Sync damage calculator inputs to active pokemon and enemy context
  useEffect(() => {
    if (stage === 'battle' && playerTeam[activeIdx] && enemy && activeRequest) {
      const activePoke = playerTeam[activeIdx];
      const reqMoves = getRequestMoves();
      const firstMove = reqMoves[0] || { id: 'tackle' };
      const defaultMoveDetail = activePoke.moves?.find(
        m => m.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === firstMove.id
      ) || { power: 40, type: 'normal' };

      setCalcInputs(prev => ({
        ...prev,
        level: activePoke.level || 50,
        power: defaultMoveDetail.power || 40,
        atk: activePoke.attack || 100,
        def: enemy.defense || 100,
        stab: activePoke.types.includes(defaultMoveDetail.type) ? 1.5 : 1.0,
        type: calculateTypeMultiplier(defaultMoveDetail.type, enemy.types)
      }));
    }
  }, [stage, activeIdx, enemy, playerTeam, activeRequest, getRequestMoves]);

  const handleDraftToggle = (poke) => {
    setSelectedTeam(prev => {
      const isSelected = prev.some(p => p.entryId === poke.entryId);
      if (isSelected) {
        return prev.filter(p => p.entryId !== poke.entryId);
      } else {
        if (prev.length >= 3) return prev;
        return [...prev, poke];
      }
    });
  };

  const startBattle = async () => {
    if (selectedTeam.length < 3) return;
    setLoading(true);
    try {
      const resolvedTeam = [];
      for (const t of selectedTeam) {
        const pokeDetail = await fetchPokemonDetailsFromAPI(t.name);
        resolvedTeam.push(pokeDetail);
      }
      setPlayerTeam(resolvedTeam);
      setActiveIdx(0);

      // Start Showdown Battle Simulation on Backend
      const result = await api.startBattle({
        team: resolvedTeam,
        difficulty,
        weather
      });

      setBattleId(result.battleId);
      setActiveRequest(result.request);
      setWinner(null);
      setItems({ potions: 3, fullRestores: 1 });
      setStage('battle');
      setPlayerTurn(true);

      // Extract enemy pokemon details from switch-in logs
      const switchLine = result.logs.find(l => l.startsWith('|switch|p2a:'));
      if (switchLine) {
        const parts = switchLine.split('|');
        const enemyName = parts[3].split(',')[0].trim().toLowerCase();
        const enemyDetail = await fetchPokemonDetailsFromAPI(enemyName);
        const [current, max] = parts[4].split('/').map(Number);
        enemyDetail.currentHp = current;
        enemyDetail.maxHp = max;
        setEnemy(enemyDetail);
      }

      // Format and set initial logs
      setBattleLogs([]);
      const formatted = result.logs.map(formatShowdownLog).filter(Boolean);
      setBattleLogs(formatted);

    } catch (err) {
      console.error(err);
      alert("Error starting battle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonDetailsFromAPI = async (name) => {
    const res = await fetch(`/api/pokemon/${name.toLowerCase()}`);
    const data = await res.json();

    const stats = {};
    data.stats.forEach(s => {
      stats[s.stat.name] = s.base_stat;
    });

    const moveNames = data.moves.slice(0, 4).map(m => m.move.name);
    const moves = [];
    for (const mName of moveNames) {
      try {
        const mRes = await fetch(`/api/move/${mName}`);
        const mData = await mRes.json();
        moves.push({
          name: mData.name,
          power: mData.power || 40,
          type: mData.type.name,
          accuracy: mData.accuracy || 100,
          damage_class: mData.damage_class.name
        });
      } catch {
        moves.push({ name: mName, power: 40, type: 'normal', accuracy: 100, damage_class: 'physical' });
      }
    }

    const maxHp = (stats.hp || 60) + 75;
    return {
      name: data.name,
      displayName: name.charAt(0).toUpperCase() + name.slice(1).split('-')[0],
      sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      maxHp,
      currentHp: maxHp,
      attack: (stats.attack || 50) + 20,
      defense: (stats.defense || 50) + 20,
      spAttack: (stats['special-attack'] || 50) + 20,
      spDefense: (stats['special-defense'] || 50) + 20,
      speed: (stats.speed || 50) + 20,
      moves: moves.length > 0 ? moves : [{ name: 'tackle', power: 40, type: 'normal', accuracy: 100, damage_class: 'physical' }],
      status: 'none'
    };
  };

  const calculateTypeMultiplier = (moveType, defenderTypes) => {
    let mult = 1.0;
    const mt = moveType.toLowerCase();
    for (const dt of defenderTypes) {
      const chart = TYPE_CHART[dt.toLowerCase()];
      if (!chart) continue;
      if (chart.doubleDamageFrom.includes(mt)) mult *= 2.0;
      else if (chart.halfDamageFrom.includes(mt)) mult *= 0.5;
      else if (chart.noDamageFrom.includes(mt)) mult *= 0.0;
    }
    return mult;
  };

  // Playback turn logs line-by-line with 3D animations and audio cues synced
  const playTurnEvents = async (logs, nextRequest, nextWinner, pTeam, eMon) => {
    setIsActing(true);
    setPlayerTurn(false);

    let localTeam = [...pTeam];
    let localEnemy = eMon ? { ...eMon } : null;

    for (let i = 0; i < logs.length; i++) {
      const line = logs[i];
      const parts = line.split('|');
      const type = parts[1];

      const formatted = formatShowdownLog(line);
      if (formatted) {
        setBattleLogs(prev => [...prev, formatted]);
      }

      if (type === 'move') {
        const actor = parts[2];
        if (actor.startsWith('p1a:')) {
          setPlayerAnim('attack');
          const moveId = parts[3].toLowerCase().replace(/[^a-z0-9]+/g, '');
          if (moveId.includes('electric') || moveId.includes('thunder')) playAudioTone('spark');
          else if (moveId.includes('slash') || moveId.includes('wing')) playAudioTone('slash');
          else playAudioTone('hit');

          await new Promise(r => setTimeout(r, 450));
          setPlayerAnim('');
        } else if (actor.startsWith('p2a:')) {
          setEnemyAnim('attack');
          playAudioTone('hit');
          await new Promise(r => setTimeout(r, 450));
          setEnemyAnim('');
        }
      }
      else if (type === '-damage') {
        const target = parts[2];
        const hpStatus = parts[3];
        const { currentHp, maxHp, status } = parseCondition(hpStatus);

        if (target.startsWith('p1a:')) {
          setPlayerAnim('hit');
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, activeIdx);
          localTeam[targetTeamIndex] = {
            ...localTeam[targetTeamIndex],
            currentHp,
            maxHp,
            status
          };
          setPlayerTeam([...localTeam]);
          await new Promise(r => setTimeout(r, 450));
          setPlayerAnim('');
        } else if (target.startsWith('p2a:')) {
          setEnemyAnim('hit');
          if (localEnemy) {
            localEnemy.currentHp = currentHp;
            localEnemy.maxHp = maxHp;
            localEnemy.status = status;
            setEnemy({ ...localEnemy });
          }
          await new Promise(r => setTimeout(r, 450));
          setEnemyAnim('');
        }
      }
      else if (type === '-heal') {
        const target = parts[2];
        const hpStatus = parts[3];
        const { currentHp, maxHp, status } = parseCondition(hpStatus);

        if (target.startsWith('p1a:')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, activeIdx);
          localTeam[targetTeamIndex] = {
            ...localTeam[targetTeamIndex],
            currentHp,
            maxHp,
            status
          };
          setPlayerTeam([...localTeam]);
        } else if (target.startsWith('p2a:')) {
          if (localEnemy) {
            localEnemy.currentHp = currentHp;
            localEnemy.maxHp = maxHp;
            localEnemy.status = status;
            setEnemy({ ...localEnemy });
          }
        }
        await new Promise(r => setTimeout(r, 350));
      }
      else if (type === 'faint') {
        const target = parts[2];
        if (target.startsWith('p1a:')) {
          setPlayerAnim('faint');
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, activeIdx);
          if (localTeam[targetTeamIndex]) localTeam[targetTeamIndex].currentHp = 0;
          setPlayerTeam([...localTeam]);
          await new Promise(r => setTimeout(r, 600));
          setPlayerAnim('');
        } else if (target.startsWith('p2a:')) {
          setEnemyAnim('faint');
          if (localEnemy) {
            localEnemy.currentHp = 0;
            setEnemy({ ...localEnemy });
          }
          await new Promise(r => setTimeout(r, 600));
          setEnemyAnim('');
        }
      }
      else if (type === 'switch') {
        const target = parts[2];
        const details = parts[3];
        const hpStatus = parts[4];
        const speciesName = details.split(',')[0].trim();
        const { currentHp, maxHp, status } = parseCondition(hpStatus);

        if (target.startsWith('p2a:')) {
          const enemyDetail = await fetchPokemonDetailsFromAPI(speciesName);
          enemyDetail.currentHp = currentHp;
          enemyDetail.maxHp = maxHp;
          enemyDetail.status = status;
          localEnemy = enemyDetail;
          setEnemy(enemyDetail);
          await new Promise(r => setTimeout(r, 450));
        }
      }
    }

    // Set final synced states
    setActiveRequest(nextRequest);

    if (nextRequest && nextRequest.side && nextRequest.side.pokemon) {
      localTeam = syncTeamFromRequest(localTeam, nextRequest);
      setPlayerTeam([...localTeam]);

      setActiveIdx(getActiveTeamIndexFromRequest(nextRequest, localTeam, activeIdx));
    }

    if (nextWinner) {
      setWinner(nextWinner);
      if (nextWinner === 'player') {
        const payout = difficulty === 'wild' ? 30 : difficulty === 'gym' ? 75 : 150;
        addCoins(payout);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setPlayerTurn(true);
    }

    setIsActing(false);
  };

  const handlePlayerAttack = async (moveSlotIndex) => {
    if (!playerTurn || isActing || winner !== null) return;
    setShowItems(false);
    setShowSwitch(false);

    const choice = `move ${moveSlotIndex + 1}`;

    try {
      const result = await api.submitBattleChoice({ battleId, choice });
      playTurnEvents(result.logs, result.request, result.winner, playerTeam, enemy);
    } catch (e) {
      alert("Error submitting choice: " + e.message);
    }
  };

  const handleSwapActive = async (idx) => {
    if (!playerTurn || isActing || winner !== null || idx === activeIdx) return;
    setShowSwitch(false);

    const requestSlotIndex = getRequestSlotForTeamIndex(activeRequest, playerTeam, idx);
    const choice = `switch ${requestSlotIndex + 1}`;

    try {
      const result = await api.submitBattleChoice({ battleId, choice });
      playTurnEvents(result.logs, result.request, result.winner, playerTeam, enemy);
    } catch (e) {
      alert("Error submitting choice: " + e.message);
    }
  };

  const handleUseItem = async (type) => {
    if (!playerTurn || isActing || winner !== null) return;
    const choice = type === 'potion' ? 'potion' : 'fullrestore';

    setItems(prev => ({
      ...prev,
      potions: type === 'potion' ? prev.potions - 1 : prev.potions,
      fullRestores: type === 'fullRestore' ? prev.fullRestores - 1 : prev.fullRestores
    }));
    setShowItems(false);

    try {
      const result = await api.submitBattleChoice({ battleId, choice });
      playTurnEvents(result.logs, result.request, result.winner, playerTeam, enemy);
    } catch (e) {
      alert("Error submitting choice: " + e.message);
    }
  };


  const getMappedMoves = () => {
    return getRequestMoves().map((reqMove) => {
      const detail = playerTeam[activeIdx]?.moves?.find(
        m => m.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === reqMove.id
      ) || { type: 'normal', power: 40 };
      return {
        ...reqMove,
        type: detail.type,
        power: detail.power || 40
      };
    });
  };

  // Damage Calculator variables helper
  const calcOutput = () => {
    const base = ((((2 * calcInputs.level / 5) + 2) * calcInputs.power * (calcInputs.atk / calcInputs.def)) / 50) + 2;
    const modifier = calcInputs.stab * calcInputs.type * calcInputs.weather * calcInputs.burn * calcInputs.crit;
    return Math.floor(base * modifier);
  };

  const getDmgRolls = (val) => {
    const list = [];
    for (let i = 85; i <= 100; i++) {
      list.push(Math.floor(val * (i / 100)));
    }
    return list;
  };

  const calculatedBase = calcOutput();
  const calculatedRolls = getDmgRolls(calculatedBase);

  return (
    <div className="minigames-screen" id="battle-arena-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Battle Ground</p>
          <h1 className="minigames-title">Pokémon Battle Arena</h1>
        </div>
        <div className="minigames-header-stats">
          <button className="btn-back" id="back-to-hub-btn" onClick={() => goTo(SCREENS.minigameHub)}>
            <ArrowLeft size={14} /> Back to Hub
          </button>
        </div>
      </header>

      {loading ? (
        <div className="minigame-inner-header" style={{ border: 'none', justifyContent: 'center', minHeight: '300px' }}>
          <p className="minigames-eyebrow animate-pulse">Summoning battle matrices & loading assets...</p>
        </div>
      ) : stage === 'draft' ? (
        <div className="minigame-container">
          <div className="minigame-content" style={{ textAlign: 'left' }}>
            <div
              className="battle-arena-draft-topbar"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 className="minigame-inner-title">Draft Your Squad (Choose 3)</h2>
                <p className="minigame-inner-subtitle" style={{ marginBottom: 0 }}>Select 3 Pokémon to fight the opponent team.</p>
              </div>
              <button
                className="btn-back"
                id="start-battle-btn"
                disabled={selectedTeam.length !== 3 || loading}
                onClick={startBattle}
                style={{
                  background: selectedTeam.length === 3 ? 'var(--px-sky)' : 'rgba(255,255,255,0.02)',
                  borderColor: selectedTeam.length === 3 ? 'var(--px-sky)' : 'var(--px-border)',
                  minWidth: '170px',
                  justifyContent: 'center'
                }}
              >
                <Swords size={16} /> {selectedTeam.length}/3 Start Battle
              </button>
            </div>

            <div className="battle-arena-header" style={{ marginBottom: '24px' }}>
              <div className="battle-arena-config">
                <span className="config-section-title">Difficulty Mode</span>
                <div className="config-btn-group">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.id}
                      id={`diff-btn-${d.id}`}
                      className={`config-btn ${difficulty === d.id ? 'active' : ''}`}
                      onClick={() => setDifficulty(d.id)}
                    >
                      {d.name} ({d.rating})
                    </button>
                  ))}
                </div>
              </div>

              <div className="battle-arena-config">
                <span className="config-section-title">Field Weather Conditions</span>
                <div className="config-btn-group">
                  {WEATHER_OPTIONS.map(w => (
                    <button
                      key={w.id}
                      id={`weather-btn-${w.id}`}
                      className={`config-btn ${weather === w.id ? 'active' : ''}`}
                      onClick={() => setWeather(w.id)}
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="minigames-bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {draftPool.map(p => {
                const isSelected = selectedTeam.some(s => s.entryId === p.entryId);
                return (
                  <div
                    key={p.entryId}
                    id={`draft-card-${p.entryId}`}
                    className={`bento-card ${isSelected ? 'featured' : ''}`}
                    onClick={() => handleDraftToggle(p)}
                    style={{ minHeight: '110px', padding: '14px', alignItems: 'center' }}
                  >
                    <span style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {p.types[0] === 'grass' ? '🌿' : p.types[0] === 'fire' ? '🔥' : p.types[0] === 'water' ? '💧' : '⭐'}
                    </span>
                    <span className="species-label" style={{ textAlign: 'center' }}>{p.displayName}</span>
                    <span style={{ fontSize: '9px', opacity: 0.6, marginTop: '4px', textTransform: 'uppercase', fontWeight: 800 }}>
                      {p.types.join(' / ')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-back"
                id="start-battle-footer-btn"
                disabled={selectedTeam.length !== 3 || loading}
                onClick={startBattle}
                style={{ background: selectedTeam.length === 3 ? 'var(--px-sky)' : 'rgba(255,255,255,0.02)', borderColor: selectedTeam.length === 3 ? 'var(--px-sky)' : 'var(--px-border)' }}
              >
                <Swords size={16} /> Start Battle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="battle-arena-layout">
          {/* Battle board */}
          <div className="battle-arena-board">

            {/* Stage */}
            <div className="battle-stage" id="battle-stage-arena">
              <div className="battle-stage-backdrop-effect" />

              {/* Floor */}
              <div className="stage-floor" />

              {/* Enemy Side */}
              <div className="stage-pokemon-row" style={{ justifyContent: 'flex-end' }}>
                <div className="stage-pokemon-container">
                  {enemy && (
                    <>
                      <div className="pokemon-hp-panel" id="enemy-hp-panel">
                        <div className="hp-panel-header">
                          <span className="hp-pokemon-name">{enemy.displayName}</span>
                          <span className="hp-pokemon-level">Lvl {enemy.level || 50}</span>
                        </div>
                        <div className="hp-bar-outer">
                          <div
                            className={`hp-bar-inner ${enemy.currentHp / enemy.maxHp > 0.5 ? 'high' : enemy.currentHp / enemy.maxHp > 0.2 ? 'medium' : 'low'}`}
                            style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}
                          />
                        </div>
                        <div className="hp-numeric">
                          {enemy.currentHp} / {enemy.maxHp} HP
                          {enemy.status !== 'none' && <span className="status-tag" style={{ marginLeft: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' }}>{enemy.status}</span>}
                        </div>
                      </div>

                      <div
                        className={`pokemon-avatar-wrapper ${enemyAnim || 'idle'}`}
                        id="enemy-avatar-wrapper"
                        data-status={enemy.status !== 'none' ? enemy.status : undefined}
                      >
                        <img src={enemy.sprite} alt={enemy.displayName} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Player Side */}
              <div className="stage-pokemon-row" style={{ justifyContent: 'flex-start' }}>
                <div className="stage-pokemon-container">
                  {playerTeam[activeIdx] && (
                    <>
                      <div className="pokemon-hp-panel" id="player-hp-panel">
                        <div className="hp-panel-header">
                          <span className="hp-pokemon-name">{playerTeam[activeIdx].displayName}</span>
                          <span className="hp-pokemon-level">Lvl {playerTeam[activeIdx].level || 50}</span>
                        </div>
                        <div className="hp-bar-outer">
                          <div
                            className={`hp-bar-inner ${playerTeam[activeIdx].currentHp / playerTeam[activeIdx].maxHp > 0.5 ? 'high' : playerTeam[activeIdx].currentHp / playerTeam[activeIdx].maxHp > 0.2 ? 'medium' : 'low'}`}
                            style={{ width: `${(playerTeam[activeIdx].currentHp / playerTeam[activeIdx].maxHp) * 100}%` }}
                          />
                        </div>
                        <div className="hp-numeric">
                          {playerTeam[activeIdx].currentHp} / {playerTeam[activeIdx].maxHp} HP
                          {playerTeam[activeIdx].status !== 'none' && <span className="status-tag" style={{ marginLeft: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' }}>{playerTeam[activeIdx].status}</span>}
                        </div>
                      </div>

                      <div
                        className={`pokemon-avatar-wrapper ${playerAnim || 'idle'}`}
                        id="player-avatar-wrapper"
                        style={{ transform: 'scaleX(-1)' }}
                        data-status={playerTeam[activeIdx].status !== 'none' ? playerTeam[activeIdx].status : undefined}
                      >
                        <img src={playerTeam[activeIdx].sprite} alt={playerTeam[activeIdx].displayName} />
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Combat Logs */}
            <div className="battle-logs-card" id="battle-logs-card">
              <span className="battle-logs-title">Battle Combat Logs</span>
              <div className="battle-logs-stream">
                {battleLogs.slice(-4).map((log, i) => (
                  <div key={i} className="battle-log-line" dangerouslySetInnerHTML={{ __html: log }} />
                ))}
                <div ref={logsEndRef} />
              </div>

              {winner && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {winner === 'player' ? (
                    <div className="battle-winner-banner" id="winner-banner">
                      🏆 Victory! You defeated the opponent!
                    </div>
                  ) : (
                    <div className="battle-loser-banner" id="loser-banner">
                      💀 Defeated... Your Pokémon all fainted.
                    </div>
                  )}
                  <button className="btn-menu-action danger w-full" id="rematch-btn" onClick={() => setStage('draft')}>
                    <RotateCcw size={14} /> Leave Arena / Rematch
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Action panels */}
          {winner === null && (
            <div className="battle-controls-hub" id="battle-controls-hub">

              {/* Move selections */}
              <div className="action-grid">
                {getMappedMoves().map((m, i) => (
                  <button
                    key={m.id}
                    id={`move-btn-${m.id}`}
                    className="btn-action-move"
                    data-type={m.type}
                    disabled={!playerTurn || isActing || m.disabled}
                    onClick={() => handlePlayerAttack(i)}
                  >
                    <span className="move-btn-keybind">Slot {i + 1}</span>
                    <span className="move-btn-name">{m.move.replace(/-/g, ' ')}</span>
                    <span className="move-btn-type" style={{
                      background: TYPE_COLORS[m.type] || '#888',
                      color: '#fff'
                    }}>
                      {m.type.toUpperCase()} · PWR {m.power}
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions Menu */}
              <div className="battle-menu-actions">
                <button className="dmg-calc-toggle-btn" id="dmg-calc-toggle" onClick={() => setShowCalc(true)}>
                  📊 Damage Calculator
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="btn-menu-action" id="swap-action-btn" onClick={() => { setShowSwitch(prev => !prev); setShowItems(false); }}>
                    🔄 Swap (S)
                  </button>
                  <button className="btn-menu-action" id="items-action-btn" onClick={() => { setShowItems(prev => !prev); setShowSwitch(false); }}>
                    🧪 Items (I)
                  </button>
                </div>
                <button className="btn-menu-action danger" id="flee-arena-btn" onClick={() => setStage('draft')}>
                  🏳️ Flee Arena
                </button>
              </div>

            </div>
          )}

          {/* Swap layout picker */}
          {showSwitch && (
            <div className="minigame-inner-header" id="switch-panel" style={{ marginTop: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--px-border)', borderRadius: '16px', justifyContent: 'flex-start', gap: '12px' }}>
              <span className="config-section-title" style={{ margin: 0 }}>Swap Pokémon:</span>
              {playerTeam.map((p, i) => {
                const reqMon = findRequestPokemonForTeamIndex(activeRequest, playerTeam, i);
                const isFainted = reqMon ? reqMon.condition.includes('fnt') || reqMon.condition.startsWith('0') : false;
                const isActive = reqMon ? reqMon.active : false;
                return (
                  <button
                    key={p.name}
                    id={`switch-poke-btn-${i}`}
                    className={`config-btn ${activeIdx === i ? 'active' : ''}`}
                    disabled={isFainted || isActive}
                    onClick={() => handleSwapActive(i)}
                  >
                    {p.displayName} ({p.currentHp} HP)
                  </button>
                );
              })}
            </div>
          )}

          {/* Items layout picker */}
          {showItems && (
            <div className="minigame-inner-header" id="items-panel" style={{ marginTop: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--px-border)', borderRadius: '16px', justifyContent: 'flex-start', gap: '12px' }}>
              <span className="config-section-title" style={{ margin: 0 }}>Use Healing Item:</span>
              <button className="config-btn" id="potion-item-btn" disabled={items.potions <= 0} onClick={() => handleUseItem('potion')}>
                🧪 Potion ({items.potions} Left) - Heals 50 HP
              </button>
              <button className="config-btn" id="fullrestore-item-btn" disabled={items.fullRestores <= 0} onClick={() => handleUseItem('fullRestore')}>
                ✨ Full Restore ({items.fullRestores} Left) - Full HP + Cure
              </button>
            </div>
          )}

        </div>
      )}

      {/* Interactive Damage Calculator Drawer Overlay */}
      {showCalc && (
        <>
          <div className="dmg-calc-drawer-backdrop" onClick={() => setShowCalc(false)} />
          <div className="dmg-calc-drawer" id="damage-analyzer-drawer">
            <div className="dmg-calc-header">
              <h3 className="minigame-inner-title">Damage Lab Analyzer</h3>
              <button className="btn-back" onClick={() => setShowCalc(false)}>Close</button>
            </div>

            <div className="dmg-calc-body">

              <div className="dmg-calc-panel">
                <span className="config-section-title">Core Engine Variables</span>
                <div className="dmg-calc-grid-2">
                  <div>
                    <label className="dmg-calc-label">Attacker Lvl</label>
                    <input
                      type="number"
                      className="dmg-calc-input"
                      value={calcInputs.level}
                      onChange={e => setCalcInputs({ ...calcInputs, level: Math.max(1, Number(e.target.value)) })}
                    />
                  </div>
                  <div>
                    <label className="dmg-calc-label">Move Power</label>
                    <input
                      type="number"
                      className="dmg-calc-input"
                      value={calcInputs.power}
                      onChange={e => setCalcInputs({ ...calcInputs, power: Math.max(1, Number(e.target.value)) })}
                    />
                  </div>
                  <div>
                    <label className="dmg-calc-label">Attack Stat (A)</label>
                    <input
                      type="number"
                      className="dmg-calc-input"
                      value={calcInputs.atk}
                      onChange={e => setCalcInputs({ ...calcInputs, atk: Math.max(1, Number(e.target.value)) })}
                    />
                  </div>
                  <div>
                    <label className="dmg-calc-label">Defense Stat (D)</label>
                    <input
                      type="number"
                      className="dmg-calc-input"
                      value={calcInputs.def}
                      onChange={e => setCalcInputs({ ...calcInputs, def: Math.max(1, Number(e.target.value)) })}
                    />
                  </div>
                </div>
              </div>

              <div className="dmg-calc-panel">
                <span className="config-section-title">Modifier Sliders</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>

                  <div>
                    <label className="dmg-calc-label">Type Advantage Effectiveness</label>
                    <select
                      className="dmg-calc-input"
                      value={calcInputs.type}
                      onChange={e => setCalcInputs({ ...calcInputs, type: Number(e.target.value) })}
                    >
                      <option value="0.0">0x (Immune)</option>
                      <option value="0.25">0.25x (Double Resisted)</option>
                      <option value="0.5">0.5x (Resisted)</option>
                      <option value="1.0">1x (Neutral)</option>
                      <option value="2.0">2x (Super Effective)</option>
                      <option value="4.0">4x (Ultra Effective)</option>
                    </select>
                  </div>

                  <div>
                    <label className="dmg-calc-label">STAB Modifier</label>
                    <select
                      className="dmg-calc-input"
                      value={calcInputs.stab}
                      onChange={e => setCalcInputs({ ...calcInputs, stab: Number(e.target.value) })}
                    >
                      <option value="1.0">1x (None)</option>
                      <option value="1.5">1.5x (STAB Bonus)</option>
                      <option value="2.0">2x (Adaptability)</option>
                    </select>
                  </div>

                  <div>
                    <label className="dmg-calc-label">Field Weather Modifier</label>
                    <select
                      className="dmg-calc-input"
                      value={calcInputs.weather}
                      onChange={e => setCalcInputs({ ...calcInputs, weather: Number(e.target.value) })}
                    >
                      <option value="1.0">1x (Neutral)</option>
                      <option value="1.5">1.5x (Boosted)</option>
                      <option value="0.5">0.5x (Reduced)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className={`config-btn w-full ${calcInputs.burn === 0.5 ? 'active' : ''}`}
                      onClick={() => setCalcInputs(p => ({ ...p, burn: p.burn === 0.5 ? 1.0 : 0.5 }))}
                    >
                      Burned (0.5x)
                    </button>
                    <button
                      className={`config-btn w-full ${calcInputs.crit === 1.5 ? 'active' : ''}`}
                      onClick={() => setCalcInputs(p => ({ ...p, crit: p.crit === 1.5 ? 1.0 : 1.5 }))}
                    >
                      Critical (1.5x)
                    </button>
                  </div>

                </div>
              </div>

              {/* Damage roll outputs */}
              <div className="dmg-calc-panel" style={{ background: 'rgba(255, 212, 63, 0.03)', borderColor: 'rgba(255, 212, 63, 0.2)' }}>
                <span className="config-section-title" style={{ color: 'var(--px-accent)' }}>Roll Outputs (Chaos Variance)</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <div>
                    <span className="dmg-calc-label">Min Damage (85%)</span>
                    <strong style={{ fontSize: '18px', color: 'var(--px-accent-warm)' }}>{calculatedRolls[0]}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="dmg-calc-label">Max Damage (100%)</span>
                    <strong style={{ fontSize: '18px', color: 'var(--px-accent)' }}>{calculatedBase}</strong>
                  </div>
                </div>

                <div className="chart-rolls-container" style={{ marginTop: '16px' }}>
                  {calculatedRolls.map((roll, idx) => (
                    <div key={idx} className="chart-roll-row">
                      <span className="chart-roll-percentage">{85 + idx}%</span>
                      <div className="chart-roll-bar-outer">
                        <div
                          className="chart-roll-bar-inner"
                          style={{ width: `${((roll) / calculatedBase) * 100}%` }}
                        />
                      </div>
                      <span className="chart-roll-value">{roll}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}
