/* Rapora düşen bayraklar — docs/METHODOLOGY.md §5 "Rapora düşen bayraklar" tablosu.
 *
 * Eşikler tek bir yerde tutulur; sınır değer testleri (docs/PRD.md §8 madde 6) bunlara dayanır.
 */

export const THRESHOLDS = {
  /** spread bu değerin ALTINDAysa profil düz sayılır. */
  flatProfileSpread: 15,
  /** ilgi bu değere EŞİT ya da ÜSTÜNDEyse "ilgi yüksek". */
  interestHigh: 0.55,
  /** özyeterlik bu değerin ALTINDAysa "güven düşük". */
  confidenceLow: 0.45,
}

/** Profil düz mü? spread < 15 → sonuçlar kesin hüküm olarak okunmamalı. */
export function isExplorationMode(spread) {
  return spread < THRESHOLDS.flatProfileSpread
}

/** İlgi ≥ 0.55 ve özyeterlik < 0.45 → ilgi var, güven yok (engel değil, gelişim alanı). */
export function isInterestHighConfLow(interest, confidence) {
  return interest >= THRESHOLDS.interestHigh && confidence < THRESHOLDS.confidenceLow
}

/**
 * Kullanıcının ilk 2 değeri kümenin `values` listesinde yoksa uyumsuzluk bayrağı düşer.
 * Kullanıcı değerlerini hiç sıralamadıysa bayrak düşmez — bilgi yokluğu uyumsuzluk değildir.
 */
export function isValuesMismatch(rankedValueIds, clusterValueIds) {
  const top2 = (Array.isArray(rankedValueIds) ? rankedValueIds : []).slice(0, 2)
  if (top2.length === 0) return false
  const inCluster = new Set(clusterValueIds || [])
  return top2.every((id) => !inCluster.has(id))
}
