import { useTranslation } from 'react-i18next'
import { RangeSlider } from '../../../shared/components/forms'

interface ImpactHorizonSectionProps {
  xImpact: number
  yHorizon: number
  onXImpactChange: (value: number) => void
  onYHorizonChange: (value: number) => void
  disabled?: boolean
}

/**
 * Impact & Horizon section with range sliders
 * Uses RangeSlider component
 */
export function ImpactHorizonSection({
  xImpact,
  yHorizon,
  onXImpactChange,
  onYHorizonChange,
  disabled = false,
}: ImpactHorizonSectionProps) {
  const { t } = useTranslation()

  return (
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
  )
}
