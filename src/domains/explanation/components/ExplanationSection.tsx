import { useTranslation } from 'react-i18next'
import { DimensionCard } from './DimensionCard'
import { StepCard } from './StepCard'

export default function ExplanationSection() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-white dark:bg-[#1a1a1a] py-20 px-6 pt-32">
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
              <DimensionCard
                title={t('explanation.xAxisTitle')}
                description={t('explanation.xAxisDesc')}
                borderColor="border-blue-500 dark:border-blue-400"
              />

              <DimensionCard
                title={t('explanation.yAxisTitle')}
                description={t('explanation.yAxisDesc')}
                borderColor="border-green-500 dark:border-green-400"
              >
                <li>
                  • <strong>{t('explanation.yAxisNow')}</strong>
                </li>
                <li>
                  • <strong>{t('explanation.yAxisNext')}</strong>
                </li>
                <li>
                  • <strong>{t('explanation.yAxisFar')}</strong>
                </li>
              </DimensionCard>

              <DimensionCard
                title={t('explanation.zAxisTitle')}
                description={t('explanation.zAxisDesc')}
                borderColor="border-purple-500 dark:border-purple-400"
              >
                <li>
                  • <strong>{t('explanation.zAxisEconomic')}</strong>
                </li>
                <li>
                  • <strong>{t('explanation.zAxisSocial')}</strong>
                </li>
                <li>
                  • <strong>{t('explanation.zAxisSubjective')}</strong>
                </li>
                <li>
                  • <strong>{t('explanation.zAxisPolitical')}</strong>
                </li>
              </DimensionCard>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.workValueCalculation')}
            </h3>
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('explanation.workValueCalcDesc1')}
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    {t('explanation.workValueCalcEconomic')}
                  </strong>{' '}
                  {t('explanation.workValueCalcEconomicDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    {t('explanation.workValueCalcSocial')}
                  </strong>{' '}
                  {t('explanation.workValueCalcSocialDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    {t('explanation.workValueCalcSubjective')}
                  </strong>{' '}
                  {t('explanation.workValueCalcSubjectiveDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-gray-100">
                    {t('explanation.workValueCalcPolitical')}
                  </strong>{' '}
                  {t('explanation.workValueCalcPoliticalDesc')}
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                {t('explanation.workValueCalcDesc2')}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.howToUse')}
            </h3>
            <div className="space-y-4">
              <StepCard stepNumber={1}>{t('explanation.step1')}</StepCard>
              <StepCard stepNumber={2}>{t('explanation.step2')}</StepCard>
              <StepCard stepNumber={3}>{t('explanation.step3')}</StepCard>
              <StepCard stepNumber={4}>{t('explanation.step4')}</StepCard>
              <StepCard stepNumber={5}>{t('explanation.step5')}</StepCard>
              <StepCard stepNumber={6}>{t('explanation.step6')}</StepCard>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.controlPanels')}
            </h3>
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('explanation.controlPanelsDesc')}
              </p>
              <div className="space-y-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    {t('explanation.controlPanelsFilterLabel')}:
                  </strong>{' '}
                  {t('explanation.controlPanelsFilterDesc')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    {t('explanation.controlPanelsWeightsLabel')}:
                  </strong>{' '}
                  {t('explanation.controlPanelsWeightsDesc')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    {t('explanation.controlPanelsDisplayLabel')}:
                  </strong>{' '}
                  {t('explanation.controlPanelsDisplayDesc')}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                    {t('explanation.controlPanelsLegendLabel')}:
                  </strong>{' '}
                  {t('explanation.controlPanelsLegendDesc')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('explanation.visualElements')}
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.colorCodingLabel')}:
                </strong>{' '}
                {t('explanation.colorCodingDesc')}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.pointSizeLabel')}:
                </strong>{' '}
                {t('explanation.pointSizeDesc')}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.selectionLabel')}:
                </strong>{' '}
                {t('explanation.selectionDesc')}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.signalWindowsLabel')}:
                </strong>{' '}
                {t('explanation.signalWindowsDesc')}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.gridSystemLabel')}:
                </strong>{' '}
                {t('explanation.gridSystemDesc')}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-gray-100 font-semibold">
                  {t('explanation.thematicSegmentsLabel')}:
                </strong>{' '}
                {t('explanation.thematicSegmentsDesc')}
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
