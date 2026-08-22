import { useState } from 'react'
import { usePlayers } from '../hooks/usePlayers'
import { strings } from '../strings.pl'

interface PlayerMultiSelectProps {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function PlayerMultiSelect({ selectedIds, onChange }: PlayerMultiSelectProps) {
  const { players, loading, error, add } = usePlayers()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  const activePlayers = players.filter((p) => !p.is_archived)

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  async function handleAddNew() {
    const trimmed = newName.trim()
    if (!trimmed) return
    setAdding(true)
    try {
      const player = await add(trimmed)
      onChange([...selectedIds, player.id])
      setNewName('')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      {loading && <p className="text-slate-500">{strings.common.loading}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="mb-3 flex flex-col gap-2">
        {activePlayers.map((player) => (
          <li key={player.id}>
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedIds.includes(player.id)}
                onChange={() => toggle(player.id)}
                className="h-5 w-5"
              />
              <span className="font-medium">{player.name}</span>
            </label>
          </li>
        ))}
      </ul>

      {/* A plain div, not a <form> — this can be nested inside a parent <form>
          (e.g. NewSessionPage), and nested <form> elements are invalid HTML
          that browsers handle unpredictably (submitting the wrong form). */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAddNew()
            }
          }}
          placeholder={strings.players.namePlaceholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={handleAddNew}
          disabled={adding || !newName.trim()}
          className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {strings.players.addPlayer}
        </button>
      </div>
    </div>
  )
}
