/* Test yardımcıları — cevap profili üretici.
 *
 * Testler veri dosyalarındaki gerçek maddeleri kullanır (sahte veri yok), böylece
 * data/*.json değiştiğinde testler de gerçeği söylemeye devam eder.
 */

import { DATA } from '../data/index.js'
import { createEmptyAnswers } from '../state/answers.js'

/** Verilen RIASEC tiplerindeki Likert maddelerine yüksek (4), diğerlerine hiç cevap vermez. */
export function likertOnly(types, score = 4) {
  const wanted = new Set([].concat(types))
  const a = createEmptyAnswers()
  for (const item of DATA.riasec.likert) {
    if (wanted.has(item.t)) a.likert[item.id] = score
  }
  return a
}

/** Tüm Likert maddelerine aynı cevabı verir. */
export function uniformLikert(score = 2) {
  const a = createEmptyAnswers()
  for (const item of DATA.riasec.likert) a.likert[item.id] = score
  return a
}

/** Belirli bir tipin seçeneğini her senaryoda seçer. */
export function pickScenarios(a, type) {
  for (const sc of DATA.riasec.scenarios) {
    const idx = sc.opts.findIndex((o) => o.t === type)
    if (idx >= 0) a.scenarios[sc.id] = idx
  }
  return a
}

/** Her akış sorusunda o tipin seçeneklerini (soru sınırına kadar) işaretler. */
export function pickFlow(a, type) {
  for (const q of DATA.riasec.flow) {
    const idx = q.opts.map((o, i) => (o.t === type ? i : -1)).filter((i) => i >= 0)
    if (idx.length) a.flow[q.id] = idx.slice(0, q.max)
  }
  return a
}

/** Tüm öz-yeterlik maddelerine aynı puanı verir. */
export function uniformConfidence(a, score) {
  for (const item of DATA.confidence.items) a.conf[item.id] = score
  return a
}

/** Değer sıralamasını verilen id listesiyle, kalanları dosya sırasıyla tamamlar. */
export function rankValues(a, firstIds) {
  const rest = DATA.values.values.map((v) => v.id).filter((id) => !firstIds.includes(id))
  a.values = [...firstIds, ...rest]
  return a
}

/** Sıralı küme id listesi — beklenti yazarken okunaklı olsun diye. */
export const idsOf = (clusters) => clusters.map((c) => c.id)
