import { Html, Billboard } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import { RADAR_CONFIG, RADAR_COLORS } from '../../../../shared/constants'
import { useRadarStore } from '../../../../store/useRadarStore'
import { useThemeStore } from '../../../../store/useThemeStore'

/**
 * Y-axis: Time Horizon / Maturity
 */
export function YAxis() {
  const { t } = useTranslation()
  const { MAX_RADIUS } = RADAR_CONFIG
  const { showAxisLabels, showHelperLabels } = useRadarStore()
  const theme = useThemeStore(state => state.theme)
  
  // Use higher contrast colors in light mode
  const axisColors = theme === 'light' ? RADAR_COLORS.AXIS_LIGHT : RADAR_COLORS.AXIS

  const timeLines = [
    {
      y: MAX_RADIUS * 0.5,
      labelKey: 'helperLabelNext',
      color: RADAR_COLORS.TIME_LINES.NEXT,
    },
    {
      y: MAX_RADIUS,
      labelKey: 'helperLabelFar',
      color: RADAR_COLORS.TIME_LINES.FAR,
    },
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
        <lineBasicMaterial color={axisColors.PRIMARY} linewidth={4} />
      </line>

      {/* Y-axis label at the end */}
      {showAxisLabels && (
        <Billboard position={[0, MAX_RADIUS + 0.5, 0]}>
          <Html
            center
            transform
            distanceFactor={10}
            zIndexRange={[0, 100]}
            style={{ pointerEvents: 'none', zIndex: 10 }}
          >
            <div className="text-gray-900 dark:text-gray-300 text-sm font-semibold no-select">
              {t('legend.yAxisLabel')}
            </div>
          </Html>
        </Billboard>
      )}

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
            <lineBasicMaterial
              color={axisColors.SECONDARY}
              opacity={theme === 'light' ? 0.7 : 0.4}
              transparent
            />
          </line>

          {/* Y-axis helper labels */}
          {showHelperLabels && (
            <Billboard position={[-0.5, line.y, 0]}>
              <Html
                center
                transform
                distanceFactor={10}
                zIndexRange={[0, 100]}
                style={{ pointerEvents: 'none', zIndex: 10 }}
              >
                <div className="text-gray-800 dark:text-gray-400 text-xs no-select">
                  {t(`grid.${line.labelKey}`)}
                </div>
              </Html>
            </Billboard>
          )}
        </group>
      ))}
    </group>
  )
}
