'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const supabase = getSupabaseClient();

    if (!supabase) {
      // Running in local preview mode: simulate successful sign-in
      setTimeout(() => {
        setLoading(false);
        router.push('/timer');
      }, 500);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          router.push('/timer');
        } else {
          setSuccessMessage('Account created! Please check your email to confirm your account.');
          setLoading(false);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        router.push('/timer');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Google OAuth requires Supabase configuration in .env.local.');
      return;
    }

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-6 py-8">
      {/* Brand logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-3xl bg-[#D9E9FF] border border-[#2878EE]/20 flex items-center justify-center text-[#2878EE] shadow-xs mb-4">
          <Clock className="w-9 h-9 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#14233D]">
          Welcome
        </h1>
        <p className="text-xs text-[#66758D] mt-1 max-w-xs">
          Sign in or create an account to focus better
        </p>
      </div>

      {/* Segmented Control */}
      <div className="p-1 bg-[#F3F5F8] rounded-2xl border border-[#D5DAE3] flex mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            mode === 'signin'
              ? 'bg-white text-[#14233D] shadow-xs'
              : 'text-[#66758D] hover:text-[#14233D]'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setError(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            mode === 'signup'
              ? 'bg-white text-[#14233D] shadow-xs'
              : 'text-[#66758D] hover:text-[#14233D]'
          }`}
        >
          Sign up
        </button>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <p className="leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-[#14233D] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DAE3] text-[#14233D] text-sm focus:border-[#2878EE] focus:ring-1 focus:ring-[#2878EE] outline-hidden bg-[#F3F5F8] focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#14233D] mb-1.5">
            Email
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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#14233D]">
              Password
            </label>
            {mode === 'signin' && (
              <Link
                href="/auth/reset-password"
                className="text-[11px] font-semibold text-[#2878EE] hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758D]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D5DAE3] text-[#14233D] text-sm focus:border-[#2878EE] focus:ring-1 focus:ring-[#2878EE] outline-hidden bg-[#F3F5F8] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#66758D] hover:text-[#14233D]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#2878EE] hover:bg-[#1E65D0] active:scale-[0.98] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#D5DAE3]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-[#66758D] font-bold">OR</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full py-3 px-4 rounded-2xl border border-[#D5DAE3] bg-white hover:bg-[#F3F5F8] text-[#14233D] font-semibold text-xs shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Footer Switcher */}
      <div className="mt-6 text-center text-xs text-[#66758D]">
        {mode === 'signin' ? (
          <p>
            Do not have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="font-bold text-[#2878EE] hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="font-bold text-[#2878EE] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
