import Stripe from 'stripe'
import { PACKAGES } from './stripe-packages'

// Re-export packages for convenience in server code
export { PACKAGES, type Package } from './stripe-packages'

// Only create Stripe instance on server
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }

  return stripeInstance
}

// Helper to get price IDs (server-side only)
export function getPriceId(packageId: string): string {
  const priceIds: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    pro: process.env.STRIPE_PRICE_PRO,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
  }

  const priceId = priceIds[packageId]

  if (!priceId) {
    throw new Error(`Price ID not found for package: ${packageId}`)
  }

  return priceId
}
