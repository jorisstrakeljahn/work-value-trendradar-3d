import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import {
  preloadImage,
  isImagePreloaded,
} from '../../../../shared/utils/imagePreloader'
import { logWarning } from '../../../../shared/utils/errorLogger'

interface SignalImageProps {
  imageUrl?: string
}

/**
 * Signal image display component (read-only)
 * Shows image if available with loading state and error handling
 * Preloads images for instant display
 */
export function SignalImage({ imageUrl }: SignalImageProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false)
      setImageSrc(null)
      return
    }

    // Check if already preloaded
    if (isImagePreloaded(imageUrl)) {
      setImageSrc(imageUrl)
      setIsLoading(false)
      setHasError(false)
      return
    }

    // Preload image
    setIsLoading(true)
    setHasError(false)
    preloadImage(imageUrl)
      .then(() => {
        setImageSrc(imageUrl)
        setIsLoading(false)
        setHasError(false)
      })
      .catch(error => {
        logWarning('Failed to load signal image', {
          component: 'SignalImage',
          additionalData: { imageUrl, error },
        })
        setHasError(true)
        setIsLoading(false)
        setImageSrc(null)
      })
  }, [imageUrl])

  if (!imageUrl) return null

  return (
    <div className="mb-4">
      <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-400 dark:text-gray-500 animate-spin" />
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t('signalWindows.imageLoadError') || 'Image could not be loaded'}
            </p>
          </div>
        )}
        {imageSrc && !hasError && (
          <img
            src={imageSrc}
            alt={t('signalWindows.imageAlt') || 'Signal image'}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true)
              setIsLoading(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
