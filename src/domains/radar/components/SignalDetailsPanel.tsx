import { useTranslation } from 'react-i18next'
import { Panel } from '../../../shared/components/ui'
import { useRadarStore } from '../../../store/useRadarStore'
import { useAuthStore } from '../../../store/useAuthStore'
import { useSignals } from '../../../shared/hooks/useSignals'
import {
  SignalHeader,
  SignalInfo,
  ValueDimensionsDisplay,
  SignalActions,
} from './signal-details'

interface SignalDetailsPanelProps {
  onEdit?: () => void
  onDelete?: () => void
}

export default function SignalDetailsPanel({
  onEdit,
  onDelete,
}: SignalDetailsPanelProps) {
  const { t } = useTranslation()
  const { selectedSignal } = useRadarStore()
  const signals = useSignals()
  const { user } = useAuthStore()

  // Get signal from signals array (which is updated with current language)
  // This ensures that when language changes, the signal content is updated
  const signal = selectedSignal
    ? signals.find(s => s.id === selectedSignal.id)
    : null

  if (!signal) {
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

  return (
    <Panel className="w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="p-6 space-y-5">
        <SignalHeader signal={signal} />
        <SignalInfo signal={signal} />
        <ValueDimensionsDisplay
          valueDimensions={signal.valueDimensions}
        />

        {user && onEdit && onDelete && (
          <SignalActions onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>
    </Panel>
  )
}
