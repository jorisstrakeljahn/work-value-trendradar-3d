import type { Industry, IndustryDocument } from '../../../types/signal'

/**
 * Convert Firestore document to Industry
 */
export function firestoreToIndustry(
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
