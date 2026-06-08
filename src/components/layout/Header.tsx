import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, User, LogOut, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getTheme, setTheme } from '../../utils/storage'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => getTheme())
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const avatarButtonRef = useRef<HTMLButtonElement>(null)

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    setThemeState(nextTheme)
    
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(nextTheme)
  }

  // Handle click outside dropdown
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

  // Navigation config
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
        {/* Left: Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link
            to="/"
            className="font-bold text-xl text-brand-500 tracking-wider hover:opacity-90 transition-opacity"
          >
            CineLog
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
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

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors text-gray-500 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
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

          {/* Auth Button/Dropdown */}
          {isAuthenticated && user ? (
            <div className="relative">
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

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-xl py-1 z-50 transition-all transform origin-top-right animate-in fade-in slide-in-from-top-1 duration-100"
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
              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 space-y-2 transition-all duration-300">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'text-gray-600 hover:text-gray-900 dark:text-dark-muted dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}

export default Header
