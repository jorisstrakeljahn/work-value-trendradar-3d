import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useSignals } from '../lib/useSignals'
import { mapSignalToPosition } from '../lib/mapping'
import SignalPoint from './SignalPoint'
import ResetViewButton from './ResetViewButton'
import { useRadarStore } from '../store/useRadarStore'
import type { Signal } from '../types/signal'

// Maximum radius for x/y plane
const MAX_RADIUS = 8
// Maximum height for z-axis
const MAX_HEIGHT = 8

export default function RadarScene() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const { filters } = useRadarStore()
  const signalsData = useSignals()

  // Map signals to positions and apply filters
  const signals = useMemo(() => {
    let filtered = signalsData as Signal[]

    // Filter by industries
    if (filters.industries && filters.industries.length > 0) {
      filtered = filtered.filter(signal =>
        signal.industryTags.some(tag => filters.industries.includes(tag))
      )
    }

    // Filter by impact
    filtered = filtered.filter(
      signal =>
        signal.xImpact >= filters.minImpact &&
        signal.xImpact <= filters.maxImpact
    )

    return filtered.map(signal => ({
      ...signal,
      position: mapSignalToPosition(signal, MAX_RADIUS, MAX_HEIGHT),
    }))
  }, [filters, signalsData])

  useEffect(() => {
    // Camera from above (45° angle) - shows x/y plane
    const distance = 18
    const angle = Math.PI / 4 // 45 degrees
    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + MAX_HEIGHT / 2, // Adjusted for longer z-axis
      distance * Math.cos(angle)
    )
    camera.lookAt(0, MAX_HEIGHT / 2, 0)
  }, [camera])

  // Export controls ref for reset button
  useEffect(() => {
    ;(window as any).__radarControlsRef = controlsRef
  }, [])

  // Time horizon lines (Y-axis: Now, Next, Far)
  const timeLines = [
    { y: MAX_RADIUS * 0.33, label: 'Now', color: '#10B981' },
    { y: MAX_RADIUS * 0.66, label: 'Next', color: '#F59E0B' },
    { y: MAX_RADIUS, label: 'Far', color: '#EF4444' },
  ]

  // Impact/Relevance lines (X-axis: -maxRadius to +maxRadius)
  const impactLines = [
    { x: -MAX_RADIUS, label: 'Low Impact', color: '#6B7280' },
    { x: 0, label: 'Medium Impact', color: '#9CA3AF' },
    { x: MAX_RADIUS, label: 'High Impact', color: '#3B82F6' },
  ]

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -5]} intensity={0.4} />

      {/* Orbit Controls for camera control */}
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

      {/* X-axis: Impact / Relevance */}
      <group>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={
                new Float32Array([
                  -MAX_RADIUS - 0.5,
                  0,
                  0,
                  MAX_RADIUS + 1.5,
                  0,
                  0,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6B7280" linewidth={2} />
        </line>
        {/* X-axis label at the end */}
        <Html
          position={[MAX_RADIUS + 1.5, -1.2, 0]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
            Impact / Relevanz
          </div>
        </Html>
        {/* X-axis labels - always visible, scalable */}
        {impactLines.map((line, i) => (
          <Html
            key={i}
            position={[line.x, -0.5, 0]}
            center
            transform
            distanceFactor={10}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-gray-600 dark:text-gray-400 text-xs">{line.label}</div>
          </Html>
        ))}
        {/* X-axis markers */}
        {impactLines.map((line, i) => (
          <mesh key={`marker-${i}`} position={[line.x, 0.05, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
        ))}
      </group>

      {/* Y-axis: Time Horizon / Maturity */}
      <group>
        {/* Y-axis line (vertical, from 0 to maxRadius) */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, MAX_RADIUS + 1.5, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6B7280" linewidth={2} />
        </line>
        {/* Y-axis label at the end */}
        <Html
          position={[-1.2, MAX_RADIUS + 1.5, 0]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
            Zeithorizont / Reifegrad
          </div>
        </Html>
        {/* Y-axis lines (vertical, from 0 to maxRadius) */}
        {timeLines.map((line, i) => (
          <group key={i}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0, 0, 0, line.y, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#9CA3AF" opacity={0.4} transparent />
            </line>
            {/* Y-axis labels - always visible, scalable */}
            <Html
              position={[-0.5, line.y, 0]}
              center
              transform
              distanceFactor={10}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-gray-600 dark:text-gray-400 text-xs">{line.label}</div>
            </Html>
            {/* Y-axis markers */}
            <mesh position={[0, line.y, 0.05]}>
              <boxGeometry args={[0.1, 0.05, 0.05]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Z-axis: Work-Value-Index (Height) */}
      <group>
        {/* Z-axis line (vertical, from 0 to maxHeight) */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([0, 0, 0, 0, 0, MAX_HEIGHT])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6B7280" linewidth={2} />
        </line>
        {/* Z-axis label at the end - at same height as Impact/Relevance */}
        <Html
          position={[0.3, -1.2, MAX_HEIGHT + 0.5]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
            Work-Value-Index
          </div>
        </Html>
        {/* Z-axis markers (Low, Medium, High) */}
        {[
          { z: MAX_HEIGHT / 2, label: 'Medium Value' },
          { z: MAX_HEIGHT, label: 'High Value' },
        ].map((marker, i) => (
          <group key={i}>
            <mesh position={[0, 0, marker.z]}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
            <Html
              position={[0.5, 0, marker.z]}
              center
              transform
              distanceFactor={10}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-gray-600 dark:text-gray-400 text-xs">{marker.label}</div>
            </Html>
          </group>
        ))}
      </group>
      {/* Semicircle line for X/Y plane - ends on X-axis (Impact/Relevance) */}
      <group>
        {Array.from({ length: 64 }).map((_, i) => {
          // Semicircle from 0 to π (from right to left on X-axis)
          const angle = (i / 64) * Math.PI
          const x1 = MAX_RADIUS * Math.cos(angle)
          const y1 = MAX_RADIUS * Math.sin(angle)
          const nextAngle = ((i + 1) / 64) * Math.PI
          const x2 = MAX_RADIUS * Math.cos(nextAngle)
          const y2 = MAX_RADIUS * Math.sin(nextAngle)

          return (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([x1, y1, -0.05, x2, y2, -0.05])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#9CA3AF" opacity={0.3} transparent />
            </line>
          )
        })}
      </group>

      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>

      {/* Render signals as points */}
      {signals.map(signal => (
        <SignalPoint key={signal.id} signal={signal} />
      ))}

      {/* Reset button component (exports function) */}
      <ResetViewButton />
    </>
  )
}
