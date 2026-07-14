import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Swords,
  TestTube2,
} from "lucide-react";
import { api } from "../api";
import { useGame, SCREENS } from "../context/GameContext";
import "../styles/minigames.css";

const TYPE_COLORS = {
  Normal: "#9fa19f",
  Fire: "#e62829",
  Water: "#2980ef",
  Grass: "#3fa129",
  Electric: "#fac000",
  Poison: "#9141cb",
  Flying: "#81b9ef",
  Psychic: "#ef4179",
  Dragon: "#5060e1",
  Steel: "#60a1b8",
  Fairy: "#ef70ef",
};

const WEATHER_OPTIONS = [
  { id: "clear", label: "Clear" },
  { id: "rain", label: "Rain" },
  { id: "sun", label: "Sun" },
  { id: "sandstorm", label: "Sandstorm" },
  { id: "hail", label: "Hail" },
];

const RIVAL_TEAM = [
  {
    id: "p2-charmander",
    species: "Charmander",
    displayName: "Cinder",
    sprite: "/assets/images/images/0004.png",
    level: 48,
    currentHp: 118,
    maxHp: 118,
    stats: { hp: 118, atk: 96, def: 68, spa: 104, spd: 74, spe: 112 },
    moves: ["Flamethrower", "Scratch", "Dragon Breath", "Smokescreen"],
    ability: "Blaze",
    item: "Charcoal",
    status: "none",
  },
  {
    id: "p2-bulbasaur",
    species: "Bulbasaur",
    displayName: "Bloom",
    sprite: "/assets/images/images/0001.png",
    level: 48,
    currentHp: 128,
    maxHp: 128,
    stats: { hp: 128, atk: 78, def: 86, spa: 112, spd: 108, spe: 74 },
    moves: ["Giga Drain", "Sludge Bomb", "Tackle", "Growl"],
    ability: "Overgrow",
    item: "Miracle Seed",
    status: "none",
  },
  {
    id: "p2-eevee",
    species: "Eevee",
    displayName: "Ace",
    sprite: "/assets/images/images/0133.png",
    level: 48,
    currentHp: 126,
    maxHp: 126,
    stats: { hp: 126, atk: 102, def: 80, spa: 76, spd: 94, spe: 92 },
    moves: ["Quick Attack", "Bite", "Swift", "Tail Whip"],
    ability: "Adaptability",
    item: "Silk Scarf",
    status: "none",
  },
];

function parseCondition(condition) {
  if (!condition || condition.includes("fnt") || condition.startsWith("0")) {
    return { currentHp: 0, maxHp: 100, status: "fnt" };
  }
  const [hpPart, statusPart] = condition.split(" ");
  const [currentHp, maxHp] = hpPart.split("/").map(Number);
  return {
    currentHp: currentHp || 0,
    maxHp: maxHp || 100,
    status: statusPart || "none",
  };
}

function cleanName(ident) {
  if (!ident) return "";
  const colonIndex = ident.indexOf(":");
  return colonIndex >= 0 ? ident.slice(colonIndex + 1).trim() : ident;
}

function findTeamFixture(requestPokemon, team, fallbackIndex = 0) {
  return team[fallbackIndex] || team[0];
}

function getRequestTeamSlots(request, team) {
  const requestPokemon = request?.side?.pokemon || [];
  if (!requestPokemon.length) {
    return team.map((pokemon, index) => ({
      ...pokemon,
      active: index === 0,
      requestIndex: index,
      currentHp: pokemon.currentHp ?? pokemon.maxHp,
      maxHp: pokemon.maxHp,
      status: pokemon.status || "none",
    }));
  }

  return requestPokemon.map((pokemon, requestIndex) => {
    const fixture = findTeamFixture(pokemon, team, requestIndex);
    const hp = parseCondition(pokemon?.condition);
    return {
      ...fixture,
      ...hp,
      active: Boolean(pokemon?.active),
      requestIndex,
      condition: pokemon?.condition,
    };
  });
}

function formatLog(line) {
  if (!line?.startsWith("|")) return null;
  const parts = line.split("|");
  switch (parts[1]) {
    case "switch":
      return `${cleanName(parts[2])} entered the battle.`;
    case "move":
      return `${cleanName(parts[2])} used ${parts[3]}.`;
    case "-damage":
      return `${cleanName(parts[2])} took damage.`;
    case "-heal":
      return `${cleanName(parts[2])} recovered HP.`;
    case "-status":
      return `${cleanName(parts[2])} is now ${parts[3]}.`;
    case "-curestatus":
      return `${cleanName(parts[2])} recovered from status.`;
    case "-supereffective":
      return "It was super effective.";
    case "-resisted":
      return "It was not very effective.";
    case "-crit":
      return "Critical hit.";
    case "-weather":
      return parts[3] === "[upkeep]"
        ? `Weather remains ${parts[2]}.`
        : `Weather changed to ${parts[2]}.`;
    case "faint":
      return `${cleanName(parts[2])} fainted.`;
    case "win":
      return `${parts[2]} wins.`;
    default:
      return null;
  }
}

function hpPercent(pokemon) {
  if (!pokemon?.maxHp) return 0;
  return Math.max(
    0,
    Math.min(100, Math.round((pokemon.currentHp / pokemon.maxHp) * 100))
  );
}

function titleCaseIdentifier(value) {
  return String(value || "")
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function localSpriteForPokemon(id) {
  return `/assets/images/images/${String(id).padStart(4, "0")}.png`;
}

function starterIcon(types = []) {
  const first = types[0];
  if (first === "grass") return "GRS";
  if (first === "fire") return "FIR";
  if (first === "water") return "WTR";
  if (first === "electric") return "ELC";
  return "PKM";
}

export function BattleArenaV2Screen() {
  const { goTo, user } = useGame();
  const [stage, setStage] = useState("draft");
  const [weather, setWeather] = useState("clear");
  const [draftPool, setDraftPool] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [rivalTeam, setRivalTeam] = useState(RIVAL_TEAM);
  const [session, setSession] = useState(null);
  const [logs, setLogs] = useState([]);
  const [moveCatalog, setMoveCatalog] = useState({});
  const [items, setItems] = useState({ potions: 2, fullRestores: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadDraftPool() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getStarters();
        const entries = (data.starters || []).filter(
          (entry) => entry.formTier === 1
        );
        const shuffled = [...entries].sort(() => 0.5 - Math.random());
        if (mounted) setDraftPool(shuffled.slice(0, 18));
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDraftPool();
    return () => {
      mounted = false;
    };
  }, []);

  const playerSlots = useMemo(
    () => getRequestTeamSlots(session?.requests?.p1, playerTeam),
    [session, playerTeam]
  );
  const rivalSlots = useMemo(
    () => getRequestTeamSlots(session?.requests?.p2, rivalTeam),
    [session, rivalTeam]
  );
  const player = useMemo(
    () => playerSlots.find((pokemon) => pokemon.active) || playerSlots[0],
    [playerSlots]
  );
  const rival = useMemo(
    () => rivalSlots.find((pokemon) => pokemon.active) || rivalSlots[0],
    [rivalSlots]
  );
  const requestMoves = session?.requests?.p1?.active?.[0]?.moves || [];

  const appendLogs = (rawLogs) => {
    const formatted = rawLogs.map(formatLog).filter(Boolean);
    setLogs((prev) => [...prev, ...formatted].slice(-12));
  };

  const loadMoveCatalog = async (moves) => {
    const next = {};
    await Promise.all(
      moves.map(async (move) => {
        try {
          next[move.id] = await api.getBattleEngineMove(move.id);
        } catch {
          next[move.id] = null;
        }
      })
    );
    setMoveCatalog((prev) => ({ ...prev, ...next }));
  };

  const handleDraftToggle = (poke) => {
    setSelectedTeam((prev) => {
      const isSelected = prev.some(
        (selected) => selected.entryId === poke.entryId
      );
      if (isSelected)
        return prev.filter((selected) => selected.entryId !== poke.entryId);
      if (prev.length >= 3) return prev;
      return [...prev, poke];
    });
  };

  const fetchPokemonDetailsForEngine = async (entry, slotIndex) => {
    const res = await fetch(`/api/pokemon/${String(entry.name).toLowerCase()}`);
    if (!res.ok)
      throw new Error(`Could not load ${entry.displayName || entry.name}`);
    const data = await res.json();
    const stats = {};
    data.stats.forEach((statRow) => {
      stats[statRow.stat.name] = statRow.base_stat;
    });

    const moves = [];
    for (const moveName of data.moves
      .slice(0, 4)
      .map((moveRow) => moveRow.move.name)) {
      try {
        const moveData = await api.getBattleEngineMove(moveName);
        moves.push(moveData.name);
      } catch {
        // Skip moves Showdown cannot run; fallback below keeps the payload valid.
      }
    }

    const hp = (stats.hp || 60) + 80;
    return {
      id: `p1-draft-${slotIndex + 1}-${data.name}`,
      species: titleCaseIdentifier(data.name),
      displayName: entry.displayName || titleCaseIdentifier(data.name),
      sprite: localSpriteForPokemon(data.id),
      level: 50,
      currentHp: hp,
      maxHp: hp,
      stats: {
        hp,
        atk: (stats.attack || 50) + 30,
        def: (stats.defense || 50) + 30,
        spa: (stats["special-attack"] || 50) + 30,
        spd: (stats["special-defense"] || 50) + 30,
        spe: (stats.speed || 50) + 30,
      },
      moves: moves.length ? moves : ["Tackle"],
      ability: "",
      item: slotIndex === 0 ? "Leftovers" : "",
      status: "none",
    };
  };

  const startBattle = async () => {
    if (selectedTeam.length !== 3) return;
    setLoading(true);
    setError("");
    try {
      const resolvedTeam = [];
      for (let index = 0; index < selectedTeam.length; index += 1) {
        resolvedTeam.push(
          await fetchPokemonDetailsForEngine(selectedTeam[index], index)
        );
      }

      const result = await api.createBattleEngineSession({
        formatId: "gen7customgame",
        weather,
        participants: [
          {
            side: "p1",
            user: {
              id: user?.id || "local-user",
              name: user?.displayName || user?.username || "Player",
            },
            control: "human",
            team: resolvedTeam,
          },
          {
            side: "p2",
            user: { id: "rival-v2", name: "Rival V2", type: "npc" },
            control: "ai",
            team: RIVAL_TEAM,
          },
        ],
      });
      setPlayerTeam(
        result.participants
          .find((participant) => participant.side === "p1")
          ?.team.map((pokemon, index) => ({
            ...resolvedTeam[index],
            ...pokemon,
            sprite: resolvedTeam[index]?.sprite,
          })) || resolvedTeam
      );
      setRivalTeam(
        result.participants
          .find((participant) => participant.side === "p2")
          ?.team.map((pokemon, index) => ({
            ...RIVAL_TEAM[index],
            ...pokemon,
          })) || RIVAL_TEAM
      );
      setSession(result);
      setItems({ potions: 2, fullRestores: 1 });
      setLogs([]);
      appendLogs(result.logs);
      setStage("battle");
      await loadMoveCatalog(result.requests?.p1?.active?.[0]?.moves || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const restartDraft = () => {
    setStage("draft");
    setSession(null);
    setLogs([]);
    setMoveCatalog({});
    setSelectedTeam([]);
    setPlayerTeam([]);
    setRivalTeam(RIVAL_TEAM);
    setItems({ potions: 2, fullRestores: 1 });
  };

  const submitChoice = async (choice) => {
    if (!session || session.ended || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await api.submitBattleEngineChoice(session.battleId, {
        side: "p1",
        choice,
      });
      setSession(result);
      appendLogs(result.logs);
      await loadMoveCatalog(result.requests?.p1?.active?.[0]?.moves || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const usePotion = async () => {
    if (items.potions <= 0) return;
    setItems((prev) => ({ ...prev, potions: prev.potions - 1 }));
    await submitChoice("potion");
  };

  const useFullRestore = async () => {
    if (items.fullRestores <= 0) return;
    setItems((prev) => ({ ...prev, fullRestores: prev.fullRestores - 1 }));
    await submitChoice("fullrestore");
  };

  const switchTo = async (index) => {
    await submitChoice(`switch ${index + 1}`);
  };

  return (
    <div className="minigames-screen battle-v2-screen">
      <header className="minigames-header">
        <div className="minigames-title-group">
          <p className="minigames-eyebrow">Battle Engine V2</p>
          <h1 className="minigames-title">Pokemon Battle Arena V2</h1>
        </div>
        <div className="minigames-header-stats">
          <div className="minigames-stat-badge accent">
            <ShieldCheck size={15} />
            <span>
              {session
                ? session.battleId.slice(0, 8)
                : `${selectedTeam.length}/3 Drafted`}
            </span>
          </div>
          <button
            type="button"
            className="btn-back"
            onClick={() => goTo(SCREENS.minigameHub)}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <main className="battle-v2-layout">
        {error && <div className="battle-v2-error">{error}</div>}

        {stage === "draft" ? (
          <section className="minigame-container battle-v2-draft">
            <div className="minigame-content" style={{ textAlign: "left" }}>
              <h2 className="minigame-inner-title">
                Draft Your V2 Engine Squad
              </h2>
              <p
                className="minigame-inner-subtitle"
                style={{ marginBottom: "20px" }}
              >
                Choose 3 Pokemon. V2 resolves their stats and moves into
                explicit battle-ready engine payloads.
              </p>

              <div
                className="battle-v2-toolbar"
                style={{ marginBottom: "24px" }}
              >
                <div className="battle-arena-config">
                  <span className="config-section-title">Weather Control</span>
                  <div className="config-btn-group">
                    {WEATHER_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`config-btn ${weather === option.id ? "active" : ""}`}
                        onClick={() => setWeather(option.id)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="battle-arena-config">
                  <span className="config-section-title">Selected Team</span>
                  <div className="battle-v2-selected-strip">
                    {selectedTeam.length ? (
                      selectedTeam.map((pokemon) => (
                        <span key={pokemon.entryId}>{pokemon.displayName}</span>
                      ))
                    ) : (
                      <span>No picks yet</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="minigames-bento-grid battle-v2-draft-grid">
                {draftPool.map((pokemon) => {
                  const isSelected = selectedTeam.some(
                    (selected) => selected.entryId === pokemon.entryId
                  );
                  return (
                    <button
                      key={pokemon.entryId}
                      type="button"
                      className={`bento-card battle-v2-draft-card ${isSelected ? "featured" : ""}`}
                      onClick={() => handleDraftToggle(pokemon)}
                    >
                      <span className="battle-v2-draft-icon">
                        {starterIcon(pokemon.types)}
                      </span>
                      <span className="species-label">
                        {pokemon.displayName}
                      </span>
                      <span className="battle-v2-draft-types">
                        {pokemon.types.join(" / ")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="battle-v2-draft-footer">
                <button
                  type="button"
                  className="btn-back battle-v2-start"
                  disabled={selectedTeam.length !== 3 || loading}
                  onClick={startBattle}
                >
                  <Swords size={15} />{" "}
                  {loading ? "Resolving Team..." : "Start V2 Battle"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="battle-v2-toolbar">
              <div className="battle-v2-weather">
                {WEATHER_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`config-btn ${weather === option.id ? "active" : ""}`}
                    disabled
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn-back battle-v2-start"
                disabled={loading}
                onClick={restartDraft}
              >
                <RotateCcw size={15} /> New Draft
              </button>
            </section>

            <section className="battle-v2-stage">
              <div className="battle-v2-combatant rival">
                <div className="pokemon-hp-panel">
                  <div className="hp-panel-header">
                    <span className="hp-pokemon-name">
                      {rival?.displayName}
                    </span>
                    <span className="hp-pokemon-level">
                      Lvl {rival?.level || 50}
                    </span>
                  </div>
                  <div className="hp-bar-outer">
                    <div
                      className="hp-bar-inner high"
                      style={{ width: `${hpPercent(rival)}%` }}
                    />
                  </div>
                  <div className="hp-numeric">
                    {rival?.currentHp} / {rival?.maxHp} HP
                  </div>
                </div>
                <img
                  className="battle-v2-sprite"
                  src={rival?.sprite}
                  alt={rival?.displayName}
                />
                <div className="battle-v2-meta">
                  <span>{rival?.ability}</span>
                  <span>{rival?.item || "No Item"}</span>
                </div>
              </div>

              <div className="battle-v2-combatant player">
                <div className="pokemon-hp-panel">
                  <div className="hp-panel-header">
                    <span className="hp-pokemon-name">
                      {player?.displayName}
                    </span>
                    <span className="hp-pokemon-level">
                      Lvl {player?.level || 50}
                    </span>
                  </div>
                  <div className="hp-bar-outer">
                    <div
                      className="hp-bar-inner high"
                      style={{ width: `${hpPercent(player)}%` }}
                    />
                  </div>
                  <div className="hp-numeric">
                    {player?.currentHp} / {player?.maxHp} HP
                  </div>
                </div>
                <img
                  className="battle-v2-sprite flip"
                  src={player?.sprite}
                  alt={player?.displayName}
                />
                <div className="battle-v2-meta">
                  <span>{player?.ability}</span>
                  <span>{player?.item || "No Item"}</span>
                </div>
              </div>
            </section>

            <section className="battle-v2-actions">
              <div className="action-grid">
                {requestMoves.map((move, index) => {
                  const catalog = moveCatalog[move.id];
                  const type = catalog?.type || "Normal";
                  return (
                    <button
                      key={`${move.id}-${index}`}
                      type="button"
                      className="btn-action-move"
                      data-type={type.toLowerCase()}
                      disabled={
                        !session || session.ended || loading || move.disabled
                      }
                      onClick={() => submitChoice(`move ${index + 1}`)}
                    >
                      <span className="move-btn-keybind">Slot {index + 1}</span>
                      <span className="move-btn-name">
                        {(move.move || catalog?.name || move.id).replace(
                          /-/g,
                          " "
                        )}
                      </span>
                      <span
                        className="move-btn-type"
                        style={{
                          background:
                            TYPE_COLORS[type?.toLowerCase()] || "#778",
                          color: "#fff",
                        }}
                      >
                        {type.toUpperCase()} / PWR {catalog?.basePower ?? "--"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="battle-v2-side-actions">
                <button
                  type="button"
                  className="btn-menu-action"
                  disabled={!session || loading || items.potions <= 0}
                  onClick={usePotion}
                >
                  <TestTube2 size={14} /> Potion ({items.potions})
                </button>
                <button
                  type="button"
                  className="btn-menu-action"
                  disabled={!session || loading || items.fullRestores <= 0}
                  onClick={useFullRestore}
                >
                  <Sparkles size={14} /> Full Restore ({items.fullRestores})
                </button>
                {playerSlots.map((pokemon) => {
                  const isActive = Boolean(pokemon.active);
                  const isFainted =
                    pokemon.status === "fnt" ||
                    pokemon.condition?.includes("fnt");
                  return (
                    <button
                      key={pokemon.id}
                      type="button"
                      className={`btn-menu-action ${isActive ? "active" : ""}`}
                      disabled={!session || loading || isActive || isFainted}
                      onClick={() => switchTo(pokemon.requestIndex)}
                    >
                      Switch: {pokemon.displayName}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="battle-logs-card battle-v2-logs">
              <span className="battle-logs-title">
                {session?.ended ? `Winner: ${session.winner}` : "Battle Logs"}
              </span>
              <div className="battle-logs-stream">
                {(logs.length ? logs : ["Start a V2 battle."]).map(
                  (line, index) => (
                    <div key={`${line}-${index}`} className="battle-log-line">
                      {line}
                    </div>
                  )
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
