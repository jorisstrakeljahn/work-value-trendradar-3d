import ImageUpload from '../ImageUpload'

interface ImageSectionProps {
  imageUrl: string | null
  onImageChange: (url: string | null) => void
  signalId?: string
  disabled?: boolean
}

/**
 * Image upload section
 * Uses existing ImageUpload component
 */
export function ImageSection({
  imageUrl,
  onImageChange,
  signalId,
  disabled = false,
}: ImageSectionProps) {
  return (
    <ImageUpload
      currentImageUrl={imageUrl || undefined}
      onImageChange={onImageChange}
      signalId={signalId}
      disabled={disabled}
    />
  )
}
