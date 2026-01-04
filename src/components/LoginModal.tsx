import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '../shared/components/ui'
import { useAuthStore } from '../store/useAuthStore'

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
        {errorMessage && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('auth.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            placeholder={t('auth.emailPlaceholder')}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t('auth.password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
            placeholder={t('auth.passwordPlaceholder')}
            disabled={loading}
          />
        </div>

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
