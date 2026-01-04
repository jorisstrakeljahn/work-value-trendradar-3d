import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../shared/components/ui'
import { useAuthStore } from '../store/useAuthStore'
import { useClickOutside } from '../shared/hooks/useClickOutside'
import LoginModal from './LoginModal'
import ChangePasswordModal from './ChangePasswordModal'

export default function AuthButton() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setShowUserMenu(false))

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
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
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Button variant="primary" onClick={() => setShowUserMenu(!showUserMenu)}>
          {user.email?.split('@')[0] || t('auth.user')}
        </Button>

        {showUserMenu && (
          <div className="absolute right-0 top-12 mt-2 w-48 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden z-50">
            <button
              onClick={() => {
                setShowChangePasswordModal(true)
                setShowUserMenu(false)
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
          </div>
        )}
      </div>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  )
}
