import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Textarea } from './Textarea'

interface MultilingualTextareaProps {
  labelDe: string
  labelEn: string
  placeholderDe?: string
  placeholderEn?: string
  valueDe: string
  valueEn: string
  onChangeDe: (value: string) => void
  onChangeEn: (value: string) => void
  rows?: number
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Textarea group for multilingual fields (German/English)
 * Renders two textareas side by side in a grid layout
 */
export function MultilingualTextarea({
  labelDe,
  labelEn,
  placeholderDe,
  placeholderEn,
  valueDe,
  valueEn,
  onChangeDe,
  onChangeEn,
  rows = 4,
  required = false,
  disabled = false,
  className = '',
}: MultilingualTextareaProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <Label required={required}>
          {currentLanguage === 'de' ? labelDe : labelEn}
        </Label>
        <Textarea
          value={valueDe}
          onChange={e => onChangeDe(e.target.value)}
          placeholder={currentLanguage === 'de' ? placeholderDe : placeholderEn}
          rows={rows}
          required={required}
          disabled={disabled}
        />
      </div>
      <div>
        <Label>{currentLanguage === 'de' ? labelEn : labelEn}</Label>
        <Textarea
          value={valueEn}
          onChange={e => onChangeEn(e.target.value)}
          placeholder={currentLanguage === 'de' ? placeholderEn : placeholderEn}
          rows={rows}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
