import { FormInput, HeightWeightInput } from '../components/FormInput'
import { FormSelect } from '../components/FormSelect'
import { useNedInfo } from '../api/useNedInfo'

const POSITION_MEN = [
  { id: 1,  name: 'Sotuvchi' },
  { id: 2,  name: 'Omborchi' },
  { id: 3,  name: 'Yuk tashuvchi' },
  { id: 11, name: 'Operator' },
  { id: 4,  name: "Shartnoma bo'limi mutaxassisi" },
  { id: 5,  name: 'Undiruvchi' },
  { id: 6,  name: "Reklama bo'limi mutaxassisi" },
  { id: 7,  name: 'Merchandayzer' },
  { id: 10, name: 'Haydovchi (Labo)' },
  { id: 13, name: 'Mebel ustasi' },
  { id: 14, name: 'Svarshik' },
  { id: 15, name: 'Grafik dizayner (3D MAX)' },
  { id: 16, name: 'Ingliz tili' },
  { id: 17, name: 'Mobilograf' },
  { id: 18, name: 'SMM' },
  { id: 19, name: 'Aktyor va aktrisa' },
]

const POSITION_WOMEN = [
  { id: 1,  name: 'Sotuvchi' },
  { id: 11, name: 'Operator' },
  { id: 8,  name: 'Farrosh' },
  { id: 9,  name: 'Oshpaz' },
]

function MultiSelect({ label, required, options, selected, onChange, error, fieldId }) {
  // value sifatida opt.value (id) ishlatamiz — takrorlanishni shu orqali tekshiramiz
  const selectedSet = new Set(selected.map(s => s.value))

  const toggle = (opt) => {
    if (selectedSet.has(opt.value)) return  // allaqachon tanlangan — qo'shma
    onChange([...selected, { label: opt.label, value: opt.value }])
  }

  const remove = (val) => onChange(selected.filter(s => s.value !== val))

  return (
    <div className="field" id={fieldId}>
      {label && (
        <label className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </label>
      )}

      {/* Tanlangan lavozimlar — taglar */}
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {selected.map(s => (
            <span key={s.value} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'var(--primary-light)', border: '1px solid var(--primary-mid)',
              borderRadius: 20, padding: '4px 10px',
              fontSize: 12, fontWeight: 600, color: 'var(--primary-dark)'
            }}>
              {s.label}
              <button type="button" onClick={() => remove(s.value)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--primary)', fontSize: 14, lineHeight: 1, padding: 0
              }}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <select
        className="field-select"
        value=""
        onChange={e => {
          const opt = options.find(o => o.value === e.target.value)
          if (opt) toggle(opt)
        }}
        style={error ? { borderColor: 'var(--danger)' } : {}}
      >
        <option value="">— Lavozim tanlang</option>
        {options.map(opt => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={selectedSet.has(opt.value)}
          >
            {selectedSet.has(opt.value) ? `✓ ${opt.label}` : opt.label}
          </option>
        ))}
      </select>

      {error && <span style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>⚠ {error}</span>}
    </div>
  )
}

export function Step3({ data, onChange, errors = {} }) {
  const { info, loading } = useNedInfo()

  const viloyatlar = info?.states?.map(r => ({ value: String(r.id), label: r.name })) || []
  const tumanlar = info?.states
    ?.find(r => String(r.id) === String(data.viloyat))
    ?.region?.map(t => ({ value: String(t.id), label: t.name })) || []
  const filiallar = info?.branches?.map(b => ({ value: String(b.id), label: b.name })) || []
  const posSource = data.jins === 'ayol' ? POSITION_WOMEN : POSITION_MEN
  const lavozimlar = posSource.map(p => ({ value: String(p.id), label: p.name }))

  const handleViloyat = (v) => {
    onChange('viloyat', v)
    onChange('tuman', '')
  }

  if (loading) {
    return (
      <div className="fade-slide" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
        ⏳ Ma'lumotlar yuklanmoqda...
      </div>
    )
  }

  return (
    <div className="fade-slide">
<div className="section-card">
        <div className="section-header">
          <div className="section-icon">📏</div>
          <div>
            <div className="section-title">Jismoniy ko'rsatkichlar</div>
            <div className="section-desc">Bo'y (sm) va vazn (kg)</div>
          </div>
        </div>
        <div className="section-body">
          <HeightWeightInput label="Bo'y va vazningiz (sm/kg)" required
            value={data.boyVazn} onChange={v => onChange('boyVazn', v)}
            error={errors.boyVazn} fieldId="field-boyVazn" />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🏠</div>
          <div>
            <div className="section-title">Haqiqiy yashash manzili</div>
            <div className="section-desc">Hozir yashayotgan manzilingizni kiriting</div>
          </div>
        </div>
        <div className="section-body">
          <FormSelect label="Viloyat" required
            value={data.viloyat} onChange={handleViloyat}
            options={viloyatlar} error={errors.viloyat} fieldId="field-viloyat" />
          <FormSelect label="Shahar / Tuman" required
            value={data.tuman} onChange={v => onChange('tuman', v)}
            options={tumanlar} error={errors.tuman} fieldId="field-tuman" />
          <FormInput label="MFY, ko'cha, uy raqami" required placeholder="To'liq manzil"
            value={data.manzil} onChange={v => onChange('manzil', v)}
            error={errors.manzil} fieldId="field-manzil" />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">💼</div>
          <div>
            <div className="section-title">Ish xohishi</div>
            <div className="section-desc">Qaysi filial va lavozimda ishlashni xohlaysiz</div>
          </div>
        </div>
        <div className="section-body">
          <FormSelect label="Qaysi filialda ishlashni xohlaysiz?" required
            value={data.filial} onChange={v => onChange('filial', v)}
            options={filiallar} error={errors.filial} fieldId="field-filial" />
          <MultiSelect
            label="Qaysi lavozimlarda ishlashni xohlaysiz?" required
            options={lavozimlar}
            selected={data.lavozimlar || []}
            onChange={v => onChange('lavozimlar', v)}
            error={errors.lavozimlar}
            fieldId="field-lavozimlar"
          />
        </div>
      </div>
    </div>
  )
}
