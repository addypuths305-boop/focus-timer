'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Preview mode simulation
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 500);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#D5DAE3] p-8 shadow-sm">
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#66758D] hover:text-[#14233D] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-[#D9E9FF] text-[#2878EE] flex items-center justify-center mb-4">
          <KeyRound className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-[#14233D]">Reset Your Password</h1>
        <p className="text-xs text-[#66758D] mt-1 mb-6 leading-relaxed">
          Enter your registered email address and we will send you instructions to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Reset Email Sent</span>
            </div>
            <p className="text-[#66758D] leading-relaxed">
              If an account with {email} exists, you will receive a secure password reset link shortly.
            </p>
            <Link
              href="/auth"
              className="inline-block mt-2 font-bold text-[#2878EE] hover:underline"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#14233D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DAE3] text-[#14233D] text-sm focus:border-[#2878EE] focus:ring-1 focus:ring-[#2878EE] outline-hidden bg-[#F3F5F8] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
