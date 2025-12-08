export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Paste Your URL',
      description: 'Drop your landing page URL into our roast machine.',
    },
    {
      number: '02',
      title: 'AI Analyzes',
      description: 'Our AI takes a screenshot and tears your design apart.',
    },
    {
      number: '03',
      title: 'Get Roasted',
      description: 'Receive 7-10 savage (but helpful) design critiques.',
    },
    {
      number: '04',
      title: 'Level Up',
      description: 'Unlock fix suggestions and improve your conversions.',
    },
  ]

  return (
    <section className='py-20 px-4 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-electric-purple/5 to-transparent' />

      <div className='max-w-6xl mx-auto relative'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            How It <span className='text-glow-cyan text-primary'>Works</span>
          </h2>
          <p className='text-muted-foreground'>
            Four simple steps to design enlightenment
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-6'>
          {steps.map((step, index) => (
            <div key={step.number} className='relative text-center'>
              {index < steps.length - 1 && (
                <div className='hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0' />
              )}

              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full glass border border-primary/30 mb-4'>
                <span className='text-2xl font-bold gradient-text'>
                  {step.number}
                </span>
              </div>
              <h3 className='text-lg font-bold mb-2'>{step.title}</h3>
              <p className='text-muted-foreground text-sm'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
