import React from 'react'
import { SurveyProvider, useSurvey } from './state/SurveyContext.jsx'
import { tr } from './i18n/tr.js'
import { SiteHeader, TopBar, SurveyNav, useFocusOnStep } from './components/survey/SurveyShell.jsx'
import { FIRST_QUESTION_STEP } from './state/steps.js'
import { Landing } from './components/landing/Landing.jsx'
import {
  LikertSection,
  ScenariosSection,
  FlowSection,
  WorkstyleSection,
  ValuesSection,
  ConfidenceSection,
  InterestsSection,
  OpenSection,
} from './components/survey/Sections.jsx'
import { Report } from './components/report/Report.jsx'

function Screen() {
  const { state, dispatch, step, progress, results, reset } = useSurvey()
  const { answers } = state
  useFocusOnStep(step.id)

  const confirmReset = () => {
    if (window.confirm(tr.actions.resetConfirm)) reset()
  }

  const body = (() => {
    switch (step.kind) {
      case 'intro':
        return (
          <Landing
            hasProgress={progress > 0}
            progress={progress}
            onStart={() => dispatch({ type: 'GOTO', step: FIRST_QUESTION_STEP })}
            onResume={() => dispatch({ type: 'NEXT' })}
            onReset={confirmReset}
          />
        )
      case 'likert':
        return <LikertSection step={step} answers={answers} dispatch={dispatch} />
      case 'scenarios':
        return <ScenariosSection answers={answers} dispatch={dispatch} />
      case 'flow':
        return <FlowSection answers={answers} dispatch={dispatch} />
      case 'workstyle':
        return <WorkstyleSection answers={answers} dispatch={dispatch} />
      case 'values':
        return <ValuesSection answers={answers} dispatch={dispatch} />
      case 'confidence':
        return <ConfidenceSection answers={answers} dispatch={dispatch} />
      case 'interests':
        return <InterestsSection answers={answers} dispatch={dispatch} />
      case 'open':
        return <OpenSection answers={answers} dispatch={dispatch} />
      case 'report':
        return <Report results={results} state={state} dispatch={dispatch} onReset={confirmReset} />
      default:
        return null
    }
  })()

  const showNav = step.kind !== 'intro' && step.kind !== 'report'

  return (
    <>
      <a className="skip-link" href="#main">
        {tr.app.skipToContent}
      </a>
      {step.kind === 'intro' ? (
        <SiteHeader
          hasProgress={progress > 0}
          onStart={() => dispatch({ type: 'GOTO', step: FIRST_QUESTION_STEP })}
          onResume={() => dispatch({ type: 'NEXT' })}
          onReset={confirmReset}
        />
      ) : (
        <TopBar
          progress={progress}
          saveStatus={state.saveStatus}
          answers={answers}
          currentStep={state.step}
          onJump={(step) => dispatch({ type: 'GOTO', step })}
          onReset={confirmReset}
        />
      )}
      <main id="main" className={`page page-${step.kind}`}>
        {body}
        {showNav ? <SurveyNav stepIndex={state.step} dispatch={dispatch} /> : null}
      </main>
    </>
  )
}

export default function App() {
  return (
    <SurveyProvider>
      <Screen />
    </SurveyProvider>
  )
}
