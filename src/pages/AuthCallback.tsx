import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const handleAuthCallback = async () => {
      // Check if there's an access token in the URL (OAuth callback)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);
      
      const hasOAuthParams = hashParams.has('access_token') || 
                            hashParams.has('refresh_token') ||
                            searchParams.has('access_token') ||
                            searchParams.has('refresh_token') ||
                            searchParams.has('code');

      if (!hasOAuthParams) {
        // No OAuth params, redirect to login
        console.log('No OAuth params found in URL');
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Supabase v2 uses PKCE by default — the `code` param must be
        // explicitly exchanged for a session before getSession() works.
        if (searchParams.has('code')) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (exchangeError) {
            console.error('PKCE exchange error:', exchangeError);
            setError(exchangeError.message);
            return;
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          return;
        }

        if (!session) {
          setError('Authentication failed. No session found.');
          return;
        }

        await handleSession(session);
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    const handleSession = async (session: any) => {
      try {
        // Check if user profile exists
        const { data: existingProfile, error: profileFetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileFetchError && profileFetchError.code !== 'PGRST116') {
          // PGRST116 = "Could not find a row" - this is expected for new users
          console.error('Error fetching profile:', profileFetchError);
        }

        let profile = existingProfile;

        if (!existingProfile) {
          // The DB trigger should have already created the row on first auth,
          // but upsert here as a safety net.
          const { data: newProfile, error: profileError } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              zone: 'gelugor',
              role: 'user',
              provider: session.user.app_metadata?.provider || 'google',
            }, { onConflict: 'id' })
            .select()
            .single();

          if (profileError) {
            console.error('Error creating profile:', profileError);
            // If profile creation fails, we can still proceed with basic user info
            // Just log the error and continue
          }
          profile = newProfile;
        }

        // Set user in store
        const user = {
          id: session.user.id,
          display_name: profile?.display_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          zone: (profile?.zone as 'gelugor' | 'usm' | 'manual') || 'gelugor',
          role: (profile?.role as 'user' | 'admin') || 'user',
          provider: session.user.app_metadata?.provider as 'email' | 'google' || 'email',
          created_at: profile?.created_at || session.user.created_at,
          last_seen_at: new Date().toISOString(),
        };

        setUser(user);

        // Clear the URL hash to prevent re-processing on refresh
        window.history.replaceState(null, '', '/home');
        
        // Redirect to home after successful authentication
        navigate('/home', { replace: true });
      } catch (err) {
        console.error('Error handling session:', err);
        setError('Failed to complete authentication. Please try again.');
      }
    };

    handleAuthCallback();
  }, [navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-text-primary mb-2">Authentication Error</h1>
          <p className="font-body text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-accent-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="font-body text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  );
}

