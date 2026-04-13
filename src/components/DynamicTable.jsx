import { useState } from 'react'

/**
 * columns: Array of { key, label, type?, options?, placeholder?, required? }
 * rows: Array of objects
 * onAdd / onRemove / onUpdate
 * emptyMessage
 * error — umumiy xato xabari (string)
 * requiredKeys — to'liq bo'lishi kerak bo'lgan fieldlar
 */
export function DynamicTable({ title, columns, rows, onAdd, onRemove, onUpdate, emptyMessage, error, requiredKeys, fieldId }) {
  // Qaysi qatorlar chala: requiredKeys bo'lsa tekshiramiz
  const isRowIncomplete = (row) => {
    if (!requiredKeys?.length || !error) return false
    return requiredKeys.some(k => !row[k]?.toString().trim())
  }

  return (
    <div className="dyn-table" id={fieldId} style={error ? { borderColor: 'var(--danger)' } : {}}>
      <div className="dyn-table-header">
        <span className="dyn-table-title">{title}</span>
        <button type="button" className="btn-add" onClick={onAdd}>+</button>
      </div>

      {rows.length === 0 ? (
        <div className="dyn-table-empty">
          <span className="dyn-table-empty-icon">📋</span>
          {emptyMessage || "Ma'lumotlar kiritilmagan.\n('+' tugmasini bosing)"}
        </div>
      ) : (
        <>
          <div className="dyn-table-cols">
            {columns.map(col => (
              <div key={col.key} className="dyn-col-head">{col.label}</div>
            ))}
            <div className="dyn-col-head del" />
          </div>
          {rows.map((row, i) => {
            const incomplete = isRowIncomplete(row)
            return (
              <div key={i} className="dyn-row" style={incomplete ? { background: '#FEF2F2' } : {}}>
                {columns.map(col => {
                  const cellEmpty = error && requiredKeys?.includes(col.key) && !row[col.key]?.toString().trim()
                  return (
                    <div key={col.key} className="dyn-cell">
                      {col.type === 'select' ? (
                        <select
                          value={row[col.key] || ''}
                          onChange={e => onUpdate(i, col.key, e.target.value)}
                          style={cellEmpty ? { borderColor: 'var(--danger)', background: '#FFF5F5' } : {}}
                        >
                          <option value="">—</option>
                          {(col.options || []).map(opt => (
                            typeof opt === 'string'
                              ? <option key={opt} value={opt}>{opt}</option>
                              : <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.type || 'text'}
                          placeholder={col.placeholder || col.label}
                          value={row[col.key] || ''}
                          onChange={e => onUpdate(i, col.key, e.target.value)}
                          style={cellEmpty ? { borderColor: 'var(--danger)', background: '#FFF5F5' } : {}}
                        />
                      )}
                    </div>
                  )
                })}
                <div className="dyn-cell del">
                  <button type="button" className="btn-del" onClick={() => onRemove(i)}>✕</button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {error && (
        <div style={{
          padding: '8px 12px',
          background: '#FEF2F2',
          borderTop: '1px solid #FECACA',
          fontSize: 12,
          color: 'var(--danger)',
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}

export function useDynamicTable(initialRow) {
  const [rows, setRows] = useState([])

  const add = () => setRows(prev => [...prev, { ...initialRow }])
  const remove = (i) => setRows(prev => prev.filter((_, idx) => idx !== i))
  const update = (i, key, val) =>
    setRows(prev => prev.map((row, idx) => idx === i ? { ...row, [key]: val } : row))

  return [rows, add, remove, update, setRows]
}
