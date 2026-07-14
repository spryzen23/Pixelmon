import { getBiomeDisplayInfo } from "../game/biomeDisplay";

export default function LoadingOverlay({
  currentPathId = 0,
  isLoading = false,
}) {
  const display = getBiomeDisplayInfo(currentPathId);

  return (
    <div className={`loading-overlay ${isLoading ? "visible" : ""}`}>
      <div className="loading-panel">
        <span className="loading-label">Loading Area</span>
        <strong>{display.regionName}</strong>
        <span className="loading-terrain">{display.terrainName}</span>
        <span className="loading-bar">
          <span className="loading-bar-fill" />
        </span>
      </div>
    </div>
  );
}
