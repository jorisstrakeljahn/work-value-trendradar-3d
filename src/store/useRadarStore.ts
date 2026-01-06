import { create } from 'zustand'
import type { Signal, ValueWeights, DimensionKey } from '../types/signal'
import { calculateAdjustedWeights } from '../shared/utils/weightCalculation'

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
  showXYGrid: boolean
  showXZGrid: boolean
  showAxisLabels: boolean
  showHelperLabels: boolean
  setSelectedSignal: (signal: Signal | null) => void
  setHoveredSignal: (signal: Signal | null) => void
  setFilters: (filters: Partial<RadarState['filters']>) => void
  resetFilters: () => void
  setValueWeights: (weights: Partial<ValueWeights>) => void
  setLockedDimensions: (dimensions: DimensionKey[]) => void
  resetWeights: () => void
  setShowXYGrid: (show: boolean) => void
  setShowXZGrid: (show: boolean) => void
  setShowAxisLabels: (show: boolean) => void
  setShowHelperLabels: (show: boolean) => void
}

const defaultFilters = {
  categories: [],
  industries: [],
  minImpact: 0,
  maxImpact: 100,
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
  showXYGrid: false,
  showXZGrid: false,
  showAxisLabels: true,
  showHelperLabels: true,
  setSelectedSignal: signal => set({ selectedSignal: signal }),
  setHoveredSignal: signal => set({ hoveredSignal: signal }),
  setFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  setValueWeights: newWeights =>
    set(state => {
      const adjusted = calculateAdjustedWeights(
        newWeights,
        state.valueWeights,
        state.lockedDimensions
      )
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
  setShowXYGrid: show => set({ showXYGrid: show }),
  setShowXZGrid: show => set({ showXZGrid: show }),
  setShowAxisLabels: show => set({ showAxisLabels: show }),
  setShowHelperLabels: show => set({ showHelperLabels: show }),
}))
