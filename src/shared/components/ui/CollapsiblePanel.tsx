import { useState, ReactNode, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Panel } from './Panel'

interface CollapsiblePanelProps {
  title: string
  children: ReactNode
  defaultCollapsed?: boolean
  className?: string
  isCollapsed?: boolean // Controlled mode: external state
  onToggle?: () => void // Controlled mode: external handler
}

/**
 * Reusable collapsible panel component
 * Used by FiltersPanel, Legend, etc.
 * Supports both controlled (via isCollapsed/onToggle) and uncontrolled (via defaultCollapsed) modes
 */
export function CollapsiblePanel({
  title,
  children,
  defaultCollapsed = true,
  className = '',
  isCollapsed: controlledCollapsed,
  onToggle,
}: CollapsiblePanelProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)

  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed

  // Update internal state when defaultCollapsed changes (for uncontrolled mode)
  useEffect(() => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(defaultCollapsed)
    }
  }, [defaultCollapsed, controlledCollapsed])

  const handleToggle = () => {
    if (onToggle) {
      // Controlled mode: call external handler
      onToggle()
    } else {
      // Uncontrolled mode: update internal state
      setInternalCollapsed(prev => !prev)
    }
  }

  return (
    <Panel className={className}>
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
        />
      </button>
      {!isCollapsed && <div className="px-5 pb-5">{children}</div>}
    </Panel>
  )
}

