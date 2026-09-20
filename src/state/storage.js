/* localStorage kalıcılığı.
 *
 * Tek depolama yeri burasıdır ve yalnızca bu cihazda kalır — hiçbir şey sunucuya gitmez.
 * Gizli sekmede ya da depolama kapalıyken localStorage erişimi istisna fırlatabilir;
 * bu durumda uygulama çalışmaya devam eder, yalnızca "kaydedilemedi" durumunu bildirir.
 */

export const STORAGE_KEY = 'future-fit:v2'

/** Depolama gerçekten kullanılabilir mi? (gizli sekme / kapalı çerezler) */
export function storageAvailable() {
  try {
    const probe = STORAGE_KEY + ':probe'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 2) return null
    return parsed
  } catch {
    return null
  }
}

export function saveState({ answers, step, name }) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, savedAt: new Date().toISOString(), answers, step, name }),
    )
    return true
  } catch {
    return false
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
