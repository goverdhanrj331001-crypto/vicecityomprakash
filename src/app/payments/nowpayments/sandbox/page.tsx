'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface CryptoAsset {
  symbol: string;
  name: string;
  rateToUsd: number; // 1 Coin = X USD
  address: string;
  logo: string;
}

// 100% Reliable Inline SVG Icons for Cryptocurrencies
const getCryptoSvg = (symbol: string, size = 32) => {
  switch (symbol) {
    case 'BTC':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path d="M22.2 14.1c.4-2.4-1.5-3.7-4-4.5l.8-3.2-2-.5-.8 3.1c-.5-.1-1.1-.3-1.6-.4l.8-3.1-2-.5-.8 3.2c-.4-.1-.9-.2-1.4-.3L11.2 5l-.4 1.5s1 .2.9.3c.5.1.8.4.8.9l-.8 3.3c.1 0 .2.1.3.1l.8-3.2c.5.1 1 .2 1.5.3l-.8 3.2 2 .5.8-3.1c.5.1 1.1.3 1.6.4l-.8 3.1 2 .5.8-3.3c.4.1.8.2 1.1.2 3.3.6 5.6-1.1 6.1-3.9.4-2.2-.8-3.5-2.5-4.2 1.2-.3 2.1-1.1 2.3-2.8zm-4.1 6.2c-.6 2.4-4.7 1.1-6 1.1l-.9 3.7c-.4.1-.8.2-1.3.1l.9-3.7c-.5-.1-1-.2-1.6-.3l-2.2-.5.4-1.6s1.2.3 1.2.3c.7.2.9.1 1.1-.1l.9-3.7c-.1 0-.2-.1-.3-.1l-.9 3.7c-.5-.1-1-.2-1.5-.3l-1.2-.3.4-1.6c1.3.3 2.6.6 3.9.9.5.1.9.3 1.1.5.6.5.9 1.1.8 1.9s-.4 1.3-1 1.6l1.2 1.7zm1.1-6.1c-.5 2.1-4.2 1-5.4 1l-.6 2.7c1.1.3 4.9.8 5.4-1.3.5-2.1-1-2.9-2.2-3.1-.9-.1-1.7-.2-2.5-.2l.6-2.5c1.4.3 5.2 1.3 4.7 3.4z" fill="white" />
        </svg>
      );
    case 'ETH':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <path d="M16.5 4v9.3l7.3 3.3-7.3-12.6z" fill="#FFF" fillOpacity="0.602" />
          <path d="M16.5 4L9.2 16.6l7.3-3.3V4z" fill="#FFF" />
          <path d="M16.5 22.1v5.9l7.3-10.2-7.3 4.3z" fill="#FFF" fillOpacity="0.602" />
          <path d="M16.5 28v-5.9l-7.3-4.3 7.3 10.2z" fill="#FFF" />
          <path d="M16.5 20.8l7.3-4.2-7.3-3.3v7.5z" fill="#FFF" fillOpacity="0.2" />
          <path d="M9.2 16.6l7.3 4.2v-7.5l-7.3 3.3z" fill="#FFF" fillOpacity="0.602" />
        </svg>
      );
    case 'USDT':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#26A17B" />
          <path d="M18.2 13.9v-2.3h5.1V8.5H8.7v3.1h5.1v2.3c-3.6.2-6.3 1-6.3 2.1 0 1.1 2.7 1.9 6.3 2.1v6.9h4.4v-6.9c3.6-.2 6.3-1 6.3-2.1 0-1.1-2.7-1.9-6.3-2.1zm0 3.7c-.4.1-.9.1-1.4.1s-1 0-1.4-.1c-2.9-.2-5.1-.8-5.1-1.5s2.2-1.3 5.1-1.5c.4 0 .9-.1 1.4-.1s1 0 1.4.1c2.9.2 5.1.8 5.1 1.5s-2.2 1.3-5.1 1.5z" fill="white" />
        </svg>
      );
    case 'LTC':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#BFBBBB" />
          <path d="M18.8 19.4l.9-3.4 3.1-1.1.7-2.6-3.1 1.1 1.2-4.5H18l-1.2 4.5-2.6.9-.7 2.6 2.6-.9-.9 3.4H11.5l-.7 2.6H23l.7-2.6H18.8z" fill="white" />
        </svg>
      );
    default:
      return null;
  }
};

// Beautiful NOWPayments Logo Rendered via Inline SVG
const NOWPaymentsLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#dc2626" />
      <path d="M9 10L14 16L9 22H15L20 16L15 10H9Z" fill="white" />
      <path d="M17 10L22 16L17 22H23L28 16L23 10H17Z" fill="white" fillOpacity="0.6" />
    </svg>
    <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 800, fontSize: '16px', color: '#10b981', letterSpacing: '-0.3px' }}>
      NOW<span style={{ color: '#475569' }} className="dark:text-slate-300">Payments</span>
    </span>
  </div>
);

const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    rateToUsd: 59100,
    address: '1NowP8sB2cK3YmDfMPTfTL5SLmv7DivfNa',
    logo: '',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    rateToUsd: 2650,
    address: '0x38612fe38aefd3c33ab9938d8bcf5c3614cf2c8e',
    logo: '',
  },
  {
    symbol: 'USDT',
    name: 'Tether (ERC-20)',
    rateToUsd: 1.0,
    address: '0x38612fe38aefd3c33ab9938d8bcf5c3614cf2c8e',
    logo: '',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    rateToUsd: 64.5,
    address: 'LNowP8sB2cK3YmDfMPTfTL5SLmv7DivfNa',
    logo: '',
  },
];

function SandboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams?.get('orderId') || 'GTA5-102938';
  const amountStr = searchParams?.get('amount') || '4.99';
  const title = searchParams?.get('title') || 'GTA 5 Graphic Mod Pack';

  const amount = parseFloat(amountStr);

  const [activeTab, setActiveTab] = useState<'choose' | 'deposit'>('choose');
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(CRYPTO_ASSETS[0]);
  const [copied, setCopied] = useState(false);
  
  // Simulator states
  const [paymentStatus, setPaymentStatus] = useState<'waiting' | 'confirming' | 'completed'>('waiting');
  const [confirmProgress, setConfirmProgress] = useState(0);

  // Conversion of price
  const cryptoAmount = (amount / selectedAsset.rateToUsd).toFixed(selectedAsset.symbol === 'BTC' ? 6 : 4);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedAsset.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startSimulator = async () => {
    if (paymentStatus !== 'waiting') return;
    
    setPaymentStatus('confirming');
    setConfirmProgress(10);

    const interval = setInterval(() => {
      setConfirmProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 400);

    setTimeout(async () => {
      try {
        // 1. Sync Supabase status to completed
        const res = await fetch('/api/payments/nowpayments/simulator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status: 'completed' }),
        });

        // 2. Sync localStorage orders from drafts if found
        let localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        const draftOrders = JSON.parse(localStorage.getItem('pending_order_drafts') || '[]');
        const foundDraft = draftOrders.find((d: any) => d.id === orderId);
        
        if (foundDraft) {
          const completedObj = { ...foundDraft, status: 'completed' };
          localOrders = [completedObj, ...localOrders.filter((o: any) => o.id !== orderId)];
          const remainingDrafts = draftOrders.filter((d: any) => d.id !== orderId);
          localStorage.setItem('pending_order_drafts', JSON.stringify(remainingDrafts));
        } else {
          localOrders = localOrders.map((ord: any) => {
            if (ord.id === orderId) {
              return { ...ord, status: 'completed' };
            }
            return ord;
          });
        }
        localStorage.setItem('user_orders', JSON.stringify(localOrders));
        document.cookie = `user_orders=${encodeURIComponent(JSON.stringify(localOrders))}; path=/; max-age=31536000; SameSite=Lax`;

        setPaymentStatus('completed');
        
        // 3. Redirect to thank you page
        setTimeout(() => {
          router.push(`/orders?success=true&orderId=${orderId}`);
        }, 1200);

      } catch (err) {
        console.error('Error simulating status:', err);
        setPaymentStatus('waiting');
      }
    }, 3200);
  };

  return (
    <div className="nowpay-sim-container">
      <div className="nowpay-sim-wrapper">
        
        {/* Header Ribbon */}
        <div className="nowpay-sim-top-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="nowpay-sim-badge">
              Sandbox Mode
            </span>
            <h1 className="nowpay-sim-title">
              NOWPayments Crypto Simulator
            </h1>
          </div>
          <div className="nowpay-sim-order-id">
            ID: {orderId}
          </div>
        </div>

        <div className="nowpay-sim-grid">
          
          {/* Main Widget Section (Simulates official NOWPayments Widget) */}
          <div className="nowpay-sim-widget">
            
            {/* Widget Top Header */}
            <div className="nowpay-sim-widget-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <NOWPaymentsLogo />
              </div>
              <div className="nowpay-sim-widget-status">
                <span className="nowpay-sim-status-dot"></span>
                Secure Crypto Channel
              </div>
            </div>

            {/* Steps Nav Tabs */}
            <div className="nowpay-sim-tabs">
              <button 
                onClick={() => paymentStatus === 'waiting' && setActiveTab('choose')}
                className={`nowpay-sim-tab-btn ${activeTab === 'choose' ? 'active' : ''}`}
                disabled={paymentStatus !== 'waiting'}
              >
                1. Choose asset
              </button>
              <button 
                onClick={() => setActiveTab('deposit')}
                className={`nowpay-sim-tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
              >
                2. Send deposit
              </button>
            </div>

            <div className="nowpay-sim-body">
              {/* TAB 1: CHOOSE ASSET */}
              {activeTab === 'choose' && (
                <div>
                  <h3>Select a currency to pay with:</h3>
                  
                  <div className="nowpay-sim-currency-grid">
                    {CRYPTO_ASSETS.map((asset) => {
                      const isSelected = selectedAsset.symbol === asset.symbol;
                      const calculatedCrypto = (amount / asset.rateToUsd).toFixed(asset.symbol === 'BTC' ? 6 : 4);
                      return (
                        <button
                          key={asset.symbol}
                          onClick={() => setSelectedAsset(asset)}
                          className={`nowpay-sim-currency-btn ${isSelected ? 'active' : ''}`}
                        >
                          <div className="nowpay-sim-currency-left">
                            <div className="nowpay-sim-crypto-icon flex items-center justify-center">
                              {getCryptoSvg(asset.symbol, 32)}
                            </div>
                            <div>
                              <div className="nowpay-sim-crypto-sym">{asset.symbol}</div>
                              <div className="nowpay-sim-crypto-name">{asset.name}</div>
                            </div>
                          </div>
                          <div className="nowpay-sim-crypto-right">
                            <div className="nowpay-sim-crypto-amount">{calculatedCrypto}</div>
                            <div className="nowpay-sim-crypto-rate">1 Coin = ${asset.rateToUsd.toLocaleString()}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="nowpay-sim-primary-btn"
                  >
                    Next step
                    <span className="fa fa-arrow-right" style={{ fontSize: '11px' }} />
                  </button>
                </div>
              )}

              {/* TAB 2: SEND DEPOSIT */}
              {activeTab === 'deposit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  <div className="nowpay-sim-amount-banner">
                    <div className="nowpay-sim-amount-banner-left">
                      <div className="nowpay-sim-crypto-icon flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
                        {getCryptoSvg(selectedAsset.symbol, 40)}
                      </div>
                      <div>
                        <div className="nowpay-sim-amount-title">Amount to pay</div>
                        <div className="nowpay-sim-amount-val">
                          {cryptoAmount} <span style={{ fontSize: '16px', color: '#dc2626', fontWeight: 700 }}>{selectedAsset.symbol}</span>
                        </div>
                        <div className="nowpay-sim-amount-usd">~ ${amount.toFixed(2)} USD</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => paymentStatus === 'waiting' && setActiveTab('choose')}
                      className="nowpay-sim-change-btn"
                      disabled={paymentStatus !== 'waiting'}
                    >
                      Change asset
                    </button>
                  </div>

                  <div className="nowpay-sim-deposit-grid">
                    
                    {/* QR Code */}
                    <div className="nowpay-sim-qr-box">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedAsset.symbol.toLowerCase()}:${selectedAsset.address}?amount=${cryptoAmount}`}
                        alt="Crypto Address QR Code"
                        width={160}
                        height={160}
                        referrerPolicy="no-referrer"
                      />
                      <span className="nowpay-sim-qr-label">Scan QR to pay</span>
                    </div>

                    {/* Address Fields */}
                    <div className="nowpay-sim-address-field-wrap">
                      <div style={{ marginBottom: '12px' }}>
                        <label className="nowpay-sim-address-label">
                          Deposit Address
                        </label>
                        <div className="nowpay-sim-address-input-bar">
                          <span className="nowpay-sim-address-text">
                            {selectedAsset.address}
                          </span>
                          <button
                            onClick={handleCopy}
                            className={`nowpay-sim-copy-button ${copied ? 'copied' : ''}`}
                          >
                            <span className={copied ? "fa fa-check" : "fa fa-copy"} style={{ marginRight: '6px' }} />
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="nowpay-sim-alert-info">
                        <strong>Note:</strong> Please send only <span style={{ fontWeight: 700 }}>{selectedAsset.symbol}</span> on its correct chain network. Sending any other tokens will result in permanent loss.
                      </div>
                    </div>

                  </div>

                  {/* Sandbox simulation tools inside the simulator */}
                  <div className="nowpay-sim-pane">
                    <div className="nowpay-sim-status-box">
                      
                      {paymentStatus === 'waiting' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div className="nowpay-sim-status-icon waiting">
                            <span className="fa fa-hourglass-half" />
                          </div>
                          <div>
                            <h4 className="nowpay-sim-status-title">Awaiting Blockchain Deposit</h4>
                            <p className="nowpay-sim-status-desc">Simulate sending the transaction from your wallet.</p>
                          </div>
                          <button
                            onClick={startSimulator}
                            className="nowpay-sim-status-btn"
                          >
                            <span className="fa fa-bolt" />
                            Simulate Payment Success
                          </button>
                        </div>
                      )}

                      {paymentStatus === 'confirming' && (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div className="nowpay-sim-status-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                            <span className="fa fa-spinner fa-spin" />
                          </div>
                          <div>
                            <h4 className="nowpay-sim-status-title">Blockchain Confirmation Pending</h4>
                            <p className="nowpay-sim-status-desc">Verifying tx hashes & syncing status with webhook IPN...</p>
                          </div>
                          <div className="nowpay-sim-progress-wrap">
                            <div 
                              className="nowpay-sim-progress-bar" 
                              style={{ width: `${confirmProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {paymentStatus === 'completed' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <div className="nowpay-sim-status-icon success">
                            <span className="fa fa-check-circle" />
                          </div>
                          <div>
                            <h4 className="nowpay-sim-status-title" style={{ color: '#10b981' }}>Payment Confirmed Successfully!</h4>
                            <p className="nowpay-sim-status-desc">Redirecting you to your digital download cabinet...</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

          {/* Sidebar Order Summary Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div className="nowpay-sim-sidebar-card">
              <h3>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="nowpay-sim-row">
                  <span>Product Title:</span>
                  <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
                </div>
                <div className="nowpay-sim-row">
                  <span>Order Reference:</span>
                  <span>{orderId}</span>
                </div>
                <div className="nowpay-sim-row">
                  <span>Payment Gateway:</span>
                  <span>NOWPayments (Crypto)</span>
                </div>
                <div className="nowpay-sim-row">
                  <span>Merchant Status:</span>
                  <span style={{ color: '#d97706', fontWeight: 700 }}>Sandbox Testnet</span>
                </div>
              </div>

              <div className="nowpay-sim-total-row">
                <span className="nowpay-sim-total-label">Total Due:</span>
                <span className="nowpay-sim-total-val">${amount.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="nowpay-sim-guarantee-card">
              <div className="nowpay-sim-guarantee-title">
                <span className="fa fa-shield" />
                Secure Checkout Guarantee
              </div>
              <p style={{ margin: 0 }}>
                This sandbox environment perfectly replicates the actual blockchain payment verification sequence used by NOWPayments. Real payments remain disabled until your admin uploads the private IPN token keys in settings.
              </p>
              <Link 
                href="/checkout"
                className="nowpay-sim-back-link"
              >
                <span className="fa fa-arrow-left" style={{ fontSize: '10px' }} /> Back to checkout
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function SandboxPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 font-semibold text-sm">Initializing Sandbox environment...</p>
        </div>
      </div>
    }>
      <SandboxContent />
    </Suspense>
  );
}
