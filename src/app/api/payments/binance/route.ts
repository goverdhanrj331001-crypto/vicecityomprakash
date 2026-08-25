import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PAYMENT_CONFIG } from '@/lib/adminData';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, title, customerName, customerMobile } = await req.json();

    let merchantId = INITIAL_PAYMENT_CONFIG.binance.merchantId;
    let apiKey = INITIAL_PAYMENT_CONFIG.binance.apiKey;
    let secretKey = INITIAL_PAYMENT_CONFIG.binance.secretKey;

    const supabase = getSupabaseAdmin() || getSupabase();
    if (supabase && isSupabaseConfigured()) {
      const { data } = await supabase
        .from('payment_gateways')
        .select('*')
        .eq('id', 'binance')
        .single();

      if (data && data.config) {
        if (data.config.merchantId) merchantId = data.config.merchantId;
        if (data.config.apiKey) apiKey = data.config.apiKey;
        if (data.config.secretKey) secretKey = data.config.secretKey;
      }
    }

    if (!apiKey || !secretKey || secretKey.includes('••••')) {
      return NextResponse.json(
        { error: 'Crypto payment service is temporarily unavailable. Please try another payment method.' },
        { status: 400 }
      );
    }

    const timestamp = Date.now().toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const returnUrl = `${req.nextUrl.origin}/orders?success=true&orderId=${orderId}`;
    const cancelUrl = `${req.nextUrl.origin}/checkout?canceled=true`;

    const payload = {
      env: {
        terminalType: 'WEB',
      },
      merchantTradeNo: `${orderId}_${Date.now()}`.slice(0, 32),
      orderAmount: Number(amount).toFixed(2),
      currency: 'USDT',
      goods: {
        goodsType: '02',
        goodsCategory: 'Z000',
        referenceGoodsId: orderId,
        goodsName: title || 'GTA 5 Mod Digital Download',
        goodsDetail: title || 'GTA 5 Mod Asset',
      },
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    };

    const jsonPayload = JSON.stringify(payload);
    const signaturePayload = `${timestamp}\n${nonce}\n${jsonPayload}\n`;
    const signature = crypto
      .createHmac('sha512', secretKey.trim())
      .update(signaturePayload)
      .digest('hex')
      .toUpperCase();

    const response = await fetch('https://bpay.binanceapi.com/binancepay/openapi/v2/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp,
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': apiKey.trim(),
        'BinancePay-Signature': signature,
      },
      body: jsonPayload,
    });

    const data = await response.json();

    if (data.status === 'SUCCESS' && data.data) {
      return NextResponse.json({
        success: true,
        checkoutUrl: data.data.universalUrl || data.data.checkoutUrl || data.data.deeplink,
        prepayId: data.data.prepayId,
      });
    }

    return NextResponse.json(
      { error: data.errorMessage || 'Binance Pay could not create order. Please verify your Merchant ID and API Keys.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Binance Pay API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
