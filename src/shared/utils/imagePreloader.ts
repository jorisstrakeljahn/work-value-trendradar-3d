/**
 * Image preloading utility for instant image display
 * Preloads images when signals are hovered or selected
 */

const preloadedImages = new Map<string, HTMLImageElement>()

/**
 * Preload an image and cache it
 * @param imageUrl - URL of the image to preload
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(imageUrl: string): Promise<void> {
  // Return cached promise if already preloading/loaded
  if (preloadedImages.has(imageUrl)) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      preloadedImages.set(imageUrl, img)
      resolve()
    }
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageUrl}`))
    }
    
    // Start loading
    img.src = imageUrl
  })
}

/**
 * Preload multiple images
 * @param imageUrls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded (or failed)
 */
export function preloadImages(imageUrls: string[]): Promise<void[]> {
  return Promise.allSettled(
    imageUrls.map(url => preloadImage(url).catch(() => {}))
  ).then(() => [])
}

/**
 * Check if an image is already preloaded
 * @param imageUrl - URL of the image to check
 * @returns True if image is preloaded
 */
export function isImagePreloaded(imageUrl: string): boolean {
  return preloadedImages.has(imageUrl)
}

/**
 * Get preloaded image element
 * @param imageUrl - URL of the image
 * @returns Preloaded image element or null
 */
export function getPreloadedImage(imageUrl: string): HTMLImageElement | null {
  return preloadedImages.get(imageUrl) || null
}

/**
 * Clear preloaded images cache (useful for memory management)
 */
export function clearImageCache(): void {
  preloadedImages.clear()
}

