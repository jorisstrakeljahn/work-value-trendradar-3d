import { useTranslation } from 'react-i18next'
import { DimensionJustificationItem } from './DimensionJustificationItem'
import type {
  ValueDimensionsJustification,
  DimensionKey,
} from '../../../../types/signal'

interface PerDimensionJustificationInputProps {
  justification: ValueDimensionsJustification
  onDimensionTextChange: (
    dimension: DimensionKey,
    textDe: string,
    textEn: string
  ) => void
  onDimensionSourcesChange: (
    dimension: DimensionKey,
    sources: Array<{ name: string; url: string }>
  ) => void
  disabled?: boolean
}

/**
 * Per-dimension mode justification input
 * One justification per dimension with sources
 */
export function PerDimensionJustificationInput({
  justification,
  onDimensionTextChange,
  onDimensionSourcesChange,
  disabled = false,
}: PerDimensionJustificationInputProps) {
  const { t } = useTranslation()

  if (!justification.perDimension) {
    return null
  }

  const dimensions: DimensionKey[] = [
    'economic',
    'social',
    'subjective',
    'political',
  ]

  const dimensionLabels: Record<DimensionKey, { de: string; en: string }> = {
    economic: {
      de: t('admin.form.economic'),
      en: t('admin.form.economic'),
    },
    social: {
      de: t('admin.form.social'),
      en: t('admin.form.social'),
    },
    subjective: {
      de: t('admin.form.subjective'),
      en: t('admin.form.subjective'),
    },
    political: {
      de: t('admin.form.political'),
      en: t('admin.form.political'),
    },
  }

  return (
    <div className="space-y-6">
      {dimensions.map((dimension, index) => {
        const dimJustification = justification.perDimension![dimension]
        const label = dimensionLabels[dimension]

        return (
          <DimensionJustificationItem
            key={dimension}
            dimension={dimension}
            justification={dimJustification}
            label={label}
            onTextChange={(textDe, textEn) =>
              onDimensionTextChange(dimension, textDe, textEn)
            }
            onSourcesChange={sources =>
              onDimensionSourcesChange(dimension, sources)
            }
            disabled={disabled}
            isFirst={index === 0}
          />
        )
      })}
    </div>
  )
}

