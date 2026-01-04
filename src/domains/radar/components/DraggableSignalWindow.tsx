import { useState, useEffect } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSignals } from '../../../shared/hooks/useSignals'
import { useAuthStore } from '../../../store/useAuthStore'
import { useRadarStore } from '../../../store/useRadarStore'
import { SignalDetailsContent } from './signal-details/SignalDetailsContent'
import SignalFormModal from '../../admin/components/SignalFormModal'
import DeleteSignalModal from '../../admin/components/DeleteSignalModal'
import { deleteSignal } from '../../../firebase/services/signalsService'
import type { Signal } from '../../../types/signal'

interface DraggableSignalWindowProps {
  windowId: string
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
  const { t } = useTranslation()
  const signals = useSignals()
  const { user } = useAuthStore()
  const { selectedSignal } = useRadarStore()
  
  // Try to get signal from selectedSignal first (if it matches), then from signals array
  // This avoids the double-click issue when signals are still loading
  const signal = selectedSignal?.id === signalId ? selectedSignal : signals.find((s: Signal) => s.id === signalId)
  
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
        <Rnd
          size={{ width: size.width, height: size.height }}
          position={{ x: position.x, y: position.y }}
          minWidth={300}
          minHeight={400}
          style={{
            zIndex,
            position: 'absolute',
          }}
          className="shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] overflow-hidden flex flex-col"
        >
          <div className="window-header flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
              Loading...
            </h3>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading signal...</p>
          </div>
        </Rnd>
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
      console.error('Error deleting signal:', error)
      throw error
    } finally {
      setDeleting(false)
    }
  }

  // Calculate max size (90% of viewport)
  const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 : 1200
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.9 : 800

  return (
    <>
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        minWidth={300}
        minHeight={400}
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
          {/* Header Bar */}
          <div className="window-header flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-700 cursor-move flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
              {signal.title}
            </h3>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={t('signalWindows.close')}
              title={t('signalWindows.close')}
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

        {/* Content Area - scrollable */}
        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{ 
            maxHeight: '100%',
            colorScheme: 'light dark'
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
