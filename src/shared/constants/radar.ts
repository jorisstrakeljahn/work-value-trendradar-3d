/**
 * Radar visualization constants
 */
export const RADAR_CONFIG = {
  MAX_RADIUS: 8,
  MAX_HEIGHT: 8,
  CAMERA: {
    DISTANCE: 12, // Reduced from 18 for closer zoom
    ANGLE: Math.PI / 12, // 15 degrees (more frontal, less from above)
    FOV: 75,
  },
  // Default values for position mapping
  DEFAULT_MAX_RADIUS: 5,
  DEFAULT_MAX_HEIGHT: 3,
} as const

/**
 * Signal window constants
 */
export const SIGNAL_WINDOW_CONFIG = {
  MIN_WIDTH: 300,
  MIN_HEIGHT: 400,
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 600,
  MAX_SIZE_RATIO: 0.9, // 90% of viewport
  FALLBACK_MAX_WIDTH: 1200,
  FALLBACK_MAX_HEIGHT: 800,
  BASE_Z_INDEX: 1000,
} as const

/**
 * Modal and overlay z-index constants
 */
export const Z_INDEX = {
  MODAL: 10000,
  TOOLTIP: 50,
  HEADER: 50,
} as const
