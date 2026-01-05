/**
 * Type definitions for form components and data structures
 */

import type {
  ValueDimensions,
  Source,
  ValueDimensionsJustification,
} from './signal'

/**
 * Form data structure for signal forms
 */
export interface SignalFormData {
  titleDe: string
  titleEn: string
  summaryDe: string
  summaryEn: string
  industryTags: string[]
  xImpact: number
  yHorizon: number
  valueDimensions: ValueDimensions
  valueDimensionsJustification?: ValueDimensionsJustification
  sources: Source[]
  imageUrl: string | null
}

/**
 * Generic type for multilingual form data
 */
export type MultilingualFormData<T> = {
  [K in keyof T]: T[K] extends string
    ? { de: string; en: string }
    : T[K] extends string | undefined
      ? { de: string; en: string } | undefined
      : T[K]
}

/**
 * Base props for form field components
 */
export interface BaseFormFieldProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Input field props
 */
export interface InputProps extends BaseFormFieldProps {
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (value: string) => void
}

/**
 * Form field variant types
 */
export type FormFieldVariant = 'default' | 'error'

/**
 * Dropdown position types
 */
export type DropdownPosition = 'top' | 'bottom' | 'left' | 'right'

/**
 * Dropdown alignment types
 */
export type DropdownAlign = 'start' | 'end' | 'center'
