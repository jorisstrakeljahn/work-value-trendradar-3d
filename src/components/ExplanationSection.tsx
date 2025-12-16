import { useTranslation } from 'react-i18next'

export default function ExplanationSection() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-white dark:bg-[#1a1a1a] py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {t('explanation.title')}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('explanation.intro')}
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.threeDimensions')}
            </h3>
            <div className="space-y-6">
              <div className="pl-6 border-l-4 border-blue-500 dark:border-blue-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('explanation.xAxisTitle')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('explanation.xAxisDesc')}
                </p>
              </div>

              <div className="pl-6 border-l-4 border-green-500 dark:border-green-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('explanation.yAxisTitle')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('explanation.yAxisDesc')}
                </p>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• <strong>{t('explanation.yAxisNow')}</strong></li>
                  <li>• <strong>{t('explanation.yAxisNext')}</strong></li>
                  <li>• <strong>{t('explanation.yAxisFar')}</strong></li>
                </ul>
              </div>

              <div className="pl-6 border-l-4 border-purple-500 dark:border-purple-400">
                <h4 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('explanation.zAxisTitle')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('explanation.zAxisDesc')}
                </p>
                <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                  <li>• <strong>{t('explanation.zAxisEconomic')}</strong></li>
                  <li>• <strong>{t('explanation.zAxisSocial')}</strong></li>
                  <li>• <strong>{t('explanation.zAxisSubjective')}</strong></li>
                  <li>• <strong>{t('explanation.zAxisPolitical')}</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.howToUse')}
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                </div>
                <div>
                  {t('explanation.step1')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">2</span>
                </div>
                <div>
                  {t('explanation.step2')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">3</span>
                </div>
                <div>
                  {t('explanation.step3')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">4</span>
                </div>
                <div>
                  {t('explanation.step4')}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">5</span>
                </div>
                <div>
                  {t('explanation.step5')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.visualElements')}
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                {t('explanation.colorCoding')}
              </p>
              <p>
                {t('explanation.pointSize')}
              </p>
              <p>
                {t('explanation.selection')}
              </p>
              <p>
                {t('explanation.thematicSegments')}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.about')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('explanation.aboutDesc1')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              {t('explanation.aboutDesc2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
