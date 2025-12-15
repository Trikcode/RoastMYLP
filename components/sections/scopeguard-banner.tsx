import { Shield, ArrowRight, ExternalLink } from 'lucide-react'

export function ScopeGuardBanner() {
  return (
    <section className='py-8 border-t border-border relative'>
      <div className='absolute inset-0 bg-gradient-to-r from-electric-purple/10 via-transparent to-primary/10' />

      <div className='max-w-6xl mx-auto px-4 relative'>
        <a
          href='https://shiptogether.dev'
          target='_blank'
          rel='noopener noreferrer'
          className='group flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl glass border border-border hover:border-primary/30 transition-all'
        >
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-primary to-electric-purple'>
              <Shield className='w-8 h-8 text-foreground' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm mb-1'>
                Looking for a co-founder for your startup?
              </p>
              <h3 className='text-xl md:text-2xl font-bold'>
                <span className='gradient-text'>ShipTogether</span>
              </h3>
            </div>
          </div>

          <div className='flex items-center gap-2 text-primary group-hover:gap-3 transition-all'>
            <span className='font-medium'>Learn more</span>
            <ArrowRight className='w-5 h-5' />
            <ExternalLink className='w-4 h-4' />
          </div>
        </a>

        <div className='mt-8 text-center text-muted-foreground text-sm'>
          <p>
            © {new Date().getFullYear()} RoastMyLP. Built with 🔥 and
            questionable design choices.
          </p>
        </div>
      </div>
    </section>
  )
}
