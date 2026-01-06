import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from '../config'
import { logErrorWithContext } from '../../shared/utils/errorLogger'
import { getFirebaseErrorMessage } from '../../shared/utils/errorHandling'
import { FILE_UPLOAD_CONFIG } from '../../shared/constants/fileUpload'

/**
 * Upload an image for a signal
 * @param signalId - The ID of the signal
 * @param file - The image file to upload
 * @param onProgress - Optional progress callback
 * @returns The download URL of the uploaded image
 */
export async function uploadSignalImage(
  signalId: string,
  file: File
): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (max 5MB)
    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      throw new Error('Image size must be less than 5MB')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}.${fileExtension}`
    const storagePath = `signals/${signalId}/${fileName}`
    const storageRef = ref(storage, storagePath)

    // Upload file
    const snapshot = await uploadBytes(storageRef, file)

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error: unknown) {
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'imageService',
      'uploadSignalImage',
      { signalId, fileName: file.name }
    )
    throw new Error(`Failed to upload image: ${getFirebaseErrorMessage(error)}`)
  }
}

/**
 * Delete an image from Firebase Storage
 * @param imageUrl - The download URL of the image to delete
 */
export async function deleteSignalImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL
    // Firebase Storage URLs are in format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const url = new URL(imageUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)

    if (!pathMatch) {
      throw new Error('Invalid image URL')
    }

    // Decode the path (URL encoded)
    const encodedPath = pathMatch[1]
    const decodedPath = decodeURIComponent(encodedPath)
    const storageRef = ref(storage, decodedPath)

    await deleteObject(storageRef)
  } catch (error) {
    // If image doesn't exist, that's okay - log as warning
    logErrorWithContext(
      error instanceof Error ? error : new Error(String(error)),
      'imageService',
      'deleteSignalImage',
      { imageUrl }
    )
    throw error
  }
}

/**
 * Delete all images for a signal
 * @param imageUrls - Array of image URLs to delete
 */
export async function deleteSignalImages(imageUrls: string[]): Promise<void> {
  await Promise.all(imageUrls.map(url => deleteSignalImage(url)))
}
