import { BALL_TYPES } from '../game/balls';
import { useGame } from '../context/GameContext';
import { ProgressBar } from './ui/ProgressBar';
import {
  MAX_THROW_POWER,
  MIN_THROW_POWER,
} from '../game/projectilePhysics';

function ballPreviewStyle(ball) {
  return {
    background: `radial-gradient(circle at 32% 28%, ${ball.accentColor} 0 30%, ${ball.color} 30% 100%)`,
    boxShadow: 'inset 0 -2px 0 rgba(0, 0, 0, 0.2)',
  };
}

function formatBallCount(player, ball) {
  const isUnlimited = player?.id === 'sandbox' || ball.id === 'standard';
  if (isUnlimited) return '∞';
  return player?.inventory?.balls?.[ball.id] ?? 0;
}

export default function Hotbar({ equippedBallId, throwPower, onSelectBall }) {
  const { player } = useGame();
  const powerPercent = Math.round(
    ((throwPower - MIN_THROW_POWER) / (MAX_THROW_POWER - MIN_THROW_POWER)) * 100
  );

  return (
    <div className="hotbar-wrap">
      <ProgressBar
        className="hotbar-power-meter"
        label="Power"
        sublabel={`${powerPercent}%`}
        value={powerPercent}
      />

      <div className="hotbar" role="toolbar" aria-label="Ball inventory hotbar">
        {BALL_TYPES.map((ball) => {
          const isEquipped = ball.id === equippedBallId;
          const count = formatBallCount(player, ball);
          const isDisabled = count !== '∞' && count <= 0;

          return (
            <button
              key={ball.id}
              type="button"
              className={[
                'hotbar-slot',
                isEquipped ? 'equipped' : '',
                isDisabled ? 'disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={isEquipped}
              aria-label={`${ball.name}${isDisabled ? ', out of stock' : ''}`}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelectBall?.(ball.id)}
            >
              <span className="hotbar-key">{ball.key}</span>
              <span
                className="hotbar-ball-preview"
                style={ballPreviewStyle(ball)}
                aria-hidden="true"
              />
              <span className="hotbar-name">{ball.name}</span>
              <span className={`hotbar-count${isDisabled ? ' empty' : ''}`}>
                {typeof count === 'number' ? `x${count}` : count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
