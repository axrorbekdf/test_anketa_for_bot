import { MoneyInput, FormTextarea } from '../components/FormInput'
import { FormSelect, RadioGroup } from '../components/FormSelect'
import { EntryList } from '../components/EntryList'
import { useDynamicTable } from '../components/DynamicTable'
import { useEffect } from 'react'

// Sog'liq savollari — fixed list, backend: anketa_healthys
const SOGLIK_SAVOLLAR = [
  "Og'ir narsalar ko'tara olasizmi?",
  "Yuragingizdan shikoyatingiz bormi?",
  "Og'ir jarrohlik amaliyotini o'taganmisiz?",
  "Ko'zingizdan shikoyatingiz bormi?",
  "Bel og'rig'idan shikoyatingiz bormi?",
  "Bir joyda turib yoki o'tirib ishlay olasizmi?",
]

const OG_IR_SAVOL = "Og'ir narsalar ko'tara olasizmi?"

const HA_YOQ_OPTS = [
  { value: '1', label: 'Ha', icon: '✅' },
  { value: '2', label: "Yo'q", icon: '❌' },
]

// backend: anketa_worked_befores
const ISH_TARIXI_FIELDS = [
  { key: 'start_date', label: 'Qabul sana', type: 'date' },
  { key: 'company_name', label: 'Ish joyi nomi', type: 'text', placeholder: 'Kompaniya nomi...' },
  { key: 'end_date', label: "Bo'shagan sana", type: 'date' },
  { key: 'position', label: 'Lavozimingiz', type: 'text', placeholder: 'Kassir, operator...' },
]


const QAYDAN_OPTS = [
  "Telegram", "Instagram", "Facebook",
  "Do'stim orqali", "Oila a'zosi orqali",
  "Kompaniya saytidan", "OLX / Hh.uz", "Boshqa",
]

const SUDLANGAN_OPTS = [
  { value: "yo'q", label: "Yo'q", icon: '✅' },
  { value: 'ha', label: 'Ha', icon: '⚠️' },
]

export function Step5({ data, onChange, errors = {} }) {
  const [ishTarixi, addI, removeI, updateI, setI] = useDynamicTable({
    start_date: '', company_name: '', end_date: '', position: ''
  })

  const activeSavollar = data.jins === 'ayol'
    ? SOGLIK_SAVOLLAR.filter(q => q !== OG_IR_SAVOL)
    : SOGLIK_SAVOLLAR

  useEffect(() => {
    onChange('soglik', activeSavollar.map(q => {
      const existing = (data.soglik || []).find(s => s.question === q)
      return existing || { question: q, status: '', description: '' }
    }))
    if (data.ishTarixi?.length) setI(data.ishTarixi)
  }, [data.jins])

  useEffect(() => { onChange('ishTarixi', ishTarixi) }, [ishTarixi])

  const updateSoglik = (index, key, val) => {
    const updated = (data.soglik || []).map((s, i) =>
      i === index ? { ...s, [key]: val } : s
    )
    onChange('soglik', updated)
  }

  const soglik = data.soglik?.length
    ? data.soglik
    : activeSavollar.map(q => ({ question: q, status: '', description: '' }))

  return (
    <div className="fade-slide">
      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🏥</div>
          <div>
            <div className="section-title">Sog'liq holati</div>
            <div className="section-desc">Salomatligingiz haqida ma'lumot</div>
          </div>
        </div>
        <div className="section-body">
          {soglik.map((item, i) => (
            <div key={i} style={{
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#FAFBFF',
            }}>
              {/* Savol */}
              <div style={{
                padding: '10px 14px',
                background: 'var(--primary-light)',
                borderBottom: '1px solid var(--border)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
              }}>
                {i + 1}. {item.question}
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Ha / Yo'q */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {HA_YOQ_OPTS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`radio-btn${item.status === opt.value ? ' active' : ''}`}
                      onClick={() => updateSoglik(i, 'status', opt.value)}
                      style={errors.soglik && !item.status
                        ? { borderColor: 'var(--danger)', flex: 1 }
                        : { flex: 1 }}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
                {/* Izoh — har doim ko'rinadi */}
                <input
                  className="field-input"
                  type="text"
                  placeholder="Izoh kiriting (ixtiyoriy)"
                  value={item.description || ''}
                  onChange={e => updateSoglik(i, 'description', e.target.value)}
                  style={{ height: 40, fontSize: 13 }}
                />
              </div>
            </div>
          ))}
          {errors.soglik && (
            <span style={{ fontSize: 12, color: 'var(--danger)' }}>⚠ {errors.soglik}</span>
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">💼</div>
          <div>
            <div className="section-title">Ish tajribasi</div>
            <div className="section-desc">Avval ishlagan joylaring (rasmiy va norasmiy)</div>
          </div>
        </div>
        <div className="section-body">
          <div className="info-box">
            <span className="info-box-icon">📌</span>
            <span className="info-box-text">
              Sizning <strong>rasmiy va norasmiy ish tajribangiz</strong> biz uchun muhim
            </span>
          </div>
          <EntryList
            title="Ish tarixi"
            fields={ISH_TARIXI_FIELDS}
            rows={ishTarixi}
            onAdd={addI} onRemove={removeI} onUpdate={updateI}
            emptyMessage="Ish tarixi kiritilmagan. '+' tugmasini bosing"
            fieldId="field-ishTarixi"
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">💰</div>
          <div>
            <div className="section-title">Maosh va transport</div>
            <div className="section-desc">Maosh talabi va shaxsiy transport</div>
          </div>
        </div>
        <div className="section-body">
          <MoneyInput label="Oxirgi ish joyida olgan ish haqingiz? (so'm)" required
            placeholder="Masalan: 3 000 000"
            value={data.oxirgiMaosh} onChange={v => onChange('oxirgiMaosh', v)}
            error={errors.oxirgiMaosh} fieldId="field-oxirgiMaosh" />
          <MoneyInput label="Qancha maosh xohlaysiz? (so'm)" required
            placeholder="Masalan: 5 000 000"
            value={data.xohlganMaosh} onChange={v => onChange('xohlganMaosh', v)}
            error={errors.xohlganMaosh} fieldId="field-xohlganMaosh" />
          <FormSelect label="Bo'sh ish o'rni haqida qayerdan bildingiz?" required
            value={data.qaydanBildi} onChange={v => onChange('qaydanBildi', v)}
            options={QAYDAN_OPTS} error={errors.qaydanBildi} fieldId="field-qaydanBildi" />
          <RadioGroup label="Sudlanganmisiz?" required
            value={data.sudlangan} onChange={v => onChange('sudlangan', v)}
            options={SUDLANGAN_OPTS} error={errors.sudlangan} fieldId="field-sudlangan" />
          {data.sudlangan === 'ha' && (
            <FormTextarea
              label="Sudlanganlik haqida izoh" required
              placeholder="Qachon, nima uchun sudlanganligi haqida yozing..."
              value={data.sudlanganIzoh} onChange={v => onChange('sudlanganIzoh', v)}
              error={errors.sudlanganIzoh} fieldId="field-sudlanganIzoh"
            />
          )}
          <FormTextarea
            label="Qo'shimcha ma'lumotlar"
            placeholder="Qo'shimcha izoh yoki ma'lumot (ixtiyoriy)"
            value={data.qoshimcha} onChange={v => onChange('qoshimcha', v)}
          />
        </div>
      </div>
    </div>
  )
}
