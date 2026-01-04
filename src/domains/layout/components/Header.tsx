import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import LanguageSelector from './LanguageSelector'
import AuthButton from '../../auth/components/AuthButton'

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t('header.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('header.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
