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
} as const
