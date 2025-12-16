import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon'
  children: ReactNode
}

/**
 * Reusable button component with consistent styling
 */
export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'rounded-full transition-all duration-200 hover:scale-105 border border-gray-200/50 dark:border-gray-600/50'

  const variantClasses = {
    primary:
      'px-4 py-2.5 text-sm font-medium glass text-gray-700 dark:text-gray-200 shadow-apple hover:shadow-apple-lg',
    secondary:
      'px-4 py-2.5 text-sm font-medium bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300',
    icon: 'flex items-center justify-center w-10 h-10 p-0 bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md hover:shadow-lg [&>svg]:w-[20px] [&>svg]:h-[20px]',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

