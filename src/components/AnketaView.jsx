import { useState } from 'react'

function Lightbox({ url, onClose }) {
  if (!url) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 16,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: 'none',
          color: '#fff', fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>
      <img
        src={url}
        alt=""
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '90vh',
          objectFit: 'contain', borderRadius: 8,
        }}
      />
    </div>
  )
}

const yn = (v) => v === '1' || v === 1 ? 'Ha' : v === '2' || v === 2 ? "Yo'q" : v || '—'
const dash = (v) => v || '—'

function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children)
  if (!hasContent) return null
  return (
    <div style={{
      background: 'var(--card, #fff)', borderRadius: 14,
      padding: '14px 16px', marginBottom: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: 'var(--primary)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
    </div>
  )
}

function PhotoField({ label, url, onZoom }) {
  if (!url) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => onZoom(url)}>
        <img
          src={url} alt={label}
          style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 10, border: '1.5px solid var(--border)', display: 'block' }}
        />
        <div style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(0,0,0,0.45)', borderRadius: 6,
          padding: '3px 8px', fontSize: 11, color: '#fff', fontWeight: 600,
        }}>
          🔍 Kattalashtirish
        </div>
      </div>
    </div>
  )
}

function Tags({ label, items }) {
  if (!items?.length) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map((item, i) => (
          <span key={i} style={{
            background: 'var(--primary)', color: '#fff',
            borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 600,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div style={{
      background: '#F8F9FF', borderRadius: 10,
      padding: '10px 12px', fontSize: 13,
      display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      {children}
    </div>
  )
}

export function AnketaView({ anketa }) {
  const [lightboxUrl, setLightboxUrl] = useState(null)

  const stateName  = anketa?.state_name  || anketa?.state_id  || null
  const regionName = anketa?.region_name || anketa?.region_id || null
  const branchName = anketa?.branch_name || anketa?.branch_id || null

  const genderLabel = anketa?.gender === '1' || anketa?.gender === 1 ? 'Erkak'
    : anketa?.gender === '2' || anketa?.gender === 2 ? 'Ayol' : anketa?.gender

  return (
    <div style={{ padding: '0 0 32px' }}>
      <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />

      {/* Shaxsiy */}
      <Section title="Shaxsiy ma'lumotlar">
        <Field label="Familiya" value={anketa?.last_name} />
        <Field label="Ism" value={anketa?.first_name} />
        <Field label="Otasining ismi" value={anketa?.father_name} />
        <Field label="Jins" value={genderLabel} />
        <Field label="Tug'ilgan sana" value={anketa?.age} />
        <Field label="Oilaviy holat" value={anketa?.martial_status} />
        <Field label="Qo'shimcha telefon" value={anketa?.eddition_phone_number} />
        <PhotoField label="Shaxsiy rasm" url={anketa?.image} onZoom={setLightboxUrl} />
      </Section>

      {/* Farzandlar */}
      {anketa?.anketa_childrens?.length > 0 && (
        <Section title="Farzandlar">
          {anketa.anketa_childrens.map((c, i) => (
            <Card key={i}>
              <span style={{ fontWeight: 600 }}>
                {c.gender === '1' || c.gender === 1 ? "O'g'il" : c.gender === '2' || c.gender === 2 ? 'Qiz' : c.gender}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.date}</span>
            </Card>
          ))}
        </Section>
      )}

      {/* Oilaviy tarkib */}
      {anketa?.anketa_relations?.length > 0 && (
        <Section title="Oilaviy tarkib">
          {anketa.anketa_relations.map((r, i) => (
            <Card key={i}>
              <span style={{ fontWeight: 600 }}>{r.who}</span>
              <span style={{ fontSize: 12 }}>{r.job}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{r.date}</span>
            </Card>
          ))}
        </Section>
      )}

      {/* Ta'lim */}
      <Section title="Ta'lim">
        <Field label="Ma'lumot darajasi" value={anketa?.education} />
        {anketa?.education_place?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Ta'lim muassasalari</span>
            {anketa.education_place.map((e, i) => (
              <Card key={i}>
                <span style={{ fontWeight: 600 }}>{e.education_name}</span>
                <span style={{ fontSize: 12 }}>{e.specialty}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {e.start_date} — {e.end_date}
                </span>
              </Card>
            ))}
          </div>
        )}
        {anketa?.anketa_languages?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Tillar</span>
            {anketa.anketa_languages.map((l, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{l.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{l.level}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Joylashuv */}
      <Section title="Joylashuv va lavozim">
        <Field label="Viloyat" value={stateName || anketa?.state_id} />
        <Field label="Tuman" value={regionName || anketa?.region_id} />
        <Field label="Manzil" value={anketa?.address} />
        <Field label="Filial" value={branchName || anketa?.branch_id} />
        {anketa?.position?.length > 0 && (
          <Tags
            label="Lavozimlar"
            items={anketa.position.map(p => p.label || p.value)}
          />
        )}
      </Section>

      {/* Ish */}
      <Section title="Ish va tajriba">
        <Field label="Fuqaro" value={yn(anketa?.citizen)} />
        <Field label="Hozir ishlayaptimi" value={yn(anketa?.job_now)} />
        <Field label="Hozirgi ish joyi" value={anketa?.worked_place} />
        <Field label="Garant xodimi qarindoshi" value={dash(anketa?.relation_company)} />
        <Field label="Garantda avval ishlagan" value={yn(anketa?.worked_company)} />
        {anketa?.anketa_worked_befores?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Ish tarixi</span>
            {anketa.anketa_worked_befores.map((w, i) => (
              <Card key={i}>
                <span style={{ fontWeight: 600 }}>{w.company_name}</span>
                <span style={{ fontSize: 12 }}>{w.position}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {w.start_date} — {w.end_date}
                </span>
              </Card>
            ))}
          </div>
        )}
        {anketa?.anketa_progs?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Dasturlar</span>
            {anketa.anketa_progs.map((p, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{p.level}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Qo'shimcha */}
      <Section title="Qo'shimcha ma'lumotlar">
        <Field label="Bo'yi / vazni" value={anketa?.height} />
        <Field label="Talabami" value={yn(anketa?.now_study)} />
        <Field label="Ta'lim turi" value={anketa?.type_education} />
        <Field label="Avtomobil bor" value={yn(anketa?.is_car)} />
        <Field label="Avtomobil rusumi" value={anketa?.about_car} />
        <Field label="Xizmat safariga bora oladi" value={anketa?.trip ? yn(anketa.trip) : null} />
        <Field label="Qayddan bildi" value={anketa?.about_vacancy} />
        <Field label="Sudlangan" value={yn(anketa?.whether_convicted)} />
        <Field label="Sudlanganlik izoh" value={anketa?.whether_convicted_description} />
        <Field label="Oxirgi ish joyi maoshi" value={anketa?.salary_last_job} />
        <Field label="Xohlagan maosh" value={anketa?.payload} />
        {anketa?.other_info && anketa.other_info !== '-' && (
          <Field label="Qo'shimcha" value={anketa.other_info} />
        )}
      </Section>

      {/* Sog'liq */}
      {anketa?.anketa_healthys?.length > 0 && (
        <Section title="Sog'liq holati">
          {anketa.anketa_healthys.map((h, i) => (
            <Card key={i}>
              <span style={{ fontWeight: 600, fontSize: 12 }}>{h.question}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                {yn(h.status)}{h.description ? ` — ${h.description}` : ''}
              </span>
            </Card>
          ))}
        </Section>
      )}

      {/* Hujjatlar */}
      <Section title="Hujjatlar">
        <Field label="Pasport turi" value={anketa?.pasport_type} />
        <PhotoField label="Pasport (old)" url={anketa?.pasport_image_first} onZoom={setLightboxUrl} />
        <PhotoField label="Pasport (orqa / ID karta orqa)" url={anketa?.pasport_image_second} onZoom={setLightboxUrl} />
      </Section>

    </div>
  )
}
