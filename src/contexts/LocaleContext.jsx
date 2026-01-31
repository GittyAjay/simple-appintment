import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations, getStoredLocale, setStoredLocale } from '../locales/translations'

const LocaleContext = createContext(null)

function getNested(obj, path) {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    current = current?.[key]
    if (current === undefined) return path
  }
  return typeof current === 'string' ? current : path
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getStoredLocale)

  const setLocale = useCallback((next) => {
    const value = next === 'hi' ? 'hi' : 'en'
    setLocaleState(value)
    setStoredLocale(value)
  }, [])

  const t = useCallback(
    (key) => getNested(translations[locale], key),
    [locale]
  )

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useT() {
  const { t } = useLocale()
  return t
}
