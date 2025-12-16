import { useEffect } from 'react'
import { useCameraReset } from '../../hooks/useCameraReset'

/**
 * Reset view button component (inside Canvas)
 * Exports reset function globally for external use
 */
export function ResetViewButton() {
  const resetCamera = useCameraReset()

  // Export resetCamera for external access
  useEffect(() => {
    ;(window as any).__resetRadarCamera = resetCamera
    return () => {
      delete (window as any).__resetRadarCamera
    }
  }, [resetCamera])

  return null // This component renders nothing, it only exports the function
}

