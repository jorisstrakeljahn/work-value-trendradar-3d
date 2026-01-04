import { Html, Billboard } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'

/**
 * Y-axis: Time Horizon / Maturity
 */
export function YAxis() {
  const { t } = useTranslation()
  const { MAX_RADIUS } = RADAR_CONFIG

  const timeLines = [
    { y: MAX_RADIUS * 0.5, label: 'Next', color: RADAR_COLORS.TIME_LINES.NEXT },
    { y: MAX_RADIUS, label: 'Far', color: RADAR_COLORS.TIME_LINES.FAR },
  ]

  return (
    <group>
      {/* Y-axis line (vertical, from 0 to maxRadius) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, MAX_RADIUS, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={RADAR_COLORS.AXIS.PRIMARY} linewidth={4} />
      </line>

      {/* Y-axis label at the end */}
      <Billboard position={[0, MAX_RADIUS + 0.5, 0]}>
        <Html
          center
          transform
          distanceFactor={10}
          zIndexRange={[0, 100]}
          style={{ pointerEvents: 'none', zIndex: 10 }}
        >
          <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
            {t('legend.yAxisLabel')}
          </div>
        </Html>
      </Billboard>

      {/* Y-axis lines (vertical, from 0 to maxRadius) */}
      {timeLines.map((line, i) => (
        <group key={i}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([0, 0, 0, 0, line.y, 0])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={RADAR_COLORS.AXIS.SECONDARY} opacity={0.4} transparent />
          </line>

          {/* Y-axis labels */}
          <Billboard position={[-0.5, line.y, 0]}>
            <Html
              center
              transform
              distanceFactor={10}
              zIndexRange={[0, 100]}
              style={{ pointerEvents: 'none', zIndex: 10 }}
            >
              <div className="text-gray-600 dark:text-gray-400 text-xs">{line.label}</div>
            </Html>
          </Billboard>

        </group>
      ))}
    </group>
  )
}
