type ClearableSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
};

export default function ClearableSelect({ label, value, options, placeholder, onChange }: ClearableSelectProps) {
  const values = value && !options.includes(value) ? [value, ...options] : options;

  return (
    <div className="clearable-input">
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{placeholder}</option>
        {values.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <button
        type="button"
        className="clear-field"
        aria-label={`Clear ${label}`}
        title={`Clear ${label}`}
        disabled={!value}
        onClick={() => onChange("")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
        </svg>
      </button>
    </div>
  );
}
