import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_ORDERS } from '@/lib/adminData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const mobile = searchParams.get('mobile');

  const supabase = getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    return NextResponse.json({ orders: INITIAL_ORDERS, source: 'local_fallback' });
  }

  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (email) {
      query = query.eq('customer_email', email);
    }
    if (mobile) {
      query = query.eq('customer_mobile', mobile);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ orders: data, source: 'database' });
  } catch (err: any) {
    console.error('Error fetching orders from Supabase:', err);
    return NextResponse.json({ orders: INITIAL_ORDERS, source: 'error_fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Restrict saving: only successful/completed orders are written to database.
    if (body.status !== 'completed' && body.status !== 'success') {
      return NextResponse.json({
        success: true,
        orderId: body.orderId || `GTA5-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Order status updated.',
      });
    }

    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        orderId: body.orderId || `GTA5-${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Order recorded.',
      });
    }

    const { data, error } = await supabase.from('orders').insert([
      {
        order_id: body.orderId,
        customer_name: body.customerName,
        customer_email: body.customerEmail || `${body.customerMobile}@customer.gtamods.com`,
        customer_mobile: body.customerMobile,
        country: body.country || 'India',
        country_flag: body.countryFlag,
        mod_title: body.modTitle,
        mod_slug: body.modSlug || 'mod-package',
        mod_category: body.modCategory || 'paintjobs',
        payment_method: (() => {
          const pm = (body.paymentMethod || 'upi').toLowerCase();
          if (['upi', 'razorpay', 'paypal', 'binance', 'card'].includes(pm)) {
            return pm;
          }
          if (pm === 'nowpayments') {
            return 'binance';
          }
          return 'upi';
        })(),
        amount_usd: Number(body.amountUsd || 0),
        amount_inr: Number(body.amountInr || 0),
        status: body.status || 'completed',
        gateway_txn_id: body.gatewayTxnId || `TXN_${Date.now()}`,
        download_token: `DL_TOKEN_${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      },
    ]).select();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data?.[0] || body });
  } catch (err: any) {
    console.error('Error inserting order into Supabase:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
