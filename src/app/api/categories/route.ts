export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_CATEGORIES } from '@/lib/adminData';

export async function GET(req: NextRequest) {
  const supabase = getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    return NextResponse.json({ categories: [], source: 'empty_db' });
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ categories: [], source: 'empty_db' });
    }

    const formatted = data.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon || 'fa fa-cube',
      description: c.description || '',
      modsCount: c.mods_count || 0,
      status: c.status || 'active',
    }));

    return NextResponse.json({ categories: formatted, source: 'database' });
  } catch (err: any) {
    console.error('Error fetching categories from Supabase:', err);
    return NextResponse.json({ categories: [], source: 'error_empty' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        category: body,
        message: 'Saved to local preview.',
      });
    }

    const payload: Record<string, any> = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: body.icon || body.imageUrl || body.image || 'fa fa-cube',
      description: body.description || '',
      mods_count: Number(body.modsCount || 0),
      status: body.status || 'active',
    };

    const { data, error } = await supabase
      .from('categories')
      .upsert([payload], { onConflict: 'slug' })
      .select();

    if (error) {
      console.error('Supabase categories upsert error:', error);
      // If error occurs due to missing columns or length, try fallback
      throw error;
    }

    return NextResponse.json({ success: true, category: data?.[0] || body });
  } catch (err: any) {
    console.error('Error saving category to Supabase:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, id } = body;

    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({ success: true, message: 'Deleted locally' });
    }

    let query = supabase.from('categories').delete();
    if (slug) {
      query = query.eq('slug', slug);
    } else if (id) {
      query = query.eq('id', id);
    } else {
      return NextResponse.json({ error: 'Missing slug or id parameter' }, { status: 400 });
    }

    const { error } = await query;
    if (error) {
      console.error('Failed to delete category from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
