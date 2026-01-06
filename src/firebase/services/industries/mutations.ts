import {
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../../config'
import type { IndustryDocument, MultilingualText } from '../../../types/signal'
import { logErrorWithContext } from '../../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../../shared/utils/errorHandling'

const INDUSTRIES_COLLECTION = 'industries'

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
