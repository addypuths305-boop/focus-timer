'use client';

import { useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Info, X } from 'lucide-react';

export default function SetupNotice() {
  const configured = isSupabaseConfigured();
  const [dismissed, setDismissed] = useState<boolean>(false);

  if (configured || dismissed) {
    return null;
  }

  return (
    <div className="mx-4 mt-3 mb-1 p-3.5 rounded-2xl bg-[#EBF3FF] border border-[#2878EE]/30 text-[#14233D] text-xs shadow-xs relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-[#66758D] hover:text-[#14233D] p-1 rounded-md"
        aria-label="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-start gap-2.5 pr-6">
        <Info className="w-4 h-4 text-[#2878EE] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#14233D]">
            Supabase Setup Status: Preview / Local Mode
          </p>
          <p className="text-[#66758D] leading-relaxed">
            The application is operating with local storage persistence because <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono">NEXT_PUBLIC_SUPABASE_URL</code> is not configured.
          </p>
          <div className="pt-1">
            <span className="font-medium text-[#2878EE]">To enable live cloud sync:</span>
            <span className="text-[#66758D]"> copy <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono">.env.example</code> to <code className="bg-white/80 px-1 py-0.5 rounded text-[11px] font-mono">.env.local</code> and supply your Supabase project keys.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
