import type { MultilingualText } from '../../../types/signal'

/**
 * Type guard to check if a value is a valid language code
 */
export function isLanguage(value: unknown): value is 'de' | 'en' {
  return value === 'de' || value === 'en'
}

/**
 * Type guard to check if a value is a MultilingualText object
 */
export function isMultilingualText(value: unknown): value is MultilingualText {
  return (
    typeof value === 'object' &&
    value !== null &&
    'de' in value &&
    'en' in value &&
    typeof (value as MultilingualText).de === 'string' &&
    typeof (value as MultilingualText).en === 'string'
  )
}

