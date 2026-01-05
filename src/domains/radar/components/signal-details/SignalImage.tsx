import { useTranslation } from 'react-i18next'

interface SignalImageProps {
  imageUrl?: string
}

/**
 * Signal image display component (read-only)
 * Shows image if available, similar styling to ImageUpload but without upload functionality
 */
export function SignalImage({ imageUrl }: SignalImageProps) {
  const { t } = useTranslation()

  if (!imageUrl) return null

  return (
    <div className="mb-4">
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={t('signalWindows.imageAlt')}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
