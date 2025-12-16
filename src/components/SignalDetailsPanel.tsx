import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import type { Industry } from '../types/signal'

export default function SignalDetailsPanel() {
  const { selectedSignal } = useRadarStore()
  const industries = industriesData as Industry[]

  if (!selectedSignal) {
    return (
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Signal Details</h2>
        <p className="text-sm text-gray-600">Klicke auf einen Punkt, um Details zu sehen</p>
      </div>
    )
  }

  const industryNames = selectedSignal.industryTags
    .map((tag) => industries.find((ind) => ind.id === tag)?.name || tag)
    .join(', ')

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">{selectedSignal.title}</h2>
      <p className="text-sm text-gray-700 mb-3">{selectedSignal.summary}</p>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-semibold">Branchen:</span> {industryNames}
        </div>
        <div>
          <span className="font-semibold">Impact:</span> {selectedSignal.xImpact}/100
        </div>
        <div>
          <span className="font-semibold">Horizon:</span> {selectedSignal.yHorizon}/100
        </div>
        <div>
          <span className="font-semibold">Work Value:</span> {selectedSignal.zWorkValue > 0 ? '+' : ''}
          {selectedSignal.zWorkValue}
        </div>
        <div>
          <span className="font-semibold">Confidence:</span> {selectedSignal.confidence}/5
        </div>

        <div className="mt-3 pt-3 border-t border-gray-300">
          <span className="font-semibold">Value Dimensions:</span>
          <div className="mt-1 space-y-1 text-xs">
            <div>Economic: {selectedSignal.valueDimensions.economic > 0 ? '+' : ''}{selectedSignal.valueDimensions.economic}</div>
            <div>Social: {selectedSignal.valueDimensions.social > 0 ? '+' : ''}{selectedSignal.valueDimensions.social}</div>
            <div>Subjective: {selectedSignal.valueDimensions.subjective > 0 ? '+' : ''}{selectedSignal.valueDimensions.subjective}</div>
            <div>Political: {selectedSignal.valueDimensions.political > 0 ? '+' : ''}{selectedSignal.valueDimensions.political}</div>
          </div>
        </div>

        {selectedSignal.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <span className="font-semibold">Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedSignal.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

