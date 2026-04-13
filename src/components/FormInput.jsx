export function FormInput({ label, required, placeholder, value, onChange, type = 'text', hint, error, fieldId }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <input
        className="field-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      />
      {hint && !error && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -2 }}>{hint}</span>}
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

export function HeightWeightInput({ label, required, value, onChange, error, fieldId }) {
  const parts = (value || '').split('/')
  const boy = parts[0] || ''
  const vazn = parts[1] || ''

  const handleBoy = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 3)
    onChange(`${v}/${vazn}`)
  }
  const handleVazn = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 3)
    onChange(`${boy}/${v}`)
  }

  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          className="field-input"
          type="text"
          inputMode="numeric"
          placeholder="Boy (sm)"
          value={boy}
          onChange={handleBoy}
          maxLength={3}
          style={{ ...(error ? { borderColor: 'var(--danger)' } : {}) }}
        />
        <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 18 }}>/</span>
        <input
          className="field-input"
          type="text"
          inputMode="numeric"
          placeholder="Vazn (kg)"
          value={vazn}
          onChange={handleVazn}
          maxLength={3}
          style={{ ...(error ? { borderColor: 'var(--danger)' } : {}) }}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

export function FormTextarea({ label, required, placeholder, value, onChange, rows = 3, error, fieldId }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <textarea
        className="field-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

function formatPhone(raw) {
  const d = (raw || '').replace(/\D/g, '').slice(0, 9)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0,2)} ${d.slice(2)}`
  if (d.length <= 7) return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`
  return `${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5,7)} ${d.slice(7)}`
}

export function PhoneInput({ label, required, value, onChange, error, fieldId }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <div className="phone-input-wrap" style={error ? { borderColor: 'var(--danger)' } : {}}>
        <span className="phone-prefix">+998</span>
        <input
          className="field-input"
          type="tel"
          placeholder="XX XXX XX XX"
          value={formatPhone(value)}
          onChange={e => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
          maxLength={12}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

function formatMoney(raw) {
  const digits = (raw || '').toString().replace(/\D/g, '')
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function MoneyInput({ label, required, placeholder, value, onChange, error, fieldId }) {
  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <input
        className="field-input"
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={formatMoney(value)}
        onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      />
      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}
