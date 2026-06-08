import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import PageTransition from './PageTransition'
import ScrollToTop from './ScrollToTop'
import { BackToTop } from '../ui'

const Layout = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-white flex flex-col transition-colors duration-200">
        <ScrollToTop />
        <main className="flex-1 flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-white flex flex-col transition-colors duration-200">
      <ScrollToTop />
      <Header />
      <main className="flex-1 flex flex-col">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Layout
