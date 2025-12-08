export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    description: 'Perfect for trying out',
    roasts: 5,
    price: 5,
    popular: false,
    features: [
      '5 landing page roasts',
      'AI-powered analysis',
      'Fix suggestions included',
      'Share & download results',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    description: 'Best value for teams',
    roasts: 15,
    price: 12,
    popular: true,
    features: [
      '15 landing page roasts',
      'AI-powered analysis',
      'Fix suggestions included',
      'Share & download results',
      'Priority processing',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    description: 'Roast everything forever',
    roasts: -1,
    price: 49,
    popular: false,
    features: [
      'Unlimited roasts forever',
      'AI-powered analysis',
      'Fix suggestions included',
      'Share & download results',
      'Priority processing',
      'Early access to new features',
    ],
  },
] as const

export type Package = (typeof PACKAGES)[number]
