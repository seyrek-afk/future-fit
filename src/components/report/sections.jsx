/* Rapor bölümleri — docs/PRD.md §5.
 *
 * Hiçbir bileşen skor hesaplamaz: hepsi computeAll() çıktısını okur (CLAUDE.md kural 3).
 * Dil kuralı: kesinlik yok. "Örtüşme derecesi" evet, "sana uygun meslek" hayır.
 */

import React from 'react'
import { Compass, AlertTriangle, Bot } from 'lucide-react'
import { DATA, CONF_BY_ID, SKILL_BY_ID } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'
import { Card, Bar, AxisMeter, Chip, Callout, Explainer } from '../ui/primitives.jsx'
import { SourceBadge, SourceTrail, EditorialBadge, SourceRegistry } from '../ui/Source.jsx'
import { ClusterCard } from './ClusterCard.jsx'
import {
  collectUsedSources,
  measurementFrameworks,
  editorialFields,
  dataUpdatedAt,
} from '../../data/provenance.js'

const META = DATA.riasec.meta

/* ---------- 1. Başlık ---------- */

export function ReportHeader({ name }) {
  const today = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="report-head">
      <h1 id="section-heading" tabIndex={-1}>
        {name ? `${name} — ${tr.report.heading}` : tr.report.heading}
      </h1>
      <p className="report-date">{tr.report.generatedOn(today)}</p>

    </header>
  )
}

/* ---------- 2. İlgi profili ---------- */

export function InterestProfile({ results }) {
  const { pct, sorted, spread, explorationMode } = results.riasec

  return (
    <Card as="section" aria-labelledby="h-interest">
      <h3 id="h-interest">
        <Compass size={18} aria-hidden="true" /> {tr.report.interestTitle}
      </h3>
      <p className="lead-sm">{tr.report.interestLeadShort}</p>

      {explorationMode ? (
        <Callout tone="warn" title={tr.report.explorationTitle} icon={AlertTriangle}>
          <p>{tr.report.explorationBody}</p>
        </Callout>
      ) : null}

      <div className="bars">
        {sorted.map((t) => (
          <Bar
            key={t}
            value={pct[t]}
            color={META[t].hex}
            label={
              <>
                <strong>{META[t].name}</strong> <em>{META[t].en}</em>
              </>
            }
          />
        ))}
      </div>
      <p className="hint">Farklılaşma (en yüksek − en düşük): {spread} puan.</p>
      <Explainer label={tr.report.howToRead}>
        <p>{tr.report.interestLead}</p>
      </Explainer>
    </Card>
  )
}

/* ---------- 3. Çalışma tarzı ---------- */

export function WorkStyle({ results }) {
  const { axes, environment } = results

  return (
    <Card as="section" aria-labelledby="h-axes">
      <h3 id="h-axes">{tr.report.axesTitle}</h3>
      <p className="lead-sm">{tr.report.axesLeadShort}</p>

      <AxisMeter
        title={tr.report.axisPeopleThings}
        value={axes.peopleThings}
        leftLabel={tr.report.axisThings}
        rightLabel={tr.report.axisPeople}
        unanswered={axes.answered.peopleThings === 0}
        unansweredText={tr.report.axisUnanswered}
      />
      <AxisMeter
        title={tr.report.axisDataIdeas}
        value={axes.dataIdeas}
        leftLabel={tr.report.axisData}
        rightLabel={tr.report.axisIdeas}
        unanswered={axes.answered.dataIdeas === 0}
        unansweredText={tr.report.axisUnanswered}
      />

      <h4>{tr.report.environmentTitle}</h4>
      {environment.length ? (
        <div className="chip-grid">
          {environment.map((e) => (
            <Chip key={e.id} selected>
              {e.text}
            </Chip>
          ))}
        </div>
      ) : (
        <p className="hint">{tr.report.environmentEmpty}</p>
      )}
      <Explainer label={tr.report.howToRead}>
        <p>{tr.report.axesLead}</p>
        <p className="hint">
          Eksenler Prediger çerçevesinden uyarlanmıştır; ölçülmüş bir katsayı değil, cevaplarının
          ortalamasıdır. <EditorialBadge />
        </p>
      </Explainer>
    </Card>
  )
}

/* ---------- 4. Değerler ---------- */

export function ValuesSummary({ results }) {
  const values = results.values

  return (
    <Card as="section" aria-labelledby="h-values">
      <h3 id="h-values">{tr.report.valuesTitle}</h3>
      <p className="lead-sm">{tr.report.valuesLeadShort}</p>

      {values.length === 0 ? (
        <p className="hint">{tr.report.valuesEmpty}</p>
      ) : (
        <>
          <ol className="values-top">
            {values.slice(0, 3).map((v) => (
              <li key={v.id}>
                <span className="value-rank" aria-hidden="true">
                  {v.rank}
                </span>
                <div>
                  <strong>{v.title}</strong> <em>({v.en})</em>
                  <p>{v.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          {values.length > 3 ? (
            <p className="hint">
              {tr.report.valuesRest}: {values.slice(3).map((v) => v.title).join(' · ')}
            </p>
          ) : null}
        </>
      )}
      <Explainer label={tr.report.howToRead}>
        <p>{tr.report.valuesLead}</p>
        <p className="hint">Değer başlıkları O*NET Work Values çerçevesinden uyarlanmıştır.</p>
      </Explainer>
    </Card>
  )
}

/* ---------- 5. Kendine güven haritası ---------- */

export function ConfidenceMap({ answers }) {
  const answered = DATA.confidence.items.filter((i) => typeof answers.conf[i.id] === 'number')

  return (
    <Card as="section" aria-labelledby="h-conf">
      <h3 id="h-conf">{tr.report.confidenceTitle}</h3>
      <p className="lead-sm">{tr.report.confidenceLeadShort}</p>

      {answered.length === 0 ? (
        <p className="hint">{tr.report.confidenceEmpty}</p>
      ) : (
        <div className="bars bars-tight">
          {DATA.confidence.items.map((item) => {
            const v = answers.conf[item.id]
            if (typeof v !== 'number') {
              return (
                <p className="conf-missing" key={item.id}>
                  {item.text} <span>{tr.misc.unanswered}</span>
                </p>
              )
            }
            return (
              <div className="conf-row" key={item.id}>
                <span className="conf-label">{CONF_BY_ID[item.id].text}</span>
                <span className="conf-track" aria-hidden="true">
                  <span className="conf-fill" style={{ width: `${(v / 5) * 100}%` }} />
                </span>
                <span className="conf-value">
                  {v}
                  <span className="visually-hidden"> / 5</span>
                </span>
              </div>
            )
          })}
        </div>
      )}
      <Explainer label={tr.report.howToRead}>
        <p>{tr.report.confidenceLead}</p>
      </Explainer>
    </Card>
  )
}

/* ---------- 6. 2030 beceri radarı ---------- */

export function SkillsRadar({ results }) {
  const { strengths, investments, rising } = results.skills
  const headline = DATA.skills2030.headline

  return (
    <Card as="section" aria-label={tr.report.skillsTitle}>
      <p className="lead-sm">{tr.report.skillsLeadShort}</p>

      <div className="skills-split">
        <div>
          <h3>{tr.report.skillsStrengthTitle}</h3>
          <p className="hint">{tr.report.skillsStrengthNote}</p>
          <ul className="skill-cards">
            {strengths.map((s) => (
              <li key={s.id} className="skill-card skill-good">
                <p className="skill-name">
                  {s.tr} <span className="skill-score">%{Math.round(s.readiness)}</span>
                </p>
                <p className="skill-desc">{s.desc}</p>
                <SourceTrail ids={[s.source]} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>{tr.report.skillsInvestTitle}</h3>
          <p className="hint">{tr.report.skillsInvestNote}</p>
          <ul className="skill-cards">
            {investments.map((s) => (
              <li key={s.id} className="skill-card skill-invest">
                <p className="skill-name">
                  {s.tr} <span className="skill-score">%{Math.round(s.readiness)}</span>
                </p>
                <p className="skill-desc">{s.desc}</p>
                <p className="skill-how">
                  <strong>{tr.report.skillsHowToBuild}:</strong> {s.howToBuild} <EditorialBadge />
                </p>
                <SourceTrail ids={[s.source]} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Explainer label={tr.report.skillsRisingTitle} className="explainer-wide">
        <p className="hint">{tr.report.skillsRisingNote}</p>
        <div className="bars bars-tight">
          {rising.map((s) => (
            <Bar key={s.id} value={s.readiness} label={`${s.rank}. ${s.tr}`} />
          ))}
        </div>
        <div className="hint">
          Sıralama WEF verisidir; yanındaki yüzde editoryal bir eşlemeden (riasecAffinity)
          türetilir. <EditorialBadge /> <SourceBadge id="wef_foj_2025_skills" compact />
        </div>
      </Explainer>

      <Explainer label={tr.report.skillsHeadlineTitle} className="explainer-wide">
        <p>{tr.report.skillsLead}</p>
        <ul className="headline-list">
          {Object.values(headline).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <SourceTrail ids={[DATA.skills2030._source]} label="Kaynak:" />
      </Explainer>
    </Card>
  )
}

/* ---------- 7. En çok örtüşen kümeler ---------- */

export function TopClusters({ results }) {
  return (
    <section aria-label={tr.report.clustersTitle} className="clusters-section">
      <p className="lead-sm">{tr.report.clustersLeadShort}</p>
      <Explainer label={tr.report.methodNote}>
        <p>{tr.report.clustersLead}</p>
        <p className="hint">{tr.report.clustersFormula}</p>
      </Explainer>

      <div className="cluster-list">
        {results.topClusters.map((scored, i) => (
          <ClusterCard key={scored.id} scored={scored} rank={i + 1} />
        ))}
      </div>
    </section>
  )
}

/* ---------- 8. Diğer kümeler ---------- */

export function OtherClusters({ results }) {
  return (
    <Card as="section" aria-labelledby="h-rest">
      <h3 id="h-rest">{tr.report.otherClustersTitle}</h3>
      <p className="lead-sm">{tr.report.otherClustersLeadShort}</p>

      <div className="bars bars-tight">
        {results.restClusters.map((scored) => (
          <details key={scored.id} className="mini-cluster">
            <summary>
              <span className="mini-name">{scored.cluster.name}</span>
              <span className="mini-track" aria-hidden="true">
                <span className="mini-fill" style={{ width: `${scored.pct}%` }} />
              </span>
              <span className="mini-value">%{scored.pct}</span>
            </summary>
            <div className="mini-body">
              <p>{scored.cluster.tagline}</p>
              <p className="cluster-note">{scored.cluster.note}</p>
              <SourceTrail ids={scored.cluster.noteSources} label="Kaynaklar:" />
              <ul className="job-list job-list-compact">
                {scored.cluster.jobs.map((job) => (
                  <li key={job.en}>
                    <p className="job-name">{job.name}</p>
                    <div className="job-badge-row">
                      <span className="job-badge">{job.badge}</span>
                      <SourceBadge id={job.source} compact />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </Card>
  )
}

/* ---------- 9. YZ merceği ---------- */

export function AiLens({ results }) {
  const groups = {
    yuksek_direnc: { title: tr.report.aiLensHigh, note: tr.report.aiLensHighNote, items: [] },
    orta: { title: tr.report.aiLensMedium, note: tr.report.aiLensMediumNote, items: [] },
    karisik: { title: tr.report.aiLensMixed, note: tr.report.aiLensMixedNote, items: [] },
  }

  for (const scored of results.clusters) {
    groups[scored.cluster.aiPosture.level]?.items.push(scored)
  }

  return (
    <Card as="section" aria-labelledby="h-ai">
      <h3 id="h-ai">
        <Bot size={18} aria-hidden="true" /> {tr.report.aiLensTitle}
      </h3>
      <p className="lead-sm">{tr.report.aiLensLeadShort}</p>
      <Explainer label={tr.report.howToRead}>
        <p>{tr.report.aiLensLead}</p>
      </Explainer>

      <div className="ai-lens">
        {Object.entries(groups).map(([level, group]) => (
          <div key={level} className={`ai-col ai-${level}`}>
            <h4>{group.title}</h4>
            <p className="hint">{group.note}</p>
            <ul>
              {group.items.map((scored) => (
                <li key={scored.id}>
                  <Explainer label={scored.cluster.name} className="explainer-plain">
                    <p>{scored.cluster.aiPosture.note}</p>
                    <SourceTrail ids={[scored.cluster.aiPosture.source]} />
                  </Explainer>
                  <span className="ai-col-pct">%{scored.pct}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* ---------- 11. Kaynaklar ve künye ---------- */

export function SourcesSection({ results }) {
  const usedSources = collectUsedSources(results.clusters.map((c) => c.cluster))
  const frameworks = measurementFrameworks()
  const editorial = editorialFields()

  return (
    <Card as="section" aria-labelledby="h-sources" className="sources-section">
      <h3 id="h-sources">{tr.report.sourcesTitle}</h3>
      <p className="lead-sm">{tr.report.sourcesLead}</p>

      <h4>{tr.report.sourcesUsedTitle}</h4>
      {/* Kaynakların KİM olduğu açıkta: rozet şeridi tek bakışta okunur ve her rozet
          kendi tam künyesini tek tıkla açar. Aşağıdaki blok hepsinin uzun hâlidir. */}
      <p className="hint">{tr.report.sourcesGlance(usedSources.length)}</p>
      <SourceTrail ids={usedSources} />

      <Explainer label={tr.report.sourcesFull(usedSources.length)} className="explainer-wide">
        <SourceRegistry ids={usedSources} />
      </Explainer>

      <Explainer label={tr.report.frameworksTitle} className="explainer-wide">
        <p className="hint">{tr.report.frameworksLead}</p>
        <ul className="framework-list">
          {frameworks.map((f) => (
            <li key={f.label}>
              <strong>{f.label}:</strong>
              <ul>
                {f.frameworks.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Explainer>

      <Explainer label={tr.report.editorialTitle} className="explainer-wide">
        <p className="hint">{tr.report.editorialLead}</p>
        <ul className="editorial-list">
          {editorial.map((e) => (
            <li key={`${e.scope}-${e.field}`}>
              <EditorialBadge /> <strong>{e.scope}</strong> — <code>{e.field}</code>: {e.note}
            </li>
          ))}
        </ul>
      </Explainer>

      <h4>{tr.report.disclaimerTitle}</h4>
      <p className="disclaimer">{DATA.clusters._attribution.disclaimer}</p>
      <ol className="limits-list">
        <li>Bu test bir hüküm değil, bir keşif haritasıdır.</li>
        <li>İlgi ile yetenek aynı şey değildir; bu envanter yetenek ölçmez.</li>
        <li>
          Meslek verileri ağırlıklı olarak küresel ve ABD kaynaklıdır; Türkiye iş piyasası farklı
          seyredebilir.
        </li>
        <li>Projeksiyonlar tahmindir: WEF ve BLS aynı mesleğe farklı yönler atfedebilir.</li>
        <li>İlgi profili birkaç yılda değişebilir — testi bir yıl sonra tekrar çöz.</li>
      </ol>

      <p className="hint">{tr.report.dataUpdated(dataUpdatedAt())}</p>
    </Card>
  )
}
