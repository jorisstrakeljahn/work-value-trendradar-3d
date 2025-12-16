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
    <section className="relative w-full h-[calc(100vh-5rem)] bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200 overflow-x-auto">
      <div className="relative w-full h-full max-w-[1800px] mx-auto">
        {/* Left Sidebar: Filter + Legend (stacked) */}
        <div className="absolute left-4 top-4 flex flex-col gap-4 z-30">
          <FiltersPanel />
          <Legend />
        </div>

        {/* Center: Canvas */}
        <div className="absolute left-[19rem] right-[21rem] top-0 bottom-0">
          <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
            <RadarScene />
          </Canvas>
        </div>

        {/* Right Sidebar: Reset Button + Signal Details */}
        <div className="absolute right-4 top-4 flex flex-col gap-4 z-30">
          <ResetViewButtonOverlay />
          <SignalDetailsPanel />
        </div>

        <HoverTooltip />
        <ScrollIndicator />
      </div>
    </section>
  )
}

