// Shared utility: build the canonical User object from Supabase auth + profile row.
// Centralises the construction that was duplicated in Login, SignUp, AuthCallback, initSession.

import type { User } from '@supabase/supabase-js';
import type { User as AppUser } from '@/types';

type ProfileRow = {
  display_name?: string | null;
  avatar_url?: string | null;
  zone?: string | null;
  role?: string | null;
  created_at?: string | null;
};

export function buildUserObject(authUser: User, profile: ProfileRow | null): AppUser {
  return {
    id: authUser.id,
    display_name:
      profile?.display_name || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || '',
    avatar_url: profile?.avatar_url ?? null,
    zone: (profile?.zone as AppUser['zone']) || 'gelugor',
    role: (profile?.role as AppUser['role']) || 'user',
    provider: (authUser.app_metadata?.provider as AppUser['provider']) || 'email',
    created_at: profile?.created_at || authUser.created_at,
    last_seen_at: new Date().toISOString(),
  };
}