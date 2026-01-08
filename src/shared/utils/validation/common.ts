/**
 * Common validation utilities
 *
 * Note: These validations are NOT a security boundary - Firebase Security Rules
 * are the authoritative validation layer. Client-side validation serves:
 * 1. Better UX (immediate feedback before submission)
 * 2. Defense-in-depth (reduces malformed requests)
 * 3. Early rejection of obviously invalid data
 *
 * OWASP A03: Injection Prevention (client-side layer)
 */

import type { MultilingualText } from '../../../types/signal'

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
      throw new ValidationError(`${fieldName} must not be empty`, fieldName)
    }
    if (text.length > maxLength) {
      throw new ValidationError(
        `${fieldName} must not exceed ${maxLength} characters`,
        fieldName
      )
    }
    return
  }

  if (!text || typeof text !== 'object') {
    throw new ValidationError(`${fieldName} must be a text object`, fieldName)
  }

  if (!text.de || text.de.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} (German) must not be empty`,
      fieldName
    )
  }

  if (!text.en || text.en.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} (English) must not be empty`,
      fieldName
    )
  }

  if (text.de.length > maxLength) {
    throw new ValidationError(
      `${fieldName} (German) must not exceed ${maxLength} characters`,
      fieldName
    )
  }

  if (text.en.length > maxLength) {
    throw new ValidationError(
      `${fieldName} (English) must not exceed ${maxLength} characters`,
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
    throw new ValidationError(`${fieldName} must be a number`, fieldName)
  }

  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      fieldName
    )
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
    throw new ValidationError(`${fieldName} must be an array`, fieldName)
  }

  if (array.length < minLength) {
    throw new ValidationError(
      `${fieldName} must contain at least ${minLength} element(s)`,
      fieldName
    )
  }

  if (array.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must not contain more than ${maxLength} element(s)`,
      fieldName
    )
  }
}

/**
 * Validates a URL string
 */
export function validateUrl(url: string, fieldName: string): void {
  if (!url || url.trim().length === 0) {
    throw new ValidationError(`${fieldName} must not be empty`, fieldName)
  }

  if (url.length > 2048) {
    throw new ValidationError(
      `${fieldName} must not exceed 2048 characters`,
      fieldName
    )
  }

  // Basic URL pattern check (not exhaustive, just prevents obvious garbage)
  try {
    new URL(url)
  } catch {
    throw new ValidationError(`${fieldName} is not a valid URL`, fieldName)
  }
}

/**
 * Validates a hex color string
 */
export function validateHexColor(color: string, fieldName: string): void {
  if (!color || !color.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
    throw new ValidationError(
      `${fieldName} must be a valid hex color code (e.g. #FF0000 or #F00)`,
      fieldName
    )
  }
}
