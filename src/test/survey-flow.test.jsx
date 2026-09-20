/* Anket akışı: reducer davranışı, otomatik kayıt ve kaldığı yerden devam.
 * (PRD §10 "bitti sayılma" ölçütlerinin otomatikleştirilebilen kısmı.)
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { DATA } from '../data/index.js'
import { tr } from '../i18n/tr.js'
import { surveyReducer, initialState, valueOrder } from '../state/surveyReducer.js'
import {
  STEPS,
  REPORT_STEP,
  progressPercent,
  LIKERT_PAGES,
  sectionProgress,
  SECTION_COUNT,
} from '../state/steps.js'
import { loadState, STORAGE_KEY } from '../state/storage.js'
import App from '../App.jsx'

const run = (actions, start = initialState) => actions.reduce(surveyReducer, start)

describe('reducer — cevap yazma', () => {
  it('Likert, senaryo ve öz-yeterlik cevaplarını kaydeder', () => {
    const s = run([
      { type: 'SET_LIKERT', id: 'L1', value: 3 },
      { type: 'SET_SCENARIO', id: 'SC1', value: 2 },
      { type: 'SET_CONF', id: 'c_math', value: 5 },
    ])
    expect(s.answers.likert.L1).toBe(3)
    expect(s.answers.scenarios.SC1).toBe(2)
    expect(s.answers.conf.c_math).toBe(5)
  })

  it('akış seçimleri soru sınırını aşamaz', () => {
    const q = DATA.riasec.flow[2] // max: 2
    let s = initialState
    for (const index of [0, 1, 2]) {
      s = surveyReducer(s, { type: 'TOGGLE_FLOW', id: q.id, index, max: q.max })
    }
    expect(s.answers.flow[q.id]).toHaveLength(q.max)
    expect(s.answers.flow[q.id]).toEqual([0, 1])
  })

  it('akış seçimi tekrar tıklanınca kalkar ve yer açar', () => {
    const q = DATA.riasec.flow[2]
    let s = run([
      { type: 'TOGGLE_FLOW', id: q.id, index: 0, max: q.max },
      { type: 'TOGGLE_FLOW', id: q.id, index: 1, max: q.max },
      { type: 'TOGGLE_FLOW', id: q.id, index: 0, max: q.max },
      { type: 'TOGGLE_FLOW', id: q.id, index: 3, max: q.max },
    ])
    expect(s.answers.flow[q.id]).toEqual([1, 3])
  })

  it('çoklu seçim çipleri veri dosyası sırasında tutulur', () => {
    const s = run([
      { type: 'TOGGLE_PROBLEM', id: 'care' },
      { type: 'TOGGLE_PROBLEM', id: 'climate' },
      { type: 'TOGGLE_PROBLEM', id: 'ai' },
    ])
    expect(s.answers.problems).toEqual(['climate', 'ai', 'care'])
  })

  it('değer sıralaması yalnızca kullanıcı müdahale edince kaydedilir', () => {
    expect(initialState.answers.values).toEqual([])
    // dokunulmadığında gösterilen sıra dosya sırasıdır ama cevap olarak yazılmaz
    expect(valueOrder(initialState.answers.values)).toEqual(DATA.values.values.map((v) => v.id))

    const moved = surveyReducer(initialState, { type: 'MOVE_VALUE', id: 'independence', delta: -1 })
    expect(moved.answers.values[0]).toBe('independence')
    expect(moved.answers.values).toHaveLength(6)
  })

  it('MOVE_VALUE listenin dışına taşımaz', () => {
    const first = DATA.values.values[0].id
    expect(surveyReducer(initialState, { type: 'MOVE_VALUE', id: first, delta: -1 })).toBe(initialState)
  })
})

describe('reducer — gezinme', () => {
  it('adımlar sınırların dışına çıkmaz', () => {
    expect(surveyReducer(initialState, { type: 'PREV' }).step).toBe(0)
    const last = surveyReducer({ ...initialState, step: REPORT_STEP }, { type: 'NEXT' })
    expect(last.step).toBe(REPORT_STEP)
  })

  it('akış PRD §4\'teki 8 bölümü içerir', () => {
    const kinds = STEPS.map((s) => s.kind)
    expect(kinds.filter((k) => k === 'likert')).toHaveLength(LIKERT_PAGES)
    for (const kind of ['scenarios', 'flow', 'workstyle', 'values', 'confidence', 'interests', 'open']) {
      expect(kinds, kind).toContain(kind)
    }
    expect(kinds[0]).toBe('intro')
    expect(kinds[kinds.length - 1]).toBe('report')
  })

  it('RESET tüm cevapları ve adımı sıfırlar', () => {
    const s = run([
      { type: 'SET_LIKERT', id: 'L1', value: 4 },
      { type: 'TOGGLE_TECH', id: 'ai' },
      { type: 'GOTO', step: 5 },
      { type: 'RESET' },
    ])
    expect(s.answers.likert).toEqual({})
    expect(s.answers.techs).toEqual([])
    expect(s.step).toBe(0)
  })

  it('uygulama tek temalıdır — durumda tema alanı yoktur', () => {
    expect(initialState).not.toHaveProperty('theme')
    // Eski bir kayıtta tema alanı varsa yok sayılır, duruma sızmaz.
    const hydrated = surveyReducer(initialState, {
      type: 'HYDRATE',
      state: { version: 2, savedAt: 'x', theme: 'light', step: 3, name: 'A', answers: {} },
    })
    expect(hydrated).not.toHaveProperty('theme')
    expect(hydrated.step).toBe(3)
    expect(hydrated.name).toBe('A')
  })
})

describe('bölüm bazlı tamamlanma şeridi', () => {
  it('sekiz bölümü, her birinin cevaplanan/toplam durumuyla verir', () => {
    const empty = sectionProgress(initialState.answers)
    expect(empty).toHaveLength(SECTION_COUNT)
    expect(empty.map((s) => s.key)).toEqual([
      'likert',
      'scenarios',
      'flow',
      'workstyle',
      'values',
      'confidence',
      'interests',
      'open',
    ])
    expect(empty.every((s) => s.state === 'empty' && s.pct === 0)).toBe(true)
    // her bölüm kendi adımına atlayabilmeli
    expect(empty.every((s) => s.step > 0)).toBe(true)
  })

  it('kısmi ve tam doldurulmuş bölümleri ayırt eder', () => {
    const a = { ...initialState.answers, likert: { L1: 4, L2: 3 } }
    a.scenarios = Object.fromEntries(DATA.riasec.scenarios.map((s) => [s.id, 0]))

    const byKey = Object.fromEntries(sectionProgress(a).map((s) => [s.key, s]))
    expect(byKey.likert.state).toBe('partial')
    expect(byKey.likert.answered).toBe(2)
    expect(byKey.likert.total).toBe(DATA.riasec.likert.length)
    expect(byKey.scenarios.state).toBe('done')
    expect(byKey.scenarios.pct).toBe(100)
    expect(byKey.open.state).toBe('empty')
  })

  it('anket ekranlarında şerit görünür ve bölüme atlatır', async () => {
    const user = userEvent.setup()
    window.localStorage.clear()
    render(<App />)

    // Giriş ekranında şerit yok
    expect(screen.queryByRole('navigation', { name: /Bölümlerin durumu/ })).toBeNull()

    await user.click(screen.getAllByRole('button', { name: /^Başla$/ })[0])
    const strip = screen.getByRole('navigation', { name: /Bölümlerin durumu/ })
    expect(within(strip).getAllByRole('button')).toHaveLength(SECTION_COUNT)

    // 6. bölüme (Kendine güven) atla
    await user.click(within(strip).getByRole('button', { name: /Bölüm 6: Kendine güven/ }))
    expect(screen.getByRole('heading', { name: 'Kendine güven' })).toBeInTheDocument()
  })
})

describe('ilerleme yüzdesi', () => {
  it('boş testte 0, dolu testte 100 olur', () => {
    expect(progressPercent(initialState.answers)).toBe(0)

    const full = { ...initialState.answers }
    full.likert = Object.fromEntries(DATA.riasec.likert.map((i) => [i.id, 2]))
    full.scenarios = Object.fromEntries(DATA.riasec.scenarios.map((s) => [s.id, 0]))
    full.flow = Object.fromEntries(DATA.riasec.flow.map((q) => [q.id, [0]]))
    full.prediger = Object.fromEntries(DATA.workstyle.prediger.map((p) => [p.id, 'a']))
    full.env = Object.fromEntries(DATA.workstyle.environment.map((e) => [e.id, 'a']))
    full.values = DATA.values.values.map((v) => v.id)
    full.conf = Object.fromEntries(DATA.confidence.items.map((c) => [c.id, 3]))
    full.problems = ['ai']
    full.techs = ['ai']
    full.open = Object.fromEntries(DATA.openQuestions.questions.map((q) => [q.id, 'x']))

    expect(progressPercent(full)).toBe(100)
  })
})

describe('arayüz — kayıt ve kaldığı yerden devam', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState(null, '', '/')
  })

  it('cevap verildiğinde localStorage\'a yazar ve yenilemede kaldığı yerden devam eder', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(screen.getAllByRole('button', { name: /^Başla$/ })[0])

    const firstItem = DATA.riasec.likert[0]
    const group = screen.getByRole('radiogroup', { name: firstItem.text })
    await user.click(within(group).getAllByRole('radio')[4])

    const stored = loadState()
    expect(stored.answers.likert[firstItem.id]).toBe(4)
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeTruthy()

    unmount()
    render(<App />)

    // Yenilemede giriş ekranına dönülmez: kullanıcı bıraktığı sayfada, cevabı işaretli bulur.
    const restored = await screen.findByRole('radiogroup', { name: firstItem.text })
    expect(within(restored).getAllByRole('radio')[4]).toBeChecked()
  })

  it('giriş ekranına dönüldüğünde yarım oturum için devam teklifi görünür', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getAllByRole('button', { name: /^Başla$/ })[0])
    const group = screen.getByRole('radiogroup', { name: DATA.riasec.likert[0].text })
    await user.click(within(group).getAllByRole('radio')[3])
    await user.click(screen.getByRole('button', { name: /Geri/ }))

    expect(await screen.findByText(/Yarım kalmış bir oturum bulundu/)).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Kaldığın yerden devam/ })[0]).toBeInTheDocument()
  })

  it('açılış sayfasında gizlilik ve "ne yapmaz" bölümleri görünür', () => {
    render(<App />)
    expect(screen.getByText(/internete hiç bağlanmaz/)).toBeInTheDocument()
    expect(screen.getByText(/Yetenek ölçmez/)).toBeInTheDocument()
    expect(screen.getByText(/Psikometrik bir test değildir/)).toBeInTheDocument()
  })
})

describe('açılış sayfası (landing)', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('dürüstlük sözleşmesinin dört maddesi de açıkta durur', () => {
    render(<App />)
    for (const line of tr.intro.whatItIsNot) {
      expect(screen.getByText(line), line).toBeInTheDocument()
    }
  })

  it('tek bir h1 vardır ve odaklanabilir (adım değişiminde odak buraya taşınır)', () => {
    render(<App />)
    const h1s = document.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0].id).toBe('section-heading')
    expect(h1s[0].tabIndex).toBe(-1)
  })

  it('başlık hiyerarşisi atlamasızdır', () => {
    render(<App />)
    const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => Number(h.tagName[1]))
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `${levels[i - 1]} → ${levels[i]}`).toBeLessThanOrEqual(1)
    }
  })

  it('yarım oturumda devam ve baştan başlama seçenekleri birlikte sunulur', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /^Başla$/ })[0])
    const group = screen.getByRole('radiogroup', { name: DATA.riasec.likert[0].text })
    await user.click(within(group).getAllByRole('radio')[2])
    await user.click(screen.getByRole('button', { name: /Geri/ }))

    expect(screen.getAllByRole('button', { name: /Kaldığın yerden devam/ }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Baştan başla/ })).toBeInTheDocument()
  })

  it('açılış sayfasında hiçbir harici kaynak referansı yoktur', () => {
    render(<App />)
    for (const el of document.querySelectorAll('[src],[href]')) {
      const url = el.getAttribute('src') || el.getAttribute('href')
      expect(url.startsWith('http'), `harici referans: ${url}`).toBe(false)
    }
  })
})
