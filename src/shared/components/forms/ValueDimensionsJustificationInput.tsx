import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { Label } from './Label'
import { MultilingualTextarea } from './MultilingualTextarea'
import { SourcesInput } from './SourcesInput'
import { TabSwitch } from '../ui/TabSwitch'
import { ConfirmModal } from '../ui/ConfirmModal'
import type { ValueDimensionsJustification, DimensionKey } from '../../../types/signal'

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
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

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
  const [pendingMode, setPendingMode] = useState<'freetext' | 'perDimension' | null>(null)

  // Check if current mode has any data
  const hasDataInCurrentMode = (): boolean => {
    if (mode === 'freetext') {
      const freetext = justification.freetext
      return !!(freetext?.de?.trim() || freetext?.en?.trim())
    } else {
      // perDimension mode
      if (!justification.perDimension) return false
      const dimensions = ['economic', 'social', 'subjective', 'political'] as DimensionKey[]
      return dimensions.some(dim => {
        const dimJust = justification.perDimension![dim]
        const hasText = !!(dimJust.text.de?.trim() || dimJust.text.en?.trim())
        const hasSources = dimJust.sources.length > 0
        return hasText || hasSources
      })
    }
  }

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
    if (hasDataInCurrentMode()) {
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

  const dimensionLabels: Record<DimensionKey, { de: string; en: string }> = {
    economic: {
      de: t('admin.form.economic'),
      en: t('admin.form.economic'),
    },
    social: {
      de: t('admin.form.social'),
      en: t('admin.form.social'),
    },
    subjective: {
      de: t('admin.form.subjective'),
      en: t('admin.form.subjective'),
    },
    political: {
      de: t('admin.form.political'),
      en: t('admin.form.political'),
    },
  }

  return (
    <>
      <div className={className}>
        <Label>{t('admin.form.valueDimensionsJustification')}</Label>

      {/* Mode Tab Switch with Info Icon */}
      <div className="mb-4 flex items-center gap-3">
        <TabSwitch
          options={[
            { value: 'freetext', label: t('admin.form.freetextMode') },
            { value: 'perDimension', label: t('admin.form.perDimensionMode') },
          ]}
          value={mode}
          onChange={handleModeChange}
          disabled={disabled}
        />
        <div className="relative group">
          <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg pointer-events-none">
            {t('admin.form.modeSwitchInfo')}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      </div>

      {/* Freetext Mode */}
      {mode === 'freetext' && (
        <MultilingualTextarea
          labelDe={
            currentLanguage === 'de'
              ? t('admin.form.justificationTextDe')
              : t('admin.form.justificationTextDeEn')
          }
          labelEn={
            currentLanguage === 'de'
              ? t('admin.form.justificationTextEn')
              : t('admin.form.justificationTextEnEn')
          }
          valueDe={justification.freetext?.de || ''}
          valueEn={justification.freetext?.en || ''}
          onChangeDe={textDe =>
            handleFreetextChange(textDe, justification.freetext?.en || '')
          }
          onChangeEn={textEn =>
            handleFreetextChange(justification.freetext?.de || '', textEn)
          }
          rows={4}
          disabled={disabled}
        />
      )}

      {/* Per-Dimension Mode */}
      {mode === 'perDimension' && justification.perDimension && (
        <div className="space-y-6">
          {(['economic', 'social', 'subjective', 'political'] as DimensionKey[]).map(
            dimension => {
              const dimJustification = justification.perDimension![dimension]
              const label = dimensionLabels[dimension]

              return (
                <div key={dimension} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0 first:pt-0">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {currentLanguage === 'de' ? label.de : label.en}
                  </h5>

                  <MultilingualTextarea
                    labelDe={
                      currentLanguage === 'de'
                        ? t('admin.form.dimensionJustification')
                        : t('admin.form.dimensionJustification')
                    }
                    labelEn={
                      currentLanguage === 'de'
                        ? t('admin.form.dimensionJustification')
                        : t('admin.form.dimensionJustification')
                    }
                    valueDe={dimJustification.text.de}
                    valueEn={dimJustification.text.en}
                    onChangeDe={textDe =>
                      handleDimensionTextChange(dimension, textDe, dimJustification.text.en)
                    }
                    onChangeEn={textEn =>
                      handleDimensionTextChange(dimension, dimJustification.text.de, textEn)
                    }
                    rows={3}
                    disabled={disabled}
                  />

                  <SourcesInput
                    sources={dimJustification.sources}
                    onSourcesChange={sources =>
                      handleDimensionSourcesChange(dimension, sources)
                    }
                    disabled={disabled}
                  />
                </div>
              )
            }
          )}
        </div>
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
