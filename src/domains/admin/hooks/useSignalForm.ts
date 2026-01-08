import { useState, useEffect } from 'react'
import { getSignal } from '../../../firebase/services/signalsService'
import type {
  Signal,
  SignalDocument,
  ValueDimensions,
} from '../../../types/signal'
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
  xImpactJustificationDe: '',
  xImpactJustificationEn: '',
  xImpactJustificationSources: [],
  yHorizonJustificationDe: '',
  yHorizonJustificationEn: '',
  yHorizonJustificationSources: [],
  sources: [],
  imageUrl: null,
}

/**
 * Creates form data from signal, optionally using document data for multilingual fields
 */
function createFormDataFromSignal(
  signal: Signal,
  doc?: SignalDocument | null
): SignalFormData {
  return {
    titleDe: doc?.title.de ?? signal.title,
    titleEn: doc?.title.en ?? signal.title,
    summaryDe: doc?.summary.de ?? signal.summary,
    summaryEn: doc?.summary.en ?? signal.summary,
    industryTags: signal.industryTags || [],
    xImpact: signal.xImpact,
    yHorizon: signal.yHorizon,
    valueDimensions: signal.valueDimensions,
    valueDimensionsJustification: signal.valueDimensionsJustification,
    xImpactJustificationDe: signal.xImpactJustification?.text.de || '',
    xImpactJustificationEn: signal.xImpactJustification?.text.en || '',
    xImpactJustificationSources: signal.xImpactJustification?.sources || [],
    yHorizonJustificationDe: signal.yHorizonJustification?.text.de || '',
    yHorizonJustificationEn: signal.yHorizonJustification?.text.en || '',
    yHorizonJustificationSources: signal.yHorizonJustification?.sources || [],
    sources: signal.sources || [],
    imageUrl: signal.imageUrl || null,
  }
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
          setFormData(createFormDataFromSignal(signal, doc))
          setIsInitialized(true)
        })
        .catch(() => {
          // Error loading, use signal data as fallback
          setFormData(createFormDataFromSignal(signal))
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
