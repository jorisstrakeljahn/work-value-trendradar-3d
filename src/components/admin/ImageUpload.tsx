import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, X } from 'lucide-react'

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
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setError(t('admin.messages.uploadError') + ': ' + 'File too large (max 5MB)')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Firebase Storage if signalId is provided
    if (signalId) {
      setUploading(true)
      try {
        const { uploadSignalImage } = await import('../../firebase/services/imageService')
        const downloadURL = await uploadSignalImage(signalId, file)
        onImageChange(downloadURL)
        setUploading(false)
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : t('admin.messages.uploadError')
        setError(errorMessage)
        setUploading(false)
        setPreview(currentImageUrl || null)
      }
    } else {
      // For new signals, just show preview
      // Image will be uploaded when signal is created
      setPreview(reader.result as string)
      onImageChange(reader.result as string) // Temporary data URL
    }
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
        const { deleteSignalImage } = await import('../../firebase/services/imageService')
        await deleteSignalImage(currentImageUrl)
      } catch (err) {
        console.warn('Error deleting image:', err)
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
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt={t('admin.form.imagePreview')}
              className="w-full h-full object-contain"
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label={t('admin.form.removeImage')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {uploading && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('admin.messages.uploadSuccess')}...
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
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
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
