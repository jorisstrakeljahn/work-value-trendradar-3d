import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeToIndustries } from '../../firebase/services/industriesService'
import type { Industry } from '../../types/signal'

/**
 * Hook to load industries from Firestore
 */
export function useIndustries(): Industry[] {
  const { i18n } = useTranslation()
  const [industries, setIndustries] = useState<Industry[]>([])
  const language = (i18n.language === 'de' ? 'de' : 'en') as 'de' | 'en'

  useEffect(() => {
    const unsubscribe = subscribeToIndustries(
      (firestoreIndustries) => {
        setIndustries(firestoreIndustries)
      },
      language,
      () => {
        // On error, set empty array
        setIndustries([])
      }
    )

    return unsubscribe
  }, [language])

  return industries
}

