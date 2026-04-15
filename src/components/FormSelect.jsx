export function FormSelect({ label, required, value, onChange, options = [], error, fieldId }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <select
        className="field-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      >
        <option value="">Tanlang</option>
        {options.map(opt =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.label}</option>
        )}
      </select>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

export function RadioGroup({ label, required, value, onChange, options = [], error, fieldId, style }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <div className="radio-group" style={style}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`radio-btn${value === opt.value ? ' active' : ''}${error ? ' error' : ''}`}
            onClick={() => onChange(opt.value)}
            style={error && value !== opt.value ? { borderColor: 'var(--danger)' } : {}}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}
