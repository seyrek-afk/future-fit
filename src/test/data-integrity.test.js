/* docs/PRD.md §8 madde 8 — data/*.json bütünlüğü.
 *
 * Veri dosyaları ELLE güncellenecek (CLAUDE.md kural 4). Bu test, bir küme veya rozet
 * eklendiğinde kırılan tek şeyin test olmasını sağlar — arayüz değil.
 * reference/validate.mjs'in kalıcı karşılığıdır; ona ek olarak kaynak izi sözleşmesini de denetler.
 */

import { describe, it, expect } from 'vitest'
import { DATA } from '../data/index.js'

const setOfIds = (list) => new Set(list.map((x) => x.id))

const CONF_IDS = setOfIds(DATA.confidence.items)
const TECH_IDS = setOfIds(DATA.interests.techs)
const PROBLEM_IDS = setOfIds(DATA.interests.problems)
const VALUE_IDS = setOfIds(DATA.values.values)
const SKILL_IDS = setOfIds([...DATA.skills2030.rising, ...DATA.skills2030.extraCore])
const SOURCE_IDS = setOfIds(DATA.sources.sources)
const RIASEC_TYPES = new Set(Object.keys(DATA.riasec.meta))

const DATA_FILES = {
  'clusters.json': DATA.clusters,
  'skills2030.json': DATA.skills2030,
  'riasec.json': DATA.riasec,
  'workstyle.json': DATA.workstyle,
  'values.json': DATA.values,
  'confidence.json': DATA.confidence,
  'interests.json': DATA.interests,
  'open-questions.json': DATA.openQuestions,
}

describe('§8.8 — küme id referansları dosyalar arası tutarlı', () => {
  it.each(DATA.clusters.clusters.map((c) => [c.id, c]))('%s', (_id, cluster) => {
    for (const id of cluster.conf) expect(CONF_IDS, `conf: ${id}`).toContain(id)
    for (const id of cluster.tech) expect(TECH_IDS, `tech: ${id}`).toContain(id)
    for (const id of cluster.problems) expect(PROBLEM_IDS, `problems: ${id}`).toContain(id)
    for (const id of cluster.values) expect(VALUE_IDS, `values: ${id}`).toContain(id)
    for (const id of cluster.skills) expect(SKILL_IDS, `skills: ${id}`).toContain(id)
    for (const t of Object.keys(cluster.riasec)) expect(RIASEC_TYPES, `riasec: ${t}`).toContain(t)
  })

  it('küme id\'leri benzersizdir', () => {
    const ids = DATA.clusters.clusters.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('soru bankasındaki tüm id\'ler benzersizdir', () => {
    const groups = {
      likert: DATA.riasec.likert,
      scenarios: DATA.riasec.scenarios,
      flow: DATA.riasec.flow,
      prediger: DATA.workstyle.prediger,
      environment: DATA.workstyle.environment,
      values: DATA.values.values,
      confidence: DATA.confidence.items,
      problems: DATA.interests.problems,
      techs: DATA.interests.techs,
      open: DATA.openQuestions.questions,
    }
    for (const [name, list] of Object.entries(groups)) {
      const ids = list.map((x) => x.id)
      expect(new Set(ids).size, `${name} içinde yinelenen id`).toBe(ids.length)
    }
  })

  it('soru bankası METHODOLOGY §2\'deki madde sayılarını tutturur', () => {
    expect(DATA.riasec.likert).toHaveLength(36)
    expect(DATA.riasec.scenarios).toHaveLength(5)
    expect(DATA.riasec.flow).toHaveLength(3)
    expect(DATA.workstyle.prediger).toHaveLength(6)
    expect(DATA.workstyle.environment).toHaveLength(6)
    expect(DATA.values.values).toHaveLength(6)
    expect(DATA.confidence.items).toHaveLength(12)
    expect(DATA.interests.problems).toHaveLength(9)
    expect(DATA.interests.techs).toHaveLength(12)
    expect(DATA.openQuestions.questions).toHaveLength(4)
  })

  it('her RIASEC tipinden 6 Likert maddesi vardır', () => {
    for (const t of RIASEC_TYPES) {
      expect(DATA.riasec.likert.filter((i) => i.t === t), `tip ${t}`).toHaveLength(6)
    }
  })

  it('her senaryoda altı tipin hepsi birer seçenek olarak bulunur', () => {
    for (const sc of DATA.riasec.scenarios) {
      expect(new Set(sc.opts.map((o) => o.t)), sc.id).toEqual(RIASEC_TYPES)
    }
  })

  it('akış sorularının max değeri seçenek sayısını aşmaz', () => {
    for (const q of DATA.riasec.flow) {
      expect(q.max, q.id).toBeGreaterThan(0)
      expect(q.max, q.id).toBeLessThanOrEqual(q.opts.length)
      for (const o of q.opts) expect(RIASEC_TYPES, `${q.id} seçenek tipi`).toContain(o.t)
    }
  })

  it('her RIASEC tipi en az bir kümede baskındır (ağırlık ≥ 2.5)', () => {
    for (const t of RIASEC_TYPES) {
      const dominant = DATA.clusters.clusters.filter((c) => (c.riasec[t] || 0) >= 2.5)
      expect(dominant.length, `"${t}" tipi hiçbir kümede baskın değil`).toBeGreaterThan(0)
    }
  })
})

describe('§8.8 — kaynak izi: her rozetin künyesi var', () => {
  it.each(DATA.clusters.clusters.map((c) => [c.id, c]))('%s', (_id, cluster) => {
    // Rozetli her meslek kaynak taşır
    expect(cluster.jobs.length).toBeGreaterThanOrEqual(4)
    for (const job of cluster.jobs) {
      expect(job.badge, `${job.name}: rozet yok`).toBeTruthy()
      expect(SOURCE_IDS, `${job.name}: kaynak "${job.source}"`).toContain(job.source)
    }
    // aiPosture notu kaynaklıdır
    expect(SOURCE_IDS, `${cluster.id}.aiPosture.source`).toContain(cluster.aiPosture.source)
    expect(['yuksek_direnc', 'orta', 'karisik']).toContain(cluster.aiPosture.level)
    // note alanı en az bir künyeye bağlıdır
    expect(cluster.noteSources.length, `${cluster.id}: note için noteSources yok`).toBeGreaterThan(0)
    for (const id of cluster.noteSources) expect(SOURCE_IDS, `noteSources: ${id}`).toContain(id)
    // editoryal alanlar dolu olmalı ama kaynak taşımaz
    for (const field of ['tagline', 'note', 'caution']) {
      expect(cluster[field], `${cluster.id}.${field} boş`).toBeTruthy()
    }
    expect(cluster.studyPathsTR.length).toBeGreaterThan(0)
  })

  it('her veri dosyasının sonunda _attribution künyesi vardır', () => {
    for (const [name, file] of Object.entries(DATA_FILES)) {
      expect(file._attribution, `${name}: _attribution yok`).toBeTruthy()
      const keys = Object.keys(file)
      expect(keys[keys.length - 1], `${name}: _attribution en altta değil`).toBe('_attribution')
      for (const id of file._attribution.usedSources || []) {
        expect(SOURCE_IDS, `${name} künyesi: ${id}`).toContain(id)
      }
    }
  })

  it('clusters.json künyesi gerçekten kullanılan tüm kaynakları listeler', () => {
    const used = new Set()
    for (const c of DATA.clusters.clusters) {
      for (const j of c.jobs) used.add(j.source)
      used.add(c.aiPosture.source)
      for (const id of c.noteSources) used.add(id)
    }
    const declared = new Set(DATA.clusters._attribution.usedSources)
    for (const id of used) expect(declared, `künyede eksik kaynak: ${id}`).toContain(id)
    for (const id of declared) expect(used, `künyede fazladan kaynak: ${id}`).toContain(id)
  })

  it('sources.json\'daki her kaynak en az bir yerde kullanılır', () => {
    const used = new Set(
      Object.values(DATA_FILES).flatMap((f) => f._attribution?.usedSources || []),
    )
    for (const s of DATA.sources.sources) {
      expect(used, `sources.json: "${s.id}" hiçbir künyede kullanılmıyor`).toContain(s.id)
    }
  })

  it('her kaynak künyesi tam: kısaltma, başlık, yayıncı, tarih, url', () => {
    for (const s of DATA.sources.sources) {
      expect(s.short, `${s.id}.short`).toBeTruthy()
      expect(s.title, `${s.id}.title`).toBeTruthy()
      expect(s.publisher, `${s.id}.publisher`).toBeTruthy()
      expect(s.date, `${s.id}.date`).toMatch(/^\d{4}(-\d{2}){0,2}$/)
      expect(s.url, `${s.id}.url`).toMatch(/^https:\/\//)
    }
  })

  it('beceri kayıtları kaynak taşır ve riasecAffinity editoryal olarak işaretlidir', () => {
    for (const s of [...DATA.skills2030.rising, ...DATA.skills2030.extraCore]) {
      expect(SOURCE_IDS, `${s.id}.source`).toContain(s.source)
      for (const t of Object.keys(s.riasecAffinity || {})) {
        expect(RIASEC_TYPES, `${s.id}.riasecAffinity: ${t}`).toContain(t)
      }
    }
    for (const s of DATA.skills2030.rising) {
      expect(s.howToBuild, `${s.id}.howToBuild`).toBeTruthy()
      expect(s.rank).toBeGreaterThanOrEqual(1)
    }
    expect(DATA.skills2030._provenance.editorial.riasecAffinity).toBeTruthy()
    expect(DATA.skills2030._provenance.editorial.howToBuild).toBeTruthy()
  })

  it('clusters.json editoryal alanları _provenance içinde açıkça işaretlidir', () => {
    const editorialKeys = Object.keys(DATA.clusters._provenance.editorial).join(' ')
    expect(editorialKeys).toMatch(/riasec/)
    expect(editorialKeys).toMatch(/caution/)
    expect(editorialKeys).toMatch(/studyPathsTR/)
    expect(DATA.clusters._attribution.disclaimer).toBeTruthy()
  })

  it('WEF yükselen beceri listesi sıralı ve eksiksizdir', () => {
    expect(DATA.skills2030.rising).toHaveLength(10)
    DATA.skills2030.rising.forEach((s, i) => expect(s.rank).toBe(i + 1))
    expect(DATA.skills2030.core2025).toHaveLength(10)
  })
})
