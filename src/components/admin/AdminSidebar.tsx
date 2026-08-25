'use client';

import React from 'react';
import Link from 'next/link';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'transactions'
  | 'users'
  | 'payments'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingOrdersCount: number;
  onLogout: () => void;
  themeMode?: 'light' | 'dark';
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: string;
  badge?: number;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  pendingOrdersCount,
  onLogout,
  themeMode = 'light',
}: AdminSidebarProps) {
  const isDark = themeMode === 'dark';

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer' },
    { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', badge: pendingOrdersCount },
    { id: 'products', label: 'Products', icon: 'fa-cubes' },
    { id: 'categories', label: 'Categories', icon: 'fa-folder' },
    { id: 'transactions', label: 'Transactions', icon: 'fa-exchange' },
    { id: 'users', label: 'Users & Roles', icon: 'fa-users' },
    { id: 'payments', label: 'Payment Methods', icon: 'fa-credit-card' },
    { id: 'settings', label: 'Store Settings', icon: 'fa-cog' },
  ];

  const bgColor = isDark ? '#000000' : '#0a0a0a';
  const borderColor = isDark ? '#262626' : '#1f1f1f';

  return (
    <aside
      style={{
        width: collapsed ? 80 : 260,
        backgroundColor: bgColor,
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: 'width 0.2s ease',
        borderRight: `1px solid ${borderColor}`,
      }}
    >
      {/* BRAND HEADER */}
      <div
        style={{
          padding: '20px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: `1px solid ${borderColor}`,
          minHeight: 72,
        }}
      >
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            textDecoration: 'none',
            color: '#ffffff',
            paddingLeft: collapsed ? 0 : 12,
          }}
          title="View Live Store"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{
              width: 38,
              height: 38,
              objectFit: 'contain',
              borderRadius: 6,
              flexShrink: 0,
              backgroundColor: '#ffffff',
            }}
          />
        </Link>

        {!collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: 14,
              padding: 4,
            }}
            title="Collapse Sidebar"
          >
            <i className="fa fa-angle-left" />
          </button>
        )}
      </div>

      {/* NAVIGATION LINKS */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#71717a',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            padding: '0 12px 10px',
            display: collapsed ? 'none' : 'block',
          }}
        >
          Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  gap: 12,
                  width: '100%',
                  padding: collapsed ? '12px' : '10px 14px',
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: isActive ? '#1a1749' : 'transparent',
                  color: isActive ? '#ffffff' : '#a1a1aa',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                title={collapsed ? item.label : undefined}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fa ${item.icon}`} style={{ width: 18, fontSize: 15, textAlign: 'center' }} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && item.badge && item.badge > 0 ? (
                  <span
                    style={{
                      backgroundColor: isActive ? '#ffffff' : '#1a1749',
                      color: isActive ? '#1a1749' : '#ffffff',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 10,
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ADMIN USER FOOTER */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${borderColor}`,
          backgroundColor: isDark ? '#050505' : '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 12,
              color: '#ffffff',
              border: '1px solid #52525b',
              flexShrink: 0,
            }}
          >
            AD
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Goverdhan Admin
              </div>
              <div style={{ fontSize: 11, color: '#a1a1aa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Super Admin
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              cursor: 'pointer',
              fontSize: 14,
              padding: 6,
            }}
            title="Sign Out"
          >
            <i className="fa fa-sign-out" />
          </button>
        )}
      </div>
    </aside>
  );
}
