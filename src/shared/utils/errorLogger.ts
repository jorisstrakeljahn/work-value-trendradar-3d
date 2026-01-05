/**
 * Centralized error logging utility
 * Provides structured logging with different severity levels
 * In production: only logs critical errors
 * In development: logs all errors with full details
 */

export type ErrorSeverity = 'error' | 'warn' | 'info'

export interface ErrorLogContext {
  component?: string
  function?: string
  userId?: string
  additionalData?: Record<string, unknown>
}

export interface ErrorLogEntry {
  timestamp: string
  severity: ErrorSeverity
  message: string
  error?: Error
  context?: ErrorLogContext
  stack?: string
}

/**
 * Logs an error with structured information
 * @param error - The error object or error message
 * @param context - Additional context information
 * @param severity - Severity level (default: 'error')
 */
export function logError(
  error: Error | string,
  context?: ErrorLogContext,
  severity: ErrorSeverity = 'error'
): void {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  // In production, only log errors and warnings, skip info
  if (isProduction && severity === 'info') {
    return
  }

  const errorObj = typeof error === 'string' ? new Error(error) : error
  const timestamp = new Date().toISOString()

  const logEntry: ErrorLogEntry = {
    timestamp,
    severity,
    message: errorObj.message || error,
    error: errorObj,
    context,
    stack: errorObj.stack,
  }

  // Format log message
  const contextStr = context
    ? `[${context.component || 'Unknown'}${
        context.function ? `::${context.function}` : ''
      }]`
    : ''
  const logMessage = `${timestamp} ${severity.toUpperCase()} ${contextStr}: ${logEntry.message}`

  // Log to console based on severity
  switch (severity) {
    case 'error':
      if (isDevelopment) {
        console.error(logMessage, {
          error: errorObj,
          context,
          stack: errorObj.stack,
        })
      } else {
        // In production, only log critical errors
        console.error(logMessage)
      }
      break
    case 'warn':
      console.warn(logMessage, isDevelopment ? { error: errorObj, context } : undefined)
      break
    case 'info':
      if (isDevelopment) {
        console.info(logMessage, { context })
      }
      break
  }

  // In the future, this could send logs to an external service
  // Example: sendToErrorReportingService(logEntry)
}

/**
 * Convenience function for logging errors
 */
export function logErrorWithContext(
  error: Error | string,
  component: string,
  functionName?: string,
  additionalData?: Record<string, unknown>
): void {
  logError(error, {
    component,
    function: functionName,
    additionalData,
  })
}

/**
 * Convenience function for logging warnings
 */
export function logWarning(
  message: string,
  context?: ErrorLogContext
): void {
  logError(message, context, 'warn')
}

/**
 * Convenience function for logging info
 */
export function logInfo(message: string, context?: ErrorLogContext): void {
  logError(message, context, 'info')
}

