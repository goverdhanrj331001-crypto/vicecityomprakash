'use client';

import React, { useState, useEffect } from 'react';

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide as soon as the component is mounted/hydrated on the client.
    // Bypasses waiting for slow, blocking external scripts to load.
    const timer = setTimeout(() => {
      setVisible(false);
      
      // Clean up DOM styles to ensure legacy scripts don't keep them blocked
      const cover = document.getElementById('page-cover');
      const loader = document.getElementById('page-loading');
      if (cover) cover.style.display = 'none';
      if (loader) loader.style.display = 'none';
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div id="page-cover" />
      <div id="page-loading">
        <span className="graphic" />
        <span className="message">Loading...</span>
      </div>
    </>
  );
}

