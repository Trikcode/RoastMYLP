'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='w-9 h-9'>
        <div className='w-4 h-4 bg-muted rounded animate-pulse' />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={cycleTheme}
      className='w-9 h-9 hover:bg-secondary'
      title={`Current: ${theme}. Click to change.`}
    >
      {theme === 'dark' && <Moon className='w-4 h-4 text-primary' />}
      {theme === 'light' && <Sun className='w-4 h-4 text-ember-orange' />}
      {theme === 'system' && (
        <Monitor className='w-4 h-4 text-muted-foreground' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
