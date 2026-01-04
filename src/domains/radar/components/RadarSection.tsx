import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import RadarScene from './RadarScene'
import FiltersPanel from './FiltersPanel'
import SignalDetailsPanel from './SignalDetailsPanel'
import Legend from './Legend'
import HoverTooltip from './HoverTooltip'
import ResetViewButtonOverlay from './ResetViewButtonOverlay'
import ScrollIndicator from './ScrollIndicator'
import { useModalStore } from '../../../store/useModalStore'
import { useRadarStore } from '../../../store/useRadarStore'
import SignalFormModal from '../../admin/components/SignalFormModal'
import DeleteSignalModal from '../../admin/components/DeleteSignalModal'
import { deleteSignal } from '../../../firebase/services/signalsService'

export default function RadarSection() {
  const { isAnyModalOpen } = useModalStore()
  const { selectedSignal } = useRadarStore()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200 overflow-x-auto">
      <div className="relative w-full h-full max-w-[1800px] mx-auto">
        {/* Left Sidebar: Filter + Legend (stacked) - Hidden on mobile */}
        <div className="hidden md:absolute md:left-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <FiltersPanel />
          <Legend />
        </div>

        {/* Center: Canvas - Full width on mobile, centered on desktop */}
        <div className="absolute left-0 right-0 md:left-[19rem] md:right-[21rem] top-0 bottom-0">
          <div className={`relative w-full h-full ${isAnyModalOpen ? 'pointer-events-none opacity-0 invisible' : ''}`}>
            <Canvas camera={{ position: [8, 8, 8], fov: 75 }}>
              <RadarScene />
            </Canvas>
          </div>
        </div>

        {/* Right Sidebar: Reset Button + Signal Details - Hidden on mobile */}
        <div className="hidden md:absolute md:right-4 md:top-4 md:flex md:flex-col md:gap-4 z-30">
          <ResetViewButtonOverlay />
          <SignalDetailsPanel
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        </div>

        {/* HoverTooltip - Hidden on mobile (no hover on touch devices) */}
        <HoverTooltip />
        <ScrollIndicator />
      </div>

      <SignalFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        signal={selectedSignal || undefined}
        onSuccess={() => {
          setShowEditModal(false)
        }}
      />

      <DeleteSignalModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        signal={selectedSignal}
        loading={deleting}
        onConfirm={async () => {
          if (!selectedSignal?.id) return
          setDeleting(true)
          try {
            await deleteSignal(selectedSignal.id)
            setShowDeleteModal(false)
          } catch (error) {
            console.error('Error deleting signal:', error)
            throw error
          } finally {
            setDeleting(false)
          }
        }}
      />
    </section>
  )
}
