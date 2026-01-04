import SignalPoint from './SignalPoint'
import { useFilteredSignals } from '../hooks/useFilteredSignals'
import { useCameraSetup } from '../hooks/useCameraSetup'
import { SceneLighting } from './lighting/SceneLighting'
import { CameraControls } from './controls/CameraControls'
import { ResetViewButton } from './controls/ResetViewButton'
import { XAxis, YAxis, ZAxis, Semicircle } from './axes'

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

      {/* Render signals as points */}
      {signals.map(signal => (
        <SignalPoint key={signal.id} signal={signal} />
      ))}

      <ResetViewButton />
    </>
  )
}
