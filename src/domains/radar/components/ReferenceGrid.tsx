import { useMemo } from 'react'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../shared/constants'
import { useRadarStore } from '../../../store/useRadarStore'

/**
 * Reference grid component for 3D radar visualization
 * Provides optional grid lines for better spatial orientation
 * - XY Grid: Grid lines in X-Y plane (z=0)
 * - XZ Grid: Grid lines in X-Z plane (y=0)
 * Both grids can be toggled independently
 */
export function ReferenceGrid() {
  const { showXYGrid, showXZGrid } = useRadarStore()
  const { MAX_RADIUS, MAX_HEIGHT } = RADAR_CONFIG

  // Grid spacing: separate spacing for XY and XZ grids
  // XY Grid: 6 fields (7 lines) for finer grid
  // XZ Grid: 5 fields (6 lines) for finer grid
  const GRID_SPACING_XY = MAX_RADIUS / 6 // ≈ 1.333 for 6 fields
  const GRID_SPACING_XZ = MAX_HEIGHT / 5 // = 1.6 for 5 fields

  // Generate XY grid lines (X-Y plane at z=0)
  const xyGridLines = useMemo(() => {
    if (!showXYGrid) return []

    const lines: Array<{
      key: string
      positions: Float32Array
    }> = []

    // X-direction lines (parallel to X-axis, varying Y)
    // Only positive Y values (0 to MAX_RADIUS) due to semicircle
    // Lines stop at semicircle boundary: x = ±√(MAX_RADIUS² - y²)
    for (let y = 0; y <= MAX_RADIUS; y += GRID_SPACING_XY) {
      // Calculate where the line intersects the semicircle
      const maxX = Math.sqrt(Math.max(0, MAX_RADIUS * MAX_RADIUS - y * y))
      if (maxX > 0) {
        // Line from -maxX to +maxX at this Y position (within semicircle)
        lines.push({
          key: `xy-x-line-${y}`,
          positions: new Float32Array([
            -maxX,
            y,
            0,
            maxX,
            y,
            0,
          ]),
        })
      }
    }

    // Y-direction lines (parallel to Y-axis, varying X)
    // From -MAX_RADIUS to +MAX_RADIUS
    for (let x = -MAX_RADIUS; x <= MAX_RADIUS; x += GRID_SPACING_XY) {
      // Only draw if within semicircle bounds (x^2 + y^2 <= MAX_RADIUS^2)
      const maxY = Math.sqrt(Math.max(0, MAX_RADIUS * MAX_RADIUS - x * x))
      if (maxY > 0) {
        lines.push({
          key: `xy-y-line-${x}`,
          positions: new Float32Array([x, 0, 0, x, maxY, 0]),
        })
      }
    }

    return lines
  }, [showXYGrid, MAX_RADIUS, GRID_SPACING_XY])

  // Generate XZ grid lines (X-Z plane at y=0)
  const xzGridLines = useMemo(() => {
    if (!showXZGrid) return []

    const lines: Array<{
      key: string
      positions: Float32Array
    }> = []

    // X-direction lines (parallel to X-axis, varying Z)
    // From 0 to MAX_HEIGHT
    for (let z = 0; z <= MAX_HEIGHT; z += GRID_SPACING_XZ) {
      // Line from -MAX_RADIUS to +MAX_RADIUS at this Z position
      lines.push({
        key: `xz-x-line-${z}`,
        positions: new Float32Array([
          -MAX_RADIUS,
          0,
          z,
          MAX_RADIUS,
          0,
          z,
        ]),
      })
    }

    // Z-direction lines (parallel to Z-axis, varying X)
    // From -MAX_RADIUS to +MAX_RADIUS
    for (let x = -MAX_RADIUS; x <= MAX_RADIUS; x += GRID_SPACING_XZ) {
      // Line from z=0 to z=MAX_HEIGHT at this X position
      lines.push({
        key: `xz-z-line-${x}`,
        positions: new Float32Array([x, 0, 0, x, 0, MAX_HEIGHT]),
      })
    }

    return lines
  }, [showXZGrid, MAX_RADIUS, MAX_HEIGHT, GRID_SPACING_XZ])

  if (!showXYGrid && !showXZGrid) return null

  return (
    <group>
      {/* XY Grid (X-Y plane at z=0) */}
      {xyGridLines.map(line => (
        <line key={line.key}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={line.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={RADAR_COLORS.GRID.LINE}
            opacity={0.13}
            transparent
            linewidth={1}
          />
        </line>
      ))}

      {/* XZ Grid (X-Z plane at y=0) */}
      {xzGridLines.map(line => (
        <line key={line.key}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={line.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={RADAR_COLORS.GRID.LINE}
            opacity={0.13}
            transparent
            linewidth={1}
          />
        </line>
      ))}
    </group>
  )
}
