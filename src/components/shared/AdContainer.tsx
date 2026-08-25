import React from 'react';

interface AdContainerProps {
  id: string;
}

export function AdContainer({ id }: AdContainerProps) {
  return (
    <div id={id} className="ad-container">
      <span />
    </div>
  );
}
