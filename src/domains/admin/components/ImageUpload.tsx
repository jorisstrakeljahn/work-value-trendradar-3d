import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X, Loader2 } from 'lucide-react'
import { logWarning } from '../../../shared/utils/errorLogger'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (url: string | null) => void
  signalId?: string
  disabled?: boolean
}

/**
 * Component for uploading images to Firebase Storage
 */
export default function ImageUpload({
  currentImageUrl,
  onImageChange,
  signalId,
  disabled = false,
}: ImageUploadProps) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const [imageLoading, setImageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when currentImageUrl changes (e.g., when modal opens with existing signal)
  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl)
      setImageLoading(true)
    } else {
      setPreview(null)
      setImageLoading(false)
    }
  }, [currentImageUrl])

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('admin.messages.uploadError') + ': ' + 'Invalid file type')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(
        t('admin.messages.uploadError') + ': ' + 'File too large (max 5MB)'
      )
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
        // Use the File directly for upload, not the data URL
        import('../../../firebase/services/imageService')
          .then(({ uploadSignalImage }) => uploadSignalImage(signalId, file))
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || uploading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = async () => {
    setPreview(null)
    onImageChange(null)

    // Delete from Firebase Storage if we have a URL
    if (currentImageUrl && currentImageUrl.startsWith('http')) {
      try {
        const { deleteSignalImage } =
          await import('../../../firebase/services/imageService')
        await deleteSignalImage(currentImageUrl)
      } catch (err) {
        logWarning('Error deleting image', {
          component: 'ImageUpload',
          function: 'handleImageChange',
          additionalData: { error: err },
        })
      }
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('admin.form.image')}
      </label>

      {preview ? (
        <div className="relative">
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" />
              </div>
            )}
            <img
              src={preview}
              alt={t('admin.form.imagePreview')}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false)
                setError(t('admin.messages.uploadError') + ': ' + 'Failed to load image')
              }}
              loading="eager"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                aria-label={t('admin.form.removeImage')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {uploading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('admin.messages.uploading')}
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center ${
            disabled || uploading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-blue-500 dark:hover:border-blue-400'
          } transition-colors`}
          onClick={() =>
            !disabled && !uploading && fileInputRef.current?.click()
          }
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.form.uploadImage')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {t('admin.form.imageRequirements')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  )
}
