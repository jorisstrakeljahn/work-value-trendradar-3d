import { useTranslation } from 'react-i18next'
import { Panel, InfoRow, Tag } from '../shared/components/ui'
import { useRadarStore } from '../store/useRadarStore'
import { useIndustries } from '../shared/hooks/useIndustries'
import { calculateWorkValueIndex } from '../shared/utils/mapping'

export default function SignalDetailsPanel() {
  const { t } = useTranslation()
  const { selectedSignal } = useRadarStore()
  const industries = useIndustries()

  if (!selectedSignal) {
    return (
      <Panel className="w-80 p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {t('signalDetails.title')}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('signalDetails.clickToSee')}
        </p>
      </Panel>
    )
  }

  const industryNames = selectedSignal.industryTags
    .map(tag => industries.find(ind => ind.id === tag)?.name || tag)
    .join(', ')

  const workValueIndex = calculateWorkValueIndex(selectedSignal)

  return (
    <Panel className="w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {selectedSignal.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {selectedSignal.summary}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <InfoRow label={t('signalDetails.industries')} value={industryNames} align="start" />
          <InfoRow label={t('signalDetails.impact')} value={`${selectedSignal.xImpact}/100`} />
          <InfoRow label={t('signalDetails.horizon')} value={`${selectedSignal.yHorizon}/100`} />
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
          <InfoRow label={t('signalDetails.confidence')} value={`${selectedSignal.confidence}/5`} />
        </div>

        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
            {t('signalDetails.valueDimensions')}
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('signalDetails.economic')}</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.economic > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.economic}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('signalDetails.social')}</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.social > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.social}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('signalDetails.subjective')}</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.subjective > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.subjective}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('signalDetails.political')}</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.political > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.political}
              </span>
            </div>
          </div>
        </div>

        {selectedSignal.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">{t('signalDetails.tags')}</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSignal.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  )
}
