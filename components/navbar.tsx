'use client'

import { useState } from 'react'
import { Flame, User, LogOut, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/auth-modal'
import { useAuth } from '@/components/providers/auth-provider'

export function Navbar() {
  const { user, loading, roastsRemaining, isPremium, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  // Format roasts display
  const formatRoasts = () => {
    if (isPremium) return '∞'
    return roastsRemaining
  }

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 glass border-b border-border/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <a href='/' className='flex items-center gap-2 group'>
              <div className='relative'>
                <Flame className='w-8 h-8 text-accent group-hover:text-primary transition-colors' />
                <div className='absolute inset-0 blur-md bg-accent/50 group-hover:bg-primary/50 transition-colors' />
              </div>
              <span className='font-bold text-xl tracking-tight'>
                <span className='text-foreground'>Roast</span>
                <span className='gradient-text'>My</span>
                <span className='text-foreground'>LP</span>
              </span>
            </a>

            {/* Right side */}
            <div className='flex items-center gap-4'>
              {loading ? (
                <div className='w-8 h-8 rounded-full bg-secondary animate-pulse' />
              ) : user ? (
                <>
                  {/* Roasts Counter */}
                  <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border'>
                    {isPremium ? (
                      <Crown className='w-4 h-4 text-electric-yellow' />
                    ) : (
                      <Zap className='w-4 h-4 text-electric-yellow' />
                    )}
                    <span className='text-sm font-medium'>
                      {formatRoasts()} roasts
                    </span>
                  </div>

                  {/* User Menu */}
                  <div className='relative'>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className='flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors'
                    >
                      <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center'>
                        <User className='w-4 h-4 text-primary-foreground' />
                      </div>
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className='fixed inset-0 z-10'
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className='absolute right-0 top-full mt-2 w-56 py-2 glass border border-border rounded-xl shadow-xl overflow-hidden z-20'>
                          <div className='px-4 py-3 border-b border-border'>
                            <p className='text-sm font-medium truncate'>
                              {user.email}
                            </p>
                            <p className='text-xs text-muted-foreground mt-0.5'>
                              {isPremium ? (
                                <span className='text-electric-yellow'>
                                  ✨ Premium Member
                                </span>
                              ) : (
                                `${roastsRemaining} roasts remaining`
                              )}
                            </p>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className='w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2 text-destructive'
                          >
                            <LogOut className='w-4 h-4' />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className='bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium'
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  )
}
