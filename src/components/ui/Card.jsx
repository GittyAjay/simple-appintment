/**
 * Card — surface with subtle shadow, 8–12px radius. For summary blocks and list items.
 */
export function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm ${padding ? 'p-4 sm:p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
