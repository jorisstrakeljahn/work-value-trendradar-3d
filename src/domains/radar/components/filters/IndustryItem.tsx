import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Industry } from '../../../../types/signal'

interface IndustryItemProps {
  industry: Industry
  isSelected: boolean
  isDeleting: boolean
  onToggle: () => void
  onDelete: () => void
  showDeleteButton: boolean
}

/**
 * Individual industry item with checkbox and delete button
 */
export function IndustryItem({
  industry,
  isSelected,
  isDeleting,
  onToggle,
  onDelete,
  showDeleteButton,
}: IndustryItemProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-150 group">
      <label className="flex items-center gap-3 cursor-pointer flex-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
        />
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: industry.color }}
        />
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {industry.name}
        </span>
      </label>
      {showDeleteButton && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 disabled:opacity-50"
          title={t('admin.industries.deleteTitle')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
