import { useState, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from './Label'
import { Input } from './Input'
import { Button } from '../ui/Button'

interface TagsInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  disabled?: boolean
  className?: string
}

/**
 * Reusable tag management component
 * Displays tags as chips
 * Input field to add tags
 * X button to remove tags
 */
export function TagsInput({
  tags,
  onTagsChange,
  disabled = false,
  className = '',
}: TagsInputProps) {
  const { t } = useTranslation()
  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className={className}>
      <Label>{t('admin.form.tags')}</Label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                disabled={disabled}
                className="hover:text-blue-600 dark:hover:text-blue-400"
                aria-label="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('admin.form.addTag')}
          disabled={disabled}
          className="flex-1"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={addTag}
          disabled={disabled || !newTag.trim()}
        >
          {t('admin.form.addTag')}
        </Button>
      </div>
    </div>
  )
}
