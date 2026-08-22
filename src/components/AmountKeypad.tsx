import { useState } from 'react'
import { strings } from '../strings.pl'
import { round2 } from '../lib/calculations'

interface AmountKeypadProps {
  open: boolean
  onCancel: () => void
  onConfirm: (amount: number) => void
}

export function AmountKeypad({ open, onCancel, onConfirm }: AmountKeypadProps) {
  const [value, setValue] = useState('')

  if (!open) return null

  const amount = parseFloat(value.replace(',', '.'))
  const isValid = !Number.isNaN(amount) && amount > 0

  function handleConfirm() {
    if (!isValid) return
    onConfirm(round2(amount))
    setValue('')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-4 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-lg font-semibold">{strings.buyIns.customAmount}</h2>
        <input
          autoFocus
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-3 text-2xl"
          placeholder="0"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg bg-slate-200 px-4 py-3 font-medium text-slate-900"
          >
            {strings.common.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
