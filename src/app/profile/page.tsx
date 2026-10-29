'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import SetupNotice from '@/components/common/SetupNotice';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EditProfileModal from '@/components/profile/EditProfileModal';
import ProgressSummary from '@/components/profile/ProgressSummary';
import CompletedSessionsList from '@/components/profile/CompletedSessionsList';
import { UserProfile, StudySession, ProgressSummaryData } from '@/types';
import {
  getCurrentProfile,
  updateUserProfile,
  fetchCompletedSessions,
  getProgressSummary,
} from '@/lib/supabase/data-service';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [summary, setSummary] = useState<ProgressSummaryData>({
    totalCompletedSessions: 0,
    totalFocusTimeMinutes: 0,
    weeklyMinutes: 0,
    recentTasks: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [userProfile, userSessions, userSummary] = await Promise.all([
          getCurrentProfile(),
          fetchCompletedSessions(50),
          getProgressSummary(),
        ]);
        if (isMounted) {
          setProfile(userProfile);
          setSessions(userSessions);
          setSummary(userSummary);
        }
      } catch (err) {
        console.error('Failed loading profile data', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshData = async () => {
    const [userProfile, userSessions, userSummary] = await Promise.all([
      getCurrentProfile(),
      fetchCompletedSessions(50),
      getProgressSummary(),
    ]);
    setProfile(userProfile);
    setSessions(userSessions);
    setSummary(userSummary);
  };

  const handleSaveProfile = async (updates: { displayName: string; contactNumber?: string }) => {
    await updateUserProfile(updates);
    await refreshData();
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex flex-col items-center justify-start p-0 md:py-6">
      <div className="w-full max-w-md bg-white border-x md:border border-[#D5DAE3] md:rounded-3xl shadow-sm flex flex-col min-h-screen md:min-h-[844px] justify-between overflow-hidden">
        <div>
          <Header
            title="PROFILE"
            rightAction={
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#66758D] hover:text-rose-600 hover:bg-rose-50 border border-[#D5DAE3] transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            }
          />
          <SetupNotice />

          {/* User Profile Header */}
          <ProfileHeader
            profile={profile}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          <div className="h-px bg-[#F3F5F8] mx-6 my-2" />

          {/* Basic Progress Summary */}
          <ProgressSummary summary={summary} />

          {/* Completed Sessions Chronological History */}
          <CompletedSessionsList sessions={sessions} loading={loading} />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
