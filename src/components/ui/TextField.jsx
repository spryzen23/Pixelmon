export function TextField({ label, id, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className={`field-label ${className}`} htmlFor={inputId}>
      {label}
      <input id={inputId} className="field-input" {...props} />
    </label>
  );
}
