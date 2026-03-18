import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
    
    // Auto-Admin Logic for Felix
    if (user?.user_metadata?.full_name === 'ADEWOLE Felix Bamidele') {
      await supabase
        .from('administrative_officers')
        .upsert({
          id: user.id,
          full_name: user.user_metadata.full_name,
          email_address: user.email,
          is_admin: true,
          is_approved: true
        })
    }
    
    // Redirect to the root directory
    return NextResponse.redirect(`${origin}/`)
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+magic+link`)
}
