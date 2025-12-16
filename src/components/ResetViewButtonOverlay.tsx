export default function ResetViewButtonOverlay() {
  const resetCamera = () => {
    const resetFn = (window as any).__resetRadarCamera
    if (resetFn) {
      resetFn()
    }
  }

  return (
    <button
      onClick={resetCamera}
      className="glass rounded-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-apple hover:shadow-apple-lg transition-all duration-200 hover:scale-105 border border-gray-200/50 dark:border-gray-600/50 self-start"
    >
      Reset View
    </button>
  )
}
