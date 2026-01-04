import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../../../shared/components/ui'
import { ErrorAlert, FormField } from '../../../shared/components/forms'
import { useAuthStore } from '../../../store/useAuthStore'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useTranslation()
  const { login, errorCode, loading, setErrorCode } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const getErrorMessage = (code: string | null): string | null => {
    if (!code) return null
    const key = `auth.errors.${code}` as const
    return t(key) !== key ? t(key) : t('auth.errors.login-failed')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorCode(null)

    try {
      await login(email, password)
      // Close modal on success
      onClose()
      setEmail('')
      setPassword('')
    } catch (error) {
      // Error is handled by the store
    }
  }

  const handleClose = () => {
    setErrorCode(null)
    setEmail('')
    setPassword('')
    onClose()
  }

  const errorMessage = getErrorMessage(errorCode)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('auth.loginTitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && <ErrorAlert message={errorMessage} />}

        <FormField
          type="input"
          label={t('auth.email')}
          inputType="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          required
          disabled={loading}
        />

        <FormField
          type="input"
          label={t('auth.password')}
          inputType="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={t('auth.passwordPlaceholder')}
          required
          disabled={loading}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            {t('auth.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? t('auth.loggingIn') : t('auth.login')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
