import { createRequire } from "module";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import NodeCache from "node-cache";
import {
  Dex,
  getAbilityCatalogRecord,
  getItemCatalogRecord,
  getMoveCatalogRecord,
  normalizeBattleId,
  requireAbility,
  requireItem,
  requireMove,
  toID,
} from "./battleEngineCatalog.js";

const _require = createRequire(import.meta.url)("module").createRequire(
  import.meta.url
);
const _localPath = path;
const Sim = eval(
  "_require(_localPath.resolve(process.cwd(), 'src/server/showdown/sim/index.js'))"
);
const { Battle } = Sim;

const DEFAULT_FORMAT_ID = "gen7customgame";
const DEFAULT_WEATHER = "clear";
const VALID_SIDES = new Set(["p1", "p2"]);
const VALID_CONTROLS = new Set(["human", "ai"]);
const VALID_STAT_KEYS = ["hp", "atk", "def", "spa", "spd", "spe"];
const VALID_STATUS_IDS = new Set([
  "",
  "none",
  "brn",
  "par",
  "psn",
  "tox",
  "slp",
  "frz",
]);
const WEATHER_IDS = {
  clear: "",
  sun: "sunnyday",
  rain: "raindance",
  sandstorm: "sandstorm",
  hail: "hail",
};

const sessionCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

function cleanLogs(logsArray) {
  return logsArray
    .flat(Infinity)
    .map((line) =>
      typeof line === "string" ? line.trim() : String(line).trim()
    )
    .filter((line) => line.startsWith("|"));
}

function clampInt(value, min, max) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function normalizeStats(stats = {}, maxHp = 100) {
  const normalized = {};
  for (const stat of VALID_STAT_KEYS) {
    const fallback = stat === "hp" ? maxHp : 100;
    normalized[stat] = clampInt(stats[stat] ?? fallback, 1, 9999);
  }
  return normalized;
}

function getDefaultAbility(species) {
  return (
    species.abilities?.["0"] ||
    species.abilities?.["1"] ||
    species.abilities?.H ||
    "No Ability"
  );
}

function normalizePokemon(input, participant, index) {
  if (!input || typeof input !== "object") {
    throw new Error(
      `${participant.side} team slot ${index + 1} must be a Pokemon object`
    );
  }

  const species = Dex.species.get(
    input.species || input.name || input.displayName
  );
  if (!species.exists) {
    throw new Error(
      `${participant.side} team slot ${index + 1} has unknown species: ${input.species || input.name}`
    );
  }

  const moves = Array.isArray(input.moves) ? input.moves : [];
  if (moves.length < 1)
    throw new Error(
      `${participant.side} ${species.name} must have at least one move`
    );
  if (moves.length > 4)
    throw new Error(
      `${participant.side} ${species.name} may only have up to 4 moves`
    );

  const normalizedMoves = moves.map((move) => {
    const moveName = typeof move === "string" ? move : move?.name || move?.id;
    return requireMove(moveName).name;
  });

  const abilityName = input.ability || getDefaultAbility(species);
  const ability = requireAbility(abilityName);
  const itemName = input.item || "";
  const item = itemName ? requireItem(itemName) : null;
  const maxHp = clampInt(input.maxHp ?? input.stats?.hp ?? 100, 1, 9999);
  const currentHp = clampInt(input.currentHp ?? maxHp, 0, maxHp);
  const stats = normalizeStats(input.stats, maxHp);
  const status = String(input.status || "none").toLowerCase();
  if (!VALID_STATUS_IDS.has(status)) {
    throw new Error(
      `${participant.side} ${species.name} has unsupported status: ${input.status}`
    );
  }

  return {
    id: input.id || `${participant.side}-${index + 1}-${species.id}`,
    species: species.name,
    displayName: input.displayName || input.name || species.name,
    level: clampInt(input.level ?? 50, 1, 100),
    currentHp,
    maxHp,
    stats,
    moves: normalizedMoves,
    ability: ability.name,
    item: item?.name || "",
    status: status === "none" ? "none" : status,
  };
}

function normalizeParticipant(input) {
  if (!input || typeof input !== "object")
    throw new Error("Each participant must be an object");
  if (!VALID_SIDES.has(input.side))
    throw new Error(`Participant side must be p1 or p2: ${input.side}`);

  const control = input.control || "human";
  if (!VALID_CONTROLS.has(control))
    throw new Error(`Participant control must be human or ai: ${control}`);
  if (!Array.isArray(input.team) || input.team.length < 1)
    throw new Error(`${input.side} must provide a non-empty team`);
  if (input.team.length > 24)
    throw new Error(`${input.side} team cannot exceed 24 Pokemon`);

  const participant = {
    side: input.side,
    user: {
      id: input.user?.id || input.trainer?.id || input.side,
      name:
        input.user?.name ||
        input.trainer?.name ||
        input.name ||
        input.side.toUpperCase(),
      type: input.user?.type || input.trainer?.type || "user",
    },
    control,
    team: [],
  };
  participant.team = input.team.map((pokemon, index) =>
    normalizePokemon(pokemon, participant, index)
  );
  return participant;
}

function normalizeStartPayload(payload = {}) {
  const participants = Array.isArray(payload.participants)
    ? payload.participants.map(normalizeParticipant)
    : [];
  if (participants.length !== 2)
    throw new Error("Battle engine requires exactly two participants");

  const sides = new Set(participants.map((participant) => participant.side));
  if (!sides.has("p1") || !sides.has("p2") || sides.size !== 2) {
    throw new Error(
      "Battle engine participants must include one p1 and one p2"
    );
  }

  const weather = payload.weather || DEFAULT_WEATHER;
  if (!Object.prototype.hasOwnProperty.call(WEATHER_IDS, weather))
    throw new Error(`Unsupported weather: ${weather}`);

  return {
    formatId: payload.formatId || DEFAULT_FORMAT_ID,
    weather,
    participants: participants.sort((a, b) => a.side.localeCompare(b.side)),
  };
}

function toShowdownSet(pokemon) {
  return {
    name: pokemon.displayName || pokemon.species,
    species: pokemon.species,
    moves: pokemon.moves,
    level: pokemon.level,
    ability: pokemon.ability,
    item: pokemon.item,
    nature: "Serious",
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  };
}

function makeCollector() {
  const logs = [];
  const requests = {};
  const send = (type, data) => {
    if (type === "update") {
      logs.push(data);
      return;
    }
    if (type !== "sideupdate") return;
    const [sideId, sideData] = data.split("\n");
    if (sideData?.startsWith("|request|")) {
      requests[sideId] = JSON.parse(sideData.slice(9));
    }
  };
  return { logs, requests, send };
}

function applyBattleReadyData(battle, participants) {
  for (const participant of participants) {
    const side = battle.getSide(participant.side);
    if (!side) continue;
    participant.team.forEach((source, index) => {
      const pokemon = side.pokemon[index];
      if (!pokemon) return;
      pokemon.baseMaxhp = source.maxHp;
      pokemon.maxhp = source.maxHp;
      pokemon.hp = source.currentHp;
      pokemon.baseStoredStats = {
        atk: source.stats.atk,
        def: source.stats.def,
        spa: source.stats.spa,
        spd: source.stats.spd,
        spe: source.stats.spe,
      };
      pokemon.storedStats = { ...pokemon.baseStoredStats };
      pokemon.speed = pokemon.storedStats.spe;
      if (source.status !== "none") {
        pokemon.status = source.status;
        pokemon.statusState = battle.initEffectState({
          id: source.status,
          target: pokemon,
        });
      }
      if (source.currentHp <= 0) pokemon.fainted = true;
    });
  }
}

function chooseTeamPreview(battle) {
  for (const sideId of ["p1", "p2"]) {
    const side = battle.getSide(sideId);
    const slots = side.pokemon.map((_pokemon, index) => index + 1).join(",");
    battle.choose(sideId, `team ${slots}`);
  }
}

function applyWeather(battle, weather) {
  const showdownWeather = WEATHER_IDS[weather];
  if (showdownWeather) battle.field.setWeather(showdownWeather, "debug");
}

function getWinner(battle) {
  if (!battle.ended) return null;
  const winnerSide = battle.sides.find((side) => side?.name === battle.winner);
  if (winnerSide) return winnerSide.id;
  return battle.winner || null;
}

function buildSessionResponse(session, battle, collector) {
  const nextRequests = { ...session.requests, ...collector.requests };
  const response = {
    battleId: session.battleId,
    formatId: session.formatId,
    weather: session.weather,
    participants: session.participants,
    logs: cleanLogs(collector.logs),
    requests: nextRequests,
    winner: getWinner(battle),
    ended: Boolean(battle.ended),
  };

  session.requests = nextRequests;
  session.winner = response.winner;
  session.ended = response.ended;
  session.serializedBattle = battle.toJSON();
  sessionCache.set(session.battleId, session);
  return response;
}

function getAiChoice(request) {
  if (!request || request.wait) return null;

  if (request.forceSwitch) {
    const forceSwitchArray = Array.isArray(request.forceSwitch)
      ? request.forceSwitch
      : [request.forceSwitch];
    if (forceSwitchArray.length > 1) {
      const choices = [];
      for (let i = 0; i < forceSwitchArray.length; i++) {
        if (forceSwitchArray[i]) {
          choices.push("default");
        } else {
          choices.push("pass");
        }
      }
      return choices.join(", ");
    }
  }

  if (request.active && request.active.length > 1) {
    const choices = [];
    for (let i = 0; i < request.active.length; i++) {
      if (request.active[i]) {
        choices.push("default");
      } else {
        choices.push("pass");
      }
    }
    return choices.join(", ");
  }

  return "default";
}

function applyAppAction(battle, sideId, action) {
  const choiceStrings = action.split(",");
  let matchedAppAction = false;

  for (let i = 0; i < choiceStrings.length; i++) {
    const choiceStr = choiceStrings[i].trim();
    if (choiceStr.startsWith("potion") || choiceStr.startsWith("fullrestore")) {
      const parts = choiceStr.split(" ");
      const baseItem = parts[0];
      const targetIdx = parts.length > 1 ? parseInt(parts[1], 10) : i;

      const side = battle.getSide(sideId);
      const targetMon = side?.active?.[targetIdx];
      const activeMon = side?.active?.[i];

      if (targetMon && targetMon.hp > 0) {
        const oldHp = targetMon.hp;
        if (baseItem === "potion") {
          targetMon.sethp(Math.min(targetMon.maxhp, oldHp + 50));
          if (targetMon.hp > oldHp)
            battle.add(
              "-heal",
              targetMon,
              targetMon.getHealth,
              "[from] item: Potion"
            );
        } else {
          targetMon.sethp(targetMon.maxhp);
          targetMon.cureStatus();
          if (targetMon.hp > oldHp)
            battle.add(
              "-heal",
              targetMon,
              targetMon.getHealth,
              "[from] item: Full Restore"
            );
        }
      }

      if (activeMon && activeMon.hp > 0) {
        activeMon.addVolatile("flinch");
      }

      // Replace the item choice with the first valid move for that slot
      const moveChoice = getFirstValidMoveForSlot(side?.activeRequest, i);
      choiceStrings[i] = moveChoice;
      matchedAppAction = true;
    }
  }

  if (matchedAppAction) {
    battle.choose(sideId, choiceStrings.join(", "));
    return true;
  }
  return false;
}

function getFirstValidMoveForSlot(request, i) {
  const activePoke = request?.active?.[i];
  const moveIndex =
    activePoke?.moves?.findIndex((move) => !move.disabled) ?? -1;
  return moveIndex >= 0 ? `move ${moveIndex + 1}` : "default";
}

function restoreBattle(session, collector) {
  const battle = Battle.fromJSON(session.serializedBattle);
  battle.send = collector.send;
  // Critical: sentLogPos must start at the END of the restored log so that
  // sendUpdates() only captures events generated AFTER this restore (i.e. new turn events).
  // Without this, sendUpdates sends the entire historical log as a single "update" chunk
  // and then has nothing left to send for the actual new turn events.
  battle.sentLogPos = battle.log.length;
  return battle;
}

export function createBattleEngineSession(payload) {
  const normalized = normalizeStartPayload(payload);
  const battleId = uuidv4();
  const collector = makeCollector();
  const battle = new Battle({
    formatid: normalized.formatId,
    send: collector.send,
  });

  for (const participant of normalized.participants) {
    battle.setPlayer(participant.side, {
      name: participant.user.name,
      team: participant.team.map(toShowdownSet),
    });
  }

  applyBattleReadyData(battle, normalized.participants);
  chooseTeamPreview(battle);
  applyWeather(battle, normalized.weather);
  battle.sendUpdates();

  const session = {
    battleId,
    formatId: normalized.formatId,
    weather: normalized.weather,
    participants: normalized.participants,
    requests: {},
    winner: null,
    ended: false,
    serializedBattle: battle.toJSON(),
  };

  return buildSessionResponse(session, battle, collector);
}

export function getBattleEngineSession(battleId) {
  const session = sessionCache.get(battleId);
  if (!session) throw new Error("Battle engine session not found or expired");
  return {
    battleId: session.battleId,
    formatId: session.formatId,
    weather: session.weather,
    participants: session.participants,
    logs: [],
    requests: session.requests,
    winner: session.winner,
    ended: session.ended,
  };
}

export function submitBattleEngineChoice(battleId, sideId, choice) {
  const session = sessionCache.get(battleId);
  if (!session) throw new Error("Battle engine session not found or expired");
  if (session.ended) return getBattleEngineSession(battleId);
  if (!VALID_SIDES.has(sideId))
    throw new Error(`Choice side must be p1 or p2: ${sideId}`);

  const participant = session.participants.find(
    (entry) => entry.side === sideId
  );
  if (!participant) throw new Error(`No participant for side: ${sideId}`);
  if (participant.control !== "human") {
    throw new Error(
      `Cannot submit manual choice for ${sideId}; side is controlled by ${participant.control}`
    );
  }
  if (!choice || typeof choice !== "string")
    throw new Error("choice is required");

  const collector = makeCollector();
  const battle = restoreBattle(session, collector);
  const normalizedChoice = choice.trim().toLowerCase();
  const handledAppAction = applyAppAction(battle, sideId, normalizedChoice);
  if (!handledAppAction) battle.choose(sideId, choice);

  let lastRequests = new Map();
  let stateChanged = true;
  while (stateChanged) {
    stateChanged = false;
    for (const aiParticipant of session.participants.filter(
      (entry) => entry.control === "ai"
    )) {
      const request = battle.getSide(aiParticipant.side)?.activeRequest;
      if (
        !request ||
        request.wait ||
        lastRequests.get(aiParticipant.side) === request
      )
        continue;

      const aiChoice = getAiChoice(request);
      if (aiChoice) {
        battle.choose(aiParticipant.side, aiChoice);
        lastRequests.set(aiParticipant.side, request);
        stateChanged = true;
      }
    }
  }

  battle.sendUpdates();
  return buildSessionResponse(session, battle, collector);
}

export const battleEngineCatalog = {
  getMove: getMoveCatalogRecord,
  getAbility: getAbilityCatalogRecord,
  getItem: getItemCatalogRecord,
  normalizeId: normalizeBattleId,
  toID,
};
