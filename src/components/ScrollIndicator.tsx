export default function ScrollIndicator() {
  const scrollToExplanation = () => {
    const explanationSection = document.querySelector('section:nth-of-type(2)')
    if (explanationSection) {
      explanationSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={scrollToExplanation}
        className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 group"
        aria-label="Scroll to explanation"
      >
        <span className="text-xs font-medium">Learn more</span>
        <svg
          className="w-6 h-6 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  )
}

