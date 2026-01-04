import { useTranslation } from 'react-i18next'
import { MultilingualInput } from '../../../shared/components/forms'

interface TitleSectionProps {
  titleDe: string
  titleEn: string
  onTitleDeChange: (value: string) => void
  onTitleEnChange: (value: string) => void
  disabled?: boolean
}

/**
 * Title section with multilingual inputs (DE/EN)
 */
export function TitleSection({
  titleDe,
  titleEn,
  onTitleDeChange,
  onTitleEnChange,
  disabled = false,
}: TitleSectionProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <MultilingualInput
      labelDe={currentLanguage === 'de' ? t('admin.form.titleDe') : t('admin.form.titleDeEn')}
      labelEn={currentLanguage === 'de' ? t('admin.form.titleEn') : t('admin.form.titleEnEn')}
      placeholderDe={
        currentLanguage === 'de'
          ? t('admin.form.titlePlaceholderDe')
          : t('admin.form.titlePlaceholderDeEn')
      }
      placeholderEn={
        currentLanguage === 'de'
          ? t('admin.form.titlePlaceholderEn')
          : t('admin.form.titlePlaceholderEnEn')
      }
      valueDe={titleDe}
      valueEn={titleEn}
      onChangeDe={onTitleDeChange}
      onChangeEn={onTitleEnChange}
      required
      disabled={disabled}
    />
  )
}
