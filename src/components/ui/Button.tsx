import React from 'react'
import clsx from 'clsx'
import Spinner from './Spinner'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-brand-500 hover:bg-brand-600 text-white',
      secondary:
        'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 dark:bg-dark-surface dark:hover:bg-dark-card dark:text-white dark:border-dark-border',
      ghost: 'hover:bg-dark-surface text-dark-muted hover:text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const spinnerSize = size === 'lg' ? 'md' : 'sm'

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Spinner size={spinnerSize} />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
