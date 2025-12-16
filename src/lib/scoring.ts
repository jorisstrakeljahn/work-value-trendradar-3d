import type { Signal } from '../types/signal'
import { calculateWorkValueIndex } from './mapping'

/**
 * Berechnet einen Gesamtscore für ein Signal basierend auf Impact, Horizon und Work Value
 */
export function calculateSignalScore(signal: Signal): number {
  const weights = {
    impact: 0.4,
    horizon: 0.3,
    workValue: 0.3,
  }

  // Work Value Index aus 4 Teilwerten berechnen
  const workValueIndex = calculateWorkValueIndex(signal)
  // Normalisiere von -100..100 auf 0..100
  const normalizedWorkValue = (workValueIndex + 100) / 2

  return (
    signal.xImpact * weights.impact +
    signal.yHorizon * weights.horizon +
    normalizedWorkValue * weights.workValue
  )
}

/**
 * Normalisiert einen Wert auf einen Bereich von 0-1
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}

