import { InputHTMLAttributes } from 'react'
import { Label } from './Label'

interface RangeSliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  value: number
  min: number
  max: number
  showValue?: boolean
  className?: string
}

/**
 * Reusable range slider component that displays current value
 * Used for Impact, Horizon sliders
 */
export function RangeSlider({
  label,
  value,
  min,
  max,
  showValue = true,
  className = '',
  disabled = false,
  ...props
}: RangeSliderProps) {
  const displayValue = showValue ? `: ${value}` : ''

  return (
    <div className={className}>
      {label && (
        <Label>
          {label}
          {displayValue}
        </Label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        className="w-full"
        {...props}
      />
    </div>
  )
}
