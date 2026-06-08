const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-bold text-brand-500 text-lg tracking-wider">
          CineLog
        </span>
        <span className="text-dark-muted text-sm text-center sm:text-left">
          Track everything you watch
        </span>
        <span className="text-dark-muted text-sm">
          &copy; 2024 CineLog
        </span>
      </div>
    </footer>
  )
}

export default Footer
