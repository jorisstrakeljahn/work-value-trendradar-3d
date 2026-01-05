import type { Timestamp } from 'firebase/firestore'

/**
 * Source reference for a signal
 */
export interface Source {
  url: string
  name: string
}

/**
 * Value dimensions that contribute to the Work-Value-Index
 * Each dimension ranges from 0 to 5
 */
export interface ValueDimensions {
  economic: number // 0 to 5
  social: number // 0 to 5
  subjective: number // 0 to 5
  political: number // 0 to 5
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
 * Justification for a single value dimension
 */
export interface DimensionJustification {
  text: MultilingualText
  sources: Source[]
}

/**
 * Justification for value dimensions
 * Supports two modes: freetext (single multilingual text) or perDimension (one justification per dimension with sources)
 */
export interface ValueDimensionsJustification {
  mode: 'freetext' | 'perDimension'
  freetext?: MultilingualText
  perDimension?: {
    economic: DimensionJustification
    social: DimensionJustification
    subjective: DimensionJustification
    political: DimensionJustification
  }
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
  zWorkValue: number // 0..100 (0 = no value change, 100 = maximum value gain)
  valueDimensions: ValueDimensions
  valueDimensionsJustification?: ValueDimensionsJustification
  sources: Source[]
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
  valueDimensionsJustification?: ValueDimensionsJustification
  sources: Source[]
  imageUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
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
  createdAt: Timestamp
  updatedAt: Timestamp
  createdBy: string // User UID
}
