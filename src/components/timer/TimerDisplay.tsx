'use client';

import React from 'react';
import { getSegmentedDigits } from '@/lib/timer-utils';
import { SessionType, SessionStatus } from '@/types';
import { Sparkles, Coffee } from 'lucide-react';

interface TimerDisplayProps {
  remainingSeconds: number;
  mode: SessionType;
  status: SessionStatus;
  progressPercent: number;
}

export default function TimerDisplay({
  remainingSeconds,
  mode,
  status,
  progressPercent,
}: TimerDisplayProps) {
  const digits = getSegmentedDigits(remainingSeconds);

  // Status label text
  let statusText = 'Ready to focus';
  if (mode === 'focus') {
    if (status === 'running') statusText = 'Focus session in progress';
    else if (status === 'paused') statusText = 'Focus paused — take a breath';
    else if (status === 'completed') statusText = 'Focus session complete!';
  } else {
    if (status === 'running') statusText = 'Break in progress — recharge';
    else if (status === 'paused') statusText = 'Break paused';
    else if (status === 'completed') statusText = 'Break complete — ready to study?';
    else statusText = 'Time for a break';
  }

  const isBreak = mode === 'break';

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* Mode badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase transition-colors duration-200">
        {isBreak ? (
          <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200 px-3 py-1 rounded-full">
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            Restorative Break Mode
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[#2878EE] bg-[#D9E9FF]/70 border-[#2878EE]/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#2878EE]" />
            Deep Focus Mode
          </span>
        )}
      </div>

      {/* Segmented Digit Display */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 select-none" aria-label={`Timer countdown: ${digits.minTens}${digits.minOnes} minutes ${digits.secTens}${digits.secOnes} seconds`}>
        {/* Minutes Tens */}
        <div className="w-14 h-20 sm:w-16 sm:h-24 bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl flex items-center justify-center shadow-xs">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#14233D] font-mono">
            {digits.minTens}
          </span>
        </div>

        {/* Minutes Ones */}
        <div className="w-14 h-20 sm:w-16 sm:h-24 bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl flex items-center justify-center shadow-xs">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#14233D] font-mono">
            {digits.minOnes}
          </span>
        </div>

        {/* Colon separator */}
        <div className="flex flex-col items-center justify-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-[#14233D]/60 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[#14233D]/60 animate-pulse" />
        </div>

        {/* Seconds Tens */}
        <div className="w-14 h-20 sm:w-16 sm:h-24 bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl flex items-center justify-center shadow-xs">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#14233D] font-mono">
            {digits.secTens}
          </span>
        </div>

        {/* Seconds Ones */}
        <div className="w-14 h-20 sm:w-16 sm:h-24 bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl flex items-center justify-center shadow-xs">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#14233D] font-mono">
            {digits.secOnes}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] bg-[#E8ECF2] h-2 rounded-full mt-5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isBreak ? 'bg-amber-500' : 'bg-[#2878EE]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Status label */}
      <p className="mt-3 text-xs sm:text-sm font-medium text-[#66758D] text-center">
        {statusText}
      </p>
    </div>
  );
}
