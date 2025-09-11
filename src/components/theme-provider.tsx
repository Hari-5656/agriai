import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const storageKey = 'agriai-theme'

function getSystemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const isDark = theme === 'dark' || (theme === 'system' && getSystemPrefersDark())
  root.classList.toggle('dark', isDark)
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = window.localStorage.getItem(storageKey) as Theme | null
    return saved ?? 'system'
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => theme === 'system' && applyTheme('system')
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}


