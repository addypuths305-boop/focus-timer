import { NextResponse } from 'next/server';
import { getSupabaseCredentials, isSupabaseConfigured } from '@/lib/supabase/config';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/timer';

  if (code && isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const { url, anonKey } = getSupabaseCredentials();

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handler called from Server Component
          }
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return user to timer or sign in
  return NextResponse.redirect(`${origin}/timer`);
}
