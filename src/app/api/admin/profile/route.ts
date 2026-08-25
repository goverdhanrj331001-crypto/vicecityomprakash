import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        profile: {
          email,
          name: name || 'Admin',
          role: 'super_admin',
          status: 'active',
        },
      });
    }

    // 1. Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json({ profile: existingProfile });
    }

    // 2. If it's a designated admin email or first user, create profile with super_admin role
    const isAdminEmail =
      email === 'goverdhanrj331001@gmail.com' ||
      email === 'admin@gmail.com' ||
      email.includes('admin');

    const defaultRole = isAdminEmail ? 'super_admin' : 'customer';

    const { data: newProfile, error: insertError } = await supabase
      .from('users_profile')
      .insert([
        {
          user_id: userId || null,
          name: name || (isAdminEmail ? 'Goverdhan Admin' : email.split('@')[0]),
          email: email,
          role: defaultRole,
          status: 'active',
          orders_count: 0,
          total_spent: 0.0,
        },
      ])
      .select()
      .maybeSingle();

    if (insertError) {
      console.warn('Profile creation note:', insertError);
      return NextResponse.json({
        profile: {
          email,
          name: name || 'Admin User',
          role: defaultRole,
          status: 'active',
        },
      });
    }

    return NextResponse.json({ profile: newProfile });
  } catch (error: any) {
    console.error('API profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
