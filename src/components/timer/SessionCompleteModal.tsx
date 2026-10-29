'use client';

import React from 'react';
import { CheckCircle2, Coffee, ArrowRight, X } from 'lucide-react';
import { SessionType } from '@/types';
import { formatDurationHuman } from '@/lib/timer-utils';

interface SessionCompleteModalProps {
  isOpen: boolean;
  mode: SessionType;
  durationSeconds: number;
  taskTitle: string;
  completedCycles: number;
  onStartBreak: (breakDurationSeconds: number) => void;
  onContinueStudying: () => void;
  onDismiss: () => void;
}

export default function SessionCompleteModal({
  isOpen,
  mode,
  durationSeconds,
  taskTitle,
  completedCycles,
  onStartBreak,
  onContinueStudying,
  onDismiss,
}: SessionCompleteModalProps) {
  if (!isOpen) return null;

  const isLongBreakNext = completedCycles > 0 && completedCycles % 4 === 0;
  const recommendedBreakSeconds = isLongBreakNext ? 900 : 300; // 15m or 5m

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14233D]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#D5DAE3] text-center relative space-y-5">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-[#66758D] hover:text-[#14233D] p-1.5 rounded-full hover:bg-[#F3F5F8]"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#D9E9FF] text-[#2878EE] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#14233D]">
            {mode === 'focus' ? 'Focus Session Completed!' : 'Break Completed!'}
          </h2>
          <p className="text-xs text-[#66758D] mt-1">
            {mode === 'focus'
              ? `You dedicated ${formatDurationHuman(durationSeconds)} of calm focus.`
              : 'Hope that gave you a restorative breather.'}
          </p>
        </div>

        {/* Task summary tag if any */}
        {taskTitle.trim() && (
          <div className="p-3 bg-[#F3F5F8] rounded-xl text-left border border-[#D5DAE3]/70">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#66758D] block">
              Accomplishment
            </span>
            <span className="text-xs font-semibold text-[#14233D] line-clamp-2">
              {taskTitle}
            </span>
          </div>
        )}

        {/* Action recommendations */}
        {mode === 'focus' ? (
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => onStartBreak(recommendedBreakSeconds)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Coffee className="w-4 h-4" />
              <span>
                Start {isLongBreakNext ? '15m Long Break' : '5m Short Break'}
              </span>
            </button>

            {isLongBreakNext && (
              <button
                type="button"
                onClick={() => onStartBreak(300)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D5DAE3] text-[#14233D] hover:bg-[#F3F5F8] text-xs font-semibold transition-colors"
              >
                Prefer 5m short break instead
              </button>
            )}

            <button
              type="button"
              onClick={onContinueStudying}
              className="w-full py-2.5 px-4 rounded-xl text-[#66758D] hover:text-[#14233D] hover:bg-[#F3F5F8] text-xs font-semibold transition-colors"
            >
              Skip break & start new focus session
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={onContinueStudying}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Ready to Focus Again</span>
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full py-2.5 px-4 rounded-xl text-[#66758D] hover:text-[#14233D] hover:bg-[#F3F5F8] text-xs font-semibold transition-colors"
            >
              Finish for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
