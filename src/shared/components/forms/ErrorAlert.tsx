import { ReactNode } from 'react'

interface ErrorAlertProps {
  message: string | ReactNode
  className?: string
}

/**
 * Reusable error alert component for form validation errors
 */
export function ErrorAlert({ message, className = '' }: ErrorAlertProps) {
  return (
    <div
      className={`p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 ${className}`}
    >
      {message}
    </div>
  )
}
