import { useState } from 'react'
import { strings } from '../strings.pl'
import { usePlayers } from '../hooks/usePlayers'
import { PlayerListItem } from '../components/PlayerListItem'
import { BackButton } from '../components/BackButton'

export function PlayersPage() {
  const { players, loading, error, add, archive } = usePlayers()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const activePlayers = players.filter((p) => !p.is_archived)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await add(trimmed)
      setName('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <BackButton />
      <h1 className="mb-4 text-2xl font-semibold">{strings.players.title}</h1>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={strings.players.namePlaceholder}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {strings.players.addPlayer}
        </button>
      </form>

      {loading && <p className="text-slate-500">{strings.common.loading}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <ul className="flex flex-col gap-2">
        {activePlayers.map((player) => (
          <PlayerListItem key={player.id} player={player} onArchive={archive} />
        ))}
      </ul>
    </main>
  )
}
