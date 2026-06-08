import { useEffect } from 'react'

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} — CineLog` : 'CineLog'
    return () => {
      document.title = 'CineLog'
    }
  }, [title])
}

export default usePageTitle
