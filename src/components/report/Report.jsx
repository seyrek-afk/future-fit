/* Rapor — docs/PRD.md §5'teki 11 alt bölüm, üç ana bölüm altında toplanmış.
 *
 *   Başlık (Holland kodu)
 *   İçindekiler
 *   1. Kişisel tanıtım   → İlgi profili · Çalışma tarzı · Değerler · Kendine güven
 *   2. 2030 beceri radarı
 *   3. Profilinle en çok örtüşen meslek kümeleri
 *   Ek bilgiler          → Diğer kümeler · YZ merceği · Sonraki adımlar+çıktılar · Kaynaklar
 *
 * Kaynak izi üç katmanlıdır ve hiçbiri atlanamaz:
 *   a) her rozetin yanında kaynak kısaltması + yılı (açılınca tam künye),
 *   b) küme notunun altında noteSources künyeleri,
 *   c) raporun en altında kullanılan tüm kaynakların tam künyesi + disclaimer + çerçeveler.
 */

import React from 'react'
import { ArrowLeft, Trash2, TrendingUp, Target } from 'lucide-react'
import { tr } from '../../i18n/tr.js'
import { Card, Button, Callout } from '../ui/primitives.jsx'
import {
  ReportHeader,
  InterestProfile,
  WorkStyle,
  ValuesSummary,
  ConfidenceMap,
  SkillsRadar,
  TopClusters,
  OtherClusters,
  AiLens,
  SourcesSection,
} from './sections.jsx'
import { ReportToc, ReportPart, PART_IDS } from './structure.jsx'
import { Summary } from './Summary.jsx'
import { Outputs } from './Outputs.jsx'
import { REPORT_STEP } from '../../state/steps.js'

export function Report({ results, state, dispatch, onReset }) {
  if (!results) return null
  const { answers, name, fromSharedLink } = state

  return (
    <div className="report">
      {fromSharedLink ? (
        <Callout tone="quiet" title="Paylaşılan bağlantı">
          <p>{tr.intro.sharedNote}</p>
          <div className="row-actions no-print">
            <Button variant="ghost" onClick={onReset}>
              <Trash2 size={18} aria-hidden="true" /> Temizle ve kendi testimi çöz
            </Button>
          </div>
        </Callout>
      ) : null}

      <ReportHeader name={name} />

      {/* Sonuç önce: tek bakışta okunan özet, sonra içindekiler, sonra ayrıntı. */}
      <Summary results={results} />

      <ReportToc />

      <ReportPart id={PART_IDS.profile} part={tr.report.parts.profile}>
        <InterestProfile results={results} />
        <WorkStyle results={results} />
        <ValuesSummary results={results} />
        <ConfidenceMap answers={answers} />
      </ReportPart>

      <ReportPart id={PART_IDS.skills} part={tr.report.parts.skills} icon={TrendingUp}>
        <SkillsRadar results={results} />
      </ReportPart>

      <ReportPart id={PART_IDS.clusters} part={tr.report.parts.clusters} icon={Target}>
        <TopClusters results={results} />
      </ReportPart>

      <ReportPart id={PART_IDS.extra} part={tr.report.parts.extra}>
        <OtherClusters results={results} />
        <AiLens results={results} />

        <Card as="section" aria-labelledby="h-next">
          <h3 id="h-next">{tr.report.nextStepsTitle}</h3>
          <ul className="next-steps">
            {tr.report.nextStepsBody.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <Outputs
            answers={answers}
            results={results}
            name={name}
            onNameChange={(value) => dispatch({ type: 'SET_NAME', value })}
          />

          <div className="row-actions no-print">
            <Button variant="ghost" onClick={() => dispatch({ type: 'GOTO', step: REPORT_STEP - 1 })}>
              <ArrowLeft size={18} aria-hidden="true" /> {tr.report.backToSurvey}
            </Button>
            <Button variant="ghost" onClick={onReset}>
              <Trash2 size={18} aria-hidden="true" /> {tr.actions.reset}
            </Button>
          </div>
          <p className="hint no-print">{tr.report.retakeHint}</p>
        </Card>

        <SourcesSection results={results} />
      </ReportPart>
    </div>
  )
}
