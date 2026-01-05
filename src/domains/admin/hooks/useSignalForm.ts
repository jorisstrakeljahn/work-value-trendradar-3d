import { useState, useEffect } from 'react'
import { getSignal } from '../../../firebase/services/signalsService'
import type { Signal, ValueDimensions } from '../../../types/signal'
import type { SignalFormData } from '../../../types/forms'

const defaultFormData: SignalFormData = {
  titleDe: '',
  titleEn: '',
  summaryDe: '',
  summaryEn: '',
  industryTags: [],
  xImpact: 50,
  yHorizon: 50,
  valueDimensions: {
    economic: 0,
    social: 0,
    subjective: 0,
    political: 0,
  },
  valueDimensionsJustification: {
    mode: 'perDimension',
    perDimension: {
      economic: { text: { de: '', en: '' }, sources: [] },
      social: { text: { de: '', en: '' }, sources: [] },
      subjective: { text: { de: '', en: '' }, sources: [] },
      political: { text: { de: '', en: '' }, sources: [] },
    },
  },
  sources: [],
  imageUrl: null,
}

/**
 * Custom hook for signal form state management
 * Initializes form state from signal data
 * Handles reset logic
 * Validates form data
 */
export function useSignalForm(
  signal: Signal | null | undefined,
  isOpen: boolean
) {
  const [formData, setFormData] = useState<SignalFormData>(defaultFormData)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize form with signal data if editing
  useEffect(() => {
    if (signal && isOpen && !isInitialized) {
      // Load full document from Firestore to get multilingual fields
      getSignal(signal.id)
        .then(doc => {
          if (doc) {
            setFormData({
              titleDe: doc.title.de,
              titleEn: doc.title.en,
              summaryDe: doc.summary.de,
              summaryEn: doc.summary.en,
              industryTags: signal.industryTags || [],
              xImpact: signal.xImpact,
              yHorizon: signal.yHorizon,
              valueDimensions: signal.valueDimensions,
              valueDimensionsJustification: signal.valueDimensionsJustification,
              sources: signal.sources || [],
              imageUrl: signal.imageUrl || null,
            })
          } else {
            // Fallback to signal data
            setFormData({
              titleDe: signal.title,
              titleEn: signal.title,
              summaryDe: signal.summary,
              summaryEn: signal.summary,
              industryTags: signal.industryTags || [],
              xImpact: signal.xImpact,
              yHorizon: signal.yHorizon,
              valueDimensions: signal.valueDimensions,
              sources: signal.sources || [],
              imageUrl: signal.imageUrl || null,
            })
          }
          setIsInitialized(true)
        })
        .catch(() => {
          // Error loading, use signal data as fallback
          setFormData({
            titleDe: signal.title,
            titleEn: signal.title,
            summaryDe: signal.summary,
            summaryEn: signal.summary,
            industryTags: signal.industryTags || [],
            xImpact: signal.xImpact,
            yHorizon: signal.yHorizon,
            valueDimensions: signal.valueDimensions,
            valueDimensionsJustification: signal.valueDimensionsJustification,
            sources: signal.sources || [],
            imageUrl: signal.imageUrl || null,
          })
          setIsInitialized(true)
        })
    } else if (!signal && isOpen) {
      // Reset form for new signal
      setFormData(defaultFormData)
      setIsInitialized(true)
    }
  }, [signal, isOpen, isInitialized])

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false)
    }
  }, [isOpen])

  const updateFormData = <K extends keyof SignalFormData>(
    field: K,
    value: SignalFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateValueDimensions = (dimensions: Partial<ValueDimensions>) => {
    setFormData(prev => ({
      ...prev,
      valueDimensions: { ...prev.valueDimensions, ...dimensions },
    }))
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    setIsInitialized(false)
  }

  const validateForm = (): string | null => {
    if (!formData.titleDe.trim() || !formData.summaryDe.trim()) {
      return 'Title and summary (German) are required'
    }
    return null
  }

  return {
    formData,
    updateFormData,
    updateValueDimensions,
    resetForm,
    validateForm,
    isInitialized,
  }
}
