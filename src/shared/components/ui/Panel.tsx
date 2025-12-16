import { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
}

/**
 * Base panel component with consistent styling
 */
export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  )
}

