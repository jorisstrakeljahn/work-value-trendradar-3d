import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown } from '../../../shared/components/ui'
import { useAuthStore } from '../../../store/useAuthStore'
import LoginModal from './LoginModal'
import ChangePasswordModal from './ChangePasswordModal'

export default function AuthButton() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // Error is handled by the store
    }
  }

  if (!user) {
    return (
      <>
        <Button variant="primary" onClick={() => setShowLoginModal(true)}>
          {t('auth.login')}
        </Button>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    )
  }

  return (
    <>
      <Dropdown
        trigger={
          <Button variant="primary">
            {user.email?.split('@')[0] || t('auth.user')}
          </Button>
        }
        position="bottom"
        align="end"
      >
        <button
          onClick={() => {
            setShowChangePasswordModal(true)
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('auth.changePassword')}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
        >
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            {t('auth.logout')}
          </span>
        </button>
      </Dropdown>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  )
}
