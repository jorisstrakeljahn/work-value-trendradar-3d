import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
]

export default function LanguageSelector() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200/50 dark:border-gray-600/50"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-48 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden z-50">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200 ${
                i18n.language === language.code
                  ? 'bg-white/70 dark:bg-[#2a2a2a]/70'
                  : ''
              }`}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {language.name}
              </span>
              {i18n.language === language.code && (
                <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

