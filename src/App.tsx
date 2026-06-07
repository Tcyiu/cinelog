import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { getTheme } from './utils/storage'

function App() {
  useEffect(() => {
    const theme = getTheme()
    const root = document.documentElement

    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [])

  return <AppRouter />
}

export default App
