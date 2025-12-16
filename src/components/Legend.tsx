import { useTranslation } from 'react-i18next'
import { CollapsiblePanel } from '../shared/components/ui'

export default function Legend() {
  const { t } = useTranslation()

  return (
    <CollapsiblePanel title={t('legend.title')} className="w-72">
      <div className="space-y-4 text-xs">
          <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              {t('legend.status')}
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">{t('legend.selected')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-[#252525] border-2 border-gray-400 dark:border-gray-500 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">{t('legend.hover')}</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              {t('legend.radarAxes')}
            </h4>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {t('legend.xAxis')}
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {t('legend.xAxisLabel')}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• {t('legend.xAxisLow')}</div>
                  <div>• {t('legend.xAxisHigh')}</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {t('legend.yAxis')}
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {t('legend.yAxisLabel')}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• {t('legend.yAxisNow')}</div>
                  <div>• {t('legend.yAxisFar')}</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {t('legend.zAxis')}
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  {t('legend.zAxisLabel')}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• {t('legend.zAxisAggregated')}</div>
                  <div>• {t('legend.zAxisHigher')}</div>
                  <div>• {t('legend.zAxisLower')}</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </CollapsiblePanel>
  )
}
