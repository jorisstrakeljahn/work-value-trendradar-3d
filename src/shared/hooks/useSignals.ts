import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { subscribeToSignals, firestoreToSignal } from '../../firebase/services/signalsService'
import type { Signal, SignalDocument } from '../../types/signal'
import { calculateWorkValueIndex } from '../utils/mapping'
import { useRadarStore } from '../../store/useRadarStore'

/**
 * Hook to load signals from Firestore with real-time updates
 * Uses current value weights from store for zWorkValue calculation
 */
export function useSignals(): Signal[] {
  const { i18n } = useTranslation()
  const language = (i18n.language === 'de' ? 'de' : 'en') as 'de' | 'en'
  const [firestoreSignals, setFirestoreSignals] = useState<SignalDocument[]>([])
  const { valueWeights } = useRadarStore()

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSignals(signals => {
      setFirestoreSignals(signals)
    })

    return () => unsubscribe()
  }, [])

  return useMemo(() => {
    return firestoreSignals
      .map(doc => {
        const signal = firestoreToSignal(doc, language)
        // Calculate zWorkValue from valueDimensions using current weights
        signal.zWorkValue = calculateWorkValueIndex(signal, valueWeights)
        return signal
      })
      .filter((signal): signal is Signal => signal !== null)
  }, [firestoreSignals, language, valueWeights])
}

