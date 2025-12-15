import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null

  if (user) {
    const { data, error } = await supabase
      .from('profiles')
      .select('roasts_remaining, is_premium')
      .eq('id', user.id)
      .single()

    if (!error) {
      profile = data
    }
  }

  return NextResponse.json({ user, profile })
}
