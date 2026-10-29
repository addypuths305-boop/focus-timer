'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, User } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  const isTimer = pathname === '/timer';
  const isProfile = pathname === '/profile';

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 z-30 w-full bg-white border-t border-[#D5DAE3] px-6 py-2 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link
          href="/timer"
          className={`flex flex-col items-center justify-center py-1.5 px-6 rounded-2xl transition-all duration-200 group ${
            isTimer
              ? 'text-[#2878EE] font-semibold'
              : 'text-[#66758D] hover:text-[#14233D]'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              isTimer ? 'bg-[#D9E9FF] text-[#2878EE]' : 'group-hover:bg-[#F3F5F8]'
            }`}
          >
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs mt-1">Timer</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-1.5 px-6 rounded-2xl transition-all duration-200 group ${
            isProfile
              ? 'text-[#2878EE] font-semibold'
              : 'text-[#66758D] hover:text-[#14233D]'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${
              isProfile ? 'bg-[#D9E9FF] text-[#2878EE]' : 'group-hover:bg-[#F3F5F8]'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
