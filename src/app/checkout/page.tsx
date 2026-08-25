/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { PRODUCT_DETAIL_MOD, FEATURED_MODS, LATEST_MODS } from '@/lib/mockData';
import type { Mod } from '@/types';
import { 
  ArrowLeft, 
  Check, 
  Lock, 
  User, 
  Phone, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Tag, 
  ChevronDown, 
  CreditCard, 
  Wallet, 
  QrCode, 
  ShoppingBag, 
  Loader2,
  AlertCircle,
  Coins
} from 'lucide-react';

const INDIA_FLAG_URL = 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg';

const COUNTRIES = [
  { code: 'IN', name: 'India', dial: '+91', flagUrl: INDIA_FLAG_URL, emoji: '🇮🇳' },
  { code: 'US', name: 'United States', dial: '+1', flagUrl: '', emoji: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flagUrl: '', emoji: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '+1', flagUrl: '', emoji: '🇨🇦' },
  { code: 'AU', name: 'Australia', dial: '+61', flagUrl: '', emoji: '🇦🇺' },
  { code: 'DE', name: 'Germany', dial: '+49', flagUrl: '', emoji: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '+33', flagUrl: '', emoji: '🇫🇷' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flagUrl: '', emoji: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flagUrl: '', emoji: '🇸🇦' },
  { code: 'BR', name: 'Brazil', dial: '+55', flagUrl: '', emoji: '🇧🇷' },
  { code: 'RU', name: 'Russia', dial: '+7', flagUrl: '', emoji: '🇷🇺' },
  { code: 'OTHER', name: 'Other Country', dial: '+', flagUrl: '', emoji: '🌐' },
];

function PaymentLogoImage({ src, fallbackSrc, alt, className, style }: { src: string; fallbackSrc: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}

const PAYMENT_DETAILS = {
  upi: {
    title: 'UPI / QR',
    subtitle: 'GPay, PhonePe, Paytm',
    icon: QrCode,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg'
  },
  razorpay: {
    title: 'Razorpay',
    subtitle: 'Cards, UPI, NetBanking',
    icon: CreditCard,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg'
  },
  paypal: {
    title: 'PayPal',
    subtitle: 'International Cards',
    icon: Wallet,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
  },
  binance: {
    title: 'Binance Pay',
    subtitle: 'Crypto / USDT',
    icon: Wallet,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg',
    fallback: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg'
  },
  nowpayments: {
    title: 'NOWPayments',
    subtitle: 'Pay with BTC, ETH, LTC & 50+ Crypto',
    icon: Coins,
    logo: 'https://nowpayments.io/images/logo/logo-nowpayments.svg',
    fallback: 'https://nowpayments.io/images/logo/logo-nowpayments.svg'
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || 'purple-cat-girl-livery-annis-elegy-rh-7';

  // Find mod data (local fallback)
  const foundFeatured = FEATURED_MODS.find((m) => m.slug === slug);
  const foundLatest = LATEST_MODS.find((m) => m.slug === slug);

  // Dynamic state for database mod details
  const [dbMod, setDbMod] = useState<Mod | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(`/api/mods?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((m) => {
        if (active && m) {
          // Normalize the data format from API
          const normalized: Mod = {
            id: m.id,
            slug: m.slug,
            title: m.title,
            version: m.version || '1.0.0',
            category: m.category || 'paintjobs',
            subCategories: m.subCategories || m.sub_categories || [m.category],
            author: typeof m.author === 'object' ? m.author : { username: m.author || 'GtaModderPro' },
            stats: m.stats || { downloads: m.downloads || 0, likes: m.likes || 0, rating: m.rating || 5 },
            tags: Array.isArray(m.tags) ? m.tags : [],
            description: m.description || '',
            coverImage: m.coverImage || m.cover_image || '/images/catgirl_1.jpg',
            thumbnailImages: m.thumbnailImages || m.thumbnail_images || [],
            videoUrl: m.videoUrl || m.video_url || '',
            price: m.price,
            fileSize: m.fileSize || m.file_size,
            allVersions: m.allVersions || [
              {
                version: m.version || '1.0.0',
                isCurrent: true,
                downloads: m.downloads || 0,
                fileSize: m.fileSize || m.file_size || '15 MB',
                uploadedAt: new Date().toISOString(),
                downloadUrl: m.zipUrl || m.zip_url || '#',
              }
            ],
            firstUploadedAt: m.created_at || m.firstUploadedAt || new Date().toISOString(),
            lastUpdatedAt: m.updated_at || m.lastUpdatedAt || new Date().toISOString(),
          };
          setDbMod(normalized);
        }
      })
      .catch((err) => {
        console.error('Error fetching mod details in checkout:', err);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const title = dbMod?.title || foundFeatured?.title || foundLatest?.title || PRODUCT_DETAIL_MOD.title;
  const coverImage = dbMod?.coverImage || foundFeatured?.coverImage || foundLatest?.coverImage || PRODUCT_DETAIL_MOD.coverImage;
  const author = dbMod?.author.username || foundFeatured?.author || foundLatest?.author.username || PRODUCT_DETAIL_MOD.author.username;
  const version = dbMod?.version || foundFeatured?.version || foundLatest?.version || '1.0';
  const resolvedFileSize = dbMod?.fileSize || dbMod?.allVersions?.[0]?.fileSize || (foundFeatured as any)?.fileSize || (foundLatest as any)?.fileSize || '18.5 MB';
  const resolvedZipUrl = dbMod?.allVersions?.[0]?.downloadUrl || (foundFeatured as any)?.zipUrl || (foundLatest as any)?.zipUrl || '/downloads/mod-file.zip';

  // Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Enabled payment methods from database config
  const [enabledGateways, setEnabledGateways] = useState<('upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments')[]>(['upi', 'razorpay', 'paypal', 'binance', 'nowpayments']);

  React.useEffect(() => {
    fetch('/api/payments?public=true')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.config) {
          const active: ('upi' | 'razorpay' | 'paypal' | 'binance' | 'nowpayments')[] = [];
          if (data.config.upi?.enabled) active.push('upi');
          if (data.config.razorpay?.enabled) active.push('razorpay');
          if (data.config.paypal?.enabled) active.push('paypal');
          if (data.config.binance?.enabled) active.push('binance');
          if (data.config.nowpayments?.enabled) active.push('nowpayments');
          
          if (active.length > 0) {
            setEnabledGateways(active);
            setPaymentMethod(active[0]);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching public payment methods:', err);
      });
  }, []);

  // Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderId, setOrderId] = useState('');

  const basePrice = dbMod?.price !== undefined && dbMod?.price !== null ? dbMod.price : 4.99;
  const finalPrice = Math.max(0, basePrice - discountAmount).toFixed(2);

  const selectedCountryObj = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    if (couponCode.trim().toUpperCase() === 'GTA5VIP' || couponCode.trim().toUpperCase() === 'MODS20') {
      setDiscountAmount(1.0);
      setCouponApplied(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid promo code. Try GTA5VIP for $1 off.');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 6) {
      setErrorMsg('Please enter a valid mobile number with country code');
      return;
    }

    setIsProcessing(true);
    const generatedOrderId = 'GTA5-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedOrderId);

    if (paymentMethod === 'nowpayments') {
      fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: generatedOrderId,
          amount: parseFloat(finalPrice),
          title: title,
          customerEmail: `${mobile}@customer.gtamods.com`,
          customerName: name,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsProcessing(false);
          if (data && data.invoiceUrl) {
            // Save order details as a temporary draft in localStorage
            const draftOrderObj = {
              id: generatedOrderId,
              customerName: name,
              customerMobile: mobile,
              modTitle: title,
              modCover: coverImage,
              amountUsd: finalPrice,
              amountInr: Math.round(parseFloat(finalPrice) * 83),
              paymentMethod: 'NOWPAYMENTS',
              status: 'completed', // Marked completed when restored upon success redirect
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              zipUrl: resolvedZipUrl,
              fileSize: resolvedFileSize,
              version: version,
              author: author,
            };

            try {
              const drafts = JSON.parse(localStorage.getItem('pending_order_drafts') || '[]');
              drafts.push(draftOrderObj);
              localStorage.setItem('pending_order_drafts', JSON.stringify(drafts));
            } catch (err) {
              console.error('Error saving order draft:', err);
            }

            // Redirect to NOWPayments billing invoice
            window.location.href = data.invoiceUrl;
          } else {
            setErrorMsg(data.error || 'NOWPayments could not initiate payment. Try again.');
          }
        })
        .catch((err) => {
          setIsProcessing(false);
          setErrorMsg('An error occurred while connecting to NOWPayments. Please try again.');
        });
      return;
    }

    setTimeout(() => {
      setIsProcessing(false);

      // Save order to localStorage for My Orders screen
      const newOrderObj = {
        id: generatedOrderId,
        customerName: name,
        customerMobile: mobile,
        modTitle: title,
        modCover: coverImage,
        amountUsd: finalPrice,
        amountInr: Math.round(parseFloat(finalPrice) * 83),
        paymentMethod: paymentMethod.toUpperCase(),
        status: 'completed',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        zipUrl: resolvedZipUrl,
        fileSize: resolvedFileSize,
        version: version,
        author: author,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('user_orders') || '[]');
        const updated = [newOrderObj, ...existing];
        localStorage.setItem('user_orders', JSON.stringify(updated));

        // Save also in cookies for redundancy
        try {
          const cookieName = 'user_orders';
          document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=31536000; SameSite=Lax`;
        } catch (cookieErr) {
          console.error('Error storing in cookies:', cookieErr);
        }

        // Asynchronous cloud sync to Supabase database for admin overview
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: generatedOrderId,
            customerName: name,
            customerMobile: mobile,
            country: country,
            countryFlag: selectedCountryObj?.flagUrl,
            modTitle: title,
            modSlug: slug,
            amountUsd: parseFloat(finalPrice),
            amountInr: Math.round(parseFloat(finalPrice) * 83),
            paymentMethod: paymentMethod.toLowerCase(),
            status: 'completed',
            gatewayTxnId: `TXN_${paymentMethod.toUpperCase()}_${Date.now()}`,
          }),
        }).catch(() => {});
      } catch (err) {
        console.error(err);
      }

      setIsSuccess(true);
      window.location.href = `/orders?success=true&orderId=${generatedOrderId}`;
    }, 1200);
  };

  return (
    <div className="co-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        /* ========================================================
           CUSTOM CHECOUT PAGE STYLES (Guaranteed rendering without Tailwind)
           ======================================================== */
        .co-wrapper {
          background-color: #f8fafc;
          color: #334155;
          min-height: 100vh;
          padding: 40px 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          transition: background-color 0.2s, color 0.2s;
        }
        body.dark-mode .co-wrapper {
          background-color: #0f1115;
          color: #cbd5e1;
        }

        .co-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* Header & Steps */
        .co-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 16px;
        }
        body.dark-mode .co-header {
          border-bottom-color: #1f232d;
        }

        .co-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        body.dark-mode .co-back-btn {
          color: #cbd5e1;
          background-color: #161920;
          border-color: #2d333f;
        }
        .co-back-btn:hover {
          background-color: #f1f5f9;
          border-color: #94a3b8;
          text-decoration: none;
        }
        body.dark-mode .co-back-btn:hover {
          background-color: #1f232d;
          border-color: #475569;
        }

        /* Stepper Styling */
        .co-steps-container {
          width: 100%;
          margin-bottom: 32px;
          padding: 16px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }
        body.dark-mode .co-steps-container {
          background: #161920;
          border-color: #2d333f;
          box-shadow: none;
        }
        .co-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
        }
        @media (max-width: 640px) {
          .co-steps {
            gap: 6px;
          }
          .co-step-item {
            padding: 4px 6px !important;
            font-size: 11px !important;
            gap: 4px !important;
          }
          .co-step-num-badge {
            width: 16px !important;
            height: 16px !important;
            font-size: 9px !important;
          }
          .co-steps-container {
            padding: 10px 12px !important;
            margin-bottom: 20px !important;
          }
        }
        .co-step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #64748b;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        body.dark-mode .co-step-item {
          color: #94a3b8;
        }
        .co-step-item.active {
          color: #dc2626;
          background-color: rgba(32, 186, 78, 0.08);
          font-weight: 500;
        }
        body.dark-mode .co-step-item.active {
          background-color: rgba(32, 186, 78, 0.12);
        }
        .co-step-item.done {
          color: #dc2626;
          font-weight: 500;
        }
        .co-step-num-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          background-color: #e2e8f0;
          color: #64748b;
        }
        body.dark-mode .co-step-num-badge {
          background-color: #2d333f;
          color: #94a3b8;
        }
        .co-step-item.active .co-step-num-badge {
          background-color: #dc2626;
          color: #ffffff;
        }
        .co-step-item.done .co-step-num-badge {
          background-color: rgba(32, 186, 78, 0.15);
          color: #dc2626;
        }
        .co-step-divider-line {
          flex: 1;
          height: 1px;
          background-color: #e2e8f0;
        }
        body.dark-mode .co-step-divider-line {
          background-color: #2d333f;
        }

        /* Grid Layout */
        .co-grid {
          display: block;
        }

        /* Card Panel */
        .co-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin-bottom: 24px;
        }
        body.dark-mode .co-card {
          background-color: #161920;
          border-color: #2d333f;
          box-shadow: none;
        }

        .co-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          background-color: #fafafa;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        body.dark-mode .co-card-header {
          border-bottom-color: #1f232d;
          background-color: #1a1d24;
        }

        .co-card-body {
          padding: 24px;
        }

        /* Form Labels & Controls */
        .co-form-group {
          margin-bottom: 20px;
        }
        .co-form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        @media (min-width: 576px) {
          .co-form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        .co-form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          margin-bottom: 8px;
        }
        body.dark-mode .co-form-label {
          color: #94a3b8;
        }
        .co-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .co-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .co-input {
          width: 100%;
          padding: 10px 12px 10px 38px;
          font-size: 14px;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          color: #1e293b;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        body.dark-mode .co-input {
          background-color: #0f1115;
          border-color: #2d333f;
          color: #f1f5f9;
        }
        .co-input:focus {
          border-color: #dc2626;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(32, 186, 78, 0.15);
        }
        body.dark-mode .co-input:focus {
          background-color: #0f1115;
          box-shadow: 0 0 0 3px rgba(32, 186, 78, 0.2);
        }

        .co-select-wrapper {
          position: relative;
          width: 100%;
        }
        .co-select {
          appearance: none;
          cursor: pointer;
          padding-right: 36px !important;
          width: 100%;
        }
        .co-select-arrow {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        /* Phone Unified Box */
        .co-phone-box {
          display: flex;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
          background-color: #f8fafc;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        body.dark-mode .co-phone-box {
          border-color: #2d333f;
          background-color: #0f1115;
        }
        .co-phone-box:focus-within {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(32, 186, 78, 0.15);
        }
        .co-phone-prefix {
          padding: 10px 16px;
          background-color: #f1f5f9;
          border-right: 1px solid #cbd5e1;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          user-select: none;
        }
        body.dark-mode .co-phone-prefix {
          background-color: #1a1d24;
          border-color: #2d333f;
          color: #cbd5e1;
        }
        .co-phone-input-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }
        .co-phone-input {
          width: 100%;
          border: none !important;
          background: transparent !important;
          padding: 10px 12px 10px 38px !important;
          font-size: 14px !important;
          color: #1e293b !important;
          outline: none !important;
          box-shadow: none !important;
          box-sizing: border-box;
        }
        body.dark-mode .co-phone-input {
          color: #f1f5f9 !important;
        }

        /* Section Header Divider */
        .co-sec-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        body.dark-mode .co-sec-divider {
          border-bottom-color: #1f232d;
        }
        .co-sec-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(32, 186, 78, 0.1);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }
        .co-sec-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        body.dark-mode .co-sec-title {
          color: #f1f5f9;
        }

        /* Payment Methods Grid */
        .co-pm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 576px) {
          .co-pm-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .co-pm-card {
          padding: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          background-color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
          user-select: none;
          position: relative;
        }
        body.dark-mode .co-pm-card {
          border-color: #2d333f;
          background-color: #1a1d24;
        }
        .co-pm-card:hover {
          transform: translateY(-2px);
          border-color: #94a3b8;
        }
        body.dark-mode .co-pm-card:hover {
          border-color: #475569;
        }
        .co-pm-card.active {
          border-color: #dc2626;
          background-color: rgba(32, 186, 78, 0.05);
        }
        body.dark-mode .co-pm-card.active {
          border-color: #dc2626;
          background-color: rgba(32, 186, 78, 0.1);
        }

        .co-pm-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background-color: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        body.dark-mode .co-pm-icon {
          background-color: #0f1115;
          color: #cbd5e1;
        }
        .co-pm-card.active .co-pm-icon {
          background-color: rgba(32, 186, 78, 0.1);
          color: #dc2626;
        }

        .co-pm-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }
        body.dark-mode .co-pm-title {
          color: #f1f5f9;
        }
        .co-pm-desc {
          font-size: 11.5px;
          color: #64748b;
          margin-top: 4px;
        }
        body.dark-mode .co-pm-desc {
          color: #94a3b8;
        }

        .co-pm-logo {
          height: 20px;
          max-width: 50px;
          object-fit: contain;
          margin-left: auto;
          opacity: 0.8;
        }

        /* Pay Button */
        .co-pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: #ffffff;
          border: none;
          font-size: 15px;
          font-weight: 600;
          padding: 16px 24px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-shadow: 0 10px 15px -3px rgba(32, 186, 78, 0.25);
          transition: all 0.2s ease;
          margin-top: 24px;
        }
        .co-pay-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px -3px rgba(32, 186, 78, 0.35);
          background: linear-gradient(135deg, #24ca56 0%, #1aac45 100%);
        }
        .co-pay-btn:active {
          transform: translateY(1px);
        }
        .co-pay-btn-sub {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.5px;
        }

        /* Alert Warning Box */
        .co-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background-color: #fff1f2;
          border: 1px solid #ffe4e6;
          border-radius: 10px;
          color: #be123c;
          font-size: 13.5px;
          margin-bottom: 24px;
        }
        body.dark-mode .co-alert {
          background-color: rgba(244, 63, 94, 0.1);
          border-color: rgba(244, 63, 94, 0.2);
          color: #fda4af;
        }

        /* Summary Sidebar Layout */
        .co-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .co-summary-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        body.dark-mode .co-summary-card {
          background-color: #161920;
          border-color: #2d333f;
          box-shadow: none;
        }

        .co-summary-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .co-summary-img-wrapper {
          width: 64px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        body.dark-mode .co-summary-img-wrapper {
          border-color: #2d333f;
        }
        .co-summary-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .co-coupon-box {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }
        .co-coupon-input {
          flex: 1;
          padding: 8px 12px;
          font-size: 13px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background-color: #f8fafc;
          outline: none;
          text-transform: uppercase;
        }
        body.dark-mode .co-coupon-input {
          background-color: #0f1115;
          border-color: #2d333f;
          color: #f1f5f9;
        }
        .co-coupon-btn {
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #dc2626;
          background-color: rgba(32, 186, 78, 0.1);
          border: 1px solid rgba(32, 186, 78, 0.2);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .co-coupon-btn:hover {
          background-color: rgba(32, 186, 78, 0.18);
        }

        /* Price breakdown */
        .co-price-breakdown {
          border-top: 1px solid #f1f5f9;
          margin-top: 16px;
          padding-top: 16px;
        }
        body.dark-mode .co-price-breakdown {
          border-top-color: #1f232d;
        }
        .co-price-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }
        body.dark-mode .co-price-row {
          color: #94a3b8;
        }
        .co-price-val {
          font-weight: 600;
          color: #1e293b;
        }
        body.dark-mode .co-price-val {
          color: #cbd5e1;
        }

        .co-total-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          background-color: rgba(32, 186, 78, 0.08);
          border: 1px dashed rgba(32, 186, 78, 0.3);
          border-radius: 8px;
          margin-top: 16px;
        }
        .co-total-label {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }
        body.dark-mode .co-total-label {
          color: #cbd5e1;
        }
        .co-total-price {
          font-size: 18px;
          font-weight: 900;
          color: #dc2626;
        }

        /* Gateways list footer */
        .co-gateways-badges {
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          background-color: #fafafa;
          padding: 14px;
          text-align: center;
          margin-top: 16px;
        }
        body.dark-mode .co-gateways-badges {
          background-color: #1a1d24;
          border-color: #2d333f;
        }
        .co-gateways-badges-title {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .co-gateways-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .co-gateway-logo-box {
          height: 36px;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        body.dark-mode .co-gateway-logo-box {
          background-color: #0f1115;
          border-color: #2d333f;
        }

        /* Trust guarantees card */
        .co-trust-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        body.dark-mode .co-trust-card {
          background-color: #161920;
          border-color: #2d333f;
          box-shadow: none;
        }
        .co-trust-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .co-trust-item:last-child {
          margin-bottom: 0;
        }
        .co-trust-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(32, 186, 78, 0.1);
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .co-trust-title {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        body.dark-mode .co-trust-title {
          color: #f1f5f9;
        }
        .co-trust-desc {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
          line-height: 1.4;
        }
        body.dark-mode .co-trust-desc {
          color: #94a3b8;
        }
      ` }} />

      <div className="co-container">
        {/* Navigation Header */}
        <div className="co-header">
          <div>
            <Link href={`/paintjobs/${slug}`} className="co-back-btn">
              <ArrowLeft size={16} />
              <span>Back to Mod Details</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Stepper Progress */}
        <div className="co-steps-container">
          <div className="co-steps">
            <div className="co-step-item done">
              <span className="co-step-num-badge">
                <Check size={10} style={{ strokeWidth: 3 }} />
              </span>
              <span className="hidden sm:inline">1. Selected</span>
              <span className="inline sm:hidden">Selected</span>
            </div>
            
            <div className="co-step-divider-line" />
            
            <div className="co-step-item active">
              <span className="co-step-num-badge">2</span>
              <span className="hidden sm:inline">2. Secure Checkout</span>
              <span className="inline sm:hidden">Secure</span>
            </div>
            
            <div className="co-step-divider-line" />
            
            <div className={`co-step-item ${isSuccess ? 'done' : ''}`}>
              <span className="co-step-num-badge">3</span>
              <span className="hidden sm:inline">3. Instant Download</span>
              <span className="inline sm:hidden">Instant</span>
            </div>
          </div>
        </div>

        {isSuccess ? (
          /* ========================================================
             ORDER SUCCESS SCREEN
             ======================================================== */
          <div className="co-success-card">
            <div className="co-success-header">
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '2px solid #ffffff'
              }}>
                <Check size={30} style={{ color: '#ffffff', strokeWidth: 3 }} />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#ffffff' }}>Order Completed!</h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                Thank you for purchasing <strong>{title}</strong>!
              </p>
            </div>
            <div className="co-success-body">
              <p style={{ fontSize: '14px', lineHeight: 1.6, textAlign: 'center', marginBottom: 24 }}>
                Your checkout is clear. Redirecting you to download details...
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={32} className="fa-spin" style={{ color: '#dc2626' }} />
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             MAIN CHECKOUT PAGE WITH 2-COLUMN LAYOUT
             ======================================================== */
          <div className="co-grid">
            {/* LEFT COLUMN - CHECKOUT DETAILS & PAYMENT */}
            <div>
              <div className="co-card">
                <div className="co-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: 'rgba(32,186,78,0.1)',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lock size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Secure Checkout &amp; Instant Delivery</h2>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>256-bit SSL encrypted &amp; 100% safe</p>
                    </div>
                  </div>
                </div>

                <div className="co-card-body">
                  {errorMsg && (
                    <div className="co-alert">
                      <AlertCircle size={18} />
                      <strong>{errorMsg}</strong>
                    </div>
                  )}

                  <form onSubmit={handleCompleteOrder}>
                    {/* STEP 1: CUSTOMER INFORMATION */}
                    <div className="co-sec-divider">
                      <span className="co-sec-num">1</span>
                      <h3 className="co-sec-title">Customer Information</h3>
                    </div>

                    <div className="co-form-row">
                      {/* Name */}
                      <div className="co-form-group">
                        <label className="co-form-label">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                        <div className="co-input-wrapper">
                          <span className="co-input-icon">
                            <User size={16} />
                          </span>
                          <input
                            type="text"
                            className="co-input"
                            placeholder="e.g. Rahul Sharma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Country dropdown */}
                      <div className="co-form-group">
                        <label className="co-form-label">Country / Region <span style={{ color: '#ef4444' }}>*</span></label>
                        <div className="co-select-wrapper">
                          <span className="co-input-icon">
                            {selectedCountryObj.flagUrl ? (
                              <img
                                src={selectedCountryObj.flagUrl}
                                alt={selectedCountryObj.name}
                                style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2 }}
                              />
                            ) : (
                              <span>{selectedCountryObj.emoji}</span>
                            )}
                          </span>
                          <select
                            className="co-input co-select"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            {COUNTRIES.map((c) => (
                              <option key={c.code} value={c.name}>
                                {c.name} ({c.dial})
                              </option>
                            ))}
                          </select>
                          <span className="co-select-arrow">
                            <ChevronDown size={16} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="co-form-group">
                      <label className="co-form-label">
                        Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#64748b', marginLeft: 8 }}>
                          We&apos;ll send SMS invoice &amp; download link
                        </span>
                      </label>
                      <div className="co-phone-box">
                        <div className="co-phone-prefix">
                          {selectedCountryObj.dial}
                        </div>
                        <div className="co-phone-input-wrapper">
                          <span className="co-input-icon">
                            <Phone size={16} />
                          </span>
                          <input
                            type="tel"
                            className="co-phone-input"
                            placeholder=""
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* STEP 2: SELECT PAYMENT METHOD */}
                    <div className="co-sec-divider">
                      <span className="co-sec-num">2</span>
                      <h3 className="co-sec-title">Select Payment Method</h3>
                    </div>

                    <div className="co-pm-grid">
                      {enabledGateways.map((gw) => {
                        const info = PAYMENT_DETAILS[gw] || PAYMENT_DETAILS.upi;
                        const active = paymentMethod === gw;
                        const PMIcon = info.icon;
                        
                        return (
                          <div
                            key={gw}
                            onClick={() => setPaymentMethod(gw)}
                            className={`co-pm-card ${active ? 'active' : ''}`}
                          >
                            <div className="co-pm-icon">
                              <PMIcon size={20} />
                            </div>
                            <div>
                              <h4 className="co-pm-title">
                                {info.title}
                                {active && (
                                  <span style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: '#dc2626',
                                    color: '#ffffff',
                                    fontSize: '10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 6
                                  }}>✓</span>
                                )}
                              </h4>
                              <div className="co-pm-desc">{info.subtitle}</div>
                            </div>
                            <PaymentLogoImage
                              src={info.logo}
                              fallbackSrc={info.fallback}
                              alt={info.title}
                              className="co-pm-logo"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {paymentMethod === 'nowpayments' && (
                      <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fcd34d',
                        borderRadius: '8px',
                        color: '#b45309',
                        fontSize: '13px',
                        lineHeight: '1.5'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold', marginBottom: '6px' }}>
                          <AlertCircle size={16} />
                          <span>Important Notice / महत्वपूर्ण सूचना ⚠️</span>
                        </div>
                        <p style={{ margin: '0 0 8px 0' }}>
                          Because this item is under $5.00, high-fee networks like <strong>Bitcoin (BTC)</strong> or <strong>Ethereum (ETH)</strong> may fail on the checkout page with the error <em>&quot;Crypto amount is less than minimal&quot;</em>.
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12.5px', borderTop: '1px dashed #fcd34d', paddingTop: '8px' }}>
                          चूँकि इस आइटम की कीमत $5.00 से कम है, इसलिए <strong>Bitcoin (BTC)</strong> या <strong>Ethereum (ETH)</strong> जैसी अधिक फ़ीस वाली क्रिप्टोकरेंसी पर <em>&quot;Crypto amount is less than minimal&quot;</em> की एरर आ सकती है।
                        </p>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          💡 <strong>Solution (समाधान):</strong> On the payment page, please choose a low-fee coin like <strong>Litecoin (LTC)</strong>, <strong>Tron (TRX)</strong>, <strong>Dogecoin (DOGE)</strong>, or <strong>USDT</strong>. They have a minimum payment limit of less than $2.00 and will work perfectly!
                          <br />
                          <span style={{ fontSize: '11.5px', opacity: 0.9 }}>
                            (पेमेंट पेज पर कृपया <strong>Litecoin (LTC)</strong>, <strong>Tron (TRX)</strong>, या <strong>USDT</strong> चुनें, इनका मिनिमम लिमिट $2 से कम है और ये तुरंत काम करेंगे!)
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Pay Button */}
                    <button type="submit" disabled={isProcessing} className="co-pay-btn">
                      {isProcessing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Loader2 size={18} className="fa-spin" />
                          <span>Processing secure transaction...</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
                          <Lock size={16} />
                          <span>Pay ${finalPrice}</span>
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="co-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} className="fa-spin" style={{ color: '#dc2626' }} /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
