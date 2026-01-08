import { useState, useEffect, useMemo } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'
import { useSignals } from '../../../shared/hooks/useSignals'
import { useAuthStore } from '../../../store/useAuthStore'
import { SignalDetailsContent } from './signal-details/SignalDetailsContent'
import { SignalWindowHeader, SignalWindowLoading } from './signal-window'
import SignalFormModal from '../../admin/components/SignalFormModal'
import DeleteSignalModal from '../../admin/components/DeleteSignalModal'
import { deleteSignal } from '../../../firebase/services/signalsService'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { SIGNAL_WINDOW_CONFIG } from '../../../shared/constants/radar'
import type { Signal } from '../../../types/signal'

interface DraggableSignalWindowProps {
  signalId: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  onClose: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
  onFocus: () => void
}

/**
 * Draggable and resizable window component for displaying signal details
 * Uses react-rnd for drag and resize functionality
 */
export default function DraggableSignalWindow({
  signalId,
  position,
  size,
  zIndex,
  onClose,
  onPositionChange,
  onSizeChange,
  onFocus,
}: DraggableSignalWindowProps) {
  const signals = useSignals()
  const { user } = useAuthStore()

  // Always get signal from signals array (which is updated with current language)
  // This ensures that when language changes, the signal content is updated
  // Memoize to prevent unnecessary re-renders
  const signal = useMemo(
    () => signals.find((s: Signal) => s.id === signalId),
    [signals, signalId]
  )

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Close window if signal not found, but only if signals have been loaded
  // (don't close if signals are still loading)
  useEffect(() => {
    // Only close if signals array exists but signal is still not found
    // This means signals were loaded but this signal doesn't exist
    if (signals.length > 0 && !signal) {
      onClose()
    }
  }, [signal, signals.length, onClose])

  // Show loading state or null while signals are loading or signal not found
  if (!signal) {
    // If signals haven't loaded yet, show loading state
    if (signals.length === 0) {
      return (
        <SignalWindowLoading
          position={position}
          size={size}
          zIndex={zIndex}
          onClose={onClose}
        />
      )
    }
    // Signal not found after signals loaded - return null (useEffect will close)
    return null
  }

  const handleDragStop: RndDragCallback = (_e, d) => {
    onPositionChange({ x: d.x, y: d.y })
  }

  const handleResizeStop: RndResizeCallback = (
    _e,
    _direction,
    ref,
    _delta,
    position
  ) => {
    onSizeChange({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    })
    onPositionChange({ x: position.x, y: position.y })
  }

  const handleMouseDown = () => {
    onFocus()
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!signal?.id) return
    setDeleting(true)
    try {
      await deleteSignal(signal.id)
      setShowDeleteModal(false)
      onClose() // Close window after deletion
    } catch (error) {
      logErrorWithContext(
        error instanceof Error ? error : new Error(String(error)),
        'DraggableSignalWindow',
        'handleDeleteConfirm',
        { signalId: signal?.id }
      )
      throw error
    } finally {
      setDeleting(false)
    }
  }

  // Calculate max size (90% of viewport)
  const maxWidth =
    typeof window !== 'undefined'
      ? window.innerWidth * SIGNAL_WINDOW_CONFIG.MAX_SIZE_RATIO
      : SIGNAL_WINDOW_CONFIG.FALLBACK_MAX_WIDTH
  const maxHeight =
    typeof window !== 'undefined'
      ? window.innerHeight * SIGNAL_WINDOW_CONFIG.MAX_SIZE_RATIO
      : SIGNAL_WINDOW_CONFIG.FALLBACK_MAX_HEIGHT

  return (
    <>
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        minWidth={SIGNAL_WINDOW_CONFIG.MIN_WIDTH}
        minHeight={SIGNAL_WINDOW_CONFIG.MIN_HEIGHT}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        bounds="window"
        lockAspectRatio={false}
        dragHandleClassName="window-header"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={handleMouseDown}
        style={{
          zIndex,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] overflow-hidden"
      >
        <SignalWindowHeader title={signal.title} onClose={onClose} />

        {/* Content Area - scrollable */}
        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{
            maxHeight: '100%',
            colorScheme: 'light dark',
          }}
        >
          <SignalDetailsContent
            signal={signal}
            onEdit={user ? handleEdit : undefined}
            onDelete={user ? handleDelete : undefined}
          />
        </div>
      </Rnd>

      {/* Modals for editing/deleting */}
      {user && (
        <>
          <SignalFormModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            signal={signal}
            onSuccess={() => {
              setShowEditModal(false)
            }}
          />

          <DeleteSignalModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            signal={signal}
            loading={deleting}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </>
  )
}
