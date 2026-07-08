import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    // No code in the URL — invalid or already-used link
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent('Reset link is invalid or has already been used. Please request a new one.')}`
    )
  }

  // For password reset flows — skip server-side exchange entirely because of PKCE cookie drops.
  // We forward the code to the client-side /reset-password page which uses localStorage.
  const isPasswordReset = next === '/reset-password' || next.includes('reset-password')

  if (isPasswordReset) {
    return NextResponse.redirect(`${origin}/reset-password?code=${code}`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, { ...options, path: '/' })
            )
          } catch {
            // Ignore cookie errors from Server Components
          }
        },
      },
    }
  )

  // Server-side PKCE exchange for standard logins
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth Callback Error:', error.message)

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication link is invalid or has expired. Please try again.')}`)
  }

  if (!isPasswordReset && user?.email) {
    const email = user.email.toLowerCase()
    const whitelistEntry = WHITELIST_OFFICERS[email]
    const isFelix =
      email === 'felixadewole16@gmail.com' ||
      user.user_metadata?.full_name === 'ADEWOLE Felix Bamidele'

    if (isFelix) {
      cookieStore.set('felix_master_approved', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    if (whitelistEntry || isFelix) {
      await supabase.from('administrative_officers').upsert({
        id: user.id,
        email_address: email,
        full_name:
          whitelistEntry?.full_name ||
          user.user_metadata?.full_name ||
          'ADEWOLE Felix Bamidele',
        current_mda: whitelistEntry?.current_mda || '',
        grade_level: whitelistEntry?.grade_level || '',
        lga: whitelistEntry?.lga || '',
        phone_number: whitelistEntry?.phone_number || '',
        is_approved: true,
        is_admin: isFelix || whitelistEntry?.is_admin || false,
      })
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}

