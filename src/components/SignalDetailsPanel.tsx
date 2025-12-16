import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import { calculateWorkValueIndex } from '../lib/mapping'
import type { Industry } from '../types/signal'

export default function SignalDetailsPanel() {
  const { selectedSignal } = useRadarStore()
  const industries = industriesData as Industry[]

  if (!selectedSignal) {
    return (
      <div className="absolute top-20 right-4 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Signal Details
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on a point to see details
        </p>
      </div>
    )
  }

  const industryNames = selectedSignal.industryTags
    .map(tag => industries.find(ind => ind.id === tag)?.name || tag)
    .join(', ')

  return (
    <div className="absolute top-20 right-4 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 max-w-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {selectedSignal.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {selectedSignal.summary}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              Industries:
            </span>
            <span className="text-gray-900 dark:text-gray-100">{industryNames}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              Impact:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {selectedSignal.xImpact}/100
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              Horizon:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {selectedSignal.yHorizon}/100
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              Work Value:
            </span>
            <div>
              <span className="text-gray-900 dark:text-gray-100">
                {(() => {
                  const workValueIndex = calculateWorkValueIndex(selectedSignal)
                  return workValueIndex > 0 ? '+' : ''
                })()}
                {calculateWorkValueIndex(selectedSignal).toFixed(1)}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                (aggregated from 4 sub-values)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              Confidence:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {selectedSignal.confidence}/5
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
            Value Dimensions
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Economic:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.economic > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.economic}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Social:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.social > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.social}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subjective:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.subjective > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.subjective}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Political:</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {selectedSignal.valueDimensions.political > 0 ? '+' : ''}
                {selectedSignal.valueDimensions.political}
              </span>
            </div>
          </div>
        </div>

        {selectedSignal.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSignal.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
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
