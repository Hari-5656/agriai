import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface GoogleUserProfile {
  sub: string
  name: string
  given_name?: string
  family_name?: string
  picture?: string
  email?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: GoogleUserProfile | null
  idToken: string | null
}

interface AuthContextType extends AuthState {
  signIn: () => void
  signOut: () => void
  signInWithEmail: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CLIENT_ID_META = 'meta[name="google-signin-client_id"]'

function parseJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ isAuthenticated: false, user: null, idToken: null })

  useEffect(() => {
    const stored = localStorage.getItem('auth-google')
    if (stored) {
      try {
        const parsed: AuthState = JSON.parse(stored)
        setState(parsed)
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('auth-google', JSON.stringify(state))
  }, [state])

  const signIn = useCallback(() => {
    const clientId = (document.querySelector(CLIENT_ID_META) as HTMLMetaElement | null)?.content
    if (!clientId || !(window as any).google?.accounts?.id) {
      console.warn('Google Identity Services not loaded or client ID missing')
      return
    }

    ;(window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        const profile = parseJwt(response.credential)
        setState({ isAuthenticated: true, user: profile, idToken: response.credential })
      },
      ux_mode: 'popup',
    })

    ;(window as any).google.accounts.id.prompt()
  }, [])

  const signOut = useCallback(() => {
    setState({ isAuthenticated: false, user: null, idToken: null })
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const raw = localStorage.getItem('auth-email-users')
    const users: Array<{ name: string; email: string; password: string }> = raw ? JSON.parse(raw) : []
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { ok: false, error: 'No account found for this email.' }
    }
    if (user.password !== password) {
      return { ok: false, error: 'Incorrect password.' }
    }
    const profile: GoogleUserProfile = { sub: `local:${user.email}`, name: user.name, email: user.email }
    setState({ isAuthenticated: true, user: profile, idToken: 'local-email-session' })
    return { ok: true }
  }, [])

  const signUpWithEmail = useCallback(async (name: string, email: string, password: string) => {
    const raw = localStorage.getItem('auth-email-users')
    const users: Array<{ name: string; email: string; password: string }> = raw ? JSON.parse(raw) : []
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { ok: false, error: 'An account already exists for this email.' }
    }
    const next = [...users, { name, email, password }]
    localStorage.setItem('auth-email-users', JSON.stringify(next))
    const profile: GoogleUserProfile = { sub: `local:${email}`, name, email }
    setState({ isAuthenticated: true, user: profile, idToken: 'local-email-session' })
    return { ok: true }
  }, [])

  const value = useMemo<AuthContextType>(() => ({ ...state, signIn, signOut, signInWithEmail, signUpWithEmail }), [state, signIn, signOut, signInWithEmail, signUpWithEmail])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


