import { useTranslation } from 'react-i18next'

/**
 * Maturity scale table component displaying the rating scale (0-100)
 * for the Maturity/Time Horizon dimension
 */
export default function MaturityScaleTable() {
  const { t } = useTranslation()

  const ranges = [
    { range: '0-20', key: 'maturityScale0' },
    { range: '21-40', key: 'maturityScale20' },
    { range: '41-60', key: 'maturityScale40' },
    { range: '61-80', key: 'maturityScale60' },
    { range: '81-100', key: 'maturityScale80' },
  ]

  return (
    <div className="w-full">
      <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <colgroup>
          <col className="w-24" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] border-r border-gray-200 dark:border-gray-700"
            >
              {t('explanation.relevanceScaleRange')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#252525]"
            >
              {t('explanation.ratingScaleDescription')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#1a1a1a]">
          {ranges.map(({ range, key }) => (
            <tr
              key={range}
              className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors duration-150"
            >
              <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-700 text-center">
                {range}
              </td>
              <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t(`explanation.${key}`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
