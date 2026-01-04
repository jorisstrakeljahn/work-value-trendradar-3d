import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import RadarScene from './RadarScene'
import FiltersPanel from './FiltersPanel'
import WeightDimensionsPanel from './WeightDimensionsPanel'
import Legend from './Legend'
import HoverTooltip from './HoverTooltip'
import ResetViewButtonOverlay from './ResetViewButtonOverlay'
import ScrollIndicator from './ScrollIndicator'
import DraggableSignalWindow from './DraggableSignalWindow'
import { useModalStore } from '../../../store/useModalStore'
import { useRadarStore } from '../../../store/useRadarStore'
import { useSignalWindowsStore } from '../../../store/useSignalWindowsStore'

type PanelId = 'filters' | 'weights' | 'legend' | null

export default function RadarSection() {
  const { isAnyModalOpen } = useModalStore()
  const { selectedSignal, setSelectedSignal } = useRadarStore()
  const {
    windows,
    openWindow,
    closeWindow,
    updateWindowPosition,
    updateWindowSize,
    bringToFront,
  } = useSignalWindowsStore()
  const [openPanel, setOpenPanel] = useState<PanelId>(null)

  // Open window when signal is selected
  useEffect(() => {
    if (selectedSignal) {
      openWindow(selectedSignal.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSignal?.id]) // Only depend on signal ID, not the entire signal object or function

  // Handle window close: clear selectedSignal if it's the signal that was closed
  const handleWindowClose = (windowId: string) => {
    const windowToClose = windows.find(w => w.id === windowId)
    if (windowToClose && selectedSignal?.id === windowToClose.signalId) {
      setSelectedSignal(null)
    }
    closeWindow(windowId)
  }

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200 overflow-x-auto">
      <div className="relative w-full h-full max-w-[1800px] mx-auto">
        {/* Left Sidebar: Filter + Weight Dimensions + Legend (stacked) - Hidden on mobile */}
        <div className="hidden md:absolute md:left-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <FiltersPanel
            isCollapsed={openPanel !== 'filters'}
            onToggle={() =>
              setOpenPanel(openPanel === 'filters' ? null : 'filters')
            }
          />
          <WeightDimensionsPanel
            isCollapsed={openPanel !== 'weights'}
            onToggle={() =>
              setOpenPanel(openPanel === 'weights' ? null : 'weights')
            }
          />
          <Legend
            isCollapsed={openPanel !== 'legend'}
            onToggle={() =>
              setOpenPanel(openPanel === 'legend' ? null : 'legend')
            }
          />
        </div>

        {/* Center: Canvas - Full width on mobile, centered on desktop */}
        <div className="absolute left-0 right-0 md:left-[19rem] md:right-[21rem] top-0 bottom-0">
          <div
            className={`relative w-full h-full ${isAnyModalOpen ? 'pointer-events-none opacity-0 invisible' : ''}`}
          >
            <Canvas camera={{ position: [10, 3, 10], fov: 75 }}>
              <RadarScene />
            </Canvas>
          </div>
        </div>

        {/* Right Sidebar: Reset Button - Hidden on mobile */}
        <div className="hidden md:absolute md:right-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <ResetViewButtonOverlay />
        </div>

        {/* HoverTooltip - Hidden on mobile (no hover on touch devices) */}
        <HoverTooltip />
        <ScrollIndicator />
      </div>

      {/* Signal Windows Container - Renders all open windows */}
      {/* Fixed container spanning full viewport, windows render on top */}
      {/* Use window bounds, not parent bounds, so windows can move freely */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        {windows.map(window => (
          <div key={window.id} className="pointer-events-auto">
            <DraggableSignalWindow
              windowId={window.id}
              signalId={window.signalId}
              position={window.position}
              size={window.size}
              zIndex={window.zIndex}
              onClose={() => handleWindowClose(window.id)}
              onPositionChange={position =>
                updateWindowPosition(window.id, position)
              }
              onSizeChange={size => updateWindowSize(window.id, size)}
              onFocus={() => bringToFront(window.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
