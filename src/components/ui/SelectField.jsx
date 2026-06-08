export function SelectField({ label, id, options, className = '', ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className={`field-label ${className}`} htmlFor={selectId}>
      {label && <span>{label}</span>}
      <select id={selectId} className="filter-select" {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
