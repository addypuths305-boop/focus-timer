'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export default function Header({ title, subtitle, rightAction }: HeaderProps) {
  return (
    <header className="px-6 pt-7 pb-4 bg-white flex items-center justify-between border-b border-[#F3F5F8]">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#14233D] uppercase font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-[#66758D] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {rightAction ? (
          rightAction
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F5F8] text-[#66758D] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#2878EE]" />
            <span>FocusTime</span>
          </div>
        )}
      </div>
    </header>
  );
}
