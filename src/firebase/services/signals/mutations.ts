import { doc, collection, addDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../config'
import type { Signal } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../../shared/utils/errorHandling'
import { signalToFirestore } from './converters'

const SIGNALS_COLLECTION = 'signals'

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
      const docRef = doc(db, SIGNALS_COLLECTION, customId)
      await setDoc(docRef, firestoreData)
      return customId
    } else {
      const signalsRef = collection(db, SIGNALS_COLLECTION)
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
    const signalRef = doc(db, SIGNALS_COLLECTION, signalId)
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
    const signalRef = doc(db, SIGNALS_COLLECTION, signalId)
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

