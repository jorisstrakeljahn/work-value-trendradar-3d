import { create } from 'zustand'

interface ModalStore {
  openModalCount: number
  isAnyModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

/**
 * Store to track if any modal is currently open
 * Used to disable interactions with the 3D canvas when modals are open
 * Uses a counter to handle multiple modals correctly
 */
export const useModalStore = create<ModalStore>((set) => ({
  openModalCount: 0,
  isAnyModalOpen: false,
  openModal: () =>
    set((state) => {
      const newCount = state.openModalCount + 1
      return {
        openModalCount: newCount,
        isAnyModalOpen: newCount > 0,
      }
    }),
  closeModal: () =>
    set((state) => {
      const newCount = Math.max(0, state.openModalCount - 1)
      return {
        openModalCount: newCount,
        isAnyModalOpen: newCount > 0,
      }
    }),
}))
