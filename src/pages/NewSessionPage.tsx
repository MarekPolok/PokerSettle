import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { strings } from '../strings.pl'
import { PlayerMultiSelect } from '../components/PlayerMultiSelect'
import { createSession } from '../api/sessions'
import { PageHeader } from '../components/PageHeader'

export function NewSessionPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || selectedIds.length === 0) return
    setSubmitting(true)
    setError(null)
    try {
      const { session, leg } = await createSession(trimmed, selectedIds)
      navigate(`/sessions/${session.id}/legs/${leg.id}/buy-ins`)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <PageHeader backTo="/" />
      <h1 className="mb-4 text-2xl font-semibold">{strings.newSession.title}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {strings.newSession.sessionNameLabel}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={strings.newSession.sessionNamePlaceholder}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600"
          />
        </div>

        <PlayerMultiSelect selectedIds={selectedIds} onChange={setSelectedIds} />

        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !name.trim() || selectedIds.length === 0}
          className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {strings.newSession.start}
        </button>
      </form>
    </main>
  )
}
