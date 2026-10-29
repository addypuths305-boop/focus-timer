'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Save, Loader2 } from 'lucide-react';
import { UserProfile } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  profile: UserProfile | null;
  onClose: () => void;
  onSave: (updates: { displayName: string; contactNumber?: string }) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  profile,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [contactNumber, setContactNumber] = useState(profile?.contactNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      queueMicrotask(() => {
        setDisplayName(profile.displayName || '');
        setContactNumber(profile.contactNumber || '');
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Name is required.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onSave({
        displayName: displayName.trim(),
        contactNumber: contactNumber.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14233D]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#D5DAE3] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#66758D] hover:text-[#14233D] p-1.5 rounded-full hover:bg-[#F3F5F8]"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-[#14233D] mb-4">Edit Profile</h3>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14233D] mb-1.5">
              Display Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5DAE3] text-[#14233D] text-sm focus:border-[#2878EE] focus:ring-1 focus:ring-[#2878EE] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14233D] mb-1.5">
              Contact Number (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5DAE3] text-[#14233D] text-sm focus:border-[#2878EE] focus:ring-1 focus:ring-[#2878EE] outline-hidden"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#D5DAE3] text-[#14233D] hover:bg-[#F3F5F8] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#2878EE] hover:bg-[#1E65D0] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
