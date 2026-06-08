import clsx from 'clsx'
import type { MediaStatus } from '../../types'

export interface BadgeProps {
  label: string
  variant?: 'type' | 'genre' | 'status'
  status?: MediaStatus
  className?: string
}

const Badge = ({ label, variant = 'genre', status, className }: BadgeProps) => {
  // Status-specific colors
  const getStatusColor = (s: MediaStatus) => {
    switch (s) {
      case 'finished':
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
      case 'ongoing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
      case 'announced':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
    }
  }

  const themeVariants = {
    type: 'bg-black/60 text-white border border-brand-400/40 backdrop-blur-sm',
    genre: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-dark-surface dark:text-dark-muted dark:border-dark-border/40',
    status: status ? getStatusColor(status) : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-colors',
        themeVariants[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}

export default Badge
