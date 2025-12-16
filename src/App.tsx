import Header from './components/Header'
import RadarSection from './components/RadarSection'
import ExplanationSection from './components/ExplanationSection'

function App() {
  return (
    <div className="min-h-screen bg-apple-gray-50 dark:bg-[#1a1a1a] transition-colors duration-200">
      <Header />
      <RadarSection />
      <ExplanationSection />
    </div>
  )
}

export default App
