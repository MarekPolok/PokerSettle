import { useState } from 'react'
import { formatCurrency } from '../lib/format'
import type { BuyIn } from '../types'

interface LedgerEntryListProps {
  entries: BuyIn[]
  onEdit: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function LedgerEntryList({ entries, onEdit, onDelete }: LedgerEntryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(entry: BuyIn) {
    setEditingId(entry.id)
    setEditValue(String(entry.amount))
  }

  function commitEdit(id: string) {
    const amount = parseFloat(editValue.replace(',', '.'))
    if (!Number.isNaN(amount) && amount > 0) {
      onEdit(id, amount)
    }
    setEditingId(null)
  }

  return (
    <ul className="mt-2 flex flex-col gap-1 border-t border-slate-100 pt-2">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between text-sm">
          {editingId === entry.id ? (
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              step="0.01"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => commitEdit(entry.id)}
              onKeyDown={(e) => e.key === 'Enter' && commitEdit(entry.id)}
              className="w-24 rounded border border-slate-300 px-2 py-1"
            />
          ) : (
            <button
              type="button"
              onClick={() => startEdit(entry)}
              className="text-slate-700 underline decoration-dotted"
            >
              {formatCurrency(entry.amount)}
            </button>
          )}
          <button type="button" onClick={() => onDelete(entry.id)} className="px-2 text-red-600">
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
