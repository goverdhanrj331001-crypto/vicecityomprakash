import React from 'react';
import Link from 'next/link';
import { ModGallery } from '@/components/mod/ModGallery';
import { ModDescription } from '@/components/mod/ModDescription';
import { ModSidebar } from '@/components/mod/ModSidebar';
import { PRODUCT_DETAIL_MOD, LATEST_MODS } from '@/lib/mockData';

const mod = PRODUCT_DETAIL_MOD;

// Related mods in same category (exclude current)
const relatedMods = LATEST_MODS.filter(
  (m) => m.category === mod.category && m.slug !== mod.slug
).slice(0, 4);

export default function ModDetailPage() {
  return (
    <div id="content" style={{ paddingBottom: 60 }}>
      <div id="file" className="container" data-user-file-id={mod.id}>
        {/* Header Breadcrumb & Title */}
        <div className="clearfix" style={{ marginTop: 15, marginBottom: 15 }}>
          <div style={{ marginBottom: 8 }}>
            <Link href="/" style={{ color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
              &larr; Back to Catalog
            </Link>
            <span style={{ margin: '0 8px', color: '#ccc' }}>/</span>
            <Link href={`/${mod.category}`} style={{ color: '#666', fontSize: 13, textTransform: 'capitalize' }}>
              {mod.category}
            </Link>
          </div>

          <h1 style={{ marginTop: 0, marginBottom: 5, fontSize: 24, fontWeight: 700 }}>
            {mod.title}
            <span className="version" style={{ marginLeft: 10, fontSize: 14 }}>{mod.version}</span>
          </h1>
        </div>

        <div id="file-container" className="row">
          {/* Main content area (Left on desktop: Gallery, Video Proof & Product Details) */}
          <div className="col-sm-7 col-lg-8">
            {/* Gallery Screenshots */}
            <ModGallery
              coverImage={mod.coverImage}
              thumbnailImages={mod.thumbnailImages}
              title={mod.title}
            />

            {/* Video Proof Section (Directly Above Description) */}
            <div style={{ marginBottom: 25 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#333',
                }}
              >
                <i className="fa fa-youtube-play" style={{ color: '#e52d27', fontSize: 18 }} />
                <span>Video Proof & In-Game Showcase</span>
              </div>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 4,
                  border: '1px solid #ddd',
                  backgroundColor: '#000',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <iframe
                  src="https://www.youtube-nocookie.com/embed/qXN8jL6k77c?rel=0&modestbranding=1"
                  title={`${mod.title} - Video Proof Showcase`}
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
            </div>

            {/* Product Details & Description */}
            <ModDescription
              description={mod.description}
              tags={mod.tags}
              firstUploadedAt={mod.firstUploadedAt}
              lastUpdatedAt={mod.lastUpdatedAt}
            />
          </div>

          {/* Right Sidebar (Right on desktop: Price, Buy Now, Inclusions & Author) */}
          <ModSidebar
            slug={mod.slug}
            category={mod.category}
            author={mod.author}
            price="$4.99"
            fileSize="18.5 MB"
            relatedMods={relatedMods}
            productTitle={mod.title}
            coverImage={mod.coverImage}
          />
        </div>
      </div>
    </div>
  );
}
