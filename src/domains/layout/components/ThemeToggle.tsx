import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '../../../shared/components/ui'
import { useThemeStore } from '../../../store/useThemeStore'

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
    <Button
      variant="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  )
}
