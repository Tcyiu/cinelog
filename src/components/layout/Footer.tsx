import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-bold text-xl text-brand-500">CineLog</p>
            <p className="text-gray-600 dark:text-dark-muted text-sm mt-1">Track everything you watch</p>
          </div>

          <div className="flex gap-6">
            {[
              { to: '/catalog', label: 'Catalog' },
              { to: '/top', label: 'Top Rated' },
              { to: '/search', label: 'Search' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-gray-600 dark:text-dark-muted text-sm">© 2024 CineLog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
