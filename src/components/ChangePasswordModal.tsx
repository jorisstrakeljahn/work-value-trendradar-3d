import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../shared/components/ui'
import { useAuthStore } from '../store/useAuthStore'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation()
  const { changePassword, errorCode, loading, setErrorCode } = useAuthStore()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const getErrorMessage = (code: string | null): string | null => {
    if (!code) return null
    const key = `auth.errors.${code}` as const
    return t(key) !== key ? t(key) : t('auth.errors.change-password-failed')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorCode(null)
    setValidationError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setValidationError(t('auth.passwordsDoNotMatch'))
      return
    }

    if (newPassword.length < 6) {
      setValidationError(t('auth.passwordTooShort'))
      return
    }

    try {
      await changePassword(newPassword)
      setSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleClose = () => {
    setErrorCode(null)
    setValidationError(null)
    setSuccess(false)
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  const errorMessage = getErrorMessage(errorCode)
  const displayError = validationError || errorMessage

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('auth.changePasswordTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {displayError}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-400">
            {t('auth.passwordChangedSuccess')}
          </div>
        )}

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('auth.newPassword')}
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            placeholder={t('auth.newPasswordPlaceholder')}
            disabled={loading || success}
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('auth.confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            placeholder={t('auth.confirmPasswordPlaceholder')}
            disabled={loading || success}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading || success}
            className="flex-1"
          >
            {t('auth.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={loading || success} className="flex-1">
            {loading ? t('auth.changingPassword') : t('auth.changePassword')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
