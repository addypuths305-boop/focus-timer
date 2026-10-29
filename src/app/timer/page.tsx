'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/common/Header';
import SetupNotice from '@/components/common/SetupNotice';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import TimerDisplay from '@/components/timer/TimerDisplay';
import DurationPresets from '@/components/timer/DurationPresets';
import TimerControls from '@/components/timer/TimerControls';
import TaskInput from '@/components/timer/TaskInput';
import ContentPanel from '@/components/timer/ContentPanel';
import SessionCompleteModal from '@/components/timer/SessionCompleteModal';
import { SessionType, SessionStatus, TimerState } from '@/types';
import {
  calculateRemainingFromDeadline,
  calculateProgress,
} from '@/lib/timer-utils';
import { playGentleChime } from '@/lib/audio';
import { sendBrowserNotification, requestNotificationPermission } from '@/lib/notifications';
import { saveStudySession } from '@/lib/supabase/data-service';

const LOCAL_STORAGE_TIMER_KEY = 'focustime_active_timer_v1';
const DEFAULT_FOCUS_DURATION = 25 * 60; // 25 min default

export default function TimerPage() {
  const [mode, setMode] = useState<SessionType>('focus');
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [durationSeconds, setDurationSeconds] = useState<number>(DEFAULT_FOCUS_DURATION);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_FOCUS_DURATION);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [targetEndTime, setTargetEndTime] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState<boolean>(false);
  const [justCompletedDuration, setJustCompletedDuration] = useState<number>(DEFAULT_FOCUS_DURATION);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Restore state from localStorage on initial mount using a microtask
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TIMER_KEY);
      if (saved) {
        const parsed: TimerState = JSON.parse(saved);
        queueMicrotask(() => {
          setMode(parsed.mode || 'focus');
          setDurationSeconds(parsed.durationSeconds || DEFAULT_FOCUS_DURATION);
          setTaskTitle(parsed.taskTitle || '');
          setCompletedCycles(parsed.completedCycles || 0);

          if (parsed.status === 'running' && parsed.targetEndTime) {
            const now = Date.now();
            if (parsed.targetEndTime > now) {
              setRemainingSeconds(calculateRemainingFromDeadline(parsed.targetEndTime));
              setTargetEndTime(parsed.targetEndTime);
              setSessionStartTime(parsed.startedAt || now);
              setStatus('running');
            } else {
              setRemainingSeconds(0);
              setStatus('completed');
              setJustCompletedDuration(parsed.durationSeconds);
              setIsCompletionModalOpen(true);
            }
          } else if (parsed.status === 'paused') {
            setStatus('paused');
            setRemainingSeconds(parsed.remainingSeconds);
          } else {
            setStatus('idle');
            setRemainingSeconds(parsed.durationSeconds || DEFAULT_FOCUS_DURATION);
          }
        });
      }
    } catch (e) {
      console.warn('Failed restoring timer state', e);
    }
  }, []);

  // Persist transient timer state on change
  useEffect(() => {
    try {
      const stateToSave: TimerState = {
        mode,
        status,
        durationSeconds,
        remainingSeconds,
        taskTitle,
        targetEndTime,
        startedAt: sessionStartTime,
        completedCycles,
      };
      localStorage.setItem(LOCAL_STORAGE_TIMER_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed saving timer state', e);
    }
  }, [mode, status, durationSeconds, remainingSeconds, taskTitle, targetEndTime, sessionStartTime, completedCycles]);

  // Completion handler
  const handleSessionComplete = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStatus('completed');
    setRemainingSeconds(0);
    setJustCompletedDuration(durationSeconds);
    setIsCompletionModalOpen(true);

    // Audio chime & notification
    playGentleChime(mode === 'focus' ? 'focusComplete' : 'breakComplete');
    sendBrowserNotification(
      mode === 'focus' ? 'Focus Session Completed! 🌟' : 'Break Finished! ☕',
      {
        body: mode === 'focus'
          ? `Great work! Time for a restorative break.`
          : 'Ready to return to focused study?',
      }
    );

    // Persist to database if focus session
    if (mode === 'focus') {
      setCompletedCycles((prev) => prev + 1);
      await saveStudySession({
        taskTitle: taskTitle.trim() || null,
        sessionType: 'focus',
        plannedDurationSeconds: durationSeconds,
        actualDurationSeconds: durationSeconds,
        status: 'completed',
        startedAt: new Date(sessionStartTime || Date.now() - durationSeconds * 1000).toISOString(),
        completedAt: new Date().toISOString(),
      });
    }
  }, [mode, durationSeconds, taskTitle, sessionStartTime]);

  // Accurate interval ticker recalculating from deadline
  useEffect(() => {
    if (status === 'running' && targetEndTime) {
      intervalRef.current = setInterval(() => {
        const remaining = calculateRemainingFromDeadline(targetEndTime);
        if (remaining <= 0) {
          handleSessionComplete();
        } else {
          setRemainingSeconds(remaining);
        }
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, targetEndTime, handleSessionComplete]);

  // Control actions
  const handleStart = () => {
    requestNotificationPermission();
    const now = Date.now();
    const target = now + remainingSeconds * 1000;
    setTargetEndTime(target);
    setSessionStartTime(now);
    setStatus('running');
  };

  const handlePause = () => {
    if (targetEndTime) {
      const remaining = calculateRemainingFromDeadline(targetEndTime);
      setRemainingSeconds(remaining);
    }
    setTargetEndTime(null);
    setStatus('paused');
  };

  const handleResume = () => {
    const now = Date.now();
    const target = now + remainingSeconds * 1000;
    setTargetEndTime(target);
    setStatus('running');
  };

  const handleStop = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const actualDuration = Math.max(0, durationSeconds - remainingSeconds);

    // If more than 30s elapsed in focus mode, record abandoned session
    if (mode === 'focus' && actualDuration > 30) {
      await saveStudySession({
        taskTitle: taskTitle.trim() || null,
        sessionType: 'focus',
        plannedDurationSeconds: durationSeconds,
        actualDurationSeconds: actualDuration,
        status: 'abandoned',
        startedAt: new Date(sessionStartTime || Date.now()).toISOString(),
        completedAt: new Date().toISOString(),
      });
    }

    setStatus('idle');
    setRemainingSeconds(durationSeconds);
    setTargetEndTime(null);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setRemainingSeconds(durationSeconds);
    setTargetEndTime(null);
  };

  const handleSelectDuration = (newDuration: number) => {
    if (status === 'idle') {
      setDurationSeconds(newDuration);
      setRemainingSeconds(newDuration);
    }
  };

  // Transition to break
  const handleStartBreak = (breakSeconds: number) => {
    setIsCompletionModalOpen(false);
    setMode('break');
    setDurationSeconds(breakSeconds);
    setRemainingSeconds(breakSeconds);
    const now = Date.now();
    const target = now + breakSeconds * 1000;
    setTargetEndTime(target);
    setSessionStartTime(now);
    setStatus('running');
  };

  // Continue studying after break or focus
  const handleContinueStudying = () => {
    setIsCompletionModalOpen(false);
    setMode('focus');
    setDurationSeconds(DEFAULT_FOCUS_DURATION);
    setRemainingSeconds(DEFAULT_FOCUS_DURATION);
    setStatus('idle');
    setTargetEndTime(null);
  };

  const progressPercent = calculateProgress(remainingSeconds, durationSeconds);

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col items-center justify-start p-0 md:py-6">
      <div className="w-full max-w-md bg-white border-x md:border border-[#D5DAE3] md:rounded-3xl shadow-sm flex flex-col min-h-screen md:min-h-[844px] justify-between overflow-hidden">
        <div>
          <Header
            title="TIMER"
            subtitle={mode === 'focus' ? 'Focus Session' : 'Restorative Break'}
          />
          <SetupNotice />

          {/* Main Timer Display */}
          <TimerDisplay
            remainingSeconds={remainingSeconds}
            mode={mode}
            status={status}
            progressPercent={progressPercent}
          />

          {/* Optional Task Intention */}
          <TaskInput
            taskTitle={taskTitle}
            onTaskChange={setTaskTitle}
            status={status}
            mode={mode}
          />

          {/* Duration Presets */}
          <DurationPresets
            currentDurationSeconds={durationSeconds}
            mode={mode}
            status={status}
            onSelectDuration={handleSelectDuration}
          />

          {/* Controls */}
          <TimerControls
            status={status}
            mode={mode}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onReset={handleReset}
          />

          {/* Content Panel */}
          <ContentPanel
            mode={mode}
            status={status}
            taskTitle={taskTitle}
            completedCycles={completedCycles}
            currentSuggestionIndex={suggestionIndex}
            onCycleSuggestion={() => setSuggestionIndex((i) => i + 1)}
          />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* Completion Modal */}
      <SessionCompleteModal
        isOpen={isCompletionModalOpen}
        mode={mode}
        durationSeconds={justCompletedDuration}
        taskTitle={taskTitle}
        completedCycles={completedCycles}
        onStartBreak={handleStartBreak}
        onContinueStudying={handleContinueStudying}
        onDismiss={() => setIsCompletionModalOpen(false)}
      />
    </div>
  );
}
