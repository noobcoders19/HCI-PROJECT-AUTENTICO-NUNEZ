type ClearableInputProps = {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function ClearableInput({ label, value, type = "text", placeholder, onChange }: ClearableInputProps) {
  return (
    <div className="clearable-input">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
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
