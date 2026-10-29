'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Local preview mode default route to /timer
      router.replace('/timer');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/timer');
      } else {
        router.replace('/auth');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2878EE] animate-spin" />
        <span className="text-xs font-semibold text-[#66758D]">Loading FocusTime...</span>
      </div>
    </div>
  );
}
