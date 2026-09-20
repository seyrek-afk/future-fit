/* Veri erişim noktası.
 *
 * data/*.json dosyaları build sırasında import edilir — çalışma zamanında hiçbir ağ isteği yapılmaz.
 * Bu dosya veriyi YENİDEN ŞEKİLLENDİRMEZ, yalnızca tek bir yerden sunar ve sık kullanılan
 * arama tablolarını (id → nesne) hazırlar. İçerik değişikliği data/*.json içinde yapılır.
 */

import riasec from '../../data/riasec.json'
import workstyle from '../../data/workstyle.json'
import valuesFile from '../../data/values.json'
import confidence from '../../data/confidence.json'
import interests from '../../data/interests.json'
import openQuestions from '../../data/open-questions.json'
import clusters from '../../data/clusters.json'
import skills2030 from '../../data/skills2030.json'
import sources from '../../data/sources.json'

export const DATA = {
  riasec,
  workstyle,
  values: valuesFile,
  confidence,
  interests,
  openQuestions,
  clusters,
  skills2030,
  sources,
}

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))

/** id → kaynak künyesi. Bulunamayan id null döner; arayüz rozeti kaynaksız göstermez. */
export const SOURCE_BY_ID = byId(sources.sources)

export const VALUE_BY_ID = byId(valuesFile.values)
export const CONF_BY_ID = byId(confidence.items)
export const PROBLEM_BY_ID = byId(interests.problems)
export const TECH_BY_ID = byId(interests.techs)
export const CLUSTER_BY_ID = byId(clusters.clusters)

/** Yükselen + çekirdek-dışı becerilerin tamamı (radar ve küme kartları bunu kullanır). */
export const SKILL_BY_ID = byId([...skills2030.rising, ...skills2030.extraCore])

/** RIASEC tip sırası — eşitlik durumlarında belirleyici sıralama için sabit. */
export const RIASEC_ORDER = ['R', 'I', 'A', 'S', 'E', 'C']

/** Bir kaynağın "WEF 2025 · 2025" biçiminde kısa etiketi. */
export function sourceLabel(id) {
  const s = SOURCE_BY_ID[id]
  if (!s) return null
  const year = String(s.date || '').slice(0, 4)
  return { short: s.short, year, ...s }
}

export default DATA
