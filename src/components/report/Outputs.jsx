/* Çıktılar — docs/PRD.md §6: PDF (print), panoya kopyalama, bağlantıyla paylaşım.
 *
 * Hiçbiri ağ kullanmaz: yazdırma tarayıcının kendi motoru, paylaşım ise veriyi URL hash'ine
 * gömer. Sunucuya hiçbir şey gitmez.
 */

import React, { useState } from 'react'
import { Printer, ClipboardCopy, Link2, Check, AlertTriangle } from 'lucide-react'
import { DATA } from '../../data/index.js'
import { tr } from '../../i18n/tr.js'
import { Button } from '../ui/primitives.jsx'
import { buildExportText, copyToClipboard } from '../../report/exportText.js'
import { buildShareUrl } from '../../state/shareLink.js'

export function Outputs({ answers, results, name, onNameChange }) {
  const [copyState, setCopyState] = useState(null)
  const [shareState, setShareState] = useState(null)

  const share = buildShareUrl(answers, DATA, window.location.href)

  const onCopy = async () => {
    const ok = await copyToClipboard(buildExportText(answers, results))
    setCopyState(ok ? 'done' : 'failed')
    window.setTimeout(() => setCopyState(null), 4000)
  }

  const onShare = async () => {
    if (share.tooLong) return
    const ok = await copyToClipboard(share.url)
    setShareState(ok ? 'done' : 'failed')
    window.setTimeout(() => setShareState(null), 4000)
  }

  return (
    <div className="outputs no-print">
      <h4>{tr.report.outputsTitle}</h4>

      {/* İsim raporun başlığına yazılır. Kişisel veri değil, isteğe bağlı bir etikettir:
          yalnızca localStorage'da kalır, paylaşım bağlantısına ve panoya kopyalanan döküme girmez. */}
      <p className="name-field">
        <label htmlFor="report-name">{tr.report.namePrompt}</label>
        <input
          id="report-name"
          type="text"
          value={name}
          maxLength={40}
          placeholder={tr.report.namePlaceholder}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </p>

      <div className="output-row">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={18} aria-hidden="true" /> {tr.report.print}
        </Button>
        <p className="hint">{tr.report.printHint}</p>
      </div>

      <div className="output-row">
        <Button variant="secondary" onClick={onCopy}>
          {copyState === 'done' ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <ClipboardCopy size={18} aria-hidden="true" />
          )}
          {copyState === 'done' ? tr.report.copyDone : tr.report.copy}
        </Button>
        <p className="hint">{copyState === 'failed' ? tr.report.copyFailed : tr.report.copyHint}</p>
      </div>

      <div className="output-row">
        <Button variant="secondary" onClick={onShare} disabled={share.tooLong}>
          {shareState === 'done' ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <Link2 size={18} aria-hidden="true" />
          )}
          {shareState === 'done' ? tr.report.shareDone : tr.report.share}
        </Button>
        <p className="hint">
          {share.tooLong ? (
            <>
              <AlertTriangle size={14} aria-hidden="true" /> {tr.report.shareTooLong}
            </>
          ) : (
            <>
              {tr.report.shareHint} {tr.report.shareNoServer}
            </>
          )}
        </p>
      </div>

      <p className="hint" role="status" aria-live="polite">
        {copyState === 'done' ? tr.report.copyDone : null}
        {shareState === 'done' ? tr.report.shareDone : null}
      </p>
    </div>
  )
}
