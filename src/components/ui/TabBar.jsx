export function TabBar({ tabs, activeId, onChange, variant = "pill" }) {
  return (
    <div className="px-tab-bar" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeId === tab.id}
          className={
            variant === "underline"
              ? `px-tab-btn-underline ${activeId === tab.id ? "active" : ""}`
              : `px-tab-btn ${activeId === tab.id ? "active" : ""}`
          }
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
