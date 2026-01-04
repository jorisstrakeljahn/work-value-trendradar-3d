import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeToSignals, firestoreToSignal } from '../../firebase/services/signalsService'
import signalsDataDe from '../../data/signals.seed.de.json'
import signalsDataEn from '../../data/signals.seed.en.json'
import type { Signal, SignalDocument } from '../../types/signal'
import { calculateWorkValueIndex } from '../utils/mapping'

/**
 * Hook to load signals from Firestore with real-time updates
 * Falls back to JSON data if Firestore is empty or unavailable
 */
export function useSignals(): Signal[] {
  const { i18n } = useTranslation()
  const language = (i18n.language === 'de' ? 'de' : 'en') as 'de' | 'en'
  const [firestoreSignals, setFirestoreSignals] = useState<SignalDocument[]>([])
  const [hasFirestoreData, setHasFirestoreData] = useState(false)

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSignals(signals => {
      setFirestoreSignals(signals)
      setHasFirestoreData(signals.length > 0)
    })

    return () => unsubscribe()
  }, [])

  return useMemo(() => {
    // Use Firestore data if available, otherwise fallback to JSON
    if (hasFirestoreData && firestoreSignals.length > 0) {
      return firestoreSignals
        .map(doc => {
          const signal = firestoreToSignal(doc, language)
          // Calculate zWorkValue from valueDimensions
          signal.zWorkValue = calculateWorkValueIndex(signal)
          return signal
        })
        .filter((signal): signal is Signal => signal !== null)
    }

    // Fallback to JSON data
    const jsonSignals = language === 'de' ? signalsDataDe : signalsDataEn
    return jsonSignals as Signal[]
  }, [firestoreSignals, hasFirestoreData, language])
}

