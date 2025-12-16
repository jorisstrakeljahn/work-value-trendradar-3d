import type { Signal } from '../../types/signal'

/**
 * Calculates the Work-Value-Index from 4 sub-values
 * Aggregates: economic, social, subjective, political (-5..+5)
 *
 * @param signal - The signal with valueDimensions
 * @returns Work-Value-Index (-100..100)
 */
export function calculateWorkValueIndex(signal: Signal): number {
  const { economic, social, subjective, political } = signal.valueDimensions

  // Weighted sum of dimensions
  // Each dimension can be -5 to +5, so max 20 points per dimension
  const weights = {
    economic: 0.3,
    social: 0.25,
    subjective: 0.25,
    political: 0.2,
  }

  // Normalize from -5..+5 to -100..+100
  const normalizedEconomic = (economic / 5) * 100
  const normalizedSocial = (social / 5) * 100
  const normalizedSubjective = (subjective / 5) * 100
  const normalizedPolitical = (political / 5) * 100

  const workValueIndex =
    normalizedEconomic * weights.economic +
    normalizedSocial * weights.social +
    normalizedSubjective * weights.subjective +
    normalizedPolitical * weights.political

  return Math.max(-100, Math.min(100, workValueIndex))
}

/**
 * Maps a signal to a 3D position in the classic trend radar
 *
 * Coordinate system (classic trend radar):
 * - X-axis: Impact / Relevance (0..100) → -maxRadius to +maxRadius
 * - Y-axis: Time Horizon / Maturity (0..100) → 0 to +maxRadius (semicircle)
 * - Z-axis: Work-Value-Index (aggregated from 4 sub-values) → Height (0..maxHeight)
 *   - Only positive heights (devaluation = low height, not negative)
 *
 * @param signal - The signal to be mapped
 * @param maxRadius - Maximum radius for x/y plane (default: 5)
 * @param maxHeight - Maximum height for z-axis (default: 3)
 * @returns 3D position {x, y, z} in cartesian coordinates
 */
export function mapSignalToPosition(
  signal: Signal,
  maxRadius: number = 5,
  maxHeight: number = 3
): { x: number; y: number; z: number } {
  // X: Impact / Relevance (0..100) → -maxRadius to +maxRadius
  // Normalize to -1..1, then scale
  const x = (signal.xImpact / 100 - 0.5) * 2 * maxRadius

  // Y: Time Horizon / Maturity (0..100) → 0 to +maxRadius (semicircle)
  // 0 = now/short-term, 100 = long-term
  const y = (signal.yHorizon / 100) * maxRadius

  // Z: Work-Value-Index (aggregated from 4 sub-values)
  // Calculate Work-Value-Index from valueDimensions
  const workValueIndex = calculateWorkValueIndex(signal)

  // Normalize from -100..100 to 0..maxHeight
  // Negative values become low heights, positive become high heights
  // No negative heights!
  const normalizedWorkValue = (workValueIndex + 100) / 200 // 0..1
  const z = normalizedWorkValue * maxHeight

  return { x, y, z }
}
