import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

let _supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (_supabase) return _supabase;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn(
            'Supabase environment variables are missing. ' +
            'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        );
        // Return a dummy client that won't crash the build
        // but will fail gracefully at runtime
        _supabase = createClient(
            'https://placeholder.supabase.co',
            'placeholder-key'
        );
        return _supabase;
    }

    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _supabase;
}

export const supabase = getSupabaseClient();

export { SUPABASE_URL, SUPABASE_ANON_KEY };
