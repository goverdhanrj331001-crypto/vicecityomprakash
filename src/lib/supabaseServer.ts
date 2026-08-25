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
  const localCustom = getLocalCustomMods();
  const mockMods = [...LATEST_MODS, ...MOST_LIKED_MODS];
  const defaultList: Mod[] = [...localCustom];
  mockMods.forEach((m) => {
    if (!defaultList.some((p) => p.slug === m.slug)) {
      defaultList.push(m);
    }
  });

  if (!supabase || !isSupabaseConfigured()) {
    let result = defaultList;
    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(m => m.category.toLowerCase().replace(/\s+/g, '') === categorySlug.toLowerCase().replace(/\s+/g, ''));
    }
    return result;
  }

  try {
    let query = supabase
      .from('mods')
      .select('*')
      .order('created_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      query = query.ilike('category', categorySlug);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      let result = defaultList;
      if (categorySlug && categorySlug !== 'all') {
        result = result.filter(m => m.category.toLowerCase().replace(/\s+/g, '') === categorySlug.toLowerCase().replace(/\s+/g, ''));
      }
      return result;
    }

    const supabaseMods = data.map((item: any) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      version: item.version || '1.0.0',
      category: item.category || 'paintjobs',
      subCategories: item.sub_categories || [item.category],
      author: {
        username: item.author || 'GtaModderPro',
      },
      stats: {
        downloads: item.downloads || 0,
        likes: item.likes || 0,
        rating: item.rating || 5,
        commentsCount: item.comments_count || 0,
      },
      tags: (item.tags || []).map((t: string) => ({ name: t, slug: t.toLowerCase() })),
      description: item.description || '',
      coverImage: item.cover_image || '/images/catgirl_1.jpg',
      thumbnailImages: item.thumbnail_images && item.thumbnail_images.length > 0 ? item.thumbnail_images : [item.cover_image || '/images/catgirl_1.jpg'],
      videoUrl: item.video_url || '',
      allVersions: [
        {
          version: item.version || '1.0.0',
          isCurrent: true,
          downloads: item.downloads || 0,
          fileSize: item.file_size || '15 MB',
          uploadedAt: item.created_at || new Date().toISOString(),
          downloadUrl: item.zip_url || '#',
        },
      ],
      firstUploadedAt: item.created_at || '',
      lastUpdatedAt: item.updated_at || item.created_at || '',
      isFeatured: item.is_featured || item.status === 'featured',
      price: item.price,
      fileSize: item.file_size,
    }));

    const combinedResult: Mod[] = [...supabaseMods];
    localCustom.forEach((m) => {
      if (!combinedResult.some((p) => p.slug === m.slug)) {
        combinedResult.push(m);
      }
    });

    let result = combinedResult;
    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(m => m.category.toLowerCase().replace(/\s+/g, '') === categorySlug.toLowerCase().replace(/\s+/g, ''));
    }
    return result;
  } catch (err) {
    console.error('Supabase getDynamicMods error, falling back to local list:', err);
    let result = defaultList;
    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(m => m.category.toLowerCase().replace(/\s+/g, '') === categorySlug.toLowerCase().replace(/\s+/g, ''));
    }
    return result;
  }
}

export async function getDynamicModBySlug(slug: string): Promise<Mod | null> {
  const supabase = getSupabase();
  const localCustom = getLocalCustomMods();
  const foundLocal = localCustom.find(m => m.slug === slug);

  if (!supabase || !isSupabaseConfigured()) {
    return foundLocal || null;
  }

  try {
    const { data, error } = await supabase
      .from('mods')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return foundLocal || null;
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      version: data.version || '1.0.0',
      category: data.category || 'paintjobs',
      subCategories: data.sub_categories || [data.category],
      author: {
        username: data.author || 'GtaModderPro',
      },
      stats: {
        downloads: data.downloads || 0,
        likes: data.likes || 0,
        rating: data.rating || 5,
        commentsCount: data.comments_count || 0,
      },
      tags: (data.tags || []).map((t: string) => ({ name: t, slug: t.toLowerCase() })),
      description: data.description || '',
      coverImage: data.cover_image || '/images/catgirl_1.jpg',
      thumbnailImages: data.thumbnail_images && data.thumbnail_images.length > 0 ? data.thumbnail_images : [data.cover_image || '/images/catgirl_1.jpg'],
      videoUrl: data.video_url || '',
      allVersions: [
        {
          version: data.version || '1.0.0',
          isCurrent: true,
          downloads: data.downloads || 0,
          fileSize: data.file_size || '15 MB',
          uploadedAt: data.created_at || new Date().toISOString(),
          downloadUrl: data.zip_url || '#',
        },
      ],
      firstUploadedAt: data.created_at || '',
      lastUpdatedAt: data.updated_at || data.created_at || '',
      isFeatured: data.is_featured || data.status === 'featured',
      price: data.price,
      fileSize: data.file_size,
    };
  } catch (err) {
    console.error('Supabase getDynamicModBySlug error:', err);
    return foundLocal || null;
  }
}
