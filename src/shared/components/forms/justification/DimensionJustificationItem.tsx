import { useTranslation } from 'react-i18next'
import { MultilingualTextarea } from '../MultilingualTextarea'
import { SourcesInput } from '../SourcesInput'
import type { DimensionKey, DimensionJustification } from '../../../../types/signal'

interface DimensionJustificationItemProps {
  dimension: DimensionKey
  justification: DimensionJustification
  label: { de: string; en: string }
  onTextChange: (textDe: string, textEn: string) => void
  onSourcesChange: (sources: Array<{ name: string; url: string }>) => void
  disabled?: boolean
  isFirst?: boolean
}

/**
 * Single dimension justification item
 * Displays text input and sources for one dimension
 */
export function DimensionJustificationItem({
  dimension,
  justification,
  label,
  onTextChange,
  onSourcesChange,
  disabled = false,
  isFirst = false,
}: DimensionJustificationItemProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <div
      className={`space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${
        isFirst ? 'border-t-0 pt-0' : ''
      }`}
    >
      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {currentLanguage === 'de' ? label.de : label.en}
      </h5>

      <MultilingualTextarea
        labelDe={t('admin.form.dimensionJustification')}
        labelEn={t('admin.form.dimensionJustification')}
        valueDe={justification.text.de}
        valueEn={justification.text.en}
        onChangeDe={textDe =>
          onTextChange(textDe, justification.text.en)
        }
        onChangeEn={textEn =>
          onTextChange(justification.text.de, textEn)
        }
        rows={3}
        disabled={disabled}
      />

      <SourcesInput
        sources={justification.sources}
        onSourcesChange={onSourcesChange}
        disabled={disabled}
      />
    </div>
  )
}

