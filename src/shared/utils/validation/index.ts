/**
 * Validation utilities barrel file
 * Re-exports all validation functions for backward compatibility
 */

// Common validators
export {
  ValidationError,
  validateMultilingualText,
  validateMultilingualTextLong,
  validateNumberInRange,
  validateArrayLength,
  validateUrl,
  validateHexColor,
} from './common'

// Signal validators
export {
  validateValueDimensions,
  validateSources,
  validateImpactHorizonJustification,
  validateSignalFormData,
} from './signalValidation'

// Industry validators
export { validateIndustryFormData } from './industryValidation'
