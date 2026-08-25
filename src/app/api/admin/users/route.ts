import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({ users: [], source: 'local_empty' });
    }

    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users_profile:', error);
      return NextResponse.json({ users: [], error: error.message });
    }

    return NextResponse.json({ users: data || [], source: 'database' });
  } catch (err: any) {
    console.error('Users API error:', err);
    return NextResponse.json({ users: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({ success: true, user: body });
    }

    const { data, error } = await supabase.from('users_profile').upsert([
      {
        name: body.name,
        email: body.email,
        mobile: body.mobile || null,
        role: body.role || 'customer',
        status: body.status || 'active',
        orders_count: body.ordersCount || 0,
        total_spent: body.totalSpent || 0,
      },
    ]).select().maybeSingle();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, id, role, status } = await req.json();
    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({ success: true });
    }

    let query = supabase.from('users_profile').update({
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    });

    if (email) {
      query = query.eq('email', email);
    } else if (id) {
      query = query.eq('id', id);
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Update user error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
