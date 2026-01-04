import { useTranslation } from 'react-i18next'
import { InfoRow } from '../../../../shared/components/ui'
import { useIndustries } from '../../../../shared/hooks/useIndustries'
import { calculateWorkValueIndex } from '../../../../shared/utils/mapping'
import { useRadarStore } from '../../../../store/useRadarStore'
import type { Signal } from '../../../../types/signal'

interface SignalInfoProps {
  signal: Signal
}

/**
 * Signal info component displaying industries, impact, horizon, work value
 */
export function SignalInfo({ signal }: SignalInfoProps) {
  const { t } = useTranslation()
  const industries = useIndustries()
  const { valueWeights } = useRadarStore()

  const industryNames = signal.industryTags
    .map(tag => industries.find(ind => ind.id === tag)?.name || tag)
    .join(', ')

  const workValueIndex = calculateWorkValueIndex(signal, valueWeights)

  return (
    <div className="space-y-3 text-sm">
      <InfoRow label={t('signalDetails.industries')} value={industryNames} align="start" />
      <InfoRow label={t('signalDetails.impact')} value={`${signal.xImpact}/100`} />
      <InfoRow label={t('signalDetails.horizon')} value={`${signal.yHorizon}/100`} />
      <InfoRow
        label={t('signalDetails.workValue')}
        align="start"
        value={
          <div>
            <span className="text-gray-900 dark:text-gray-100">
              {workValueIndex > 0 ? '+' : ''}
              {workValueIndex.toFixed(1)}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {t('signalDetails.aggregated')}
            </div>
          </div>
        }
      />
    </div>
  )
}
