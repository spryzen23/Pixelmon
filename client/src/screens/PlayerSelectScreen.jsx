import { useEffect, useState } from 'react';
import { api } from '../api';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';
import { normalizePlayerStyle } from '../game/playerStyles';

export function PlayerSelectScreen() {
  const { goTo, setPlayer } = useGame();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listPlayers()
      .then((d) => setPlayers(d.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  const select = async (id) => {
    const p = await api.getPlayer(id);
    setPlayer(p);
    localStorage.setItem('pixelmon-lastPlayerId', id);
    goTo(SCREENS.mapSelect);
  };

  return (
    <div className="screen screen-shell">
      <h2 className="screen-title">Choose trainer</h2>
      {loading && <p>Loading...</p>}
      <ul className="player-list">
        {players.map((p) => (
          <li key={p.id}>
            <button type="button" className="path-card" onClick={() => select(p.id)}>
              <span className="path-badge">★</span>
              <span className="path-card-labels">
                <span className="path-card-terrain">{p.displayName}</span>
                <span className="path-card-region">
                  {normalizePlayerStyle(p.characterStyle).label} - Completed maps: {p.completedPathIds?.length ?? 0}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="btn-row">
        <Button onClick={() => goTo(SCREENS.welcome)}>Back</Button>
        <Button variant="primary" onClick={() => goTo(SCREENS.profileSetup)}>
          New trainer
        </Button>
      </div>
    </div>
  );
}
