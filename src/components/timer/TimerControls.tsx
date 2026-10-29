'use client';

import React, { useState } from 'react';
import { Play, Pause, Square, RotateCcw, AlertTriangle } from 'lucide-react';
import { SessionStatus, SessionType } from '@/types';

interface TimerControlsProps {
  status: SessionStatus;
  mode: SessionType;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
}

export default function TimerControls({
  status,
  mode,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: TimerControlsProps) {
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const confirmStop = () => {
    setShowStopConfirm(false);
    onStop();
  };

  const cancelStop = () => {
    setShowStopConfirm(false);
  };

  return (
    <div className="w-full px-6 py-4">
      {/* Confirmation Dialog for Stop */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14233D]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-xl border border-[#D5DAE3] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14233D]">End session early?</h3>
              <p className="text-xs text-[#66758D] mt-1 leading-relaxed">
                Ending now will record an abandoned session. It is okay if you need to stop!
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={cancelStop}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#D5DAE3] text-sm font-semibold text-[#14233D] hover:bg-[#F3F5F8] transition-colors"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={confirmStop}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-sm font-semibold text-white shadow-xs transition-colors"
              >
                End Early
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons based on state */}
      <div className="flex items-center justify-center gap-3.5 max-w-xs mx-auto">
        {status === 'idle' && (
          <button
            type="button"
            onClick={onStart}
            className="w-full py-4 px-6 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] active:scale-[0.98] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{mode === 'focus' ? 'Start Focus' : 'Start Break'}</span>
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              type="button"
              onClick={onPause}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#14233D] hover:bg-[#1C3256] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
            <button
              type="button"
              onClick={handleStopClick}
              className="py-3.5 px-4 rounded-2xl border border-[#D5DAE3] text-[#66758D] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
              title="Stop session"
              aria-label="Stop session"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              type="button"
              onClick={onResume}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="py-3.5 px-4 rounded-2xl border border-[#D5DAE3] text-[#66758D] hover:text-[#14233D] hover:bg-[#F3F5F8] transition-all cursor-pointer"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleStopClick}
              className="py-3.5 px-4 rounded-2xl border border-[#D5DAE3] text-[#66758D] hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all cursor-pointer"
              title="Stop session"
              aria-label="Stop session"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </>
        )}

        {(status === 'completed' || status === 'abandoned') && (
          <button
            type="button"
            onClick={onReset}
            className="w-full py-4 px-6 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Set Up Next Session</span>
          </button>
        )}
      </div>
    </div>
  );
}
