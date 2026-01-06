/**
 * Centralized theme utilities
 * Handles theme initialization, storage, and DOM manipulation
 */

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'radar-theme'

/**
 * Get stored theme from localStorage
 * @returns The stored theme or null if not set
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  return null
}

/**
 * Apply theme to document root element
 * @param theme - The theme to apply
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Store theme in localStorage
 * @param theme - The theme to store
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Initialize theme from localStorage and apply to document
 * @returns The initialized theme (defaults to 'dark' if not stored)
 */
export function initializeTheme(): Theme {
  const storedTheme = getStoredTheme()
  const theme = storedTheme || 'dark'
  applyThemeToDocument(theme)
  return theme
}

/**
 * Set theme (store and apply)
 * @param theme - The theme to set
 */
export function setTheme(theme: Theme): void {
  storeTheme(theme)
  applyThemeToDocument(theme)
}
