import { doc, collection, onSnapshot, query, orderBy, type Unsubscribe } from 'firebase/firestore'
import { db } from '../../config'
import type { SignalDocument } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { isSignalDocument } from '../../../shared/utils/typeGuards'

const SIGNALS_COLLECTION = 'signals'

/**
 * Subscribe to real-time updates of all signals
 * Returns an unsubscribe function
 */
export function subscribeToSignals(
  callback: (signals: SignalDocument[]) => void
): Unsubscribe {
  const signalsRef = collection(db, SIGNALS_COLLECTION)
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
  const signalRef = doc(db, SIGNALS_COLLECTION, signalId)

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

