import { useEffect, RefObject } from 'react'

/**
 * Hook to detect clicks outside of a referenced element
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Check if the click target is part of another modal overlay
        // This prevents closing the current modal when clicking on a nested/overlay modal
        const target = event.target as HTMLElement
        if (target) {
          const closestModal = target.closest('[data-modal-overlay]')
          // If the click is inside another modal overlay, don't close this modal
          if (closestModal && closestModal !== ref.current) {
            return
          }
        }
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, handler])
}
