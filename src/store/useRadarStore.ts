import { create } from 'zustand'
import type { Signal } from '../types/signal'

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
  setSelectedSignal: (signal: Signal | null) => void
  setHoveredSignal: (signal: Signal | null) => void
  setFilters: (filters: Partial<RadarState['filters']>) => void
  resetFilters: () => void
}

const defaultFilters = {
  categories: [],
  industries: [],
  minImpact: 0,
  maxImpact: 100,
}

/**
 * Zustand store for radar state management
 * Manages selected signal, hovered signal, and filters
 */
export const useRadarStore = create<RadarState>(set => ({
  selectedSignal: null,
  hoveredSignal: null,
  filters: defaultFilters,
  setSelectedSignal: signal => set({ selectedSignal: signal }),
  setHoveredSignal: signal => set({ hoveredSignal: signal }),
  setFilters: newFilters =>
    set(state => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
