import { ReactNode } from 'react'

interface FormSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Form section with title and divider
 * Used to categorize form fields
 */
export function FormSection({
  title,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <div className={className}>
      {title && (
        <>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h3>
          <div className="mb-4 border-t border-gray-200 dark:border-gray-700"></div>
        </>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  )
}
