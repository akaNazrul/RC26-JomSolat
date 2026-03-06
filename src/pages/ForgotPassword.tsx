import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="text-accent-primary" size={32} />
              </div>
              <h1 className="font-display text-2xl text-text-primary mb-2">Check Your Email</h1>
              <p className="font-body text-text-secondary mb-6">
                We've sent a password reset link to <span className="text-text-primary font-medium">{email}</span>.
                Check your inbox (and spam folder) and follow the link to reset your password.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors text-center"
              >
                Back to Log In
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <h1 className="font-display text-3xl text-text-primary mb-2">Forgot Password?</h1>
              <p className="font-body text-text-secondary mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block font-body text-sm text-text-secondary mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center font-body text-sm text-text-secondary">
                Remember your password?{' '}
                <Link to="/login" className="text-accent-primary font-semibold">
                  Log In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
