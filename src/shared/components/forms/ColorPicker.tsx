import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Input } from './Input'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

/**
 * Reusable color picker component
 * Combines native color input + hex text input + preview
 */
export function ColorPicker({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}: ColorPickerProps) {
  const { t } = useTranslation()

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-20 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="#3B82F6"
            className="font-mono text-sm"
            disabled={disabled}
            pattern="^#[0-9A-Fa-f]{6}$"
            title={t('admin.industries.colorFormat')}
          />
        </div>
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
          style={{ backgroundColor: value }}
          aria-label={t('admin.industries.colorPreview')}
        />
      </div>
    </div>
  )
}
