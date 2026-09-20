/* Cevap nesnesinin kanonik biçimi.
 *
 * Skorlama katmanı ve arayüz bu şekli paylaşır. Buradaki alan adları paylaşım bağlantısının
 * kodlamasına da girer (src/state/shareLink.js), bu yüzden değiştirilirse sürüm numarası artmalıdır.
 *
 * Kişisel veri YOKTUR: isim bilerek bu nesnenin dışında (meta) tutulur, böylece paylaşım
 * bağlantısına da kopyalama dökümüne de sızmaz.
 */

export function createEmptyAnswers() {
  return {
    likert: {}, // { L1: 0-4 }
    scenarios: {}, // { SC1: seçenek indeksi }
    flow: {}, // { F1: [seçenek indeksleri] }
    prediger: {}, // { P1: 'a' | 'b' }
    env: {}, // { E1: 'a' | 'b' }
    values: [], // sıralı değer id'leri (1. = en önemli)
    conf: {}, // { c_math: 1-5 }
    problems: [], // seçilen sorun id'leri
    techs: [], // seçilen teknoloji id'leri
    open: {}, // { O1: 'serbest metin' }
  }
}

/** Dışarıdan gelen (localStorage, paylaşım bağlantısı) cevapları kanonik şekle oturtur. */
export function normalizeAnswers(input) {
  const base = createEmptyAnswers()
  if (!input || typeof input !== 'object') return base
  return {
    likert: asRecord(input.likert),
    scenarios: asRecord(input.scenarios),
    flow: asRecord(input.flow),
    prediger: asRecord(input.prediger),
    env: asRecord(input.env),
    values: Array.isArray(input.values) ? input.values.filter((v) => typeof v === 'string') : [],
    conf: asRecord(input.conf),
    problems: Array.isArray(input.problems) ? input.problems.filter((v) => typeof v === 'string') : [],
    techs: Array.isArray(input.techs) ? input.techs.filter((v) => typeof v === 'string') : [],
    open: asRecord(input.open),
  }
}

function asRecord(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? { ...v } : {}
}

/**
 * Çoklu seçimleri veri dosyasındaki sıraya oturtur ve bilinmeyen id'leri atar.
 *
 * Seçim SIRASI anlam taşımaz (kullanıcı hangi çipe önce dokunduğu bilgisi skora girmez),
 * bu yüzden kanonik sıra veri dosyasının sırasıdır. Paylaşım bağlantısı da bu sırayı üretir,
 * böylece kodla→çöz döngüsü birebir aynı nesneyi verir.
 */
export function canonicalizeAnswers(answers, data) {
  const a = normalizeAnswers(answers)
  const order = (list, selected) => list.map((x) => x.id).filter((id) => selected.includes(id))
  return {
    ...a,
    problems: order(data.interests.problems, a.problems),
    techs: order(data.interests.techs, a.techs),
    values: a.values.filter((id) => data.values.values.some((v) => v.id === id)),
  }
}

/** Kaç maddenin cevaplandığı — ilerleme göstergesi ve "eksik cevap" uyarısı için. */
export function countAnswered(answers, data) {
  const a = normalizeAnswers(answers)
  return {
    likert: Object.values(a.likert).filter(isNum).length,
    scenarios: Object.values(a.scenarios).filter(isNum).length,
    flow: Object.values(a.flow).filter((v) => Array.isArray(v) && v.length > 0).length,
    prediger: Object.values(a.prediger).filter(Boolean).length,
    env: Object.values(a.env).filter(Boolean).length,
    values: a.values.length === data.values.values.length ? 1 : 0,
    conf: Object.values(a.conf).filter(isNum).length,
    interests: a.problems.length + a.techs.length,
    open: Object.values(a.open).filter((v) => typeof v === 'string' && v.trim()).length,
  }
}

function isNum(v) {
  return typeof v === 'number' && Number.isFinite(v)
}
