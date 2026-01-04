import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../hooks/useClickOutside'
import { X, AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { useModalStore } from '../../../store/useModalStore'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  buttonText?: string
  variant?: 'error' | 'warning' | 'info'
}

/**
 * Reusable alert modal component for displaying messages
 */
export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  variant = 'info',
}: AlertModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { openModal, closeModal } = useModalStore()

  useClickOutside(modalRef, () => {
    if (isOpen) {
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

  const variantStyles = {
    error: {
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    warning: {
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    info: {
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  }

  const styles = variantStyles[variant]

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl max-w-md w-full max-h-[calc(90vh-8rem)] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} mb-6`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />
            <p className="text-gray-700 dark:text-gray-300">{message}</p>
          </div>

          <div className="flex justify-end">
            <Button type="button" onClick={onClose} variant="primary" className="min-w-[100px]">
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
