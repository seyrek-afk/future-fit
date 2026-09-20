/* Akış adımları — docs/PRD.md §4.
 *
 * 8 bölüm. İlgi bölümü 6 sayfaya bölünür (her sayfada 6 madde), böylece telefonda
 * bir ekranda kaydırmadan bitirilebilir.
 */

import { DATA } from '../data/index.js'

export const LIKERT_PER_PAGE = 6
export const LIKERT_PAGES = Math.ceil(DATA.riasec.likert.length / LIKERT_PER_PAGE)

/** Toplam bölüm sayısı (giriş ve rapor hariç) — üst çubuktaki "Bölüm x / y" için. */
export const SECTION_COUNT = 8

const likertSteps = Array.from({ length: LIKERT_PAGES }, (_, page) => ({
  id: `likert-${page + 1}`,
  kind: 'likert',
  section: 1,
  page,
  items: DATA.riasec.likert.slice(page * LIKERT_PER_PAGE, (page + 1) * LIKERT_PER_PAGE),
}))

export const STEPS = [
  { id: 'intro', kind: 'intro', section: 0 },
  ...likertSteps,
  { id: 'scenarios', kind: 'scenarios', section: 2 },
  { id: 'flow', kind: 'flow', section: 3 },
  { id: 'workstyle', kind: 'workstyle', section: 4 },
  { id: 'values', kind: 'values', section: 5 },
  { id: 'confidence', kind: 'confidence', section: 6 },
  { id: 'interests', kind: 'interests', section: 7 },
  { id: 'open', kind: 'open', section: 8 },
  { id: 'report', kind: 'report', section: 9 },
]

export const FIRST_QUESTION_STEP = 1
export const REPORT_STEP = STEPS.length - 1

export const stepById = (id) => STEPS.findIndex((s) => s.id === id)

/**
 * Üst çubuktaki bölüm şeridi — 8 bölümün her birinin tamamlanma durumu.
 *
 * `total` o bölümde cevaplanabilecek madde sayısıdır. Zorunlu alan olmadığı için
 * "tamam" bir kapı değil, yalnızca bir göstergedir: kullanıcı istediği an ilerleyebilir.
 */
export const SECTIONS = [
  {
    n: 1,
    key: 'likert',
    stepId: 'likert-1',
    total: DATA.riasec.likert.length,
    count: (a) => countIf(a.likert, isNum),
  },
  {
    n: 2,
    key: 'scenarios',
    stepId: 'scenarios',
    total: DATA.riasec.scenarios.length,
    count: (a) => countIf(a.scenarios, isNum),
  },
  {
    n: 3,
    key: 'flow',
    stepId: 'flow',
    total: DATA.riasec.flow.length,
    count: (a) => countIf(a.flow, (v) => Array.isArray(v) && v.length > 0),
  },
  {
    n: 4,
    key: 'workstyle',
    stepId: 'workstyle',
    total: DATA.workstyle.prediger.length + DATA.workstyle.environment.length,
    count: (a) => countIf(a.prediger, Boolean) + countIf(a.env, Boolean),
  },
  {
    n: 5,
    key: 'values',
    stepId: 'values',
    total: 1,
    count: (a) => (Array.isArray(a.values) && a.values.length === DATA.values.values.length ? 1 : 0),
  },
  {
    n: 6,
    key: 'confidence',
    stepId: 'confidence',
    total: DATA.confidence.items.length,
    count: (a) => countIf(a.conf, isNum),
  },
  {
    n: 7,
    key: 'interests',
    stepId: 'interests',
    total: 2,
    count: (a) => (a.problems?.length ? 1 : 0) + (a.techs?.length ? 1 : 0),
  },
  {
    n: 8,
    key: 'open',
    stepId: 'open',
    total: DATA.openQuestions.questions.length,
    count: (a) => countIf(a.open, (v) => typeof v === 'string' && v.trim().length > 0),
  },
]

/** Her bölümün cevaplanan/toplam durumu ve o bölüme atlamak için adım indeksi. */
export function sectionProgress(answers) {
  const a = answers || {}
  return SECTIONS.map((s) => {
    const answered = s.count(a)
    return {
      n: s.n,
      key: s.key,
      step: stepById(s.stepId),
      answered,
      total: s.total,
      pct: s.total ? Math.round((100 * answered) / s.total) : 0,
      state: answered === 0 ? 'empty' : answered >= s.total ? 'done' : 'partial',
    }
  })
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

function countIf(record, predicate) {
  if (!record || typeof record !== 'object') return 0
  return Object.values(record).filter(predicate).length
}

/** Kaç maddenin cevaplandığına göre ilerleme yüzdesi (0-100). */
export function progressPercent(answers) {
  const a = answers || {}
  const total =
    DATA.riasec.likert.length +
    DATA.riasec.scenarios.length +
    DATA.riasec.flow.length +
    DATA.workstyle.prediger.length +
    DATA.workstyle.environment.length +
    1 + // değer sıralaması tek bir madde sayılır
    DATA.confidence.items.length +
    1 + // sorunlar
    1 + // teknolojiler
    DATA.openQuestions.questions.length

  const answered =
    countIf(a.likert, isNum) +
    countIf(a.scenarios, isNum) +
    countIf(a.flow, (v) => Array.isArray(v) && v.length > 0) +
    countIf(a.prediger, Boolean) +
    countIf(a.env, Boolean) +
    (Array.isArray(a.values) && a.values.length === DATA.values.values.length ? 1 : 0) +
    countIf(a.conf, isNum) +
    (Array.isArray(a.problems) && a.problems.length > 0 ? 1 : 0) +
    (Array.isArray(a.techs) && a.techs.length > 0 ? 1 : 0) +
    countIf(a.open, (v) => typeof v === 'string' && v.trim().length > 0)

  return Math.round((100 * answered) / total)
}

