import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config'
import type {
  Signal,
  SignalDocument,
  MultilingualText,
} from '../../types/signal'
import { logErrorWithContext } from '../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../shared/utils/errorHandling'
import { isSignalDocument, isMultilingualText } from '../../shared/utils/typeGuards'

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

/**
 * Get a single signal by ID
 */
export async function getSignal(
  signalId: string
): Promise<SignalDocument | null> {
  try {
    const signalRef = doc(db, 'signals', signalId)
    const signalSnap = await getDoc(signalRef)

    if (!signalSnap.exists()) {
      return null
    }

    const data = { id: signalSnap.id, ...signalSnap.data() }
    if (isSignalDocument(data)) {
      return data
    }

    logErrorWithContext(
      new Error('Invalid signal document structure'),
      'signalsService',
      'getSignal',
      { signalId }
    )
    return null
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'signalsService',
      'getSignal',
      { signalId }
    )
    throw new Error(
      `Failed to get signal: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Get all signals
 */
export async function getAllSignals(): Promise<SignalDocument[]> {
  try {
    const signalsRef = collection(db, 'signals')
    const q = query(signalsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const signals: SignalDocument[] = []
    for (const docSnapshot of querySnapshot.docs) {
      const data = { id: docSnapshot.id, ...docSnapshot.data() }
      if (isSignalDocument(data)) {
        signals.push(data)
      } else {
        logErrorWithContext(
          new Error('Invalid signal document structure'),
          'signalsService',
          'getAllSignals',
          { signalId: docSnapshot.id }
        )
      }
    }

    return signals
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'signalsService',
      'getAllSignals'
    )
    throw new Error(
      `Failed to get signals: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Create a new signal
 */
export async function createSignal(
  signalData: Partial<
    Signal & {
      title?: { de: string; en: string } | string
      summary?: { de: string; en: string } | string
    }
  >,
  userId: string,
  customId?: string
): Promise<string> {
  try {
    const firestoreData = signalToFirestore(signalData, userId, false)

    if (customId) {
      // Use custom ID (for migration)
      const docRef = doc(db, 'signals', customId)
      await setDoc(docRef, firestoreData)
      return customId
    } else {
      const signalsRef = collection(db, 'signals')
      const docRef = await addDoc(signalsRef, firestoreData)
      return docRef.id
    }
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'signalsService',
      'createSignal',
      { userId, hasCustomId: !!customId }
    )
    throw new Error(
      `Failed to create signal: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Update an existing signal
 */
export async function updateSignal(
  signalId: string,
  signalData: Partial<
    Signal & {
      title?: { de: string; en: string } | string
      summary?: { de: string; en: string } | string
    }
  >,
  userId: string
): Promise<void> {
  try {
    const signalRef = doc(db, 'signals', signalId)
    const firestoreData = signalToFirestore(signalData, userId, true)

    await updateDoc(signalRef, firestoreData)
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'signalsService',
      'updateSignal',
      { signalId, userId }
    )
    throw new Error(
      `Failed to update signal: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Delete a signal
 */
export async function deleteSignal(signalId: string): Promise<void> {
  try {
    const signalRef = doc(db, 'signals', signalId)
    await deleteDoc(signalRef)
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'signalsService',
      'deleteSignal',
      { signalId }
    )
    throw new Error(
      `Failed to delete signal: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Subscribe to real-time updates of all signals
 * Returns an unsubscribe function
 */
export function subscribeToSignals(
  callback: (signals: SignalDocument[]) => void
): Unsubscribe {
  const signalsRef = collection(db, 'signals')
  const q = query(signalsRef, orderBy('createdAt', 'desc'))

  return onSnapshot(
    q,
    snapshot => {
      const signals: SignalDocument[] = []
      for (const docSnapshot of snapshot.docs) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() }
        if (isSignalDocument(data)) {
          signals.push(data)
        } else {
          logErrorWithContext(
            new Error('Invalid signal document structure'),
            'signalsService',
            'subscribeToSignals',
            { signalId: docSnapshot.id }
          )
        }
      }
      callback(signals)
    },
    error => {
      logErrorWithContext(
        error instanceof Error ? error : new Error(String(error)),
        'signalsService',
        'subscribeToSignals'
      )
    }
  )
}

/**
 * Subscribe to real-time updates of a single signal
 */
export function subscribeToSignal(
  signalId: string,
  callback: (signal: SignalDocument | null) => void
): Unsubscribe {
  const signalRef = doc(db, 'signals', signalId)

  return onSnapshot(
    signalRef,
    snapshot => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      const data = { id: snapshot.id, ...snapshot.data() }
      if (isSignalDocument(data)) {
        callback(data)
      } else {
        logErrorWithContext(
          new Error('Invalid signal document structure'),
          'signalsService',
          'subscribeToSignal',
          { signalId }
        )
        callback(null)
      }
    },
    error => {
      logErrorWithContext(
        error instanceof Error ? error : new Error(String(error)),
        'signalsService',
        'subscribeToSignal',
        { signalId }
      )
    }
  )
}
