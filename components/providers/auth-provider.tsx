'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  roastsRemaining: number
  isPremium: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  verifyPayment: (sessionId: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [roastsRemaining, setRoastsRemaining] = useState(0)
  const [isPremium, setIsPremium] = useState(false)

  const loadMe = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      const data = await res.json()

      if (data.user) {
        setUser(data.user)
        setSession(null) // optional, or extend /me to return it

        const profile = data.profile ?? {}
        setRoastsRemaining(
          profile.is_premium ? 999999 : profile.roasts_remaining ?? 0
        )
        setIsPremium(!!profile.is_premium)
        console.log('[AuthProvider] User loaded:', data.user.email)
      } else {
        console.log('[AuthProvider] No authenticated user')
        setUser(null)
        setSession(null)
        setRoastsRemaining(0)
        setIsPremium(false)
      }
    } catch (error) {
      console.error('[AuthProvider] Init error:', error)
      setUser(null)
      setSession(null)
      setRoastsRemaining(0)
      setIsPremium(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  const refreshProfile = useCallback(async () => {
    await loadMe()
  }, [loadMe])

  const verifyPayment = useCallback(
    async (sessionId: string): Promise<boolean> => {
      try {
        const response = await fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('[AuthProvider] Verification failed:', data.error)
          return false
        }

        setRoastsRemaining(data.isPremium ? 999999 : data.roastsRemaining)
        setIsPremium(data.isPremium)

        return true
      } catch (error) {
        console.error('[AuthProvider] Verification error:', error)
        return false
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    setSession(null)
    setRoastsRemaining(0)
    setIsPremium(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        roastsRemaining,
        isPremium,
        signOut,
        refreshProfile,
        verifyPayment,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
