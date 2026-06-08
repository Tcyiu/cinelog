import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg shadow-brand-500/30 transition-all duration-300 hover:scale-110"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

export default BackToTop
