/* Raporun üst düzey yapısı — üç ana bölüm + "Ek bilgiler".
 *
 *   1. Kişisel tanıtım            → ilgi profili, çalışma tarzı, değerler, kendine güven
 *   2. 2030 beceri radarı
 *   3. Profilinle en çok örtüşen meslek kümeleri
 *   Ek bilgiler                   → diğer kümeler, YZ merceği, sonraki adımlar, kaynak künyesi
 *
 * İçindekiler listesi başlığın hemen altındadır; raporun uzunluğu (11 alt bölüm) karşısında
 * kullanıcıya nerede olduğunu ve neyi atlayabileceğini gösterir.
 */

import React from 'react'
import { tr } from '../../i18n/tr.js'

export const PART_IDS = {
  profile: 'bolum-kisisel',
  skills: 'bolum-beceri',
  clusters: 'bolum-kumeler',
  extra: 'bolum-ek',
}

/** Raporun başındaki içindekiler. Anchor bağlantıları kullanır; JS gerektirmez. */
export function ReportToc() {
  const entries = [
    { id: PART_IDS.profile, part: tr.report.parts.profile },
    { id: PART_IDS.skills, part: tr.report.parts.skills },
    { id: PART_IDS.clusters, part: tr.report.parts.clusters },
    { id: PART_IDS.extra, part: tr.report.parts.extra },
  ]

  return (
    <nav className="report-toc" aria-labelledby="toc-title">
      <h2 id="toc-title">{tr.report.tocTitle}</h2>
      <p className="hint">{tr.report.tocHint}</p>
      <ol className="toc-list">
        {entries.map(({ id, part }) => (
          <li key={id} className={part.n ? 'toc-main' : 'toc-extra'}>
            <a href={`#${id}`}>
              <span className="toc-num" aria-hidden="true">
                {part.n ?? '+'}
              </span>
              <span className="toc-body">
                <strong>{part.title}</strong>
                <span className="toc-about">{part.about}</span>
                <span className="toc-items">{part.items.join(' · ')}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Bir ana bölümün başlığı ve gövdesi. `n` yoksa numarasız ("Ek bilgiler") gösterilir. */
export function ReportPart({ id, part, icon: Icon, children }) {
  const headingId = `${id}-baslik`
  return (
    <section className="report-part" id={id} aria-labelledby={headingId}>
      <header className="part-head">
        {part.n ? <p className="part-label">{tr.report.partLabel(part.n)}</p> : null}
        <h2 id={headingId} tabIndex={-1}>
          {Icon ? <Icon size={22} aria-hidden="true" /> : null}
          {part.title}
        </h2>
        <p className="part-about">{part.about}</p>
      </header>
      <div className="part-body">{children}</div>
    </section>
  )
}
