import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useRadarStore } from '../../../store/useRadarStore'
import { useModalStore } from '../../../store/useModalStore'
import { useSignalWindowsStore } from '../../../store/useSignalWindowsStore'
import { useIndustries } from '../../../shared/hooks/useIndustries'
import type { Signal } from '../../../types/signal'

interface SignalPointProps {
  signal: Signal
}

export default function SignalPoint({ signal }: SignalPointProps) {
  const meshRef = useRef<Mesh>(null)
  const { hoveredSignal, setSelectedSignal, setHoveredSignal } = useRadarStore()
  const { isAnyModalOpen } = useModalStore()
  const { windows, openWindow, closeWindow } = useSignalWindowsStore()
  const [hovered, setHovered] = useState(false)
  const industries = useIndustries()

  // Check if a window is open for this signal
  const hasOpenWindow = windows.some(w => w.signalId === signal.id)
  const isHovered = hoveredSignal?.id === signal.id || hovered

  // Color based on first industry
  const getColor = () => {
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

  // Fixed size for all points (uniform, larger for better clickability)
  const baseSize = 0.22

  useFrame(() => {
    if (meshRef.current) {
      // Pulsing effect for points with open windows
      if (hasOpenWindow) {
        const scale = 1 + Math.sin(Date.now() * 0.005) * 0.3
        meshRef.current.scale.setScalar(scale)
      } else {
        // Static size increase for hover (no pulsing)
        const hoverScale = isHovered ? 1.4 : 1.0
        meshRef.current.scale.setScalar(hoverScale)
      }
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isAnyModalOpen) {
      return
    }
    e.stopPropagation()

    // If window is already open, close it
    if (hasOpenWindow) {
      const windowToClose = windows.find(w => w.signalId === signal.id)
      if (windowToClose) {
        closeWindow(windowToClose.id)
        setSelectedSignal(null) // Clear selection
      }
    } else {
      // Open window for this signal
      setSelectedSignal(signal)
      openWindow(signal.id)
    }
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
      <sphereGeometry args={[baseSize, 16, 16]} />
      <meshStandardMaterial
        color={getColor()}
        emissive={isHovered || hasOpenWindow ? getColor() : '#000000'}
        emissiveIntensity={isHovered ? 0.8 : hasOpenWindow ? 1.4 : 0}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}
