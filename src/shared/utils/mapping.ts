import type { Signal, ValueWeights } from '../../types/signal'

/**
 * Constants for value dimension calculations
 */
const NORMALIZATION_FACTOR = 100
const DIMENSION_MAX = 5
const IMPACT_CENTER_OFFSET = 0.5
const IMPACT_SCALE_FACTOR = 2
const MIN_WORK_VALUE_INDEX = 0
const MAX_WORK_VALUE_INDEX = 100

/**
 * Default weights (for backward compatibility)
 */
const defaultWeights: ValueWeights = {
  economic: 30,
  social: 25,
  subjective: 25,
  political: 20,
}

/**
 * Calculates the Work-Value-Index from 4 sub-values
 * Aggregates: economic, social, subjective, political (0..5)
 *
 * Formula: Weighted average of normalized dimension values
 * - Each dimension is normalized from 0..5 to 0..100
 * - Weights are normalized from 0..100 to 0..1
 * - Final index is clamped between 0 and 100
 *
 * @param signal - The signal with valueDimensions
 * @param weights - Optional weights in percent (0-100). If not provided, uses default weights
 * @returns Work-Value-Index (0..100)
 *
 * @example
 * ```typescript
 * const signal = { valueDimensions: { economic: 4, social: 3, subjective: 2, political: 1 } }
 * const index = calculateWorkValueIndex(signal)
 * // Returns: weighted average of normalized values
 * ```
 */
export function calculateWorkValueIndex(
  signal: Signal,
  weights?: ValueWeights
): number {
  const { economic, social, subjective, political } = signal.valueDimensions

  // Use provided weights or default weights
  const weightValues = weights || defaultWeights

  // Normalize percent weights (0-100) to decimal weights (0.0-1.0)
  const normalizedWeights = {
    economic: weightValues.economic / NORMALIZATION_FACTOR,
    social: weightValues.social / NORMALIZATION_FACTOR,
    subjective: weightValues.subjective / NORMALIZATION_FACTOR,
    political: weightValues.political / NORMALIZATION_FACTOR,
  }

  // Normalize from 0..5 to 0..100
  const normalizedEconomic = (economic / DIMENSION_MAX) * NORMALIZATION_FACTOR
  const normalizedSocial = (social / DIMENSION_MAX) * NORMALIZATION_FACTOR
  const normalizedSubjective =
    (subjective / DIMENSION_MAX) * NORMALIZATION_FACTOR
  const normalizedPolitical = (political / DIMENSION_MAX) * NORMALIZATION_FACTOR

  const workValueIndex =
    normalizedEconomic * normalizedWeights.economic +
    normalizedSocial * normalizedWeights.social +
    normalizedSubjective * normalizedWeights.subjective +
    normalizedPolitical * normalizedWeights.political

  return Math.max(
    MIN_WORK_VALUE_INDEX,
    Math.min(MAX_WORK_VALUE_INDEX, workValueIndex)
  )
}

/**
 * Maps a signal to a 3D position in the classic trend radar
 *
 * Coordinate system (classic trend radar):
 * - X-axis: Impact / Relevance (0..100) → -maxRadius to +maxRadius
 *   - 0 = negative impact, 50 = neutral, 100 = positive impact
 * - Y-axis: Time Horizon / Maturity (0..100) → 0 to +maxRadius (semicircle)
 *   - 0 = now/short-term, 100 = long-term
 * - Z-axis: Work-Value-Index (aggregated from 4 sub-values) → Height (0..maxHeight)
 *   - Only positive heights (devaluation = low height, not negative)
 *
 * @param signal - The signal to be mapped
 * @param maxRadius - Maximum radius for x/y plane (default: 5)
 * @param maxHeight - Maximum height for z-axis (default: 3)
 * @param weights - Optional weights for value dimensions. If not provided, uses default weights
 * @returns 3D position {x, y, z} in cartesian coordinates
 *
 * @example
 * ```typescript
 * const signal = {
 *   xImpact: 75,
 *   yHorizon: 50,
 *   valueDimensions: { economic: 4, social: 3, subjective: 2, political: 1 }
 * }
 * const position = mapSignalToPosition(signal, 5, 3)
 * // Returns: { x: 2.5, y: 2.5, z: calculated_height }
 * ```
 */
export function mapSignalToPosition(
  signal: Signal,
  maxRadius: number = 5,
  maxHeight: number = 3,
  weights?: ValueWeights
): { x: number; y: number; z: number } {
  // X: Impact / Relevance (0..100) → -maxRadius to +maxRadius
  // Normalize to -1..1, then scale
  const x =
    (signal.xImpact / NORMALIZATION_FACTOR - IMPACT_CENTER_OFFSET) *
    IMPACT_SCALE_FACTOR *
    maxRadius

  // Y: Time Horizon / Maturity (0..100) → 0 to +maxRadius (semicircle)
  // 0 = now/short-term, 100 = long-term
  const y = (signal.yHorizon / NORMALIZATION_FACTOR) * maxRadius

  // Z: Work-Value-Index (aggregated from 4 sub-values)
  // Calculate Work-Value-Index from valueDimensions with optional weights
  // Returns 0..100 (0 = all dimensions 0, 100 = all dimensions 5)
  const workValueIndex = calculateWorkValueIndex(signal, weights)

  // Normalize from 0..100 to 0..maxHeight
  // All dimensions 0 → z = 0 (on X-axis plane)
  // All dimensions 5 → z = maxHeight (maximum height)
  const z = (workValueIndex / NORMALIZATION_FACTOR) * maxHeight

  return { x, y, z }
}
