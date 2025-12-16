import { RADAR_COLORS } from '../../../../shared/constants'

/**
 * Origin marker at (0, 0, 0)
 */
export function OriginMarker() {
  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
      <meshStandardMaterial color={RADAR_COLORS.AXIS.PRIMARY} />
    </mesh>
  )
}

