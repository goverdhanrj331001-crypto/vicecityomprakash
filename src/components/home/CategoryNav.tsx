'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  modsCount?: number;
  status?: string;
  image?: string;
  badge?: string;
  colorGradient?: string;
}

const DEFAULT_GRADIENTS: Record<string, string> = {
  tools: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
  vehicles: 'linear-gradient(45deg, #dc2626, #00c6ff, #0072ff)',
  paintjobs: 'linear-gradient(45deg, #a855f7, #ec4899, #f43f5e)',
  weapons: 'linear-gradient(45deg, #ef4444, #f97316, #eab308)',
  scripts: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
  player: 'linear-gradient(45deg, #10b981, #06b6d4, #3b82f6)',
  maps: 'linear-gradient(45deg, #f59e0b, #ef4444, #8b5cf6)',
  misc: 'linear-gradient(45deg, #6366f1, #a855f7, #ec4899)',
};

const DEFAULT_IMAGES: Record<string, string> = {
  tools: '/images/tools.jpg',
  vehicles: '/images/vehicles.jpg',
  paintjobs: '/images/6252eb-bansh1.jpg',
  weapons: '/images/weapons.jpg',
  scripts: '/images/scripts.jpg',
  player: '/images/player.jpg',
  maps: '/images/maps.jpg',
  misc: '/images/misc.jpg',
};

const INITIAL_NAV: CategoryItem[] = [
  { id: 1, name: 'Tools', slug: 'tools', icon: 'fa fa-wrench', status: 'active' },
  { id: 2, name: 'Vehicles', slug: 'vehicles', icon: 'fa fa-car', status: 'active', badge: 'Popular' },
  { id: 3, name: 'Paint Jobs', slug: 'paintjobs', icon: 'fa fa-paint-brush', status: 'active' },
  { id: 4, name: 'Weapons', slug: 'weapons', icon: 'fa fa-crosshairs', status: 'active' },
  { id: 5, name: 'Scripts', slug: 'scripts', icon: 'fa fa-code', status: 'active', badge: 'Trending' },
  { id: 6, name: 'Player', slug: 'player', icon: 'fa fa-user', status: 'active' },
  { id: 7, name: 'Maps', slug: 'maps', icon: 'fa fa-map', status: 'active' },
  { id: 8, name: 'Misc', slug: 'misc', icon: 'fa fa-cubes', status: 'active' },
];

export function CategoryNav() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic fetch from Database
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          const activeOnly = data.categories.filter((c: any) => c.status !== 'disabled');
          setCategories(activeOnly);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        console.log('CategoryNav fetch error:', err);
        setCategories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  if (!isLoading && categories.length === 0) {
    return null; // Don't show empty categories bar if user hasn't added categories yet
  }

  return (
    <>
      {/* Desktop Classic Navigation Banner (Screens >= 992px) */}
      <div className="desktop-category-banner hidden-xs hidden-sm">
        <div id="banner">
          <div className="container">
            <ul id="navigation">
              {categories.map((cat) => {
                const isKnownClass = ['tools', 'vehicles', 'paintjobs', 'weapons', 'scripts', 'player', 'maps', 'misc'].includes(cat.slug.toLowerCase());
                return (
                  <li key={cat.slug} className={isKnownClass ? cat.slug.toLowerCase() : 'custom-category'}>
                    <Link href={`/${cat.slug}`}>
                      {isKnownClass ? (
                        <span className="icon-category" />
                      ) : (
                        <span className="icon-category" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={cat.icon || 'fa fa-cube'} style={{ fontSize: 24, color: '#ffffff' }} />
                        </span>
                      )}
                      <span className="label-category">
                        <span>{cat.name}</span>
                      </span>
                      <span className="label-border" />
                    </Link>
                  </li>
                );
              })}
              {categories.length > 0 && (
                <li className="more">
                  <Link href="/all">
                    <span className="icon-category" />
                    <span className="label-category">
                      <span>More</span>
                    </span>
                    <span className="label-border" />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Instagram Story Carousel (Screens < 992px) */}
      <div className="story-categories-wrapper visible-xs visible-sm">
        <div className="container">
          <div className="story-carousel-container">
            {canScrollLeft && (
              <button
                type="button"
                className="story-nav-btn story-nav-prev"
                onClick={() => handleScroll('left')}
                aria-label="Previous categories"
              >
                <span className="fa fa-chevron-left" aria-hidden="true" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="story-carousel-track"
              onScroll={checkScroll}
            >
              {categories.map((cat) => {
                const slugLower = cat.slug.toLowerCase();
                const imageSrc = DEFAULT_IMAGES[slugLower] || '/images/catgirl_1.jpg';
                const gradient = DEFAULT_GRADIENTS[slugLower] || 'linear-gradient(45deg, #10b981, #3b82f6)';
                const iconClass = cat.icon || 'fa fa-cube';

                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="story-item"
                    title={`Browse ${cat.name}`}
                  >
                    <div className="story-ring" style={{ background: gradient }}>
                      <div className="story-circle">
                        <Image
                          src={imageSrc}
                          alt={cat.name}
                          width={72}
                          height={72}
                          className="story-img"
                          referrerPolicy="no-referrer"
                        />
                        <div className="story-icon-overlay">
                          <span className={iconClass} aria-hidden="true" />
                        </div>
                      </div>
                      {cat.badge && <span className="story-badge">{cat.badge}</span>}
                    </div>
                    <span className="story-label">{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            {canScrollRight && (
              <button
                type="button"
                className="story-nav-btn story-nav-next"
                onClick={() => handleScroll('right')}
                aria-label="Next categories"
              >
                <span className="fa fa-chevron-right" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
