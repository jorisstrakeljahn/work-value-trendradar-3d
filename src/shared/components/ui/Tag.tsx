interface TagProps {
  children: string
  className?: string
}

/**
 * Reusable tag/badge component
 */
export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

