'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  price: string;
  coverImage?: string;
}

const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦' },
  { code: 'BR', name: 'Brazil', dial: '+55', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', dial: '+7', flag: '🇷🇺' },
  { code: 'OTHER', name: 'Other Country', dial: '+', flag: '🌐' },
];

export function CheckoutModal({
  isOpen,
  onClose,
  productTitle,
  price,
  coverImage = '/images/catgirl_1.jpg',
}: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'paypal' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedCountryObj = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 6) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div
      className="checkout-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(3px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        overflowY: 'auto',
      }}
    >
      <div
        className="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          maxWidth: 560,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          animation: 'fadeInDown 0.2s ease',
        }}
      >
        {/* Modal Header */}
        <div
          className="checkout-modal-header"
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa fa-shopping-bag" style={{ fontSize: 18 }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
                {isSuccess ? 'Order Completed!' : 'Complete Your Purchase'}
              </div>
              <div style={{ fontSize: 11, opacity: 0.9, marginTop: 2 }}>
                Instant Digital Delivery • 256-Bit SSL Encrypted
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: 24,
              cursor: 'pointer',
              lineHeight: 1,
              padding: 4,
            }}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Content Body */}
        <div
          className="checkout-modal-body"
          style={{
            padding: '18px 20px',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {isSuccess ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  margin: '0 auto 16px',
                }}
              >
                <i className="fa fa-check" />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>
                Payment Successful!
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
                Thank you <strong>{name}</strong>! Your download license for <strong>{productTitle}</strong> is ready.
                A confirmation SMS & download receipt has been sent to <strong>{selectedCountryObj.dial} {mobile}</strong>.
              </p>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: 16,
                  marginBottom: 20,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Item:</span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{productTitle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Amount Paid:</span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase', color: '#1e293b' }}>{paymentMethod}</span>
                </div>
              </div>

              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Starting instant download for .YTD and .RPF archive!');
                }}
                className="btn btn-success btn-block"
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#991b1b',
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <i className="fa fa-download" />
                <span>Download Mod Archive Now (.ZIP)</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-default btn-block"
                style={{ marginTop: 10 }}
              >
                Back to Mod Details
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder}>
              {/* Product Mini Preview */}
              <div
                className="checkout-item-preview"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 16,
                }}
              >
                <div style={{ width: 64, height: 44, position: 'relative', flexShrink: 0, borderRadius: 4, overflow: 'hidden' }}>
                  <Image
                    src={coverImage}
                    alt={productTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1e293b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {productTitle}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    4K Textures • GTA V & FiveM Compatible
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#dc2626',
                    flexShrink: 0,
                  }}
                >
                  {price}
                </div>
              </div>

              {errorMsg && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '8px 12px',
                    borderRadius: 4,
                    fontSize: 13,
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <i className="fa fa-exclamation-circle" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Responsive Container:
                  - Desktop: Details (Section 1) at Top, Payment (Section 2) below
                  - Mobile: Payment (Section 2) on Top, Details (Section 1) below
              */}
              <div className="checkout-responsive-sections">
                {/* SECTION 1: CUSTOMER DETAILS (Name, Mobile, Country) */}
                <div className="checkout-section-details">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1e293b',
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <i className="fa fa-user" style={{ color: '#dc2626' }} />
                    <span>1. Customer Details</span>
                  </div>

                  {/* Name Input */}
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, display: 'block' }}>
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control checkout-input"
                      placeholder="e.g. Rahul Sharma / John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{
                        height: 38,
                        borderRadius: 4,
                        fontSize: 13,
                        borderColor: '#cbd5e1',
                      }}
                    />
                  </div>

                  {/* Country Selector */}
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, display: 'block' }}>
                      Country <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="form-control checkout-input"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        style={{
                          height: 38,
                          borderRadius: 4,
                          fontSize: 13,
                          borderColor: '#cbd5e1',
                          paddingLeft: 36,
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                      <span
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: 9,
                          fontSize: 16,
                          pointerEvents: 'none',
                        }}
                      >
                        {selectedCountryObj.flag}
                      </span>
                      <i
                        className="fa fa-caret-down"
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: 13,
                          color: '#64748b',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile Number Input with Country Dial Code */}
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, display: 'block' }}>
                      Mobile Number (for SMS Receipt & Download Link) <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <div
                        style={{
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: 4,
                          padding: '0 10px',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#334155',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {selectedCountryObj.dial}
                      </div>
                      <input
                        type="tel"
                        className="form-control checkout-input"
                        placeholder="0000000000"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        required
                        style={{
                          height: 38,
                          borderRadius: 4,
                          fontSize: 13,
                          borderColor: '#cbd5e1',
                          flex: 1,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PAYMENT METHODS */}
                <div className="checkout-section-payment">
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1e293b',
                      textTransform: 'uppercase',
                      letterSpacing: 0.4,
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <i className="fa fa-credit-card" style={{ color: '#dc2626' }} />
                    <span>2. Select Payment Method</span>
                  </div>

                  {/* Payment Tabs / Radio Options */}
                  <div
                    className="payment-methods-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    {/* UPI Option */}
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`payment-option-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                      style={{
                        border: paymentMethod === 'upi' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'upi' ? '#f0fdf4' : '#ffffff',
                        borderRadius: 6,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa fa-qrcode" style={{ fontSize: 18, color: paymentMethod === 'upi' ? '#dc2626' : '#64748b' }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>UPI / QR / GPay</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>PhonePe, Paytm, BHIM</div>
                      </div>
                    </div>

                    {/* Cards Option */}
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`payment-option-card ${paymentMethod === 'card' ? 'active' : ''}`}
                      style={{
                        border: paymentMethod === 'card' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'card' ? '#f0fdf4' : '#ffffff',
                        borderRadius: 6,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa fa-credit-card" style={{ fontSize: 18, color: paymentMethod === 'card' ? '#dc2626' : '#64748b' }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Cards</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>Visa, Master, RuPay</div>
                      </div>
                    </div>

                    {/* PayPal Option */}
                    <div
                      onClick={() => setPaymentMethod('paypal')}
                      className={`payment-option-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                      style={{
                        border: paymentMethod === 'paypal' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'paypal' ? '#f0fdf4' : '#ffffff',
                        borderRadius: 6,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa fa-paypal" style={{ fontSize: 18, color: paymentMethod === 'paypal' ? '#0070ba' : '#64748b' }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>PayPal</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>International</div>
                      </div>
                    </div>

                    {/* Net Banking / Wallet */}
                    <div
                      onClick={() => setPaymentMethod('wallet')}
                      className={`payment-option-card ${paymentMethod === 'wallet' ? 'active' : ''}`}
                      style={{
                        border: paymentMethod === 'wallet' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                        backgroundColor: paymentMethod === 'wallet' ? '#f0fdf4' : '#ffffff',
                        borderRadius: 6,
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa fa-university" style={{ fontSize: 18, color: paymentMethod === 'wallet' ? '#dc2626' : '#64748b' }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>NetBanking</div>
                        <div style={{ fontSize: 10, color: '#64748b' }}>All Indian Banks</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Specific Fields */}
                  {paymentMethod === 'upi' && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 16,
                      }}
                    >
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, display: 'block' }}>
                        Enter UPI ID or Virtual Payment Address (VPA)
                      </label>
                      <input
                        type="text"
                        className="form-control checkout-input"
                        placeholder="yourname@okaxis / user@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{ height: 36, fontSize: 13, borderRadius: 4 }}
                      />
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="fa fa-bolt" style={{ color: '#dc2626' }} />
                        <span>Instant payment request will be sent to your UPI app.</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 16,
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 2 }}>Card Number</label>
                        <input
                          type="text"
                          className="form-control checkout-input"
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          style={{ height: 34, fontSize: 12, borderRadius: 4 }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 2 }}>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            className="form-control checkout-input"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            style={{ height: 34, fontSize: 12, borderRadius: 4 }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 2 }}>CVV</label>
                          <input
                            type="password"
                            className="form-control checkout-input"
                            placeholder="123"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            style={{ height: 34, fontSize: 12, borderRadius: 4 }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div
                      style={{
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 16,
                        fontSize: 12,
                        color: '#0369a1',
                      }}
                    >
                      <i className="fa fa-info-circle" style={{ marginRight: 4 }} />
                      You will be securely redirected to PayPal to complete your payment of <strong>{price}</strong>.
                    </div>
                  )}

                  {paymentMethod === 'wallet' && (
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 16,
                      }}
                    >
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4, display: 'block' }}>Select Bank</label>
                      <select className="form-control checkout-input" style={{ height: 36, fontSize: 13, borderRadius: 4 }}>
                        <option>HDFC Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Other Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-success btn-block"
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#991b1b',
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '12px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 3px 8px rgba(32, 186, 78, 0.3)',
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="fa fa-spinner fa-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-lock" />
                    <span>Pay {price} & Download</span>
                  </>
                )}
              </button>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  color: '#64748b',
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                }}
              >
                <span><i className="fa fa-shield" style={{ color: '#dc2626' }} /> 100% Safe Checkout</span>
                <span>•</span>
                <span>Instant .ZIP Archive</span>
                <span>•</span>
                <span>24x7 Modder Support</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
