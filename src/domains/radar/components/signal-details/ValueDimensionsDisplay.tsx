import { useTranslation } from 'react-i18next'
import type { ValueDimensions } from '../../../../types/signal'

interface ValueDimensionsDisplayProps {
  valueDimensions: ValueDimensions
}

/**
 * Value dimensions display component
 */
export function ValueDimensionsDisplay({ valueDimensions }: ValueDimensionsDisplayProps) {
  const { t } = useTranslation()

  const dimensions = [
    { key: 'economic' as const, label: t('signalDetails.economic') },
    { key: 'social' as const, label: t('signalDetails.social') },
    { key: 'subjective' as const, label: t('signalDetails.subjective') },
    { key: 'political' as const, label: t('signalDetails.political') },
  ]

  return (
    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
      <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
        {t('signalDetails.valueDimensions')}
      </h4>
      <div className="space-y-2 text-xs">
        {dimensions.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {valueDimensions[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
