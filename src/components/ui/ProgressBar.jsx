export function ProgressBar({
  value = 0,
  label,
  sublabel,
  variant = "default",
  indeterminate = false,
  animated = false,
  className = "",
}) {
  const pct = Math.max(0, Math.min(100, value));
  const isIndeterminate = indeterminate || animated;

  if (label || sublabel) {
    return (
      <div className={`px-progress ${className}`}>
        <div className="px-progress-header">
          {label && <span>{label}</span>}
          {sublabel && <span>{sublabel}</span>}
        </div>
        <div className="px-progress-track">
          <div
            className={`px-progress-fill ${variant === "neon" ? "neon" : ""} ${isIndeterminate ? "indeterminate" : ""}`}
            style={isIndeterminate ? undefined : { width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`power-meter ${className}`}>
      <div className={isIndeterminate ? "loading-bar" : "power-track"}>
        <div
          className={isIndeterminate ? "loading-bar-fill" : "power-fill"}
          style={isIndeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
