'use client';

import React, { useState } from 'react';
import type { SiteSettings } from '@/lib/adminData';

interface SettingsTabProps {
  settings: SiteSettings;
  onSaveSettings: (s: SiteSettings) => void;
}

export function SettingsTab({ settings, onSaveSettings }: SettingsTabProps) {
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            Store Configuration &amp; Settings
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Configure store branding, conversion rates, and server maintenance states
          </p>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(32, 186, 78, 0.25)',
          }}
        >
          <i className="fa fa-save" />
          <span>Save Store Settings</span>
        </button>
      </div>

      {saveSuccess && (
        <div
          style={{
            backgroundColor: '#e8f8ed',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '14px 18px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="fa fa-check-circle" style={{ fontSize: 18 }} />
          <span>Store Settings Saved Successfully!</span>
        </div>
      )}

      {/* SETTINGS CARDS */}
      <div className="row" style={{ margin: 0 }}>
        {/* General Store Details */}
        <div className="col-md-12" style={{ padding: '0 8px 16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>General Store Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="row" style={{ margin: 0 }}>
                <div className="col-sm-6" style={{ padding: '0 8px 12px' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Store Branding Title
                  </label>
                  <input
                    type="text"
                    value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                  />
                </div>

                <div className="col-sm-6" style={{ padding: '0 8px 12px' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
                  />
                </div>
              </div>


              <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#dc2626', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={form.maintenanceMode}
                    onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                    style={{ accentColor: '#dc2626', width: 16, height: 16 }}
                  />
                  <span>Enable Store Maintenance Mode (Redirects users to offline splash screen)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
