'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ModCard } from '@/components/shared/ModCard';
import { LATEST_MODS, MOST_LIKED_MODS } from '@/lib/mockData';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = (searchParams?.get('q') || '').toLowerCase().trim();
  const [allMods, setAllMods] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/mods')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products && Array.isArray(data.products)) {
          setAllMods(data.products.map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            version: item.version || '1.0.0',
            category: (item.category || 'paintjobs').toLowerCase().replace(/[^a-z0-9]/g, ''),
            subCategories: item.sub_categories || [item.category || 'Paint Jobs'],
            author: { username: item.author || 'GtaModderPro' },
            stats: {
              downloads: Number(item.downloads || 0),
              likes: Number(item.likes || 0),
              rating: Number(item.rating || 5),
              commentsCount: Number(item.comments_count || 0),
            },
            tags: (item.tags || []).map((t: string) => ({ name: t, slug: t.toLowerCase() })),
            description: item.description || '',
            coverImage: item.cover_image || item.coverImage || '/images/catgirl_1.jpg',
            thumbnailImages: item.thumbnail_images || [item.cover_image || '/images/catgirl_1.jpg'],
            videoUrl: item.video_url || '',
            firstUploadedAt: item.created_at || '',
            lastUpdatedAt: item.updated_at || '',
            isFeatured: Boolean(item.is_featured || item.status === 'featured'),
            price: item.price !== undefined ? Number(item.price) : 0,
            fileSize: item.file_size || item.fileSize,
          })));
        } else {
          setAllMods([]);
        }
      })
      .catch(() => setAllMods([]));
  }, []);

  const filteredMods = query
    ? allMods.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query) ||
          (m.author?.username && m.author.username.toLowerCase().includes(query)) ||
          (m.subCategories && m.subCategories.some((c: string) => c.toLowerCase().includes(query)))
      )
    : allMods;

  return (
    <div id="content">
      <div className="container home-container">
        <div className="row">
          <div className="file-list col-md-12">
            <div className="row-heading" style={{ marginBottom: 20 }}>
              <h3>
                {query ? `Search Results for "${query}"` : 'All Mods'} ({filteredMods.length})
              </h3>
              <Link href="/">Back to Home</Link>
            </div>

            {filteredMods.length === 0 ? (
              <div className="alert alert-info" style={{ margin: '20px 0' }}>
                No mods found matching &quot;{query}&quot;. Try searching for something else like &quot;car&quot;, &quot;army&quot;, or &quot;sound&quot;.
              </div>
            ) : (
              <div className="row">
                {filteredMods.map((mod) => (
                  <div key={mod.id} className="col-xs-6 col-lg-3">
                    <ModCard mod={mod} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
