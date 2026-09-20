/* Skorlama katmanının tek giriş noktası.
 *
 * Buradaki her şey SAF fonksiyondur: aynı cevaplar + aynı veri → aynı sonuç, yan etki yok.
 * Bileşenler skor hesaplamaz; yalnızca computeAll çıktısını okur (CLAUDE.md kural 3).
 */

import { DATA } from '../data/index.js'
import { computeRiasec } from './riasec.js'
import { computeAxes, readEnvironment } from './axes.js'
import { scoreClusters } from './clusters.js'
import { computeSkills } from './skills.js'

export { computeRiasec } from './riasec.js'
export { computeAxes, readEnvironment } from './axes.js'
export { scoreClusters, WEIGHTS, CURIOSITY_WEIGHTS, VALUE_RANK_POINTS } from './clusters.js'
export { computeSkills, readiness } from './skills.js'
export { THRESHOLDS, isExplorationMode, isInterestHighConfLow, isValuesMismatch } from './flags.js'

export function computeAll(answers, data = DATA) {
  const riasec = computeRiasec(answers, data)
  const axes = computeAxes(answers, data)
  const clusters = scoreClusters(answers, riasec.pct, data)
  const skills = computeSkills(riasec.pct, data)

  return {
    riasec,
    axes,
    environment: readEnvironment(answers, data),
    clusters,
    /** İlk 5 küme kart olarak, kalanı mini liste olarak gösterilir (PRD §5.7-5.8). */
    topClusters: clusters.slice(0, 5),
    restClusters: clusters.slice(5),
    skills,
    values: readValues(answers, data),
    flags: { explorationMode: riasec.explorationMode },
  }
}

/** Kullanıcının sıraladığı değerler, tanımlarıyla birlikte (1. = en önemli). */
export function readValues(answers, data = DATA) {
  const byId = Object.fromEntries(data.values.values.map((v) => [v.id, v]))
  const ranked = Array.isArray(answers?.values) ? answers.values : []
  return ranked.map((id, i) => ({ ...byId[id], id, rank: i + 1 })).filter((v) => v.title)
}

export default computeAll
