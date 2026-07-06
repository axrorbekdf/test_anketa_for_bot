import { useState } from 'react'
import { uploadImage } from '../api/api'

function ImagePreview({ url, onRemove }) {
  return (
    <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid var(--success)' }}>
      <img src={url} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
      <button
        type="button"
        onClick={onRemove}
        style={{
          position: 'absolute', top: 6, right: 6,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', border: 'none',
          color: '#fff', fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >✕</button>
    </div>
  )
}

export function FileUpload({ label, required, value, previewUrl, onChange, error, fieldId }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [inputKey, setInputKey] = useState(0)

  const handleFile = async (file) => {
    if (!file) return
    setInputKey(k => k + 1)
    setErr(null)
    setLoading(true)
    try {
      const url = await uploadImage(file)
      onChange(file, url)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => onChange(null, null)

  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}
      {previewUrl ? (
        <ImagePreview url={previewUrl} onRemove={handleRemove} />
      ) : (
        <div
          className={`file-upload${loading ? ' loading' : ''}${error ? ' error' : ''}`}
          style={{ position: 'relative', ...(error ? { borderColor: 'var(--danger)' } : {}) }}
        >
          {!loading && (
            <input
              key={inputKey}
              type="file"
              accept="image/*"
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                zIndex: 1,
              }}
              onChange={e => handleFile(e.target.files[0] || null)}
            />
          )}
          <span className="file-upload-icon">{loading ? '⏳' : '☁️'}</span>
          <span className="file-upload-text">{loading ? 'Yuklanmoqda...' : 'Rasm yuklang'}</span>
          {!loading && <span className="file-upload-hint">PNG, JPG, JPEG, WEBP va HEIC ruxsat etilgan</span>}
        </div>
      )}
      {(err || error) && (
        <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {err || error}</span>
      )}
    </div>
  )
}

export function FileUploadPair({ leftLabel, rightLabel, leftUrl, rightUrl, onLeftChange, onRightChange, leftError, rightError }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <FileUpload
        label={leftLabel}
        required
        previewUrl={leftUrl}
        onChange={onLeftChange}
        error={leftError}
      />
      <FileUpload
        label={rightLabel}
        required
        previewUrl={rightUrl}
        onChange={onRightChange}
        error={rightError}
      />
    </div>
  )
}
