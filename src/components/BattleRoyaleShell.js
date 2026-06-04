import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import BattleRoyaleArena from './BattleRoyaleArena';
import BattleRoyaleDropScene from './BattleRoyaleDropScene';
import { WORLD_PATHS } from '../game/world';

const BATTLE_ROYALE_SERVER_URL =
  process.env.REACT_APP_BATTLE_ROYALE_SERVER_URL || 'http://localhost:4000';

const DROP_POINTS = [
  { id: 'north-ridge', label: 'North Ridge', x: 0, z: -24 },
  { id: 'west-cliffs', label: 'West Cliffs', x: -22, z: -8 },
  { id: 'center-ruins', label: 'Center Ruins', x: 0, z: 0 },
  { id: 'east-shore', label: 'East Shore', x: 24, z: 8 },
  { id: 'south-camp', label: 'South Camp', x: 0, z: 24 },
];

function formatMatchTime(totalSeconds = 0) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function BattleRoyaleMatchView({
  localPlayerId,
  onBackToMenu,
  onCreatureCaught,
  onPositionChange,
  room,
  selectedBiome,
}) {
  const players = room?.players || [];
  const sortedPlayers = [...players].sort((first, second) => {
    return (second.score || 0) - (first.score || 0);
  });
  const localPlayer = players.find((player) => player.id === localPlayerId);
  const localDropPoint = DROP_POINTS.find(
    (point) => point.id === localPlayer?.dropPointId
  ) || DROP_POINTS[2];
  const winnerNames = players
    .filter((player) => room?.winnerIds?.includes(player.id))
    .map((player) => player.name);

  return (
    <main
      className={
        room.phase === 'playing' || room.phase === 'dropping'
          ? 'battle-royale-game-shell'
          : 'battle-royale-shell'
      }
      data-testid="battle-royale-match"
    >
      {room.phase === 'dropping' && (
        <BattleRoyaleDropScene currentBiome={room.biomeId} />
      )}

      {room.phase === 'playing' && (
        <BattleRoyaleArena
          creatures={room.creatures || []}
          currentBiome={room.biomeId}
          dropPoints={DROP_POINTS}
          localPlayerId={localPlayerId}
          onCreatureCaught={onCreatureCaught}
          onPositionChange={onPositionChange}
          players={players}
        />
      )}

      <section
        className={
          room.phase === 'playing' || room.phase === 'dropping'
          ? 'battle-royale-panel match-panel match-panel-overlay'
          : 'battle-royale-panel match-panel'
        }
      >
        <div className="battle-royale-heading">
          <div>
            <p className="mode-eyebrow">Battle Royale Match</p>
            <h1>
              {room.phase === 'countdown' &&
                `Dropping in ${room.countdownRemaining}`}
              {room.phase === 'dropping' && 'Flying Over Drop Zone'}
              {room.phase === 'playing' && 'Catch Race Live'}
              {room.phase === 'finished' && 'Match Complete'}
            </h1>
          </div>
          <button className="ghost-button" type="button" onClick={onBackToMenu}>
            Exit
          </button>
        </div>

        <div className="match-grid">
          <section className="lobby-card match-status-card">
            <h2>{selectedBiome.name}</h2>
            <p className="lobby-muted">
              Drop point: <strong>{localDropPoint.label}</strong>
            </p>
            {room.phase === 'countdown' && (
              <p className="match-callout">
                Everyone is ready. Locking loadout and starting the drop.
              </p>
            )}
            {room.phase === 'dropping' && (
              <>
                <span className="match-timer">
                  {room.dropRemaining}
                </span>
                <p className="match-callout">
                  Plane crossing the biome. Players spawn at selected locations
                  after the flyover.
                </p>
              </>
            )}
            {room.phase === 'playing' && (
              <>
                <span className="match-timer">
                  {formatMatchTime(room.matchRemaining)}
                </span>
                <p className="match-callout">
                  Throw with Spacebar. Shared creatures left:{' '}
                  {room.creatures?.length || 0}
                </p>
              </>
            )}
            {room.phase === 'finished' && (
              <p className="match-callout">
                Winner: {winnerNames.length ? winnerNames.join(', ') : 'Tie'}
              </p>
            )}
          </section>

          <section className="lobby-card">
            <h2>Scoreboard</h2>
            <ul className="player-list">
              {sortedPlayers.map((player, index) => (
                <li key={player.id}>
                  <strong>
                    {index + 1}. {player.name}
                  </strong>
                  <span>{player.score || 0} catches</span>
                  <em>{player.isReady ? 'Ready' : 'Not Ready'}</em>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}

function BattleRoyaleShell({ onBackToMenu }) {
  const [dropPointId, setDropPointId] = useState(DROP_POINTS[2].id);
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackCountdown, setFallbackCountdown] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [localPlayerId, setLocalPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [room, setRoom] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [serverStatus, setServerStatus] = useState('offline');
  const [selectedBiomeId, setSelectedBiomeId] = useState(WORLD_PATHS[0].id);
  const socketRef = useRef(null);

  const selectedBiome = useMemo(() => {
    return WORLD_PATHS.find((biome) => biome.id === selectedBiomeId) ||
      WORLD_PATHS[0];
  }, [selectedBiomeId]);

  const selectedDropPoint = useMemo(() => {
    return DROP_POINTS.find((point) => point.id === dropPointId) ||
      DROP_POINTS[2];
  }, [dropPointId]);

  const displayPlayerName = playerName.trim() || 'Player';
  const roomPlayers = room?.players || [];
  const allPlayersReady =
    roomPlayers.length >= 2 && roomPlayers.every((player) => player.isReady);

  const getSocket = useCallback(() => {
    if (!socketRef.current) {
      const socket = io(BATTLE_ROYALE_SERVER_URL, {
        autoConnect: false,
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        setLocalPlayerId(socket.id);
        setServerStatus('connected');
        setErrorMessage('');
      });

      socket.on('connect_error', () => {
        setServerStatus('error');
        setErrorMessage(
          'Could not reach the Battle Royale server. Run npm run br:server.'
        );
      });

      socket.on('disconnect', () => {
        setServerStatus('offline');
      });

      socket.on('roomUpdated', (nextRoom) => {
        setRoom(nextRoom);
        if (Number.isFinite(nextRoom?.biomeId)) {
          setSelectedBiomeId(nextRoom.biomeId);
        }

        const player = nextRoom?.players?.find(
          (roomPlayer) => roomPlayer.id === socket.id
        );

        if (player) {
          setDropPointId(player.dropPointId || DROP_POINTS[2].id);
          setIsReady(Boolean(player.isReady));
        }
      });

      socketRef.current = socket;
    }

    if (!socketRef.current.connected) {
      setServerStatus('connecting');
      socketRef.current.connect();
    }

    return socketRef.current;
  }, []);

  const emitLobbyUpdate = useCallback((updates = {}) => {
    const socket = socketRef.current;

    if (!room || !socket?.connected) {
      return;
    }

    socket.emit('updateLobby', {
      biomeId: selectedBiomeId,
      dropPointId,
      isReady,
      playerName: displayPlayerName,
      roomCode: room.code,
      ...updates,
    });
  }, [displayPlayerName, dropPointId, isReady, room, selectedBiomeId]);

  const handleRoomResponse = useCallback((ackError, response) => {
    if (ackError) {
      setServerStatus('error');
      setErrorMessage('Room server did not respond. Check npm run br:server.');
      return;
    }

    if (!response?.ok) {
      setErrorMessage(response?.error || 'Room request failed.');
      return;
    }

    setRoom(response.room);
    setRoomCode(response.room.code);
    setServerStatus('connected');
    setErrorMessage('');
  }, []);

  const handleCreateRoom = useCallback(() => {
    const socket = getSocket();

    socket.timeout(6000).emit(
      'createRoom',
      {
        biomeId: selectedBiomeId,
        dropPointId,
        isReady,
        playerName: displayPlayerName,
      },
      handleRoomResponse
    );
  }, [
    displayPlayerName,
    dropPointId,
    getSocket,
    handleRoomResponse,
    isReady,
    selectedBiomeId,
  ]);

  const handleJoinRoom = useCallback(() => {
    const socket = getSocket();

    socket.timeout(6000).emit(
      'joinRoom',
      {
        biomeId: selectedBiomeId,
        dropPointId,
        isReady,
        playerName: displayPlayerName,
        roomCode,
      },
      handleRoomResponse
    );
  }, [
    displayPlayerName,
    dropPointId,
    getSocket,
    handleRoomResponse,
    isReady,
    roomCode,
    selectedBiomeId,
  ]);

  const handleBiomeSelect = useCallback((biomeId) => {
    setSelectedBiomeId(biomeId);
    emitLobbyUpdate({ biomeId });
  }, [emitLobbyUpdate]);

  const handleDropPointSelect = useCallback((nextDropPointId) => {
    setDropPointId(nextDropPointId);
    emitLobbyUpdate({ dropPointId: nextDropPointId });
  }, [emitLobbyUpdate]);

  const handleReadyToggle = useCallback(() => {
    setIsReady((current) => {
      const nextReady = !current;

      emitLobbyUpdate({ isReady: nextReady });
      return nextReady;
    });
  }, [emitLobbyUpdate]);

  const handleCreatureCaught = useCallback((creatureId) => {
    const socket = socketRef.current;

    if (!room || !socket?.connected) {
      return;
    }

    socket.emit('catchCreature', {
      creatureId,
      roomCode: room.code,
    });
  }, [room]);

  const handlePositionChange = useCallback((position) => {
    const socket = socketRef.current;

    if (!room || !socket?.connected) {
      return;
    }

    socket.emit('updatePlayerPosition', {
      position,
      roomCode: room.code,
    });
  }, [room]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!room || (room.phase && room.phase !== 'lobby') || !allPlayersReady) {
      setFallbackCountdown(null);
      return undefined;
    }

    socketRef.current?.emit('requestCountdownStart', { roomCode: room.code });
    setFallbackCountdown(5);

    const countdownTimer = window.setInterval(() => {
      setFallbackCountdown((current) => {
        if (current === null || current <= 1) {
          window.clearInterval(countdownTimer);
          return 1;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(countdownTimer);
    };
  }, [allPlayersReady, room]);

  const effectiveRoom = useMemo(() => {
    if (room && (!room.phase || room.phase === 'lobby') &&
      fallbackCountdown !== null) {
      return {
        ...room,
        countdownRemaining: fallbackCountdown,
        phase: 'countdown',
      };
    }

    return room;
  }, [fallbackCountdown, room]);

  if (effectiveRoom?.phase === 'countdown' || effectiveRoom?.phase === 'dropping' ||
    effectiveRoom?.phase === 'playing' ||
    effectiveRoom?.phase === 'finished') {
    return (
      <BattleRoyaleMatchView
        localPlayerId={localPlayerId}
        onBackToMenu={onBackToMenu}
        onCreatureCaught={handleCreatureCaught}
        onPositionChange={handlePositionChange}
        room={effectiveRoom}
        selectedBiome={selectedBiome}
      />
    );
  }

  return (
    <main className="battle-royale-shell" data-testid="battle-royale-shell">
      <section className="battle-royale-panel" aria-labelledby="battle-title">
        <div className="battle-royale-heading">
          <div>
            <p className="mode-eyebrow">Multiplayer Prototype</p>
            <h1 id="battle-title">Battle Royale Lobby</h1>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={onBackToMenu}
          >
            Back
          </button>
        </div>

        <div className="battle-royale-lobby">
          <section className="lobby-card">
            <h2>Player</h2>
            <label htmlFor="player-name">Player Name</label>
            <input
              id="player-name"
              placeholder="Spryzen"
              value={playerName}
              onChange={(event) => {
                setPlayerName(event.target.value);
                emitLobbyUpdate({ playerName: event.target.value });
              }}
            />
          </section>

          <section className="lobby-card">
            <h2>Room</h2>
            <div className="room-actions">
              <button type="button" onClick={handleCreateRoom}>
                Create Room
              </button>
              <input
                aria-label="Room Code"
                placeholder="Room code"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              />
              <button type="button" onClick={handleJoinRoom}>
                Join Room
              </button>
            </div>
            <p className={`server-status server-status-${serverStatus}`}>
              Server: {serverStatus}
            </p>
            {room && (
              <p className="lobby-muted">
                Room <strong>{room.code}</strong> has {roomPlayers.length}{' '}
                player{roomPlayers.length === 1 ? '' : 's'}.
              </p>
            )}
            {errorMessage && <p className="lobby-error">{errorMessage}</p>}
          </section>

          <section className="lobby-card">
            <h2>Biome Selection</h2>
            <div className="biome-choice-grid">
              {WORLD_PATHS.map((biome) => (
                <button
                  key={biome.id}
                  className={biome.id === selectedBiomeId ? 'selected' : ''}
                  type="button"
                  onClick={() => handleBiomeSelect(biome.id)}
                >
                  {biome.name}
                </button>
              ))}
            </div>
          </section>

          <section className="lobby-card">
            <h2>Drop Location</h2>
            <div className="drop-point-grid">
              {DROP_POINTS.map((point) => (
                <button
                  key={point.id}
                  className={point.id === dropPointId ? 'selected' : ''}
                  type="button"
                  onClick={() => handleDropPointSelect(point.id)}
                >
                  {point.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <footer className="battle-royale-status">
          <div>
            <span>Biome</span>
            <strong>{selectedBiome.name}</strong>
          </div>
          <div>
            <span>Drop Point</span>
            <strong>
              {selectedDropPoint.label} ({selectedDropPoint.x},{' '}
              {selectedDropPoint.z})
            </strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{isReady ? 'Ready' : 'Not Ready'}</strong>
          </div>
          <button
            className={isReady ? 'ready-button ready' : 'ready-button'}
            type="button"
            onClick={handleReadyToggle}
          >
            {isReady ? 'Ready' : 'Mark Ready'}
          </button>
        </footer>

        <section className="lobby-card player-list-card" aria-labelledby="players-title">
          <h2 id="players-title">Connected Players</h2>
          {roomPlayers.length > 0 ? (
            <ul className="player-list">
              {roomPlayers.map((player) => {
                const playerDropPoint = DROP_POINTS.find(
                  (point) => point.id === player.dropPointId
                );

                return (
                  <li key={player.id}>
                    <strong>{player.name}</strong>
                    <span>{playerDropPoint?.label || 'Center Ruins'}</span>
                    <em>{player.isReady ? 'Ready' : 'Not Ready'}</em>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="lobby-muted">
              Create or join a room to see players here.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

export default BattleRoyaleShell;
