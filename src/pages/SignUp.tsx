import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { validatePassword, validateInput } from '@/lib/security';

// Prayer zone is fixed to USM Induk / Gelugor — all users are part of this community
const FIXED_ZONE = 'gelugor' as const;

// Input max length constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_PASSWORD_LENGTH = 128;

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Use strong password validation
    const validation = validatePassword(password);
    if (!validation.valid) {
      setError(validation.errors.join('. '));
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            zone: FIXED_ZONE,
          },
        },
      });

      if (signUpError) {
        console.error('Sign up error returned from Supabase:', signUpError);
        setError(signUpError.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      // Profile row is created automatically by the Supabase DB trigger (handle_new_user).
      // No manual INSERT needed here.

      if (data.user && data.session) {
        const user = {
          id: data.user.id,
          display_name: name,
          email: email,
          avatar_url: null,
          zone: FIXED_ZONE,
          role: 'user' as const,
          provider: 'email' as const,
          created_at: new Date().toISOString(),
          last_seen_at: null,
        };
        setUser(user);
        navigate('/home');
      } else if (data.user) {
        // Account created but session not immediately available
        setError('Account created! Logging you in...');
        // Give it a moment and try to fetch session
        setTimeout(async () => {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const user = {
              id: sessionData.session.user.id,
              display_name: name,
              email: email,
              avatar_url: null,
              zone: FIXED_ZONE,
              role: 'user' as const,
              provider: 'email' as const,
              created_at: new Date().toISOString(),
              last_seen_at: null,
            };
            setUser(user);
            navigate('/home');
          }
        }, 1000);
      } else {
        setError('Account created, but something went wrong. Please log in.');
      }
    } catch (err) {
      // Generic error message for security
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { 
            prompt: 'select_account',
          },
        },
      });
      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to sign up with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/v2-SVG.svg"
            alt="JomSolat"
            className="h-10 w-auto"
          />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="font-display text-3xl text-text-primary mb-2">Create Account</h1>
          <p className="font-body text-text-secondary mb-8">Join the JomSolat community</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="signup-name" className="block font-body text-sm text-text-secondary mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(validateInput(e.target.value, MAX_NAME_LENGTH))}
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={MAX_NAME_LENGTH}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block font-body text-sm text-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(validateInput(e.target.value, MAX_EMAIL_LENGTH))}
                  placeholder="your@email.com"
                  autoComplete="email"
                  maxLength={MAX_EMAIL_LENGTH}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block font-body text-sm text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(validateInput(e.target.value, MAX_PASSWORD_LENGTH))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  maxLength={MAX_PASSWORD_LENGTH}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm" className="block font-body text-sm text-text-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  id="signup-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(validateInput(e.target.value, MAX_PASSWORD_LENGTH))}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  maxLength={MAX_PASSWORD_LENGTH}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-surface border border-border-color text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-bg-base text-text-muted">or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-body font-medium text-gray-700">Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center font-body text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

