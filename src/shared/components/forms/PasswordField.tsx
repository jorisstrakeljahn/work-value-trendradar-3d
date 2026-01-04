import { useState, InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Label } from './Label'
import { Input } from './Input'

interface PasswordFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Password input field with show/hide toggle button
 * Displays an eye icon that toggles password visibility
 */
export function PasswordField({
  label,
  error,
  required,
  disabled,
  className = '',
  value,
  onChange,
  placeholder,
  ...inputProps
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const fieldId =
    inputProps.id ||
    inputProps.name ||
    `password-${Math.random().toString(36).substr(2, 9)}`

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          disabled={disabled}
          className="pr-10"
          {...inputProps}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
