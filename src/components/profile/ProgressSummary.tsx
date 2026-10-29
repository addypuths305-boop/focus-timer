'use client';

import React from 'react';
import { ProgressSummaryData } from '@/types';
import { Clock, CheckCircle2, Calendar } from 'lucide-react';
import { formatDurationHuman } from '@/lib/timer-utils';

interface ProgressSummaryProps {
  summary: ProgressSummaryData;
}

export default function ProgressSummary({ summary }: ProgressSummaryProps) {
  return (
    <div className="w-full px-6 py-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#66758D]">
          Focus Summary
        </h3>
        <span className="text-[11px] font-medium text-[#2878EE]">
          Effort Recognised
        </span>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Total Sessions */}
        <div className="bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66758D] mb-1">
            <span className="text-xs font-medium">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-[#2878EE]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#14233D]">
              {summary.totalCompletedSessions}
            </span>
            <span className="text-xs text-[#66758D]">sessions</span>
          </div>
        </div>

        {/* Total Study Time */}
        <div className="bg-[#F3F5F8] border border-[#D5DAE3] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66758D] mb-1">
            <span className="text-xs font-medium">Total Time</span>
            <Clock className="w-4 h-4 text-[#2878EE]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#14233D]">
              {formatDurationHuman(summary.totalFocusTimeMinutes * 60)}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly summary row */}
      <div className="mt-2.5 p-3 rounded-2xl bg-white border border-[#D5DAE3] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D9E9FF] text-[#2878EE] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#14233D] block">Past 7 Days</span>
            <span className="text-[11px] text-[#66758D]">
              {summary.weeklyMinutes > 0
                ? `${formatDurationHuman(summary.weeklyMinutes * 60)} studied this week`
                : 'No sessions logged yet this week'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#2878EE]">
            {summary.weeklyMinutes > 0 ? `${summary.weeklyMinutes}m` : '0m'}
          </span>
        </div>
      </div>
    </div>
  );
}
