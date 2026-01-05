import { lazy, Suspense } from 'react'
import Header from './domains/layout/components/Header'
import { ErrorBoundary } from './shared/components/ErrorBoundary'
import { LoadingSpinner } from './shared/components/ui'

// Lazy load heavy components for better code splitting
const RadarSection = lazy(() => import('./domains/radar/components/RadarSection'))
const ExplanationSection = lazy(() => import('./domains/explanation/components/ExplanationSection'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200">
      <ErrorBoundary domain="Layout">
        <Header />
      </ErrorBoundary>
      <ErrorBoundary domain="Radar">
        <Suspense fallback={<LoadingFallback />}>
          <RadarSection />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary domain="Explanation">
        <Suspense fallback={<LoadingFallback />}>
          <ExplanationSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
