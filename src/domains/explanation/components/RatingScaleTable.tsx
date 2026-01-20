import { useTranslation } from 'react-i18next'

/**
 * Single dimension rating scale table component
 */
function DimensionTable({
  dimensionKey,
  label,
  borderColor,
}: {
  dimensionKey: 'economic' | 'social' | 'subjective' | 'political'
  label: string
  borderColor: string
}) {
  const { t } = useTranslation()
  const ratingValues: (0 | 1 | 2 | 3 | 4 | 5)[] = [0, 1, 2, 3, 4, 5]

  return (
    <div className="space-y-3">
      <h4
        className={`text-lg font-semibold text-gray-900 dark:text-gray-100 pl-4 border-l-4 ${borderColor}`}
      >
        {label}
      </h4>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <colgroup>
            <col className="w-16" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#252525] border-r border-gray-200 dark:border-gray-700"
              >
                {t('explanation.ratingScaleValue')}
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
            {ratingValues.map(value => {
              const translationKey = `explanation.ratingScale${value}${dimensionKey.charAt(0).toUpperCase() + dimensionKey.slice(1)}`
              return (
                <tr
                  key={value}
                  className="hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors duration-150"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-700 text-center">
                    {value}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(translationKey)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Rating scale tables component displaying four separate tables
 * for all four value dimensions (Economic, Social, Subjective, Political)
 */
export default function RatingScaleTable() {
  const { t } = useTranslation()

  const dimensions = [
    {
      key: 'economic' as const,
      label: t('explanation.ratingScaleEconomic'),
      borderColor: 'border-emerald-500 dark:border-emerald-400',
    },
    {
      key: 'social' as const,
      label: t('explanation.ratingScaleSocial'),
      borderColor: 'border-blue-500 dark:border-blue-400',
    },
    {
      key: 'subjective' as const,
      label: t('explanation.ratingScaleSubjective'),
      borderColor: 'border-amber-500 dark:border-amber-400',
    },
    {
      key: 'political' as const,
      label: t('explanation.ratingScalePolitical'),
      borderColor: 'border-rose-500 dark:border-rose-400',
    },
  ]

  return (
    <div className="space-y-8">
      {dimensions.map(dimension => (
        <DimensionTable
          key={dimension.key}
          dimensionKey={dimension.key}
          label={dimension.label}
          borderColor={dimension.borderColor}
        />
      ))}
    </div>
  )
}
