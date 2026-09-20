/* Panoya kopyalanan metin dökümü — docs/PRD.md §6.
 *
 * v1'deki dökümün genelleştirilmiş hâli: tek bir kullanıcıya ait hiçbir bağlam içermez.
 * Üstünde, çıktıyı bir yapay zekâya yapıştıracak kişi için kısa bir yönerge satırı bulunur;
 * bu yönerge kesinlik dilini açıkça yasaklar.
 *
 * İSİM ALANI DÖKÜME GİRMEZ: kişisel veri dışarı taşınmaz (CLAUDE.md kural 2).
 */

import { DATA, CONF_BY_ID, PROBLEM_BY_ID, TECH_BY_ID } from '../data/index.js'
import { tr } from '../i18n/tr.js'

const META = DATA.riasec.meta
const dash = '—'

export function buildExportText(answers, results, now = new Date()) {
  const L = []
  const push = (...lines) => L.push(...lines)
  const section = (title) => push('', `— ${title} —`)

  push(tr.copyExport.instruction, '', '='.repeat(60), tr.copyExport.header, '='.repeat(60))
  push(`Tarih: ${now.toLocaleDateString('tr-TR')}`)
  push(`Veri seti: ${DATA.clusters._updated} · Çerçeve: WEF Future of Jobs 2025, Holland RIASEC, O*NET`)

  /* --- RIASEC --- */
  section('İLGİ PROFİLİ (RIASEC)')
  push(
    `Holland kodu: ${results.riasec.code.join('')} (${results.riasec.code
      .map((t) => META[t].name)
      .join('-')})`,
  )
  for (const t of results.riasec.sorted) {
    push(`  ${t} ${META[t].name} (${META[t].en}): %${results.riasec.pct[t]}`)
  }
  push(
    `Farklılaşma (en yüksek − en düşük): ${results.riasec.spread}` +
      (results.riasec.explorationMode ? ' — DÜŞÜK: profil düz, keşif modu' : ''),
  )

  /* --- Eksenler --- */
  section('ÇALIŞMA TARZI EKSENLERİ (skora girmez)')
  push(`İnsan(+1) ↔ Nesne(−1): ${results.axes.peopleThings.toFixed(2)}`)
  push(`Fikir(+1) ↔ Veri(−1): ${results.axes.dataIdeas.toFixed(2)}`)
  push('Ortam tercihleri:')
  if (results.environment.length === 0) push(`  ${dash}`)
  for (const e of results.environment) push(`  · ${e.text}`)

  /* --- Değerler --- */
  section('DEĞER SIRALAMASI (1 = en önemli)')
  if (results.values.length === 0) push(`  ${dash} (sıralama yapılmadı)`)
  for (const v of results.values) push(`  ${v.rank}. ${v.title} (${v.en})`)

  /* --- Öz-yeterlik --- */
  section('KENDİNE GÜVEN (1-5 özbildirim, yetenek ölçümü değil)')
  for (const item of DATA.confidence.items) {
    const v = answers.conf[item.id]
    push(`  ${item.text}: ${typeof v === 'number' ? v : dash}`)
  }

  /* --- Merak --- */
  section('ÖNEMSENEN DÜNYA SORUNLARI')
  if (answers.problems.length === 0) push(`  ${dash}`)
  for (const id of answers.problems) push(`  · ${PROBLEM_BY_ID[id]?.text ?? id}`)

  section('HEYECAN VEREN TEKNOLOJİLER')
  if (answers.techs.length === 0) push(`  ${dash}`)
  for (const id of answers.techs) push(`  · ${TECH_BY_ID[id]?.text ?? id}`)

  /* --- 2030 becerileri --- */
  section('2030 BECERİ RADARI (eğilim haritası, yetenek ölçümü değil)')
  push('Doğal güçlü yanlar:')
  for (const s of results.skills.strengths) push(`  · ${s.tr}: %${Math.round(s.readiness)}`)
  push('Bilinçli yatırım gerekenler (WEF ilk 5 içinden):')
  for (const s of results.skills.investments) {
    push(`  · ${s.tr}: %${Math.round(s.readiness)} — öneri: ${s.howToBuild}`)
  }

  /* --- Kümeler --- */
  section('MESLEK KÜMESİ ÖRTÜŞME SKORLARI (sıralama içindir, olasılık değildir)')
  push('Formül: 0.45×ilgi + 0.20×özyeterlik + 0.20×merak + 0.15×değer')
  results.clusters.forEach((c, i) => {
    const flags = [
      c.flags.interestHighConfLow ? 'ilgi yüksek/güven düşük' : null,
      c.flags.valuesMismatch ? 'değer uyumsuzluğu' : null,
    ].filter(Boolean)
    push(
      `  ${i + 1}. ${c.name}: %${c.pct} ` +
        `(ilgi ${pct(c.interest)}, güven ${pct(c.confidence)}, merak ${pct(c.curiosity)}, değer ${pct(
          c.valueFit,
        )})` +
        (flags.length ? ` [${flags.join('; ')}]` : '') +
        ` · YZ duruşu: ${c.cluster.aiPosture.level}`,
    )
  })

  /* --- Ham cevaplar --- */
  section('SENARYO SEÇİMLERİ')
  for (const sc of DATA.riasec.scenarios) {
    const i = answers.scenarios[sc.id]
    const opt = Number.isInteger(i) ? sc.opts[i] : null
    push(`  ${sc.q}`)
    push(`    → ${opt ? `${opt.text} [${opt.t}]` : dash}`)
  }

  section('AKIŞ SORULARI')
  for (const q of DATA.riasec.flow) {
    push(`  ${q.q}`)
    const sel = answers.flow[q.id] || []
    if (sel.length === 0) push(`    ${dash}`)
    for (const i of sel) {
      const opt = q.opts[i]
      if (opt) push(`    · ${opt.text} [${opt.t}]`)
    }
  }

  section('PREDIGER İKİLİ SEÇİMLERİ')
  for (const p of DATA.workstyle.prediger) {
    const choice = answers.prediger[p.id]
    push(`  ${p.q}`)
    push(`    → ${choice ? `${p[choice].text} (${p[choice].side})` : dash}`)
  }

  section('TÜM LIKERT CEVAPLARI (0 = hiç hoşlanmam … 4 = çok hoşlanırım)')
  for (const item of DATA.riasec.likert) {
    const v = answers.likert[item.id]
    push(`  [${item.t}] ${item.text}: ${typeof v === 'number' ? v : dash}`)
  }

  section('AÇIK UÇLU CEVAPLAR')
  for (const q of DATA.openQuestions.questions) {
    push(`  S: ${q.q}`)
    push(`  C: ${answers.open[q.id]?.trim() || '(boş)'}`)
  }

  /* --- Künye --- */
  section('SINIRLAR VE KAYNAKLAR')
  push('Bu bir psikometrik test değildir: normlanmamıştır, güvenirlik/geçerlik katsayısı yoktur,')
  push('tanı koymaz. Skorlar sıralama amaçlıdır; başarı olasılığı değildir.')
  push(DATA.clusters._attribution.disclaimer)
  push('')
  push('Kullanılan kaynaklar:')
  for (const id of DATA.clusters._attribution.usedSources) {
    const s = DATA.sources.sources.find((x) => x.id === id)
    if (s) push(`  · ${s.short} — ${s.title}, ${s.publisher}, ${s.date}. ${s.url}`)
  }
  push('')
  push('Editoryal (kaynağa dayanmayan) alanlar: küme RIASEC/öz-yeterlik/değer ağırlıkları,')
  push('tagline, caution, Türkiye program listeleri, beceri riasecAffinity ve howToBuild önerileri.')

  return L.join('\n')
}

const pct = (v) => Math.round(v * 100)

/** Panoya yaz; izin verilmezse geçici bir textarea ile dener. Başarı durumunu döner. */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* aşağıdaki yedeğe düş */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
