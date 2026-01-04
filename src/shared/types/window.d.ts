import type { RefObject } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/**
 * Extended Window interface for global references
 * Used for cross-component communication in 3D scene
 */
declare global {
  interface Window {
    __radarControlsRef?: RefObject<OrbitControlsImpl>
    __resetRadarCamera?: () => void
  }
}

export {}
