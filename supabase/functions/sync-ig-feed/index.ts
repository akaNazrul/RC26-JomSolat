import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Rate limiting configuration
const RATE_LIMIT_MAX = 10; // Max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if the request is within rate limits
 */
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

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Get CORS headers based on origin
 */
const getCorsHeaders = (origin: string): Record<string, string> => {
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(o => o.trim());
  const isAllowed = allowedOrigins.some(o => o === origin || o === '*');
  return {
    ...corsHeaders,
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '',
  };
};

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const corsHeadersForRequest = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeadersForRequest });
  }

  // Rate limiting check - limit by IP
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                   req.headers.get('x-real-ip') || 
                   'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429,
      headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
    });
  }

  if (req.method === 'GET') {
    return new Response("Function is live! Waiting for Apify webhook...", { 
      status: 200,
      headers: corsHeadersForRequest 
    });
  }

  try {
    // Validate request content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    let payload: any;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const datasetId = payload.resource?.defaultDatasetId;

    // Validate datasetId - only allow Apify webhook calls with valid dataset IDs
    if (!datasetId || typeof datasetId !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid or missing datasetId' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Additional validation: ensure datasetId looks like an Apify dataset ID
    // Apify dataset IDs are typically alphanumeric strings
    if (!/^[a-zA-Z0-9_-]+$/.test(datasetId)) {
      return new Response(JSON.stringify({ error: 'Invalid datasetId format' }), {
        status: 400,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const apifyToken = Deno.env.get('APIFY_TOKEN');
    if (!apifyToken) {
      console.error('Missing APIFY_TOKEN environment variable');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Use Authorization header instead of query parameter for security
    const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items`, {
      headers: {
        'Authorization': `Bearer ${apifyToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Apify API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: 'Failed to fetch from Apify' }), {
        status: 502,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const items = await response.json();

    // Validate items structure
    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid response from Apify' }), {
        status: 502,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    // Limit the number of items to prevent DoS
    const maxItems = 100;
    const limitedItems = items.slice(0, maxItems);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // MAPPING DATA TO YOUR ACTUAL COLUMNS with validation
    const formattedPosts = limitedItems.map((post: any) => ({
      id: typeof post.id === 'string' || typeof post.id === 'number' ? String(post.id).slice(0, 255) : null,
      caption: typeof post.caption === 'string' ? post.caption.slice(0, 2000) : "",
      display_url: typeof post.displayUrl === 'string' ? post.displayUrl.slice(0, 2048) : "",
      ig_url: typeof post.url === 'string' ? post.url.slice(0, 2048) : "",
      likes_count: typeof post.likesCount === 'number' ? Math.min(post.likesCount, 2147483647) : 0,
      // Mapping the Instagram timestamp to your 'event_date' column
      event_date: post.timestamp ? (() => {
        try {
          const date = new Date(post.timestamp);
          return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
        } catch {
          return null;
        }
      })() : null,
      // 'created_at' is usually handled by Supabase, but we can set it manually
      created_at: post.timestamp || new Date().toISOString()
    })).filter((post: any) => post.id !== null); // Filter out invalid posts

    if (formattedPosts.length === 0) {
      return new Response(JSON.stringify({ success: true, synced: 0, message: 'No valid posts to sync' }), { 
        status: 200,
        headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
      });
    }

    const { error } = await supabase
      .from('instagram_feed')
      .upsert(formattedPosts, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }
    
    return new Response(JSON.stringify({ success: true, synced: formattedPosts.length }), { 
      status: 200,
      headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('sync-ig-feed error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { ...corsHeadersForRequest, 'Content-Type': 'application/json' },
    });
  }
})
