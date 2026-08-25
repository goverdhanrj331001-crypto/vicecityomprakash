import React from 'react';
import { formatCount } from '@/lib/utils';

interface ModStatsProps {
  downloads: number;
  likes: number;
}

export function ModStats({ downloads, likes }: ModStatsProps) {
  return (
    <h3 className="clearfix" dir="auto">
      <div className="pull-left file-stats">
        <i className="fa fa-cloud-download pull-left download-icon" />
        <div className="file-stat file-downloads pull-left">
          <span className="num-downloads">{formatCount(downloads)}</span>
          <label>Downloads</label>
        </div>
        <i className="fa fa-thumbs-o-up pull-left like-icon" />
        <div className="file-stat file-likes pull-left">
          <span className="num-likes">{formatCount(likes)}</span>
          <label>Likes</label>
        </div>
      </div>
    </h3>
  );
}
