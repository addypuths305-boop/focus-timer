export type SessionType = 'focus' | 'break';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'abandoned';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  contactNumber?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  taskTitle: string | null;
  sessionType: SessionType;
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  status: 'completed' | 'abandoned';
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
}

export interface TimerState {
  mode: SessionType;
  status: SessionStatus;
  durationSeconds: number;
  remainingSeconds: number;
  taskTitle: string;
  targetEndTime: number | null; // epoch timestamp ms
  startedAt: number | null;
  completedCycles: number; // count of completed focus sessions for long break logic
}

export interface ProgressSummaryData {
  totalCompletedSessions: number;
  totalFocusTimeMinutes: number;
  weeklyMinutes: number;
  recentTasks: string[];
}
