import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
  type?: 'text' | 'email' | 'number' | 'date'
  placeholder?: string
  maxLength?: number
  min?: number
  max?: string
  step?: string
  disabled?: boolean
  hint?: string
  required?: boolean
}

export default function FormInput({
  label,
  registration,
  error,
  type = 'text',
  placeholder,
  maxLength,
  min,
  max,
  step,
  disabled = false,
  hint,
  required = true,
}: Props) {
  return (
    <>
      <label className="form-label fw-medium">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input type={type} placeholder={placeholder} maxLength={maxLength} min={min} max={max} step={step} disabled={disabled} className={`form-control ${error ? 'is-invalid' : ''} ${disabled ? 'readonly-input' : ''}`} {...registration}/>
      {hint && !error && (
        <div className="form-text text-muted">{hint}</div>
      )}
      {error && (
        <span className="field-error">{error.message}</span>
      )}
    </>
  )
}