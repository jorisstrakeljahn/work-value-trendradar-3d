import { useRef, useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

/**
 * Camera controls component
 */
export function CameraControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  // Export controls ref for reset button
  useEffect(() => {
    ;(window as any).__radarControlsRef = controlsRef
    return () => {
      delete (window as any).__radarControlsRef
    }
  }, [])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={8}
      maxDistance={35}
      autoRotate={false}
      minPolarAngle={Math.PI / 6} // Prevents too steep angles
      maxPolarAngle={Math.PI / 2.2} // Prevents looking from below
    />
  )
}

