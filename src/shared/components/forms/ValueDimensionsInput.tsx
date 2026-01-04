import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Input } from './Input'
import type { ValueDimensions } from '../../../types/signal'

interface ValueDimensionsInputProps {
  value: ValueDimensions
  onChange: (value: ValueDimensions) => void
  disabled?: boolean
  className?: string
}

/**
 * Component for the 4 value dimensions input
 * Renders 4 number inputs in a grid
 * Validates range (-5 to +5)
 */
export function ValueDimensionsInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: ValueDimensionsInputProps) {
  const { t } = useTranslation()

  const updateDimension = (dimension: keyof ValueDimensions, newValue: number) => {
    // Clamp value between -5 and 5
    const clampedValue = Math.max(-5, Math.min(5, newValue))
    onChange({
      ...value,
      [dimension]: clampedValue,
    })
  }

  return (
    <div className={className}>
      <Label>
        {t('admin.form.valueDimensions')} (-5 bis +5)
      </Label>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('admin.form.economic')}
          </Label>
          <Input
            type="number"
            min="-5"
            max="5"
            value={value.economic}
            onChange={e => updateDimension('economic', Number(e.target.value))}
            disabled={disabled}
            className="px-3 py-2"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('admin.form.social')}
          </Label>
          <Input
            type="number"
            min="-5"
            max="5"
            value={value.social}
            onChange={e => updateDimension('social', Number(e.target.value))}
            disabled={disabled}
            className="px-3 py-2"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('admin.form.subjective')}
          </Label>
          <Input
            type="number"
            min="-5"
            max="5"
            value={value.subjective}
            onChange={e => updateDimension('subjective', Number(e.target.value))}
            disabled={disabled}
            className="px-3 py-2"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            {t('admin.form.political')}
          </Label>
          <Input
            type="number"
            min="-5"
            max="5"
            value={value.political}
            onChange={e => updateDimension('political', Number(e.target.value))}
            disabled={disabled}
            className="px-3 py-2"
          />
        </div>
      </div>
    </div>
  )
}
