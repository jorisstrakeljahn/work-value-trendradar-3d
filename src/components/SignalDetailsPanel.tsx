import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Panel } from '../shared/components/ui'
import { useRadarStore } from '../store/useRadarStore'
import { useAuthStore } from '../store/useAuthStore'
import SignalFormModal from './admin/SignalFormModal'
import DeleteSignalModal from './admin/DeleteSignalModal'
import { deleteSignal } from '../firebase/services/signalsService'
import {
  SignalHeader,
  SignalInfo,
  ValueDimensionsDisplay,
  SignalTags,
  SignalActions,
} from './signal-details'

export default function SignalDetailsPanel() {
  const { t } = useTranslation()
  const { selectedSignal } = useRadarStore()
  const { user } = useAuthStore()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!selectedSignal) {
    return (
      <Panel className="w-80 p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {t('signalDetails.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('signalDetails.clickToSee')}
        </p>
      </Panel>
    )
  }

  return (
    <Panel className="w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="p-6 space-y-5">
        <SignalHeader signal={selectedSignal} />
        <SignalInfo signal={selectedSignal} />
        <ValueDimensionsDisplay valueDimensions={selectedSignal.valueDimensions} />
        <SignalTags tags={selectedSignal.tags} />

        {user && (
          <SignalActions
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}
      </div>

      <SignalFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        signal={selectedSignal || undefined}
        onSuccess={() => {
          setShowEditModal(false)
        }}
      />

      <DeleteSignalModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        signal={selectedSignal}
        loading={deleting}
        onConfirm={async () => {
          if (!selectedSignal?.id) return
          setDeleting(true)
          try {
            await deleteSignal(selectedSignal.id)
            setShowDeleteModal(false)
          } catch (error) {
            console.error('Error deleting signal:', error)
            throw error
          } finally {
            setDeleting(false)
          }
        }}
      />
    </Panel>
  )
}
