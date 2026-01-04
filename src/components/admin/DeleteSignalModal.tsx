import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../../shared/components/ui'
import type { Signal } from '../../types/signal'

interface DeleteSignalModalProps {
  isOpen: boolean
  onClose: () => void
  signal: Signal | null
  onConfirm: () => Promise<void>
  loading?: boolean
}

/**
 * Modal for confirming signal deletion
 */
export default function DeleteSignalModal({
  isOpen,
  onClose,
  signal,
  onConfirm,
  loading = false,
}: DeleteSignalModalProps) {
  const { t } = useTranslation()

  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // Error is handled by parent component
    }
  }

  if (!signal) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('admin.deleteSignal')}>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {t('admin.messages.deleteConfirm')}
        </p>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{signal.title}</p>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400">
          {t('admin.messages.deleteConfirmWarning')}
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {t('admin.cancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {loading ? '...' : t('admin.delete')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
