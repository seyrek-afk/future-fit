/* docs/PRD.md §8 madde 7 — paylaşım bağlantısı round-trip.
 * Kodla → çöz → aynı cevap nesnesi. Bozuk veri çökme üretmemeli.
 */

import { describe, it, expect } from 'vitest'
import { DATA } from '../data/index.js'
import { createEmptyAnswers, normalizeAnswers, canonicalizeAnswers } from '../state/answers.js'
import {
  encodeAnswers,
  decodeAnswers,
  buildShareUrl,
  readAnswersFromHash,
  MAX_URL_LENGTH,
  lzwCompress,
  lzwDecompress,
} from '../state/shareLink.js'

function fullAnswers() {
  const a = createEmptyAnswers()
  DATA.riasec.likert.forEach((item, i) => {
    a.likert[item.id] = i % 5
  })
  DATA.riasec.scenarios.forEach((sc, i) => {
    a.scenarios[sc.id] = i % sc.opts.length
  })
  DATA.riasec.flow.forEach((q, i) => {
    a.flow[q.id] = [i % q.opts.length, (i + 4) % q.opts.length].slice(0, q.max)
  })
  DATA.workstyle.prediger.forEach((p, i) => {
    a.prediger[p.id] = i % 2 ? 'a' : 'b'
  })
  DATA.workstyle.environment.forEach((e, i) => {
    a.env[e.id] = i % 2 ? 'b' : 'a'
  })
  a.values = ['support', 'achievement', 'conditions', 'independence', 'recognition', 'relationships']
  DATA.confidence.items.forEach((c, i) => {
    a.conf[c.id] = (i % 5) + 1
  })
  // Çoklu seçimler kanonik (veri dosyası) sırada tutulur — bkz. canonicalizeAnswers.
  a.problems = ['climate', 'ai', 'care']
  a.techs = ['ai', 'robotics', 'agritech']
  a.open = {
    O1: 'Müzik, kod yazmak, uzun yürüyüşler',
    O2: 'Bilgisayar tamiri ve ödev anlatımı',
    O3: 'Sabah laboratuvara gidiyorum; öğleden sonra ekiple tasarım tartışıyoruz.',
    O4: 'Mimarlık — çizim yeteneğim yetmez diye denemedim.',
  }
  return a
}

describe('§8.7 — paylaşım bağlantısı round-trip', () => {
  it('dolu bir cevap seti kodlanıp çözüldüğünde birebir aynı kalır', () => {
    const original = fullAnswers()
    const decoded = decodeAnswers(encodeAnswers(original, DATA), DATA)
    expect(decoded).toEqual(original)
  })

  it('boş cevap seti round-trip sonrası boş kalır', () => {
    const empty = createEmptyAnswers()
    expect(decodeAnswers(encodeAnswers(empty, DATA), DATA)).toEqual(empty)
  })

  it('çoklu seçimler kanonik sıraya oturtulur ve öyle geri gelir', () => {
    const shuffled = createEmptyAnswers()
    shuffled.problems = ['care', 'climate', 'ai'] // kullanıcının dokunma sırası
    shuffled.techs = ['agritech', 'ai']
    const canonical = canonicalizeAnswers(shuffled, DATA)
    expect(canonical.problems).toEqual(['climate', 'ai', 'care'])
    expect(decodeAnswers(encodeAnswers(shuffled, DATA), DATA)).toEqual(canonical)
  })

  it('eksik/yarım cevaplar korunur, eksikler eksik kalır', () => {
    const partial = normalizeAnswers({ likert: { L1: 0, L5: 4 }, techs: ['quantum'], open: { O2: 'x' } })
    expect(decodeAnswers(encodeAnswers(partial, DATA), DATA)).toEqual(partial)
  })

  it('açık uçlu metinlerdeki ayırıcı karakterler ve Türkçe harfler bozulmaz', () => {
    const tricky = createEmptyAnswers()
    tricky.open = {
      O1: 'virgül, dikey çizgi | ters eğik \\ hepsi bir arada',
      O2: 'ğüşiöçĞÜŞİÖÇ — em dash, "tırnak", emoji 🎯',
      O3: '',
      O4: 'satır\nsonu',
    }
    const decoded = decodeAnswers(encodeAnswers(tricky, DATA), DATA)
    expect(decoded.open.O1).toBe(tricky.open.O1)
    expect(decoded.open.O2).toBe(tricky.open.O2)
    expect(decoded.open.O4).toBe(tricky.open.O4)
  })

  it('URL hash biçiminden okunabilir', () => {
    const original = fullAnswers()
    const { url } = buildShareUrl(original, DATA, 'https://example.org/')
    expect(url).toContain('#r=')
    expect(readAnswersFromHash(new URL(url).hash, DATA)).toEqual(original)
  })

  it('kodlanmış dize URL-güvenlidir (+, /, = içermez)', () => {
    const encoded = encodeAnswers(fullAnswers(), DATA)
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('kısa cevap setinde bağlantı 2000 karakter sınırının altında kalır', () => {
    const a = createEmptyAnswers()
    DATA.riasec.likert.forEach((item, i) => {
      a.likert[item.id] = i % 5
    })
    const { tooLong, length } = buildShareUrl(a, DATA, 'https://future-fit.onrender.com/')
    expect(length).toBeLessThan(MAX_URL_LENGTH)
    expect(tooLong).toBe(false)
  })

  it('çok uzun açık uçlu metinlerde tooLong bayrağı düşer', () => {
    const a = createEmptyAnswers()
    a.open = { O1: 'a'.repeat(1500), O2: 'b'.repeat(1500), O3: 'c'.repeat(1500), O4: 'd'.repeat(1500) }
    // Tekrarlı metin LZW ile çok iyi sıkışır; sınırı zorlamak için rastgele-benzeri içerik gerekir.
    const noisy = createEmptyAnswers()
    const alphabet = 'abcdefghijklmnopqrstuvwxyzğüşiöçABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,;:'
    let seed = 7
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
    for (const q of DATA.openQuestions.questions) {
      noisy.open[q.id] = Array.from({ length: 900 }, () => alphabet[Math.floor(rnd() * alphabet.length)]).join('')
    }
    expect(buildShareUrl(noisy, DATA, 'https://future-fit.onrender.com/').tooLong).toBe(true)
    // Sıkışabilir uzun metin sınırı aşmayabilir — bu beklenen davranış, kontrol uzunluk üzerinden yapılır.
    expect(buildShareUrl(a, DATA, 'https://future-fit.onrender.com/').length).toBeGreaterThan(0)
  })

  it('bozuk, eksik ve yabancı girdilerde null döner — istisna fırlatmaz', () => {
    for (const bad of ['', 'xyz', '!!!', 'AAAA', null, undefined, 'a'.repeat(50)]) {
      expect(() => decodeAnswers(bad, DATA)).not.toThrow()
    }
    expect(readAnswersFromHash('#baska=1', DATA)).toBeNull()
    expect(readAnswersFromHash('', DATA)).toBeNull()
  })

  it('rastgele üretilmiş 200 cevap setinde round-trip bozulmaz', () => {
    // Değişken genişlikli LZW kodlayıcı/çözücünün bit zamanlaması inceliklidir;
    // bu özellik testi kodlama değiştiğinde ilk kırılacak yerdir.
    let seed = 20260920
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
    const alphabet = [...'abcçdefgğhıijklmnoöprsştuüvyz ,|\\.:;\'"()0123456789ĞÜŞİÖÇ\n']

    for (let n = 0; n < 200; n++) {
      const a = createEmptyAnswers()
      for (const item of DATA.riasec.likert) if (rnd() > 0.2) a.likert[item.id] = Math.floor(rnd() * 5)
      for (const sc of DATA.riasec.scenarios) if (rnd() > 0.2) a.scenarios[sc.id] = Math.floor(rnd() * 6)
      for (const q of DATA.riasec.flow) {
        const picks = [
          ...new Set(
            Array.from({ length: Math.floor(rnd() * (q.max + 1)) }, () =>
              Math.floor(rnd() * q.opts.length),
            ),
          ),
        ].sort((x, y) => x - y)
        if (picks.length) a.flow[q.id] = picks
      }
      for (const p of DATA.workstyle.prediger) if (rnd() > 0.2) a.prediger[p.id] = rnd() > 0.5 ? 'a' : 'b'
      for (const e of DATA.workstyle.environment) if (rnd() > 0.2) a.env[e.id] = rnd() > 0.5 ? 'a' : 'b'
      if (rnd() > 0.3) a.values = [...DATA.values.values.map((v) => v.id)].sort(() => rnd() - 0.5)
      for (const c of DATA.confidence.items) if (rnd() > 0.2) a.conf[c.id] = 1 + Math.floor(rnd() * 5)
      a.problems = DATA.interests.problems.filter(() => rnd() > 0.6).map((p) => p.id)
      a.techs = DATA.interests.techs.filter(() => rnd() > 0.6).map((t) => t.id)
      for (const q of DATA.openQuestions.questions) {
        const len = Math.floor(rnd() * 150)
        if (len) {
          a.open[q.id] = Array.from(
            { length: len },
            () => alphabet[Math.floor(rnd() * alphabet.length)],
          ).join('')
        }
      }

      expect(decodeAnswers(encodeAnswers(a, DATA), DATA), `tur ${n}`).toEqual(
        canonicalizeAnswers(a, DATA),
      )
    }
  })

  it('gerçekçi bir cevap setinde bağlantı kısa kalır', () => {
    // Türkçe düzyazı LZW ile iyi sıkışır; tipik bir kullanıcı sınırın çok altında kalmalı.
    const a = fullAnswers()
    const { length, tooLong } = buildShareUrl(a, DATA, 'https://future-fit.onrender.com/')
    expect(tooLong).toBe(false)
    expect(length).toBeLessThan(700)
  })

  it('LZW katmanı ikili veriyi kayıpsız taşır', () => {
    const bytes = new TextEncoder().encode('aaaaabbbbbabababab ğüşiöç 0123456789'.repeat(20))
    // jsdom'un TextEncoder'ı farklı realm'den Uint8Array döndürebilir; sayı dizisi üzerinden karşılaştır.
    expect(Array.from(lzwDecompress(lzwCompress(bytes)))).toEqual(Array.from(bytes))
    expect(lzwCompress(bytes).length).toBeLessThan(bytes.length)
  })
})
