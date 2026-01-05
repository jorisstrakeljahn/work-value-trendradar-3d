import { Info } from 'lucide-react'
import { TabSwitch } from '../../ui/TabSwitch'
import { useTranslation } from 'react-i18next'

interface JustificationModeSwitchProps {
  mode: 'freetext' | 'perDimension'
  onModeChange: (mode: 'freetext' | 'perDimension') => void
  disabled?: boolean
}

/**
 * Mode switch component for justification input
 * Includes info tooltip explaining the modes
 */
export function JustificationModeSwitch({
  mode,
  onModeChange,
  disabled = false,
}: JustificationModeSwitchProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-4 flex items-center gap-3">
      <TabSwitch
        options={[
          { value: 'freetext', label: t('admin.form.freetextMode') },
          {
            value: 'perDimension',
            label: t('admin.form.perDimensionMode'),
          },
        ]}
        value={mode}
        onChange={onModeChange}
        disabled={disabled}
      />
      <div className="relative group">
        <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg pointer-events-none">
          {t('admin.form.modeSwitchInfo')}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

