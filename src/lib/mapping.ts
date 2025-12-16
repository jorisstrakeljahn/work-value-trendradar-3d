import type { Signal } from '../types/signal'

/**
 * Berechnet den Work-Value-Index aus den 4 Teilwerten
 * Aggregiert: economic, social, subjective, political (-5..+5)
 * 
 * @param signal - Das Signal mit valueDimensions
 * @returns Work-Value-Index (-100..100)
 */
export function calculateWorkValueIndex(signal: Signal): number {
  const { economic, social, subjective, political } = signal.valueDimensions

  // Gewichtete Summe der Dimensionen
  // Jede Dimension kann -5 bis +5 sein, also max 20 Punkte pro Dimension
  const weights = {
    economic: 0.3,
    social: 0.25,
    subjective: 0.25,
    political: 0.2,
  }

  // Normalisiere von -5..+5 zu -100..+100
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
 * Mappt ein Signal auf eine 3D-Position im klassischen Trendradar
 * 
 * Koordinatensystem (klassisches Trendradar):
 * - X-Achse: Impact / Relevanz (0..100) → -maxRadius bis +maxRadius
 * - Y-Achse: Zeithorizont / Reifegrad (0..100) → 0 bis +maxRadius (Halbkreis)
 * - Z-Achse: Work-Value-Index (aggregiert aus 4 Teilwerten) → Höhe (0..maxHeight)
 *   - Nur positive Höhen (Abwertung = niedrige Höhe, nicht negativ)
 * 
 * @param signal - Das Signal, das gemappt werden soll
 * @param maxRadius - Maximaler Radius für x/y Ebene (Standard: 5)
 * @param maxHeight - Maximale Höhe für z-Achse (Standard: 3)
 * @returns 3D-Position {x, y, z} in kartesischen Koordinaten
 */
export function mapSignalToPosition(
  signal: Signal,
  maxRadius: number = 5,
  maxHeight: number = 3
): { x: number; y: number; z: number } {
  // X: Impact / Relevanz (0..100) → -maxRadius bis +maxRadius
  // Normalisiere zu -1..1, dann skaliere
  const x = ((signal.xImpact / 100) - 0.5) * 2 * maxRadius

  // Y: Zeithorizont / Reifegrad (0..100) → 0 bis +maxRadius (Halbkreis)
  // 0 = jetzt/kurzfristig, 100 = langfristig
  const y = (signal.yHorizon / 100) * maxRadius

  // Z: Work-Value-Index (aggregiert aus 4 Teilwerten)
  // Berechne Work-Value-Index aus valueDimensions
  const workValueIndex = calculateWorkValueIndex(signal)

  // Normalisiere von -100..100 zu 0..maxHeight
  // Negative Werte werden zu niedrigen Höhen, positive zu hohen Höhen
  // Keine negativen Höhen!
  const normalizedWorkValue = (workValueIndex + 100) / 200 // 0..1
  const z = normalizedWorkValue * maxHeight

  return { x, y, z }
}
