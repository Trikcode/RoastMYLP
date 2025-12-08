import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  console.log('[Auth Callback] Processing callback...')
  console.log('[Auth Callback] Code present:', !!code)

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              console.log('[Auth Callback] Setting cookie:', name)
              cookieStore.set(name, value, {
                ...options,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7, // 7 days
              })
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[Auth Callback] Error:', error.message)
      return NextResponse.redirect(
        new URL(
          `/?auth_error=${encodeURIComponent(error.message)}`,
          requestUrl.origin
        )
      )
    }

    console.log('[Auth Callback] Session created for user:', data.user?.email)
  }

  // Redirect to home with success flag
  return NextResponse.redirect(
    new URL(`${next}?auth_success=true`, requestUrl.origin)
  )
}
