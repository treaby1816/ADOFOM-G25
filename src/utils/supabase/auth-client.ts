import { createBrowserClient } from '@supabase/ssr'

/**
 * A Supabase client that uses the 'implicit' auth flow.
 *
 * Use this ONLY for operations where PKCE cross-browser issues are possible,
 * i.e. sending password reset emails. Implicit flow embeds the token directly
 * in the URL hash so it works regardless of which browser opens the link.
 *
 * For all other authenticated operations, use the standard createClient().
 */
export function createImplicitFlowClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'implicit',
      },
    }
  )
}
