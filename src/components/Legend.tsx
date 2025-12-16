import { useState } from 'react'

export default function Legend() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="absolute bottom-4 left-4 glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 max-w-xs overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Legende
        </h3>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isCollapsed ? '' : 'rotate-180'
          }`}
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
        <div className="px-5 pb-5 space-y-4 text-xs">
          <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              Status
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Ausgewählt</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-[#252525] border-2 border-gray-400 dark:border-gray-500 flex-shrink-0"></div>
                <span className="text-gray-700 dark:text-gray-300">Hover</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              Radar-Achsen
            </h4>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  X-Achse:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  Impact / Relevanz
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• Links = Low Impact</div>
                  <div>• Rechts = High Impact</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Y-Achse:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  Zeithorizont / Reifegrad
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• Unten = Jetzt (Now)</div>
                  <div>• Oben = Zukunft (Far)</div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Z-Achse:
                </span>{' '}
                <span className="text-gray-600 dark:text-gray-400">
                  Work-Value-Index
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 ml-2 space-y-0.5">
                  <div>• Aggregiert aus 4 Teilwerten</div>
                  <div>• Höher = mehr Aufwertung</div>
                  <div>• Niedriger = weniger Aufwertung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
