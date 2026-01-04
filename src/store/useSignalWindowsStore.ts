import { create } from 'zustand'

/**
 * Window state for a signal detail window
 */
export interface SignalWindow {
  id: string // UUID for unique identification
  signalId: string // ID of the signal
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number // For overlay order
}

/**
 * Default window size
 */
const DEFAULT_WINDOW_SIZE = {
  width: 400,
  height: 600,
}

/**
 * Window offset for cascading
 */
const CASCADE_OFFSET = { x: 30, y: 30 }

/**
 * Maximum cascade iterations before using random positioning
 */
const MAX_CASCADE_ITERATIONS = 5

/**
 * Initial window position (center-right, where sidebar was)
 * Position is relative to viewport (not including scroll offset)
 */
function getInitialPosition(windowIndex: number): { x: number; y: number } {
  if (typeof window === 'undefined') {
    // SSR fallback
    return { x: 100, y: 100 }
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Account for potential header (if any) - add some top margin
  const topMargin = 20

  // First window: center-right
  if (windowIndex === 0) {
    return {
      x: Math.max(20, viewportWidth - DEFAULT_WINDOW_SIZE.width - 20),
      y: Math.max(topMargin, (viewportHeight - DEFAULT_WINDOW_SIZE.height) / 2),
    }
  }

  // Cascade positioning
  if (windowIndex < MAX_CASCADE_ITERATIONS) {
    const baseX = viewportWidth - DEFAULT_WINDOW_SIZE.width - 20
    const baseY = (viewportHeight - DEFAULT_WINDOW_SIZE.height) / 2
    return {
      x: Math.max(20, baseX - CASCADE_OFFSET.x * windowIndex),
      y: Math.max(topMargin, baseY + CASCADE_OFFSET.y * windowIndex),
    }
  }

  // Random positioning for windows beyond cascade limit
  return {
    x: Math.max(
      20,
      Math.random() * (viewportWidth - DEFAULT_WINDOW_SIZE.width - 40)
    ),
    y: Math.max(
      topMargin,
      Math.random() * (viewportHeight - DEFAULT_WINDOW_SIZE.height - 80)
    ),
  }
}

/**
 * State interface for signal windows store
 */
interface SignalWindowsState {
  windows: SignalWindow[]
  nextZIndex: number
  openWindow: (signalId: string) => void
  closeWindow: (windowId: string) => void
  updateWindowPosition: (
    windowId: string,
    position: { x: number; y: number }
  ) => void
  updateWindowSize: (
    windowId: string,
    size: { width: number; height: number }
  ) => void
  bringToFront: (windowId: string) => void
  closeAllWindows: () => void
}

/**
 * Helper function to get window by signal ID
 * Must be called from within a component using the hook
 */
export function getWindowBySignalId(
  signalId: string
): SignalWindow | undefined {
  const state = useSignalWindowsStore.getState()
  return state.windows.find(w => w.signalId === signalId)
}

/**
 * Zustand store for managing signal detail windows
 * Handles opening, closing, positioning, and z-index management
 */
export const useSignalWindowsStore = create<SignalWindowsState>(set => ({
  windows: [],
  nextZIndex: 1000,

  openWindow: (signalId: string) => {
    set(state => {
      // Check if window for this signal already exists
      const existingWindow = state.windows.find(w => w.signalId === signalId)
      if (existingWindow) {
        // Bring existing window to front
        const newZIndex = state.nextZIndex + 1
        return {
          windows: state.windows.map(w =>
            w.id === existingWindow.id ? { ...w, zIndex: newZIndex } : w
          ),
          nextZIndex: newZIndex,
        }
      }

      // Create new window
      const windowIndex = state.windows.length
      const initialPosition = getInitialPosition(windowIndex)
      const newWindow: SignalWindow = {
        id: crypto.randomUUID(),
        signalId,
        position: initialPosition,
        size: DEFAULT_WINDOW_SIZE,
        zIndex: state.nextZIndex + 1,
      }

      return {
        windows: [...state.windows, newWindow],
        nextZIndex: newWindow.zIndex,
      }
    })
  },

  closeWindow: (windowId: string) =>
    set(state => ({
      windows: state.windows.filter(w => w.id !== windowId),
    })),

  updateWindowPosition: (
    windowId: string,
    position: { x: number; y: number }
  ) =>
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      ),
    })),

  updateWindowSize: (
    windowId: string,
    size: { width: number; height: number }
  ) =>
    set(state => ({
      windows: state.windows.map(w => (w.id === windowId ? { ...w, size } : w)),
    })),

  bringToFront: (windowId: string) =>
    set(state => {
      const newZIndex = state.nextZIndex + 1
      return {
        windows: state.windows.map(w =>
          w.id === windowId ? { ...w, zIndex: newZIndex } : w
        ),
        nextZIndex: newZIndex,
      }
    }),

  closeAllWindows: () =>
    set({
      windows: [],
    }),
}))
