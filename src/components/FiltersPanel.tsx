import { useTranslation } from 'react-i18next'
import { CollapsiblePanel } from '../shared/components/ui'
import { useRadarStore } from '../store/useRadarStore'
import { IndustryFilter } from './filters'

export default function FiltersPanel() {
  const { t } = useTranslation()
  const { filters, setFilters } = useRadarStore()

  return (
    <CollapsiblePanel title={t('filter.title')} className="w-72">
      <div className="space-y-4">
        <IndustryFilter
          selectedIndustryIds={filters.industries || []}
          onSelectionChange={industryIds => setFilters({ industries: industryIds })}
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
  )
}
