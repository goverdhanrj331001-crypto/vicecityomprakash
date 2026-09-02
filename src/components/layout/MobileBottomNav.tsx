'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

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

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fetch dynamic categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          const activeOnly = data.categories.filter((c: any) => c.status !== 'disabled');
          setCategories(activeOnly);
        }
      })
      .catch((err) => console.log('MobileBottomNav fetch categories error:', err));

    // Read stored user orders count if available
    try {
      const storedOrders = localStorage.getItem('user_orders');
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed)) {
          setOrderCount(parsed.length);
        }
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  // Hide on admin routes as admin has its own layout
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isSearchActive = pathname?.startsWith('/search');
  const isOrdersActive = pathname?.startsWith('/orders');
  const isCategoryActive =
    !isHomeActive &&
    !isSearchActive &&
    !isOrdersActive &&
    !pathname?.startsWith('/checkout') &&
    !pathname?.startsWith('/admin');

  return (
    <>
      {/* Category Quick Sheet Modal on Mobile */}
      {showCategorySheet && (
        <div
          id="mobile-category-sheet-backdrop"
          className="mobile-sheet-backdrop"
          onClick={() => setShowCategorySheet(false)}
        >
          <div
            id="mobile-category-sheet"
            className="mobile-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-header">
              <div className="sheet-title-wrapper">
                <span className="fa fa-th-large" style={{ color: '#dc2626', fontSize: 18 }} />
                <h3>Browse Categories</h3>
              </div>
              <button
                id="close-category-sheet-btn"
                type="button"
                className="sheet-close-btn"
                onClick={() => setShowCategorySheet(false)}
                aria-label="Close categories"
              >
                <i className="fa fa-times" />
              </button>
            </div>

            <div className="mobile-sheet-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px 8px' }}>
              <Link
                href="/"
                className="story-item"
                style={{ width: '76px', margin: '0 auto', padding: 0 }}
                onClick={() => setShowCategorySheet(false)}
              >
                <div 
                  className="story-ring" 
                  style={{ 
                    background: 'linear-gradient(45deg, #f59e0b, #eab308, #facc15)',
                    transform: isHomeActive ? 'scale(1.05)' : 'none',
                    boxShadow: isHomeActive ? '0 0 12px rgba(32, 186, 78, 0.6)' : '0 2px 6px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  <div className="story-circle">
                    <Image
                      src="/images/observatory.jpg"
                      alt="All Categories"
                      width={72}
                      height={72}
                      className="story-img"
                      referrerPolicy="no-referrer"
                    />
                    <div className="story-icon-overlay">
                      <span className="fa fa-star" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <span 
                  className="story-label" 
                  style={{ 
                    fontSize: '11px', 
                    marginTop: '6px', 
                    fontWeight: isHomeActive ? '700' : '600',
                    color: isHomeActive ? '#dc2626' : undefined
                  }}
                >
                  All Mods
                </span>
              </Link>

              {categories.map((cat) => {
                const isActive = pathname === `/${cat.slug}`;
                const slugLower = cat.slug.toLowerCase();
                const isImage = cat.icon && (cat.icon.startsWith('http://') || cat.icon.startsWith('https://') || cat.icon.startsWith('/') || cat.icon.startsWith('data:'));
                const imageSrc = isImage ? cat.icon : (DEFAULT_IMAGES[slugLower] || '/images/catgirl_1.jpg');
                const gradient = DEFAULT_GRADIENTS[slugLower] || 'linear-gradient(45deg, #10b981, #3b82f6)';
                
                let iconClass = '';
                if (!isImage && cat.icon) {
                  iconClass = cat.icon.startsWith('fa') ? cat.icon : `fa fa-${cat.icon}`;
                }

                return (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="story-item"
                    style={{ width: '76px', margin: '0 auto', padding: 0 }}
                    onClick={() => setShowCategorySheet(false)}
                  >
                    <div 
                      className="story-ring" 
                      style={{ 
                        background: gradient,
                        transform: isActive ? 'scale(1.05)' : 'none',
                        boxShadow: isActive ? '0 0 12px rgba(32, 186, 78, 0.6)' : '0 2px 6px rgba(0, 0, 0, 0.12)'
                      }}
                    >
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
                    <span 
                      className="story-label" 
                      style={{ 
                        fontSize: '11px', 
                        marginTop: '6px', 
                        fontWeight: isActive ? '700' : '600',
                        color: isActive ? '#dc2626' : undefined
                      }}
                    >
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Fixed Mobile Bottom Nav */}
      <div id="mobile-bottom-bar" className="mobile-bottom-navigation">
        <div className="mobile-nav-inner" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          {/* 1. Home */}
          <Link
            id="mobile-nav-home"
            href="/"
            className={`mobile-nav-tab ${isHomeActive ? 'active' : ''}`}
            aria-label="Home"
          >
            <div className="mobile-tab-icon-wrap">
              <i className="fa fa-home mobile-tab-icon" />
              {isHomeActive && <span className="mobile-tab-indicator" />}
            </div>
            <span className="mobile-tab-label">Home</span>
          </Link>

          {/* 2. Categories Drawer */}
          <button
            id="mobile-nav-categories"
            type="button"
            className={`mobile-nav-tab ${isCategoryActive || showCategorySheet ? 'active' : ''}`}
            onClick={() => setShowCategorySheet(!showCategorySheet)}
            aria-label="Categories"
          >
            <div className="mobile-tab-icon-wrap">
              <i className="fa fa-th-large mobile-tab-icon" />
              {(isCategoryActive || showCategorySheet) && <span className="mobile-tab-indicator" />}
            </div>
            <span className="mobile-tab-label">Categories</span>
          </button>

          {/* 3. Search */}
          <Link
            id="mobile-nav-search"
            href="/search"
            className={`mobile-nav-tab ${isSearchActive ? 'active' : ''}`}
            aria-label="Search"
          >
            <div className="mobile-tab-icon-wrap">
              <i className="fa fa-search mobile-tab-icon" />
              {isSearchActive && <span className="mobile-tab-indicator" />}
            </div>
            <span className="mobile-tab-label">Search</span>
          </Link>

          {/* 4. My Orders */}
          <Link
            id="mobile-nav-orders"
            href="/orders"
            className={`mobile-nav-tab ${isOrdersActive ? 'active' : ''}`}
            aria-label="My Orders"
          >
            <div className="mobile-tab-icon-wrap">
              <i className="fa fa-shopping-bag mobile-tab-icon" />
              {orderCount > 0 && <span className="mobile-nav-badge">{orderCount}</span>}
              {isOrdersActive && <span className="mobile-tab-indicator" />}
            </div>
            <span className="mobile-tab-label">My Orders</span>
          </Link>
        </div>
      </div>
    </>
  );
}
