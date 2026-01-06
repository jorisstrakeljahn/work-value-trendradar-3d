import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../config'
import type { SignalDocument } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../../shared/utils/errorHandling'
import { isSignalDocument } from '../../../shared/utils/typeGuards'

const SIGNALS_COLLECTION = 'signals'

/**
 * Get a single signal by ID
 */
export async function getSignal(
  signalId: string
): Promise<SignalDocument | null> {
  try {
    const signalRef = doc(db, SIGNALS_COLLECTION, signalId)
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
    throw new Error(`Failed to get signal: ${getFirebaseErrorMessage(error)}`)
  }
}

/**
 * Get all signals
 */
export async function getAllSignals(): Promise<SignalDocument[]> {
  try {
    const signalsRef = collection(db, SIGNALS_COLLECTION)
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
    throw new Error(`Failed to get signals: ${getFirebaseErrorMessage(error)}`)
  }
}
