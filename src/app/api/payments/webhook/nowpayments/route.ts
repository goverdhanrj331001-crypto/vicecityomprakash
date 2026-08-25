import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PAYMENT_CONFIG } from '@/lib/adminData';

async function getIpnSecret(): Promise<string> {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    return INITIAL_PAYMENT_CONFIG.nowpayments.ipnSecret;
  }

  try {
    const { data } = await supabase.from('payment_gateways').select('*').eq('id', 'nowpayments').single();
    if (data) {
      const extraConfig = data.config || {};
      return extraConfig.ipnSecret || INITIAL_PAYMENT_CONFIG.nowpayments.ipnSecret;
    }
  } catch (err) {
    console.error('Error fetching IPN Secret from database:', err);
  }

  return INITIAL_PAYMENT_CONFIG.nowpayments.ipnSecret;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;
    
    // 1. Get the signature from header
    const signature = headers.get('x-nowpayments-sig');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    // 2. Fetch configured IPN secret securely
    const ipnSecret = await getIpnSecret();

    // 3. Cryptographically sign the raw content to compare signature (backend validation)
    // NOWPayments signs notifications using HMAC-SHA512 with IPN Secret Key
    const hmac = crypto.createHmac('sha512', ipnSecret);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest('hex');

    // If signature does not match, log a warning and reject the request!
    if (signature !== expectedSignature) {
      console.warn('Webhook received but signature was invalid. Rejecting spoofing attempt.');
      return NextResponse.json({ error: 'Signature Verification Failed' }, { status: 401 });
    }

    // 4. Parse payload
    const payload = JSON.parse(rawBody);
    const { payment_status, order_id, pay_address, pay_amount, payment_id } = payload;

    console.log(`NOWPayments Webhook received successfully. Order: ${order_id}, Status: ${payment_status}`);

    // If the payment is completed, update the database
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      const supabase = getSupabaseAdmin() || getSupabase();
      if (supabase && isSupabaseConfigured()) {
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'completed',
            gateway_txn_id: `NOWPAYMENTS_${payment_id || 'SUCCESS'}`,
          })
          .eq('order_id', order_id);

        if (error) {
          console.error('Error updating order on Webhook:', error);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      } else {
        console.log(`Database is in local mock mode. Simulating order completion for order: ${order_id}`);
      }
    }

    return NextResponse.json({ ok: true, message: 'Webhook parsed and validated successfully.' });
  } catch (error: any) {
    console.error('NOWPayments Webhook Process Error:', error);
    return NextResponse.json({ error: error.message || 'Webhook internal error' }, { status: 500 });
  }
}
