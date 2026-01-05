import { X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ImagePreviewProps {
  preview: string
  imageLoading: boolean
  uploading: boolean
  onRemove: () => void
  disabled?: boolean
}

/**
 * Preview component for uploaded images
 * Displays image with loading state and remove button
 */
export function ImagePreview({
  preview,
  imageLoading,
  uploading,
  onRemove,
  disabled = false,
}: ImagePreviewProps) {
  const { t } = useTranslation()

  return (
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
          onLoad={() => {
            // This will be handled by the parent component
          }}
          onError={() => {
            // This will be handled by the parent component
          }}
          loading="eager"
        />
        {!disabled && (
          <button
            type="button"
            onClick={onRemove}
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
  )
}

