import { useState, FormEvent, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../shared/hooks/useClickOutside'
import { X } from 'lucide-react'
import { Button } from '../../shared/components/ui'
import { useAuthStore } from '../../store/useAuthStore'
import { useModalStore } from '../../store/useModalStore'
import { createIndustry } from '../../firebase/services/industriesService'
import type { MultilingualText } from '../../types/signal'

interface CreateIndustryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Modal for creating a new industry
 */
export default function CreateIndustryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateIndustryModalProps) {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [nameDe, setNameDe] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [color, setColor] = useState('#3B82F6') // Default blue color
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError(t('auth.errors.no-user'))
      return
    }

    if (!nameDe.trim()) {
      setError(t('admin.messages.nameDeRequired'))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const multilingualName: MultilingualText = {
        de: nameDe.trim(),
        en: nameEn.trim() || nameDe.trim(), // Fallback to German if English is empty
      }

      await createIndustry(
        {
          name: multilingualName,
          color,
        },
        user.uid
      )

      onSuccess?.()
      handleClose()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('admin.messages.createError')
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setNameDe('')
    setNameEn('')
    setColor('#3B82F6')
    setError(null)
    onClose()
  }

  const modalRef = useRef<HTMLDivElement>(null)
  const { openModal, closeModal } = useModalStore()

  useClickOutside(modalRef, () => {
    if (isOpen) {
      handleClose()
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

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 w-full max-h-[90vh] overflow-hidden flex flex-col max-w-md"
        style={{ colorScheme: 'light dark' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-600/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('admin.industries.createTitle')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(90vh-8rem)]">

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* German Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.industries.nameDe')} *
            </label>
            <input
              type="text"
              value={nameDe}
              onChange={e => setNameDe(e.target.value)}
              placeholder={t('admin.industries.nameDePlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              disabled={loading}
              required
            />
          </div>

          {/* English Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.industries.nameEn')}
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={e => setNameEn(e.target.value)}
              placeholder={t('admin.industries.nameEnPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('admin.industries.nameEnHint')}
            </p>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('admin.industries.color')}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-20 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                disabled={loading}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-sm"
                  disabled={loading}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  title={t('admin.industries.colorFormat')}
                />
              </div>
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                style={{ backgroundColor: color }}
                aria-label={t('admin.industries.colorPreview')}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              disabled={loading}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !nameDe.trim()}
              className="flex-1"
            >
              {loading ? t('common.creating') : t('common.create')}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>,
    document.body
  )
}
