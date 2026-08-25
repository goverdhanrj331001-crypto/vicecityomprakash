'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ModCard } from '@/components/shared/ModCard';
import { LATEST_MODS, MOST_LIKED_MODS } from '@/lib/mockData';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = (searchParams?.get('q') || '').toLowerCase().trim();

  const allMods = Array.from(new Map([...LATEST_MODS, ...MOST_LIKED_MODS].map((m) => [m.slug, m])).values());

  const filteredMods = query
    ? allMods.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query) ||
          m.author.username.toLowerCase().includes(query) ||
          m.subCategories.some((c) => c.toLowerCase().includes(query))
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
