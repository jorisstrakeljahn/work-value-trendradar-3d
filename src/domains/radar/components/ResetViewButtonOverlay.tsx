import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../../shared/components/ui'
import { useAuthStore } from '../../../store/useAuthStore'
import SignalFormModal from '../../admin/components/SignalFormModal'

export default function ResetViewButtonOverlay() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const resetCamera = () => {
    const resetFn = (window as { __resetRadarCamera?: () => void })
      .__resetRadarCamera
    if (resetFn) {
      resetFn()
    }
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        {user && (
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            {t('admin.createSignal')}
          </Button>
        )}
        <Button onClick={resetCamera}>{t('resetView.button')}</Button>
      </div>

      <SignalFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false)
        }}
      />
    </>
  )
}
