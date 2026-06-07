import { useEffect, useState } from 'react';
import { api } from '../api';
import LoadingOverlay from '../components/LoadingOverlay';
import { Button } from '../components/ui/Button';
import { initBiomeSpawnState } from '../game/spawnController';
import { preloadBiome, setActivePathId } from '../game/world';
import { useGame, SCREENS } from '../context/GameContext';

export function LoadingScreen() {
  const { player, session, setGameRuntime, setSpawnLadder, goTo, setPlayer } = useGame();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player || !session) {
      goTo(SCREENS.mapSelect);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setActivePathId(session.pathId);
    preloadBiome(session.pathId);

    (async () => {
      try {
        const fetchOpts = { signal: controller.signal };
        const [result, spawnsRes, ladder, balls] = await Promise.all([
          api.startSession(
            player.id,
            {
              pathId: session.pathId,
              regionId: session.regionId,
            },
            fetchOpts,
          ),
          api.getSpawns(session.regionId),
          api.getSpawnLadder(),
          api.getBalls(),
        ]);

        if (cancelled) return;

        const byLevel = spawnsRes.byLevel || {};
        setSpawnLadder(ladder);

        const spawnState =
          result.spawnState || initBiomeSpawnState(session.regionId, byLevel, ladder);

        setPlayer(result.player || player);
        setGameRuntime({
          player: result.player || player,
          spawnState,
          byLevel,
          caughtCount:
            result.player?.perPathProgress?.[session.regionId]?.caughtEntryIds?.length || 0,
          ballsConfig: balls,
          alphaSpawned: false,
        });

        setLoading(false);
        goTo(SCREENS.inGame);
      } catch (e) {
        if (!cancelled && e.name !== 'AbortError') setError(e.message);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [player, session, setGameRuntime, setSpawnLadder, goTo, setPlayer]);

  if (error) {
    return (
      <div className="screen screen-shell">
        <p className="error-text">{error}</p>
        <Button onClick={() => goTo(SCREENS.mapSelect)}>Back</Button>
      </div>
    );
  }

  return (
    <LoadingOverlay currentPathId={session?.pathId ?? 0} isLoading={loading} />
  );
}
