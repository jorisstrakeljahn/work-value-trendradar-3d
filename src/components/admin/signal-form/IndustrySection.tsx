import { IndustrySelector } from '../../../shared/components/forms'
import { useIndustries } from '../../../shared/hooks/useIndustries'

interface IndustrySectionProps {
  selectedIndustryIds: string[]
  onSelectionChange: (industryIds: string[]) => void
  disabled?: boolean
}

/**
 * Industry tags selection section
 * Uses IndustrySelector component
 */
export function IndustrySection({
  selectedIndustryIds,
  onSelectionChange,
  disabled = false,
}: IndustrySectionProps) {
  const industries = useIndustries()

  return (
    <IndustrySelector
      industries={industries}
      selectedIndustryIds={selectedIndustryIds}
      onSelectionChange={onSelectionChange}
      disabled={disabled}
    />
  )
}
