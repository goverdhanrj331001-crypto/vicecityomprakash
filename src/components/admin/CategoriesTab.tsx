'use client';

import React, { useState } from 'react';
import type { AdminCategory } from '@/lib/adminData';

interface CategoriesTabProps {
  categories: AdminCategory[];
  onAddCategory: (cat: AdminCategory) => void;
  onUpdateCategory: (cat: AdminCategory) => void;
  onDeleteCategory?: (id: string) => void;
}

export function CategoriesTab({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoriesTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isPermitted, setIsPermitted] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-generate slug from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Always store the raw file so we can upload it at save time if needed
    setSelectedFile(file);
    setIsUploadingImage(true);
    setUploadFeedback('Uploading category image...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'images');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url && data.isR2Active) {
        // Real R2 CDN URL — store directly, no need to re-upload at save time
        setImageUrl(data.url);
        setSelectedFile(null);
        setUploadFeedback(`✓ Image uploaded to cloud: ${file.name}`);
      } else if (data.success && data.url) {
        // R2 returned a URL but file may not be in bucket yet — keep file for re-upload at save
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
        setUploadFeedback(`Image selected (will upload on save): ${file.name}`);
      } else {
        // Upload failed, keep local preview
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
        setUploadFeedback(`Image selected (will upload on save): ${file.name}`);
      }
    } catch (err: any) {
      console.warn('Image upload notice:', err);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setUploadFeedback(`Image selected (will upload on save): ${file.name}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    const categorySlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // If imageUrl is a blob (local preview) and we still have the file, upload it now to Supabase Storage
    let finalIconValue = imageUrl.trim();
    if (selectedFile && (finalIconValue.startsWith('blob:') || finalIconValue === '')) {
      try {
        setUploadFeedback('Uploading image to storage...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', 'images');
        const uploadRes = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          finalIconValue = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn('Image upload at save time failed:', uploadErr);
      }
    }

    // If still no valid URL (blob or empty), fallback to cube icon
    if (!finalIconValue || finalIconValue.startsWith('blob:')) {
      finalIconValue = 'fa fa-cube';
    }

    const newCat: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: categorySlug,
      icon: finalIconValue,
      modsCount: 0,
      revenue: 0,
      status: isPermitted ? 'active' : 'disabled',
    };

    onAddCategory(newCat);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCat,
          description: description.trim(),
        }),
      });
      const result = await res.json();
      if (!result.success) {
        console.error('Supabase save error:', result.error);
        alert('Category save failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving category to Supabase:', err);
      alert('Network error while saving category. Please try again.');
    } finally {
      setIsSaving(false);
      setViewMode('list');
      setName('');
      setSlug('');
      setImageUrl('');
      setSelectedFile(null);
      setDescription('');
      setUploadFeedback(null);
    }
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

  const handleDelete = (cat: AdminCategory) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      if (onDeleteCategory) {
        onDeleteCategory(cat.id);
      } else {
        fetch('/api/categories', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: cat.slug, id: cat.id }),
        }).catch(() => {});
      }
    }
  };

  // Helper to determine if icon string is an image URL
  const isImageSrc = (icon?: string) => {
    if (!icon) return false;
    const str = icon.trim().toLowerCase();
    return (
      str.startsWith('http://') ||
      str.startsWith('https://') ||
      str.startsWith('/') ||
      str.startsWith('data:image')
    );
  };

  // Helper to format FontAwesome class
  const getIconClass = (icon?: string) => {
    if (!icon) return 'fa fa-cube';
    const trimmed = icon.trim();
    if (trimmed.startsWith('fa ') || trimmed.startsWith('fa-')) {
      return trimmed.startsWith('fa ') ? trimmed : `fa ${trimmed}`;
    }
    return `fa fa-${trimmed}`;
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
                Upload category cover icon/image and enter category details (stored in Supabase)
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
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luxury Supercars or Anime Liveries"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
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

            {/* 2. Category Slug */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                URL Slug
              </label>
              <input
                type="text"
                placeholder="e.g. luxury-supercars"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
              <span style={{ fontSize: 11, color: '#71717a', marginTop: 4, display: 'block' }}>
                Used in page URL: /{slug || 'category-name'}
              </span>
            </div>

            {/* 3. Image Upload / Icon URL */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Category Icon / Banner Image (Upload File or Enter URL / FontAwesome)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {imageUrl && (
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: '#18181b',
                      border: '1px solid #d4d4d8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isImageSrc(imageUrl) ? (
                      <img
                        src={imageUrl}
                        alt="Category Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <i className={getIconClass(imageUrl)} style={{ fontSize: 48, color: '#ffffff' }} />
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Enter Image URL (https://...) or FontAwesome class (e.g. fa-car, fa-cube)"
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
                      cursor: isUploadingImage ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      opacity: isUploadingImage ? 0.7 : 1,
                    }}
                    title="Upload image directly to Storage CDN"
                  >
                    <i className={`fa ${isUploadingImage ? 'fa-spinner fa-spin' : 'fa-cloud-upload'}`} />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {uploadFeedback && (
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 6,
                      fontSize: 12,
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <i className="fa fa-info-circle" />
                    <span>{uploadFeedback}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Description */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Short description for this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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

            {/* 5. Category Permission Toggle */}
            <div style={{ marginBottom: 32, padding: 16, backgroundColor: '#fafafa', border: '1px solid #e4e4e7', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a' }}>Show Category Permission</div>
                  <div style={{ fontSize: 11, color: '#71717a' }}>Enable visibility for users in store menu and navigation</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPermitted}
                  onChange={(e) => setIsPermitted(e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: '#000000', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                disabled={isSaving}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f4f4f5',
                  color: '#0a0a0a',
                  border: '1px solid #d4d4d8',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: isSaving ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {isSaving && <i className="fa fa-spinner fa-spin" />}
                <span>{isSaving ? 'Saving...' : 'Save Category'}</span>
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
            Manage category name, icon images, and switch category permissions (show or hide)
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setImageUrl('');
            setUploadFeedback(null);
            setViewMode('add');
          }}
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
        {categories.length === 0 ? (
          <div className="col-xs-12" style={{ padding: '32px 16px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #e4e4e7' }}>
            <i className="fa fa-folder-open-o" style={{ fontSize: 36, color: '#a1a1aa', marginBottom: 12 }} />
            <h4 style={{ color: '#0a0a0a', fontWeight: 700, margin: '0 0 6px 0' }}>No Categories Found</h4>
            <p style={{ color: '#71717a', fontSize: 13, margin: '0 0 16px 0' }}>Click the button above to add your first category with image icon.</p>
          </div>
        ) : (
          categories.map((cat) => {
            const isVisible = cat.status === 'active';
            const hasImage = isImageSrc(cat.icon);

            return (
              <div key={cat.id || cat.slug} className="col-xs-12 col-sm-6 col-md-4" style={{ padding: '0 8px 16px' }}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    padding: 20,
                    border: '1px solid #e4e4e7',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    height: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '1px solid #e4e4e7',
                        }}
                      >
                        {hasImage ? (
                          <img
                            src={cat.icon}
                            alt={cat.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback on image load error
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <i className={getIconClass(cat.icon)} />
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.name}
                        </h3>
                        <div style={{ fontSize: 11, color: '#71717a' }}>
                          /{cat.slug} • {cat.modsCount || 0} Products
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor: isVisible ? '#1a1749' : '#f4f4f5',
                        color: isVisible ? '#ffffff' : '#71717a',
                        flexShrink: 0,
                      }}
                    >
                      {isVisible ? 'Shown' : 'Hidden'}
                    </span>
                  </div>

                  {/* PERMISSION SWITCH TOGGLE & DELETE BUTTON */}
                  <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleTogglePermission(cat)}
                      style={{
                        backgroundColor: isVisible ? '#f4f4f5' : '#1a1749',
                        color: isVisible ? '#0a0a0a' : '#ffffff',
                        border: '1px solid #d4d4d8',
                        borderRadius: 4,
                        padding: '6px 12px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <i className={`fa ${isVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                      <span>{isVisible ? 'Hide from Store' : 'Show in Store'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#ef4444',
                        border: '1px solid #fca5a5',
                        borderRadius: 4,
                        padding: '6px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      title={`Delete ${cat.name}`}
                    >
                      <i className="fa fa-trash-o" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
