import React from 'react';
import Link from 'next/link';
import { CategoryNav } from '@/components/home/CategoryNav';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { getDynamicMods } from '@/lib/supabaseServer';
import type { Mod } from '@/types';

interface CategoryPageProps {
  params: Promise<{ category: string }> | { category: string };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const categorySlug = resolvedParams.category.toLowerCase();

  const filteredMods = await getDynamicMods(categorySlug);

  return (
    <>
      <CategoryNav />
      <div id="content">
        <div className="container home-container" style={{ paddingTop: 20 }}>
          <div className="row" style={{ marginBottom: 20 }}>
            <div className="col-md-12">
              <Link href="/" style={{ color: '#dc2626', fontWeight: 600 }}>&larr; Back to All</Link>
            </div>
          </div>
          <div className="row">
             <ProductGrid 
                mods={filteredMods} 
                title={categorySlug === 'all' ? 'All Mods' : `${categorySlug} Mods`} 
             />
          </div>
        </div>
      </div>
    </>
  );
}
