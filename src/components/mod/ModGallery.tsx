'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/utils';

interface ModGalleryProps {
  coverImage: string;
  thumbnailImages: string[];
  title: string;
}

export function ModGallery({
  coverImage,
  thumbnailImages,
  title,
}: ModGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(coverImage);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync selectedImage if coverImage changes
  useEffect(() => {
    if (coverImage) {
      setSelectedImage(coverImage);
    }
  }, [coverImage]);

  // Check if current selected item is a YouTube video
  const isSelectedVideo = !!extractYouTubeVideoId(selectedImage);
  const selectedVideoEmbedUrl = isSelectedVideo ? getYouTubeEmbedUrl(selectedImage) : null;

  // Find index of the selected image in the thumbnails array
  const currentIndex = thumbnailImages.indexOf(selectedImage);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (thumbnailImages.length <= 1) return;
    const newIdx = (currentIndex - 1 + thumbnailImages.length) % thumbnailImages.length;
    setSelectedImage(thumbnailImages[newIdx]);
  }, [currentIndex, thumbnailImages]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (thumbnailImages.length <= 1) return;
    const newIdx = (currentIndex + 1) % thumbnailImages.length;
    setSelectedImage(thumbnailImages[newIdx]);
  }, [currentIndex, thumbnailImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <div id="file-media" style={{ marginBottom: 20 }}>
      {/* Main Selected Image or Video */}
      <div className="text-center">
        {isSelectedVideo && selectedVideoEmbedUrl ? (
          <div
            className="thumbnail cover-media"
            style={{
              padding: 0,
              border: '1px solid #334155',
              overflow: 'hidden',
              backgroundColor: '#000000',
              marginBottom: 10,
              position: 'relative',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={`${selectedVideoEmbedUrl}&autoplay=1`}
                title={`${title} - Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="thumbnail cover-media group relative cursor-pointer"
            style={{
              padding: 0,
              border: '1px solid #ddd',
              overflow: 'hidden',
              backgroundColor: '#111',
              marginBottom: 10,
              position: 'relative',
              cursor: 'zoom-in',
            }}
          >
            {/* Main Image */}
            <Image
              className="img-responsive"
              src={selectedImage || '/images/catgirl_1.jpg'}
              alt={title}
              width={800}
              height={450}
              style={{ objectFit: 'contain', width: '100%', maxHeight: 450 }}
              priority
              referrerPolicy="no-referrer"
            />

            {/* Hover Zoom Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
              }}
              className="hover-zoom-overlay"
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  color: '#111111',
                  padding: '10px 16px',
                  borderRadius: 30,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <ZoomIn size={16} />
                <span>Click to view Fullscreen</span>
              </div>
            </div>

            {/* Inject a quick CSS class for hover */}
            <style jsx global>{`
              .cover-media:hover .hover-zoom-overlay {
                opacity: 1 !important;
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Thumbnail strip including screenshots & videos */}
      {thumbnailImages.length > 0 && (
        <div className="media-thumbnails row" style={{ margin: '0 -4px' }}>
          {thumbnailImages.map((src, index) => {
            const isItemVideo = !!extractYouTubeVideoId(src);
            const thumbSrc = isItemVideo ? (getYouTubeThumbnailUrl(src) || src) : src;
            const isSelected = selectedImage === src;

            return (
              <div key={index} className="col-xs-3 col-md-2" style={{ padding: '0 4px', marginBottom: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(src);
                  }}
                  className="thumbnail animate-thumbnail"
                  style={{
                    padding: 2,
                    marginBottom: 0,
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #dc2626' : '1px solid #ddd',
                    width: '100%',
                    background: '#000',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'block',
                  }}
                  title={isItemVideo ? 'Play YouTube Video' : `Screenshot ${index + 1}`}
                >
                  <img
                    className="img-responsive"
                    src={thumbSrc}
                    alt={`${title} item ${index + 1}`}
                    style={{ objectFit: 'cover', width: '100%', height: 56 }}
                  />
                  {isItemVideo && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                        }}
                      >
                        <Play size={10} fill="#ffffff" style={{ marginLeft: 1 }} />
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px 16px',
              userSelect: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Top Bar inside Lightbox */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto',
                zIndex: 10,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>
                {title} {thumbnailImages.length > 1 && <span style={{ opacity: 0.6, marginLeft: 8 }}>({currentIndex + 1} / {thumbnailImages.length})</span>}
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                title="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Middle Container for main image and arrows */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                maxHeight: 'calc(100vh - 160px)',
                overflowY: 'auto',
                padding: '20px 0',
              }}
            >
              {/* Left Navigation Arrow */}
              {thumbnailImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  style={{
                    position: 'absolute',
                    left: 20,
                    zIndex: 15,
                    backgroundColor: 'rgba(20, 20, 20, 0.6)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Central Expanded Scrollable Image / Video Container */}
              <div
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflowY: 'auto',
                  overflowX: 'auto',
                  padding: '10px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {isSelectedVideo && selectedVideoEmbedUrl ? (
                  <div
                    style={{
                      width: '85vw',
                      maxWidth: '900px',
                      aspectRatio: '16/9',
                      backgroundColor: '#000000',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
                    }}
                  >
                    <iframe
                      src={`${selectedVideoEmbedUrl}&autoplay=1`}
                      title={`${title} - Lightbox Video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                ) : (
                  <img
                    src={selectedImage}
                    alt={title}
                    style={{
                      maxHeight: '75vh',
                      maxWidth: '90vw',
                      objectFit: 'contain',
                      borderRadius: 4,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                    }}
                  />
                )}
              </div>

              {/* Right Navigation Arrow */}
              {thumbnailImages.length > 1 && (
                <button
                  onClick={handleNext}
                  style={{
                    position: 'absolute',
                    right: 20,
                    zIndex: 15,
                    backgroundColor: 'rgba(20, 20, 20, 0.6)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(20, 20, 20, 0.6)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Next Image"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnail Strip inside Lightbox */}
            {thumbnailImages.length > 1 && (
              <div
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  margin: '0 auto',
                  overflowX: 'auto',
                  padding: '10px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  zIndex: 10,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    overflowX: 'auto',
                    paddingBottom: 4,
                    maxWidth: '100%',
                  }}
                >
                  {thumbnailImages.map((src, index) => {
                    const isItemVideo = !!extractYouTubeVideoId(src);
                    const thumbSrc = isItemVideo ? (getYouTubeThumbnailUrl(src) || src) : src;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(src)}
                        style={{
                          padding: 0,
                          backgroundColor: '#111',
                          border: selectedImage === src ? '2px solid #dc2626' : '2px solid rgba(255,255,255,0.2)',
                          borderRadius: 4,
                          overflow: 'hidden',
                          width: 70,
                          height: 46,
                          flexShrink: 0,
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'border 0.2s',
                        }}
                      >
                        <img
                          src={thumbSrc}
                          alt={`Thumb ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {isItemVideo && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0,0,0,0.3)',
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: '#dc2626',
                                color: '#ffffff',
                                borderRadius: '50%',
                                width: 16,
                                height: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Play size={8} fill="#ffffff" style={{ marginLeft: 1 }} />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

