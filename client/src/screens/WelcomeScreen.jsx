import { api } from '../api';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';

export function WelcomeScreen() {
  const { goTo, setPlayer } = useGame();
  const lastId = localStorage.getItem('pixelmon-lastPlayerId');

  const continueLast = async () => {
    if (!lastId) {
      goTo(SCREENS.playerSelect);
      return;
    }
    try {
      const p = await api.getPlayer(lastId);
      setPlayer(p);
      goTo(SCREENS.mapSelect);
    } catch {
      goTo(SCREENS.playerSelect);
    }
  };

  return (
    <div className="screen welcome-screen">
      <h1 className="title">Pixelmon</h1>
      <p className="subtitle">Voxel Legends</p>
      <div className="controls-summary glass-panel">
        <p>WASD — Move · F — Throw ball · E — Companion</p>
        <p>1 / 2 / 3 — Ball type · Q / R — Throw power</p>
      </div>
      <div className="btn-row">
        {lastId && (
          <Button variant="primary" onClick={continueLast}>
            Continue
          </Button>
        )}
        <Button variant="primary" onClick={() => goTo(SCREENS.playerSelect)}>
          Choose player
        </Button>
        <Button onClick={() => goTo(SCREENS.profileSetup)}>New trainer</Button>
      </div>
    </div>
  );
}
