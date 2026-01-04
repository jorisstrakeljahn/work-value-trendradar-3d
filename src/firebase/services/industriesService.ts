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
import type { Industry, IndustryDocument, MultilingualText } from '../../types/signal'

const INDUSTRIES_COLLECTION = 'industries'

/**
 * Convert Firestore document to Industry
 */
function firestoreToIndustry(docId: string, data: IndustryDocument, language: 'de' | 'en' = 'de'): Industry {
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
}

/**
 * Create an industry with a custom ID
 */
export async function createIndustryWithId(
  industryId: string,
  industryData: { name: MultilingualText; color: string },
  userId: string
): Promise<void> {
  const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
  
  const firestoreData: Omit<IndustryDocument, 'id'> = {
    name: industryData.name,
    color: industryData.color,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    createdBy: userId,
  }

  await setDoc(industryRef, firestoreData)
}

/**
 * Update an existing industry
 */
export async function updateIndustry(
  industryId: string,
  updates: Partial<{ name: MultilingualText; color: string }>
): Promise<void> {
  const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
  
  const updateData: Partial<IndustryDocument> = {
    ...updates,
    updatedAt: Timestamp.now(),
  }

  await updateDoc(industryRef, updateData)
}

/**
 * Delete an industry
 */
export async function deleteIndustry(industryId: string): Promise<void> {
  const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
  await deleteDoc(industryRef)
}

/**
 * Get a single industry by ID
 */
export async function getIndustry(industryId: string): Promise<IndustryDocument | null> {
  const industryRef = doc(db, INDUSTRIES_COLLECTION, industryId)
  const snapshot = await getDoc(industryRef)
  
  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as IndustryDocument
}

/**
 * Get all industries
 */
export async function getAllIndustries(language: 'de' | 'en' = 'de'): Promise<Industry[]> {
  const industriesRef = collection(db, INDUSTRIES_COLLECTION)
  const q = query(industriesRef, orderBy('createdAt', 'asc'))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return []
  }

  return snapshot.docs.map(doc => {
    const data = doc.data() as Omit<IndustryDocument, 'id'>
    return firestoreToIndustry(doc.id, { id: doc.id, ...data }, language)
  })
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
    (snapshot) => {
      const industries = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<IndustryDocument, 'id'>
        return firestoreToIndustry(doc.id, { id: doc.id, ...data }, language)
      })
      callback(industries)
    },
    (error) => {
      if (onError) {
        onError(error as Error)
      }
    }
  )
}
