import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PAYMENT_CONFIG } from '@/lib/adminData';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amountInInr, amountUsd, title, customerName, customerMobile, customerEmail } = await req.json();

    if (!amountInInr || amountInInr <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    let keyId = INITIAL_PAYMENT_CONFIG.razorpay.keyId;
    let keySecret = INITIAL_PAYMENT_CONFIG.razorpay.keySecret;

    const supabase = getSupabaseAdmin() || getSupabase();
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('id', 'razorpay')
        .single();

      if (data && data.config) {
        if (data.config.keyId) keyId = data.config.keyId;
        if (data.config.keySecret) keySecret = data.config.keySecret;
      }
    }

    if (!keyId || !keySecret || keySecret.includes('••••')) {
      return NextResponse.json(
        { error: 'Razorpay Key ID and Key Secret are not configured in Admin Settings. Please configure them in Payment Gateways.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(amountInInr) * 100);

    const authHeader = 'Basic ' + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');

    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: (orderId || `GTA5-${Date.now()}`).slice(0, 40),
        notes: {
          modTitle: title || 'GTA 5 Mod',
          customerName: customerName || '',
          customerMobile: customerMobile || '',
        },
      }),
    });

    const razorpayOrder = await razorpayRes.json();

    if (!razorpayRes.ok) {
      console.error('Razorpay API error response:', razorpayOrder);
      return NextResponse.json(
        { error: razorpayOrder.error?.description || 'Failed to create Razorpay order. Check your Razorpay Key ID & Secret.' },
        { status: razorpayRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: keyId.trim(),
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
