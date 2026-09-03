import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { strings } from '../strings.pl'
import { useAuth } from '../hooks/useAuth'
import { PageHeader } from '../components/PageHeader'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(passphrase)
    if (error) {
      setError(strings.auth.loginError)
      setSubmitting(false)
      return
    }
    navigate('/')
  }

  return (
    <main className="mx-auto max-w-md p-4">
      <PageHeader backTo="/" />
      <h1 className="mb-4 text-2xl font-semibold">{strings.auth.loginTitle}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          autoFocus
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder={strings.auth.passphrasePlaceholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600"
        />

        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !passphrase}
          className="rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {strings.auth.submit}
        </button>
      </form>
    </main>
  )
}
