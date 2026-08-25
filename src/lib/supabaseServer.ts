import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from './supabase';
import { LATEST_MODS, MOST_LIKED_MODS } from './mockData';
import type { Mod } from '@/types';
import fs from 'fs';
import path from 'path';

function mapAdminProductToMod(item: any): Mod {
  const categoryLower = (item.category || 'paintjobs').toLowerCase().replace(/\s+/g, '');
  return {
    id: item.id ? (typeof item.id === 'string' ? (isNaN(Number(item.id.replace('MOD-', ''))) ? 1000 + Math.floor(Math.random() * 1000) : Number(item.id.replace('MOD-', ''))) : item.id) : Math.floor(100 + Math.random() * 900),
    slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: item.title,
    version: item.version || '1.0.0',
    category: categoryLower as any,
    subCategories: [item.category || 'Paint Jobs'],
    author: {
      username: item.author || 'GtaModderPro',
    },
    stats: {
      downloads: item.downloads || 0,
      likes: item.likes || Math.floor((item.downloads || 0) * 0.1),
      rating: item.rating || 5,
      commentsCount: 0,
    },
    tags: [{ name: item.category || 'Paint Jobs', slug: categoryLower }],
    description: item.description || '',
    coverImage: item.coverImage || item.cover_image || '/images/catgirl_1.jpg',
    thumbnailImages: item.thumbnailImages || item.thumbnail_images || [item.coverImage || item.cover_image || '/images/catgirl_1.jpg'],
    videoUrl: item.videoUrl || item.video_url || '',
    allVersions: [
      {
        version: item.version || '1.0.0',
        isCurrent: true,
        downloads: item.downloads || 0,
        fileSize: item.fileSize || item.file_size || '15 MB',
        uploadedAt: item.createdDate || item.created_at || new Date().toISOString(),
        downloadUrl: item.zipUrl || item.zip_url || '#',
      },
    ],
    firstUploadedAt: item.createdDate || item.created_at || new Date().toISOString(),
    lastUpdatedAt: item.createdDate || item.created_at || new Date().toISOString(),
    isFeatured: item.status === 'featured' || item.is_featured,
    price: item.price,
    fileSize: item.fileSize || item.file_size,
  };
}

function getLocalCustomMods(): Mod[] {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/custom_products.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      const products = JSON.parse(data);
      return products.map((p: any) => mapAdminProductToMod(p));
    }
  } catch (err) {
    console.error('Error loading local custom mods:', err);
  }
  return [];
}

export async function getDynamicMods(categorySlug?: string): Promise<Mod[]> {
  const supabase = getSupabaseAdmin() || getSupabase();

  // If Supabase is NOT configured, use local custom storage or empty list
  if (!supabase || !isSupabaseConfigured()) {
    const localCustom = getLocalCustomMods();
    let result = localCustom;
    if (categorySlug && categorySlug !== 'all') {
      const target = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(
        (m) =>
          m.category.toLowerCase().replace(/[^a-z0-9]/g, '') === target ||
          (m.subCategories && m.subCategories.some((sc) => sc.toLowerCase().replace(/[^a-z0-9]/g, '') === target))
      );
    }
    return result;
  }

  try {
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching mods from Supabase:', error);
      return [];
    }

    const supabaseMods: Mod[] = data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      version: item.version || '1.0.0',
      category: (item.category || 'paintjobs').toLowerCase().replace(/[^a-z0-9]/g, '') as any,
      subCategories: item.sub_categories || [item.category || 'Paint Jobs'],
      author: {
        username: item.author || 'GtaModderPro',
      },
      stats: {
        downloads: Number(item.downloads || 0),
        likes: Number(item.likes || 0),
        rating: Number(item.rating || 5),
        commentsCount: Number(item.comments_count || 0),
      },
      tags: (item.tags || []).map((t: string) => ({ name: t, slug: t.toLowerCase().replace(/[^a-z0-9]/g, '') })),
      description: item.description || '',
      coverImage: item.cover_image || '/images/catgirl_1.jpg',
      thumbnailImages: item.thumbnail_images && item.thumbnail_images.length > 0 ? item.thumbnail_images : [item.cover_image || '/images/catgirl_1.jpg'],
      videoUrl: item.video_url || '',
      allVersions: [
        {
          version: item.version || '1.0.0',
          isCurrent: true,
          downloads: Number(item.downloads || 0),
          fileSize: item.file_size || '15 MB',
          uploadedAt: item.created_at || new Date().toISOString(),
          downloadUrl: item.zip_url || '#',
        },
      ],
      firstUploadedAt: item.created_at || '',
      lastUpdatedAt: item.updated_at || item.created_at || '',
      isFeatured: Boolean(item.is_featured || item.status === 'featured'),
      price: item.price !== undefined ? Number(item.price) : 0,
      fileSize: item.file_size,
    }));

    let result = supabaseMods;
    if (categorySlug && categorySlug !== 'all') {
      const target = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(
        (m) =>
          m.category.toLowerCase().replace(/[^a-z0-9]/g, '') === target ||
          (m.subCategories && m.subCategories.some((sc) => sc.toLowerCase().replace(/[^a-z0-9]/g, '') === target)) ||
          (m.tags && m.tags.some((t) => t.slug === target))
      );
    }
    return result;
  } catch (err) {
    console.error('Supabase getDynamicMods error:', err);
    return [];
  }
}

export async function getDynamicModBySlug(slug: string): Promise<Mod | null> {
  const supabase = getSupabaseAdmin() || getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    const localCustom = getLocalCustomMods();
    return localCustom.find((m) => m.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      version: data.version || '1.0.0',
      category: (data.category || 'paintjobs').toLowerCase().replace(/[^a-z0-9]/g, '') as any,
      subCategories: data.sub_categories || [data.category || 'Paint Jobs'],
      author: {
        username: data.author || 'GtaModderPro',
      },
      stats: {
        downloads: Number(data.downloads || 0),
        likes: Number(data.likes || 0),
        rating: Number(data.rating || 5),
        commentsCount: Number(data.comments_count || 0),
      },
      tags: (data.tags || []).map((t: string) => ({ name: t, slug: t.toLowerCase().replace(/[^a-z0-9]/g, '') })),
      description: data.description || '',
      coverImage: data.cover_image || '/images/catgirl_1.jpg',
      thumbnailImages: data.thumbnail_images && data.thumbnail_images.length > 0 ? data.thumbnail_images : [data.cover_image || '/images/catgirl_1.jpg'],
      videoUrl: data.video_url || '',
      allVersions: [
        {
          version: data.version || '1.0.0',
          isCurrent: true,
          downloads: Number(data.downloads || 0),
          fileSize: data.file_size || '15 MB',
          uploadedAt: data.created_at || new Date().toISOString(),
          downloadUrl: data.zip_url || '#',
        },
      ],
      firstUploadedAt: data.created_at || '',
      lastUpdatedAt: data.updated_at || data.created_at || '',
      isFeatured: Boolean(data.is_featured || data.status === 'featured'),
      price: data.price !== undefined ? Number(data.price) : 0,
      fileSize: data.file_size,
    };
  } catch (err) {
    console.error('Supabase getDynamicModBySlug error:', err);
    return null;
  }
}
