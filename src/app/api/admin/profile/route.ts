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

    const isAdminEmail =
      email === 'om961074@gmail.com' ||
      email === 'om961074@gmail.com' ||
      email === 'admin@gmail.com' ||
      email.toLowerCase().includes('admin') ||
      email.toLowerCase().includes('om');

    if (existingProfile) {
      if (isAdminEmail || existingProfile.role !== 'super_admin') {
        // Upgrade to super_admin so admin access is granted
        await supabase
          .from('users_profile')
          .update({ role: 'super_admin' })
          .eq('email', email);
        existingProfile.role = 'super_admin';
      }
      return NextResponse.json({ profile: existingProfile });
    }

    // 2. Create profile with super_admin role
    const defaultRole = 'super_admin';

    const { data: newProfile, error: insertError } = await supabase
      .from('users_profile')
      .insert([
        {
          user_id: userId || null,
          name: name || (isAdminEmail ? 'Admin' : email.split('@')[0]),
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
