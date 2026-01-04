import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Input } from './Input'

interface MultilingualInputProps {
  labelDe: string
  labelEn: string
  placeholderDe?: string
  placeholderEn?: string
  valueDe: string
  valueEn: string
  onChangeDe: (value: string) => void
  onChangeEn: (value: string) => void
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Input group for multilingual fields (German/English)
 * Renders two inputs side by side in a grid layout
 */
export function MultilingualInput({
  labelDe,
  labelEn,
  placeholderDe,
  placeholderEn,
  valueDe,
  valueEn,
  onChangeDe,
  onChangeEn,
  required = false,
  disabled = false,
  className = '',
}: MultilingualInputProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <Label required={required}>
          {currentLanguage === 'de' ? labelDe : labelEn}
        </Label>
        <Input
          type="text"
          value={valueDe}
          onChange={e => onChangeDe(e.target.value)}
          placeholder={currentLanguage === 'de' ? placeholderDe : placeholderEn}
          required={required}
          disabled={disabled}
        />
      </div>
      <div>
        <Label>{currentLanguage === 'de' ? labelEn : labelDe}</Label>
        <Input
          type="text"
          value={valueEn}
          onChange={e => onChangeEn(e.target.value)}
          placeholder={currentLanguage === 'de' ? placeholderEn : placeholderDe}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
