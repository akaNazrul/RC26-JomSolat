// Supabase Edge Function — delete-user
// Deletes a user from both auth.users and public.users (via FK cascade).
// Only callable by authenticated admins. Requires SUPABASE_SERVICE_ROLE_KEY.
//
// Security enhancements:
// - Restricted CORS (configurable allowed origins)
// - Rate limiting
// - Request validation
// - Audit logging

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Get allowed origins from environment (comma-separated)
const getAllowedOrigins = (): string[] => {
  const env = Deno.env.get('ALLOWED_ORIGINS') || '';
  if (!env) {
    // Default: only localhost for development
    return ['http://localhost:5173', 'http://localhost:3000'];
  }
  return env.split(',').map(o => o.trim()).filter(Boolean);
};

const ALLOWED_ORIGINS = getAllowedOrigins();

// Rate limiting: Simple in-memory store (use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
};

const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dynamic CORS based on origin
const getCorsHeaders = (origin: string): Record<string, string> => {
  const isAllowed = ALLOWED_ORIGINS.some(o => o === origin || o === '*');
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0] || 'null',
  };
};

serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const corsHeadersForRequest = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeadersForRequest });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
        status: 429,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Validate required environment variables
    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Admin client — full privilege, used for auth.admin.deleteUser
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Caller client — scoped to the requester's JWT, used to verify identity
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Verify the caller has admin role in public.users
    const { data: callerProfile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', caller.id)
      .single();

    if (callerProfile?.role !== 'admin') {
      // Log failed admin access attempt
      console.warn(`Non-admin user ${caller.id} attempted to delete user`);
      return new Response(JSON.stringify({ error: 'Forbidden — admin role required' }), {
        status: 403,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate request body
    let body: { userId?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const userId = body.userId;
    if (!userId || typeof userId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid userId' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return new Response(JSON.stringify({ error: 'Invalid userId format' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Prevent admin from deleting themselves
    if (userId === caller.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own account via admin panel' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Delete from auth.users — the FK ON DELETE CASCADE removes public.users row too
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('Delete user error:', deleteError);
      throw deleteError;
    }

    // Log successful deletion
    console.log(`User ${caller.id} deleted user ${userId}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('delete-user error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
    });
  }
});
