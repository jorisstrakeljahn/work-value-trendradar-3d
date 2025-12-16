export default function ExplanationSection() {
  return (
    <section className="w-full bg-white dark:bg-[#1a1a1a] py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Understanding the 3D Trend Radar
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            This interactive 3D visualization maps weak signals of AI and robotics
            technologies and their potential impact on the value of work across
            different industries. Each point represents a trend or signal, positioned
            in three-dimensional space based on its characteristics.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              The Three Dimensions
            </h3>
            <div className="space-y-6">
              <div className="pl-6 border-l-4 border-blue-500 dark:border-blue-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  X-Axis: Impact / Relevance
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Measures how significant the impact of this trend is on the industry.
                  Points further to the right indicate higher impact and relevance.
                  This dimension helps identify which signals are most likely to
                  transform work practices.
                </p>
              </div>

              <div className="pl-6 border-l-4 border-green-500 dark:border-green-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Y-Axis: Time Horizon / Maturity
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Represents the temporal dimension of the trend. The center of the
                  radar represents trends happening now, while the outer rings
                  represent future developments. This radial mapping follows the
                  classic trend radar pattern, making it intuitive to understand
                  when trends might materialize.
                </p>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• <strong>Center (Now):</strong> Current trends and technologies</li>
                  <li>• <strong>Middle Ring (Next):</strong> Near-term developments (1-3 years)</li>
                  <li>• <strong>Outer Ring (Far):</strong> Long-term future trends (3+ years)</li>
                </ul>
              </div>

              <div className="pl-6 border-l-4 border-purple-500 dark:border-purple-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Z-Axis: Work Value Index
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The height of each point indicates how the trend affects the value
                  of work. Higher points represent trends that increase work value,
                  while lower points indicate trends with less positive impact or
                  potential devaluation. This index is calculated from four
                  sub-dimensions:
                </p>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• <strong>Economic:</strong> Financial value and compensation</li>
                  <li>• <strong>Social:</strong> Social recognition and status</li>
                  <li>• <strong>Subjective:</strong> Personal fulfillment and meaning</li>
                  <li>• <strong>Political:</strong> Influence and decision-making power</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How to Use the Radar
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Explore:</strong> Use your mouse
                  to rotate, zoom, and pan the 3D radar. Click and drag to rotate,
                  scroll to zoom, and right-click drag to pan.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Filter:</strong> Use the filter
                  panel in the top-left to show or hide trends by industry. This
                  helps you focus on specific sectors and compare how trends affect
                  different industries.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Hover:</strong> Move your mouse
                  over any point to see a quick preview of the trend's title and
                  associated industries.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">4</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Click:</strong> Click on any
                  point to see detailed information about the trend, including its
                  full description, impact scores, confidence level, and value
                  dimensions breakdown.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">5</span>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-gray-100">Reset:</strong> Use the "Reset
                  View" button in the top-right of the radar to return to the
                  default camera position.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Understanding the Visual Elements
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Color Coding:</strong> Each point
                is colored according to its primary industry. This allows you to
                quickly identify which sectors are most affected by specific trends.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Point Size:</strong> The size of
                each point reflects its impact level. Larger points indicate trends
                with higher impact on work value.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Selection:</strong> When you
                click on a point, it becomes highlighted with a yellow glow, making
                it easy to track which trend you're currently examining.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100">Thematic Segments:</strong> The
                radar is divided into segments that represent different thematic
                clusters, helping you understand how trends relate to each other.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              About This Project
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This 3D Trend Radar is designed to help researchers, policymakers, and
              industry professionals understand how emerging AI and robotics
              technologies might reshape the value of work. By visualizing weak signals
              in three dimensions, we can better anticipate future changes and prepare
              for the evolving landscape of work.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              The data presented here represents a curated collection of trends and
              signals observed across multiple industries. Each signal is evaluated
              based on its potential impact, time horizon, and effect on work value
              across economic, social, subjective, and political dimensions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

