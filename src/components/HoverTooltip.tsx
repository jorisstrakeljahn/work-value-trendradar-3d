import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import type { Industry } from '../types/signal'

export default function HoverTooltip() {
  const { hoveredSignal } = useRadarStore()
  const industries = industriesData as Industry[]

  if (!hoveredSignal) return null

  const industryNames = hoveredSignal.industryTags
    .map((tag) => industries.find((ind) => ind.id === tag)?.name || tag)
    .join(', ')

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg pointer-events-none z-50 backdrop-blur-sm">
      <div className="text-sm font-semibold">{hoveredSignal.title}</div>
      <div className="text-xs text-gray-300 mt-1">{industryNames}</div>
    </div>
  )
}

