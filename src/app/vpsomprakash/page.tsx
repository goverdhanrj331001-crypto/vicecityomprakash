'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VpsomprakashLegacyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/serveromprakash');
  }, [router]);

  return null;
}
