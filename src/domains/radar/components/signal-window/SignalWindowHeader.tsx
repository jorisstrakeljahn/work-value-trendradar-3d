import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface SignalWindowHeaderProps {
  title: string
  onClose: () => void
  isDraggable?: boolean
}

/**
 * Header component for signal windows
 * Displays title and close button
 */
export function SignalWindowHeader({
  title,
  onClose,
  isDraggable = true,
}: SignalWindowHeaderProps) {
  const { t } = useTranslation()

  return (
    <div
      className={`window-header flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${
        isDraggable ? 'cursor-move' : ''
      }`}
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
        {title}
      </h3>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={t('signalWindows.close')}
        title={t('signalWindows.close')}
      >
        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  )
}

