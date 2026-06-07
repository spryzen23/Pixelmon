export function Checkbox({ label, checked, onChange, id }) {
  const inputId = id || `cb-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label className="field-label" htmlFor={inputId} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
