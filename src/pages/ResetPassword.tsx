import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Exchange the code / token from the password-reset email link for a session.
  useEffect(() => {
    const init = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        if (searchParams.has('code')) {
          // PKCE flow — exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (exchangeError) {
            setError('Invalid or expired reset link. Please request a new one.');
            setIsVerifying(false);
            return;
          }
        } else if (hashParams.has('access_token') && hashParams.get('type') === 'recovery') {
          // Legacy implicit flow — Supabase processes this automatically
          const { error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            setError('Invalid or expired reset link. Please request a new one.');
            setIsVerifying(false);
            return;
          }
        } else {
          // No valid reset token in URL
          setError('Invalid reset link. Please request a new password reset.');
          setIsVerifying(false);
          return;
        }

        setIsVerifying(false);
      } catch (err) {
        console.error('Reset password init error:', err);
        setError('Something went wrong. Please try again.');
        setIsVerifying(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      // Sign out so the user logs in fresh with the new password
      await supabase.auth.signOut();
      setDone(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Update password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Loading state while verifying token ── */
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="font-body text-text-secondary">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <header className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <span className="text-white font-arabic text-lg">م</span>
          </div>
          <span className="font-display text-xl text-text-primary">JomSolat</span>
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">

          {done ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="text-accent-primary" size={32} />
              </div>
              <h1 className="font-display text-2xl text-text-primary mb-2">Password Updated!</h1>
              <p className="font-body text-text-secondary mb-6">
                Your password has been reset successfully. Log in with your new password.
              </p>
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors"
              >
                Go to Log In
              </button>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 className="font-display text-3xl text-text-primary mb-2">Set New Password</h1>
              <p className="font-body text-text-secondary mb-8">
                Choose a strong password for your JomSolat account.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                  {error}
                  {error.includes('expired') && (
                    <span>
                      {' '}
                      <Link to="/forgot-password" className="underline font-semibold">
                        Request a new link
                      </Link>
                    </span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-body text-sm text-text-secondary mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-body text-sm text-text-secondary mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
