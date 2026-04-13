import { FormInput } from '../components/FormInput'
import { FormSelect, RadioGroup } from '../components/FormSelect'
import { EntryList } from '../components/EntryList'
import { useDynamicTable } from '../components/DynamicTable'
import { useEffect } from 'react'

const JINS_OPTS = [
  { value: 'erkak', label: 'Erkak', icon: '👨' },
  { value: 'ayol', label: 'Ayol', icon: '👩' },
]

const OILAVIY_OPTS = [
  "Uylanmagan / Turmushga chiqmagan",
  "Uylanganman / Turmushga chiqganman",
  "Ajrashganman",
  "Bevaman",
]

const FARZAND_FIELDS = [
  {
    key: 'gender', label: 'Jinsi', type: 'select',
    options: [{ value: 'erkak', label: "O'g'il" }, { value: 'ayol', label: 'Qiz' }],
  },
  { key: 'date', label: "Tug'ilgan sana", type: 'date' },
]

const QARINDOSH_OPTS = [
  { value: '1',  label: 'Otasi' },
  { value: '2',  label: 'Onasi' },
  { value: '3',  label: 'Akasi' },
  { value: '4',  label: 'Opasi' },
  { value: '5',  label: 'Ukasi' },
  { value: '6',  label: 'Singlisi' },
  { value: '7',  label: 'Farzandi' },
  { value: '8',  label: "Turmush o'rtog'i" },
  { value: '9',  label: 'Bobosi' },
  { value: '10', label: 'Buvisi' },
  { value: '11', label: "O'g'li" },
  { value: '12', label: 'Qizi' },
  { value: '13', label: 'Qayni otasi' },
  { value: '14', label: 'Qayni onasi' },
  { value: '15', label: 'Qayni akasi' },
  { value: '16', label: 'Qayni opasi' },
  { value: '17', label: 'Qayni ukasi' },
  { value: '18', label: 'Qayni singlisi' },
]

// EntryList fields — har qator karta sifatida ko'rinadi
const TARKIB_FIELDS = [
  { key: 'who', label: 'Kimi', type: 'select', options: QARINDOSH_OPTS },
  { key: 'date', label: "Tug'ilgan sana", type: 'date' },
  { key: 'job', label: "Qayerda ishlaydi / o'qiydi", type: 'text', placeholder: "Ish yoki o'quv joyi" },
]

export function Step1({ data, onChange, errors = {} }) {
  const [farzandlar, addF, removeF, updateF, setF] = useDynamicTable({ gender: '', date: '' })
  const [tarkib, addT, removeT, updateT, setT] = useDynamicTable({ who: '', date: '', job: '' })

  useEffect(() => {
    if (data.farzandlar?.length) setF(data.farzandlar)
    if (data.oilaviyTarkib?.length) setT(data.oilaviyTarkib)
  }, [])

  useEffect(() => { onChange('farzandlar', farzandlar) }, [farzandlar])
  useEffect(() => { onChange('oilaviyTarkib', tarkib) }, [tarkib])

  return (
    <div className="fade-slide">
      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">📝</div>
          <div>
            <div className="section-title">Asosiy ma'lumotlar</div>
            <div className="section-desc">Passport ma'lumotlariga asosan to'ldiring</div>
          </div>
        </div>
        <div className="section-body">
          <FormInput label="Ism" required placeholder="Ismingizni kiriting"
            value={data.ism} onChange={v => onChange('ism', v)} error={errors.ism} fieldId="field-ism" />
          <FormInput label="Familiya" required placeholder="Familiyangizni kiriting"
            value={data.familiya} onChange={v => onChange('familiya', v)} error={errors.familiya} fieldId="field-familiya" />
          <FormInput label="Otasining ismi" required placeholder="Otangizning ismini kiriting"
            value={data.otaIsmi} onChange={v => onChange('otaIsmi', v)} error={errors.otaIsmi} fieldId="field-otaIsmi" />
          <FormInput label="Tug'ilgan sana" required type="date"
            value={data.tugSana} onChange={v => onChange('tugSana', v)} error={errors.tugSana} fieldId="field-tugSana" />
          <RadioGroup label="Jinsingiz" required
            value={data.jins} onChange={v => onChange('jins', v)}
            options={JINS_OPTS} error={errors.jins} fieldId="field-jins" />
          <FormSelect label="Oilaviy holatingiz" required
            value={data.oilaviyHolat} onChange={v => onChange('oilaviyHolat', v)}
            options={OILAVIY_OPTS} error={errors.oilaviyHolat} fieldId="field-oilaviyHolat" />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">👶</div>
          <div>
            <div className="section-title">Farzandlari</div>
            <div className="section-desc">Barcha farzandlaringiz ro'yxati</div>
          </div>
        </div>
        <div className="section-body">
          <EntryList
            title="Farzandlar ro'yxati"
            fields={FARZAND_FIELDS}
            rows={farzandlar}
            onAdd={addF} onRemove={removeF} onUpdate={updateF}
            emptyMessage="Farzand qo'shilmagan. '+' tugmasini bosing"
            error={errors.farzandlar}
            requiredKeys={['gender', 'date']}
            fieldId="field-farzandlar"
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">👨‍👩‍👧‍👦</div>
          <div>
            <div className="section-title">Oilaviy tarkib</div>
            <div className="section-desc">Ota-ona, aka-uka, opa-singil va boshqalar</div>
          </div>
        </div>
        <div className="section-body">
          <EntryList
            title="Oila a'zolari"
            fields={TARKIB_FIELDS}
            rows={tarkib}
            onAdd={addT} onRemove={removeT} onUpdate={updateT}
            emptyMessage="Oila a'zosi qo'shilmagan. '+' tugmasini bosing"
            error={errors.oilaviyTarkib}
            requiredKeys={['who', 'date']}
            fieldId="field-oilaviyTarkib"
          />
        </div>
      </div>
    </div>
  )
}
