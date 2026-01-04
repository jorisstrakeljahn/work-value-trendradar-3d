import type { Signal } from '../../types/signal'

interface SignalHeaderProps {
  signal: Signal
}

/**
 * Signal header component displaying title and summary
 */
export function SignalHeader({ signal }: SignalHeaderProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {signal.title}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {signal.summary}
      </p>
    </div>
  )
}
