import { useTranslation } from 'react-i18next'
import { useIndustries } from '../../../../shared/hooks/useIndustries'
import { useAuthStore } from '../../../../store/useAuthStore'
import type { Signal } from '../../../../types/signal'
import { SignalHeader } from './SignalHeader'
import { SignalInfo } from './SignalInfo'
import { ValueDimensionsDisplay } from './ValueDimensionsDisplay'
import { SignalActions } from './SignalActions'

interface SignalDetailsContentProps {
  signal: Signal
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * Signal details content component
 * Displays all signal information in a structured layout
 * Used inside draggable windows (no Panel wrapper)
 */
export function SignalDetailsContent({
  signal,
  onEdit,
  onDelete,
}: SignalDetailsContentProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const industries = useIndustries()

  // Get industry names for display (only if industries exist)
  const hasIndustries = signal.industryTags.length > 0
  const industryNames = hasIndustries
    ? signal.industryTags
        .map(tag => {
          const industry = industries.find(ind => ind.id === tag)
          return industry?.name || tag
        })
        .join(', ')
    : ''

  return (
    <div className="p-6 space-y-5">
      {/* Header with image, title, and summary */}
      <SignalHeader signal={signal} />

      {/* Industries - only show if industries exist */}
      {hasIndustries && industryNames && (
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {t('signalDetails.industries')}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{industryNames}</p>
          </div>
        </div>
      )}

      {/* Signal Info (Impact, Horizon, Work Value) */}
      <SignalInfo signal={signal} />

      {/* Value Dimensions */}
      <ValueDimensionsDisplay valueDimensions={signal.valueDimensions} />

      {/* Admin Actions */}
      {user && onEdit && onDelete && (
        <SignalActions onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  )
}
