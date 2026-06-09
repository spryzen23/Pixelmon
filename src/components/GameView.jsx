import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import { api } from '../api';
import { useGame, SCREENS, GAME_MODES } from '../context/GameContext';
import { GameScene } from './GameScene';
import Hotbar from './Hotbar';
import { GameHudPanel } from './GameHudPanel';
import { CompanionHotbar } from './CompanionHotbar';
import LoadingOverlay from './LoadingOverlay';
import { SceneTheme } from './SceneTheme';
import { BALL_TYPES, DEFAULT_BALL } from '../game/balls';
import { PLAYER_STYLES } from '../game/playerStyles';
import {
  formatSpawnProgressLine,
  getBiomeDisplayInfo,
} from '../game/biomeDisplay';
import {
  clearBiomeLoadMetrics,
  downloadBiomeLoadMetrics,
  recordBiomeLoadMetric,
} from '../game/biomeLoadMetrics';
import { isAlphaEligible, initBiomeSpawnState } from '../game/spawnController';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from '../game/projectilePhysics';
import { resolveSceneTheme } from '../game/sceneThemes';
import {
  CAVE_ZONES,
  WORLD_PATHS,
  clearAllBiomeCaches,
  getBiomeCacheSummary,
  preloadSpawnChunk,
  setActivePathId,
} from '../game/world';
import { Button } from './ui/Button';

export function GameView() {
  const {
    player,
    setPlayer,
    session,
    setSession,
    gameRuntime,
    setGameRuntime,
    goTo,
    setCompleteStats,
    gameMode,
    spawnLadder,
  } = useGame();
  const isSandbox = gameMode === GAME_MODES.sandbox;
  const pendingBiomeLoadRef = useRef(null);
  const [sandboxPathId, setSandboxPathId] = useState(0);
  const [caveZone, setCaveZone] = useState(CAVE_ZONES.EXTERIOR);
  const [iceRoomId, setIceRoomId] = useState(null);
  const [isCaveTransitioning, setIsCaveTransitioning] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [ordinaryLeft, setOrdinaryLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const [spawnProgress, setSpawnProgress] = useState({ level: 1, peak: 0, active: 0, maxLevel: 1 });
  const [pathPage, setPathPage] = useState(0);
  const [stylePage, setStylePage] = useState(0);
  const [glRecoveryKey, setGlRecoveryKey] = useState(0);
  const PATHS_PER_PAGE = 4;
  const STYLES_PER_PAGE = 6;

  const activePathId = isSandbox ? sandboxPathId : session?.pathId ?? 0;

  const display = useMemo(
    () => getBiomeDisplayInfo(activePathId),
    [activePathId]
  );

  const sceneTheme = useMemo(
    () =>
      resolveSceneTheme({
        terrainType: display.terrainType,
        fantasyBiome: display.fantasyBiome,
        caveZone,
        iceRoomId,
      }),
    [display.terrainType, display.fantasyBiome, caveZone, iceRoomId]
  );

  useEffect(() => {
    if (!isSandbox || session) return;
    const info = getBiomeDisplayInfo(sandboxPathId);
    setSession({
      pathId: sandboxPathId,
      regionId: info.regionId,
      fantasyBiome: info.fantasyBiome,
    });
    setGameRuntime({
      spawnState: initBiomeSpawnState(info.regionId, {}, spawnLadder || { regions: {} }),
      byLevel: {},
      caughtCount: 0,
      alphaSpawned: false,
    });
    if (!player) {
      setPlayer({
        id: 'sandbox',
        displayName: 'Explorer',
        characterStyle: PLAYER_STYLES[0],
        companion: { modelUrl: '/assets/companion.glb' },
      });
    }
  }, [isSandbox, session, sandboxPathId, setSession, setGameRuntime, player, setPlayer, spawnLadder]);

  const switchCompanion = useCallback(async (index) => {
    if (!player || !player.companions || !player.companions[index]) return;
    const nextCompanion = player.companions[index];
    if (player.companion?.entryId === nextCompanion.entryId) return;

    const updatedPlayer = {
      ...player,
      companion: nextCompanion
    };
    setPlayer(updatedPlayer);

    if (!isSandbox) {
      try {
        await api.patchPlayer(player.id, { companion: nextCompanion });
      } catch (err) {
        console.error('Failed to sync active companion to server:', err);
      }
    }
  }, [player, setPlayer, isSandbox]);

  const equippedBall = useMemo(
    () => BALL_TYPES.find((b) => b.id === equippedBallId) || DEFAULT_BALL,
    [equippedBallId]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') setPaused((p) => !p);
      const ball = BALL_TYPES.find((b) => b.key === e.key);
      if (ball) {
        const isUnlimited = player?.id === 'sandbox' || ball.id === 'standard';
        const count = isUnlimited ? 999 : (player?.inventory?.balls?.[ball.id] ?? 0);
        if (count > 0) {
          setEquippedBallId(ball.id);
        }
      }
      if (e.code === 'KeyR') {
        setThrowPower((c) => Math.min(MAX_THROW_POWER, c + THROW_POWER_STEP));
      }
      if (e.code === 'KeyQ') {
        setThrowPower((c) => Math.max(MIN_THROW_POWER, c - THROW_POWER_STEP));
      }

      // Companion hotkeys
      if (player?.companions && player.companions.length > 0) {
        if (e.code === 'Digit6') switchCompanion(0);
        if (e.code === 'Digit7') switchCompanion(1);
        if (e.code === 'Digit8') switchCompanion(2);
        if (e.code === 'Digit9') switchCompanion(3);
        if (e.code === 'Digit0') switchCompanion(4);

        if (e.code === 'BracketLeft') {
          const currentIdx = player.companions.findIndex((c) => c.entryId === player.companion?.entryId);
          const nextIdx = (currentIdx - 1 + player.companions.length) % player.companions.length;
          switchCompanion(nextIdx);
        }
        if (e.code === 'BracketRight') {
          const currentIdx = player.companions.findIndex((c) => c.entryId === player.companion?.entryId);
          const nextIdx = (currentIdx + 1) % player.companions.length;
          switchCompanion(nextIdx);
        }
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
  }, [player, switchCompanion]);

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
      if (isSandbox) {
        setOrdinaryLeft((n) => Math.max(0, n - 1));
        return;
      }
      try {
        const result = await api.catch(player.id, {
          entryId: entry.entryId,
          regionId: session.regionId,
          ballId: equippedBallId,
          isAlpha,
        });
        setPlayer(result.player);
        if (equippedBallId !== 'standard') {
          const remaining = result.player?.inventory?.balls?.[equippedBallId] ?? 0;
          if (remaining <= 0) {
            setEquippedBallId('standard');
          }
        }
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
    [player, session, equippedBallId, setPlayer, setGameRuntime, goTo, setCompleteStats, onSpawnProgress, isSandbox]
  );

  const handleBiomeReady = useCallback(
    (loadSummary = {}) => {
      if (loadSummary.phase === 'spawn') {
        setIsMapLoading(false);
        return;
      }

      const pending = pendingBiomeLoadRef.current;
      if (pending && pending.biomeId === activePathId) {
        const cacheAfter = getBiomeCacheSummary(activePathId, caveZone);
        recordBiomeLoadMetric({
          activeBlockCount: loadSummary.activeBlockCount ?? cacheAfter.blockCount,
          activeChunkCount: loadSummary.activeChunkCount ?? cacheAfter.chunkCount,
          biomeId: activePathId,
          biomeName: display.label,
          biomeType: display.fantasyBiome,
          cacheHit: pending.cacheBefore.chunkCount > 0,
          durationMs: loadSummary.durationMs ?? performance.now() - pending.startMs,
          trigger: pending.trigger,
        });
        pendingBiomeLoadRef.current = null;
      }
      setIsMapLoading(false);
    },
    [activePathId, caveZone, display.fantasyBiome, display.label]
  );

  const handleSandboxBiomeSwitch = useCallback((pathId) => {
    if (pathId === sandboxPathId) return;
    setIsMapLoading(true);
    setCaveZone(CAVE_ZONES.EXTERIOR);
    setIceRoomId(null);
    pendingBiomeLoadRef.current = {
      biomeId: pathId,
      cacheBefore: getBiomeCacheSummary(pathId, CAVE_ZONES.EXTERIOR),
      startMs: performance.now(),
      trigger: 'biome_switch',
    };
    setSandboxPathId(pathId);
    setActivePathId(pathId);
    preloadSpawnChunk(pathId);
  }, [sandboxPathId]);

  const handleEnterCave = useCallback(() => {
    if (display.fantasyBiome !== 'cave' || caveZone === CAVE_ZONES.INTERIOR) return;
    setIsCaveTransitioning(true);
    window.setTimeout(() => {
      setCaveZone(CAVE_ZONES.INTERIOR);
      window.setTimeout(() => setIsCaveTransitioning(false), 260);
    }, 220);
  }, [caveZone, display.fantasyBiome]);

  const handleExitCave = useCallback(() => {
    if (caveZone !== CAVE_ZONES.INTERIOR) return;
    setIsCaveTransitioning(true);
    window.setTimeout(() => {
      setCaveZone(CAVE_ZONES.EXTERIOR);
      window.setTimeout(() => setIsCaveTransitioning(false), 260);
    }, 220);
  }, [caveZone]);

  const handleExitIceRoom = useCallback((_roomId) => {
    setIsCaveTransitioning(true);
    window.setTimeout(() => {
      setIceRoomId(null);
      window.setTimeout(() => setIsCaveTransitioning(false), 260);
    }, 220);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'KeyX' || e.repeat) return;
      if (iceRoomId) {
        e.preventDefault();
        handleExitIceRoom(iceRoomId);
        return;
      }
      if (display.fantasyBiome === 'cave' && caveZone === CAVE_ZONES.INTERIOR) {
        e.preventDefault();
        handleExitCave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [caveZone, display.fantasyBiome, handleExitCave, handleExitIceRoom, iceRoomId]);

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
    goTo(SCREENS.dashboard);
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

  const uiCanvasRef = useRef(null);
  const uiContainerRef = useRef(null);

  useEffect(() => {
    const canvas = uiCanvasRef.current;
    const uiContainer = uiContainerRef.current;
    if (!canvas || !uiContainer) return;

    const ctx = canvas.getContext('2d');

    const handlePaint = () => {
      ctx.reset();
      const transform = ctx.drawElementImage(uiContainer, 0, 0);
      uiContainer.style.transform = transform.toString();
    };

    canvas.onpaint = handlePaint;

    const observer = new ResizeObserver(([entry]) => {
      const dpc = entry.devicePixelContentBoxSize;
      canvas.width = dpc
        ? dpc[0].inlineSize
        : Math.round(entry.contentRect.width * window.devicePixelRatio);
      canvas.height = dpc
        ? dpc[0].blockSize
        : Math.round(entry.contentRect.height * window.devicePixelRatio);
      canvas.requestPaint();
    });

    const supportsDevicePixelContentBox =
      typeof ResizeObserverEntry !== 'undefined' &&
      'devicePixelContentBoxSize' in ResizeObserverEntry.prototype;
    const options = supportsDevicePixelContentBox ? { box: 'device-pixel-content-box' } : {};
    observer.observe(canvas, options);

    return () => {
      observer.disconnect();
      canvas.onpaint = null;
    };
  }, []);

  useEffect(() => {
    uiCanvasRef.current?.requestPaint?.();
  }, [
    display,
    player,
    spawnProgress,
    gameRuntime,
    equippedBall,
    throwPower,
    isSandbox,
    ordinaryLeft,
    isMapLoading,
    activePathId,
    isCaveTransitioning,
    paused,
  ]);

  if (!isSandbox && (!gameRuntime || !session)) return null;
  if (isSandbox && (!gameRuntime || !session)) return <LoadingOverlay currentPathId={sandboxPathId} isLoading />;

  const spawnState = gameRuntime.spawnState;
  const effectiveSession = isSandbox
    ? { ...session, pathId: sandboxPathId, fantasyBiome: display.fantasyBiome }
    : session;

  return (
    <main className="game-shell">
      <Canvas
        key={glRecoveryKey}
        shadows
        camera={{ position: [0, 8, 10], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.domElement.addEventListener(
            'webglcontextlost',
            (event) => {
              event.preventDefault();
              setGlRecoveryKey((key) => key + 1);
            },
            { once: true }
          );
        }}
      >
        <SceneTheme theme={sceneTheme}>
          <GameScene
            session={effectiveSession}
            player={player}
            gameRuntime={gameRuntime}
            equippedBall={equippedBall}
            throwPower={throwPower}
            onCatchResult={onCatchResult}
            paused={paused}
            onSpawnProgress={onSpawnProgress}
            onBiomeReady={handleBiomeReady}
            caveZone={caveZone}
            iceRoomId={iceRoomId}
            onEnterCave={handleEnterCave}
            onEnterIceRoom={setIceRoomId}
            onExitIceRoom={handleExitIceRoom}
            gameMode={gameMode}
            multiWildCount={isSandbox ? 4 : 1}
          />
        </SceneTheme>
      </Canvas>

      <canvas ref={uiCanvasRef} id="ui-canvas" className="ui-canvas" layoutsubtree="">
        <div ref={uiContainerRef} id="ui-container">
          <div className="hud-left-stack">
            <GameHudPanel
              locationLabel={display.label}
              trainerName={player.displayName}
              equippedBallName={equippedBall.name}
              spawnProgressLine={formatSpawnProgressLine({
                level: spawnProgress.level,
                maxLevel: spawnProgress.maxLevel,
                active: spawnProgress.active,
                peak: spawnProgress.peak,
                eggGroups: spawnProgress.eggGroups || spawnState?.activeEggGroups,
                regionName: spawnProgress.regionName || display.regionName,
              })}
              caughtCount={gameRuntime.caughtCount}
              showAlphaEligible={isAlphaEligible(spawnState) && !spawnState.alphaCaught}
              isSandbox={isSandbox}
              ordinaryLeft={ordinaryLeft}
            />

            <CompanionHotbar
              companions={player?.companions}
              activeEntryId={player?.companion?.entryId}
              onSelect={switchCompanion}
            />
          </div>

          <div className="crosshair" aria-hidden="true">
            <span className="crosshair-line crosshair-line-horizontal" />
            <span className="crosshair-line crosshair-line-vertical" />
            <span className="crosshair-dot" />
          </div>

          <Hotbar
            equippedBallId={equippedBallId}
            throwPower={throwPower}
            onSelectBall={setEquippedBallId}
          />

          <div className="hud-actions">
            {!isSandbox && <Button onClick={() => goTo(SCREENS.pokedex)}>Pokédex</Button>}
            {isSandbox && (
              <Button onClick={() => goTo(SCREENS.dashboard)}>Dashboard</Button>
            )}
          </div>

          {isSandbox && (
            <div className="path-menu">
              <div className="path-pager-header">
                <button type="button" disabled={pathPage <= 0} onClick={() => setPathPage((p) => p - 1)}>‹</button>
                <span>Biomes {pathPage + 1}/{Math.ceil(WORLD_PATHS.length / PATHS_PER_PAGE)}</span>
                <button
                  type="button"
                  disabled={pathPage >= Math.ceil(WORLD_PATHS.length / PATHS_PER_PAGE) - 1}
                  onClick={() => setPathPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
              <div className="path-list">
                {WORLD_PATHS.slice(pathPage * PATHS_PER_PAGE, (pathPage + 1) * PATHS_PER_PAGE).map((biome) => (
                  <button
                    key={biome.id}
                    className={biome.id === sandboxPathId ? 'active' : ''}
                    disabled={isMapLoading}
                    type="button"
                    onClick={() => handleSandboxBiomeSwitch(biome.id)}
                  >
                    <span>{biome.id + 1}</span>
                    {biome.name}
                  </button>
                ))}
              </div>
              <div className="analytics-actions">
                <button type="button" onClick={downloadBiomeLoadMetrics}>
                  Export Metrics
                </button>
                <button type="button" onClick={clearBiomeLoadMetrics}>
                  Clear Metrics
                </button>
              </div>
            </div>
          )}

          <LoadingOverlay currentPathId={activePathId} isLoading={isMapLoading} />

          <div className={`cave-fade-overlay ${isCaveTransitioning ? 'visible' : ''}`} />

          {paused && (
            <div className="pause-overlay">
              <div className="pause-menu">
                <h3>Paused</h3>
                <p>WASD move · F throw · Q/R power · E companion</p>
                <div className="style-picker">
                  <h4>Change Trainer Style</h4>
                  <div className="style-pager-header">
                    <button type="button" disabled={stylePage <= 0} onClick={() => setStylePage((p) => p - 1)}>‹</button>
                    <span>{stylePage + 1}/{Math.ceil(PLAYER_STYLES.length / STYLES_PER_PAGE)}</span>
                    <button
                      type="button"
                      disabled={stylePage >= Math.ceil(PLAYER_STYLES.length / STYLES_PER_PAGE) - 1}
                      onClick={() => setStylePage((p) => p + 1)}
                    >
                      ›
                    </button>
                  </div>
                  <div className="style-grid">
                    {PLAYER_STYLES.slice(stylePage * STYLES_PER_PAGE, (stylePage + 1) * STYLES_PER_PAGE).map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        className={`style-btn ${(player.characterStyle?.id || 'player-21') === style.id ? 'active' : ''}`}
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
        </div>
      </canvas>
    </main>
  );
}
