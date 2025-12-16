import { useRadarStore } from '../store/useRadarStore'
import industriesData from '../data/industries.json'
import type { Industry } from '../types/signal'

export default function FiltersPanel() {
  const { filters, setFilters } = useRadarStore()
  const industries = industriesData as Industry[]

  const toggleIndustry = (industryId: string) => {
    const currentIndustries = filters.industries || []
    if (currentIndustries.includes(industryId)) {
      setFilters({
        industries: currentIndustries.filter((id) => id !== industryId),
      })
    } else {
      setFilters({
        industries: [...currentIndustries, industryId],
      })
    }
  }

  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
      <h2 className="text-lg font-semibold mb-3">Filter</h2>
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-medium mb-2">Branchen</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {industries.map((industry) => {
              const isSelected = filters.industries?.includes(industry.id) ?? false
              return (
                <label
                  key={industry.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleIndustry(industry.id)}
                    className="rounded"
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: industry.color }}
                  />
                  <span className="text-sm">{industry.name}</span>
                </label>
              )
            })}
          </div>
        </div>
        {filters.industries && filters.industries.length > 0 && (
          <button
            onClick={() => setFilters({ industries: [] })}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
          >
            Alle zurücksetzen
          </button>
        )}
      </div>
    </div>
  )
}
