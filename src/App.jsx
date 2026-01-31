import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LocaleProvider } from './contexts/LocaleContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Appointments } from './pages/Appointments'
import { AppointmentForm } from './pages/AppointmentForm'
import { Customers } from './pages/Customers'
import { Bills } from './pages/Bills'
import { BillsForm } from './pages/BillsForm'

function AppRoutes() {
  const { user, loading } = useAuth()
  return (
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route
          path="/"
          element={
            loading ? (
              <div className="loading-screen">
                <div className="spinner" />
                <p>Loading...</p>
              </div>
            ) : user ? (
              <ProtectedRoute user={user} loading={false}>
                <Dashboard user={user} />
              </ProtectedRoute>
            ) : (
              <Landing />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Appointments user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/new"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <AppointmentForm user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <AppointmentForm user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Customers user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Bills user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills/new"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <BillsForm user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </LocaleProvider>
    </BrowserRouter>
  )
}
