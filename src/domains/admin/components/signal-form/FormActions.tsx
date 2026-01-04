import { useTranslation } from 'react-i18next'
import { Button } from '../../../../shared/components/ui'

interface FormActionsProps {
  onCancel: () => void
  loading: boolean
  submitLabel?: string
  cancelLabel?: string
}

/**
 * Reusable form actions component with submit and cancel buttons
 */
export function FormActions({
  onCancel,
  loading,
  submitLabel,
  cancelLabel,
}: FormActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={loading}
        className="flex-1"
      >
        {cancelLabel || t('admin.cancel')}
      </Button>
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="flex-1"
      >
        {submitLabel || t('admin.create')}
      </Button>
    </div>
  )
}
