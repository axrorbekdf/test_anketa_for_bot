import { useState } from 'react'
import { PhoneInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { FileUpload, FileUploadPair } from '../components/FileUpload'

const PASPORT_OPTS = [
  { value: 'biometrik', label: 'Biometrik pasport' },
  { value: 'id_karta', label: 'ID karta' },
]

export function Step6({ data, onChange, errors = {} }) {
  const [checked, setChecked] = useState(data.roziman || false)

  const toggle = () => {
    const val = !checked
    setChecked(val)
    onChange('roziman', val)
  }

  return (
    <div className="fade-slide">
      {/* <div className="step-banner">
        <span className="step-banner-emoji">📄</span>
        <div>
          <div className="step-banner-title">Hujjatlar va yuborish</div>
          <div className="step-banner-desc">Shaxsiy rasm, pasport nusxasi va rozilik</div>
        </div>
      </div> */}

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">📞</div>
          <div>
            <div className="section-title">Qo'shimcha aloqa</div>
            <div className="section-desc">Ixtiyoriy — qo'shimcha telefon raqam</div>
          </div>
        </div>
        <div className="section-body">
          <PhoneInput
            label="Qo'shimcha telefon raqam" required
            value={data.qoshimchaTel} onChange={v => onChange('qoshimchaTel', v)}
            error={errors.qoshimchaTel} fieldId="field-qoshimchaTel"
          />
          {/* <div className="info-box">
            <span className="info-box-icon">💬</span>
            <span className="info-box-text">
              Xatolik ro'y bersa bizga bog'laning: <a className="tg-link" href="https://t.me/Yordam">@Yordam</a>
            </span>
          </div> */}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">📸</div>
          <div>
            <div className="section-title">Shaxsiy rasm</div>
            <div className="section-desc">3×4 formatdagi rasmingizni yuklang</div>
          </div>
        </div>
        <div className="section-body">
          <FileUpload
            label="Shaxsiy rasmingiz" required
            value={data.shaxsiyRasm}
            previewUrl={data.shaxsiyRasmUrl}
            onChange={(file, url) => { onChange('shaxsiyRasm', file); onChange('shaxsiyRasmUrl', url) }}
            error={errors.shaxsiyRasm} fieldId="field-shaxsiyRasm"
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🪪</div>
          <div>
            <div className="section-title">Shaxsni tasdiqlovchi hujjat</div>
            <div className="section-desc">Pasport yoki ID karta nusxasi</div>
          </div>
        </div>
        <div className="section-body">
          <FormSelect
            label="Pasport turi" required
            value={data.pasportTuri} onChange={v => onChange('pasportTuri', v)}
            options={PASPORT_OPTS} error={errors.pasportTuri} fieldId="field-pasportTuri"
          />

          {data.pasportTuri === 'id_karta' && (
            <>
              <div className="info-box">
                <span className="info-box-icon">📋</span>
                <span className="info-box-text">
                  ID kartaning <strong>old va orqa tomonini</strong> alohida yuklang
                </span>
              </div>
              <FileUploadPair
                leftLabel="Old tomoni *"
                rightLabel="Orqa tomoni *"
                leftUrl={data.idKartaOldUrl}
                rightUrl={data.idKartaOrqaUrl}
                onLeftChange={(f, url) => { onChange('idKartaOld', f); onChange('idKartaOldUrl', url) }}
                onRightChange={(f, url) => { onChange('idKartaOrqa', f); onChange('idKartaOrqaUrl', url) }}
                leftError={errors.idKartaOld}
                rightError={errors.idKartaOrqa}
              />
            </>
          )}

          {data.pasportTuri === 'biometrik' && (
            <FileUpload
              label="Pasport asosiy sahifasi" required
              value={data.pasportRasm}
              previewUrl={data.pasportRasmUrl}
              onChange={(f, url) => { onChange('pasportRasm', f); onChange('pasportRasmUrl', url) }}
              error={errors.pasportRasm} fieldId="field-pasportRasm"
            />
          )}
        </div>
      </div>
    </div>
  )
}
