export function CompanionHotbar({ companions = [], activeEntryId, onSelect }) {
  if (!companions.length) return null;

  const visible = companions.slice(0, 5);

  return (
    <nav className="companion-hotbar-hud" aria-label="Companion selection">
      <div className="companion-hud-title">Companions</div>
      {visible.map((comp, idx) => {
        const isActive = activeEntryId === comp.entryId;
        const type = comp.types?.[0] || 'normal';
        const hotkeyLabel = idx === 4 ? '0' : String(idx + 6);

        return (
          <button
            key={comp.entryId}
            type="button"
            className={`companion-hud-btn${isActive ? ' active' : ''}`}
            aria-pressed={isActive}
            aria-label={`${comp.displayName}, ${comp.types?.join(' / ') || 'normal'}`}
            onClick={() => onSelect(idx)}
          >
            <span className="companion-hud-key">{hotkeyLabel}</span>
            <span className="companion-hud-details">
              <span className="companion-hud-name">{comp.displayName}</span>
              <span className="companion-hud-types">{comp.types?.join(' / ')}</span>
            </span>
            <span className={`type-badge-mini ${type}`} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
