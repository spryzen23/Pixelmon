import { useState } from "react";

export function SearchField({
  value,
  onChange,
  onSelect,
  suggestions = [],
  placeholder = "Search...",
  maxSuggestions = 5,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const visible = suggestions.slice(0, maxSuggestions);

  return (
    <div className={`px-search-field ${className}`}>
      <input
        type="text"
        className="filter-search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && visible.length > 0 && (
        <ul className="px-search-dropdown">
          {visible.map((item) => (
            <li
              key={item.id ?? item.value ?? item.label}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.(item);
                setOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
