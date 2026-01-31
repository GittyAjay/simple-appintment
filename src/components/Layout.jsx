/**
 * App Shell: top bar (app name + user + language), bottom nav on mobile, sidebar on desktop.
 * Icons: Ionicons (react-icons/io5). Labels via useT() for Hindi/English.
 */
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { IoGridOutline, IoCalendarOutline, IoPeopleOutline, IoReceiptOutline } from 'react-icons/io5'
import { useAuth } from '../hooks/useAuth'
import { useLocale, useT } from '../contexts/LocaleContext'
import { Button } from './ui/Button'

const APP_NAME = 'SahajDesk'

export function Layout({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { locale, setLocale } = useLocale()
  const t = useT()

  const navItems = [
    { path: '/', label: t('nav.dashboard'), Icon: IoGridOutline },
    { path: '/appointments', label: t('nav.appointments'), Icon: IoCalendarOutline },
    { path: '/customers', label: t('nav.customers'), Icon: IoPeopleOutline },
    { path: '/bills', label: t('nav.bills'), Icon: IoReceiptOutline },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavLink = ({ path, label, Icon }) => {
    const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
    const cls =
      'flex items-center gap-2 px-4 py-3 rounded-[var(--radius)] text-base font-medium min-h-[44px] transition-colors ' +
      (isActive
        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
        : 'text-[var(--color-text-muted)] hover:bg-gray-100 hover:text-[var(--color-text)]')
    return (
      <Link to={path} className={cls}>
        {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">
          <Link
            to="/"
            className="text-lg font-bold text-[var(--color-primary)] no-underline font-heading"
          >
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex rounded-[var(--radius)] border border-[var(--color-border)] overflow-hidden">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1.5 text-sm font-medium min-h-0 transition-colors ${locale === 'en' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-gray-100'}`}
                aria-pressed={locale === 'en'}
                aria-label="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('hi')}
                className={`px-2.5 py-1.5 text-sm font-medium min-h-0 transition-colors ${locale === 'hi' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-gray-100'}`}
                aria-pressed={locale === 'hi'}
                aria-label="Hindi"
              >
                हिंदी
              </button>
            </div>
            <span className="hidden sm:inline text-sm text-[var(--color-text-muted)] truncate max-w-[140px]">
              {user?.name || user?.email || 'User'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="min-h-0 py-2 text-sm"
            >
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:flex md:flex-col md:w-56 md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)] md:py-4">
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <NavLink key={item.path} path={item.path} label={item.label} Icon={item.Icon} />
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] safe-area-pb"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            const Icon = item.Icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 min-h-[44px] gap-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                {Icon && <Icon className="w-6 h-6 shrink-0" aria-hidden />}
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
