import { getSupabaseClient } from './client';
import { UserProfile, StudySession, ProgressSummaryData } from '@/types';

const LOCAL_STORAGE_PROFILE_KEY = 'focustime_local_profile';
const LOCAL_STORAGE_SESSIONS_KEY = 'focustime_local_sessions';

// Default local guest profile
const DEFAULT_PREVIEW_PROFILE: UserProfile = {
  id: 'guest-student-id',
  email: 'student@example.edu',
  displayName: 'Alex Morgan',
  contactNumber: '+1 (555) 019-2834',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Get current authenticated user profile
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        email: user.email || '',
        displayName: profile.display_name || user.email?.split('@')[0] || 'Student',
        contactNumber: profile.contact_number || undefined,
        avatarUrl: profile.avatar_url || undefined,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      };
    }

    return {
      id: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
      createdAt: user.created_at,
      updatedAt: user.created_at,
    };
  }

  // Local storage preview profile fallback
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_PREVIEW_PROFILE;
      }
    }
    return DEFAULT_PREVIEW_PROFILE;
  }

  return DEFAULT_PREVIEW_PROFILE;
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  displayName: string;
  contactNumber?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'User not authenticated' };

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: updates.displayName,
        contact_number: updates.contactNumber || null,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    const current = (await getCurrentProfile()) || DEFAULT_PREVIEW_PROFILE;
    const updated: UserProfile = {
      ...current,
      displayName: updates.displayName,
      contactNumber: updates.contactNumber,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    return { success: true };
  }

  return { success: true };
}

/**
 * Save completed study or break session
 */
export async function saveStudySession(session: {
  taskTitle: string | null;
  sessionType: 'focus' | 'break';
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  status: 'completed' | 'abandoned';
  startedAt: string;
  completedAt: string | null;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'User not signed in' };

    const { data, error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        task_title: session.taskTitle,
        session_type: session.sessionType,
        planned_duration_seconds: session.plannedDurationSeconds,
        actual_duration_seconds: session.actualDurationSeconds,
        status: session.status,
        started_at: session.startedAt,
        completed_at: session.completedAt,
      })
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, id: data?.id };
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    const newSession: StudySession = {
      id: 'local-' + Date.now().toString(),
      userId: 'guest-student-id',
      taskTitle: session.taskTitle,
      sessionType: session.sessionType,
      plannedDurationSeconds: session.plannedDurationSeconds,
      actualDurationSeconds: session.actualDurationSeconds,
      status: session.status,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      createdAt: new Date().toISOString(),
    };

    const existingJson = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    const list: StudySession[] = existingJson ? JSON.parse(existingJson) : [];
    list.unshift(newSession);
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(list));
    return { success: true, id: newSession.id };
  }

  return { success: true };
}

/**
 * Fetch completed sessions for current user (chronological, newest first)
 */
export async function fetchCompletedSessions(limit = 30): Promise<StudySession[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .eq('session_type', 'focus')
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data.map((item: {
      id: string;
      user_id: string;
      task_title: string | null;
      session_type: 'focus' | 'break';
      planned_duration_seconds: number;
      actual_duration_seconds: number;
      status: 'completed' | 'abandoned';
      started_at: string;
      completed_at: string | null;
      created_at: string;
    }) => ({
      id: item.id,
      userId: item.user_id,
      taskTitle: item.task_title,
      sessionType: item.session_type,
      plannedDurationSeconds: item.planned_duration_seconds,
      actualDurationSeconds: item.actual_duration_seconds,
      status: item.status,
      startedAt: item.started_at,
      completedAt: item.completed_at,
      createdAt: item.created_at,
    }));
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    const existingJson = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    if (!existingJson) {
      // Seed with 2 realistic sample sessions for preview if list is empty
      const initialSeed: StudySession[] = [
        {
          id: 'seed-1',
          userId: 'guest-student-id',
          taskTitle: 'Review biology notes — Cell division',
          sessionType: 'focus',
          plannedDurationSeconds: 1800,
          actualDurationSeconds: 1800,
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          completedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: 'seed-2',
          userId: 'guest-student-id',
          taskTitle: 'Calculus assignment Problem Set 3',
          sessionType: 'focus',
          plannedDurationSeconds: 2700,
          actualDurationSeconds: 2700,
          status: 'completed',
          startedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          completedAt: new Date(Date.now() - 3600000 * 23.25).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    try {
      const all: StudySession[] = JSON.parse(existingJson);
      return all
        .filter(s => s.status === 'completed' && s.sessionType === 'focus')
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Calculates progress summary metrics
 */
export async function getProgressSummary(): Promise<ProgressSummaryData> {
  const sessions = await fetchCompletedSessions(100);

  const totalCompletedSessions = sessions.length;
  const totalFocusSeconds = sessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0);
  const totalFocusTimeMinutes = Math.round(totalFocusSeconds / 60);

  // Calculate this week's minutes (Monday or past 7 days)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklySessions = sessions.filter(s => new Date(s.startedAt).getTime() >= oneWeekAgo);
  const weeklyMinutes = Math.round(
    weeklySessions.reduce((acc, s) => acc + s.actualDurationSeconds, 0) / 60
  );

  const recentTasks = sessions
    .map(s => s.taskTitle)
    .filter((title): title is string => Boolean(title && title.trim().length > 0))
    .slice(0, 5);

  return {
    totalCompletedSessions,
    totalFocusTimeMinutes,
    weeklyMinutes,
    recentTasks,
  };
}
