'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar, type AdminTab } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { DashboardTab } from './DashboardTab';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { TransactionsTab } from './TransactionsTab';
import { UsersTab } from './UsersTab';
import { PaymentsTab } from './PaymentsTab';
import { SettingsTab } from './SettingsTab';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  INITIAL_PAYMENT_CONFIG,
  INITIAL_SITE_SETTINGS,
  type AdminOrder,
  type AdminProduct,
  type AdminCategory,
  type AdminTransaction,
  type AdminUser,
  type PaymentGatewaysConfig,
  type SiteSettings,
} from '@/lib/adminData';

export function AdminLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [productsInitialViewMode, setProductsInitialViewMode] = useState<'list' | 'form'>('list');

  // State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewaysConfig>(INITIAL_PAYMENT_CONFIG);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  // Selected Order Modal
  const [selectedOrderModal, setSelectedOrderModal] = useState<AdminOrder | null>(null);

  // Fetch real Supabase data on mount
  useEffect(() => {
    // 1. Fetch live Products / Mods from Supabase
    fetch('/api/mods')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const mappedProducts: AdminProduct[] = data.products.map((m: any, idx: number) => ({
            id: m.slug ? `MOD-${m.id || idx + 100}` : m.id,
            title: m.title,
            slug: m.slug,
            category: m.category,
            price: Number(m.price || 0),
            version: m.version || '1.0.0',
            downloads: Number(m.downloads || 0),
            rating: Number(m.rating || 5),
            status: m.status || 'active',
            fileSize: m.file_size || m.fileSize || '15 MB',
            coverImage: m.cover_image || m.coverImage || '/images/catgirl_1.jpg',
            thumbnailImages: m.thumbnail_images || m.thumbnailImages || [],
            videoUrl: m.video_url || m.videoUrl || '',
            zipUrl: m.zip_url || m.zipUrl || '',
            author: m.author || 'GtaModderPro',
            createdDate: (m.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
          }));
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => {
        console.log('Live mods sync notice:', err);
        setProducts([]);
      });

    // 2. Fetch live Orders from Supabase
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && Array.isArray(data.orders)) {
          const mappedOrders: AdminOrder[] = data.orders.map((o: any) => ({
            id: o.order_id || o.id,
            customerName: o.customer_name || o.customerName,
            customerEmail: o.customer_email || o.customerEmail,
            customerMobile: o.customer_mobile || o.customerMobile,
            country: o.country || 'India',
            countryFlag: o.country_flag || o.countryFlag,
            modTitle: o.mod_title || o.modTitle,
            modSlug: o.mod_slug || o.modSlug,
            modCategory: o.mod_category || o.modCategory,
            paymentMethod: (o.payment_method || o.paymentMethod || 'upi').toLowerCase() as any,
            amountUsd: Number(o.amount_usd || o.amountUsd || 0),
            amountInr: Number(o.amount_inr || o.amountInr || 0),
            status: (o.status || 'completed').toLowerCase() as any,
            date: (o.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
            gatewayTxnId: o.gateway_txn_id || o.gatewayTxnId || 'TXN_LOCAL',
          }));
          setOrders(mappedOrders);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => {
        console.log('Live orders sync notice:', err);
        setOrders([]);
      });

    // 3. Fetch Categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        console.log('Live categories sync notice:', err);
        setCategories([]);
      });

    // 4. Fetch Payment Gateways Config
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setPaymentConfig(data.config);
        }
      })
      .catch((err) => {
        console.log('Payment gateways sync notice:', err);
      });
  }, []);

  // Sync Transactions and Users realistically based on real DB Orders
  useEffect(() => {
    // 1. Generate Transactions (only for completed orders)
    const mappedTxns: AdminTransaction[] = orders
      .filter((o) => o.status === 'completed')
      .map((o) => {
        return {
          id: `TXN-${o.id.replace('ORD-', '')}`,
          orderId: o.id,
          gateway: o.paymentMethod,
          gatewayRef: o.gatewayTxnId || 'TXN_LOCAL',
          grossUsd: o.amountUsd,
          feeUsd: 0,
          netUsd: o.amountUsd,
          status: 'success',
          date: o.date,
          customer: o.customerName,
        };
      });
    setTransactions(mappedTxns);

    // 2. Generate Unique Users
    const userMap = new Map<string, AdminUser>();

    // Seed realistic administrative and content creator accounts
    userMap.set('goverdhanrj331001@gmail.com', {
      id: 'USR-001',
      name: 'Goverdhan Admin',
      email: 'goverdhanrj331001@gmail.com',
      mobile: '+91 0000000000',
      role: 'super_admin',
      ordersCount: orders.filter((o) => o.customerEmail === 'goverdhanrj331001@gmail.com').length,
      totalSpent: Number(orders.filter((o) => o.customerEmail === 'goverdhanrj331001@gmail.com' && o.status === 'completed').reduce((s, o) => s + o.amountUsd, 0).toFixed(2)),
      status: 'active',
      joinedDate: '2026-01-01',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    });

    userMap.set('modderpro@5mods.com', {
      id: 'USR-002',
      name: 'GtaModderPro',
      email: 'modderpro@5mods.com',
      mobile: '+91 9123456789',
      role: 'modder',
      ordersCount: orders.filter((o) => o.customerEmail === 'modderpro@5mods.com').length,
      totalSpent: Number(orders.filter((o) => o.customerEmail === 'modderpro@5mods.com' && o.status === 'completed').reduce((s, o) => s + o.amountUsd, 0).toFixed(2)),
      status: 'active',
      joinedDate: '2026-02-18',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    });

    // Populate actual customers from live orders
    orders.forEach((o, index) => {
      const email = o.customerEmail || 'customer@example.com';
      if (userMap.has(email)) {
        const u = userMap.get(email)!;
        // Skip admins/modders from being counted as standard customer roles unless they are just customers
        if (u.role === 'customer') {
          u.ordersCount += 1;
          if (o.status === 'completed') {
            u.totalSpent = Number((u.totalSpent + o.amountUsd).toFixed(2));
          }
        }
      } else {
        userMap.set(email, {
          id: `USR-${100 + index}`,
          name: o.customerName || 'Anonymous Customer',
          email: email,
          mobile: o.customerMobile || 'N/A',
          role: 'customer',
          ordersCount: 1,
          totalSpent: o.status === 'completed' ? o.amountUsd : 0,
          status: 'active',
          joinedDate: o.date || new Date().toISOString().split('T')[0],
          avatar: `https://images.unsplash.com/photo-1535713875002?auto=format&fit=crop&w=120&q=80`,
        });
      }
    });

    setUsers(Array.from(userMap.values()));
  }, [orders]);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_authenticated');
    router.push('/serveromprakash');
  };

  // Handlers
  const handleAddOrder = (newOrd: AdminOrder) => {
    setOrders((prev) => [newOrd, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAddProduct = (newProd: AdminProduct) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: AdminProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    const productToDelete = products.find((p) => p.id === productId);
    if (productToDelete) {
      fetch('/api/mods', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: productToDelete.slug }),
      }).catch((err) => console.error('Error deleting product from Supabase:', err));
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddCategory = (newCat: AdminCategory) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (updatedCat: AdminCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const handleAddUser = (newUser: AdminUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUserRole = (id: string, role: AdminUser['role']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
  };

  const isDark = themeMode === 'dark';

  return (
    <div
      className={`admin-portal ${isDark ? 'dark-mode' : ''}`}
      style={{
        backgroundColor: isDark ? '#09090b' : '#fafafa',
        color: isDark ? '#f4f4f5' : '#09090b',
        minHeight: '100vh',
        display: 'flex',
        fontFamily: '"Open Sans", sans-serif',
      }}
    >
      {/* LEFT SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setProductsInitialViewMode('list');
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingOrdersCount={pendingOrdersCount}
        onLogout={handleLogout}
        themeMode={themeMode}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 80 : 260,
          transition: 'margin-left 0.25s ease-in-out',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* TOPBAR */}
        <AdminTopbar
          activeTab={activeTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onQuickAddMod={() => {
            setActiveTab('products');
            setProductsInitialViewMode('form');
          }}
          onLogout={handleLogout}
          themeMode={themeMode}
          onToggleTheme={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        />

        {/* PAGE CONTENT CONTAINER */}
        <main style={{ padding: 24, flex: 1 }}>
          {activeTab === 'dashboard' && (
            <DashboardTab
              orders={orders}
              products={products}
              users={users}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onViewOrderDetails={(ord) => setSelectedOrderModal(ord)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onAddOrder={handleAddOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              selectedOrderModal={selectedOrderModal}
              onCloseOrderModal={() => setSelectedOrderModal(null)}
              onOpenOrderModal={(ord) => setSelectedOrderModal(ord)}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              initialViewMode={productsInitialViewMode}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsTab transactions={transactions} />
          )}

          {activeTab === 'users' && (
            <UsersTab
              users={users}
              onAddUser={handleAddUser}
              onUpdateUserRole={handleUpdateUserRole}
              onToggleUserStatus={handleToggleUserStatus}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab
              paymentConfig={paymentConfig}
              onSavePaymentConfig={(cfg) => {
                setPaymentConfig(cfg);
                fetch('/api/payments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(cfg),
                }).catch((err) => console.error('Error saving payment config:', err));
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onSaveSettings={(st) => setSettings(st)}
            />
          )}
        </main>

        {/* Global CSS Overrides to adapt all Light-Mode hardcoded boxes to Premium Dark Mode */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .admin-portal.dark-mode select,
          .admin-portal.dark-mode input,
          .admin-portal.dark-mode textarea {
            background-color: #161619 !important;
            border-color: #27272a !important;
            color: #f4f4f5 !important;
          }

          .admin-portal.dark-mode select option {
            background-color: #161619 !important;
            color: #f4f4f5 !important;
          }

          /* White and off-white box container overrides in Dark Mode */
          .admin-portal.dark-mode div[style*="background-color: rgb(255, 255, 255)"],
          .admin-portal.dark-mode div[style*="background-color: #ffffff"],
          .admin-portal.dark-mode div[style*="backgroundColor: '#ffffff'"],
          .admin-portal.dark-mode div[style*="backgroundColor: '#fff'"],
          .admin-portal.dark-mode div[style*="background-color: rgb(248, 250, 252)"],
          .admin-portal.dark-mode div[style*="background-color: #f8fafc"],
          .admin-portal.dark-mode div[style*="backgroundColor: '#fafafa'"],
          .admin-portal.dark-mode div[style*="background-color: rgb(250, 250, 250)"],
          .admin-portal.dark-mode div[style*="background-color: #fafafa"] {
            background-color: #121214 !important;
            border-color: #27272a !important;
            color: #f4f4f5 !important;
          }

          /* Tables, headers, rows, and cells */
          .admin-portal.dark-mode table,
          .admin-portal.dark-mode thead,
          .admin-portal.dark-mode tbody,
          .admin-portal.dark-mode tr,
          .admin-portal.dark-mode th,
          .admin-portal.dark-mode td {
            background-color: #121214 !important;
            color: #f4f4f5 !important;
            border-color: #27272a !important;
          }

          .admin-portal.dark-mode tr:hover td {
            background-color: #1c1c1e !important;
          }

          .admin-portal.dark-mode tr style*="background-color: rgb(248, 250, 252)",
          .admin-portal.dark-mode tr style*="background-color: #f8fafc" {
            background-color: #161619 !important;
          }

          /* Header titles & typography tags */
          .admin-portal.dark-mode h1,
          .admin-portal.dark-mode h2,
          .admin-portal.dark-mode h3,
          .admin-portal.dark-mode h4,
          .admin-portal.dark-mode label,
          .admin-portal.dark-mode strong,
          .admin-portal.dark-mode th {
            color: #ffffff !important;
          }

          .admin-portal.dark-mode p,
          .admin-portal.dark-mode span:not([style*="color"]),
          .admin-portal.dark-mode td {
            color: #d4d4d8 !important;
          }

          .admin-portal.dark-mode span[style*="color: '#71717a'"],
          .admin-portal.dark-mode p[style*="color: '#71717a'"],
          .admin-portal.dark-mode div[style*="color: '#71717a'"],
          .admin-portal.dark-mode span[style*="color: '#64748b'"],
          .admin-portal.dark-mode p[style*="color: '#64748b'"] {
            color: #a1a1aa !important;
          }

          /* Force high-contrast legibility for all hardcoded dark gray/black colors in dark mode */
          .admin-portal.dark-mode [style*="color: rgb(10, 10, 10)"],
          .admin-portal.dark-mode [style*="color: rgb(15, 23, 42)"],
          .admin-portal.dark-mode [style*="color: rgb(30, 41, 59)"],
          .admin-portal.dark-mode [style*="color: rgb(51, 65, 85)"],
          .admin-portal.dark-mode [style*="color: rgb(71, 85, 105)"],
          .admin-portal.dark-mode [style*="color:#0a0a0a"],
          .admin-portal.dark-mode [style*="color:#0f172a"],
          .admin-portal.dark-mode [style*="color:#1e293b"],
          .admin-portal.dark-mode [style*="color:#334155"],
          .admin-portal.dark-mode [style*="color:#475569"],
          .admin-portal.dark-mode [style*="color: #0a0a0a"],
          .admin-portal.dark-mode [style*="color: #0f172a"],
          .admin-portal.dark-mode [style*="color: #1e293b"],
          .admin-portal.dark-mode [style*="color: #334155"],
          .admin-portal.dark-mode [style*="color: #475569"],
          .admin-portal.dark-mode div[style*="color: '#0a0a0a'"],
          .admin-portal.dark-mode div[style*="color: '#0f172a'"],
          .admin-portal.dark-mode div[style*="color: '#1e293b'"],
          .admin-portal.dark-mode div[style*="color: '#334155'"],
          .admin-portal.dark-mode div[style*="color: '#475569'"] {
            color: #f4f4f5 !important;
          }

          /* Also make subtitle text labels brighter and fully readable */
          .admin-portal.dark-mode [style*="color: rgb(113, 113, 122)"],
          .admin-portal.dark-mode [style*="color: rgb(100, 116, 139)"],
          .admin-portal.dark-mode [style*="color:#71717a"],
          .admin-portal.dark-mode [style*="color:#64748b"],
          .admin-portal.dark-mode [style*="color: #71717a"],
          .admin-portal.dark-mode [style*="color: #64748b"],
          .admin-portal.dark-mode div[style*="color: '#71717a'"],
          .admin-portal.dark-mode div[style*="color: '#64748b'"] {
            color: #cbd5e1 !important;
          }

          /* Highlight/active buttons adjustment */
          .admin-portal.dark-mode button[style*="background-color: rgb(26, 23, 73)"],
          .admin-portal.dark-mode button[style*="backgroundColor: '#1a1749'"] {
            background-color: #3b82f6 !important;
            color: #ffffff !important;
          }

          /* Neutral secondary buttons */
          .admin-portal.dark-mode button[style*="background-color: rgb(244, 244, 245)"],
          .admin-portal.dark-mode button[style*="backgroundColor: '#f4f4f5'"] {
            background-color: #27272a !important;
            color: #f4f4f5 !important;
            border-color: #3f3f46 !important;
          }

          /* Fix fixed background overlays for modal popups */
          .admin-portal.dark-mode div[style*="position: fixed"] {
            background-color: rgba(9, 9, 11, 0.8) !important;
          }
          .admin-portal.dark-mode div[style*="position: fixed"] > div {
            background-color: #121214 !important;
            border: 1px solid #27272a !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }

          /* Override all light-gray/white badges/pills and inline style boxes in dark mode to be black/dark */
          .admin-portal.dark-mode span[style*="background-color: rgb(244, 244, 245)"],
          .admin-portal.dark-mode span[style*="backgroundColor: '#f4f4f5'"],
          .admin-portal.dark-mode span[style*="background-color:#f4f4f5"],
          .admin-portal.dark-mode span[style*="background-color: #f4f4f5"],
          .admin-portal.dark-mode span[style*="background-color: rgb(250, 250, 250)"],
          .admin-portal.dark-mode span[style*="backgroundColor: '#fafafa'"],
          .admin-portal.dark-mode span[style*="background-color:#fafafa"],
          .admin-portal.dark-mode span[style*="background-color: #fafafa"],
          .admin-portal.dark-mode div[style*="background-color: rgb(244, 244, 245)"],
          .admin-portal.dark-mode div[style*="backgroundColor: '#f4f4f5'"],
          .admin-portal.dark-mode div[style*="background-color:#f4f4f5"],
          .admin-portal.dark-mode div[style*="background-color: #f4f4f5"],
          .admin-portal.dark-mode div[style*="background-color: rgb(250, 250, 250)"],
          .admin-portal.dark-mode div[style*="backgroundColor: '#fafafa'"],
          .admin-portal.dark-mode div[style*="background-color:#fafafa"],
          .admin-portal.dark-mode div[style*="background-color: #fafafa"] {
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #27272a !important;
          }

          /* Force black background on image previews in dark mode */
          .admin-portal.dark-mode div[style*="width: 60"] {
            background-color: #000000 !important;
            border-color: #27272a !important;
          }
        `}} />
      </div>
    </div>
  );
}
