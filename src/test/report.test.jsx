/* Rapor sözleşmesi: 11 bölüm, kaynak izi ve dil kuralı.
 *
 * Kaynak izi bu projenin en kritik sözleşmesidir (CLAUDE.md 4-5); bu dosya onu
 * arayüz düzeyinde bağlar: rozet varsa künye de vardır, editoryal alan kaynaklı görünmez.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import React from 'react'

import { DATA, SOURCE_BY_ID } from '../data/index.js'
import { collectUsedSources } from '../data/provenance.js'
import { computeAll } from '../scoring/index.js'
import { Report } from '../components/report/Report.jsx'
import { initialState } from '../state/surveyReducer.js'
import { likertOnly, uniformConfidence, rankValues } from './helpers.js'
import { buildExportText } from '../report/exportText.js'

function richAnswers() {
  const a = rankValues(uniformConfidence(likertOnly('I'), 4), ['achievement', 'independence'])
  a.techs = ['ai', 'biotech']
  a.problems = ['ai', 'health']
  for (const p of DATA.workstyle.prediger) a.prediger[p.id] = 'a'
  for (const e of DATA.workstyle.environment) a.env[e.id] = 'b'
  a.open = { O1: 'Kod yazmak ve okumak', O2: 'Bilgisayar sorunları' }
  return a
}

function renderReport(answers = richAnswers(), extra = {}) {
  const results = computeAll(answers, DATA)
  const state = { ...initialState, answers, hydrated: true, ...extra }
  render(<Report results={results} state={state} dispatch={() => {}} onReset={() => {}} />)
  return { results, answers }
}

describe('rapor — PRD §5\'teki 11 bölüm', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('on bir bölümün hepsi başlıklarıyla bulunur', () => {
    renderReport()
    const headings = [
      /Keşif raporun/, // 1
      /İlgi profilin/, // 2
      /Çalışma tarzın/, // 3
      /^Değerlerin$/, // 4
      /Kendine güven haritan/, // 5
      /2030 beceri radarı/, // 6
      /Profilinle en çok örtüşen meslek kümeleri/, // 7
      /Diğer kümeler/, // 8
      /Yapay zekâ merceği/, // 9
      /Sonraki adımlar/, // 10
      /Kaynaklar ve künye/, // 11
    ]
    for (const name of headings) {
      expect(screen.getByRole('heading', { name }), String(name)).toBeInTheDocument()
    }
  })

  it('üç ana bölüm ve "Ek bilgiler" başlıklarıyla gruplanır', () => {
    renderReport()
    const parts = [...document.querySelectorAll('.report-part')]
    expect(parts.map((p) => p.id)).toEqual([
      'bolum-kisisel',
      'bolum-beceri',
      'bolum-kumeler',
      'bolum-ek',
    ])
    expect(parts[0].querySelector('.part-label').textContent).toBe('1. Bölüm')
    expect(parts[1].querySelector('.part-label').textContent).toBe('2. Bölüm')
    expect(parts[2].querySelector('.part-label').textContent).toBe('3. Bölüm')
    // "Ek bilgiler" numarasızdır
    expect(parts[3].querySelector('.part-label')).toBeNull()
    expect(parts[3].querySelector('h2').textContent).toContain('Ek bilgiler')
  })

  it('kişisel tanıtım bölümü dört alt bölümü kapsar', () => {
    renderReport()
    const part = document.getElementById('bolum-kisisel')
    for (const name of ['İlgi profilin', 'Çalışma tarzın', 'Değerlerin', 'Kendine güven haritan']) {
      expect(part.textContent, name).toContain(name)
    }
    // Beceri radarı ve kümeler bu bölümde DEĞİL
    expect(part.querySelector('.cluster-card')).toBeNull()
  })

  it('en başta içindekiler listesi bulunur ve her ana bölüme bağlanır', () => {
    renderReport()
    const toc = document.querySelector('.report-toc')
    expect(toc).toBeTruthy()
    const hrefs = [...toc.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['#bolum-kisisel', '#bolum-beceri', '#bolum-kumeler', '#bolum-ek'])
    // her bağlantının hedefi gerçekten var
    for (const href of hrefs) expect(document.querySelector(href)).toBeTruthy()
    // içindekiler, rapor başlığından sonra ve ilk ana bölümden önce gelir
    const order = [...document.querySelectorAll('.report > *')].map((el) => el.className)
    expect(order.indexOf('report-toc')).toBeLessThan(order.indexOf('report-part'))
  })

  it('başlık hiyerarşisi atlamasız ilerler (h1 → h2 bölüm → h3 alt bölüm)', () => {
    renderReport()
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5')].map((h) => Number(h.tagName[1]))
    expect(levels[0]).toBe(1)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1], `${levels[i - 1]} → ${levels[i]} atlaması`).toBeLessThanOrEqual(1)
    }
    // Ana bölümlerin hepsi h2
    for (const part of document.querySelectorAll('.part-head h2')) expect(part.tagName).toBe('H2')
  })

  it('ilk 5 küme kart olarak, kalan 8 küme mini liste olarak gösterilir', () => {
    const { results } = renderReport()
    for (const scored of results.topClusters) {
      expect(screen.getByRole('heading', { name: scored.cluster.name })).toBeInTheDocument()
    }
    expect(results.topClusters).toHaveLength(5)
    expect(results.restClusters).toHaveLength(DATA.clusters.clusters.length - 5)
  })

  it('düz profilde keşif modu uyarısı çıkar, belirgin profilde çıkmaz', () => {
    const flat = { ...initialState.answers }
    flat.likert = Object.fromEntries(DATA.riasec.likert.map((i) => [i.id, 2]))
    const { unmount } = render(
      <Report
        results={computeAll(flat, DATA)}
        state={{ ...initialState, answers: flat }}
        dispatch={() => {}}
        onReset={() => {}}
      />,
    )
    expect(screen.getByText(/Keşif modu/)).toBeInTheDocument()
    unmount()

    renderReport()
    expect(screen.queryByText(/Keşif modu/)).toBeNull()
  })
})

describe('rapor — kaynak izi sözleşmesi', () => {
  it('her meslek rozetinin yanında kaynak kısaltması ve yılı var', () => {
    renderReport()
    const badges = document.querySelectorAll('.job-badge-row')
    expect(badges.length).toBeGreaterThan(0)

    for (const row of badges) {
      const badgeText = row.querySelector('.job-badge')?.textContent
      const source = row.querySelector('.src-badge')?.textContent
      expect(source, `rozet kaynaksız: "${badgeText}"`).toBeTruthy()
      expect(source, `kaynakta yıl yok: "${source}"`).toMatch(/\d{4}/)
    }
  })

  it('gösterilen her kaynak rozeti sources.json\'daki gerçek bir künyeye karşılık gelir', () => {
    renderReport()
    const shorts = new Set(
      Object.values(SOURCE_BY_ID).map((s) => `${s.short} · ${String(s.date).slice(0, 4)}`),
    )
    for (const el of document.querySelectorAll('.src-badge')) {
      expect(shorts, `bilinmeyen kaynak rozeti: "${el.textContent}"`).toContain(el.textContent.trim())
    }
  })

  it('küme notunun altında noteSources künyeleri bulunur', () => {
    const { results } = renderReport()
    for (const scored of results.topClusters) {
      const card = screen.getByRole('heading', { name: scored.cluster.name }).closest('.cluster-card')
      const trail = card.querySelector('.src-trail')
      expect(trail, `${scored.id}: not künyesi yok`).toBeTruthy()
      for (const id of scored.cluster.noteSources) {
        expect(card.textContent, `${scored.id}: ${id} künyesi görünmüyor`).toContain(
          SOURCE_BY_ID[id].short,
        )
      }
    }
  })

  it('kaynakların kimliği açıkta, tam künye tek tıkla açılır durumda', () => {
    renderReport()
    const section = document.querySelector('.sources-section')

    // Rozet şeridi kapalı blok DIŞINDA, her zaman görünür olmalı.
    const glance = section.querySelector('.src-trail')
    expect(glance, 'kaynak rozeti şeridi yok').toBeTruthy()
    expect(glance.closest('details'), 'rozet şeridi açılır bloğa gömülmüş').toBeNull()
    expect(glance.querySelectorAll('.src-badge').length).toBe(collectUsedSources().length)

    // Tam künye bir açılır blokta duruyor ama raporun içinde ve eksiksiz.
    const registry = document.querySelector('.src-registry')
    expect(registry).toBeTruthy()
    expect(registry.closest('details'), 'tam künye açılır blokta değil').toBeTruthy()
  })

  it('raporun en altında kullanılan tüm kaynakların tam künyesi var', () => {
    renderReport()
    const registry = document.querySelector('.src-registry')
    expect(registry).toBeTruthy()

    for (const id of collectUsedSources()) {
      const s = SOURCE_BY_ID[id]
      const entry = registry.querySelector(`#kaynak-${id}`)
      expect(entry, `künyede eksik kaynak: ${id}`).toBeTruthy()
      expect(entry.textContent).toContain(s.title)
      expect(entry.textContent).toContain(s.publisher)
      expect(entry.textContent).toContain(s.date)
      expect(entry.querySelector('a')?.getAttribute('href')).toBe(s.url)
    }
  })

  it('künyede disclaimer ve ölçüm çerçeveleri yer alır', () => {
    renderReport()
    expect(screen.getByText(DATA.clusters._attribution.disclaimer)).toBeInTheDocument()
    // Ölçüm çerçeveleri artık açılır blokta — başlık değil, <summary>.
    expect(screen.getByText(/Ölçüm çerçeveleri/)).toBeInTheDocument()

    // Çerçeveler künyenin kendi listesinden okunur — başka bölümlerdeki geçişlerle karışmasın.
    const frameworks = document.querySelector('.framework-list').textContent
    for (const needle of ['Holland, J. L.', 'Prediger, D. J.', 'O*NET Work Values', 'Bandura']) {
      expect(frameworks, `çerçeve künyede yok: ${needle}`).toContain(needle)
    }
  })

  it('editoryal alanlar "Editoryal" olarak işaretlenir ve kaynak rozeti taşımaz', () => {
    const { results } = renderReport()

    // studyPathsTR ve caution editoryaldir
    const card = screen
      .getByRole('heading', { name: results.topClusters[0].cluster.name })
      .closest('.cluster-card')

    const caution = card.querySelector('.cluster-caution')
    expect(caution.querySelector('.editorial-badge')).toBeTruthy()
    expect(caution.querySelector('.src-badge'), 'caution kaynaklı gösterilmiş').toBeNull()

    const studyBlock = [...card.querySelectorAll('.cluster-block')].find((b) =>
      b.textContent.includes('lisans/MYO'),
    )
    expect(studyBlock.querySelector('.editorial-badge')).toBeTruthy()
    expect(studyBlock.querySelector('.src-badge'), 'studyPathsTR kaynaklı gösterilmiş').toBeNull()

    // Skor ağırlıkları da editoryaldir
    const breakdown = card.querySelector('.cluster-breakdown')
    expect(breakdown.textContent).toMatch(/editoryal/i)
  })

  it('editoryal alanların tamamı künye bölümünde tek tek listelenir', () => {
    renderReport()
    const list = document.querySelector('.editorial-list')
    for (const field of Object.keys(DATA.clusters._provenance.editorial)) {
      expect(list.textContent, `künyede eksik editoryal alan: ${field}`).toContain(field)
    }
    for (const field of Object.keys(DATA.skills2030._provenance.editorial)) {
      expect(list.textContent, `künyede eksik editoryal alan: ${field}`).toContain(field)
    }
  })
})

describe('rapor — dil kuralı (CLAUDE.md kural 6)', () => {
  /* Kesinlik, tanı ve garanti ifadeleri yasaktır. Bu tarama tam bir dilbilgisi denetimi değil;
     v1'den taşınabilecek tipik kalıpların regresyon bekçisidir. */
  const FORBIDDEN = [
    /senin mesleğin/i,
    /sana uygun meslek\b(?!ler)/i,
    /doğru meslek/i,
    /kesinlikle/i,
    /garanti/i,
    /bu işi yapmalısın/i,
    /yapman gereken (iş|meslek)/i,
    // v1 tek bir kullanıcı için yazılmıştı; adı hiçbir metinde kalmamalı.
    // \b Türkçe harfleri sözcük sınırı saydığı için ("duruşu") Unicode sınıfı kullanılır.
    /(^|[^\p{L}])duru([^\p{L}]|$)/iu,
  ]

  it('rapor metninde yasak kalıp geçmiyor', () => {
    renderReport()
    const text = document.body.textContent
    for (const pattern of FORBIDDEN) {
      expect(text, `yasak kalıp bulundu: ${pattern}`).not.toMatch(pattern)
    }
  })

  it('"başarı olasılığı" yalnızca olumsuzlanarak geçebilir', () => {
    renderReport()
    const text = document.body.textContent
    const all = (text.match(/başarı olasılığı/gi) || []).length
    const negated = (
      text.match(/başarı olasılığı (değildir|hesaplamaz|gibi sunulmaz|olarak okunmaz)/gi) || []
    ).length
    expect(negated, 'olumsuzlanmamış "başarı olasılığı" ifadesi var').toBe(all)
  })

  it('yüzdeler "örtüşme" olarak sunulur, olasılık olarak değil', () => {
    renderReport()
    expect(screen.getByText(/bir başarı olasılığı değildir/)).toBeInTheDocument()
    expect(document.querySelectorAll('.cluster-score-word')[0].textContent).toBe('örtüşme')
  })

  it('beceri radarının yetenek ölçmediği açıkça yazar', () => {
    renderReport()
    expect(screen.getByText(/bir eğilim haritasıdır/)).toBeInTheDocument()
  })
})

describe('panoya kopyalama dökümü', () => {
  it('yönerge satırı, skorlar, ham cevaplar ve künye içerir', () => {
    const answers = richAnswers()
    const text = buildExportText(answers, computeAll(answers, DATA), new Date('2026-09-20'))

    expect(text).toContain('psikometrik test değildir')
    expect(text).toContain('FUTURE-FIT')
    expect(text).toContain('Holland kodu:')
    expect(text).toContain('MESLEK KÜMESİ ÖRTÜŞME SKORLARI')
    expect(text).toContain('TÜM LIKERT CEVAPLARI')
    expect(text).toContain('AÇIK UÇLU CEVAPLAR')
    expect(text).toContain('Kullanılan kaynaklar:')
    for (const id of DATA.clusters._attribution.usedSources) {
      expect(text, `dökümde eksik kaynak: ${id}`).toContain(SOURCE_BY_ID[id].title)
    }
  })

  it('isim alanı döküme sızmaz', () => {
    const answers = richAnswers()
    const text = buildExportText(answers, computeAll(answers, DATA))
    expect(text.toLowerCase()).not.toContain('isim:')
    expect(text.toLowerCase()).not.toContain('ad soyad')
  })

  it('boş testte bile çökmez', () => {
    const empty = initialState.answers
    expect(() => buildExportText(empty, computeAll(empty, DATA))).not.toThrow()
  })
})
