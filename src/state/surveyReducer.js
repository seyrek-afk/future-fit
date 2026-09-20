/* Tek reducer — uygulamanın bütün durumu burada.
 *
 * Harici state kütüphanesi yok (PRD §7). Reducer saf bir fonksiyondur: yan etki (localStorage,
 * URL) Provider tarafındaki effect'lerde yapılır, burada değil.
 */

import { DATA } from '../data/index.js'
import { createEmptyAnswers, canonicalizeAnswers, normalizeAnswers } from './answers.js'
import { STEPS, REPORT_STEP } from './steps.js'

export const initialState = {
  step: 0,
  answers: createEmptyAnswers(),
  /** İsteğe bağlı isim — yalnızca localStorage'da, paylaşım bağlantısına ve döküme girmez. */
  name: '',
  /** Kaydetme durumu: 'idle' | 'saved' | 'unavailable' */
  saveStatus: 'idle',
  /** Cevaplar bir paylaşım bağlantısından geldiyse true. */
  fromSharedLink: false,
  /** Açılışta kaldığı yerden devam teklifi yapıldı mı? */
  hydrated: false,
}

const clampStep = (n) => Math.min(Math.max(n, 0), STEPS.length - 1)

export function surveyReducer(state, action) {
  switch (action.type) {
    /* ---- gezinme ---- */
    case 'GOTO':
      return { ...state, step: clampStep(action.step) }
    case 'NEXT':
      return { ...state, step: clampStep(state.step + 1) }
    case 'PREV':
      return { ...state, step: clampStep(state.step - 1) }
    case 'GOTO_REPORT':
      return { ...state, step: REPORT_STEP }

    /* ---- cevaplar ---- */
    case 'SET_LIKERT':
      return patchAnswers(state, { likert: { ...state.answers.likert, [action.id]: action.value } })

    case 'SET_SCENARIO':
      return patchAnswers(state, {
        scenarios: { ...state.answers.scenarios, [action.id]: action.value },
      })

    case 'TOGGLE_FLOW': {
      const current = state.answers.flow[action.id] || []
      const has = current.includes(action.index)
      let next
      if (has) {
        next = current.filter((i) => i !== action.index)
      } else if (current.length >= action.max) {
        return state // sınır dolu — sessizce yok say, arayüz zaten devre dışı gösterir
      } else {
        next = [...current, action.index].sort((x, y) => x - y)
      }
      return patchAnswers(state, { flow: { ...state.answers.flow, [action.id]: next } })
    }

    case 'SET_PREDIGER':
      return patchAnswers(state, {
        prediger: { ...state.answers.prediger, [action.id]: action.value },
      })

    case 'SET_ENV':
      return patchAnswers(state, { env: { ...state.answers.env, [action.id]: action.value } })

    case 'SET_VALUES':
      return patchAnswers(state, { values: action.order })

    case 'MOVE_VALUE': {
      const order = valueOrder(state.answers.values)
      const from = order.indexOf(action.id)
      const to = from + action.delta
      if (from < 0 || to < 0 || to >= order.length) return state
      const next = [...order]
      ;[next[from], next[to]] = [next[to], next[from]]
      return patchAnswers(state, { values: next })
    }

    case 'REORDER_VALUES': {
      const order = valueOrder(state.answers.values)
      const from = order.indexOf(action.id)
      if (from < 0 || action.to < 0 || action.to >= order.length) return state
      const next = [...order]
      next.splice(from, 1)
      next.splice(action.to, 0, action.id)
      return patchAnswers(state, { values: next })
    }

    case 'SET_CONF':
      return patchAnswers(state, { conf: { ...state.answers.conf, [action.id]: action.value } })

    case 'TOGGLE_PROBLEM':
      return patchAnswers(state, { problems: toggle(state.answers.problems, action.id) })

    case 'TOGGLE_TECH':
      return patchAnswers(state, { techs: toggle(state.answers.techs, action.id) })

    case 'SET_OPEN':
      return patchAnswers(state, { open: { ...state.answers.open, [action.id]: action.value } })

    /* ---- meta ---- */
    case 'SET_NAME':
      return { ...state, name: action.value }

    case 'SAVE_STATUS':
      return { ...state, saveStatus: action.value }

    case 'HYDRATE': {
      // Eski kayıtlarda tema alanı olabilir; tek temaya geçtiğimiz için yok sayılır.
      const { theme: _ignoredTheme, version: _v, savedAt: _s, ...stored } = action.state || {}
      return {
        ...state,
        ...stored,
        answers: canonicalizeAnswers(normalizeAnswers(action.state?.answers), DATA),
        step: clampStep(action.state?.step ?? state.step),
        hydrated: true,
      }
    }

    case 'LOAD_SHARED':
      return {
        ...state,
        answers: canonicalizeAnswers(normalizeAnswers(action.answers), DATA),
        step: REPORT_STEP,
        fromSharedLink: true,
        hydrated: true,
      }

    case 'MARK_HYDRATED':
      return { ...state, hydrated: true }

    case 'RESET':
      return { ...initialState, hydrated: true, saveStatus: state.saveStatus }

    default:
      return state
  }
}

/* ---- yardımcılar ---- */

function patchAnswers(state, patch) {
  return { ...state, answers: { ...state.answers, ...patch } }
}

function toggle(list, id) {
  const set = new Set(list)
  set.has(id) ? set.delete(id) : set.add(id)
  // Kanonik sıra: veri dosyasının sırası (bkz. canonicalizeAnswers).
  const source = DATA.interests.problems.some((p) => p.id === id)
    ? DATA.interests.problems
    : DATA.interests.techs
  return source.map((x) => x.id).filter((x) => set.has(x))
}

/** Kullanıcı henüz sıralamadıysa dosya sırasını başlangıç kabul et. */
export function valueOrder(values) {
  const all = DATA.values.values.map((v) => v.id)
  if (!Array.isArray(values) || values.length !== all.length) return all
  return values
}
