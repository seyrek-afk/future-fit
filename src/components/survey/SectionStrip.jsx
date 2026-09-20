/* Üst çubuktaki bölüm şeridi — 8 bölümün tamamlanma durumu.
 *
 * Zorunlu alan olmadığı için "tamam" bir kapı değil, bir yön duygusu: kullanıcı hangi bölümü
 * yarım bıraktığını görüp oraya tek dokunuşla dönebilsin diye her segment bir düğmedir.
 */

import React from 'react'
import { tr } from '../../i18n/tr.js'
import { sectionProgress } from '../../state/steps.js'

const STATE_LABEL = {
  done: tr.nav.sectionStateDone,
  partial: tr.nav.sectionStatePartial,
  empty: tr.nav.sectionStateEmpty,
}

export function SectionStrip({ answers, currentStep, onJump }) {
  const sections = sectionProgress(answers)

  return (
    <nav className="section-strip" aria-label={tr.nav.sectionStripLabel}>
      {sections.map((s) => {
        const title = tr.sections[s.key].title
        const active = currentStep === s.step || (s.key === 'likert' && isLikertStep(currentStep))
        return (
          <button
            key={s.key}
            type="button"
            className={`strip-item strip-${s.state} ${active ? 'strip-active' : ''}`.trim()}
            onClick={() => onJump(s.step)}
            aria-current={active ? 'step' : undefined}
            title={`${tr.nav.sectionStatus(s.n, title, s.answered, s.total)} (${STATE_LABEL[s.state]})`}
          >
            <span className="strip-fill" style={{ width: `${s.pct}%` }} aria-hidden="true" />
            <span className="strip-text">
              <span className="strip-n" aria-hidden="true">
                {s.n}
              </span>
              <span className="strip-name">{tr.sections[s.key].short}</span>
            </span>
            <span className="visually-hidden">
              {tr.nav.sectionStatus(s.n, title, s.answered, s.total)}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

/** İlgi bölümü 6 sayfaya yayıldığı için hepsini tek segment olarak işaretle. */
function isLikertStep(step) {
  return step >= 1 && step <= 6
}
