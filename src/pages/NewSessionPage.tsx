import { strings } from '../strings.pl'

export function NewSessionPage() {
  return (
    <main className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">{strings.newSession.title}</h1>
      <p className="text-slate-500">TODO: Phase 3 — session name, create Leg 1, participant picker.</p>
    </main>
  )
}
