import { useTranslation } from 'react-i18next'
import type {
  ValueDimensions,
  ValueDimensionsJustification,
} from '../../../../types/signal'

interface ValueDimensionsDisplayProps {
  valueDimensions: ValueDimensions
  valueDimensionsJustification?: ValueDimensionsJustification
}

/**
 * Value dimensions display component
 */
export function ValueDimensionsDisplay({
  valueDimensions,
  valueDimensionsJustification,
}: ValueDimensionsDisplayProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language === 'de' ? 'de' : 'en'

  const dimensions = [
    { key: 'economic' as const, label: t('signalDetails.economic') },
    { key: 'social' as const, label: t('signalDetails.social') },
    { key: 'subjective' as const, label: t('signalDetails.subjective') },
    { key: 'political' as const, label: t('signalDetails.political') },
  ]

  return (
    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
      <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
        {t('signalDetails.valueDimensions')}
      </h4>
      <div className="space-y-2 text-xs mb-4">
        {dimensions.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[80px]">
              {label}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {valueDimensions[key]}
            </span>
          </div>
        ))}
      </div>

      {/* Justification Section */}
      {valueDimensionsJustification && (
        <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
          <h5 className="font-medium mb-3 text-sm text-gray-900 dark:text-gray-100">
            {t('signalDetails.justification')}
          </h5>

          {valueDimensionsJustification.mode === 'freetext' &&
            valueDimensionsJustification.freetext && (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p className="whitespace-pre-wrap">
                  {valueDimensionsJustification.freetext[currentLanguage] ||
                    valueDimensionsJustification.freetext.de ||
                    valueDimensionsJustification.freetext.en}
                </p>
              </div>
            )}

          {valueDimensionsJustification.mode === 'perDimension' &&
            valueDimensionsJustification.perDimension && (
              <div className="space-y-4">
                {dimensions.map(({ key, label }) => {
                  const dimJustification =
                    valueDimensionsJustification.perDimension![key]
                  const justificationText =
                    dimJustification.text[currentLanguage] ||
                    dimJustification.text.de ||
                    dimJustification.text.en

                  if (
                    !justificationText &&
                    dimJustification.sources.length === 0
                  ) {
                    return null
                  }

                  return (
                    <div key={key} className="space-y-2">
                      <h6 className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {label}
                      </h6>
                      {justificationText && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {justificationText}
                        </p>
                      )}
                      {dimJustification.sources.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {t('signalDetails.sources')}:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            {dimJustification.sources.map((source, index) => (
                              <li key={index}>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {source.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      )}
    </div>
  )
}
