'use client';

import React from 'react';
import { Target } from 'lucide-react';
import { SessionStatus, SessionType } from '@/types';

interface TaskInputProps {
  taskTitle: string;
  onTaskChange: (val: string) => void;
  status: SessionStatus;
  mode: SessionType;
}

export default function TaskInput({
  taskTitle,
  onTaskChange,
  status,
  mode,
}: TaskInputProps) {
  const isRunning = status === 'running' || status === 'paused';

  if (mode === 'break') {
    return null;
  }

  return (
    <div className="w-full px-6 py-2">
      <div className="max-w-sm mx-auto">
        {isRunning ? (
          <div className="p-3.5 rounded-2xl bg-[#F3F5F8] border border-[#D5DAE3] flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D9E9FF] text-[#2878EE] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#66758D]">Current Goal</span>
              <p className="text-sm font-semibold text-[#14233D] truncate">
                {taskTitle.trim() ? taskTitle : 'Unspecified study session'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
              <Target className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => onTaskChange(e.target.value)}
              placeholder="What are you working on? (optional)"
              maxLength={120}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F3F5F8] border border-[#D5DAE3] text-[#14233D] placeholder-[#66758D] text-sm font-medium focus:bg-white focus:border-[#2878EE] transition-all outline-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
