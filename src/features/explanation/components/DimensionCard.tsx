import { ReactNode } from 'react'

interface DimensionCardProps {
  title: string
  description: string
  borderColor: string
  children?: ReactNode
}

/**
 * Reusable card component for dimension explanations
 */
export function DimensionCard({
  title,
  description,
  borderColor,
  children,
}: DimensionCardProps) {
  return (
    <div className={`pl-6 border-l-4 ${borderColor}`}>
      <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h4>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
      {children && (
        <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
          {children}
        </ul>
      )}
    </div>
  )
}

