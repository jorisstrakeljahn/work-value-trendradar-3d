import { useTranslation } from 'react-i18next'
import { MultilingualTextarea } from '../MultilingualTextarea'
import type { MultilingualText } from '../../../../types/signal'

interface FreetextJustificationInputProps {
  value: MultilingualText
  onChange: (textDe: string, textEn: string) => void
  disabled?: boolean
}

/**
 * Freetext mode justification input
 * Single multilingual textarea for all dimensions
 */
export function FreetextJustificationInput({
  value,
  onChange,
  disabled = false,
}: FreetextJustificationInputProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
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
      valueDe={value.de || ''}
      valueEn={value.en || ''}
      onChangeDe={textDe => onChange(textDe, value.en || '')}
      onChangeEn={textEn => onChange(value.de || '', textEn)}
      rows={4}
      disabled={disabled}
    />
  )
}

