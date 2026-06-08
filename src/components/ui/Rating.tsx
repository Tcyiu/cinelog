import { Star } from 'lucide-react'
import clsx from 'clsx'

export interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Rating = ({ value, count, size = 'md', className }: RatingProps) => {
  const getRatingColor = (val: number) => {
    if (val >= 8) return 'text-yellow-400'
    if (val >= 6) return 'text-orange-400'
    return 'text-red-400'
  }

  const sizes = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      count: 'text-[10px]',
      gap: 'gap-1',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      count: 'text-xs',
      gap: 'gap-1.5',
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-base font-semibold',
      count: 'text-sm',
      gap: 'gap-2',
    },
  }

  const colorClass = getRatingColor(value)
  const currentSize = sizes[size]

  return (
    <div className={clsx('flex items-center', currentSize.gap, className)}>
      <div className={clsx('flex items-center gap-0.5', colorClass)}>
        <Star className={currentSize.icon} fill="currentColor" />
        <span className={clsx('font-medium', currentSize.text)}>
          {value.toFixed(1)}
        </span>
      </div>
      {count !== undefined && (
        <span className={clsx('text-dark-muted', currentSize.count)}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

export default Rating
