import { useMemo } from 'react'
import { useSignals } from '../../../shared/hooks/useSignals'
import { useRadarStore } from '../../../store/useRadarStore'
import { mapSignalToPosition } from '../../../shared/utils/mapping'
import { RADAR_CONFIG } from '../../../shared/constants'
import type { Signal } from '../../../types/signal'

/**
 * Hook to filter signals and map them to 3D positions
 * Uses current value weights from store for position calculation
 */
export function useFilteredSignals() {
  const signals = useSignals()
  const { filters, valueWeights } = useRadarStore()
  const { MAX_RADIUS, MAX_HEIGHT } = RADAR_CONFIG

  return useMemo(() => {
    let filtered = [...signals]

    // Filter by industries
    if (filters.industries && filters.industries.length > 0) {
      filtered = filtered.filter(signal =>
        signal.industryTags.some(tag => filters.industries.includes(tag))
      )
    }

    // Filter by impact
    filtered = filtered.filter(
      signal =>
        signal.xImpact >= filters.minImpact &&
        signal.xImpact <= filters.maxImpact
    )

    // Map to positions using current weights
    return filtered.map(signal => ({
      ...signal,
      position: mapSignalToPosition(
        signal,
        MAX_RADIUS,
        MAX_HEIGHT,
        valueWeights
      ),
    }))
  }, [signals, filters, valueWeights, MAX_RADIUS, MAX_HEIGHT])
}
