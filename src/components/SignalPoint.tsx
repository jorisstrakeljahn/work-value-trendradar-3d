import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useRadarStore } from '../store/useRadarStore'
import type { Signal } from '../types/signal'

interface SignalPointProps {
  signal: Signal
}

export default function SignalPoint({ signal }: SignalPointProps) {
  const meshRef = useRef<Mesh>(null)
  const { selectedSignal, hoveredSignal, setSelectedSignal, setHoveredSignal } =
    useRadarStore()
  const [hovered, setHovered] = useState(false)

  const isSelected = selectedSignal?.id === signal.id
  const isHovered = hoveredSignal?.id === signal.id || hovered

  // Farbe basierend auf Work Value
  const getColor = () => {
    if (isSelected) return '#FFD700' // Gold für ausgewählt
    if (isHovered) return '#00FF00' // Grün für Hover
    if (signal.zWorkValue > 0) return '#3B82F6' // Blau für positive Work Value
    if (signal.zWorkValue < 0) return '#EF4444' // Rot für negative Work Value
    return '#94A3B8' // Grau für neutral
  }

  // Größe basierend auf Impact
  const size = 0.1 + (signal.xImpact / 100) * 0.15

  useFrame(() => {
    if (meshRef.current) {
      // Leichtes Pulsieren für ausgewählte/hovered Punkte
      if (isSelected || isHovered) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.2
        meshRef.current.scale.setScalar(scale)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedSignal(isSelected ? null : signal)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    setHoveredSignal(signal)
  }

  const handlePointerOut = () => {
    setHovered(false)
    if (hoveredSignal?.id === signal.id) {
      setHoveredSignal(null)
    }
  }

  if (!signal.position) return null

  return (
    <mesh
      ref={meshRef}
      position={[signal.position.x, signal.position.y, signal.position.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={getColor()}
        emissive={isSelected || isHovered ? getColor() : '#000000'}
        emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0}
      />
    </mesh>
  )
}

