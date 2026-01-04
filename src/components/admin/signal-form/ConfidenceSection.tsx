import { useTranslation } from 'react-i18next'
import { RangeSlider } from '../../../shared/components/forms'

interface ConfidenceSectionProps {
  confidence: number
  onConfidenceChange: (value: number) => void
  disabled?: boolean
}

/**
 * Confidence section with range slider
 * Uses RangeSlider component
 */
export function ConfidenceSection({
  confidence,
  onConfidenceChange,
  disabled = false,
}: ConfidenceSectionProps) {
  const { t } = useTranslation()

  return (
    <RangeSlider
      label={t('admin.form.confidence')}
      value={confidence}
      min={1}
      max={5}
      onChange={e => onConfidenceChange(Number(e.target.value))}
      disabled={disabled}
    />
  )
}
