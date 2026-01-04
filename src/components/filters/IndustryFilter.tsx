import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { Button, ConfirmModal, AlertModal } from '../../shared/components/ui'
import { useIndustries } from '../../shared/hooks/useIndustries'
import { useAuthStore } from '../../store/useAuthStore'
import { deleteIndustry, isIndustryInUse } from '../../firebase/services/industriesService'
import CreateIndustryModal from '../admin/CreateIndustryModal'
import { IndustryItem } from './IndustryItem'

interface IndustryFilterProps {
  selectedIndustryIds: string[]
  onSelectionChange: (industryIds: string[]) => void
}

/**
 * Industry filter component with selection and deletion logic
 */
export function IndustryFilter({
  selectedIndustryIds,
  onSelectionChange,
}: IndustryFilterProps) {
  const { t } = useTranslation()
  const industries = useIndustries()
  const { user } = useAuthStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deletingIndustryId, setDeletingIndustryId] = useState<string | null>(null)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean
    industryId: string
    industryName: string
  }>({ isOpen: false, industryId: '', industryName: '' })
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({ isOpen: false, title: '', message: '' })

  const toggleIndustry = (industryId: string) => {
    if (selectedIndustryIds.includes(industryId)) {
      onSelectionChange(selectedIndustryIds.filter(id => id !== industryId))
    } else {
      onSelectionChange([...selectedIndustryIds, industryId])
    }
  }

  const handleDeleteClick = async (industryId: string, industryName: string) => {
    if (!user) return

    const inUse = await isIndustryInUse(industryId)
    if (inUse) {
      setErrorModal({
        isOpen: true,
        title: t('admin.industries.deleteErrorTitle'),
        message: t('admin.industries.deleteErrorInUse', { name: industryName }),
      })
      return
    }

    setConfirmDeleteModal({
      isOpen: true,
      industryId,
      industryName,
    })
  }

  const handleConfirmDelete = async () => {
    const { industryId } = confirmDeleteModal
    setDeletingIndustryId(industryId)
    setConfirmDeleteModal({ isOpen: false, industryId: '', industryName: '' })

    try {
      await deleteIndustry(industryId)
      if (selectedIndustryIds.includes(industryId)) {
        onSelectionChange(selectedIndustryIds.filter(id => id !== industryId))
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: t('admin.industries.deleteErrorTitle'),
        message: t('admin.industries.deleteError'),
      })
    } finally {
      setDeletingIndustryId(null)
    }
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('filter.industries')}
          </h3>
          {user && (
            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              variant="secondary"
              className="h-7 w-7 p-0 flex items-center justify-center min-w-[28px] text-gray-700 dark:text-gray-300 font-bold text-lg leading-none"
              title={t('admin.industries.createTitle')}
            >
              <Plus
                className="w-3 h-3 flex-shrink-0"
                strokeWidth={3}
                stroke="currentColor"
                fill="none"
                style={{ pointerEvents: 'none' }}
              />
            </Button>
          )}
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {industries.map((industry) => (
            <IndustryItem
              key={industry.id}
              industry={industry}
              isSelected={selectedIndustryIds.includes(industry.id)}
              isDeleting={deletingIndustryId === industry.id}
              onToggle={() => toggleIndustry(industry.id)}
              onDelete={() => handleDeleteClick(industry.id, industry.name)}
              showDeleteButton={!!user}
            />
          ))}
        </div>
      </div>

      <CreateIndustryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ isOpen: false, industryId: '', industryName: '' })}
        onConfirm={handleConfirmDelete}
        title={t('admin.industries.deleteConfirmTitle')}
        message={t('admin.industries.deleteConfirm', { name: confirmDeleteModal.industryName })}
        confirmText={t('admin.industries.delete')}
        cancelText={t('common.cancel')}
        variant="danger"
        loading={deletingIndustryId === confirmDeleteModal.industryId}
      />

      <AlertModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, title: '', message: '' })}
        title={errorModal.title}
        message={errorModal.message}
        variant="error"
        buttonText={t('common.close')}
      />
    </>
  )
}
