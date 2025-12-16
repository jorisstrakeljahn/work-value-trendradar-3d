import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function ResetViewButton() {
  const { camera } = useThree()

  const resetCamera = () => {
    // Reset OrbitControls if available
    const controlsRef = (window as any).__radarControlsRef
    if (controlsRef?.current) {
      controlsRef.current.reset()
    }

    // Set camera position manually (45° angle from above)
    const distance = 18
    const angle = Math.PI / 4 // 45 degrees
    const maxHeight = 8 // Corresponds to MAX_HEIGHT in RadarScene
    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + maxHeight / 2,
      distance * Math.cos(angle)
    )
    camera.lookAt(0, maxHeight / 2, 0)
  }

  // Export resetCamera for external access
  useEffect(() => {
    ;(window as any).__resetRadarCamera = resetCamera
    return () => {
      delete (window as any).__resetRadarCamera
    }
  }, [camera])

  return null // This component renders nothing, it only exports the function
}
