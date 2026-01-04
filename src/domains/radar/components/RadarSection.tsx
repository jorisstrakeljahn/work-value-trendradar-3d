import { Canvas } from '@react-three/fiber'
import RadarScene from './RadarScene'
import FiltersPanel from './FiltersPanel'
import SignalDetailsPanel from './SignalDetailsPanel'
import Legend from './Legend'
import HoverTooltip from './HoverTooltip'
import ResetViewButtonOverlay from './ResetViewButtonOverlay'
import ScrollIndicator from './ScrollIndicator'
import { useModalStore } from '../../../store/useModalStore'

export default function RadarSection() {
  const { isAnyModalOpen } = useModalStore()

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200 overflow-x-auto">
      <div className="relative w-full h-full max-w-[1800px] mx-auto">
        {/* Left Sidebar: Filter + Legend (stacked) - Hidden on mobile */}
        <div className="hidden md:absolute md:left-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <FiltersPanel />
          <Legend />
        </div>

        {/* Center: Canvas - Full width on mobile, centered on desktop */}
        <div className="absolute left-0 right-0 md:left-[19rem] md:right-[21rem] top-0 bottom-0">
          <div className={`relative w-full h-full ${isAnyModalOpen ? 'pointer-events-none opacity-0 invisible' : ''}`}>
            <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
              <RadarScene />
            </Canvas>
          </div>
        </div>

        {/* Right Sidebar: Reset Button + Signal Details - Hidden on mobile */}
        <div className="hidden md:absolute md:right-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <ResetViewButtonOverlay />
          <SignalDetailsPanel />
        </div>

        {/* HoverTooltip - Hidden on mobile (no hover on touch devices) */}
        <HoverTooltip />
        <ScrollIndicator />
      </div>
    </section>
  )
}
