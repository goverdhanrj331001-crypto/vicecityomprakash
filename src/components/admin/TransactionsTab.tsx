'use client';

import React, { useState } from 'react';
import type { AdminTransaction } from '@/lib/adminData';

interface TransactionsTabProps {
  transactions: AdminTransaction[];
}

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [search, setSearch] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('all');

  const filtered = transactions.filter((t) => {
    // Only verify and display completed / successful transactions
    if (t.status !== 'success') return false;

    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(search.toLowerCase());

    const matchesGateway = gatewayFilter === 'all' || t.gateway === gatewayFilter;

    return matchesSearch && matchesGateway;
  });

  const totalGross = filtered.reduce((s, t) => s + t.grossUsd, 0);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Order ID', 'Customer', 'Gateway', 'Ref', 'Amount USD', 'Status', 'Date'];
    const rows = filtered.map((t) => [
      t.id,
      t.orderId,
      `"${t.customer}"`,
      t.gateway,
      `"${t.gatewayRef}"`,
      t.grossUsd,
      t.status,
      `"${t.date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `5mods_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* SUMMARY STATS */}
      <div className="row" style={{ margin: 0 }}>
        <div className="col-xs-12 col-sm-4" style={{ padding: '0 8px 12px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Total Gross Volume</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>${totalGross.toFixed(2)}</div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-4" style={{ padding: '0 8px 12px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Completed Transactions</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0284c7' }}>{filtered.length} Orders</div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-4" style={{ padding: '0 8px 12px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Net Earnings Payout</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#15803d' }}>${totalGross.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* HEADER BAR */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Transaction Ledger &amp; Gateway Logs ({filtered.length})
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Audit payment receipts across Paytm UPI, Razorpay, PayPal, and Binance USDT
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fa fa-download" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* SEARCH ROW */}
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="Search Txn ID, Customer, or Gateway Ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '9px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
        />
        <select
          value={gatewayFilter}
          onChange={(e) => setGatewayFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13, backgroundColor: '#ffffff' }}
        >
          <option value="all">All Gateways</option>
          <option value="upi">UPI / QR</option>
          <option value="razorpay">Razorpay</option>
          <option value="paypal">PayPal</option>
          <option value="binance">Binance</option>
        </select>
      </div>

      {/* TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover" style={{ fontSize: 13, verticalAlign: 'middle', margin: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Txn ID</th>
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Gateway</th>
                <th style={{ padding: '12px' }}>Gateway Reference ID</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{t.id}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0284c7' }}>{t.orderId}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#1e293b' }}>{t.customer}</td>
                  <td style={{ padding: '12px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700, color: '#475569' }}>
                    {t.gateway}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: 11, color: '#64748b' }}>
                    {t.gatewayRef}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>${t.grossUsd.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: t.status === 'success' ? '#e8f8ed' : '#fef3c7',
                        color: t.status === 'success' ? '#15803d' : '#b45309',
                      }}
                    >
                      {t.status.toUpperCase()}
                    </span>
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
