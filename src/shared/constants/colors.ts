/**
 * Color constants for radar visualization
 * Includes both light and dark mode variants for better contrast
 */
export const RADAR_COLORS = {
  AXIS: {
    PRIMARY: '#6B7280',
    SECONDARY: '#9CA3AF',
    LABEL: '#6B7280',
  },
  // Light mode specific colors (higher contrast)
  AXIS_LIGHT: {
    PRIMARY: '#1F2937', // gray-800 - much darker for light mode
    SECONDARY: '#374151', // gray-700
    LABEL: '#1F2937',
  },
  TIME_LINES: {
    NOW: '#10B981',
    NEXT: '#F59E0B',
    FAR: '#EF4444',
  },
  IMPACT_LINES: {
    LOW: '#6B7280',
    MEDIUM: '#9CA3AF',
    HIGH: '#3B82F6',
  },
  SIGNAL: {
    SELECTED: '#FFD700', // Gold
    HOVER: '#FFFFFF', // White
    DEFAULT: '#94A3B8', // Gray fallback
  },
  GRID: {
    LINE: '#9CA3AF', // Similar to AXIS.SECONDARY for consistency
  },
  GRID_LIGHT: {
    LINE: '#4B5563', // gray-600 - darker for light mode
  },
} as const
