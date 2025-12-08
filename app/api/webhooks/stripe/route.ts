import { type NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Use service role for webhooks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  console.log('[Webhook] Event received:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata?.user_id
    const roastsToAdd = parseInt(session.metadata?.roasts || '0')
    const packageId = session.metadata?.package_id

    if (!userId) {
      console.error('[Webhook] No user_id in metadata')
      return NextResponse.json({ error: 'No user_id' }, { status: 400 })
    }

    // Check if already processed
    const { data: existingPurchase } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('stripe_session_id', session.id)
      .single()

    if (existingPurchase) {
      console.log('[Webhook] Session already processed, skipping')
      return NextResponse.json({ received: true, skipped: true })
    }

    console.log(
      `[Webhook] Processing: user=${userId}, package=${packageId}, roasts=${roastsToAdd}`
    )

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('roasts_remaining, is_premium')
      .eq('id', userId)
      .single()

    if (roastsToAdd === -1) {
      await supabaseAdmin
        .from('profiles')
        .update({
          is_premium: true,
          roasts_remaining: 999999,
        })
        .eq('id', userId)
    } else {
      const currentRoasts = profile?.roasts_remaining || 0
      await supabaseAdmin
        .from('profiles')
        .update({
          roasts_remaining: currentRoasts + roastsToAdd,
        })
        .eq('id', userId)
    }

    await supabaseAdmin.from('purchases').insert({
      user_id: userId,
      stripe_session_id: session.id,
      package_id: packageId,
      amount: session.amount_total,
      roasts_added: roastsToAdd,
    })

    console.log(
      `[Webhook] Success! Added ${roastsToAdd} roasts to user ${userId}`
    )
  }

  return NextResponse.json({ received: true })
}
