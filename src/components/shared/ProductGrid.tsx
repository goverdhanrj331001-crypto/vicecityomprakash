'use client';
import React, { useState, useEffect } from 'react';
import { ModCard } from '@/components/shared/ModCard';
import type { Mod } from '@/types';

interface ProductGridProps {
  mods: Mod[];
  title?: string;
}

export function ProductGrid({ mods, title }: ProductGridProps) {
  const [columns, setColumns] = useState<1 | 2>(1); // 1 column by default on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="file-list col-md-12">
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: title ? 'space-between' : 'flex-end', 
          alignItems: 'center',
          marginBottom: 16 
        }}
      >
        {title && <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{title} ({mods.length})</h3>}
        
        {mounted && isMobile && (
          <div style={{ display: 'flex', gap: 8, backgroundColor: 'var(--card-bg, #f4f4f5)', padding: 4, borderRadius: 8 }}>
            <button
              onClick={() => setColumns(1)}
              style={{
                background: columns === 1 ? '#dc2626' : 'transparent',
                color: columns === 1 ? '#ffffff' : 'var(--text-main, #64748b)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
              title="Single Column (List View)"
            >
              <i className="fa fa-th-list" /> 
              <span className="hide-on-mobile">List</span>
            </button>
            <button
              onClick={() => setColumns(2)}
              style={{
                background: columns === 2 ? '#dc2626' : 'transparent',
                color: columns === 2 ? '#ffffff' : 'var(--text-main, #64748b)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
              title="Two Column (Grid View)"
            >
              <i className="fa fa-th-large" /> 
              <span className="hide-on-mobile">Grid</span>
            </button>
          </div>
        )}
      </div>

      {mods.length === 0 ? (
        <div 
          style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            backgroundColor: 'var(--card-bg, #ffffff)', 
            borderRadius: 8, 
            border: '1px solid var(--border-color, #e2e8f0)',
            margin: '20px 0',
            color: '#64748b',
          }}
        >
          <i className="fa fa-folder-open-o" style={{ fontSize: 32, marginBottom: 10, display: 'block', color: '#94a3b8' }} />
          <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>No mods found in this section.</p>
        </div>
      ) : (
        <div className="row">
          {mods.map((mod) => {
            // Mobile defaults to columns === 1 (full width col-xs-12) or columns === 2 (half width col-xs-6).
            // Tablet/Desktop always stays multi-column grid layout (col-sm-6 col-md-4 col-lg-3).
            const gridClasses = columns === 1 
              ? 'col-xs-12 col-sm-6 col-md-4 col-lg-3' 
              : 'col-xs-6 col-sm-6 col-md-4 col-lg-3';
            
            return (
              <div key={mod.slug} className={gridClasses}>
                <ModCard mod={mod} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
