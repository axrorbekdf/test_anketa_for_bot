export function validateStep(step, data) {
  const errors = {}

  if (step === 0) {
    if (!data.ism?.trim()) errors.ism = 'Ism kiritish shart'
    if (!data.familiya?.trim()) errors.familiya = 'Familiya kiritish shart'
    if (!data.otaIsmi?.trim()) errors.otaIsmi = 'Otasining ismi kiritish shart'
    if (!data.tugSana) errors.tugSana = "Tug'ilgan sana kiritish shart"
    if (!data.jins) errors.jins = 'Jinsingizni tanlang'
    if (!data.oilaviyHolat) errors.oilaviyHolat = 'Oilaviy holatingizni tanlang'

    if (data.farzandlar?.length) {
      const incomplete = data.farzandlar.some(f => !f.gender || !f.date)
      if (incomplete) errors.farzandlar = "Farzandlar jadvalidagi barcha ustunlarni to'ldiring"
    }
    if (data.oilaviyTarkib?.length) {
      const incomplete = data.oilaviyTarkib.some(t => !t.who || !t.date)
      if (incomplete) errors.oilaviyTarkib = "Oilaviy tarkib jadvalidagi barcha ustunlarni to'ldiring"
    }
  }

  if (step === 1) {
    if (!data.malumot?.trim()) errors.malumot = "Ma'lumot darajasini kiriting yoki tanlang"
    if (!data.talabaMi) errors.talabaMi = 'Talaba ekanligingizni tanlang'
    if (data.talabaMi === '1' && !data.typeEducation) errors.typeEducation = "Ta'lim turini tanlang"

    if (data.talimMuassasalar?.length) {
      const incomplete = data.talimMuassasalar.some(t => !t.name?.trim())
      if (incomplete) errors.talimMuassasalar = "Muassasa nomi to'ldirilmagan qatorlar bor"
    }
    if (data.tillar?.length) {
      const incomplete = data.tillar.some(t => !t.name?.trim() || !t.level)
      if (incomplete) errors.tillar = "Til va daraja to'ldirilmagan qatorlar bor"
    }
  }

  if (step === 2) {
    if (!data.boyVazn?.trim()) errors.boyVazn = "Bo'y va vaznni kiriting (masalan: 170/65)"
    if (!data.viloyat) errors.viloyat = 'Viloyatni tanlang'
    if (!data.tuman) errors.tuman = 'Shahar / tumanni tanlang'
    if (!data.manzil?.trim()) errors.manzil = 'Manzilingizni kiriting'
    if (!data.filial) errors.filial = 'Filialni tanlang'
    if (!data.lavozimlar?.length) errors.lavozimlar = 'Kamida bitta lavozim tanlang'
  }

  if (step === 3) {
    if (!data.avvalIshlagan) errors.avvalIshlagan = 'Javob bering'
    if (!data.fuqaro) errors.fuqaro = 'Javob bering'
    if (!data.ishBilanTaminlangan) errors.ishBilanTaminlangan = 'Javob bering'
    if (!data.avtomobil) errors.avtomobil = 'Javob bering'
    if (data.avtomobil === 'ha' && !data.avtomobilRusumi) errors.avtomobilRusumi = 'Avtomobil rusumini tanlang'
    if (data.jins === 'erkak' && !data.trip) errors.trip = 'Javob bering'
  }

  if (step === 4) {
    if (data.soglik?.some(s => !s.status))
      errors.soglik = "Barcha savollarga javob bering"
    if (!data.oxirgiMaosh) errors.oxirgiMaosh = 'Oxirgi ish haqi kiritish shart'
    if (!data.xohlganMaosh) errors.xohlganMaosh = 'Xohlagan maosh kiritish shart'
    if (!data.avtomobil) errors.avtomobil = 'Javob bering'
    if (!data.qaydanBildi) errors.qaydanBildi = "Qayerdan bilganingizni tanlang"
    if (!data.sudlangan) errors.sudlangan = 'Javob bering'
    if (data.sudlangan === 'ha' && !data.sudlanganIzoh?.trim()) errors.sudlanganIzoh = 'Izoh kiriting'
  }

  if (step === 5) {
    if (!data.qoshimchaTel) errors.qoshimchaTel = "Qo'shimcha telefon raqam kiritish shart"
    if (!data.shaxsiyRasmUrl) errors.shaxsiyRasm = 'Shaxsiy rasmingizni yuklang'
    if (!data.pasportTuri) errors.pasportTuri = 'Pasport turini tanlang'
    if (data.pasportTuri === 'biometrik' && !data.pasportRasmUrl)
      errors.pasportRasm = 'Pasport rasmini yuklang'
    if (data.pasportTuri === 'id_karta' && !data.idKartaOldUrl)
      errors.idKartaOld = 'ID karta old tomonini yuklang'
    if (data.pasportTuri === 'id_karta' && !data.idKartaOrqaUrl)
      errors.idKartaOrqa = 'ID karta orqa tomonini yuklang'
  }

  return errors
}
