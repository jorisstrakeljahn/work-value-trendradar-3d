import { create } from 'zustand'

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
  // Initialize from localStorage or default to light
  const storedTheme = localStorage.getItem('radar-theme') as Theme | null
  const initialTheme = storedTheme === 'dark' ? 'dark' : 'light'

  // Apply theme to document on initialization
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (initialTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set(state => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light'
        localStorage.setItem('radar-theme', newTheme)
        if (typeof document !== 'undefined') {
          const root = document.documentElement
          if (newTheme === 'dark') {
            root.classList.add('dark')
          } else {
            root.classList.remove('dark')
          }
        }
        return { theme: newTheme }
      }),
    setTheme: theme => {
      localStorage.setItem('radar-theme', theme)
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
      set({ theme })
    },
  }
})
