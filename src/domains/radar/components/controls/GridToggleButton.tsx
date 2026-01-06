import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid3x3 } from 'lucide-react'
import { Button } from '../../../../shared/components/ui'
import { useRadarStore } from '../../../../store/useRadarStore'
import { useClickOutside } from '../../../../shared/hooks/useClickOutside'

/**
 * Grid toggle button component
 * Allows toggling the reference grid on/off and switching between ground and full modes
 */
export default function GridToggleButton() {
  const { t } = useTranslation()
  const { showGrid, gridMode, toggleGrid, setGridMode, setShowGrid } =
    useRadarStore()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useClickOutside(menuRef, () => setShowMenu(false))

  const handleToggle = () => {
    if (!showGrid) {
      // Turn on grid
      setShowGrid(true)
    } else {
      // Toggle off
      toggleGrid()
    }
  }

  const handleModeChange = (mode: 'ground' | 'full') => {
    setGridMode(mode)
    setShowMenu(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="primary"
        onClick={handleToggle}
        onContextMenu={e => {
          e.preventDefault()
          setShowMenu(!showMenu)
        }}
        title={t('grid.toggle')}
        className="flex items-center gap-2"
      >
        <Grid3x3 className="w-4 h-4" />
        <span className="hidden sm:inline">
          {showGrid
            ? gridMode === 'ground'
              ? t('grid.ground')
              : t('grid.full')
            : t('grid.off')}
        </span>
      </Button>

      {/* Dropdown menu for mode selection */}
      {showMenu && showGrid && (
        <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 z-50 overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => handleModeChange('ground')}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                gridMode === 'ground'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('grid.ground')}
            </button>
            <button
              onClick={() => handleModeChange('full')}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                gridMode === 'full'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t('grid.full')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

