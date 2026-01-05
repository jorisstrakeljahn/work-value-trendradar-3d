/**
 * Industries Service - Barrel file
 * Re-exports all industry-related functions for backward compatibility
 */

// Converters
export { firestoreToIndustry } from './industries/converters'

// Queries
export { getIndustry, getAllIndustries, isIndustryInUse } from './industries/queries'

// Mutations
export {
  createIndustry,
  createIndustryWithId,
  updateIndustry,
  deleteIndustry,
} from './industries/mutations'

// Subscriptions
export { subscribeToIndustries } from './industries/subscriptions'
