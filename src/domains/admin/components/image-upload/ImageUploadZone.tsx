import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ImageUploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
  uploading?: boolean
}

/**
 * Upload zone component for drag-and-drop and click-to-upload
 */
export function ImageUploadZone({
  onFileSelect,
  disabled = false,
  uploading = false,
}: ImageUploadZoneProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (disabled || uploading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
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
  )
}

