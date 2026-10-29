'use client';

import React from 'react';
import { SessionType, SessionStatus } from '@/types';

interface DurationPresetsProps {
  currentDurationSeconds: number;
  mode: SessionType;
  status: SessionStatus;
  onSelectDuration: (durationSeconds: number) => void;
}

const FOCUS_PRESETS = [
  { label: '15m', seconds: 15 * 60 },
  { label: '30m', seconds: 30 * 60 },
  { label: '45m', seconds: 45 * 60 },
  { label: '60m', seconds: 60 * 60 },
];

const BREAK_PRESETS = [
  { label: '5m', seconds: 5 * 60 },
  { label: '10m', seconds: 10 * 60 },
  { label: '15m', seconds: 15 * 60 },
];

export default function DurationPresets({
  currentDurationSeconds,
  mode,
  status,
  onSelectDuration,
}: DurationPresetsProps) {
  const isRunning = status === 'running' || status === 'paused';
  const presets = mode === 'focus' ? FOCUS_PRESETS : BREAK_PRESETS;

  return (
    <div className="w-full px-6 py-2">
      <div className="flex items-center justify-between gap-2.5 max-w-sm mx-auto">
        {presets.map((preset) => {
          const isSelected = currentDurationSeconds === preset.seconds;

          return (
            <button
              key={preset.seconds}
              type="button"
              disabled={isRunning}
              onClick={() => onSelectDuration(preset.seconds)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 border text-center ${
                isSelected
                  ? 'bg-[#2878EE] text-white border-[#2878EE] shadow-sm scale-[1.02]'
                  : 'bg-white text-[#14233D] border-[#D5DAE3] hover:border-[#2878EE]/50 hover:bg-[#F3F5F8]'
              } ${isRunning ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
