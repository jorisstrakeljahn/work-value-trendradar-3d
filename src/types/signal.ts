/**
 * Source reference for a signal
 */
export interface Source {
  url: string
  name: string
}

/**
 * Value dimensions that contribute to the Work-Value-Index
 * Each dimension ranges from -5 to +5
 */
export interface ValueDimensions {
  economic: number // -5 to +5
  social: number // -5 to +5
  subjective: number // -5 to +5
  political: number // -5 to +5
}

/**
 * Weak Signal representing a trend or development
 */
export interface Signal {
  id: string
  title: string
  summary: string
  industryTags: string[]
  xImpact: number // 0..100 (Impact / Relevance)
  yHorizon: number // 0..100 (Time Horizon / Maturity: 0 = now, 100 = far future)
  zWorkValue: number // -100..100 (negative = value loss, positive = value gain)
  valueDimensions: ValueDimensions
  sources: Source[]
  confidence: number // 1..5
  tags: string[]
  position?: {
    x: number
    y: number
    z: number
  }
}

/**
 * Industry definition with color coding
 */
export interface Industry {
  id: string
  name: string
  color: string
}
