'use client';

import React from 'react';
import { SessionType, SessionStatus } from '@/types';
import { Sparkles, Coffee, HeartHandshake, RotateCw } from 'lucide-react';
import { RESTORATIVE_SUGGESTIONS } from '@/lib/timer-utils';

interface ContentPanelProps {
  mode: SessionType;
  status: SessionStatus;
  taskTitle: string;
  completedCycles: number;
  currentSuggestionIndex: number;
  onCycleSuggestion: () => void;
}

export default function ContentPanel({
  mode,
  status,
  taskTitle,
  completedCycles,
  currentSuggestionIndex,
  onCycleSuggestion,
}: ContentPanelProps) {
  const suggestion = RESTORATIVE_SUGGESTIONS[currentSuggestionIndex % RESTORATIVE_SUGGESTIONS.length];

  return (
    <div className="w-full px-6 py-3">
      <div className="max-w-sm mx-auto bg-[#F3F5F8] border border-[#D5DAE3] rounded-3xl p-5 shadow-xs min-h-[170px] flex flex-col justify-between">
        {/* Header row in card */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D5DAE3]/60">
          <div className="flex items-center gap-2">
            {mode === 'focus' ? (
              <>
                <Sparkles className="w-4 h-4 text-[#2878EE]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#14233D]">
                  Focus Session Brief
                </span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#14233D]">
                  Restorative Break Idea
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#66758D] border border-[#D5DAE3]">
            Cycle {completedCycles + (mode === 'focus' && status === 'running' ? 1 : 0)} of 4
          </span>
        </div>

        {/* Content body based on state */}
        <div className="py-3 flex-1 flex flex-col justify-center">
          {mode === 'break' ? (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-[#14233D] leading-snug">
                {suggestion.text}
              </p>
              <p className="text-xs text-[#66758D]">
                Breaks help consolidate memory and prevent cognitive fatigue. No need to hurry.
              </p>
            </div>
          ) : status === 'idle' ? (
            <div className="space-y-1 text-center py-2">
              <p className="text-sm font-semibold text-[#14233D]">
                What would you like to work on today?
              </p>
              <p className="text-xs text-[#66758D] leading-relaxed">
                Pick a duration, set an optional intention, and start. Even 15 focused minutes creates momentum.
              </p>
            </div>
          ) : status === 'running' ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#14233D]">
                {taskTitle.trim() ? `Working on: ${taskTitle}` : 'Focus mode in progress'}
              </p>
              <p className="text-xs text-[#66758D]">
                Keep notifications quiet. Focus on one small step at a time.
              </p>
            </div>
          ) : status === 'paused' ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#14233D]">
                Session paused
              </p>
              <p className="text-xs text-[#66758D]">
                Take a moment if you were interrupted. Click resume whenever you are ready.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#14233D]">
                Well done! Session concluded.
              </p>
              <p className="text-xs text-[#66758D]">
                Recognise your effort. Time to step away from the desk or set up your next step.
              </p>
            </div>
          )}
        </div>

        {/* Footer row with small action / tip */}
        <div className="pt-2 border-t border-[#D5DAE3]/60 flex items-center justify-between text-[11px] text-[#66758D]">
          {mode === 'break' ? (
            <button
              type="button"
              onClick={onCycleSuggestion}
              className="flex items-center gap-1.5 text-[#2878EE] hover:underline font-medium cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Another suggestion</span>
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[#66758D]">
              <HeartHandshake className="w-3 h-3 text-[#2878EE]" />
              <span>One focused step at a time</span>
            </span>
          )}

          <span className="text-[10px] text-[#66758D]">
            {completedCycles % 4 === 0 && completedCycles > 0
              ? 'Long break earned!'
              : `${4 - (completedCycles % 4)} sessions to long break`}
          </span>
        </div>
      </div>
    </div>
  );
}
