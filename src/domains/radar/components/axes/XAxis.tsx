import { Html } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'

/**
 * X-axis: Impact / Relevance
 */
export function XAxis() {
  const { t } = useTranslation()
  const { MAX_RADIUS } = RADAR_CONFIG

  const impactLines = [
    { x: -MAX_RADIUS, label: 'Low Impact', color: RADAR_COLORS.IMPACT_LINES.LOW },
    { x: 0, label: 'Medium Impact', color: RADAR_COLORS.IMPACT_LINES.MEDIUM },
    { x: MAX_RADIUS, label: 'High Impact', color: RADAR_COLORS.IMPACT_LINES.HIGH },
  ]

  return (
    <group>
      {/* X-axis line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={
              new Float32Array([
                -MAX_RADIUS - 0.5,
                0,
                0,
                MAX_RADIUS + 1.5,
                0,
                0,
              ])
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={RADAR_COLORS.AXIS.PRIMARY} linewidth={2} />
      </line>

      {/* X-axis label at the end */}
      <Html
        position={[MAX_RADIUS + 1.5, -1.2, 0]}
        center
        transform
        distanceFactor={10}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
          {t('legend.xAxisLabel')}
        </div>
      </Html>

      {/* X-axis labels */}
      {impactLines.map((line, i) => (
        <Html
          key={i}
          position={[line.x, -0.5, 0]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-600 dark:text-gray-400 text-xs">{line.label}</div>
        </Html>
      ))}

      {/* X-axis markers */}
      {impactLines.map((line, i) => (
        <mesh key={`marker-${i}`} position={[line.x, 0.05, 0]}>
          <boxGeometry args={[0.05, 0.1, 0.05]} />
          <meshStandardMaterial color={RADAR_COLORS.AXIS.PRIMARY} />
        </mesh>
      ))}
    </group>
  )
}
