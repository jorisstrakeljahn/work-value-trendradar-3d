import { useRadarStore } from '../../../store/useRadarStore'
import { useIndustries } from '../../../shared/hooks/useIndustries'
import { useSignals } from '../../../shared/hooks/useSignals'

export default function HoverTooltip() {
  const { hoveredSignal } = useRadarStore()
  const signals = useSignals()
  const industries = useIndustries()

  // Get signal from signals array (which is updated with current language)
  // This ensures that when language changes, the tooltip content is updated
  const signal = hoveredSignal
    ? signals.find(s => s.id === hoveredSignal.id)
    : null

  if (!signal) return null

  const industryNames = signal.industryTags
    .map(tag => industries.find(ind => ind.id === tag)?.name || tag)
    .filter(name => name.trim().length > 0)
    .join(', ')

  return (
    <div className="hidden md:block absolute top-4 left-1/2 transform -translate-x-1/2 glass rounded-2xl px-5 py-3 pointer-events-none z-50 shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {signal.title}
      </div>
      {industryNames && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
          {industryNames}
        </div>
      )}
    </div>
  )
}
