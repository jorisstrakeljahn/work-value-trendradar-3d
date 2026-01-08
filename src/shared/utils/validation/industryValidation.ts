/**
 * Industry-specific validation utilities
 */

import type { MultilingualText } from '../../../types/signal'
import { validateMultilingualText, validateHexColor } from './common'

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
