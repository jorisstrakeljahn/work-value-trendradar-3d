import {
  ValueDimensionsInput,
  ValueDimensionsJustificationInput,
} from '../../../../shared/components/forms'
import type {
  ValueDimensions,
  ValueDimensionsJustification,
} from '../../../../types/signal'

interface ValueDimensionsSectionProps {
  valueDimensions: ValueDimensions
  onValueDimensionsChange: (dimensions: ValueDimensions) => void
  valueDimensionsJustification?: ValueDimensionsJustification
  onValueDimensionsJustificationChange?: (
    justification: ValueDimensionsJustification
  ) => void
  disabled?: boolean
}

/**
 * Value Dimensions section
 * Uses ValueDimensionsInput and ValueDimensionsJustificationInput components
 */
export function ValueDimensionsSection({
  valueDimensions,
  onValueDimensionsChange,
  valueDimensionsJustification,
  onValueDimensionsJustificationChange,
  disabled = false,
}: ValueDimensionsSectionProps) {
  return (
    <div className="space-y-6">
      <ValueDimensionsInput
        value={valueDimensions}
        onChange={onValueDimensionsChange}
        disabled={disabled}
      />

      {onValueDimensionsJustificationChange && (
        <ValueDimensionsJustificationInput
          value={valueDimensionsJustification}
          onChange={onValueDimensionsJustificationChange}
          disabled={disabled}
        />
      )}
    </div>
  )
}
