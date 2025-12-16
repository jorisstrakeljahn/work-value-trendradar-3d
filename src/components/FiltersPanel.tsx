import { useTranslation } from 'react-i18next'
import { CollapsiblePanel } from '../shared/components/ui'
import { useRadarStore } from '../store/useRadarStore'
import { useIndustries } from '../shared/hooks/useIndustries'

export default function FiltersPanel() {
  const { t } = useTranslation()
  const { filters, setFilters } = useRadarStore()
  const industries = useIndustries()

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

  return (
    <CollapsiblePanel title={t('filter.title')} className="w-72">
      <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('filter.industries')}
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {industries.map(industry => {
                const isSelected =
                  filters.industries?.includes(industry.id) ?? false
                return (
                  <label
                    key={industry.id}
                    className="flex items-center gap-3 cursor-pointer px-2 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-150"
                  >
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
  )
}
