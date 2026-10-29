'use client';

import React from 'react';
import { StudySession } from '@/types';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { formatDurationHuman } from '@/lib/timer-utils';

interface CompletedSessionsListProps {
  sessions: StudySession[];
  loading?: boolean;
}

export default function CompletedSessionsList({
  sessions,
  loading = false,
}: CompletedSessionsListProps) {
  if (loading) {
    return (
      <div className="w-full px-6 py-4 space-y-2.5">
        <div className="h-4 w-28 bg-[#E8ECF2] rounded-md animate-pulse" />
        <div className="h-16 bg-[#F3F5F8] rounded-2xl animate-pulse" />
        <div className="h-16 bg-[#F3F5F8] rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Filter only completed focus sessions
  const completedFocus = sessions.filter(
    (s) => s.status === 'completed' && s.sessionType === 'focus'
  );

  return (
    <div className="w-full px-6 py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#66758D]">
          Completed Sessions ({completedFocus.length})
        </h3>
      </div>

      {completedFocus.length === 0 ? (
        <div className="p-6 rounded-3xl bg-[#F3F5F8] border border-[#D5DAE3] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white text-[#2878EE] flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-[#14233D]">No completed sessions yet</p>
          <p className="text-xs text-[#66758D] max-w-xs mx-auto">
            Ready when you are. Start a 15-minute session from the Timer tab to log your first accomplishment.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {completedFocus.map((session) => {
            const dateObj = new Date(session.startedAt);
            const dateStr = dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={session.id}
                className="p-3.5 rounded-2xl bg-white border border-[#D5DAE3] flex items-center justify-between gap-3 shadow-2xs hover:border-[#2878EE]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#D9E9FF] text-[#2878EE] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#14233D] truncate">
                      {session.taskTitle?.trim() || 'General Focus Session'}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-[#66758D] mt-0.5">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-[#F3F5F8] text-[#14233D] font-bold text-xs border border-[#D5DAE3]">
                    {formatDurationHuman(session.actualDurationSeconds)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
