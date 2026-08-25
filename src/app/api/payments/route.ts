import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PAYMENT_CONFIG, PaymentGatewaysConfig } from '@/lib/adminData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get('public') === 'true';

  const supabase = getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    // If not in Supabase mode, return fallback local configuration
    if (isPublic) {
      // For public checkout, mask secrets
      const publicConfig = {
        upi: { enabled: INITIAL_PAYMENT_CONFIG.upi.enabled, vpaId: INITIAL_PAYMENT_CONFIG.upi.vpaId, merchantName: INITIAL_PAYMENT_CONFIG.upi.merchantName },
        razorpay: { enabled: INITIAL_PAYMENT_CONFIG.razorpay.enabled, keyId: INITIAL_PAYMENT_CONFIG.razorpay.keyId },
        paypal: { enabled: INITIAL_PAYMENT_CONFIG.paypal.enabled, clientId: INITIAL_PAYMENT_CONFIG.paypal.clientId, mode: INITIAL_PAYMENT_CONFIG.paypal.mode },
        binance: { enabled: INITIAL_PAYMENT_CONFIG.binance.enabled, merchantId: INITIAL_PAYMENT_CONFIG.binance.merchantId, currency: INITIAL_PAYMENT_CONFIG.binance.currency },
        nowpayments: { enabled: INITIAL_PAYMENT_CONFIG.nowpayments.enabled, apiKey: INITIAL_PAYMENT_CONFIG.nowpayments.apiKey, ipnSecret: INITIAL_PAYMENT_CONFIG.nowpayments.ipnSecret, sandbox: INITIAL_PAYMENT_CONFIG.nowpayments.sandbox },
      };
      return NextResponse.json({ config: publicConfig, source: 'fallback_local' });
    }
    return NextResponse.json({ config: INITIAL_PAYMENT_CONFIG, source: 'fallback_local' });
  }

  try {
    const { data, error } = await supabase.from('payment_gateways').select('*');

    if (error || !data || data.length === 0) {
      // Return initial defaults if table empty or not seeded
      return NextResponse.json({ config: INITIAL_PAYMENT_CONFIG, source: 'default_initial' });
    }

    // Map rows from payment_gateways table into PaymentGatewaysConfig
    const config: PaymentGatewaysConfig = { ...INITIAL_PAYMENT_CONFIG };

    data.forEach((row: any) => {
      const id = row.id as 'upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments';
      if (id && config[id]) {
        const isEnabled = Boolean(row.is_enabled);
        const extraConfig = row.config || {};

        if (id === 'upi') {
          config.upi = {
            enabled: isEnabled,
            vpaId: extraConfig.vpaId || '5mods@upi',
            merchantName: extraConfig.merchantName || '5MODS Store',
            qrCodeUrl: extraConfig.qrCodeUrl || '',
            autoVerifySms: Boolean(extraConfig.autoVerifySms),
          };
        } else if (id === 'razorpay') {
          config.razorpay = {
            enabled: isEnabled,
            keyId: extraConfig.keyId || '',
            keySecret: isPublic ? '' : extraConfig.keySecret || '',
            webhookSecret: isPublic ? '' : extraConfig.webhookSecret || '',
          };
        } else if (id === 'paypal') {
          config.paypal = {
            enabled: isEnabled,
            clientId: extraConfig.clientId || '',
            secretKey: isPublic ? '' : extraConfig.secretKey || '',
            mode: extraConfig.mode || 'live',
          };
        } else if (id === 'binance') {
          config.binance = {
            enabled: isEnabled,
            merchantId: extraConfig.merchantId || '',
            apiKey: extraConfig.apiKey || '',
            secretKey: isPublic ? '' : extraConfig.secretKey || '',
            currency: extraConfig.currency || 'USDT',
          };
        } else if (id === 'nowpayments') {
          config.nowpayments = {
            enabled: isEnabled,
            apiKey: extraConfig.apiKey || '',
            ipnSecret: isPublic ? '' : extraConfig.ipnSecret || '',
            sandbox: extraConfig.sandbox !== undefined ? Boolean(extraConfig.sandbox) : true,
          };
        }
      }
    });

    return NextResponse.json({ config, source: 'database' });
  } catch (err: any) {
    console.error('Error fetching payment gateways from Supabase:', err);
    return NextResponse.json({ config: INITIAL_PAYMENT_CONFIG, source: 'error_fallback' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentGatewaysConfig = await req.json();
    const supabase = getSupabaseAdmin() || getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        config: body,
        message: 'Payment configuration saved locally.',
      });
    }

    // Upsert each gateway row into Supabase payment_gateways table
    const rows = [
      {
        id: 'upi',
        name: 'UPI / QR Code',
        is_enabled: Boolean(body.upi?.enabled),
        config: {
          vpaId: body.upi?.vpaId,
          merchantName: body.upi?.merchantName,
          autoVerifySms: body.upi?.autoVerifySms,
        },
        updated_at: new Date().toISOString(),
      },
      {
        id: 'razorpay',
        name: 'Razorpay',
        is_enabled: Boolean(body.razorpay?.enabled),
        config: {
          keyId: body.razorpay?.keyId,
          keySecret: body.razorpay?.keySecret,
          webhookSecret: body.razorpay?.webhookSecret,
        },
        updated_at: new Date().toISOString(),
      },
      {
        id: 'paypal',
        name: 'PayPal Express',
        is_enabled: Boolean(body.paypal?.enabled),
        config: {
          clientId: body.paypal?.clientId,
          secretKey: body.paypal?.secretKey,
          mode: body.paypal?.mode,
        },
        updated_at: new Date().toISOString(),
      },
      {
        id: 'binance',
        name: 'Binance Pay',
        is_enabled: Boolean(body.binance?.enabled),
        config: {
          merchantId: body.binance?.merchantId,
          apiKey: body.binance?.apiKey,
          secretKey: body.binance?.secretKey,
          currency: body.binance?.currency || 'USDT',
        },
        updated_at: new Date().toISOString(),
      },
      {
        id: 'nowpayments',
        name: 'NOWPayments Crypto',
        is_enabled: Boolean(body.nowpayments?.enabled),
        config: {
          apiKey: body.nowpayments?.apiKey,
          ipnSecret: body.nowpayments?.ipnSecret,
          sandbox: Boolean(body.nowpayments?.sandbox),
        },
        updated_at: new Date().toISOString(),
      },
    ];

    const { error } = await supabase.from('payment_gateways').upsert(rows, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Payment configurations saved successfully.' });
  } catch (err: any) {
    console.error('Error saving payment gateways to database:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
