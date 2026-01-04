import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

/**
 * Reusable select dropdown component with consistent styling
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className = '', disabled = false, children, ...props }, ref) => {
    const baseClasses =
      'w-full px-4 py-2 rounded-lg border bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 outline-none transition-colors'
    const stateClasses = error
      ? 'border-red-300 dark:border-red-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-400'
      : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400'
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

    return (
      <select
        ref={ref}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
