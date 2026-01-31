/**
 * Reusable Button — primary, secondary, danger, ghost. Big tap targets, clear states.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-[var(--radius)] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]'
  const variants = {
    primary:
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm',
    success:
      'bg-[var(--color-success)] text-white hover:opacity-90 shadow-sm',
    secondary:
      'bg-white border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-50',
    danger:
      'bg-white border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-[var(--color-danger-light)]',
    ghost:
      'bg-transparent text-[var(--color-text-muted)] hover:bg-gray-100',
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Saving...
        </>
      ) : (
        children
      )}
    </button>
  )
}
