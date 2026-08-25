'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/serveromprakash');
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff' }}>
      <p style={{ fontSize: 14 }}>Redirecting to secure login...</p>
    </div>
  );
}
