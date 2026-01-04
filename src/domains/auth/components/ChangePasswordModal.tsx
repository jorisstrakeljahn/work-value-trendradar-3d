import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../../../shared/components/ui'
import { ErrorAlert, SuccessAlert, FormField } from '../../../shared/components/forms'
import { useAuthStore } from '../../../store/useAuthStore'

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
        {displayError && <ErrorAlert message={displayError} />}
        {success && <SuccessAlert message={t('auth.passwordChangedSuccess')} />}

        <FormField
          type="input"
          label={t('auth.newPassword')}
          inputType="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder={t('auth.newPasswordPlaceholder')}
          required
          minLength={6}
          disabled={loading || success}
        />

        <FormField
          type="input"
          label={t('auth.confirmPassword')}
          inputType="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder={t('auth.confirmPasswordPlaceholder')}
          required
          minLength={6}
          disabled={loading || success}
        />

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
