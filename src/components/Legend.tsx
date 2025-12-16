import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Legend() {
  const { t } = useTranslation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 w-72 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('legend.title')}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
        />
      </button>
      {!isCollapsed && (
        <div className="px-5 pb-5 space-y-4 text-xs">
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
      )}
    </div>
  )
}
