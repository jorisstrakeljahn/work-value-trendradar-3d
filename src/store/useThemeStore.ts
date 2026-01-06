import { create } from 'zustand'
import {
  getStoredTheme,
  setTheme as setThemeUtil,
  applyThemeToDocument,
} from '../shared/utils/themeUtils'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/**
 * Zustand store for theme management
 * Persists theme preference to localStorage
 */
export const useThemeStore = create<ThemeState>(set => {
  // Initialize from localStorage or default to dark
  const storedTheme = getStoredTheme()
  const initialTheme = storedTheme || 'dark'

  // Apply theme to document on initialization
  applyThemeToDocument(initialTheme)

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        setThemeUtil(newTheme)
        return { theme: newTheme }
      }),
    setTheme: theme => {
      setThemeUtil(theme)
      set({ theme })
    },
  }
})
