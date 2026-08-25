'use client';

import React, { useState } from 'react';
import type { PaymentGatewaysConfig } from '@/lib/adminData';

interface PaymentsTabProps {
  paymentConfig: PaymentGatewaysConfig;
  onSavePaymentConfig: (config: PaymentGatewaysConfig) => void;
}

export function PaymentsTab({
  paymentConfig,
  onSavePaymentConfig,
}: PaymentsTabProps) {
  const [config, setConfig] = useState<PaymentGatewaysConfig>(paymentConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (paymentConfig) {
      setConfig(paymentConfig);
    }
  }, [paymentConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePaymentConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            Payment Gateway Settings &amp; API Keys
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Configure active merchant credentials for Razorpay (Cards/UPI/NetBanking) and Binance Pay (Crypto USDT)
          </p>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#1a1749',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fa fa-save" />
          <span>Save Gateway Configurations</span>
        </button>
      </div>

      {saveSuccess && (
        <div
          style={{
            backgroundColor: '#f4f4f5',
            border: '1px solid #d4d4d8',
            color: '#0a0a0a',
            padding: '14px 18px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="fa fa-check-circle" style={{ fontSize: 18 }} />
          <span>Payment Gateway Credentials Saved &amp; Updated Successfully!</span>
        </div>
      )}

      {/* GATEWAYS CARDS */}
      <div className="row" style={{ margin: 0 }}>
        {/* 1. RAZORPAY GATEWAY */}
        <div className="col-md-6" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 20,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" style={{ height: 20 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Razorpay Payment Gateway</h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({ ...config, razorpay: { ...config.razorpay, enabled: !config.razorpay.enabled } })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: config.razorpay.enabled ? '#16a34a' : '#e2e8f0',
                  color: config.razorpay.enabled ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: config.razorpay.enabled ? '#ffffff' : '#94a3b8',
                  }}
                />
                <span>{config.razorpay.enabled ? 'ENABLED' : 'DISABLED'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  placeholder="rzp_live_..."
                  value={config.razorpay.keyId}
                  onChange={(e) =>
                    setConfig({ ...config, razorpay: { ...config.razorpay, keyId: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Razorpay Key Secret
                </label>
                <input
                  type="password"
                  placeholder="Enter Key Secret"
                  value={config.razorpay.keySecret}
                  onChange={(e) =>
                    setConfig({ ...config, razorpay: { ...config.razorpay, keySecret: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. BINANCE PAY GATEWAY */}
        <div className="col-md-6" style={{ padding: '0 8px 16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 20,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg" alt="Binance" style={{ height: 20 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Binance Pay (Crypto USDT)</h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setConfig({ ...config, binance: { ...config.binance, enabled: !config.binance.enabled } })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: config.binance.enabled ? '#16a34a' : '#e2e8f0',
                  color: config.binance.enabled ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: config.binance.enabled ? '#ffffff' : '#94a3b8',
                  }}
                />
                <span>{config.binance.enabled ? 'ENABLED' : 'DISABLED'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Binance Merchant ID
                </label>
                <input
                  type="text"
                  placeholder="Merchant ID"
                  value={config.binance.merchantId}
                  onChange={(e) =>
                    setConfig({ ...config, binance: { ...config.binance, merchantId: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Binance Pay API Key
                </label>
                <input
                  type="text"
                  placeholder="API Key"
                  value={config.binance.apiKey}
                  onChange={(e) =>
                    setConfig({ ...config, binance: { ...config.binance, apiKey: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Binance Pay Secret Key
                </label>
                <input
                  type="password"
                  placeholder="Secret Key"
                  value={config.binance.secretKey}
                  onChange={(e) =>
                    setConfig({ ...config, binance: { ...config.binance, secretKey: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
