/* Üst çubuk + gezinme kabuğu.
 *
 * Üst çubukta her zaman: genel ilerleme yüzdesi, altında 8 bölümün tamamlanma şeridi,
 * "kaydedildi" göstergesi ve sonuçları silme düğmesi (PRD §4, METHODOLOGY §8).
 * Tema anahtarı yoktur — uygulama tek temalıdır.
 */

import React, { useEffect, useRef } from 'react'
import { Trash2, Check, CloudOff, ArrowLeft, ArrowRight } from 'lucide-react'
import { tr } from '../../i18n/tr.js'
import { Button } from '../ui/primitives.jsx'
import { SectionStrip } from './SectionStrip.jsx'
import { STEPS, SECTION_COUNT, REPORT_STEP } from '../../state/steps.js'

export function TopBar({ progress, saveStatus, answers, currentStep, onJump, onReset, showStrip }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <span className="brand">
          {tr.app.title}
          <span className="brand-sub">{tr.app.subtitle}</span>
        </span>

        <div className="topbar-progress">
          <span className="visually-hidden">{tr.nav.progressLabel(progress)}</span>
          <progress className="progress" max="100" value={progress} aria-hidden="true" />
          <span className="progress-num" aria-hidden="true">
            %{progress}
          </span>
        </div>

        <span className={`save-state save-${saveStatus}`} role="status" aria-live="polite">
          {saveStatus === 'unavailable' ? (
            <>
              <CloudOff size={14} aria-hidden="true" />
              <span>{tr.nav.saveFailed}</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check size={14} aria-hidden="true" />
              <span>{tr.nav.saved}</span>
            </>
          ) : null}
        </span>

        <button type="button" className="icon-btn icon-btn-danger" onClick={onReset} title={tr.actions.reset}>
          <Trash2 size={18} aria-hidden="true" />
          <span className="visually-hidden">{tr.actions.reset}</span>
        </button>
      </div>

      {showStrip ? (
        <div className="topbar-strip">
          <SectionStrip answers={answers} currentStep={currentStep} onJump={onJump} />
        </div>
      ) : null}
    </header>
  )
}

export function SurveyNav({ stepIndex, dispatch }) {
  const isLastQuestion = stepIndex === REPORT_STEP - 1
  return (
    <nav className="survey-nav" aria-label={tr.nav.progress}>
      <Button variant="ghost" onClick={() => dispatch({ type: 'PREV' })} disabled={stepIndex === 0}>
        <ArrowLeft size={18} aria-hidden="true" /> {tr.nav.back}
      </Button>
      <span className="survey-nav-step">
        {tr.nav.stepOf(Math.min(STEPS[stepIndex].section, SECTION_COUNT), SECTION_COUNT)}
      </span>
      <Button onClick={() => dispatch({ type: 'NEXT' })}>
        {isLastQuestion ? tr.nav.finish : tr.nav.next} <ArrowRight size={18} aria-hidden="true" />
      </Button>
    </nav>
  )
}

/** Adım değiştiğinde odağı bölüm başlığına taşır. */
export function useFocusOnStep(stepId) {
  const previous = useRef(stepId)
  useEffect(() => {
    if (previous.current === stepId) return
    previous.current = stepId
    const heading = document.getElementById('section-heading')
    if (heading) heading.focus({ preventScroll: true })
  }, [stepId])
}
