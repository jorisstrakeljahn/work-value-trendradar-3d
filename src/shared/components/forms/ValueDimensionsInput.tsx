import { useTranslation } from 'react-i18next'
import { Minus, Plus } from 'lucide-react'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from '../ui/Button'
import type { ValueDimensions } from '../../../types/signal'

interface ValueDimensionsInputProps {
  value: ValueDimensions
  onChange: (value: ValueDimensions) => void
  disabled?: boolean
  className?: string
}

/**
 * Component for the 4 value dimensions input
 * Renders 4 number inputs with custom stepper buttons
 * Validates range (0 to 5)
 * Input fields are readonly - only stepper buttons can change values
 */
export function ValueDimensionsInput({
  value,
  onChange,
  disabled = false,
  className = '',
}: ValueDimensionsInputProps) {
  const { t } = useTranslation()

  const updateDimension = (dimension: keyof ValueDimensions, newValue: number) => {
    // Clamp value between 0 and 5
    const clampedValue = Math.max(0, Math.min(5, newValue))
    onChange({
      ...value,
      [dimension]: clampedValue,
    })
  }

  const decrease = (dimension: keyof ValueDimensions) => {
    updateDimension(dimension, value[dimension] - 1)
  }

  const increase = (dimension: keyof ValueDimensions) => {
    updateDimension(dimension, value[dimension] + 1)
  }

  const renderDimensionInput = (
    dimension: keyof ValueDimensions,
    label: string
  ) => {
    const currentValue = value[dimension]
    const canDecrease = currentValue > 0
    const canIncrease = currentValue < 5

    return (
      <div>
        <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {label}
        </Label>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant="icon"
            onClick={() => decrease(dimension)}
            disabled={disabled || !canDecrease}
            className="flex-shrink-0 h-10 w-10"
            aria-label={`Decrease ${dimension}`}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            min="0"
            max="5"
            value={currentValue}
            readOnly
            disabled={disabled}
            className="px-3 py-2 text-center flex-1"
          />
          <Button
            type="button"
            variant="icon"
            onClick={() => increase(dimension)}
            disabled={disabled || !canIncrease}
            className="flex-shrink-0 h-10 w-10"
            aria-label={`Increase ${dimension}`}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Label>
        {t('admin.form.valueDimensions')} (0 bis 5)
      </Label>
      <div className="grid grid-cols-4 gap-4">
        {renderDimensionInput('economic', t('admin.form.economic'))}
        {renderDimensionInput('social', t('admin.form.social'))}
        {renderDimensionInput('subjective', t('admin.form.subjective'))}
        {renderDimensionInput('political', t('admin.form.political'))}
      </div>
    </div>
  )
}
