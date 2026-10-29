'use client';

import React from 'react';
import { Mail, Phone, Edit3 } from 'lucide-react';
import { UserProfile } from '@/types';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  onEditClick: () => void;
}

export default function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const displayName = profile?.displayName || 'Student User';
  const email = profile?.email || 'student@example.edu';
  const contactNumber = profile?.contactNumber;

  // Get initials for avatar
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'ST';

  return (
    <div className="w-full px-6 pt-2 pb-4">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3.5">
          <div className="w-20 h-20 rounded-full bg-[#D9E9FF] border-2 border-white shadow-sm flex items-center justify-center text-[#2878EE] font-bold text-xl tracking-wider select-none">
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>

        {/* Name and contact details */}
        <h2 className="text-xl font-bold text-[#14233D]">{displayName}</h2>

        <div className="flex flex-col items-center gap-1 mt-1 text-xs text-[#66758D]">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#66758D]" />
            <span>{email}</span>
          </div>

          {contactNumber && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#66758D]" />
              <span>{contactNumber}</span>
            </div>
          )}
        </div>

        {/* Edit Profile Button */}
        <button
          type="button"
          onClick={onEditClick}
          className="mt-4 px-4 py-2 rounded-xl bg-white border border-[#D5DAE3] text-[#14233D] hover:bg-[#F3F5F8] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#2878EE]" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
