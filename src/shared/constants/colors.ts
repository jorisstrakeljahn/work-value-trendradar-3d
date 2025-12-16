/**
 * Color constants for radar visualization
 */
export const RADAR_COLORS = {
  AXIS: {
    PRIMARY: '#6B7280',
    SECONDARY: '#9CA3AF',
    LABEL: '#6B7280',
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
} as const

