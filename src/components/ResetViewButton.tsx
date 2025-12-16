import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function ResetViewButton() {
  const { camera } = useThree()

  const resetCamera = () => {
    // Reset OrbitControls falls verfügbar
    const controlsRef = (window as any).__radarControlsRef
    if (controlsRef?.current) {
      controlsRef.current.reset()
    }

    // Setze Kamera-Position manuell (45° Winkel von oben)
    const distance = 18
    const angle = Math.PI / 4 // 45 Grad
    const maxHeight = 8 // Entspricht MAX_HEIGHT in RadarScene
    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + maxHeight / 2,
      distance * Math.cos(angle)
    )
    camera.lookAt(0, maxHeight / 2, 0)
  }

  // Exportiere resetCamera für externen Zugriff
  useEffect(() => {
    ;(window as any).__resetRadarCamera = resetCamera
    return () => {
      delete (window as any).__resetRadarCamera
    }
  }, [camera])

  return null // Diese Komponente rendert nichts, sie exportiert nur die Funktion
}

