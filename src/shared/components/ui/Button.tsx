import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon'
  children: ReactNode
  loading?: boolean
}

/**
 * Reusable button component with consistent styling
 */
export function Button({
  variant = 'primary',
  children,
  className = '',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const baseClasses =
    'rounded-full transition-all duration-200 border border-gray-200/50 dark:border-gray-600/50' +
    (isDisabled ? ' opacity-50 cursor-not-allowed' : ' hover:scale-105')

  const variantClasses = {
    primary:
      'px-4 py-2.5 text-sm font-medium glass text-gray-700 dark:text-gray-200 shadow-apple' +
      (isDisabled ? '' : ' hover:shadow-apple-lg'),
    secondary:
      'px-4 py-2.5 text-sm font-medium bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md text-gray-700 dark:text-gray-300' +
      (isDisabled ? '' : ' hover:shadow-lg'),
    icon:
      'flex items-center justify-center w-10 h-10 p-0 bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md [&>svg]:w-[20px] [&>svg]:h-[20px]' +
      (isDisabled ? '' : ' hover:shadow-lg'),
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
