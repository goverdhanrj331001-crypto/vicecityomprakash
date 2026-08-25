'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ModAuthor, Mod } from '@/types';
import { ModCard } from '@/components/shared/ModCard';

interface ModSidebarProps {
  slug: string;
  category: string;
  author: ModAuthor;
  price?: string;
  fileSize?: string;
  relatedMods: Mod[];
  productTitle?: string;
  coverImage?: string;
  onBuyNow?: () => void;
}

export function ModSidebar({
  slug,
  category,
  author,
  price = '$4.99',
  fileSize = '18.5 MB',
  relatedMods,
  productTitle = 'Purple Cat Girl Livery - Annis Elegy RH-7',
  coverImage = '/images/catgirl_1.jpg',
  onBuyNow,
}: ModSidebarProps) {
  const router = useRouter();

  const handlePurchase = () => {
    if (onBuyNow) {
      onBuyNow();
    } else {
      router.push(`/checkout?slug=${encodeURIComponent(slug)}`);
    }
  };

  return (
    <>
      <div
        className="col-sm-5 col-lg-4 digital-sidebar-sticky"
        style={{
          position: 'sticky',
          top: 20,
          zIndex: 20,
          alignSelf: 'flex-start',
        }}
      >
        {/* Digital Product Purchasing Card */}
        <div
          className="panel panel-default digital-buy-panel"
          style={{
            border: '1px solid #cce5d2',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderRadius: 4,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {/* Price Header */}
          <div
            className="digital-price-header"
            style={{
              background: '#f4fbf6',
              padding: '16px 18px',
              borderBottom: '1px solid #dceedf',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                className="digital-license-title"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#666',
                  letterSpacing: 0.5,
                }}
              >
                Digital License
              </div>
              <div
                className="digital-price-amount"
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#dc2626',
                  lineHeight: 1.1,
                }}
              >
                {price}
              </div>
            </div>
            <span
              className="digital-delivery-badge"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#dc2626',
                background: '#e2f6e7',
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid #c2ebcb',
              }}
            >
              Instant Delivery
            </span>
          </div>

          <div className="panel-body digital-panel-body" style={{ padding: 18 }}>
            {/* Buy Now Button (Desktop / Main) */}
            <button
              type="button"
              onClick={handlePurchase}
              className="btn btn-primary btn-download btn-block"
              style={{
                fontSize: 18,
                padding: '12px 16px',
                fontWeight: 700,
                backgroundColor: '#dc2626',
                borderColor: '#991b1b',
                boxShadow: '0 3px 6px rgba(32,186,78,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <i className="fa fa-shopping-cart" />
              <span>Buy Now</span>
            </button>

            {/* Product Specifications & Trust Badges */}
            <ul
              className="digital-inclusions-list"
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '16px 0 0',
                fontSize: 13,
                color: '#555',
                borderTop: '1px solid #eee',
                paddingTop: 12,
              }}
            >
              <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa fa-check-circle" style={{ color: '#dc2626' }} />
                <span><strong>Instant Download</strong> (.ZIP Package)</span>
              </li>
              <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa fa-shield" style={{ color: '#dc2626' }} />
                <span><strong>Verified Safe & Virus-Free</strong></span>
              </li>
              <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa fa-file-archive-o" style={{ color: '#dc2626' }} />
                <span>File Size: <strong>{fileSize}</strong></span>
              </li>
              <li style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa fa-refresh" style={{ color: '#dc2626' }} />
                <span>Free Lifetime Updates</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Related Digital Products in Category */}
        {relatedMods.length > 0 && (
          <div className="file-list digital-related-mods">
            <div className="col-xs-12 hidden-xs" style={{ padding: 0 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: '15px 0 10px' }}>
                More from <i><Link href={`/${category}`}>{category}</Link></i>:
              </h4>
              {relatedMods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar for Mobile Only (< 768px) */}
      <div
        className="digital-sticky-mobile-bar"
        style={{
          position: 'fixed',
          bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))',
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: '#ffffff',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
          padding: '10px 16px',
          borderTop: '1px solid #e0e0e0',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="mobile-bar-price-label" style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>Price</div>
          <div className="mobile-bar-price-val" style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{price}</div>
        </div>
        <button
          type="button"
          onClick={handlePurchase}
          className="btn btn-primary"
          style={{
            backgroundColor: '#dc2626',
            borderColor: '#991b1b',
            fontWeight: 700,
            fontSize: 16,
            padding: '10px 24px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fa fa-shopping-cart" />
          <span>Buy Now</span>
        </button>
      </div>
    </>
  );
}
