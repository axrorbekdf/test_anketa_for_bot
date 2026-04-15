import { useState } from 'react'

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
    const v = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 3)
    onChange(`${v}/${vazn}`)
  }
  const handleVazn = (e) => {
    const v = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 3)
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
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <input
            className="field-input"
            type="text"
            inputMode="numeric"
            placeholder="Boy (sm)"
            value={boy}
            onChange={handleBoy}
            maxLength={3}
            style={error ? { borderColor: 'var(--danger)' } : {}}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>120 – 230 sm</span>
        </div>
        <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: 18, paddingTop: 10 }}>/</span>
        <div style={{ flex: 1 }}>
          <input
            className="field-input"
            type="text"
            inputMode="numeric"
            placeholder="Vazn (kg)"
            value={vazn}
            onChange={handleVazn}
            maxLength={3}
            style={error ? { borderColor: 'var(--danger)' } : {}}
          />
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>40 – 150 kg</span>
        </div>
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

// iPhone-style sana tanlash (3 ta select: kun / oy / yil)

const MONTHS_UZ = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr',
]

function daysInMonth(year, month) {
  if (!year || !month) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

const selStyle = (hasErr) => ({
  height: 48,
  border: `1.5px solid ${hasErr ? 'var(--danger)' : 'var(--border)'}`,
  borderRadius: 12,
  background: '#fff',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text)',
  padding: '0 4px',
  WebkitAppearance: 'none',
  appearance: 'none',
  textAlign: 'center',
  textAlignLast: 'center',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
})

export function DateSelect({ label, required, value, onChange, error, fieldId, minYear = 1940, maxYear }) {
  const currentYear = new Date().getFullYear()
  const effectiveMax = maxYear !== undefined ? maxYear : currentYear

  // Partial state ichki saqlanadi — har bir selectni alohida tanlash mumkin
  const init = (value || '').split('-')
  const [localY, setLocalY] = useState(init[0] || '')
  const [localM, setLocalM] = useState(init[1] || '')
  const [localD, setLocalD] = useState(init[2] || '')

  const emit = (y, m, d) => {
    if (y && m && d) onChange(`${y}-${m}-${d}`)
    // partial holatda parent value o'zgarmaydi — bu intentional
  }

  const handleY = (v) => { setLocalY(v); emit(v, localM, localD) }
  const handleM = (v) => { setLocalM(v); emit(localY, v, localD) }
  const handleD = (v) => { setLocalD(v); emit(localY, localM, v) }

  const maxDays = daysInMonth(localY, localM)
  const hasError = error && (!localY || !localM || !localD)

  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ flex: 1 }}>
          <select value={localD} onChange={e => handleD(e.target.value)} style={selStyle(hasError && !localD)}>
            <option value="">Kun</option>
            {Array.from({ length: maxDays }, (_, i) => {
              const d = String(i + 1).padStart(2, '0')
              return <option key={d} value={d}>{i + 1}</option>
            })}
          </select>
        </div>
        <div style={{ flex: 1.5 }}>
          <select value={localM} onChange={e => handleM(e.target.value)} style={selStyle(hasError && !localM)}>
            <option value="">Oy</option>
            {MONTHS_UZ.map((name, i) => {
              const m = String(i + 1).padStart(2, '0')
              return <option key={m} value={m}>{name}</option>
            })}
          </select>
        </div>
        <div style={{ flex: 1.5 }}>
          <select value={localY} onChange={e => handleY(e.target.value)} style={selStyle(hasError && !localY)}>
            <option value="">Yil</option>
            {Array.from({ length: effectiveMax - minYear + 1 }, (_, i) => {
              const y = effectiveMax - i
              return <option key={y} value={String(y)}>{y}</option>
            })}
          </select>
        </div>
      </div>
      {error && (!localY || !localM || !localD) && (
        <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>
      )}
    </div>
  )
}
