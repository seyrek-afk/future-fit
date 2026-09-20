/* Değer sıralaması — sürükle-bırak + klavye/dokunma alternatifi (PRD §7 erişilebilirlik).
 *
 * Sürükleme yalnızca bir kolaylıktır: yukarı/aşağı düğmeleri her ortamda çalışır ve
 * ekran okuyucuya her taşımadan sonra yeni sıra bildirilir.
 *
 * Kullanıcı sıralamaya hiç dokunmadıysa bu bölüm CEVAPSIZ sayılır — dosya sırasını
 * sessizce bir tercih gibi kaydetmek yanlış bir skor üretirdi. Onay düğmesi bunu açık yapar.
 */

import React, { useRef, useState } from 'react'
import { ChevronUp, ChevronDown, GripVertical, Check } from 'lucide-react'
import { DATA } from '../../data/index.js'
import { valueOrder } from '../../state/surveyReducer.js'
import { tr } from '../../i18n/tr.js'
import { Button } from '../ui/primitives.jsx'

const VALUE_BY_ID = Object.fromEntries(DATA.values.values.map((v) => [v.id, v]))

export function ValuesRanking({ answers, dispatch }) {
  const order = valueOrder(answers.values)
  const confirmed = Array.isArray(answers.values) && answers.values.length === order.length
  const [announcement, setAnnouncement] = useState('')
  const dragId = useRef(null)

  const announce = (id, list) => {
    const rank = list.indexOf(id) + 1
    setAnnouncement(tr.sections.values.positionLabel(rank, list.length, VALUE_BY_ID[id].title))
  }

  const move = (id, delta) => {
    const from = order.indexOf(id)
    const to = from + delta
    if (to < 0 || to >= order.length) return
    const next = [...order]
    ;[next[from], next[to]] = [next[to], next[from]]
    dispatch({ type: 'SET_VALUES', order: next })
    announce(id, next)
  }

  const dropOn = (targetId) => {
    const id = dragId.current
    dragId.current = null
    if (!id || id === targetId) return
    const next = [...order]
    next.splice(next.indexOf(id), 1)
    next.splice(order.indexOf(targetId), 0, id)
    dispatch({ type: 'SET_VALUES', order: next })
    announce(id, next)
  }

  return (
    <div className="values-ranking">
      <ol className="values-list">
        {order.map((id, index) => {
          const value = VALUE_BY_ID[id]
          return (
            <li
              key={id}
              className="value-item"
              draggable
              onDragStart={() => {
                dragId.current = id
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropOn(id)}
            >
              <span className="value-rank" aria-hidden="true">
                {index + 1}
              </span>
              <GripVertical className="value-grip" size={18} aria-hidden="true" />
              <div className="value-text">
                <strong>{value.title}</strong>
                <span>{value.desc}</span>
              </div>
              <div className="value-moves">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => move(id, -1)}
                  disabled={index === 0}
                  aria-label={`${value.title} — ${tr.sections.values.moveUp}`}
                >
                  <ChevronUp size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => move(id, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`${value.title} — ${tr.sections.values.moveDown}`}
                >
                  <ChevronDown size={18} aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      {confirmed ? (
        <p className="hint hint-ok">
          <Check size={16} aria-hidden="true" /> Sıralaman kaydedildi.
        </p>
      ) : (
        <div className="values-confirm">
          <p className="hint">
            Sıralamaya henüz dokunmadın. Yukarıdaki sıra senin için doğruysa onayla; onaylamazsan bu
            bölüm boş sayılır ve skorun değer bileşenine girmez.
          </p>
          <Button variant="secondary" onClick={() => dispatch({ type: 'SET_VALUES', order })}>
            Bu sıralamayı onayla
          </Button>
        </div>
      )}
    </div>
  )
}
