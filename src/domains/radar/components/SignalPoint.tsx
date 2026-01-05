import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Mesh } from 'three'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import { useRadarStore } from '../../../store/useRadarStore'
import { useModalStore } from '../../../store/useModalStore'
import { useSignalWindowsStore } from '../../../store/useSignalWindowsStore'
import { useIndustries } from '../../../shared/hooks/useIndustries'
import { preloadImage } from '../../../shared/utils/imagePreloader'
import type { Signal } from '../../../types/signal'

interface SignalPointProps {
  signal: Signal
}

function SignalPoint({ signal }: SignalPointProps) {
  const meshRef = useRef<Mesh>(null)
  const { hoveredSignal, setSelectedSignal, setHoveredSignal } = useRadarStore()
  const { isAnyModalOpen } = useModalStore()
  const { windows, openWindow, closeWindow } = useSignalWindowsStore()
  const [hovered, setHovered] = useState(false)
  const industries = useIndustries()

  // Check if a window is open for this signal
  const hasOpenWindow = windows.some(w => w.signalId === signal.id)
  const isHovered = hoveredSignal?.id === signal.id || hovered

  // Color based on first industry (memoized to update when industries change)
  const baseColor = useMemo(() => {
    // Use color of first industry from signal.industryTags
    if (signal.industryTags && signal.industryTags.length > 0) {
      const firstIndustryId = signal.industryTags[0]
      const firstIndustry = industries.find(ind => ind.id === firstIndustryId)
      if (firstIndustry && firstIndustry.color) {
        return firstIndustry.color
      }
    }

    // Fallback: Gray if no industry or industry not found
    return '#94A3B8'
  }, [signal.industryTags, industries])

  // Color for current state (hover overrides base color)
  const currentColor = isHovered ? '#FFFFFF' : baseColor

  // Fixed size for all points (uniform, larger for better clickability)
  const baseSize = 0.22

  // Preload image when signal is hovered (for instant display when window opens)
  useEffect(() => {
    if (isHovered && signal.imageUrl) {
      preloadImage(signal.imageUrl).catch(() => {
        // Silently fail - image will load when window opens
      })
    }
  }, [isHovered, signal.imageUrl])

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

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
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
    },
    [isAnyModalOpen, hasOpenWindow, windows, signal, closeWindow, setSelectedSignal, openWindow]
  )

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (isAnyModalOpen) return
      e.stopPropagation()
      setHovered(true)
      setHoveredSignal(signal)
    },
    [isAnyModalOpen, setHoveredSignal, signal]
  )

  const handlePointerOut = useCallback(() => {
    if (isAnyModalOpen) return
    setHovered(false)
    if (hoveredSignal?.id === signal.id) {
      setHoveredSignal(null)
    }
  }, [isAnyModalOpen, hoveredSignal, signal, setHoveredSignal])

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
        color={currentColor}
        emissive={isHovered || hasOpenWindow ? currentColor : '#000000'}
        emissiveIntensity={isHovered ? 0.8 : hasOpenWindow ? 1.4 : 0}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  )
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if signal properties change
export default React.memo(SignalPoint, (prevProps, nextProps) => {
  // Custom comparison: only re-render if signal id or position changes
  return (
    prevProps.signal.id === nextProps.signal.id &&
    prevProps.signal.position?.x === nextProps.signal.position?.x &&
    prevProps.signal.position?.y === nextProps.signal.position?.y &&
    prevProps.signal.position?.z === nextProps.signal.position?.z &&
    prevProps.signal.industryTags.length === nextProps.signal.industryTags.length &&
    prevProps.signal.industryTags.every(
      (tag, i) => tag === nextProps.signal.industryTags[i]
    )
  )
})
