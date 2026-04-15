import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

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

// iOS scroll wheel date picker

const MONTHS_UZ = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr',
]

function daysInMonth(year, month) {
  if (!year || !month) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

const ITEM_H = 46
const VISIBLE = 5
const PAD = 2

function ScrollColumn({ items, value, onChange, flex = 1 }) {
  const ref = useRef(null)
  const timer = useRef(null)
  const settling = useRef(false)

  const goTo = (idx, smooth = true) => {
    if (!ref.current) return
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    ref.current.scrollTo({ top: clamped * ITEM_H, behavior: smooth ? 'smooth' : 'auto' })
  }

  useEffect(() => {
    const idx = items.findIndex(i => i.value === value)
    goTo(idx >= 0 ? idx : 0, false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settling.current) return
    const idx = items.findIndex(i => i.value === value)
    if (idx >= 0) { settling.current = true; goTo(idx); setTimeout(() => { settling.current = false }, 400) }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const onScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!ref.current) return
      const idx = Math.round(ref.current.scrollTop / ITEM_H)
      const clamped = Math.max(0, Math.min(idx, items.length - 1))
      settling.current = true
      goTo(clamped)
      setTimeout(() => { settling.current = false }, 400)
      if (items[clamped] && items[clamped].value !== value) onChange(items[clamped].value)
    }, 100)
  }

  const pads = Array.from({ length: PAD }, (_, i) => (
    <div key={i} style={{ height: ITEM_H, flexShrink: 0 }} />
  ))

  return (
    <div style={{ position: 'relative', flex, height: ITEM_H * VISIBLE, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 6, right: 6,
        top: PAD * ITEM_H, height: ITEM_H,
        background: 'rgba(99,102,241,0.1)',
        borderRadius: 12,
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: PAD * ITEM_H,
        background: 'linear-gradient(to bottom, #fff 40%, transparent)',
        pointerEvents: 'none', zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: PAD * ITEM_H,
        background: 'linear-gradient(to top, #fff 40%, transparent)',
        pointerEvents: 'none', zIndex: 3,
      }} />
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          height: '100%',
          overflowY: 'scroll',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {pads}
        {items.map((item, i) => {
          const selIdx = items.findIndex(it => it.value === value)
          const dist = Math.abs(i - selIdx)
          return (
            <div
              key={item.value}
              onClick={() => { goTo(i); onChange(item.value) }}
              style={{
                height: ITEM_H,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: dist === 0 ? 17 : 14,
                fontWeight: dist === 0 ? 700 : 400,
                color: dist === 0 ? '#4f46e5' : '#94a3b8',
                opacity: dist === 0 ? 1 : dist === 1 ? 0.75 : 0.45,
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {item.label}
            </div>
          )
        })}
        {pads}
      </div>
    </div>
  )
}

export function DateSelect({ label, required, value, onChange, error, fieldId, minYear = 1940, maxYear }) {
  const currentYear = new Date().getFullYear()
  const effectiveMax = maxYear !== undefined ? maxYear : currentYear

  const init = (value || '').split('-')
  const [open, setOpen] = useState(false)
  const [y, setY] = useState(init[0] || String(effectiveMax))
  const [m, setM] = useState(init[1] || '01')
  const [d, setD] = useState(init[2] || '01')

  const maxDays = daysInMonth(y, m)

  useEffect(() => {
    if (Number(d) > maxDays) setD(String(maxDays).padStart(2, '0'))
  }, [maxDays]) // eslint-disable-line react-hooks/exhaustive-deps

  const monthItems = MONTHS_UZ.map((name, i) => ({
    value: String(i + 1).padStart(2, '0'), label: name,
  }))
  const dayItems = Array.from({ length: maxDays }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'), label: String(i + 1),
  }))
  const yearItems = Array.from({ length: effectiveMax - minYear + 1 }, (_, i) => ({
    value: String(effectiveMax - i), label: String(effectiveMax - i),
  }))

  const displayValue = value ? `${d} ${MONTHS_UZ[Number(m) - 1]} ${y}` : ''

  const confirm = () => { onChange(`${y}-${m}-${d}`); setOpen(false) }

  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}{required && <span className="req">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="field-input"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left', cursor: 'pointer',
          color: displayValue ? 'var(--text)' : '#94a3b8',
          borderColor: error && !value ? 'var(--danger)' : undefined,
          fontWeight: displayValue ? 500 : 400,
        }}
      >
        <span>{displayValue || 'Sanani tanlang'}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>

      {error && !value && (
        <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>
      )}

      {open && createPortal(
        <div
          onClick={confirm}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.45)',
            zIndex: 9999,
            display: 'flex', alignItems: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              background: '#fff',
              borderRadius: '22px 22px 0 0',
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 2 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#e2e8f0' }} />
            </div>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 20px 12px',
            }}>
              <button type="button" onClick={() => setOpen(false)} style={{
                background: 'none', border: 'none', fontSize: 15,
                color: '#94a3b8', cursor: 'pointer', padding: '6px 0', fontWeight: 500,
              }}>
                Bekor
              </button>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>
                {label || 'Sana'}
              </span>
              <button type="button" onClick={confirm} style={{
                background: 'none', border: 'none', fontSize: 15,
                color: '#4f46e5', fontWeight: 700, cursor: 'pointer', padding: '6px 0',
              }}>
                Tayyor
              </button>
            </div>

            {/* Column labels */}
            <div style={{
              display: 'flex', padding: '0 16px',
              borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9',
            }}>
              {[{ label: 'Oy', flex: 2 }, { label: 'Kun', flex: 1 }, { label: 'Yil', flex: 1.5 }].map(col => (
                <div key={col.label} style={{
                  flex: col.flex,
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#94a3b8',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '6px 0',
                }}>
                  {col.label}
                </div>
              ))}
            </div>

            {/* Picker */}
            <div style={{ display: 'flex', padding: '0 16px' }}>
              <ScrollColumn items={monthItems} value={m} onChange={setM} flex={2} />
              <ScrollColumn items={dayItems} value={d} onChange={setD} flex={1} />
              <ScrollColumn items={yearItems} value={y} onChange={setY} flex={1.5} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
