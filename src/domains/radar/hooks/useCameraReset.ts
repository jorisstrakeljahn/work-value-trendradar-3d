import { useThree } from '@react-three/fiber'
import { RADAR_CONFIG } from '../../../shared/constants'

/**
 * Hook to reset camera to default position
 */
export function useCameraReset() {
  const { camera } = useThree()
  const { MAX_HEIGHT, CAMERA } = RADAR_CONFIG

  const resetCamera = () => {
    // Reset OrbitControls if available
    const controlsRef = window.__radarControlsRef
    if (controlsRef?.current) {
      controlsRef.current.reset()
    }

    // Set camera position manually (45° angle from above)
    const distance = CAMERA.DISTANCE
    const angle = CAMERA.ANGLE

    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + MAX_HEIGHT / 2,
      distance * Math.cos(angle)
    )
    camera.lookAt(0, MAX_HEIGHT / 2, 0)
  }

  return resetCamera
}
