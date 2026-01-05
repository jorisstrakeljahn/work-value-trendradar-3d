import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../hooks/useClickOutside'
import { X } from 'lucide-react'
import { Button } from './Button'
import { useModalStore } from '../../../store/useModalStore'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  loading?: boolean
}

/**
 * Reusable confirmation modal component
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { openModal, closeModal } = useModalStore()

  useClickOutside(modalRef, () => {
    if (isOpen && !loading) {
      onClose()
    }
  })

  useEffect(() => {
    if (isOpen) {
      openModal()
    } else {
      closeModal()
    }
    return () => {
      if (isOpen) {
        closeModal()
      }
    }
  }, [isOpen, openModal, closeModal])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const confirmButtonClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20'
      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20'

  return createPortal(
    <div
      className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        data-modal-overlay
        className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl max-w-md w-full max-h-[calc(90vh-8rem)] overflow-y-auto"
        style={{ colorScheme: 'light dark' }}
        onClick={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              onMouseDown={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
              onMouseDown={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
              variant="secondary"
              disabled={loading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onConfirm()
              }}
              onMouseDown={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
              variant="primary"
              disabled={loading}
              className={`flex-1 ${confirmButtonClass}`}
            >
              {loading ? '...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
