import { SourcesInput } from '../../../../shared/components/forms'
import type { Source } from '../../../../types/signal'

interface SourcesSectionProps {
  sources: Source[]
  onSourcesChange: (sources: Source[]) => void
  disabled?: boolean
}

/**
 * Sources management section
 * Uses SourcesInput component
 */
export function SourcesSection({
  sources,
  onSourcesChange,
  disabled = false,
}: SourcesSectionProps) {
  return <SourcesInput sources={sources} onSourcesChange={onSourcesChange} disabled={disabled} />
}
