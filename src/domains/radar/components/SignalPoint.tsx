import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useRadarStore } from '../../../store/useRadarStore'
import { useModalStore } from '../../../store/useModalStore'
import { useIndustries } from '../../../shared/hooks/useIndustries'
import type { Signal } from '../../../types/signal'

interface SignalPointProps {
  signal: Signal
}

export default function SignalPoint({ signal }: SignalPointProps) {
  const meshRef = useRef<Mesh>(null)
  const { selectedSignal, hoveredSignal, setSelectedSignal, setHoveredSignal } =
    useRadarStore()
  const { isAnyModalOpen } = useModalStore()
  const [hovered, setHovered] = useState(false)
  const industries = useIndustries()

  const isSelected = selectedSignal?.id === signal.id
  const isHovered = hoveredSignal?.id === signal.id || hovered

  // Color based on first industry
  const getColor = () => {
    if (isSelected) return '#FFD700' // Gold for selected
    if (isHovered) return '#FFFFFF' // White for hover

    // Use color of first industry
    if (signal.industryTags.length > 0) {
      const firstIndustry = industries.find(
        ind => ind.id === signal.industryTags[0]
      )
      if (firstIndustry) {
        return firstIndustry.color
      }
    }

    // Fallback: Gray
    return '#94A3B8'
  }

  // Size based on impact
  const size = 0.08 + (signal.xImpact / 100) * 0.12

  useFrame(() => {
    if (meshRef.current) {
      // Slight pulsing for selected/hovered points
      if (isSelected || isHovered) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.3
        meshRef.current.scale.setScalar(scale)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    console.log('[SignalPoint] Click detected:', {
      signalId: signal.id,
      signalTitle: signal.title,
      isAnyModalOpen,
      isSelected,
    })
    if (isAnyModalOpen) {
      console.log('[SignalPoint] Modal is open, ignoring click')
      return
    }
    e.stopPropagation()
    const newSignal = isSelected ? null : signal
    console.log('[SignalPoint] Setting selectedSignal:', newSignal ? newSignal.id : 'null')
    setSelectedSignal(newSignal)
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (isAnyModalOpen) return
    e.stopPropagation()
    setHovered(true)
    setHoveredSignal(signal)
  }

  const handlePointerOut = () => {
    if (isAnyModalOpen) return
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
