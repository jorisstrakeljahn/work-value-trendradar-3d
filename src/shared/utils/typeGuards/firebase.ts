import { Timestamp } from 'firebase/firestore'

/**
 * Type guard to check if a value is a Firestore Timestamp
 */
export function isFirestoreTimestamp(value: unknown): value is Timestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    'nanoseconds' in value &&
    typeof (value as Timestamp).toDate === 'function'
  )
}

/**
 * Type guard to check if a value is a Firebase error
 */
export function isFirebaseError(error: unknown): error is {
  code?: string
  message?: string
  stack?: string
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'message' in error)
  )
}
