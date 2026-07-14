import { useEffect, useState, useRef, useCallback } from 'react';
import { useGame, SCREENS } from '../context/GameContext';
import { api } from '../api';
import {
  ArrowLeft,
  Swords,
  RotateCcw,
  ChevronDown,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BATTLE_RULES } from '../data/battleRules';
import { TrainerColumn } from './battle/TrainerColumn';
import { SwitchUI } from './battle/SwitchUI';
import { ActionGrid } from './battle/ActionGrid';
import { DamageCalculator } from './battle/DamageCalculator';
import { 
  parseCondition, 
  findTeamIndexForBattleIdent, 
  syncTeamFromRequest,
  findRequestPokemonForTeamIndex,
  getRequestSlotForTeamIndex,
  cleanName
} from './battle/BattleUtils';

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
  { id: 'random', name: 'Random', icon: '🎲', color: 'text-zinc-400', desc: 'Weather chosen randomly each battle.' },
  { id: 'clear', name: 'Clear Sky', icon: '☀️', color: 'text-zinc-400', desc: 'Standard battle conditions.' },
  { id: 'sun', name: 'Harsh Sunlight', icon: '🔥', color: 'text-orange-500', desc: 'Fire moves ×1.5. Water moves ×0.5.' },
  { id: 'rain', name: 'Heavy Rain', icon: '💧', color: 'text-blue-400', desc: 'Water moves ×1.5. Fire moves ×0.5.' },
  { id: 'sandstorm', name: 'Sandstorm', icon: '🌪️', color: 'text-amber-500', desc: 'Rock-type Sp. Def boosted by 1.5×.' },
  { id: 'hail', name: 'Snow / Hail', icon: '❄️', color: 'text-cyan-300', desc: 'Ice moves ×1.5.' }
];

const DIFFICULTIES = [
  { id: 'wild', name: 'Wild Encounter', icon: '🌿', rating: 'Easy', desc: 'Common Pokémon, low level. Great for practice.', coins: 30 },
  { id: 'gym', name: 'Gym Leader Ace', icon: '🏅', rating: 'Medium', desc: 'Trainer-level threats with solid movesets.', coins: 75 },
  { id: 'boss', name: 'Legendary Raid Boss', icon: '💀', rating: 'Hard', desc: 'Elite legendaries at max power.', coins: 150 },
  { id: 'trainer3v3', name: 'Random Trainer', icon: '🎮', rating: '3v3', desc: 'Face a random NPC trainer team.', coins: 200 }
];

const BATTLE_FORMATS = [
  {
    id: 'singles3v3',
    name: 'Single Battle 3v3',
    icon: '⚔️',
    teamSize: 3,
    activeCount: 1,
    showdownFormat: 'gen7customgame',
    description: 'Classic 1v1 — 3 Pokémon per side.',
    guide: BATTLE_RULES.singles,
  },
  {
    id: 'singles6v6',
    name: 'Single Battle 6v6',
    icon: '⚔️',
    teamSize: 6,
    activeCount: 1,
    showdownFormat: 'gen7customgame',
    description: 'Classic 1v1 — 6 Pokémon per side.',
    guide: BATTLE_RULES.singles,
  },
  {
    id: 'doubles',
    name: 'Double Battle',
    icon: '🤝',
    teamSize: 6,
    activeCount: 2,
    showdownFormat: 'gen7doublescustomgame',
    description: '2v2 — Spread moves hit all. Target selection matters.',
    guide: BATTLE_RULES.doubles,
  },
  {
    id: 'triples',
    name: 'Triple Battle',
    icon: '🔱',
    teamSize: 6,
    activeCount: 3,
    showdownFormat: 'gen6triplescustomgame',
    description: '3v3 — Positioning & Shifting. Center reaches everyone.',
    guide: BATTLE_RULES.triples,
  },
];

// Spread moves that hit all Pokémon on field in doubles/triples
const _SPREAD_MOVE_IDS = new Set([
  'earthquake', 'surf', 'discharge', 'dazzlinggleam', 'rockslide', 'lavaplume',
  'bulldoze', 'blizzard', 'heatwave', 'boomburst', 'selfdestruct', 'explosion',
  'magnitude', 'eruption', 'sludgewave', 'perishsong', 'brutalswing',
]);

/**
 * Animated dropdown component styled to match the battle arena's dark-glass aesthetic.
 * Inspired by 21st.dev dropdown-01 — floating panel, icon+label+desc rows,
 * smooth open/close, click-outside close, keyboard accessible.
 */
function BattleDropdown({ label, options, value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    function onClickOut(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  return (
    <div className="battle-dropdown-root" ref={ref} id={id}>
      <span className="battle-dropdown-label">{label}</span>
      <button
        className={`battle-dropdown-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className="battle-dropdown-trigger-icon">
          {typeof selected.icon === 'string' ? selected.icon : <selected.icon size={14} />}
        </span>
        <span className="battle-dropdown-trigger-text">
          <span className="battle-dropdown-trigger-name">{selected.name}</span>
          {selected.rating && <span className="battle-dropdown-trigger-badge">{selected.rating}</span>}
        </span>
        <ChevronDown size={14} className={`battle-dropdown-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="battle-dropdown-panel" role="listbox">
          {options.map(opt => {
            const isActive = opt.id === value;
            return (
              <button
                key={opt.id}
                className={`battle-dropdown-item ${isActive ? 'active' : ''}`}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                role="option"
                aria-selected={isActive}
                type="button"
              >
                <span className="battle-dropdown-item-icon">
                  {typeof opt.icon === 'string' ? opt.icon : <opt.icon size={16} />}
                </span>
                <span className="battle-dropdown-item-body">
                  <span className="battle-dropdown-item-name">
                    {opt.name}
                    {opt.rating && <span className="battle-dropdown-item-badge">{opt.rating}</span>}
                  </span>
                  {opt.desc && <span className="battle-dropdown-item-desc">{opt.desc}</span>}
                </span>
                {isActive && <Check size={13} className="battle-dropdown-item-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}


// Official Pokémon type color palette
const _TYPE_COLORS = {
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
      const reason = parts[4] || '';
      if (hpStatus === '0 fnt' || hpStatus.startsWith('0')) {
        return null; // Handled by faint event
      }
      if (reason.includes('[silent]')) return null;
      if (reason.includes('[from] psn')) {
        return `☠️ <strong>${target}</strong> was hurt by poison!`;
      }
      if (reason.includes('[from] brn')) {
        return `🔥 <strong>${target}</strong> was hurt by its burn!`;
      }
      if (reason.includes('[from] item:')) {
        return `💥 <strong>${target}</strong> was hurt by its ${reason.replace('[from] item: ', '')}!`;
      }
      if (reason.includes('[from] sandstorm')) {
        return `🌪️ <strong>${target}</strong> is buffeted by the sandstorm!`;
      }
      if (reason.includes('[from] hail') || reason.includes('[from] Hail')) {
        return `❄️ <strong>${target}</strong> is buffeted by the hail!`;
      }
      if (reason.includes('[from] Leech Seed')) {
        return `🌱 <strong>${target}</strong>'s health is sapped by Leech Seed!`;
      }
      // Return null for normal attack damage to prevent log spam for multi-hit moves.
      // HP bar animations handle the visual feedback.
      return null;
    }
    case '-heal': {
      const target = cleanName(parts[2]);
      const reason = parts[4] || '';
      if (reason.includes('[silent]')) return null;
      if (reason.includes('[from] drain')) return `🧛 <strong>${target}</strong> drained some energy!`;

      const item = reason.includes('[from] item:') ? reason.replace('[from] item: ', '') : '';
      if (item) {
        return `🧪 <strong>${target}</strong> restored health using its ${item}!`;
      }
      return `✨ <strong>${target}</strong> restored some health!`;
    }
    case '-hitcount': {
      const hits = parts[3];
      return `🎯 Hit ${hits} times!`;
    }
    case '-boost': {
      const target = cleanName(parts[2]);
      const stat = parts[3];
      const statMap = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', accuracy: 'Accuracy', evasion: 'Evasion' };
      return `📈 <strong>${target}</strong>'s ${statMap[stat] || stat} rose!`;
    }
    case '-unboost': {
      const target = cleanName(parts[2]);
      const stat = parts[3];
      const statMap = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', accuracy: 'Accuracy', evasion: 'Evasion' };
      return `📉 <strong>${target}</strong>'s ${statMap[stat] || stat} fell!`;
    }
    case '-status': {
      const target = cleanName(parts[2]);
      const statusMap = { brn: 'burned', psn: 'poisoned', par: 'paralyzed', slp: 'put to sleep', frz: 'frozen' };
      const status = statusMap[parts[3]] || parts[3];
      return `🤢 <strong>${target}</strong> was <strong>${status}</strong>!`;
    }
    case '-curestatus': {
      const target = cleanName(parts[2]);
      const statusMap = { brn: 'burn', psn: 'poison', par: 'paralysis', slp: 'sleep', frz: 'freeze' };
      const status = statusMap[parts[3]] || parts[3];
      return `✨ <strong>${target}</strong> was cured of its <strong>${status}</strong>!`;
    }
    case '-transform': {
      const actor = cleanName(parts[2]);
      const target = cleanName(parts[3]);
      return `🧬 <strong>${actor}</strong> transformed into <strong>${target}</strong>!`;
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
    case '-miss': {
      const actor = cleanName(parts[2]);
      return `❌ <strong>${actor}</strong>'s attack missed!`;
    }
    case '-fail': {
      const actor = cleanName(parts[2]);
      return `🚫 <strong>${actor}</strong>'s move failed!`;
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

export function BattleArenaScreen() {
  const { goTo, addCoins } = useGame();

  // Game states
  const [stage, setStage] = useState('draft'); // 'draft' | 'battle' | 'summary'
  const [draftPool, setDraftPool] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [difficulty, setDifficulty] = useState('wild');
  const [weather, setWeather] = useState('random');
  const [battleFormat, setBattleFormat] = useState('singles3v3');
  const [loading, setLoading] = useState(false);

  const currentFormat = BATTLE_FORMATS.find(f => f.id === battleFormat) || BATTLE_FORMATS[0];

  // Showdown Battle States
  const [_battleId, setBattleId] = useState(null);
  const battleIdRef = useRef(null);
  const [playerSlots, setPlayerSlots] = useState([null, null, null]);
  const playerSlotsRef = useRef([null, null, null]);
  const [enemySlots, setEnemySlots] = useState([null, null, null]);
  const enemySlotsRef = useRef([null, null, null]);
  const [choosingSlotIdx, setChoosingSlotIdx] = useState(0);
  const choosingSlotIdxRef = useRef(0);
  const [_turnChoices, setTurnChoices] = useState([]);
  const turnChoicesRef = useRef([]);
  const [targetSelection, setTargetSelection] = useState(null); // { moveSlotIndex, targetType }
  const [activeRequest, setActiveRequest] = useState(null);
  const activeRequestRef = useRef(null);
  const [playerTeam, setPlayerTeam] = useState([]);
  const playerTeamRef = useRef([]);
  const enemy = enemySlots[0] || enemySlots[1] || enemySlots[2];
  const [playerTurn, setPlayerTurn] = useState(true);
  const [battleLogs, setBattleLogs] = useState([]);
  const [isActing, setIsActing] = useState(false);
  const [winner, setWinner] = useState(null);

  // Keep refs in sync with state so async callbacks always read fresh values
  const _setBattleId = (v) => { battleIdRef.current = v; setBattleId(v); };
  const _setPlayerSlots = (v) => { const next = typeof v === 'function' ? v(playerSlotsRef.current) : v; playerSlotsRef.current = next; setPlayerSlots(next); };
  const _setEnemySlots = (v) => { const next = typeof v === 'function' ? v(enemySlotsRef.current) : v; enemySlotsRef.current = next; setEnemySlots(next); };
  const _setChoosingSlotIdx = (v) => { const next = typeof v === 'function' ? v(choosingSlotIdxRef.current) : v; choosingSlotIdxRef.current = next; setChoosingSlotIdx(next); };
  const _setTurnChoices = (v) => { const next = typeof v === 'function' ? v(turnChoicesRef.current) : v; turnChoicesRef.current = next; setTurnChoices(next); };
  const _setActiveRequest = (v) => { activeRequestRef.current = v; setActiveRequest(v); };
  const _setPlayerTeam = (v) => { const next = typeof v === 'function' ? v(playerTeamRef.current) : v; playerTeamRef.current = next; setPlayerTeam(next); };

  // Animations
  const [playerAnim, setPlayerAnim] = useState('');
  const [enemyAnim, setEnemyAnim] = useState('');

  // Mid-battle Inventory Items
  const [items, setItems] = useState({ potions: 3, fullRestores: 1 });
  const [bagOpen, setBagOpen] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const [_switchTimer, setSwitchTimer] = useState(null);

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

  const logsContainerRef = useRef(null);

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
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [battleLogs]);

  // Auto-switch timer
  useEffect(() => {
    let interval;
    if (activeRequest?.forceSwitch && !isActing && winner === null) {
      setSwitchTimer(5);
      interval = setInterval(() => {
        setSwitchTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            const firstAvailableIdx = playerTeam.findIndex((p, i) => {
              const reqMon = findRequestPokemonForTeamIndex(activeRequest, playerTeam, i);
              const isFainted = reqMon ? reqMon.condition.includes('fnt') || reqMon.condition.startsWith('0') : false;
              const isActive = reqMon ? reqMon.active : false;

              const requestSlotIndex = getRequestSlotForTeamIndex(activeRequest, playerTeam, i);
              const choiceStr = `switch ${requestSlotIndex + 1}`;
              const isAlreadyChosen = turnChoicesRef.current.includes(choiceStr);

              return !isFainted && !isActive && !isAlreadyChosen;
            });
            if (firstAvailableIdx !== -1) {
              handleSwapActive(firstAvailableIdx);
            } else {
              const forceSwitchArray = Array.isArray(activeRequest.forceSwitch) ? activeRequest.forceSwitch : [!!activeRequest.forceSwitch];
              proceedToNextSlot('pass', forceSwitchArray);
            }
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSwitchTimer(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRequest, isActing, winner, playerTeam, choosingSlotIdx]);

  const getRequestMoves = useCallback(() => {
    if (!activeRequest || !activeRequest.active || !activeRequest.active[choosingSlotIdx]) return [];
    return activeRequest.active[choosingSlotIdx].moves || [];
  }, [activeRequest, choosingSlotIdx]);

  // Sync damage calculator inputs to active pokemon and enemy context
  useEffect(() => {
    const currentActiveIdx = playerSlots[choosingSlotIdx];
    const currentActivePoke = currentActiveIdx !== null ? playerTeam[currentActiveIdx] : null;
    if (stage === 'battle' && currentActivePoke && enemy && activeRequest) {
      const reqMoves = getRequestMoves();
      const firstMove = reqMoves[0] || { id: 'tackle' };
      const defaultMoveDetail = currentActivePoke.moves?.find(
        m => m.name.toLowerCase().replace(/[^a-z0-9]+/g, '') === firstMove.id
      ) || { power: 40, type: 'normal' };

      setCalcInputs(prev => ({
        ...prev,
        level: currentActivePoke.level || 50,
        power: defaultMoveDetail.power || 40,
        atk: currentActivePoke.attack || 100,
        def: enemy.defense || 100,
        stab: currentActivePoke.types.includes(defaultMoveDetail.type) ? 1.5 : 1.0,
        type: calculateTypeMultiplier(defaultMoveDetail.type, enemy.types)
      }));
    }
  }, [stage, playerSlots, choosingSlotIdx, enemy, playerTeam, activeRequest, getRequestMoves]);

  const handleDraftToggle = (poke) => {
    setSelectedTeam(prev => {
      const isSelected = prev.some(p => p.entryId === poke.entryId);
      if (isSelected) {
        return prev.filter(p => p.entryId !== poke.entryId);
      } else {
        if (prev.length >= currentFormat.teamSize) return prev;
        return [...prev, poke];
      }
    });
  };

  const startBattle = async (difficultyOverride = difficulty) => {
    if (selectedTeam.length < currentFormat.activeCount) return;
    setLoading(true);
    try {
      const resolvedTeam = [];
      for (const t of selectedTeam) {
        const pokeDetail = await fetchPokemonDetailsFromAPI(t.name);
        resolvedTeam.push(pokeDetail);
      }
      _setPlayerTeam(resolvedTeam);

      // Resolve 'random' weather to a real one before sending to engine
      const REAL_WEATHERS = ['clear', 'sun', 'rain', 'sandstorm', 'hail'];
      const resolvedWeather = weather === 'random'
        ? REAL_WEATHERS[Math.floor(Math.random() * REAL_WEATHERS.length)]
        : weather;

      // Start Showdown Battle Simulation on Backend
      const result = await api.startBattle({
        team: resolvedTeam,
        difficulty: difficultyOverride,
        weather: resolvedWeather,
        formatId: currentFormat.showdownFormat,
        battleFormat: currentFormat.id,
      });

      _setBattleId(result.battleId);
      _setActiveRequest(result.request);
      setWinner(null);
      setItems({ potions: 3, fullRestores: 1 });
      setStage('battle');
      setPlayerTurn(true);

      // Parse and sync initial player and enemy slots from logs
      const initialPlayerSlots = [null, null, null];
      const initialEnemySlots = [null, null, null];

      for (const line of result.logs) {
        if (line.startsWith('|switch|') || line.startsWith('|drag|')) {
          const parts = line.split('|');
          const target = parts[2];
          const details = parts[3];
          const hpStatus = parts[4];
          const speciesName = details.split(',')[0].trim();
          const { currentHp, maxHp, status } = parseCondition(hpStatus);

          let gender = null;
          if (details.includes(', M')) gender = '♂';
          else if (details.includes(', F')) gender = '♀';

          if (target.startsWith('p1')) {
            const slotChar = target.charAt(2);
            const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;
            const targetTeamIdx = findTeamIndexForBattleIdent(target, resolvedTeam, result.request, slotIdx);
            initialPlayerSlots[slotIdx] = targetTeamIdx;
          } else if (target.startsWith('p2')) {
            const slotChar = target.charAt(2);
            const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;
            const enemyDetail = await fetchPokemonDetailsFromAPI(speciesName);
            enemyDetail.currentHp = currentHp;
            enemyDetail.maxHp = maxHp;
            enemyDetail.status = status;
            if (gender) enemyDetail.gender = gender;
            initialEnemySlots[slotIdx] = enemyDetail;
          }
        }
      }

      _setPlayerSlots(initialPlayerSlots);
      _setEnemySlots(initialEnemySlots);
      _setChoosingSlotIdx(0);
      _setTurnChoices([]);
      setTargetSelection(null);

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

  const handleDifficultySelect = (nextDifficulty) => {
    setDifficulty(nextDifficulty);
    if (nextDifficulty === 'boss' && (battleFormat === 'doubles' || battleFormat === 'triples')) {
      setBattleFormat('singles3v3');
      setSelectedTeam([]);
    }
    if (nextDifficulty === 'trainer3v3' && selectedTeam.length === 3 && !loading) {
      startBattle(nextDifficulty);
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
      level: 50,
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

  const isValidTarget = (sourceIdx, targetType, targetIsFoe, targetIdx) => {
    if (battleFormat === 'singles' || battleFormat === 'doubles') {
      if (targetType === 'adjacentAlly') return !targetIsFoe && targetIdx !== sourceIdx;
      if (targetType === 'adjacentAllyOrSelf') return !targetIsFoe;
      if (targetType === 'adjacentFoe') return targetIsFoe;
      if (targetType === 'normal' || targetType === 'any') return targetIdx !== sourceIdx || targetIsFoe;

      // Multi-target logic checking
      if (targetType === 'allAdjacent') return targetIsFoe || targetIdx !== sourceIdx;
      if (targetType === 'allAdjacentFoes' || targetType === 'foeSide') return targetIsFoe;
      if (targetType === 'allySide') return !targetIsFoe && targetIdx !== sourceIdx;
      if (targetType === 'all') return true;
      if (targetType === 'self') return !targetIsFoe && targetIdx === sourceIdx;

      return true;
    }
    // Showdown's adjacency aligns p1a (0) across from p2c (activeCount - 1).
    const acrossFoeIdx = currentFormat.activeCount - 1 - targetIdx;
    const isAdjacent = targetIsFoe
      ? Math.abs(acrossFoeIdx - sourceIdx) <= 1
      : Math.abs(targetIdx - sourceIdx) === 1;
    if (targetType === 'adjacentAlly') return !targetIsFoe && isAdjacent;
    if (targetType === 'adjacentAllyOrSelf') return (!targetIsFoe && isAdjacent) || (targetIdx === sourceIdx);
    if (targetType === 'adjacentFoe') return targetIsFoe && isAdjacent;
    if (targetType === 'normal') return isAdjacent;
    if (targetType === 'any') return targetIdx !== sourceIdx || targetIsFoe;

    // Triples multi-target logic
    if (targetType === 'allAdjacent') return targetIdx !== sourceIdx && isAdjacent;
    if (targetType === 'allAdjacentFoes') return targetIsFoe && isAdjacent;
    if (targetType === 'foeSide') return targetIsFoe;
    if (targetType === 'allySide') return !targetIsFoe && targetIdx !== sourceIdx;
    if (targetType === 'all') return true;
    if (targetType === 'self') return !targetIsFoe && targetIdx === sourceIdx;

    return true;
  };

  // Playback turn logs line-by-line with 3D animations and audio cues synced
  const playTurnEvents = async (logs, nextRequest, nextWinner) => {
    setIsActing(true);
    setPlayerTurn(false);

    // Use refs so we always get the latest state even inside an async call
    let localTeam = [...playerTeamRef.current];
    let localEnemySlots = [...enemySlotsRef.current];
    let localPlayerSlots = [...playerSlotsRef.current];

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
        if (actor.startsWith('p1')) {
          setPlayerAnim('attack');
          const moveId = parts[3].toLowerCase().replace(/[^a-z0-9]+/g, '');
          if (moveId.includes('electric') || moveId.includes('thunder')) playAudioTone('spark');
          else if (moveId.includes('slash') || moveId.includes('wing')) playAudioTone('slash');
          else playAudioTone('hit');

          await new Promise(r => setTimeout(r, 450));
          setPlayerAnim('');
        } else if (actor.startsWith('p2')) {
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
        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p1')) {
          setPlayerAnim('hit');
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          localTeam[targetTeamIndex] = {
            ...localTeam[targetTeamIndex],
            currentHp,
            maxHp,
            status
          };
          _setPlayerTeam([...localTeam]);
          await new Promise(r => setTimeout(r, 450));
          setPlayerAnim('');
        } else if (target.startsWith('p2')) {
          setEnemyAnim('hit');
          if (localEnemySlots[slotIdx]) {
            localEnemySlots[slotIdx] = {
              ...localEnemySlots[slotIdx],
              currentHp,
              maxHp,
              status
            };
            _setEnemySlots([...localEnemySlots]);
          }
          await new Promise(r => setTimeout(r, 450));
          setEnemyAnim('');
        }
      }
      else if (type === '-heal') {
        const target = parts[2];
        const hpStatus = parts[3];
        const { currentHp, maxHp, status } = parseCondition(hpStatus);
        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p1')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          localTeam[targetTeamIndex] = {
            ...localTeam[targetTeamIndex],
            currentHp,
            maxHp,
            status
          };
          _setPlayerTeam([...localTeam]);
        } else if (target.startsWith('p2')) {
          if (localEnemySlots[slotIdx]) {
            localEnemySlots[slotIdx] = {
              ...localEnemySlots[slotIdx],
              currentHp,
              maxHp,
              status
            };
            _setEnemySlots([...localEnemySlots]);
          }
        }
        await new Promise(r => setTimeout(r, 350));
      }
      else if (type === '-status') {
        const target = parts[2];
        const status = parts[3];
        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p1')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          if (localTeam[targetTeamIndex]) localTeam[targetTeamIndex].status = status;
          _setPlayerTeam([...localTeam]);
        } else if (target.startsWith('p2')) {
          if (localEnemySlots[slotIdx]) localEnemySlots[slotIdx].status = status;
          _setEnemySlots([...localEnemySlots]);
        }
      }
      else if (type === '-curestatus') {
        const target = parts[2];
        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p1')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          if (localTeam[targetTeamIndex]) localTeam[targetTeamIndex].status = 'none';
          _setPlayerTeam([...localTeam]);
        } else if (target.startsWith('p2')) {
          if (localEnemySlots[slotIdx]) localEnemySlots[slotIdx].status = 'none';
          _setEnemySlots([...localEnemySlots]);
        }
      }
      else if (type === 'faint') {
        const target = parts[2];
        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p1')) {
          setPlayerAnim('faint');
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          if (localTeam[targetTeamIndex]) localTeam[targetTeamIndex].currentHp = 0;
          _setPlayerTeam([...localTeam]);

          localPlayerSlots[slotIdx] = null;
          _setPlayerSlots([...localPlayerSlots]);

          await new Promise(r => setTimeout(r, 600));
          setPlayerAnim('');
        } else if (target.startsWith('p2')) {
          setEnemyAnim('faint');
          if (localEnemySlots[slotIdx]) {
            localEnemySlots[slotIdx] = { ...localEnemySlots[slotIdx], currentHp: 0 };
            _setEnemySlots([...localEnemySlots]);
          }
          await new Promise(r => setTimeout(r, 600));
          setEnemyAnim('');
        }
      }
      else if (type === 'switch' || type === 'drag') {
        const target = parts[2];
        const details = parts[3];
        const hpStatus = parts[4];
        const speciesName = details.split(',')[0].trim();
        const { currentHp, maxHp, status } = parseCondition(hpStatus);

        let gender = null;
        if (details.includes(', M')) gender = '♂';
        else if (details.includes(', F')) gender = '♀';

        const slotChar = target.charAt(2);
        const slotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (target.startsWith('p2')) {
          const enemyDetail = await fetchPokemonDetailsFromAPI(speciesName);
          enemyDetail.currentHp = currentHp;
          enemyDetail.maxHp = maxHp;
          enemyDetail.status = status;
          if (gender) enemyDetail.gender = gender;
          localEnemySlots[slotIdx] = enemyDetail;
          _setEnemySlots([...localEnemySlots]);
          await new Promise(r => setTimeout(r, 450));
        } else if (target.startsWith('p1')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(target, localTeam, nextRequest, slotIdx);
          if (localTeam[targetTeamIndex]) {
            localTeam[targetTeamIndex] = { ...localTeam[targetTeamIndex], transformData: null };
            _setPlayerTeam([...localTeam]);
          }
          localPlayerSlots[slotIdx] = targetTeamIndex;
          _setPlayerSlots([...localPlayerSlots]);
          setPlayerAnim('');
          await new Promise(r => setTimeout(r, 450));
        }
      }
      else if (type === 'swap') {
        const source = parts[2];
        const targetPos = parseInt(parts[3], 10);
        const slotChar = source.charAt(2);
        const sourceSlotIdx = slotChar === 'a' ? 0 : slotChar === 'b' ? 1 : 2;

        if (source.startsWith('p1')) {
          const temp = localPlayerSlots[sourceSlotIdx];
          localPlayerSlots[sourceSlotIdx] = localPlayerSlots[targetPos];
          localPlayerSlots[targetPos] = temp;
          _setPlayerSlots([...localPlayerSlots]);
          await new Promise(r => setTimeout(r, 400));
        } else if (source.startsWith('p2')) {
          const temp = localEnemySlots[sourceSlotIdx];
          localEnemySlots[sourceSlotIdx] = localEnemySlots[targetPos];
          localEnemySlots[targetPos] = temp;
          _setEnemySlots([...localEnemySlots]);
          await new Promise(r => setTimeout(r, 400));
        }
      }
      else if (type === '-transform') {
        const source = parts[2];
        const target = parts[3];
        const sourceSlotChar = source.charAt(2);
        const sourceSlotIdx = sourceSlotChar === 'a' ? 0 : sourceSlotChar === 'b' ? 1 : 2;
        const targetSlotChar = target.charAt(2);
        const targetSlotIdx = targetSlotChar === 'a' ? 0 : targetSlotChar === 'b' ? 1 : 2;

        if (source.startsWith('p1') && target.startsWith('p2')) {
          const targetTeamIndex = findTeamIndexForBattleIdent(source, localTeam, nextRequest, sourceSlotIdx);
          const targetEnemy = localEnemySlots[targetSlotIdx];
          if (localTeam[targetTeamIndex]) {
            localTeam[targetTeamIndex] = {
              ...localTeam[targetTeamIndex],
              transformData: {
                sprite: targetEnemy?.sprite || '',
                displayName: targetEnemy?.displayName || '',
                moves: targetEnemy?.moves || []
              }
            };
            _setPlayerTeam([...localTeam]);
          }
          await new Promise(r => setTimeout(r, 600));
        } else if (source.startsWith('p2') && target.startsWith('p1')) {
          if (localEnemySlots[sourceSlotIdx]) {
            const playerTargetIdx = localPlayerSlots[targetSlotIdx];
            const playerTarget = playerTargetIdx !== null ? localTeam[playerTargetIdx] : null;
            localEnemySlots[sourceSlotIdx].transformData = {
              sprite: playerTarget?.sprite || '',
              displayName: playerTarget?.displayName || '',
              moves: playerTarget?.moves || []
            };
            _setEnemySlots([...localEnemySlots]);
          }
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }

    // Set final synced states
    _setActiveRequest(nextRequest);

    if (nextRequest && nextRequest.side && nextRequest.side.pokemon && nextWinner === null) {
      localTeam = syncTeamFromRequest(localTeam, nextRequest);
      _setPlayerTeam([...localTeam]);
    }

    _setPlayerSlots(localPlayerSlots);
    _setEnemySlots(localEnemySlots);

    if (nextWinner) {
      setWinner(nextWinner);
      if (nextWinner === 'player') {
        const payout = DIFFICULTIES.find((entry) => entry.id === difficulty)?.coins || 150;
        addCoins(payout);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setPlayerTurn(true);
      if (nextRequest?.forceSwitch) {
        const forceSwitchArray = Array.isArray(nextRequest.forceSwitch)
          ? nextRequest.forceSwitch
          : [!!nextRequest.forceSwitch];
        const firstSwitchIdx = forceSwitchArray.indexOf(true);
        _setChoosingSlotIdx(firstSwitchIdx !== -1 ? firstSwitchIdx : 0);
        setShowSwitch(true);
      } else {
        const initialChoices = [];
        let firstSlotIdx = 0;
        while (firstSlotIdx < currentFormat.activeCount && (!nextRequest?.active?.[firstSlotIdx] || localPlayerSlots[firstSlotIdx] === null || localTeam[localPlayerSlots[firstSlotIdx]]?.currentHp === 0)) {
          initialChoices.push('pass');
          firstSlotIdx++;
        }
        _setTurnChoices(initialChoices);
        _setChoosingSlotIdx(firstSlotIdx < currentFormat.activeCount ? firstSlotIdx : 0);
      }
    }

    setIsActing(false);
  };

  const proceedToNextSlot = async (choice, forceSwitchArray = null) => {
    const isForcedSwitch = !!forceSwitchArray;
    const activeCount = currentFormat.activeCount;

    if (isForcedSwitch) {
      // Always read from refs to avoid stale closure
      const nextChoices = [...turnChoicesRef.current];
      nextChoices[choosingSlotIdxRef.current] = choice;

      const getAvailableSwitchCount = (currentChoices) => {
        let count = 0;
        for (let i = 0; i < playerTeamRef.current.length; i++) {
          const reqMon = findRequestPokemonForTeamIndex(activeRequestRef.current, playerTeamRef.current, i);
          const isFainted = reqMon ? reqMon.condition.includes('fnt') || reqMon.condition.startsWith('0') : false;
          const isActive = reqMon ? reqMon.active : false;

          const requestSlotIndex = getRequestSlotForTeamIndex(activeRequestRef.current, playerTeamRef.current, i);
          const choiceStr = `switch ${requestSlotIndex + 1}`;
          const isAlreadyChosen = currentChoices.includes(choiceStr);

          if (!isFainted && !isActive && !isAlreadyChosen) {
            count++;
          }
        }
        return count;
      };

      // Find next slot that needs a switch
      let nextSlotIdx = choosingSlotIdxRef.current + 1;
      while (nextSlotIdx < forceSwitchArray.length && !forceSwitchArray[nextSlotIdx]) {
        nextChoices[nextSlotIdx] = 'pass';
        nextSlotIdx++;
      }

      if (nextSlotIdx < forceSwitchArray.length && getAvailableSwitchCount(nextChoices) > 0) {
        _setChoosingSlotIdx(nextSlotIdx);
        _setTurnChoices(nextChoices);
      } else {
        // Complete the switch choices array with passes if any empty or no switches left
        for (let k = 0; k < forceSwitchArray.length; k++) {
          if (nextChoices[k] === undefined) nextChoices[k] = 'pass';
        }
        const combinedChoice = nextChoices.join(', ');
        setLoading(true);
        try {
          const result = await api.submitBattleChoice({ battleId: battleIdRef.current, choice: combinedChoice });
          playTurnEvents(result.logs, result.request, result.winner);
        } catch (e) {
          alert("Error submitting choice: " + e.message);
        } finally {
          setLoading(false);
          _setTurnChoices([]);
        }
      }
    } else {
      // Always read from refs to avoid stale closure
      const nextChoices = [...turnChoicesRef.current, choice];
      _setTurnChoices(nextChoices);

      const currentActiveRequest = activeRequestRef.current;
      const currentPlayerSlots = playerSlotsRef.current;
      const currentPlayerTeam = playerTeamRef.current;

      // Find the next slot that needs a choice
      let nextSlotIdx = choosingSlotIdxRef.current + 1;
      while (nextSlotIdx < activeCount && (!currentActiveRequest?.active?.[nextSlotIdx] || currentPlayerSlots[nextSlotIdx] === null || currentPlayerTeam[currentPlayerSlots[nextSlotIdx]]?.currentHp === 0)) {
        nextChoices.push('pass');
        nextSlotIdx++;
      }

      if (nextSlotIdx < activeCount) {
        _setChoosingSlotIdx(nextSlotIdx);
      } else {
        const combinedChoice = nextChoices.join(', ');
        setLoading(true);
        try {
          const result = await api.submitBattleChoice({ battleId: battleIdRef.current, choice: combinedChoice });
          playTurnEvents(result.logs, result.request, result.winner);
        } catch (e) {
          alert("Error submitting choice: " + e.message);
        } finally {
          setLoading(false);
          _setTurnChoices([]);
        }
      }
    }
  };

  const handlePlayerAttack = async (moveSlotIndex) => {
    if (!playerTurn || isActing || winner !== null) return;
    setBagOpen(false);
    setShowSwitch(false);

    const activePokeReq = activeRequest?.active?.[choosingSlotIdx];
    const reqMove = activePokeReq?.moves?.[moveSlotIndex];
    if (!reqMove) return;

    const targetType = reqMove.target;
    const needsTarget = currentFormat.activeCount >= 2 && ['normal', 'adjacentFoe', 'adjacentAlly', 'adjacentAllyOrSelf', 'any'].includes(targetType);

    // Check if it's a multi-target or default-target move
    const multiTargetTypes = ['allAdjacent', 'allAdjacentFoes', 'all', 'foeSide', 'allySide', 'self', 'randomNormal'];
    const isMultiTarget = currentFormat.activeCount >= 2 && multiTargetTypes.includes(targetType);

    if (needsTarget || isMultiTarget) {
      setTargetSelection({ moveSlotIndex, targetType, isMultiTarget });
    } else {
      proceedToNextSlot(`move ${moveSlotIndex + 1}`);
    }
  };

  const handleSelectTarget = (targetIsFoe, targetIdx) => {
    if (!targetSelection) return;

    if (targetSelection.itemType) {
      if (targetIsFoe) return;
      handleConfirmUseItem(targetSelection.itemType, targetIdx);
      return;
    }

    const { moveSlotIndex } = targetSelection;

    // Compute absolute targetLoc relative to side
    // Showdown targetLoc maps directly to targetIdx + 1 for foes
    const targetLoc = targetIsFoe
      ? (targetIdx + 1)
      : -(targetIdx + 1);

    setTargetSelection(null);
    proceedToNextSlot(`move ${moveSlotIndex + 1} ${targetLoc}`);
  };

  const handleSwapActive = async (idx) => {
    if (!playerTurn || isActing || winner !== null || playerSlots.includes(idx)) return;
    setShowSwitch(false);

    const forceSwitchArray = activeRequest?.forceSwitch
      ? (Array.isArray(activeRequest.forceSwitch) ? activeRequest.forceSwitch : [!!activeRequest.forceSwitch])
      : null;

    const requestSlotIndex = getRequestSlotForTeamIndex(activeRequest, playerTeam, idx);
    const choice = `switch ${requestSlotIndex + 1}`;

    if (forceSwitchArray) {
      proceedToNextSlot(choice, forceSwitchArray);
    } else {
      proceedToNextSlot(choice);
    }
  };

  const handleUseItem = async (type) => {
    if (!playerTurn || isActing || winner !== null) return;

    if (currentFormat.activeCount > 1) {
      setTargetSelection({ itemType: type, isMultiTarget: false });
      return;
    }

    const choice = type === 'potion' ? 'potion' : 'fullrestore';

    setItems(prev => ({
      ...prev,
      potions: type === 'potion' ? prev.potions - 1 : prev.potions,
      fullRestores: type === 'fullRestore' ? prev.fullRestores - 1 : prev.fullRestores
    }));
    setBagOpen(false);

    proceedToNextSlot(choice);
  };

  const handleConfirmUseItem = (type, targetIdx) => {
    const choice = type === 'potion' ? `potion ${targetIdx}` : `fullrestore ${targetIdx}`;

    setItems(prev => ({
      ...prev,
      potions: type === 'potion' ? prev.potions - 1 : prev.potions,
      fullRestores: type === 'fullRestore' ? prev.fullRestores - 1 : prev.fullRestores
    }));
    setBagOpen(false);
    setTargetSelection(null);

    proceedToNextSlot(choice);
  };


  const getMappedMoves = () => {
    const currentActivePoke = playerSlots[choosingSlotIdx] !== null ? playerTeam[playerSlots[choosingSlotIdx]] : null;
    return getRequestMoves().map((reqMove) => {
      const allMoves = currentActivePoke?.transformData?.moves || currentActivePoke?.moves || [];
      const detail = allMoves.find(
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

  return (
    <div className="minigames-screen" id="battle-arena-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Battle Ground</p>
          <h1 className="minigames-title">Pokémon Battle Arena</h1>
        </div>
        <div className="minigames-header-stats" style={{ display: 'flex', gap: '12px' }}>
          {stage !== 'draft' && (
            <button className="btn-back flee" id="flee-arena-btn" onClick={() => setStage('draft')}>
              🏳️ Flee Battle
            </button>
          )}
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
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <h2 className="minigame-inner-title">Draft Your Squad (Choose {currentFormat.teamSize})</h2>
                <p className="minigame-inner-subtitle" style={{ marginBottom: 0 }}>Select {currentFormat.teamSize} Pokémon for a <strong>{currentFormat.name}</strong>.</p>
              </div>
            </div>

            <div className="battle-arena-config-dropdowns">
              <BattleDropdown
                id="difficulty-dropdown"
                label="Difficulty"
                options={DIFFICULTIES}
                value={difficulty}
                onChange={handleDifficultySelect}
              />
              <BattleDropdown
                id="weather-dropdown"
                label="Weather"
                options={WEATHER_OPTIONS}
                value={weather}
                onChange={setWeather}
              />
              <BattleDropdown
                id="format-dropdown"
                label="Battle Format"
                options={BATTLE_FORMATS.filter(f => {
                  if (difficulty === 'boss' && (f.id === 'doubles' || f.id === 'triples')) return false;
                  return true;
                }).map(f => ({ ...f, desc: f.description }))}
                value={battleFormat}
                onChange={(id) => { setBattleFormat(id); setSelectedTeam([]); }}
              />
            </div>

            <div className="draft-pool-scroll-container">
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
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-back"
                id="start-battle-footer-btn"
                disabled={selectedTeam.length < currentFormat.activeCount || loading}
                onClick={() => startBattle()}
                style={{ background: selectedTeam.length >= currentFormat.activeCount ? 'var(--px-sky)' : 'rgba(255,255,255,0.02)', borderColor: selectedTeam.length >= currentFormat.activeCount ? 'var(--px-sky)' : 'var(--px-border)' }}
              >
                <Swords size={16} /> Start Battle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="battle-layout-v2">

          {/* ── Column 1: Battle Logs ── */}
          <div className="bl-logs-col" id="battle-logs-col">
            <div className="bl-col-header">
              <span className="bl-col-label">⚡ Combat Log</span>
            </div>
            <div className="bl-logs-stream" ref={logsContainerRef}>
              {battleLogs.length === 0 ? (
                <div className="bl-log-empty">Battle events will appear here...</div>
              ) : (
                battleLogs.map((log, i) => (
                  <div key={i} className="bl-log-line" dangerouslySetInnerHTML={{ __html: log }} />
                ))
              )}
            </div>
          </div>

          {/* ── Column 2: Battle Stage (center) ── */}
          <div className="bl-stage-col">
            <div className="battle-stage" id="battle-stage-arena">
              <div className="battle-stage-backdrop-effect" />
              <div className="stage-floor" />

              {/* Enemy Side */}
              <div className="stage-pokemon-row" style={{ justifyContent: 'flex-end', gap: '20px' }}>
                {Array.from({ length: currentFormat.activeCount }).map((_, i) => {
                  const slotIdx = currentFormat.activeCount - 1 - i;
                  const activeEnemy = enemySlots[slotIdx];
                  if (!activeEnemy) return <div key={slotIdx} className="stage-pokemon-container empty" style={{ width: `${90 / currentFormat.activeCount}%` }} />;

                  const isFainted = activeEnemy.currentHp <= 0;
                  if (isFainted) return <div key={slotIdx} className="stage-pokemon-container empty" style={{ width: `${90 / currentFormat.activeCount}%` }} />;

                  const isTargetable = targetSelection && isValidTarget(choosingSlotIdx, targetSelection.targetType, true, slotIdx);
                  return (
                    <div
                      key={slotIdx}
                      className={`stage-pokemon-container ${isTargetable ? 'targetable' : ''}`}
                      onClick={() => isTargetable && handleSelectTarget(true, slotIdx)}
                      style={{
                        width: `${90 / currentFormat.activeCount}%`,
                        cursor: isTargetable ? 'pointer' : 'default',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div
                        className="pokemon-hp-panel"
                        id={`enemy-hp-panel-${slotIdx}`}
                        style={{
                          border: isTargetable ? '2px solid var(--px-accent)' : '1px solid var(--px-border)',
                          transition: 'border-color 0.3s ease'
                        }}
                      >
                        <div className="hp-panel-header" style={{ justifyContent: 'flex-start' }}>
                          <span className="hp-pokemon-level" style={{ marginRight: '8px' }}>Lvl {activeEnemy.level || 50}</span>
                          <span className="hp-pokemon-name">
                            {activeEnemy.gender && <span style={{ opacity: 0.7, marginRight: '4px' }}>{activeEnemy.gender}</span>} {activeEnemy.transformData?.displayName || activeEnemy.displayName}
                          </span>
                        </div>
                        <div className="hp-bar-outer">
                          <div
                            className={`hp-bar-inner ${activeEnemy.currentHp / activeEnemy.maxHp > 0.5 ? 'high' : activeEnemy.currentHp / activeEnemy.maxHp > 0.2 ? 'medium' : 'low'}`}
                            style={{ width: `${(activeEnemy.currentHp / activeEnemy.maxHp) * 100}%` }}
                          />
                        </div>
                        <div className="hp-numeric">
                          {activeEnemy.status !== 'none' && <span className="status-tag" style={{ marginRight: '6px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' }}>{activeEnemy.status}</span>}
                          HP {activeEnemy.currentHp} / {activeEnemy.maxHp}
                        </div>
                      </div>
                      <div
                        className={`pokemon-avatar-wrapper ${enemyAnim || 'idle'}`}
                        id={`enemy-avatar-wrapper-${slotIdx}`}
                        data-status={activeEnemy.status !== 'none' ? activeEnemy.status : undefined}
                      >
                        <img src={activeEnemy.transformData?.sprite || activeEnemy.sprite} alt={activeEnemy.transformData?.displayName || activeEnemy.displayName} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Player Side */}
              <div className="stage-pokemon-row" style={{ marginTop: 'auto', gap: '20px' }}>
                {Array.from({ length: currentFormat.activeCount }).map((_, slotIdx) => {
                  const teamIdx = playerSlots[slotIdx];
                  if (teamIdx === null || teamIdx === undefined) return <div key={`p-${slotIdx}`} className="stage-pokemon-container empty" style={{ width: `${90 / currentFormat.activeCount}%` }} />;
                  const activePoke = playerTeam[teamIdx];
                  if (!activePoke) return <div key={`p-${slotIdx}`} className="stage-pokemon-container empty" style={{ width: `${90 / currentFormat.activeCount}%` }} />;

                  const isFainted = activePoke.currentHp <= 0;
                  if (isFainted) return <div key={`p-${slotIdx}`} className="stage-pokemon-container empty" style={{ width: `${90 / currentFormat.activeCount}%` }} />;

                  const isChoosing = choosingSlotIdx === slotIdx && playerTurn && !targetSelection;
                  const isTargetable = targetSelection && isValidTarget(choosingSlotIdx, targetSelection.targetType, false, slotIdx);
                  return (
                    <div
                      key={`p-${slotIdx}`}
                      className={`stage-pokemon-container ${isChoosing ? 'choosing' : ''} ${isTargetable ? 'targetable' : ''}`}
                      onClick={() => isTargetable && handleSelectTarget(false, slotIdx)}
                      style={{
                        width: `${90 / currentFormat.activeCount}%`,
                        cursor: isTargetable ? 'pointer' : 'default',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div
                        className={`pokemon-hp-panel ${isChoosing ? 'active-choosing' : ''}`}
                        id={`player-hp-panel-${slotIdx}`}
                        style={{
                          border: isChoosing ? '2px solid var(--px-sky)' : isTargetable ? '2px solid var(--px-accent)' : '1px solid var(--px-border)',
                          boxShadow: isChoosing ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="hp-panel-header">
                          <span className="hp-pokemon-name">
                            {activePoke.transformData?.displayName || activePoke.displayName} {activePoke.gender && <span style={{ opacity: 0.7 }}>{activePoke.gender}</span>}
                          </span>
                          <span className="hp-pokemon-level">Lvl {activePoke.level || 50}</span>
                        </div>
                        <div className="hp-bar-outer">
                          <div
                            className={`hp-bar-inner ${activePoke.currentHp / activePoke.maxHp > 0.5 ? 'high' : activePoke.currentHp / activePoke.maxHp > 0.2 ? 'medium' : 'low'}`}
                            style={{ width: `${(activePoke.currentHp / activePoke.maxHp) * 100}%` }}
                          />
                        </div>
                        <div className="hp-numeric">
                          {activePoke.currentHp} / {activePoke.maxHp} HP
                          {activePoke.status !== 'none' && <span className="status-tag" style={{ marginLeft: '6px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', textTransform: 'uppercase' }}>{activePoke.status}</span>}
                        </div>
                      </div>
                      <div
                        className={`pokemon-avatar-wrapper ${playerAnim || 'idle'} ${isChoosing ? 'animate-pulse' : ''}`}
                        id={`player-avatar-wrapper-${slotIdx}`}
                        data-status={activePoke.status !== 'none' ? activePoke.status : undefined}
                        style={isChoosing ? { filter: 'drop-shadow(0 0 10px var(--px-sky))', transform: 'scaleX(-1)' } : { transform: 'scaleX(-1)' }}
                      >
                        <img src={activePoke.transformData?.sprite || activePoke.sprite} alt={activePoke.transformData?.displayName || activePoke.displayName} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target selection panel — appears below the arena when picking a target */}
            {targetSelection && (
              <div className="bl-target-select-panel" id="target-select-panel">
                <div className="bl-target-select-header">
                  <span className="bl-target-select-title">
                    {targetSelection.isMultiTarget ? '☄️ Multiple Targets Selected' : '🎯 Choose a Target'}
                  </span>
                  <button
                    className="bl-target-cancel-btn"
                    onClick={() => setTargetSelection(null)}
                    title="Cancel target selection"
                  >
                    ✕ Cancel
                  </button>
                </div>
                <div className="bl-target-select-grid">
                  {/* Foe Pokémon */}
                  {Array.from({ length: currentFormat.activeCount }).map((_, slotIdx) => {
                    const foe = enemySlots[slotIdx];
                    if (!foe) return null;
                    const canTarget = isValidTarget(choosingSlotIdx, targetSelection.targetType, true, slotIdx);
                    const isFainted = foe.currentHp <= 0;
                    if (isFainted || !canTarget) return null;
                    const hpPct = foe.currentHp / foe.maxHp;
                    return (
                      <button
                        key={`foe-${slotIdx}`}
                        id={`target-foe-btn-${slotIdx}`}
                        className={`bl-target-card foe ${targetSelection.isMultiTarget ? 'multi-targeted' : ''}`}
                        onClick={() => !targetSelection.isMultiTarget && handleSelectTarget(true, slotIdx)}
                        style={targetSelection.isMultiTarget ? { cursor: 'default', borderColor: '#ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' } : {}}
                      >
                        <div className="bl-target-card-badge foe">FOE</div>
                        <img
                          src={foe.transformData?.sprite || foe.sprite}
                          alt={foe.displayName}
                          className="bl-target-card-sprite"
                        />
                        <div className="bl-target-card-info">
                          <span className="bl-target-card-name">{foe.transformData?.displayName || foe.displayName} <small style={{ opacity: 0.8, fontSize: '0.8em' }}>Lv. {foe.level || 50}</small></span>
                          <div className="bl-target-card-hpbar-outer">
                            <div
                              className={`bl-target-card-hpbar-inner ${hpPct > 0.5 ? 'high' : hpPct > 0.2 ? 'medium' : 'low'}`}
                              style={{ width: `${hpPct * 100}%` }}
                            />
                          </div>
                          <span className="bl-target-card-hp">{foe.currentHp} / {foe.maxHp} HP</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Ally Pokémon (only for moves that can target allies) */}
                  {Array.from({ length: currentFormat.activeCount }).map((_, slotIdx) => {
                    const teamIdx = playerSlots[slotIdx];
                    if (teamIdx === null || teamIdx === undefined) return null;
                    const ally = playerTeam[teamIdx];
                    if (!ally) return null;
                    const canTarget = targetSelection.itemType ? true : isValidTarget(choosingSlotIdx, targetSelection.targetType, false, slotIdx);
                    const isFainted = ally.currentHp <= 0;
                    const isSelf = slotIdx === choosingSlotIdx;
                    if (isFainted || !canTarget) return null;
                    const hpPct = ally.currentHp / ally.maxHp;
                    return (
                      <button
                        key={`ally-${slotIdx}`}
                        id={`target-ally-btn-${slotIdx}`}
                        className={`bl-target-card ally ${isSelf ? 'self' : ''} ${targetSelection.isMultiTarget ? 'multi-targeted' : ''}`}
                        onClick={() => !targetSelection.isMultiTarget && handleSelectTarget(false, slotIdx)}
                        style={targetSelection.isMultiTarget && !isSelf ? { cursor: 'default', borderColor: 'var(--px-sky)', boxShadow: '0 0 10px rgba(56, 189, 248, 0.4)' } : (targetSelection.isMultiTarget && isSelf ? { cursor: 'default' } : {})}
                      >
                        <div className="bl-target-card-badge ally">{isSelf ? 'SELF' : 'ALLY'}</div>
                        <img
                          src={ally.transformData?.sprite || ally.sprite}
                          alt={ally.displayName}
                          className="bl-target-card-sprite"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        <div className="bl-target-card-info">
                          <span className="bl-target-card-name">{ally.transformData?.displayName || ally.displayName} <small style={{ opacity: 0.8, fontSize: '0.8em' }}>Lv. {ally.level || 50}</small></span>
                          <div className="bl-target-card-hpbar-outer">
                            <div
                              className={`bl-target-card-hpbar-inner ${hpPct > 0.5 ? 'high' : hpPct > 0.2 ? 'medium' : 'low'}`}
                              style={{ width: `${hpPct * 100}%` }}
                            />
                          </div>
                          <span className="bl-target-card-hp">{ally.currentHp} / {ally.maxHp} HP</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {targetSelection.isMultiTarget && (
                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                    <button
                      className="btn-action-move"
                      style={{ background: 'var(--px-accent)', color: '#fff', width: '100%', padding: '12px', fontSize: '14px', border: 'none' }}
                      onClick={() => {
                        proceedToNextSlot(`move ${targetSelection.moveSlotIndex + 1}`);
                        setTargetSelection(null);
                      }}
                    >
                      ⚔️ Confirm Attack Area
                    </button>
                  </div>
                )}
              </div>
            )}

            {winner !== null && (
              <div className="bl-winner-panel">
                {winner === 'player' ? (
                  <div className="battle-winner-banner" id="winner-banner">🏆 Victory! You defeated the opponent!</div>
                ) : (
                  <div className="battle-loser-banner" id="loser-banner">💀 Defeated... Your Pokémon all fainted.</div>
                )}
                <button className="btn-menu-action danger" id="rematch-btn" onClick={() => setStage('draft')} style={{ marginTop: '10px' }}>
                  <RotateCcw size={14} /> Leave Arena / Rematch
                </button>
              </div>
            )}
          </div>

          {/* ── Column 3: Swap Pokémon & Actions ── */}
          <div className="bl-swap-col" id="swap-col">
            <SwitchUI 
              activeRequest={activeRequest}
              playerTeam={playerTeam}
              playerSlots={playerSlots}
              turnChoicesRef={turnChoicesRef}
              setShowSwitch={setShowSwitch}
              proceedToNextSlot={proceedToNextSlot}
              handleSwapActive={handleSwapActive}
            />

            {winner === null && (
              <ActionGrid
                targetSelection={targetSelection}
                showSwitch={showSwitch}
                playerTeam={playerTeam}
                playerSlots={playerSlots}
                choosingSlotIdx={choosingSlotIdx}
                getMappedMoves={getMappedMoves}
                playerTurn={playerTurn}
                isActing={isActing}
                handlePlayerAttack={handlePlayerAttack}
                battleFormat={battleFormat}
                proceedToNextSlot={proceedToNextSlot}
              />
            )}
          </div>

          <TrainerColumn 
            winner={winner}
            bagOpen={bagOpen}
            setBagOpen={setBagOpen}
            items={items}
            handleUseItem={handleUseItem}
            playerTeam={playerTeam}
            activeRequest={activeRequest}
            playerSlots={playerSlots}
            currentFormat={currentFormat}
            setShowCalc={setShowCalc}
          />
        </div>
      )}

      {/* Interactive Damage Calculator Drawer Overlay */}
      <DamageCalculator 
        showCalc={showCalc}
        setShowCalc={setShowCalc}
        calcInputs={calcInputs}
        setCalcInputs={setCalcInputs}
        getDmgRolls={getDmgRolls}
        calcOutput={calcOutput}
      />
    </div>
  );
}
