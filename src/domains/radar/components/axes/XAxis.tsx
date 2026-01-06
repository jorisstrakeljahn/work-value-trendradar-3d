import { Html, Billboard } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'
import { useRadarStore } from '../../../../store/useRadarStore'

/**
 * X-axis: Impact / Relevance
 */
export function XAxis() {
  const { t } = useTranslation()
  const { MAX_RADIUS } = RADAR_CONFIG
  const { showAxisLabels, showHelperLabels } = useRadarStore()

  const impactLines = [
    {
      x: -MAX_RADIUS,
      labelKey: 'helperLabelLowImpact',
      color: RADAR_COLORS.IMPACT_LINES.LOW,
    },
    {
      x: MAX_RADIUS,
      labelKey: 'helperLabelHighImpact',
      color: RADAR_COLORS.IMPACT_LINES.HIGH,
    },
  ]

  return (
    <group>
      {/* X-axis line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-MAX_RADIUS, 0, 0, MAX_RADIUS, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={RADAR_COLORS.AXIS.PRIMARY} linewidth={4} />
      </line>

      {/* X-axis label at the end */}
      {showAxisLabels && (
        <Billboard position={[MAX_RADIUS + 1.5, -1.2, 0]}>
          <Html
            center
            transform
            distanceFactor={10}
            zIndexRange={[0, 100]}
            style={{ pointerEvents: 'none', zIndex: 10 }}
          >
            <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold no-select">
              {t('legend.xAxisLabel')}
            </div>
          </Html>
        </Billboard>
      )}

      {/* X-axis helper labels */}
      {showHelperLabels &&
        impactLines.map((line, i) => (
        <Billboard key={i} position={[line.x, -0.5, 0]}>
          <Html
            center
            transform
            distanceFactor={10}
            zIndexRange={[0, 100]}
            style={{ pointerEvents: 'none', zIndex: 10 }}
          >
            <div className="text-gray-600 dark:text-gray-400 text-xs no-select">
              {t(`grid.${line.labelKey}`)}
            </div>
          </Html>
        </Billboard>
        ))}
    </group>
  )
}
