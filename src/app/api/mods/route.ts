export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getAllProducts, saveCustomProduct, deleteCustomProductBySlug } from '@/lib/serverStorage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');

  const supabase = getSupabaseAdmin() || getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    const localProducts = getAllProducts();
    if (slug) {
      const found = localProducts.find((p) => p.slug === slug);
      return NextResponse.json(found || null);
    }
    let filtered = localProducts;
    if (category && category !== 'all') {
      filtered = localProducts.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, '') === category.toLowerCase().replace(/\s+/g, '')
      );
    }
    return NextResponse.json({ products: filtered, source: 'local_storage' });
  }

  try {
    let query = supabase.from('mods').select('*');
    if (slug) {
      const { data, error } = await query.eq('slug', slug).maybeSingle();
      if (error || !data) {
        // Fallback to local products if not found in Supabase
        const localProducts = getAllProducts();
        const found = localProducts.find((p) => p.slug === slug);
        return NextResponse.json(found || null);
      }
      return NextResponse.json(data);
    }

    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const supabaseData = data || [];
    // If Supabase has data, return it directly
    return NextResponse.json({ products: supabaseData, source: 'database' });
  } catch (err: any) {
    console.error('Error fetching mods from Supabase, falling back to local:', err);
    const localProducts = getAllProducts();
    let filtered = localProducts;
    if (category && category !== 'all') {
      filtered = localProducts.filter(
        (p) => p.category.toLowerCase().replace(/\s+/g, '') === category.toLowerCase().replace(/\s+/g, '')
      );
    }
    return NextResponse.json({ products: filtered, source: 'local_storage_fallback_error' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Normalize slug if not present
    let productSlug = body.slug;
    if (!productSlug && body.title) {
      productSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (!productSlug) {
      productSlug = `mod-${Date.now()}`;
    }

    const coverImg =
      body.coverImage ||
      body.cover_image ||
      (Array.isArray(body.thumbnailImages) && body.thumbnailImages[0]) ||
      '/images/catgirl_1.jpg';

    const rawThumbnails =
      body.thumbnailImages || body.thumbnail_images || (coverImg ? [coverImg] : []);
    const thumbnailArray = Array.isArray(rawThumbnails) ? rawThumbnails : [coverImg];

    const zipFileUrl =
      body.zipUrl || body.zip_url || 'https://download.gta5-mods.com/packages/mod-archive.zip';

    const validStatus =
      body.status === 'featured' || body.status === 'hidden' ? body.status : 'active';

    const videoUrlValue = body.videoUrl || body.video_url || '';

    const modDataForLocal = {
      ...body,
      slug: productSlug,
      coverImage: coverImg,
      thumbnailImages: thumbnailArray,
      videoUrl: videoUrlValue,
      zipUrl: zipFileUrl,
      status: validStatus,
    };

    // Always persist to local cache/storage as safety fallback
    saveCustomProduct(modDataForLocal);

    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Saved to local storage (Supabase not configured)',
        product: modDataForLocal,
      });
    }

    // Try to find category_id if available
    let categoryId = body.category_id || body.categoryId || null;
    const categoryName = body.category || 'Paint Jobs';

    if (!categoryId) {
      try {
        const { data: catRow } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${categoryName}%`)
          .limit(1)
          .maybeSingle();

        if (catRow?.id) {
          categoryId = catRow.id;
        }
      } catch (catErr) {
        console.warn('Category lookup notice:', catErr);
      }
    }

    // Prepare exact row payload strictly matching public.mods schema
    const payload: Record<string, any> = {
      slug: productSlug,
      title: body.title || 'Custom GTA 5 Mod',
      category: categoryName,
      price: Number(body.price || 0),
      version: body.version || '1.0.0',
      author: body.author || 'GtaModderPro',
      author_avatar: body.author_avatar || body.authorAvatar || null,
      author_discord: body.author_discord || body.authorDiscord || null,
      author_twitter: body.author_twitter || body.authorTwitter || null,
      author_patreon: body.author_patreon || body.authorPatreon || null,
      cover_image: coverImg,
      thumbnail_images: thumbnailArray,
      video_url: videoUrlValue,
      zip_url: zipFileUrl,
      description: body.description || '',
      file_size: body.fileSize || body.file_size || '15 MB',
      downloads: Number(body.downloads || 0),
      likes: Number(body.likes || 0),
      rating: Number(body.rating || 5.0),
      comments_count: Number(body.comments_count || body.commentsCount || 0),
      is_featured: validStatus === 'featured' || Boolean(body.is_featured),
      status: validStatus,
      tags: Array.isArray(body.tags) ? body.tags : [],
      sub_categories: Array.isArray(body.sub_categories)
        ? body.sub_categories
        : Array.isArray(body.subCategories)
        ? body.subCategories
        : [],
      updated_at: new Date().toISOString(),
    };

    if (categoryId) {
      payload.category_id = categoryId;
    }

    let { data, error } = await supabase
      .from('mods')
      .upsert([payload], { onConflict: 'slug' })
      .select();

    // If Supabase fails due to video_url column not existing on the user's remote table, retry without video_url
    if (error && (error.code === '42703' || error.message?.includes('video_url'))) {
      console.warn('video_url column might not exist yet in Supabase mods table, retrying upsert without video_url:', error.message);
      delete payload.video_url;
      const retryResult = await supabase
        .from('mods')
        .upsert([payload], { onConflict: 'slug' })
        .select();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('Supabase mods table insert/upsert error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          product: modDataForLocal,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product successfully saved to Supabase mods table!',
      product: data?.[0] || modDataForLocal,
    });
  } catch (err: any) {
    console.error('Error creating mod:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    // Always delete from local file system cache/storage
    deleteCustomProductBySlug(slug);

    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Deleted from local storage.',
      });
    }

    const { error } = await supabase.from('mods').delete().eq('slug', slug);

    if (error) {
      console.error('Failed to delete from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted from Supabase successfully' });
  } catch (err: any) {
    console.error('Error deleting mod:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


