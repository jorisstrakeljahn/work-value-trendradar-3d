import { Canvas } from '@react-three/fiber'
import RadarScene from './components/RadarScene'
import FiltersPanel from './components/FiltersPanel'
import SignalDetailsPanel from './components/SignalDetailsPanel'
import Legend from './components/Legend'
import HoverTooltip from './components/HoverTooltip'

function App() {
  return (
    <div className="relative w-full h-full bg-gray-900">
      <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
        <RadarScene />
      </Canvas>
      <HoverTooltip />
      <FiltersPanel />
      <SignalDetailsPanel />
      <Legend />
    </div>
  )
}

export default App

