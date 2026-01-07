import { useTranslation } from 'react-i18next'

/**
 * Rating scale table component displaying the detailed rating scale (0-5)
 * for all four value dimensions (Economic, Social, Subjective, Political)
 */
export default function RatingScaleTable() {
  const { t } = useTranslation()

  const ratingValues: (0 | 1 | 2 | 3 | 4 | 5)[] = [0, 1, 2, 3, 4, 5]
  const dimensions = [
    { key: 'economic', label: t('explanation.ratingScaleEconomic') },
    { key: 'social', label: t('explanation.ratingScaleSocial') },
    { key: 'subjective', label: t('explanation.ratingScaleSubjective') },
    { key: 'political', label: t('explanation.ratingScalePolitical') },
  ] as const

  return (
    <div className="w-full">
      <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <colgroup>
          <col className="w-16" />
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
          <col className="w-1/4" />
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] border-r border-gray-200 dark:border-gray-700"
            >
              {t('explanation.ratingScaleValue')}
            </th>
            {dimensions.map(dimension => (
              <th
                key={dimension.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#252525]"
              >
                {dimension.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#1a1a1a]">
          {ratingValues.map(value => (
            <tr
              key={value}
              className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors duration-150"
            >
              <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-700">
                {value}
              </td>
              {dimensions.map(dimension => {
                const translationKey = `explanation.ratingScale${value}${dimension.key.charAt(0).toUpperCase() + dimension.key.slice(1)}`
                return (
                  <td
                    key={`${value}-${dimension.key}`}
                    className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    {t(translationKey)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
