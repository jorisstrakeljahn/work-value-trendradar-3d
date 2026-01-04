import { useTranslation } from 'react-i18next'
import { Button } from '../../../../shared/components/ui'

interface SignalActionsProps {
  onEdit: () => void
  onDelete: () => void
}

/**
 * Signal actions component with Edit and Delete buttons
 */
export function SignalActions({ onEdit, onDelete }: SignalActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50 flex gap-2">
      <Button variant="secondary" onClick={onEdit} className="flex-1">
        {t('admin.edit')}
      </Button>
      <Button
        variant="secondary"
        onClick={onDelete}
        className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        {t('admin.delete')}
      </Button>
    </div>
  )
}
