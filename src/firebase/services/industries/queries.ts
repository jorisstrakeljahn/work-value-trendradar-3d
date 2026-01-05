import { doc, getDoc, getDocs, collection, query, orderBy } from 'firebase/firestore'
import { db } from '../../config'
import type { Industry, IndustryDocument } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../../shared/utils/errorHandling'
import { isIndustryDocument } from '../../../shared/utils/typeGuards'
import { firestoreToIndustry } from './converters'

const INDUSTRIES_COLLECTION = 'industries'

/**
 * Get a single industry by ID
 */
export async function getIndustry(
  industryId: string
): Promise<IndustryDocument | null> {
  try {
    const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
    const snapshot = await getDoc(industryRef)

    if (!snapshot.exists()) {
      return null
    }

    const data = { id: snapshot.id, ...snapshot.data() }
    if (isIndustryDocument(data)) {
      return data
    }

    logErrorWithContext(
      new Error('Invalid industry document structure'),
      'industriesService',
      'getIndustry',
      { industryId }
    )
    return null
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'getIndustry',
      { industryId }
    )
    throw new Error(
      `Failed to get industry: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Get all industries
 */
export async function getAllIndustries(
  language: 'de' | 'en' = 'de'
): Promise<Industry[]> {
  try {
    const industriesRef = collection(db, INDUSTRIES_COLLECTION)
    const q = query(industriesRef, orderBy('createdAt', 'asc'))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    const industries: Industry[] = []
    for (const docSnapshot of snapshot.docs) {
      const data = { id: docSnapshot.id, ...docSnapshot.data() }
      if (isIndustryDocument(data)) {
        industries.push(firestoreToIndustry(docSnapshot.id, data, language))
      } else {
        logErrorWithContext(
          new Error('Invalid industry document structure'),
          'industriesService',
          'getAllIndustries',
          { industryId: docSnapshot.id }
        )
      }
    }

    return industries
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'getAllIndustries'
    )
    throw new Error(
      `Failed to get industries: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Check if an industry is being used by any signals
 */
export async function isIndustryInUse(industryId: string): Promise<boolean> {
  try {
    const signalsRef = collection(db, 'signals')
    const snapshot = await getDocs(signalsRef)

    return snapshot.docs.some(doc => {
      const data = doc.data()
      const industryTags = data.industryTags || []
      return industryTags.includes(industryId)
    })
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'isIndustryInUse',
      { industryId }
    )
    throw new Error(
      `Failed to check industry usage: ${getFirebaseErrorMessage(error)}`
    )
  }
}

