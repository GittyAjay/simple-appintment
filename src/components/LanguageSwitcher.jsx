import { useLocale } from '../contexts/LocaleContext'

/**
 * Compact EN | हिंदी toggle. Use in auth pages (Login/Signup) where Layout is not shown.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  return (
    <div className="flex rounded-[var(--radius)] border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-3 py-2 text-sm font-medium min-h-0 transition-colors ${locale === 'en' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-gray-100'}`}
        aria-pressed={locale === 'en'}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('hi')}
        className={`px-3 py-2 text-sm font-medium min-h-0 transition-colors ${locale === 'hi' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-muted)] hover:bg-gray-100'}`}
        aria-pressed={locale === 'hi'}
        aria-label="Hindi"
      >
        हिंदी
      </button>
    </div>
  )
}
