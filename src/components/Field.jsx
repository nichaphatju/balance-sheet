export default function Field({ id, label, value, onChange, type = 'number', wide, hint, ph, req, autoFocus, children }) {
  return (
    <div className={'fld' + (wide ? ' wide' : '')}>
      <label htmlFor={id}>{label}</label>
      {children ?? (
        <input
          id={id}
          name={id}
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          step={type === 'number' ? 'any' : undefined}
          min={type === 'number' ? 0 : undefined}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={ph}
          required={req}
          autoFocus={autoFocus}
        />
      )}
      {hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
