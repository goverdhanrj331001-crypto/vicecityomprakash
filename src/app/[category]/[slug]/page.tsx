import React from 'react';
import Link from 'next/link';
import { ModGallery } from '@/components/mod/ModGallery';
import { ModDescription } from '@/components/mod/ModDescription';
import { ModSidebar } from '@/components/mod/ModSidebar';
import { notFound } from 'next/navigation';
import { getDynamicModBySlug, getDynamicMods } from '@/lib/supabaseServer';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import type { Mod, ModCategory } from '@/types';

interface ModPageProps {
  params: Promise<{ category: string; slug: string }> | { category: string; slug: string };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DynamicModDetailPage({ params }: ModPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const { category, slug } = resolvedParams;

  let mod = await getDynamicModBySlug(slug);

  if (!mod) {
    notFound();
  }

  const allModsForRelated = await getDynamicMods();
  const relatedMods = allModsForRelated
    .filter((m) => m.slug !== mod?.slug)
    .slice(0, 4);

  const videoEmbedUrl = mod.videoUrl
    ? getYouTubeEmbedUrl(mod.videoUrl)
    : (slug === 'purple-cat-girl-livery-annis-elegy-rh-7'
        ? 'https://www.youtube-nocookie.com/embed/qXN8jL6k77c?rel=0&modestbranding=1'
        : null);

  return (
    <div id="content" className="pb-[130px] md:pb-[60px]">
      <div id="file" className="container" data-user-file-id={mod.id}>
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
            <ModGallery
              coverImage={mod.coverImage}
              thumbnailImages={mod.thumbnailImages && mod.thumbnailImages.length > 0 ? mod.thumbnailImages : [mod.coverImage]}
              title={mod.title}
            />

            {/* Video Proof Section (Directly Above Description) */}
            {videoEmbedUrl && (
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
                    src={videoEmbedUrl}
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
            )}

            <ModDescription
              description={mod.description}
              tags={mod.tags || []}
              firstUploadedAt={mod.firstUploadedAt}
              lastUpdatedAt={mod.lastUpdatedAt}
            />
          </div>

          {/* Right Sidebar (Right on desktop: Price, Buy Now, Inclusions & Author) */}
          <ModSidebar
            slug={mod.slug}
            category={mod.category}
            author={mod.author}
            price={mod.price !== undefined && mod.price !== null ? `$${mod.price.toFixed(2)}` : "$4.99"}
            fileSize={mod.fileSize || "18.5 MB"}
            relatedMods={relatedMods}
            productTitle={mod.title}
            coverImage={mod.coverImage}
          />
        </div>
      </div>
    </div>
  );
}
