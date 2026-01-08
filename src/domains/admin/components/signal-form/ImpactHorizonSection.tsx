import { useTranslation } from 'react-i18next'
import {
  RangeSlider,
  MultilingualTextarea,
  SourcesInput,
} from '../../../../shared/components/forms'
import type {
  ImpactHorizonJustification,
  Source,
} from '../../../../types/signal'

interface ImpactHorizonSectionProps {
  xImpact: number
  yHorizon: number
  onXImpactChange: (value: number) => void
  onYHorizonChange: (value: number) => void
  xImpactJustification?: ImpactHorizonJustification
  yHorizonJustification?: ImpactHorizonJustification
  onXImpactJustificationChange?: (
    justification: ImpactHorizonJustification
  ) => void
  onYHorizonJustificationChange?: (
    justification: ImpactHorizonJustification
  ) => void
  disabled?: boolean
}

/**
 * Impact & Horizon section with range sliders and justifications
 * Uses RangeSlider, MultilingualTextarea, and SourcesInput components
 */
export function ImpactHorizonSection({
  xImpact,
  yHorizon,
  onXImpactChange,
  onYHorizonChange,
  xImpactJustification,
  yHorizonJustification,
  onXImpactJustificationChange,
  onYHorizonJustificationChange,
  disabled = false,
}: ImpactHorizonSectionProps) {
  const { t } = useTranslation()

  const handleXImpactTextChange = (field: 'de' | 'en', value: string) => {
    if (!onXImpactJustificationChange) return
    const currentJustification = xImpactJustification || {
      text: { de: '', en: '' },
      sources: [],
    }
    onXImpactJustificationChange({
      ...currentJustification,
      text: {
        ...currentJustification.text,
        [field]: value,
      },
    })
  }

  const handleXImpactSourcesChange = (sources: Source[]) => {
    if (!onXImpactJustificationChange) return
    const currentJustification = xImpactJustification || {
      text: { de: '', en: '' },
      sources: [],
    }
    onXImpactJustificationChange({
      ...currentJustification,
      sources,
    })
  }

  const handleYHorizonTextChange = (field: 'de' | 'en', value: string) => {
    if (!onYHorizonJustificationChange) return
    const currentJustification = yHorizonJustification || {
      text: { de: '', en: '' },
      sources: [],
    }
    onYHorizonJustificationChange({
      ...currentJustification,
      text: {
        ...currentJustification.text,
        [field]: value,
      },
    })
  }

  const handleYHorizonSourcesChange = (sources: Source[]) => {
    if (!onYHorizonJustificationChange) return
    const currentJustification = yHorizonJustification || {
      text: { de: '', en: '' },
      sources: [],
    }
    onYHorizonJustificationChange({
      ...currentJustification,
      sources,
    })
  }

  return (
    <div className="space-y-6">
      {/* Range Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <RangeSlider
          label={t('admin.form.xImpact')}
          value={xImpact}
          min={0}
          max={100}
          onChange={e => onXImpactChange(Number(e.target.value))}
          disabled={disabled}
        />
        <RangeSlider
          label={t('admin.form.yHorizon')}
          value={yHorizon}
          min={0}
          max={100}
          onChange={e => onYHorizonChange(Number(e.target.value))}
          disabled={disabled}
        />
      </div>

      {/* Impact Justification */}
      {onXImpactJustificationChange && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('admin.form.xImpactJustification')}
          </h4>
          <MultilingualTextarea
            labelDe={t('admin.form.xImpactJustificationDe')}
            labelEn={t('admin.form.xImpactJustificationEn')}
            valueDe={xImpactJustification?.text.de || ''}
            valueEn={xImpactJustification?.text.en || ''}
            onChangeDe={value => handleXImpactTextChange('de', value)}
            onChangeEn={value => handleXImpactTextChange('en', value)}
            rows={4}
            disabled={disabled}
          />
          <SourcesInput
            sources={xImpactJustification?.sources || []}
            onSourcesChange={handleXImpactSourcesChange}
            disabled={disabled}
          />
        </div>
      )}

      {/* Horizon Justification */}
      {onYHorizonJustificationChange && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('admin.form.yHorizonJustification')}
          </h4>
          <MultilingualTextarea
            labelDe={t('admin.form.yHorizonJustificationDe')}
            labelEn={t('admin.form.yHorizonJustificationEn')}
            valueDe={yHorizonJustification?.text.de || ''}
            valueEn={yHorizonJustification?.text.en || ''}
            onChangeDe={value => handleYHorizonTextChange('de', value)}
            onChangeEn={value => handleYHorizonTextChange('en', value)}
            rows={4}
            disabled={disabled}
          />
          <SourcesInput
            sources={yHorizonJustification?.sources || []}
            onSourcesChange={handleYHorizonSourcesChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
