import React from 'react';
import { CategoryNav } from '@/components/home/CategoryNav';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { getDynamicMods } from '@/lib/supabaseServer';
import type { FeaturedMod, Mod } from '@/types';

export const revalidate = 0; // Fresh database query on each request

export default async function HomePage() {
  const dynamicMods = await getDynamicMods();

  // Extract featured mods from dynamic catalog
  const featuredList: FeaturedMod[] = dynamicMods
    .filter((m) => m.isFeatured)
    .map((m) => ({
      slug: m.slug,
      title: m.title,
      version: m.version,
      author: m.author.username,
      coverImage: m.coverImage,
      thumbnailImage: m.thumbnailImages?.[0] || m.coverImage,
      category: m.category,
    }));

  return (
    <>
      <CategoryNav />
      <div id="content">
        <div className="container home-container" style={{ paddingTop: 20 }}>
          {/* Featured Section */}
          {featuredList.length > 0 && (
            <div className="row" style={{ marginBottom: 25 }}>
              <FeaturedSection mods={featuredList} />
            </div>
          )}

          {/* Direct Mod Grid loaded dynamically from Supabase */}
          <div className="row">
            <ProductGrid mods={dynamicMods} />
          </div>
        </div>
      </div>
    </>
  );
}
