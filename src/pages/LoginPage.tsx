import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isLoggedIn = login(username, password)

    if (!isLoggedIn) {
      setError('Please enter username and password')
      return
    }

    setError('')
    navigate('/')
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">CineLog</h1>
          <p className="mt-2 text-sm text-gray-400">
            Track everything you watch
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-200"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-2.5 text-gray-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-2.5 text-gray-100 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
              id="password"
              minLength={1}
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            className="w-full rounded-lg bg-brand-500 py-2.5 font-semibold text-white transition hover:bg-brand-600"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Any username and password will work
        </p>
      </section>
    </main>
  )
}

export default LoginPage
