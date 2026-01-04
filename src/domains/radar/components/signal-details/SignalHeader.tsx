import type { Signal } from '../../../../types/signal'
import { SignalImage } from './SignalImage'

interface SignalHeaderProps {
  signal: Signal
}

/**
 * Signal header component displaying image, title and summary
 * Layout matches SignalFormModal structure
 */
export function SignalHeader({ signal }: SignalHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Image display (if available) */}
      <SignalImage imageUrl={signal.imageUrl} />

      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {signal.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {signal.summary}
        </p>
      </div>
    </div>
  )
}
