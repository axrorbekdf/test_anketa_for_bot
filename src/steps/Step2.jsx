import { RadioGroup, FormSelect } from '../components/FormSelect'
import { EntryList } from '../components/EntryList'
import { useDynamicTable } from '../components/DynamicTable'
import { useEffect } from 'react'

const MALUMOT_OPTS = [
  "Boshlang'ich", "O'rta", "O'rta-maxsus",
  "Oliy (bakalavr)", "Oliy (magistr)", "Doktorantura",
]

// Ta'lim muassasalari — EntryList fields (to'liq sana)
const TALIM_FIELDS = [
  { key: 'name', label: 'Muassasa nomi', type: 'text', placeholder: 'TATU, NamMQI, 15-maktab...' },
  { key: 'start_date', label: "O'qishga kirgan sana", type: 'dateselect' },
  { key: 'end_date', label: "O'qishni bitirgan sana", type: 'dateselect' },
  { key: 'specialty', label: "Mutaxassislik / yo'nalish", type: 'text', placeholder: "IT, Iqtisod, Tibbiyot..." },
]

// Til bilimi — EntryList fields
const COMMON_LANGS = [
  "O'zbek", "Rus", "Ingliz", "Fransuz", "Nemis",
  "Arab", "Xitoy", "Turk", "Koreys", "Yapon", "Ispan", "Italyan", "Boshqa",
]

const TIL_LEVELS = [
  "10%", "20%", "30%", "40%", "50%",
  "60%", "70%", "80%", "90%", "100%",
]

function tilLevelOptions(rows, rowIndex) {
  const usedByOthers = rows.reduce((sum, r, i) => {
    if (i === rowIndex) return sum
    return sum + (parseInt(r.level) || 0)
  }, 0)
  const remaining = 100 - usedByOthers
  return TIL_LEVELS.filter(l => parseInt(l) <= remaining)
}

const TIL_FIELDS = [
  { key: 'name', label: 'Til', type: 'select', options: COMMON_LANGS },
  { key: 'level', label: 'Daraja', type: 'select', options: tilLevelOptions },
]

// talabaMi: backend 1 = ha, 2 = yo'q
const TALABA_OPTS = [
  { value: '1', label: 'Ha', icon: '🎓' },
  { value: '2', label: "Yo'q", icon: '❌' },
]

export function Step2({ data, onChange, errors = {} }) {
  const [talimlar, addTa, removeTa, updateTa, setTa] = useDynamicTable({
    name: '', start_date: '', end_date: '', specialty: ''
  })
  const [tillar, addTi, removeTi, updateTi, setTi] = useDynamicTable({ name: '', level: '' })

  useEffect(() => {
    if (data.talimMuassasalar?.length) setTa(data.talimMuassasalar)
    if (data.tillar?.length) setTi(data.tillar)
  }, [])

  useEffect(() => { onChange('talimMuassasalar', talimlar) }, [talimlar])
  useEffect(() => { onChange('tillar', tillar) }, [tillar])

  return (
    <div className="fade-slide">
      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">📚</div>
          <div>
            <div className="section-title">Ta'lim darajasi</div>
            <div className="section-desc">Eng yuqori ta'lim darajangizni tanlang yoki yozing</div>
          </div>
        </div>
        <div className="section-body">
          <FormSelect
            label="Ma'lumotingiz" required
            value={data.malumot} onChange={v => onChange('malumot', v)}
            options={MALUMOT_OPTS.map(o => ({ value: o, label: o }))}
            placeholder="Tanlang..."
            error={errors.malumot} fieldId="field-malumot"
          />
          <RadioGroup
            label="Hozirda universitet, litsey yoki kollej talabasimisiz?" required
            value={data.talabaMi} onChange={v => { onChange('talabaMi', v); onChange('typeEducation', '') }}
            options={TALABA_OPTS} error={errors.talabaMi} fieldId="field-talabaMi" />
          {data.talabaMi === '1' && (
            <FormSelect
              label="Ta'lim turi" required
              value={data.typeEducation} onChange={v => onChange('typeEducation', v)}
              options={[
                { value: 'kunduzgi', label: 'Kunduzgi' },
                { value: 'sirtqi', label: 'Sirtqi' },
                { value: 'kechki', label: 'Kechki' },
              ]}
              error={errors.typeEducation} fieldId="field-typeEducation"
            />
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🏫</div>
          <div>
            <div className="section-title">Ta'lim muassasalari</div>
            <div className="section-desc">O'qigan barcha muassasalar</div>
          </div>
        </div>
        <div className="section-body">
          <EntryList
            title="Ta'lim muassasalari ro'yxati"
            fields={TALIM_FIELDS}
            rows={talimlar}
            onAdd={addTa} onRemove={removeTa} onUpdate={updateTa}
            emptyMessage="Ta'lim muassasasi qo'shilmagan. '+' tugmasini bosing"
            error={errors.talimMuassasalar}
            requiredKeys={data.talabaMi === '1' ? ['name', 'start_date'] : ['name', 'start_date', 'end_date']}
            fieldId="field-talimMuassasalar"
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🌍</div>
          <div>
            <div className="section-title">Til bilimi</div>
            <div className="section-desc">Bilgan tillaringiz va daraja (foizda)</div>
          </div>
        </div>
        <div className="section-body">
          <EntryList
            title="Bilgan tillar"
            fields={TIL_FIELDS}
            rows={tillar}
            onAdd={addTi} onRemove={removeTi} onUpdate={updateTi}
            emptyMessage="Til ma'lumoti kiritilmagan. '+' tugmasini bosing"
            error={errors.tillar}
            requiredKeys={['name', 'level']}
            fieldId="field-tillar"
          />
        </div>
      </div>
    </div>
  )
}
