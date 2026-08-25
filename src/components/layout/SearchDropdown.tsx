'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchDropdown() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <li id="search-dropdown">
      <a href="#search" className="dropdown-toggle" data-toggle="dropdown">
        <span className="fa fa-search" />
      </a>

      <div className="dropdown-menu">
        <form className="form-inline" onSubmit={handleSearch}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon">
                <span className="fa fa-search" />
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Search GTA 5 mods..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    </li>
  );
}
