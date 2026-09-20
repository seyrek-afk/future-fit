/* Prediger çalışma tarzı eksenleri — docs/METHODOLOGY.md §4.
 *
 * Her eksende 3 ikili seçim. insan = +1, nesne = −1; fikir = +1, veri = −1.
 * Cevaplananların ortalaması alınır → [−1, +1]. Skora GİRMEZ, yalnızca rapora girer.
 */

const POSITIVE_SIDES = new Set(['people', 'ideas'])

const mean = (list) => (list.length ? list.reduce((s, v) => s + v, 0) / list.length : 0)

export function computeAxes(answers, data) {
  const a = answers || {}
  const buckets = { pt: [], di: [] }

  for (const item of data.workstyle.prediger) {
    const choice = a.prediger?.[item.id]
    if (choice !== 'a' && choice !== 'b') continue
    const side = item[choice]?.side
    if (!side) continue
    buckets[item.axis]?.push(POSITIVE_SIDES.has(side) ? 1 : -1)
  }

  return {
    /** +1 insan ↔ −1 nesne */
    peopleThings: mean(buckets.pt),
    /** +1 fikir ↔ −1 veri */
    dataIdeas: mean(buckets.di),
    answered: { peopleThings: buckets.pt.length, dataIdeas: buckets.di.length },
  }
}

/** Seçilen çalışma ortamı tercihleri — skora girmez, raporda çip olarak gösterilir. */
export function readEnvironment(answers, data) {
  const a = answers || {}
  return data.workstyle.environment
    .map((item) => {
      const choice = a.env?.[item.id]
      if (choice !== 'a' && choice !== 'b') return null
      return { id: item.id, question: item.q, text: item[choice], choice }
    })
    .filter(Boolean)
}
