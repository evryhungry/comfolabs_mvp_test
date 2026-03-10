interface BaseInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  type?: string
}

export default function BaseInput({ value, onChange, placeholder, label, error, type = 'text' }: BaseInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[0.8125rem] font-semibold text-text-secondary">{label}</label>}
      <input
        className={`py-2.5 px-3.5 border rounded-[var(--radius-md)] text-sm text-text bg-surface transition-all duration-200 outline-none placeholder:text-text-muted ${
          error
            ? 'border-danger focus:shadow-[0_0_0_3px_var(--color-danger-light)]'
            : 'border-border focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]'
        }`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  )
}
