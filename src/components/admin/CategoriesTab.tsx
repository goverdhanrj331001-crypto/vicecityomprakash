'use client';

import React, { useState } from 'react';
import type { AdminCategory } from '@/lib/adminData';

interface CategoriesTabProps {
  categories: AdminCategory[];
  onAddCategory: (cat: AdminCategory) => void;
  onUpdateCategory: (cat: AdminCategory) => void;
}

export function CategoriesTab({
  categories,
  onAddCategory,
  onUpdateCategory,
}: CategoriesTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('https://files.gta5-mods.com/images/2021-bugatti-chiron-super-sport-300-add-on-tuning-auto-spoiler/792c0b-1.jpg');
  const [isPermitted, setIsPermitted] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat: AdminCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: 'fa-folder-o',
      modsCount: 0,
      revenue: 0,
      status: isPermitted ? 'active' : 'disabled',
    };

    onAddCategory(newCat);
    setViewMode('list');
    setName('');
    setImageUrl('');

    // Sync to Supabase
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    }).catch(() => {});
  };

  const handleTogglePermission = (cat: AdminCategory) => {
    const updated: AdminCategory = {
      ...cat,
      status: cat.status === 'active' ? 'disabled' : 'active',
    };
    onUpdateCategory(updated);

    // Sync to Supabase
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  // ADD CATEGORY SCREEN VIEW
  if (viewMode === 'add') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: '20px 24px',
            border: '1px solid #e4e4e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                backgroundColor: '#1a1749',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <i className="fa fa-arrow-left" />
              <span>Back to Categories</span>
            </button>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
                Add New Category Screen
              </h2>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
                Upload category cover image and enter category name
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 32,
            border: '1px solid #e4e4e7',
            maxWidth: 680,
          }}
        >
          <form onSubmit={handleSave}>
            {/* 1. Category Name */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luxury Sports Cars"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid #d4d4d8',
                  borderRadius: 6,
                  fontSize: 14,
                  outline: 'none',
                  backgroundColor: '#fafafa',
                }}
              />
            </div>

            {/* 2. Image Upload / Image URL */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Category Banner Image (Upload / URL)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {imageUrl && (
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: '#000000',
                      border: '1px solid #d4d4d8',
                    }}
                  >
                    <img src={imageUrl} alt="Category Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or upload file..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      border: '1px solid #d4d4d8',
                      borderRadius: 6,
                      fontSize: 14,
                      outline: 'none',
                      backgroundColor: '#fafafa',
                    }}
                  />
                  <label
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 20px',
                      backgroundColor: '#1a1749',
                      color: '#ffffff',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}
                  >
                    <i className="fa fa-cloud-upload" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const fakeUrl = URL.createObjectURL(file);
                          setImageUrl(fakeUrl);
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Category Permission Toggle */}
            <div style={{ marginBottom: 32, padding: 16, backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Show Category Permission</div>
                  <div style={{ fontSize: 11, color: '#71717a' }}>Enable visibility for users in store menu</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPermitted}
                  onChange={(e) => setIsPermitted(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: '#000000', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f4f4f5',
                  color: '#0a0a0a',
                  border: '1px solid #d4d4d8',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // DEFAULT LIST VIEW
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* HEADER */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 20,
          border: '1px solid #e4e4e7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
            Categories &amp; Display Permissions ({categories.length})
          </h2>
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
            Manage category name, uploads, and switch category permissions (show or hide)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewMode('add')}
          style={{
            backgroundColor: '#1a1749',
            color: '#ffffff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <i className="fa fa-plus" />
          <span>Add Category Screen</span>
        </button>
      </div>

      {/* CATEGORIES GRID */}
      <div className="row" style={{ margin: 0 }}>
        {categories.map((cat) => {
          const isVisible = cat.status === 'active';
          return (
            <div key={cat.id} className="col-xs-12 col-sm-6 col-md-4" style={{ padding: '0 8px 16px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  padding: 20,
                  border: '1px solid #e4e4e7',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                      }}
                    >
                      <i className={`fa ${cat.icon || 'fa-folder'}`} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0a0a0a' }}>{cat.name}</h3>
                      <div style={{ fontSize: 11, color: '#71717a' }}>{cat.modsCount} Products</div>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      backgroundColor: isVisible ? '#000000' : '#f4f4f5',
                      color: isVisible ? '#ffffff' : '#71717a',
                    }}
                  >
                    {isVisible ? 'Shown' : 'Hidden'}
                  </span>
                </div>

                {/* PERMISSION SWITCH TOGGLE */}
                <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0a0a0a' }}>Show Permission</span>
                  <button
                    type="button"
                    onClick={() => handleTogglePermission(cat)}
                    style={{
                      backgroundColor: isVisible ? '#1a1749' : '#e4e4e7',
                      color: isVisible ? '#ffffff' : '#0a0a0a',
                      border: 'none',
                      borderRadius: 4,
                      padding: '5px 12px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isVisible ? 'Visible (Allowed)' : 'Hidden (Restricted)'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
