/**
 * Migration script to import JSON signals to Firestore
 * 
 * Usage in browser console:
 * 1. Open browser DevTools console
 * 2. Copy and paste this entire file
 * 3. Run: migrateSignalsToFirestore()
 * 
 * Or import and use in a React component:
 * import { migrateSignalsToFirestore } from '../scripts/migrateSignals'
 */

import { createSignal } from '../firebase/services/signalsService'
import type { Signal } from '../types/signal'

/**
 * Convert JSON signal to multilingual Firestore format
 */
function convertToMultilingual(
  signalDe: Signal,
  signalEn: Signal | undefined
): Partial<Signal & { title: { de: string; en: string }; summary: { de: string; en: string } }> {
  return {
    title: {
      de: signalDe.title,
      en: signalEn?.title || signalDe.title,
    },
    summary: {
      de: signalDe.summary,
      en: signalEn?.summary || signalDe.summary,
    },
    industryTags: signalDe.industryTags,
    xImpact: signalDe.xImpact,
    yHorizon: signalDe.yHorizon,
    valueDimensions: signalDe.valueDimensions,
    sources: signalDe.sources,
    confidence: signalDe.confidence,
    tags: signalDe.tags,
    imageUrl: signalDe.imageUrl,
  }
}

/**
 * Migrate all signals from JSON files to Firestore
 * @param userId - The user ID to assign as creator
 * @param signalsDe - Array of German signals
 * @param signalsEn - Array of English signals
 * @returns Promise with migration results
 */
export async function migrateSignalsToFirestore(
  userId: string,
  signalsDe: Signal[],
  signalsEn: Signal[] = []
): Promise<{
  success: number
  errors: number
  errorDetails: string[]
}> {
  const errors: string[] = []
  let successCount = 0

  // Create a map of English signals by ID for matching
  const signalsEnMap = new Map<string, Signal>()
  signalsEn.forEach((signal: Signal) => {
    signalsEnMap.set(signal.id, signal)
  })

  console.log(`Starting migration of ${signalsDe.length} signals...`)

  for (const signalDe of signalsDe) {
    try {
      const signalEn = signalsEnMap.get(signalDe.id)
      const multilingualSignal = convertToMultilingual(signalDe, signalEn)

      await createSignal(multilingualSignal, userId, signalDe.id)
      successCount++
      console.log(`✓ Migrated signal: ${signalDe.id} - ${signalDe.title}`)
    } catch (error: unknown) {
      const errorMsg = `Error migrating signal ${signalDe.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      errors.push(errorMsg)
      console.error(`✗ ${errorMsg}`)
    }
  }

  console.log(`\nMigration complete!`)
  console.log(`Success: ${successCount}`)
  console.log(`Errors: ${errors.length}`)
  if (errors.length > 0) {
    console.error('Error details:', errors)
  }

  return {
    success: successCount,
    errors: errors.length,
    errorDetails: errors,
  }
}

/**
 * Browser console helper function
 * Usage: migrateSignalsToFirestore('your-user-id', signalsDe, signalsEn)
 * 
 * Note: signalsDe and signalsEn need to be imported/loaded separately
 * This is a utility script meant to be used in browser console or imported in a component
 */
