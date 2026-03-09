import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { buildUserObject } from '@/lib/user';
import type { Session } from '@supabase/supabase-js';

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

    const handleSession = async (session: Session) => {
      try {
        // Check if user profile exists
        const { data: existingProfile, error: profileFetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        let profile = existingProfile;

        if (profileFetchError && profileFetchError.code !== 'PGRST116') {
          // PGRST116 = "Could not find a row" - this is expected for new users
          console.error('Error fetching profile:', profileFetchError);
        }

        if (!existingProfile) {
          // Profile doesn't exist - create it now
          // This can happen if the DB trigger failed or email confirmation is required
          console.log('Profile not found, creating new profile...');
          
          try {
            const { data: newProfile, error: profileError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                display_name: session.user.user_metadata?.display_name || 
                              session.user.user_metadata?.full_name || 
                              session.user.email?.split('@')[0] || 
                              'User',
                email: session.user.email || '',
                zone: session.user.user_metadata?.zone || 'gelugor',
                role: 'user',
                provider: session.user.app_metadata?.provider || 'email',
              })
              .select()
              .single();

            if (profileError) {
              console.error('Error creating profile:', profileError);
            } else {
              profile = newProfile;
              console.log('Profile created successfully:', profile);
            }
          } catch (err) {
            console.error('Unexpected error during profile creation:', err);
          }

          // If still no profile, continue anyway - we'll use auth user data
          if (!profile) {
            console.warn('Profile still missing; continuing with auth user only.');
          }
        }

        // Set user in store
        setUser(buildUserObject(session.user, profile));

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

