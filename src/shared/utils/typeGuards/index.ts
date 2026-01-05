/**
 * Type Guards - Organized by domain
 * Re-exports all type guards for backward compatibility
 */

// Firebase-specific guards
export {
  isFirestoreTimestamp,
  isFirebaseError,
} from './firebase'

// Common/shared guards
export {
  isLanguage,
  isMultilingualText,
} from './common'

// Signal-specific guards
export {
  isSignalDocument,
  isIndustryDocument,
  isValueDimensions,
  isSource,
  isValueDimensionsJustification,
} from './signal'

