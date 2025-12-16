import { useRadarStore } from '../store/useRadarStore'
import { useIndustries } from '../shared/hooks/useIndustries'

export default function HoverTooltip() {
  const { hoveredSignal } = useRadarStore()
  const industries = useIndustries()

  if (!hoveredSignal) return null

  const industryNames = hoveredSignal.industryTags
    .map(tag => industries.find(ind => ind.id === tag)?.name || tag)
    .join(', ')

  return (
    <div className="hidden md:block absolute top-4 left-1/2 transform -translate-x-1/2 glass rounded-2xl px-5 py-3 pointer-events-none z-50 shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {hoveredSignal.title}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5">
        {industryNames}
      </div>
    </div>
  )
}
