import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '../firebase/config'

interface AuthState {
  user: User | null
  loading: boolean
  errorCode: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setErrorCode: (errorCode: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

/**
 * Zustand store for authentication state management
 * Manages user authentication with Firebase Auth
 * Stores error codes instead of translated messages for i18n support
 */
export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: true,
  errorCode: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, errorCode: null })
      await signInWithEmailAndPassword(auth, email, password)
      set({ errorCode: null })
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      const errorCode =
        firebaseError.code === 'auth/invalid-credential'
          ? 'invalid-credential'
          : firebaseError.code === 'auth/user-not-found'
          ? 'user-not-found'
          : firebaseError.code === 'auth/wrong-password'
          ? 'wrong-password'
          : 'login-failed'
      set({ errorCode })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  logout: async () => {
    try {
      set({ loading: true, errorCode: null })
      await signOut(auth)
      set({ user: null, errorCode: null })
    } catch (error: unknown) {
      set({ errorCode: 'logout-failed' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      set({ loading: true, errorCode: null })
      const user = auth.currentUser
      if (!user) {
        set({ errorCode: 'no-user' })
        throw new Error('No user logged in')
      }
      await updatePassword(user, newPassword)
      set({ errorCode: null })
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      const errorCode =
        firebaseError.code === 'auth/weak-password'
          ? 'weak-password'
          : 'change-password-failed'
      set({ errorCode })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, errorCode: null })
      await sendPasswordResetEmail(auth, email)
      set({ errorCode: null })
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      const errorCode =
        firebaseError.code === 'auth/user-not-found'
          ? 'user-not-found-reset'
          : 'reset-password-failed'
      set({ errorCode })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  setErrorCode: (errorCode: string | null) => set({ errorCode }),
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
}))

// Initialize auth state listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, user => {
    useAuthStore.getState().setUser(user)
    useAuthStore.getState().setLoading(false)
  })
}
