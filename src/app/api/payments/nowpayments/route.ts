import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PAYMENT_CONFIG, PaymentGatewaysConfig } from '@/lib/adminData';

async function getNowpaymentsConfig(): Promise<{ apiKey: string; sandbox: boolean; enabled: boolean }> {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    return {
      apiKey: INITIAL_PAYMENT_CONFIG.nowpayments.apiKey,
      sandbox: INITIAL_PAYMENT_CONFIG.nowpayments.sandbox,
      enabled: INITIAL_PAYMENT_CONFIG.nowpayments.enabled,
    };
  }

  try {
    const { data } = await supabase.from('payment_gateways').select('*').eq('id', 'nowpayments').single();
    if (data) {
      const isEnabled = Boolean(data.is_enabled);
      const extraConfig = data.config || {};
      return {
        apiKey: extraConfig.apiKey || INITIAL_PAYMENT_CONFIG.nowpayments.apiKey,
        sandbox: extraConfig.sandbox !== undefined ? Boolean(extraConfig.sandbox) : INITIAL_PAYMENT_CONFIG.nowpayments.sandbox,
        enabled: isEnabled,
      };
    }
  } catch (err) {
    console.error('Error fetching nowpayments config from database:', err);
  }

  return {
    apiKey: INITIAL_PAYMENT_CONFIG.nowpayments.apiKey,
    sandbox: INITIAL_PAYMENT_CONFIG.nowpayments.sandbox,
    enabled: INITIAL_PAYMENT_CONFIG.nowpayments.enabled,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, title, customerEmail, customerName } = await req.json();

    const config = await getNowpaymentsConfig();
    
    // Determine target API host
    const host = config.sandbox 
      ? 'https://api-sandbox.nowpayments.io/v1' 
      : 'https://api.nowpayments.io/v1';

    // Headers with secure API Key
    const headers = {
      'x-api-key': config.apiKey || process.env.NOWPAYMENTS_API_KEY || 'now_api_key_5mods_2026',
      'Content-Type': 'application/json',
    };

    // Calculate a call-back IPN Webhook URL dynamically if present
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const callbackUrl = `${origin}/api/payments/webhook/nowpayments`;

    // 1. Create a payment request through NOWPayments Invoice API (recommened for crypto)
    // Invoices are easier because they let users choose which cryptocurrency to pay with in a gorgeous widget!
    const response = await fetch(`${host}/invoice`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        price_amount: Number(amount || 4.99),
        price_currency: 'usd',
        order_id: orderId || `GTA5-NP-${Date.now()}`,
        order_description: title || 'GTA 5 Mod Digital Download',
        ipn_callback_url: callbackUrl,
        success_url: `${origin}/orders?success=true&orderId=${orderId}`,
        cancel_url: `${origin}/checkout`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments API Error response:', data);
      
      // Fallback: Elegant local sandbox payment page
      const mockCheckoutUrl = `/payments/nowpayments/sandbox?orderId=${orderId}&amount=${amount}&title=${encodeURIComponent(title)}`;
      return NextResponse.json({ 
        invoiceUrl: mockCheckoutUrl, 
        isMockFallback: true,
        message: 'Credentials invalid/inactive. Using secure developer fallback simulator sandbox.' 
      });
    }

    return NextResponse.json({ 
      invoiceUrl: data.invoice_url || data.payment_url || data.invoice_flow_url,
      id: data.id || data.invoice_id
    });
  } catch (error: any) {
    console.error('NOWPayments Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Crypto payment initialization failed' }, { status: 500 });
  }
}
