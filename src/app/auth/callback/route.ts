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

  // Server-side PKCE exchange — @supabase/ssr stores the code_verifier in
  // a cookie when resetPasswordForEmail() is called on the browser, so this
  // server-side exchange will always find it regardless of the email app used.
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth Callback Error:', error.message)

    const isCrossBrowser =
      error.message.toLowerCase().includes('pkce') ||
      error.message.toLowerCase().includes('flow state') ||
      error.message.toLowerCase().includes('code verifier')

    const message = isCrossBrowser
      ? 'Your reset link was opened in a different browser. Please copy the link from the email and paste it into the browser you used to request the reset.'
      : 'Reset link is invalid or has expired. Please request a new one.'

    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`)
  }

  // For password reset flows — skip profile sync and go directly to the reset page
  const isPasswordReset = next === '/reset-password'

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

