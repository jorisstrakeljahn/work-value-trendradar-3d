import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CollapsiblePanel } from '../../../shared/components/ui'
import { useRadarStore } from '../../../store/useRadarStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { IndustryFilter } from './filters'
import CreateIndustryModal from '../../admin/components/CreateIndustryModal'

interface FiltersPanelProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function FiltersPanel({
  isCollapsed,
  onToggle,
}: FiltersPanelProps) {
  const { t } = useTranslation()
  const { filters, setFilters } = useRadarStore()
  const { user } = useAuthStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <>
      <CollapsiblePanel
        title={t('filter.title')}
        className="w-72"
        isCollapsed={isCollapsed}
        onToggle={onToggle}
      >
        <div className="space-y-4">
          <IndustryFilter
            selectedIndustryIds={filters.industries || []}
            onSelectionChange={industryIds =>
              setFilters({ industries: industryIds })
            }
            onCreateIndustryClick={
              user ? () => setIsCreateModalOpen(true) : undefined
            }
          />
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
      {user && (
        <CreateIndustryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  )
}
