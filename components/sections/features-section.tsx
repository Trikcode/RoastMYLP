import { Flame, Zap, Sparkles } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Flame,
      title: 'Brutally Honest',
      description:
        'No sugar-coating. Get the real feedback your landing page needs.',
      gradient: 'from-destructive to-accent',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'AI-powered analysis delivers roasts in under 30 seconds.',
      gradient: 'from-electric-yellow to-primary',
    },
    {
      icon: Sparkles,
      title: 'Actionable Fixes',
      description:
        'Not just criticism – get specific advice on how to improve.',
      gradient: 'from-electric-purple to-primary',
    },
  ]

  return (
    <section className='py-20 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Why Get <span className='gradient-text'>Roasted</span>?
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Because your mom said your website looks great, and she was lying.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {features.map((feature) => (
            <div key={feature.title} className='group relative'>
              <div className='absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-electric-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative p-8 glass rounded-2xl border border-border group-hover:border-primary/30 transition-colors'>
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                >
                  <feature.icon className='w-6 h-6 text-foreground' />
                </div>
                <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
