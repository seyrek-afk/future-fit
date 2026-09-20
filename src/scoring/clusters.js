/* Meslek kümesi uyum skoru — docs/METHODOLOGY.md §5.
 *
 *   total = 0.45 × ilgi + 0.20 × özyeterlik + 0.20 × merak + 0.15 × değer
 *
 * Skorlar SIRALAMA içindir, olasılık değildir. Arayüz bunu "başarı olasılığı" gibi sunmaz.
 */

import { isInterestHighConfLow, isValuesMismatch } from './flags.js'

export const WEIGHTS = { interest: 0.45, confidence: 0.2, curiosity: 0.2, values: 0.15 }

/** Merak bileşeninin iç ağırlıkları: 0.6 × teknoloji + 0.4 × sorun. */
export const CURIOSITY_WEIGHTS = { tech: 0.6, problems: 0.4 }

/** 1./2./3. değerin puanı; toplam 1.99'a bölünerek 0-1'e normalize edilir. */
export const VALUE_RANK_POINTS = [1.0, 0.66, 0.33]
const VALUE_NORMALIZER = 1.99

/** Bilgi yokluğunda kullanılan nötr değer (kümenin listesi boşsa ya da hiç cevap yoksa). */
const NEUTRAL = 0.5

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const isConfScore = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 1 && v <= 5

/** Kümenin RIASEC ağırlıklarıyla kullanıcının yüzdelerinin ağırlıklı ortalaması → 0-1. */
export function interestFit(clusterRiasec, pct) {
  let weighted = 0
  let weightSum = 0
  for (const [type, w] of Object.entries(clusterRiasec || {})) {
    weighted += w * ((pct?.[type] ?? 0) / 100)
    weightSum += w
  }
  return weightSum > 0 ? clamp01(weighted / weightSum) : 0
}

/** Kümenin conf maddelerinin ortalaması, (ort − 1) / 4 ile 0-1'e ölçeklenir. */
export function confidenceFit(clusterConf, confAnswers) {
  const scores = (Array.isArray(clusterConf) ? clusterConf : [])
    .map((id) => confAnswers?.[id])
    .filter(isConfScore)
  if (scores.length === 0) return NEUTRAL
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length
  return clamp01((avg - 1) / 4)
}

/** Örtüşme oranı: eşleşen / kümedeki toplam. Küme listesi boşsa nötr 0.5. */
function overlap(clusterList, selected) {
  const list = Array.isArray(clusterList) ? clusterList : []
  if (list.length === 0) return { score: NEUTRAL, matched: [], total: 0 }
  const chosen = new Set(Array.isArray(selected) ? selected : [])
  const matched = list.filter((id) => chosen.has(id))
  return { score: matched.length / list.length, matched, total: list.length }
}

/** 0.6 × teknoloji örtüşmesi + 0.4 × sorun örtüşmesi. */
export function curiosityFit(cluster, answers) {
  const tech = overlap(cluster.tech, answers?.techs)
  const problems = overlap(cluster.problems, answers?.problems)
  return {
    score: clamp01(CURIOSITY_WEIGHTS.tech * tech.score + CURIOSITY_WEIGHTS.problems * problems.score),
    tech,
    problems,
  }
}

/** İlk 3 değerden kümenin listesinde olanlara 1.0 / 0.66 / 0.33; toplam /1.99. */
export function valueFit(clusterValues, rankedValueIds) {
  const inCluster = new Set(Array.isArray(clusterValues) ? clusterValues : [])
  const ranked = Array.isArray(rankedValueIds) ? rankedValueIds : []
  let points = 0
  const matched = []
  for (let i = 0; i < VALUE_RANK_POINTS.length; i++) {
    const id = ranked[i]
    if (id && inCluster.has(id)) {
      points += VALUE_RANK_POINTS[i]
      matched.push({ id, rank: i + 1, points: VALUE_RANK_POINTS[i] })
    }
  }
  return { score: clamp01(points / VALUE_NORMALIZER), matched }
}

/**
 * Tüm kümeleri puanlar ve uyum yüzdesine göre azalan sırada döner.
 * Eşitlikte data/clusters.json içindeki sıra korunur (deterministik çıktı).
 */
export function scoreClusters(answers, riasecPct, data) {
  const a = answers || {}

  const scored = data.clusters.clusters.map((cluster, index) => {
    const interest = interestFit(cluster.riasec, riasecPct)
    const confidence = confidenceFit(cluster.conf, a.conf)
    const curiosity = curiosityFit(cluster, a)
    const values = valueFit(cluster.values, a.values)

    const total = clamp01(
      WEIGHTS.interest * interest +
        WEIGHTS.confidence * confidence +
        WEIGHTS.curiosity * curiosity.score +
        WEIGHTS.values * values.score,
    )

    return {
      id: cluster.id,
      name: cluster.name,
      cluster,
      index,
      interest,
      confidence,
      curiosity: curiosity.score,
      techMatch: curiosity.tech,
      problemMatch: curiosity.problems,
      valueFit: values.score,
      matchedValues: values.matched,
      total,
      pct: Math.round(total * 100),
      flags: {
        interestHighConfLow: isInterestHighConfLow(interest, confidence),
        valuesMismatch: isValuesMismatch(a.values, cluster.values),
      },
    }
  })

  return scored.sort((x, y) => y.total - x.total || x.index - y.index)
}
