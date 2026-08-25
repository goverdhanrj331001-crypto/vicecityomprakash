'use client';

import React from 'react';
import type { AdminOrder, AdminProduct, AdminUser } from '@/lib/adminData';

interface DashboardTabProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  users: AdminUser[];
  onNavigateTab: (tab: any) => void;
  onViewOrderDetails: (order: AdminOrder) => void;
}

export function DashboardTab({
  orders,
  products,
  users,
  onNavigateTab,
  onViewOrderDetails,
}: DashboardTabProps) {
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amountUsd, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const featuredProductsCount = products.filter((p) => p.status === 'featured' || p.status === 'active').length;

  // Real-time Payment Method Breakdown
  const totalCompletedCount = completedOrders.length || 1;
  const upiCount = completedOrders.filter((o) => o.paymentMethod === 'upi').length;
  const razorpayCount = completedOrders.filter((o) => o.paymentMethod === 'razorpay').length;
  const paypalCount = completedOrders.filter((o) => o.paymentMethod === 'paypal').length;
  const binanceCount = completedOrders.filter((o) => o.paymentMethod === 'binance').length;

  const upiPct = Math.round((upiCount / totalCompletedCount) * 100);
  const razorpayPct = Math.round((razorpayCount / totalCompletedCount) * 100);
  const paypalPct = Math.round((paypalCount / totalCompletedCount) * 100);
  const binancePct = Math.round((binanceCount / totalCompletedCount) * 100);

  // Dynamic monthly chart calculations (Months: Jan to Aug)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const monthlyRevenue = months.map((m, idx) => {
    const monthOrders = completedOrders.filter((o) => {
      if (!o.date) return false;
      const dateParts = o.date.split('-');
      if (dateParts.length >= 2) {
        return parseInt(dateParts[1], 10) === idx + 1;
      }
      return false;
    });
    const amount = monthOrders.reduce((sum, o) => sum + o.amountUsd, 0);
    return { month: m, amount };
  });

  const maxAmount = Math.max(...monthlyRevenue.map((r) => r.amount)) || 1;
  const chartItems = monthlyRevenue.map((item) => ({
    ...item,
    pct: maxAmount > 0 ? Math.round((item.amount / maxAmount) * 100) : 0,
  }));

  const avgMonthlyRev = completedOrders.length > 0 
    ? (totalRevenue / Math.max(1, new Date().getMonth() + 1))
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* METRIC KPI CARDS */}
      <div className="row" style={{ margin: 0 }}>
        {/* Card 1: Total Revenue */}
        <div className="col-xs-12 col-sm-6 col-md-3" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 20,
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Total Revenue
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fa fa-usd" />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: 12, color: '#0a0a0a', marginTop: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fa fa-arrow-up" />
              <span>+18.4% vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="col-xs-12 col-sm-6 col-md-3" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 20,
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Completed Orders
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fa fa-shopping-bag" />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {totalOrdersCount}
            </div>
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fa fa-clock-o" />
              <span>{pendingOrdersCount} pending verification</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="col-xs-12 col-sm-6 col-md-3" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 20,
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Active Products
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fa fa-cubes" />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {products.length}
            </div>
            <div style={{ fontSize: 12, color: '#71717a', marginTop: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fa fa-star" />
              <span>{featuredProductsCount} Active/Featured Mods</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Registered Users */}
        <div className="col-xs-12 col-sm-6 col-md-3" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 20,
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Registered Users
              </span>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                <i className="fa fa-users" />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em' }}>
              {users.length}
            </div>
            <div style={{ fontSize: 12, color: '#0a0a0a', marginTop: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fa fa-user-plus" />
              <span>Registered accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="row" style={{ margin: 0 }}>
        {/* Sales Chart Visualizer */}
        <div className="col-md-12" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 20,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  Monthly Revenue Performance (2026)
                </h3>
                <span style={{ fontSize: 12, color: '#64748b' }}>Digital mod sales across all gateways</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', backgroundColor: '#1a1749', padding: '4px 10px', borderRadius: 12 }}>
                Avg ${avgMonthlyRev.toLocaleString('en-US', { maximumFractionDigits: 0 })} / mo
              </span>
            </div>

            {/* Custom CSS Bar Visualizer */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, gap: 12, paddingTop: 20, borderBottom: '1px solid #f1f5f9' }}>
              {chartItems.map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>
                    ${item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 32,
                      height: `${item.pct}%`,
                      backgroundColor: idx === new Date().getMonth() ? '#1a1749' : '#cbd5e1',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#334155', marginTop: 8 }}>
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Recent Purchases &amp; Downloads</h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Latest customer transactions across all payment methods</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            style={{
              backgroundColor: '#1a1749',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            View All Orders &rarr;
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover" style={{ fontSize: 13, verticalAlign: 'middle', margin: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Mod Purchased</th>
                <th style={{ padding: '12px' }}>Method</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{ord.id}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{ord.customerName}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{ord.customerMobile}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#334155', fontWeight: 500 }}>{ord.modTitle}</td>
                  <td style={{ padding: '12px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: '#475569' }}>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>${ord.amountUsd} USD</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor:
                          ord.status === 'completed'
                            ? '#f4f4f5'
                            : ord.status === 'pending'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          ord.status === 'completed'
                            ? '#0f172a'
                            : ord.status === 'pending'
                            ? '#b45309'
                            : '#dc2626',
                      }}
                    >
                      {ord.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onViewOrderDetails(ord)}
                      className="btn btn-default btn-xs"
                      style={{ fontWeight: 600 }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
