import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import signalsData from '../data/signals.seed.json'
import { mapSignalToPosition } from '../lib/mapping'
import SignalPoint from './SignalPoint'
import ResetViewButton from './ResetViewButton'
import { useRadarStore } from '../store/useRadarStore'
import type { Signal } from '../types/signal'

const MAX_RADIUS = 8 // Vergrößert für mehr Abstand
const MAX_HEIGHT = 8 // Verlängert für mehr Abstand zwischen Punkten

export default function RadarScene() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const { filters } = useRadarStore()

  // Signale mit Positionen mappen und filtern
  const signals = useMemo(() => {
    let filtered = signalsData as Signal[]

    // Filter nach Branchen
    if (filters.industries && filters.industries.length > 0) {
      filtered = filtered.filter((signal) =>
        signal.industryTags.some((tag) => filters.industries.includes(tag))
      )
    }

    // Filter nach Impact
    filtered = filtered.filter(
      (signal) =>
        signal.xImpact >= filters.minImpact && signal.xImpact <= filters.maxImpact
    )

    return filtered.map((signal) => ({
      ...signal,
      position: mapSignalToPosition(signal, MAX_RADIUS, MAX_HEIGHT),
    }))
  }, [filters])

  useEffect(() => {
    // Kamera von oben (45° Winkel) - zeigt auf x/y Ebene
    const distance = 18
    const angle = Math.PI / 4 // 45 Grad
    camera.position.set(
      distance * Math.cos(angle),
      distance * Math.sin(angle) + MAX_HEIGHT / 2, // Angepasst für längere Z-Achse
      distance * Math.cos(angle)
    )
    camera.lookAt(0, MAX_HEIGHT / 2, 0)
  }, [camera])

  // Export controls ref für Reset-Button
  useEffect(() => {
    ;(window as any).__radarControlsRef = controlsRef
  }, [])

  // Zeithorizont-Linien (Y-Achse: Now, Next, Far)
  const timeLines = [
    { y: (MAX_RADIUS * 0.33), label: 'Now', color: '#10B981' },
    { y: (MAX_RADIUS * 0.66), label: 'Next', color: '#F59E0B' },
    { y: MAX_RADIUS, label: 'Far', color: '#EF4444' },
  ]

  // Impact/Relevanz-Linien (X-Achse: -maxRadius bis +maxRadius)
  const impactLines = [
    { x: -MAX_RADIUS, label: 'Low Impact', color: '#6B7280' },
    { x: 0, label: 'Medium Impact', color: '#9CA3AF' },
    { x: MAX_RADIUS, label: 'High Impact', color: '#3B82F6' },
  ]

  return (
    <>
      {/* Beleuchtung */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -5]} intensity={0.4} />

      {/* Orbit Controls für Kamera-Steuerung */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={35}
        autoRotate={false}
        minPolarAngle={Math.PI / 6} // Verhindert zu steile Winkel
        maxPolarAngle={Math.PI / 2.2} // Verhindert von unten zu schauen
      />


      {/* X-Achse: Impact / Relevanz */}
      <group>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-MAX_RADIUS - 0.5, 0, 0, MAX_RADIUS + 1.5, 0, 0])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6B7280" linewidth={2} />
        </line>
        {/* X-Achsen-Beschriftung am Ende */}
        <Html
          position={[MAX_RADIUS + 1.5, -1.2, 0]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 text-sm font-semibold">
            Impact / Relevanz
          </div>
        </Html>
        {/* X-Achsen-Labels - immer sichtbar, skalierbar */}
        {impactLines.map((line, i) => (
          <Html
            key={i}
            position={[line.x, -0.5, 0]}
            center
            transform
            distanceFactor={10}
            style={{ pointerEvents: 'none' }}
          >
            <div className="text-gray-600 text-xs">
              {line.label}
            </div>
          </Html>
        ))}
        {/* X-Achsen-Markierungen */}
        {impactLines.map((line, i) => (
          <mesh key={`marker-${i}`} position={[line.x, 0.05, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.05]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
        ))}
      </group>

      {/* Y-Achse: Zeithorizont / Reifegrad */}
      <group>
        {/* Y-Achsen-Linie (vertikal, von 0 bis maxRadius) */}
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
        {/* Y-Achsen-Beschriftung am Ende */}
        <Html
          position={[-1.2, MAX_RADIUS + 1.5, 0]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 text-sm font-semibold">
            Zeithorizont / Reifegrad
          </div>
        </Html>
        {/* Y-Achsen-Linien (vertikal, von 0 bis maxRadius) */}
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
            {/* Y-Achsen-Labels - immer sichtbar, skalierbar */}
            <Html
              position={[-0.5, line.y, 0]}
              center
              transform
              distanceFactor={10}
              style={{ pointerEvents: 'none' }}
            >
              <div className="text-gray-600 text-xs">
                {line.label}
              </div>
            </Html>
            {/* Y-Achsen-Markierungen */}
            <mesh position={[0, line.y, 0.05]}>
              <boxGeometry args={[0.1, 0.05, 0.05]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Z-Achse: Work-Value-Index (Höhe) */}
      <group>
        {/* Z-Achsen-Linie (vertikal, von 0 bis maxHeight) */}
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
        {/* Z-Achsen-Beschriftung am Ende - auf gleicher Höhe wie Impact/Relevanz */}
        <Html
          position={[0.3, -1.2, MAX_HEIGHT + 0.5]}
          center
          transform
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-gray-700 text-sm font-semibold">
            Work-Value-Index
          </div>
        </Html>
        {/* Z-Achsen-Markierungen (Low, Medium, High) */}
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
              <div className="text-gray-600 text-xs">
                {marker.label}
              </div>
            </Html>
          </group>
        ))}
      </group>
      {/* Halbkreis-Linie für X/Y Ebene - endet auf X-Achse (Impact/Relevanz) */}
      <group>
        {Array.from({ length: 64 }).map((_, i) => {
          // Halbkreis von 0 bis π (von rechts nach links auf X-Achse)
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

      {/* Ursprung-Marker */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>

      {/* Signale als Punkte rendern */}
      {signals.map((signal) => (
        <SignalPoint key={signal.id} signal={signal} />
      ))}

      {/* Reset-Button Komponente (exportiert Funktion) */}
      <ResetViewButton />
    </>
  )
}
