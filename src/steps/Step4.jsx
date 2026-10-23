import { FormInput, FormTextarea } from '../components/FormInput'
import { RadioGroup, FormSelect } from '../components/FormSelect'
import { EntryList } from '../components/EntryList'
import { useDynamicTable } from '../components/DynamicTable'
import { useEffect } from 'react'

const HA_YOQ = [
  { value: 'ha', label: 'Ha', icon: '✅' },
  { value: "yo'q", label: "Yo'q", icon: '❌' },
]

const DASTUR_LEVELS = [
  "10%", "20%", "30%", "40%", "50%",
  "60%", "70%", "80%", "90%", "100%",
]

const COMMON_PROGRAMS = [
  'Excel', 'Word', 'PowerPoint', '1C', 'SAP',
  'Google Sheets', 'Outlook', 'Access', '1C Buxgalteriya',
]

const DASTUR_FIELDS = [
  { key: 'name', label: 'Dastur nomi', type: 'select', options: COMMON_PROGRAMS },
  { key: 'level', label: 'Daraja', type: 'select', options: DASTUR_LEVELS },
]

const AVTOMOBIL_RUSUMI = [
  'Damas', 'Labo', 'Matiz', 'Nexia', 'Nexia 2', 'Nexia 3',
  'Spark', 'Lacetti', 'Gentra', 'Cobalt', 'Captiva', 'Epica',
  'Malibu', 'Malibu 2', 'Orlando', 'Tracker', 'Tracker 2',
  'Equinox', 'Onix', 'Boshqa',
]

export function Step4({ data, onChange, errors = {} }) {
  const [dasturlar, addD, removeD, updateD, setD] = useDynamicTable({ name: '', level: '' })

  useEffect(() => {
    if (data.dasturlar?.length) setD(data.dasturlar)
  }, [])

  useEffect(() => { onChange('dasturlar', dasturlar) }, [dasturlar])

  return (
    <div className="fade-slide">
      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">🔍</div>
          <div>
            <div className="section-title">Ish holati</div>
            <div className="section-desc">Hozirgi va avvalgi ish holatingiz</div>
          </div>
        </div>
        <div className="section-body">
          <RadioGroup label="Avval bizning kompaniyamizda ishlaganmisiz?" required
            value={data.avvalIshlagan} onChange={v => onChange('avvalIshlagan', v)}
            options={HA_YOQ} error={errors.avvalIshlagan} fieldId="field-avvalIshlagan" />
          <RadioGroup label="O'zbekiston Respublikasi fuqarosimisiz?" required
            value={data.fuqaro} onChange={v => onChange('fuqaro', v)}
            options={HA_YOQ} error={errors.fuqaro} fieldId="field-fuqaro" />
          <RadioGroup label="Hozirda ish bilan ta'minlanganmisiz?" required
            value={data.ishBilanTaminlangan} onChange={v => onChange('ishBilanTaminlangan', v)}
            options={HA_YOQ} error={errors.ishBilanTaminlangan} fieldId="field-ishBilanTaminlangan" />
          {data.ishBilanTaminlangan === 'ha' && (
            <FormInput
              label="Hozirda qayerda ishlayapsiz?" required
              placeholder="Kompaniya nomi"
              value={data.workedPlace || ''}
              onChange={v => onChange('workedPlace', v)}
              error={errors.workedPlace} fieldId="field-workedPlace"
            />
          )}
          <RadioGroup label="Shaxsiy avtomobilingiz bormi?" required
            value={data.avtomobil} onChange={v => onChange('avtomobil', v)}
            options={HA_YOQ} error={errors.avtomobil} fieldId="field-avtomobil" />
          {data.avtomobil === 'ha' && (
            <FormSelect
              label="Avtomobil rusumi" required
              value={data.avtomobilRusumi} onChange={v => onChange('avtomobilRusumi', v)}
              options={AVTOMOBIL_RUSUMI.map(r => ({ value: r, label: r }))}
              error={errors.avtomobilRusumi} fieldId="field-avtomobilRusumi"
            />
          )}
          {data.jins === 'erkak' && (
            <RadioGroup
              label="Xizmat safariga bora olasizmi? (Boshqa viloyat yoki tuman filiallarimizda ishlay olasizmi)" required
              value={data.trip} onChange={v => onChange('trip', v)}
              options={HA_YOQ} error={errors.trip} fieldId="field-trip" />
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">👥</div>
          <div>
            <div className="section-title">CASL FIT kompaniyasida ishlaydigan yaqinlaringiz bormi?</div>
            <div className="section-desc">Kompaniyamizda ishlaydigan yaqinlaringiz</div>
          </div>
        </div>
        <div className="section-body">
          <FormTextarea
            label="Yaqin qarindoshingiz bormi?"
            placeholder="To'liq ismi, familiyasi va lavozimini yozing. Yo'q bo'lsa bo'sh qoldiring"
            value={data.caslFitQarindosh} onChange={v => onChange('caslFitQarindosh', v)}
          />
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-icon">💻</div>
          <div>
            <div className="section-title">Dasturlar bilimlari</div>
            <div className="section-desc">Qaysi kompyuter dasturlaridan foydalana olasiz</div>
          </div>
        </div>
        <div className="section-body">
          <EntryList
            title="Dasturlar ro'yxati"
            fields={DASTUR_FIELDS}
            rows={dasturlar}
            onAdd={addD} onRemove={removeD} onUpdate={updateD}
            emptyMessage="Dastur ma'lumoti kiritilmagan. '+' tugmasini bosing"
            fieldId="field-dasturlar"
          />
        </div>
      </div>
    </div>
  )
}
