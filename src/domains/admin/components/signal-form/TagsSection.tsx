import { TagsInput } from '../../../../shared/components/forms'

interface TagsSectionProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  disabled?: boolean
}

/**
 * Tags management section
 * Uses TagsInput component
 */
export function TagsSection({ tags, onTagsChange, disabled = false }: TagsSectionProps) {
  return <TagsInput tags={tags} onTagsChange={onTagsChange} disabled={disabled} />
}
