export function ScreenLoadingFallback() {
  return (
    <div className="loading-overlay visible" aria-busy="true" aria-label="Loading screen">
      <div className="loading-panel">
        <span className="loading-label">Pixelmon</span>
        <strong>Loading…</strong>
      </div>
    </div>
  );
}
