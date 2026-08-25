import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Mod } from '@/types';
import { getModUrl, getUserUrl } from '@/lib/utils';

interface ModCardProps {
  mod: Mod;
}

export function ModCard({ mod }: ModCardProps) {
  const modUrl = getModUrl(mod.category, mod.slug);

  return (
    <div className="file-list-obj">
      <Link href={modUrl} title={mod.title} className="preview">
        <Image
          title={mod.title}
          className="img-responsive mod-card-img"
          alt={mod.title}
          src={mod.coverImage}
          width={320}
          height={180}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          referrerPolicy="no-referrer"
        />

        {mod.subCategories && mod.subCategories.length > 0 && (
          <ul className="categories">
            {mod.subCategories.map((cat) => (
              <li key={cat}>{cat}</li>
            ))}
          </ul>
        )}
      </Link>

      <div className="details">
        <div className="top">
          <div className="name">
            <Link href={modUrl} title={mod.title}>
              <span dir="ltr">{mod.title}</span>
            </Link>
          </div>
        </div>
        <div className="bottom">
          <span className="bottom-by">By</span>{' '}
          <Link href={getUserUrl(mod.author.username)} title={mod.author.username}>
            {mod.author.username}
          </Link>
        </div>
      </div>
    </div>
  );
}
