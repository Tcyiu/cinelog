import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  return (
    <div key={location.key} className="flex-1 flex flex-col animate-fade-in-up">
      {children}
    </div>
  )
}

export default PageTransition
