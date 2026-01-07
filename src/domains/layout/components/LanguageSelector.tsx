import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, Dropdown } from '../../../shared/components/ui'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <Dropdown
      trigger={
        <Button variant="icon" aria-label="Select language">
          <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </Button>
      }
      position="bottom"
      align="end"
    >
      {languages.map(language => (
        <button
          key={language.code}
          type="button"
          onClick={() => changeLanguage(language.code)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200 ${
            i18n.language === language.code
              ? 'bg-white/70 dark:bg-[#2a2a2a]/70'
              : ''
          }`}
          aria-current={i18n.language === language.code ? 'true' : undefined}
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {language.name}
          </span>
          {i18n.language === language.code && (
            <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
          )}
        </button>
      ))}
    </Dropdown>
  )
}
