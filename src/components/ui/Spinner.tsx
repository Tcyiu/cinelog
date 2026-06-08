import clsx from 'clsx'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
  }

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-dark-border border-t-brand-500',
        sizeClasses[size],
      )}
    />
  )
}

export default Spinner
