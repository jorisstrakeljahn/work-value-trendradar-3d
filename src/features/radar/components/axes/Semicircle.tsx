import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'

/**
 * Semicircle line for X/Y plane - ends on X-axis (Impact/Relevance)
 */
export function Semicircle() {
  const { MAX_RADIUS } = RADAR_CONFIG

  return (
    <group>
      {Array.from({ length: 64 }).map((_, i) => {
        // Semicircle from 0 to π (from right to left on X-axis)
        const angle = (i / 64) * Math.PI
        const x1 = MAX_RADIUS * Math.cos(angle)
        const y1 = MAX_RADIUS * Math.sin(angle)
        const nextAngle = ((i + 1) / 64) * Math.PI
        const x2 = MAX_RADIUS * Math.cos(nextAngle)
        const y2 = MAX_RADIUS * Math.sin(nextAngle)

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([x1, y1, -0.05, x2, y2, -0.05])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={RADAR_COLORS.AXIS.SECONDARY} opacity={0.3} transparent />
          </line>
        )
      })}
    </group>
  )
}

