import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  label: string
  registration: UseFormRegisterReturn
  error?: FieldError
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

export default function FormSelect({
  label,
  registration,
  error,
  options,
  placeholder = 'Select',
  required = true,
}: Props) {
  return (
    <>
      <label className="form-select-label form-label fw-medium">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <select className={`form-select ${error ? 'is-invalid' : ''}`} {...registration} >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="field-error">{error.message}</span>
      )}
    </>
  )
}