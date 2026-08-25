'use client';

import React, { useState } from 'react';
import type { AdminUser } from '@/lib/adminData';

interface UsersTabProps {
  users: AdminUser[];
  onAddUser: (u: AdminUser) => void;
  onUpdateUserRole: (id: string, role: AdminUser['role']) => void;
  onToggleUserStatus: (id: string) => void;
}

export function UsersTab({
  users,
  onAddUser,
  onUpdateUserRole,
  onToggleUserStatus,
}: UsersTabProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('customer');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: AdminUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      mobile: mobile || '0000000000',
      role,
      ordersCount: 0,
      totalSpent: 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    };

    onAddUser(newUser);
    setShowModal(false);
    setName('');
    setEmail('');
    setMobile('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            User Accounts &amp; Access Control ({filtered.length})
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Manage registered members, mod creators, and super administrative permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#1a1749',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fa fa-user-plus" />
          <span>Add New User Account</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="Search by Name, Email or Mobile Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '9px 14px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 13 }}
        />
      </div>

      {/* USERS TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover" style={{ fontSize: 13, verticalAlign: 'middle', margin: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#475569', fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Member</th>
                <th style={{ padding: '12px' }}>Contact Info</th>
                <th style={{ padding: '12px' }}>Orders</th>
                <th style={{ padding: '12px' }}>Total Spent</th>
                <th style={{ padding: '12px' }}>Joined Date</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          backgroundColor: '#1a1749',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                          flexShrink: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {u.name ? u.name.charAt(0) : (u.email ? u.email.charAt(0) : 'U')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 500, color: '#1e293b' }}>{u.email}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{u.mobile || '—'}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{u.ordersCount}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>${u.totalSpent.toFixed(2)}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: '#64748b' }}>{u.joinedDate}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 700,
                        backgroundColor: u.status === 'active' ? '#f4f4f5' : '#fee2e2',
                        color: u.status === 'active' ? '#0f172a' : '#dc2626',
                      }}
                    >
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onToggleUserStatus(u.id)}
                      style={{
                        backgroundColor: u.status === 'active' ? '#f4f4f5' : '#1a1749',
                        color: u.status === 'active' ? '#0a0a0a' : '#ffffff',
                        border: u.status === 'active' ? '1px solid #d4d4d8' : 'none',
                        borderRadius: 4,
                        padding: '4px 10px',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15,23,42,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              maxWidth: 440,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Create New Account</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0000000000"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
