/**
 * Input — label + field. Readable, big tap target. Optional error.
 */
export function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  const id = props.id || props.name || `input-${Math.random().toString(36).slice(2)}`
  const inputClass =
    'w-full px-4 py-3 text-base bg-white border-2 rounded-[var(--radius)] min-h-[44px] outline-none transition-colors text-[var(--color-text)] placeholder:text-gray-400 ' +
    (error
      ? 'border-[var(--color-danger)] focus:ring-2 focus:ring-red-200 focus:border-[var(--color-danger)]'
      : 'border-gray-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]')

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <input id={id} type={type} className={inputClass} {...props} />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  )
}

export function Select({ label, options, className = '', ...props }) {
  const id = props.id || props.name || `select-${Math.random().toString(36).slice(2)}`
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={id}
        className="w-full px-4 py-3 text-base bg-white border-2 border-gray-300 rounded-[var(--radius)] min-h-[44px] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] text-[var(--color-text)]"
        {...props}
      >
        {options.map((opt) =>
          typeof opt === 'object' ? (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ) : (
            <option key={opt} value={opt}>{opt}</option>
          )
        )}
      </select>
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }) {
  const id = props.id || props.name || `textarea-${Math.random().toString(36).slice(2)}`
  const inputClass =
    'w-full px-4 py-3 text-base bg-white border-2 rounded-[var(--radius)] outline-none transition-colors resize-y min-h-[80px] text-[var(--color-text)] placeholder:text-gray-400 ' +
    (error
      ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-2 focus:ring-red-200'
      : 'border-gray-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]')
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
          {label}
        </label>
      )}
      <textarea id={id} className={inputClass} {...props} />
      {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
