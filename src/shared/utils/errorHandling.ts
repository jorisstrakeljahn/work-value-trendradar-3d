import { logError, logErrorWithContext } from './errorLogger'
import { isFirebaseError } from './typeGuards'

/**
 * Type guard to check if an error is a standard Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error
}

/**
 * Extracts user-friendly error message from Firebase errors
 * @param error - The error object
 * @returns User-friendly error message
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (!isFirebaseError(error)) {
    if (isError(error)) {
      return error.message
    }
    return 'An unexpected error occurred'
  }

  const code = error.code || ''
  const message = error.message || ''

  // Map Firebase error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password',
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Wrong password',
    'auth/weak-password': 'Password is too weak',
    'auth/email-already-in-use': 'Email is already in use',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/too-many-requests': 'Too many requests. Please try again later.',
    'storage/unauthorized': 'Storage permission denied',
    'storage/permission-denied': 'Storage permission denied',
    'storage/unauthenticated':
      'Unauthorized. Please make sure you are logged in.',
    'storage/object-not-found': 'File not found',
    'storage/quota-exceeded': 'Storage quota exceeded',
    'permission-denied': 'Permission denied',
    unavailable: 'Service temporarily unavailable',
    'deadline-exceeded': 'Request timeout',
  }

  // Check if we have a specific message for this error code
  if (code && errorMessages[code]) {
    return errorMessages[code]
  }

  // Fallback to error message or generic message
  return message || 'An error occurred'
}

/**
 * Wrapper for async functions that automatically handles errors
 * @param fn - Async function to wrap
 * @param context - Context for error logging
 * @returns Wrapped function that handles errors
 */
export function handleAsyncError<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T, context: { component: string; function?: string }): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      logErrorWithContext(
        error instanceof Error ? error : new Error(String(error)),
        context.component,
        context.function
      )
      throw error
    }
  }) as T
}

/**
 * Creates an error handler for a specific context
 * @param context - Context information
 * @returns Error handler function
 */
export function createErrorHandler(context: {
  component: string
  function?: string
}) {
  return (error: unknown, severity: 'error' | 'warn' = 'error') => {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    logError(errorObj, context, severity)
    return getFirebaseErrorMessage(error)
  }
}

/**
 * Safely executes an async function and returns a result object
 * @param fn - Async function to execute
 * @param context - Context for error logging
 * @returns Result object with success flag and data/error
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context: { component: string; function?: string }
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      context.component,
      context.function
    )
    return {
      success: false,
      error: getFirebaseErrorMessage(error),
    }
  }
}
