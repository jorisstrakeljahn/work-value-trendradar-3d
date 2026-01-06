import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import type { Industry } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { isIndustryDocument } from '../../../shared/utils/typeGuards'
import { firestoreToIndustry } from './converters'

const INDUSTRIES_COLLECTION = 'industries'

/**
 * Subscribe to real-time updates of all industries
 */
export function subscribeToIndustries(
  callback: (industries: Industry[]) => void,
  language: 'de' | 'en' = 'de',
  onError?: (error: Error) => void
): () => void {
  const industriesRef = collection(db, INDUSTRIES_COLLECTION)
  const q = query(industriesRef, orderBy('createdAt', 'asc'))

  return onSnapshot(
    q,
    snapshot => {
      const industries: Industry[] = []
      for (const docSnapshot of snapshot.docs) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() }
        if (isIndustryDocument(data)) {
          industries.push(firestoreToIndustry(docSnapshot.id, data, language))
        } else {
          logErrorWithContext(
            new Error('Invalid industry document structure'),
            'industriesService',
            'subscribeToIndustries',
            { industryId: docSnapshot.id }
          )
        }
      }
      callback(industries)
    },
    error => {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      logErrorWithContext(
        errorObj,
        'industriesService',
        'subscribeToIndustries'
      )
      if (onError) {
        onError(errorObj)
      }
    }
  )
}
