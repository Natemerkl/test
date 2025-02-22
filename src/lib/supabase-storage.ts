
import { supabase } from "@/integrations/supabase/client";

export async function ensureCampaignImagesBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(b => b.name === 'campaign-images')) {
    await supabase.storage.createBucket('campaign-images', {
      public: true,
      fileSizeLimit: 1024 * 1024 * 2, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
  }
}
