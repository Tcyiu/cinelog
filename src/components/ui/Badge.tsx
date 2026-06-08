import clsx from 'clsx'

export interface BadgeProps {
  label: string
  variant?: 'type' | 'genre' | 'status'
  className?: string
}

const Badge = ({ label, variant = 'genre', className }: BadgeProps) => {
  // To make sure it looks beautiful under both dark and light modes,
  // we should be careful. Under light mode:
  // - type: bg-brand-500/10 text-brand-600
  // - genre: bg-gray-100 text-gray-600 border border-gray-200
  // - status: bg-green-100 text-green-700
  // Let's refine colors to support both themes beautifully:
  const themeVariants = {
    type: 'bg-black/60 text-white border border-brand-400/40 backdrop-blur-sm',
    genre: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-dark-surface dark:text-dark-muted dark:border-dark-border/40',
    status: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
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
