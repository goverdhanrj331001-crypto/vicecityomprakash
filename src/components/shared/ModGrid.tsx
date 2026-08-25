import React from 'react';
import Link from 'next/link';
import { ModCard } from '@/components/shared/ModCard';
import type { Mod } from '@/types';

interface ModGridProps {
  title: string;
  mods: Mod[];
  seeAllHref: string;
}

export function ModGrid({ title, mods, seeAllHref }: ModGridProps) {
  return (
    <div className="file-list col-md-12">
      <div className="row-heading">
        <h3>{title}</h3>
        <Link href={seeAllHref}>See All</Link>
      </div>

      <div className="row">
        {mods.map((mod) => (
          <div key={mod.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <ModCard mod={mod} />
          </div>
        ))}
      </div>
    </div>
  );
}
