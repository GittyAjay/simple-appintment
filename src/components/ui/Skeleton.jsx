/**
 * Skeleton — loading placeholder. Subtle pulse.
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-[var(--radius)] bg-gray-200 animate-pulse ${className}`}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
      <Skeleton className="h-8 w-20 mb-3" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius)] border border-[var(--color-border)]">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 flex-1" />
      <Skeleton className="h-6 w-14 rounded-full" />
    </div>
  )
}
