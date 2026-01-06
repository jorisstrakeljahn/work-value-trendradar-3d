import type { ValueWeights, DimensionKey } from '../../types/signal'

/**
 * All dimension keys in order
 */
const ALL_DIMENSIONS: DimensionKey[] = [
  'economic',
  'social',
  'subjective',
  'political',
]

/**
 * Auto-equalize algorithm: adjusts non-locked dimensions proportionally
 * to maintain sum of 100%
 *
 * This algorithm ensures that when one dimension weight is changed, the other
 * non-locked dimensions are adjusted proportionally to maintain a total sum of 100%.
 *
 * Algorithm:
 * 1. Calculate available budget (100 - sum of locked dimensions)
 * 2. Set changed dimension to new value (clamped to available budget)
 * 3. Distribute remaining budget proportionally among other non-locked dimensions
 * 4. Round values and adjust for rounding errors to ensure exact sum of 100
 *
 * @param newWeights - Partial weights object with the changed dimension
 * @param currentWeights - Current weight values
 * @param lockedDimensions - Array of locked dimension keys (max 2)
 * @returns Adjusted weights with sum exactly equal to 100
 *
 * @example
 * ```typescript
 * const current = { economic: 30, social: 25, subjective: 25, political: 20 }
 * const newWeights = { economic: 40 }
 * const locked = ['political']
 * const result = calculateAdjustedWeights(newWeights, current, locked)
 * // Result: { economic: 40, social: 20, subjective: 20, political: 20 }
 * // Sum = 100, political remains locked, others adjusted proportionally
 * ```
 */
export function calculateAdjustedWeights(
  newWeights: Partial<ValueWeights>,
  currentWeights: ValueWeights,
  lockedDimensions: DimensionKey[]
): ValueWeights {
  const result = { ...currentWeights, ...newWeights }
  const changedDimensionKey = Object.keys(newWeights)[0]

  // Validate changed dimension
  if (
    !changedDimensionKey ||
    !ALL_DIMENSIONS.includes(changedDimensionKey as DimensionKey)
  ) {
    return result
  }

  const changedDimension = changedDimensionKey as DimensionKey

  // Calculate available budget (100 - sum of locked dimensions)
  const lockedSum = lockedDimensions.reduce((sum, key) => sum + result[key], 0)
  const availableBudget = 100 - lockedSum

  // Get non-locked dimensions (excluding the changed one)
  const nonLockedDimensions = ALL_DIMENSIONS.filter(
    key => !lockedDimensions.includes(key) && key !== changedDimension
  )

  // Handle case where all other dimensions are locked
  if (nonLockedDimensions.length === 0) {
    const newChangedValue = Math.max(0, Math.min(100, availableBudget))
    result[changedDimension] = newChangedValue
    return result
  }

  // Calculate new value for changed dimension (clamped to available budget)
  const changedValue = Math.max(
    0,
    Math.min(availableBudget, result[changedDimension])
  )
  result[changedDimension] = changedValue

  // Remaining budget for other non-locked dimensions
  const remainingBudget = availableBudget - changedValue

  if (remainingBudget <= 0 || nonLockedDimensions.length === 0) {
    return result
  }

  // Calculate proportional distribution
  const currentSum = nonLockedDimensions.reduce(
    (sum, key) => sum + result[key],
    0
  )

  if (currentSum === 0) {
    // Equal distribution if all are zero
    const equalShare = remainingBudget / nonLockedDimensions.length
    nonLockedDimensions.forEach(key => {
      result[key] = equalShare
    })
  } else {
    // Proportional distribution based on current ratios
    nonLockedDimensions.forEach(key => {
      const ratio = result[key] / currentSum
      result[key] = remainingBudget * ratio
    })
  }

  // Round and ensure sum is exactly 100
  ALL_DIMENSIONS.forEach(key => {
    result[key] = Math.round(result[key] * 100) / 100
  })

  // Adjust for rounding errors to ensure exact sum of 100
  const totalSum = ALL_DIMENSIONS.reduce((sum, key) => sum + result[key], 0)
  const difference = 100 - totalSum

  if (Math.abs(difference) > 0.01) {
    // Adjust the changed dimension (or first non-locked if changed is locked)
    const adjustKey = !lockedDimensions.includes(changedDimension)
      ? changedDimension
      : nonLockedDimensions[0]

    if (adjustKey) {
      result[adjustKey] =
        Math.round((result[adjustKey] + difference) * 100) / 100
    }
  }

  return result
}
