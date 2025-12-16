import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../store/useThemeStore'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-[#252525]/80 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200/50 dark:border-gray-600/50"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  )
}

