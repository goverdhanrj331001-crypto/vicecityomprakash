'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { FeaturedMod } from '@/types';
import { getModUrl } from '@/lib/utils';

interface FeaturedSectionProps {
  mods: FeaturedMod[];
}

export function FeaturedSection({ mods }: FeaturedSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Determine items per page (2 on desktop, 1 on mobile)
  const itemsPerPage = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, mods.length - itemsPerPage);

  const checkViewport = useCallback(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  useEffect(() => {
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, [checkViewport]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (!mods || mods.length === 0) return null;

  // Visible items based on currentIndex and itemsPerPage
  const visibleMods = mods.slice(currentIndex, currentIndex + itemsPerPage);
  // If at the boundary, wrap around if needed
  if (visibleMods.length < itemsPerPage && mods.length >= itemsPerPage) {
    const needed = itemsPerPage - visibleMods.length;
    visibleMods.push(...mods.slice(0, needed));
  }

  return (
    <div id="featured-carousel-section" className="col-md-12" style={{ marginBottom: 20 }}>
      {/* Header with Title, See All link, and Prev/Next Carousel Arrows */}
      <div
        className="featured-heading-wrapper"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Featured Files</h3>
          <Link
            href="/all"
            style={{
              fontSize: 13,
              color: '#dc2626',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            See All &rarr;
          </Link>
        </div>

        {/* Carousel Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            onClick={handlePrev}
            className="carousel-arrow-btn"
            aria-label="Previous featured mods"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="fa fa-chevron-left" style={{ fontSize: 12 }} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="carousel-arrow-btn"
            aria-label="Next featured mods"
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="fa fa-chevron-right" style={{ fontSize: 12 }} />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        className="featured-carousel-viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className="row" style={{ margin: '0 -8px' }}>
          {visibleMods.map((mod) => (
            <div
              key={mod.slug}
              className={isMobile ? 'col-xs-12' : 'col-sm-6'}
              style={{ padding: '0 8px', marginBottom: 12 }}
            >
              <Link
                href={getModUrl(mod.category, mod.slug)}
                className="featured-card-link"
                style={{
                  display: 'block',
                  position: 'relative',
                  height: 240,
                  borderRadius: 6,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  backgroundColor: '#111',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Background Cover Image */}
                <Image
                  src={mod.coverImage}
                  alt={mod.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.35s ease',
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />

                {/* Dark Gradient Overlay for High-Contrast Text Legibility */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 16,
                  }}
                >
                  {/* Top Badge */}
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <span
                      style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 3,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Featured
                    </span>
                  </div>

                  {/* Bottom Mod Details */}
                  <div>
                    <h4
                      style={{
                        color: '#ffffff',
                        fontSize: 16,
                        fontWeight: 700,
                        margin: '0 0 4px 0',
                        lineHeight: 1.3,
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                        whiteSpace: 'normal',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {mod.title}
                    </h4>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>
                        <span style={{ color: '#94a3b8' }}>By</span>{' '}
                        <strong style={{ color: '#ffffff' }}>{mod.author}</strong>
                      </span>
                      <span style={{ color: '#64748b' }}>•</span>
                      <span
                        style={{
                          textTransform: 'capitalize',
                          color: '#38bdf8',
                          fontWeight: 600,
                        }}
                      >
                        {mod.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 6,
            marginTop: 4,
          }}
        >
          {Array.from({ length: Math.ceil(mods.length / itemsPerPage) }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx * itemsPerPage)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: currentIndex === idx * itemsPerPage ? 20 : 7,
                height: 7,
                borderRadius: 4,
                border: 'none',
                backgroundColor:
                  currentIndex === idx * itemsPerPage ? '#dc2626' : '#cbd5e1',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
