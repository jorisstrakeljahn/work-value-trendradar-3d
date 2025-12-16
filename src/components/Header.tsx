import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            3D Trend Radar
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Mapping weak signals of AI/robotics and their impact on work value
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

