
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code && isSupabaseConfigured) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                async set(name: string, value: string, options: CookieOptions) {
                    (await cookies()).set({ name, value, ...options })
                },
                async remove(name: string, options: CookieOptions) {
                    (await cookies()).set({ name, value: '', ...options })
                },
            },
        }
    )
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/dashboard');
}
