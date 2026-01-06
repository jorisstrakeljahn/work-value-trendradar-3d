import { useTranslation } from 'react-i18next'
import { CollapsiblePanel } from '../../../shared/components/ui'
import { useRadarStore } from '../../../store/useRadarStore'

interface GridControlPanelProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

/**
 * Grid control panel component
 * Allows independent toggling of XY and XZ reference grids
 */
export default function GridControlPanel({
  isCollapsed,
  onToggle,
}: GridControlPanelProps) {
  const { t } = useTranslation()
  const {
    showXYGrid,
    showXZGrid,
    showAxisLabels,
    showHelperLabels,
    setShowXYGrid,
    setShowXZGrid,
    setShowAxisLabels,
    setShowHelperLabels,
  } = useRadarStore()

  return (
    <CollapsiblePanel
      title={t('grid.title')}
      className="w-72"
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {/* XY Grid Toggle */}
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grid.xyGrid')}
            </span>
            <button
              type="button"
              onClick={() => setShowXYGrid(!showXYGrid)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                showXYGrid
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={showXYGrid}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showXYGrid ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('grid.xyGridDesc')}
          </p>
        </div>

        {/* XZ Grid Toggle */}
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grid.xzGrid')}
            </span>
            <button
              type="button"
              onClick={() => setShowXZGrid(!showXZGrid)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                showXZGrid
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={showXZGrid}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showXZGrid ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('grid.xzGridDesc')}
          </p>
        </div>

        {/* Divider */}
        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50"></div>

        {/* Axis Labels Toggle */}
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grid.axisLabels')}
            </span>
            <button
              type="button"
              onClick={() => setShowAxisLabels(!showAxisLabels)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                showAxisLabels
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={showAxisLabels}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showAxisLabels ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('grid.axisLabelsDesc')}
          </p>
        </div>

        {/* Helper Labels Toggle */}
        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('grid.helperLabels')}
            </span>
            <button
              type="button"
              onClick={() => setShowHelperLabels(!showHelperLabels)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                showHelperLabels
                  ? 'bg-blue-600 dark:bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={showHelperLabels}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  showHelperLabels ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('grid.helperLabelsDesc')}
          </p>
        </div>
      </div>
    </CollapsiblePanel>
  )
}

