import { ValueDimensionsInput } from '../../../shared/components/forms'
import type { ValueDimensions } from '../../../types/signal'

interface ValueDimensionsSectionProps {
  valueDimensions: ValueDimensions
  onValueDimensionsChange: (dimensions: ValueDimensions) => void
  disabled?: boolean
}

/**
 * Value Dimensions section
 * Uses ValueDimensionsInput component
 */
export function ValueDimensionsSection({
  valueDimensions,
  onValueDimensionsChange,
  disabled = false,
}: ValueDimensionsSectionProps) {
  return (
    <ValueDimensionsInput
      value={valueDimensions}
      onChange={onValueDimensionsChange}
      disabled={disabled}
    />
  )
}
