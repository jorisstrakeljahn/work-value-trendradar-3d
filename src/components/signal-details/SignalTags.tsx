import { useTranslation } from 'react-i18next'
import { Tag } from '../../shared/components/ui'

interface SignalTagsProps {
  tags: string[]
}

/**
 * Signal tags display component
 */
export function SignalTags({ tags }: SignalTagsProps) {
  const { t } = useTranslation()

  if (tags.length === 0) return null

  return (
    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
      <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
        {t('signalDetails.tags')}
      </h4>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  )
}
