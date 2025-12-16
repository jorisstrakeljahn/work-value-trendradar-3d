import { useState } from 'react'
import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import type { Industry } from '../types/signal'

export default function FiltersPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { filters, setFilters } = useRadarStore()
  const industries = industriesData as Industry[]

  const toggleIndustry = (industryId: string) => {
    const currentIndustries = filters.industries || []
    if (currentIndustries.includes(industryId)) {
      setFilters({
        industries: currentIndustries.filter(id => id !== industryId),
      })
    } else {
      setFilters({
        industries: [...currentIndustries, industryId],
      })
    }
  }

  return (
    <div className="glass rounded-2xl shadow-apple-lg border border-gray-200/50 dark:border-gray-600/50 w-72 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/50 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-200"
      >
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Filter
        </h2>
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
        <div className="px-5 pb-5 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Branchen
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {industries.map(industry => {
                const isSelected =
                  filters.industries?.includes(industry.id) ?? false
                return (
                  <label
                    key={industry.id}
                    className="flex items-center gap-3 cursor-pointer px-2 py-2 rounded-xl hover:bg-white/70 dark:hover:bg-[#2a2a2a]/50 transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleIndustry(industry.id)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: industry.color }}
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {industry.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
          {filters.industries && filters.industries.length > 0 && (
            <button
              onClick={() => setFilters({ industries: [] })}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-150"
            >
              Alle zurücksetzen
            </button>
          )}
        </div>
      )}
    </div>
  )
}
