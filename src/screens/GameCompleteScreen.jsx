import { useGame, SCREENS } from '../context/GameContext';
import { getBiomeDisplayInfo } from '../game/biomeDisplay';
import { Button } from '../components/ui/Button';

export function GameCompleteScreen() {
  const { completeStats, session, goTo } = useGame();
  const display = getBiomeDisplayInfo(session?.pathId ?? 0);

  return (
    <div className="screen screen-shell game-complete">
      <h2 className="screen-title">Map complete!</h2>
      <p className="screen-subtitle">{display.label} cleared.</p>
      {completeStats && (
        <ul className="stats-list glass-panel">
          <li>Caught: {completeStats.caught ?? 0}</li>
          <li>Alpha: {completeStats.alphaCaught ? 'Yes' : 'No'}</li>
        </ul>
      )}
      <div className="btn-row">
        <Button variant="primary" onClick={() => goTo(SCREENS.welcome)}>
          Main menu
        </Button>
        <Button onClick={() => goTo(SCREENS.mapSelect)}>Play another map</Button>
      </div>
    </div>
  );
}
