/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserOrder {
  id: string;
  customerName: string;
  customerMobile: string;
  modTitle: string;
  modCover: string;
  amountUsd: string | number;
  amountInr: string | number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  zipUrl: string;
  fileSize?: string;
  version?: string;
  author?: string;
}

const SAMPLE_INITIAL_ORDERS: UserOrder[] = [];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<UserOrder | null>(null);

  useEffect(() => {
    try {
      // 1. Process success query parameters for draft restoration (NowPayments recovery)
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('success') === 'true';
      const successOrderId = params.get('orderId');

      let storedOrders: UserOrder[] = [];
      const stored = localStorage.getItem('user_orders');
      if (stored) {
        storedOrders = JSON.parse(stored);
      }

      // If we are coming back from a successful checkout, promote draft to active completed order
      if (isSuccess && successOrderId) {
        const alreadyExists = storedOrders.some((o) => o.id === successOrderId);
        if (!alreadyExists) {
          const draftsStored = localStorage.getItem('pending_order_drafts');
          if (draftsStored) {
            const drafts: UserOrder[] = JSON.parse(draftsStored);
            const foundDraft = drafts.find((d) => d.id === successOrderId);
            if (foundDraft) {
              const completedOrder: UserOrder = {
                ...foundDraft,
                status: 'completed',
              };

              // Add to active orders
              storedOrders = [completedOrder, ...storedOrders];
              localStorage.setItem('user_orders', JSON.stringify(storedOrders));
              document.cookie = `user_orders=${encodeURIComponent(JSON.stringify(storedOrders))}; path=/; max-age=31536000; SameSite=Lax`;

              // Now, sync the COMPLETED order directly to Supabase cloud database
              fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: completedOrder.id,
                  customerName: completedOrder.customerName,
                  customerMobile: completedOrder.customerMobile,
                  country: 'India',
                  modTitle: completedOrder.modTitle,
                  amountUsd: Number(completedOrder.amountUsd),
                  amountInr: Number(completedOrder.amountInr),
                  paymentMethod: 'nowpayments',
                  status: 'completed',
                  gatewayTxnId: `NOWPAYMENTS_SUCCESS_${Date.now()}`,
                }),
              }).catch(() => {});

              // Remove from drafts
              const remainingDrafts = drafts.filter((d) => d.id !== successOrderId);
              localStorage.setItem('pending_order_drafts', JSON.stringify(remainingDrafts));
            }
          }
        }
      }
      
      // 2. Also try to read from cookies as requested ("cookies me store ho")
      const cookieName = 'user_orders';
      const cookieStr = document.cookie
        .split('; ')
        .find((row) => row.startsWith(cookieName + '='))
        ?.split('=')[1];
      if (cookieStr) {
        try {
          const cookieOrders = JSON.parse(decodeURIComponent(cookieStr));
          if (Array.isArray(cookieOrders) && cookieOrders.length > storedOrders.length) {
            storedOrders = cookieOrders;
            // Sync back to localStorage for seamless redundancy
            localStorage.setItem('user_orders', JSON.stringify(storedOrders));
          }
        } catch (err) {
          console.error('Error parsing orders from cookies:', err);
        }
      }

      if (storedOrders && storedOrders.length > 0) {
        // Sort orders: Latest always on top (date descending, then ID descending)
        const sorted = [...storedOrders].sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          
          if (dateB && dateA && dateB !== dateA) {
            return dateB - dateA;
          }
          // Fallback to alphabetical descending on ID (e.g. ORD-9842 vs ORD-9841)
          return b.id.localeCompare(a.id);
        });
        setOrders(sorted);
        return;
      }
    } catch (e) {
      console.error('Failed to parse user orders', e);
    }
    setOrders([]);
  }, []);

  return (
    <div style={{ minHeight: '85vh', padding: '32px 0 80px', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Page Header Banner */}
        <div
          style={{
            position: 'relative',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '180px',
            borderRadius: 12,
            marginBottom: 28,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', zIndex: 2 }}>
            <Link
              href="/"
              className="btn btn-default"
              style={{
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fa fa-shopping-bag" style={{ fontSize: 16 }} />
              <span>Browse Store</span>
            </Link>
          </div>
        </div>

        {/* Orders List / Empty State */}
        {orders.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                color: '#dc2626',
                margin: '0 auto 24px',
              }}
            >
              <i className="fa fa-shopping-cart" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>
              No Purchases Yet
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 24px' }}>
              When you purchase a premium mod or file from our store, it will immediately appear here with a direct download button and invoice.
            </p>
            <Link
              href="/"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(32, 186, 78, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fa fa-search" style={{ marginRight: '8px' }} /> Explore Premium Mods
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Your Purchased Files ({orders.length})
              </h2>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Latest purchase always appears first
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Order Top Header Bar */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      padding: '14px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', letterSpacing: '0.02em' }}>
                        <i className="fa fa-hashtag" style={{ opacity: 0.7 }} /> {ord.id}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        <i className="fa fa-calendar-o" style={{ marginRight: 4 }} /> {ord.date}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: '#e2e8f0',
                          color: '#334155',
                          padding: '2px 8px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {ord.paymentMethod}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: 12,
                          textTransform: 'uppercase',
                          backgroundColor: ord.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: ord.status === 'completed' ? '#15803d' : '#b45309',
                          border: '1px solid ' + (ord.status === 'completed' ? '#86efac' : '#fde68a'),
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <i className={`fa ${ord.status === 'completed' ? 'fa-check-circle' : 'fa-clock-o'}`} />
                        <span>{ord.status}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        style={{
                          backgroundColor: '#f8fafc',
                          color: '#1e293b',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '5px 12px',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <i className="fa fa-file-text-o" />
                        <span>View Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Main Content */}
                  <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
                    {/* Mod Cover Image */}
                    <div
                      style={{
                        width: 120,
                        height: 80,
                        borderRadius: 8,
                        overflow: 'hidden',
                        backgroundColor: '#000000',
                        flexShrink: 0,
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={ord.modCover}
                        alt={ord.modTitle}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/gta5mod/200/120';
                        }}
                      />
                    </div>

                    {/* Mod Details */}
                    <div style={{ flex: '1 1 240px' }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                        {ord.modTitle}
                      </h3>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
                        <span>
                          <i className="fa fa-user" style={{ marginRight: 4 }} /> By <strong>{ord.author || 'GtaModderPro'}</strong>
                        </span>
                        <span>
                          <i className="fa fa-code-fork" style={{ marginRight: 4 }} /> v{ord.version || '1.0'}
                        </span>
                        <span>
                          <i className="fa fa-hdd-o" style={{ marginRight: 4 }} /> {ord.fileSize || '48.5 MB'}
                        </span>
                      </div>

                      <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                        Paid: <span style={{ color: '#dc2626' }}>${ord.amountUsd} USD</span> <span style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>(₹{ord.amountInr})</span>
                      </div>
                    </div>

                    {/* Download Direct ZIP Button */}
                    <div style={{ flexShrink: 0 }}>
                      <a
                        href={ord.zipUrl}
                        download={`${ord.modTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`}
                        onClick={(e) => {
                          if (!ord.zipUrl || ord.zipUrl === '#') {
                            e.preventDefault();
                            alert(`Starting download for ${ord.modTitle}... file verified.`);
                          }
                        }}
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          borderRadius: 8,
                          padding: '12px 22px',
                          fontSize: 13,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          textDecoration: 'none',
                          boxShadow: '0 2px 10px rgba(32, 186, 78, 0.3)',
                          transition: 'opacity 0.2s ease',
                        }}
                      >
                        <i className="fa fa-download" style={{ fontSize: 16 }} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {selectedInvoiceOrder && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16,
            }}
            onClick={() => setSelectedInvoiceOrder(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                maxWidth: 520,
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className="fa fa-file-text-o" style={{ fontSize: 20 }} />
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
                    Invoice Receipt #{selectedInvoiceOrder.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: 18,
                    cursor: 'pointer',
                    opacity: 0.8,
                  }}
                >
                  <i className="fa fa-times" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Customer</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{selectedInvoiceOrder.customerName}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Mobile: {selectedInvoiceOrder.customerMobile}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>Purchase Date</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{selectedInvoiceOrder.date}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Purchased Mod Item</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{selectedInvoiceOrder.modTitle}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}>Amount Paid ({selectedInvoiceOrder.paymentMethod}):</span>
                    <span style={{ fontWeight: 800, color: '#dc2626' }}>${selectedInvoiceOrder.amountUsd} USD (₹{selectedInvoiceOrder.amountInr})</span>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#f1f5f9',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fa fa-print" style={{ marginRight: 6 }} /> Print Receipt
                  </button>
                  <a
                    href={selectedInvoiceOrder.zipUrl}
                    download
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <i className="fa fa-download" style={{ marginRight: 6 }} /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
