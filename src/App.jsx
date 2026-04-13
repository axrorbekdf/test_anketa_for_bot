import { useState } from 'react'
import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import { Step3 } from './steps/Step3'
import { Step4 } from './steps/Step4'
import { Step5 } from './steps/Step5'
import { Step6 } from './steps/Step6'
import { validateStep } from './utils/validation'
import { submitAnketa, buildPayload } from './api/api'

const STEPS = [
  { label: 'Shaxsiy', short: '1' },
  { label: "Ta'lim", short: '2' },
  { label: 'Joylashuv', short: '3' },
  { label: 'Ish', short: '4' },
  { label: "Qo'shimcha", short: '5' },
  { label: 'Hujjatlar', short: '6' },
]

const INITIAL = {
  ism: '', familiya: '', otaIsmi: '', tugSana: '', jins: '', oilaviyHolat: '',
  farzandlar: [], oilaviyTarkib: [],
  malumot: '', talabaMi: '', talimMuassasalar: [], tillar: [],
  boyVazn: '', viloyat: '', tuman: '', manzil: '', filial: '', lavozimlar: [],
  avvalIshlagan: '', fuqaro: '', ishBilanTaminlangan: '', garantQarindosh: '', dasturlar: [],
  soglik: [], qoshimcha: '', ishTarixi: [],
  oxirgiMaosh: '', xohlganMaosh: '', avtomobil: '', avtomobilRusumi: '', trip: '', qaydanBildi: '', sudlangan: '', sudlanganIzoh: '',
  qoshimchaTel: '',
  shaxsiyRasm: null, shaxsiyRasmUrl: null,
  pasportTuri: '', pasportRasm: null, pasportRasmUrl: null,
  idKartaOld: null, idKartaOldUrl: null,
  idKartaOrqa: null, idKartaOrqaUrl: null,
  roziman: false,
}

function ReloadModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '24px 20px',
        width: '100%', maxWidth: 360, textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
          Anketani yangilash
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
          Siz to'ldirgan barcha ma'lumotlar o'chib ketadi. Davom etasizmi?
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, height: 44, borderRadius: 10, border: '1.5px solid var(--border)',
              background: '#fff', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >Bekor qilish</button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1, height: 44, borderRadius: 10, border: 'none',
              background: 'var(--danger)', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
            }}
          >Ha, o'chirish</button>
        </div>
      </div>
    </div>
  )
}

function Header({ step, onBack, onReload }) {
  return (
    <header className="header">
      <button className="header-back" onClick={onBack} disabled={step === 0}>‹</button>
      <div className="header-center">
        <div className="header-title">Garant Anketa</div>
        <div className="header-sub">mini ilova</div>
      </div>
      <button className="header-menu" onClick={onReload}>↺</button>
    </header>
  )
}

function Progress({ step }) {
  const total = STEPS.length
  const pct = (step / (total - 1)) * 100
  return (
    <div className="progress-wrap">
      <div className="progress-steps">
        <div className="progress-line">
          <div className="progress-line-fill" style={{ width: `${pct}%` }} />
        </div>
        {STEPS.map((s, i) => (
          <div key={i} className="progress-step">
            <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {i < step ? '✓' : s.short}
            </div>
            <span className={`step-label ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


function SuccessScreen() {
  return (
    <div className="success-screen fade-slide">
      <span className="success-emoji">🎉</span>
      <div className="success-title">Anketa yuborildi!</div>
      <p className="success-desc">
        Anketangiz muvaffaqiyatli yuborildi.<br />
        Tez orada siz bilan bog'lanamiz.<br />
        <strong>Garant kompaniyasi</strong> sizga minnatdor!
      </p>
      <div className="info-box" style={{ maxWidth: 300 }}>
        <span className="info-box-icon">💬</span>
        <span className="info-box-text">
          Savollar uchun: <a className="tg-link" href="https://t.me/Yordam">@Yordam</a>
        </span>
      </div>
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [showReload, setShowReload] = useState(false)

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }))
    // clear error for this field when user changes it
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  const next = async () => {
    const errs = validateStep(step, formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // scroll to first error field
      const firstKey = Object.keys(errs)[0]
      setTimeout(() => {
        const el = document.getElementById(`field-${firstKey}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setErrors({})

    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      await handleSubmit()
    }
  }

  const prev = () => {
    if (step > 0) {
      setErrors({})
      setStep(s => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = buildPayload(formData)
      await submitAnketa(payload)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setSubmitError(e.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStep = () => {
    const props = { data: formData, onChange: handleChange, errors }
    switch (step) {
      case 0: return <Step1 {...props} />
      case 1: return <Step2 {...props} />
      case 2: return <Step3 {...props} />
      case 3: return <Step4 {...props} />
      case 4: return <Step5 {...props} />
      case 5: return <Step6 {...props} />
    }
  }

  if (submitted) {
    return (
      <>
        <Header step={0} onBack={() => {}} />
        <SuccessScreen />
      </>
    )
  }

  return (
    <>
      <Header step={step} onBack={prev} onReload={() => setShowReload(true)} />
      <Progress step={step} />
      {showReload && (
        <ReloadModal
          onConfirm={() => window.location.reload()}
          onCancel={() => setShowReload(false)}
        />
      )}

      <main className="page-body">
        {submitError && (
          <div style={{
            background: '#FEF2F2', border: '1.5px solid #FECACA',
            borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 10
          }}>
            <span style={{ fontSize: 18 }}>❌</span>
            <div style={{ fontSize: 13, color: '#DC2626' }}>
              <strong>Xatolik:</strong> {submitError}
            </div>
          </div>
        )}
        {renderStep()}
      </main>

      <nav className="footer-nav">
        {step > 0 && (
          <button className="btn-nav btn-prev" type="button" onClick={prev} disabled={submitting}>
            ‹ Orqaga
          </button>
        )}
        <button
          className={`btn-nav ${step === STEPS.length - 1 ? 'btn-submit' : 'btn-next'}`}
          type="button"
          onClick={next}
          disabled={submitting}
        >
          {submitting
            ? '⏳ Yuklanmoqda...'
            : step === STEPS.length - 1
              ? '✅ Anketani yuborish'
              : 'Davom etish ›'}
        </button>
      </nav>
    </>
  )
}
