/* Anket girdi bileşenleri.
 *
 * Hepsi yerel <input> öğeleri üzerine kuruludur: klavye gezinmesi, ok tuşlarıyla radio geçişi
 * ve ekran okuyucu desteği tarayıcıdan gelir. Dokunma hedefleri en az 44px (--tap).
 */

import React, { useId } from 'react'

/**
 * Likert satırı — 0-4 arası beş seçenekli radiogroup.
 * Soru metni grubun etiketi olur; her seçenek görsel olarak gizli bir radio + etiketten oluşur.
 */
export function LikertRow({ id, text, labels, value, onChange, hint }) {
  const groupId = useId()
  return (
    <fieldset className="likert-row">
      <legend className="likert-text" id={`${groupId}-label`}>
        {text}
      </legend>
      {hint ? <p className="hint">{hint}</p> : null}
      <div className="likert-options" role="radiogroup" aria-labelledby={`${groupId}-label`}>
        {labels.map((label, i) => {
          const optionId = `${groupId}-${i}`
          return (
            <span className="likert-option" key={optionId}>
              <input
                type="radio"
                id={optionId}
                name={`likert-${id}`}
                className="sr-input"
                checked={value === i}
                onChange={() => onChange(i)}
              />
              <label htmlFor={optionId} className="likert-pill">
                <span className="likert-dot" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="likert-caption">{label}</span>
              </label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Tek seçimlik dikey liste (senaryolar). */
export function ChoiceList({ name, question, options, value, onChange }) {
  const groupId = useId()
  return (
    <fieldset className="choice-block">
      <legend className="choice-question" id={`${groupId}-label`}>
        {question}
      </legend>
      <div className="choice-list" role="radiogroup" aria-labelledby={`${groupId}-label`}>
        {options.map((opt, i) => {
          const optionId = `${groupId}-${i}`
          return (
            <span key={optionId}>
              <input
                type="radio"
                id={optionId}
                name={name}
                className="sr-input"
                checked={value === i}
                onChange={() => onChange(i)}
              />
              <label htmlFor={optionId} className="choice-option">
                <span className="choice-mark" aria-hidden="true" />
                <span>{opt.text}</span>
              </label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Sınırlı çoklu seçim (akış soruları). */
export function MultiChoice({ name, question, options, selected, max, onToggle, statusText }) {
  const groupId = useId()
  const full = selected.length >= max
  return (
    <fieldset className="choice-block">
      <legend className="choice-question" id={`${groupId}-label`}>
        {question}
      </legend>
      <p className="hint" aria-live="polite">
        {statusText}
      </p>
      <div className="choice-list" aria-labelledby={`${groupId}-label`}>
        {options.map((opt, i) => {
          const optionId = `${groupId}-${i}`
          const checked = selected.includes(i)
          return (
            <span key={optionId}>
              <input
                type="checkbox"
                id={optionId}
                name={name}
                className="sr-input"
                checked={checked}
                disabled={!checked && full}
                onChange={() => onToggle(i)}
              />
              <label htmlFor={optionId} className="choice-option choice-check">
                <span className="choice-mark choice-mark-box" aria-hidden="true" />
                <span>{opt.text}</span>
              </label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Zorunlu ikili seçim (Prediger) ve ortam tercihi. */
export function BinaryChoice({ name, question, a, b, value, onChange }) {
  const groupId = useId()
  return (
    <fieldset className="binary">
      <legend className="choice-question" id={`${groupId}-label`}>
        {question}
      </legend>
      <div className="binary-options" role="radiogroup" aria-labelledby={`${groupId}-label`}>
        {[
          ['a', a],
          ['b', b],
        ].map(([key, text]) => {
          const optionId = `${groupId}-${key}`
          return (
            <span key={key} className="binary-slot">
              <input
                type="radio"
                id={optionId}
                name={name}
                className="sr-input"
                checked={value === key}
                onChange={() => onChange(key)}
              />
              <label htmlFor={optionId} className="binary-option">
                {text}
              </label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}

/** 1-5 arası öz-yeterlik ölçeği. */
export function ScaleRow({ id, text, value, onChange, lowLabel, highLabel }) {
  const groupId = useId()
  return (
    <fieldset className="scale-row">
      <legend className="scale-text" id={`${groupId}-label`}>
        {text}
      </legend>
      <div className="scale-options" role="radiogroup" aria-labelledby={`${groupId}-label`}>
        <span className="scale-end" aria-hidden="true">
          {lowLabel}
        </span>
        {[1, 2, 3, 4, 5].map((n) => {
          const optionId = `${groupId}-${n}`
          return (
            <span key={n} className="scale-slot">
              <input
                type="radio"
                id={optionId}
                name={`conf-${id}`}
                className="sr-input"
                checked={value === n}
                onChange={() => onChange(n)}
              />
              <label htmlFor={optionId} className="scale-pill">
                {n}
              </label>
            </span>
          )
        })}
        <span className="scale-end" aria-hidden="true">
          {highLabel}
        </span>
      </div>
    </fieldset>
  )
}
