import { ReactNode } from 'react'

interface SuccessAlertProps {
  message: string | ReactNode
  className?: string
}

/**
 * Reusable success alert component for success messages
 */
export function SuccessAlert({ message, className = '' }: SuccessAlertProps) {
  return (
    <div
      className={`p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400 ${className}`}
    >
      {message}
    </div>
  )
}
