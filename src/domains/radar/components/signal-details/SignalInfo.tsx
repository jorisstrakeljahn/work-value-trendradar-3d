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
  const { t, i18n } = useTranslation()
  const { valueWeights } = useRadarStore()

  const workValueIndex = calculateWorkValueIndex(signal, valueWeights)
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <div className="space-y-3 text-sm">
      <div>
        <InfoRow
          label={t('signalDetails.impact')}
          value={`${signal.xImpact}/100`}
        />
        {signal.xImpactJustification && (
          <div className="ml-4 mt-2 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {signal.xImpactJustification.text[currentLanguage] ||
                signal.xImpactJustification.text.de ||
                signal.xImpactJustification.text.en}
            </p>
            {signal.xImpactJustification.sources &&
              signal.xImpactJustification.sources.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('signalDetails.sources')}:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {signal.xImpactJustification.sources.map(
                      (source, index) => (
                        <li key={index}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {source.name}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
      <div>
        <InfoRow
          label={t('signalDetails.horizon')}
          value={`${signal.yHorizon}/100`}
        />
        {signal.yHorizonJustification && (
          <div className="ml-4 mt-2 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {signal.yHorizonJustification.text[currentLanguage] ||
                signal.yHorizonJustification.text.de ||
                signal.yHorizonJustification.text.en}
            </p>
            {signal.yHorizonJustification.sources &&
              signal.yHorizonJustification.sources.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t('signalDetails.sources')}:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {signal.yHorizonJustification.sources.map(
                      (source, index) => (
                        <li key={index}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {source.name}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>
      <InfoRow
        label={t('signalDetails.workValue')}
        value={`${Math.round(workValueIndex)}/100`}
      />
    </div>
  )
}
