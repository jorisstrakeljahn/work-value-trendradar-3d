import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ScrollIndicator() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show button only when at the top (within 50px) and hasn't been clicked yet
      if (scrollY < 50 && !hasScrolled) {
        setIsVisible(true)
      } else if (scrollY < 50 && hasScrolled) {
        // Reset when back at top
        setHasScrolled(false)
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

  const scrollToExplanation = () => {
    const explanationSection = document.querySelector('section:nth-of-type(2)')
    if (explanationSection) {
      explanationSection.scrollIntoView({ behavior: 'smooth' })
      setHasScrolled(true)
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={scrollToExplanation}
        className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 group"
        aria-label="Scroll to explanation"
      >
        <span className="text-xs font-medium">
          {t('scrollIndicator.learnMore')}
        </span>
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>
    </div>
  )
}
