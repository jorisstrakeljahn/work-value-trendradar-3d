/**
 * Signals Service - Barrel file
 * Re-exports all signal-related functions for backward compatibility
 */

// Converters
export { firestoreToSignal, signalToFirestore } from './signals/converters'

// Queries
export { getSignal, getAllSignals } from './signals/queries'

// Mutations
export { createSignal, updateSignal, deleteSignal } from './signals/mutations'

// Subscriptions
export { subscribeToSignals, subscribeToSignal } from './signals/subscriptions'
