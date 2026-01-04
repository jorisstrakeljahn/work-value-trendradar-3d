import { create } from 'zustand'
import type { Signal, ValueWeights, DimensionKey } from '../types/signal'

/**
 * Default value weights (in percent, sum = 100)
 */
const defaultWeights: ValueWeights = {
  economic: 30,
  social: 25,
  subjective: 25,
  political: 20,
}

/**
 * State interface for the radar store
 */
interface RadarState {
  selectedSignal: Signal | null
  hoveredSignal: Signal | null
  filters: {
    categories: string[]
    industries: string[]
    minImpact: number
    maxImpact: number
  }
  valueWeights: ValueWeights
  lockedDimensions: DimensionKey[]
  setSelectedSignal: (signal: Signal | null) => void
  setHoveredSignal: (signal: Signal | null) => void
  setFilters: (filters: Partial<RadarState['filters']>) => void
  resetFilters: () => void
  setValueWeights: (weights: Partial<ValueWeights>) => void
  setLockedDimensions: (dimensions: DimensionKey[]) => void
  resetWeights: () => void
}

const defaultFilters = {
  categories: [],
  industries: [],
  minImpact: 0,
  maxImpact: 100,
}

/**
 * Auto-equalize algorithm: adjusts non-locked dimensions proportionally
 * to maintain sum of 100%
 */
function calculateAdjustedWeights(
  newWeights: Partial<ValueWeights>,
  currentWeights: ValueWeights,
  lockedDimensions: DimensionKey[]
): ValueWeights {
  const result = { ...currentWeights, ...newWeights }
  const changedDimension = Object.keys(newWeights)[0] as DimensionKey

  // Calculate available budget (100 - sum of locked dimensions)
  const lockedSum = lockedDimensions.reduce((sum, key) => sum + result[key], 0)
  const availableBudget = 100 - lockedSum

  // Get non-locked dimensions (excluding the changed one)
  const nonLockedDimensions = (['economic', 'social', 'subjective', 'political'] as DimensionKey[]).filter(
    key => !lockedDimensions.includes(key) && key !== changedDimension
  )

  if (nonLockedDimensions.length === 0) {
    // All other dimensions are locked, adjust changed dimension to fit
    const newChangedValue = Math.max(0, Math.min(100, availableBudget))
    result[changedDimension] = newChangedValue
    return result
  }

  // Calculate new value for changed dimension (clamped to available budget)
  const changedValue = Math.max(0, Math.min(availableBudget, result[changedDimension]))
  result[changedDimension] = changedValue

  // Remaining budget for other non-locked dimensions
  const remainingBudget = availableBudget - changedValue

  if (remainingBudget <= 0 || nonLockedDimensions.length === 0) {
    // No budget left or no other dimensions to adjust
    return result
  }

  // Calculate proportional distribution
  const currentSum = nonLockedDimensions.reduce((sum, key) => sum + result[key], 0)

  if (currentSum === 0) {
    // Equal distribution if all are zero
    const equalShare = remainingBudget / nonLockedDimensions.length
    nonLockedDimensions.forEach(key => {
      result[key] = equalShare
    })
  } else {
    // Proportional distribution based on current ratios
    nonLockedDimensions.forEach(key => {
      const ratio = result[key] / currentSum
      result[key] = remainingBudget * ratio
    })
  }

  // Round and ensure sum is exactly 100
  const dimensionKeys: DimensionKey[] = ['economic', 'social', 'subjective', 'political']
  dimensionKeys.forEach(key => {
    result[key] = Math.round(result[key] * 100) / 100
  })

  // Adjust for rounding errors to ensure exact sum of 100
  const totalSum = dimensionKeys.reduce((sum, key) => sum + result[key], 0)
  const difference = 100 - totalSum
  if (Math.abs(difference) > 0.01) {
    // Adjust the changed dimension (or first non-locked if changed is locked)
    const adjustKey = !lockedDimensions.includes(changedDimension)
      ? changedDimension
      : nonLockedDimensions[0]
    if (adjustKey) {
      result[adjustKey] = Math.round((result[adjustKey] + difference) * 100) / 100
    }
  }

  return result
}

/**
 * Zustand store for radar state management
 * Manages selected signal, hovered signal, filters, and value dimension weights
 */
export const useRadarStore = create<RadarState>(set => ({
  selectedSignal: null,
  hoveredSignal: null,
  filters: defaultFilters,
  valueWeights: defaultWeights,
  lockedDimensions: [],
  setSelectedSignal: signal => set({ selectedSignal: signal }),
  setHoveredSignal: signal => set({ hoveredSignal: signal }),
  setFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  setValueWeights: newWeights =>
    set(state => {
      const adjusted = calculateAdjustedWeights(newWeights, state.valueWeights, state.lockedDimensions)
      return { valueWeights: adjusted }
    }),
  setLockedDimensions: dimensions =>
    set(() => {
      // Validate: max 2 dimensions can be locked
      const validDimensions = dimensions.slice(0, 2)
      return { lockedDimensions: validDimensions }
    }),
  resetWeights: () =>
    set({
      valueWeights: defaultWeights,
      lockedDimensions: [],
    }),
}))
