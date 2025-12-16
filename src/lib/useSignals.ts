import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import signalsDataDe from '../data/signals.seed.de.json'
import signalsDataEn from '../data/signals.seed.en.json'
import type { Signal } from '../types/signal'

/**
 * Hook to load signals based on current language
 */
export function useSignals(): Signal[] {
  const { i18n } = useTranslation()

  return useMemo(() => {
    // Load signals based on current language
    const signals = i18n.language === 'de' ? signalsDataDe : signalsDataEn
    return signals as Signal[]
  }, [i18n.language])
}

