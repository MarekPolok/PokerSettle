import { useState } from 'react'
import { strings } from '../strings.pl'
import { formatCurrency } from '../lib/format'
import { sumBuyIns } from '../lib/calculations'
import { LedgerEntryList } from './LedgerEntryList'
import { AmountKeypad } from './AmountKeypad'
import type { BuyIn, Player } from '../types'

interface BuyInRowProps {
  player: Player
  buyIns: BuyIn[]
  onLog: (playerId: string, amount: number) => void
  onEdit: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function BuyInRow({ player, buyIns, onLog, onEdit, onDelete }: BuyInRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [keypadOpen, setKeypadOpen] = useState(false)

  const playerBuyIns = buyIns.filter((b) => b.player_id === player.id)
  const total = sumBuyIns(playerBuyIns)

  return (
    <li className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">{player.name}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm text-slate-500 underline decoration-dotted dark:text-slate-400"
          >
            {strings.buyIns.totalForPlayer}: {formatCurrency(total)}
          </button>
        </div>
        <div className="flex gap-2">
          {strings.buyIns.quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onLog(player.id, amount)}
              className="rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white"
            >
              +{amount}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setKeypadOpen(true)}
            className="rounded-lg bg-slate-700 px-3 py-2 font-medium text-white dark:bg-slate-600"
          >
            {strings.buyIns.customAmount}
          </button>
        </div>
      </div>

      {expanded && <LedgerEntryList entries={playerBuyIns} onEdit={onEdit} onDelete={onDelete} />}

      <AmountKeypad
        open={keypadOpen}
        onCancel={() => setKeypadOpen(false)}
        onConfirm={(amount) => {
          onLog(player.id, amount)
          setKeypadOpen(false)
        }}
      />
    </li>
  )
}
