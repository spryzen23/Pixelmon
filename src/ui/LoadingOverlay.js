import { WORLD_PATHS } from '../world';

export default function LoadingOverlay({ currentPathId = 0, isLoading = false }) {
  const activePath = WORLD_PATHS.find((path) => path.id === currentPathId) ||
    WORLD_PATHS[0];

  return (
    <div className={`loading-overlay ${isLoading ? 'visible' : ''}`}>
      <div className="loading-panel">
        <span className="loading-label">Loading Area</span>
        <strong>{activePath.name}</strong>
        <span className="loading-bar">
          <span className="loading-bar-fill" />
        </span>
      </div>
    </div>
  );
}
