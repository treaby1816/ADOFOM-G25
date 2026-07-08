import { createClient } from '@supabase/supabase-js'

/**
 * Dual-storage adapter: writes to BOTH localStorage AND cookies.
 *
 * Mobile browsers aggressively clear localStorage when the user switches
 * from the email app back to the browser. By mirroring every write to a
 * cookie, the PKCE code_verifier survives the app-switch and is available
 * when exchangeCodeForSession runs on the /reset-password page.
 */
const dualStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null

    // 1. Try localStorage first (fastest)
    const local = window.localStorage.getItem(key)
    if (local) return local

    // 2. Fall back to cookie
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${encodeURIComponent(key)}=`))
    if (match) {
      const value = decodeURIComponent(match.split('=').slice(1).join('='))
      // Restore to localStorage for future reads
      try { window.localStorage.setItem(key, value) } catch {}
      return value
    }

    return null
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try { window.localStorage.setItem(key, value) } catch {}
    // Mirror to cookie (1 hour expiry, plenty for a reset flow)
    try {
      document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)};path=/;max-age=3600;SameSite=Lax`
    } catch {}
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try { window.localStorage.removeItem(key) } catch {}
    try {
      document.cookie = `${encodeURIComponent(key)}=;path=/;max-age=0`
    } catch {}
  },
}

/**
 * A Supabase client that uses dual localStorage+cookie storage.
 *
 * Used EXCLUSIVELY for the password reset flow so the PKCE code_verifier
 * survives mobile app switches (email app → browser).
 */
export function createVanillaClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: dualStorage,
        flowType: 'pkce',
        detectSessionInUrl: false, // We handle code exchange manually
      },
    }
  )
}
