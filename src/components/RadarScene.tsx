import SignalPoint from './SignalPoint'
import { useFilteredSignals } from '../features/radar/hooks/useFilteredSignals'
import { useCameraSetup } from '../features/radar/hooks/useCameraSetup'
import { SceneLighting } from '../features/radar/components/lighting/SceneLighting'
import { CameraControls } from '../features/radar/components/controls/CameraControls'
import { ResetViewButton } from '../features/radar/components/controls/ResetViewButton'
import { XAxis, YAxis, ZAxis, Semicircle, OriginMarker } from '../features/radar/components/axes'

/**
 * Main 3D radar scene component
 * Orchestrates all scene elements
 */
export default function RadarScene() {
  const signals = useFilteredSignals()
  useCameraSetup()

  return (
    <>
      <SceneLighting />
      <CameraControls />

      <XAxis />
      <YAxis />
      <ZAxis />
      <Semicircle />
      <OriginMarker />

      {/* Render signals as points */}
      {signals.map(signal => (
        <SignalPoint key={signal.id} signal={signal} />
      ))}

      <ResetViewButton />
    </>
  )
}
