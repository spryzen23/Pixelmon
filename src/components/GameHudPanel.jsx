import { Badge } from './ui/Badge';

export function GameHudPanel({
  locationLabel,
  trainerName,
  equippedBallName,
  spawnProgressLine,
  caughtCount,
  showAlphaEligible = false,
  isSandbox = false,
  ordinaryLeft = 0,
}) {
  return (
    <aside className="hud" aria-label="Game status">
      <header className="hud-header">
        <strong className="hud-location">{locationLabel}</strong>
      </header>

      <div className="hud-trainer-row">
        <span className="hud-label">Trainer</span>
        <span className="hud-value">{trainerName}</span>
      </div>

      <p className="hud-controls-hint">
        Click game window · WASD move · F/Space throw · E companion · X exit zones
      </p>

      <dl className="hud-stats">
        <div className="hud-stat-row">
          <dt className="hud-label">Ball</dt>
          <dd className="hud-value">{equippedBallName}</dd>
        </div>
        <div className="hud-stat-row hud-stat-row-wide">
          <dd className="hud-value">{spawnProgressLine}</dd>
        </div>
        <div className="hud-stat-row">
          <dt className="hud-label">Caught</dt>
          <dd className="hud-value">{caughtCount}</dd>
        </div>
        {isSandbox && (
          <div className="hud-stat-row">
            <dt className="hud-label">Field spawns</dt>
            <dd className="hud-value">{ordinaryLeft}</dd>
          </div>
        )}
      </dl>

      {showAlphaEligible && (
        <div className="hud-badges">
          <Badge variant="accent">Alpha eligible!</Badge>
        </div>
      )}
    </aside>
  );
}
