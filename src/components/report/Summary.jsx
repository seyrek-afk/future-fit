/* Özet — raporun ilk ekranı, tek bakışta sonuç.
 *
 * Hedef kitle lise çağında: raporun tamamı uzun, ama SONUÇ kısa olmalı. Bu kart
 * Holland kodunu, ilk üç kümeyi ve üç güçlü beceriyi metne boğmadan verir; gerisi aşağıda.
 *
 * Kaynak izi burada da bozulmaz: bu kartta kaynağa dayalı hiçbir İDDİA yoktur —
 * yalnızca kullanıcının kendi cevaplarından türeyen skorlar ve küme adları vardır.
 * Rozetli iddialar (meslek istatistikleri) 3. bölümdeki kartlarda, künyeleriyle birlikte durur.
 */

import React from 'react'
import { ArrowDown } from 'lucide-react'
import { DATA } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'
import { Explainer } from '../ui/primitives.jsx'
import { RiasecHexagon } from './Hexagon.jsx'
import { PART_IDS } from './structure.jsx'

const META = DATA.riasec.meta

export function Summary({ results }) {
  const { riasec, topClusters, skills } = results
  const code = riasec.code

  return (
    <section className="summary" aria-labelledby="h-summary">
      <h2 id="h-summary" className="visually-hidden">
        {tr.report.summaryTitle}
      </h2>

      <div className="summary-grid">
        <div className="summary-code">
          <p className="summary-kicker">{tr.report.hollandTitle}</p>
          <p className="summary-letters" aria-hidden="true">
            {code.map((t) => (
              <span key={t} style={{ color: META[t].hex }}>
                {t}
              </span>
            ))}
          </p>
          <p className="summary-code-names">{code.map((t) => META[t].name).join(' · ')}</p>
          {riasec.explorationMode ? (
            <p className="summary-flat">{tr.report.summaryFlat}</p>
          ) : null}

          <Explainer label={tr.report.summaryWhatLetters}>
            <p>{tr.report.hollandExplain(code.join('-'), code.map((t) => META[t].name).join(', '))}</p>
            <ul className="holland-list">
              {code.map((t) => (
                <li key={t}>
                  <span className="swatch" style={{ background: META[t].hex }} aria-hidden="true" />
                  <strong>{META[t].name}</strong> <em>({META[t].en})</em> — {META[t].desc}
                </li>
              ))}
            </ul>
          </Explainer>
        </div>

        <RiasecHexagon pct={riasec.pct} code={code} />
      </div>

      <div className="summary-cols">
        <div>
          <h3 className="summary-h">{tr.report.summaryTopClusters}</h3>
          <ol className="summary-clusters">
            {topClusters.slice(0, 3).map((c, i) => (
              <li key={c.id}>
                <span className="summary-rank" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="summary-cluster-name">{c.name}</span>
                <span className="summary-cluster-pct">%{c.pct}</span>
              </li>
            ))}
          </ol>
          <a className="summary-jump" href={`#${PART_IDS.clusters}`}>
            {tr.report.summaryAllClusters} <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>

        <div>
          <h3 className="summary-h">{tr.report.summaryStrengths}</h3>
          <ul className="summary-skills">
            {skills.strengths.map((s) => (
              <li key={s.id}>
                <span className="summary-skill-name">{s.tr}</span>
                <span className="summary-skill-pct">%{Math.round(s.readiness)}</span>
              </li>
            ))}
          </ul>
          <a className="summary-jump" href={`#${PART_IDS.skills}`}>
            {tr.report.summaryAllSkills} <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      <p className="summary-note">{tr.report.summaryNote}</p>
    </section>
  )
}
