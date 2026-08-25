'use client';

import React, { useState } from 'react';
import type { AdminOrder } from '@/lib/adminData';

interface OrdersTabProps {
  orders: AdminOrder[];
  onAddOrder: (order: AdminOrder) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: AdminOrder['status']) => void;
  selectedOrderModal: AdminOrder | null;
  onCloseOrderModal: () => void;
  onOpenOrderModal: (order: AdminOrder) => void;
}

export function OrdersTab({
  orders,
  onAddOrder,
  onUpdateOrderStatus,
  selectedOrderModal,
  onCloseOrderModal,
  onOpenOrderModal,
}: OrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [showManualModal, setShowManualModal] = useState(false);

  // Manual Order Form State
  const [manualName, setManualName] = useState('');
  const [manualMobile, setManualMobile] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualModTitle, setManualModTitle] = useState('Purple Cat Girl Livery - Annis Elegy RH8');
  const [manualMethod, setManualMethod] = useState<'upi' | 'razorpay' | 'paypal' | 'binance'>('upi');
  const [manualAmountUsd, setManualAmountUsd] = useState(4.99);

  // Filtered orders list (only successful/completed orders)
  const filteredOrders = orders.filter((ord) => {
    if (ord.status !== 'completed') return false;

    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerMobile.includes(searchQuery) ||
      ord.modTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGateway = gatewayFilter === 'all' || ord.paymentMethod === gatewayFilter;

    return matchesSearch && matchesGateway;
  });

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualMobile) {
      alert('Please enter Customer Name and Mobile Number.');
      return;
    }

    const newOrd: AdminOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: manualName,
      customerEmail: manualEmail || `${manualName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      customerMobile: manualMobile,
      country: 'India',
      countryFlag: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg',
      modTitle: manualModTitle,
      modSlug: manualModTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      modCategory: 'Paint Jobs',
      paymentMethod: manualMethod,
      amountUsd: manualAmountUsd,
      amountInr: Math.round(manualAmountUsd * 83.5),
      status: 'completed',
      date: new Date().toLocaleString(),
      gatewayTxnId: `MANUAL_ADMIN_${Date.now()}`,
    };

    onAddOrder(newOrd);
    setShowManualModal(false);
    setManualName('');
    setManualMobile('');
    setManualEmail('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* BAR ACTIONS & FILTERS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Customer Orders &amp; Invoices ({filteredOrders.length})
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Search, filter, inspect and issue manual orders
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            style={{
              backgroundColor: '#1a1749',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <i className="fa fa-plus-circle" />
            <span>Generate Manual Order</span>
          </button>
        </div>

        {/* SEARCH & FILTERS ROW */}
        <div className="row" style={{ margin: 0 }}>
          {/* Search Box */}
          <div className="col-sm-6 col-md-6" style={{ padding: '4px' }}>
            <div style={{ position: 'relative' }}>
              <i className="fa fa-search" style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name or Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Gateway Filter */}
          <div className="col-sm-6 col-md-6" style={{ padding: '4px' }}>
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="all">All Payment Gateways</option>
              <option value="upi">UPI / QR (India)</option>
              <option value="razorpay">Razorpay</option>
              <option value="paypal">PayPal</option>
              <option value="binance">Binance Pay (Crypto)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ORDERS DATA TABLE */}
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
                <th style={{ padding: '12px' }}>Order ID</th>
                <th style={{ padding: '12px' }}>Customer Info</th>
                <th style={{ padding: '12px' }}>Mod Purchased</th>
                <th style={{ padding: '12px' }}>Gateway</th>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No orders match your current filter query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{ord.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{ord.customerName}</div>
                      <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {ord.countryFlag && <img src={ord.countryFlag} alt="" style={{ width: 14, height: 10, objectFit: 'cover' }} />}
                        <span>{ord.customerMobile}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 500, color: '#334155' }}>
                      {ord.modTitle}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          color: '#334155',
                        }}
                      >
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: 12, color: '#64748b' }}>{ord.date}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                      ${Number(ord.amountUsd).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
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
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => onOpenOrderModal(ord)}
                          style={{
                            backgroundColor: '#1a1749',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 10px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="View Invoice & Download Key"
                        >
                          <i className="fa fa-eye" /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrderModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 580,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="fa fa-file-text-o" style={{ color: '#ffffff', fontSize: 18 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                  Order Invoice: {selectedOrderModal.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={onCloseOrderModal}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: 20 }}>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: 8, padding: 14, marginBottom: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Customer Name:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{selectedOrderModal.customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Mobile Number:</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedOrderModal.customerMobile}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Payment Method:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#1a1749' }}>{selectedOrderModal.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>Gateway Ref:</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#334155' }}>{selectedOrderModal.gatewayTxnId}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => alert(`Resent SMS invoice & download link to ${selectedOrderModal.customerMobile}`)}
                  style={{ flex: 1, fontWeight: 600, fontSize: 13, padding: '10px', backgroundColor: '#f4f4f5', color: '#0a0a0a', border: '1px solid #d4d4d8', borderRadius: 6, cursor: 'pointer' }}
                >
                  <i className="fa fa-commenting" style={{ marginRight: 6 }} /> Resend SMS
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{ flex: 1, fontWeight: 700, fontSize: 13, padding: '10px', backgroundColor: '#1a1749', color: '#ffffff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  <i className="fa fa-print" style={{ marginRight: 6 }} /> Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL ORDER MODAL */}
      {showManualModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 500,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                Generate Manual Order
              </h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goverdhan Sharma"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Mobile Number (With Country Code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0000000000"
                  value={manualMobile}
                  onChange={(e) => setManualMobile(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Mod Product
                </label>
                <select
                  value={manualModTitle}
                  onChange={(e) => setManualModTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, backgroundColor: '#ffffff' }}
                >
                  <option value="Purple Cat Girl Livery - Annis Elegy RH8">Purple Cat Girl Livery ($4.99)</option>
                  <option value="Bugatti Chiron Super Sport 300+ Custom">Bugatti Chiron Super Sport ($9.99)</option>
                  <option value="Realistic GTA 5 Graphics ENB ReShade 2026">ENB Graphics ReShade ($6.50)</option>
                  <option value="Lamborghini Revuelto Hybrid 2025">Lamborghini Revuelto ($12.00)</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Payment Method
                </label>
                <select
                  value={manualMethod}
                  onChange={(e) => setManualMethod(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13, backgroundColor: '#ffffff' }}
                >
                  <option value="upi">UPI / QR (India)</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="paypal">PayPal</option>
                  <option value="binance">Binance Pay</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Generate Manual Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
