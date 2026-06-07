export function RadioGroup({ name, value, onChange, options, renderOption }) {
  return (
    <div className="starter-grid" role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const selected = value === option.value;
        const content = renderOption ? renderOption(option, selected) : option.label;
        return (
          <label
            key={option.value}
            className={`radio-card ${selected ? 'selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
            />
            {content}
          </label>
        );
      })}
    </div>
  );
}
