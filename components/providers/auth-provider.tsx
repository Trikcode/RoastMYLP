'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  roastsRemaining: 0,
  isPremium: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  verifyPayment: async () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [roastsRemaining, setRoastsRemaining] = useState(0)
  const [isPremium, setIsPremium] = useState(false)

  const supabase = createClient()

  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('roasts_remaining, is_premium')
          .eq('id', userId)
          .single()

        if (profile) {
          setRoastsRemaining(
            profile.is_premium ? 999999 : profile.roasts_remaining
          )
          setIsPremium(profile.is_premium)
          console.log('[AuthProvider] Profile loaded:', profile)
        }
      } catch (error) {
        console.error('[AuthProvider] Error fetching profile:', error)
      }
    },
    [supabase]
  )

  const refreshProfile = useCallback(async () => {
    if (user) {
      console.log('[AuthProvider] Refreshing profile...')
      await fetchProfile(user.id)
    }
  }, [user, fetchProfile])

  // Verify payment and update profile
  const verifyPayment = useCallback(
    async (sessionId: string): Promise<boolean> => {
      try {
        console.log('[AuthProvider] Verifying payment session:', sessionId)

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

        console.log('[AuthProvider] Payment verified:', data)

        // Update local state
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
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setRoastsRemaining(0)
    setIsPremium(false)
  }, [supabase])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing...')

        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (currentSession?.user) {
          console.log(
            '[AuthProvider] Session found:',
            currentSession.user.email
          )
          setSession(currentSession)
          setUser(currentSession.user)
          await fetchProfile(currentSession.user.id)
        } else {
          const {
            data: { user: currentUser },
          } = await supabase.auth.getUser()

          if (currentUser) {
            console.log('[AuthProvider] User found:', currentUser.email)
            setUser(currentUser)
            await fetchProfile(currentUser.id)
          } else {
            console.log('[AuthProvider] No authenticated user')
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Init error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('[AuthProvider] Auth state changed:', event)

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setRoastsRemaining(0)
        setIsPremium(false)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

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
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
