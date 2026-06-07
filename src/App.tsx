import { useEffect } from 'react'
import { getTheme } from './utils/storage'

function App() {
  useEffect(() => {
    const theme = getTheme()
    const root = document.documentElement

    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center text-2xl font-semibold tracking-normal">
        CineLog - coming soon
      </div>
    </main>
  )
}

export default App
