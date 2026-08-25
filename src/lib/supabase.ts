import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AdminProduct, AdminOrder, AdminCategory, AdminTransaction, AdminUser } from './adminData';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CATEGORIES, INITIAL_TRANSACTIONS, INITIAL_USERS } from './adminData';
import { LATEST_MODS, MOST_LIKED_MODS, FEATURED_MODS } from './mockData';
import type { Mod, FeaturedMod } from '@/types';

// Browser-safe Supabase client (using anon key)
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project-id') || anonKey.includes('...') || anonKey.length < 30) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
}

// Server-side Supabase Admin client (using service role key)
let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey || url.includes('your-project-id') || serviceKey.includes('...') || serviceKey.length < 30) {
    return null;
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdminClient;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes('your-project-id') || anonKey.includes('...') || anonKey.length < 30) {
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────
// DATA FETCHING & SYNC HELPERS (Moved to supabaseServer.ts for client safety)
// ─────────────────────────────────────────────────────────────

/**
 * Save / Insert an order into Supabase
 */
export async function createSupabaseOrder(order: AdminOrder): Promise<boolean> {
  const supabase = getSupabaseAdmin() || getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('orders').insert([
      {
        order_id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_mobile: order.customerMobile,
        country: order.country,
        country_flag: order.countryFlag,
        mod_title: order.modTitle,
        mod_slug: order.modSlug,
        mod_category: order.modCategory,
        payment_method: order.paymentMethod,
        amount_usd: order.amountUsd,
        amount_inr: order.amountInr,
        status: order.status,
        gateway_txn_id: order.gatewayTxnId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to create order in Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error inserting order in Supabase:', e);
    return false;
  }
}

/**
 * Insert or Update Product / Mod in Supabase
 */
export async function upsertSupabaseProduct(product: AdminProduct): Promise<boolean> {
  const supabase = getSupabaseAdmin() || getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('mods').upsert([
      {
        slug: product.slug,
        title: product.title,
        category: product.category.toLowerCase().replace(/\s+/g, ''),
        price: product.price,
        author: product.author,
        downloads: product.downloads,
        rating: product.rating,
        status: product.status,
        file_size: product.fileSize,
        version: product.version,
        cover_image: product.coverImage,
        thumbnail_images: product.thumbnailImages || [product.coverImage],
        video_url: product.videoUrl || '',
        zip_url: product.zipUrl,
        description: product.description,
        updated_at: new Date().toISOString(),
      },
    ], { onConflict: 'slug' });

    if (error) {
      console.error('Failed to upsert product in Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error upserting product in Supabase:', e);
    return false;
  }
}
