import { useState } from 'react'
import { strings } from '../strings.pl'

interface ShareButtonProps {
  text: string
}

export function ShareButton({ text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // user cancelled or the share sheet failed — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-lg bg-slate-700 px-4 py-3 font-medium text-white"
    >
      {copied ? strings.common.copied : strings.summary.copyShare}
    </button>
  )
}
