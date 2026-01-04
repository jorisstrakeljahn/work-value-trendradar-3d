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
 * Dimension key type for value dimensions
 */
export type DimensionKey = 'economic' | 'social' | 'subjective' | 'political'

/**
 * Weights for value dimensions (in percent, 0-100, sum = 100)
 */
export interface ValueWeights {
  economic: number
  social: number
  subjective: number
  political: number
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
  imageUrl?: string
  position?: {
    x: number
    y: number
    z: number
  }
}

/**
 * Multilingual fields for Firestore documents
 */
export interface MultilingualText {
  de: string
  en: string
}

/**
 * Firestore document structure for signals (with multilingual fields)
 */
export interface SignalDocument {
  id: string
  title: MultilingualText
  summary: MultilingualText
  industryTags: string[]
  xImpact: number
  yHorizon: number
  valueDimensions: ValueDimensions
  sources: Source[]
  confidence: number
  tags: string[]
  imageUrl?: string
  createdAt: unknown // Firestore Timestamp
  updatedAt: unknown // Firestore Timestamp
  createdBy: string // User UID
}

/**
 * Industry definition with color coding
 */
export interface Industry {
  id: string
  name: string // For backward compatibility, can be multilingual object
  color: string
}

/**
 * Firestore document structure for industries (with multilingual name)
 */
export interface IndustryDocument {
  id: string
  name: MultilingualText
  color: string
  createdAt: unknown // Firestore Timestamp
  updatedAt: unknown // Firestore Timestamp
  createdBy: string // User UID
}
