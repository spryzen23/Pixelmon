import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useGame, SCREENS, GAME_MODES } from "../context/GameContext";
import { getBiomeDisplayInfo } from "../game/biomeDisplay";
import { Button } from "../components/ui/Button";
import { ScreenFrame, ScreenFooter } from "../components/ui/layout/ScreenFrame";

export function GameCompleteScreen() {
  const { completeStats, session, player, goTo, setSession, setGameMode } =
    useGame();
  const display = getBiomeDisplayInfo(session?.pathId ?? 0);

  useEffect(() => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }, []);

  const nextPathId = (session?.pathId ?? 0) + 1;
  const nextDisplay = getBiomeDisplayInfo(nextPathId);
  const hasNext = player?.unlockedPathIds?.includes(nextPathId);

  const handleNextMap = () => {
    if (!hasNext) return;
    setSession({
      pathId: nextPathId,
      regionId: nextDisplay.regionId,
      terrainName: nextDisplay.terrainName,
    });
    setGameMode(GAME_MODES.campaign);
    goTo(SCREENS.loading);
  };

  const header = (
    <div>
      <h2 className="screen-title">Map Complete!</h2>
      <p className="screen-subtitle">{display.label} cleared</p>
    </div>
  );

  const footer = (
    <ScreenFooter>
      {hasNext && (
        <Button variant="primary" onClick={handleNextMap}>
          Next Map
        </Button>
      )}
      <Button onClick={() => goTo(SCREENS.dashboard)}>Dashboard</Button>
    </ScreenFooter>
  );

  return (
    <ScreenFrame className="game-complete" header={header} footer={footer}>
      {completeStats && (
        <div className="game-complete-stats glass-panel">
          <div className="game-complete-stat">
            <span className="info-label">Caught</span>
            <span className="info-value">{completeStats.caught ?? 0}</span>
          </div>
          <div className="game-complete-stat">
            <span className="info-label">Alpha</span>
            <span className="info-value">
              {completeStats.alphaCaught ? "Yes" : "No"}
            </span>
          </div>
        </div>
      )}
    </ScreenFrame>
  );
}
