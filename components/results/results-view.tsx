'use client'

import { useState } from 'react'
import {
  Flame,
  Share2,
  RefreshCw,
  Lock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  AlertTriangle,
  XCircle,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lightbulb,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { ScoreMeter } from './score-meter'
import { SeverityBadge } from './severity-badge'
import { ScopeGuardBanner } from '@/components/sections/scopeguard-banner'

export interface RoastResult {
  screenshot: string
  roast: string[]
  fixSuggestions?: string[]
  overallScore?: number
  verdict?: string
}

interface ResultsViewProps {
  result: RoastResult
  url: string
  email: string
  setEmail: (email: string) => void
  unlocked: boolean
  unlocking: boolean
  error: string | null
  handleUnlock: (e: React.FormEvent) => void
  handleRoastAgain: () => void
}

export function ResultsView({
  result,
  url,
  email,
  setEmail,
  unlocked,
  unlocking,
  error,
  handleUnlock,
  handleRoastAgain,
}: ResultsViewProps) {
  const [expandedRoast, setExpandedRoast] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [showAllRoasts, setShowAllRoasts] = useState(false)

  const score = result.overallScore || 5
  const verdict = result.verdict || 'Your landing page needs some serious TLC.'
  const roastPoints = result.roast || []
  const fixSuggestions = result.fixSuggestions || []

  const visibleRoasts = showAllRoasts ? roastPoints : roastPoints.slice(0, 5)

  const handleCopyResults = () => {
    const text = `
🔥 ROAST RESULTS for ${url}

📊 Score: ${score}/10
💬 Verdict: ${verdict}

🔥 The Brutal Truth:
${roastPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

${
  unlocked
    ? `\n✅ How to Fix It:\n${fixSuggestions
        .map((fix, i) => `${i + 1}. ${fix}`)
        .join('\n')}`
    : ''
}

Roasted by RoastMyLP.com
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareText = `My landing page scored ${score}/10 on RoastMyLP! "${verdict}" 🔥`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Landing Page Roast',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      )
    }
  }

  return (
    <div className='min-h-screen px-4 py-12 md:py-20'>
      <div className='max-w-6xl mx-auto space-y-8'>
        {/* Header with Score */}
        <div className='text-center space-y-6'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30'>
            <Flame className='w-5 h-5 text-destructive animate-pulse' />
            <span className='text-destructive font-medium'>ROAST COMPLETE</span>
          </div>

          <div className='flex justify-center'>
            <ScoreMeter score={score} />
          </div>

          <div className='max-w-3xl mx-auto'>
            <blockquote className='text-2xl md:text-3xl font-bold italic text-center'>
              &ldquo;<span className='gradient-text'>{verdict}</span>&rdquo;
            </blockquote>
          </div>

          <div className='flex flex-wrap justify-center gap-3'>
            <Button
              onClick={handleRoastAgain}
              variant='outline'
              className='border-primary hover:bg-primary/10'
            >
              <RefreshCw className='w-4 h-4 mr-2' />
              Roast Another
            </Button>
            <Button
              onClick={handleShare}
              variant='outline'
              className='border-accent hover:bg-accent/10'
            >
              <Share2 className='w-4 h-4 mr-2' />
              Share Results
            </Button>
            <Button
              onClick={handleCopyResults}
              variant='outline'
              className='border-electric-purple hover:bg-electric-purple/10'
            >
              {copied ? (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy Results
                </>
              )}
            </Button>
          </div>
        </div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Screenshot */}
          <div className='relative group order-2 lg:order-1'>
            <div className='absolute -inset-1 bg-gradient-to-r from-destructive to-accent rounded-2xl blur-lg opacity-30' />
            <div className='relative rounded-2xl overflow-hidden border border-border bg-card'>
              <div className='p-3 border-b border-border bg-secondary/50 flex items-center gap-2'>
                <div className='flex gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-red-500' />
                  <div className='w-3 h-3 rounded-full bg-yellow-500' />
                  <div className='w-3 h-3 rounded-full bg-green-500' />
                </div>
                <span className='text-xs text-muted-foreground truncate flex-1'>
                  {url}
                </span>
              </div>
              <div className='relative'>
                <img
                  src={result.screenshot}
                  alt='Website screenshot'
                  className='w-full h-auto'
                />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none'>
                  <div className='px-6 py-3 md:px-8 md:py-4 border-4 border-destructive rounded-lg bg-destructive/20 backdrop-blur-sm'>
                    <span className='text-2xl md:text-4xl lg:text-5xl font-black text-destructive text-glow-pink tracking-wider'>
                      ROASTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roast Points */}
          <div className='space-y-6 order-1 lg:order-2'>
            <div className='flex items-center justify-between'>
              <h3 className='text-2xl font-bold flex items-center gap-2'>
                <Flame className='w-6 h-6 text-accent' />
                The Brutal Truth
              </h3>
              <span className='text-sm text-muted-foreground'>
                {roastPoints.length} issues found
              </span>
            </div>

            <div className='space-y-3'>
              {visibleRoasts.map((point, index) => (
                <div key={index} className='group relative'>
                  <div
                    className={`
                      flex gap-4 p-4 glass rounded-xl border transition-all cursor-pointer
                      ${
                        expandedRoast === index
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/50'
                      }
                    `}
                    onClick={() =>
                      setExpandedRoast(expandedRoast === index ? null : index)
                    }
                  >
                    <span className='flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 text-destructive font-bold flex items-center justify-center text-sm'>
                      {index + 1}
                    </span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2'>
                        <p className='text-base leading-relaxed'>{point}</p>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                            expandedRoast === index ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      <div className='mt-2'>
                        <SeverityBadge
                          index={index}
                          total={roastPoints.length}
                        />
                      </div>
                    </div>
                  </div>

                  {expandedRoast === index && (
                    <div className='mt-2 ml-12 p-4 bg-secondary/50 rounded-lg border border-border'>
                      <div className='flex items-start gap-2'>
                        <Lightbulb className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                        <div>
                          <p className='text-sm font-medium text-primary mb-1'>
                            Why this matters
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            This issue affects user experience and could be
                            hurting your conversion rates.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {roastPoints.length > 5 && (
              <Button
                variant='ghost'
                onClick={() => setShowAllRoasts(!showAllRoasts)}
                className='w-full'
              >
                {showAllRoasts ? (
                  <>
                    <ChevronUp className='w-4 h-4 mr-2' />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className='w-4 h-4 mr-2' />
                    Show {roastPoints.length - 5} More Issues
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* How to Fix It Section */}
        <div className='relative mt-12'>
          <div className='absolute -inset-1 bg-gradient-to-r from-primary via-electric-purple to-accent rounded-2xl blur-lg opacity-20' />
          <div className='relative rounded-2xl border border-border overflow-hidden glass'>
            <div className='p-6 border-b border-border bg-gradient-to-r from-electric-purple/10 to-accent/10'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 rounded-lg bg-electric-purple/20'>
                    <TrendingUp className='w-6 h-6 text-electric-purple' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold'>How to Fix It</h3>
                    <p className='text-muted-foreground'>
                      {fixSuggestions.length} actionable improvements
                    </p>
                  </div>
                </div>
                {unlocked && (
                  <div className='flex items-center gap-2 text-green-500'>
                    <CheckCircle className='w-5 h-5' />
                    <span className='text-sm font-medium'>Unlocked</span>
                  </div>
                )}
              </div>
            </div>

            <div className='p-6'>
              {!unlocked ? (
                <div className='relative'>
                  <div
                    className='space-y-4 blur-md select-none'
                    aria-hidden='true'
                  >
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <div
                        key={index}
                        className='flex gap-4 p-4 bg-secondary rounded-xl'
                      >
                        <div className='w-8 h-8 rounded-full bg-primary/20 flex-shrink-0' />
                        <div className='flex-1 space-y-2'>
                          <div className='h-4 bg-muted rounded w-3/4' />
                          <div className='h-4 bg-muted rounded w-1/2' />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='absolute inset-0 flex items-center justify-center z-10'>
                    <div className='bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4'>
                      <div className='text-center space-y-6'>
                        <div className='p-4 rounded-full bg-gradient-to-br from-electric-purple/20 to-accent/20 w-fit mx-auto'>
                          <Lock className='w-10 h-10 text-electric-purple' />
                        </div>
                        <div>
                          <h4 className='text-2xl font-bold mb-2'>
                            Unlock the Fixes
                          </h4>
                          <p className='text-muted-foreground'>
                            Get {fixSuggestions.length || 5}+ actionable
                            suggestions to transform your landing page.
                          </p>
                        </div>

                        <form onSubmit={handleUnlock} className='space-y-4'>
                          <Input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='your@email.com'
                            className='h-14 bg-secondary text-lg'
                            required
                          />
                          <Button
                            type='submit'
                            disabled={unlocking}
                            className='w-full h-14 bg-gradient-to-r from-electric-purple to-accent text-lg font-bold'
                          >
                            {unlocking ? (
                              <Spinner className='w-5 h-5' />
                            ) : (
                              <>
                                <Sparkles className='w-5 h-5 mr-2' />
                                Unlock for Free
                              </>
                            )}
                          </Button>
                        </form>

                        {error && (
                          <div className='flex items-center gap-2 text-destructive text-sm'>
                            <AlertCircle className='w-4 h-4' />
                            <span>{error}</span>
                          </div>
                        )}

                        <p className='text-xs text-muted-foreground'>
                          No spam, ever. Just design tips and occasional
                          updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  {fixSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className='flex gap-4 p-4 bg-secondary/50 rounded-xl border border-primary/20'
                    >
                      <span className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-foreground font-bold flex items-center justify-center text-sm'>
                        {index + 1}
                      </span>
                      <div className='flex-1'>
                        <p className='leading-relaxed'>{suggestion}</p>
                        <div className='mt-2'>
                          <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20'>
                            <CheckCircle className='w-3 h-3' />
                            Actionable
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className='mt-6 p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-accent/10 border border-electric-purple/20'>
                    <div className='flex items-start gap-3'>
                      <div className='p-2 rounded-lg bg-electric-purple/20'>
                        <Award className='w-5 h-5 text-electric-purple' />
                      </div>
                      <div>
                        <h4 className='font-bold mb-1'>Pro Tip</h4>
                        <p className='text-sm text-muted-foreground'>
                          Tackle the critical issues first, then work your way
                          down.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[
            {
              label: 'Issues Found',
              value: roastPoints.length,
              icon: AlertTriangle,
              color: 'text-orange-500',
            },
            {
              label: 'Critical',
              value: Math.ceil(roastPoints.length / 3),
              icon: XCircle,
              color: 'text-red-500',
            },
            {
              label: 'Quick Wins',
              value: Math.floor(roastPoints.length / 3),
              icon: Zap,
              color: 'text-yellow-500',
            },
            {
              label: 'Fixes Available',
              value: fixSuggestions.length,
              icon: CheckCircle,
              color: 'text-green-500',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='p-4 glass rounded-xl border border-border text-center'
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <p className='text-2xl font-bold'>{stat.value}</p>
              <p className='text-sm text-muted-foreground'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-16'>
        <ScopeGuardBanner />
      </div>
    </div>
  )
}
