'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Flame,
  Check,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  Loader2,
  LogIn,
} from 'lucide-react'
import { PACKAGES, type Package } from '@/lib/stripe-packages'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  roastsRemaining?: number
  isAuthenticated: boolean
  onAuthRequired: () => void
}

export function UpgradeModal({
  isOpen,
  onClose,
  roastsRemaining = 0,
  isAuthenticated,
  onAuthRequired,
}: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async (pkg: Package) => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      onClose()
      onAuthRequired()
      return
    }

    setLoading(pkg.id)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          onClose()
          onAuthRequired()
          return
        }
        throw new Error(data.error || 'Failed to create checkout')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(null)
    }
  }

  const getPackageIcon = (id: string) => {
    switch (id) {
      case 'starter':
        return Flame
      case 'pro':
        return Zap
      case 'unlimited':
        return Crown
      default:
        return Sparkles
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-4xl bg-card border-border overflow-hidden max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-center pb-4'>
          <div className='mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-electric-purple/20 to-accent/20 w-fit'>
            <Flame className='w-8 h-8 text-accent' />
          </div>
          <DialogTitle className='text-2xl md:text-3xl font-bold'>
            Get More Roasts 🔥
          </DialogTitle>
          <DialogDescription className='text-base'>
            {!isAuthenticated
              ? 'Sign in first, then choose a package to get more roasts!'
              : roastsRemaining === 0
              ? "You've used all your free roasts. Upgrade to keep the burns coming!"
              : `You have ${roastsRemaining} roast${
                  roastsRemaining === 1 ? '' : 's'
                } remaining. Get more to keep improving!`}
          </DialogDescription>
        </DialogHeader>

        {/* Show sign in prompt if not authenticated */}
        {!isAuthenticated && (
          <div className='mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl text-center'>
            <LogIn className='w-8 h-8 text-primary mx-auto mb-2' />
            <p className='text-sm text-muted-foreground mb-3'>
              You need to sign in before purchasing
            </p>
            <Button
              onClick={() => {
                onClose()
                onAuthRequired()
              }}
              className='bg-gradient-to-r from-primary to-accent'
            >
              <LogIn className='w-4 h-4 mr-2' />
              Sign In First
            </Button>
          </div>
        )}

        {error && (
          <div className='mx-auto mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm text-center'>
            {error}
          </div>
        )}

        <div className='grid md:grid-cols-3 gap-4 py-4'>
          {PACKAGES.map((pkg) => {
            const Icon = getPackageIcon(pkg.id)
            const isLoading = loading === pkg.id

            return (
              <div
                key={pkg.id}
                className={`
                  relative rounded-2xl border p-6 transition-all
                  ${
                    pkg.popular
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-secondary/30 hover:border-primary/50'
                  }
                `}
              >
                {pkg.popular && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    <span className='px-3 py-1 bg-gradient-to-r from-primary to-accent text-xs font-bold rounded-full text-foreground'>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className='text-center mb-4'>
                  <div
                    className={`
                      inline-flex p-3 rounded-xl mb-3
                      ${
                        pkg.popular
                          ? 'bg-gradient-to-br from-primary to-accent'
                          : 'bg-secondary'
                      }
                    `}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        pkg.popular ? 'text-foreground' : 'text-primary'
                      }`}
                    />
                  </div>
                  <h3 className='text-xl font-bold'>{pkg.name}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {pkg.description}
                  </p>
                </div>

                <div className='text-center mb-4'>
                  <span className='text-4xl font-black'>${pkg.price}</span>
                  <span className='text-muted-foreground ml-1'>
                    {pkg.roasts === -1 ? '/lifetime' : '/one-time'}
                  </span>
                </div>

                <div className='text-center mb-6'>
                  <span
                    className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                      ${
                        pkg.popular
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }
                    `}
                  >
                    <Flame className='w-4 h-4' />
                    {pkg.roasts === -1 ? 'Unlimited' : pkg.roasts} roasts
                  </span>
                </div>

                <ul className='space-y-2 mb-6'>
                  {pkg.features.map((feature, index) => (
                    <li key={index} className='flex items-start gap-2 text-sm'>
                      <Check className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                      <span className='text-muted-foreground'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(pkg)}
                  disabled={isLoading || loading !== null}
                  className={`
                    w-full h-12 font-bold transition-all
                    ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }
                  `}
                >
                  {isLoading ? (
                    <Loader2 className='w-5 h-5 animate-spin' />
                  ) : !isAuthenticated ? (
                    <>
                      <LogIn className='w-4 h-4 mr-2' />
                      Sign In to Buy
                    </>
                  ) : (
                    <>
                      Get {pkg.name}
                      <ArrowRight className='w-4 h-4 ml-2' />
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        <p className='text-center text-xs text-muted-foreground pt-2'>
          Secure payment powered by Stripe. No subscription, pay once.
        </p>
      </DialogContent>
    </Dialog>
  )
}
