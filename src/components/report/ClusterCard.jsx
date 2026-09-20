/* Meslek kümesi kartı — PRD §5.7.
 *
 * KAYNAK İZİ SÖZLEŞMESİ (data/clusters.json → _provenance):
 *   sourced   → jobs[].badge (jobs[].source), note (noteSources[]), aiPosture.note (aiPosture.source)
 *   editorial → tagline, caution, studyPathsTR, riasec/conf/values/skills/tech/problems ağırlıkları
 * Editoryal alanlar kaynak rozeti TAŞIMAZ; "Editoryal" işaretiyle ayrılır.
 */

import React from 'react'
import { AlertTriangle, Info, GraduationCap, Sparkles } from 'lucide-react'
import { SKILL_BY_ID } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'
import { SourceBadge, SourceTrail, EditorialBadge } from '../ui/Source.jsx'
import { Explainer } from '../ui/primitives.jsx'

export const AI_POSTURE_LABEL = {
  yuksek_direnc: tr.report.aiLensHigh,
  orta: tr.report.aiLensMedium,
  karisik: tr.report.aiLensMixed,
}

const pct = (v) => Math.round(v * 100)

export function ClusterCard({ scored, rank }) {
  const c = scored.cluster
  const posture = c.aiPosture

  return (
    <article className="cluster-card" aria-labelledby={`cluster-${c.id}`}>
      <header className="cluster-head">
        <p className="cluster-rank">{rank}</p>
        <div className="cluster-title">
          <h3 id={`cluster-${c.id}`}>{c.name}</h3>
          {/* tagline editoryaldir — kaynak rozeti almaz */}
          <p className="cluster-tagline">{c.tagline}</p>
        </div>
        <p className="cluster-score" title={tr.report.clustersFormula}>
          <span className="cluster-score-num">%{scored.pct}</span>
          <span className="cluster-score-word">örtüşme</span>
        </p>
      </header>

      <details className="cluster-breakdown">
        <summary>{tr.report.clusterBreakdown}</summary>
        <ul className="breakdown-list">
          {[
            [tr.report.clusterInterest, scored.interest, '%45'],
            [tr.report.clusterConfidence, scored.confidence, '%20'],
            [tr.report.clusterCuriosity, scored.curiosity, '%20'],
            [tr.report.clusterValues, scored.valueFit, '%15'],
          ].map(([label, value, weight]) => (
            <li key={label}>
              <span className="breakdown-label">
                {label} <em>({weight})</em>
              </span>
              <span className="breakdown-track" aria-hidden="true">
                <span className="breakdown-fill" style={{ width: `${pct(value)}%` }} />
              </span>
              <span className="breakdown-value">%{pct(value)}</span>
            </li>
          ))}
        </ul>
        <p className="hint">
          Ağırlıklar editoryal bir modeldir; ölçülmüş katsayı değildir. <EditorialBadge />
        </p>
      </details>

      {/* note → kaynaklı. Metin uzun olduğu için açılır blokta; künyeleri kendi içinde taşır. */}
      <Explainer label={tr.report.clusterWhyGrowing}>
        <p className="cluster-note">{c.note}</p>
        <SourceTrail ids={c.noteSources} label="Bu notun kaynakları:" />
      </Explainer>

      {scored.flags.interestHighConfLow || scored.flags.valuesMismatch ? (
        <div className="cluster-flags">
          {scored.flags.interestHighConfLow ? (
            <p className="flag flag-info">
              <Info size={16} aria-hidden="true" />
              <span>
                <strong>İlgi var, güven düşük.</strong> Bu kümeye ilgin yüksek görünüyor ama ilgili
                alanlarda kendine güvenin düşük. Bu bir engel değil; nereye çalışılacağını gösteren bir
                işaret.
              </span>
            </p>
          ) : null}
          {scored.flags.valuesMismatch ? (
            <p className="flag flag-warn">
              <AlertTriangle size={16} aria-hidden="true" />
              <span>
                <strong>Değer uyumsuzluğu.</strong> En önemli iki değerin bu kümenin tipik olarak
                beslediği değerler arasında görünmüyor. Alan sana uyabilir ama seni tatmin edecek şeyi
                beslemeyebilir.
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="cluster-block">
        <h4>{tr.report.clusterJobs}</h4>
        <ul className="job-list">
          {c.jobs.map((job) => (
            <li key={job.en}>
              <p className="job-name">
                {job.name} <span className="job-en">{job.en}</span>
              </p>
              <div className="job-badge-row">
                <span className="job-badge">{job.badge}</span>
                <SourceBadge id={job.source} compact />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="cluster-block">
        <h4>
          <Sparkles size={16} aria-hidden="true" /> {tr.report.clusterSkills}
        </h4>
        <ul className="inline-list">
          {c.skills.map((id) => {
            const skill = SKILL_BY_ID[id]
            return skill ? <li key={id}>{skill.tr}</li> : null
          })}
        </ul>
        <div className="hint hint-inline">
          <EditorialBadge /> <SourceBadge id="wef_foj_2025_skills" compact />
        </div>
      </div>

      <div className="cluster-block">
        <h4>{tr.report.clusterAiPosture}</h4>
        <p className={`posture posture-${posture.level}`}>
          <span className="posture-tag">{AI_POSTURE_LABEL[posture.level]}</span>
        </p>
        <Explainer label={tr.report.clusterAiWhy}>
          <p>{posture.note}</p>
          <SourceTrail ids={[posture.source]} label="Kaynak:" />
        </Explainer>
      </div>

      <div className="cluster-block">
        <h4>
          <GraduationCap size={16} aria-hidden="true" /> {tr.report.clusterStudyPaths}{' '}
          <EditorialBadge note={tr.report.clusterStudyPathsNote} />
        </h4>
        <ul className="inline-list">
          {c.studyPathsTR.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <Explainer label={tr.report.methodNote}>
          <p className="hint">{tr.report.clusterStudyPathsNote}</p>
        </Explainer>
      </div>

      <div className="cluster-caution">
        <p>
          <strong>{tr.report.clusterCaution}:</strong> {c.caution}{' '}
          <EditorialBadge note={tr.report.clusterCautionNote} />
        </p>
      </div>
    </article>
  )
}
