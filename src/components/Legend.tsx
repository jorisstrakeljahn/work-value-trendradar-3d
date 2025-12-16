import { useState } from 'react'

export default function Legend() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg max-w-xs">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg transition-colors"
      >
        <h3 className="text-sm font-semibold">Legende</h3>
        <svg
          className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {!isCollapsed && (
        <div className="p-4 space-y-3 text-xs">
          <div className="pt-2 border-t border-gray-300">
            <h4 className="font-medium mb-2">Status</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span>Ausgewählt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
                <span>Hover</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-300">
            <h4 className="font-medium mb-2">Radar-Achsen</h4>
            <div className="space-y-1">
              <div>
                <span className="font-medium">X-Achse:</span> Impact / Relevanz
                <div className="text-xs text-gray-600 ml-2">
                  • Links = Low Impact
                  <br />• Rechts = High Impact
                </div>
              </div>
              <div>
                <span className="font-medium">Y-Achse:</span> Zeithorizont /
                Reifegrad
                <div className="text-xs text-gray-600 ml-2">
                  • Unten = Jetzt (Now)
                  <br />• Oben = Zukunft (Far)
                </div>
              </div>
              <div>
                <span className="font-medium">Z-Achse:</span> Work-Value-Index
                <div className="text-xs text-gray-600 ml-2">
                  • Aggregiert aus 4 Teilwerten
                  <br />• Höher = mehr Aufwertung
                  <br />• Niedriger = weniger Aufwertung
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
