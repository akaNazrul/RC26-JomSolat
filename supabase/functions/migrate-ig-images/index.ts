import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Migrate existing Instagram CDN images to Supabase Storage
 * Call this once to download and store all existing images
 */
async function downloadAndUploadImage(
  imageUrl: string, 
  postId: string, 
  supabase: any
): Promise<string | null> {
  try {
    // Download the image from Instagram
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.warn(`Failed to download image for post ${postId}: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Determine file extension from content-type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('webp') ? 'webp' : contentType.includes('png') ? 'png' : 'jpg';
    const filename = `${postId}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('instagram-feed')
      .upload(filename, buffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.warn(`Failed to upload image for post ${postId}:`, error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('instagram-feed')
      .getPublicUrl(filename);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn(`Error processing image for post ${postId}:`, err);
    return null;
  }
}

Deno.serve(async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create bucket if it doesn't exist
    try {
      await supabase.storage.createBucket('instagram-feed', { 
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
      });
    } catch (e: any) {
      // Bucket might already exist, that's fine
      if (!e.message?.includes('already exists')) {
        console.warn('Bucket creation warning:', e.message);
      }
    }

    // Fetch all posts with Instagram CDN URLs
    const { data: posts, error: fetchError } = await supabase
      .from('instagram_feed')
      .select('id, display_url')
      .or('display_url.like.%instagram%,display_url.like.%fbcdn%');

    if (fetchError) {
      console.error('Failed to fetch posts:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No posts to migrate',
        migratedCount: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Starting migration of ${posts.length} images...`);

    // Process each post
    const results = [];
    for (const post of posts) {
      if (!post.display_url) continue;

      console.log(`Processing image for post ${post.id}...`);
      const storageUrl = await downloadAndUploadImage(post.display_url, post.id, supabase);

      if (storageUrl) {
        // Update the database with the new storage URL
        const { error: updateError } = await supabase
          .from('instagram_feed')
          .update({ display_url: storageUrl })
          .eq('id', post.id);

        if (updateError) {
          console.warn(`Failed to update post ${post.id}:`, updateError);
          results.push({ id: post.id, status: 'failed', reason: 'database update failed' });
        } else {
          console.log(`Successfully migrated image for post ${post.id}`);
          results.push({ id: post.id, status: 'success' });
        }
      } else {
        results.push({ id: post.id, status: 'failed', reason: 'download or upload failed' });
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    console.log(`Migration complete: ${successCount} succeeded, ${failedCount} failed`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Migration complete`,
      migratedCount: successCount,
      failedCount: failedCount,
      details: results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Migration error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
