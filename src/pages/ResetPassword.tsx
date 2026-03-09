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
        const type = searchParams.get('type') || hashParams.get('type');

        // Debug: log what we found
        console.log('Reset link detection:', {
          hasCode: searchParams.has('code'),
          hasAccessToken: hashParams.has('access_token'),
          type,
          fullHref: window.location.href,
        });

        // Check for password recovery token (PKCE flow with code or legacy flow with token)
        if (type === 'recovery') {
          if (searchParams.has('code')) {
            // PKCE flow: exchange code for session
            console.log('Using PKCE flow for password recovery...');
            const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(
              window.location.href
            );
            if (exchangeError) {
              console.error('Code exchange failed:', exchangeError);
              setError('Invalid or expired reset link. Please request a new one.');
              setIsVerifying(false);
              return;
            }
            console.log('Code exchange successful:', data);
          } else if (hashParams.has('access_token')) {
            // Legacy implicit flow: token is already in URL, Supabase handles it automatically
            console.log('Using legacy flow for password recovery...');
            // Wait a moment for Supabase to auto-detect the session from URL
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Verify we have an active session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData?.session) {
            console.error('No session after recovery token exchange:', sessionError);
            setError('Invalid or expired reset link. Please request a new one.');
            setIsVerifying(false);
            return;
          }

          console.log('Session established for password reset');
          setIsVerifying(false);
        } else {
          // No valid reset token in URL
          console.error('No recovery type found in URL');
          setError('Invalid reset link. Please request a new password reset.');
          setIsVerifying(false);
          return;
        }
      } catch (err) {
        console.error('Reset password init error:', err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Something went wrong. Please try again.');
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
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Sign out after password update failed:', signOutError);
      }
      setDone(true);
    } catch (err) {
      console.error('Update password error:', err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Something went wrong. Please try again.');
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
          <img
            src="/assets/v2-SVG.svg"
            alt="JomSolat"
            className="h-10 w-auto"
          />
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
                  <label htmlFor="new-password" className="block font-body text-sm text-text-secondary mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                  <label htmlFor="confirm-password" className="block font-body text-sm text-text-secondary mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
