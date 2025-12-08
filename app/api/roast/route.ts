import { type NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { createClient } from '@/lib/supabase/server'
import { roastWebsite } from '@/lib/openai'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('roasts_remaining, is_premium')
      .eq('id', user.id)
      .single()

    if (!profile) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        roasts_remaining: 1,
        is_premium: false,
      })
    } else if (!profile.is_premium && profile.roasts_remaining <= 0) {
      return NextResponse.json(
        {
          error: 'No roasts remaining. Please upgrade!',
          requiresPayment: true,
        },
        { status: 402 }
      )
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let validUrl: string
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      validUrl = urlObj.toString()
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    console.log('[Roast] Taking screenshot of:', validUrl)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Set a taller viewport to capture more content
    await page.setViewport({
      width: 1440, // Common desktop width
      height: 900,
    })

    try {
      await page.goto(validUrl, {
        waitUntil: 'networkidle2', // Slightly faster than networkidle0
        timeout: 30000,
      })

      // Wait a bit for any animations/lazy loading
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      )

      // Try to dismiss common popups/cookie banners for cleaner screenshot
      await page.evaluate(() => {
        // Common cookie banner selectors
        const selectors = [
          '[class*="cookie"] button',
          '[class*="consent"] button',
          '[id*="cookie"] button',
          '[class*="popup"] [class*="close"]',
          '[class*="modal"] [class*="close"]',
        ]
        selectors.forEach((selector) => {
          const el = document.querySelector(selector) as HTMLElement
          if (el) el.click()
        })
      })

      // Small delay after dismissing popups
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 500))
      )
    } catch (error) {
      await browser.close()
      console.error('[Roast] Error loading page:', error)
      return NextResponse.json(
        { error: 'Failed to load website. Check if the URL is accessible.' },
        { status: 400 }
      )
    }

    // OPTION 1: Full page screenshot (can be large)
    // const screenshot = await page.screenshot({
    //   encoding: 'base64',
    //   fullPage: true,
    // })

    // OPTION 2: Capture extended viewport (recommended - balanced approach)
    // Scroll to load lazy content, then capture first ~2000px
    await page.evaluate(() => {
      window.scrollTo(0, 1000)
    })
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    )
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })

    // Set clip to capture above-the-fold + a bit more
    const screenshot = await page.screenshot({
      encoding: 'base64',
      clip: {
        x: 0,
        y: 0,
        width: 1440,
        height: 2000, // Capture ~2 viewports worth
      },
    })

    await browser.close()

    console.log('[Roast] Screenshot captured, sending to AI...')

    const { roastPoints, fixSuggestions, overallScore, verdict } =
      await roastWebsite(screenshot as string)

    console.log('[Roast] AI roast completed')

    if (profile && !profile.is_premium) {
      await supabase
        .from('profiles')
        .update({ roasts_remaining: profile.roasts_remaining - 1 })
        .eq('id', user.id)
    }

    await supabase.from('roasts').insert({
      user_id: user.id,
      url: validUrl,
      screenshot_url: `data:image/png;base64,${screenshot}`,
      roast_points: roastPoints,
      fix_suggestions: fixSuggestions,
      overall_score: overallScore,
      verdict: verdict,
    })

    return NextResponse.json({
      screenshot: `data:image/png;base64,${screenshot}`,
      roast: roastPoints,
      fixSuggestions,
      overallScore,
      verdict,
    })
  } catch (error) {
    console.error('[Roast] Error:', error)
    return NextResponse.json(
      { error: 'Failed to roast the website. Please try again.' },
      { status: 500 }
    )
  }
}
