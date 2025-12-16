import type { Signal } from '../types/signal'

/**
 * Mappt ein Signal auf eine 3D-Position im Radar
 * 
 * Achsen-Mapping:
 * - X-Achse: Impact (0..100) → -scale bis +scale
 * - Y-Achse: Horizon (0..100) → -scale bis +scale (0 = jetzt, 100 = weit in Zukunft)
 * - Z-Achse: Work Value (-100..100) → -scale bis +scale (negativ = Wertverlust, positiv = Wertsteigerung)
 * 
 * @param signal - Das Signal, das gemappt werden soll
 * @param scale - Skalierungsfaktor für den 3D-Raum (Standard: 5)
 * @returns 3D-Position {x, y, z}
 */
export function mapSignalToPosition(
  signal: Signal,
  scale: number = 5
): { x: number; y: number; z: number } {
  // X: Impact (0..100) → normalisiert zu -0.5..0.5, dann skaliert
  const x = ((signal.xImpact / 100) - 0.5) * scale

  // Y: Horizon (0..100) → normalisiert zu -0.5..0.5, dann skaliert
  const y = ((signal.yHorizon / 100) - 0.5) * scale

  // Z: Work Value (-100..100) → normalisiert zu -0.5..0.5, dann skaliert
  const z = (signal.zWorkValue / 100) * scale

  return { x, y, z }
}

