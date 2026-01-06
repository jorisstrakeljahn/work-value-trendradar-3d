import { X } from 'lucide-react'
import { Rnd } from 'react-rnd'
import { SIGNAL_WINDOW_CONFIG } from '../../../../shared/constants/radar'

interface SignalWindowLoadingProps {
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  onClose: () => void
}

/**
 * Loading state component for signal windows
 * Displays while signal data is being loaded
 */
export function SignalWindowLoading({
  position,
  size,
  zIndex,
  onClose,
}: SignalWindowLoadingProps) {
  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      minWidth={SIGNAL_WINDOW_CONFIG.MIN_WIDTH}
      minHeight={SIGNAL_WINDOW_CONFIG.MIN_HEIGHT}
      style={{
        zIndex,
        position: 'absolute',
      }}
      className="shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] overflow-hidden flex flex-col"
    >
      <div className="window-header flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
          Loading...
        </h3>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading signal...
        </p>
      </div>
    </Rnd>
  )
}
