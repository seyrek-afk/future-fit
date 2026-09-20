/* Anket bölümleri — docs/PRD.md §4'teki 8 bölüm.
 *
 * Her bölüm tek bir ekrandır ve başında "bu bölüm neyi ölçüyor" cümlesi bulunur.
 * Hiçbir alan zorunlu değildir; boş bırakılan maddeler skorlamada maksimum tabanından düşülür.
 */

import React from 'react'
import { DATA } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'
import { SectionHeading, ToggleChip } from '../ui/primitives.jsx'
import { LikertRow, ChoiceList, MultiChoice, BinaryChoice, ScaleRow } from './inputs.jsx'
import { ValuesRanking } from './ValuesRanking.jsx'
import { LIKERT_PAGES } from '../../state/steps.js'

export function LikertSection({ step, answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        number={tr.sections.likert.pageOf(step.page + 1, LIKERT_PAGES)}
        title={tr.sections.likert.title}
        about={tr.sections.likert.about}
      >
        <p className="section-instruction">{tr.sections.likert.instruction}</p>
        {/* Ölçek anahtarı: dar ekranda seçenek etiketleri görsel olarak gizlendiği için
            1-5'in anlamı burada her zaman okunur kalır. Uçlar veri dosyasından gelir. */}
        <p className="scale-key" aria-hidden="true">
          <span>
            <b>1</b> {DATA.riasec.likertLabels[0]}
          </span>
          <span>
            <b>{DATA.riasec.likertLabels.length}</b>{' '}
            {DATA.riasec.likertLabels[DATA.riasec.likertLabels.length - 1]}
          </span>
        </p>
      </SectionHeading>

      <div className="stack">
        {step.items.map((item) => (
          <LikertRow
            key={item.id}
            id={item.id}
            text={item.text}
            labels={DATA.riasec.likertLabels}
            value={answers.likert[item.id]}
            onChange={(value) => dispatch({ type: 'SET_LIKERT', id: item.id, value })}
          />
        ))}
      </div>
    </>
  )
}

export function ScenariosSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.scenarios.title}
        about={tr.sections.scenarios.about}
      >
        <p className="section-instruction">{tr.sections.scenarios.instruction}</p>
      </SectionHeading>

      <div className="stack">
        {DATA.riasec.scenarios.map((sc) => (
          <ChoiceList
            key={sc.id}
            name={`scenario-${sc.id}`}
            question={sc.q}
            options={sc.opts}
            value={answers.scenarios[sc.id]}
            onChange={(value) => dispatch({ type: 'SET_SCENARIO', id: sc.id, value })}
          />
        ))}
      </div>
    </>
  )
}

export function FlowSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.flow.title}
        about={tr.sections.flow.about}
      />

      <div className="stack">
        {DATA.riasec.flow.map((q) => {
          const selected = answers.flow[q.id] || []
          return (
            <MultiChoice
              key={q.id}
              name={`flow-${q.id}`}
              question={q.q}
              options={q.opts}
              selected={selected}
              max={q.max}
              statusText={`${tr.sections.flow.instruction(q.max)} ${tr.sections.flow.remaining(
                q.max - selected.length,
              )}.`}
              onToggle={(index) => dispatch({ type: 'TOGGLE_FLOW', id: q.id, index, max: q.max })}
            />
          )
        })}
      </div>
    </>
  )
}

export function WorkstyleSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.workstyle.title}
        about={tr.sections.workstyle.about}
      />

      <h3>{tr.sections.workstyle.predigerTitle}</h3>
      <p className="section-instruction">{tr.sections.workstyle.predigerAbout}</p>
      <div className="stack">
        {DATA.workstyle.prediger.map((item) => (
          <BinaryChoice
            key={item.id}
            name={`prediger-${item.id}`}
            question={item.q}
            a={item.a.text}
            b={item.b.text}
            value={answers.prediger[item.id]}
            onChange={(value) => dispatch({ type: 'SET_PREDIGER', id: item.id, value })}
          />
        ))}
      </div>

      <h3 className="mt-6">{tr.sections.workstyle.environmentTitle}</h3>
      <p className="section-instruction">{tr.sections.workstyle.environmentAbout}</p>
      <div className="stack">
        {DATA.workstyle.environment.map((item) => (
          <BinaryChoice
            key={item.id}
            name={`env-${item.id}`}
            question={item.q}
            a={item.a}
            b={item.b}
            value={answers.env[item.id]}
            onChange={(value) => dispatch({ type: 'SET_ENV', id: item.id, value })}
          />
        ))}
      </div>
    </>
  )
}

export function ValuesSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.values.title}
        about={tr.sections.values.about}
      >
        <p className="section-instruction">{tr.sections.values.instruction}</p>
      </SectionHeading>
      <ValuesRanking answers={answers} dispatch={dispatch} />
    </>
  )
}

export function ConfidenceSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.confidence.title}
        about={tr.sections.confidence.about}
      >
        <p className="section-instruction">{tr.sections.confidence.instruction}</p>
      </SectionHeading>

      <div className="stack">
        {DATA.confidence.items.map((item) => (
          <ScaleRow
            key={item.id}
            id={item.id}
            text={item.text}
            value={answers.conf[item.id]}
            lowLabel={tr.sections.confidence.scaleLow}
            highLabel={tr.sections.confidence.scaleHigh}
            onChange={(value) => dispatch({ type: 'SET_CONF', id: item.id, value })}
          />
        ))}
      </div>
    </>
  )
}

export function InterestsSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.interests.title}
        about={tr.sections.interests.about}
      />

      <h3>{tr.sections.interests.problemsTitle}</h3>
      <p className="section-instruction">
        {tr.sections.interests.multiHint} · {tr.sections.interests.selectedCount(answers.problems.length)}
      </p>
      <div className="chip-grid">
        {DATA.interests.problems.map((p) => (
          <ToggleChip
            key={p.id}
            name="problems"
            checked={answers.problems.includes(p.id)}
            onChange={() => dispatch({ type: 'TOGGLE_PROBLEM', id: p.id })}
          >
            {p.text}
          </ToggleChip>
        ))}
      </div>

      <h3 className="mt-6">{tr.sections.interests.techsTitle}</h3>
      <p className="section-instruction">
        {tr.sections.interests.multiHint} · {tr.sections.interests.selectedCount(answers.techs.length)}
      </p>
      <div className="chip-grid">
        {DATA.interests.techs.map((t) => (
          <ToggleChip
            key={t.id}
            name="techs"
            checked={answers.techs.includes(t.id)}
            onChange={() => dispatch({ type: 'TOGGLE_TECH', id: t.id })}
          >
            {t.text}
          </ToggleChip>
        ))}
      </div>
    </>
  )
}

export function OpenSection({ answers, dispatch }) {
  return (
    <>
      <SectionHeading
        id="section-heading"
        title={tr.sections.open.title}
        about={tr.sections.open.about}
      />

      <div className="stack">
        {DATA.openQuestions.questions.map((q) => {
          const value = answers.open[q.id] || ''
          return (
            <div className="open-item" key={q.id}>
              <label className="choice-question" htmlFor={`open-${q.id}`}>
                {q.q}
              </label>
              <textarea
                id={`open-${q.id}`}
                rows={4}
                value={value}
                placeholder={tr.sections.open.placeholder}
                onChange={(e) => dispatch({ type: 'SET_OPEN', id: q.id, value: e.target.value })}
              />
              <p className="hint hint-right">{tr.sections.open.charCount(value.length)}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}
