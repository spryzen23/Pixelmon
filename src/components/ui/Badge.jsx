export function Badge({ children, variant = "default", className = "" }) {
  return (
    <span className={`px-badge ${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}

export function CoinBadge({ amount, icon = "🪙" }) {
  return (
    <span className="px-coin-badge" title="PokéCoins balance">
      <span>{icon}</span>
      <span>
        {typeof amount === "number" ? amount.toLocaleString() : amount}
      </span>
    </span>
  );
}
