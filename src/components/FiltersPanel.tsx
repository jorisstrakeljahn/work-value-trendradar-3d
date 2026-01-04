import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { CollapsiblePanel, Button, ConfirmModal, AlertModal } from '../shared/components/ui'
import { useRadarStore } from '../store/useRadarStore'
import { useIndustries } from '../shared/hooks/useIndustries'
import { useAuthStore } from '../store/useAuthStore'
import { deleteIndustry, isIndustryInUse } from '../firebase/services/industriesService'
import CreateIndustryModal from './admin/CreateIndustryModal'

export default function FiltersPanel() {
  const { t } = useTranslation()
  const { filters, setFilters } = useRadarStore()
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
    const currentIndustries = filters.industries || []
    if (currentIndustries.includes(industryId)) {
      setFilters({
        industries: currentIndustries.filter(id => id !== industryId),
      })
    } else {
      setFilters({
        industries: [...currentIndustries, industryId],
      })
    }
  }

  const handleDeleteClick = async (industryId: string, industryName: string) => {
    if (!user) return

    // Check if industry is in use
    const inUse = await isIndustryInUse(industryId)
    if (inUse) {
      setErrorModal({
        isOpen: true,
        title: t('admin.industries.deleteErrorTitle'),
        message: t('admin.industries.deleteErrorInUse', { name: industryName }),
      })
      return
    }

    // Show confirm modal
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
      // Remove from filters if selected
      if (filters.industries?.includes(industryId)) {
        setFilters({
          industries: filters.industries.filter(id => id !== industryId),
        })
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
      <CollapsiblePanel title={t('filter.title')} className="w-72">
        <div className="space-y-4">
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
                  <Plus className="w-3 h-3 flex-shrink-0" strokeWidth={3} stroke="currentColor" fill="none" style={{ pointerEvents: 'none' }} />
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {industries.map(industry => {
                const isSelected =
                  filters.industries?.includes(industry.id) ?? false
                const isDeleting = deletingIndustryId === industry.id
                return (
                  <div
                    key={industry.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-150 group"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleIndustry(industry.id)}
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
                    {user && (
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(industry.id, industry.name)}
                        disabled={isDeleting}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 disabled:opacity-50"
                        title={t('admin.industries.deleteTitle')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          {filters.industries && filters.industries.length > 0 && (
            <button
              onClick={() => setFilters({ industries: [] })}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-150"
            >
              {t('filter.resetAll')}
            </button>
          )}
        </div>
      </CollapsiblePanel>

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
