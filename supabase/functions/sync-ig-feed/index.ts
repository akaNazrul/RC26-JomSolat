import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'GET') {
    return new Response("Function is live! Waiting for Apify webhook...", { status: 200 });
  }

  try {
    const payload = await req.json();
    const datasetId = payload.resource?.defaultDatasetId;

    if (!datasetId) {
      return new Response("No data to sync yet.", { status: 200 });
    }

    const apifyToken = Deno.env.get('APIFY_TOKEN');
    const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`);
    const items = await response.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // MAPPING DATA TO YOUR ACTUAL COLUMNS
    const formattedPosts = items.map((post: any) => ({
      id: post.id,
      caption: post.caption || "",
      display_url: post.displayUrl,
      ig_url: post.url,
      likes_count: post.likesCount || 0,
      // Mapping the Instagram timestamp to your 'event_date' column
      event_date: post.timestamp ? new Date(post.timestamp).toISOString().split('T')[0] : null,
      // 'created_at' is usually handled by Supabase, but we can set it manually
      created_at: post.timestamp || new Date().toISOString()
    }));

    const { error } = await supabase
      .from('instagram_feed')
      .upsert(formattedPosts, { onConflict: 'id' });

    if (error) throw error;
    return new Response(JSON.stringify({ success: true, synced: items.length }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
})