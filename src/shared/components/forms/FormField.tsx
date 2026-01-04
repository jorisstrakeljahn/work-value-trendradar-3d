import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Label } from './Label'
import { Input } from './Input'
import { Textarea } from './Textarea'

interface BaseFormFieldProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

interface InputFormFieldProps
  extends
    BaseFormFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type: 'input'
  inputType?: string
  multiline?: false
}

interface TextareaFormFieldProps
  extends BaseFormFieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  type: 'textarea'
  multiline: true
}

type FormFieldProps = InputFormFieldProps | TextareaFormFieldProps

/**
 * Wrapper component that combines Label + Input/Textarea + Error display
 * Reduces boilerplate in forms
 */
export function FormField(props: FormFieldProps) {
  const {
    label,
    error,
    required,
    disabled,
    className = '',
    ...inputProps
  } = props

  const fieldId =
    (inputProps as InputHTMLAttributes<HTMLInputElement>).id ||
    (inputProps as InputHTMLAttributes<HTMLInputElement>).name ||
    `field-${Math.random().toString(36).substr(2, 9)}`

  const fieldElement =
    props.type === 'textarea' ? (
      <Textarea
        id={fieldId}
        error={!!error}
        disabled={disabled}
        {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
      <Input
        id={fieldId}
        type={
          props.type === 'input' && 'inputType' in props
            ? props.inputType || 'text'
            : 'text'
        }
        error={!!error}
        disabled={disabled}
        {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
      />
    )

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      {fieldElement}
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
