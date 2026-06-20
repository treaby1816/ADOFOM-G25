import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { WHITELIST_OFFICERS } from '@/lib/whitelist-data'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
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
            } catch (error) {
              // Ignore if called from a Server Component
            }
          },
        },
      }
    )
    
    // IMPORTANT: Wait for the session to be established and cookies written
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (user?.email) {
      const email = user.email.toLowerCase()
      const whitelistEntry = WHITELIST_OFFICERS[email]
      const isFelix = email === 'felixadewole16@gmail.com' || user.user_metadata?.full_name === 'ADEWOLE Felix Bamidele'

      if (isFelix) {
        // Explicitly set approved session cookie for Felix
        const cookieStoreObj = await cookies()
        cookieStoreObj.set('felix_master_approved', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 })
      }

      if (whitelistEntry || isFelix) {
        // Sync Profile Data from Whitelist or set defaults for Felix
        const profileData = {
          id: user.id,
          email_address: email,
          full_name: whitelistEntry?.full_name || user.user_metadata?.full_name || 'ADEWOLE Felix Bamidele',
          current_mda: whitelistEntry?.current_mda || '',
          grade_level: whitelistEntry?.grade_level || '',
          lga: whitelistEntry?.lga || '',
          phone_number: whitelistEntry?.phone_number || '',
          is_approved: true,
          is_admin: isFelix || whitelistEntry?.is_admin || false
        }

        await supabase
          .from('administrative_officers')
          .upsert(profileData)
      }
    }
    
    // Redirect to the requested path or root directory
    const next = searchParams.get('next') || '/'
    return NextResponse.redirect(`${origin}${next}`)
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+magic+link`)
}
