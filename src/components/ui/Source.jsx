/* Kaynak izi bileşenleri — bu projenin en kritik sözleşmesi.
 *
 * Kurallar (CLAUDE.md 4-5, data/*.json → _provenance):
 *   · Kaynağa dayanan her iddia yanında kaynak kısaltması + yılı taşır; tıklanınca tam künye açılır.
 *   · Kaynak id'si sources.json'da bulunamazsa rozet HİÇ gösterilmez — uydurma künye üretilmez.
 *   · Editoryal alanlar kaynaklı veri gibi sunulmaz; ayrı ve görünür biçimde işaretlenir.
 */

import React from 'react'
import { SOURCE_BY_ID } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'

const yearOf = (source) => String(source.date || '').slice(0, 4)

/** Bir iddianın yanına konan açılabilir kaynak rozeti. */
export function SourceBadge({ id, compact = false }) {
  const source = SOURCE_BY_ID[id]
  if (!source) return null
  const year = yearOf(source)

  return (
    <details className={`src ${compact ? 'src-compact' : ''}`.trim()}>
      <summary
        className="src-badge"
        title={tr.report.sourceBadgeLabel(source.short, year)}
        aria-label={tr.report.sourceBadgeLabel(source.short, year)}
      >
        <span aria-hidden="true">
          {source.short} · {year}
        </span>
      </summary>
      <div className="src-body">
        <p className="src-title">{source.title}</p>
        <p className="src-meta">
          {source.publisher} · {source.date}
        </p>
        {source.note ? <p className="src-note">{source.note}</p> : null}
        <a href={source.url} target="_blank" rel="noreferrer noopener">
          {tr.report.openSource}
        </a>
      </div>
    </details>
  )
}

/** Bir metnin (örn. küme notu) dayandığı künyelerin listesi. */
export function SourceTrail({ ids, label }) {
  const known = (ids || []).filter((id) => SOURCE_BY_ID[id])
  if (known.length === 0) return null
  // <details> bir <p> içinde geçerli değildir (tarayıcı <p>'yi erken kapatır), <div> kullanılır.
  return (
    <div className="src-trail">
      {label ? <span className="src-trail-label">{label}</span> : null}
      {known.map((id) => (
        <SourceBadge key={id} id={id} compact />
      ))}
    </div>
  )
}

/** Editoryal alan işareti — kaynak rozetiyle karıştırılmasın diye farklı biçimde. */
export function EditorialBadge({ note }) {
  return (
    <span className="editorial-badge" title={note || tr.report.editorialBadgeTitle}>
      {tr.report.editorialBadge}
    </span>
  )
}

/** Raporun en altındaki tam künye listesi. */
export function SourceRegistry({ ids }) {
  const sources = (ids || []).map((id) => SOURCE_BY_ID[id]).filter(Boolean)
  if (sources.length === 0) return null

  return (
    <ol className="src-registry">
      {sources.map((s) => (
        <li key={s.id} id={`kaynak-${s.id}`}>
          <p className="src-registry-head">
            <span className="src-badge src-badge-static">
              {s.short} · {yearOf(s)}
            </span>{' '}
            <strong>{s.title}</strong>
          </p>
          <p className="src-meta">
            {s.publisher} · {s.date}
          </p>
          {s.note ? <p className="src-note">{s.note}</p> : null}
          <a className="src-url" href={s.url} target="_blank" rel="noreferrer noopener">
            {s.url}
          </a>
        </li>
      ))}
    </ol>
  )
}
