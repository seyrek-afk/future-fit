/* 2030 beceri radarı — docs/METHODOLOGY.md §6.
 *
 *   hazırlık[beceri] = Σ(affinity[t] × pct[t]) / Σ(affinity[t])
 *
 * Bu bir YETENEK ölçümü değil, bir EĞİLİM haritasıdır: kullanıcının ilgi profilinin becerinin
 * tipik profiline ne kadar yaklaştığını söyler. riasecAffinity değerleri editoryaldir
 * (bkz. data/skills2030.json → _provenance.editorial), WEF verisi değildir.
 */

/** Hazırlık puanı pct ile aynı ölçektedir (0-100). */
export function readiness(riasecAffinity, pct) {
  let weighted = 0
  let weightSum = 0
  for (const [type, affinity] of Object.entries(riasecAffinity || {})) {
    weighted += affinity * (pct?.[type] ?? 0)
    weightSum += affinity
  }
  return weightSum > 0 ? weighted / weightSum : 0
}

/** WEF sıralamasında ilk kaç beceri "bilinçli yatırım" adayı sayılır (METHODOLOGY §6). */
export const INVESTMENT_POOL_RANK = 5
export const STRENGTH_COUNT = 3
export const INVESTMENT_COUNT = 2

export function computeSkills(riasecPct, data) {
  const rising = data.skills2030.rising.map((skill) => ({
    ...skill,
    readiness: readiness(skill.riasecAffinity, riasecPct),
  }))

  // Eşitlikte WEF sırası (rank) belirleyicidir → deterministik liste.
  const byReadinessDesc = (x, y) => y.readiness - x.readiness || x.rank - y.rank
  const byReadinessAsc = (x, y) => x.readiness - y.readiness || x.rank - y.rank

  const strengths = [...rising].sort(byReadinessDesc).slice(0, STRENGTH_COUNT)

  const investments = rising
    .filter((s) => s.rank <= INVESTMENT_POOL_RANK)
    .sort(byReadinessAsc)
    .slice(0, INVESTMENT_COUNT)

  const readinessById = Object.fromEntries(rising.map((s) => [s.id, s.readiness]))

  return {
    /** WEF'in yükselen 10 becerisi, kullanıcının hazırlık puanıyla, WEF sırasında. */
    rising,
    /** Hazırlık puanı en yüksek 3 yükselen beceri. */
    strengths,
    /** İlk 5'te olup hazırlık puanı en düşük 2 beceri. */
    investments,
    readinessById,
  }
}
