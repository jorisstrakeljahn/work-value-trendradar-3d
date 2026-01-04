import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import type { Industry } from '../../../types/signal'

interface IndustrySelectorProps {
  industries: Industry[]
  selectedIndustryIds: string[]
  onSelectionChange: (industryIds: string[]) => void
  disabled?: boolean
  className?: string
}

/**
 * Component for industry selection
 * Displays available industries as buttons
 * Displays selected industries as chips
 */
export function IndustrySelector({
  industries,
  selectedIndustryIds,
  onSelectionChange,
  disabled = false,
  className = '',
}: IndustrySelectorProps) {
  const { t } = useTranslation()

  const toggleIndustry = (industryId: string) => {
    if (selectedIndustryIds.includes(industryId)) {
      onSelectionChange(selectedIndustryIds.filter(id => id !== industryId))
    } else {
      onSelectionChange([...selectedIndustryIds, industryId])
    }
  }

  const removeIndustry = (industryId: string) => {
    onSelectionChange(selectedIndustryIds.filter(id => id !== industryId))
  }

  const getIndustryName = (industryId: string): string => {
    const industry = industries.find(ind => ind.id === industryId)
    return industry ? industry.name : industryId
  }

  return (
    <div className={className}>
      <Label>{t('admin.form.industryTags')}</Label>

      {/* Available Industries */}
      <div className="flex flex-wrap gap-2 mb-3">
        {industries.map(industry => (
          <button
            key={industry.id}
            type="button"
            onClick={() => toggleIndustry(industry.id)}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedIndustryIds.includes(industry.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {industry.name}
          </button>
        ))}
      </div>

      {/* Selected Industries */}
      {selectedIndustryIds.length > 0 && (
        <div className="mb-3">
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {t('admin.form.selectedIndustries')}
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedIndustryIds.map(industryId => (
              <div
                key={industryId}
                className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white flex items-center gap-2"
              >
                <span>{getIndustryName(industryId)}</span>
                <button
                  type="button"
                  onClick={() => removeIndustry(industryId)}
                  disabled={disabled}
                  className="hover:text-red-200 transition-colors text-lg leading-none disabled:opacity-50"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
