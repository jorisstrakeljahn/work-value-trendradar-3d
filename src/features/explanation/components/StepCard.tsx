import { ReactNode } from 'react'

interface StepCardProps {
  stepNumber: number
  children: ReactNode
}

/**
 * Reusable card component for step-by-step instructions
 */
export function StepCard({ stepNumber, children }: StepCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
          {stepNumber}
        </span>
      </div>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  )
}

