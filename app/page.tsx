'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'

// Components
import { AuthModal } from '@/components/auth-modal'
import { UpgradeModal } from '@/components/upgrade-modal'
import { LoadingState } from '@/components/loading-state'
import {
  ResultsView,
  type RoastResult,
} from '@/components/results/results-view'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { ScopeGuardBanner } from '@/components/sections/scopeguard-banner'

export default function Home() {
  const {
    user,
    loading: authLoading,
    roastsRemaining,
    refreshProfile,
    verifyPayment,
  } = useAuth()

  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // Handle URL params (success from Stripe/auth)
  useEffect(() => {
    const handleUrlParams = async () => {
      const params = new URLSearchParams(window.location.search)

      // Handle Stripe success
      const success = params.get('success')
      const sessionId = params.get('session_id')

      if (success === 'true' && sessionId) {
        console.log('[Page] Payment success detected, verifying...')
        setVerifying(true)

        // Verify the payment and update profile
        const verified = await verifyPayment(sessionId)

        if (verified) {
          console.log('[Page] Payment verified successfully!')
        } else {
          console.error('[Page] Payment verification failed')
          // Still try to refresh profile as fallback
          await refreshProfile()
        }

        setVerifying(false)
        // Clean URL
        window.history.replaceState({}, '', '/')
        return
      }

      // Handle auth success
      if (params.get('auth_success') === 'true') {
        await refreshProfile()
        window.history.replaceState({}, '', '/')
        return
      }

      // Handle auth errors
      const authError = params.get('auth_error')
      if (authError) {
        setError(authError)
        window.history.replaceState({}, '', '/')
      }
    }

    // Only run after auth is loaded
    if (!authLoading && user) {
      handleUrlParams()
    }
  }, [authLoading, user, verifyPayment, refreshProfile])

  const handleRoast = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setUnlocked(false)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresAuth) {
          setShowAuthModal(true)
          return
        }
        if (data.requiresPayment) {
          setShowUpgradeModal(true)
          return
        }
        throw new Error(data.error || 'Failed to roast')
      }

      setResult(data)
      refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    setUnlocking(true)
    setError(null)

    try {
      const response = await fetch('/api/unlock-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlock')
      }

      setUnlocked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUnlocking(false)
    }
  }

  const handleRoastAgain = () => {
    setResult(null)
    setUrl('')
    setEmail('')
    setUnlocked(false)
    setError(null)
  }

  // Show loading while verifying payment
  if (verifying) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-lg text-muted-foreground'>
            Confirming your purchase...
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingState url={url} />
  }

  if (result) {
    return (
      <ResultsView
        result={result}
        url={url}
        email={email}
        setEmail={setEmail}
        unlocked={unlocked}
        unlocking={unlocking}
        error={error}
        handleUnlock={handleUnlock}
        handleRoastAgain={handleRoastAgain}
      />
    )
  }

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <HeroSection
          url={url}
          setUrl={setUrl}
          loading={loading}
          error={error}
          user={user}
          mounted={!authLoading}
          onSubmit={handleRoast}
        />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <ScopeGuardBanner />
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        roastsRemaining={roastsRemaining}
        isAuthenticated={!!user}
        onAuthRequired={() => setShowAuthModal(true)}
      />
    </>
  )
}
