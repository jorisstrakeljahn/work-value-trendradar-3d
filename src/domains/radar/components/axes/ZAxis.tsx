import { Html, Billboard } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'
import { useRadarStore } from '../../../../store/useRadarStore'

/**
 * Z-axis: Work-Value-Index (Height)
 */
export function ZAxis() {
  const { t } = useTranslation()
  const { MAX_HEIGHT } = RADAR_CONFIG
  const { showAxisLabels, showHelperLabels } = useRadarStore()

  const markers = [
    { z: MAX_HEIGHT / 2, labelKey: 'helperLabelMediumValue' },
    { z: MAX_HEIGHT, labelKey: 'helperLabelHighValue' },
  ]

  return (
    <group>
      {/* Z-axis line (vertical, from 0 to maxHeight) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0, MAX_HEIGHT])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={RADAR_COLORS.AXIS.PRIMARY} linewidth={4} />
      </line>

      {/* Z-axis label at the end */}
      {showAxisLabels && (
        <Billboard position={[0.3, -1.2, MAX_HEIGHT + 0.5]}>
          <Html
            center
            transform
            distanceFactor={10}
            zIndexRange={[0, 100]}
            style={{ pointerEvents: 'none', zIndex: 10 }}
          >
            <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold no-select">
              {t('legend.zAxisLabel')}
            </div>
          </Html>
        </Billboard>
      )}

      {/* Z-axis helper labels */}
      {showHelperLabels &&
        markers.map((marker, i) => (
        <group key={i}>
          <Billboard position={[0.5, 0, marker.z]}>
            <Html
              center
              transform
              distanceFactor={10}
              zIndexRange={[0, 100]}
              style={{ pointerEvents: 'none', zIndex: 10 }}
            >
              <div className="text-gray-600 dark:text-gray-400 text-xs no-select">
                {t(`grid.${marker.labelKey}`)}
            </div>
          </Html>
        </Billboard>
        </group>
        ))}
    </group>
  )
}
