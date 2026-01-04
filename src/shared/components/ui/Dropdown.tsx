import { ReactNode, useRef, useState } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'end' | 'center'
  className?: string
}

/**
 * Reusable dropdown component
 * Uses useClickOutside hook
 * Consistent styling with glass, shadow-apple-lg
 */
export function Dropdown({
  trigger,
  children,
  position = 'bottom',
  align = 'end',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  }

  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }

  const alignmentClass = alignClasses[align] || alignClasses.end

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute ${positionClasses[position]} ${alignmentClass} w-48 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden z-50`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
