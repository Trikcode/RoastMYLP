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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Flame,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type AuthView = 'main' | 'email' | 'check-email'

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [view, setView] = useState<AuthView>('main')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setView('check-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setView('main')
    setEmail('')
    setError(null)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md bg-card border-border'>
        {view === 'main' && (
          <>
            <DialogHeader className='text-center'>
              <div className='mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-destructive/20 to-accent/20 w-fit'>
                <Flame className='w-8 h-8 text-accent' />
              </div>
              <DialogTitle className='text-2xl font-bold'>
                Get Your Roast 🔥
              </DialogTitle>
              <DialogDescription>
                Sign in to roast your landing page and get savage feedback
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4 py-4'>
              {error && (
                <div className='flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>
                  <AlertCircle className='w-4 h-4 flex-shrink-0' />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant='outline'
                className='w-full h-12 text-base border-border hover:bg-secondary'
              >
                {loading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  <>
                    <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      />
                      <path
                        fill='currentColor'
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      />
                      <path
                        fill='currentColor'
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      />
                      <path
                        fill='currentColor'
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email Sign In */}
              <Button
                onClick={() => setView('email')}
                disabled={loading}
                variant='outline'
                className='w-full h-12 text-base border-border hover:bg-secondary'
              >
                <Mail className='w-5 h-5 mr-3' />
                Continue with Email
              </Button>
            </div>

            <span className='block text-center text-xs text-muted-foreground'>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </span>
          </>
        )}

        {view === 'email' && (
          <>
            <DialogHeader className='text-center'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setView('main')}
                className='absolute left-4 top-4'
              >
                <ArrowLeft className='w-4 h-4 mr-1' />
                Back
              </Button>
              <div className='mx-auto mb-4 p-3 rounded-full bg-primary/20 w-fit'>
                <Mail className='w-8 h-8 text-primary' />
              </div>
              <DialogTitle className='text-2xl font-bold'>
                Enter your email
              </DialogTitle>
              <DialogDescription>
                We&apos;ll send you a magic link to sign in instantly
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEmailSignIn} className='space-y-4 py-4'>
              {error && (
                <div className='flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm'>
                  <AlertCircle className='w-4 h-4 flex-shrink-0' />
                  <span>{error}</span>
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='h-12 bg-secondary'
                  autoFocus
                />
              </div>

              <Button
                type='submit'
                disabled={loading || !email}
                className='w-full h-12 bg-gradient-to-r from-primary to-accent font-bold'
              >
                {loading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  <>
                    <Mail className='w-5 h-5 mr-2' />
                    Send Magic Link
                  </>
                )}
              </Button>
            </form>
          </>
        )}

        {view === 'check-email' && (
          <>
            <DialogHeader className='text-center'>
              <div className='mx-auto mb-4 p-3 rounded-full bg-green-500/20 w-fit'>
                <CheckCircle className='w-8 h-8 text-green-500' />
              </div>
              <DialogTitle className='text-2xl font-bold'>
                Check your email
              </DialogTitle>
              {/* Use div instead of nested p tags */}
              <div className='text-sm text-muted-foreground space-y-1 mt-2'>
                <span className='block'>
                  We sent a magic link to{' '}
                  <strong className='text-foreground'>{email}</strong>
                </span>
                <span className='block'>
                  Click the link in the email to sign in.
                </span>
              </div>
            </DialogHeader>

            <div className='py-6 space-y-4'>
              <div className='p-4 bg-secondary rounded-lg'>
                <span className='text-sm text-muted-foreground'>
                  <strong className='text-foreground'>Tip:</strong> The link
                  expires in 1 hour. Check your spam folder if you don&apos;t
                  see it.
                </span>
              </div>

              <Button
                onClick={() => {
                  setView('email')
                  setEmail('')
                }}
                variant='outline'
                className='w-full'
              >
                Use a different email
              </Button>

              <Button onClick={handleClose} variant='ghost' className='w-full'>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
