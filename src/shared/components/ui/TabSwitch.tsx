interface TabSwitchProps<T extends string> {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

/**
 * Tab-style switch component with rounded corners and divider line
 * Similar to iOS segmented control
 */
export function TabSwitch<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  className = '',
}: TabSwitchProps<T>) {
  if (options.length !== 2) {
    console.warn('TabSwitch expects exactly 2 options')
  }

  return (
    <div
      className={`inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] p-1 ${className}`}
      role="tablist"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value
        const isFirst = index === 0
        const isLast = index === options.length - 1

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={`
              relative px-4 py-2 text-sm font-medium transition-all duration-200
              ${isFirst ? 'rounded-l-md' : ''}
              ${isLast ? 'rounded-r-md' : ''}
              ${!isFirst ? 'border-l border-gray-200 dark:border-gray-700' : ''}
              ${
                isSelected
                  ? 'bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
