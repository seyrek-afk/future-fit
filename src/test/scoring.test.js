/* docs/PRD.md §8 — asgari test seti, maddeler 1-6.
 * Madde 7 (paylaşım bağlantısı) share-link.test.js, madde 8 (veri bütünlüğü) data-integrity.test.js.
 */

import { describe, it, expect } from 'vitest'
import { DATA, RIASEC_ORDER } from '../data/index.js'
import { computeAll } from '../scoring/index.js'
import { computeRiasec } from '../scoring/riasec.js'
import { scoreClusters, interestFit, confidenceFit } from '../scoring/clusters.js'
import { isInterestHighConfLow, isValuesMismatch, THRESHOLDS } from '../scoring/flags.js'
import { createEmptyAnswers } from '../state/answers.js'
import { likertOnly, uniformLikert, uniformConfidence, rankValues, idsOf } from './helpers.js'

describe('§8.1 — düz profil', () => {
  it('tüm ilgi maddelerine aynı cevap verilirse tüm RIASEC yüzdeleri eşit olur', () => {
    const { riasec } = computeAll(uniformLikert(2), DATA)
    const values = RIASEC_ORDER.map((t) => riasec.pct[t])
    expect(new Set(values).size).toBe(1)
    expect(values[0]).toBe(50)
  })

  it('düz profilde spread 0 olur ve keşif modu bayrağı düşer', () => {
    const { riasec, flags } = computeAll(uniformLikert(4), DATA)
    expect(riasec.spread).toBe(0)
    expect(riasec.explorationMode).toBe(true)
    expect(flags.explorationMode).toBe(true)
  })

  it('belirgin farklılaşan profilde keşif modu bayrağı düşmez', () => {
    const { riasec } = computeAll(likertOnly('I'), DATA)
    expect(riasec.spread).toBeGreaterThanOrEqual(THRESHOLDS.flatProfileSpread)
    expect(riasec.explorationMode).toBe(false)
  })
})

describe('§8.2 — yalnızca I profili', () => {
  const result = computeAll(likertOnly('I'), DATA)

  it('Holland kodu I ile başlar', () => {
    expect(result.riasec.code[0]).toBe('I')
    expect(result.riasec.pct.I).toBe(100)
  })

  it('ai_data ve biotech ilk 3 kümede yer alır', () => {
    const top3 = idsOf(result.clusters.slice(0, 3))
    expect(top3).toContain('ai_data')
    expect(top3).toContain('biotech')
  })
})

describe('§8.3 — yalnızca S profili (regresyon bekçisi)', () => {
  /* v1'in düzeltilen kusuru: sosyal profil hiçbir kümeyle eşleşmiyordu.
     care_edu kümesi bu boşluğu kapatmak için eklendi. Bu test SİLİNMEMELİDİR. */
  const result = computeAll(likertOnly('S'), DATA)

  it('Holland kodu S ile başlar', () => {
    expect(result.riasec.code[0]).toBe('S')
  })

  it('care_edu kümesi ilk 2 içinde çıkar', () => {
    expect(idsOf(result.clusters.slice(0, 2))).toContain('care_edu')
  })

  it('senaryo ve akış cevapları da S yönündeyken care_edu birinci sırada kalır', () => {
    const a = likertOnly('S')
    for (const sc of DATA.riasec.scenarios) {
      a.scenarios[sc.id] = sc.opts.findIndex((o) => o.t === 'S')
    }
    for (const q of DATA.riasec.flow) {
      a.flow[q.id] = q.opts.map((o, i) => (o.t === 'S' ? i : -1)).filter((i) => i >= 0).slice(0, q.max)
    }
    expect(computeAll(a, DATA).clusters[0].id).toBe('care_edu')
  })
})

describe('§8.4 — yalnızca R profili', () => {
  const result = computeAll(likertOnly('R'), DATA)

  it('Holland kodu R ile başlar', () => {
    expect(result.riasec.code[0]).toBe('R')
  })

  it('engineering veya trades_infra ilk 2 içinde çıkar', () => {
    const top2 = idsOf(result.clusters.slice(0, 2))
    expect(top2.some((id) => id === 'engineering' || id === 'trades_infra')).toBe(true)
  })
})

describe('§8.5 — boş ve eksik cevaplar', () => {
  const cases = [
    ['tamamen boş', createEmptyAnswers()],
    ['undefined', undefined],
    ['boş nesne', {}],
    ['bozuk tipler', { likert: null, flow: { F1: 'üç' }, values: 'achievement', conf: { c_math: 99 } }],
    ['yarım Likert', { likert: { L1: 4, L2: 3 } }],
  ]

  for (const [label, answers] of cases) {
    it(`${label} → çökmez ve tüm skorlar 0-100 aralığında kalır`, () => {
      const result = computeAll(answers, DATA)

      for (const t of RIASEC_ORDER) {
        expect(result.riasec.pct[t]).toBeGreaterThanOrEqual(0)
        expect(result.riasec.pct[t]).toBeLessThanOrEqual(100)
      }
      expect(result.riasec.code).toHaveLength(3)

      expect(result.clusters).toHaveLength(DATA.clusters.clusters.length)
      for (const c of result.clusters) {
        expect(Number.isFinite(c.pct)).toBe(true)
        expect(c.pct).toBeGreaterThanOrEqual(0)
        expect(c.pct).toBeLessThanOrEqual(100)
      }

      for (const s of result.skills.rising) {
        expect(s.readiness).toBeGreaterThanOrEqual(0)
        expect(s.readiness).toBeLessThanOrEqual(100)
      }
      expect(result.skills.strengths).toHaveLength(3)
      expect(result.skills.investments).toHaveLength(2)

      expect(result.axes.peopleThings).toBeGreaterThanOrEqual(-1)
      expect(result.axes.peopleThings).toBeLessThanOrEqual(1)
      expect(result.axes.dataIdeas).toBeGreaterThanOrEqual(-1)
      expect(result.axes.dataIdeas).toBeLessThanOrEqual(1)
    })
  }

  it('cevaplanmayan madde maksimum tabanına girmez (yarım test düşük puan üretmez)', () => {
    const half = createEmptyAnswers()
    for (const item of DATA.riasec.likert.filter((i) => i.t === 'A').slice(0, 2)) {
      half.likert[item.id] = 4
    }
    const riasec = computeRiasec(half, DATA)
    expect(riasec.max.A).toBe(8) // 6 madde değil, cevaplanan 2 madde × 4
    expect(riasec.pct.A).toBe(100)
  })
})

describe('§8.6 — bayrakların sınır değerleri', () => {
  it('interestHighConfLow: ilgi ≥ 0.55 ve güven < 0.45', () => {
    expect(isInterestHighConfLow(0.55, 0.4499)).toBe(true)
    expect(isInterestHighConfLow(0.9, 0.44)).toBe(true)
    // ilgi eşiğin bir tık altında
    expect(isInterestHighConfLow(0.5499, 0.2)).toBe(false)
    // güven tam eşikte → "düşük" sayılmaz
    expect(isInterestHighConfLow(0.55, 0.45)).toBe(false)
    expect(isInterestHighConfLow(0.55, 0.9)).toBe(false)
  })

  it('valuesMismatch: ilk 2 değerin ikisi de kümede yoksa düşer', () => {
    expect(isValuesMismatch(['support', 'relationships'], ['achievement', 'conditions'])).toBe(true)
    // ilk değer kümede var → uyumsuzluk yok
    expect(isValuesMismatch(['achievement', 'support'], ['achievement', 'conditions'])).toBe(false)
    // ikinci değer kümede var → uyumsuzluk yok
    expect(isValuesMismatch(['support', 'conditions'], ['achievement', 'conditions'])).toBe(false)
    // üçüncü değerin kümede olması bayrağı engellemez
    expect(isValuesMismatch(['support', 'independence', 'achievement'], ['achievement'])).toBe(true)
    // sıralama yapılmadıysa bilgi yok → bayrak düşmez
    expect(isValuesMismatch([], ['achievement'])).toBe(false)
    expect(isValuesMismatch(undefined, ['achievement'])).toBe(false)
  })

  it('gerçek profilde interestHighConfLow tam sınırda değişir', () => {
    // care_edu: riasec {S:3, I:1, A:0.5} → yalnızca S = %100 iken ilgi = 3/4.5 ≈ 0.667 (≥ 0.55)
    const low = uniformConfidence(likertOnly('S'), 1) // (1-1)/4 = 0 → güven < 0.45
    const high = uniformConfidence(likertOnly('S'), 5) // (5-1)/4 = 1 → güven ≥ 0.45

    const careLow = scoreClusters(low, computeRiasec(low, DATA).pct, DATA).find((c) => c.id === 'care_edu')
    const careHigh = scoreClusters(high, computeRiasec(high, DATA).pct, DATA).find((c) => c.id === 'care_edu')

    expect(careLow.interest).toBeGreaterThanOrEqual(THRESHOLDS.interestHigh)
    expect(careLow.flags.interestHighConfLow).toBe(true)
    expect(careHigh.flags.interestHighConfLow).toBe(false)
  })

  it('gerçek profilde valuesMismatch küme listesine göre değişir', () => {
    // care_edu.values = [relationships, support, conditions]
    const matching = rankValues(likertOnly('S'), ['relationships', 'support'])
    const clashing = rankValues(likertOnly('S'), ['recognition', 'independence'])

    const find = (a) => scoreClusters(a, computeRiasec(a, DATA).pct, DATA).find((c) => c.id === 'care_edu')
    expect(find(matching).flags.valuesMismatch).toBe(false)
    expect(find(clashing).flags.valuesMismatch).toBe(true)
  })
})

describe('METHODOLOGY §5 — bileşen formülleri', () => {
  it('ilgi bileşeni ağırlıklı ortalamadır', () => {
    // {I:3, C:1.5, R:0.5}, pct I=100 → (3×1 + 1.5×0 + 0.5×0) / 5 = 0.6
    expect(interestFit({ I: 3, C: 1.5, R: 0.5 }, { I: 100, C: 0, R: 0 })).toBeCloseTo(0.6, 10)
  })

  it('özyeterlik (ort − 1) / 4 ile ölçeklenir', () => {
    expect(confidenceFit(['c_math', 'c_coding'], { c_math: 1, c_coding: 1 })).toBe(0)
    expect(confidenceFit(['c_math', 'c_coding'], { c_math: 5, c_coding: 5 })).toBe(1)
    expect(confidenceFit(['c_math', 'c_coding'], { c_math: 5, c_coding: 1 })).toBe(0.5)
    // hiç cevap yoksa nötr
    expect(confidenceFit(['c_math'], {})).toBe(0.5)
  })

  it('toplam skor 0.45/0.20/0.20/0.15 ağırlıklarının toplamıdır', () => {
    const a = rankValues(uniformConfidence(likertOnly('I'), 4), ['achievement', 'recognition'])
    a.techs = ['ai']
    a.problems = ['ai']
    const c = scoreClusters(a, computeRiasec(a, DATA).pct, DATA).find((x) => x.id === 'ai_data')
    const expected = 0.45 * c.interest + 0.2 * c.confidence + 0.2 * c.curiosity + 0.15 * c.valueFit
    expect(c.total).toBeCloseTo(expected, 10)
    expect(c.pct).toBe(Math.round(expected * 100))
  })

  it('sıralama deterministiktir — eşit skorlarda veri dosyası sırası korunur', () => {
    const a = createEmptyAnswers()
    const first = idsOf(computeAll(a, DATA).clusters)
    const second = idsOf(computeAll(a, DATA).clusters)
    expect(first).toEqual(second)
  })
})

describe('METHODOLOGY §4 — Prediger eksenleri', () => {
  it('insan tarafı +1, nesne tarafı −1 verir', () => {
    const a = createEmptyAnswers()
    for (const p of DATA.workstyle.prediger) {
      if (p.axis !== 'pt') continue
      a.prediger[p.id] = p.a.side === 'people' ? 'a' : 'b'
    }
    expect(computeAll(a, DATA).axes.peopleThings).toBe(1)
  })

  it('fikir tarafı +1, veri tarafı −1 verir', () => {
    const a = createEmptyAnswers()
    for (const p of DATA.workstyle.prediger) {
      if (p.axis !== 'di') continue
      a.prediger[p.id] = p.a.side === 'data' ? 'a' : 'b'
    }
    expect(computeAll(a, DATA).axes.dataIdeas).toBe(-1)
  })

  it('cevap yoksa eksen 0 kalır', () => {
    const axes = computeAll(createEmptyAnswers(), DATA).axes
    expect(axes.peopleThings).toBe(0)
    expect(axes.dataIdeas).toBe(0)
  })
})

describe('METHODOLOGY §6 — 2030 beceri radarı', () => {
  it('hazırlık puanı affinity ağırlıklı ortalamadır', () => {
    // analytical: {I:1, C:0.7}; yalnızca I = %100 → (1×100 + 0.7×0) / 1.7 ≈ 58.8
    const { skills } = computeAll(likertOnly('I'), DATA)
    expect(skills.readinessById.analytical).toBeCloseTo(100 / 1.7, 6)
  })

  it('güçlü yanlar 3, yatırım alanları 2 beceridir ve yatırımlar WEF ilk 5 içinden gelir', () => {
    const { skills } = computeAll(likertOnly('S'), DATA)
    expect(skills.strengths).toHaveLength(3)
    expect(skills.investments).toHaveLength(2)
    for (const s of skills.investments) expect(s.rank).toBeLessThanOrEqual(5)
    for (const s of skills.investments) expect(s.howToBuild).toBeTruthy()
  })

  it('sosyal profilde empati/liderlik yönü, analitik yönden güçlü çıkar', () => {
    const { skills } = computeAll(likertOnly('S'), DATA)
    expect(skills.readinessById.leadership).toBeGreaterThan(skills.readinessById.analytical)
  })
})
