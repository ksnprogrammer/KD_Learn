
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL'));

if (isSupabaseConfigured) {
    try {
        supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    } catch (e) {
        if (e instanceof Error && e.message.includes('Invalid URL')) {
            console.warn('Supabase credentials seem invalid. The application will run in a limited, offline mode.');
            supabase = null;
        } else {
            throw e;
        }
    }
} else {
    if (typeof window === 'undefined') {
        console.warn('Supabase credentials are not configured or are placeholders. The application will run in a limited, offline mode.');
    }
}

export { supabase, isSupabaseConfigured };
