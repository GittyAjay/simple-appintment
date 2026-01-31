import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useT } from '../contexts/LocaleContext'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { Card, Button, Input } from '../components/ui'

export function Signup() {
  const { signup } = useAuth()
  const t = useT()
  const submittingRef = useRef(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setError('')
    setLoading(true)
    try {
      await signup(email, password, name, businessName)
      navigate('/')
    } catch (err) {
      setError(err.message || t('signup.errorDefault'))
      submittingRef.current = false
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg)] py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-bold text-[var(--color-text)] mb-1 font-heading">
          {t('signup.title')}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {t('signup.subtitle')}
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
            label={t('signup.yourName')}
            placeholder={t('signup.placeholderName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={t('signup.businessName')}
            placeholder={t('signup.placeholderBusiness')}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <Input
            label={t('signup.email')}
            type="email"
            placeholder={t('signup.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label={t('signup.password')}
            type="password"
            placeholder={t('signup.placeholderPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {t('signup.submit')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          {t('signup.haveAccount')}{' '}
          <Link to="/login" className="text-[var(--color-primary)] font-medium no-underline">
            {t('signup.logIn')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
