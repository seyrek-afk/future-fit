/* Kaynak izi toplayıcı.
 *
 * Raporun altındaki künye elle yazılmaz: ekranda GERÇEKTEN gösterilen alanlardan toplanır.
 * Böylece data/*.json'a yeni bir küme ya da rozet eklendiğinde künye kendiliğinden doğru kalır
 * ve kullanılmayan bir kaynak künyeye sızmaz.
 */

import { DATA, SOURCE_BY_ID } from './index.js'

/** Raporda gösterilen kümelerden + beceri radarından kullanılan kaynak id'leri (sıralı). */
export function collectUsedSources(clusters = DATA.clusters.clusters) {
  const used = new Set()

  for (const cluster of clusters) {
    for (const job of cluster.jobs || []) if (job.source) used.add(job.source)
    if (cluster.aiPosture?.source) used.add(cluster.aiPosture.source)
    for (const id of cluster.noteSources || []) used.add(id)
  }

  // Beceri radarı ve WEF başlık istatistikleri her raporda gösterilir.
  for (const id of DATA.skills2030._attribution.usedSources || []) used.add(id)

  // sources.json'daki sırayı koru — künye her raporda aynı düzende çıksın.
  return DATA.sources.sources.map((s) => s.id).filter((id) => used.has(id) && SOURCE_BY_ID[id])
}

/** Soru maddelerinin uyarlandığı ölçüm çerçeveleri (dosya künyelerinden). */
export function measurementFrameworks() {
  const files = [
    ['İlgi maddeleri ve senaryolar', DATA.riasec],
    ['Çalışma tarzı', DATA.workstyle],
    ['Değerler', DATA.values],
    ['Öz-yeterlik', DATA.confidence],
    ['Merak maddeleri', DATA.interests],
    ['Açık uçlu sorular', DATA.openQuestions],
  ]

  return files
    .map(([label, file]) => ({
      label,
      frameworks: file._attribution?.framework || [],
      note: file._attribution?.note,
    }))
    .filter((x) => x.frameworks.length > 0)
}

/** Kaynağa değil editoryal yargıya dayanan alanlar — raporda ayrıca listelenir. */
export function editorialFields() {
  const out = []
  for (const [file, label] of [
    [DATA.clusters, 'Meslek kümeleri'],
    [DATA.skills2030, '2030 becerileri'],
  ]) {
    for (const [field, note] of Object.entries(file._provenance?.editorial || {})) {
      out.push({ scope: label, field, note })
    }
  }
  return out
}

/** Veri setinin en son güncellendiği tarih (dosyalar arasındaki en yenisi). */
export function dataUpdatedAt() {
  const dates = [DATA.clusters._updated, DATA.skills2030._updated, DATA.sources._updated].filter(Boolean)
  return dates.sort().at(-1)
}
