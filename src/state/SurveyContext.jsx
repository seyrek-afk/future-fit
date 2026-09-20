/* Tek Context — durum ve dispatch tüm ağaca buradan iner.
 *
 * Yan etkiler (localStorage, tema, URL hash) burada toplanır; reducer saf kalır.
 */

import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { DATA } from '../data/index.js'
import { surveyReducer, initialState } from './surveyReducer.js'
import { loadState, saveState, clearState, storageAvailable } from './storage.js'
import { readAnswersFromHash } from './shareLink.js'
import { progressPercent, STEPS, REPORT_STEP } from './steps.js'
import { computeAll } from '../scoring/index.js'

const SurveyContext = createContext(null)

export function SurveyProvider({ children }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState)
  const firstRun = useRef(true)

  // Açılış: önce paylaşım bağlantısı, yoksa localStorage.
  useEffect(() => {
    const shared = readAnswersFromHash(window.location.hash, DATA)
    if (shared) {
      dispatch({ type: 'LOAD_SHARED', answers: shared })
      return
    }
    const stored = loadState()
    if (stored) dispatch({ type: 'HYDRATE', state: stored })
    else dispatch({ type: 'MARK_HYDRATED' })
    if (!storageAvailable()) dispatch({ type: 'SAVE_STATUS', value: 'unavailable' })
  }, [])

  // Her değişiklikte otomatik kayıt. Paylaşılan bir bağlantıyı izlerken kayıt yapılmaz:
  // başkasının cevapları kullanıcının kendi oturumunun üzerine yazmamalı.
  useEffect(() => {
    if (!state.hydrated || state.fromSharedLink) return
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    if (state.saveStatus === 'unavailable') return
    const ok = saveState({
      answers: state.answers,
      step: state.step,
      name: state.name,
    })
    dispatch({ type: 'SAVE_STATUS', value: ok ? 'saved' : 'unavailable' })
  }, [state.answers, state.step, state.name, state.hydrated, state.fromSharedLink])

  // Adım değiştiğinde odağı başlığa taşı — klavye ve ekran okuyucu kullanıcıları için.
  useEffect(() => {
    if (!state.hydrated) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [state.step, state.hydrated])

  const value = useMemo(() => {
    const step = STEPS[state.step]
    return {
      state,
      dispatch,
      step,
      isReport: state.step === REPORT_STEP,
      progress: progressPercent(state.answers),
      /** Skorlar yalnızca burada, saf fonksiyonlarla hesaplanır (CLAUDE.md kural 3). */
      results: state.step === REPORT_STEP ? computeAll(state.answers, DATA) : null,
      reset: () => {
        clearState()
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search)
        }
        dispatch({ type: 'RESET' })
      },
    }
  }, [state])

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
}

export function useSurvey() {
  const ctx = useContext(SurveyContext)
  if (!ctx) throw new Error('useSurvey yalnızca SurveyProvider içinde kullanılabilir')
  return ctx
}
