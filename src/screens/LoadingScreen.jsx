import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { ScreenFrame } from "../components/ui/layout/ScreenFrame";
import { getBiomeDisplayInfo } from "../game/biomeDisplay";
import { initBiomeSpawnState } from "../game/spawnController";
import { preloadBiome, setActivePathId } from "../game/world";
import { useGame, SCREENS } from "../context/GameContext";

export function LoadingScreen() {
  const {
    player,
    session,
    setSession,
    setGameRuntime,
    setSpawnLadder,
    goTo,
    setPlayer,
  } = useGame();
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("session");
  const [progress, setProgress] = useState(10);

  const playerRef = useRef(player);
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const playerId = player?.id;
  const sessionPathId = session?.pathId;
  const sessionRegionId = session?.regionId;
  const display = getBiomeDisplayInfo(sessionPathId ?? 0);

  useEffect(() => {
    if (!playerId || sessionPathId === undefined || !sessionRegionId) {
      goTo(SCREENS.dashboard);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setActivePathId(sessionPathId);
    setPhase("biome");
    setProgress(35);
    preloadBiome(sessionPathId);

    (async () => {
      try {
        const fetchOpts = { signal: controller.signal };
        setPhase("session");
        setProgress(25);

        const result = await api.startSession(
          playerId,
          { pathId: sessionPathId, regionId: sessionRegionId },
          fetchOpts
        );

        if (cancelled) return;
        setPhase("spawns");
        setProgress(55);

        const [spawnsRes, ladder, balls] = await Promise.all([
          api.getSpawns(sessionRegionId),
          api.getSpawnLadder(),
          api.getBalls(),
        ]);

        if (cancelled) return;
        setPhase("ready");
        setProgress(90);

        const byLevel = spawnsRes.byLevel || {};
        setSpawnLadder(ladder);

        const spawnState =
          result.spawnState ||
          initBiomeSpawnState(sessionRegionId, byLevel, ladder);

        const info = getBiomeDisplayInfo(sessionPathId);
        setSession((prev) =>
          prev ? { ...prev, fantasyBiome: info.fantasyBiome } : null
        );

        const latestPlayer = result.player || playerRef.current;
        setPlayer(latestPlayer);
        setGameRuntime({
          player: latestPlayer,
          spawnState,
          byLevel,
          caughtCount:
            latestPlayer?.perPathProgress?.[sessionRegionId]?.caughtEntryIds
              ?.length || 0,
          ballsConfig: balls,
          alphaSpawned: false,
        });

        setProgress(100);
        goTo(SCREENS.inGame);
      } catch (e) {
        if (!cancelled && e.name !== "AbortError") setError(e.message);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    playerId,
    sessionPathId,
    sessionRegionId,
    setGameRuntime,
    setSpawnLadder,
    goTo,
    setPlayer,
    setSession,
  ]);

  if (error) {
    return (
      <ScreenFrame className="screen-shell">
        <p className="error-text">{error}</p>
        <Button onClick={() => goTo(SCREENS.dashboard)}>
          Back to Dashboard
        </Button>
      </ScreenFrame>
    );
  }

  return (
    <ScreenFrame className="screen-shell loading-screen-frame">
      <div className="loading-panel glass-panel">
        <span className="loading-label">Loading Area</span>
        <strong>{display.regionName}</strong>
        <span className="loading-terrain">{display.terrainName}</span>
        <ProgressBar value={progress} label={phase} variant="neon" />
      </div>
    </ScreenFrame>
  );
}
