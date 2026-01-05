import { useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../hooks/useClickOutside'
import { X } from 'lucide-react'
import { useModalStore } from '../../../store/useModalStore'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

/**
 * Reusable modal component with overlay
 * Uses React Portal to render outside the component tree for proper positioning
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { openModal, closeModal } = useModalStore()

  useClickOutside(modalRef, () => {
    if (isOpen) {
      onClose()
    }
  })

  // Track modal state globally
  useEffect(() => {
    if (isOpen) {
      openModal()
    } else {
      closeModal()
    }
    return () => {
      closeModal()
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

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        data-modal-overlay
        className={`glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 w-full max-h-[90vh] overflow-hidden flex flex-col ${className || 'max-w-md'}`}
        style={{ colorScheme: 'light dark' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-600/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  )

  // Render modal in portal (directly in document.body) to ensure it's above everything
  return createPortal(modalContent, document.body)
}
