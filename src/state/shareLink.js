/* Paylaşım bağlantısı — docs/PRD.md §6.
 *
 * Cevaplar kompakt bir metne serileştirilir, LZW ile sıkıştırılır ve base64url olarak
 * URL hash'ine (#r=...) yazılır. SUNUCU YOKTUR: veri bağlantının kendisinde taşınır.
 * Harici sıkıştırma kütüphanesi kullanılmaz — çalışma zamanı bağımlılığı eklemiyoruz.
 *
 * İsim alanı bilerek KODLANMAZ: yalnızca cihazdaki localStorage'da kalır (CLAUDE.md kural 2).
 */

import { createEmptyAnswers, normalizeAnswers } from './answers.js'

/** Kodlama sürümü. Cevap şekli değişirse artır; eski bağlantılar reddedilir. */
export const SHARE_VERSION = '1'

/** Bu uzunluğu aşan bağlantı paylaşılamaz; arayüz düğmeyi devre dışı bırakıp PDF önerir. */
export const MAX_URL_LENGTH = 2000

const FIELD = '|'
const ITEM = ','
const MISSING = '-'

/* ---------------- kompakt serileştirme ---------------- */

function escapeText(s) {
  return String(s).replace(/[\\|,]/g, (c) => '\\' + c)
}

/**
 * Kaçışlı ayırıcıya bölme. Kaçış çifti OLDUĞU GİBİ taşınır, çünkü metin iki kez bölünür
 * (önce alanlara, sonra madde içine); kaçışın erken çözülmesi "a\,b" gibi içeriği bozardı.
 * Gerçek çözme en sonda unescapeText ile yapılır.
 */
function splitEscaped(s, sep) {
  const out = []
  let cur = ''
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '\\' && i + 1 < s.length) {
      cur += c + s[++i]
    } else if (c === sep) {
      out.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  out.push(cur)
  return out
}

function unescapeText(s) {
  return String(s).replace(/\\(.)/g, '$1')
}

const num36 = (n) => n.toString(36)
const parse36 = (s) => {
  const n = parseInt(s, 36)
  return Number.isNaN(n) ? null : n
}

/** Cevapları veri dosyalarındaki sabit sıraya dayanan kısa bir metne çevirir. */
export function serializeAnswers(answers, data) {
  const a = normalizeAnswers(answers)

  const likert = data.riasec.likert
    .map((it) => (typeof a.likert[it.id] === 'number' ? String(a.likert[it.id]) : MISSING))
    .join('')

  const scenarios = data.riasec.scenarios
    .map((sc) => (Number.isInteger(a.scenarios[sc.id]) ? num36(a.scenarios[sc.id]) : MISSING))
    .join('')

  const flow = data.riasec.flow
    .map((q) => (Array.isArray(a.flow[q.id]) ? a.flow[q.id].map(num36).join('') : ''))
    .join(ITEM)

  const prediger = data.workstyle.prediger.map((p) => a.prediger[p.id] || MISSING).join('')
  const env = data.workstyle.environment.map((e) => a.env[e.id] || MISSING).join('')

  const valueIndex = Object.fromEntries(data.values.values.map((v, i) => [v.id, i]))
  const values = a.values
    .map((id) => (valueIndex[id] === undefined ? '' : num36(valueIndex[id])))
    .join('')

  const conf = data.confidence.items
    .map((c) => (typeof a.conf[c.id] === 'number' ? String(a.conf[c.id]) : MISSING))
    .join('')

  const problems = data.interests.problems.map((p) => (a.problems.includes(p.id) ? '1' : '0')).join('')
  const techs = data.interests.techs.map((t) => (a.techs.includes(t.id) ? '1' : '0')).join('')

  const open = data.openQuestions.questions.map((q) => escapeText(a.open[q.id] || '')).join(ITEM)

  return [
    SHARE_VERSION,
    likert,
    scenarios,
    flow,
    prediger,
    env,
    values,
    conf,
    problems,
    techs,
    open,
  ].join(FIELD)
}

/** serializeAnswers'in tersi. Biçim tanınmazsa null döner. */
export function deserializeAnswers(text, data) {
  const parts = splitEscaped(String(text), FIELD)
  if (parts.length < 11 || parts[0] !== SHARE_VERSION) return null

  const [, likert, scenarios, flow, prediger, env, values, conf, problems, techs, ...openRest] = parts
  const a = createEmptyAnswers()

  data.riasec.likert.forEach((it, i) => {
    const c = likert[i]
    if (c && c !== MISSING) {
      const v = Number(c)
      if (v >= 0 && v <= 4) a.likert[it.id] = v
    }
  })

  data.riasec.scenarios.forEach((sc, i) => {
    const c = scenarios[i]
    if (c && c !== MISSING) {
      const v = parse36(c)
      if (v !== null && v >= 0 && v < sc.opts.length) a.scenarios[sc.id] = v
    }
  })

  const flowGroups = flow.split(ITEM)
  data.riasec.flow.forEach((q, i) => {
    const group = flowGroups[i] || ''
    const picks = [...group].map(parse36).filter((v) => v !== null && v >= 0 && v < q.opts.length)
    if (picks.length) a.flow[q.id] = picks
  })

  data.workstyle.prediger.forEach((p, i) => {
    const c = prediger[i]
    if (c === 'a' || c === 'b') a.prediger[p.id] = c
  })

  data.workstyle.environment.forEach((e, i) => {
    const c = env[i]
    if (c === 'a' || c === 'b') a.env[e.id] = c
  })

  a.values = [...values].map((c) => data.values.values[parse36(c)]?.id).filter(Boolean)

  data.confidence.items.forEach((item, i) => {
    const c = conf[i]
    if (c && c !== MISSING) {
      const v = Number(c)
      if (v >= 1 && v <= 5) a.conf[item.id] = v
    }
  })

  a.problems = data.interests.problems.filter((p, i) => problems[i] === '1').map((p) => p.id)
  a.techs = data.interests.techs.filter((t, i) => techs[i] === '1').map((t) => t.id)

  // Açık uçlu metinler serbest içerik taşır; ayırıcıları kaçışlı olduğu için son alanda toplanır.
  const openParts = splitEscaped(openRest.join(FIELD), ITEM)
  data.openQuestions.questions.forEach((q, i) => {
    const t = unescapeText(openParts[i] ?? '')
    if (t) a.open[q.id] = t
  })

  return a
}

/* ---------------- LZW + base64url ---------------- */

const utf8 = {
  encode: (s) => new TextEncoder().encode(s),
  decode: (bytes) => new TextDecoder().decode(bytes),
}

const MIN_WIDTH = 9
const MAX_WIDTH = 16
const DICT_LIMIT = 1 << MAX_WIDTH

/**
 * Bir sözlük boyutunda kod yazmak için gereken bit sayısı.
 * Kodlayıcı ve çözücü aynı zamanlamayı kullanmak zorundadır; ikisi de bunu çağırır.
 */
function widthFor(dictSize) {
  const bits = 32 - Math.clz32(Math.max(dictSize - 1, 1))
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, bits))
}

function BitWriter() {
  const bytes = []
  let acc = 0
  let bits = 0
  return {
    write(value, width) {
      acc = (acc << width) | value
      bits += width
      while (bits >= 8) {
        bits -= 8
        bytes.push((acc >> bits) & 0xff)
      }
    },
    finish() {
      if (bits > 0) bytes.push((acc << (8 - bits)) & 0xff)
      return Uint8Array.from(bytes)
    },
  }
}

function BitReader(bytes) {
  let pos = 0
  let acc = 0
  let bits = 0
  return {
    read(width) {
      while (bits < width) {
        if (pos >= bytes.length) return null // dolgu bitleri: akış bitti
        acc = (acc << 8) | bytes[pos++]
        bits += 8
      }
      bits -= width
      const value = (acc >> bits) & ((1 << width) - 1)
      acc &= (1 << bits) - 1
      return value
    },
    get exhausted() {
      return pos >= bytes.length && bits < MIN_WIDTH
    },
  }
}

/** LZW, değişken genişlikli kodlarla (9→16 bit). Sabit 16 bit'e göre yaklaşık yarı boyut. */
export function lzwCompress(bytes) {
  if (bytes.length === 0) return new Uint8Array(0)

  const dict = new Map()
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i)
  let size = 256
  const out = BitWriter()
  let w = ''

  for (const byte of bytes) {
    const c = String.fromCharCode(byte)
    const wc = w + c
    if (dict.has(wc)) {
      w = wc
    } else {
      out.write(dict.get(w), widthFor(size))
      if (size < DICT_LIMIT) dict.set(wc, size++)
      w = c
    }
  }
  if (w !== '') out.write(dict.get(w), widthFor(size))
  return out.finish()
}

export function lzwDecompress(packed) {
  if (packed.length === 0) return new Uint8Array(0)

  const dict = []
  for (let i = 0; i < 256; i++) dict.push(String.fromCharCode(i))

  const reader = BitReader(packed)
  const first = reader.read(widthFor(dict.length))
  if (first === null || first >= dict.length) throw new Error('Bozuk veri')

  let w = dict[first]
  const parts = [w]

  for (;;) {
    // Kodlayıcı bu kodu yazarken sözlüğü bizimkinden bir adım öndeydi.
    const code = reader.read(widthFor(dict.length + 1))
    if (code === null) break

    let entry
    if (code < dict.length) entry = dict[code]
    else if (code === dict.length) entry = w + w[0]
    else throw new Error('Bozuk veri')

    parts.push(entry)
    if (dict.length < DICT_LIMIT) dict.push(w + entry[0])
    w = entry

    if (reader.exhausted) break
  }

  const out = parts.join('')
  const bytes = new Uint8Array(out.length)
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i)
  return bytes
}

function bytesToBase64url(bytes) {
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlToBytes(b64) {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/* ---------------- genel arayüz ---------------- */

/** Cevapları URL hash'inde taşınabilir bir dizeye çevirir. */
export function encodeAnswers(answers, data) {
  const text = serializeAnswers(answers, data)
  return bytesToBase64url(lzwCompress(utf8.encode(text)))
}

/** encodeAnswers'in tersi. Bozuk/eski veride null döner — asla istisna fırlatmaz. */
export function decodeAnswers(encoded, data) {
  try {
    const text = utf8.decode(lzwDecompress(base64urlToBytes(String(encoded))))
    return deserializeAnswers(text, data)
  } catch {
    return null
  }
}

/** Tam paylaşım bağlantısı + 2000 karakter sınırına göre paylaşılabilirlik bilgisi. */
export function buildShareUrl(answers, data, baseUrl) {
  const base = String(baseUrl || '').split('#')[0]
  const url = base + '#r=' + encodeAnswers(answers, data)
  return { url, length: url.length, tooLong: url.length > MAX_URL_LENGTH }
}

/** location.hash içindeki #r=... değerini çözer; yoksa null. */
export function readAnswersFromHash(hash, data) {
  const m = /[#&]r=([^&]+)/.exec(hash || '')
  return m ? decodeAnswers(m[1], data) : null
}
