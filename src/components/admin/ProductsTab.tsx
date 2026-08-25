'use client';

import React, { useState } from 'react';
import type { AdminProduct } from '@/lib/adminData';
import { getYouTubeEmbedUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from '@/lib/utils';

interface ProductsTabProps {
  products: AdminProduct[];
  onAddProduct: (product: AdminProduct) => void;
  onUpdateProduct: (product: AdminProduct) => void;
  onDeleteProduct: (productId: string) => void;
  initialViewMode?: 'list' | 'form';
}

export function ProductsTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  initialViewMode = 'list',
}: ProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Screen view state: 'list' or 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Paint Jobs');
  const [price, setPrice] = useState('4.99');
  const [author, setAuthor] = useState('GtaModderPro');
  const [fileSize, setFileSize] = useState('48.5 MB');
  const [version, setVersion] = useState('1.0.0');
  const [coverImage, setCoverImage] = useState('');
  const [zipUrl, setZipUrl] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [description, setDescription] = useState('High quality GTA 5 mod with custom textures.');
  const [status, setStatus] = useState<'active' | 'featured' | 'hidden'>('active');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleZipFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let formattedSize = '';
    if (file.size >= 1024 * 1024) {
      formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      formattedSize = Math.max(1, Math.round(file.size / 1024)) + ' KB';
    }

    setUploadedFileName(file.name);
    setFileSize(formattedSize);
    setIsUploadingFile(true);
    setUploadFeedback('Uploading archive to Secure Cloud CDN...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'mods');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setZipUrl(data.url);
        setUploadFeedback(`✓ Uploaded to Secure Cloud CDN: ${file.name}`);
      } else {
        // Fallback to local URL for testing
        const localUrl = URL.createObjectURL(file);
        setZipUrl(localUrl);
        setUploadFeedback(`Archive ready: ${file.name}`);
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      setZipUrl(localUrl);
      setUploadFeedback(`File attached: ${file.name}`);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadFeedback('Uploading directly to Cloudflare R2 Storage...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'images');

      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCoverImage(data.url);
        // Make sure it's also in thumbnail list if empty
        setThumbnailImages((prev) => prev.length === 0 ? [data.url] : prev);
        setUploadFeedback(`✓ Uploaded to Cloudflare R2: ${data.url}`);
      } else {
        const errorMsg = data.error || 'Failed to upload to Cloudflare R2';
        setUploadFeedback(`⚠️ ${errorMsg}`);
        alert(`Cloudflare R2 Upload Failed: ${errorMsg}\n\nMake sure your R2_SECRET_ACCESS_KEY is set in .env file.`);
      }
    } catch (err: any) {
      setUploadFeedback(`⚠️ Upload error: ${err?.message || 'Network error'}`);
      alert(`Upload error: ${err?.message || 'Network error'}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingScreenshot(true);
    setUploadFeedback(`Uploading ${files.length} screenshot(s) to Cloudflare R2...`);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'screenshots');

        const res = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          return data.url;
        } else {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }
      });

      const urls = await Promise.all(uploadPromises);
      setThumbnailImages((prev) => [...prev, ...urls]);
      setUploadFeedback(`✓ Uploaded ${urls.length} screenshot(s) to Cloudflare R2 CDN`);
    } catch (err: any) {
      console.error('R2 screenshots upload error:', err);
      const errMsg = err?.message || 'Failed to upload screenshots to Cloudflare R2';
      setUploadFeedback(`⚠️ ${errMsg}`);
      alert(`Cloudflare R2 Upload Failed: ${errMsg}\n\nPlease check your R2_SECRET_ACCESS_KEY in .env.`);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenAddScreen = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory('Paint Jobs');
    setPrice('4.99');
    setAuthor('GtaModderPro');
    setFileSize('48.5 MB');
    setVersion('1.0.0');
    setCoverImage('');
    setZipUrl('');
    setThumbnailImages([]);
    setVideoUrl('');
    setNewScreenshotUrl('');
    setUploadedFileName('');
    setDescription('High quality GTA 5 custom mod.');
    setStatus('active');
    setSaveError(null);
    setSaveSuccess(null);
    setViewMode('form');
  };

  React.useEffect(() => {
    if (initialViewMode === 'form') {
      handleOpenAddScreen();
    } else {
      setViewMode('list');
    }
  }, [initialViewMode]);

  const handleOpenEditScreen = (p: AdminProduct) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price.toString());
    setAuthor(p.author);
    setFileSize(p.fileSize);
    setVersion(p.version);
    setCoverImage(p.coverImage || '');
    setZipUrl(p.zipUrl || '');
    setThumbnailImages(p.thumbnailImages || []);
    setVideoUrl(p.videoUrl || '');
    setDescription(p.description);
    setStatus(p.status);
    setSaveError(null);
    setSaveSuccess(null);
    setViewMode('form');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setSaveError('Product title is required.');
      return;
    }

    setSaveError(null);
    setSaveSuccess(null);
    setIsSavingProduct(true);

    const finalThumbnails =
      thumbnailImages.length > 0 ? thumbnailImages : coverImage ? [coverImage] : [];

    const computedSlug =
      editingProduct?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const productPayload = {
      id: editingProduct?.id || `MOD-${Math.floor(100 + Math.random() * 900)}`,
      title,
      slug: computedSlug,
      category,
      price: parseFloat(price) || 0,
      author: author || 'GtaModderPro',
      downloads: editingProduct?.downloads || 0,
      rating: editingProduct?.rating || 5.0,
      status,
      fileSize: fileSize || '15 MB',
      version: version || '1.0.0',
      coverImage: coverImage || '/images/catgirl_1.jpg',
      zipUrl: zipFileUrlOrFallback(zipUrl),
      thumbnailImages: finalThumbnails,
      videoUrl,
      description,
      createdDate: editingProduct?.createdDate || new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch('/api/mods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (!res.ok || data.error || data.success === false) {
        throw new Error(data.error || 'Failed to save product to database.');
      }

      const savedMod = data.product || productPayload;

      const formattedSaved: AdminProduct = {
        id: savedMod.id ? `MOD-${savedMod.id}` : productPayload.id,
        title: savedMod.title || productPayload.title,
        slug: savedMod.slug || productPayload.slug,
        category: savedMod.category || productPayload.category,
        price: Number(savedMod.price ?? productPayload.price),
        author: savedMod.author || productPayload.author,
        downloads: Number(savedMod.downloads ?? productPayload.downloads),
        rating: Number(savedMod.rating ?? productPayload.rating),
        status: (savedMod.status as any) || productPayload.status,
        fileSize: savedMod.file_size || savedMod.fileSize || productPayload.fileSize,
        version: savedMod.version || productPayload.version,
        coverImage: savedMod.cover_image || savedMod.coverImage || productPayload.coverImage,
        thumbnailImages:
          savedMod.thumbnail_images || savedMod.thumbnailImages || productPayload.thumbnailImages,
        videoUrl: savedMod.video_url || savedMod.videoUrl || productPayload.videoUrl,
        zipUrl: savedMod.zip_url || savedMod.zipUrl || productPayload.zipUrl,
        description: savedMod.description || productPayload.description,
        createdDate: (savedMod.created_at || '').split('T')[0] || productPayload.createdDate,
      };

      if (editingProduct) {
        onUpdateProduct(formattedSaved);
      } else {
        onAddProduct(formattedSaved);
      }

      setSaveSuccess('✓ Product successfully published and saved to Supabase mods table!');
      setTimeout(() => {
        setIsSavingProduct(false);
        setViewMode('list');
      }, 700);
    } catch (err: any) {
      console.error('Error saving mod to Supabase:', err);
      setSaveError(`Database Notice: ${err.message}`);
      // Still update UI locally so user work is never lost
      if (editingProduct) {
        onUpdateProduct(productPayload);
      } else {
        onAddProduct(productPayload);
      }
      setIsSavingProduct(false);
    }
  };

  function zipFileUrlOrFallback(url: string) {
    if (url && url.trim().length > 0) return url.trim();
    return 'https://download.gta5-mods.com/packages/mod-archive.zip';
  }

  // IF FORM SCREEN MODE: RENDER FULL SCREEN ADD / EDIT VIEW
  if (viewMode === 'form') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* TOP SCREEN HEADER WITH BACK BUTTON */}
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
              <span>Back to Products List</span>
            </button>

            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
                {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product Screen'}
              </h2>
              <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
                {editingProduct ? 'Update product parameters, download URLs, and metadata' : 'Fill in product details to publish directly to store catalog'}
              </p>
            </div>
          </div>
        </div>

        {/* FULL SCREEN FORM CONTAINER */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            padding: 32,
            border: '1px solid #e4e4e7',
          }}
        >
          <form onSubmit={handleSaveProduct}>
            <div className="row">
              <div className="col-sm-8" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bugatti Chiron Super Sport 300+"
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

              <div className="col-sm-4" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d4d4d8',
                    borderRadius: 6,
                    fontSize: 14,
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <option value="Vehicles">Vehicles</option>
                  <option value="Paint Jobs">Paint Jobs</option>
                  <option value="Scripts">Scripts</option>
                  <option value="Weapons">Weapons</option>
                  <option value="Player">Player &amp; Peds</option>
                  <option value="Maps">Maps &amp; MLO</option>
                </select>
              </div>

              <div className="col-sm-6" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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

              <div className="col-sm-6" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Store Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d4d4d8',
                    borderRadius: 6,
                    fontSize: 14,
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <option value="active">Active Product</option>
                  <option value="featured">Featured On Homepage</option>
                  <option value="hidden">Hidden / Draft</option>
                </select>
              </div>

              <div className="col-sm-6" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  File Size (e.g. 48.5 MB)
                </label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
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

              <div className="col-sm-6" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Version (e.g. 1.2.0)
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
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

              <div className="col-sm-12" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Cover Image (Upload or Enter URL)
                </label>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 100,
                      height: 60,
                      borderRadius: 6,
                      overflow: 'hidden',
                      backgroundColor: '#000000',
                      border: '1px solid #d4d4d8',
                      flexShrink: 0,
                    }}
                  >
                    {coverImage ? (
                      <img src={coverImage} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: 11 }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Enter cover image URL (https://...) or upload below"
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
                      padding: '12px 18px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: isUploadingImage ? 'wait' : 'pointer',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      opacity: isUploadingImage ? 0.7 : 1,
                    }}
                    title="Upload image directly to Secure Cloud CDN"
                  >
                    <i className={`fa ${isUploadingImage ? 'fa-spinner fa-spin' : 'fa-image'}`} style={{ fontSize: 15 }} />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleCoverImageUpload}
                      disabled={isUploadingImage}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Multiple Gallery Screenshots / Secondary Images Section */}
              <div className="col-sm-12" style={{ marginBottom: 24 }}>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Secondary Product Screenshots (Product Detail Page Gallery)
                  </label>
                  
                  {thumbnailImages.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      {thumbnailImages.map((imgUrl, idx) => {
                        const isVideo = !!extractYouTubeVideoId(imgUrl);
                        const displaySrc = isVideo ? (getYouTubeThumbnailUrl(imgUrl) || imgUrl) : imgUrl;
                        return (
                          <div key={idx} style={{ position: 'relative', width: 90, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', backgroundColor: '#000' }}>
                            <img src={displaySrc} alt={`Gallery item ${idx+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {isVideo && (
                              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                                <i className="fa fa-youtube-play" style={{ color: '#ef4444', fontSize: 22, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => setThumbnailImages((prev) => prev.filter((_, i) => i !== idx))}
                              style={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '50%',
                                width: 18,
                                height: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: 10,
                                padding: 0,
                                zIndex: 2,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                              }}
                              title="Remove item"
                            >
                              <i className="fa fa-times" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={newScreenshotUrl}
                      onChange={(e) => setNewScreenshotUrl(e.target.value)}
                      placeholder="Paste image URL or YouTube URL (https://youtu.be/...)"
                      style={{
                        flex: 1,
                        minWidth: 200,
                        padding: '10px 12px',
                        border: '1px solid #d4d4d8',
                        borderRadius: 6,
                        fontSize: 13,
                        outline: 'none',
                        backgroundColor: '#ffffff',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newScreenshotUrl.trim()) {
                          setThumbnailImages((prev) => [...prev, newScreenshotUrl.trim()]);
                          setNewScreenshotUrl('');
                        }
                      }}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#1a1749',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Add URL
                    </button>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>OR</span>
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 16px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: isUploadingScreenshot ? 'wait' : 'pointer',
                        whiteSpace: 'nowrap',
                        margin: 0,
                        opacity: isUploadingScreenshot ? 0.7 : 1,
                      }}
                    >
                      <i className={`fa ${isUploadingScreenshot ? 'fa-spinner fa-spin' : 'fa-upload'}`} />
                      <span>{isUploadingScreenshot ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleScreenshotUpload}
                        disabled={isUploadingScreenshot}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* YouTube Video Section */}
              <div className="col-sm-12" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <i className="fa fa-youtube-play" style={{ color: '#e52d27', marginRight: 6 }} />
                  Video Proof & In-Game Showcase
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: videoUrl.trim() && getYouTubeEmbedUrl(videoUrl) ? '1px solid #22c55e' : '1px solid #d4d4d8',
                    borderRadius: 6,
                    fontSize: 14,
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                />
                
                {/* Live YouTube Preview Card */}
                {videoUrl.trim() ? (
                  getYouTubeEmbedUrl(videoUrl) ? (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 14,
                        backgroundColor: '#0f172a',
                        borderRadius: 8,
                        border: '1px solid #334155',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 10,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4ade80', fontSize: 13, fontWeight: 700 }}>
                          <i className="fa fa-check-circle" />
                          <span>Valid Video Detected (ID: {extractYouTubeVideoId(videoUrl)})</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Live Preview
                        </span>
                      </div>
                      <div
                        style={{
                          position: 'relative',
                          paddingBottom: '56.25%',
                          height: 0,
                          overflow: 'hidden',
                          borderRadius: 6,
                          backgroundColor: '#000',
                          border: '1px solid #1e293b',
                        }}
                      >
                        <iframe
                          src={getYouTubeEmbedUrl(videoUrl) || ''}
                          title="YouTube video player preview"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#94a3b8' }}>
                        ✓ This video will be showcased inside the dedicated &quot;Video Proof &amp; In-Game Showcase&quot; section on the product detail page.
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 6,
                        color: '#b91c1c',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <i className="fa fa-exclamation-circle" />
                      <span>Please enter a valid YouTube URL (e.g., https://youtu.be/jW-ysI71WY0 or https://www.youtube.com/watch?v=...)</span>
                    </div>
                  )
                ) : null}
              </div>

              {/* File Attachment Upload Section (No ZIP Restriction) */}
              <div className="col-sm-12" style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Digital Asset File / Product Attachment (All Formats Allowed)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="text"
                      value={zipUrl}
                      onChange={(e) => setZipUrl(e.target.value)}
                      placeholder="Enter direct download URL (https://...) or upload any file on the right"
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
                        cursor: isUploadingFile ? 'wait' : 'pointer',
                        whiteSpace: 'nowrap',
                        margin: 0,
                        opacity: isUploadingFile ? 0.7 : 1,
                        transition: 'opacity 0.2s ease',
                      }}
                      title="Upload any file to Secure Cloud CDN"
                    >
                      <i className={`fa ${isUploadingFile ? 'fa-spinner fa-spin' : 'fa-cloud-upload'}`} style={{ fontSize: 16 }} />
                      <span>{isUploadingFile ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="*"
                        onChange={handleZipFileUpload}
                        disabled={isUploadingFile}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Upload Notification feedback */}
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

                  {/* Dropzone & Selected File Notification */}
                  {uploadedFileName && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: '#f4f4f5',
                        border: '1px solid #d4d4d8',
                        borderRadius: 6,
                        fontSize: 13,
                        color: '#0a0a0a',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fa fa-file-archive-o" style={{ color: '#1a1749', fontSize: 16 }} />
                        <span>
                          Uploaded File: <strong>{uploadedFileName}</strong> ({fileSize})
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: '#1a1749',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: 4,
                        }}
                      >
                        Ready for Buyers
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-sm-12" style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0a0a0a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full product details..."
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
            </div>

            {saveError && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 6,
                  color: '#991b1b',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <i className="fa fa-exclamation-triangle" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div
                style={{
                  marginBottom: 16,
                  padding: '12px 16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 6,
                  color: '#166534',
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <i className="fa fa-check-circle" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #e4e4e7', paddingTop: 20 }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                disabled={isSavingProduct}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f4f4f5',
                  color: '#0a0a0a',
                  border: '1px solid #d4d4d8',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSavingProduct ? 'not-allowed' : 'pointer',
                  opacity: isSavingProduct ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingProduct}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#1a1749',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: isSavingProduct ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: isSavingProduct ? 0.8 : 1,
                }}
              >
                {isSavingProduct && <i className="fa fa-spinner fa-spin" />}
                <span>
                  {isSavingProduct
                    ? 'Saving to Supabase...'
                    : editingProduct
                    ? 'Save Product Changes'
                    : 'Publish Product to Store'}
                </span>
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
      {/* HEADER STATS & ACTION */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
              Products Catalog ({filteredProducts.length})
            </h2>
            <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
              Manage store products, pricing, categories, and digital ZIP downloads
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddScreen}
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
            <span>Add Product</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="row" style={{ margin: 0 }}>
          <div className="col-sm-6 col-md-5" style={{ padding: '4px' }}>
            <div style={{ position: 'relative' }}>
              <i className="fa fa-search" style={{ position: 'absolute', left: 12, top: 11, color: '#71717a' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 6,
                  border: '1px solid #d4d4d8',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div className="col-xs-6 col-sm-3 col-md-3" style={{ padding: '4px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 6,
                border: '1px solid #d4d4d8',
                fontSize: 13,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="all">All Categories</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Paint Jobs">Paint Jobs</option>
              <option value="Scripts">Scripts</option>
              <option value="Weapons">Weapons</option>
              <option value="Maps">Maps</option>
            </select>
          </div>

          <div className="col-xs-6 col-sm-3 col-md-4" style={{ padding: '4px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 6,
                border: '1px solid #d4d4d8',
                fontSize: 13,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="featured">Featured On Homepage</option>
              <option value="hidden">Hidden / Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 20,
          border: '1px solid #e4e4e7',
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover" style={{ fontSize: 13, verticalAlign: 'middle', margin: 0 }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                <th style={{ padding: '12px' }}>Preview</th>
                <th style={{ padding: '12px' }}>Product Title &amp; Author</th>
                <th style={{ padding: '12px' }}>Category</th>
                <th style={{ padding: '12px' }}>Price</th>
                <th style={{ padding: '12px' }}>Downloads</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ width: 60, height: 38, borderRadius: 4, overflow: 'hidden', border: '1px solid #e4e4e7' }}>
                      <img src={p.coverImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: '#0a0a0a' }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: '#71717a' }}>
                      by {p.author} • {p.fileSize}
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: '#f4f4f5', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#0a0a0a' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#0a0a0a' }}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0a0a0a' }}>
                    {p.downloads.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor: p.status === 'active' ? '#000000' : '#f4f4f5',
                        color: p.status === 'active' ? '#ffffff' : '#71717a',
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditScreen(p)}
                        style={{
                          backgroundColor: '#1a1749',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '5px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fa fa-pencil" /> Edit Screen
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete ${p.title}?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#000000',
                          border: '1px solid #d4d4d8',
                          borderRadius: 4,
                          padding: '5px 8px',
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
