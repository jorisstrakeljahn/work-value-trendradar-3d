import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from '../ui/Button'
import type { Source } from '../../../types/signal'

interface SourcesInputProps {
  sources: Source[]
  onSourcesChange: (sources: Source[]) => void
  disabled?: boolean
  className?: string
}

/**
 * Reusable source management component
 * List of sources (Name + URL)
 * Input fields to add sources
 * Remove button for each source
 * Automatically saves pending source when URL field loses focus (onBlur)
 */
export function SourcesInput({
  sources,
  onSourcesChange,
  disabled = false,
  className = '',
}: SourcesInputProps) {
  const { t } = useTranslation()
  const [sourceName, setSourceName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const urlInputRef = useRef<HTMLInputElement>(null)

  const addSource = () => {
    const trimmedName = sourceName.trim()
    const trimmedUrl = sourceUrl.trim()
    if (trimmedName && trimmedUrl) {
      // Check if source already exists
      const sourceExists = sources.some(
        s => s.name === trimmedName && s.url === trimmedUrl
      )

      if (!sourceExists) {
        onSourcesChange([...sources, { name: trimmedName, url: trimmedUrl }])
        setSourceName('')
        setSourceUrl('')
      }
    }
  }

  // Auto-add source when URL field loses focus (if both fields are filled)
  // This ensures that if user fills in both fields and clicks away or submits,
  // the source is automatically saved
  const handleUrlBlur = () => {
    const trimmedName = sourceName.trim()
    const trimmedUrl = sourceUrl.trim()

    // Only auto-add if both fields have values
    if (trimmedName && trimmedUrl) {
      // Check if source already exists
      const sourceExists = sources.some(
        s => s.name === trimmedName && s.url === trimmedUrl
      )

      if (!sourceExists) {
        onSourcesChange([...sources, { name: trimmedName, url: trimmedUrl }])
        setSourceName('')
        setSourceUrl('')
      }
    }
  }

  // Button is only enabled when both fields are filled
  const canAddSource =
    sourceName.trim().length > 0 && sourceUrl.trim().length > 0

  const removeSource = (index: number) => {
    onSourcesChange(sources.filter((_, i) => i !== index))
  }

  const updateSource = (
    index: number,
    field: 'name' | 'url',
    value: string
  ) => {
    const updatedSources = sources.map((source, i) =>
      i === index ? { ...source, [field]: value } : source
    )
    onSourcesChange(updatedSources)
  }

  return (
    <div className={className}>
      <Label>{t('admin.form.sources')}</Label>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                type="text"
                value={source.name}
                onChange={e => updateSource(index, 'name', e.target.value)}
                disabled={disabled}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
              <Input
                type="url"
                value={source.url}
                onChange={e => updateSource(index, 'url', e.target.value)}
                disabled={disabled}
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => removeSource(index)}
              disabled={disabled}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {t('admin.form.removeSource')}
            </Button>
          </div>
        ))}
        <div className="flex gap-2">
          <Input
            type="text"
            value={sourceName}
            onChange={e => setSourceName(e.target.value)}
            placeholder={t('admin.form.sourceName')}
            disabled={disabled}
            className="flex-1"
          />
          <Input
            ref={urlInputRef}
            type="url"
            value={sourceUrl}
            onChange={e => setSourceUrl(e.target.value)}
            onBlur={handleUrlBlur}
            placeholder={t('admin.form.sourceUrl')}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addSource}
            disabled={disabled || !canAddSource}
          >
            {t('admin.form.addSource')}
          </Button>
        </div>
      </div>
    </div>
  )
}
