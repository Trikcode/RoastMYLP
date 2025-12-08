import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, PACKAGES } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    console.log('[Verify] Checking session:', sessionId)

    const stripe = getStripe()

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Verify this session belongs to this user
    const sessionUserId = session.metadata?.user_id
    if (sessionUserId !== user.id) {
      return NextResponse.json(
        { error: 'Session does not belong to this user' },
        { status: 403 }
      )
    }

    // Check if we already processed this session
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single()

    if (existingPurchase) {
      console.log('[Verify] Session already processed')
      // Already processed, just return current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('roasts_remaining, is_premium')
        .eq('id', user.id)
        .single()

      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        roastsRemaining: profile?.roasts_remaining || 0,
        isPremium: profile?.is_premium || false,
      })
    }

    // Process the payment
    const packageId = session.metadata?.package_id
    const roastsToAdd = parseInt(session.metadata?.roasts || '0')

    console.log(
      `[Verify] Processing: package=${packageId}, roasts=${roastsToAdd}`
    )

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('roasts_remaining, is_premium')
      .eq('id', user.id)
      .single()

    let newRoastsRemaining = profile?.roasts_remaining || 0
    let isPremium = profile?.is_premium || false

    if (roastsToAdd === -1) {
      // Unlimited package
      isPremium = true
      newRoastsRemaining = 999999
    } else {
      newRoastsRemaining += roastsToAdd
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({
        roasts_remaining: newRoastsRemaining,
        is_premium: isPremium,
      })
      .eq('id', user.id)

    // Record the purchase
    await supabase.from('purchases').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      package_id: packageId,
      amount: session.amount_total,
      roasts_added: roastsToAdd,
    })

    console.log(`[Verify] Success! User now has ${newRoastsRemaining} roasts`)

    return NextResponse.json({
      success: true,
      roastsRemaining: newRoastsRemaining,
      isPremium,
    })
  } catch (error) {
    console.error('[Verify] Error:', error)
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}
