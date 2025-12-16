import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import industriesDataDe from '../data/industries.json'
import industriesDataEn from '../data/industries.en.json'
import type { Industry } from '../types/signal'

/**
 * Hook to load industries based on current language
 */
export function useIndustries(): Industry[] {
  const { i18n } = useTranslation()

  return useMemo(() => {
    // Load industries based on current language
    const industries = i18n.language === 'de' ? industriesDataDe : industriesDataEn
    return industries as Industry[]
  }, [i18n.language])
}

