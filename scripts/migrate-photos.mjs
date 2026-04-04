import { createClient } from '@supabase/supabase-js';
import https from 'https';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://swxosxapmtjzfmlemgmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3eG9zeGFwbXRqemZtbGVtZ21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjY0NTY3OCwiZXhwIjoyMDg4MjIxNjc4fQ._fafGA7dzUSx48zvDzNFhavAHUAHcFrQDtf0t8SOrLo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch image, status: ${res.statusCode}`));
      }
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve({
          buffer: Buffer.concat(data),
          contentType: res.headers['content-type']
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log("Checking bucket...");
  try {
    await supabase.storage.createBucket('instagram-feed', { public: true });
    console.log("Bucket created.");
  } catch (err) {
    if (!err.message?.includes('already exists')) {
      console.log("Bucket error:", err.message);
    }
  }

  console.log("Fetching posts...");
  const { data: posts, error } = await supabase
    .from('instagram_feed')
    .select('id, display_url')
    .like('display_url', 'http%');
  
  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  const toMigrate = posts.filter(p => !p.display_url.includes('supabase.co/storage'));
  console.log(`Found ${toMigrate.length} posts to migrate.`);

  let success = 0;
  for (const post of toMigrate) {
    try {
      console.log(`Migrating ${post.id}...`);
      const { buffer, contentType } = await fetchImage(post.display_url);
      
      const ext = contentType.includes('webp') ? 'webp' : contentType.includes('png') ? 'png' : 'jpg';
      const filename = `${post.id}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from('instagram-feed')
        .upload(filename, buffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) {
        console.error(`Upload error for ${post.id}:`, uploadError.message);
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('instagram-feed')
        .getPublicUrl(filename);
        
      const publicUrl = urlData.publicUrl;
      console.log(`Uploaded to: ${publicUrl}`);

      const { error: updateError } = await supabase
        .from('instagram_feed')
        .update({ display_url: publicUrl })
        .eq('id', post.id);
        
      if (updateError) {
        console.error(`DB Update error for ${post.id}:`, updateError.message);
      } else {
        console.log(`Migrated ${post.id} successfully!`);
        success++;
      }
    } catch (e) {
      console.error(`Failed to migrate ${post.id}:`, e.message);
    }
  }
  
  console.log(`\nMigration complete. ${success} images migrated successfully.`);
}

run();