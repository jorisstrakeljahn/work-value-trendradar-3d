import { useTranslation } from 'react-i18next'
import { Lock, Unlock, RotateCcw } from 'lucide-react'
import { CollapsiblePanel, Button } from '../../../shared/components/ui'
import { RangeSlider } from '../../../shared/components/forms'
import { useRadarStore } from '../../../store/useRadarStore'
import type { DimensionKey } from '../../../types/signal'

interface WeightDimensionsPanelProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function WeightDimensionsPanel({
  isCollapsed,
  onToggle,
}: WeightDimensionsPanelProps) {
  const { t } = useTranslation()
  const {
    valueWeights,
    lockedDimensions,
    setValueWeights,
    setLockedDimensions,
    resetWeights,
  } = useRadarStore()

  const dimensions: { key: DimensionKey; labelKey: string }[] = [
    { key: 'economic', labelKey: 'weights.economic' },
    { key: 'social', labelKey: 'weights.social' },
    { key: 'subjective', labelKey: 'weights.subjective' },
    { key: 'political', labelKey: 'weights.political' },
  ]

  const handleWeightChange = (dimension: DimensionKey, value: number) => {
    setValueWeights({ [dimension]: value })
  }

  const handleLockToggle = (dimension: DimensionKey) => {
    const isLocked = lockedDimensions.includes(dimension)
    if (isLocked) {
      // Unlock
      setLockedDimensions(lockedDimensions.filter(d => d !== dimension))
    } else {
      // Lock (max 2)
      if (lockedDimensions.length >= 2) {
        // Warn user, but don't lock
        return
      }
      setLockedDimensions([...lockedDimensions, dimension])
    }
  }

  const canLock = (dimension: DimensionKey) => {
    return !lockedDimensions.includes(dimension) && lockedDimensions.length < 2
  }

  const isLocked = (dimension: DimensionKey) => {
    return lockedDimensions.includes(dimension)
  }

  return (
    <CollapsiblePanel
      title={t('weights.title')}
      className="w-72"
      isCollapsed={isCollapsed}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        {dimensions.map(({ key, labelKey }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[6rem]">
                {t(labelKey)}
              </label>
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
                {Math.round(valueWeights[key])}
                {t('weights.percent')}
              </span>
              <button
                type="button"
                onClick={() => handleLockToggle(key)}
                disabled={!canLock(key) && !isLocked(key)}
                className={`p-1.5 rounded-lg transition-colors duration-200 flex-shrink-0 ${
                  isLocked(key)
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : canLock(key)
                      ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                title={
                  isLocked(key)
                    ? t('weights.unlock')
                    : canLock(key)
                      ? t('weights.lock')
                      : t('weights.lockLimit')
                }
              >
                {isLocked(key) ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </button>
            </div>
            <RangeSlider
              value={Math.round(valueWeights[key])}
              min={0}
              max={100}
              onChange={e => handleWeightChange(key, Number(e.target.value))}
              disabled={isLocked(key)}
              showValue={false}
              className={isLocked(key) ? 'opacity-50' : ''}
            />
          </div>
        ))}

        <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
          <Button
            type="button"
            variant="secondary"
            onClick={resetWeights}
            className="w-full flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            {t('weights.reset')}
          </Button>
        </div>

        {lockedDimensions.length === 2 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {t('weights.lockLimit')}
          </p>
        )}
      </div>
    </CollapsiblePanel>
  )
}
