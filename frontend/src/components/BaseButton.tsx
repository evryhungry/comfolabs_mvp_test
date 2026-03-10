interface BaseButtonProps {
  label: string
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  onClick?: () => void
}

export default function BaseButton({ label, disabled, variant = 'primary', size = 'md', loading, onClick }: BaseButtonProps) {
  const sizeClasses = {
    sm: 'py-1.5 px-3.5 text-[0.8125rem] rounded-[var(--radius-sm)]',
    md: 'py-2.5 px-5 text-sm rounded-[var(--radius-md)]',
    lg: 'py-3.5 px-7 text-base rounded-[var(--radius-md)]',
  }[size]

  const variantClasses = {
    primary: 'bg-primary text-white border-primary hover:bg-primary-hover hover:border-primary-hover hover:shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:-translate-y-px active:translate-y-0 active:shadow-none',
    secondary: 'bg-surface text-text border-border hover:bg-bg hover:border-text-muted',
    danger: 'bg-danger text-white border-danger hover:bg-[#dc2626] hover:shadow-[0_4px_14px_rgba(239,68,68,0.35)] hover:-translate-y-px active:translate-y-0 active:shadow-none',
    ghost: 'bg-transparent text-text-secondary border-transparent hover:bg-bg hover:text-text',
  }[variant]

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 border font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer relative overflow-hidden ${sizeClasses} ${variantClasses} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />}
      <span className={loading ? 'opacity-60' : ''}>{label}</span>
    </button>
  )
}
