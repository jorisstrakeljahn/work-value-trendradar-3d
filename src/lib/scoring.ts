import type { Signal } from '../types/signal'
import { calculateWorkValueIndex } from './mapping'

/**
 * Calculates an overall score for a signal based on Impact, Horizon and Work Value
 */
export function calculateSignalScore(signal: Signal): number {
  const weights = {
    impact: 0.4,
    horizon: 0.3,
    workValue: 0.3,
  }

  // Calculate Work Value Index from 4 sub-values
  const workValueIndex = calculateWorkValueIndex(signal)
  // Normalize from -100..100 to 0..100
  const normalizedWorkValue = (workValueIndex + 100) / 2

  return (
    signal.xImpact * weights.impact +
    signal.yHorizon * weights.horizon +
    normalizedWorkValue * weights.workValue
  )
}

/**
 * Normalizes a value to a range of 0-1
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}
