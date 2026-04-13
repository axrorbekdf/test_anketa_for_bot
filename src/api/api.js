const BASE = ''

export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch(`${BASE}/api/anketa-web-app/store/image`, {
    method: 'POST',
    body: fd,
  })
  if (!res.ok) throw new Error('Rasm yuklashda xatolik yuz berdi')
  const text = await res.text()
  return text.replace(/^"|"$/g, '').trim()
}

export async function submitAnketa(payload) {
  const res = await fetch(`${BASE}/api/anketa-web-app/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Server xatosi: ${res.status}`)
  }
  return res.json()
}

function sw(val) {
  // ha=1, yo'q=2 konversiya
  if (val === 'ha') return '1'
  if (val === "yo'q") return '2'
  return val
}

export function buildPayload(data) {
  const chatId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    || new URLSearchParams(window.location.search).get('chat_id')
    || null

  const positionPayload = (data.lavozimlar || []).map(l => ({ label: l.label, value: l.label }))

  return {
    chat_id: chatId,
    first_name: data.ism,
    last_name: data.familiya,
    father_name: data.otaIsmi,
    // gender: erkak=1, ayol=2
    gender: data.jins === 'erkak' ? '1' : data.jins === 'ayol' ? '2' : data.jins,
    age: data.tugSana,
    martial_status: data.oilaviyHolat,
    education: data.malumot,
    // education_place: field nomi education_name bo'lishi kerak
    education_place: (data.talimMuassasalar || []).map(t => ({
      id: t.id,
      education_name: t.name,
      start_date: t.start_date,
      end_date: t.end_date,
      specialty: t.specialty,
    })),
    specialty: null,
    state_id: data.viloyat,
    region_id: data.tuman,
    address: data.manzil,
    branch_id: data.filial,
    position: positionPayload,
    // telefon: faqat raqamlar
    eddition_phone_number: data.qoshimchaTel
      ? data.qoshimchaTel.replace(/\D/g, '')
      : null,
    image: data.shaxsiyRasmUrl || '',
    // citizen: ha=1, yo'q=2
    citizen: sw(data.fuqaro),
    // job_now: ha=1, yo'q=2
    job_now: sw(data.ishBilanTaminlangan),
    about_vacancy: data.qaydanBildi,
    height: data.boyVazn,
    now_study: data.talabaMi,
    type_education: data.typeEducation || null,
    other_info: data.qoshimcha || '-',
    // is_car: ha=1, yo'q=2
    is_car: sw(data.avtomobil),
    about_car: data.avtomobilRusumi || null,
    // trip: faqat erkak uchun, ha=1, yo'q=2
    trip: data.jins === 'erkak' ? sw(data.trip) : null,
    relation_company: data.garantQarindosh || "Yo'q",
    // worked_company: ha=1, yo'q=2
    worked_company: sw(data.avvalIshlagan),
    // whether_convicted: ha=1, yo'q=2
    whether_convicted: sw(data.sudlangan),
    whether_convicted_description: data.sudlanganIzoh || null,
    salary_last_job: data.oxirgiMaosh || null,
    // payload: xohlagan maosh (desired salary)
    payload: data.xohlganMaosh || '',
    // pasport_type: backend Оддий / ID карта kutadi
    pasport_type: data.pasportTuri === 'biometrik' ? 'Оддий'
      : data.pasportTuri === 'id_karta' ? 'ID карта'
      : data.pasportTuri,
    pasport_image_first: data.pasportTuri === 'id_karta'
      ? data.idKartaOldUrl
      : data.pasportRasmUrl,
    pasport_image_second: data.idKartaOrqaUrl || null,

    anketa_childrens: (data.farzandlar || []).map(f => ({
      id: f.id,
      gender: f.gender,
      date: f.date,
    })),
    anketa_relations: (data.oilaviyTarkib || []).map(t => ({
      id: t.id,
      who: t.who,
      date: t.date,
      job: t.job,
    })),
    anketa_languages: (data.tillar || []).map(t => ({
      id: t.id,
      name: t.name,
      level: t.level,
    })),
    anketa_progs: (data.dasturlar || []).map(d => ({
      id: d.id,
      name: d.name,
      level: d.level,
    })),
    anketa_worked_befores: (data.ishTarixi || []).map(i => ({
      id: i.id,
      start_date: i.start_date,
      end_date: i.end_date,
      company_name: i.company_name,
      position: i.position,
    })),
    anketa_healthys: (data.soglik || []).map(s => ({
      id: s.id,
      question: s.question,
      status: s.status,
      description: s.description,
    })),
  }
}
