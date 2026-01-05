import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../config'
import type {
  Industry,
  IndustryDocument,
  MultilingualText,
} from '../../types/signal'
import { logErrorWithContext } from '../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../shared/utils/errorHandling'
import { isIndustryDocument, isMultilingualText } from '../../shared/utils/typeGuards'

const INDUSTRIES_COLLECTION = 'industries'

/**
 * Convert Firestore document to Industry
 */
function firestoreToIndustry(
  docId: string,
  data: IndustryDocument,
  language: 'de' | 'en' = 'de'
): Industry {
  return {
    id: docId,
    name: typeof data.name === 'string' ? data.name : data.name[language],
    color: data.color,
  }
}

/**
 * Create a new industry
 */
export async function createIndustry(
  industryData: { name: MultilingualText; color: string },
  userId: string
): Promise<string> {
  try {
    const industryRef = doc(collection(db, INDUSTRIES_COLLECTION))

    const firestoreData: Omit<IndustryDocument, 'id'> = {
      name: industryData.name,
      color: industryData.color,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    }

    await setDoc(industryRef, firestoreData)
    return industryRef.id
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'createIndustry',
      { userId }
    )
    throw new Error(
      `Failed to create industry: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Create an industry with a custom ID
 */
export async function createIndustryWithId(
  industryId: string,
  industryData: { name: MultilingualText; color: string },
  userId: string
): Promise<void> {
  try {
    const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)

    const firestoreData: Omit<IndustryDocument, 'id'> = {
      name: industryData.name,
      color: industryData.color,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: userId,
    }

    await setDoc(industryRef, firestoreData)
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'createIndustryWithId',
      { industryId, userId }
    )
    throw new Error(
      `Failed to create industry: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Update an existing industry
 */
export async function updateIndustry(
  industryId: string,
  updates: Partial<{ name: MultilingualText; color: string }>
): Promise<void> {
  try {
    const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)

    const updateData: Partial<IndustryDocument> = {
      ...updates,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(industryRef, updateData)
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'updateIndustry',
      { industryId }
    )
    throw new Error(
      `Failed to update industry: ${getFirebaseErrorMessage(error)}`
    )
  }
}

/**
 * Delete an industry
 */
export async function deleteIndustry(industryId: string): Promise<void> {
  try {
    const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
    await deleteDoc(industryRef)
  } catch (error) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'industriesService',
      'deleteIndustry',
      { industryId }
    )
    throw new Error(
      `Failed to delete industry: ${getFirebaseErrorMessage(error)}`
    )
  }
}

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
