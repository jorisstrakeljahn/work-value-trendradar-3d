import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import type { Signal, Industry } from '../types/signal'

interface SignalPointProps {
  signal: Signal
}

export default function SignalPoint({ signal }: SignalPointProps) {
  const meshRef = useRef<Mesh>(null)
  const { selectedSignal, hoveredSignal, setSelectedSignal, setHoveredSignal } =
    useRadarStore()
  const [hovered, setHovered] = useState(false)
  const industries = industriesData as Industry[]

  const isSelected = selectedSignal?.id === signal.id
  const isHovered = hoveredSignal?.id === signal.id || hovered

  // Farbe basierend auf erster Branche
  const getColor = () => {
    if (isSelected) return '#FFD700' // Gold für ausgewählt
    if (isHovered) return '#FFFFFF' // Weiß für Hover

    // Verwende Farbe der ersten Branche
    if (signal.industryTags.length > 0) {
      const firstIndustry = industries.find((ind) => ind.id === signal.industryTags[0])
      if (firstIndustry) {
        return firstIndustry.color
      }
    }

    // Fallback: Grau
    return '#94A3B8'
  }

  // Größe basierend auf Impact
  const size = 0.08 + (signal.xImpact / 100) * 0.12

  useFrame(() => {
    if (meshRef.current) {
      // Leichtes Pulsieren für ausgewählte/hovered Punkte
      if (isSelected || isHovered) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.3
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
        emissiveIntensity={isSelected ? 0.6 : isHovered ? 0.4 : 0}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}
