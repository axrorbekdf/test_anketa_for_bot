// HTML5 datalist — yozsa ham, tanlasa ham bo'ladi
export function Combobox({ label, required, value, onChange, options = [], placeholder, error, fieldId }) {
  const listId = `${fieldId || 'cb'}-list`
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <input
        list={listId}
        className="field-input"
        placeholder={placeholder || 'Tanlang yoki yozing...'}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      />
      <datalist id={listId}>
        {options.map(opt =>
          typeof opt === 'string'
            ? <option key={opt} value={opt} />
            : <option key={opt.value} value={opt.label} />
        )}
      </datalist>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}
