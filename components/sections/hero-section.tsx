'use client'

import type React from 'react'
import { Flame, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroSectionProps {
  url: string
  setUrl: (url: string) => void
  loading: boolean
  error: string | null
  user: { email?: string } | null
  mounted: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function HeroSection({
  url,
  setUrl,
  loading,
  error,
  user,
  mounted,
  onSubmit,
}: HeroSectionProps) {
  return (
    <section className='flex-1 flex items-center justify-center px-4 py-20'>
      <div className='w-full max-w-4xl space-y-8 text-center'>
        {/* Main Heading - Clean, bold, no gimmicks */}
        <div className='space-y-2'>
          <h1 className='font-mono text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter'>
            <span className='text-foreground'>ROAST</span>
            <br />
            <span className='gradient-text'>MY LANDING</span>
            <br />
            <span className='text-foreground'>PAGE</span>
          </h1>

          {/* Subtle flame accent */}
          <div className='flex justify-center pt-2'>
            <div className='flex items-center gap-1'>
              <span className='text-2xl'>🔥</span>
              <span className='text-2xl'>🔥</span>
              <span className='text-2xl'>🔥</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className='text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto'>
          Drop your URL and get{' '}
          <span className='text-accent font-semibold'>brutally honest</span>,{' '}
          <span className='text-primary font-semibold'>savagely funny</span>{' '}
          feedback in seconds.
        </p>

        {/* URL Input */}
        <form onSubmit={onSubmit} className='max-w-2xl mx-auto'>
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity' />

            <div className='relative flex flex-col sm:flex-row gap-3 p-2 glass rounded-2xl border border-border'>
              <Input
                type='text'
                placeholder='https://your-landing-page.com'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className='flex-1 h-14 px-6 bg-secondary border-0 text-lg font-medium placeholder:text-muted-foreground focus-visible:ring-primary'
              />
              <Button
                type='submit'
                disabled={loading}
                className='h-14 px-8 bg-gradient-to-r from-destructive via-accent to-primary text-foreground font-bold text-lg btn-electric'
              >
                <Flame className='w-5 h-5 mr-2' />
                ROAST ME
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
            </div>
          </div>

          {error && (
            <div className='mt-4 flex items-center justify-center gap-2 text-destructive'>
              <AlertCircle className='w-4 h-4' />
              <span>{error}</span>
            </div>
          )}

          {/* User status */}
          {mounted && (
            <p className='mt-4 text-sm text-muted-foreground'>
              {user ? (
                <span className='text-primary'>
                  ✨ Ready to roast as {user.email}
                </span>
              ) : (
                <span>Sign in to get your free roast</span>
              )}
            </p>
          )}
        </form>

        {/* Social Proof */}
        <div className='flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm pt-8'>
          <div className='flex items-center gap-2'>
            <div className='flex -space-x-2'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background'
                />
              ))}
            </div>
            <span>2,000+ pages roasted</span>
          </div>
          <div className='h-4 w-px bg-border' />
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <span key={i} className='text-accent'>
                ★
              </span>
            ))}
            <span className='ml-1'>4.9/5 rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
