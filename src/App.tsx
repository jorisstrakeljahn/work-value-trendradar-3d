import Header from './domains/layout/components/Header'
import RadarSection from './domains/radar/components/RadarSection'
import ExplanationSection from './domains/explanation/components/ExplanationSection'
import { ErrorBoundary } from './shared/components/ErrorBoundary'

function App() {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200">
      <ErrorBoundary domain="Layout">
        <Header />
      </ErrorBoundary>
      <ErrorBoundary domain="Radar">
        <RadarSection />
      </ErrorBoundary>
      <ErrorBoundary domain="Explanation">
        <ExplanationSection />
      </ErrorBoundary>
    </div>
  )
}

export default App
