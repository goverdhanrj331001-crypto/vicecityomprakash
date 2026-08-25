import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { orderId, status } = await req.json();
    
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin() || getSupabase();
    if (supabase && isSupabaseConfigured()) {
      const { error } = await supabase
        .from('orders')
        .update({
          status: status || 'completed',
          gateway_txn_id: `NOWPAYMENTS_SANDBOX_${Math.floor(100000 + Math.random() * 900000)}`,
        })
        .eq('order_id', orderId);

      if (error) {
        console.error('Error updating order in simulator API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Order status updated successfully in sandbox.' });
  } catch (err: any) {
    console.error('NOWPayments Simulator Exception:', err);
    return NextResponse.json({ error: err.message || 'Simulator error' }, { status: 500 });
  }
}
