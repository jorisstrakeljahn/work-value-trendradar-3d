import { useTranslation } from 'react-i18next'
import { InfoRow } from '../../../../shared/components/ui'
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
  const { valueWeights } = useRadarStore()

  const workValueIndex = calculateWorkValueIndex(signal, valueWeights)

  return (
    <div className="space-y-3 text-sm">
      <InfoRow label={t('signalDetails.impact')} value={`${signal.xImpact}/100`} />
      <InfoRow label={t('signalDetails.horizon')} value={`${signal.yHorizon}/100`} />
      <InfoRow
        label={t('signalDetails.workValue')}
        value={`${workValueIndex.toFixed(1)}`}
      />
    </div>
  )
}
