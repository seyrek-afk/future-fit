/* RIASEC altıgeni — ilgi profilinin tek bakışta okunan hâli.
 *
 * Holland'ın modeli zaten altıgen bir düzendir (R-I-A-S-E-C komşuluk sırası anlamlıdır),
 * bu yüzden bu bir süs değil, verinin kendi biçimi. Altı çubuk yerine bir şekil okumak
 * lise çağındaki bir kullanıcı için hem daha hızlı hem daha az metin.
 *
 * Satır içi SVG: harici görsel, kütüphane ve ağ isteği yok.
 */

import React, { useId } from 'react'
import { DATA, RIASEC_ORDER } from '../../data/index.js'

const META = DATA.riasec.meta
const SIZE = 260
const C = SIZE / 2
const R = 92
const RINGS = [25, 50, 75, 100]

/** Tepe noktası yukarıda, saat yönünde R-I-A-S-E-C. */
const angleOf = (i) => (Math.PI / 180) * (-90 + i * 60)
const pointAt = (i, pct) => {
  const r = (R * Math.max(0, Math.min(100, pct))) / 100
  return [C + r * Math.cos(angleOf(i)), C + r * Math.sin(angleOf(i))]
}
const polygon = (getPct) =>
  RIASEC_ORDER.map((t, i) => pointAt(i, getPct(t, i)).map((n) => n.toFixed(1)).join(',')).join(' ')

export function RiasecHexagon({ pct, code }) {
  const gradientId = useId()
  const top = new Set(code)

  const label = RIASEC_ORDER.map((t) => `${META[t].name} %${pct[t]}`).join(', ')

  return (
    <figure className="hex">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="hex-svg"
        role="img"
        aria-label={`İlgi profili altıgeni. ${label}.`}
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.16" />
          </radialGradient>
        </defs>

        {/* ölçek halkaları */}
        {RINGS.map((ring) => (
          <polygon
            key={ring}
            points={polygon(() => ring)}
            className={`hex-ring ${ring === 100 ? 'hex-ring-outer' : ''}`.trim()}
          />
        ))}

        {/* eksen çizgileri */}
        {RIASEC_ORDER.map((t, i) => {
          const [x, y] = pointAt(i, 100)
          return <line key={t} x1={C} y1={C} x2={x} y2={y} className="hex-axis" />
        })}

        {/* kullanıcının profili */}
        <polygon points={polygon((t) => pct[t])} className="hex-shape" fill={`url(#${gradientId})`} />

        {/* tip noktaları — ilk üç tip dolu, diğerleri boş */}
        {RIASEC_ORDER.map((t, i) => {
          const [x, y] = pointAt(i, pct[t])
          return (
            <circle
              key={t}
              cx={x}
              cy={y}
              r={top.has(t) ? 6 : 4}
              fill={top.has(t) ? META[t].hex : 'var(--surface-1)'}
              stroke={META[t].hex}
              strokeWidth="2.5"
            />
          )
        })}
      </svg>

      {/* Etiketler SVG dışında: ekran okuyucu ve küçük ekran için daha güvenli. */}
      <figcaption className="hex-legend">
        {RIASEC_ORDER.map((t) => (
          <span key={t} className={`hex-chip ${top.has(t) ? 'hex-chip-on' : ''}`.trim()}>
            <span className="hex-dot" style={{ background: META[t].hex }} aria-hidden="true" />
            <b>{t}</b>
            <span className="hex-name">{META[t].name}</span>
            <span className="hex-pct">%{pct[t]}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
