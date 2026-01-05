import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { ConfirmModal } from '../ui/ConfirmModal'
import {
  JustificationModeSwitch,
  FreetextJustificationInput,
  PerDimensionJustificationInput,
} from './justification'
import type {
  ValueDimensionsJustification,
  DimensionKey,
} from '../../../types/signal'

interface ValueDimensionsJustificationInputProps {
  value?: ValueDimensionsJustification
  onChange: (justification: ValueDimensionsJustification) => void
  disabled?: boolean
  className?: string
}

/**
 * Component for value dimensions justification input
 * Supports two modes: freetext (single multilingual text) or perDimension (one justification per dimension with sources)
 */
export function ValueDimensionsJustificationInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: ValueDimensionsJustificationInputProps) {
  const { t } = useTranslation()

  // Default to perDimension mode if no value provided
  const mode = value?.mode || 'perDimension'

  // Initialize default structure if value is undefined
  const getDefaultJustification = (): ValueDimensionsJustification => {
    if (value) return value

    return {
      mode: 'perDimension',
      perDimension: {
        economic: { text: { de: '', en: '' }, sources: [] },
        social: { text: { de: '', en: '' }, sources: [] },
        subjective: { text: { de: '', en: '' }, sources: [] },
        political: { text: { de: '', en: '' }, sources: [] },
      },
    }
  }

  const justification = getDefaultJustification()
  const [showModeChangeWarning, setShowModeChangeWarning] = useState(false)
  const [pendingMode, setPendingMode] = useState<
    'freetext' | 'perDimension' | null
  >(null)

  // Check if current mode has any data (memoized)
  const hasDataInCurrentMode = useMemo((): boolean => {
    if (mode === 'freetext') {
      const freetext = justification.freetext
      return !!(freetext?.de?.trim() || freetext?.en?.trim())
    } else {
      // perDimension mode
      if (!justification.perDimension) return false
      const dimensions: DimensionKey[] = [
        'economic',
        'social',
        'subjective',
        'political',
      ]
      return dimensions.some(dim => {
        const dimJust = justification.perDimension![dim]
        const hasText = !!(dimJust.text.de?.trim() || dimJust.text.en?.trim())
        const hasSources = dimJust.sources.length > 0
        return hasText || hasSources
      })
    }
  }, [mode, justification])

  const performModeChange = (newMode: 'freetext' | 'perDimension') => {
    if (newMode === 'freetext') {
      onChange({
        mode: 'freetext',
        freetext: { de: '', en: '' },
      })
    } else {
      onChange({
        mode: 'perDimension',
        perDimension: {
          economic: { text: { de: '', en: '' }, sources: [] },
          social: { text: { de: '', en: '' }, sources: [] },
          subjective: { text: { de: '', en: '' }, sources: [] },
          political: { text: { de: '', en: '' }, sources: [] },
        },
      })
    }
  }

  const handleModeChange = (newMode: 'freetext' | 'perDimension') => {
    if (newMode === mode) return

    // Check if there's data in the current mode
    if (hasDataInCurrentMode) {
      // Show warning modal
      setPendingMode(newMode)
      setShowModeChangeWarning(true)
    } else {
      // No data, safe to change immediately
      performModeChange(newMode)
    }
  }

  const handleConfirmModeChange = () => {
    if (pendingMode) {
      performModeChange(pendingMode)
      setPendingMode(null)
    }
    setShowModeChangeWarning(false)
  }

  const handleCancelModeChange = () => {
    setPendingMode(null)
    setShowModeChangeWarning(false)
  }

  const handleFreetextChange = (textDe: string, textEn: string) => {
    onChange({
      ...justification,
      mode: 'freetext',
      freetext: { de: textDe, en: textEn },
    })
  }

  const handleDimensionTextChange = (
    dimension: DimensionKey,
    textDe: string,
    textEn: string
  ) => {
    if (!justification.perDimension) return

    onChange({
      ...justification,
      mode: 'perDimension',
      perDimension: {
        ...justification.perDimension,
        [dimension]: {
          ...justification.perDimension[dimension],
          text: { de: textDe, en: textEn },
        },
      },
    })
  }

  const handleDimensionSourcesChange = (
    dimension: DimensionKey,
    sources: Array<{ name: string; url: string }>
  ) => {
    if (!justification.perDimension) return

    onChange({
      ...justification,
      mode: 'perDimension',
      perDimension: {
        ...justification.perDimension,
        [dimension]: {
          ...justification.perDimension[dimension],
          sources,
        },
      },
    })
  }

  return (
    <>
      <div className={className}>
        <Label>{t('admin.form.valueDimensionsJustification')}</Label>

        <JustificationModeSwitch
          mode={mode}
          onModeChange={handleModeChange}
          disabled={disabled}
        />

        {/* Freetext Mode */}
        {mode === 'freetext' && justification.freetext && (
          <FreetextJustificationInput
            value={justification.freetext}
            onChange={handleFreetextChange}
            disabled={disabled}
          />
        )}

        {/* Per-Dimension Mode */}
        {mode === 'perDimension' && justification.perDimension && (
          <PerDimensionJustificationInput
            justification={justification}
            onDimensionTextChange={handleDimensionTextChange}
            onDimensionSourcesChange={handleDimensionSourcesChange}
            disabled={disabled}
          />
        )}
      </div>

      {/* Mode Change Warning Modal */}
      <ConfirmModal
        isOpen={showModeChangeWarning}
        onClose={handleCancelModeChange}
        onConfirm={handleConfirmModeChange}
        title={t('admin.form.modeChangeWarningTitle')}
        message={t('admin.form.modeChangeWarningMessage')}
        confirmText={t('common.continue')}
        cancelText={t('admin.cancel')}
        variant="default"
      />
    </>
  )
}
