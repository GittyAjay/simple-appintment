import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useT } from '../contexts/LocaleContext'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { Card, Button, Input } from '../components/ui'

export function Login() {
  const { login } = useAuth()
  const t = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || t('login.errorDefault'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg)]">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-1 font-heading">
          {t('login.title')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {t('login.subtitle')}
        </p>
        {error && (
          <div
            className="mb-4 p-3 rounded-[var(--radius)] bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('login.email')}
            type="email"
            placeholder={t('login.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label={t('login.password')}
            type="password"
            placeholder={t('login.placeholderPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {t('login.submit')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          {t('login.noAccount')}{' '}
          <Link to="/signup" className="text-[var(--color-primary)] font-medium no-underline">
            {t('login.signUp')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
