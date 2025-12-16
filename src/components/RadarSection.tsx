import { Canvas } from '@react-three/fiber'
import RadarScene from './RadarScene'
import FiltersPanel from './FiltersPanel'
import SignalDetailsPanel from './SignalDetailsPanel'
import Legend from './Legend'
import HoverTooltip from './HoverTooltip'
import ResetViewButtonOverlay from './ResetViewButtonOverlay'
import ScrollIndicator from './ScrollIndicator'

export default function RadarSection() {
  return (
    <section className="relative w-full h-screen bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200">
      <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
        <RadarScene />
      </Canvas>
      <HoverTooltip />
      <ResetViewButtonOverlay />
      <FiltersPanel />
      <SignalDetailsPanel />
      <Legend />
      <ScrollIndicator />
    </section>
  )
}

