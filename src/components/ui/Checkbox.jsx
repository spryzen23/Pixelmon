export function Checkbox({ label, checked, onChange, id }) {
  const inputId = id || `cb-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label className="px-checkbox-label" htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        className="px-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
