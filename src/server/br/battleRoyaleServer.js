import { Server } from "socket.io";

const CLIENT_ORIGIN =
  process.env.BATTLE_ROYALE_CLIENT_ORIGIN || "http://localhost:3000";
const COUNTDOWN_SECONDS = 5;
const DROP_SECONDS = 7;
const MATCH_DURATION_SECONDS = 120;
const MATCH_CREATURE_COUNT = 24;
const rooms = new Map();

function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 5; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return rooms.has(code) ? makeRoomCode() : code;
}

function sanitizePlayerName(name) {
  const trimmedName = String(name || "").trim();

  return trimmedName.slice(0, 18) || "Player";
}

function serializeRoom(room) {
  return {
    biomeId: room.biomeId,
    code: room.code,
    countdownRemaining: room.countdownRemaining,
    creatures: room.creatures,
    dropRemaining: room.dropRemaining,
    dropStarted: room.dropStarted,
    hostId: room.hostId,
    matchRemaining: room.matchRemaining,
    phase: room.phase,
    players: Array.from(room.players.values()),
    winnerIds: room.winnerIds,
  };
}

function seededRandom(seed) {
  const value = Math.sin(seed * 127.1) * 43758.5453123;

  return value - Math.floor(value);
}

function createMatchCreatures(room) {
  return Array.from({ length: MATCH_CREATURE_COUNT }, (_, index) => {
    const angle = seededRandom(room.biomeId * 1000 + index * 3.7) * Math.PI * 2;
    const distance = 8 + seededRandom(room.biomeId * 2000 + index * 5.1) * 56;

    return {
      assetIndex: Math.floor(
        seededRandom(room.biomeId * 3000 + index * 7.9) * 1000
      ),
      id: `br-creature-${room.code}-${index}`,
      x: Number((Math.cos(angle) * distance).toFixed(2)),
      z: Number((Math.sin(angle) * distance).toFixed(2)),
    };
  });
}

function broadcastRoom(io, room) {
  io.to(room.code).emit("roomUpdated", serializeRoom(room));
}

function clearRoomTimers(room) {
  if (room.countdownTimer) {
    clearInterval(room.countdownTimer);
    room.countdownTimer = null;
  }

  if (room.matchTimer) {
    clearInterval(room.matchTimer);
    room.matchTimer = null;
  }

  if (room.dropTimer) {
    clearInterval(room.dropTimer);
    room.dropTimer = null;
  }
}

function canStartCountdown(room) {
  const players = Array.from(room.players.values());

  return (
    room.phase === "lobby" &&
    players.length >= 2 &&
    players.every((player) => player.isReady)
  );
}

function finishMatch(io, room) {
  clearRoomTimers(room);

  const players = Array.from(room.players.values());
  const bestScore = players.reduce(
    (highestScore, player) => Math.max(highestScore, player.score || 0),
    0
  );

  room.phase = "finished";
  room.matchRemaining = 0;
  room.winnerIds = players
    .filter((player) => (player.score || 0) === bestScore)
    .map((player) => player.id);

  broadcastRoom(io, room);
}

function startMatch(io, room) {
  if (room.phase !== "dropping") {
    return;
  }

  if (room.dropTimer) {
    clearInterval(room.dropTimer);
    room.dropTimer = null;
  }

  room.phase = "playing";
  room.dropRemaining = 0;
  room.matchRemaining = MATCH_DURATION_SECONDS;
  room.winnerIds = [];
  room.players.forEach((player) => {
    player.score = 0;
  });
  room.creatures = createMatchCreatures(room);

  broadcastRoom(io, room);

  room.matchTimer = setInterval(() => {
    room.matchRemaining -= 1;

    if (room.matchRemaining <= 0) {
      finishMatch(io, room);
      return;
    }

    broadcastRoom(io, room);
  }, 1000);
}

function startDrop(io, room) {
  if (room.phase !== "countdown") {
    return;
  }

  if (room.countdownTimer) {
    clearInterval(room.countdownTimer);
    room.countdownTimer = null;
  }

  room.phase = "dropping";
  room.dropRemaining = DROP_SECONDS;
  room.dropStarted = true;
  broadcastRoom(io, room);

  room.dropTimer = setInterval(() => {
    room.dropRemaining -= 1;

    if (room.dropRemaining <= 0) {
      startMatch(io, room);
      return;
    }

    broadcastRoom(io, room);
  }, 1000);
}

function cancelCountdown(io, room) {
  if (room.phase !== "countdown") {
    return;
  }

  if (room.countdownTimer) {
    clearInterval(room.countdownTimer);
    room.countdownTimer = null;
  }

  room.phase = "lobby";
  room.countdownRemaining = 0;
  broadcastRoom(io, room);
}

function maybeStartCountdown(io, room) {
  if (
    room.phase === "countdown" ||
    room.phase === "dropping" ||
    room.phase === "playing" ||
    room.phase === "finished"
  ) {
    return;
  }

  if (canStartCountdown(room)) {
    room.phase = "countdown";
    room.countdownRemaining = COUNTDOWN_SECONDS;
    broadcastRoom(io, room);

    room.countdownTimer = setInterval(() => {
      const players = Array.from(room.players.values());
      const stillReady =
        players.length >= 2 && players.every((player) => player.isReady);

      if (!stillReady) {
        cancelCountdown(io, room);
        return;
      }

      room.countdownRemaining -= 1;

      if (room.countdownRemaining <= 0) {
        startDrop(io, room);
        return;
      }

      broadcastRoom(io, room);
    }, 1000);
    return;
  }

  cancelCountdown(io, room);
}

function addPlayerToRoom(socket, room, payload) {
  const player = {
    dropPointId: payload.dropPointId || "center-ruins",
    id: socket.id,
    isReady: Boolean(payload.isReady),
    name: sanitizePlayerName(payload.playerName),
    score: 0,
  };

  room.players.set(socket.id, player);
  socket.join(room.code);
  socket.data.roomCode = room.code;

  return player;
}

export function attachBattleRoyale(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("createRoom", (payload = {}, callback = () => {}) => {
      const code = makeRoomCode();
      const room = {
        biomeId: Number.isFinite(payload.biomeId) ? payload.biomeId : 0,
        code,
        countdownRemaining: 0,
        creatures: [],
        dropRemaining: 0,
        dropStarted: false,
        hostId: socket.id,
        matchRemaining: 0,
        phase: "lobby",
        players: new Map(),
        winnerIds: [],
      };

      rooms.set(code, room);
      addPlayerToRoom(socket, room, payload);
      const serializedRoom = serializeRoom(room);

      callback({ ok: true, room: serializedRoom });
      broadcastRoom(io, room);
      maybeStartCountdown(io, room);
    });

    socket.on("joinRoom", (payload = {}, callback = () => {}) => {
      const requestedCode = String(payload.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(requestedCode);

      if (!room) {
        callback({ ok: false, error: "Room not found." });
        return;
      }

      if (room.phase !== "lobby") {
        callback({ ok: false, error: "Match already started." });
        return;
      }

      addPlayerToRoom(socket, room, payload);
      const serializedRoom = serializeRoom(room);

      callback({ ok: true, room: serializedRoom });
      broadcastRoom(io, room);
      maybeStartCountdown(io, room);
    });

    socket.on("updateLobby", (payload = {}) => {
      const roomCode = String(payload.roomCode || socket.data.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(roomCode);

      if (!room || !room.players.has(socket.id)) {
        return;
      }

      const player = room.players.get(socket.id);

      if (payload.playerName !== undefined) {
        player.name = sanitizePlayerName(payload.playerName);
      }

      if (payload.dropPointId !== undefined && room.phase === "lobby") {
        player.dropPointId = payload.dropPointId;
      }

      if (payload.isReady !== undefined) {
        player.isReady = Boolean(payload.isReady);
      }

      if (payload.biomeId !== undefined && room.phase === "lobby") {
        room.biomeId = Number(payload.biomeId);
      }

      broadcastRoom(io, room);
      maybeStartCountdown(io, room);
    });

    socket.on("requestCountdownStart", (payload = {}, callback = () => {}) => {
      const roomCode = String(payload.roomCode || socket.data.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(roomCode);

      if (!room || !room.players.has(socket.id)) {
        callback({ ok: false, error: "Room not found." });
        return;
      }

      maybeStartCountdown(io, room);
      callback({ ok: room.phase === "countdown", room: serializeRoom(room) });
    });

    socket.on("updatePlayerPosition", (payload = {}) => {
      const roomCode = String(payload.roomCode || socket.data.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(roomCode);

      if (!room || room.phase !== "playing" || !room.players.has(socket.id)) {
        return;
      }

      const position = payload.position || {};
      const player = room.players.get(socket.id);
      player.position = {
        x: Number(position.x) || 0,
        y: Number(position.y) || 0,
        z: Number(position.z) || 0,
      };
      broadcastRoom(io, room);
    });

    socket.on("recordCatch", (payload = {}) => {
      const roomCode = String(payload.roomCode || socket.data.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(roomCode);

      if (!room || room.phase !== "playing" || !room.players.has(socket.id)) {
        return;
      }

      const player = room.players.get(socket.id);
      player.score = (player.score || 0) + 1;
      broadcastRoom(io, room);
    });

    socket.on("catchCreature", (payload = {}, callback = () => {}) => {
      const roomCode = String(payload.roomCode || socket.data.roomCode || "")
        .trim()
        .toUpperCase();
      const room = rooms.get(roomCode);

      if (!room || room.phase !== "playing" || !room.players.has(socket.id)) {
        callback({ ok: false, error: "Match is not active." });
        return;
      }

      const creatureId = String(payload.creatureId || "");
      const creatureExists = room.creatures.some(
        (creature) => creature.id === creatureId
      );

      if (!creatureExists) {
        callback({ ok: false, error: "Creature already caught." });
        return;
      }

      room.creatures = room.creatures.filter(
        (creature) => creature.id !== creatureId
      );
      const player = room.players.get(socket.id);
      player.score = (player.score || 0) + 1;
      callback({ ok: true, room: serializeRoom(room) });
      broadcastRoom(io, room);
    });

    socket.on("disconnect", () => {
      const roomCode = socket.data.roomCode;
      const room = rooms.get(roomCode);

      if (!room) {
        return;
      }

      room.players.delete(socket.id);

      if (room.players.size === 0) {
        clearRoomTimers(room);
        rooms.delete(roomCode);
        return;
      }

      if (room.hostId === socket.id) {
        room.hostId = Array.from(room.players.keys())[0];
      }

      broadcastRoom(io, room);
      maybeStartCountdown(io, room);
    });
  });

  return io;
}
