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
            Configure merchant UPI VPA, Razorpay credentials, and Binance USDT settings
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
        {/* 1. UPI / QR GATEWAY */}
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
                <img src="https://thesvg.org/icons/upi/default.svg" alt="UPI" style={{ height: 24 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>UPI / QR Code (India)</h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.upi.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, upi: { ...config.upi, enabled: e.target.checked } })
                  }
                  style={{ width: 16, height: 16, accentColor: '#1a1749' }}
                />
                <span style={{ color: config.upi.enabled ? '#0a0a0a' : '#94a3b8' }}>
                  {config.upi.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Merchant UPI VPA ID (e.g. 5mods@upi / Paytm)
                </label>
                <input
                  type="text"
                  value={config.upi.vpaId}
                  onChange={(e) =>
                    setConfig({ ...config, upi: { ...config.upi, vpaId: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Merchant Display Name
                </label>
                <input
                  type="text"
                  value={config.upi.merchantName}
                  onChange={(e) =>
                    setConfig({ ...config, upi: { ...config.upi, merchantName: e.target.value } })
                  }
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.upi.autoVerifySms}
                    onChange={(e) =>
                      setConfig({ ...config, upi: { ...config.upi, autoVerifySms: e.target.checked } })
                    }
                    style={{ accentColor: '#1a1749' }}
                  />
                  <span>Enable Instant SMS Bank Verification for UPI</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 2. RAZORPAY GATEWAY */}
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
                <img src="https://thesvg.org/icons/razorpay/default.svg" alt="Razorpay" style={{ height: 22 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Razorpay Payment Gateway</h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.razorpay.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, razorpay: { ...config.razorpay, enabled: e.target.checked } })
                  }
                  style={{ width: 16, height: 16, accentColor: '#1a1749' }}
                />
                <span style={{ color: config.razorpay.enabled ? '#0a0a0a' : '#94a3b8' }}>
                  {config.razorpay.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Razorpay Key ID
                </label>
                <input
                  type="text"
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

        {/* 3. BINANCE PAY GATEWAY */}
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
                <img src="https://thesvg.org/icons/binance/default.svg" alt="Binance" style={{ height: 22 }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Binance Pay (Crypto USDT)</h3>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={config.binance.enabled}
                  onChange={(e) =>
                    setConfig({ ...config, binance: { ...config.binance, enabled: e.target.checked } })
                  }
                  style={{ width: 16, height: 16, accentColor: '#1a1749' }}
                />
                <span style={{ color: config.binance.enabled ? '#0a0a0a' : '#94a3b8' }}>
                  {config.binance.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Binance Merchant ID
                </label>
                <input
                  type="text"
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
                  value={config.binance.apiKey}
                  onChange={(e) =>
                    setConfig({ ...config, binance: { ...config.binance, apiKey: e.target.value } })
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
