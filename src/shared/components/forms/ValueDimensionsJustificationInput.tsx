import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { MultilingualTextarea } from './MultilingualTextarea'
import { SourcesInput } from './SourcesInput'
import { TabSwitch } from '../ui/TabSwitch'
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

  const handleModeChange = (newMode: 'freetext' | 'perDimension') => {
    if (newMode === mode) return

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
    <div className={className}>
      <Label>{t('admin.form.valueDimensionsJustification')}</Label>

      {/* Mode Tab Switch */}
      <div className="mb-4">
        <TabSwitch
          options={[
            { value: 'freetext', label: t('admin.form.freetextMode') },
            { value: 'perDimension', label: t('admin.form.perDimensionMode') },
          ]}
          value={mode}
          onChange={handleModeChange}
          disabled={disabled}
        />
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
                <div key={dimension} className="space-y-4">
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
  )
}
