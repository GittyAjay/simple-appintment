import { Navigate, useLocation } from 'react-router-dom'
import { useT } from '../contexts/LocaleContext'

export function ProtectedRoute({ children, user, loading }) {
  const location = useLocation()
  const t = useT()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
