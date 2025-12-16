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
      className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors z-10"
    >
      Reset View
    </button>
  )
}
