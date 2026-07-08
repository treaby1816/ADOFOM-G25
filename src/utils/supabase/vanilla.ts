import { createClient } from '@supabase/supabase-js'

/**
 * A standard, vanilla Supabase client that uses localStorage instead of cookies.
 * 
 * We use this EXCLUSIVELY for the password reset flow to bypass the flaky PKCE
 * cookie-storage issues present in @supabase/ssr.
 * By using this, the PKCE code_verifier is reliably stored in and read from 
 * the browser's localStorage.
 */
export function createVanillaClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
