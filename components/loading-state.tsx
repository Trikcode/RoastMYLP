'use client'

import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'

interface LoadingStateProps {
  url: string
}

const roastMessages = [
  'Warming up the roast oven... 🔥',
  'Finding all the weak spots...',
  'Loading the burn cannon...',
  'Preparing some harsh truths...',
  'Sharpening our critique knives...',
  'No design is safe...',
  'Getting ready to hurt some feelings...',
  'Summoning the roast gods...',
  'This might sting a little...',
  "Hope you're ready for this...",
  'Gathering brutal honesty...',
  "Your landing page has no idea what's coming...",
  'Activating savage mode...',
  'This is going to be fun (for us)...',
  'Preparing constructive destruction...',
]

const funFacts = [
  "88% of users won't return to a site after a bad experience",
  'You have 0.05 seconds to make a first impression',
  '50% of users expect a page to load in under 2 seconds',
  'Users form design opinions in just 50 milliseconds',
  'Good design can increase conversions by up to 200%',
  '70% of users look for social proof before taking action',
  'The average user reads only 20% of text on a page',
]

export function LoadingState({ url }: LoadingStateProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Cycle through roast messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % roastMessages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Cycle through fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % funFacts.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Animate progress (fake but satisfying)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev // Cap at 90% until actually done
        return prev + Math.random() * 15
      })
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      {/* Animated Fire Ring */}
      <div className='relative w-40 h-40 mb-8'>
        {/* Outer glow */}
        <div className='absolute inset-0 rounded-full animate-pulse'>
          <div
            className='absolute inset-0 rounded-full blur-2xl opacity-60'
            style={{
              background: 'linear-gradient(135deg, #ff4444, #ff8800, #ff4444)',
            }}
          />
        </div>

        {/* Spinning ring */}
        <div
          className='absolute inset-0 rounded-full border-4 border-transparent animate-spin-slow'
          style={{
            borderTopColor: '#ff4444',
            borderRightColor: '#ff8800',
            animationDuration: '3s',
          }}
        />

        {/* Inner circle with flame */}
        <div className='absolute inset-4 rounded-full bg-card flex items-center justify-center'>
          <div className='relative'>
            <Flame
              className='w-16 h-16 text-accent animate-bounce'
              style={{ animationDuration: '1s' }}
            />
            {/* Flame particles */}
            <div className='absolute -top-2 left-1/2 -translate-x-1/2'>
              <span className='block w-2 h-2 bg-orange-400 rounded-full animate-ping' />
            </div>
          </div>
        </div>
      </div>

      {/* Main Message */}
      <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center'>
        <span className='gradient-text'>Roasting in Progress</span>
      </h2>

      {/* Rotating Roast Messages */}
      <div className='h-8 mb-6'>
        <p
          key={messageIndex}
          className='text-lg text-muted-foreground animate-fade-in text-center'
        >
          {roastMessages[messageIndex]}
        </p>
      </div>

      {/* Progress Bar */}
      <div className='w-full max-w-md mb-8'>
        <div className='h-2 bg-secondary rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-destructive via-accent to-electric-purple rounded-full transition-all duration-500'
            style={{ width: `${Math.min(progress, 90)}%` }}
          />
        </div>
        <p className='text-xs text-muted-foreground mt-2 text-center'>
          {Math.min(Math.round(progress), 90)}% complete
        </p>
      </div>

      {/* URL Being Roasted */}
      <div className='px-4 py-2 rounded-lg bg-secondary/50 border border-border mb-8'>
        <p className='text-sm text-muted-foreground'>
          Target: <span className='text-primary font-mono'>{url}</span>
        </p>
      </div>

      {/* Fun Fact */}
      <div className='max-w-md text-center'>
        <p className='text-xs text-muted-foreground mb-1'>💡 Did you know?</p>
        <p
          key={factIndex}
          className='text-sm text-muted-foreground animate-fade-in'
        >
          {funFacts[factIndex]}
        </p>
      </div>

      {/* Warning */}
      <p className='mt-12 text-sm text-muted-foreground flex items-center gap-2'>
        <span className='text-xl'>⚠️</span>
        <span>Warning: The following content may hurt your feelings</span>
      </p>
    </div>
  )
}
