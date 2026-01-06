import { useTranslation } from 'react-i18next'
import { useImageUpload } from '../hooks/useImageUpload'
import { ImagePreview, ImageUploadZone } from './image-upload'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageChange: (url: string | null) => void
  signalId?: string
  disabled?: boolean
}

/**
 * Component for uploading images to Firebase Storage
 * Orchestrates image upload logic and UI components
 */
export default function ImageUpload({
  currentImageUrl,
  onImageChange,
  signalId,
  disabled = false,
}: ImageUploadProps) {
  const { t } = useTranslation()

  const {
    preview,
    uploading,
    imageLoading,
    error,
    handleFileSelect,
    handleRemove,
  } = useImageUpload({
    currentImageUrl,
    signalId,
    onImageChange,
  })

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('admin.form.image')}
      </label>

      {preview ? (
        <ImagePreview
          preview={preview}
          imageLoading={imageLoading}
          uploading={uploading}
          onRemove={handleRemove}
          disabled={disabled}
        />
      ) : (
        <ImageUploadZone
          onFileSelect={handleFileSelect}
          disabled={disabled}
          uploading={uploading}
        />
      )}

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  )
}
