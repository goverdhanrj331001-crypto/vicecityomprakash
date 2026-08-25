'use client';

import React, { useState } from 'react';
import type { AdminTab } from './AdminSidebar';

interface AdminTopbarProps {
  activeTab: AdminTab;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onQuickAddMod: () => void;
  onLogout: () => void;
  themeMode?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function AdminTopbar({
  activeTab,
  collapsed,
  onToggleCollapse,
  onQuickAddMod,
  onLogout,
  themeMode = 'light',
  onToggleTheme,
}: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isDark = themeMode === 'dark';

  const getPageTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time sales metrics & performance analytics' };
      case 'orders':
        return { title: 'Order Management', desc: 'Customer transactions, digital downloads & licenses' };
      case 'products':
        return { title: 'Product Catalog', desc: 'Publish, edit, and manage store products & digital assets' };
      case 'categories':
        return { title: 'Categories & Taxonomy', desc: 'Manage category name, image upload & store visibility permissions' };
      case 'transactions':
        return { title: 'Financial Transactions', desc: 'Payment gateway audit logs (UPI, Razorpay, PayPal, Binance)' };
      case 'users':
        return { title: 'Users & Roles', desc: 'Manage accounts, creator profiles, and access levels' };
      case 'payments':
        return { title: 'Payment Gateways', desc: 'Configure payment API credentials and checkout options' };
      case 'settings':
        return { title: 'Store Settings', desc: 'Global configuration, currency, and system preferences' };
      default:
        return { title: 'Admin Control Center', desc: 'Store Management System' };
    }
  };

  const pageInfo = getPageTitle(activeTab);

  const headerBg = isDark ? '#0a0a0a' : '#ffffff';
  const borderColor = isDark ? '#262626' : '#e5e5e5';
  const textColor = isDark ? '#ffffff' : '#0a0a0a';
  const subTextColor = isDark ? '#a1a1aa' : '#71717a';

  return (
    <header
      style={{
        height: 72,
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 900,
      }}
    >
      {/* LEFT: Toggle Button & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            backgroundColor: isDark ? '#18181b' : '#f4f4f5',
            border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
            borderRadius: 6,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            cursor: 'pointer',
            fontSize: 15,
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className="fa fa-bars" />
        </button>

        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: textColor, margin: 0, letterSpacing: '-0.02em' }}>
            {pageInfo.title}
          </h1>
          <p style={{ fontSize: 12, color: subTextColor, margin: 0 }}>
            {pageInfo.desc}
          </p>
        </div>
      </div>

      {/* RIGHT: Actions, Theme Switcher, Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Dark / Light Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          style={{
            backgroundColor: '#1a1749',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '7px 12px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s ease',
          }}
          title="Toggle Black / White Theme"
        >
          <i className={`fa ${isDark ? 'fa-sun-o' : 'fa-moon-o'}`} />
          <span className="hidden-xs">{isDark ? 'Light Theme' : 'Dark Theme'}</span>
        </button>

        {/* Quick Add Product Button */}
        <button
          type="button"
          onClick={onQuickAddMod}
          style={{
            backgroundColor: '#1a1749',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <i className="fa fa-plus" />
          <span className="hidden-xs">Add Product</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
              borderRadius: 6,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textColor,
              cursor: 'pointer',
              fontSize: 14,
              position: 'relative',
            }}
            title="Notifications"
          >
            <i className="fa fa-bell-o" />
            <span
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                backgroundColor: isDark ? '#ffffff' : '#000000',
                borderRadius: '50%',
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 44,
                width: 300,
                backgroundColor: headerBg,
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: `1px solid ${borderColor}`,
                padding: '12px 0',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '0 16px 8px', borderBottom: `1px solid ${borderColor}`, fontWeight: 700, fontSize: 12, color: textColor }}>
                System Activity
              </div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                <div style={{ padding: '10px 16px', borderBottom: `1px solid ${borderColor}`, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: textColor }}>New Order #ORD-9842</div>
                  <div style={{ color: subTextColor, fontSize: 11 }}>₹415 paid via UPI</div>
                </div>
                <div style={{ padding: '10px 16px', fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: textColor }}>Product Updated</div>
                  <div style={{ color: subTextColor, fontSize: 11 }}>Bugatti Chiron pricing modified</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar Menu */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              GA
            </div>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 44,
                width: 200,
                backgroundColor: headerBg,
                borderRadius: 8,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: `1px solid ${borderColor}`,
                padding: '8px 0',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${borderColor}` }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: textColor }}>Goverdhan Admin</div>
                <div style={{ fontSize: 11, color: subTextColor }}>admin@5mods.com</div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: textColor,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <i className="fa fa-sign-out" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
