import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { RADAR_CONFIG } from '../../../shared/constants'

/**
 * Hook to setup camera position and orientation
 */
export function useCameraSetup() {
  const { camera } = useThree()
  const { MAX_HEIGHT, CAMERA } = RADAR_CONFIG

  useEffect(() => {
    // Camera from above (45° angle) - shows x/y plane
    const distance = CAMERA.DISTANCE
    const angle = CAMERA.ANGLE

    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + MAX_HEIGHT / 2,
      distance * Math.cos(angle)
    )
    camera.lookAt(0, MAX_HEIGHT / 2, 0)
  }, [camera, MAX_HEIGHT, CAMERA.DISTANCE, CAMERA.ANGLE])
}

