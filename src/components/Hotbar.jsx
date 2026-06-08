import { BALL_TYPES } from '../game/balls';
import {
  MAX_THROW_POWER,
  MIN_THROW_POWER,
} from '../game/projectilePhysics';

function ballPreviewStyle(ball) {
  return {
    background: `radial-gradient(circle at 32% 28%, ${ball.accentColor} 0 30%, ${ball.color} 30% 100%)`,
    boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.2)',
  };
}

export default function Hotbar({ equippedBallId, throwPower }) {
  const powerPercent = Math.round(
    ((throwPower - MIN_THROW_POWER) / (MAX_THROW_POWER - MIN_THROW_POWER)) * 100
  );

  return (
    <div className="hotbar-wrap">
      <div className="power-meter">
        <span>Power: {powerPercent}%</span>
        <div className="power-track">
          <div
            className="power-fill"
            style={{ width: `${powerPercent}%` }}
          />
        </div>
      </div>

      <div className="hotbar" aria-label="Ball inventory hotbar">
        {BALL_TYPES.map((ball) => {
          const isEquipped = ball.id === equippedBallId;

          return (
            <div
              key={ball.id}
              className={`hotbar-slot${isEquipped ? ' equipped' : ''}`}
            >
              <span className="hotbar-key">{ball.key}</span>
              <div
                className="hotbar-ball-preview"
                style={ballPreviewStyle(ball)}
                aria-hidden="true"
              />
              <span className="hotbar-name">{ball.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
