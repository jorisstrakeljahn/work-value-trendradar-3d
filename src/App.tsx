import { Canvas } from '@react-three/fiber'
import RadarScene from './components/RadarScene'
import FiltersPanel from './components/FiltersPanel'
import SignalDetailsPanel from './components/SignalDetailsPanel'
import Legend from './components/Legend'
import HoverTooltip from './components/HoverTooltip'
import ResetViewButtonOverlay from './components/ResetViewButtonOverlay'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <div className="relative w-full h-full bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200">
      <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
        <RadarScene />
      </Canvas>
      <ThemeToggle />
      <HoverTooltip />
      <ResetViewButtonOverlay />
      <FiltersPanel />
      <SignalDetailsPanel />
      <Legend />
    </div>
  )
}

export default App
