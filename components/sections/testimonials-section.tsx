export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I was personally attacked and I've never been more grateful. Conversions up 40%.",
      author: 'Sarah K.',
      role: 'Founder, SaaSify',
      avatar: 'SK',
    },
    {
      quote:
        "The roast was so brutal I almost cried. Then I fixed my site and 3x'd my signups.",
      author: 'Mike R.',
      role: 'Product Designer',
      avatar: 'MR',
    },
    {
      quote:
        'Better feedback than my entire design team gave me. And way funnier.',
      author: 'Alex T.',
      role: 'CEO, LaunchPad',
      avatar: 'AT',
    },
  ]

  return (
    <section className='py-20 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Wall of <span className='text-glow-pink text-accent'>Shame</span>
          </h2>
          <p className='text-muted-foreground'>What our victims are saying</p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className='group relative'>
              <div className='absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-electric-purple/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative p-6 glass rounded-2xl border border-border'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm'>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className='font-medium'>{testimonial.author}</p>
                    <p className='text-xs text-muted-foreground'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className='text-muted-foreground italic'>
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className='mt-4 flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className='text-electric-yellow'>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
