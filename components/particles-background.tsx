'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  color: 'cyan' | 'purple' | 'pink'
}

export function ParticlesBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const colors: Array<'cyan' | 'purple' | 'pink'> = ['cyan', 'purple', 'pink']
    const generated: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setParticles(generated)
  }, [])

  if (!mounted) return null

  return (
    <div className='particles-container'>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle particle-${particle.color}`}
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div className='absolute inset-0 grid-bg opacity-30' />

      {/* Radial gradient overlay */}
      <div
        className='absolute inset-0'
        style={{
          background: `radial-gradient(ellipse at 50% 0%, color-mix(in oklch, var(--electric-purple) 10%, transparent) 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
