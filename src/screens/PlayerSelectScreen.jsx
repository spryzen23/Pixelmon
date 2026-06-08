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
      <p className="screen-subtitle">Select your character profile</p>
      {loading && <p>Loading...</p>}
      <div className="trainer-grid">
        {players.map((p) => {
          const styleInfo = normalizePlayerStyle(p.characterStyle);
          return (
            <button
              key={p.id}
              type="button"
              className="trainer-card"
              onClick={() => select(p.id)}
            >
              <div className="trainer-avatar">
                {(p.displayName || 'Trainer').charAt(0).toUpperCase()}
              </div>
              <div className="trainer-details">
                <h3 className="trainer-name">{p.displayName || 'Unnamed Trainer'}</h3>
                <span className="trainer-style">{styleInfo.label}</span>
                <div className="trainer-stats">
                  <span className="stat-badge">
                    🏆 {p.completedPathIds?.length ?? 0} Maps
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        <button
          type="button"
          className="trainer-card new-trainer-card"
          onClick={() => goTo(SCREENS.profileSetup)}
        >
          <div className="trainer-avatar new-trainer-avatar">
            ＋
          </div>
          <div className="trainer-details">
            <h3 className="trainer-name">New Trainer</h3>
            <span className="trainer-style">Create a new profile</span>
          </div>
        </button>
      </div>
      <div className="btn-row">
        <Button onClick={() => goTo(SCREENS.welcome)}>Back</Button>
        <Button variant="primary" onClick={() => goTo(SCREENS.profileSetup)}>
          New trainer
        </Button>
      </div>
    </div>
  );
}
