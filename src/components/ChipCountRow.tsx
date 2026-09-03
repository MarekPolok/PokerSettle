import { useEffect, useState } from 'react'
import { strings } from '../strings.pl'
import type { CashOut, Player } from '../types'

interface ChipCountRowProps {
  player: Player
  cashOut: CashOut | undefined
  onChange: (playerId: string, amount: number) => void
}

export function ChipCountRow({ player, cashOut, onChange }: ChipCountRowProps) {
  const [value, setValue] = useState(cashOut ? String(cashOut.chip_amount) : '')

  useEffect(() => {
    setValue(cashOut ? String(cashOut.chip_amount) : '')
  }, [cashOut?.chip_amount])

  function commit() {
    const amount = parseFloat(value.replace(',', '.'))
    if (!Number.isNaN(amount) && amount >= 0) {
      onChange(player.id, amount)
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div>
        <p className="font-medium">{player.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{strings.chipCount.howManyChips}</p>
      </div>
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && commit()}
        className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right dark:border-slate-600"
        placeholder="0"
      />
    </li>
  )
}
