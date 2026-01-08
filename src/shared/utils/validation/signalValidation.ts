/**
 * Signal-specific validation utilities
 */

import type {
  MultilingualText,
  ImpactHorizonJustification,
} from '../../../types/signal'
import {
  ValidationError,
  validateMultilingualText,
  validateMultilingualTextLong,
  validateNumberInRange,
  validateArrayLength,
  validateUrl,
} from './common'

/**
 * Validates value dimensions (0-5 range for each dimension)
 */
export function validateValueDimensions(dimensions: {
  economic: number
  social: number
  subjective: number
  political: number
}): void {
  if (!dimensions || typeof dimensions !== 'object') {
    throw new ValidationError('Value dimensions must be an object')
  }

  const requiredDimensions = ['economic', 'social', 'subjective', 'political']
  const actualDimensions = Object.keys(dimensions)

  // Check for missing dimensions
  for (const dim of requiredDimensions) {
    if (!(dim in dimensions)) {
      throw new ValidationError(`Dimension "${dim}" is missing`, 'valueDimensions')
    }
  }

  // Check for unexpected dimensions
  for (const dim of actualDimensions) {
    if (!requiredDimensions.includes(dim)) {
      throw new ValidationError(
        `Unexpected dimension "${dim}"`,
        'valueDimensions'
      )
    }
  }

  // Validate each dimension value
  for (const [key, value] of Object.entries(dimensions)) {
    validateNumberInRange(value, `Dimension "${key}"`, 0, 5)
  }
}

/**
 * Validates sources array
 */
export function validateSources(
  sources: Array<{ url: string; name: string }>
): void {
  validateArrayLength(sources, 'Sources', 0, 20)

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]

    if (!source || typeof source !== 'object') {
      throw new ValidationError(`Source ${i + 1} is invalid`, 'sources')
    }

    validateUrl(source.url, `Source ${i + 1} (URL)`)

    if (!source.name || source.name.trim().length === 0) {
      throw new ValidationError(
        `Source ${i + 1} (Name) must not be empty`,
        'sources'
      )
    }

    if (source.name.length > 200) {
      throw new ValidationError(
        `Source ${i + 1} (Name) must not exceed 200 characters`,
        'sources'
      )
    }
  }
}

/**
 * Validates Impact or Horizon justification
 */
export function validateImpactHorizonJustification(
  justification: ImpactHorizonJustification | undefined,
  fieldName: string
): void {
  if (!justification) return // Optional

  // Text must be filled (at least DE or EN)
  if (!justification.text?.de?.trim() && !justification.text?.en?.trim()) {
    throw new ValidationError(
      `${fieldName}: Text (DE or EN) is required`,
      fieldName
    )
  }

  // Check text length (max 4000 characters per language, like Summary)
  if (justification.text.de && justification.text.de.length > 4000) {
    throw new ValidationError(`${fieldName} (DE): Max 4000 characters`, fieldName)
  }
  if (justification.text.en && justification.text.en.length > 4000) {
    throw new ValidationError(`${fieldName} (EN): Max 4000 characters`, fieldName)
  }

  // Validate sources (if present)
  if (justification.sources && justification.sources.length > 0) {
    validateSources(justification.sources)
  }
}

/**
 * Validates signal form data
 */
export function validateSignalFormData(data: {
  title: MultilingualText | string
  summary: MultilingualText | string
  industryTags: string[]
  xImpact: number
  yHorizon: number
  valueDimensions: {
    economic: number
    social: number
    subjective: number
    political: number
  }
  sources: Array<{ url: string; name: string }>
  imageUrl?: string
  xImpactJustification?: ImpactHorizonJustification
  yHorizonJustification?: ImpactHorizonJustification
}): void {
  // Validate title
  validateMultilingualText(data.title, 'Title', 200)

  // Validate summary
  validateMultilingualTextLong(data.summary, 'Summary', 4000)

  // Validate industry tags
  validateArrayLength(data.industryTags, 'Industries', 1, 20)

  // Validate impact (0-100)
  validateNumberInRange(data.xImpact, 'Impact', 0, 100)

  // Validate horizon (0-100)
  validateNumberInRange(data.yHorizon, 'Time horizon', 0, 100)

  // Validate value dimensions
  validateValueDimensions(data.valueDimensions)

  // Validate sources
  validateSources(data.sources)

  // Validate image URL (optional)
  if (data.imageUrl && data.imageUrl.length > 0) {
    validateUrl(data.imageUrl, 'Image URL')
  }

  // Validate impact justification (optional)
  if (data.xImpactJustification) {
    validateImpactHorizonJustification(
      data.xImpactJustification,
      'Impact justification'
    )
  }

  // Validate horizon justification (optional)
  if (data.yHorizonJustification) {
    validateImpactHorizonJustification(
      data.yHorizonJustification,
      'Maturity justification'
    )
  }
}
