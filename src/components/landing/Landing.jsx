/* Açılış sayfası — hedef okur: 15-18 yaş lise öğrencisi.
 *
 * Ton kararı: çocuklaştırma yok. Bu yaş ciddiye alınmak ister; ikna eden şey
 * pazarlama cümlesi değil, ölçülebilir bilgi (kaç dakika, kaç bölüm, ne kaydediliyor)
 * ve ne yapmadığını açıkça söyleyen bir liste.
 *
 * Düzen: iki sütunlu hero (metin + Holland altıgeni) → ne yapar (4 adım) →
 * ne yapmaz (tek panel) → verin nereye gidiyor → kapanış CTA.
 * Sayfadaki tek yüzeyli panel "Ne yapmaz"tır: dürüstlük sözleşmesi dipnota itilmez.
 *
 * Görsel: altıgen dekor değil, ürünün kendisidir — Holland RIASEC modelinin
 * altı tipi. Saf SVG, ağ isteği yok, dosya yok. Renkler --s1..--s6 token'larından,
 * tip adları data/riasec.json'dan gelir (tr.js yalnızca arayüz çerçevesidir).
 *
 * Hareket: yalnızca etkileşim anında (basma, hover, odak), 120-180ms.
 * Kendiliğinden oynayan hiçbir şey yok; prefers-reduced-motion index.css'te mutlak.
 *
 * Metin kuralı (CLAUDE.md): bu dosyada düz Türkçe arayüz metni yoktur ve
 * tr.js'de bulunmayan bir anahtar kullanılmaz (öneriler: docs/DESIGN.md).
 *
 * <main> AÇMAZ — App.jsx'in <main>'i içine yerleştirilir.
 */

import React from 'react'
import { ArrowRight, CircleSlash, Compass, ShieldCheck, X } from 'lucide-react'
import { tr } from '../../i18n/tr.js'
import { DATA, RIASEC_ORDER } from '../../data/index.js'
import { Button, Explainer } from '../ui/primitives.jsx'
import '../../styles/landing.css'

/* tr.intro.duration zaten "·" ile ayrılmış bir künye dizesidir
   ("Yaklaşık 12-18 dakika · 8 bölüm · zorunlu soru yok").
   Yeni anahtar uydurmadan aynı metni taranabilir bir künye şeridine açıyoruz;
   kaç parça gelirse gelsin düzen bozulmaz. */
const SPEC = tr.intro.duration
  .split('·')
  .map((part) => part.trim())
  .filter(Boolean)

/* Holland altıgeni: R-I-A-S-E-C çevre boyunca sıralıdır, sıra rastgele değildir.
   Köşeler tepe-noktalı altıgen üzerinde -90°'den başlayıp saat yönünde ilerler. */
const HEX_CENTER = 100
const HEX_RADIUS = 70

const TYPES = RIASEC_ORDER.map((key, i) => {
  const angle = ((-90 + i * 60) * Math.PI) / 180
  const meta = DATA.riasec.meta[key] || {}
  return {
    key,
    name: meta.name || key,
    color: meta.color || `var(--s${i + 1})`,
    x: HEX_CENTER + HEX_RADIUS * Math.cos(angle),
    y: HEX_CENTER + HEX_RADIUS * Math.sin(angle),
  }
})

const HEX_POINTS = TYPES.map((t) => `${t.x.toFixed(2)},${t.y.toFixed(2)}`).join(' ')

function clampPct(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, n))
}

/* Altıgen bilgiyi TEKRARLAR, taşımaz: altındaki liste aynı altı tipi metinle verir.
   Bu yüzden diyagram erişilebilirlik ağacından çıkarılır — ekran okuyucu aynı
   şeyi iki kez okumaz. Renk tek başına hiçbir anlam taşımaz. */
function HollandHex() {
  return (
    <svg
      className="landing-hex"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="var(--baseline)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {TYPES.map((t) => (
        <g key={t.key}>
          <circle cx={t.x} cy={t.y} r="16" fill={t.color} />
          <text
            x={t.x}
            y={t.y}
            dy="0.35em"
            textAnchor="middle"
            fill="var(--page)"
            fontSize="16"
            fontWeight="700"
          >
            {t.key}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function Landing({ hasProgress, progress, onStart, onResume, onReset }) {
  const pct = clampPct(progress)

  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="landing-hero-text">
          <h1 id="section-heading" tabIndex={-1} className="landing-title">
            {tr.intro.heading}
          </h1>

          <p className="landing-lead">{tr.intro.lead}</p>
          <Explainer label={tr.intro.leadMore}>
            <p>{tr.intro.leadDetail}</p>
          </Explainer>

          <ul className="landing-spec">
            {SPEC.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>

          {hasProgress ? (
            <div className="landing-resume">
              <p className="landing-resume-note">{tr.intro.resumeNote}</p>
              <div className="landing-meter" aria-hidden="true">
                <span className="landing-meter-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="landing-resume-pct">{tr.nav.progressLabel(pct)}</p>
              <div className="landing-actions">
                <Button size="lg" className="landing-go" onClick={onResume}>
                  {tr.intro.resume}
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
                <Button variant="ghost" onClick={onReset}>
                  {tr.intro.startOver}
                </Button>
              </div>
            </div>
          ) : (
            <div className="landing-actions landing-actions-hero">
              <Button size="lg" className="landing-go" onClick={onStart}>
                {tr.intro.start}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
              <p className="landing-fineprint">{tr.intro.startNote}</p>
            </div>
          )}
        </div>

        <div className="landing-types">
          <HollandHex />
          <ul className="landing-type-list">
            {TYPES.map((t) => (
              <li key={t.key}>
                <span className="landing-type-dot" style={{ background: t.color }} aria-hidden="true">
                  {t.key}
                </span>
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Ölçüm cetveli: hero'yu gövdeden ayıran tek soyut doku. Statik, metinden uzak. */}
      <div className="landing-measure" aria-hidden="true" />

      <section className="landing-section" aria-labelledby="landing-does">
        <h2 id="landing-does" className="landing-h2">
          <Compass size={18} aria-hidden="true" />
          {tr.intro.whatItIsTitle}
        </h2>
        <ol className="landing-steps">
          {tr.intro.whatItIs.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="landing-section" aria-labelledby="landing-doesnt">
        <div className="landing-panel">
          <h2 id="landing-doesnt" className="landing-h2">
            <CircleSlash size={18} aria-hidden="true" />
            {tr.intro.whatItIsNotTitle}
          </h2>
          <ul className="landing-limits">
            {tr.intro.whatItIsNot.map((line) => (
              <li key={line}>
                <X className="landing-limit-mark" size={15} aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="landing-section" aria-labelledby="landing-privacy">
        <h2 id="landing-privacy" className="landing-h2">
          <ShieldCheck size={18} aria-hidden="true" />
          {tr.intro.privacyTitle}
        </h2>
        <p className="landing-privacy-body">{tr.intro.privacy}</p>
        <Explainer label={tr.report.showDetails}>
          <p>{tr.intro.privacyDetail}</p>
        </Explainer>
      </section>

      {/* Kapanış: aynı eylemin tekrarı. İnce yazı hero'da bir kez geçtiği için
          burada tekrarlanmaz — az metin kuralı. */}
      <div className="landing-close">
        <div className="landing-actions">
          <Button size="lg" className="landing-go" onClick={hasProgress ? onResume : onStart}>
            {hasProgress ? tr.intro.resume : tr.intro.start}
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
