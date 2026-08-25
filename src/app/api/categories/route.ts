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

    const { data, error } = await supabase.from('categories').upsert([
      {
        name: body.name,
        slug: body.slug,
        icon: body.icon || 'fa fa-cube',
        description: body.description || '',
        mods_count: Number(body.modsCount || 0),
        status: body.status || 'active',
      },
    ], { onConflict: 'slug' }).select();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data?.[0] || body });
  } catch (err: any) {
    console.error('Error saving category to Supabase:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
