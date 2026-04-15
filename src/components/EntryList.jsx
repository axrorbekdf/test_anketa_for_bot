/**
 * Card-style list — har qator karta sifatida ko'rinadi.
 * Keng inputlar, to'liq o'qish qulay.
 *
 * fields: [{ key, label, type?, options?, placeholder? }]
 *   type: 'text'(default) | 'date' | 'number' | 'select' | 'combobox'
 * requiredKeys: validation uchun
 */
import { DateSelect } from './FormInput'

export function EntryList({ title, fields, rows, onAdd, onRemove, onUpdate,
  emptyMessage, error, requiredKeys, fieldId }) {

  const isCellEmpty = (row, key) =>
    error && requiredKeys?.includes(key) && !row[key]?.toString().trim()

  const isRowIncomplete = (row) =>
    requiredKeys?.some(k => !row[k]?.toString().trim())

  return (
    <div id={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        <button type="button" className="btn-add" onClick={onAdd}>+</button>
      </div>

      {/* Empty state */}
      {rows.length === 0 && (
        <div style={{
          border: `1.5px dashed ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '20px 16px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 13,
          lineHeight: 1.5,
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>📋</div>
          {emptyMessage || "Ma'lumot kiritilmagan. '+' tugmasini bosing"}
        </div>
      )}

      {/* Rows as cards */}
      {rows.map((row, i) => (
        <div key={i} style={{
          border: `1.5px solid ${error && isRowIncomplete(row) ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          background: error && isRowIncomplete(row) ? '#FEF9F9' : '#FAFBFF',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px',
            background: error && isRowIncomplete(row) ? '#FEF2F2' : 'var(--primary-light)',
            borderBottom: `1px solid ${error && isRowIncomplete(row) ? '#FECACA' : 'var(--border)'}`,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
              #{i + 1}
            </span>
            <button type="button" className="btn-del" onClick={() => onRemove(i)}>✕</button>
          </div>

          {/* Card body */}
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fields.map(field => {
              const isEmpty = isCellEmpty(row, field.key)
              const inputStyle = {
                borderColor: isEmpty ? 'var(--danger)' : undefined,
                background: isEmpty ? '#FFF5F5' : undefined,
              }
              return (
                <div key={field.key} className="field" style={{ marginBottom: 0 }}>
                  <label className="field-label" style={{ fontSize: 12 }}>
                    {field.label}
                    {requiredKeys?.includes(field.key) && <span className="req">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select className="field-select" value={row[field.key] || ''}
                      onChange={e => onUpdate(i, field.key, e.target.value)}
                      style={{ height: 42, fontSize: 13, ...inputStyle }}>
                      <option value="">— Tanlang</option>
                      {(typeof field.options === 'function' ? field.options(rows, i) : (field.options || [])).map(opt =>
                        typeof opt === 'string'
                          ? <option key={opt} value={opt}>{opt}</option>
                          : <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
                      )}
                    </select>
                  ) : field.type === 'dateselect' ? (
                    <DateSelect
                      value={row[field.key] || ''}
                      onChange={v => onUpdate(i, field.key, v)}
                      minYear={field.minYear || 1940}
                      maxYear={field.maxYear}
                      error={isEmpty ? ' ' : null}
                    />
                  ) : field.type === 'combobox' ? (
                    <>
                      <input
                        list={`el-${i}-${field.key}`}
                        className="field-input"
                        placeholder={field.placeholder || `${field.label} kiriting`}
                        value={row[field.key] || ''}
                        onChange={e => onUpdate(i, field.key, e.target.value)}
                        style={{ height: 42, fontSize: 13, ...inputStyle }}
                      />
                      <datalist id={`el-${i}-${field.key}`}>
                        {(field.options || []).map(opt =>
                          typeof opt === 'string'
                            ? <option key={opt} value={opt} />
                            : <option key={opt.value} value={opt.label} />
                        )}
                      </datalist>
                    </>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      className="field-input"
                      placeholder={field.placeholder || `${field.label} kiriting`}
                      value={row[field.key] || ''}
                      onChange={e => onUpdate(i, field.key, e.target.value)}
                      style={{ height: 42, fontSize: 13, ...inputStyle }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {error && (
        <span style={{ fontSize: 12, color: 'var(--danger)' }}>⚠ {error}</span>
      )}
    </div>
  )
}
