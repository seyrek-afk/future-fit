/* RIASEC ilgi profili — docs/METHODOLOGY.md §3'ün birebir uygulaması.
 *
 *   likert:   ham += cevap (0-4),      max += 4              // maddenin tipine
 *   senaryo:  ham += 3,                max += 3 (her tipe)   // seçilen seçeneğin tipine
 *   akış:     ham += 2 × seçim sayısı, max += 2 × o tipteki seçenek sayısı (üst sınır: soru max'ı)
 *   pct[t] = round(100 × ham[t] / max[t])
 *
 * Cevaplanmayan madde ne hama ne maksa girer — PRD §4: "eksik cevaplar skorlamada
 * maksimum tabanından düşülür". Böylece yarım bırakılan test yanlış bir düşük puan üretmez.
 */

import { RIASEC_ORDER } from '../data/index.js'

const zeroByType = () => Object.fromEntries(RIASEC_ORDER.map((t) => [t, 0]))

const isLikertScore = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 4

export function computeRiasec(answers, data) {
  const a = answers || {}
  const raw = zeroByType()
  const max = zeroByType()

  for (const item of data.riasec.likert) {
    const v = a.likert?.[item.id]
    if (!isLikertScore(v)) continue
    raw[item.t] += v
    max[item.t] += 4
  }

  for (const sc of data.riasec.scenarios) {
    const idx = a.scenarios?.[sc.id]
    const opt = Number.isInteger(idx) ? sc.opts[idx] : undefined
    if (!opt) continue
    raw[opt.t] += 3
    // Senaryoda her tip yarışa girer: maksimum tüm tiplere eklenir.
    for (const t of RIASEC_ORDER) max[t] += 3
  }

  for (const q of data.riasec.flow) {
    const selected = a.flow?.[q.id]
    if (!Array.isArray(selected) || selected.length === 0) continue

    const optionsPerType = zeroByType()
    for (const o of q.opts) optionsPerType[o.t] += 1
    for (const t of RIASEC_ORDER) {
      // Kullanıcı en fazla q.max seçim yapabildiği için bir tipin üst sınırı da q.max'tır.
      max[t] += 2 * Math.min(optionsPerType[t], q.max)
    }

    for (const i of selected.slice(0, q.max)) {
      const o = q.opts[i]
      if (o) raw[o.t] += 2
    }
  }

  const pct = zeroByType()
  for (const t of RIASEC_ORDER) {
    pct[t] = max[t] > 0 ? Math.round((100 * raw[t]) / max[t]) : 0
  }

  // Eşitlikte sabit RIASEC sırası belirleyicidir; sıralama her zaman deterministiktir.
  const sorted = [...RIASEC_ORDER].sort(
    (x, y) => pct[y] - pct[x] || RIASEC_ORDER.indexOf(x) - RIASEC_ORDER.indexOf(y),
  )

  const values = RIASEC_ORDER.map((t) => pct[t])
  const spread = Math.max(...values) - Math.min(...values)

  return {
    raw,
    max,
    pct,
    sorted,
    code: sorted.slice(0, 3),
    spread,
    /** spread < 15 → profil "düz"; rapor keşif modu uyarısı gösterir (METHODOLOGY §3). */
    explorationMode: spread < 15,
  }
}
