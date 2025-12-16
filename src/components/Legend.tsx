import industriesData from '../data/industries.json'
import type { Industry } from '../types/signal'

export default function Legend() {
  const industries = industriesData as Industry[]

  return (
    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
      <h3 className="text-sm font-semibold mb-3">Legende</h3>
      <div className="space-y-3 text-xs">
        <div>
          <h4 className="font-medium mb-2">Branchen-Farben</h4>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {industries.map((industry) => (
              <div key={industry.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: industry.color }}
                />
                <span>{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
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
              <span className="font-medium">Y-Achse:</span> Zeithorizont / Reifegrad
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
    </div>
  )
}
