import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  uploadSignalImage,
  deleteSignalImage,
} from '../../../firebase/services/imageService'
import { logWarning } from '../../../shared/utils/errorLogger'
import { FILE_UPLOAD_CONFIG } from '../../../shared/constants/fileUpload'

interface UseImageUploadOptions {
  currentImageUrl?: string
  signalId?: string
  onImageChange: (url: string | null) => void
}

interface UseImageUploadReturn {
  preview: string | null
  uploading: boolean
  imageLoading: boolean
  error: string | null
  handleFileSelect: (file: File) => Promise<void>
  handleRemove: () => Promise<void>
  clearError: () => void
}

/**
 * Hook for handling image upload logic
 * Manages preview, upload state, and file validation
 */
export function useImageUpload({
  currentImageUrl,
  signalId,
  onImageChange,
}: UseImageUploadOptions): UseImageUploadReturn {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [imageLoading, setImageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Update preview when currentImageUrl changes
  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl)
      setImageLoading(true)
    } else {
      setPreview(null)
      setImageLoading(false)
    }
  }, [currentImageUrl])

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return t('admin.messages.uploadError') + ': ' + 'Invalid file type'
    }

    // Validate file size
    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return (
        t('admin.messages.uploadError') +
        ': ' +
        `File too large (max ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB)`
      )
    }

    return null
  }

  const handleFileSelect = async (file: File): Promise<void> => {
    setError(null)

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Show preview and store as data URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      setImageLoading(false) // Data URL is immediately available

      // Upload to Firebase Storage if signalId is provided
      if (signalId) {
        setUploading(true)
        uploadSignalImage(signalId, file)
          .then(downloadURL => {
            onImageChange(downloadURL)
            setUploading(false)
          })
          .catch((err: unknown) => {
            const errorMessage =
              err instanceof Error
                ? err.message
                : t('admin.messages.uploadError')
            setError(errorMessage)
            setUploading(false)
            setPreview(currentImageUrl || null)
          })
      } else {
        // For new signals, store as data URL for later upload
        onImageChange(dataUrl) // Temporary data URL
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = async (): Promise<void> => {
    setPreview(null)
    onImageChange(null)

    // Delete from Firebase Storage if we have a URL
    if (currentImageUrl && currentImageUrl.startsWith('http')) {
      try {
        await deleteSignalImage(currentImageUrl)
      } catch (err) {
        logWarning('Error deleting image', {
          component: 'useImageUpload',
          function: 'handleRemove',
          additionalData: { error: err },
        })
      }
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    preview,
    uploading,
    imageLoading,
    error,
    handleFileSelect,
    handleRemove,
    clearError,
  }
}
