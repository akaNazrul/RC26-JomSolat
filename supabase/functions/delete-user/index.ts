// Supabase Edge Function — delete-user
// Deletes a user from both auth.users and public.users (via FK cascade).
// Only callable by authenticated admins. Requires SUPABASE_SERVICE_ROLE_KEY.
//
// Deploy: supabase functions deploy delete-user

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Admin client — full privilege, used for auth.admin.deleteUser
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Caller client — scoped to the requester's JWT, used to verify identity
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the caller is authenticated
    const { data: { user: caller }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the caller has admin role in public.users
    const { data: callerProfile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (callerProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden — admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prevent admin from deleting themselves
    const { userId } = await req.json();
    if (!userId || typeof userId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (userId === caller.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account via admin panel' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete from auth.users — the FK ON DELETE CASCADE removes public.users row too
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('delete-user error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
