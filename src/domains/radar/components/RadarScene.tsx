import { useMemo } from 'react'
import SignalPoint from './SignalPoint'
import { useFilteredSignals } from '../hooks/useFilteredSignals'
import { useCameraSetup } from '../hooks/useCameraSetup'
import { SceneLighting } from './lighting/SceneLighting'
import { CameraControls } from './controls/CameraControls'
import { ResetViewButton } from './controls/ResetViewButton'
import { XAxis, YAxis, ZAxis, Semicircle } from './axes'
import { ReferenceGrid } from './ReferenceGrid'

/**
 * Main 3D radar scene component
 * Orchestrates all scene elements
 * Optimized for performance with many signals
 */
export default function RadarScene() {
  const signals = useFilteredSignals()
  useCameraSetup()

  // Memoize signal points to prevent unnecessary re-renders
  // Only re-render when signals array changes
  const signalPoints = useMemo(
    () =>
      signals.map(signal => <SignalPoint key={signal.id} signal={signal} />),
    [signals]
  )

  return (
    <>
      <SceneLighting />
      <CameraControls />

      <XAxis />
      <YAxis />
      <ZAxis />
      <Semicircle />

      {/* Reference grid for spatial orientation */}
      <ReferenceGrid />

      {/* Render signals as points - memoized for performance */}
      {signalPoints}

      <ResetViewButton />
    </>
  )
}
