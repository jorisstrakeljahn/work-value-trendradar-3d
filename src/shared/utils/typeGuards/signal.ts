import type {
  SignalDocument,
  IndustryDocument,
  ValueDimensions,
  Source,
  ValueDimensionsJustification,
} from '../../../types/signal'
import { isMultilingualText } from './common'

/**
 * Type guard to check if a value is a ValueDimensions object
 */
export function isValueDimensions(value: unknown): value is ValueDimensions {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const dims = value as Record<string, unknown>
  return (
    typeof dims.economic === 'number' &&
    typeof dims.social === 'number' &&
    typeof dims.subjective === 'number' &&
    typeof dims.political === 'number' &&
    dims.economic >= 0 &&
    dims.economic <= 5 &&
    dims.social >= 0 &&
    dims.social <= 5 &&
    dims.subjective >= 0 &&
    dims.subjective <= 5 &&
    dims.political >= 0 &&
    dims.political <= 5
  )
}

/**
 * Type guard to check if a value is a Source object
 */
export function isSource(value: unknown): value is Source {
  return (
    typeof value === 'object' &&
    value !== null &&
    'url' in value &&
    'name' in value &&
    typeof (value as Source).url === 'string' &&
    typeof (value as Source).name === 'string'
  )
}

/**
 * Type guard to check if a value is a ValueDimensionsJustification
 */
export function isValueDimensionsJustification(
  value: unknown
): value is ValueDimensionsJustification {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const justification = value as Record<string, unknown>

  if (
    justification.mode !== 'freetext' &&
    justification.mode !== 'perDimension'
  ) {
    return false
  }

  if (justification.mode === 'freetext') {
    return (
      justification.freetext === undefined ||
      isMultilingualText(justification.freetext)
    )
  }

  // perDimension mode
  if (
    !justification.perDimension ||
    typeof justification.perDimension !== 'object'
  ) {
    return false
  }

  const perDim = justification.perDimension as Record<string, unknown>
  const requiredKeys = ['economic', 'social', 'subjective', 'political']

  return requiredKeys.every(key => {
    const dim = perDim[key]
    return (
      typeof dim === 'object' &&
      dim !== null &&
      'text' in dim &&
      'sources' in dim &&
      isMultilingualText((dim as { text: unknown }).text) &&
      Array.isArray((dim as { sources: unknown }).sources) &&
      (dim as { sources: unknown[] }).sources.every((s: unknown) => isSource(s))
    )
  })
}

/**
 * Type guard to check if a value is a SignalDocument
 */
export function isSignalDocument(value: unknown): value is SignalDocument {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const doc = value as Record<string, unknown>

  return (
    typeof doc.id === 'string' &&
    isMultilingualText(doc.title) &&
    isMultilingualText(doc.summary) &&
    Array.isArray(doc.industryTags) &&
    doc.industryTags.every((tag: unknown) => typeof tag === 'string') &&
    typeof doc.xImpact === 'number' &&
    typeof doc.yHorizon === 'number' &&
    isValueDimensions(doc.valueDimensions) &&
    Array.isArray(doc.sources) &&
    doc.sources.every((source: unknown) => isSource(source)) &&
    typeof doc.createdBy === 'string' &&
    (doc.imageUrl === undefined || typeof doc.imageUrl === 'string') &&
    (doc.valueDimensionsJustification === undefined ||
      isValueDimensionsJustification(doc.valueDimensionsJustification))
  )
}

/**
 * Type guard to check if a value is an IndustryDocument
 */
export function isIndustryDocument(value: unknown): value is IndustryDocument {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const doc = value as Record<string, unknown>

  return (
    typeof doc.id === 'string' &&
    isMultilingualText(doc.name) &&
    typeof doc.color === 'string' &&
    typeof doc.createdBy === 'string'
  )
}
