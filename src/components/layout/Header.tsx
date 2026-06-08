import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, User, LogOut, Search } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import { getTheme, setTheme } from '../../utils/storage'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => getTheme())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarButtonRef = useRef<HTMLButtonElement>(null)

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setThemeState(nextTheme)

    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(nextTheme)
  }

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarButtonRef.current &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const navItems = [
    { label: 'Catalog', path: '/catalog' },
    { label: 'Search', path: '/search' },
    { label: 'Top', path: '/top' },
  ]

  const handleSignOut = () => {
    logout()
    setIsDropdownOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-dark-card/90 border-b border-gray-200 dark:border-dark-border backdrop-blur-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-bold text-xl text-brand-500 tracking-wider hover:opacity-90 transition-opacity"
        >
          CineLog
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-brand-500'
                    : 'text-gray-600 hover:text-gray-900 dark:text-dark-muted dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative hidden md:block">
              <button
                ref={avatarButtonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none rounded-full border-2 border-transparent hover:border-brand-500 transition-colors"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-xl py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-border">
                    <p className="text-xs text-gray-500 dark:text-dark-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.username}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-gray-950 dark:hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500 dark:text-dark-muted" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-surface hover:text-red-700 dark:hover:text-red-400 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {[
              { to: '/catalog', label: 'Catalog' },
              { to: '/search', label: 'Search' },
              { to: '/top', label: 'Top' },
              ...(isAuthenticated
                ? [
                    { to: '/list', label: 'My List' },
                    { to: '/profile', label: 'Profile' },
                    { to: '/compare', label: 'Compare' },
                  ]
                : []),
            ].map(link => (
              <button
                key={link.to}
                onClick={() => {
                  navigate(link.to)
                  setMobileMenuOpen(false)
                }}
                className={clsx(
                  'text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface'
                )}
              >
                {link.label}
              </button>
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
                className="mt-2 w-full bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Sign In
              </button>
            )}
            {isAuthenticated && user && (
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="mt-2 w-full border border-gray-200 dark:border-dark-border text-red-600 dark:text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-dark-surface"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
