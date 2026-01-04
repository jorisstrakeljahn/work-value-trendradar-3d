import { ReactNode } from 'react'

interface InfoRowProps {
  label: string
  value: string | ReactNode
  align?: 'start' | 'center'
  className?: string
}

/**
 * Reusable info row component for key-value pairs
 * Used in SignalDetailsPanel, etc.
 */
export function InfoRow({
  label,
  value,
  align = 'center',
  className = '',
}: InfoRowProps) {
  return (
    <div className={`flex items-${align} gap-2 ${className}`}>
      <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
        {label}
      </span>
      <span className="text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  )
}
