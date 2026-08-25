'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Navbar() {
  const [query, setQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('gta_theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('gta_theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('gta_theme', 'light');
      }
      return nextMode;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav id="main-nav" className="navbar navbar-default">
      <div className="container nav-flex-container">
        {/* Left Side: 5MODS Brand Logo */}
        <div className="nav-brand-wrapper">
          <Link className="navbar-brand" href="/" aria-label="GTA5-Mods Home" />
        </div>

        {/* Center: Wide Full-Stretched Search Bar */}
        <div className="nav-center-search">
          <form className="search-box-form" onSubmit={handleSearch}>
            <div className="search-box-wrapper">
              <span className="search-icon fa fa-search" aria-hidden="true" />
              <input
                type="text"
                className="search-input"
                placeholder="Search GTA 5 mods, vehicles, scripts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search mods"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <i className="fa fa-times" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: My Orders Link & Dark/Light Mode Switch */}
        <div className="nav-right-toggle" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
            title="View My Purchased Orders & Digital Downloads"
          >
            <i className="fa fa-shopping-bag" />
            <span className="hide-on-mobile">My Orders</span>
          </Link>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={mounted && isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label={mounted && isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            <span
              className={`fa ${mounted && isDarkMode ? 'fa-sun-o' : 'fa-moon-o'}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
