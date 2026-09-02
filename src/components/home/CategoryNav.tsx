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

function resolveCategoryIcon(iconStr?: string, slug?: string, name?: string): { isImage: boolean; value: string } {
  const raw = (iconStr || '').trim();

  // 1. Check if it's an Image URL
  if (
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('/') ||
    raw.startsWith('data:image')
  ) {
    return { isImage: true, value: raw };
  }

  const keyword = `${name || ''} ${slug || ''} ${raw}`.toLowerCase();

  // 2. Map keyword icons to valid FontAwesome 4.7 classes
  if (keyword.includes('animal') || keyword.includes('pet') || keyword.includes('dog') || keyword.includes('cat')) {
    return { isImage: false, value: 'fa fa-paw' };
  }
  if (keyword.includes('vehicle') || keyword.includes('car') || keyword.includes('bike') || keyword.includes('auto')) {
    return { isImage: false, value: 'fa fa-car' };
  }
  if (keyword.includes('paint') || keyword.includes('livery') || keyword.includes('skin')) {
    return { isImage: false, value: 'fa fa-paint-brush' };
  }
  if (keyword.includes('weapon') || keyword.includes('gun') || keyword.includes('ammo')) {
    return { isImage: false, value: 'fa fa-crosshairs' };
  }
  if (keyword.includes('script') || keyword.includes('code') || keyword.includes('mod')) {
    return { isImage: false, value: 'fa fa-code' };
  }
  if (keyword.includes('player') || keyword.includes('ped') || keyword.includes('character')) {
    return { isImage: false, value: 'fa fa-user' };
  }
  if (keyword.includes('map') || keyword.includes('mlo') || keyword.includes('location')) {
    return { isImage: false, value: 'fa fa-map-marker' };
  }
  if (keyword.includes('tool') || keyword.includes('util')) {
    return { isImage: false, value: 'fa fa-wrench' };
  }

  // 3. If raw starts with fa
  if (raw.startsWith('fa ') || raw.startsWith('fa-')) {
    return { isImage: false, value: raw.startsWith('fa ') ? raw : `fa ${raw}` };
  }

  if (raw) {
    return { isImage: false, value: `fa fa-${raw.replace(/^fa-?/, '')}` };
  }

  return { isImage: false, value: 'fa fa-cube' };
}

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
                const resolved = resolveCategoryIcon(cat.icon, cat.slug, cat.name);
                const isKnownClass =
                  !resolved.isImage &&
                  ['tools', 'vehicles', 'paintjobs', 'weapons', 'scripts', 'player', 'maps', 'misc'].includes(
                    cat.slug.toLowerCase()
                  );

                return (
                  <li key={cat.slug} className={isKnownClass ? cat.slug.toLowerCase() : 'custom-category'}>
                    <Link href={`/${cat.slug}`}>
                      {resolved.isImage ? (
                        <span
                          className="icon-category custom-icon"
                          style={{
                            background: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 115,
                            padding: '4px',
                          }}
                        >
                          <div
                            style={{
                              width: 58,
                              height: 58,
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              borderRadius: 12,
                              padding: 6,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={resolved.value}
                              alt={cat.name}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                        </span>
                      ) : isKnownClass ? (
                        <span className="icon-category" />
                      ) : (
                        <span
                          className="icon-category custom-icon"
                          style={{
                            background: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 115,
                          }}
                        >
                          <i
                            className={resolved.value}
                            style={{
                              fontSize: 44,
                              color: '#ffffff',
                              filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85))',
                            }}
                          />
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
                const resolved = resolveCategoryIcon(cat.icon, cat.slug, cat.name);
                const imageSrc = resolved.isImage ? resolved.value : (DEFAULT_IMAGES[slugLower] || '/images/catgirl_1.jpg');
                const gradient = DEFAULT_GRADIENTS[slugLower] || 'linear-gradient(45deg, #10b981, #3b82f6)';
                const iconClass = !resolved.isImage ? resolved.value : '';

                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="story-item"
                    title={`Browse ${cat.name}`}
                  >
                    <div className="story-ring" style={{ background: gradient }}>
                      <div className="story-circle">
                        <img
                          src={imageSrc}
                          alt={cat.name}
                          width={72}
                          height={72}
                          className="story-img"
                          referrerPolicy="no-referrer"
                          style={{ objectFit: 'cover' }}
                        />
                        {iconClass && (
                          <div className="story-icon-overlay">
                            <span className={iconClass} aria-hidden="true" />
                          </div>
                        )}
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
