import { useEffect, useMemo } from 'react'
import { OrbitControls, Grid, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import signalsData from '../data/signals.seed.json'
import { mapSignalToPosition } from '../lib/mapping'
import SignalPoint from './SignalPoint'
import type { Signal } from '../types/signal'

export default function RadarScene() {
  const { camera } = useThree()

  // Signale mit Positionen mappen
  const signals = useMemo(() => {
    return (signalsData as Signal[]).map((signal) => ({
      ...signal,
      position: mapSignalToPosition(signal),
    }))
  }, [])

  useEffect(() => {
    // Kamera initial positionieren
    camera.position.set(8, 8, 8)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      {/* Beleuchtung */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} />

      {/* Orbit Controls für Kamera-Steuerung */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={20}
        autoRotate={false}
      />

      {/* Grid für Orientierung */}
      <Grid
        args={[20, 20]}
        cellColor="#6B7280"
        sectionColor="#9CA3AF"
        cellThickness={0.5}
        sectionThickness={1}
        fadeDistance={25}
        fadeStrength={1}
      />

      {/* Achsen-Beschriftungen */}
      <Text
        position={[6, 0, 0]}
        fontSize={0.5}
        color="#3B82F6"
        anchorX="center"
        anchorY="middle"
      >
        Impact →
      </Text>
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#10B981"
        anchorX="center"
        anchorY="middle"
      >
        Horizon ↑
      </Text>
      <Text
        position={[0, 0, 6]}
        fontSize={0.5}
        color="#EF4444"
        anchorX="center"
        anchorY="middle"
      >
        Work Value ↗
      </Text>

      {/* Koordinatenachsen */}
      <group>
        {/* X-Achse (Impact) - Blau */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 0.02, 0.02]} />
          <meshStandardMaterial color="#3B82F6" />
        </mesh>
        {/* Y-Achse (Horizon) - Grün */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 10, 0.02]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
        {/* Z-Achse (Work Value) - Rot */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.02, 10]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Signale als Punkte rendern */}
      {signals.map((signal) => (
        <SignalPoint key={signal.id} signal={signal} />
      ))}
    </>
  )
}
