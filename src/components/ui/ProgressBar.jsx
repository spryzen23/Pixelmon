export function ProgressBar({ value = 0, label, animated = false, className = '' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`power-meter ${className}`}>
      {label && <span>{label}</span>}
      <div className={animated ? 'loading-bar' : 'power-track'}>
        <div
          className={animated ? 'loading-bar-fill' : 'power-fill'}
          style={animated ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
