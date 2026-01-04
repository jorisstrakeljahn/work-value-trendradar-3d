import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeToIndustries } from '../../firebase/services/industriesService'
import industriesDataDe from '../../data/industries.json'
import industriesDataEn from '../../data/industries.en.json'
import type { Industry } from '../../types/signal'

/**
 * Hook to load industries from Firestore with fallback to JSON files
 */
export function useIndustries(): Industry[] {
  const { i18n } = useTranslation()
  const [industries, setIndustries] = useState<Industry[]>([])
  const language = (i18n.language === 'de' ? 'de' : 'en') as 'de' | 'en'

  useEffect(() => {
    // Fallback to JSON files if Firestore is not available or empty
    const fallbackIndustries = language === 'de' ? industriesDataDe : industriesDataEn

    const unsubscribe = subscribeToIndustries(
      (firestoreIndustries) => {
        // Use Firestore industries if available, otherwise fall back to JSON
        if (firestoreIndustries.length > 0) {
          setIndustries(firestoreIndustries)
        } else {
          setIndustries(fallbackIndustries as Industry[])
        }
      },
      language,
      () => {
        // On error, use fallback
        setIndustries(fallbackIndustries as Industry[])
      }
    )

    return unsubscribe
  }, [language])

  return industries
}

