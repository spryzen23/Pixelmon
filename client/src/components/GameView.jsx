import { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { api } from '../api';
import { useGame, SCREENS } from '../context/GameContext';
import { GameScene, SUN_POSITION } from './GameScene';
import Hotbar from './Hotbar';
import { BALL_TYPES, DEFAULT_BALL } from '../game/balls';
import { PLAYER_STYLES } from '../game/playerStyles';
import {
  formatSpawnProgressLine,
  getBiomeDisplayInfo,
} from '../game/biomeDisplay';
import { isAlphaEligible } from '../game/spawnController';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from '../game/projectilePhysics';
import { clearAllBiomeCaches } from '../game/world';
import { Button } from './ui/Button';

export function GameView() {
  const {
    player,
    setPlayer,
    session,
    gameRuntime,
    setGameRuntime,
    goTo,
    setCompleteStats,
  } = useGame();
  const [paused, setPaused] = useState(false);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const [spawnProgress, setSpawnProgress] = useState({ level: 1, peak: 0, active: 0, maxLevel: 1 });

  const display = useMemo(
    () => getBiomeDisplayInfo(session?.pathId ?? 0),
    [session?.pathId]
  );

  const equippedBall = useMemo(
    () => BALL_TYPES.find((b) => b.id === equippedBallId) || DEFAULT_BALL,
    [equippedBallId]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') setPaused((p) => !p);
      const ball = BALL_TYPES.find((b) => b.key === e.key);
      if (ball) setEquippedBallId(ball.id);
      if (e.code === 'KeyR') {
        setThrowPower((c) => Math.min(MAX_THROW_POWER, c + THROW_POWER_STEP));
      }
      if (e.code === 'KeyQ') {
        setThrowPower((c) => Math.max(MIN_THROW_POWER, c - THROW_POWER_STEP));
      }
    };
    const handleWheel = (e) => {
      e.preventDefault();
      setThrowPower((c) =>
        Math.max(
          MIN_THROW_POWER,
          Math.min(MAX_THROW_POWER, c + (e.deltaY < 0 ? THROW_POWER_STEP : -THROW_POWER_STEP))
        )
      );
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const onSpawnProgress = useCallback(
    (state) => {
      if (!state) return;
      const pools = state.levelPools ? Object.values(state.levelPools) : [];
      const peak = pools.reduce((sum, pool) => sum + (pool?.initial ?? 0), 0);
      const active = pools.reduce((sum, pool) => sum + (pool?.remaining ?? 0), 0);
      setSpawnProgress({
        level: state.maxUnlockedSpawnLevel ?? 1,
        maxLevel: state.levels?.length ?? 1,
        active,
        peak,
        eggGroups: state.activeEggGroups,
        regionName: display.regionName,
      });
    },
    [display.regionName]
  );

  const onCatchResult = useCallback(
    async (entry, isAlpha) => {
      try {
        const result = await api.catch(player.id, {
          entryId: entry.entryId,
          regionId: session.regionId,
          ballId: equippedBallId,
          isAlpha,
        });
        setPlayer(result.player);
        setGameRuntime((rt) => ({
          ...rt,
          spawnState: result.spawnState,
          caughtCount:
            result.player?.perPathProgress?.[session.regionId]?.caughtEntryIds?.length ??
            rt.caughtCount + 1,
          alphaSpawned: result.spawnState?.alphaCaught || rt.alphaSpawned,
        }));
        onSpawnProgress(result.spawnState);

        if (isAlpha && result.caught) {
          const stats = {
            caught: result.player?.perPathProgress?.[session.regionId]?.caughtEntryIds?.length,
            alphaCaught: true,
          };
          await api.mapComplete(player.id, {
            pathId: session.pathId,
            regionId: session.regionId,
            stats,
          });
          const updated = await api.getPlayer(player.id);
          setPlayer(updated);
          setCompleteStats(stats);
          goTo(SCREENS.gameComplete);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [player, session, equippedBallId, setPlayer, setGameRuntime, goTo, setCompleteStats, onSpawnProgress]
  );

  const quitToMenu = async () => {
    if (player?.id && gameRuntime?.spawnState) {
      await api.patchPlayer(player.id, {
        perPathProgress: {
          [session.regionId]: {
            ...player.perPathProgress?.[session.regionId],
            spawnState: gameRuntime.spawnState,
          },
        },
      });
    }
    clearAllBiomeCaches();
    goTo(SCREENS.welcome);
  };
  const changeStyle = async (styleId) => {
    try {
      const selectedStyle = PLAYER_STYLES.find((s) => s.id === styleId);
      if (!selectedStyle) return;
      const patched = await api.patchPlayer(player.id, {
        characterStyle: selectedStyle
      });
      setPlayer(patched);
    } catch (e) {
      console.error('Failed to change trainer style:', e);
      setPlayer((prev) => ({
        ...prev,
        characterStyle: PLAYER_STYLES.find((s) => s.id === styleId),
      }));
    }
  };

  useEffect(() => {
    if (gameRuntime?.spawnState) {
      onSpawnProgress(gameRuntime.spawnState);
    }
  }, [gameRuntime?.spawnState, onSpawnProgress]);

  if (!gameRuntime || !session) return null;

  const spawnState = gameRuntime.spawnState;

  return (
    <main className="game-shell">
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <color attach="background" args={['#9fd0ef']} />
        <fogExp2 attach="fog" args={['#c5e4f8', 0.0034]} />
        <ambientLight intensity={0.72} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={1.35}
          position={SUN_POSITION}
        />
        <GameScene
          session={session}
          player={player}
          gameRuntime={gameRuntime}
          equippedBall={equippedBall}
          throwPower={throwPower}
          onCatchResult={onCatchResult}
          paused={paused}
          onSpawnProgress={onSpawnProgress}
        />
      </Canvas>

      <div className="hud">
        <strong>{display.label}</strong>
        <span>Trainer: {player.displayName}</span>
        <span>Click game window · WASD move · F throw · E companion</span>
        <span>Ball: {equippedBall.name}</span>
        <span>
          {formatSpawnProgressLine({
            level: spawnProgress.level,
            maxLevel: spawnProgress.maxLevel,
            active: spawnProgress.active,
            peak: spawnProgress.peak,
            eggGroups: spawnProgress.eggGroups || spawnState?.activeEggGroups,
            regionName: spawnProgress.regionName || display.regionName,
          })}
        </span>
        <span>Creatures caught: {gameRuntime.caughtCount}</span>
        {isAlphaEligible(spawnState) && !spawnState.alphaCaught && (
          <span>Alpha eligible!</span>
        )}
      </div>

      <div className="crosshair" aria-hidden="true">
        <span className="crosshair-line crosshair-line-horizontal" />
        <span className="crosshair-line crosshair-line-vertical" />
        <span className="crosshair-dot" />
      </div>

      <Hotbar equippedBallId={equippedBallId} throwPower={throwPower} />

      <div className="hud-actions">
        <Button onClick={() => goTo(SCREENS.pokedex)}>Pokédex</Button>
      </div>

      {paused && (
        <div className="pause-overlay">
          <div className="pause-menu">
            <h3>Paused</h3>
            <p>WASD move · F throw · Q/R power · E companion</p>
            <div className="style-picker">
              <h4>Change Trainer Style</h4>
              <div className="style-grid">
                {PLAYER_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    className={`style-btn ${
                      (player.characterStyle?.id || 'player-21') === style.id ? 'active' : ''
                    }`}
                    onClick={() => changeStyle(style.id)}
                  >
                    <span className="style-id-num">{style.id.replace('player-', '')}</span>
                    <span className="style-label-text">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="btn-row">
              <Button variant="primary" onClick={() => setPaused(false)}>
                Resume
              </Button>
              <Button onClick={quitToMenu}>Quit to menu</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
