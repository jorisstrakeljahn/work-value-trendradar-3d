import { Timestamp } from 'firebase/firestore'
import type { Signal, SignalDocument } from '../../../types/signal'
import { isMultilingualText } from '../../../shared/utils/typeGuards'

/**
 * Convert Firestore document to Signal interface
 * Extracts language-specific fields based on current language
 */
export function firestoreToSignal(
  docData: SignalDocument,
  language: 'de' | 'en' = 'de'
): Signal {
  return {
    id: docData.id,
    title: docData.title[language] || docData.title.de || docData.title.en,
    summary:
      docData.summary[language] || docData.summary.de || docData.summary.en,
    industryTags: docData.industryTags,
    xImpact: docData.xImpact,
    yHorizon: docData.yHorizon,
    zWorkValue: 0, // Will be calculated from valueDimensions
    valueDimensions: docData.valueDimensions,
    valueDimensionsJustification: docData.valueDimensionsJustification,
    xImpactJustification: docData.xImpactJustification,
    yHorizonJustification: docData.yHorizonJustification,
    sources: docData.sources,
    imageUrl: docData.imageUrl,
  }
}

/**
 * Convert Signal to Firestore document format
 */
export function signalToFirestore(
  signal: Partial<
    Signal & {
      title?: { de: string; en: string } | string
      summary?: { de: string; en: string } | string
    }
  >,
  userId: string,
  isUpdate: boolean = false
): Partial<SignalDocument> {
  const now = Timestamp.now()
  const baseData: Partial<SignalDocument> = {
    industryTags: signal.industryTags || [],
    xImpact: signal.xImpact ?? 0,
    yHorizon: signal.yHorizon ?? 0,
    valueDimensions: signal.valueDimensions || {
      economic: 0,
      social: 0,
      subjective: 0,
      political: 0,
    },
    sources: signal.sources || [],
    updatedAt: now,
  }

  // Only include imageUrl if it's defined (Firestore doesn't support undefined)
  if (signal.imageUrl !== undefined && signal.imageUrl !== null) {
    baseData.imageUrl = signal.imageUrl
  }

  // Include valueDimensionsJustification if defined
  if (signal.valueDimensionsJustification !== undefined) {
    baseData.valueDimensionsJustification = signal.valueDimensionsJustification
  }

  // Include xImpactJustification if defined
  if (signal.xImpactJustification !== undefined) {
    baseData.xImpactJustification = signal.xImpactJustification
  }

  // Include yHorizonJustification if defined
  if (signal.yHorizonJustification !== undefined) {
    baseData.yHorizonJustification = signal.yHorizonJustification
  }

  // Handle multilingual fields
  if (signal.title) {
    if (isMultilingualText(signal.title)) {
      // Already in multilingual format
      baseData.title = signal.title
    } else {
      // Single string - convert to multilingual
      baseData.title = {
        de: signal.title as string,
        en: signal.title as string,
      }
    }
  }

  if (signal.summary) {
    if (isMultilingualText(signal.summary)) {
      // Already in multilingual format
      baseData.summary = signal.summary
    } else {
      // Single string - convert to multilingual
      baseData.summary = {
        de: signal.summary as string,
        en: signal.summary as string,
      }
    }
  }

  if (!isUpdate) {
    baseData.createdAt = now
    baseData.createdBy = userId
  }

  return baseData
}
