/* Paylaşılan arayüz parçaları. Hiçbiri skor hesaplamaz — yalnızca gösterir. */

import React, { useId } from 'react'

export function Button({ variant = 'primary', size, className = '', ...rest }) {
  const classes = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className]
    .filter(Boolean)
    .join(' ')
  return <button type="button" className={classes} {...rest} />
}

export function Card({ as: Tag = 'section', className = '', ...rest }) {
  return <Tag className={`card ${className}`.trim()} {...rest} />
}

/** Yüzde çubuğu. Ekran okuyucu için değer metin olarak da verilir. */
export function Bar({ value, label, color, max = 100, tone = 'accent' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="bar-row">
      {label ? <span className="bar-label">{label}</span> : null}
      <span className={`bar-track bar-${tone}`} aria-hidden="true">
        <span className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </span>
      <span className="bar-value">%{Math.round(value)}</span>
    </div>
  )
}

/** [-1, +1] aralığında iki uçlu kaydırıcı göstergesi (Prediger eksenleri). */
export function AxisMeter({ value, leftLabel, rightLabel, title, unanswered, unansweredText }) {
  const pos = ((value + 1) / 2) * 100
  return (
    <div className="axis">
      <div className="axis-title">{title}</div>
      <div className="axis-track" role="img" aria-label={`${title}: ${value.toFixed(2)}`}>
        <span className="axis-center" aria-hidden="true" />
        <span className="axis-dot" style={{ left: `${pos}%` }} aria-hidden="true" />
      </div>
      <div className="axis-ends">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      {unanswered ? <p className="hint">{unansweredText}</p> : null}
    </div>
  )
}

export function Chip({ selected, children, ...rest }) {
  return (
    <span className={`chip ${selected ? 'chip-on' : ''}`.trim()} {...rest}>
      {children}
    </span>
  )
}

/** Çoklu seçim çipi — gerçek bir checkbox üzerine kurulur (klavye ve ekran okuyucu için). */
export function ToggleChip({ checked, onChange, disabled, children, name }) {
  const id = useId()
  return (
    <span className="chip-wrap">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="chip-input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className="chip chip-toggle">
        {children}
      </label>
    </span>
  )
}

export function Callout({ tone = 'info', title, children, icon: Icon }) {
  return (
    <div className={`callout callout-${tone}`} role="note">
      <div className="callout-head">
        {Icon ? <Icon size={18} aria-hidden="true" /> : null}
        {title ? <strong>{title}</strong> : null}
      </div>
      <div className="callout-body">{children}</div>
    </div>
  )
}

export function SectionHeading({ id, number, title, about, children }) {
  return (
    <header className="section-head">
      {number ? <p className="section-number">{number}</p> : null}
      <h2 id={id} tabIndex={-1}>
        {title}
      </h2>
      {about ? <p className="section-about">{about}</p> : null}
      {children}
    </header>
  )
}

/**
 * Uzun gerekçe metnini saklayan açılır blok.
 *
 * Hedef kitle lise çağında ve rapor uzun: metin SİLİNMEZ, ertelenir. Dürüstlük
 * cümlelerinin kısa hâli her zaman görünür kalır, uzun hâli buraya girer.
 * <details> kullanılır — JS gerektirmez, klavyeyle çalışır ve baskıda zorla açılır.
 */
export function Explainer({ label, children, className = '' }) {
  return (
    <details className={`explainer ${className}`.trim()}>
      <summary>{label}</summary>
      <div className="explainer-body">{children}</div>
    </details>
  )
}
