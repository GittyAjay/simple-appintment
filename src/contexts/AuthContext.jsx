import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { hashPassword, verifyPassword } from '../lib/auth'
import { getUserByEmail, createUser } from '../lib/firestore'

const SESSION_KEY = 'appointment_user'

function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setStoredUser(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getStoredUser())
    setLoading(false)
  }, [])

  const signup = useCallback(async (email, password, name, businessName) => {
    const trimmedEmail = email.trim()
    console.log('[Auth] signup: checking if email exists', trimmedEmail)
    const existing = await getUserByEmail(trimmedEmail)
    if (existing) {
      console.log('[Auth] signup: email already registered')
      throw new Error('This email is already registered.')
    }
    if (password.length < 6) throw new Error('Password should be at least 6 characters.')
    console.log('[Auth] signup: hashing password')
    const { hash, salt } = await hashPassword(password)
    console.log('[Auth] signup: creating user in Firestore')
    const userId = await createUser({
      email: trimmedEmail,
      passwordHash: hash,
      salt,
      name: name || '',
      businessName: businessName || '',
    })
    console.log('[Auth] signup: user created with id', userId)
    const u = {
      uid: userId,
      id: userId,
      email: trimmedEmail,
      name: name || '',
      businessName: businessName || '',
    }
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const login = useCallback(async (email, password) => {
    const trimmedEmail = email.trim()
    const dbUser = await getUserByEmail(trimmedEmail)
    if (!dbUser) throw new Error('Invalid email or password.')
    const valid = await verifyPassword(password, dbUser.passwordHash, dbUser.salt)
    if (!valid) throw new Error('Invalid email or password.')
    const u = {
      uid: dbUser.id,
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || '',
      businessName: dbUser.businessName || '',
    }
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    setStoredUser(null)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading, login, signup, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
