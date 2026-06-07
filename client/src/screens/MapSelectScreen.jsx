import { useEffect } from 'react';
import { api } from '../api';
import { getBiomeDisplayInfo } from '../game/biomeDisplay';
import { useGame, SCREENS } from '../context/GameContext';
import { Button } from '../components/ui/Button';

export function MapSelectScreen() {
  const { player, biomeMap, setBiomeMap, setSession, goTo } = useGame();

  useEffect(() => {
    if (!player) {
      goTo(SCREENS.welcome);
      return;
    }
    api.getBiomes().then(setBiomeMap).catch(console.error);
  }, [player, goTo, setBiomeMap]);

  if (!player) return null;

  const regions = biomeMap?.regions || [];
  const unlocked = new Set(player.unlockedPathIds || [0]);
  const completed = new Set(player.completedPathIds || []);

  const startMap = (region) => {
    if (!region.playable) return;
    const display = getBiomeDisplayInfo(region.pathId);
    setSession({
      pathId: region.pathId,
      regionId: region.regionId,
      terrainName: display.terrainName || region.terrainName,
    });
    goTo(SCREENS.loading);
  };

  return (
    <div className="screen screen-shell">
      <h2 className="screen-title">Select map</h2>
      <p className="screen-subtitle">Trainer: {player.displayName}</p>
      <div className="path-grid">
        {regions.map((r) => {
          const display = getBiomeDisplayInfo(r.pathId);
          const isLocked = r.playable && !unlocked.has(r.pathId);
          const done = completed.has(r.pathId);
          const disabled = !r.playable || isLocked;
          return (
            <button
              key={r.regionId}
              type="button"
              className={`path-card ${disabled ? 'locked' : ''} ${done ? 'done' : ''}`}
              disabled={disabled}
              onClick={() => startMap(r)}
            >
              <span className="path-badge">{r.pathId + 1}</span>
              <span className="path-card-labels">
                <span className="path-card-terrain">{display.terrainName}</span>
                <span className="path-card-region">{display.regionName}</span>
              </span>
              <span className="path-card-meta">
                <span>Dex {r.minDex}–{r.maxDex}</span>
                {!r.playable && <span className="badge">Soon</span>}
                {isLocked && <span className="badge">Locked</span>}
                {done && <span className="badge done">Done</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div className="btn-row">
        <Button onClick={() => goTo(SCREENS.welcome)}>Main menu</Button>
        <Button onClick={() => goTo(SCREENS.pokedex)}>Pokédex</Button>
      </div>
    </div>
  );
}
