/**
 * Client-side validation utilities for defense-in-depth security
 *
 * Note: These validations are NOT a security boundary - Firebase Security Rules
 * are the authoritative validation layer. Client-side validation serves:
 * 1. Better UX (immediate feedback before submission)
 * 2. Defense-in-depth (reduces malformed requests)
 * 3. Early rejection of obviously invalid data
 *
 * OWASP A03: Injection Prevention (client-side layer)
 */

import { MultilingualText } from '../../types/signal'

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Validates a multilingual text object (short form)
 * Max length: 200 characters per language
 */
export function validateMultilingualText(
  text: MultilingualText | string,
  fieldName: string,
  maxLength = 200
): void {
  if (typeof text === 'string') {
    if (text.length === 0) {
      throw new ValidationError(`${fieldName} darf nicht leer sein`, fieldName)
    }
    if (text.length > maxLength) {
      throw new ValidationError(
        `${fieldName} darf maximal ${maxLength} Zeichen lang sein`,
        fieldName
      )
    }
    return
  }

  if (!text || typeof text !== 'object') {
    throw new ValidationError(
      `${fieldName} muss ein Textobjekt sein`,
      fieldName
    )
  }

  if (!text.de || text.de.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} (Deutsch) darf nicht leer sein`,
      fieldName
    )
  }

  if (!text.en || text.en.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} (Englisch) darf nicht leer sein`,
      fieldName
    )
  }

  if (text.de.length > maxLength) {
    throw new ValidationError(
      `${fieldName} (Deutsch) darf maximal ${maxLength} Zeichen lang sein`,
      fieldName
    )
  }

  if (text.en.length > maxLength) {
    throw new ValidationError(
      `${fieldName} (Englisch) darf maximal ${maxLength} Zeichen lang sein`,
      fieldName
    )
  }
}

/**
 * Validates a multilingual text object (long form for summaries)
 * Max length: 4000 characters per language
 */
export function validateMultilingualTextLong(
  text: MultilingualText | string,
  fieldName: string,
  maxLength = 4000
): void {
  validateMultilingualText(text, fieldName, maxLength)
}

/**
 * Validates a number within a range
 */
export function validateNumberInRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} muss eine Zahl sein`, fieldName)
  }

  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} muss zwischen ${min} und ${max} liegen`,
      fieldName
    )
  }
}

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
    throw new ValidationError('Wertedimensionen müssen ein Objekt sein')
  }

  const requiredDimensions = ['economic', 'social', 'subjective', 'political']
  const actualDimensions = Object.keys(dimensions)

  // Check for missing dimensions
  for (const dim of requiredDimensions) {
    if (!(dim in dimensions)) {
      throw new ValidationError(`Dimension "${dim}" fehlt`, 'valueDimensions')
    }
  }

  // Check for unexpected dimensions
  for (const dim of actualDimensions) {
    if (!requiredDimensions.includes(dim)) {
      throw new ValidationError(
        `Unerwartete Dimension "${dim}"`,
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
 * Validates an array length
 */
export function validateArrayLength(
  array: unknown[],
  fieldName: string,
  minLength: number,
  maxLength: number
): void {
  if (!Array.isArray(array)) {
    throw new ValidationError(`${fieldName} muss ein Array sein`, fieldName)
  }

  if (array.length < minLength) {
    throw new ValidationError(
      `${fieldName} muss mindestens ${minLength} Element(e) enthalten`,
      fieldName
    )
  }

  if (array.length > maxLength) {
    throw new ValidationError(
      `${fieldName} darf maximal ${maxLength} Element(e) enthalten`,
      fieldName
    )
  }
}

/**
 * Validates a URL string
 */
export function validateUrl(url: string, fieldName: string): void {
  if (!url || url.trim().length === 0) {
    throw new ValidationError(`${fieldName} darf nicht leer sein`, fieldName)
  }

  if (url.length > 2048) {
    throw new ValidationError(
      `${fieldName} darf maximal 2048 Zeichen lang sein`,
      fieldName
    )
  }

  // Basic URL pattern check (not exhaustive, just prevents obvious garbage)
  try {
    new URL(url)
  } catch {
    throw new ValidationError(`${fieldName} ist keine gültige URL`, fieldName)
  }
}

/**
 * Validates sources array
 */
export function validateSources(
  sources: Array<{ url: string; name: string }>
): void {
  validateArrayLength(sources, 'Quellen', 0, 20)

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]

    if (!source || typeof source !== 'object') {
      throw new ValidationError(`Quelle ${i + 1} ist ungültig`, 'sources')
    }

    validateUrl(source.url, `Quelle ${i + 1} (URL)`)

    if (!source.name || source.name.trim().length === 0) {
      throw new ValidationError(
        `Quelle ${i + 1} (Name) darf nicht leer sein`,
        'sources'
      )
    }

    if (source.name.length > 200) {
      throw new ValidationError(
        `Quelle ${i + 1} (Name) darf maximal 200 Zeichen lang sein`,
        'sources'
      )
    }
  }
}

/**
 * Validates a hex color string
 */
export function validateHexColor(color: string, fieldName: string): void {
  if (!color || !color.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
    throw new ValidationError(
      `${fieldName} muss ein gültiger Hex-Farbcode sein (z.B. #FF0000 oder #F00)`,
      fieldName
    )
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
}): void {
  // Validate title
  validateMultilingualText(data.title, 'Titel', 200)

  // Validate summary
  validateMultilingualTextLong(data.summary, 'Zusammenfassung', 4000)

  // Validate industry tags
  validateArrayLength(data.industryTags, 'Branchen', 1, 20)

  // Validate impact (0-100)
  validateNumberInRange(data.xImpact, 'Impact', 0, 100)

  // Validate horizon (0-100)
  validateNumberInRange(data.yHorizon, 'Zeithorizont', 0, 100)

  // Validate value dimensions
  validateValueDimensions(data.valueDimensions)

  // Validate sources
  validateSources(data.sources)

  // Validate image URL (optional)
  if (data.imageUrl && data.imageUrl.length > 0) {
    validateUrl(data.imageUrl, 'Bild-URL')
  }
}

/**
 * Validates industry form data
 */
export function validateIndustryFormData(data: {
  name: MultilingualText | string
  color: string
}): void {
  // Validate name
  validateMultilingualText(data.name, 'Name', 200)

  // Validate color
  validateHexColor(data.color, 'Farbe')
}
