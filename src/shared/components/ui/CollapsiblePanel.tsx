import { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Panel } from './Panel'

interface CollapsiblePanelProps {
  title: string
  children: ReactNode
  defaultCollapsed?: boolean
  className?: string
}

/**
 * Reusable collapsible panel component
 * Used by FiltersPanel, Legend, etc.
 */
export function CollapsiblePanel({
  title,
  children,
  defaultCollapsed = false,
  className = '',
}: CollapsiblePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <Panel className={className}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
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

