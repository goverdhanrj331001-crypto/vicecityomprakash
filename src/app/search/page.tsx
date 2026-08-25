import React, { Suspense } from 'react';
import { CategoryNav } from '@/components/home/CategoryNav';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage() {
  return (
    <>
      <CategoryNav />
      <Suspense fallback={<div className="container" style={{ padding: 40, textAlign: 'center' }}>Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </>
  );
}
