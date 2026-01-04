import { useTranslation } from 'react-i18next'
import { MultilingualTextarea } from '../../../shared/components/forms'

interface SummarySectionProps {
  summaryDe: string
  summaryEn: string
  onSummaryDeChange: (value: string) => void
  onSummaryEnChange: (value: string) => void
  disabled?: boolean
}

/**
 * Summary section with multilingual textareas (DE/EN)
 */
export function SummarySection({
  summaryDe,
  summaryEn,
  onSummaryDeChange,
  onSummaryEnChange,
  disabled = false,
}: SummarySectionProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <MultilingualTextarea
      labelDe={
        currentLanguage === 'de' ? t('admin.form.summaryDe') : t('admin.form.summaryDeEn')
      }
      labelEn={currentLanguage === 'de' ? t('admin.form.summaryEn') : t('admin.form.summaryEnEn')}
      placeholderDe={
        currentLanguage === 'de'
          ? t('admin.form.summaryPlaceholderDe')
          : t('admin.form.summaryPlaceholderDeEn')
      }
      placeholderEn={
        currentLanguage === 'de'
          ? t('admin.form.summaryPlaceholderEn')
          : t('admin.form.summaryPlaceholderEnEn')
      }
      valueDe={summaryDe}
      valueEn={summaryEn}
      onChangeDe={onSummaryDeChange}
      onChangeEn={onSummaryEnChange}
      rows={4}
      required
      disabled={disabled}
    />
  )
}
